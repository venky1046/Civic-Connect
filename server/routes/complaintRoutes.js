const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { requireAuth } = require('../middleware/auth');
const { handleComplaintImageUpload } = require('../middleware/upload');

router.get('/categories', complaintController.categories);
router.get('/stats/public', complaintController.publicStats);

router.post('/', requireAuth, handleComplaintImageUpload, complaintController.createComplaint);
router.get('/:complaintId', complaintController.getByComplaintId);
router.post('/:complaintId/support', requireAuth, complaintController.supportComplaint);
router.get('/:complaintId/supporters', complaintController.getSupporters);
router.post('/:complaintId/feedback', requireAuth, complaintController.submitFeedback);

module.exports = router;
