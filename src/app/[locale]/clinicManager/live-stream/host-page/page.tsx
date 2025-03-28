"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as signalR from "@microsoft/signalr";
import { LivestreamProvider } from "@/components/clinicManager/livestream/context";
import HostPageStreamScreen from "@/components/clinicManager/livestream/host-page-stream-screen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type {
  ChatMessage,
  Reaction,
  RoomCreatedAndJoinedData,
  PublishStartedData,
} from "@/components/clinicManager/livestream";
import ThumbnailGenerator from "@/components/clinicManager/livestream/thumbnail-generator";

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

interface RoomInfo {
  id: string;
  name: string;
  description?: string;
  category?: string;
  isPrivate?: boolean;
  startDate: string;
  clinicName?: string;
  thumbnailUrl?: string;
}

export default function HostPage() {
  const router = useRouter();
  // Fix type annotations for SignalR connection
  const signalR_Connection = useRef<signalR.HubConnection | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const roomGuidRef = useRef<string | null>(null);
  const janusRoomIdRef = useRef<number | null>(null);
  const [view, setView] = useState<number>(0);
  // Fix type annotations for video ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [isCreateRoom, setIsCreateRoom] = useState<boolean>(false);
  const [isPublish, setIsPublish] = useState<boolean>(false);
  const [chatMessage, setChatMessage] = useState<ChatMessage[]>([]);
  const [activeReactions, setActiveReactions] = useState<Reaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");

  // Form state
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("Skincare Tutorial");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  // Fix type annotations for room info
  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);

  // Define the reactions map
  const reactionsMap: Record<number, { emoji: string; text: string }> = {
    1: { emoji: "👍", text: "Looks great!" },
    2: { emoji: "❤️", text: "Love it!" },
    3: { emoji: "🔥", text: "That's fire!" },
    4: { emoji: "👏", text: "Amazing work!" },
    5: { emoji: "😍", text: "Beautiful!" },
  };

  const handleThumbnailGenerated = (url: string): void => {
    setThumbnailUrl(url);

    // If we have room info, update the thumbnail URL
    if (roomInfo && roomInfo.id) {
      try {
        fetch(`https://beautify.asia/api/LiveStream/${roomInfo.id}/thumbnail`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ thumbnailUrl: url }),
        });
      } catch (error) {
        console.error("Error updating thumbnail:", error);
      }
    }
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

        // Now set ref clearly (guaranteed connected)
        signalR_Connection.current = conn;

        // ✅ Clearly register event listeners here (after start)
        conn.on(
          "RoomCreatedAndJoined",
          async ({
            roomGuid,
            janusRoomId,
            sessionId,
          }: RoomCreatedAndJoinedData) => {
            console.log("✅ RoomCreatedAndJoined:", roomGuid, janusRoomId);
            sessionIdRef.current = sessionId;
            roomGuidRef.current = roomGuid;
            janusRoomIdRef.current = janusRoomId;
            setIsCreateRoom(true);
            setIsLoading(false);

            // Create room info in the database
            if (title && category) {
              try {
                const roomData = {
                  id: roomGuid,
                  name: title,
                  description: description,
                  category: category,
                  isPrivate: isPrivate,
                  startDate: new Date().toISOString(),
                  clinicName: "Your Clinic Name", // Replace with actual clinic name from user profile
                };

                // Save room info to database
                const response = await fetch(
                  "https://beautify.asia/api/LiveStream",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(roomData),
                  }
                );

                if (response.ok) {
                  const result = await response.json();
                  setRoomInfo(result.value);

                  // Broadcast to all clients that a new room is available
                  conn
                    .invoke("BroadcastNewRoom", roomData)
                    .catch((err: Error) => {
                      console.error("Error broadcasting new room:", err);
                    });
                }
              } catch (error) {
                console.error("Error saving room info:", error);
              }
            }
          }
        );

        conn.on(
          "PublishStarted",
          async ({ sessionId, jsep }: PublishStartedData) => {
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

        conn.on("ListenerCountUpdated", async (view: number) => {
          setView(view);
        });

        conn.on("ReceiveMessage", async (message: ChatMessage) => {
          setChatMessage((prev) => [...prev, message]);
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
          alert("The livestream has ended");
          // Clean up UI state (if needed)
          setIsCreateRoom(false);
          setIsPublish(false);
          setView(0);
          setChatMessage([]);

          // ✅ Stop and reset local video stream
          // Fix type for video srcObject
          if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop()); // Stop each track (audio + video)
            videoRef.current.srcObject = null; // Remove stream reference
          }

          // ✅ Cleanup peer connection
          if (peerConnectionRef.current) {
            peerConnectionRef.current.getSenders().forEach((sender) => {
              if (peerConnectionRef.current) {
                peerConnectionRef.current.removeTrack(sender);
              }
            });
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
          }

          // Update room info in database (mark as ended)
          if (roomInfo && roomInfo.id) {
            try {
              await fetch(
                `https://beautify.asia/api/LiveStream/${roomInfo.id}/end`,
                {
                  method: "POST",
                }
              );

              // Broadcast to all clients that the room has ended
              conn
                .invoke("BroadcastRoomEnded", roomInfo.id)
                .catch((err: Error) => {
                  console.error("Error broadcasting room ended:", err);
                });
            } catch (error) {
              console.error("Error updating room end time:", error);
            }
          }

          // ✅ Reset connection states
          roomGuidRef.current = null;
          janusRoomIdRef.current = null;
          sessionIdRef.current = null;
          setRoomInfo(null);

          // Navigate back to the main page
          router.push("/clinicManager/live-stream");
        });

        conn.on("JanusError", async (message: string) => {
          console.error("🚨 Janus Error:", message);
          alert(`Error: ${message}`);
          setIsLoading(false);
        });

        console.log("✅ Connected to SignalR");
        signalR_Connection.current = conn;
      })
      .catch((err: Error) => {
        console.error("Error connecting to SignalR:", err);
      });

    // Cleanup function
    return () => {
      if (conn && conn.state === signalR.HubConnectionState.Connected) {
        conn
          .stop()
          .catch((err: Error) => console.error("Error stopping SignalR:", err));
      }
    };
  }, [router, title, description, category, isPrivate]);

  const createRoom = (): void => {
    if (!title) {
      alert("Please enter a title for your livestream");
      return;
    }

    setIsLoading(true);

    if (
      signalR_Connection.current?.state === signalR.HubConnectionState.Connected
    ) {
      signalR_Connection.current
        .invoke("HostCreateRoom")
        .catch((err: Error) => {
          console.error("Error creating room:", err);
          alert(`Error creating room: ${err.message}`);
          setIsLoading(false);
        });
    } else {
      alert("🚨 SignalR connection not ready yet!");
      setIsLoading(false);
    }
  };

  const endLive = (): void => {
    if (
      signalR_Connection.current?.state ===
        signalR.HubConnectionState.Connected &&
      roomGuidRef.current
    ) {
      signalR_Connection.current
        .invoke("EndLivestream", roomGuidRef.current)
        .catch((err: Error) => {
          console.error("Error ending livestream:", err);
          alert(`Error ending livestream: ${err.message}`);
        });
    } else {
      alert("🚨 SignalR connection not ready yet!");
    }
  };

  const sendMessage = async (message: string): Promise<void> => {
    if (
      signalR_Connection.current?.state ===
        signalR.HubConnectionState.Connected &&
      roomGuidRef.current != null
    ) {
      if (message) {
        try {
          await signalR_Connection.current.invoke(
            "SendMessage",
            roomGuidRef.current,
            message
          );
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    }
  };

  const startPublishing = async (): Promise<void> => {
    if (
      signalR_Connection.current?.state ===
        signalR.HubConnectionState.Connected &&
      roomGuidRef.current
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
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
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

        await signalR_Connection.current.invoke(
          "StartPublish",
          roomGuidRef.current,
          offer.type,
          offer.sdp
        );
      } catch (error) {
        console.error("🚨 Error starting publishing:", error);
        alert(
          `Error starting publishing: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    } else {
      alert("🚨 SignalR connection not ready yet!");
    }
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
        signalR_Connection.current
          .invoke("KeepAlive", sessionIdRef.current)
          .catch((err: Error) => {
            console.error("Error sending keep alive:", err);
          });
      }
    }, 25000);

    return () => clearInterval(keepAliveInterval);
  }, [isCreateRoom]);

  // Share room link
  const shareRoom = (): void => {
    if (roomGuidRef.current) {
      const roomLink = `${window.location.origin}/clinicManager/live-stream/view/${roomGuidRef.current}`;

      if (navigator.share) {
        navigator
          .share({
            title: title || "Livestream Session",
            text: `Join my livestream: ${title}`,
            url: roomLink,
          })
          .catch((err: Error) => {
            console.error("Error sharing:", err);
            copyToClipboard(roomLink);
          });
      } else {
        copyToClipboard(roomLink);
      }
    }
  };

  const copyToClipboard = (text: string): void => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Room link copied to clipboard!");
      })
      .catch((err: Error) => {
        console.error("Failed to copy:", err);
        // Fallback
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("Room link copied to clipboard!");
      });
  };

  return (
    <LivestreamProvider>
      <style>{reactionAnimationStyle}</style>

      {!isCreateRoom && (
        <div className="container mx-auto p-6 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create Livestream</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Livestream Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a title for your livestream"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what your livestream is about"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Skincare Tutorial">
                        Skincare Tutorial
                      </SelectItem>
                      <SelectItem value="Makeup Tutorial">
                        Makeup Tutorial
                      </SelectItem>
                      <SelectItem value="Product Review">
                        Product Review
                      </SelectItem>
                      <SelectItem value="Q&A Session">Q&A Session</SelectItem>
                      <SelectItem value="Treatment Demo">
                        Treatment Demo
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="private"
                    checked={isPrivate}
                    onCheckedChange={setIsPrivate}
                  />
                  <Label htmlFor="private">Private Livestream</Label>
                </div>

                <Button
                  type="button"
                  onClick={createRoom}
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Room...
                    </>
                  ) : (
                    "Create Livestream Room"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {isCreateRoom && (
        <div className="min-h-screen">
          {/* Room info and share button */}
          {roomGuidRef.current && (
            <div className="bg-white p-4 shadow-md">
              <div className="container mx-auto flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">{title}</h2>
                  <p className="text-sm text-gray-500">
                    Room ID: {roomGuidRef.current}
                  </p>
                </div>
                <Button
                  onClick={shareRoom}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Share Room Link
                </Button>
              </div>
            </div>
          )}

          <HostPageStreamScreen
            view={view}
            localVideoRef={videoRef}
            startPublishing={startPublishing}
            isPublish={isPublish}
            endLive={endLive}
            chatMessage={chatMessage}
            sendMessage={sendMessage}
            activeReactions={activeReactions}
          />

          {isCreateRoom && roomGuidRef.current && (
            <ThumbnailGenerator
              roomId={roomGuidRef.current}
              onThumbnailGenerated={handleThumbnailGenerated}
            />
          )}
        </div>
      )}
    </LivestreamProvider>
  );
}
