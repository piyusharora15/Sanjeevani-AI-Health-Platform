import axios from 'axios';

const API_URL = 'https://sanjeevani-api.onrender.com/api/users';

// Function to get the logged-in user's profile
export const getMyProfile = async (token) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const { data } = await axios.get(`${API_URL}/profile/me`, config);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
};