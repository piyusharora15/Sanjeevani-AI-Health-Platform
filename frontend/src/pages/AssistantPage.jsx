import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Import useAuth to get user token
import { getAiResponse } from '../api/assistantApi'; // Import our new API function

// --- Web Speech API Setup (remains the same) ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-IN';
  recognition.interimResults = false;
}

const AssistantPage = () => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! I am Sanjeevani, your personal AI health assistant. You can type or use the microphone to tell me your symptoms." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const { userInfo } = useAuth(); // Get user info from context
  const messagesEndRef = useRef(null);

  const speak = (text) => {
    if (isMuted || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!recognition) return;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSendMessage(null, transcript);
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
  }, []);

  // --- UPDATED handleSendMessage function ---
  const handleSendMessage = async (e, textFromSpeech = '') => {
    if (e) e.preventDefault();
    const messageText = textFromSpeech || input;
    if (messageText.trim() === '' || isLoading) return;

    const userMessage = { sender: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call the backend API with the user's message and token
      const data = await getAiResponse(messageText, userInfo.token);
      
      const aiResponse = { sender: 'ai', text: data.reply };
      setMessages(prev => [...prev, aiResponse]);
      speak(data.reply); // Speak the real AI response

    } catch (error) {
      // If the API call fails, show an error message in the chat
      const errorMessage = { sender: 'ai', text: error.message };
      setMessages(prev => [...prev, errorMessage]);
      speak(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (!recognition) {
        alert("Sorry, your browser does not support speech recognition.");
        return;
    }
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  // The JSX part of the component remains exactly the same
  return (
    <div className="container mx-auto max-w-4xl h-[calc(100vh-200px)] flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">AI Medical Assistant</h1>
        <button onClick={() => setIsMuted(!isMuted)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
          {isMuted ? <VolumeX className="text-gray-600"/> : <Volume2 className="text-blue-500"/>}
        </button>
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

      <form onSubmit={handleSendMessage} className="flex items-center bg-white rounded-lg shadow-md p-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type or use the mic to speak..." className="flex-grow p-3 border-none focus:ring-0 outline-none bg-transparent" autoFocus />
        <button type="button" onClick={toggleListening} className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        <button type="submit" disabled={isLoading} className="ml-2 bg-blue-500 text-white rounded-lg p-3 hover:bg-blue-600 disabled:bg-blue-300 transition-colors">
          <Send size={24} />
        </button>
      </form>
    </div>
  );
};

export default AssistantPage;