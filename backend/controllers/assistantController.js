const axios = require('axios');

const languageMap = {
  'en-IN': 'English',
  'hi-IN': 'Hindi',
  'bn-IN': 'Bengali',
  'te-IN': 'Telugu',
  'mr-IN': 'Marathi',
  'ta-IN': 'Tamil',
  'ur-IN': 'Urdu',
  'gu-IN': 'Gujarati',
  'kn-IN': 'Kannada',
  'ml-IN': 'Malayalam',
  'or-IN': 'Odia',
  'pa-IN': 'Punjabi',
  'as-IN': 'Assamese',
  'mai-IN': 'Maithili',
  'sat-IN': 'Santali',
  'ks-IN': 'Kashmiri',
  'ne-IN': 'Nepali',
  'kok-IN': 'Konkani',
  'sd-IN': 'Sindhi',
  'doi-IN': 'Dogri',
  'mni-IN': 'Manipuri',
  'brx-IN': 'Bodo',
  'sa-IN': 'Sanskrit',
  'bh-IN': 'Bhojpuri'
};

const processSymptoms = async (req, res) => {
  try {
    const { message, history, language } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    
    // --- USING STABLE MODEL ---
    // gemini-1.5-flash is the current standard, fast, and stable model.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    if (!message || !Array.isArray(history) || !language) {
      return res.status(400).json({ message: 'Message, history, and language are required.' });
    }

    const languageName = languageMap[language] || 'English';

    // We simulate a system prompt by adding it as the first user message
    const systemPrompt = `
      You are "Sanjeevani," an intelligent, conversational AI medical assistant.
      Your entire response MUST be in ${languageName}.
      Your response MUST be a single, valid JSON object, with no extra text or markdown.
      The JSON object must have three keys: "responseText", "suggestions", and "highlightArea".
      
      1. "responseText": (String) Your conversational reply.
      2. "suggestions": (Array of strings) 3-4 relevant follow-up questions.
      3. "highlightArea": (String) One of: "head", "chest", "abdomen", "arms", "legs", or "none".
    `;

    // Construct the conversation history for the API
    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: "Understood. I am ready." }] },
      ...history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await axios.post(apiUrl, { contents }, {
      headers: { 'Content-Type': 'application/json' },
    });

    const result = response.data;
    const aiResponseText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponseText) {
      throw new Error("AI response was empty.");
    }
    
    // Extract JSON from the response (handling potential markdown blocks)
    const jsonMatch = aiResponseText.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      throw new Error("AI response did not contain valid JSON.");
    }
    
    const parsedResponse = JSON.parse(jsonMatch[0]);

    // Validate required fields
    if (!parsedResponse.responseText) {
       parsedResponse.responseText = "I am analyzing your symptoms. Please consult a doctor for a proper diagnosis.";
    }

    res.json(parsedResponse);

  } catch (error) {
    // Log the detailed error from Google if available
    console.error('Gemini API Error Details:', error.response ? JSON.stringify(error.response.data) : error.message);
    
    res.status(500).json({ 
      responseText: "I'm having trouble connecting to the AI service right now. Please try again later.",
      suggestions: [],
      highlightArea: "none"
    });
  }
};

module.exports = { processSymptoms };