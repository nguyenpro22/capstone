"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import * as signalR from "@microsoft/signalr";
import { LivestreamProvider } from "@/components/clinicManager/livestream/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Share2, MessageCircle, User } from "lucide-react";

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
`;

// Define types for chat messages and reactions
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

interface Room {
  name: string;
  clinicName: string;
}

export default function CustomerViewLivestream() {
  const router = useRouter();
  const params = useParams();
  // Fix type annotations for params
  const id = params.id as string;

  const [view, setView] = useState(0);
  // Fix type annotations for SignalR connection
  const signalR_Connection = useRef<signalR.HubConnection | null>(null);
  // Fix type annotations for video ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // Fix type annotations for session ID
  const sessionIdRef = useRef<string | null>(null);
  // Fix type for chat messages
  const [chatMessage, setChatMessage] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [userScrolled, setUserScrolled] = useState(false);
  // Fix type for reactions
  const [activeReactions, setActiveReactions] = useState<Reaction[]>([]);
  // Fix type for room info
  const [roomInfo, setRoomInfo] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Define the reactions map
  const reactionsMap = {
    1: { emoji: "👍", text: "Looks great!" },
    2: { emoji: "❤️", text: "Love it!" },
    3: { emoji: "🔥", text: "That's fire!" },
    4: { emoji: "👏", text: "Amazing work!" },
    5: { emoji: "😍", text: "Beautiful!" },
  };

  useEffect(() => {
    const checkWebRTCSupport = () => {
      console.log("Checking WebRTC support...");
      if (!navigator.mediaDevices || !window.RTCPeerConnection) {
        console.error("WebRTC is not supported in this browser");
        alert(
          "Your browser doesn't fully support WebRTC. Please try Chrome, Firefox, or Edge."
        );
        return false;
      }
      console.log("WebRTC is supported");
      return true;
    };

    // Add this call at the beginning of the useEffect
    if (!checkWebRTCSupport()) return;

    // Fetch room info
    const fetchRoomInfo = async () => {
      try {
        const response = await fetch(
          `https://beautify.asia/api/LiveStream/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.isSuccess) {
            setRoomInfo(data.value);
          }
        }
      } catch (error) {
        console.error("Error fetching room info:", error);
      }
    };

    fetchRoomInfo();

    const conn = new signalR.HubConnectionBuilder()
      .withUrl("https://beautify.asia/livestreamHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    conn.start().then(() => {
      console.log("✅ Connected to SignalR");

      // Đảm bảo gỡ bỏ các handler cũ trước khi đăng ký mới
      conn.off("JoinRoomResponse");
      conn.off("ListenerCountUpdated");
      conn.off("ReceiveMessage");
      conn.off("ReceiveReaction");
      conn.off("LivestreamEnded");
      conn.off("JanusError");

      signalR_Connection.current = conn;
      signalR_Connection.current.invoke("JoinAsListener", id);

      conn.on(
        "JoinRoomResponse",
        async ({ jsep, roomId, sessionId, handleId }) => {
          setIsLoading(false);
          console.log("Received JoinRoomResponse:", {
            roomId,
            sessionId,
            handleId,
          });
          console.log("JSEP received:", jsep ? "Yes" : "No");

          if (jsep) {
            try {
              const pc = new RTCPeerConnection({
                iceServers: [
                  { urls: "stun:stun.l.google.com:19302" },
                  { urls: "stun:stun1.l.google.com:19302" },
                ],
              });

              // Add ICE connection state logging
              pc.oniceconnectionstatechange = () => {
                console.log("ICE Connection State:", pc.iceConnectionState);
              };

              // Add signaling state logging
              pc.onsignalingstatechange = () => {
                console.log("Signaling State:", pc.signalingState);
              };

              pc.ontrack = (event) => {
                console.log("Track received:", event.track.kind);
                if (videoRef.current) {
                  videoRef.current.srcObject = event.streams[0];
                  console.log("Video srcObject set");

                  // Add event listener to check if video is playing
                  videoRef.current.onloadedmetadata = () => {
                    console.log("Video metadata loaded");
                    videoRef.current?.play().catch((err) => {
                      console.error("Error playing video:", err);
                    });
                  };
                } else {
                  console.error("videoRef.current is null");
                }
              };

              await pc.setRemoteDescription(
                new RTCSessionDescription({ type: "offer", sdp: jsep })
              );
              console.log("Remote description set");

              const answer = await pc.createAnswer();
              console.log("Answer created");

              await pc.setLocalDescription(answer);
              console.log("Local description set");

              if (
                signalR_Connection.current?.state ===
                signalR.HubConnectionState.Connected
              ) {
                sessionIdRef.current = sessionId;
                console.log("Sending answer to Janus");
                signalR_Connection.current
                  .invoke(
                    "SendAnswerToJanus",
                    roomId,
                    sessionId,
                    handleId,
                    answer.sdp
                  )
                  .then(() => {
                    console.log("Answer sent successfully");
                  })
                  .catch((err) => {
                    console.error("Error sending answer:", err);
                  });
              } else {
                console.error("SignalR connection not ready");
                alert("🚨 SignalR connection not ready yet!");
              }
            } catch (error) {
              console.error("Error in WebRTC setup:", error);
            }
          } else {
            console.error("No JSEP received in JoinRoomResponse");
          }
        }
      );

      conn.on("ListenerCountUpdated", async (view) => {
        setView(view);
      });

      // Fix type for message handling
      conn.on("ReceiveMessage", async (message: ChatMessage) => {
        // Add duplicate check based on ID or content
        setChatMessage((prev) => {
          // Check if message already exists
          const isDuplicate = prev.some(
            (existingMsg) =>
              existingMsg.message === message.message &&
              existingMsg.sender === message.sender &&
              existingMsg.timestamp === message.timestamp
          );

          // If duplicate, don't add
          if (isDuplicate) return prev;

          // If not duplicate, add to list
          return [...prev, message];
        });
      });

      // Fix type for reaction ID
      conn.on("ReceiveReaction", async ({ id }: { id: string | number }) => {
        console.log("Received reaction ID:", id);

        // Convert to number if it's a string
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

      conn.on("LivestreamEnded", async () => {
        console.log("🚨 Livestream has ended");
        // Fix type for video srcObject
        if (videoRef.current?.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop()); // Stop each track (audio + video)
          videoRef.current.srcObject = null; // Remove stream reference
        }

        sessionIdRef.current = null;
        setChatMessage([]);
        alert("The livestream has ended");
        router.push(`/livestream-view`);
      });

      conn.on("JanusError", async (message) => {
        console.error("🚨 Janus Error:", message);
        setIsLoading(false);
        alert(`Error: ${message}`);
      });

      signalR_Connection.current = conn;
    });

    // Cleanup the connection when the component is unmounted
    return () => {
      if (conn && conn.state === signalR.HubConnectionState.Connected) {
        // Gỡ bỏ tất cả các handler trước khi dừng kết nối
        conn.off("JoinRoomResponse");
        conn.off("ListenerCountUpdated");
        conn.off("ReceiveMessage");
        conn.off("ReceiveReaction");
        conn.off("LivestreamEnded");
        conn.off("JanusError");

        conn.stop();
      }
    };
  }, [router, id]);

  const sendMessage = async (message) => {
    if (
      signalR_Connection.current?.state ===
        signalR.HubConnectionState.Connected &&
      id != null
    ) {
      if (message) {
        signalR_Connection.current.invoke("SendMessage", id, message);
      }
    }
  };

  const sendReaction = (reaction) => {
    if (
      signalR_Connection.current?.state ===
        signalR.HubConnectionState.Connected &&
      id != null
    ) {
      signalR_Connection.current.invoke("SendReaction", id, reaction);
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      // Check if user has scrolled up a significant amount
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
    // Always scroll to bottom when the component mounts
    scrollToBottom();
  }, []);

  useEffect(() => {
    // Only auto-scroll if the user hasn't manually scrolled up
    if (messagesEndRef.current && !userScrolled) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessage]); // Only depend on chatMessage to avoid unnecessary scrolls

  const shareStream = () => {
    if (navigator.share) {
      navigator
        .share({
          title: roomInfo?.name || "Beauty Livestream",
          text: `Join me in watching this beauty livestream: ${roomInfo?.name}`,
          url: window.location.href,
        })
        .catch((error) => {
          console.error("Error sharing:", error);
          copyToClipboard(window.location.href);
        });
    } else {
      copyToClipboard(window.location.href);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Livestream link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        // Fallback
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("Livestream link copied to clipboard!");
      });
  };

  useEffect(() => {
    const keepAliveInterval = setInterval(() => {
      if (
        sessionIdRef.current &&
        signalR_Connection.current &&
        signalR_Connection.current.state ===
          signalR.HubConnectionState.Connected
      ) {
        console.log("Sending keep alive signal");
        signalR_Connection.current
          .invoke("KeepAlive", sessionIdRef.current)
          .catch((err) => {
            console.error("Keep alive error:", err);
            // If keep alive fails, try to reconnect
            if (
              signalR_Connection.current?.state !==
              signalR.HubConnectionState.Connected
            ) {
              console.log("Connection lost, attempting to reconnect...");
              signalR_Connection.current?.start().catch((err) => {
                console.error("Failed to reconnect:", err);
              });
            }
          });
      }
    }, 25000); // Send keepalive every 25 seconds

    return () => clearInterval(keepAliveInterval);
  }, [sessionIdRef.current]);

  // Add ICE connection monitoring to detect and recover from connection issues
  useEffect(() => {
    let peerConnection: RTCPeerConnection | null = null;
    let connectionCheckInterval: NodeJS.Timeout | null = null;

    // Function to monitor and potentially restart the connection
    const setupConnectionMonitoring = (pc: RTCPeerConnection) => {
      peerConnection = pc;

      // Check connection state periodically
      connectionCheckInterval = setInterval(() => {
        if (peerConnection) {
          console.log(
            "Checking connection state:",
            peerConnection.iceConnectionState
          );

          // If connection is failed, disconnected, or closed, try to rejoin
          if (
            peerConnection.iceConnectionState === "failed" ||
            peerConnection.iceConnectionState === "disconnected" ||
            peerConnection.iceConnectionState === "closed"
          ) {
            console.log("Connection is in bad state, attempting to rejoin...");

            // Clean up existing connection
            if (videoRef.current?.srcObject) {
              const stream = videoRef.current.srcObject as MediaStream;
              stream.getTracks().forEach((track) => track.stop());
              videoRef.current.srcObject = null;
            }

            peerConnection.close();

            // Attempt to rejoin the room
            if (
              signalR_Connection.current?.state ===
              signalR.HubConnectionState.Connected
            ) {
              signalR_Connection.current
                .invoke("JoinAsListener", id)
                .catch((err) => {
                  console.error("Error rejoining room:", err);
                });
            }
          }
        }
      }, 30000); // Check every 30 seconds
    };

    // Expose a function to set the peer connection for monitoring
    // This will be called from the JoinRoomResponse handler
    (window as any).setupWebRTCMonitoring = setupConnectionMonitoring;

    return () => {
      if (connectionCheckInterval) {
        clearInterval(connectionCheckInterval);
      }
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, [id]);

  return (
    <LivestreamProvider>
      {/* Add the CSS animation style */}
      <style>{reactionAnimationStyle}</style>

      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header with back button and room info */}
        <div className="bg-white p-3 shadow-sm flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/livestream-view")}
            className="mr-2"
          >
            <ArrowLeft size={20} />
          </Button>

          <div className="flex-1">
            <h1 className="font-semibold truncate">
              {roomInfo?.name || "Beauty Livestream"}
            </h1>
            <p className="text-sm text-gray-500 truncate">
              {roomInfo?.clinicName || "Beauty Clinic"}
            </p>
          </div>

          <Button variant="ghost" size="icon" onClick={shareStream}>
            <Share2 size={20} />
          </Button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Left side: Video taking 2/3 */}
          <div className="w-full md:w-2/3 h-full md:h-full flex items-center justify-center bg-black relative">
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                controls // Add controls to allow user to unmute if needed
                className="w-full h-full object-contain"
              />

              {/* Loading overlay */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-lg">Connecting to livestream...</p>
                  </div>
                </div>
              )}

              {/* Viewer count */}
              <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full flex items-center">
                <User className="w-4 h-4 mr-2" />
                {view}
              </div>

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
            </div>
          </div>

          {/* Right side: Chat taking 1/3 */}
          <div className="w-full md:w-1/3 h-64 md:h-full flex flex-col bg-white border-l border-gray-200">
            {/* Chat Header */}
            <div className="bg-white px-4 py-3 border-b border-gray-200 font-medium">
              <MessageCircle className="inline-block mr-2 h-5 w-5" />
              Live Chat
            </div>

            {/* Chat Messages */}
            <div
              ref={chatContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 space-y-3"
            >
              {chatMessage.map((item, index) => (
                <div key={index} className="flex items-start mb-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center mr-2 flex-shrink-0">
                    🧑
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-lg break-words overflow-hidden max-w-[85%]">
                    {item.message}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Reaction Row */}
            <div className="border-t border-gray-200 px-4 pt-3 pb-1">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-gray-500 font-medium">
                  Quick Reactions:
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { emoji: "👍", text: "Looks great!", id: 1 },
                  { emoji: "❤️", text: "Love it!", id: 2 },
                  { emoji: "🔥", text: "That's fire!", id: 3 },
                  { emoji: "👏", text: "Amazing work!", id: 4 },
                  { emoji: "😍", text: "Beautiful!", id: 5 },
                ].map((reaction, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      console.log("Clicked reaction button:", reaction.id);
                      sendReaction(reaction.id);
                    }}
                    className="bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-sm px-3 py-1.5 rounded-full border border-gray-200 transition-colors flex items-center"
                  >
                    <span className="mr-1">{reaction.emoji}</span>
                    <span>{reaction.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Text Input */}
            <div className="p-4 border-t border-gray-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(text);
                  setText("");
                }}
              >
                <div className="flex items-center">
                  <Input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                    placeholder="Type a message..."
                  />
                  <Button
                    type="submit"
                    className="ml-2 bg-rose-600 hover:bg-rose-700 text-white"
                  >
                    Send
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </LivestreamProvider>
  );
}
