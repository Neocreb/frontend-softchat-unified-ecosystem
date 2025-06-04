
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useFeed } from "@/hooks/use-feed";
import CreatePostCard from "@/components/feed/CreatePostCard";
import PostCard from "@/components/feed/PostCard";
import FeedSkeleton from "@/components/feed/FeedSkeleton";
import EmptyState from "@/components/feed/EmptyState";
import EnhancedStoriesWrapper from "@/components/feed/EnhancedStories";

const EnhancedFeed = () => {
  const { user } = useAuth();
  const { posts, isLoading, error, refetch } = useFeed();

  if (isLoading) {
    return (
      <div className="container max-w-2xl mx-auto py-6 px-4">
        <FeedSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-2xl mx-auto py-6 px-4">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Failed to load feed. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-6 px-4 space-y-6">
      {/* Enhanced Stories Section */}
      <EnhancedStoriesWrapper />
      
      {/* Create Post */}
      <CreatePostCard onPostCreated={refetch} />
      
      {/* Posts Feed */}
      {posts.length === 0 ? (
        <EmptyState />
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
