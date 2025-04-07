"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import * as signalr from "@microsoft/signalr";
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

export default function CustomerPageStreamScreen() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [view, setView] = useState<number>(0);
  const signalR_Connection = useRef<signalr.HubConnection | null>(null);
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

  // Nuevo estado para rastrear servicios ocultos por el cliente actual
  const [hiddenServices, setHiddenServices] = useState<Set<string>>(new Set());
  const [showHiddenServices, setShowHiddenServices] = useState<boolean>(false);

  // Añadir una función para restaurar un servicio oculto
  const restoreService = (serviceId: string) => {
    setHiddenServices((prev) => {
      const newSet = new Set(prev);
      newSet.delete(serviceId);
      return newSet;
    });
  };

  // Añadir una función para restaurar todos los servicios ocultos
  const restoreAllServices = () => {
    setHiddenServices(new Set());
  };
  // Añadir una variable de referencia para evitar múltiples intentos de unirse a la sala
  const joinAttemptedRef = useRef<boolean>(false);

  // Define the reactions map
  const reactionsMap: Record<
    number,
    { emoji: string; text: string; icon: React.ReactNode }
  > = {
    1: {
      emoji: "👍",
      text: "Looks great!",
      icon: <ThumbsUp className="h-4 w-4" />,
    },
    2: { emoji: "❤️", text: "Love it!", icon: <Heart className="h-4 w-4" /> },
    3: {
      emoji: "🔥",
      text: "That's fire!",
      icon: <Flame className="h-4 w-4" />,
    },
    4: {
      emoji: "👏",
      text: "Amazing work!",
      icon: <ClipboardCheck className="h-4 w-4" />,
    },
    5: { emoji: "😍", text: "Beautiful!", icon: <Smile className="h-4 w-4" /> },
  };

  // Fetch livestream info
  useEffect(() => {
    const fetchLivestreamInfo = async () => {
      try {
        // Simulate data since the real API has security issues
        const data: LivestreamInfo = {
          id: id || "123",
          name: "Beauty Livestream",
          clinicName: "Beauty Clinic",
          startDate: new Date().toISOString(),
          description: "Join us for a live beauty session!",
        };
        setLivestreamInfo(data);
      } catch (error) {
        console.error("Error fetching livestream info:", error);
        addDebugInfo(
          `Error fetching livestream info: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    };

    fetchLivestreamInfo();
  }, [id]);

  const addDebugInfo = (info: string) => {
    setDebugInfo((prev) => [...prev, `[${new Date().toISOString()}] ${info}`]);
  };

  useEffect(() => {
    setIsLoading(true);
    setConnectionStatus("connecting");
    addDebugInfo("Initializing SignalR connection...");

    // Check if we're using HTTPS
    const isSecureContext = window.isSecureContext;
    const protocol = window.location.protocol;
    addDebugInfo(
      `Current protocol: ${protocol}, Secure context: ${isSecureContext}`
    );

    if (protocol !== "https:") {
      addDebugInfo(
        "Warning: Using insecure connection (HTTP). This may cause issues with media streaming."
      );
    }

    // Try to use HTTPS for the SignalR connection
    const baseUrl = "https://api.beautify.asia/signaling-api/LivestreamHub";
    addDebugInfo(`Connecting to: ${baseUrl}`);

    const conn = new signalr.HubConnectionBuilder()
      .withUrl(baseUrl, {
        skipNegotiation: true,
        transport: signalr.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalr.LogLevel.Information)
      .build();

    conn
      .start()
      .then(() => {
        addDebugInfo("✅ Connected to SignalR");
        setConnectionStatus("connected");

        signalR_Connection.current = conn;
        if (!joinAttemptedRef.current) {
          joinAttemptedRef.current = true;
          addDebugInfo(`Joining room as listener: ${id}`);
          signalR_Connection.current
            .invoke("JoinAsListener", id)
            .catch((err) => {
              addDebugInfo(`Error invoking JoinAsListener: ${err.message}`);
              setConnectionStatus("error");
            });
        } else {
          addDebugInfo(
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
            addDebugInfo("Received JoinRoomResponse");
            if (jsep) {
              try {
                addDebugInfo("Creating RTCPeerConnection");
                // Use an empty configuration to avoid STUN/TURN server issues
                const pc = new RTCPeerConnection({
                  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
                });

                pc.onicecandidate = (event) => {
                  addDebugInfo(
                    `ICE candidate: ${event.candidate ? "generated" : "null"}`
                  );
                };

                pc.oniceconnectionstatechange = () => {
                  addDebugInfo(
                    `ICE connection state: ${pc.iceConnectionState}`
                  );
                };

                pc.ontrack = (event) => {
                  addDebugInfo(`Track received: ${event.track.kind}`);
                  if (videoRef.current) {
                    videoRef.current.srcObject = event.streams[0];
                    setIsLoading(false);
                    addDebugInfo("Video stream attached to element");
                  }
                };

                addDebugInfo("Setting remote description");
                await pc.setRemoteDescription(
                  new RTCSessionDescription({ type: "offer", sdp: jsep })
                );

                addDebugInfo("Creating answer");
                const answer = await pc.createAnswer();

                addDebugInfo("Setting local description");
                await pc.setLocalDescription(answer);

                if (
                  signalR_Connection.current?.state ===
                  signalr.HubConnectionState.Connected
                ) {
                  sessionIdRef.current = sessionId;
                  setIsJoinRoom(true);
                  addDebugInfo("Sending answer to Janus");
                  signalR_Connection.current
                    .invoke(
                      "SendAnswerToJanus",
                      roomId,
                      sessionId,
                      handleId,
                      answer.sdp
                    )
                    .catch((err) => {
                      addDebugInfo(`Error sending answer: ${err.message}`);
                    });
                } else {
                  addDebugInfo("SignalR connection not ready");
                  setConnectionStatus("error");
                }
              } catch (error) {
                addDebugInfo(
                  `WebRTC error: ${
                    error instanceof Error ? error.message : String(error)
                  }`
                );
                setConnectionStatus("error");
              }
            } else {
              addDebugInfo("No JSEP in JoinRoomResponse");
            }
          }
        );

        conn.on("ListenerCountUpdated", async (view: number) => {
          setView(view);
        });

        conn.on("ReceiveMessage", async (message: ChatMessage) => {
          setChatMessage((prev) => [...prev, message]);
        });

        conn.on("ReceiveReaction", async ({ id }: { id: string | number }) => {
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
              setActiveReactions((prev) =>
                prev.filter((r) => r.key !== reaction.key)
              );
            }, 3000);
          }
        });

        conn.on("LivestreamEnded", async () => {
          addDebugInfo("Livestream has ended");
          if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
            videoRef.current.srcObject = null;
          }

          sessionIdRef.current = null;
          setChatMessage([]);
          setIsJoinRoom(false);
          alert("The livestream has ended");
          router.push(`/home`);
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
            if (isDisplay) {
              setDisplayServices((prev) => [...prev, service]);
            } else {
              setDisplayServices((prev) => prev.filter((s) => s.id !== id));
            }
          }
        );

        conn.on("JanusError", async (message: string) => {
          addDebugInfo(`Janus Error: ${message}`);
          setConnectionStatus("error");
        });
      })
      .catch((err) => {
        console.error("Failed to connect to SignalR:", err);
        addDebugInfo(`SignalR connection error: ${err.message}`);
        setConnectionStatus("error");
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
      if (conn && conn.state === signalr.HubConnectionState.Connected) {
        conn.stop();
      }
    };
  }, [router, id]);

  const sendMessage = async (message: string) => {
    if (
      signalR_Connection.current?.state ===
        signalr.HubConnectionState.Connected &&
      id != null
    ) {
      if (message) {
        signalR_Connection.current
          .invoke("SendMessage", id, message)
          .catch((err) =>
            addDebugInfo(`Error sending message: ${err.message}`)
          );
      }
    }
  };

  const sendReaction = (reaction: number) => {
    if (
      signalR_Connection.current?.state ===
        signalr.HubConnectionState.Connected &&
      id != null
    ) {
      signalR_Connection.current
        .invoke("SendReaction", id, reaction)
        .catch((err) => addDebugInfo(`Error sending reaction: ${err.message}`));
    }
  };

  useEffect(() => {
    const keepAliveInterval = setInterval(() => {
      if (
        sessionIdRef.current &&
        signalR_Connection.current &&
        signalR_Connection.current.state ===
          signalr.HubConnectionState.Connected &&
        isJoinRoom
      ) {
        signalR_Connection.current
          .invoke("KeepAlive", sessionIdRef.current)
          .catch((err) => addDebugInfo(`Keep alive error: ${err.message}`));
      }
    }, 25000);

    return () => clearInterval(keepAliveInterval);
  }, [isJoinRoom]);

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

  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current && !userScrolled) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessage]);

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
    return originalPrice * (1 - discountPercent / 100);
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

  // Nueva función para ocultar un servicio
  const hideService = (serviceId: string) => {
    setHiddenServices((prev) => {
      const newSet = new Set(prev);
      newSet.add(serviceId);
      return newSet;
    });
  };

  // Filtrar servicios para no mostrar los que el usuario ha ocultado
  const visibleServices = displayServices.filter(
    (service) => !hiddenServices.has(service.id)
  );
  const hiddenServicesList = displayServices.filter((service) =>
    hiddenServices.has(service.id)
  );
  return (
    <>
      <style>{reactionAnimationStyle}</style>

      <div className="flex flex-col h-screen bg-gray-100 overflow-hidden font-sans">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-rose-100 py-3 px-4">
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-rose-700">
                {livestreamInfo?.name || "Beauty Livestream"}
              </h1>
              <p className="text-sm text-gray-600">
                {livestreamInfo?.clinicName || "Loading..."}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-rose-50 px-3 py-1 rounded-full">
                <Users className="h-4 w-4 text-rose-600 mr-1" />
                <span className="text-sm font-medium text-rose-600">
                  {view} viewers
                </span>
              </div>
              <button
                onClick={() => router.push("/customer")}
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
                  <p className="text-lg">Connecting to livestream...</p>
                  <p className="text-sm mt-2 text-gray-300">
                    Status: {connectionStatus}
                  </p>

                  {securityError && (
                    <div className="mt-4 bg-red-900 bg-opacity-50 p-4 rounded-lg max-w-md">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                        <h3 className="text-yellow-400 font-medium">
                          Security Error
                        </h3>
                      </div>
                      <p className="text-sm text-gray-200 mb-2">
                        The connection to the livestream server is being blocked
                        because it&apos;s not secure (HTTP instead of HTTPS).
                      </p>
                      <p className="text-sm text-gray-200">
                        Please contact the administrator to enable HTTPS on the
                        API server.
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
                  <h3 className="text-xl font-bold mb-2">Connection Error</h3>
                  <p className="mb-4">
                    Failed to connect to the livestream. Please try again later.
                  </p>

                  {securityError && (
                    <div className="mb-4 bg-red-900 bg-opacity-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                        <h3 className="text-yellow-400 font-medium">
                          Security Error
                        </h3>
                      </div>
                      <p className="text-sm text-gray-200">
                        The connection is being blocked because the API server
                        is not using HTTPS.
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => router.push("/customer")}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Back to Livestreams
                  </button>

                  <div className="mt-4">
                    <button
                      onClick={() => setDebugInfo([])}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      Clear Debug Info
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-contain rounded-lg pointer-events-none touch-none"
            />

            {/* Debug info overlay - only visible in error state */}
            {connectionStatus === "error" && debugInfo.length > 0 && (
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-80 text-green-400 p-4 rounded-lg max-h-60 overflow-y-auto text-xs font-mono">
                <h4 className="text-white mb-2 font-bold">
                  Debug Information:
                </h4>
                {debugInfo.map((info, index) => (
                  <div key={index} className="mb-1">
                    {info}
                  </div>
                ))}
              </div>
            )}

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
                  Started: {formatDate(livestreamInfo.startDate)}
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
                        {/* Botón para ocultar el servicio - Nuevo */}
                        <button
                          onClick={() => hideService(service.id)}
                          className="absolute top-2 right-2 bg-white bg-opacity-70 p-1 rounded-full hover:bg-opacity-100 transition-all z-10"
                          title="Hide this service"
                        >
                          <EyeOff className="h-4 w-4 text-gray-600" />
                        </button>

                        {/* Discount Badge - Top Right */}
                        {service.discountPercent > 0 && (
                          <div className="absolute top-2 left-2 bg-red-100 text-red-600 px-2 py-1 rounded-lg text-xs font-bold discount-badge">
                            -{service.discountPercent}%
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
                                Range:{" "}
                                {formatPrice(
                                  calculateDiscountedPrice(
                                    service.minPrice,
                                    service.discountPercent
                                  )
                                )}{" "}
                                -{" "}
                                {formatPrice(
                                  calculateDiscountedPrice(
                                    service.maxPrice,
                                    service.discountPercent
                                  )
                                )}
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
                                Range: {formatPrice(service.minPrice)} -{" "}
                                {formatPrice(service.maxPrice)}
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Book Now Button */}
                      <div className="p-3 pt-1">
                        <button className="w-full bg-rose-500 text-white font-medium py-2 text-sm rounded-lg hover:bg-rose-600 transition shadow-sm">
                          Book Now
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
                      {showHiddenServices ? "Hide" : "Show"} hidden services (
                      {hiddenServices.size})
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

                {/* Panel de servicios ocultos */}
                {showHiddenServices && hiddenServicesList.length > 0 && (
                  <div className="mt-2 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-rose-700">
                        Hidden Services
                      </h4>
                      <button
                        onClick={restoreAllServices}
                        className="text-xs text-rose-600 hover:text-rose-800"
                      >
                        Restore All
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
                            title="Restore service"
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
                  <h2 className="font-semibold text-rose-800">Live Chat</h2>
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
                          {item.sender || "Guest"}
                        </p>
                        {item.message}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No messages yet</p>
                    <p className="text-sm">Be the first to send a message!</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Reaction buttons */}
              <div className="px-4 pt-3 pb-1 border-t border-gray-200">
                <p className="text-xs text-rose-600 font-medium mb-2">
                  Quick Reactions:
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
                    setText("");
                  }}
                >
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                      placeholder="Type your message..."
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
