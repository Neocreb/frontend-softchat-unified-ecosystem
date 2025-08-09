import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useHybridFeed } from "@/contexts/HybridFeedContext";
import { useToast } from "@/components/ui/use-toast";

interface SimpleCreatePostProps {
  isOpen: boolean;
  onClose: () => void;
}

const SimpleCreatePost: React.FC<SimpleCreatePostProps> = ({
  isOpen,
  onClose,
}) => {
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const { user } = useAuth();
  const { addPost } = useHybridFeed();
  const { toast } = useToast();

  const handlePost = async () => {
    if (!content.trim()) {
      toast({
        title: "Post cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);

    try {
      const newPost = {
        content: content.trim(),
        author: {
          name: user?.name || 'User',
          username: user?.username || 'user',
          avatar: user?.avatar || '/placeholder.svg',
          verified: user?.verified || false,
        },
        likes: 0,
        comments: 0,
        shares: 0,
        gifts: 0,
        type: 'post' as const,
        isReply: false,
        privacy: 'public',
      };

      addPost(newPost);

      toast({
        title: "Post published!",
        description: "Your post has been published successfully",
      });

      setContent("");
      onClose();
    } catch (error) {
      console.error("Failed to create post:", error);
      toast({
        title: "Failed to publish post",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="resize-none"
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handlePost}
              disabled={isPosting || !content.trim()}
            >
              {isPosting ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleCreatePost;
