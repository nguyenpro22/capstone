"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";

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

interface RoomData {
  name: string;
  description: string;
  image: string;
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
  const [promotionValue, setPromotionValue] = useState<number>(0);

  // Add refs and state for chat scrolling
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [userScrolled, setUserScrolled] = useState<boolean>(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const toggleConfig = () => {
    setIsConfigCollapsed(!isConfigCollapsed);
    // After toggling, we need to recalculate scroll position
    setTimeout(() => {
      if (!userScrolled && activeTab === "chat") {
        scrollToBottom();
      }
    }, 300); // Wait for animation to complete
  };

  // Thay thế toàn bộ hàm handleCheckboxClick bằng phiên bản mới này
  const handleCheckboxClick = (e: React.MouseEvent, serviceId: string) => {
    // Ngăn sự kiện lan truyền và hành vi mặc định
    e.stopPropagation();

    console.log(`Checkbox clicked for service ${serviceId}`);

    // Tìm service trong danh sách
    const serviceIndex = services.findIndex((s) => s.id === serviceId);
    if (serviceIndex === -1) {
      console.error(`Service with ID ${serviceId} not found`);
      return;
    }

    // Lấy service hiện tại
    const service = services[serviceIndex];

    // Đảo ngược trạng thái visible
    const newVisibility = !service.visible;
    console.log(
      `Toggling service ${serviceId} visibility from ${service.visible} to ${newVisibility}`
    );

    // Cập nhật UI trước
    const updatedServices = [...services];
    updatedServices[serviceIndex] = {
      ...service,
      visible: newVisibility,
    };
    setServices(updatedServices);

    // Cập nhật selectedService nếu cần
    if (selectedService && selectedService.id === serviceId) {
      setSelectedService({
        ...selectedService,
        visible: newVisibility,
      });
    }

    // Gọi API để cập nhật trên server
    displayService(serviceId, newVisibility).catch((error) => {
      console.error(`Failed to update service ${serviceId} visibility:`, error);

      // Nếu có lỗi, khôi phục trạng thái cũ
      const revertedServices = [...services];
      revertedServices[serviceIndex] = {
        ...service,
        visible: service.visible, // Trạng thái ban đầu
      };
      setServices(revertedServices);

      // Cập nhật lại selectedService nếu cần
      if (selectedService && selectedService.id === serviceId) {
        setSelectedService({
          ...selectedService,
          visible: service.visible,
        });
      }

      // Hiển thị thông báo lỗi
      alert(`Failed to update service visibility. Please try again.`);
    });
  };

  const selectService = (service: Service) => {
    setSelectedService(service);
    setPromotionValue(service.discountLivePercent || 0);
  };

  const savePromotion = () => {
    if (selectedService) {
      setSelectedService({
        ...selectedService,
        discountLivePercent: promotionValue,
      });
      setPromotionService(selectedService.id, promotionValue);
    }
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

  // Scroll to bottom when component mounts or when switching to chat tab
  useEffect(() => {
    if (activeTab === "chat") {
      scrollToBottom();
    }
  }, [activeTab]);

  // Auto-scroll to bottom when new messages arrive, but only if user hasn't scrolled up
  useEffect(() => {
    if (messagesEndRef.current && !userScrolled && activeTab === "chat") {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessage, activeTab]); // Depend on chatMessage and activeTab

  // Helper function to get service image or placeholder
  const getServiceImage = (service: Service) => {
    if (service.images && service.images.length > 0) {
      return service.images[0];
    }

    // Return placeholder based on category
    const categoryName = service.category?.name?.toLowerCase() || "";
    if (categoryName.includes("facial")) return "✨";
    if (categoryName.includes("massage")) return "💆";
    if (categoryName.includes("hair")) return "💇";
    if (categoryName.includes("nail")) return "💅";
    return "🧖";
  };

  // Helper function to format price range in Vietnamese currency
  const formatPriceRange = (service: Service) => {
    const formatVND = (price: number) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }).format(price);
    };

    if (service.minPrice === service.maxPrice) {
      return formatVND(service.minPrice);
    }
    return `${formatVND(service.minPrice)} - ${formatVND(service.maxPrice)}`;
  };

  return (
    <>
      {/* Add the CSS animation style */}
      <style>{reactionAnimationStyle}</style>
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
              className={`flex-1 transition-all duration-500 ease-in-out overflow-hidden ${
                isConfigCollapsed ? "h-0 opacity-0" : "opacity-100"
              }`}
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
                <div className="p-4 space-y-4 h-full overflow-y-auto">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-rose-800 font-medium">
                      Dịch vụ trong hệ thống
                    </h3>
                    <span className="text-xs text-rose-600 bg-rose-100 px-2 py-1 rounded-full">
                      {services.length} Services
                    </span>
                  </div>

                  {/* Services List - Increased height to 550px */}
                  <div className="max-h-[550px] overflow-y-auto border border-rose-200 rounded-lg bg-white mb-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className={`flex items-center p-3 border-b border-rose-100 last:border-b-0 hover:bg-rose-50 cursor-pointer ${
                          selectedService && selectedService.id === service.id
                            ? "bg-rose-100"
                            : ""
                        }`}
                        onClick={() => selectService(service)}
                      >
                        <div className="flex items-center flex-1">
                          {/* Checkbox với xử lý sự kiện mới */}
                          <div
                            className="mr-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={service.visible}
                                onChange={() => {}} // Để tránh warning về controlled component
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCheckboxClick(e, service.id);
                                }}
                                className="rounded border-rose-300 text-rose-500 cursor-pointer"
                              />
                            </div>
                          </div>

                          {service.images && service.images.length > 0 ? (
                            <div className="w-10 h-10 rounded-md overflow-hidden mr-3 bg-gray-100 flex items-center justify-center">
                              <img
                                src={service.images[0] || "/placeholder.svg"}
                                alt={service.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = `https://placehold.co/40x40.png`;
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-md bg-rose-100 flex items-center justify-center mr-3">
                              <span className="text-xl">
                                {getServiceImage(service)}
                              </span>
                            </div>
                          )}

                          <div className="flex-1">
                            <div className="flex items-center">
                              <p className="font-medium text-sm">
                                {service.name}
                              </p>
                              <span className="ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                                -{service.discountLivePercent}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-xs text-rose-600">
                                {formatPriceRange(service)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {service.category?.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {services.length === 0 && (
                      <div className="p-4 text-center text-rose-500">
                        No services available
                      </div>
                    )}
                  </div>

                  {/* Service Promotion Section */}
                  <div className="border border-rose-200 rounded-lg p-3 bg-rose-50">
                    <h4 className="text-sm font-medium text-rose-700 mb-2">
                      Giảm giá dịch vụ
                    </h4>

                    {selectedService ? (
                      <>
                        <div className="flex items-start mb-3">
                          {selectedService.images &&
                          selectedService.images.length > 0 ? (
                            <div className="w-16 h-16 rounded-md overflow-hidden mr-3 bg-gray-100 flex-shrink-0">
                              <img
                                src={
                                  selectedService.images[0] ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg"
                                }
                                alt={selectedService.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = `https://placehold.co/64x64.png`;
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-md bg-rose-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <span className="text-3xl">
                                {getServiceImage(selectedService)}
                              </span>
                            </div>
                          )}

                          <div className="flex-1">
                            <div className="flex items-center">
                              <p className="font-medium">
                                {selectedService.name}
                              </p>
                              {selectedService.discountLivePercent > 0 && (
                                <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                                  Giảm {selectedService.discountLivePercent}%
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-rose-600 mb-1">
                              {formatPriceRange(selectedService)}
                            </p>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {selectedService.description ||
                                "No description available"}
                            </p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="block text-sm font-medium text-rose-700 mb-1">
                            Tạo giảm giá
                          </label>
                          <div className="flex items-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={promotionValue}
                              onChange={(e) =>
                                setPromotionValue(Number(e.target.value))
                              }
                              placeholder="Giá trị trong khoảng 0 - 100%"
                              className="w-full text-sm border-rose-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-400 px-3 py-2"
                            />
                            <span className="ml-2 text-lg">%</span>
                          </div>
                          {selectedService.discountLivePercent > 0 && (
                            <p className="text-xs text-rose-600 mt-1">
                              Giảm giá hiện tại:{" "}
                              {selectedService.discountLivePercent}%
                            </p>
                          )}
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {/* Checkbox trong chi tiết service với xử lý sự kiện mới */}
                            <div className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedService.visible}
                                onChange={() => {}} // Để tránh warning về controlled component
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCheckboxClick(e, selectedService.id);
                                }}
                                className="rounded border-rose-300 text-rose-500 mr-2 cursor-pointer"
                              />
                              <span className="text-sm">
                                Hiển thị trong livestream
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={savePromotion}
                            className="bg-rose-400 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-rose-500 transition"
                          >
                            Lưu
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-rose-500 py-4">
                        Chọn dịch vụ để thiết lập giảm giá
                      </div>
                    )}
                  </div>
                </div>
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
