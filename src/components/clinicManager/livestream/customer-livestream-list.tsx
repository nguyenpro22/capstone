"use client";

import { useState, useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  Play,
  Volume2,
  VolumeX,
  Calendar,
  Clock,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Room } from ".";

interface CustomerLivestreamListProps {
  filter: "all" | "live" | "upcoming" | "ended" | "category";
  categoryFilter?: string;
  searchQuery?: string;
  onJoinRoom: (roomId: string) => void;
}

export default function CustomerLivestreamList({
  filter,
  categoryFilter,
  searchQuery = "",
  onJoinRoom,
}: CustomerLivestreamListProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [signalRConnection, setSignalRConnection] =
    useState<signalR.HubConnection | null>(null);
  const [previewRoom, setPreviewRoom] = useState<Room | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  // Fetch rooms initially and set up SignalR connection
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(
          "https://api.beautify.asia/signaling-api/LiveStream/Rooms"
        );
        const data = await response.json();

        if (data.isSuccess) {
          setRooms(data.value);
        } else {
          setError(`Error: ${data.error?.message || "Failed to fetch rooms"}`);
        }
      } catch (err) {
        setError(
          `Error: ${err instanceof Error ? err.message : "Unknown error"}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();

    // Set up SignalR connection for real-time updates
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://api.beautify.asia/signaling-api/LivestreamHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection
      .start()
      .then(() => {
        console.log("Connected to SignalR for room updates");
        setSignalRConnection(connection);

        // Listen for new room notifications
        connection.on("NewRoomCreated", (roomData: Room) => {
          console.log("New room created:", roomData);
          setRooms((prevRooms) => {
            // Check if room already exists
            if (prevRooms.some((room) => room.id === roomData.id)) {
              return prevRooms;
            }
            return [...prevRooms, roomData];
          });
        });

        // Listen for room ended notifications
        connection.on("RoomEnded", (roomId: string) => {
          console.log("Room ended:", roomId);
          setRooms((prevRooms) =>
            prevRooms.filter((room) => room.id !== roomId)
          );

          // If the preview room ended, clear the preview
          if (previewRoom && previewRoom.id === roomId) {
            stopPreview();
          }
        });

        // Add handler for preview stream
        connection.on(
          "PreviewStreamReady",
          async ({ roomId, jsep }: { roomId: string; jsep: string }) => {
            console.log("Preview stream ready for room:", roomId);

            if (previewVideoRef.current && roomId === previewRoom?.id) {
              try {
                // Create a new RTCPeerConnection for the preview
                const pc = new RTCPeerConnection({
                  iceServers: [
                    { urls: "stun:stun.l.google.com:19302" },
                    { urls: "stun:stun1.l.google.com:19302" },
                  ],
                });

                // Store the peer connection
                peerConnectionRef.current = pc;

                // Set up event handlers
                pc.ontrack = (event) => {
                  if (previewVideoRef.current) {
                    previewVideoRef.current.srcObject = event.streams[0];
                  }
                };

                // Set the remote description (the offer from the server)
                await pc.setRemoteDescription(
                  new RTCSessionDescription({
                    type: "offer",
                    sdp: jsep,
                  })
                );

                // Create an answer
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);

                // Send the answer back to the server
                if (connection.state === signalR.HubConnectionState.Connected) {
                  connection
                    .invoke("SendPreviewAnswer", roomId, answer.sdp)
                    .catch((err: Error) => {
                      console.error("Error sending preview answer:", err);
                    });
                }
              } catch (error) {
                console.error("Error setting up preview stream:", error);
              }
            }
          }
        );

        // Subscribe to room updates
        connection.invoke("SubscribeToRoomUpdates").catch((err: Error) => {
          console.error("Error subscribing to room updates:", err);
        });
      })
      .catch((err: Error) => {
        console.error("Error connecting to SignalR:", err);
      });

    // Clean up connection when component unmounts
    return () => {
      if (connection) {
        connection
          .stop()
          .catch((err: Error) => console.error("Error stopping SignalR:", err));
      }
      stopPreview();
    };
  }, [previewRoom]);

  // Set up auto-refresh every 30 seconds as a fallback
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(
          "https://api.beautify.asia/signaling-api/LiveStream/Rooms"
        );
        const data = await response.json();

        if (data.isSuccess) {
          setRooms(data.value);
        }
      } catch (err) {
        console.error("Error refreshing rooms:", err);
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(intervalId);
  }, []);

  // Format date for better readability
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Calculate status based on start and end dates
  const getRoomStatus = (room: Room): { status: string; color: string } => {
    const now = new Date();
    const startDate = new Date(room.startDate);
    const endDate = room.endDate ? new Date(room.endDate) : null;

    if (endDate && now > endDate) {
      return { status: "Ended", color: "bg-gray-500" };
    } else if (now >= startDate) {
      return { status: "Live", color: "bg-red-500" };
    } else {
      return { status: "Upcoming", color: "bg-yellow-500" };
    }
  };

  // Start preview for a room
  const startPreview = (room: Room): void => {
    // First stop any existing preview
    stopPreview();

    // Set the room to preview
    setPreviewRoom(room);

    // Request preview stream from the server
    if (
      signalRConnection &&
      signalRConnection.state === signalR.HubConnectionState.Connected
    ) {
      signalRConnection
        .invoke("RequestPreviewStream", room.id)
        .catch((err: Error) => {
          console.error("Error requesting preview stream:", err);
        });
    }
  };

  // Stop preview
  const stopPreview = (): void => {
    // Clean up video element
    if (previewVideoRef.current && previewVideoRef.current.srcObject) {
      const stream = previewVideoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      previewVideoRef.current.srcObject = null;
    }

    // Clean up peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Reset state
    setPreviewRoom(null);
  };

  // Toggle mute state
  const toggleMute = (): void => {
    if (previewVideoRef.current) {
      previewVideoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (loading)
    return (
      <div className="p-4 text-center text-lg flex items-center justify-center h-[50vh]">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        Loading livestream rooms...
      </div>
    );
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  // Filter rooms based on criteria
  const filteredRooms = rooms.filter((room) => {
    const { status } = getRoomStatus(room);

    // Apply search filter if provided
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        (room.name && room.name.toLowerCase().includes(query)) ||
        (room.clinicName && room.clinicName.toLowerCase().includes(query)) ||
        (room.category && room.category.toLowerCase().includes(query)) ||
        (room.description && room.description.toLowerCase().includes(query));

      if (!matchesSearch) return false;
    }

    // Apply status/category filter
    if (filter === "live") return status === "Live";
    if (filter === "upcoming") return status === "Upcoming";
    if (filter === "ended") return status === "Ended";
    if (filter === "category" && categoryFilter) {
      return room.category === categoryFilter;
    }

    // "all" filter or default
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Preview section */}
      {previewRoom && (
        <div className="relative rounded-lg overflow-hidden bg-black aspect-video max-h-[400px]">
          <video
            ref={previewVideoRef}
            className="w-full h-full object-contain"
            autoPlay
            playsInline
            muted={isMuted}
          />

          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <div className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-md">
              <h3 className="font-medium">{previewRoom.name}</h3>
              <p className="text-sm opacity-80">{previewRoom.clinicName}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={toggleMute}
                className="bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>

              <Button
                onClick={() => onJoinRoom(previewRoom.id)}
                className="bg-rose-600 hover:bg-rose-700 gap-1"
              >
                <Play size={16} /> Watch Now
              </Button>
            </div>
          </div>

          <button
            onClick={stopPreview}
            className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-1 rounded-full hover:bg-opacity-90"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filtered rooms grid */}
      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => {
            const { status, color } = getRoomStatus(room);
            return (
              <Card
                key={room.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-video bg-gray-100">
                  {/* Thumbnail or static image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {room.thumbnailUrl ? (
                      <img
                        src={room.thumbnailUrl || "/placeholder.svg"}
                        alt={room.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-full flex items-center justify-center ${
                          status === "Live"
                            ? "bg-gradient-to-r from-rose-400 to-pink-500"
                            : "bg-gradient-to-r from-gray-200 to-gray-300"
                        }`}
                      >
                        <span
                          className={`text-lg font-bold ${
                            status === "Live" ? "text-white" : "text-gray-600"
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Preview button for live streams */}
                  {status === "Live" && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-40">
                      <Button
                        onClick={() => startPreview(room)}
                        variant="outline"
                        className="bg-white bg-opacity-90 hover:bg-opacity-100"
                      >
                        <Play className="mr-2 h-4 w-4" /> Preview
                      </Button>
                    </div>
                  )}

                  {/* Status badge */}
                  <div
                    className={`absolute top-2 left-2 ${color} text-white text-xs px-2 py-1 rounded-full`}
                  >
                    {status}
                  </div>

                  {/* Viewer count for live streams */}
                  {status === "Live" && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {room.viewerCount || 0}
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg truncate">{room.name}</h3>
                    {room.category && (
                      <Badge variant="outline" className="ml-2 shrink-0">
                        {room.category}
                      </Badge>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-2">
                    {room.clinicName}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span className="mr-3">
                      {new Date(room.startDate).toLocaleDateString()}
                    </span>
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    <span>
                      {new Date(room.startDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <Button
                    onClick={() => onJoinRoom(room.id)}
                    className={`w-full ${
                      status === "Live"
                        ? "bg-rose-600 hover:bg-rose-700"
                        : status === "Upcoming"
                        ? "bg-amber-500 hover:bg-amber-600"
                        : "bg-gray-500 hover:bg-gray-600"
                    }`}
                    disabled={status === "Ended"}
                  >
                    {status === "Live"
                      ? "Watch Now"
                      : status === "Upcoming"
                      ? "Remind Me"
                      : "Ended"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-500">
            No livestream rooms match your criteria
          </div>
          <p className="text-gray-400 mt-2">
            Try adjusting your filters or check back later
          </p>
        </div>
      )}
    </div>
  );
}
