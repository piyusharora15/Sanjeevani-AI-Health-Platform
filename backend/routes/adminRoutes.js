const express = require('express');
const router = express.Router();
const { getAllDoctorsForAdmin, verifyDoctor } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware'); // Import admin middleware

// All routes in this file are protected and require admin access.
// The middleware runs in sequence: first 'protect' (checks login), then 'admin' (checks role).
router.get('/doctors', protect, admin, getAllDoctorsForAdmin);
router.put('/doctors/:id/verify', protect, admin, verifyDoctor);

module.exports = router;