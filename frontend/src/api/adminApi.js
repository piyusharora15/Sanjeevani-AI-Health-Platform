import axios from 'axios';

const API_URL = 'https://sanjeevani-api.onrender.com/api/admin';

// Function to get all doctors for the admin panel
export const getAllDoctorsForAdmin = async (token) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const { data } = await axios.get(`${API_URL}/doctors`, config);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch doctors');
  }
};

// Function to verify a doctor
export const verifyDoctor = async (doctorId, token) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    // The body is empty because we are just changing a status
    const { data } = await axios.put(`${API_URL}/doctors/${doctorId}/verify`, {}, config);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to verify doctor');
  }
};