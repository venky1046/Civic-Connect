const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s()]{7,20}$/;
// At least 8 chars, one letter, one number
const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

function validateRegistration({ name, email, phone, password, confirmPassword }) {
  const errors = {};
  if (!name || !name.trim()) errors.name = 'Full name is required.';
  if (!email || !EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.';
  if (!phone || !PHONE_RE.test(phone)) errors.phone = 'Please enter a valid phone number.';
  if (!password || !PASSWORD_RE.test(password)) {
    errors.password = 'Password must be at least 8 characters and include a letter and a number.';
  }
  if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';
  return errors;
}

function validateLogin({ email, password }) {
  const errors = {};
  if (!email || !EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.';
  if (!password) errors.password = 'Password is required.';
  return errors;
}

module.exports = { validateRegistration, validateLogin, EMAIL_RE, PHONE_RE, PASSWORD_RE };
