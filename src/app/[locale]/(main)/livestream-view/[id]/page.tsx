"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Users } from "lucide-react";
import { useLivestream } from "@/components/clinicManager/livestream/context";

export default function CustomerPageStreamScreen({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const {
    localVideoRef,
    viewerCount,
    error,
    clearError,
    isConnecting,
    joinRoom,
    leaveRoom,
    roomGuid,
  } = useLivestream();

  const [message, setMessage] = useState("");
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

  // Sửa useEffect để tránh vòng lặp vô hạn
  useEffect(() => {
    const id = params.id;
    // Chỉ gọi joinRoom khi id tồn tại và khác với roomGuid hiện tại
    if (id && id !== roomGuid) {
      joinRoom(id);
    }

    // Cleanup when component unmounts
    return () => {
      leaveRoom();
    };
  }, [params.id, joinRoom, leaveRoom, roomGuid]); // Thêm roomGuid vào dependencies

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        sender: "Client",
        message: message,
        isHost: false,
        avatar: "🧑",
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-rose-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <Loader2 className="h-12 w-12 animate-spin text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-800 mb-2">
            Connecting to livestream...
          </h2>
          <p className="text-gray-500">
            Please wait while we connect you to the room
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-rose-50 p-4">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-medium text-gray-800 mb-4">
            Connection Error
          </h2>
          <div className="bg-red-50 p-4 rounded-lg text-red-700 mb-6 text-sm overflow-y-auto max-h-[200px]">
            {error}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                clearError();
                joinRoom(params.id);
              }}
              className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/customer")}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Back to Rooms
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-rose-50 overflow-hidden font-sans">
      {/* Left side: Video taking 5/8 */}
      <div className="w-5/8 h-full flex items-center justify-center bg-black">
        <div className="relative w-full h-full">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-contain rounded-lg pointer-events-none touch-none"
          />
          {/* Viewer count */}
          <div className="absolute top-4 left-4 bg-white bg-opacity-20 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center shadow-md">
            <Users className="w-4 h-4 mr-2" />
            <span>{viewerCount} viewers</span>
          </div>

          {/* Back button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => {
                leaveRoom();
                router.push("/customer");
              }}
              className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-full hover:bg-opacity-70 transition flex items-center"
            >
              Exit Stream
            </button>
          </div>

          {/* No video overlay */}
          {!localVideoRef.current?.srcObject && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
                <p className="text-xl">Waiting for stream to start...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Chat taking 3/8 */}
      <div className="w-3/8 h-full flex flex-col bg-white border-l border-rose-100 shadow-md">
        {/* Chat Section - Using flex-grow to fill remaining space */}
        <div className="flex-grow flex flex-col border border-rose-200 rounded-lg m-4 shadow-sm transition-all duration-500 ease-in-out">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-rose-100 to-pink-100 px-4 py-3 border-b border-rose-200 font-medium">
            💬 Chat with Host
          </div>

          {/* Chat Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-3 transition-all duration-500 ease-in-out"
            style={{ maxHeight: "calc(100% - 110px)" }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start ${
                  msg.isHost ? "justify-start mb-3" : "justify-end mb-3"
                }`}
              >
                {msg.isHost && (
                  <div className="w-8 h-8 rounded-full bg-rose-500 mr-2 flex items-center justify-center">
                    {msg.avatar}
                  </div>
                )}
                <div
                  className={`${
                    msg.isHost ? "bg-rose-400 text-white" : "bg-blue-100"
                  } px-4 py-2 rounded-lg max-w-[80%]`}
                >
                  {msg.message}
                </div>
                {!msg.isHost && (
                  <div className="w-8 h-8 rounded-full bg-blue-300 ml-2 flex items-center justify-center">
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
                className="flex-1 border-rose-300 rounded-lg px-4 py-2 bg-rose-50 focus:ring-rose-500 focus:border-rose-400 focus:outline-none"
                placeholder="Ask a question..."
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 bg-rose-400 text-white px-4 py-2 rounded-lg hover:bg-rose-500 transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
