const express = require('express');
const router = express.Router();
const { getAllComplaints, updateComplaintStatus } = require('../controllers/adminController');

router.get('/complaints', getAllComplaints);
router.put('/complaints/:id', updateComplaintStatus);

module.exports = router;
