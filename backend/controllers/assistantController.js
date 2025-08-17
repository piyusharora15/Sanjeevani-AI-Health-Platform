const axios = require('axios'); 
const Analysis = require('../models/Analysis');

const languageMap = {
  'en-IN': 'English', 'hi-IN': 'Hindi', 'pa-IN': 'Punjabi',
  'bn-IN': 'Bengali', 'ta-IN': 'Tamil', 'te-IN': 'Telugu',
  'kn-IN': 'Kannada', 'mr-IN': 'Marathi',
  'gu-IN': 'Gujarati', 'mar-IN': 'Marathi', 'bh-IN': 'Bhojpuri',
};

const processSymptoms = async (req, res) => {
  try {
    const { message, history, language } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    if (!message || !Array.isArray(history) || !language) {
      return res.status(400).json({ message: 'Message, history, and language are required.' });
    }

    const languageName = languageMap[language] || 'English';

    const systemPrompt = `
      You are "Sanjeevani," an intelligent, conversational AI medical assistant.
      Your entire response MUST be in ${languageName}.
      Your response MUST be a single, valid JSON object, with no extra text or markdown.
      The JSON object must have three keys: "responseText", "suggestions", and "highlightArea".
      - "responseText": (String) Your conversational reply.
      - "suggestions": (Array of strings) 3-4 relevant follow-up questions. Can be empty.
      - "highlightArea": (String) One of: "head", "chest", "abdomen", "arms", "legs", or "none".
      Analyze the conversation history to maintain context.
    `;

    const payload = {
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: "Okay, I am ready." }] },
        ...history.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        })),
        { role: 'user', parts: [{ text: message }] }
      ],
    };

    const response = await axios.post(apiUrl, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    const result = response.data;
    
    const aiResponseText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponseText) {
      console.warn('Gemini API returned a response with no valid content.', result);
      throw new Error("AI response was empty or blocked.");
    }
    
    const jsonMatch = aiResponseText.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      throw new Error("AI response did not contain a valid JSON object.");
    }
    const cleanJsonText = jsonMatch[0];
    
    const parsedResponse = JSON.parse(cleanJsonText);

    if (!parsedResponse.responseText) {
       throw new Error("AI response was missing the required 'responseText' key.");
    }

    res.json(parsedResponse);

  } catch (error) {
    console.error('Error in processSymptoms controller:', error.response ? error.response.data : error.message);
    res.status(500).json({ 
      responseText: "I'm sorry, I'm having trouble right now. Please consult a medical professional for any health concerns.",
      suggestions: [],
      highlightArea: "none"
    });
  }
};

module.exports = { processSymptoms };