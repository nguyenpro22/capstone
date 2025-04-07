"use client";

interface ReactionButtonProps {
  emoji: string;
  text: string;
  id: number;
  onSendReaction: (id: number) => void;
}

export function ReactionButton({
  emoji,
  text,
  id,
  onSendReaction,
}: ReactionButtonProps) {
  return (
    <button
      onClick={() => onSendReaction(id)}
      className="bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-sm px-3 py-1.5 rounded-full border border-rose-200 transition-colors flex items-center"
    >
      <span className="mr-1">{emoji}</span>
      <span>{text}</span>
    </button>
  );
}
