const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// This sets up a GET request to /api/stats/
router.get('/', statsController.getStats);

module.exports = router;