"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useLivestream } from "@/components/clinicManager/livestream/context";

interface Room {
  id: string;
  name: string;
  clinicName: string;
  startDate: string;
}

export default function CustomerPage() {
  const router = useRouter();
  const { joinRoom, error, clearError } = useLivestream();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [roomGuid, setRoomGuid] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("https://beautify.asia/api/LiveStream");
        const data = await response.json();

        if (data.isSuccess) {
          setRooms(data.value);
        } else {
          setFetchError(
            `Error: ${data.error?.message || "Failed to fetch rooms"}`
          );
        }
      } catch (err) {
        setFetchError(
          `Error: ${err instanceof Error ? err.message : "Unknown error"}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleJoinRoom = async (roomId: string) => {
    if (!roomId) {
      alert("Please enter or select a room ID");
      return;
    }

    clearError();
    console.log(`Joining room: ${roomId}`);
    await joinRoom(roomId);
    router.push(`/livestream-view/${roomId}`);
  };

  // Format date for better readability
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading)
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500 mb-4" />
        <div className="text-center text-lg font-medium text-gray-700">
          Loading livestream rooms...
        </div>
      </div>
    );

  if (fetchError)
    return (
      <div className="p-8 text-center">
        <div className="inline-block bg-red-50 text-red-500 p-4 rounded-lg border border-red-200 mb-4">
          {fetchError}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
        >
          Try Again
        </button>
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
        Available Livestream Rooms
      </h1>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
          <button
            onClick={clearError}
            className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-medium mb-4 text-gray-700">
          Join a specific room
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            className="flex-1 h-12 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            type="text"
            value={roomGuid}
            onChange={(e) => {
              setRoomGuid(e.target.value);
            }}
            placeholder="Enter room ID"
          />
          <button
            onClick={() => handleJoinRoom(roomGuid)}
            className="px-6 py-3 font-medium text-white bg-rose-500 rounded-lg hover:bg-rose-600 transition shadow-sm"
          >
            Join Livestream Room
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div
              key={room.id}
              className="border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow bg-white"
            >
              <h2 className="font-bold text-xl text-gray-800 mb-2">
                {room.name}
              </h2>
              <p className="text-rose-600 font-medium">{room.clinicName}</p>
              <p className="text-sm text-gray-500 mb-6">
                Starts: {formatDate(room.startDate)}
              </p>
              <button
                onClick={() => handleJoinRoom(room.id)}
                className="w-full px-4 py-3 font-medium text-white bg-rose-500 rounded-lg hover:bg-rose-600 transition shadow-sm"
              >
                Join Room
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center p-12 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-gray-500 mb-4">
              No livestream rooms available at this time
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
