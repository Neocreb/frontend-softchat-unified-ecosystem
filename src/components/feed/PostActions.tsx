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
  const notification = useNotification();

  const handleLike = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikes((prevLikes) => (newLikedState ? prevLikes + 1 : prevLikes - 1));
    onLikeChange?.(newLikedState);
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

  const handleShare = () => {
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
