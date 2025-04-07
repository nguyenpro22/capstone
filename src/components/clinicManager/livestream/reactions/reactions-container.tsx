import { REACTIONS_MAP } from "../livestream";
import { ReactionButton } from "./reaction-button";

interface ReactionsContainerProps {
  onSendReaction: (id: number) => void;
}

export function ReactionsContainer({
  onSendReaction,
}: ReactionsContainerProps) {
  return (
    <div className="px-4 pt-3 pb-1">
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs text-rose-500 font-medium">Quick Reactions:</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(REACTIONS_MAP).map(([id, { emoji, text }]) => (
          <ReactionButton
            key={id}
            emoji={emoji}
            text={text}
            id={Number(id)}
            onSendReaction={onSendReaction}
          />
        ))}
      </div>
    </div>
  );
}
