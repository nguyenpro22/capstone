"use client";

import { useRef, useEffect, useState } from "react";
import type { ChatMessage as ChatMessageType } from "../livestream";
import { ChatMessageItem } from "./chat-message";
import { ChatInput } from "./chat-input";

interface ChatContainerProps {
  messages: ChatMessageType[];
  onSendMessage: (message: string) => void;
  isHost?: boolean;
  title?: string;
}

export function ChatContainer({
  messages,
  onSendMessage,
  isHost = false,
  title = "Client Questions",
}: ChatContainerProps) {
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [userScrolled, setUserScrolled] = useState(false);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      // Check if user has scrolled up a significant amount
      if (scrollHeight - scrollTop - clientHeight > 50) {
        setUserScrolled(true);
      } else {
        setUserScrolled(false);
      }
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setUserScrolled(false);
    }
  };

  // Always scroll to bottom when the component mounts
  useEffect(() => {
    scrollToBottom();
  }, []);

  // Only auto-scroll if the user hasn't manually scrolled up
  useEffect(() => {
    if (messagesEndRef.current && !userScrolled) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, userScrolled]);

  return (
    <div className="flex flex-col h-full border border-rose-200 rounded-lg shadow-sm">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-rose-100 to-pink-100 px-4 py-3 border-b border-rose-200">
        💬 {title}
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[calc(100vh-220px)]"
      >
        {messages.map((message, index) => (
          <ChatMessageItem key={index} message={message} isHost={isHost} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-rose-200">
        <ChatInput
          onSendMessage={onSendMessage}
          placeholder={isHost ? "Reply to clients..." : "Ask a question..."}
        />
      </div>
    </div>
  );
}
