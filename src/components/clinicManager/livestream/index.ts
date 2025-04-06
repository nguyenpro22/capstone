// Thêm các interface cần thiết nếu chưa có
export interface Room {
  id: string
  name: string
  clinicName?: string
  startDate: string
  endDate?: string
  description?: string
  category?: string
  isPrivate?: boolean
  viewerCount?: number
  thumbnailUrl?: string
}

export interface ChatMessage {
  message: string
  sender?: string
  timestamp?: string
}

export interface Reaction {
  id: number
  emoji: string
  left: number
  key: string
}

export interface RoomCreatedAndJoinedData {
  roomGuid: string
  janusRoomId: number
  sessionId: string
}

export interface PublishStartedData {
  sessionId: string
  jsep: string
}

export interface JoinRoomResponseData {
  jsep: string
  roomId: string
  sessionId: string
  handleId: string
}

export interface ReactionData {
  id: string | number
}

export interface ApiResponse<T> {
  isSuccess: boolean
  value: T
  error?: {
    message: string
    code?: string
  }
}

