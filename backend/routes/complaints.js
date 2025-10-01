const express = require('express');
const router = express.Router();
// Correctly import the controller function and middleware
const { createComplaint, getUserComplaints } = require('../controllers/complaintController');
const { optionalAuth } = require('../middleware/authMiddleware');

// The optionalAuth middleware runs first to check for a logged-in user,
// then the createComplaint function handles the submission.
router.post('/', optionalAuth, createComplaint);

// This route remains for fetching complaints for a specific user.
router.get('/:userId', getUserComplaints);

module.exports = router;

