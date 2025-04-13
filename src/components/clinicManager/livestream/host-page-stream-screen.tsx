"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import ServiceSection from "./service-section";

// Define CSS animation for floating reactions
const reactionAnimationStyle = `
  @keyframes floatUpAndFade {
    0% { 
      transform: translateY(0);
      opacity: 0;
    }
    10% { 
      transform: translateY(-10px);
      opacity: 1;
    }
    80% { 
      transform: translateY(-80px);
      opacity: 1;
    }
    100% { 
      transform: translateY(-120px);
      opacity: 0;
    }
  }

  .floating-reaction {
    position: absolute;
    bottom: 20px;
    font-size: 2.5rem;
    animation: floatUpAndFade 3s forwards;
    z-index: 50;
    text-shadow: 0 0 5px white;
  }
`;

interface ChatMessage {
  message: string;
  sender?: string;
  timestamp?: string;
}

interface Reaction {
  id: number;
  emoji: string;
  left: number;
  key: string;
}

interface Service {
  id: string;
  name: string;
  description?: string;
  category?: {
    name: string;
  };
  minPrice: number;
  maxPrice: number;
  discountLivePercent: number;
  visible: boolean;
  images?: string[];
}

interface AnalyticsData {
  joinCount: number;
  messageCount: number;
  reactionCount: number;
  totalActivities: number;
  totalBooking: number;
}

interface HostPageStreamScreenProps {
  view: number;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  startPublishing: () => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  isPublish: boolean;
  endLive: () => void;
  chatMessage: ChatMessage[];
  activeReactions: Reaction[];
  setPromotionService: (
    serviceId: string,
    percent: number | string
  ) => Promise<void>;
  services: Service[];
  fetchServices: () => Promise<void>;
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  displayService: (serviceId: string, isDisplay?: boolean) => Promise<void>;
  analyticsData: AnalyticsData;
  getAnalyticsData: () => AnalyticsData;
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
  setPromotionService,
  services,
  fetchServices,
  setServices,
  displayService,
  analyticsData,
  getAnalyticsData,
}: HostPageStreamScreenProps) {
  const [isConfigCollapsed, setIsConfigCollapsed] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("session"); // "session", "products", or "chat"
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Add refs and state for chat scrolling
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [userScrolled, setUserScrolled] = useState<boolean>(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const toggleConfig = () => {
    setIsConfigCollapsed(!isConfigCollapsed);
    setTimeout(() => {
      if (!userScrolled && activeTab === "chat") {
        scrollToBottom();
      }
    }, 300);
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
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

  useEffect(() => {
    if (activeTab === "chat") {
      scrollToBottom();
    }
  }, [activeTab]);

  useEffect(() => {
    if (messagesEndRef.current && !userScrolled && activeTab === "chat") {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessage, activeTab]);

  return (
    <>
      <style>{reactionAnimationStyle}</style>
      <div className="flex h-screen bg-rose-50 overflow-hidden font-sans">
        <div className="w-5/8 h-full flex items-center justify-center bg-black">
          <div className="relative w-full h-full">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-contain rounded-lg pointer-events-none touch-none"
            />
            <div className="absolute top-4 left-4 bg-white bg-opacity-20 backdrop-blur-md text-black px-4 py-2 rounded-full flex items-center shadow-md">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
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
            {!isPublish && (
              <button
                onClick={() => startPublishing()}
                className="absolute top-6 right-0 transform -translate-x-1/2 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-medium px-6 py-3 rounded-full hover:from-rose-500 hover:to-pink-600 transition shadow-lg"
              >
                Start Live
              </button>
            )}
            {isPublish && (
              <button
                onClick={endLive}
                className="absolute top-6 right-0 transform -translate-x-1/2 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-medium px-6 py-3 rounded-full hover:from-rose-500 hover:to-pink-600 transition shadow-lg"
              >
                Stop Livestream
              </button>
            )}
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

        {/* Right side: Tabbed interface taking 3/8 */}
        <div className="w-3/8 h-full flex flex-col bg-white border-l border-rose-100 shadow-md">
          {/* Main Tabbed Interface */}
          <div className="flex flex-col h-full">
            {/* Tab Navigation */}
            <div className="bg-gradient-to-r from-rose-100 to-pink-100 border-b border-rose-100">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setActiveTab("session")}
                    className={`text-lg font-semibold ${
                      activeTab === "session"
                        ? "text-rose-800 border-b-2 border-rose-500"
                        : "text-rose-600 hover:text-rose-700"
                    }`}
                  >
                    ⚙️ Session Settings
                  </button>
                  <button
                    onClick={() => setActiveTab("products")}
                    className={`text-lg font-semibold ${
                      activeTab === "products"
                        ? "text-rose-800 border-b-2 border-rose-500"
                        : "text-rose-600 hover:text-rose-700"
                    }`}
                  >
                    🛍️ Services
                  </button>
                  <button
                    onClick={() => setActiveTab("chat")}
                    className={`text-lg font-semibold ${
                      activeTab === "chat"
                        ? "text-rose-800 border-b-2 border-rose-500"
                        : "text-rose-600 hover:text-rose-700"
                    }`}
                  >
                    💬 Client Questions
                  </button>
                </div>
                <button
                  className="text-rose-800 hover:text-rose-600 transition-colors"
                  onClick={toggleConfig}
                >
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
            </div>

            {/* Tab Content */}
            <div
              className={`flex-1 transition-opacity duration-300 ease-in-out ${
                isConfigCollapsed
                  ? "opacity-0 pointer-events-none"
                  : "opacity-100"
              }`}
              style={{
                height: "100%",
                minHeight: "0px",
                overflow: "hidden",
              }}
            >
              {/* Session Settings Tab */}
              {activeTab === "session" && (
                <div className="p-4 space-y-4 h-full overflow-y-auto">
                  {/* Stream Title */}
                  <div>
                    <label className="block text-sm font-medium text-rose-700 mb-1">
                      Beauty Session Title
                    </label>
                    <input
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
              )}

              {/* Services Tab (formerly Products) */}
              {activeTab === "products" && (
                <ServiceSection
                  services={services}
                  selectedService={selectedService}
                  setSelectedService={setSelectedService}
                  setPromotionService={setPromotionService}
                  displayService={displayService}
                  setServices={setServices}
                />
              )}

              {/* Chat Tab */}
              {activeTab === "chat" && (
                <div className="flex flex-col h-full">
                  {/* Chat Messages */}
                  <div
                    ref={chatContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-4 space-y-3"
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
                        <input
                          type="text"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          className="flex-1 border-rose-300 rounded-lg px-4 py-2 bg-rose-50 focus:ring-rose-500"
                          placeholder="Reply to clients..."
                        />
                        <button
                          type="submit" // This will trigger the form's onSubmit
                          className="ml-2 bg-rose-400 text-white px-4 py-2 rounded-lg hover:bg-rose-500 transition"
                        >
                          ➡️
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
