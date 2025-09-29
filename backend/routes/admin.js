const express = require('express');
const router = express.Router();
const { getAllComplaints, updateComplaintStatus } = require('../controllers/adminController');
const { auth, requireAdmin } = require('../middleware/auth');

router.use(auth);
router.get('/complaints', requireAdmin, getAllComplaints);
router.put('/complaints/:id', requireAdmin, updateComplaintStatus);

module.exports = router;
