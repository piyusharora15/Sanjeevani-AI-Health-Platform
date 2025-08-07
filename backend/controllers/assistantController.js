const fetch = require('node-fetch');

const processSymptoms = async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  // --- THIS IS THE FIX ---
  // Updated the API URL to use the latest Gemini 2.5 Flash model
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
  // -----------------------
  
  const { message } = req.body;

  // Check if the API key is present in the .env file
  if (!apiKey) {
    console.error('Gemini API key not found in .env file.');
    return res.status(500).json({ message: 'Server configuration error: API key is missing.' });
  }

  if (!message) {
    return res.status(400).json({ message: 'No message provided.' });
  }

  const prompt = `
    You are "Sanjeevani," a friendly and cautious AI medical assistant.
    Your role is to analyze user-described symptoms and provide helpful, safe, and preliminary guidance.
    A user has sent the following message describing their symptoms: "${message}"

    Your task is to:
    1.  Acknowledge the user's symptoms in a compassionate tone.
    2.  Based on the symptoms, provide one of two possible responses:
        a.  If the symptoms seem minor and common (like a simple cold, mild headache, small cut), suggest 1-2 simple and widely-known home remedies.
        b.  If the symptoms sound serious, complex, or could indicate a significant health issue (e.g., chest pain, severe difficulty breathing, high fever for multiple days, signs of a major injury), DO NOT suggest remedies. Instead, strongly and clearly advise the user to consult a doctor immediately.
    3.  **Crucially, you MUST end every response with the following disclaimer, exactly as written:** "Please remember, I am an AI assistant and not a substitute for a real doctor. This is not a medical diagnosis. For any serious or persistent symptoms, please consult a healthcare professional."

    Generate a response that is helpful, safe, and follows these instructions precisely.
  `;

  const payload = {
    contents: [{
      parts: [{ text: prompt }]
    }]
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // This will help us see the exact error from Google's API
      const errorBody = await response.json();
      console.error('Gemini API Error:', JSON.stringify(errorBody, null, 2));
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.candidates && result.candidates.length > 0 && result.candidates[0].content.parts.length > 0) {
      const aiResponseText = result.candidates[0].content.parts[0].text;
      res.json({ reply: aiResponseText });
    } else {
      // This case handles situations where the API returns a 200 OK but with no content, e.g., due to safety filters
      console.warn('Gemini API returned a successful response but with no content.');
      res.json({ reply: "I'm sorry, but I couldn't generate a response for that topic. If you have a health concern, please consult a medical professional." });
    }
  } catch (error) {
    console.error('Error in processSymptoms controller:', error.message);
    res.status(500).json({ message: 'Failed to get a response from the AI assistant.' });
  }
};

module.exports = { processSymptoms };