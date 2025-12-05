import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Mic,
  MicOff,
  Languages,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getAiResponse } from "../api/assistantApi";
import HumanBody from "../components/assistant/HumanBody";

const AssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! Please select your language, then type or use the microphone to tell me your symptoms.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  const [language, setLanguage] = useState("en-IN");
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedPart, setHighlightedPart] = useState("none");
  const [triageInfo, setTriageInfo] = useState(null); // { riskLevel, recommendationType }
  const [selectedParts, setSelectedParts] = useState([]);

  const { userInfo } = useAuth();
  const messagesEndRef = useRef(null);
  const isInitialMount = useRef(true);
  const recognitionRef = useRef(null);

  const availableLanguages = [
    { code: "en-IN", name: "English" },
    { code: "hi-IN", name: "हिन्दी (Hindi)" },
    { code: "bn-IN", name: "বাংলা (Bengali)" },
    { code: "ta-IN", name: "தமிழ் (Tamil)" },
    { code: "te-IN", name: "తెలుగు (Telugu)" },
    { code: "mr-IN", name: "मराठी (Marathi)" },
    { code: "pa-IN", name: "ਪੰਜਾਬੀ (Punjabi)" },
    { code: "gu-IN", name: "ગુજરાતી (Gujarati)" },
    { code: "kn-IN", name: "ಕನ್ನಡ (Kannada)" },
    { code: "ml-IN", name: "മലയാളം (Malayalam)" },
    { code: "or-IN", name: "ଓଡ଼ିଆ (Odia)" },
    { code: "bh-IN", name: "भोजपुरी (Bhojpuri)" },
  ];

  // Text-to-speech
  const speak = (text) => {
    if (typeof window === "undefined") return;
    if (!window.speechSynthesis) return;
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // Scroll chat on new message
  useEffect(() => {
    if (!messagesEndRef.current) return;
    if (isInitialMount.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
      isInitialMount.current = false;
    } else {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Setup speech recognition when language changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      recognitionRef.current = null;
      return;
    }

    setIsSpeechSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      sendMessage(transcript);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [language]);

  // Risk badge styling
  const getRiskBadge = () => {
    if (!triageInfo || !triageInfo.riskLevel) return null;
    const level = triageInfo.riskLevel;

    let label = "";
    let classes = "";

    switch (level) {
      case "emergency":
        label = "Emergency – seek help immediately";
        classes =
          "bg-red-100 text-red-800 border border-red-300 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold";
        break;
      case "urgent":
        label = "Urgent – see a doctor soon";
        classes =
          "bg-orange-100 text-orange-800 border border-orange-300 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold";
        break;
      case "routine":
        label = "Routine – discuss with your doctor";
        classes =
          "bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold";
        break;
      case "self-care":
        label = "Mild – monitor and self-care";
        classes =
          "bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold";
        break;
      default:
        return null;
    }

    return (
      <div className={classes}>
        <AlertTriangle className="w-4 h-4" />
        <span>{label}</span>
      </div>
    );
  };

  const sendMessage = async (messageText) => {
    const trimmed = messageText.trim();
    if (!trimmed || isLoading) return;

    const newHistory = [...messages, { sender: "user", text: trimmed }];
    setMessages(newHistory);
    setInput("");
    setIsLoading(true);
    setSuggestions([]);
    setTriageInfo(null);

    try {
      const data = await getAiResponse(
        trimmed,
        messages,
        language,
        userInfo?.token
      );

      const aiMessage = {
        sender: "ai",
        text: data.responseText || "I’m analyzing your symptoms.",
      };

      setMessages([...newHistory, aiMessage]);
      setSuggestions(data.suggestions || []);
      setHighlightedPart(data.highlightArea || "none");

      setTriageInfo({
        riskLevel: data.riskLevel || null,
        recommendationType: data.recommendationType || null,
      });

      speak(data.responseText);
    } catch (error) {
      console.error("Assistant error:", error);
      const fallbackText =
        error?.response?.data?.responseText ||
        error?.message ||
        "Something went wrong. Please try again.";
      const errorMessage = { sender: "ai", text: fallbackText };
      setMessages([...newHistory, errorMessage]);
      speak(fallbackText);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const handleBodyClick = (part) => {
    const alreadySelected = selectedParts.includes(part);
    const updatedParts = alreadySelected
      ? selectedParts.filter((p) => p !== part)
      : [...selectedParts, part];

    setSelectedParts(updatedParts);

    if (updatedParts.length === 0) return;

    const labelMap = {
      head: "head",
      chest: "chest / chest area",
      abdomen: "stomach / abdomen",
      arms: "arms / shoulders",
      legs: "legs / lower limbs",
    };

    const labels = updatedParts.map((p) => labelMap[p] || p);
    let areaPhrase = "";
    if (labels.length === 1) {
      areaPhrase = labels[0];
    } else {
      areaPhrase = `${labels.slice(0, -1).join(", ")} and ${
        labels[labels.length - 1]
      }`;
    }

    const userIntent = `I am feeling discomfort in my ${areaPhrase}.`;

    sendMessage(userIntent);
    setSelectedParts([]);
  };

  const toggleListening = () => {
    if (!isSpeechSupported || !recognitionRef.current) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col gap-6 md:flex-row">
        {/* Left Column – Chat */}
        <div className="w-full md:w-2/3 flex flex-col bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-slate-200 p-4 md:p-5">
          {/* Header */}
          <div className="flex justify-between items-start mb-4 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-500 text-white">
                  <Bot size={20} />
                </span>
                Sanjeevani Assistant
              </h1>
              <p className="text-xs md:text-sm text-slate-500 mt-1">
                Describe your symptoms in any supported language. This is not a
                substitute for a real doctor.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Languages className="text-slate-600 w-5 h-5" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg py-1.5 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Risk badge */}
          {getRiskBadge() && (
            <div className="mb-3 flex justify-start">{getRiskBadge()}</div>
          )}

          {/* Chat area */}
          <div className="flex-1 min-h-[280px] max-h-[60vh] bg-slate-50 rounded-xl shadow-inner p-3 md:p-4 overflow-y-auto mb-4">
            <div className="flex flex-col space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "ai" && (
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0">
                      <Bot size={18} />
                    </div>
                  )}

                  <div
                    className={`max-w-md p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-white text-slate-800 rounded-bl-none border border-slate-200"
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 flex-shrink-0">
                      <User size={18} />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0">
                    <Bot size={18} />
                  </div>
                  <div className="max-w-md p-3 rounded-2xl bg-white text-slate-800 rounded-bl-none border border-slate-200">
                    <div className="flex items-center space-x-2">
                      <span className="h-2.5 w-2.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-2.5 w-2.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-2.5 w-2.5 bg-blue-400 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Suggestions & input */}
          <div className="mt-auto">
            <div className="flex flex-wrap gap-2 mb-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSuggestionClick(s)}
                  className="bg-blue-50 text-blue-800 text-xs px-3 py-1.5 rounded-full hover:bg-blue-100 border border-blue-100 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="flex items-center bg-white rounded-xl shadow-md border border-slate-200 p-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your symptoms (e.g., chest pain since 2 days, fever, etc.)..."
                className="flex-grow px-3 py-2 bg-transparent focus:outline-none text-sm placeholder:text-slate-400"
              />

              <button
                type="button"
                onClick={toggleListening}
                disabled={!isSpeechSupported}
                className={`p-2 rounded-full mx-1 transition-colors ${
                  !isSpeechSupported
                    ? "opacity-40 cursor-not-allowed"
                    : isListening
                    ? "bg-red-500 text-white"
                    : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="ml-1 bg-blue-500 text-white rounded-full p-2.5 hover:bg-blue-600 disabled:bg-blue-300 transition-colors flex items-center justify-center"
              >
                <Send size={20} />
              </button>
            </form>

            <div className="mt-2 flex items-start gap-2 text-[11px] text-slate-500">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5" />
              <p>
                Sanjeevani gives preliminary guidance only and does not replace a
                consultation with a qualified doctor. If your symptoms are severe,
                please seek emergency medical help immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column – Human Body visual */}
        <div className="w-full md:w-1/3 flex items-stretch">
          <div className="w-full bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-slate-200 flex flex-col items-center justify-center p-4 md:p-5">
            <h2 className="text-sm font-semibold text-slate-800 mb-2">
              Body Map
            </h2>
            <p className="text-[11px] text-slate-500 mb-3 text-center">
              Tap the region where you feel discomfort. The assistant uses this to
              better understand your symptoms.
            </p>
            <div className="w-full flex-1 flex items-center justify-center">
              <HumanBody
                highlightedPart={highlightedPart}
                riskLevel={triageInfo?.riskLevel}
                selectedParts={selectedParts}
                onPartClick={handleBodyClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantPage;