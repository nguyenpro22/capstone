"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useLivestream } from "./context";

// Dynamically import the HostPageStreamScreen with Next.js dynamic
const HostPageStreamScreen = dynamic(
  () => import("@/components/clinicManager/livestream/host-page-stream-screen"),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen bg-rose-50">
        <div className="animate-pulse text-rose-600 text-xl">
          Loading streaming interface...
        </div>
      </div>
    ),
    ssr: false, // Disable SSR for this component as it uses browser APIs
  }
);

export default function HostPageContainer(): JSX.Element {
  const router = useRouter();
  const {
    formData,
    isFormSubmitted,
    isCreateRoom,
    isConnecting,
    error,
    viewerCount,
    localVideoRef,
    startPublishing,
    isPublish,
    endLive,
    createRoom,
    resetLivestream,
  } = useLivestream();

  // Sử dụng useRef để theo dõi việc đã gọi createRoom hay chưa
  const hasCalledCreateRoomRef = useRef(false);

  // Check if form is submitted and create room if needed
  useEffect(() => {
    if (!formData || !isFormSubmitted) {
      // No form data, redirect back to form
      router.push("/clinicManager/live-stream");
      return;
    }

    // Chỉ gọi createRoom nếu chưa gọi trước đó và các điều kiện khác thỏa mãn
    if (
      !isCreateRoom &&
      !isConnecting &&
      !error &&
      !hasCalledCreateRoomRef.current
    ) {
      console.log("Calling createRoom for the first time");
      hasCalledCreateRoomRef.current = true;
      // Auto-create room when component mounts and form is submitted
      createRoom();
    }
    console.log("Checking form data and create room", isPublish);
  }, [
    formData,
    isFormSubmitted,
    isCreateRoom,
    isConnecting,
    error,
    createRoom,
    router,
  ]);

  if (!formData || !isFormSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-rose-50">
        <div className="text-center">
          <div className="text-rose-600 text-xl mb-4">
            Không tìm thấy thông tin livestream
          </div>
          <button
            onClick={() => router.push("/clinicManager/live-stream")}
            className="px-6 py-3 font-medium text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors"
          >
            Quay lại tạo livestream
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isCreateRoom && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-rose-50">
          {isConnecting ? (
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-rose-600 text-lg font-medium">
                Đang kết nối đến máy chủ phát sóng...
              </p>
              <p className="text-rose-400 text-sm mt-2">
                Vui lòng đợi trong khi chúng tôi thiết lập phòng livestream của
                bạn
              </p>
              <div className="mt-6 bg-white p-4 rounded-lg shadow-md max-w-md mx-auto">
                <h3 className="font-medium text-gray-800 mb-2">
                  Thông tin livestream:
                </h3>
                <p className="text-gray-700">
                  <span className="font-medium">Tiêu đề:</span> {formData.title}
                </p>
                {formData.description && (
                  <p className="text-gray-700 mt-1">
                    <span className="font-medium">Mô tả:</span>{" "}
                    {formData.description}
                  </p>
                )}
                <p className="text-gray-700 mt-1">
                  <span className="font-medium">Danh mục:</span>{" "}
                  {formData.category}
                </p>
                <p className="text-gray-700 mt-1">
                  <span className="font-medium">Quyền riêng tư:</span>{" "}
                  {formData.isPrivate ? "Riêng tư" : "Công khai"}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-rose-600 text-xl mb-4">
                {error || "Không thể tạo phòng phát sóng"}
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    // Reset flag khi thử lại
                    hasCalledCreateRoomRef.current = false;
                    createRoom();
                  }}
                  className="px-6 py-3 font-medium text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors"
                >
                  Thử lại
                </button>
                <button
                  onClick={resetLivestream}
                  className="block w-full px-6 py-3 font-medium text-rose-600 bg-white border border-rose-300 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  Quay lại tạo livestream
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {isCreateRoom && (
        <div className="relative">
          <div className="absolute top-4 right-4 z-10 flex space-x-2">
            {isPublish && (
              <button
                onClick={endLive}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition shadow-md flex items-center"
              >
                <span className="mr-2">●</span> End Livestream
              </button>
            )}
            <button
              onClick={resetLivestream}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition shadow-md"
            >
              Exit
            </button>
          </div>

          <div className="absolute top-4 left-4 z-10 bg-white bg-opacity-90 backdrop-blur-sm p-3 rounded-lg shadow-md">
            <h3 className="font-medium text-gray-800 text-sm">
              {formData.title}
            </h3>
            <p className="text-xs text-gray-600">
              {formData.category} •{" "}
              {formData.isPrivate ? "Riêng tư" : "Công khai"}
            </p>
          </div>

          <HostPageStreamScreen
            view={viewerCount}
            localVideoRef={localVideoRef}
            startPublishing={startPublishing}
            isPublish={isPublish}
            endLive={endLive}
          />
        </div>
      )}
    </>
  );
}
