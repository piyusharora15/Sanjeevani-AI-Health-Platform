const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Route to create a new payment order
router.post('/orders', protect, createOrder);

// Route to verify the payment after completion
router.post('/verify', protect, verifyPayment);

module.exports = router;