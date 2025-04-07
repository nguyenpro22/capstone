// Shared types for the livestream application
export interface ChatMessage {
  message: string;
  sender?: string;
  timestamp?: string;
}

export interface Reaction {
  id: number;
  emoji: string;
  left: number;
  key: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  category?: {
    name: string;
  };
  minPrice: number;
  maxPrice: number;
  discountPercent?: number;
  discountLivePercent?: number;
  visible?: boolean;
  images?: string[];
}

export interface Room {
  id: string;
  name: string;
  clinicName: string;
  startDate: string;
}

export const REACTIONS_MAP: Record<number, { emoji: string; text: string }> = {
  1: { emoji: "👍", text: "Looks great!" },
  2: { emoji: "❤️", text: "Love it!" },
  3: { emoji: "🔥", text: "That's fire!" },
  4: { emoji: "👏", text: "Amazing work!" },
  5: { emoji: "😍", text: "Beautiful!" },
};
