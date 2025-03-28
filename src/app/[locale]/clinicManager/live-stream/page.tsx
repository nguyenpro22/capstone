"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LivestreamProvider } from "@/components/clinicManager/livestream/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import * as signalR from "@microsoft/signalr";
import {
  Loader2,
  Plus,
  Search,
  Calendar,
  Clock,
  User,
  Filter,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Room } from "@/components/clinicManager/livestream";

export default function ClinicLivestreamManager() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roomGuid, setRoomGuid] = useState("");
  const [signalRConnection, setSignalRConnection] =
    useState<signalR.HubConnection | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Fetch rooms initially and set up SignalR connection
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("https://beautify.asia/api/LiveStream");
        const data = await response.json();

        if (data.isSuccess) {
          setRooms(data.value);
        } else {
          setError(`Error: ${data.error.message || "Failed to fetch rooms"}`);
        }
      } catch (err) {
        setError(
          `Error: ${
            err instanceof Error ? err.message : "An unknown error occurred"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();

    // Set up SignalR connection for real-time updates
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://beautify.asia/livestreamHub", {
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
        connection.on("NewRoomCreated", (roomData) => {
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
        connection.on("RoomEnded", (roomId) => {
          console.log("Room ended:", roomId);
          setRooms((prevRooms) =>
            prevRooms.filter((room) => room.id !== roomId)
          );
        });

        // Subscribe to room updates
        connection.invoke("SubscribeToRoomUpdates").catch((err) => {
          console.error("Error subscribing to room updates:", err);
        });
      })
      .catch((err) => {
        console.error("Error connecting to SignalR:", err);
      });

    // Clean up connection when component unmounts
    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  // Set up auto-refresh every 30 seconds as a fallback
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch("https://beautify.asia/api/LiveStream");
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

  interface JoinRoomParams {
    roomId: string;
  }

  const joinRoom = (roomId: JoinRoomParams["roomId"]): void => {
    if (!roomId) {
      alert("Please enter or select a room ID");
      return;
    }

    console.log(`Joining room: ${roomId}`);
    router.push(`/clinicManager/live-stream/view/${roomId}`);
  };

  const handleCreateRoom = () => {
    router.push("/clinicManager/live-stream/host-page");
  };

  // Format date for better readability
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Calculate status based on start and end dates
  interface RoomStatus {
    status: "Ended" | "Live" | "Scheduled";
    color: string;
  }

  interface Room {
    id: string;
    name: string;
    startDate: string;
    endDate?: string;
    thumbnailUrl?: string;
    category?: string;
    viewerCount?: number;
    clinicName?: string;
    description?: string;
  }

  const getRoomStatus = (room: Room): RoomStatus => {
    const now = new Date();
    const startDate = new Date(room.startDate);
    const endDate = room.endDate ? new Date(room.endDate) : null;

    if (endDate && now > endDate) {
      return { status: "Ended", color: "bg-gray-500" };
    } else if (now >= startDate) {
      return { status: "Live", color: "bg-red-500" };
    } else {
      return { status: "Scheduled", color: "bg-yellow-500" };
    }
  };

  // Filter rooms based on search query, tab, and category
  interface FilterRoomsParams {
    rooms: Room[];
    tabFilter: "all" | "live" | "scheduled" | "ended";
    search: string;
    category: string;
  }

  const filterRooms = (
    rooms: FilterRoomsParams["rooms"],
    tabFilter: FilterRoomsParams["tabFilter"],
    search: FilterRoomsParams["search"],
    category: FilterRoomsParams["category"]
  ): Room[] => {
    return rooms.filter((room) => {
      const { status } = getRoomStatus(room);

      // Filter by status (tab)
      if (tabFilter === "live" && status !== "Live") return false;
      if (tabFilter === "scheduled" && status !== "Scheduled") return false;
      if (tabFilter === "ended" && status !== "Ended") return false;

      // Filter by category
      if (category !== "all" && room.category !== category) return false;

      // Filter by search query
      if (search) {
        const query = search.toLowerCase();
        return (
          (room.name && room.name.toLowerCase().includes(query)) ||
          (room.clinicName && room.clinicName.toLowerCase().includes(query)) ||
          (room.description && room.description.toLowerCase().includes(query))
        );
      }

      return true;
    });
  };

  if (loading)
    return (
      <div className="p-4 text-center text-lg flex items-center justify-center h-[50vh]">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        Loading livestream rooms...
      </div>
    );
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <LivestreamProvider>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Clinic Livestream Manager</h1>
            <p className="text-gray-600">
              Create and manage your beauty livestreams
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleCreateRoom}
              className="bg-rose-600 hover:bg-rose-700 gap-2"
            >
              <Plus size={16} />
              Create New Livestream
            </Button>

            <div className="flex gap-2">
              <Input
                className="w-[200px]"
                type="text"
                value={roomGuid}
                onChange={(e) => setRoomGuid(e.target.value)}
                placeholder="Enter room ID"
              />
              <Button
                onClick={() => joinRoom(roomGuid)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Join Room
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search livestreams..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Skincare Tutorial">
                  Skincare Tutorial
                </SelectItem>
                <SelectItem value="Makeup Tutorial">Makeup Tutorial</SelectItem>
                <SelectItem value="Product Review">Product Review</SelectItem>
                <SelectItem value="Q&A Session">Q&A Session</SelectItem>
                <SelectItem value="Treatment Demo">Treatment Demo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Streams</TabsTrigger>
            <TabsTrigger value="live">Live Now</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="ended">Ended</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterRooms(rooms, "all", searchQuery, categoryFilter).length >
              0 ? (
                filterRooms(rooms, "all", searchQuery, categoryFilter).map(
                  (room) => {
                    const { status, color } = getRoomStatus(room);
                    return (
                      <Card
                        key={room.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="relative aspect-video bg-gray-100">
                          {/* Thumbnail or static image */}
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
                                  status === "Live"
                                    ? "text-white"
                                    : "text-gray-600"
                                }`}
                              >
                                {status}
                              </span>
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
                            <h3 className="font-bold text-lg truncate">
                              {room.name}
                            </h3>
                            {room.category && (
                              <Badge
                                variant="outline"
                                className="ml-2 shrink-0"
                              >
                                {room.category}
                              </Badge>
                            )}
                          </div>

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

                          <div className="flex gap-2">
                            <Button
                              onClick={() => joinRoom(room.id)}
                              className={`flex-1 ${
                                status === "Live"
                                  ? "bg-rose-600 hover:bg-rose-700"
                                  : "bg-blue-600 hover:bg-blue-700"
                              }`}
                              disabled={status === "Ended"}
                            >
                              {status === "Live"
                                ? "Join Stream"
                                : status === "Scheduled"
                                ? "View Details"
                                : "Ended"}
                            </Button>

                            {status !== "Ended" && (
                              <Button
                                variant="outline"
                                className="px-3"
                                onClick={() => {
                                  // Copy room link to clipboard
                                  const roomLink = `${window.location.origin}/livestream-view/${room.id}`;
                                  navigator.clipboard.writeText(roomLink);
                                  alert("Room link copied to clipboard!");
                                }}
                              >
                                Share
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }
                )
              ) : (
                <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                  <div className="text-gray-500">
                    No livestream rooms match your criteria
                  </div>
                  <p className="text-gray-400 mt-2">
                    Try adjusting your filters or create a new livestream
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="live">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterRooms(rooms, "live", searchQuery, categoryFilter).length >
              0 ? (
                filterRooms(rooms, "live", searchQuery, categoryFilter).map(
                  (room) => {
                    const { status, color } = getRoomStatus(room);
                    return (
                      <Card
                        key={room.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        {/* Same card content as above */}
                        <div className="relative aspect-video bg-gray-100">
                          {room.thumbnailUrl ? (
                            <img
                              src={room.thumbnailUrl || "/placeholder.svg"}
                              alt={room.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="bg-gradient-to-r from-rose-400 to-pink-500 w-full h-full flex items-center justify-center">
                              <span className="text-white text-lg font-bold">
                                Live
                              </span>
                            </div>
                          )}

                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            LIVE
                          </div>

                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {room.viewerCount || 0}
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-lg truncate">
                              {room.name}
                            </h3>
                            {room.category && (
                              <Badge
                                variant="outline"
                                className="ml-2 shrink-0"
                              >
                                {room.category}
                              </Badge>
                            )}
                          </div>

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

                          <div className="flex gap-2">
                            <Button
                              onClick={() => joinRoom(room.id)}
                              className="flex-1 bg-rose-600 hover:bg-rose-700"
                            >
                              Join Stream
                            </Button>

                            <Button
                              variant="outline"
                              className="px-3"
                              onClick={() => {
                                // Copy room link to clipboard
                                const roomLink = `${window.location.origin}/livestream-view/${room.id}`;
                                navigator.clipboard.writeText(roomLink);
                                alert("Room link copied to clipboard!");
                              }}
                            >
                              Share
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }
                )
              ) : (
                <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                  <div className="text-gray-500">
                    No live streams at the moment
                  </div>
                  <p className="text-gray-400 mt-2">
                    Create a new livestream to get started
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="scheduled">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterRooms(rooms, "scheduled", searchQuery, categoryFilter)
                .length > 0 ? (
                filterRooms(
                  rooms,
                  "scheduled",
                  searchQuery,
                  categoryFilter
                ).map((room) => {
                  return (
                    <Card
                      key={room.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Similar card content with scheduled status */}
                      <div className="relative aspect-video bg-gray-100">
                        {room.thumbnailUrl ? (
                          <img
                            src={room.thumbnailUrl || "/placeholder.svg"}
                            alt={room.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="bg-gradient-to-r from-gray-200 to-gray-300 w-full h-full flex items-center justify-center">
                            <span className="text-gray-600 text-lg font-bold">
                              Scheduled
                            </span>
                          </div>
                        )}

                        <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                          Scheduled
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-lg truncate">
                            {room.name}
                          </h3>
                          {room.category && (
                            <Badge variant="outline" className="ml-2 shrink-0">
                              {room.category}
                            </Badge>
                          )}
                        </div>

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

                        <div className="flex gap-2">
                          <Button
                            onClick={() => joinRoom(room.id)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                          >
                            View Details
                          </Button>

                          <Button
                            variant="outline"
                            className="px-3"
                            onClick={() => {
                              // Copy room link to clipboard
                              const roomLink = `${window.location.origin}/livestream-view/${room.id}`;
                              navigator.clipboard.writeText(roomLink);
                              alert("Room link copied to clipboard!");
                            }}
                          >
                            Share
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                  <div className="text-gray-500">No scheduled livestreams</div>
                  <p className="text-gray-400 mt-2">
                    Plan your next livestream by creating a new one
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="ended">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterRooms(rooms, "ended", searchQuery, categoryFilter).length >
              0 ? (
                filterRooms(rooms, "ended", searchQuery, categoryFilter).map(
                  (room) => {
                    return (
                      <Card
                        key={room.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        {/* Similar card content with ended status */}
                        <div className="relative aspect-video bg-gray-100">
                          {room.thumbnailUrl ? (
                            <img
                              src={room.thumbnailUrl || "/placeholder.svg"}
                              alt={room.name}
                              className="w-full h-full object-cover opacity-70"
                            />
                          ) : (
                            <div className="bg-gradient-to-r from-gray-300 to-gray-400 w-full h-full flex items-center justify-center">
                              <span className="text-white text-lg font-bold">
                                Ended
                              </span>
                            </div>
                          )}

                          <div className="absolute top-2 left-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                            Ended
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-lg truncate">
                              {room.name}
                            </h3>
                            {room.category && (
                              <Badge
                                variant="outline"
                                className="ml-2 shrink-0"
                              >
                                {room.category}
                              </Badge>
                            )}
                          </div>

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
                            className="w-full bg-gray-500 hover:bg-gray-600 cursor-not-allowed"
                            disabled
                          >
                            Ended
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  }
                )
              ) : (
                <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                  <div className="text-gray-500">No ended livestreams</div>
                  <p className="text-gray-400 mt-2">
                    Your past livestreams will appear here
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </LivestreamProvider>
  );
}
