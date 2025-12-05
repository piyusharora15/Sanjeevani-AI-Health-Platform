// controllers/assistantController.js

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
          "Internal configuration error. Please try again later.",
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

OUTPUT FORMAT (VERY IMPORTANT):
- You MUST return ONLY a single valid JSON object.
- NO markdown, NO extra explanation outside JSON, NO backticks.
- The JSON object MUST contain at least these keys:
  - "responseText": string
  - "suggestions": array of 3–4 short follow-up questions as strings
  - "highlightArea": one of: "head", "chest", "abdomen", "arms", "legs", "none"

- You MAY optionally include:
  - "riskLevel": one of "emergency", "urgent", "routine", "self-care"
  - "recommendationType": one of "see-doctor-soon", "emergency-now", "monitor-at-home", "general-info"

TRIAGE LOGIC:
- "emergency" / "emergency-now": symptoms like severe chest pain, difficulty breathing, loss of consciousness, sudden paralysis, heavy bleeding, suspected heart attack or stroke, etc.
- "urgent" / "see-doctor-soon": high fever for several days, moderate chest discomfort, persistent vomiting, severe pain, etc.
- "routine": chronic but non-emergency issues that need doctor review.
- "self-care" / "monitor-at-home": very mild and short-term issues with no red-flag signs.

CONVERSATION STYLE:
- Be calm, empathetic, and clear.
- First, briefly summarize what the user might be experiencing, in simple terms.
- Then, mention possible general causes WITHOUT claiming a final diagnosis.
- Make it explicit that this is not a substitute for a doctor.
- Ask 3–4 follow-up questions that help narrow down severity (duration, intensity, associated symptoms, recent travel, existing illnesses like diabetes/BP, etc.).

BODY AREA HIGHLIGHT:
- Set "highlightArea" to the most relevant area based on user’s symptoms.
  Examples:
    - Headache, dizziness, eye pain → "head"
    - Chest pain, breathing issues → "chest"
    - Stomach pain, nausea → "abdomen"
    - Arm/hand pain, shoulder pain → "arms"
    - Leg/knee/foot pain → "legs"
    - Multiple or unclear areas → "none"

Remember:
- NEVER say that you are giving a diagnosis.
- NEVER say that the user can skip seeing a doctor if symptoms are serious.
        `,
        },
      ],
    };

    // Format history (trim + cap)
    let formattedHistory = Array.isArray(history)
      ? history.map((msg) => ({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text?.toString().slice(0, 1000) || "" }],
        }))
      : [];

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
    const aiResponseText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponseText) {
      throw new Error("AI response was empty.");
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponseText);
    } catch (innerErr) {
      const jsonMatch = aiResponseText.match(/{[\s\S]*}/);
      if (!jsonMatch) {
        throw new Error("AI response did not contain valid JSON.");
      }
      parsedResponse = JSON.parse(jsonMatch[0]);
    }

    if (!parsedResponse || typeof parsedResponse !== "object") {
      throw new Error("Parsed AI response is not a valid JSON object.");
    }

    if (!parsedResponse.responseText || typeof parsedResponse.responseText !== "string") {
      parsedResponse.responseText =
        "मैं आपके लक्षणों को समझने की कोशिश कर रहा हूँ। कृपया नज़दीकी डॉक्टर से सही जाँच और सलाह के लिए मिलें।";
    }

    if (!Array.isArray(parsedResponse.suggestions)) {
      parsedResponse.suggestions = [];
    }

    if (!parsedResponse.highlightArea) {
      parsedResponse.highlightArea = "none";
    }

    const acceptedAreas = ["head", "chest", "abdomen", "arms", "legs", "none"];
    if (!acceptedAreas.includes(parsedResponse.highlightArea)) {
      parsedResponse.highlightArea = "none";
    }

    return res.json(parsedResponse);
  } catch (error) {
    // 🔴 You are currently seeing ONLY the generic message below on frontend.
    //    Let’s surface the real Gemini error to you.
    console.error(
      "Gemini API Error Details:",
      error.response ? JSON.stringify(error.response.data) : error.message
    );

    // Try to extract the Gemini error message if present
    const geminiMessage =
      error.response?.data?.error?.message || error.message || "";

    // In production you might want the generic message,
    // but for now we show the detailed one to debug.
    const debugMessage =
      geminiMessage ||
      "इस समय सिस्टम में तकनीकी समस्या आ रही है। कृपया कुछ देर बाद दोबारा प्रयास करें या सीधे नज़दीकी डॉक्टर से संपर्क करें।";

    return res.status(500).json({
      responseText: debugMessage,
      suggestions: [],
      highlightArea: "none",
    });
  }
};

module.exports = { processSymptoms };