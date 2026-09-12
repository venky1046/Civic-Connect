const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { requireAuth } = require('../middleware/auth');

router.get('/complaints', requireAuth, complaintController.myComplaints);

module.exports = router;
