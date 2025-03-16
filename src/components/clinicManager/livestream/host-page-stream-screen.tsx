"use client";

import type React from "react";

import { type RefObject, useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";
import { useLivestream } from "./context";

interface HostPageStreamScreenProps {
  view: number;
  localVideoRef: RefObject<HTMLVideoElement>;
  startPublishing: () => Promise<void>;
  isPublish: boolean;
  endLive: () => void;
}

export default function HostPageStreamScreen({
  view,
  localVideoRef,
  startPublishing,
  isPublish,
  endLive,
}: HostPageStreamScreenProps): JSX.Element {
  const { error, clearError, peerConnection } = useLivestream();
  const [isConfigCollapsed, setIsConfigCollapsed] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isStartingPublish, setIsStartingPublish] = useState<boolean>(false);
  const [messages, setMessages] = useState([
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

  const toggleConfig = (): void => {
    setIsConfigCollapsed(!isConfigCollapsed);
  };

  const handleSendMessage = (): void => {
    if (message.trim()) {
      const newMessage = {
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

  const handleStartPublishing = async () => {
    setIsStartingPublish(true);
    clearError();
    try {
      await startPublishing();
      // Không cần set isStartingPublish = false ở đây vì sẽ được xử lý trong useEffect
    } catch (error) {
      setIsStartingPublish(false);
      console.error("Error in handleStartPublishing:", error);
    }
  };

  // Thêm một hàm để kiểm tra trạng thái kết nối
  const checkConnectionStatus = () => {
    if (peerConnection) {
      const iceState = peerConnection.iceConnectionState;
      const connectionState = peerConnection.connectionState;

      console.log(
        `Connection check - ICE: ${iceState}, Connection: ${connectionState}`
      );

      // Nếu kết nối đang hoạt động nhưng UI chưa cập nhật
      if (
        (iceState === "connected" || iceState === "completed") &&
        !isPublish
      ) {
        console.log("Connection is actually working but UI is not updated");
        // Có thể thực hiện các hành động để đồng bộ lại UI
      }
    }
  };

  // Theo dõi trạng thái isPublish để cập nhật UI
  useEffect(() => {
    if (isPublish) {
      setIsStartingPublish(false);
      console.log("✅ Publishing started successfully, updating UI");
    }
  }, [isPublish]);

  // Theo dõi lỗi để cập nhật UI
  useEffect(() => {
    if (error) {
      setIsStartingPublish(false);
      console.log("❌ Error occurred, resetting starting state");
    }
  }, [error]);

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

          {/* Livestream Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
            {!isPublish && (
              <button
                onClick={handleStartPublishing}
                disabled={isStartingPublish}
                className={`bg-gradient-to-r from-rose-400 to-pink-500 text-white font-medium px-6 py-3 rounded-full hover:from-rose-500 hover:to-pink-600 transition shadow-lg flex items-center ${
                  isStartingPublish ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isStartingPublish ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang bắt đầu...
                  </>
                ) : (
                  "Bắt đầu phát sóng"
                )}
              </button>
            )}
            {isPublish && (
              <button
                onClick={endLive}
                className="bg-gradient-to-r from-rose-400 to-pink-500 text-white font-medium px-6 py-3 rounded-full hover:from-rose-500 hover:to-pink-600 transition shadow-lg"
              >
                Kết thúc phát sóng
              </button>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md max-w-md">
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                  <div>
                    <strong className="font-bold">Lỗi: </strong>
                    <span className="block sm:inline">{error}</span>

                    {error.includes("camera") && (
                      <div className="mt-2 text-xs">
                        <p className="font-semibold">Cách khắc phục:</p>
                        <ul className="list-disc pl-4 mt-1">
                          <li>
                            Đảm bảo không có ứng dụng nào khác đang sử dụng
                            camera
                          </li>
                          <li>Kiểm tra camera có được kết nối đúng cách</li>
                          <li>Làm mới trang và thử lại</li>
                          <li>
                            Thử sử dụng trình duyệt khác (Chrome, Firefox)
                          </li>
                        </ul>
                      </div>
                    )}

                    {(error.includes("ICE") ||
                      error.includes("không nhận được phản hồi")) && (
                      <div className="mt-2 text-xs">
                        <p className="font-semibold">Lưu ý:</p>
                        <p className="mt-1">
                          Nếu bạn vẫn thấy video đang phát và khách hàng có thể
                          xem được, bạn có thể bỏ qua thông báo này.
                        </p>
                        <div className="mt-2 flex justify-center">
                          <button
                            onClick={clearError}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600"
                          >
                            Bỏ qua và tiếp tục phát sóng
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={clearError}
                  className="ml-4 text-red-700 hover:text-red-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
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
              ⚙️ Cài đặt phát sóng
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
                Tiêu đề buổi phát sóng
              </label>
              <input
                type="text"
                className="block w-full border-rose-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-400 px-4 py-2 bg-white"
                placeholder="VD: Hướng dẫn chăm sóc da nhạy cảm"
              />
            </div>

            {/* Session Privacy */}
            <div>
              <label className="block text-sm font-medium text-rose-700 mb-1">
                Quyền riêng tư
              </label>
              <select className="block w-full border-rose-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-400 px-4 py-2 bg-white">
                <option>Công khai</option>
                <option>Riêng tư</option>
                <option>Chỉ thành viên VIP</option>
              </select>
            </div>

            {/* Stream Quality */}
            <div>
              <label className="block text-sm font-medium text-rose-700 mb-1">
                Chất lượng video
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
                Danh mục
              </label>
              <select className="block w-full border-rose-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-400 px-4 py-2 bg-white">
                <option>Hướng dẫn chăm sóc da</option>
                <option>Lớp học trang điểm</option>
                <option>Demo điều trị spa</option>
              </select>
            </div>
          </div>
        </div>

        {/* Chat Section - Using flex-grow to fill remaining space */}
        <div className="flex-grow flex flex-col border border-rose-200 rounded-lg m-4 shadow-sm transition-all duration-500 ease-in-out">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-rose-100 to-pink-100 px-4 py-3 border-b border-rose-200">
            💬 Câu hỏi từ khách hàng
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
                placeholder="Trả lời khách hàng..."
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
      </div>
    </div>
  );
}
