// backend/routes/log.js

const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

// This route will handle POST requests to /api/log/not-found
router.post('/not-found', logController.logNotFound);

module.exports = router;