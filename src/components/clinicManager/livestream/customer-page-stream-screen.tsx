"use client"

import { useEffect } from "react"
import { useLivestream } from "./context"
import { useParams } from "next/navigation"
import { Loader2, Users } from "lucide-react"

export default function CustomerPageStreamScreen() {
  const { joinRoom, leaveRoom, localVideoRef, isConnecting, error, viewerCount, roomGuid } = useLivestream()
  const params = useParams()

  useEffect(() => {
    const id = params.id as string
    console.log("CustomerPageStreamScreen useEffect running with id:", id, "current roomGuid:", roomGuid)

    // Chỉ gọi joinRoom khi id tồn tại và khác với roomGuid hiện tại
    if (id && id !== roomGuid) {
      console.log("Calling joinRoom with id:", id)
      joinRoom(id)
    } else {
      console.log("Skipping joinRoom call because id is same as roomGuid or empty")
    }

    // Cleanup when component unmounts
    return () => {
      console.log("CustomerPageStreamScreen unmounting, calling leaveRoom")
      leaveRoom()
    }
  }, [params.id, joinRoom, leaveRoom, roomGuid]) // Thêm roomGuid vào dependencies

  return (
    <div className="flex flex-col h-full">
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Video container */}
      <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video mb-4">
        <video ref={localVideoRef} autoPlay playsInline className="w-full h-full object-cover" />

        {/* Loading overlay */}
        {isConnecting && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-white text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>Đang kết nối...</p>
            </div>
          </div>
        )}

        {/* Status indicators */}
        <div className="absolute top-4 right-4 flex items-center space-x-2 bg-black bg-opacity-50 rounded-full px-3 py-1">
          <Users className="h-4 w-4 text-white" />
          <span className="text-white text-sm">{viewerCount}</span>
        </div>

        {/* Live indicator */}
        {roomGuid && !isConnecting && !error && (
          <div className="absolute top-4 left-4 bg-red-600 text-white rounded-full px-3 py-1 text-sm font-medium">
            LIVE
          </div>
        )}
      </div>
    </div>
  )
}

