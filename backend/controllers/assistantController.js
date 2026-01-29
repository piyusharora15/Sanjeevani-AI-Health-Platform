const axios = require('axios');

const languageMap = {
  'en-IN': 'English', 'hi-IN': 'Hindi', 'pa-IN': 'Punjabi',
  'bn-IN': 'Bengali', 'ta-IN': 'Tamil', 'te-IN': 'Telugu',
  'kn-IN': 'Kannada', 'mr-IN': 'Marathi', 'gu-IN': 'Gujarati',
  'ml-IN': 'Malayalam', 'or-IN': 'Odia', 'bh-IN': 'Bhojpuri'
};

/**
 * @desc    Process user symptoms and provide AI guidance
 * @route   POST /api/assistant/symptoms
 * @access  Private
 */
const processSymptoms = async (req, res) => {
  try {
    const { message, history, language } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!message || !Array.isArray(history) || !language) {
      return res.status(400).json({ message: 'Invalid request: message, history, and language are required.' });
    }

    const MODEL_NAME = "gemini-3-flash-preview";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

    const languageName = languageMap[language] || 'English';

    const systemPrompt = `
      You are "Sanjeevani," an intelligent, conversational AI medical assistant for India.
      Your response MUST be in ${languageName}.
      Return ONLY a single valid JSON object with keys:
      1. "responseText": Your reply in ${languageName}.
      2. "suggestions": 3-4 short follow-up symptom questions (array).
      3. "highlightArea": "head" | "chest" | "abdomen" | "arms" | "legs" | "none".

      Analyze the history to maintain context. If symptoms are severe, strongly recommend a physical visit to a doctor.
    `;

    // Ensure alternating User/Model roles
    const formattedHistory = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const payload = {
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: "Acknowledged. I will respond only in JSON." }] },
        ...formattedHistory,
        { role: 'user', parts: [{ text: message }] }
      ],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json"
      }
    };

    const response = await axios.post(apiUrl, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    const aiResponseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiResponseText) throw new Error("AI returned no content.");

    const jsonMatch = aiResponseText.match(/{[\s\S]*}/);
    const parsedResponse = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponseText);

    res.json(parsedResponse);

  } catch (error) {
    console.error('Assistant Error:', error.message);
    res.status(500).json({ 
      responseText: "I'm having trouble connecting to the medical AI service. Please try again or consult a doctor.",
      suggestions: [],
      highlightArea: "none"
    });
  }
};

module.exports = { processSymptoms };