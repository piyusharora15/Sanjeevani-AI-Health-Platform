const express = require('express');
const router = express.Router();
const { getMyUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // Import our middleware

// When a GET request is made to /profile, it first goes through the `protect` middleware.
// If the token is valid, it proceeds to the `getUserProfile` controller.
router.get('/profile/me', protect, getMyUserProfile);

module.exports = router;