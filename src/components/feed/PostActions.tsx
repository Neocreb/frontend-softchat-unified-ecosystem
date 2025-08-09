import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/hooks/use-notification";
import { useAuth } from "@/contexts/AuthContext";
import { ActivityRewardService } from "@/services/activityRewardService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EnhancedShareDialog from './EnhancedShareDialog';

interface PostActionsProps {
  postId: string;
  initialLikes: number;
  initialComments: number;
  initialShares: number;
  initialLiked?: boolean;
  initialSaved?: boolean;
  onLikeChange?: (liked: boolean) => void;
  onSaveChange?: (saved: boolean) => void;
}

const PostActions = ({
  postId,
  initialLikes,
  initialComments,
  initialShares,
  initialLiked = false,
  initialSaved = false,
  onLikeChange,
  onSaveChange,
}: PostActionsProps) => {
  const [liked, setLiked] = useState(initialLiked);
  const [saved, setSaved] = useState(initialSaved);
  const [likes, setLikes] = useState(initialLikes);
  const [likeStartTime, setLikeStartTime] = useState<number | null>(null);
  const notification = useNotification();
  const { user } = useAuth();

  const handleLike = async () => {
    const newLikedState = !liked;
    const timeSpent = likeStartTime ? Date.now() - likeStartTime : 0;

    setLiked(newLikedState);
    setLikes((prevLikes) => (newLikedState ? prevLikes + 1 : prevLikes - 1));
    onLikeChange?.(newLikedState);

    // Track reward for liking a post
    if (newLikedState && user?.id) {
      try {
        const reward = await ActivityRewardService.logPostLiked(
          user.id,
          postId,
          timeSpent / 1000, // Convert to seconds
        );

        if (reward.success && reward.softPoints > 0) {
          notification.success(`+${reward.softPoints} SoftPoints earned!`, {
            description: "Keep engaging to earn more rewards",
          });
        }
      } catch (error) {
        console.error("Failed to log like activity:", error);
      }
    }
  };

  const handleSave = () => {
    const newSavedState = !saved;
    setSaved(newSavedState);
    onSaveChange?.(newSavedState);
    notification.success(
      newSavedState ? "Post saved" : "Post removed from saved items",
      {
        description: newSavedState
          ? "You can find this post in your saved items"
          : undefined,
      },
    );
  };

  const handleShare = async () => {
    // Track reward for sharing
    if (user?.id) {
      try {
        const reward = await ActivityRewardService.logShare(
          user.id,
          postId,
          "post",
        );

        if (reward.success && reward.softPoints > 0) {
          notification.success(
            `+${reward.softPoints} SoftPoints earned for sharing!`,
            { description: "Thanks for spreading the word" },
          );
        }
      } catch (error) {
        console.error("Failed to log share activity:", error);
      }
    }

    notification.info("Share post", {
      description: "Sharing options will be available soon!",
    });
  };

  return (
    <div className="flex items-center justify-between pt-3 pb-1">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 px-2"
          onClick={handleLike}
          onMouseDown={() => setLikeStartTime(Date.now())}
        >
          <Heart
            className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`}
          />
          <span className="text-xs">{likes}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 px-2"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">{initialComments}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 px-2"
          onClick={handleShare}
        >
          <Share className="h-4 w-4" />
          <span className="text-xs">{initialShares}</span>
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="px-2" onClick={handleSave}>
          <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="px-2">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => notification.info("Report post")}>
              Report post
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => notification.info("Hide post")}>
              Hide post
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => notification.info("Mute user")}>
              Mute user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default PostActions;
