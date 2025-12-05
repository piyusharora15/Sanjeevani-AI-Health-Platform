import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { Send, MessageCircle, ArrowLeft } from "lucide-react";

const BACKEND_URL = "https://sanjeevani-api.onrender.com";

const ChatPage = () => {
  const { appointmentId } = useParams(); // chat room = appointmentId
  const { userInfo } = useAuth();

  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const userName = userInfo?.name || "You";

  // --- Setup socket connection + listeners ---
  useEffect(() => {
    if (!appointmentId) return;

    const socket = io(BACKEND_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      // Join room for this appointment
      socket.emit("join_room", appointmentId);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    const messageListener = (data) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", messageListener);

    // Cleanup on unmount
    return () => {
      socket.off("receive_message", messageListener);
      socket.disconnect();
    };
  }, [appointmentId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  const sendMessage = () => {
    const trimmed = currentMessage.trim();
    if (!trimmed || !socketRef.current || !appointmentId) return;

    const now = new Date();
    const messageData = {
      room: appointmentId,
      author: userName,
      message: trimmed,
      time: now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socketRef.current.emit("send_message", messageData);
    setCurrentMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isOwnMessage = (msg) => msg.author === userName;

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-80px)] py-6">
      <div className="max-w-5xl mx-auto px-4 h-full">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 h-[calc(100vh-120px)] flex flex-col">
          {/* Header */}
          <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* If you have a back route, wrap this in a Link */}
              <button
                type="button"
                onClick={() => window.history.back()}
                className="hidden md:inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-slate-900">
                    Chat with Doctor
                  </h2>
                  <p className="text-xs text-slate-500">
                    Appointment ID: <span className="font-mono">{appointmentId}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  isConnected
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                {isConnected ? "Connected" : "Reconnecting..."}
              </span>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 px-4 md:px-6 py-4 overflow-y-auto bg-slate-50/60">
            {messageList.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 text-sm">
                <p className="font-medium mb-1">
                  No messages yet for this appointment.
                </p>
                <p>
                  Start the conversation by sending a message to your doctor.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {messageList.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      isOwnMessage(msg) ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                        isOwnMessage(msg)
                          ? "bg-blue-500 text-white rounded-br-sm"
                          : "bg-white text-slate-900 border border-slate-200 rounded-bl-sm"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {msg.message}
                      </p>
                      <div
                        className={`mt-1 flex items-center justify-between text-[10px] ${
                          isOwnMessage(msg)
                            ? "text-blue-100/80"
                            : "text-slate-400"
                        }`}
                      >
                        <span>{isOwnMessage(msg) ? "You" : msg.author}</span>
                        <span>{msg.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="px-4 md:px-6 py-3 border-t border-slate-200 bg-white rounded-b-2xl">
            <div className="flex items-end gap-2">
              <textarea
                rows={1}
                value={currentMessage}
                placeholder="Type a message..."
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-grow resize-none max-h-28 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={!currentMessage.trim() || !isConnected}
                className="inline-flex items-center justify-center rounded-xl bg-blue-500 text-white px-3.5 py-2 shadow-sm hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              This chat is for appointment-related discussion only. For
              emergencies, please contact your nearest hospital.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;