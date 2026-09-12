const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const { signToken } = require('../utils/jwt');
const { validateRegistration, validateLogin } = require('../utils/validators');

async function register(req, res, next) {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;
    const errors = validateRegistration({ name, email, phone, password, confirmPassword });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Please correct the highlighted fields.', errors });
    }

    const existing = await userModel.findByEmail(email.toLowerCase().trim());
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await userModel.createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      hashedPassword,
      role: 'citizen',
    });

    const token = signToken({ id: userId, role: 'citizen', name: name.trim(), email: email.toLowerCase().trim() });
    res.status(201).json({
      message: 'Registration successful.',
      token,
      user: { id: userId, name: name.trim(), email: email.toLowerCase().trim(), phone, role: 'citizen' },
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const errors = validateLogin({ email, password });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Please enter a valid email and password.', errors });
    }

    const user = await userModel.findByEmail(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken({ id: user.id, role: user.role, name: user.name, email: user.email });
    res.json({
      message: 'Login successful.',
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me };
