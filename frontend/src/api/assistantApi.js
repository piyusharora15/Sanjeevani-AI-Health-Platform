import axios from 'axios';

const API_URL = 'https://sanjeevani-api.onrender.com/api/assistant';

// Function to get a response from the AI assistant
export const getAiResponse = async (message, history, language, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const payload = { message, history, language };
    const { data } = await axios.post(`${API_URL}/symptoms`, payload, config);
    return data; // This will be the full JSON object { responseText, suggestions, highlightArea }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'AI Assistant is currently unavailable.');
  }
};