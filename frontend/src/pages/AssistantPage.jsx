// src/pages/AssistantPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

const AssistantPage = () => {
  // State to hold the conversation messages
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am Sanjeevani, your personal AI health assistant. How are you feeling today? Please describe your symptoms."
    }
  ]);

  // State for the user's current input
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Ref for the end of the messages list to enable auto-scrolling
  const messagesEndRef = useRef(null);

  // Function to scroll to the bottom of the message list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // useEffect to scroll to bottom whenever messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;

    // Add user's message to the conversation
    const userMessage = { sender: 'user', text: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse = {
        sender: 'ai',
        text: "Thank you for sharing. I am analyzing your symptoms. Please note, I am an AI assistant and not a substitute for a real doctor. For serious conditions, please consult a healthcare professional immediately."
      };
      setMessages(prevMessages => [...prevMessages, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto max-w-4xl h-[calc(100vh-200px)] flex flex-col p-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">AI Medical Assistant</h1>
      
      {/* Messages Display Area */}
      <div className="flex-grow bg-white rounded-lg shadow-inner p-6 overflow-y-auto mb-4">
        <div className="flex flex-col space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {/* AI Avatar */}
              {msg.sender === 'ai' && (
                <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white flex-shrink-0">
                  <Bot size={24} />
                </div>
              )}

              {/* Message Bubble */}
              <div className={`max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-400 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                <p>{msg.text}</p>
              </div>

              {/* User Avatar */}
              {msg.sender === 'user' && (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 flex-shrink-0">
                  <User size={24} />
                </div>
              )}
            </div>
          ))}
          {/* Loading indicator for AI response */}
          {isLoading && (
             <div className="flex items-start gap-3 justify-start">
                <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white flex-shrink-0">
                  <Bot size={24} />
                </div>
                <div className="max-w-md p-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
            </div>
          )}
          {/* Empty div to scroll to */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="flex items-center bg-white rounded-lg shadow-md p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your symptoms here..."
          className="flex-grow p-3 border-none focus:ring-0 outline-none bg-transparent"
          autoFocus
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-400 text-white rounded-lg p-3 hover:bg-blue-500 disabled:bg-blue-300 transition-colors"
        >
          <Send size={24} />
        </button>
      </form>
    </div>
  );
};

export default AssistantPage;
