import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Reply,
  MoreHorizontal,
  Flag,
  Edit,
  Trash2,
  Send,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { blogService } from "@/services/blogService";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    isVerified?: boolean;
  };
  createdAt: string;
  updatedAt?: string;
  likes: number;
  dislikes: number;
  replies: Comment[];
  isLiked?: boolean;
  isDisliked?: boolean;
  isAuthor?: boolean;
  isPinned?: boolean;
}

interface CommentsSectionProps {
  postId: string;
  postSlug: string;
  className?: string;
}

export default function CommentsSection({
  postId,
  postSlug,
  className,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(
    new Set(),
  );

  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from an API
      const mockComments: Comment[] = [
        {
          id: "1",
          content:
            "Great article! This really helped me understand the concept better. The examples were particularly useful.",
          author: {
            id: "user1",
            name: "Sarah Johnson",
            avatar:
              "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            isVerified: true,
          },
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          likes: 12,
          dislikes: 1,
          replies: [
            {
              id: "1-1",
              content:
                "I agree! The step-by-step breakdown made it so much clearer.",
              author: {
                id: "user2",
                name: "Mike Chen",
                avatar:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
              },
              createdAt: new Date(
                Date.now() - 1 * 60 * 60 * 1000,
              ).toISOString(),
              likes: 5,
              dislikes: 0,
              replies: [],
            },
          ],
          isPinned: true,
        },
        {
          id: "2",
          content:
            "Could you provide more information about the advanced techniques mentioned in section 3?",
          author: {
            id: "user3",
            name: "Alex Rivera",
            avatar:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          },
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          likes: 8,
          dislikes: 0,
          replies: [],
        },
        {
          id: "3",
          content:
            "Thanks for sharing this. I've bookmarked it for future reference!",
          author: {
            id: "user4",
            name: "Emma Wilson",
            avatar:
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
          },
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          likes: 3,
          dislikes: 0,
          replies: [],
        },
      ];
      setComments(mockComments);
    } catch (error) {
      console.error("Failed to load comments:", error);
      toast({
        title: "Error",
        description: "Failed to load comments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to leave a comment.",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      // In a real app, this would submit to an API
      const comment: Comment = {
        id: Date.now().toString(),
        content: newComment,
        author: {
          id: user?.id || "current-user",
          name: user?.username || "Current User",
          avatar:
            user?.avatar ||
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        },
        createdAt: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        replies: [],
        isAuthor: true,
      };

      setComments((prev) => [comment, ...prev]);
      setNewComment("");

      toast({
        title: "Comment Posted",
        description: "Your comment has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!isAuthenticated || !replyContent.trim()) return;

    try {
      const reply: Comment = {
        id: `${parentId}-${Date.now()}`,
        content: replyContent,
        author: {
          id: user?.id || "current-user",
          name: user?.username || "Current User",
          avatar:
            user?.avatar ||
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        },
        createdAt: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        replies: [],
        isAuthor: true,
      };

      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...comment.replies, reply],
            };
          }
          return comment;
        }),
      );

      setReplyContent("");
      setReplyTo(null);

      toast({
        title: "Reply Posted",
        description: "Your reply has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLikeComment = (
    commentId: string,
    isReply = false,
    parentId?: string,
  ) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like comments.",
        variant: "destructive",
      });
      return;
    }

    setComments((prev) =>
      prev.map((comment) => {
        if (isReply && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === commentId) {
                const wasLiked = reply.isLiked;
                const wasDisliked = reply.isDisliked;
                return {
                  ...reply,
                  isLiked: !wasLiked,
                  isDisliked: false,
                  likes: wasLiked ? reply.likes - 1 : reply.likes + 1,
                  dislikes: wasDisliked ? reply.dislikes - 1 : reply.dislikes,
                };
              }
              return reply;
            }),
          };
        } else if (comment.id === commentId) {
          const wasLiked = comment.isLiked;
          const wasDisliked = comment.isDisliked;
          return {
            ...comment,
            isLiked: !wasLiked,
            isDisliked: false,
            likes: wasLiked ? comment.likes - 1 : comment.likes + 1,
            dislikes: wasDisliked ? comment.dislikes - 1 : comment.dislikes,
          };
        }
        return comment;
      }),
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const renderComment = (
    comment: Comment,
    isReply = false,
    parentId?: string,
  ) => (
    <div
      key={comment.id}
      className={cn(
        "space-y-3",
        isReply && "ml-8 border-l-2 border-gray-200 pl-4",
      )}
    >
      <div className="flex gap-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
          <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{comment.author.name}</span>
            {comment.author.isVerified && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                ✓ Verified
              </Badge>
            )}
            {comment.isPinned && (
              <Badge className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800">
                📌 Pinned
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
            </span>
            {comment.isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="h-3 w-3 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <p className="text-sm text-gray-700 leading-relaxed">
            {comment.content}
          </p>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-6 text-xs gap-1",
                comment.isLiked && "text-blue-600",
              )}
              onClick={() => handleLikeComment(comment.id, isReply, parentId)}
            >
              <ThumbsUp className="h-3 w-3" />
              {comment.likes > 0 && comment.likes}
            </Button>

            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs gap-1"
                onClick={() =>
                  setReplyTo(replyTo === comment.id ? null : comment.id)
                }
              >
                <Reply className="h-3 w-3" />
                Reply
              </Button>
            )}

            {!isReply && comment.replies.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs gap-1"
                onClick={() => toggleReplies(comment.id)}
              >
                <MessageSquare className="h-3 w-3" />
                {comment.replies.length}{" "}
                {comment.replies.length === 1 ? "reply" : "replies"}
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Flag className="h-3 w-3 mr-2" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Reply Input */}
          {replyTo === comment.id && (
            <div className="space-y-2 pt-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleSubmitReply(comment.id)}
                  disabled={!replyContent.trim()}
                >
                  <Send className="h-3 w-3 mr-1" />
                  Reply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setReplyTo(null);
                    setReplyContent("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Replies */}
          {!isReply &&
            comment.replies.length > 0 &&
            expandedReplies.has(comment.id) && (
              <div className="space-y-4 mt-4">
                {comment.replies.map((reply) =>
                  renderComment(reply, true, comment.id),
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Input */}
        <div className="space-y-3">
          <Textarea
            placeholder={
              isAuthenticated
                ? "Share your thoughts..."
                : "Please sign in to leave a comment"
            }
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!isAuthenticated}
            rows={3}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {newComment.length}/500 characters
            </span>
            <Button
              onClick={handleSubmitComment}
              disabled={!isAuthenticated || !newComment.trim() || isSubmitting}
              size="sm"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </div>

        {/* Comments List */}
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No comments yet
            </h3>
            <p className="text-gray-500">
              Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => renderComment(comment))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
