import axios from 'axios';

const API_URL = 'https://sanjeevani-api.onrender.com/api/analysis';

// Function to upload a document and get the analysis
export const analyzeDocument = async (file, token) => {
  try {
    // We need to send the file as FormData because it's a multipart/form-data request
    const formData = new FormData();
    formData.append('document', file); // 'document' must match the field name in our backend multer setup

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(`${API_URL}/analyze`, formData, config);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to analyze document');
  }
};