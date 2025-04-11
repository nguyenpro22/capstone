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
  content: string;
  createdOnUtc: string;
}
