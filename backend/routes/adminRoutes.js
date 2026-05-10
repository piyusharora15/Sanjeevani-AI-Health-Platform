import express from 'express';
const router = express.Router();

import { getAllDoctorsForAdmin, verifyDoctor } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

/**
 * @route   GET /api/admin/doctors
 * @desc    Get all doctors for verification
 * @access  Private/Admin
 */
router.get('/doctors', protect, admin, getAllDoctorsForAdmin);

/**
 * @route   PUT /api/admin/doctors/:id/verify
 * @desc    Verify or Reject a doctor's credentials
 * @access  Private/Admin
 */
router.put('/doctors/:id/verify', protect, admin, verifyDoctor);

export default router;