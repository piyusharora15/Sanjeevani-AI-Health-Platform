import axios from 'axios';

// The base URL for our backend API
const API_URL = 'http://localhost:5000/api/auth';

// Login user function
export const loginUser = async (email, password) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      `${API_URL}/login`,
      { email, password },
      config
    );
    
    // The data returned from our backend (user info + token)
    return data;
  } catch (error) {
    // Throw an error with the message from the backend, or a generic message
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

// Register user function
export const registerUser = async (userData) => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };
    // Pass the whole userData object (name, email, password, role)
    const { data } = await axios.post(`${API_URL}/register`, userData, config);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};