"use client";

import type React from "react";

// Thêm kiểu dữ liệu cho props
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage, Reaction } from ".";

interface HostPageStreamScreenProps {
  view: number;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  startPublishing: () => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  isPublish: boolean;
  endLive: () => void;
  chatMessage: ChatMessage[];
  activeReactions: Reaction[];
}

export default function HostPageStreamScreen({
  view,
  localVideoRef,
  startPublishing,
  sendMessage,
  isPublish,
  endLive,
  chatMessage,
  activeReactions,
}: HostPageStreamScreenProps) {
  const [isConfigCollapsed, setIsConfigCollapsed] = useState(false);
  const [text, setText] = useState("");

  // Add refs and state for chat scrolling
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [userScrolled, setUserScrolled] = useState(false);

  const toggleConfig = () => {
    setIsConfigCollapsed(!isConfigCollapsed);
    // After toggling, we need to recalculate scroll position
    setTimeout(() => {
      if (!userScrolled) {
        scrollToBottom();
      }
    }, 300); // Wait for animation to complete
  };

  // Add scroll handling functions
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

  // Scroll to bottom when component mounts
  useEffect(() => {
    scrollToBottom();
  }, []);

  // Auto-scroll to bottom when new messages arrive, but only if user hasn't scrolled up
  useEffect(() => {
    if (messagesEndRef.current && !userScrolled) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessage]); // Only depend on chatMessage to avoid unnecessary scrolls

  return (
    <div className="flex h-screen bg-rose-50 overflow-hidden font-sans">
      {/* Left side: Video taking 5/8 */}
      <div className="w-5/8 h-full flex items-center justify-center bg-black">
        <div className="relative w-full h-full">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-contain rounded-lg pointer-events-none touch-none"
          />
          {/* Viewer count */}
          <div className="absolute top-4 left-4 bg-white bg-opacity-20 backdrop-blur-md text-black px-4 py-2 rounded-full flex items-center shadow-md">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            {view}
          </div>
          {/* Start Livestream Button */}
          {!isPublish && (
            <Button
              onClick={startPublishing}
              className="absolute top-6 right-0 transform -translate-x-1/2 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-medium px-6 py-3 rounded-full hover:from-rose-500 hover:to-pink-600 transition shadow-lg"
            >
              Start Live
            </Button>
          )}
          {isPublish && (
            <Button
              onClick={endLive}
              className="absolute top-6 right-0 transform -translate-x-1/2 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-medium px-6 py-3 rounded-full hover:from-rose-500 hover:to-pink-600 transition shadow-lg"
            >
              Stop Livestream
            </Button>
          )}
          {/* Simplified reaction display */}
          {activeReactions.map((reaction) => (
            <div
              key={reaction.key}
              className="floating-reaction pointer-events-none"
              style={{ left: `${reaction.left}%` }}
            >
              {reaction.emoji}
            </div>
          ))}
        </div>
      </div>

      {/* Right side: Config + Chat taking 3/8 */}
      <div className="w-3/8 h-full flex flex-col bg-white border-l border-rose-100 shadow-md">
        {/* Config Section */}
        <div
          className={`border border-rose-200 rounded-lg shadow-sm m-4 bg-gradient-to-br from-white to-rose-50 transition-all duration-500 ease-in-out ${
            isConfigCollapsed ? "h-[60px]" : "h-[380px]"
          } overflow-hidden`}
        >
          {/* Session Settings Header */}
          <div
            className="bg-gradient-to-r from-rose-100 to-pink-100 px-4 py-3 border-b border-rose-100 flex items-center justify-between cursor-pointer"
            onClick={toggleConfig}
          >
            <div className="text-lg font-semibold text-rose-800 flex items-center">
              ⚙️ Session Settings
            </div>
            <button className="text-rose-800 hover:text-rose-600 transition-colors">
              <svg
                className={`w-5 h-5 transform transition-transform duration-500 ease-in-out ${
                  isConfigCollapsed ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* Config Form */}
          <div
            className={`transition-all duration-500 ease-in-out ${
              isConfigCollapsed
                ? "opacity-0 max-h-0"
                : "opacity-100 p-4 space-y-4"
            }`}
          >
            {/* Stream Title */}
            <div>
              <label className="block text-sm font-medium text-rose-700 mb-1">
                Beauty Session Title
              </label>
              <Input
                type="text"
                className="block w-full border-rose-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-400 px-4 py-2 bg-white"
                placeholder="e.g., Skincare Routine for Sensitive Skin"
              />
            </div>

            {/* Session Privacy */}
            <div>
              <label className="block text-sm font-medium text-rose-700 mb-1">
                Session Privacy
              </label>
              <select className="block w-full border-rose-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-400 px-4 py-2 bg-white">
                <option>Public Session</option>
                <option>Private Session</option>
                <option>VIP Members Only</option>
              </select>
            </div>

            {/* Stream Quality */}
            <div>
              <label className="block text-sm font-medium text-rose-700 mb-1">
                Video Quality
              </label>
              <select className="block w-full border-rose-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-400 px-4 py-2 bg-white">
                <option>HD (720p)</option>
                <option>Full HD (1080p)</option>
                <option>4K</option>
              </select>
            </div>

            {/* Session Category */}
            <div>
              <label className="block text-sm font-medium text-rose-700 mb-1">
                Session Category
              </label>
              <select className="block w-full border-rose-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-400 px-4 py-2 bg-white">
                <option>Skincare Tutorial</option>
                <option>Makeup Masterclass</option>
                <option>Spa Treatment Demo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Chat Section - Using flex-grow to fill remaining space */}
        <div className="flex-grow flex flex-col border border-rose-200 rounded-lg m-4 shadow-sm transition-all duration-500 ease-in-out">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-rose-100 to-pink-100 px-4 py-3 border-b border-rose-200">
            💬 Client Questions
          </div>

          {/* Chat Messages - Add ref and scroll handler with dynamic height */}
          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            style={{
              maxHeight: isConfigCollapsed
                ? "calc(100vh - 220px - 60px)" // When config is collapsed (60px height)
                : "calc(100vh - 220px - 380px)", // When config is expanded (380px height)
            }}
            className="flex-1 overflow-y-auto p-4 space-y-3 transition-all duration-500 ease-in-out"
          >
            {chatMessage.map((item, index) => (
              <div key={index} className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-rose-300 flex items-center justify-center mr-2">
                  🧑
                </div>
                <div className="bg-rose-100 px-4 py-2 rounded-lg">
                  {item.message}
                </div>
              </div>
            ))}
            {/* Add invisible element for scrolling to bottom */}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-rose-200">
            <form
              onSubmit={(e) => {
                e.preventDefault(); // Prevent form submission and page reload
                sendMessage(text);
                setText(""); // Clear the input after sending the message
              }}
            >
              <div className="flex items-center">
                <Input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="flex-1 border-rose-300 rounded-lg px-4 py-2 bg-rose-50 focus:ring-rose-500"
                  placeholder="Reply to clients..."
                />
                <Button
                  type="submit" // This will trigger the form's onSubmit
                  className="ml-2 bg-rose-400 text-white px-4 py-2 rounded-lg hover:bg-rose-500 transition"
                >
                  ➡️
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
