import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Mic, MicOff, Languages } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getAiResponse } from "../api/assistantApi";
import HumanBody from "../components/assistant/HumanBody";

// --- Web Speech API Setup ---
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
}

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
  const [language, setLanguage] = useState("en-IN");

  const [suggestions, setSuggestions] = useState([]);
  const [highlightedPart, setHighlightedPart] = useState("none");

  const { userInfo } = useAuth();
  const messagesEndRef = useRef(null);
  const isInitialMount = useRef(true);

  const availableLanguages = [
    { code: "en-IN", name: "English" },
    { code: "hi-IN", name: "हिन्दी (Hindi)" },
    { code: "pa-IN", name: "ਪੰਜਾਬੀ (Punjabi)" },
    { code: "bn-IN", name: "বাংলা (Bengali)" },
    { code: "ta-IN", name: "தமிழ் (Tamil)" },
    { code: "te-IN", name: "తెలుగు (Telugu)" },
    { code: "kn-IN", name: "ಕನ್ನಡ (Kannada)" },
    { code: "mr-IN", name: "मरवाड़ी (Marwari)" },
    { code: "gu-IN", name: "ગુજરાતી (Gujarati)" },
    { code: "mar-IN", name: "मराठी (Marathi)" },
    { code: "bh-IN", name: "भोजपुरी (Bhojpuri)" },
  ];

  // --- COMPLETE FUNCTIONS ---
  const speak = (text) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (isInitialMount.current) {
      // On the very first load, scroll instantly to the bottom.
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      isInitialMount.current = false;
    } else {
      // For all new messages, use a smooth scroll.
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!recognition) return;
    recognition.lang = language;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      sendMessage(transcript);
    };
    recognition.onerror = (event) =>
      console.error("Speech recognition error", event.error);
  }, [language]);

  const sendMessage = async (messageText) => {
    if (messageText.trim() === '' || isLoading) return;

    const newHistory = [...messages, { sender: 'user', text: messageText }];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);
    setSuggestions([]); // Clear old suggestions

    try {
      const data = await getAiResponse(messageText, messages, language, userInfo.token);
      const aiResponse = { sender: "ai", text: data.responseText };
      setMessages([...newHistory, aiResponse]);
      setSuggestions(data.suggestions || []);
      setHighlightedPart(data.highlightArea || 'none');
      speak(data.responseText);
    } catch (error) {
      const errorMessage = { sender: "ai", text: error.message };
      setMessages([...newHistory, errorMessage]);
      speak(error.message);
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

  const toggleListening = () => {
    if (isListening) recognition.stop();
    else recognition.start();
  };

  return (
    <div className="flex flex-col md:flex-row bg-slate-100" style={{ height: 'calc(100vh - 80px)' }}> {/* Assuming header is approx 80px tall */}
      {/* Left Column: Chat Interface */}
      <div className="w-full md:w-1/2 lg:w-2/3 flex flex-col p-4 h-full">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-800">Sanjeevani Assistant</h1>
          <div className="flex items-center space-x-2">
            <Languages className="text-gray-600" />
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-white border border-gray-300 rounded-md py-1 px-2">
              {availableLanguages.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
            </select>
          </div>
        </div>
        
        <div className="flex-grow bg-white rounded-lg shadow-inner p-6 overflow-y-auto mb-4">
          <div className="flex flex-col space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'ai' && <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0"><Bot size={24} /></div>}
                <div className={`max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}><p>{msg.text}</p></div>
                {msg.sender === 'user' && <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 flex-shrink-0"><User size={24} /></div>}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0"><Bot size={24} /></div>
                <div className="max-w-md p-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="flex-shrink-0">
          <div className="flex flex-wrap gap-2 mb-2">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => handleSuggestionClick(s)} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full hover:bg-blue-200 transition-colors">{s}</button>
            ))}
          </div>
          <form onSubmit={handleFormSubmit} className="flex items-center bg-white rounded-lg shadow-md p-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Describe your symptoms..." className="flex-grow p-3 bg-transparent focus:outline-none" />
            <button type="button" onClick={toggleListening} className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white' : 'hover:bg-gray-200'}`}><Mic size={24} /></button>
            <button type="submit" disabled={isLoading} className="ml-2 bg-blue-500 text-white rounded-lg p-3 hover:bg-blue-600 disabled:bg-blue-300 transition-colors"><Send size={24} /></button>
          </form>
        </div>
      </div>

      <div className="w-full md:w-1/2 lg:w-1/3 bg-white p-4 flex items-center justify-center">
        <HumanBody highlightedPart={highlightedPart} />
      </div>
    </div>
  );
};

export default AssistantPage;