const express = require('express');
const router = express.Router();
// Correctly import all required controller functions and middleware
const { createComplaint, getUserComplaints, getComplaintById } = require('../controllers/complaintController');
const { optionalAuth } = require('../middleware/authMiddleware');

// The optionalAuth middleware runs first to check for a logged-in user,
// then the createComplaint function handles the submission.
router.post('/', optionalAuth, createComplaint);

// This route is for fetching all complaints for a specific user.
// The route is made more specific to avoid conflicts.
router.get('/user/:userId', getUserComplaints);

// --- ADDED ROUTE ---
// This route is for fetching a single complaint by its public ID for the tracking page.
router.get('/:complaintId', getComplaintById);

module.exports = router;
