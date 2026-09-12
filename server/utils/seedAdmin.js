/**
 * One-time helper to create the initial Admin account.
 * Usage: node utils/seedAdmin.js "Admin Name" admin@example.com "StrongPass123" "9999999999"
 */
require('dotenv').config();
const bcrypt = require('bcrypt');
const { pool } = require('../config/db');

async function main() {
  const [, , name, email, password, phone] = process.argv;
  if (!name || !email || !password || !phone) {
    console.log(
      'Usage: node utils/seedAdmin.js "Admin Name" admin@example.com "StrongPass123" "9999999999"'
    );
    process.exit(1);
  }

  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    console.log('A user with this email already exists.');
    process.exit(1);
  }

  const hashed = await bcrypt.hash(password, 10);
  await pool.query(
    'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, "admin")',
    [name, email.toLowerCase(), phone, hashed]
  );
  console.log(`Admin account created for ${email}.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
