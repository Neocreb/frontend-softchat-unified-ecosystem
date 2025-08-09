import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MessageCircle,
  Heart,
  Reply,
  MoreHorizontal,
  Send,
  ThumbsUp,
  Flag,
  Share2,
  TrendingUp,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ActivityRewardService } from "@/services/activityRewardService";
import { useNotification } from "@/hooks/use-notification";
import { cn } from "@/utils/utils";

interface Comment {
  id: string;
  content: string;
  userId: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  createdAt: string;
  likes: number;
  liked?: boolean;
  parentId?: string;
  replies?: Comment[];
  canPromoteToPost?: boolean;
}

interface Post {
  id: string;
  content: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  image?: string;
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
}

interface EnhancedCommentsModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onCommentAdded?: (comment: Comment) => void;
  onCommentLiked?: (commentId: string) => void;
  onCommentPromoted?: (comment: Comment) => void;
}

const EnhancedCommentsModal: React.FC<EnhancedCommentsModalProps> = ({
  post,
  isOpen,
  onClose,
  onCommentAdded,
  onCommentLiked,
  onCommentPromoted,
}) => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      content: "This is an amazing post! Thanks for sharing your insights.",
      userId: "user1",
      user: {
        name: "Alice Johnson",
        username: "alice_dev",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
        verified: true,
      },
      createdAt: "2h",
      likes: 12,
      liked: false,
      canPromoteToPost: true,
    },
    {
      id: "2",
      content: "Couldn't agree more! This really helped me understand the concept better.",
      userId: "user2",
      user: {
        name: "Bob Smith",
        username: "bob_codes",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        verified: false,
      },
      createdAt: "1h",
      likes: 8,
      liked: true,
      replies: [
        {
          id: "2-1",
          content: "Same here! The examples were particularly helpful.",
          userId: "user3",
          user: {
            name: "Carol Davis",
            username: "carol_design",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
            verified: false,
          },
          createdAt: "30m",
          likes: 3,
          parentId: "2",
        },
      ],
    },
  ]);

  const { toast } = useToast();
  const { user } = useAuth();
  const notification = useNotification();

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      userId: user.id,
      user: {
        name: user.name || "User",
        username: user.username || "user",
        avatar: user.avatar || "/placeholder.svg",
        verified: user.verified || false,
      },
      createdAt: "now",
      likes: 0,
      liked: false,
      canPromoteToPost: true,
    };

    setComments(prev => [comment, ...prev]);
    setNewComment("");

    // Track reward for commenting
    try {
      const reward = await ActivityRewardService.logComment(
        user.id,
        post.id,
        newComment.length
      );
      if (reward.success && reward.softPoints > 0) {
        notification.success(`+${reward.softPoints} SoftPoints earned for commenting!`);
      }
    } catch (error) {
      console.error("Failed to log comment activity:", error);
    }

    onCommentAdded?.(comment);
    
    toast({
      title: "Comment added!",
      description: "Your comment has been posted",
    });
  };

  const handleAddReply = async () => {
    if (!replyContent.trim() || !replyingTo || !user) return;

    const reply: Comment = {
      id: `${replyingTo}-${Date.now()}`,
      content: replyContent,
      userId: user.id,
      user: {
        name: user.name || "User",
        username: user.username || "user",
        avatar: user.avatar || "/placeholder.svg",
        verified: user.verified || false,
      },
      createdAt: "now",
      likes: 0,
      liked: false,
      parentId: replyingTo,
    };

    setComments(prev => prev.map(comment => {
      if (comment.id === replyingTo) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply],
        };
      }
      return comment;
    }));

    setReplyContent("");
    setReplyingTo(null);

    // Track reward for replying
    try {
      const reward = await ActivityRewardService.logComment(
        user.id,
        post.id,
        replyContent.length
      );
      if (reward.success && reward.softPoints > 0) {
        notification.success(`+${reward.softPoints} SoftPoints earned for replying!`);
      }
    } catch (error) {
      console.error("Failed to log reply activity:", error);
    }

    toast({
      title: "Reply added!",
      description: "Your reply has been posted",
    });
  };

  const handleLikeComment = async (commentId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        const newLiked = !comment.liked;
        return {
          ...comment,
          liked: newLiked,
          likes: newLiked ? comment.likes + 1 : comment.likes - 1,
        };
      }
      
      // Check replies
      if (comment.replies) {
        return {
          ...comment,
          replies: comment.replies.map(reply => {
            if (reply.id === commentId) {
              const newLiked = !reply.liked;
              return {
                ...reply,
                liked: newLiked,
                likes: newLiked ? reply.likes + 1 : reply.likes - 1,
              };
            }
            return reply;
          }),
        };
      }
      
      return comment;
    }));

    // Track reward for liking comment
    if (user?.id) {
      try {
        const reward = await ActivityRewardService.logActivity({
          userId: user.id,
          actionType: "like_post", // Using existing type for now
          targetId: commentId,
          targetType: "comment",
        });
        if (reward.success && reward.softPoints > 0) {
          notification.success(`+${reward.softPoints} SoftPoints earned!`);
        }
      } catch (error) {
        console.error("Failed to log like activity:", error);
      }
    }

    onCommentLiked?.(commentId);
  };

  const handlePromoteComment = (comment: Comment) => {
    onCommentPromoted?.(comment);
    toast({
      title: "Comment promoted!",
      description: "Comment has been promoted to a post in your feed",
    });
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={cn("space-y-3", isReply && "ml-12 border-l-2 border-muted pl-4")}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={comment.user.avatar} />
          <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{comment.user.name}</span>
            {comment.user.verified && (
              <Badge variant="default" className="px-1 py-0 h-4 text-xs">✓</Badge>
            )}
            <span className="text-xs text-muted-foreground">@{comment.user.username}</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
          </div>
          
          <p className="text-sm">{comment.content}</p>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex items-center gap-1 text-xs h-7 px-2",
                comment.liked && "text-red-500"
              )}
              onClick={() => handleLikeComment(comment.id)}
            >
              <Heart className={cn("h-3 w-3", comment.liked && "fill-current")} />
              <span>{comment.likes}</span>
            </Button>
            
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-xs h-7 px-2"
                onClick={() => setReplyingTo(comment.id)}
              >
                <Reply className="h-3 w-3" />
                Reply
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {comment.canPromoteToPost && !isReply && (
                  <DropdownMenuItem onClick={() => handlePromoteComment(comment)}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Promote to Post
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Comment
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Reply input */}
      {replyingTo === comment.id && (
        <div className="ml-11 space-y-2">
          <Input
            placeholder={`Reply to ${comment.user.name}...`}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddReply()}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAddReply} disabled={!replyContent.trim()}>
              <Send className="h-3 w-3 mr-1" />
              Reply
            </Button>
            <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comments ({comments.length})
          </DialogTitle>
        </DialogHeader>

        {/* Original Post */}
        <div className="border-b pb-4">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{post.author.name}</span>
                {post.author.verified && (
                  <Badge variant="default" className="px-1 py-0 h-4 text-xs">✓</Badge>
                )}
                <span className="text-sm text-muted-foreground">@{post.author.username}</span>
              </div>
              <p className="text-sm mb-2">{post.content}</p>
              {post.image && (
                <img src={post.image} alt="Post" className="rounded max-h-40 object-cover" />
              )}
            </div>
          </div>
        </div>

        {/* Add Comment */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} />
              <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Input
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <Button 
                onClick={handleAddComment} 
                disabled={!newComment.trim()}
                size="sm"
              >
                <Send className="h-3 w-3 mr-1" />
                Comment
              </Button>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {comments.map((comment) => renderComment(comment))}
          
          {comments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Be the first to comment!</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedCommentsModal;
