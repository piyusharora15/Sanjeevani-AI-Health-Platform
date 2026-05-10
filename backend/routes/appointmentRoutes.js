import express from 'express';
const router = express.Router();

import { 
  bookAppointment, 
  getMyBookingsAsPatient, 
  getMyBookingsAsDoctor 
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/adminMiddleware.js'; // Assuming 'doctor' check lives here

/**
 * @route   POST /api/appointments
 * @desc    Create a new appointment & initiate payment order
 * @access  Private (Patient)
 */
router.post('/', protect, bookAppointment);

/**
 * @route   GET /api/appointments/mypatient
 * @desc    Get all appointments for the logged-in patient
 * @access  Private (Patient)
 */
router.get('/mypatient', protect, getMyBookingsAsPatient);

/**
 * @route   GET /api/appointments/mydoctor
 * @desc    Get all appointments for the logged-in doctor
 * @access  Private (Doctor)
 */
router.get('/mydoctor', protect, authorize('doctor'), getMyBookingsAsDoctor);

export default router;