
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
}