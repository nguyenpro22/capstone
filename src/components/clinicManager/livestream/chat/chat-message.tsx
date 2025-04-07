import type { ChatMessage } from "../livestream";

interface ChatMessageProps {
  message: ChatMessage;
  isHost?: boolean;
}

export function ChatMessageItem({ message, isHost = false }: ChatMessageProps) {
  return (
    <div className="flex items-start mb-3">
      <div className="w-8 h-8 rounded-full bg-rose-300 flex items-center justify-center mr-2 flex-shrink-0">
        🧑
      </div>
      <div
        className={`${
          isHost ? "bg-rose-100" : "bg-rose-100"
        } px-4 py-2 rounded-lg break-words overflow-hidden max-w-[85%]`}
      >
        {message.message}
      </div>
    </div>
  );
}
