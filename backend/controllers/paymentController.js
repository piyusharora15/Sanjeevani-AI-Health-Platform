import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

// 1. Ensure env variables are loaded for this module
dotenv.config();

/**
 * Lazy Initialization Helper
 * This prevents the "key_id is mandatory" error by ensuring 
 * env variables are loaded before the class is instantiated.
 */
let razorpayInstance = null;
const getRazorpay = () => {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials missing in .env file');
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

/**
 * @desc    Create a Razorpay order
 * @route   POST /api/payment/orders
 * @access  Private
 */
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body; 

    const options = {
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: 'Error creating payment order' });
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Error in createOrder:', error.message);
    res.status(500).json({ message: 'Payment gateway initialization failed' });
  }
};

/**
 * @desc    Verify a Razorpay payment
 * @route   POST /api/payment/verify
 * @access  Private
 */
export const verifyPayment = async (req, res) => {
  try {
    const { order_id, payment_id, signature } = req.body;

    if (!order_id || !payment_id || !signature) {
      return res.status(400).json({ message: 'Missing payment verification details' });
    }

    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(order_id + '|' + payment_id)
      .digest('hex');

    if (generated_signature === signature) {
      res.status(200).json({ success: true, message: 'Payment has been verified' });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed: Signature mismatch' });
    }
  } catch (error) {
    console.error('Error in verifyPayment:', error.message);
    res.status(500).json({ message: 'Internal server error during verification' });
  }
};