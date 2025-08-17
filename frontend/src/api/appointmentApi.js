import axios from 'axios';

const API_URL = 'https://sanjeevani-api.onrender.com/api/appointments';

// Function to book a new appointment
export const bookAppointment = async (appointmentData, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(API_URL, appointmentData, config);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to book appointment');
  }
};

// Get patient's own bookings ---
export const getMyPatientBookings = async (token) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(`${API_URL}/mypatient`, config);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch appointments');
  }
};

// Get doctor's own bookings ---
export const getMyDoctorBookings = async (token) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(`${API_URL}/mydoctor`, config);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch appointments');
  }
};