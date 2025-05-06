"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useRouter, useParams } from "next/navigation";
import {
  Heart,
  ThumbsUp,
  Flame,
  Smile,
  ClipboardCheck,
  Send,
  Users,
  MessageSquare,
  ShoppingBag,
  X,
  AlertTriangle,
  EyeOff,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useTranslations } from "next-intl";
import { getAccessToken } from "@/utils";

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

/* Service card animations */
@keyframes slideIn {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.service-card {
  animation: slideIn 0.5s ease-out forwards;
}

/* Pulse animation for discount badge */
@keyframes pulsate {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.discount-badge {
  animation: pulsate 2s infinite ease-in-out;
}

/* Horizontal scroll for services */
.services-container {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.services-container::-webkit-scrollbar {
  display: none;  /* Chrome, Safari, Opera */
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
  discountPercent: number;
  images?: string[];
}

interface LivestreamInfo {
  id: string;
  name: string;
  clinicName: string;
  startDate: string;
  description?: string;
}

export default function LivestreamRoomPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const token = getAccessToken() as string;
  const [view, setView] = useState<number>(0);
  const signalR_Connection = useRef<signalR.HubConnection | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const [chatMessage, setChatMessage] = useState<ChatMessage[]>([]);
  const [text, setText] = useState<string>("");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [userScrolled, setUserScrolled] = useState<boolean>(false);
  const [activeReactions, setActiveReactions] = useState<Reaction[]>([]);
  const [isJoinRoom, setIsJoinRoom] = useState<boolean>(false);
  const [displayServices, setDisplayServices] = useState<Service[]>([]);
  const [showChat, setShowChat] = useState<boolean>(true);
  const [showServices, setShowServices] = useState<boolean>(true);
  const [livestreamInfo, setLivestreamInfo] = useState<LivestreamInfo | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("connecting");
  const [securityError, setSecurityError] = useState<boolean>(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [isBrowser, setIsBrowser] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state?.auth?.user);
  // State to track hidden services
  const [hiddenServices, setHiddenServices] = useState<Set<string>>(new Set());
  const [showHiddenServices, setShowHiddenServices] = useState<boolean>(false);

  // Reference to avoid multiple join attempts
  const joinAttemptedRef = useRef<boolean>(false);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const t = useTranslations("livestreamRoomMessages");
  // Define the reactions map
  const reactionsMap: Record<
    number,
    { emoji: string; text: string; icon: React.ReactNode }
  > = {
    1: {
      emoji: "👍",
      text: t("chat.reactions.types.thumbsUp"),
      icon: <ThumbsUp className="h-4 w-4" />,
    },
    2: {
      emoji: "❤️",
      text: t("chat.reactions.types.heart"),
      icon: <Heart className="h-4 w-4" />,
    },
    3: {
      emoji: "🔥",
      text: t("chat.reactions.types.fire"),
      icon: <Flame className="h-4 w-4" />,
    },
    4: {
      emoji: "👏",
      text: t("chat.reactions.types.amazing"),
      icon: <ClipboardCheck className="h-4 w-4" />,
    },
    5: {
      emoji: "😍",
      text: t("chat.reactions.types.beautiful"),
      icon: <Smile className="h-4 w-4" />,
    },
  };

  // Check if we're in the browser environment
  useEffect(() => {
    setIsBrowser(true);
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  // Fetch livestream info
  useEffect(() => {
    if (!isBrowser || !id) return;

    const fetchLivestreamInfo = async () => {
      try {
        // In a real app, you would fetch this from your API
        const roomJson = localStorage.getItem("selectedRoom");
        const room = roomJson ? JSON.parse(roomJson) : null;

        setLivestreamInfo({
          id: room?.id,
          name: room?.name,
          clinicName: room?.clinicName,
          startDate: room?.startDate,
          description: room?.description,
        });
      } catch (error) {
        console.error("Error fetching livestream info:", error);
        console.debug(
          `Error fetching livestream info: ${
            error instanceof Error ? error.message : String(error)
          }`
        );

        // Fallback data
        // setLivestreamInfo({
        //   id: id,
        //   name: t("livestreamInfo.name", {
        //     name: t("livestreamInfo.defaultName"),
        //   }),
        //   clinicName: t("livestreamInfo.clinicName"),
        //   startDate: new Date().toISOString(),
        //   description: t("livestreamInfo.description"),
        // });
      }
    };

    fetchLivestreamInfo();
  }, [id, isBrowser]);

  // Setup SignalR connection
  useEffect(() => {
    if (!isBrowser || !id || !isMounted) return;

    let isComponentMounted = true;
    setIsLoading(true);
    setConnectionStatus(t("connection.connecting"));
    console.log("Initializing SignalR connection...");

    // Check if we're using HTTPS
    const isSecureContext = window.isSecureContext;
    const protocol = window.location.protocol;
    console.log(
      `Current protocol: ${protocol}, Secure context: ${isSecureContext}`
    );

    if (protocol !== "https:") {
      console.log(
        "Warning: Using insecure connection (HTTP). This may cause issues with media streaming."
      );
    }

    // Clean up previous connection
    if (signalR_Connection.current) {
      console.log("Cleaning up previous SignalR connection");
      signalR_Connection.current
        .stop()
        .catch((err) => console.error("Error stopping connection:", err));
      signalR_Connection.current = null;
    }

    // Clean up previous video stream
    if (videoRef.current?.srcObject) {
      console.log("Cleaning up previous video stream");
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    // Clean up previous peer connection
    if (peerConnectionRef.current) {
      console.log("Cleaning up previous peer connection");
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    sessionIdRef.current = null;
    setIsJoinRoom(false);
    joinAttemptedRef.current = false;

    // Try to use HTTPS for the SignalR connection
    const baseUrl = "https://api.beautify.asia/signaling-api/LivestreamHub";
    console.log(`Connecting to: ${baseUrl}`);

    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}?userId=${user?.userId}`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 15000, 30000]) // More aggressive reconnection strategy
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Add connection closed handler
    conn.onclose((error) => {
      console.log("SignalR connection closed", error);
      console.debug(
        `Connection closed: ${error ? error.message : "No error details"}`
      );

      // Try to reconnect if component is still mounted
      if (isComponentMounted && error) {
        console.debug("Attempting to reconnect in 5 seconds...");
        setTimeout(() => {
          if (isComponentMounted) {
            console.debug("Reconnecting...");
            // The reconnection will be handled by the cleanup and re-run of this effect
          }
        }, 5000);
      }
    });

    conn
      .start()
      .then(() => {
        console.log("✅ Connected to SignalR");
        setConnectionStatus(t("connection.connected"));

        if (!isComponentMounted) {
          console.debug("Component unmounted during connection, stopping");
          conn
            .stop()
            .catch((err) =>
              console.error("Error stopping connection after unmount:", err)
            );
          return;
        }

        signalR_Connection.current = conn;

        // Join as listener immediately after connection is established
        if (id && !joinAttemptedRef.current) {
          joinAttemptedRef.current = true;
          console.log(`Joining room as listener: ${id}`);
          conn.invoke("JoinAsListener", id).catch((err) => {
            console.debug(`Error invoking JoinAsListener: ${err.message}`);
            setConnectionStatus(t("connection.error"));

            // If we fail to join, try again after a delay
            if (isComponentMounted) {
              setTimeout(() => {
                if (
                  conn.state === signalR.HubConnectionState.Connected &&
                  isComponentMounted
                ) {
                  console.debug("Retrying JoinAsListener...");
                  conn.invoke("JoinAsListener", id).catch((e) => {
                    console.debug(`Error in retry join: ${e.message}`);
                  });
                }
              }, 3000);
            }
          });
        } else {
          console.debug(
            "Join already attempted, skipping duplicate join request"
          );
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
            console.log("Received JoinRoomResponse");
            if (jsep && isComponentMounted) {
              try {
                console.log("Creating RTCPeerConnection");
                // Use an empty configuration to avoid STUN/TURN server issues
                const pc = new RTCPeerConnection({
                  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
                });

                pc.onicecandidate = (event) => {
                  console.log(
                    `ICE candidate: ${event.candidate ? "generated" : "null"}`
                  );
                };

                pc.oniceconnectionstatechange = () => {
                  console.log(`ICE connection state: ${pc.iceConnectionState}`);
                };

                pc.onsignalingstatechange = () => {
                  console.log(`Signaling state: ${pc.signalingState}`);
                };

                pc.ontrack = (event) => {
                  console.log(`Track received: ${event.track.kind}`);
                  if (videoRef.current) {
                    videoRef.current.srcObject = event.streams[0];
                    setIsLoading(false);
                    console.log("Video stream attached to element");

                    // Make sure audio is enabled
                    videoRef.current.muted = false;
                    videoRef.current.volume = 1.0;

                    // Add event listeners to debug video playback
                    videoRef.current.onloadedmetadata = () => {
                      console.log("Video metadata loaded");
                      if (videoRef.current) {
                        // Double-check audio is enabled
                        videoRef.current.muted = false;
                        videoRef.current.volume = 1.0;

                        videoRef.current
                          .play()
                          .then(() => {
                            console.log(
                              "Video playback started with audio enabled"
                            );
                            // Ensure audio is unmuted after autoplay
                            if (videoRef.current) {
                              videoRef.current.muted = false;
                            }
                          })
                          .catch((e) => {
                            console.log(`Error playing video: ${e.message}`);
                            // Try again with muted flag for autoplay, then unmute
                            if (videoRef.current) {
                              videoRef.current.muted = true;
                              videoRef.current
                                .play()
                                .then(() => {
                                  console.log(
                                    "Video playback started (initially muted)"
                                  );
                                  // Unmute after successful autoplay
                                  setTimeout(() => {
                                    if (videoRef.current) {
                                      videoRef.current.muted = false;
                                      console.log(
                                        "Audio unmuted after autoplay"
                                      );
                                    }
                                  }, 1000);
                                })
                                .catch((e2) =>
                                  console.log(
                                    `Still can't play video: ${e2.message}`
                                  )
                                );
                            }
                          });
                      }
                    };
                  } else {
                    console.log(
                      "Video element reference is null or no streams available"
                    );
                  }
                };

                console.log("Setting remote description");
                await pc.setRemoteDescription(
                  new RTCSessionDescription({ type: "offer", sdp: jsep })
                );

                console.log("Creating answer");
                const answer = await pc.createAnswer();

                console.log("Setting local description");
                await pc.setLocalDescription(answer);

                // Store the peer connection reference
                peerConnectionRef.current = pc;

                if (
                  conn.state === signalR.HubConnectionState.Connected &&
                  isComponentMounted
                ) {
                  console.log("Sending answer to Janus");
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
                      console.debug(`Error sending answer: ${err.message}`);

                      // Try again after a delay
                      setTimeout(() => {
                        if (
                          conn.state === signalR.HubConnectionState.Connected &&
                          isComponentMounted
                        ) {
                          console.debug("Retrying SendAnswerToJanus...");
                          conn
                            .invoke(
                              "SendAnswerToJanus",
                              roomId,
                              sessionId,
                              handleId,
                              answer.sdp
                            )
                            .catch((e) =>
                              console.debug(
                                `Error in retry send answer: ${e.message}`
                              )
                            );
                        }
                      }, 2000);
                    });
                } else {
                  console.debug(
                    "SignalR connection not ready or component unmounted"
                  );
                }
              } catch (error) {
                console.debug(
                  `WebRTC error: ${
                    error instanceof Error ? error.message : String(error)
                  }`
                );
                setConnectionStatus(t("connection.error"));
              }
            } else {
              console.debug("No JSEP in JoinRoomResponse");
            }
          }
        );

        conn.on("ListenerCountUpdated", async (viewCount: number) => {
          if (isComponentMounted) {
            setView(viewCount);
          }
        });

        conn.on("ReceiveMessage", async (message: ChatMessage) => {
          if (isComponentMounted) {
            setChatMessage((prev) => [...prev, message]);
          }
        });

        conn.on("ReceiveReaction", async ({ id }: { id: string | number }) => {
          if (!isComponentMounted) return;

          const reactionId =
            typeof id === "string" ? Number.parseInt(id, 10) : (id as number);

          if (reactionsMap[reactionId]) {
            const reaction: Reaction = {
              id: reactionId,
              emoji: reactionsMap[reactionId].emoji,
              left: Math.floor(Math.random() * 70) + 10,
              key: `reaction-${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 9)}`,
            };

            setActiveReactions((prev) => [...prev, reaction]);

            setTimeout(() => {
              if (isComponentMounted) {
                setActiveReactions((prev) =>
                  prev.filter((r) => r.key !== reaction.key)
                );
              }
            }, 3000);
          }
        });

        conn.on("LivestreamEnded", async () => {
          console.log("Livestream has ended");
          if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
            videoRef.current.srcObject = null;
          }

          sessionIdRef.current = null;

          if (isComponentMounted) {
            setChatMessage([]);
            setIsJoinRoom(false);
            alert(t("connection.error.message"));
            router.push(`/livestream-view`);
          }
        });

        conn.on(
          "DisplayService",
          async ({
            id,
            isDisplay,
            service,
          }: {
            id: string;
            isDisplay: boolean;
            service: Service;
          }) => {
            if (!isComponentMounted) return;

            if (isDisplay) {
              setDisplayServices((prev) => [...prev, service]);
            } else {
              setDisplayServices((prev) => prev.filter((s) => s.id !== id));
            }
          }
        );

        conn.on("JanusError", async (message: string) => {
          console.debug(`Janus Error: ${message}`);
          setConnectionStatus(t("connection.error"));
        });
      })
      .catch((err) => {
        console.error("Failed to connect to SignalR:", err);
        console.debug(`SignalR connection error: ${err.message}`);
        setConnectionStatus(t("connection.error"));
        setIsLoading(false);

        // Check if this is a security-related error
        if (
          err.message &&
          (err.message.includes("security") ||
            err.message.includes("secure") ||
            err.message.includes("mixed content") ||
            err.message.includes("certificate"))
        ) {
          setSecurityError(true);
        }
      });

    return () => {
      isComponentMounted = false;

      // Clean up connection when component unmounts
      if (conn && conn.state === signalR.HubConnectionState.Connected) {
        console.log("Stopping SignalR connection (component unmounting)");
        conn
          .stop()
          .catch((err) => console.error("Error stopping connection:", err));
      }

      // Clean up peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      // Clean up video stream
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [id, isBrowser, isMounted, router]);

  // Keep alive interval
  useEffect(() => {
    if (!isBrowser || !isMounted) return;

    const keepAliveInterval = setInterval(() => {
      if (
        sessionIdRef.current &&
        signalR_Connection.current &&
        signalR_Connection.current.state ===
          signalR.HubConnectionState.Connected &&
        isJoinRoom
      ) {
        console.log("Sending keep alive");
        signalR_Connection.current
          .invoke("KeepAlive", sessionIdRef.current)
          .catch((err) => console.debug(`Keep alive error: ${err.message}`));
      }
    }, 25000);

    return () => clearInterval(keepAliveInterval);
  }, [isJoinRoom, isBrowser, isMounted]);

  // Chat scroll handling
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

  // Initial scroll to bottom
  useEffect(() => {
    if (isBrowser) {
      scrollToBottom();
    }
  }, [isBrowser]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messagesEndRef.current && !userScrolled) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessage, userScrolled]);

  // Send message function
  const sendMessage = async (message: string) => {
    if (
      signalR_Connection.current?.state ===
        signalR.HubConnectionState.Connected &&
      id != null &&
      message.trim()
    ) {
      signalR_Connection.current
        .invoke("SendMessage", id, message)
        .catch((err) => console.debug(`Error sending message: ${err.message}`));

      // Clear the input field
      setText("");
    }
  };

  // Send reaction function
  const sendReaction = (reaction: number) => {
    if (
      signalR_Connection.current?.state ===
        signalR.HubConnectionState.Connected &&
      id != null
    ) {
      signalR_Connection.current
        .invoke("SendReaction", id, reaction)
        .catch((err) =>
          console.debug(`Error sending reaction: ${err.message}`)
        );
    }
  };

  // Hide service function
  const hideService = (serviceId: string) => {
    setHiddenServices((prev) => {
      const newSet = new Set(prev);
      newSet.add(serviceId);
      return newSet;
    });
  };

  // Restore service function
  const restoreService = (serviceId: string) => {
    setHiddenServices((prev) => {
      const newSet = new Set(prev);
      newSet.delete(serviceId);
      return newSet;
    });
  };

  // Restore all services function
  const restoreAllServices = () => {
    setHiddenServices(new Set());
  };

  // Helper function to format price in Vietnamese currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (
    originalPrice: number,
    discountPercent: number
  ) => {
    return originalPrice * (1 - discountPercent);
  };

  // Helper function to get service category icon
  const getCategoryIcon = (categoryName?: string) => {
    if (!categoryName) return "🧖";

    const name = categoryName.toLowerCase();
    if (name.includes("facial")) return "✨";
    if (name.includes("massage")) return "💆";
    if (name.includes("hair")) return "💇";
    if (name.includes("nail")) return "💅";
    return "🧖";
  };

  // Format date for better readability
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Filter services to not show the ones the user has hidden
  const visibleServices = displayServices.filter(
    (service) => !hiddenServices.has(service.id)
  );
  const hiddenServicesList = displayServices.filter((service) =>
    hiddenServices.has(service.id)
  );

  if (!isBrowser) {
    return null; // Return nothing during SSR
  }

  return (
    <>
      <style>{reactionAnimationStyle}</style>

      <div className="flex flex-col h-screen bg-gray-100 overflow-hidden font-sans">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-rose-100 py-3 px-4">
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-rose-700">
                {livestreamInfo?.name
                  ? t("livestreamInfo.name", { name: livestreamInfo.name })
                  : t("livestreamInfo.defaultName")}
              </h1>
              <p className="text-sm text-gray-600">
                {livestreamInfo?.clinicName ||
                  t("livestreamInfo.clinicName", {
                    clinicName: livestreamInfo?.clinicName,
                  })}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-rose-50 px-3 py-1 rounded-full">
                <Users className="h-4 w-4 text-rose-600 mr-1" />
                <span className="text-sm font-medium text-rose-600">
                  {t("header.viewers", { count: view })}
                </span>
              </div>
              <button
                onClick={() => router.push("/livestream-view")}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Main content area - using a 60/40 split */}
          <div className="w-3/5 h-full relative bg-black">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500 mb-4"></div>
                  <p className="text-lg">{t("connection.connecting")}</p>
                  <p className="text-sm mt-2 text-gray-300">
                    {t("connection.status", { status: connectionStatus })}
                  </p>

                  {securityError && (
                    <div className="mt-4 bg-red-900 bg-opacity-50 p-4 rounded-lg max-w-md">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                        <h3 className="text-yellow-400 font-medium">
                          {t("connection.error.security.title")}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-200 mb-2">
                        {t("connection.error.security.message")}
                      </p>
                      <p className="text-sm text-gray-200">
                        {t("connection.error.security.backButton")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : connectionStatus === "error" ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white bg-black bg-opacity-70 p-8 rounded-lg max-w-md">
                  <div className="bg-red-500 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <X className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {t("connection.error.title")}
                  </h3>
                  <p className="mb-4">{t("connection.error.message")}</p>

                  {securityError && (
                    <div className="mb-4 bg-red-900 bg-opacity-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                        <h3 className="text-yellow-400 font-medium">
                          {t("connection.error.security.title")}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-200">
                        {t("connection.error.security.message")}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => router.push("/livestream-view")}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    {t("connection.error.backButton")}
                  </button>
                </div>
              </div>
            ) : null}

            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-contain rounded-lg pointer-events-none touch-none"
            />

            {/* Livestream info overlay */}
            {livestreamInfo && (
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 backdrop-blur-sm text-white px-4 py-2 rounded-lg max-w-md">
                <h2 className="font-medium">{livestreamInfo.name}</h2>
                {livestreamInfo.description && (
                  <p className="text-sm text-gray-200 mt-1">
                    {livestreamInfo.description}
                  </p>
                )}
                <p className="text-xs text-gray-300 mt-1">
                  {t("livestreamInfo.startedAt", {
                    date: formatDate(livestreamInfo.startDate),
                  })}
                </p>
              </div>
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

            {/* Enhanced Service Display - Horizontal Layout */}
            {visibleServices.length > 0 && showServices && (
              <div className="absolute bottom-4 left-0 right-0 px-4 z-10">
                <div className="services-container flex overflow-x-auto space-x-3 pb-2">
                  {visibleServices.map((service, index) => (
                    <div
                      key={`service-${index}-${service.id}`}
                      className="service-card flex-shrink-0 bg-white rounded-xl shadow-lg overflow-hidden w-[28%]"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Service Header with Icon and Name */}
                      <div className="relative">
                        {/* Button to hide the service */}
                        <button
                          onClick={() => hideService(service.id)}
                          className="absolute top-2 right-2 bg-white bg-opacity-70 p-1 rounded-full hover:bg-opacity-100 transition-all z-10"
                          title={t("services.actions.hide")}
                        >
                          <EyeOff className="h-4 w-4 text-gray-600" />
                        </button>

                        {/* Discount Badge - Top Right */}
                        {service.discountPercent > 0 && (
                          <div className="absolute top-2 left-2 bg-red-100 text-red-600 px-2 py-1 rounded-lg text-xs font-bold discount-badge">
                            {t("services.discount", {
                              percent: service.discountPercent * 100,
                            })}
                          </div>
                        )}

                        <div className="p-3 pb-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center mr-2 flex-shrink-0">
                              <span className="text-lg">
                                {service.images && service.images.length > 0
                                  ? "🖼️"
                                  : getCategoryIcon(service.category?.name)}
                              </span>
                            </div>
                            <h3 className="font-bold text-rose-800 text-sm truncate">
                              {service.name}
                            </h3>
                          </div>
                        </div>
                      </div>

                      {/* Price Information */}
                      <div className="px-3 pb-2">
                        {service.discountPercent > 0 ? (
                          <>
                            <div className="flex items-center">
                              <span className="text-xs text-gray-600 line-through mr-2">
                                {formatPrice(service.maxPrice)}
                              </span>
                              <span className="font-semibold text-rose-600 text-sm">
                                {formatPrice(
                                  calculateDiscountedPrice(
                                    service.maxPrice,
                                    service.discountPercent
                                  )
                                )}
                              </span>
                            </div>
                            {service.minPrice !== service.maxPrice && (
                              <div className="text-xs text-gray-600 mt-1">
                                {t("services.price.range", {
                                  min: formatPrice(
                                    calculateDiscountedPrice(
                                      service.minPrice,
                                      service.discountPercent
                                    )
                                  ),
                                  max: formatPrice(
                                    calculateDiscountedPrice(
                                      service.maxPrice,
                                      service.discountPercent
                                    )
                                  ),
                                })}
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="font-semibold text-rose-600 text-sm">
                              {formatPrice(service.maxPrice)}
                            </div>
                            {service.minPrice !== service.maxPrice && (
                              <div className="text-xs text-gray-600 mt-1">
                                {t("services.price.range", {
                                  min: formatPrice(service.minPrice),
                                  max: formatPrice(service.maxPrice),
                                })}
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Book Now Button */}
                      <div className="p-3 pt-1">
                        <button
                          onClick={() =>
                            window.open(
                              `/services/${service.id}?livestreamId=${id}`,
                              "_blank"
                            )
                          }
                          className="w-full bg-rose-500 text-white font-medium py-2 text-sm rounded-lg hover:bg-rose-600 transition shadow-sm"
                        >
                          {t("services.actions.book")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {hiddenServices.size > 0 && (
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => setShowHiddenServices(!showHiddenServices)}
                      className="bg-white bg-opacity-80 text-rose-600 text-xs px-3 py-1 rounded-full flex items-center hover:bg-opacity-100 transition-all shadow-sm"
                    >
                      {showHiddenServices
                        ? t("services.hidden.hide")
                        : t("services.hidden.show", {
                            count: hiddenServices.size,
                          })}
                      {showHiddenServices ? (
                        <EyeOff className="h-3 w-3 ml-1" />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 ml-1"
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
                      )}
                    </button>
                  </div>
                )}

                {/* Panel of hidden services */}
                {showHiddenServices && hiddenServicesList.length > 0 && (
                  <div className="mt-2 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-rose-700">
                        {t("services.hidden.title")}
                      </h4>
                      <button
                        onClick={restoreAllServices}
                        className="text-xs text-rose-600 hover:text-rose-800"
                      >
                        {t("services.hidden.restoreAll")}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {hiddenServicesList.map((service) => (
                        <div
                          key={`hidden-${service.id}`}
                          className="bg-rose-50 rounded-lg p-2 flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center mr-2 flex-shrink-0">
                              <span className="text-sm">
                                {getCategoryIcon(service.category?.name)}
                              </span>
                            </div>
                            <span className="text-xs font-medium truncate max-w-[100px]">
                              {service.name}
                            </span>
                          </div>
                          <button
                            onClick={() => restoreService(service.id)}
                            className="text-rose-600 hover:text-rose-800"
                            title={t("services.actions.restore")}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
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
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Toggle buttons for chat and services */}
            <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
              <button
                onClick={() => setShowServices(!showServices)}
                className={`rounded-full p-2 shadow-lg ${
                  showServices
                    ? "bg-rose-500 text-white"
                    : "bg-white text-rose-500"
                }`}
              >
                <ShoppingBag className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowChat(!showChat)}
                className={`rounded-full p-2 shadow-lg ${
                  showChat ? "bg-rose-500 text-white" : "bg-white text-rose-500"
                }`}
              >
                <MessageSquare className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Right side: Chat section */}
          <div
            className={`w-2/5 bg-white border-l border-gray-200 transition-all duration-300 ${
              showChat ? "translate-x-0" : "translate-x-full absolute right-0"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Chat header */}
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-3 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-rose-800">
                    {t("chat.title")}
                  </h2>
                  <button
                    onClick={() => setShowChat(false)}
                    className="text-gray-500 hover:text-gray-700 md:hidden"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Chat messages */}
              <div
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 space-y-3"
              >
                {chatMessage.length > 0 ? (
                  chatMessage.map((item, index) => (
                    <div key={index} className="flex items-start mb-3">
                      <div className="w-8 h-8 rounded-full bg-rose-300 flex items-center justify-center mr-2 flex-shrink-0">
                        🧑
                      </div>
                      <div className="bg-rose-50 px-4 py-2 rounded-lg break-words overflow-hidden max-w-[85%]">
                        <p className="text-xs text-rose-600 font-medium mb-1">
                          {item.sender || t("chat.sender")}
                        </p>
                        {item.message}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>{t("chat.noMessages.title")}</p>
                    <p className="text-sm">{t("chat.noMessages.subtitle")}</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Reaction buttons */}
              <div className="px-4 pt-3 pb-1 border-t border-gray-200">
                <p className="text-xs text-rose-600 font-medium mb-2">
                  {t("chat.reactions.title")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(reactionsMap).map(([id, reaction]) => (
                    <button
                      key={id}
                      onClick={() => sendReaction(Number(id))}
                      className="bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-sm px-3 py-1.5 rounded-full border border-rose-200 transition-colors flex items-center"
                    >
                      <span className="mr-1">{reaction.emoji}</span>
                      <span>{reaction.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat input */}
              <div className="p-4 border-t border-gray-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage(text);
                  }}
                >
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                      placeholder={t("chat.input.placeholder")}
                    />
                    <button
                      type="submit"
                      className="bg-rose-500 text-white px-4 py-2 rounded-r-lg hover:bg-rose-600 transition flex items-center"
                      disabled={!text.trim()}
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
