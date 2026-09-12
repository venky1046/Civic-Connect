const complaintModel = require('../models/complaintModel');
const userModel = require('../models/userModel');
const { toPublicComplaint } = require('./complaintController');
const { sendMail } = require('../utils/mailer');
const { resolutionEmail } = require('../utils/emailTemplates');

const VALID_STATUSES = ['SUBMITTED', 'UNDER REVIEW', 'ASSIGNED', 'IN PROGRESS', 'RESOLVED'];
const STATUS_ORDER = VALID_STATUSES;

async function listComplaints(req, res, next) {
  try {
    const { category, priority, status, location, search } = req.query;
    const rows = await complaintModel.listAll({ category, priority, status, location, search });
    res.json({ complaints: rows.map((r) => toPublicComplaint(r, { communityCount: r.community_count })) });
  } catch (err) {
    next(err);
  }
}

async function getComplaintDetail(req, res, next) {
  try {
    const complaint = await complaintModel.findByComplaintCode(req.params.complaintId);
    if (!complaint) return res.status(404).json({ message: 'Invalid complaint ID.' });
    const history = await complaintModel.getStatusHistory(complaint.id);
    const supporters = await complaintModel.getSupporters(complaint.id);
    const feedbackStats = await complaintModel.getFeedbackStats(complaint.id);
    res.json({
      complaint: toPublicComplaint(complaint, { communityCount: complaint.community_count }),
      history,
      supporters,
      feedbackStats,
    });
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { complaintId } = req.params;
    const { status, remark, confirmSkip } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const complaint = await complaintModel.findByComplaintCode(complaintId);
    if (!complaint) return res.status(404).json({ message: 'Invalid complaint ID.' });

    const currentIdx = STATUS_ORDER.indexOf(complaint.status);
    const nextIdx = STATUS_ORDER.indexOf(status);

    // Allow forward progression by one step, or backward correction freely,
    // but skipping more than one step forward requires explicit confirmation.
    const isSkippingForward = nextIdx - currentIdx > 1;
    if (isSkippingForward && !confirmSkip) {
      return res.status(409).json({
        message: `This will skip from "${complaint.status}" directly to "${status}". Confirm to proceed.`,
        requiresConfirmation: true,
      });
    }

    await complaintModel.updateStatus(complaint.id, { newStatus: status, adminRemark: remark });
    await complaintModel.addStatusHistory({
      complaintDbId: complaint.id,
      previousStatus: complaint.status,
      newStatus: status,
      remark,
      changedBy: req.user.id,
    });

    if (status === 'RESOLVED') {
      await sendResolutionEmails(complaint.id);
    }

    const updated = await complaintModel.findByDbId(complaint.id);
    res.json({
      message: 'Complaint status updated.',
      complaint: toPublicComplaint(updated, { communityCount: updated.community_count }),
    });
  } catch (err) {
    next(err);
  }
}

async function sendResolutionEmails(complaintDbId) {
  const complaint = await complaintModel.findByDbId(complaintDbId);
  const pendingUsers = await complaintModel.getUsersNotYetEmailedForResolution(complaintDbId);

  for (const user of pendingUsers) {
    const result = await sendMail({
      to: user.email,
      subject: 'Civic Connect - Your Complaint Has Been Resolved',
      html: resolutionEmail({
        userName: user.name,
        complaintId: complaint.complaint_id,
        title: complaint.title,
        location: complaint.location,
        adminRemark: complaint.admin_remark,
      }),
    });
    if (result.sent) {
      await complaintModel.logResolutionEmailSent(complaintDbId, user.id);
    }
  }
  await complaintModel.markResolutionEmailSent(complaintDbId);
}

async function dashboard(req, res, next) {
  try {
    const stats = await complaintModel.getAdminDashboardStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
}

async function analytics(req, res, next) {
  try {
    const data = await complaintModel.getAnalytics();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function listUsers(req, res, next) {
  try {
    const users = await userModel.listAll();
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

module.exports = { listComplaints, getComplaintDetail, updateStatus, dashboard, analytics, listUsers };
