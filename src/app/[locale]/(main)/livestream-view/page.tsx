"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import * as signalR from "@microsoft/signalr";
import {
  Loader2,
  Users,
  Clock,
  Calendar,
  Play,
  CalendarDays,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Star,
  ArrowRight,
  Heart,
  Share2,
  Bell,
  Eye,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FooterSection } from "@/components/home/Footer";
import { useGetEventsQuery } from "@/features/event/api";

// Updated interface to match the new API response format
interface Room {
  id: string;
  name: string;
  description: string;
  image: string;
  startDate: string;
  clinicId: string;
  clinicName: string;
}

interface RoomsResponse {
  value: {
    items: Room[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

interface Event {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  clinicName: string;
  clinicId: string;
}

interface EventsResponse {
  value: {
    items: Event[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export default function LivestreamViewPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [roomGuid, setRoomGuid] = useState<string>("");
  const [view, setView] = useState<number>(0);
  const [isJoinRoom, setIsJoinRoom] = useState<boolean>(false);
  const [isBrowser, setIsBrowser] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("livestream");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null);

  const user = useSelector((state: RootState) => state?.auth?.user);
  // Refs for video and SignalR connection
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const signalR_Connection = useRef<signalR.HubConnection | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const t = useTranslations("livestreamMessages");
  const tEvents = useTranslations("events");
  const { data } = useGetEventsQuery({
    pageIndex,
    pageSize,
    searchTerm: searchQuery,
  });
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
          "https://api.beautify.asia/signaling-api/LiveStream/Rooms?pageIndex=1&pageSize=1000"
        );
        const data: RoomsResponse = await response.json();

        if (data.isSuccess && data.value.items.length > 0) {
          // Updated to use the new response format
          setRooms(data.value.items);
          if (data.value.items.length > 0) setRoomGuid(data.value.items[0].id);
        } else {
          setError(`${data.error?.message || "Không thể tải danh sách phòng"}`);
        }
      } catch (err) {
        setError(
          `${err instanceof Error ? err.message : "Lỗi không xác định"}`
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

  useEffect(() => {
    const fetchEvents = async () => {
      if (!isBrowser || !isMounted) return;

      try {
        setEventsLoading(true);

        if (data?.isSuccess) {
          setEvents(data.value.items);
          // Set the first event as featured
          if (data.value.items.length > 0) {
            setFeaturedEvent(data.value.items[0]);
          }
          setPageIndex(data.value.pageIndex);
          setTotalCount(data.value.totalCount);
          setHasNextPage(data.value.hasNextPage);
          setHasPreviousPage(data.value.hasPreviousPage);
          // toast.success(tEvents("fetchSuccess"));
        } else {
          setEventsError(data?.error?.message || tEvents("fetchError"));
          toast.error(data?.error?.message || tEvents("fetchError"));
        }
      } catch (err) {
        setEventsError(tEvents("fetchError"));
        toast.error(tEvents("fetchError"));
      } finally {
        if (isMounted) {
          setEventsLoading(false);
        }
      }
    };

    if (isBrowser && activeTab === "events") {
      fetchEvents();
    }
  }, [isBrowser, activeTab, tEvents]);

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

    // Only establish connection if we have a roomGuid and we're on the livestream tab
    if (roomGuid && activeTab === "livestream") {
      console.log("Thiết lập kết nối mới cho phòng:", roomGuid);
      setupSignalRConnection();
    }

    // Cleanup on unmount or before next effect run
    return () => {
      isComponentMounted = false;
      cleanupResources();
    };
  }, [roomGuid, isBrowser, activeTab]);

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

    localStorage.setItem(
      "selectedRoom",
      JSON.stringify(rooms.find((room) => room.id === roomId) || null)
    );

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

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch (error) {
      return dateString;
    }
  };

  const formatDateShort = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM");
    } catch (error) {
      return dateString;
    }
  };

  const formatTimeShort = (dateString: string) => {
    try {
      return format(new Date(dateString), "HH:mm");
    } catch (error) {
      return dateString;
    }
  };

  const isLive = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  const handlePageChange = (newPage: number) => {
    setPageIndex(newPage);
    // In a real implementation, you would fetch events for the new page
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info(`Searching for: ${searchQuery}`);
    // In a real implementation, you would search for events
  };

  const handleSetReminder = (eventId: string) => {
    toast.success(tEvents("reminderSet"));
  };

  const handleShare = (eventId: string) => {
    toast.info(tEvents("eventShared"));
  };

  const handleFavorite = (eventId: string) => {
    toast.success(tEvents("addedToFavorites"));
  };

  if (!isBrowser) {
    return null; // Return nothing during SSR
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1a1a1a] dark:text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">{t("header.title")}</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="py-6">
        <div className="container mx-auto px-4">
          <Tabs
            defaultValue="livestream"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-purple-100 dark:bg-purple-900/20">
              <TabsTrigger
                value="livestream"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
              >
                {t("tabs.livestream")}
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
              >
                {t("tabs.events")}
              </TabsTrigger>
            </TabsList>

            {/* Livestream Tab Content */}
            <TabsContent value="livestream">
              {loading ? (
                <div className="flex items-center justify-center h-64 bg-gray-50 text-gray-900 dark:bg-[#1a1a1a] dark:text-white">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-4" />
                    <div className="text-lg">{t("loading.text")}</div>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-[#1a1a1a]">
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
                        {t("error.title")}
                      </h2>
                      <p className="text-red-600 dark:text-red-400 mb-4">
                        {error}
                      </p>
                      <button
                        onClick={() => window.location.reload()}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition"
                      >
                        {t("error.retry")}
                      </button>
                    </div>
                  </div>
                </div>
              ) : rooms.length === 0 ? (
                // No livestreams available
                <div className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-md dark:shadow-lg p-8 text-center">
                  <div className="flex flex-col items-center">
                    <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-5 mb-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-purple-500"
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
                      {t("noLivestreams.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-5 max-w-md">
                      {t("noLivestreams.description")}
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition flex items-center"
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
                      {t("noLivestreams.refresh")}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Preview + Sidebar Layout */}
                  <div className="flex flex-col lg:flex-row gap-4 mb-8">
                    {/* Main Preview Area */}
                    {rooms.length > 0 && (
                      <div className="lg:w-2/3">
                        <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-400">
                          {t("preview.title")}
                          <span className="ml-1">
                            {rooms.find((room) => room.id === roomGuid)?.name}
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
                              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-purple-100 dark:bg-purple-900/50">
                                <Image
                                  src={`https://i.pravatar.cc/100?u=${roomGuid}`}
                                  alt="avatar"
                                  className="w-full h-full object-cover"
                                  width={100}
                                  height={100}
                                />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-white">
                                  {
                                    rooms.find((room) => room.id === roomGuid)
                                      ?.name
                                  }
                                </h3>
                                <p className="text-sm text-gray-200">
                                  {t("preview.viewers", {
                                    count: formatViewerCount(view),
                                  })}
                                </p>
                                <p className="text-xs text-gray-300">
                                  {
                                    rooms.find((room) => room.id === roomGuid)
                                      ?.clinicName
                                  }
                                </p>
                              </div>
                            </div>
                            <button
                              className="mr-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 flex items-center rounded-lg font-semibold transition duration-300"
                              onClick={() => joinRoom(roomGuid)}
                            >
                              {t("preview.joinRoom")}
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
                            {t("preview.live")}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Sidebar - Preview Selector */}
                    <div className="lg:w-1/3">
                      <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-400">
                        {rooms.length > 1
                          ? t("preview.otherStreams")
                          : t("preview.noOtherStreams")}
                      </h2>
                      {rooms.length > 1 ? (
                        <div className="flex flex-col space-y-3">
                          {rooms
                            .filter((room) => room.id !== roomGuid)
                            .slice(0, 4)
                            .map((room) => (
                              <div
                                key={`sidebar-${room.id}`}
                                className="flex bg-white dark:bg-[#2a2a2a] rounded-lg overflow-hidden shadow-md dark:shadow-lg hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 cursor-pointer border border-purple-200 dark:border-purple-800/30"
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
                                    {t("preview.live")}
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
                                      {t("preview.preview")}
                                    </button>
                                    <button
                                      className="text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-2 py-1 rounded transition ml-2"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        joinRoom(room.id);
                                      }}
                                    >
                                      {t("preview.join")}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="bg-white dark:bg-[#2a2a2a] rounded-lg p-4 text-center border border-purple-200 dark:border-purple-800/30">
                          <p className="text-gray-600 dark:text-gray-400">
                            {t("preview.noOtherStreamsDesc")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* All Livestreams Section */}
                  <div>
                    <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-400">
                      {t("allStreams.title")}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {rooms.map((room) => (
                        <div
                          key={`all-${room.id}`}
                          className="flex flex-col rounded-lg overflow-hidden bg-white dark:bg-[#2a2a2a] shadow-md dark:shadow-lg hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 border border-purple-200 dark:border-purple-800/30"
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
                              {t("preview.live")}
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
                                  {t("preview.preview")}
                                </button>
                                <button
                                  className="text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-2 py-1 rounded transition"
                                  onClick={() => joinRoom(room.id)}
                                >
                                  {t("preview.join")}
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
            </TabsContent>

            {/* Events Tab Content */}
            <TabsContent value="events">
              {eventsLoading ? (
                <div className="space-y-8">
                  {/* Skeleton for featured event */}
                  <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-gray-800/40 shadow-lg">
                    <Skeleton className="h-72 md:h-96 w-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <Skeleton className="h-8 w-3/4 mb-3" />
                      <Skeleton className="h-5 w-1/2 mb-4" />
                      <div className="flex gap-3">
                        <Skeleton className="h-10 w-32 rounded-full" />
                        <Skeleton className="h-10 w-32 rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Skeleton for search and filters */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <Skeleton className="h-10 flex-grow" />
                    <Skeleton className="h-10 w-32" />
                  </div>

                  {/* Skeleton for event cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={`skeleton-${index}`}
                        className="bg-white dark:bg-gray-800/40 rounded-xl overflow-hidden shadow-md"
                      >
                        <Skeleton className="h-48 w-full" />
                        <div className="p-5">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2 mb-4" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-full mb-4" />
                          <div className="flex justify-between">
                            <Skeleton className="h-8 w-24 rounded-full" />
                            <Skeleton className="h-8 w-24 rounded-full" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : eventsError ? (
                <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-6 rounded-xl mb-6 shadow-md">
                  <div className="flex items-center">
                    <div className="bg-red-200 dark:bg-red-800/50 p-2 rounded-full mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-red-600 dark:text-red-400"
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
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        {tEvents("fetchError")}
                      </h3>
                      <p>{eventsError}</p>
                    </div>
                  </div>
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-xl shadow-inner">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-800/20 dark:to-indigo-800/20 mb-4">
                    <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                    {tEvents("noEvents")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    {tEvents("checkBackLater")}
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Featured Event */}
                  {featuredEvent && (
                    <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-gray-800/40 shadow-lg group">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-indigo-600/10 dark:from-purple-500/20 dark:to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                      <img
                        src={
                          featuredEvent.imageUrl ||
                          "/placeholder.svg?height=600&width=1200&query=beauty event"
                        }
                        alt={featuredEvent.name}
                        className="w-full h-72 md:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-20"></div>

                      {/* Featured badge */}
                      <div className="absolute top-6 left-6 z-30">
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 px-3 py-1.5 text-sm font-medium flex items-center gap-1.5">
                          <Star className="h-3.5 w-3.5" />
                          {tEvents("featured")}
                        </Badge>
                      </div>

                      {/* Live badge */}
                      {isLive(
                        featuredEvent.startDate,
                        featuredEvent.endDate
                      ) && (
                        <div className="absolute top-6 right-6 z-30">
                          <Badge className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white border-0 px-3 py-1.5 text-sm font-medium flex items-center gap-1.5">
                            <span className="h-2 w-2 bg-white rounded-full animate-pulse"></span>
                            {tEvents("live")}
                          </Badge>
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-30">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-0">
                            {formatDateShort(featuredEvent.startDate)} •{" "}
                            {formatTimeShort(featuredEvent.startDate)}
                          </Badge>
                          <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-0">
                            {featuredEvent.clinicName}
                          </Badge>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                          {featuredEvent.name}
                        </h2>
                        <div
                          className="text-gray-200 mb-6 md:w-3/4"
                          dangerouslySetInnerHTML={{
                            __html: featuredEvent.description || "",
                          }}
                        />
                        <div className="flex flex-wrap gap-3">
                          <Button
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 rounded-full px-6"
                            onClick={() => {
                              toast.info(tEvents("joiningEvent"));
                            }}
                          >
                            {isLive(
                              featuredEvent.startDate,
                              featuredEvent.endDate
                            ) ? (
                              <span className="flex items-center gap-2">
                                <Play className="h-4 w-4" />
                                {tEvents("joinNow")}
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">
                                {tEvents("viewDetails")}
                                <ArrowRight className="h-4 w-4" />
                              </span>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            className="bg-white/10 hover:bg-white/20 text-white border-white/30 rounded-full px-6"
                            onClick={() => handleSetReminder(featuredEvent.id)}
                          >
                            <Bell className="h-4 w-4 mr-2" />
                            {tEvents("setReminder")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Search and Filters */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <form onSubmit={handleSearch} className="flex-grow">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder={tEvents("searchPlaceholder")}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-white dark:bg-gray-800/40 border-purple-200 dark:border-purple-800/30 focus:border-purple-400 dark:focus:border-purple-600"
                        />
                      </div>
                    </form>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="border-purple-200 dark:border-purple-800/30 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                        onClick={() => toast.info(tEvents("filteringEvents"))}
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        {tEvents("filter")}
                      </Button>
                    </div>
                  </div>

                  {/* Events List */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-400">
                      {tEvents("upcomingEvents")}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className="group bg-white dark:bg-gray-800/40 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
                        >
                          {/* Image */}
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={
                                event.imageUrl ||
                                "/placeholder.svg?height=400&width=600&query=beauty event"
                              }
                              alt={event.name}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                            {/* Date badge */}
                            <div className="absolute top-4 left-4 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg overflow-hidden shadow-md">
                              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center py-1 px-3 text-xs font-bold">
                                {formatDateShort(event.startDate).split(" ")[0]}
                              </div>
                              <div className="text-center py-1 px-3 text-xs font-medium">
                                {formatDateShort(event.startDate).split(" ")[1]}
                              </div>
                            </div>

                            {/* Live badge */}
                            {isLive(event.startDate, event.endDate) && (
                              <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-rose-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                                <span className="h-2 w-2 bg-white rounded-full animate-pulse"></span>
                                {tEvents("live")}
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-5 flex-grow flex flex-col justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 line-clamp-2 mb-2">
                                {event.name}
                              </h3>
                              <div
                                className="text-gray-600 dark:text-gray-400 mb-2"
                                dangerouslySetInnerHTML={{
                                  __html: event.description || "",
                                }}
                              />
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500 text-sm">
                                <MapPin className="h-4 w-4" />
                                <span>{event.clinicName}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                                  onClick={() => handleFavorite(event.id)}
                                >
                                  <Heart className="h-5 w-5" />
                                </button>
                                <button
                                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                                  onClick={() => handleShare(event.id)}
                                >
                                  <Share2 className="h-5 w-5" />
                                </button>
                                <button
                                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                                  onClick={() => handleSetReminder(event.id)}
                                >
                                  <Bell className="h-5 w-5" />
                                </button>
                                <button
                                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                                  onClick={() =>
                                    toast.info(tEvents("viewingEventDetails"))
                                  }
                                >
                                  <Eye className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pagination */}
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      disabled={!hasPreviousPage}
                      onClick={() => handlePageChange(pageIndex - 1)}
                      className="border-purple-200 dark:border-purple-800/30 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      {tEvents("previous")}
                    </Button>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {tEvents("page")} {pageIndex} {tEvents("of")}{" "}
                      {Math.ceil(totalCount / pageSize)}
                    </span>
                    <Button
                      variant="outline"
                      disabled={!hasNextPage}
                      onClick={() => handlePageChange(pageIndex + 1)}
                      className="border-purple-200 dark:border-purple-800/30 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    >
                      {tEvents("next")}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <FooterSection />
    </div>
  );
}
