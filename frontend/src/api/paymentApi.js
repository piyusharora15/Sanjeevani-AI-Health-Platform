import axios from 'axios';

const API_URL = 'https://sanjeevani-api.onrender.com/api/payment';

// Function to create a Razorpay payment order
export const createPaymentOrder = async (amount, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.post(`${API_URL}/orders`, { amount }, config);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create payment order');
  }
};

// Function to verify the payment
export const verifyPayment = async (paymentData, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.post(`${API_URL}/verify`, paymentData, config);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Payment verification failed');
  }
};