export interface Conversation {
  conversationId: string;
  entityId: string;
  friendName: string;
  friendImageUrl: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  isClinic: boolean;
  senderName: string;
  senderImageUrl: string | null;
  content: string;
  createdOnUtc: string;
}
