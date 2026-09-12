const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.use(requireAuth, requireAdmin);

router.get('/dashboard', adminController.dashboard);
router.get('/analytics', adminController.analytics);
router.get('/users', adminController.listUsers);
router.get('/complaints', adminController.listComplaints);
router.get('/complaints/:complaintId', adminController.getComplaintDetail);
router.put('/complaints/:complaintId/status', adminController.updateStatus);

module.exports = router;
