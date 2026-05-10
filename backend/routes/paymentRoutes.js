import express from 'express';
const router = express.Router();
const { createOrder, verifyPayment } = import('../controllers/paymentController');
const { protect } = import('../middleware/authMiddleware');

// Route to create a new payment order
router.post('/orders', protect, createOrder);

// Route to verify the payment after completion
router.post('/verify', protect, verifyPayment);

export default router;