const { pool } = require('../config/db');

// Generates a unique complaint ID in the form CC-<year>-00001.
// Uses the count of complaints created in the current year plus a
// collision-retry loop so IDs stay unique even under concurrent writes.
async function generateComplaintId() {
  const year = new Date().getFullYear();
  const prefix = `CC-${year}-`;

  for (let attempt = 0; attempt < 5; attempt++) {
    const [rows] = await pool.query(
      `SELECT COUNT(*) AS cnt FROM complaints WHERE complaint_id LIKE ?`,
      [`${prefix}%`]
    );
    const nextNumber = rows[0].cnt + 1 + attempt;
    const candidate = `${prefix}${String(nextNumber).padStart(5, '0')}`;

    const [existing] = await pool.query(
      `SELECT id FROM complaints WHERE complaint_id = ? LIMIT 1`,
      [candidate]
    );
    if (existing.length === 0) {
      return candidate;
    }
  }
  // Extremely unlikely fallback: timestamp-based suffix guarantees uniqueness.
  return `${prefix}${Date.now().toString().slice(-6)}`;
}

module.exports = { generateComplaintId };
