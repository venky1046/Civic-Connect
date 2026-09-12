const { pool } = require('../config/db');

async function createUser({ name, email, phone, hashedPassword, role = 'citizen' }) {
  const [result] = await pool.query(
    `INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)`,
    [name, email, phone, hashedPassword, role]
  );
  return result.insertId;
}

async function findByEmail(email) {
  const [rows] = await pool.query(`SELECT * FROM users WHERE email = ? LIMIT 1`, [email]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT id, name, email, phone, role, created_at FROM users WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function countAll() {
  const [rows] = await pool.query(`SELECT COUNT(*) AS cnt FROM users WHERE role = 'citizen'`);
  return rows[0].cnt;
}

async function listAll() {
  const [rows] = await pool.query(
    `SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC`
  );
  return rows;
}

module.exports = { createUser, findByEmail, findById, countAll, listAll };
