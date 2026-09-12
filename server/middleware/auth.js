const { verifyToken } = require('../utils/jwt');

// Verifies the JWT and attaches the authenticated user's identity to the
// request. All downstream code must use req.user, never a client-supplied
// user id, so a citizen can never impersonate another user or an admin.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required. Please log in.' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = { id: decoded.id, role: decoded.role, name: decoded.name, email: decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'You do not have permission to perform this action.' });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
