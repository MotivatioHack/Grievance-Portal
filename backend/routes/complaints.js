const express = require('express');
const router = express.Router();
const { addComplaint, getUserComplaints } = require('../controllers/complaintController');
const { auth } = require('../middleware/auth');

router.post('/', auth, addComplaint);
router.get('/:userId', auth, getUserComplaints);

module.exports = router;
