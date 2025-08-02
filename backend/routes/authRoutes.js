const express = require('express');
const router = express.Router();
// Import both controller functions
const { registerUser, loginUser } = require('../controllers/authController');

// Define the registration route
router.post('/register', registerUser);

// Define the login route
router.post('/login', loginUser);


module.exports = router;