const express = require('express');
const router = express.Router();
const { processSymptoms } = require('../controllers/assistantController');
const { protect } = require('../middleware/authMiddleware');

// This is a protected route. A user must be logged in to access it.
// The `protect` middleware will run first to verify the user's token.
router.post('/symptoms', protect, processSymptoms);

module.exports = router;