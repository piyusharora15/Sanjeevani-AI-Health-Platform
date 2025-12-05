// backend/controllers/assistantController.js

const axios = require("axios");

const languageMap = {
  "en-IN": "English",
  "hi-IN": "Hindi",
  "pa-IN": "Punjabi",
  "bn-IN": "Bengali",
  "te-IN": "Telugu",
  "mr-IN": "Marathi",
  "ta-IN": "Tamil",
  "ur-IN": "Urdu",
  "gu-IN": "Gujarati",
  "kn-IN": "Kannada",
  "ml-IN": "Malayalam",
  "or-IN": "Odia",
  "as-IN": "Assamese",
  "mai-IN": "Maithili",
  "sat-IN": "Santali",
  "ks-IN": "Kashmiri",
  "ne-IN": "Nepali",
  "kok-IN": "Konkani",
  "sd-IN": "Sindhi",
  "doi-IN": "Dogri",
  "mni-IN": "Manipuri",
  "brx-IN": "Bodo",
  "sa-IN": "Sanskrit",
  "bh-IN": "Bhojpuri",
};

const processSymptoms = async (req, res) => {
  try {
    const { message, history, language } = req.body;

    if (!message || !Array.isArray(history) || !language) {
      return res
        .status(400)
        .json({ message: "Message, history, and language are required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing in environment.");
      return res.status(500).json({
        responseText:
          "System configuration error. Please try again later or contact support.",
        suggestions: [],
        highlightArea: "none",
      });
    }

    const MODEL_NAME = "gemini-2.5-flash";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

    const languageName = languageMap[language] || "English";

    const systemInstruction = {
      parts: [
        {
          text: `
You are "Sanjeevani", an intelligent, conversational AI medical assistant for patients in India.

CRITICAL RULES (FOLLOW STRICTLY):
- You are NOT a doctor. You MUST NOT give a final diagnosis.
- You MUST NOT prescribe any medicines, dosages, or treatments by name.
- You ONLY provide general information and preliminary guidance based on symptoms.
- You MUST always recommend consulting a qualified doctor for any serious or unclear issue.
- If there are emergency or "red flag" symptoms, you MUST clearly tell the user to seek urgent medical care or call local emergency services.

LANGUAGE:
- Your entire response (responseText + suggestions) MUST be in ${languageName}.
- Medical terms can be mentioned in simple language plus their common English names if needed.

OUTPUT FORMAT:
- You MUST return ONLY a single valid JSON object.
- NO markdown, NO backticks.
- JSON MUST contain:
  - "responseText": string
  - "suggestions": string[]
  - "highlightArea": "head" | "chest" | "abdomen" | "arms" | "legs" | "none"
- You MAY also include:
  - "riskLevel": "emergency" | "urgent" | "routine" | "self-care"
  - "recommendationType": "see-doctor-soon" | "emergency-now" | "monitor-at-home" | "general-info"
        `,
        },
      ],
    };

    // ---- Format history ----
    let formattedHistory = Array.isArray(history)
      ? history.map((msg) => ({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text?.toString().slice(0, 1000) || "" }],
        }))
      : [];

    // Ensure conversation starts with a user message
    while (formattedHistory.length > 0 && formattedHistory[0].role === "model") {
      formattedHistory.shift();
    }

    const MAX_HISTORY_MESSAGES = 12;
    if (formattedHistory.length > MAX_HISTORY_MESSAGES) {
      formattedHistory = formattedHistory.slice(-MAX_HISTORY_MESSAGES);
    }

    const payload = {
      system_instruction: systemInstruction,
      contents: [
        ...formattedHistory,
        {
          role: "user",
          parts: [{ text: message.toString().slice(0, 1500) }],
        },
      ],
      generationConfig: {
        temperature: 0.6,
        topK: 32,
        topP: 0.8,
        maxOutputTokens: 512,
      },
    };

    const response = await axios.post(apiUrl, payload, {
      headers: { "Content-Type": "application/json" },
    });

    const result = response.data;

    // 1) Collect ALL text parts (Gemini may split across parts)
    const parts = result?.candidates?.[0]?.content?.parts || [];
    const allText = parts
      .map((p) => (typeof p.text === "string" ? p.text : ""))
      .join("\n\n")
      .trim();

    // If Gemini gave nothing (e.g. blocked for safety), handle gracefully
    if (!allText) {
      console.error(
        "Gemini returned empty or blocked response. Full payload:",
        JSON.stringify(result, null, 2)
      );

      return res.status(200).json({
        responseText:
          "इस समय मैं आपके लिए उत्तर तैयार नहीं कर पाया। कृपया अपने लक्षणों को थोड़ा अलग तरीके से लिखकर दोबारा कोशिश करें या नज़दीकी डॉक्टर से संपर्क करें।",
        suggestions: [],
        highlightArea: "none",
        riskLevel: null,
        recommendationType: null,
      });
    }

    console.log("AI raw response text:\n", allText);

    // 2) Robust JSON parsing helper
    const tryParseJsonFromText = (text) => {
      if (!text) return null;
      let raw = text.trim();

      // Remove markdown fences if present
      raw = raw
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      // First try whole string
      try {
        return JSON.parse(raw);
      } catch (_) {
        // ignore
      }

      // Then try to extract a {...} block
      const jsonMatch = raw.match(/{[\s\S]*}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (_) {
          // ignore
        }
      }

      return null;
    };

    let parsedResponse = tryParseJsonFromText(allText);

    // If still no JSON, don't crash – just wrap text nicely
    if (!parsedResponse) {
      console.warn(
        "Could not parse AI response as JSON. Falling back to plain text."
      );

      return res.status(200).json({
        responseText: allText.slice(0, 800),
        suggestions: [],
        highlightArea: "none",
        riskLevel: null,
        recommendationType: null,
      });
    }

    // 3) Validate & normalize fields
    if (
      !parsedResponse.responseText ||
      typeof parsedResponse.responseText !== "string"
    ) {
      parsedResponse.responseText =
        "मैं आपके लक्षणों को समझने की कोशिश कर रहा हूँ। कृपया नज़दीकी डॉक्टर से सही जाँच और सलाह के लिए मिलें।";
    }

    if (!Array.isArray(parsedResponse.suggestions)) {
      parsedResponse.suggestions = [];
    }

    const acceptedAreas = ["head", "chest", "abdomen", "arms", "legs", "none"];
    if (
      !parsedResponse.highlightArea ||
      !acceptedAreas.includes(parsedResponse.highlightArea)
    ) {
      parsedResponse.highlightArea = "none";
    }

    return res.status(200).json(parsedResponse);
  } catch (error) {
    console.error(
      "Gemini API Error Details:",
      error.response ? JSON.stringify(error.response.data) : error.message
    );

    // For the user, keep it generic and safe.
    const userFacingMessage =
      "इस समय सिस्टम में तकनीकी समस्या आ रही है। कृपया कुछ देर बाद दोबारा प्रयास करें या सीधे नज़दीकी डॉक्टर से संपर्क करें।";

    return res.status(500).json({
      responseText: userFacingMessage,
      suggestions: [],
      highlightArea: "none",
    });
  }
};

module.exports = { processSymptoms };