// controllers/assistantController.js

const fetch = require('node-fetch');

const languageMap = {
  'en-IN': 'English', 'hi-IN': 'Hindi', 'pa-IN': 'Punjabi',
  'bn-IN': 'Bengali', 'ta-IN': 'Tamil', 'te-IN': 'Telugu',
  'kn-IN': 'Kannada', 'mr-IN': 'Marathi',
  'gu-IN': 'Gujarati', 'mar-IN': 'Marathi', 'bh-IN': 'Bhojpuri',
};

const processSymptoms = async (req, res) => {
  console.log('[Backend] Starting processSymptoms...');

  // We are adding robust checks to ensure the request body and its contents are valid before using them.
  if (!req.body || typeof req.body !== 'object') {
    console.error('[Backend] CRITICAL ERROR: Request body is missing or not an object.');
    return res.status(400).json({ message: 'Invalid request format.' });
  }
  
  // Log the entire incoming request body to see exactly what the frontend is sending
  console.log('[Backend] Full request body received:', JSON.stringify(req.body, null, 2));
  
  try {
    const { message, history, language } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    // This validation prevents the "history is not defined" crash.
    if (!message || !Array.isArray(history) || !language) {
      console.error('[Backend] Validation Error: Missing or invalid fields. "history" must be an array.');
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

    const formattedHistory = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const payload = {
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: "Okay, I am ready." }] },
        ...formattedHistory,
        { role: 'user', parts: [{ text: message }] }
      ],
    };
    
    console.log('[Backend] Calling Gemini API...');
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('--- GEMINI API FAILED ---');
      console.error('Status:', response.status);
      console.error('Response Body:', JSON.stringify(errorBody, null, 2));
      console.error('-------------------------');
      throw new Error(`API call failed`);
    }

    const result = await response.json();
    console.log('[Backend] Received successful response from Gemini API.');
    
    const aiResponseText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponseText) {
      console.error('[Backend] AI response was empty or blocked by safety filters.');
      console.error('Full API Response:', JSON.stringify(result, null, 2));
      throw new Error("AI response was empty or blocked.");
    }
    
    const jsonMatch = aiResponseText.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      console.error('[Backend] AI response did not contain a valid JSON object.');
      console.error('Raw AI Text:', aiResponseText);
      throw new Error("AI response was not valid JSON.");
    }
    
    const cleanJsonText = jsonMatch[0];
    const parsedResponse = JSON.parse(cleanJsonText);

    if (!parsedResponse.responseText) {
       throw new Error("AI response was missing the required 'responseText' key.");
    }

    res.json(parsedResponse);

  } catch (error) {
    console.error('[Backend] CRASH in processSymptoms controller:', error.message);
    res.status(500).json({ 
      responseText: "I'm sorry, I'm having trouble right now. Please consult a medical professional for any health concerns.",
      suggestions: [],
      highlightArea: "none"
    });
  }
};

module.exports = { processSymptoms };