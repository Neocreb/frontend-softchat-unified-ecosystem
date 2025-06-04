
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useFeed } from "@/hooks/use-feed";
import CreatePostCard from "@/components/feed/CreatePostCard";
import PostCard from "@/components/feed/PostCard";
import FeedSkeleton from "@/components/feed/FeedSkeleton";
import EnhancedStoriesWrapper from "@/components/feed/EnhancedStories";

const EnhancedFeed = () => {
  const { user } = useAuth();
  const { posts, isLoading, handleCreatePost } = useFeed();

  const handlePostSubmit = (content: string, image?: string) => {
    handleCreatePost({
      content,
      mediaUrl: image
    });
  };

  if (isLoading) {
    return (
      <div className="container max-w-2xl mx-auto py-6 px-4">
        <FeedSkeleton />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-6 px-4 space-y-6">
      {/* Enhanced Stories Section */}
      <EnhancedStoriesWrapper />
      
      {/* Create Post */}
      <CreatePostCard onSubmit={handlePostSubmit} />
      
      {/* Posts Feed */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedFeed;
