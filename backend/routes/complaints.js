const express = require('express');
const router = express.Router();
const { addComplaint, getUserComplaints } = require('../controllers/complaintController');

router.post('/', addComplaint);
router.get('/:userId', getUserComplaints);

module.exports = router;
