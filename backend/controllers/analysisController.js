// controllers/analysisController.js

const multer = require('multer');
const axios = require('axios'); // Use axios for reliability
const Analysis = require('../models/Analysis');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const analyzeDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a document image.' });
    }

    const imageBase64 = req.file.buffer.toString('base64');
    const apiKey = process.env.GEMINI_API_KEY;
    // Use the stable 1.5 Flash model
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const prompt = `
      You are an expert medical data analyst. Analyze this image of a medical document (prescription or lab report).
      
      1. OCR: Extract all text.
      2. Simplify: Explain it in simple terms for a patient.
      
      Return ONLY a valid JSON object with keys: "originalText" and "simplifiedText".
      Example: { "originalText": "...", "simplifiedText": "..." }
      Do not add markdown formatting.
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

    const response = await axios.post(apiUrl, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    const result = response.data;
    let aiResponseText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponseText) {
      throw new Error("AI response was empty.");
    }

    // Clean up potential markdown formatting (```json ... ```)
    const jsonMatch = aiResponseText.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      throw new Error("AI response did not contain valid JSON.");
    }
    const cleanJson = jsonMatch[0];

    const parsedResponse = JSON.parse(cleanJson);

    // Validation
    if (!parsedResponse.originalText || !parsedResponse.simplifiedText) {
      throw new Error("AI response missing required fields.");
    }

    const analysis = await Analysis.create({
      user: req.user._id,
      originalText: parsedResponse.originalText,
      simplifiedText: parsedResponse.simplifiedText,
      documentType: 'Prescription',
    });

    res.status(201).json(analysis);

  } catch (error) {
    console.error('Error in analyzeDocument:', error.message);
    // Log detailed API error if available
    if (error.response) {
      console.error('Gemini API Error Details:', JSON.stringify(error.response.data));
    }
    res.status(500).json({ message: 'Failed to analyze document. Please try again.' });
  }
};

module.exports = {
  analyzeDocument,
  upload,
};