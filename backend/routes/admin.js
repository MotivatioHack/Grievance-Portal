const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminOnly } = require('../middleware/authMiddleware');

// This route gets all complaints for the main list. It is now protected.
router.get('/complaints', adminOnly, adminController.getAllComplaints);

// This route gets the summary data for the dashboard cards. It is now protected.
router.get('/stats', adminOnly, adminController.getDashboardStats);

// This route handles updating a complaint's status. It is now protected.
router.put('/complaints/:id/status', adminOnly, adminController.updateComplaintStatus);

module.exports = router;