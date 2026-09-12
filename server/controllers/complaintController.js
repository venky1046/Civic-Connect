const fs = require('fs');
const path = require('path');
const complaintModel = require('../models/complaintModel');
const { generateComplaintId } = require('../utils/complaintId');
const { calculatePriority } = require('../utils/priority');
const { CATEGORY_LABELS } = require('../config/categories');
const { sendMail, imageAttachment } = require('../utils/mailer');
const {
  adminNewComplaintEmail,
  userSubmissionEmail,
  resolutionEmail,
} = require('../utils/emailTemplates');

function safeUnlink(filePath) {
  if (!filePath) return;
  const full = path.join(__dirname, '..', filePath);
  fs.unlink(full, () => {});
}

function toPublicComplaint(row, extra = {}) {
  if (!row) return null;
  return {
    id: row.id,
    complaintId: row.complaint_id,
    category: row.category,
    title: row.title,
    description: row.description,
    imagePath: row.image_path,
    location: row.location,
    latitude: row.latitude,
    longitude: row.longitude,
    status: row.status,
    priority: row.priority,
    communityCount: row.community_count,
    adminRemark: row.admin_remark,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    reporter: row.reporter_name
      ? { name: row.reporter_name, email: row.reporter_email, phone: row.reporter_phone }
      : undefined,
    ...extra,
  };
}

async function createComplaint(req, res, next) {
  try {
    const { category, title, description, location, latitude, longitude } = req.body;
    const forceSeparate = req.body.forceSeparate === 'true' || req.body.forceSeparate === true;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image of the problem.' });
    }
    const imagePath = `/uploads/${req.file.filename}`;

    if (!category || !CATEGORY_LABELS.includes(category)) {
      safeUnlink(imagePath);
      return res.status(400).json({ message: 'Please select an issue category.' });
    }
    if (!title || !title.trim()) {
      safeUnlink(imagePath);
      return res.status(400).json({ message: 'Please provide an issue title.' });
    }
    if (!description || !description.trim()) {
      safeUnlink(imagePath);
      return res.status(400).json({ message: 'Please describe the problem.' });
    }
    if (!location || !location.trim()) {
      safeUnlink(imagePath);
      return res.status(400).json({ message: 'Please provide the issue location.' });
    }

    const lat = latitude ? Number(latitude) : null;
    const lng = longitude ? Number(longitude) : null;

    if (!forceSeparate) {
      const duplicate = await complaintModel.findPotentialDuplicate({
        category,
        title,
        description,
        location,
        latitude: lat,
        longitude: lng,
      });

      if (duplicate) {
        // Don't create a new row yet - the uploaded image isn't used for a
        // duplicate match, so remove it and let the client decide next.
        safeUnlink(imagePath);
        const communityCount = await complaintModel.getSupporterCount(duplicate.id);
        return res.status(200).json({
          duplicate: true,
          message: 'This issue has already been reported by other citizens.',
          existing: toPublicComplaint(duplicate, { communityCount }),
        });
      }
    }

    const complaintCode = await generateComplaintId();
    const newId = await complaintModel.createComplaint({
      complaintId: complaintCode,
      userId: req.user.id,
      category,
      title: title.trim(),
      description: description.trim(),
      imagePath,
      location: location.trim(),
      latitude: lat,
      longitude: lng,
    });
    await complaintModel.addOriginalReporterAsSupporter(newId, req.user.id);
    await complaintModel.addStatusHistory({
      complaintDbId: newId,
      previousStatus: null,
      newStatus: 'SUBMITTED',
      remark: 'Complaint submitted by citizen.',
      changedBy: req.user.id,
    });

    const created = await complaintModel.findByDbId(newId);
    const dateTime = new Date(created.created_at).toLocaleString('en-IN');

    // Fire-and-forget emails: submission must succeed even if email fails.
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      sendMail({
        to: adminEmail,
        subject: `New Civic Complaint - ${complaintCode}`,
        html: adminNewComplaintEmail({
          complaintId: complaintCode,
          userName: req.user.name,
          userEmail: req.user.email,
          userPhone: created.reporter_phone,
          category,
          title,
          description,
          location,
          dateTime,
          status: 'SUBMITTED',
          communityCount: 1,
          priority: 'LOW',
        }),
        attachments: imageAttachment(imagePath),
      }).catch(() => {});
    }
    sendMail({
      to: req.user.email,
      subject: 'Civic Connect - Complaint Submitted Successfully',
      html: userSubmissionEmail({
        userName: req.user.name,
        complaintId: complaintCode,
        title,
        location,
        dateTime,
        status: 'SUBMITTED',
      }),
    }).catch(() => {});

    res.status(201).json({
      message: 'Complaint submitted successfully.',
      complaint: toPublicComplaint(created, { communityCount: 1 }),
    });
  } catch (err) {
    next(err);
  }
}

async function supportComplaint(req, res, next) {
  try {
    const { complaintId } = req.params;
    const complaint = await complaintModel.findByComplaintCode(complaintId);
    if (!complaint) return res.status(404).json({ message: 'Invalid complaint ID.' });

    const already = await complaintModel.hasUserSupported(complaint.id, req.user.id);
    if (already) {
      return res.status(409).json({ message: 'You have already supported this issue.' });
    }

    await complaintModel.addSupporter(complaint.id, req.user.id);
    const communityCount = await complaintModel.getSupporterCount(complaint.id);
    const priority = calculatePriority(communityCount);
    await complaintModel.updatePriorityAndCount(complaint.id, communityCount, priority);

    const updated = await complaintModel.findByDbId(complaint.id);
    res.json({
      message: 'Thank you for supporting this issue.',
      complaint: toPublicComplaint(updated, { communityCount }),
    });
  } catch (err) {
    next(err);
  }
}

async function getSupporters(req, res, next) {
  try {
    const complaint = await complaintModel.findByComplaintCode(req.params.complaintId);
    if (!complaint) return res.status(404).json({ message: 'Invalid complaint ID.' });
    const supporters = await complaintModel.getSupporters(complaint.id);
    res.json({ supporters, count: supporters.length });
  } catch (err) {
    next(err);
  }
}

async function getByComplaintId(req, res, next) {
  try {
    const complaint = await complaintModel.findByComplaintCode(req.params.complaintId);
    if (!complaint) return res.status(404).json({ message: 'Invalid complaint ID.' });
    const history = await complaintModel.getStatusHistory(complaint.id);
    const feedbackStats = await complaintModel.getFeedbackStats(complaint.id);
    res.json({
      complaint: toPublicComplaint(complaint, { communityCount: complaint.community_count }),
      history,
      feedbackStats,
    });
  } catch (err) {
    next(err);
  }
}

async function myComplaints(req, res, next) {
  try {
    const rows = await complaintModel.listByUser(req.user.id);
    res.json({ complaints: rows.map((r) => toPublicComplaint(r, { communityCount: r.community_count })) });
  } catch (err) {
    next(err);
  }
}

async function submitFeedback(req, res, next) {
  try {
    const { complaintId } = req.params;
    const { feedback } = req.body; // 'YES' | 'NO'
    if (!['YES', 'NO'].includes(feedback)) {
      return res.status(400).json({ message: 'Feedback must be YES or NO.' });
    }
    const complaint = await complaintModel.findByComplaintCode(complaintId);
    if (!complaint) return res.status(404).json({ message: 'Invalid complaint ID.' });
    if (complaint.status !== 'RESOLVED') {
      return res.status(400).json({ message: 'Feedback can only be submitted for resolved issues.' });
    }
    await complaintModel.addFeedback(complaint.id, req.user.id, feedback);
    const stats = await complaintModel.getFeedbackStats(complaint.id);
    res.json({ message: 'Thank you for your feedback.', feedbackStats: stats });
  } catch (err) {
    next(err);
  }
}

async function publicStats(req, res, next) {
  try {
    const stats = await complaintModel.getPublicStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
}

async function categories(req, res) {
  const { CATEGORIES } = require('../config/categories');
  res.json({ categories: CATEGORIES });
}

module.exports = {
  createComplaint,
  supportComplaint,
  getSupporters,
  getByComplaintId,
  myComplaints,
  submitFeedback,
  publicStats,
  categories,
  toPublicComplaint,
};
