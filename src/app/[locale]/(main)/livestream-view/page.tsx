"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import * as signalR from "@microsoft/signalr";
import { Loader2, Sun, Moon, Users, Clock, Calendar, Play } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Image from "next/image";

interface Room {
  id: string;
  name: string;
  clinicName: string;
  startDate: string;
  description?: string;
  coverImage?: string;
}

export default function LivestreamViewPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roomGuid, setRoomGuid] = useState<string>("");
  const [view, setView] = useState<number>(0);
  const [isJoinRoom, setIsJoinRoom] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isBrowser, setIsBrowser] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const user = useSelector((state: RootState) => state?.auth?.user);
  // Refs for video and SignalR connection
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const signalR_Connection = useRef<signalR.HubConnection | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  // Check if we're in the browser environment
  useEffect(() => {
    setIsBrowser(true);
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!isBrowser || !isMounted) return;

      try {
        setLoading(true);
        const response = await fetch(
          "https://api.beautify.asia/signaling-api/LiveStream/Rooms"
        );
        const data = await response.json();

        if (data.isSuccess) {
          setRooms(data.value);
          if (data.value.length > 0) setRoomGuid(data.value[0].id);
        } else {
          setError(
            `Lỗi: ${data.error?.message || "Không thể tải danh sách phòng"}`
          );
        }
      } catch (err) {
        setError(
          `Lỗi: ${err instanceof Error ? err.message : "Lỗi không xác định"}`
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (isBrowser) {
      fetchRooms();
    }
  }, [isBrowser]);

  // Clean up previous connection when roomGuid changes
  useEffect(() => {
    if (!isBrowser || !isMounted) return;

    let isComponentMounted = true;

    // Clean up function to be called when unmounting or before setting up a new connection
    const cleanupResources = () => {
      // Clean up previous connection
      if (signalR_Connection.current) {
        console.log("Dọn dẹp kết nối SignalR trước đó");
        signalR_Connection.current
          .stop()
          .catch((err) => console.error("Lỗi khi dừng kết nối:", err));
        signalR_Connection.current = null;
      }

      // Clean up previous video stream
      if (videoRef.current?.srcObject) {
        console.log("Dọn dẹp luồng video trước đó");
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }

      // Clean up previous peer connection
      if (peerConnectionRef.current) {
        console.log("Dọn dẹp kết nối peer trước đó");
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      sessionIdRef.current = null;
      if (isComponentMounted) {
        setIsJoinRoom(false);
      }
    };

    // Clean up existing resources
    cleanupResources();

    // Only establish connection if we have a roomGuid
    if (roomGuid) {
      console.log("Thiết lập kết nối mới cho phòng:", roomGuid);
      setupSignalRConnection();
    }

    // Cleanup on unmount or before next effect run
    return () => {
      isComponentMounted = false;
      cleanupResources();
    };
  }, [roomGuid, isBrowser]);

  const setupSignalRConnection = () => {
    if (!roomGuid || !isBrowser || !isMounted) return;

    console.log("Tạo kết nối SignalR mới");
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(
        // Add userId parameter like in the React version
        `https://api.beautify.asia/signaling-api/LivestreamHub?userId=${user?.userId}`,
        {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        }
      )
      .withAutomaticReconnect([0, 2000, 5000, 10000, 15000, 30000]) // More aggressive reconnection strategy
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Add connection closed handler
    conn.onclose((error) => {
      console.log("Kết nối SignalR đã đóng", error);

      // Try to reconnect if component is still mounted
      if (isMounted && error) {
        console.log("Đang cố gắng kết nối lại sau 5 giây...");
        setTimeout(() => {
          if (isMounted) {
            console.log("Đang kết nối lại...");
            setupSignalRConnection();
          }
        }, 5000);
      }
    });

    conn
      .start()
      .then(() => {
        console.log("✅ Đã kết nối đến SignalR");

        if (!isMounted) {
          console.log("Component đã bị gỡ trong quá trình kết nối, đang dừng");
          conn
            .stop()
            .catch((err) =>
              console.error("Lỗi khi dừng kết nối sau khi gỡ:", err)
            );
          return;
        }

        signalR_Connection.current = conn;

        // Important: Join as listener immediately after connection is established
        if (roomGuid) {
          console.log(
            "Đang tham gia với tư cách người nghe cho phòng:",
            roomGuid
          );
          conn.invoke("JoinAsListener", roomGuid).catch((err) => {
            console.error("Lỗi khi tham gia với tư cách người nghe:", err);
            // If we fail to join, try again after a delay
            if (isMounted) {
              setTimeout(() => {
                if (
                  conn.state === signalR.HubConnectionState.Connected &&
                  isMounted
                ) {
                  conn
                    .invoke("JoinAsListener", roomGuid)
                    .catch((e) =>
                      console.error("Lỗi trong lần thử tham gia lại:", e)
                    );
                }
              }, 3000);
            }
          });
        }

        conn.on(
          "JoinRoomResponse",
          async ({
            jsep,
            roomId,
            sessionId,
            handleId,
          }: {
            jsep: string;
            roomId: string;
            sessionId: string;
            handleId: string;
          }) => {
            console.log(
              "Đã nhận JoinRoomResponse với jsep:",
              jsep ? "có" : "không"
            );
            if (jsep && isMounted) {
              try {
                console.log("Đang tạo RTCPeerConnection");
                // Use empty object for RTCConfiguration to avoid TypeScript errors
                const pc = new RTCPeerConnection({});

                pc.onicecandidate = (event) => {
                  console.log("ICE candidate", event.candidate);
                };

                pc.oniceconnectionstatechange = () => {
                  console.log("Trạng thái kết nối ICE:", pc.iceConnectionState);
                };

                pc.onsignalingstatechange = () => {
                  console.log("Trạng thái báo hiệu:", pc.signalingState);
                };

                pc.ontrack = (event) => {
                  console.log(
                    "ontrack đã kích hoạt, số lượng luồng:",
                    event.streams.length
                  );
                  if (videoRef.current && event.streams[0]) {
                    console.log("Đang thiết lập srcObject trên phần tử video");
                    videoRef.current.srcObject = event.streams[0];

                    // Add event listeners to debug video playback
                    videoRef.current.onloadedmetadata = () => {
                      console.log("Đã tải metadata video");
                      if (videoRef.current) {
                        videoRef.current
                          .play()
                          .then(() => console.log("Đã bắt đầu phát video"))
                          .catch((e) =>
                            console.error("Lỗi khi phát video:", e)
                          );
                      }
                    };
                  } else {
                    console.error(
                      "Tham chiếu phần tử video là null hoặc không có luồng nào"
                    );
                  }
                };

                console.log("Đang thiết lập mô tả từ xa");
                await pc.setRemoteDescription(
                  new RTCSessionDescription({ type: "offer", sdp: jsep })
                );

                console.log("Đang tạo câu trả lời");
                const answer = await pc.createAnswer();

                console.log("Đang thiết lập mô tả cục bộ");
                await pc.setLocalDescription(answer);

                // Store the peer connection reference
                peerConnectionRef.current = pc;

                if (
                  conn.state === signalR.HubConnectionState.Connected &&
                  isMounted
                ) {
                  console.log("Đang gửi câu trả lời đến Janus");
                  sessionIdRef.current = sessionId;
                  setIsJoinRoom(true);
                  conn
                    .invoke(
                      "SendAnswerToJanus",
                      roomId,
                      sessionId,
                      handleId,
                      answer.sdp
                    )
                    .catch((err) => {
                      console.error("Lỗi khi gửi câu trả lời đến Janus:", err);
                      // Try again after a delay
                      setTimeout(() => {
                        if (
                          conn.state === signalR.HubConnectionState.Connected &&
                          isMounted
                        ) {
                          conn
                            .invoke(
                              "SendAnswerToJanus",
                              roomId,
                              sessionId,
                              handleId,
                              answer.sdp
                            )
                            .catch((e) =>
                              console.error(
                                "Lỗi trong lần thử gửi câu trả lời lại:",
                                e
                              )
                            );
                        }
                      }, 2000);
                    });
                } else {
                  console.error(
                    "Kết nối SignalR chưa sẵn sàng hoặc component đã bị gỡ"
                  );
                }
              } catch (error) {
                console.error("Lỗi WebRTC:", error);
              }
            }
          }
        );

        conn.on("ListenerCountUpdated", async (viewCount: number) => {
          console.log("Số lượng người nghe đã cập nhật:", viewCount);
          if (isMounted) {
            setView(viewCount);
          }
        });

        conn.on("LivestreamEnded", async () => {
          console.log("Buổi phát trực tiếp đã kết thúc");
          if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
            videoRef.current.srcObject = null;
          }

          sessionIdRef.current = null;

          if (isMounted) {
            setIsJoinRoom(false);

            // Find another room to preview if available
            if (rooms.length > 1) {
              const nextRoom = rooms.find((room) => room.id !== roomGuid);
              if (nextRoom) {
                setRoomGuid(nextRoom.id);
              }
            } else {
              setRoomGuid("");
            }
          }
        });

        conn.on("JanusError", async (message: string) => {
          console.error("Lỗi Janus:", message);
        });
      })
      .catch((err) => {
        console.error("Không thể kết nối đến SignalR:", err);

        // Try to reconnect after a delay
        if (isMounted) {
          setTimeout(() => {
            if (isMounted) {
              console.log("Đang thử kết nối lại...");
              setupSignalRConnection();
            }
          }, 5000);
        }
      });

    return conn;
  };

  useEffect(() => {
    if (!isBrowser || !isMounted) return;

    const keepAliveInterval = setInterval(() => {
      if (
        sessionIdRef.current &&
        signalR_Connection.current &&
        signalR_Connection.current.state ===
          signalR.HubConnectionState.Connected &&
        isJoinRoom &&
        isMounted
      ) {
        console.log("Giữ kết nối hoạt động");
        signalR_Connection.current
          .invoke("KeepAlive", sessionIdRef.current)
          .catch((err) => {
            console.error("Lỗi trong keepalive:", err);
          });
      }
    }, 25000);

    return () => clearInterval(keepAliveInterval);
  }, [isJoinRoom, isBrowser]);

  // Function to change the preview to a different room
  const changePreview = (roomId: string) => {
    if (roomId !== roomGuid) {
      console.log("Đang thay đổi xem trước sang phòng:", roomId);
      setRoomGuid(roomId);
    }
  };

  // Function to join the actual livestream room
  const joinRoom = (roomId: string) => {
    if (!roomId) {
      alert("Vui lòng chọn một phòng để tham gia");
      return;
    }

    console.log(`Đang tham gia phòng: ${roomId}`);

    // Navigate to the livestream view page
    router.push(`/livestream-view/${roomId}`);
  };

  const formatViewerCount = (count: number) => {
    return count > 999 ? `${(count / 1000).toFixed(1)}K` : count;
  };

  // Calculate how long a stream has been live
  const getStreamDuration = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diff = now.getTime() - start.getTime(); // Difference in milliseconds

    // Convert to appropriate time unit
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} ${days > 1 ? "ngày" : "ngày"} trước`;
    if (hours > 0) return `${hours} ${hours > 1 ? "giờ" : "giờ"} trước`;
    if (minutes > 0) return `${minutes} ${minutes > 1 ? "phút" : "phút"} trước`;
    return `${seconds} ${seconds !== 1 ? "giây" : "giây"} trước`;
  };

  if (!isBrowser) {
    return null; // Return nothing during SSR
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-900 dark:bg-[#1a1a1a] dark:text-white">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-rose-500 mx-auto mb-4" />
          <div className="text-lg">Đang tải phòng phát trực tiếp...</div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-[#1a1a1a]">
        <div className="bg-white dark:bg-[#2a2a2a] p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Lỗi Khi Tải Phát Trực Tiếp
            </h2>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg transition"
            >
              Thử Lại
            </button>
          </div>
        </div>
      </div>
    );

  // Find the currently selected room for preview
  const currentRoom =
    rooms.find((room) => room.id === roomGuid) ||
    (rooms.length > 0 ? rooms[0] : null);

  // Get rooms for the sidebar (excluding the current room if possible)
  const sidebarRooms =
    rooms.length > 1
      ? rooms.filter((room) => room.id !== currentRoom?.id).slice(0, 3)
      : [];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1a1a1a] dark:text-white">
      {/* Header */}
      <header className="bg-white shadow-sm dark:bg-[#2a2a2a] dark:shadow-md dark:border-b dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-rose-600 dark:text-rose-500">
            Phát Trực Tiếp Beautify
          </h1>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="py-6">
        <div className="container mx-auto px-4">
          {rooms.length === 0 ? (
            // No livestreams available
            <div className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-md dark:shadow-lg p-8 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-rose-100 dark:bg-rose-900/30 rounded-full p-5 mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-rose-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Không Có Phát Trực Tiếp Nào
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-5 max-w-md">
                  Hiện tại không có phát trực tiếp nào. Vui lòng quay lại sau để
                  xem các buổi làm đẹp thú vị từ các chuyên gia của chúng tôi.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-lg font-medium transition flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Làm Mới
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Preview + Sidebar Layout */}
              <div className="flex flex-col lg:flex-row gap-4 mb-8">
                {/* Main Preview Area */}
                {currentRoom && (
                  <div className="lg:w-2/3">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Xem trước:{" "}
                      <span className="text-rose-600 dark:text-rose-500">
                        {currentRoom.name}
                      </span>
                    </h2>
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-[#2a2a2a] shadow-md dark:shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover pointer-events-none touch-none"
                      />
                      <div className="absolute bottom-4 w-full z-20 flex justify-between items-center">
                        <div className="pl-4 flex items-center">
                          <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-rose-100 dark:bg-rose-900/50">
                            <Image
                              src={`https://i.pravatar.cc/100?u=${currentRoom.id}`}
                              alt="avatar"
                              className="w-full h-full object-cover"
                              width={100}
                              height={100}
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">
                              {currentRoom.name}
                            </h3>
                            <p className="text-sm text-gray-200">
                              {formatViewerCount(view)} người xem
                            </p>
                            {currentRoom.clinicName && (
                              <p className="text-xs text-gray-300">
                                {currentRoom.clinicName}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          className="mr-5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 flex items-center rounded-lg font-semibold transition duration-300"
                          onClick={() => joinRoom(currentRoom.id)}
                        >
                          Tham Gia Phòng
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 ml-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="absolute top-4 right-4 z-20 bg-red-500 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <span className="h-1.5 w-1.5 bg-white rounded-full animate-pulse mr-1.5"></span>
                        TRỰC TIẾP
                      </div>
                    </div>
                  </div>
                )}

                {/* Sidebar - Preview Selector */}
                <div className="lg:w-1/3">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {sidebarRooms.length > 0
                      ? "Phát Trực Tiếp Khác"
                      : "Không Có Phát Trực Tiếp Khác"}
                  </h2>
                  {sidebarRooms.length > 0 ? (
                    <div className="flex flex-col space-y-3">
                      {sidebarRooms.map((room) => (
                        <div
                          key={`sidebar-${room.id}`}
                          className={`flex bg-white dark:bg-[#2a2a2a] rounded-lg overflow-hidden shadow-md dark:shadow-lg hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 cursor-pointer ${
                            room.id === roomGuid ? "ring-2 ring-rose-500" : ""
                          }`}
                          onClick={() => changePreview(room.id)}
                        >
                          {/* Thumbnail */}
                          <div className="relative w-1/3">
                            <Image
                              src={`https://picsum.photos/seed/${room.id}/400/225`}
                              alt={room.name}
                              className="w-full h-full object-cover"
                              width={100}
                              height={100}
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Play className="h-8 w-8 text-white" />
                            </div>
                            <div className="absolute top-1 right-1 bg-red-500 px-1 py-0.5 rounded-full text-[10px] font-medium flex items-center">
                              <span className="h-1 w-1 bg-white rounded-full animate-pulse mr-0.5"></span>
                              TRỰC TIẾP
                            </div>
                          </div>

                          {/* Content */}
                          <div className="w-2/3 p-3">
                            <h3 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-1">
                              {room.name}
                            </h3>
                            {room.clinicName && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mt-0.5">
                                {room.clinicName}
                              </p>
                            )}
                            <div className="flex items-center mt-1.5 text-xs text-gray-500 dark:text-gray-500">
                              <Users className="h-3 w-3 mr-1" />
                              <span className="mr-2">
                                {Math.floor(Math.random() * 100) + 10}
                              </span>
                              <Clock className="h-3 w-3 mr-1" />
                              <span>
                                {room.startDate &&
                                  getStreamDuration(room.startDate)}
                              </span>
                            </div>
                            <div className="mt-2">
                              <button
                                className="text-xs bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-1 rounded transition"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  changePreview(room.id);
                                }}
                              >
                                Xem Trước
                              </button>
                              <button
                                className="text-xs bg-rose-600 hover:bg-rose-700 text-white px-2 py-1 rounded transition ml-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  joinRoom(room.id);
                                }}
                              >
                                Tham Gia
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-[#2a2a2a] rounded-lg p-4 text-center">
                      <p className="text-gray-600 dark:text-gray-400">
                        Không có phát trực tiếp bổ sung nào.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* All Livestreams Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Tất Cả Phát Trực Tiếp
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {rooms.map((room) => (
                    <div
                      key={`all-${room.id}`}
                      className={`flex flex-col rounded-lg overflow-hidden bg-white dark:bg-[#2a2a2a] shadow-md dark:shadow-lg hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 ${
                        room.id === roomGuid ? "ring-2 ring-rose-500" : ""
                      }`}
                    >
                      {/* Thumbnail */}
                      <div
                        className="relative aspect-video cursor-pointer"
                        onClick={() => changePreview(room.id)}
                      >
                        <Image
                          src={`https://picsum.photos/seed/${room.id}/400/225`}
                          alt={room.name}
                          className="w-full h-full object-cover"
                          width={100}
                          height={100}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Play className="h-10 w-10 text-white" />
                        </div>
                        <div className="absolute top-2 right-2 bg-red-500 px-1.5 py-0.5 rounded-full text-xs font-medium flex items-center">
                          <span className="h-1.5 w-1.5 bg-white rounded-full animate-pulse mr-1"></span>
                          TRỰC TIẾP
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-3">
                        <h3 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-1">
                          {room.name}
                        </h3>
                        {room.clinicName && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mt-0.5">
                            {room.clinicName}
                          </p>
                        )}
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>
                              {new Date(room.startDate).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              className="text-xs bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-1 rounded transition"
                              onClick={() => changePreview(room.id)}
                            >
                              Xem Trước
                            </button>
                            <button
                              className="text-xs bg-rose-600 hover:bg-rose-700 text-white px-2 py-1 rounded transition"
                              onClick={() => joinRoom(room.id)}
                            >
                              Tham Gia
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#2a2a2a] border-t border-gray-200 dark:border-gray-800 py-6 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} Beautify. Đã đăng ký bản
                quyền.
              </p>
            </div>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-500 transition"
              >
                Điều Khoản Dịch Vụ
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-500 transition"
              >
                Chính Sách Bảo Mật
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-500 transition"
              >
                Liên Hệ
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
