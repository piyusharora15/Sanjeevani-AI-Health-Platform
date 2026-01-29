const multer = require("multer");
const axios = require("axios");
const Analysis = require("../models/Analysis");

// Store image in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * @desc    Analyze medical documents using Google Gemini Vision AI
 * @route   POST /api/analysis/analyze
 * @access  Private
 */
const analyzeDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a document image." });
    }

    const imageBase64 = req.file.buffer.toString("base64");
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing in server environment variables.");
    }

    const MODEL_NAME = "gemini-3-flash-preview";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

    const prompt = `
      You are an expert medical data analyst for Sanjeevani, a professional healthcare platform. 
      Analyze the provided image of a medical document (prescription or lab report).

      TASK:
      1. OCR: Extract all legible text from the image.
      2. SIMPLIFY: Provide a clean, structured, and professional explanation for a patient.

      STRUCTURE FOR SIMPLIFIED TEXT:
      - Use clear headings like "📋 Medications", "🔬 Lab Results", or "💡 Summary".
      - Use bullet points for lists.
      - Use **bold text** for medication names or critical metrics.
      - If it's a prescription: List **Medication Name**, **Dosage**, **Timing**, and **Purpose**.
      - If it's a lab report: Explain if results are within normal ranges in simple words.

      OUTPUT REQUIREMENT:
      Return ONLY a valid JSON object.
      JSON Schema:
      {
        "originalText": "Raw text...",
        "simplifiedText": "Markdown formatted string..."
      }
    `;

    const payload = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: req.file.mimetype,
                data: imageBase64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json"
      }
    };

    const response = await axios.post(apiUrl, payload, {
      headers: { "Content-Type": "application/json" },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    const aiResponseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponseText) {
      throw new Error("AI returned an empty response.");
    }

    const jsonMatch = aiResponseText.match(/{[\s\S]*}/);
    const parsedResponse = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponseText);

    const analysis = await Analysis.create({
      user: req.user._id,
      originalText: parsedResponse.originalText,
      simplifiedText: parsedResponse.simplifiedText,
      documentType: "Prescription",
    });

    res.status(201).json(analysis);
  } catch (error) {
    console.error("Analysis Error:", error.message);
    res.status(500).json({ message: error.response?.data?.error?.message || error.message });
  }
};

module.exports = { analyzeDocument, upload };