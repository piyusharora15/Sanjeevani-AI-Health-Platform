import axios from 'axios';

const API_URL = 'http://localhost:5000/api/assistant';

// Function to get a response from the AI assistant
export const getAiResponse = async (message, token) => {
  try {
    // We need to send the token for our protected route
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `${API_URL}/symptoms`,
      { message }, // The message from the user
      config
    );
    
    // The data will be { reply: "..." } from our backend
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'AI Assistant is currently unavailable.');
  }
};