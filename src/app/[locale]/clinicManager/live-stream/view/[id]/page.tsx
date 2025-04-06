"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import * as signalR from "@microsoft/signalr";
import { LivestreamProvider } from "@/components/clinicManager/livestream/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChatMessage,
  Reaction,
  ReactionData,
} from "@/components/clinicManager/livestream";

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

export default function ViewLivestream() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

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

  // Define the reactions map
  const reactionsMap: Record<number, { emoji: string; text: string }> = {
    1: { emoji: "👍", text: "Looks great!" },
    2: { emoji: "❤️", text: "Love it!" },
    3: { emoji: "🔥", text: "That's fire!" },
    4: { emoji: "👏", text: "Amazing work!" },
    5: { emoji: "😍", text: "Beautiful!" },
  };

  useEffect(() => {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl("https://beautify.asia/livestreamHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    conn
      .start()
      .then(() => {
        console.log("✅ Connected to SignalR");

        signalR_Connection.current = conn;
        signalR_Connection.current
          .invoke("JoinAsListener", id)
          .catch((err: Error) => {
            console.error("Error joining as listener:", err);
          });

        conn.on(
          "JoinRoomResponse",
          async ({ jsep, roomId, sessionId, handleId }) => {
            if (jsep) {
              const pc = new RTCPeerConnection(undefined);
              pc.ontrack = (event) => {
                if (videoRef.current) {
                  videoRef.current.srcObject = event.streams[0];
                }
              };
              await pc.setRemoteDescription(
                new RTCSessionDescription({ type: "offer", sdp: jsep })
              );
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              if (
                signalR_Connection.current?.state ===
                signalR.HubConnectionState.Connected
              ) {
                sessionIdRef.current = sessionId;
                signalR_Connection.current
                  .invoke(
                    "SendAnswerToJanus",
                    roomId,
                    sessionId,
                    handleId,
                    answer.sdp
                  )
                  .catch((err: Error) => {
                    console.error("Error sending answer to Janus:", err);
                  });
              } else {
                alert("🚨 SignalR connection not ready yet!");
              }
            }
          }
        );

        conn.on("ListenerCountUpdated", async (view: number) => {
          setView(view);
        });

        conn.on("ReceiveMessage", async (message: ChatMessage) => {
          setChatMessage((prev) => [...prev, message]);
        });

        // Updated ReceiveReaction handler
        conn.on("ReceiveReaction", async ({ id }: ReactionData) => {
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

        conn.on("LivestreamEnded", async () => {
          console.log("🚨 Livestream has ended");
          if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop()); // Stop each track (audio + video)
            videoRef.current.srcObject = null; // Remove stream reference
          }

          sessionIdRef.current = null;
          setChatMessage([]);
          alert("The livestream has ended");
          router.push(`/clinicManager/live-stream`);
        });

        conn.on("JanusError", async (message: string) => {
          console.error("🚨 Janus Error:", message);
          alert(`Error: ${message}`);
        });

        signalR_Connection.current = conn;
      })
      .catch((err: Error) => {
        console.error("Error connecting to SignalR:", err);
      });

    // Cleanup the connection when the component is unmounted
    return () => {
      if (conn && conn.state === signalR.HubConnectionState.Connected) {
        conn
          .stop()
          .catch((err: Error) => console.error("Error stopping SignalR:", err));
      }
    };
  }, [router, id]);

  const sendMessage = async (message: string): Promise<void> => {
    if (
      signalR_Connection.current?.state ===
        signalR.HubConnectionState.Connected &&
      id != null
    ) {
      if (message) {
        try {
          await signalR_Connection.current.invoke("SendMessage", id, message);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    }
  };

  const sendReaction = (reaction: number): void => {
    if (
      signalR_Connection.current?.state ===
        signalR.HubConnectionState.Connected &&
      id != null
    ) {
      try {
        signalR_Connection.current
          .invoke("SendReaction", id, reaction)
          .catch((err: Error) => {
            console.error("Error sending reaction:", err);
          });
      } catch (error) {
        console.error("Error sending reaction:", error);
      }
    }
  };

  const handleScroll = (): void => {
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

  const scrollToBottom = (): void => {
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

  return (
    <LivestreamProvider>
      {/* Add the CSS animation style */}
      <style>{reactionAnimationStyle}</style>

      <div className="flex h-screen bg-rose-50 overflow-hidden font-sans">
        {/* Left side: Video taking 5/8 */}
        <div className="w-5/8 h-full flex items-center justify-center bg-black">
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
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

        {/* Right side: Config + Chat taking 3/8 */}
        <div className="w-3/8 h-full flex flex-col bg-white border-l border-rose-100 shadow-md">
          {/* Chat Section - Using flex-grow to fill remaining space */}
          <div className="flex flex-col h-full border border-rose-200 rounded-lg m-4 shadow-sm">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-rose-100 to-pink-100 px-4 py-3 border-b border-rose-200">
              💬 Client Questions
            </div>

            {/* Chat Messages */}
            <div
              ref={chatContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[calc(100vh-220px)]"
            >
              {chatMessage.map((item, index) => (
                <div key={index} className="flex items-start mb-3">
                  <div className="w-8 h-8 rounded-full bg-rose-300 flex items-center justify-center mr-2 flex-shrink-0">
                    🧑
                  </div>
                  <div className="bg-rose-100 px-4 py-2 rounded-lg break-words overflow-hidden max-w-[85%]">
                    {item.message}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input with Reaction Row */}
            <div className="border-t border-rose-200 mt-auto">
              {/* Reaction Row */}
              <div className="px-4 pt-3 pb-1">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-rose-500 font-medium">
                    Quick Reactions:
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { emoji: "👍", text: "Looks great!", id: 1 }, // Changed from string "1" to number 1
                    { emoji: "❤️", text: "Love it!", id: 2 }, // Changed IDs to numbers
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
                      className="bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-sm px-3 py-1.5 rounded-full border border-rose-200 transition-colors flex items-center"
                    >
                      <span className="mr-1">{reaction.emoji}</span>
                      <span>{reaction.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              <div className="p-4">
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
                      className="flex-1 border border-rose-300 rounded-lg px-4 py-2 bg-rose-50 focus:ring-rose-500 focus:border-rose-500 outline-none"
                      placeholder="Reply to clients..."
                    />
                    <Button
                      type="submit"
                      className="ml-2 bg-rose-400 text-white px-4 py-2 rounded-lg hover:bg-rose-500 transition"
                    >
                      ➡️
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LivestreamProvider>
  );
}
