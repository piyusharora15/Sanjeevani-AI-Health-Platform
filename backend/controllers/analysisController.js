const multer = require('multer');
const fetch = require('node-fetch');
const Analysis = require('../models/Analysis');

// --- Multer Configuration ---
// We'll store the image in memory as a buffer, which is efficient for this use case.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// --- Main Controller Logic ---
// @desc    Analyze an uploaded medical document
// @route   POST /api/analysis/analyze
// @access  Private
const analyzeDocument = async (req, res) => {
  try {
    // 1. Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a document image.' });
    }

    // 2. Prepare the image data for the Gemini API
    // The Gemini Vision model needs the image as a base64-encoded string.
    const imageBase64 = req.file.buffer.toString('base64');
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    // 3. Create a powerful prompt for the AI
    const prompt = `
      Analyze the image of a medical document. Your task is to extract all text and provide a simple explanation.
      Your response MUST be a single, valid JSON object and nothing else. Do not include any introductory text, explanations, or markdown formatting like \`\`\`json.
      The JSON object must have exactly two keys: "originalText" and "simplifiedText".

      - "originalText": A string containing all text extracted from the image.
      - "simplifiedText": A string containing a simple explanation of the document for a patient. For prescriptions, list medications, purpose, and dosage. For lab reports, explain key metrics.

      Example of a valid response:
      {
        "originalText": "CROCIN 500mg - 1 tablet twice a day",
        "simplifiedText": "Medicine: CROCIN 500mg\\nPurpose: For fever and pain\\nDosage: Take one tablet two times a day."
      }
    `;

    const payload = {
      contents: [{
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: req.file.mimetype,
              data: imageBase64,
            },
          },
        ],
      }],
    };

    // 4. Call the Gemini API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Gemini API Error:', JSON.stringify(errorBody, null, 2));
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const result = await response.json();
    let aiResponseText = result.candidates[0].content.parts[0].text;

    // Use a regular expression to find the JSON block within the AI's response.
    // This makes our code resilient to extra text or markdown formatting.
    const jsonMatch = aiResponseText.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      // If no JSON is found at all, throw an error.
      throw new Error("AI response did not contain a valid JSON object.");
    }
    aiResponseText = jsonMatch[0];

    // 5. Parse the JSON response from the AI
    const parsedResponse = JSON.parse(aiResponseText);

    // --- ADDED VALIDATION CHECK ---
    // Before saving, ensure both required fields exist in the AI's response.
    if (!parsedResponse.originalText || !parsedResponse.simplifiedText) {
      console.error("AI response was missing required JSON keys:", parsedResponse);
      throw new Error("AI failed to provide a complete analysis. Please try again.");
    }

    // 6. Save the analysis to our database
    const analysis = await Analysis.create({
      user: req.user._id,
      originalText: parsedResponse.originalText,
      simplifiedText: parsedResponse.simplifiedText,
      documentType: 'Prescription', // We can enhance this later
    });

    // 7. Send the simplified explanation back to the frontend
    res.status(201).json(analysis);

  } catch (error) {
    console.error('Error in analyzeDocument:', error);
    // A specific check for JSON parsing errors from the AI's response
    if (error instanceof SyntaxError) {
      return res.status(500).json({ message: 'AI response was not in the expected format. Please try again.' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  analyzeDocument,
  upload, // Export the multer middleware
};