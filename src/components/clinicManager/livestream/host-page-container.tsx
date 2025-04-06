"use client"

import { useEffect, useRef } from "react"
import { useLivestream } from "./context"
import { useRouter } from "next/navigation"

export default function HostPageContainer() {
  const { formData, isFormSubmitted, isCreateRoom, isConnecting, error, createRoom } = useLivestream()
  const router = useRouter()
  const hasCalledCreateRoomRef = useRef(false)

  useEffect(() => {
    console.log("HostPageContainer useEffect running with:", {
      formData,
      isFormSubmitted,
      isCreateRoom,
      isConnecting,
      error,
      hasCalledCreateRoomRef: hasCalledCreateRoomRef.current,
    })

    if (!formData || !isFormSubmitted) {
      // No form data, redirect back to form
      router.push("/clinicManager/live-stream")
      return
    }

    // Chỉ gọi createRoom nếu chưa gọi trước đó và các điều kiện khác thỏa mãn
    if (!isCreateRoom && !isConnecting && !error && !hasCalledCreateRoomRef.current) {
      console.log("Calling createRoom for the first time")
      hasCalledCreateRoomRef.current = true
      // Auto-create room when component mounts and form is submitted
      createRoom()
    }
  }, [formData, isFormSubmitted, isCreateRoom, isConnecting, error, createRoom, router])

  return null // This component doesn't render anything
}

