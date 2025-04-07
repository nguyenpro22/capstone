import type { Reaction } from "../livestream";

interface FloatingReactionsProps {
  reactions: Reaction[];
}

// CSS animation for floating reactions
const reactionAnimationStyle = `
  @keyframes floatUpAndFade {
    0% { 
      transform: translateY(0);
      opacity: 0;
    }
    10% { 
      transform: translateY(-10px);
      opacity: 1;
    }
    80% { 
      transform: translateY(-80px);
      opacity: 1;
    }
    100% { 
      transform: translateY(-120px);
      opacity: 0;
    }
  }
  
  .floating-reaction {
    position: absolute;
    bottom: 20px;
    font-size: 2.5rem;
    animation: floatUpAndFade 3s forwards;
    z-index: 50;
    text-shadow: 0 0 5px white;
  }
`;

export function FloatingReactions({ reactions }: FloatingReactionsProps) {
  if (reactions.length === 0) return null;

  return (
    <>
      <style>{reactionAnimationStyle}</style>
      {reactions.map((reaction) => (
        <div
          key={reaction.key}
          className="floating-reaction pointer-events-none"
          style={{ left: `${reaction.left}%` }}
        >
          {reaction.emoji}
        </div>
      ))}
    </>
  );
}
