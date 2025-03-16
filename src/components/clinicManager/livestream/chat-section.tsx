"use client";

import type React from "react";
import { useState } from "react";

// Optional interface for chat messages
interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  isHost: boolean;
  avatar: string;
}

export default function ChatSection(): JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "Client",
      message: "What's the best product for dry skin?",
      isHost: false,
      avatar: "🧑",
    },
    {
      id: "2",
      sender: "Host",
      message: "Try using our hydrating serum!",
      isHost: true,
      avatar: "🥰",
    },
  ]);

  const handleSendMessage = (): void => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "Host",
        message: message,
        isHost: true,
        avatar: "🥰",
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex-grow flex flex-col border border-rose-200 rounded-lg m-4 shadow-sm transition-all duration-500 ease-in-out">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-rose-100 to-pink-100 px-4 py-3 border-b border-rose-200">
        💬 Client Questions
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 transition-all duration-500 ease-in-out">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start ${
              msg.isHost ? "justify-end mb-3" : "mb-3"
            }`}
          >
            {!msg.isHost && (
              <div className="w-8 h-8 rounded-full bg-rose-300 flex items-center justify-center mr-2">
                {msg.avatar}
              </div>
            )}
            <div
              className={`${
                msg.isHost ? "bg-rose-400 text-white" : "bg-rose-100"
              } px-4 py-2 rounded-lg`}
            >
              {msg.message}
            </div>
            {msg.isHost && (
              <div className="w-8 h-8 rounded-full bg-rose-500 ml-2 flex items-center justify-center">
                {msg.avatar}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-rose-200">
        <div className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border-rose-300 rounded-lg px-4 py-2 bg-rose-50 focus:ring-rose-500"
            placeholder="Reply to clients..."
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 bg-rose-400 text-white px-4 py-2 rounded-lg hover:bg-rose-500 transition"
          >
            ➡️
          </button>
        </div>
      </div>
    </div>
  );
}
