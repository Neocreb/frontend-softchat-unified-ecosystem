
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";

interface ReactionsProps {
  postId: string;
  initialReactions?: {
    like: number;
    love: number;
    wow: number;
    angry: number;
    sad: number;
  };
  userReaction?: string | null;
  onReact: (postId: string, reaction: string) => void;
}

const reactionEmojis = {
  like: "👍",
  love: "❤️",
  wow: "😮",
  angry: "😠",
  sad: "😢"
};

const Reactions = ({ postId, initialReactions, userReaction, onReact }: ReactionsProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const [reactions, setReactions] = useState(initialReactions || {
    like: 0,
    love: 0,
    wow: 0,
    angry: 0,
    sad: 0
  });
  const [currentReaction, setCurrentReaction] = useState<string | null>(userReaction || null);

  const handleReaction = (reaction: string) => {
    if (currentReaction === reaction) {
      // Remove reaction
      setReactions(prev => ({
        ...prev,
        [reaction]: Math.max(0, prev[reaction as keyof typeof prev] - 1)
      }));
      setCurrentReaction(null);
    } else {
      // Add new reaction or change existing
      setReactions(prev => {
        const newReactions = { ...prev };
        if (currentReaction) {
          newReactions[currentReaction as keyof typeof newReactions] = Math.max(0, newReactions[currentReaction as keyof typeof newReactions] - 1);
        }
        newReactions[reaction as keyof typeof newReactions] += 1;
        return newReactions;
      });
      setCurrentReaction(reaction);
    }
    
    onReact(postId, reaction);
    setShowPicker(false);
  };

  const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <div 
          className="relative"
          onMouseEnter={() => setShowPicker(true)}
          onMouseLeave={() => setShowPicker(false)}
        >
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center gap-2 hover:bg-blue-50 transition-all duration-200",
              currentReaction && "text-blue-600"
            )}
            onClick={() => handleReaction('like')}
          >
            {currentReaction ? reactionEmojis[currentReaction as keyof typeof reactionEmojis] : "👍"}
            <span className="text-sm font-medium">
              {currentReaction ? currentReaction.charAt(0).toUpperCase() + currentReaction.slice(1) : "Like"}
            </span>
          </Button>

          {showPicker && (
            <div className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg border p-2 flex gap-1 z-10 animate-scale-in">
              {Object.entries(reactionEmojis).map(([reaction, emoji]) => (
                <button
                  key={reaction}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-xl transition-transform hover:scale-125"
                  onClick={() => handleReaction(reaction)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {totalReactions > 0 && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <div className="flex -space-x-1">
              {Object.entries(reactions)
                .filter(([_, count]) => count > 0)
                .slice(0, 3)
                .map(([reaction, _]) => (
                  <span key={reaction} className="text-base">
                    {reactionEmojis[reaction as keyof typeof reactionEmojis]}
                  </span>
                ))
              }
            </div>
            <span>{totalReactions}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reactions;
