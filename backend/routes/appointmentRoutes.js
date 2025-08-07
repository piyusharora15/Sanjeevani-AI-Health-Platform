const express = require('express');
const router = express.Router();
const { bookAppointment } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

// This route is protected. A user must be logged in to book an appointment.
// The `protect` middleware will run first to verify the user and attach their info to `req.user`.
router.post('/', protect, bookAppointment);

module.exports = router;