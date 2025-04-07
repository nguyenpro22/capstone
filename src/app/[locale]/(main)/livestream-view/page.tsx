"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Search,
  Calendar,
  Users,
  Clock,
  ArrowRight,
} from "lucide-react";

interface Room {
  id: string;
  name: string;
  clinicName: string;
  startDate: string;
  description?: string;
  coverImage?: string;
}

export default function CustomerPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roomGuid, setRoomGuid] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
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
  }, []);

  const joinRoom = (roomId: string) => {
    if (!roomId) {
      alert("Please enter or select a room ID");
      return;
    }

    console.log(`Joining room: ${roomId}`);
    router.push(`/livestream-view/${roomId}`);
  };

  // Format date for better readability
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Get time ago string
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  // Filter rooms based on search term
  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.clinicName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-rose-500 mx-auto mb-4" />
          <p className="text-lg text-rose-800">Loading livestream rooms...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md border border-rose-200 max-w-md w-full">
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
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
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Error Loading Livestreams
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-rose-100">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-rose-700">
            Beautify Livestream
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-xl p-8 mb-8 shadow-sm">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-rose-800 mb-4">
              Join Live Beauty Sessions
            </h2>
            <p className="text-rose-700 mb-6">
              Watch professional beauty experts showcase their techniques and
              services in real-time. Ask questions, get personalized advice, and
              enjoy exclusive discounts!
            </p>

            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search livestreams by name or clinic..."
                className="w-full px-4 py-3 pl-10 rounded-lg border border-rose-200 focus:ring-rose-500 focus:border-rose-500"
              />
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            </div>

            <div className="mt-4 flex items-center">
              <p className="text-sm text-rose-600 mr-2">Have a room ID?</p>
              <div className="flex flex-1 sm:flex-none">
                <input
                  className="flex-1 sm:w-64 h-10 border border-rose-300 rounded-l-lg p-2 focus:ring-rose-500 focus:border-rose-500"
                  type="text"
                  value={roomGuid}
                  onChange={(e) => {
                    setRoomGuid(e.target.value);
                  }}
                  placeholder="Enter room ID"
                />
                <button
                  onClick={() => joinRoom(roomGuid)}
                  className="px-4 py-2 font-medium text-white bg-rose-500 rounded-r-lg hover:bg-rose-600 transition"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Livestream Rooms */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-rose-800 mb-6">
            Available Livestreams
          </h2>

          {filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition border border-rose-100"
                  onClick={() => joinRoom(room.id)}
                >
                  <div className="h-48 bg-rose-100 relative cursor-pointer">
                    {room.coverImage ? (
                      <img
                        src={room.coverImage || "/placeholder.svg"}
                        alt={room.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-rose-200 to-pink-200">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 text-rose-500 opacity-50"
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
                    )}
                    <div className="absolute top-3 right-3 bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
                      LIVE
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      <span>Join Now</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-1">
                      {room.name}
                    </h3>
                    <p className="text-rose-600 text-sm mb-3">
                      {room.clinicName}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(room.startDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{getTimeAgo(room.startDate)}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        joinRoom(room.id);
                      }}
                      className="mt-4 w-full bg-gradient-to-r from-rose-400 to-pink-500 text-white py-2 rounded-lg font-medium hover:from-rose-500 hover:to-pink-600 transition flex items-center justify-center"
                    >
                      Join Livestream
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center border border-rose-100">
              <div className="flex flex-col items-center">
                <div className="bg-rose-100 rounded-full p-3 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-rose-500"
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
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No Livestreams Available
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm
                    ? `No livestreams matching "${searchTerm}" were found.`
                    : "There are no livestreams available at this time. Please check back later."}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-rose-600 hover:text-rose-800 font-medium"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* How It Works Section */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-rose-100">
          <h2 className="text-2xl font-bold text-rose-800 mb-6 text-center">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-rose-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-rose-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">
                1. Browse Livestreams
              </h3>
              <p className="text-gray-600">
                Find beauty sessions that interest you from our curated list of
                professional beauty experts.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-rose-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-rose-500"
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
              <h3 className="font-bold text-gray-800 mb-2">
                2. Join the Session
              </h3>
              <p className="text-gray-600">
                Click on a livestream to join and watch beauty professionals
                demonstrate their techniques in real-time.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-rose-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-rose-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">
                3. Interact & Enjoy
              </h3>
              <p className="text-gray-600">
                Ask questions, send reactions, and enjoy exclusive discounts on
                beauty services during the livestream.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
