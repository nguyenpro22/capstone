"use client";

import { type RefObject, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import components with Next.js
const ConfigSection = dynamic(
  () => import("@/components/clinicManager/livestream/config-section"),
  {
    loading: () => (
      <div className="m-4 p-4 bg-rose-50 rounded-lg animate-pulse h-[380px]">
        Loading settings...
      </div>
    ),
    ssr: false,
  }
);

const ChatSection = dynamic(
  () => import("@/components/clinicManager/livestream/chat-section"),
  {
    loading: () => (
      <div className="flex-grow m-4 p-4 bg-rose-50 rounded-lg animate-pulse">
        Loading chat...
      </div>
    ),
    ssr: false,
  }
);

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
  const [isConfigCollapsed, setIsConfigCollapsed] = useState<boolean>(false);

  const toggleConfig = (): void => {
    setIsConfigCollapsed(!isConfigCollapsed);
  };

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
            <button
              onClick={startPublishing}
              className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-medium px-6 py-3 rounded-full hover:from-rose-500 hover:to-pink-600 transition shadow-lg"
            >
              Start Live
            </button>
          )}
          {isPublish && (
            <button
              onClick={endLive}
              className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-medium px-6 py-3 rounded-full hover:from-rose-500 hover:to-pink-600 transition shadow-lg"
            >
              Stop Livestream
            </button>
          )}
        </div>
      </div>

      {/* Right side: Config + Chat taking 3/8 */}
      <div className="w-3/8 h-full flex flex-col bg-white border-l border-rose-100 shadow-md">
        <ConfigSection
          isConfigCollapsed={isConfigCollapsed}
          toggleConfig={toggleConfig}
        />
        <ChatSection />
      </div>
    </div>
  );
}
