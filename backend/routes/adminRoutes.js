import express from 'express';
const router = express.Router();
const { getAllDoctorsForAdmin, verifyDoctor } = import('../controllers/adminController');
const { protect } = import('../middleware/authMiddleware');
const { admin } = import('../middleware/adminMiddleware'); // Import admin middleware

// All routes in this file are protected and require admin access.
// The middleware runs in sequence: first 'protect' (checks login), then 'admin' (checks role).
router.get('/doctors', protect, admin, getAllDoctorsForAdmin);
router.put('/doctors/:id/verify', protect, admin, verifyDoctor);

export default router;