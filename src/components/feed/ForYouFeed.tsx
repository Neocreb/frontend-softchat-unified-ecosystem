import { useState, useEffect } from "react";
import EnhancedPostCard from "./EnhancedPostCard";
import CommentSection from "./CommentSection";
import FeedSkeleton from "./FeedSkeleton";
import UnifiedFeedContent from "./UnifiedFeedContent";
import { useFeed } from "@/hooks/use-feed";
import type { Post } from "@/components/feed/PostCard";

const ForYouFeed = () => {
  const {
    posts,
    isLoading,
    postComments,
    handleAddComment,
    loadMorePosts,
    hasMore
  } = useFeed();
  
  const [personalizedPosts, setPersonalizedPosts] = useState<Post[]>([]);

  useEffect(() => {
    // In a real app, this would use ML algorithms to personalize the feed
    // For now, we'll just shuffle and filter posts based on engagement
    const sortedPosts = [...posts].sort((a, b) => {
      // Prioritize posts with more engagement
      const aEngagement = (a.likes || 0) + (a.comments || 0) + (a.shares || 0);
      const bEngagement = (b.likes || 0) + (b.comments || 0) + (b.shares || 0);
      return bEngagement - aEngagement;
    });
    
    setPersonalizedPosts(sortedPosts);
  }, [posts]);

  if (isLoading && personalizedPosts.length === 0) {
    return <FeedSkeleton />;
  }

  return (
    <div className="space-y-6">
      {personalizedPosts.map((post) => (
        <div key={post.id} className="space-y-2">
          <EnhancedPostCard post={post} />
          <CommentSection
            postId={post.id}
            comments={postComments[post.id] || []}
            onAddComment={handleAddComment}
          />
        </div>
      ))}
      
      {isLoading && personalizedPosts.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      
      {!hasMore && personalizedPosts.length > 0 && (
        <p className="text-center text-muted-foreground text-sm py-4">
          You're all caught up! Check back later for new content.
        </p>
      )}
    </div>
  );
};

export default ForYouFeed;
