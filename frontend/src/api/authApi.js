import axios from 'axios';
const API_URL = 'https://sanjeevani-api.onrender.com/api/auth';

export const loginUser = async (email, password) => {
  try {
    const { data } = await axios.post(`${API_URL}/login`, { email, password });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const registerUser = async (userData) => {
  try {
    const { data } = await axios.post(`${API_URL}/register`, userData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const forgotPassword = async (emailData) => {
  try {
    const { data } = await axios.post(`${API_URL}/forgot-password`, emailData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const resetPassword = async (token, password) => {
  try {
    const { data } = await axios.post(`${API_URL}/reset-password/${token}`, { password });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};