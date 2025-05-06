
export interface LivestreamRoom {
    id: string;
    name: string;
    startDate: string;
    clinicId: string;
    clinicName: string;
    description?: string;
    coverImage?: string;
  }

  
export interface LivestreamRoomDetail {
  joinCount: number
  messageCount: number
  reactionCount: number
  totalActivities: number
  totalBooking: number
  logs?: {
    items: Array<{
      id: string
      userId: string
      email: string
      fullName: string
      phone: string | null
      profilePictureUrl: string | null
      logType: string
      message: string | null
      createdOnUtc: string
    }>
    pageIndex: number
    pageSize: number
    totalCount: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}