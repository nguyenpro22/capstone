"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AlertCircle, Camera, CheckCircle2, RefreshCw } from "lucide-react";
import { useLivestream } from "./context";

// Sửa lại dynamic import để đảm bảo nó import đúng component
const HostPageStreamScreen = dynamic(
  () =>
    import(
      "@/components/clinicManager/livestream/host-page-stream-screen"
    ).then((mod) => mod.default),
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
    clearError,
    viewerCount,
    localVideoRef,
    startPublishing,
    isPublish,
    endLive,
    createRoom,
    resetLivestream,
    checkCamera,
  } = useLivestream();

  // Sử dụng useRef để theo dõi việc đã gọi createRoom hay chưa
  const hasCalledCreateRoomRef = useRef(false);

  // State để theo dõi trạng thái kiểm tra camera
  const [isCameraChecking, setIsCameraChecking] = useState(false);
  const [cameraCheckResult, setCameraCheckResult] = useState<boolean | null>(
    null
  );

  // Check if form is submitted and create room if needed
  useEffect(() => {
    console.log("Checking form data and create room", isCreateRoom);
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
  }, [
    formData,
    isFormSubmitted,
    isCreateRoom,
    isConnecting,
    error,
    createRoom,
    router,
  ]);

  // Hàm xử lý kiểm tra camera
  const handleCheckCamera = async () => {
    setIsCameraChecking(true);
    setCameraCheckResult(null);
    clearError();

    try {
      const result = await checkCamera();
      setCameraCheckResult(result);
    } catch (err) {
      setCameraCheckResult(false);
    } finally {
      setIsCameraChecking(false);

      // Tự động ẩn kết quả sau 5 giây
      setTimeout(() => {
        setCameraCheckResult(null);
      }, 5000);
    }
  };

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
              <div className="flex items-center justify-center mb-4">
                <AlertCircle className="text-rose-600 mr-2 h-6 w-6" />
                <div className="text-rose-600 text-xl">
                  {error || "Không thể tạo phòng phát sóng"}
                </div>
              </div>
              <div className="space-y-4 max-w-md mx-auto">
                <div className="bg-white p-4 rounded-lg shadow-md text-left">
                  <h3 className="font-medium text-gray-800 mb-2">
                    Kiểm tra kết nối:
                  </h3>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    <li>Đảm bảo bạn có kết nối internet ổn định</li>
                    <li>
                      Kiểm tra camera và microphone của bạn hoạt động bình
                      thường
                    </li>
                    <li>
                      Đảm bảo bạn đã cấp quyền truy cập camera và microphone cho
                      trình duyệt
                    </li>
                    <li>Thử làm mới trang và tạo lại phòng</li>
                  </ul>
                </div>
                <button
                  onClick={handleCheckCamera}
                  disabled={isCameraChecking}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
                >
                  {isCameraChecking ? (
                    <>
                      <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                      Đang kiểm tra...
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      Kiểm tra Camera
                    </>
                  )}
                </button>

                {cameraCheckResult !== null && (
                  <div
                    className={`p-3 rounded-lg ${
                      cameraCheckResult
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    } flex items-center`}
                  >
                    {cameraCheckResult ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        Camera hoạt động bình thường!
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5 mr-2" />
                        Không thể truy cập camera. Vui lòng kiểm tra quyền truy
                        cập.
                      </>
                    )}
                  </div>
                )}

                <button
                  onClick={() => {
                    // Reset flag khi thử lại
                    hasCalledCreateRoomRef.current = false;
                    clearError();
                    createRoom();
                  }}
                  className="w-full px-6 py-3 font-medium text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors"
                >
                  Thử lại
                </button>
                <button
                  onClick={resetLivestream}
                  className="w-full px-6 py-3 font-medium text-rose-600 bg-white border border-rose-300 hover:bg-rose-50 rounded-lg transition-colors"
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

          {/* Thêm nút kiểm tra camera */}
          {!isPublish && (
            <div className="absolute top-16 left-4 z-10">
              <button
                onClick={handleCheckCamera}
                disabled={isCameraChecking}
                className={`flex items-center px-3 py-1 text-sm rounded-lg shadow-md transition ${
                  isCameraChecking
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {isCameraChecking ? (
                  <>
                    <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                    Đang kiểm tra...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 mr-2" />
                    Kiểm tra Camera
                  </>
                )}
              </button>

              {cameraCheckResult !== null && (
                <div
                  className={`mt-2 p-2 rounded-lg text-xs ${
                    cameraCheckResult
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  } flex items-center`}
                >
                  {cameraCheckResult ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Camera OK!
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Lỗi camera
                    </>
                  )}
                </div>
              )}
            </div>
          )}

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
