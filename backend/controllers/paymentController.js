const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create a Razorpay order
// @route   POST /api/payment/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { amount } = req.body; // Amount in INR

    const options = {
      amount: amount * 100, // Amount in the smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_order_${new Date().getTime()}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send('Error creating order');
    }

    res.json(order);
  } catch (error) {
    console.error('Error in createOrder:', error);
    res.status(500).send('Server Error');
  }
};

// @desc    Verify a Razorpay payment
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = (req, res) => {
  const { order_id, payment_id, signature } = req.body;

  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(order_id + '|' + payment_id)
    .digest('hex');

  if (generated_signature === signature) {
    res.json({ success: true, message: 'Payment has been verified' });
  } else {
    res.status(400).json({ success: false, message: 'Payment verification failed' });
  }
};

module.exports = { createOrder, verifyPayment };