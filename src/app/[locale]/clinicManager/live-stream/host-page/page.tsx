"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as signalR from "@microsoft/signalr";
import HostPageStreamScreen from "@/components/clinicManager/livestream/host-page-stream-screen";
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils";

// Define types for our data structures
interface AnalyticsData {
  joinCount: number;
  messageCount: number;
  reactionCount: number;
  totalActivities: number;
  totalBooking: number;
}

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

interface RoomData {
  name: string;
  description: string;
  image: string;
}

interface ReactionMapItem {
  emoji: string;
  text: string;
}

export default function HostPage() {
  const router = useRouter();
  const signalR_Connection = useRef<signalR.HubConnection | null>(null);
  const analyst = useRef<AnalyticsData>({
    joinCount: 0,
    messageCount: 0,
    reactionCount: 0,
    totalActivities: 0,
    totalBooking: 0,
  });
  const sessionIdRef = useRef<string | null>(null);
  const roomGuidRef = useRef<string | null>(null);
  const janusRoomIdRef = useRef<string | null>(null);
  const [view, setView] = useState<number>(0);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [isCreateRoom, setIsCreateRoom] = useState<boolean>(false);
  const [isPublish, setIsPublish] = useState<boolean>(false);
  const [chatMessage, setChatMessage] = useState<ChatMessage[]>([]);
  const [activeReactions, setActiveReactions] = useState<Reaction[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [showAnalyticsPopup, setShowAnalyticsPopup] = useState<boolean>(false);
  const token = getAccessToken();
  const tokenData = token ? (GetDataByToken(token) as TokenData) : null;
  const clinicId = tokenData?.clinicId || "";
  const userId = tokenData?.userId || "";

  const fetchServices = async (): Promise<void> => {
    try {
      const response = await fetch(
        `https://api.beautify.asia/signaling-api/LiveStream/Services?clinicId=${clinicId}&userId=${userId}&roomId=${roomGuidRef.current}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.isSuccess) {
        const services = data.value.map((service: any) => ({
          ...service,
          visible: false,
        }));
        setServices(services);
      } else {
        console.error("Failed to fetch services:", data.message);
      }
    } catch (err: any) {
      console.error("Error fetching services:", err.message);
    }
  };

  // Define the reactions map
  const reactionsMap: Record<number, ReactionMapItem> = {
    1: { emoji: "👍", text: "Looks great!" },
    2: { emoji: "❤️", text: "Love it!" },
    3: { emoji: "🔥", text: "That's fire!" },
    4: { emoji: "👏", text: "Amazing work!" },
    5: { emoji: "😍", text: "Beautiful!" },
  };

  useEffect(() => {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(
        `https://api.beautify.asia/signaling-api/LivestreamHub?clinicId=${clinicId}&userId=${userId}`,
        {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        }
      )
      .withAutomaticReconnect([0, 2000, 5000, 10000, 15000, 30000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Add connection error handler
    conn.onclose((error) => {
      console.error("SignalR connection closed", error);
      if (error) {
        console.log("Attempting to reconnect...");
      }
    });

    conn.start().then(() => {
      console.log("✅ Connected to SignalR");

      // Now set ref clearly (guaranteed connected)
      signalR_Connection.current = conn;

      if (roomGuidRef.current == null) {
        // Check if we have pending room data to create
        const pendingRoomDataString = sessionStorage.getItem("livestreamData");
        console.log(pendingRoomDataString);
        if (pendingRoomDataString) {
          try {
            const pendingRoomData = JSON.parse(pendingRoomDataString);
            // Clear the sessionStorage
            sessionStorage.removeItem("pendingRoomData");
            // Create the room
            conn.invoke("HostCreateRoom", pendingRoomData);
          } catch (error) {
            console.error("Error parsing pending room data:", error);
          }
        }
      }

      conn.on(
        "RoomCreatedAndJoined",
        async ({
          roomGuid,
          janusRoomId,
          sessionId,
        }: {
          roomGuid: string;
          janusRoomId: string;
          sessionId: string;
        }) => {
          console.log("✅ RoomCreatedAndJoined:", roomGuid, janusRoomId);
          sessionIdRef.current = sessionId;
          roomGuidRef.current = roomGuid;
          janusRoomIdRef.current = janusRoomId;
          setIsCreateRoom(true);
        }
      );

      conn.on(
        "PublishStarted",
        async ({ sessionId, jsep }: { sessionId: string; jsep: string }) => {
          if (peerConnectionRef.current) {
            sessionIdRef.current = sessionId;
            await peerConnectionRef.current.setRemoteDescription(
              new RTCSessionDescription({
                type: "answer",
                sdp: jsep,
              })
            );
            setIsPublish(true);
          }
        }
      );

      conn.on("ListenerCountUpdated", async (viewCount: number) => {
        setView(viewCount);
      });

      conn.on("ReceiveMessage", async (message: ChatMessage) => {
        setChatMessage((prev) => [...prev, message]);
      });

      conn.on("ReceiveReaction", async ({ id }: { id: string | number }) => {
        console.log("Received reaction ID:", id);

        // Convert to number if it's a string
        const reactionId =
          typeof id === "string" ? Number.parseInt(id, 10) : (id as number);

        if (reactionsMap[reactionId]) {
          const reaction: Reaction = {
            id: reactionId,
            emoji: reactionsMap[reactionId].emoji,
            left: Math.floor(Math.random() * 70) + 10, // Random position 10-80% from left
            key: `reaction-${Date.now()}-${Math.random()
              .toString(36)
              .substring(2, 9)}`, // Unique key
          };

          console.log("Adding new reaction:", reaction);
          setActiveReactions((prev) => [...prev, reaction]);

          // Remove the reaction after animation completes
          setTimeout(() => {
            setActiveReactions((prev) =>
              prev.filter((r) => r.key !== reaction.key)
            );
          }, 3000);
        } else {
          console.warn("Received unknown reaction ID:", reactionId);
        }
      });

      conn.on(
        "LivestreamEnded",
        async ({
          joinCount,
          messageCount,
          reactionCount,
          totalActivities,
          totalBooking,
        }: {
          joinCount: number;
          messageCount: number;
          reactionCount: number;
          totalActivities: number;
          totalBooking: number;
        }) => {
          // Update the analyst ref with the latest data
          analyst.current = {
            joinCount: joinCount || 0,
            messageCount: messageCount || 0,
            reactionCount: reactionCount || 0,
            totalActivities: totalActivities || 0,
            totalBooking: totalBooking || 0,
          };

          console.log("Livestream analytics:", analyst.current);

          // Show the analytics popup
          setShowAnalyticsPopup(true);

          // Clean up UI state (if needed)
          setIsCreateRoom(false);
          setIsPublish(false);
          setView(0);
          setChatMessage([]);

          // ✅ Stop and reset local video stream
          if (localVideoRef.current?.srcObject) {
            const stream = localVideoRef.current.srcObject as MediaStream;
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop()); // Stop each track (audio + video)
            localVideoRef.current.srcObject = null; // Remove stream reference
          }

          // ✅ Cleanup peer connection
          if (peerConnectionRef.current) {
            peerConnectionRef.current.getSenders().forEach((sender) => {
              peerConnectionRef.current?.removeTrack(sender);
            });
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
          }

          // ✅ Reset connection states
          roomGuidRef.current = null;
          janusRoomIdRef.current = null;
          sessionIdRef.current = null;

          // Navigate back to the livestream page
          router.push("/clinicManager/live-stream");
        }
      );

      conn.on(
        "UpdateServicePromotion",
        async ({
          id,
          discountLivePercent,
        }: {
          id: string;
          discountLivePercent: number;
        }) => {
          setServices((prev) =>
            prev.map((service) =>
              service.id === id ? { ...service, discountLivePercent } : service
            )
          );
        }
      );

      conn.on("JanusError", async (message) => {
        console.error("🚨 Janus Error:", message);
        alert(`Error: ${message}`);
      });

      conn.on(
        "ServiceDisplayUpdated",
        async ({ id, isVisible }: { id: string; isVisible: boolean }) => {
          setServices((prev) =>
            prev.map((service) =>
              service.id === id ? { ...service, visible: isVisible } : service
            )
          );
        }
      );
    });

    // return () => {
    //   if (conn && conn.state === signalR.HubConnectionState.Connected) {
    //     conn
    //       .stop()
    //       .catch((err) => console.error("Error stopping connection:", err));
    //   }
    // };
  }, []);

  // const createRoom = (roomData: RoomData): void => {
  //   if (
  //     signalR_Connection.current?.state === signalR.HubConnectionState.Connected
  //   ) {
  //     signalR_Connection.current.invoke("HostCreateRoom", roomData);
  //   } else {
  //     alert("🚨 SignalR connection not ready yet!");
  //   }
  // };

  const endLive = (): void => {
    if (!signalR_Connection.current) {
      console.error("SignalR connection is not established");
      alert("Cannot end livestream: Connection not established");
      return;
    }

    if (
      signalR_Connection.current.state !== signalR.HubConnectionState.Connected
    ) {
      console.error(
        "SignalR connection is not in Connected state:",
        signalR_Connection.current.state
      );
      alert("Cannot end livestream: Connection not ready");
      return;
    }

    if (!roomGuidRef.current) {
      console.error("Room GUID is missing");
      alert("Cannot end livestream: Room ID is missing");
      return;
    }

    console.log("Ending livestream for room:", roomGuidRef.current);

    // Use the simple approach that works in the reference implementation
    signalR_Connection.current
      .invoke("EndLivestream", roomGuidRef.current)
      .then(() => {
        console.log("EndLivestream request sent successfully");
      })
      .catch((err) => {
        console.error("Error ending livestream:", err);
        alert(
          `Error ending livestream: ${
            err.message || "Unknown error"
          }. Please try refreshing the page.`
        );

        // Even if the server call fails, try to clean up client-side resources
        if (localVideoRef.current?.srcObject) {
          const stream = localVideoRef.current.srcObject as MediaStream;
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
          localVideoRef.current.srcObject = null;
        }

        if (peerConnectionRef.current) {
          peerConnectionRef.current.close();
          peerConnectionRef.current = null;
        }

        // Ask if the user wants to return to the main page
        if (confirm("Would you like to return to the main page?")) {
          router.push("/clinicManager/live-stream");
        }
      });
  };

  const sendMessage = async (message: string): Promise<void> => {
    if (
      signalR_Connection.current?.state ===
        signalR.HubConnectionState.Connected &&
      roomGuidRef.current != null
    ) {
      if (message) {
        signalR_Connection.current.invoke(
          "SendMessage",
          roomGuidRef.current,
          message
        );
      }
    }
  };

  const startPublishing = async (): Promise<void> => {
    if (
      signalR_Connection.current?.state === signalR.HubConnectionState.Connected
    ) {
      try {
        const constraints: MediaStreamConstraints = {
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30, max: 60 },
          } as MediaTrackConstraints,
          audio: true,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const peerConnection = new RTCPeerConnection();

        stream.getTracks().forEach((track) => {
          const sender = peerConnection.addTrack(track, stream);
          if (track.kind === "video") {
            const parameters = sender.getParameters();
            if (!parameters.encodings) {
              parameters.encodings = [{}];
            }
            parameters.encodings[0].maxBitrate = 3000000;
            sender.setParameters(parameters);
          }
        });

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        peerConnectionRef.current = peerConnection;

        if (roomGuidRef.current && offer.sdp) {
          signalR_Connection.current.invoke(
            "StartPublish",
            roomGuidRef.current,
            offer.type,
            offer.sdp
          );
        }
      } catch (error) {
        console.error("🚨 Error starting publishing:", error);
      }
    } else {
      alert("🚨 SignalR connection not ready yet!");
    }
  };

  const setPromotionService = async (
    serviceId: string,
    percent: string | number
  ): Promise<void> => {
    if (
      signalR_Connection.current?.state ===
        signalR.HubConnectionState.Connected &&
      roomGuidRef.current != null
    ) {
      if (serviceId && percent) {
        signalR_Connection.current.invoke(
          "SetPromotionService",
          serviceId,
          roomGuidRef.current,
          typeof percent === "string" ? Number.parseInt(percent, 10) : percent
        );
      }
    }
  };

  const displayService = async (
    serviceId: string,
    isDisplay = true
  ): Promise<void> => {
    if (
      signalR_Connection.current?.state ===
        signalR.HubConnectionState.Connected &&
      roomGuidRef.current != null
    ) {
      if (serviceId) {
        // First update local state to prevent UI from breaking
        setServices((prev) =>
          prev.map((service) =>
            service.id === serviceId
              ? { ...service, visible: isDisplay }
              : service
          )
        );

        // Then send to server
        signalR_Connection.current.invoke(
          "DisplayService",
          serviceId,
          roomGuidRef.current,
          Boolean(isDisplay)
        );
      }
    }
  };

  const getAnalyticsData = (): AnalyticsData => {
    return analyst.current;
  };

  useEffect(() => {
    const keepAliveInterval = setInterval(() => {
      if (
        sessionIdRef.current &&
        signalR_Connection.current &&
        signalR_Connection.current.state ===
          signalR.HubConnectionState.Connected &&
        isCreateRoom
      ) {
        console.log("alive");
        signalR_Connection.current.invoke("KeepAlive", sessionIdRef.current);
      }
    }, 25000);

    return () => clearInterval(keepAliveInterval);
  }, [isCreateRoom]);

  const closeAnalyticsPopup = () => {
    setShowAnalyticsPopup(false);
    // Navigate back to the livestream page
    router.push("/clinicManager/live-stream");
  };

  return (
    <>
      {/* Analytics Popup - Only shown after a livestream ends */}
      {showAnalyticsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-xl shadow-xl max-w-5xl mx-auto relative">
            <button
              onClick={closeAnalyticsPopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-1">Hiệu Suất Livestream</h2>
              <p className="text-gray-400">
                Tổng quan về tương tác livestream gần đây của bạn
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Viewers Card */}
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex items-center">
                <div className="p-3 bg-blue-500/20 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Tổng Số Người Xem</p>
                  <p className="text-2xl font-bold">
                    {analyst.current.joinCount}
                  </p>
                </div>
              </div>

              {/* Messages Card */}
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex items-center">
                <div className="p-3 bg-purple-500/20 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-purple-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Tin Nhắn Chat</p>
                  <p className="text-2xl font-bold">
                    {analyst.current.messageCount}
                  </p>
                </div>
              </div>

              {/* Reactions Card */}
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex items-center">
                <div className="p-3 bg-pink-500/20 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-pink-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Biểu Cảm</p>
                  <p className="text-2xl font-bold">
                    {analyst.current.reactionCount}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-6">
              {/* Total Activities Card */}
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex items-center">
                <div className="p-3 bg-green-500/20 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Tổng Tương Tác</p>
                  <p className="text-2xl font-bold">
                    {analyst.current.totalActivities}
                  </p>
                </div>
              </div>

              {/* Bookings Card - Changed to match width of other cards */}
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex items-center">
                <div className="p-3 bg-amber-500/20 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-amber-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Dịch Vụ Đã Đặt</p>
                  <p className="text-2xl font-bold">
                    {analyst.current.totalBooking}
                  </p>
                  <p className="text-xs text-amber-400 font-semibold mt-1">
                    {analyst.current.totalBooking > 0
                      ? "✅ Đã tạo doanh thu!"
                      : "Chưa có đặt dịch vụ"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={closeAnalyticsPopup}
                className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-lg transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Livestream Screen */}
      {isCreateRoom && !showAnalyticsPopup && (
        <HostPageStreamScreen
          view={view}
          localVideoRef={localVideoRef}
          startPublishing={startPublishing}
          isPublish={isPublish}
          endLive={endLive}
          chatMessage={chatMessage}
          sendMessage={sendMessage}
          activeReactions={activeReactions}
          setPromotionService={setPromotionService}
          services={services}
          fetchServices={fetchServices}
          setServices={setServices}
          displayService={displayService}
          analyticsData={analyst.current}
          getAnalyticsData={getAnalyticsData}
        />
      )}
    </>
  );
}
