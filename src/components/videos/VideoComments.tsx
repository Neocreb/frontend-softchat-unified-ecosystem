
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, MoreHorizontal, X } from "lucide-react";
import { cn } from "@/utils/utils";

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified?: boolean;
  };
  content: string;
  likes: number;
  liked: boolean;
  replies: number;
  timestamp: string;
}

interface VideoCommentsProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

const VideoComments = ({ isOpen, onClose, videoId }: VideoCommentsProps) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      user: { name: "Sarah Johnson", avatar: "/placeholder.svg", verified: true },
      content: "This is absolutely amazing! Love the creativity 🔥",
      likes: 24,
      liked: false,
      replies: 3,
      timestamp: "2m"
    },
    {
      id: "2",
      user: { name: "Mike Chen", avatar: "/placeholder.svg" },
      content: "Can you do a tutorial on this? Would love to learn!",
      likes: 12,
      liked: true,
      replies: 1,
      timestamp: "5m"
    },
    {
      id: "3",
      user: { name: "Emma Davis", avatar: "/placeholder.svg" },
      content: "The quality is incredible! What camera are you using?",
      likes: 8,
      liked: false,
      replies: 0,
      timestamp: "8m"
    }
  ]);

  const handleLike = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          liked: !comment.liked,
          likes: comment.liked ? comment.likes - 1 : comment.likes + 1
        };
      }
      return comment;
    }));
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: { name: "You", avatar: "/placeholder.svg" },
      content: newComment,
      likes: 0,
      liked: false,
      replies: 0,
      timestamp: "now"
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
      <div className="bg-background w-full max-w-md h-[70vh] md:h-[80vh] rounded-t-lg md:rounded-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Comments</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={comment.user.avatar} />
                <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{comment.user.name}</span>
                  {comment.user.verified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                  <span className="text-muted-foreground text-xs">{comment.timestamp}</span>
                </div>
                
                <p className="text-sm mb-2">{comment.content}</p>
                
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-auto p-0 text-muted-foreground hover:text-foreground",
                      comment.liked && "text-red-500"
                    )}
                    onClick={() => handleLike(comment.id)}
                  >
                    <Heart className={cn("h-4 w-4 mr-1", comment.liked && "fill-current")} />
                    {comment.likes}
                  </Button>
                  
                  {comment.replies > 0 && (
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-muted-foreground hover:text-foreground">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {comment.replies}
                    </Button>
                  )}
                  
                  <Button variant="ghost" size="sm" className="h-auto p-0 text-muted-foreground hover:text-foreground">
                    Reply
                  </Button>
                </div>
              </div>
              
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Comment input */}
        <div className="p-4 border-t">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              
              <div className="flex justify-end mt-2">
                <Button 
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                  size="sm"
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoComments;
