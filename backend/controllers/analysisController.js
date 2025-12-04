// controllers/analysisController.js

const multer = require('multer');
const axios = require('axios');
const Analysis = require('../models/Analysis');

// Store image in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const analyzeDocument = async (req, res) => {
  try {
    // 1. Validation: Check if file exists
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a document image.' });
    }

    // 2. Prepare Data
    const imageBase64 = req.file.buffer.toString('base64');
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Check if API key is loaded
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing in server environment variables.");
    }

    // --- FIX: Using the powerful, stable PRO model ---
    // gemini-1.5-pro is the state-of-the-art model for complex reasoning and vision.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

    const prompt = `
      You are an expert medical data analyst. Analyze this image of a medical document (prescription or lab report).
      
      1. OCR: Extract all text.
      2. Simplify: Explain it in simple terms for a patient.
      
      Return ONLY a valid JSON object with keys: "originalText" and "simplifiedText".
      Example: { "originalText": "...", "simplifiedText": "..." }
      Do not add markdown formatting like \`\`\`json.
    `;

    const payload = {
      contents: [{
        parts: [
          { text: prompt },
          { 
            inline_data: { 
              mime_type: req.file.mimetype, 
              data: imageBase64 
            } 
          },
        ],
      }],
    };

    // 3. Make API Call (with Fix for Large Images)
    const response = await axios.post(apiUrl, payload, {
      headers: { 'Content-Type': 'application/json' },
      maxBodyLength: Infinity, // Allow large image payloads
      maxContentLength: Infinity
    });

    const result = response.data;
    const aiResponseText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponseText) {
      throw new Error("Google AI returned an empty response.");
    }

    // 4. Parse JSON Response
    // Find the JSON object even if there is extra text around it
    const jsonMatch = aiResponseText.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      throw new Error("AI response format was incorrect (No JSON found).");
    }
    const cleanJson = jsonMatch[0];
    const parsedResponse = JSON.parse(cleanJson);

    if (!parsedResponse.originalText || !parsedResponse.simplifiedText) {
      throw new Error("AI response missing required fields.");
    }

    // 5. Save to Database
    const analysis = await Analysis.create({
      user: req.user._id,
      originalText: parsedResponse.originalText,
      simplifiedText: parsedResponse.simplifiedText,
      documentType: 'Prescription',
    });

    res.status(201).json(analysis);

  } catch (error) {
    console.error('Analysis Error:', error.message);
    
    // --- DEBUGGING: Send the REAL error details to the frontend ---
    let errorMessage = 'Failed to analyze document.';
    
    if (error.response) {
      // This is an error from Google (e.g., 400 Bad Request, 403 Forbidden, 429 Quota)
      console.error('Google API Error:', JSON.stringify(error.response.data));
      errorMessage = `Google AI Error: ${error.response.data.error?.message || error.message}`;
    } else if (error.request) {
      errorMessage = 'No response received from Google AI server.';
    } else {
      errorMessage = error.message;
    }

    res.status(500).json({ message: errorMessage });
  }
};

module.exports = {
  analyzeDocument,
  upload,
};