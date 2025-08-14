const express = require('express');
const router = express.Router();
const { createOrUpdateDoctorProfile,getAllDoctors,getMyDoctorProfile } = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');

// This route is protected, so the user must be logged in.
// The `protect` middleware will run first, followed by the controller function.
// Route for doctors to create/update their profile (Private)

router.get('/profile/me', protect, getMyDoctorProfile); // Get the logged-in doctor's profile
router.post('/profile', protect, createOrUpdateDoctorProfile);
 // Route for anyone to get a list of all doctors (Public) ---
router.get('/', getAllDoctors);

module.exports = router;