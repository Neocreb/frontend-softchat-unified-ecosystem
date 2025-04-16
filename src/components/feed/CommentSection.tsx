
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostComment } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";

interface CommentSectionProps {
  postId: string;
  comments: PostComment[];
  onAddComment: (postId: string, comment: string) => void;
}

const CommentSection = ({ postId, comments, onAddComment }: CommentSectionProps) => {
  const [commentInput, setCommentInput] = useState("");
  const { user } = useAuth();

  const handleSubmit = () => {
    if (commentInput.trim()) {
      onAddComment(postId, commentInput);
      setCommentInput("");
    }
  };

  return (
    <div className="px-4 pb-2">
      {comments && comments.length > 0 && (
        <div className="py-2 space-y-3">
          {comments.map(comment => (
            <div key={comment.id} className="flex items-start gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                <AvatarFallback>{comment.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-2xl px-3 py-2 flex-1">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-sm">{comment.user.name}</span>
                  {comment.user.is_verified && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center gap-2 pt-1">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
          <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
        </Avatar>
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Add a comment..."
            className="w-full rounded-full bg-muted px-4 py-2 text-sm"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          {commentInput.trim().length > 0 && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500"
              onClick={handleSubmit}
            >
              Post
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
