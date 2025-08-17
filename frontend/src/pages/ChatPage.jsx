import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { Send } from 'lucide-react';

// Connect to the backend server
const socket = io.connect('https://sanjeevani-api.onrender.com');

const ChatPage = () => {
  const { appointmentId } = useParams(); // Get appointment ID from URL
  const { userInfo } = useAuth();
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Join the specific chat room for this appointment
    if (appointmentId) {
      socket.emit('join_room', appointmentId);
    }

    // Listen for incoming messages
    const messageListener = (data) => {
      setMessageList((list) => [...list, data]);
    };
    socket.on('receive_message', messageListener);

    // Clean up the listener when the component unmounts
    return () => socket.off('receive_message', messageListener);
  }, [appointmentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);

  const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageData = {
        room: appointmentId,
        author: userInfo.name,
        message: currentMessage,
        time: new Date(Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      await socket.emit('send_message', messageData);
      setCurrentMessage('');
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="bg-white rounded-lg shadow-lg flex-grow flex flex-col">
        <div className="bg-gray-100 p-4 rounded-t-lg border-b">
          <h2 className="font-bold text-xl">Chat</h2>
        </div>
        <div className="flex-grow p-6 overflow-y-auto">
          <div className="space-y-4">
            {messageList.map((msg, index) => (
              <div key={index} className={`flex ${msg.author === userInfo.name ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-xl max-w-lg ${msg.author === userInfo.name ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  <p>{msg.message}</p>
                  <p className={`text-xs mt-1 ${msg.author === userInfo.name ? 'text-blue-100' : 'text-gray-500'}`}>{msg.author}, {msg.time}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="p-4 border-t bg-gray-50 rounded-b-lg">
          <div className="flex items-center">
            <input
              type="text"
              value={currentMessage}
              placeholder="Type a message..."
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={sendMessage} className="ml-2 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;