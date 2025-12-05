// frontend/src/api/doctorApi.js
import axios from "axios";

const API_URL = "https://sanjeevani-api.onrender.com/api/doctors";

// Function to create or update a doctor's profile
export const createOrUpdateProfile = async (profileData, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(`${API_URL}/profile`, profileData, config);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update profile"
    );
  }
};

// Function to get all doctors' profiles (public)
export const getAllDoctors = async (filters = {}) => {
  try {
    const { data } = await axios.get(API_URL, { params: filters });
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch doctors"
    );
  }
};

// Function to get the logged-in doctor's own profile
export const getMyProfile = async (token) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const { data } = await axios.get(`${API_URL}/profile/me`, config);
    return data;           // existing profile object
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // No profile yet → return null so frontend can show empty form
      return null;
    }
    throw new Error(
      error.response?.data?.message || "Failed to fetch profile"
    );
  }
};