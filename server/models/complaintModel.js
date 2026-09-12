const { pool } = require('../config/db');
const { distanceInMeters, textSimilarity } = require('../utils/geo');

const RADIUS = Number(process.env.DUPLICATE_RADIUS_METERS) || 150;

const BASE_SELECT = `
  SELECT c.*, u.name AS reporter_name, u.email AS reporter_email, u.phone AS reporter_phone
  FROM complaints c
  JOIN users u ON u.id = c.user_id
`;

/**
 * Finds an existing open (not resolved) complaint that likely represents the
 * same real-world issue as the one being submitted, based on:
 *  - same category
 *  - geographic proximity (if both have coordinates), OR
 *  - similar location text / title-description overlap otherwise
 * Returns the best matching complaint row, or null.
 */
async function findPotentialDuplicate({ category, title, description, location, latitude, longitude }) {
  const [candidates] = await pool.query(
    `SELECT * FROM complaints WHERE category = ? AND status != 'RESOLVED' ORDER BY created_at DESC LIMIT 200`,
    [category]
  );

  let best = null;
  let bestScore = 0;

  for (const cand of candidates) {
    let matched = false;
    let score = 0;

    if (latitude != null && longitude != null && cand.latitude != null && cand.longitude != null) {
      const dist = distanceInMeters(
        Number(latitude),
        Number(longitude),
        Number(cand.latitude),
        Number(cand.longitude)
      );
      if (dist <= RADIUS) {
        matched = true;
        score = 1 - dist / RADIUS; // closer = higher score
      }
    }

    if (!matched) {
      const locSim =
        cand.location && location
          ? textSimilarity(cand.location, location)
          : 0;
      const contentSim = textSimilarity(
        `${cand.title} ${cand.description}`,
        `${title} ${description}`
      );
      // Require fairly strong textual overlap when we have no coordinates.
      if (locSim >= 0.5 || contentSim >= 0.4) {
        matched = true;
        score = Math.max(locSim, contentSim);
      }
    }

    if (matched && score > bestScore) {
      bestScore = score;
      best = cand;
    }
  }

  return best;
}

async function createComplaint({
  complaintId,
  userId,
  category,
  title,
  description,
  imagePath,
  location,
  latitude,
  longitude,
}) {
  const [result] = await pool.query(
    `INSERT INTO complaints
      (complaint_id, user_id, category, title, description, image_path, location, latitude, longitude, status, priority, community_count)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'SUBMITTED', 'LOW', 1)`,
    [complaintId, userId, category, title, description, imagePath, location, latitude ?? null, longitude ?? null]
  );
  return result.insertId;
}

async function addOriginalReporterAsSupporter(complaintDbId, userId) {
  await pool.query(
    `INSERT IGNORE INTO complaint_supporters (complaint_id, user_id) VALUES (?, ?)`,
    [complaintDbId, userId]
  );
}

async function findByComplaintCode(complaintId) {
  const [rows] = await pool.query(`${BASE_SELECT} WHERE c.complaint_id = ? LIMIT 1`, [complaintId]);
  return rows[0] || null;
}

async function findByDbId(id) {
  const [rows] = await pool.query(`${BASE_SELECT} WHERE c.id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function hasUserSupported(complaintDbId, userId) {
  const [rows] = await pool.query(
    `SELECT id FROM complaint_supporters WHERE complaint_id = ? AND user_id = ? LIMIT 1`,
    [complaintDbId, userId]
  );
  return rows.length > 0;
}

async function addSupporter(complaintDbId, userId) {
  await pool.query(
    `INSERT INTO complaint_supporters (complaint_id, user_id) VALUES (?, ?)`,
    [complaintDbId, userId]
  );
}

async function getSupporterCount(complaintDbId) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS cnt FROM complaint_supporters WHERE complaint_id = ?`,
    [complaintDbId]
  );
  return rows[0].cnt;
}

async function getSupporters(complaintDbId) {
  const [rows] = await pool.query(
    `SELECT u.id, u.name, u.email FROM complaint_supporters cs
     JOIN users u ON u.id = cs.user_id WHERE cs.complaint_id = ?`,
    [complaintDbId]
  );
  return rows;
}

async function updatePriorityAndCount(complaintDbId, communityCount, priority) {
  await pool.query(
    `UPDATE complaints SET community_count = ?, priority = ? WHERE id = ?`,
    [communityCount, priority, complaintDbId]
  );
}

async function updateStatus(complaintDbId, { newStatus, adminRemark }) {
  const fields = ['status = ?'];
  const params = [newStatus];
  if (adminRemark !== undefined) {
    fields.push('admin_remark = ?');
    params.push(adminRemark);
  }
  params.push(complaintDbId);
  await pool.query(`UPDATE complaints SET ${fields.join(', ')} WHERE id = ?`, params);
}

async function markResolutionEmailSent(complaintDbId) {
  await pool.query(`UPDATE complaints SET resolution_email_sent = 1 WHERE id = ?`, [complaintDbId]);
}

async function listByUser(userId) {
  const [rows] = await pool.query(
    `${BASE_SELECT} WHERE c.user_id = ? ORDER BY c.created_at DESC`,
    [userId]
  );
  return rows;
}

async function listAll({ category, priority, status, location, search } = {}) {
  let sql = `${BASE_SELECT} WHERE 1=1`;
  const params = [];
  if (category) {
    sql += ` AND c.category = ?`;
    params.push(category);
  }
  if (priority) {
    sql += ` AND c.priority = ?`;
    params.push(priority);
  }
  if (status) {
    sql += ` AND c.status = ?`;
    params.push(status);
  }
  if (location) {
    sql += ` AND c.location LIKE ?`;
    params.push(`%${location}%`);
  }
  if (search) {
    sql += ` AND (c.complaint_id LIKE ? OR c.title LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }
  sql += ` ORDER BY c.created_at DESC`;
  const [rows] = await pool.query(sql, params);
  return rows;
}

async function addStatusHistory({ complaintDbId, previousStatus, newStatus, remark, changedBy }) {
  await pool.query(
    `INSERT INTO complaint_status_history (complaint_id, previous_status, new_status, remark, changed_by)
     VALUES (?, ?, ?, ?, ?)`,
    [complaintDbId, previousStatus, newStatus, remark || null, changedBy]
  );
}

async function getStatusHistory(complaintDbId) {
  const [rows] = await pool.query(
    `SELECT h.*, u.name AS changed_by_name FROM complaint_status_history h
     JOIN users u ON u.id = h.changed_by
     WHERE h.complaint_id = ? ORDER BY h.created_at ASC`,
    [complaintDbId]
  );
  return rows;
}

async function addFeedback(complaintDbId, userId, feedback) {
  await pool.query(
    `INSERT INTO complaint_feedback (complaint_id, user_id, feedback) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE feedback = VALUES(feedback)`,
    [complaintDbId, userId, feedback]
  );
}

async function getFeedbackStats(complaintDbId) {
  const [rows] = await pool.query(
    `SELECT feedback, COUNT(*) AS cnt FROM complaint_feedback WHERE complaint_id = ? GROUP BY feedback`,
    [complaintDbId]
  );
  const stats = { YES: 0, NO: 0 };
  rows.forEach((r) => (stats[r.feedback] = r.cnt));
  return stats;
}

async function getAllUsersForComplaint(complaintDbId) {
  // Original reporter + all supporters, de-duplicated, for resolution emails.
  const [rows] = await pool.query(
    `SELECT DISTINCT u.id, u.name, u.email FROM users u
     WHERE u.id = (SELECT user_id FROM complaints WHERE id = ?)
     OR u.id IN (SELECT user_id FROM complaint_supporters WHERE complaint_id = ?)`,
    [complaintDbId, complaintDbId]
  );
  return rows;
}

async function getUsersNotYetEmailedForResolution(complaintDbId) {
  const [rows] = await pool.query(
    `SELECT DISTINCT u.id, u.name, u.email FROM users u
      WHERE (u.id = (SELECT user_id FROM complaints WHERE id = ?)
             OR u.id IN (SELECT user_id FROM complaint_supporters WHERE complaint_id = ?))
        AND u.id NOT IN (SELECT user_id FROM resolution_email_log WHERE complaint_id = ?)`,
    [complaintDbId, complaintDbId, complaintDbId]
  );
  return rows;
}

async function logResolutionEmailSent(complaintDbId, userId) {
  await pool.query(
    `INSERT IGNORE INTO resolution_email_log (complaint_id, user_id) VALUES (?, ?)`,
    [complaintDbId, userId]
  );
}

// ---------- Dashboard / analytics aggregates ----------

async function getPublicStats() {
  const [[totals]] = await pool.query(
    `SELECT COUNT(*) AS totalReports,
            SUM(status = 'RESOLVED') AS resolved,
            SUM(status != 'RESOLVED') AS active
     FROM complaints`
  );
  const [[citizens]] = await pool.query(`SELECT COUNT(*) AS cnt FROM users WHERE role = 'citizen'`);
  return {
    totalReports: totals.totalReports || 0,
    resolved: Number(totals.resolved) || 0,
    active: Number(totals.active) || 0,
    citizens: citizens.cnt || 0,
  };
}

async function getAdminDashboardStats() {
  const [[totals]] = await pool.query(
    `SELECT
        COUNT(*) AS total,
        SUM(status = 'SUBMITTED') AS pending,
        SUM(status IN ('UNDER REVIEW','ASSIGNED','IN PROGRESS')) AS inProgress,
        SUM(status = 'RESOLVED') AS resolved,
        SUM(priority = 'CRITICAL') AS critical
     FROM complaints`
  );
  const [[citizens]] = await pool.query(`SELECT COUNT(*) AS cnt FROM users WHERE role = 'citizen'`);
  return {
    total: totals.total || 0,
    pending: Number(totals.pending) || 0,
    inProgress: Number(totals.inProgress) || 0,
    resolved: Number(totals.resolved) || 0,
    critical: Number(totals.critical) || 0,
    citizens: citizens.cnt || 0,
  };
}

async function getAnalytics() {
  const [byCategory] = await pool.query(
    `SELECT category, COUNT(*) AS count FROM complaints GROUP BY category ORDER BY count DESC`
  );
  const [byStatus] = await pool.query(
    `SELECT status, COUNT(*) AS count FROM complaints GROUP BY status`
  );
  const [byPriority] = await pool.query(
    `SELECT priority, COUNT(*) AS count FROM complaints GROUP BY priority`
  );
  const [byLocation] = await pool.query(
    `SELECT location, COUNT(*) AS count FROM complaints GROUP BY location ORDER BY count DESC LIMIT 10`
  );
  const [mostReported] = await pool.query(
    `SELECT complaint_id, title, category, community_count FROM complaints
     ORDER BY community_count DESC LIMIT 10`
  );
  return { byCategory, byStatus, byPriority, byLocation, mostReported };
}

module.exports = {
  findPotentialDuplicate,
  createComplaint,
  addOriginalReporterAsSupporter,
  findByComplaintCode,
  findByDbId,
  hasUserSupported,
  addSupporter,
  getSupporterCount,
  getSupporters,
  updatePriorityAndCount,
  updateStatus,
  markResolutionEmailSent,
  listByUser,
  listAll,
  addStatusHistory,
  getStatusHistory,
  addFeedback,
  getFeedbackStats,
  getAllUsersForComplaint,
  getUsersNotYetEmailedForResolution,
  logResolutionEmailSent,
  getPublicStats,
  getAdminDashboardStats,
  getAnalytics,
};
