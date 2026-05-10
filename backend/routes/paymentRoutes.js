import express from 'express';
const router = express.Router();
import { createOrder, verifyPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

// Route to create a new payment order
router.post('/orders', protect, createOrder);

// Route to verify the payment after completion
router.post('/verify', protect, verifyPayment);

export default router;