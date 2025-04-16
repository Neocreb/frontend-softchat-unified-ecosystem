
import { useState, useEffect } from "react";
import { Post } from "@/components/feed/PostCard";
import { PostComment } from "@/types/user";
import { useNotification } from "@/hooks/use-notification";
import { useAuth } from "@/contexts/AuthContext";
import { mockPosts, mockComments } from "@/data/mockFeedData";

export const useFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [postComments, setPostComments] = useState<Record<string, PostComment[]>>({});
  const notification = useNotification();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setPosts(mockPosts);
      
      const initialComments: Record<string, PostComment[]> = {};
      mockPosts.forEach(post => {
        initialComments[post.id] = post.id === "1" ? mockComments : [];
      });
      setPostComments(initialComments);
      
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCreatePost = (content: string, image?: string) => {
    const newPost: Post = {
      id: `new-${Date.now()}`,
      author: {
        name: user?.name || "John Doe",
        username: user?.profile?.username || "johndoe",
        avatar: user?.avatar || "/placeholder.svg",
        verified: !!user?.profile?.is_verified,
      },
      content,
      image,
      createdAt: "Just now",
      likes: 0,
      comments: 0,
      shares: 0,
    };

    setPosts([newPost, ...posts]);
    notification.success("Post created successfully");
  };

  const handleAddComment = (postId: string, commentText: string) => {
    if (!commentText || !commentText.trim()) return;

    const newComment: PostComment = {
      id: `new-${Date.now()}`,
      post_id: postId,
      user_id: user?.id || "current-user",
      content: commentText,
      created_at: new Date().toISOString(),
      user: {
        name: user?.name || "You",
        username: user?.profile?.username || "you",
        avatar: user?.avatar || "/placeholder.svg",
        is_verified: !!user?.profile?.is_verified
      }
    };

    setPostComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));

    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: post.comments + 1 }
        : post
    ));
    
    notification.success("Comment added");
  };

  return {
    posts,
    isLoading,
    postComments,
    handleCreatePost,
    handleAddComment
  };
};
