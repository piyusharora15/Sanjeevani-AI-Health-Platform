import axios from "axios";

// Prefer env var, fall back to your Render URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://sanjeevani-api.onrender.com";

// If your backend route is:
//   app.use("/api/assistant", assistantRoutes);
//   router.post("/symptoms", protect, processSymptoms);
// then this is correct:
const ASSISTANT_URL = `${API_BASE_URL}/api/assistant/symptoms`;

// Function to get a response from the AI assistant
export const getAiResponse = async (message, history, language, token) => {
  try {
    const payload = { message, history, language };

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}), // only send if present
      },
      withCredentials: false,
    };

    const { data } = await axios.post(ASSISTANT_URL, payload, config);
    // data should be: { responseText, suggestions, highlightArea, riskLevel?, recommendationType? }
    return data;
  } catch (error) {
    console.error(
      "getAiResponse error:",
      error.response?.data || error.message
    );

    // Try to surface the most helpful message from backend
    const serverText =
      error.response?.data?.responseText || // our backend returns this in error cases
      error.response?.data?.message || // typical error pattern
      error.message;

    throw new Error(
      serverText ||
        "AI Assistant is currently unavailable. Please try again later."
    );
  }
};