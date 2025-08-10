const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  forgotPassword, 
  resetPassword 
} = require('../controllers/authController');

// Existing routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// --- NEW PASSWORD RESET ROUTES ---
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword); // The token is a URL parameter


module.exports = router;