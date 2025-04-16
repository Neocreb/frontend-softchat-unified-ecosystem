
import { useState } from "react";
import CreatePostCard from "@/components/feed/CreatePostCard";
import EnhancedPostCard from "@/components/feed/EnhancedPostCard";
import FooterNav from "@/components/layout/FooterNav";
import { useNotification } from "@/hooks/use-notification";
import Stories, { Story } from "@/components/feed/Stories";
import StoryView from "@/components/feed/StoryView";
import CommentSection from "@/components/feed/CommentSection";
import FeedSkeleton from "@/components/feed/FeedSkeleton";
import { useFeed } from "@/hooks/use-feed";
import { mockStories } from "@/data/mockFeedData";

const EnhancedFeed = () => {
  const [activeStory, setActiveStory] = useState<string | null>(null);
  const { posts, isLoading, postComments, handleCreatePost, handleAddComment } = useFeed();
  const notification = useNotification();

  const handleViewStory = (storyId: string) => {
    setActiveStory(storyId);
    
    setTimeout(() => {
      setActiveStory(null);
    }, 5000);
  };

  const handleCreateStory = () => {
    notification.info("Story creation coming soon!");
  };

  return (
    <div className="max-w-full mx-auto px-4 py-6 pb-20 md:pb-6 md:max-w-3xl">
      <Stories 
        stories={mockStories} 
        onViewStory={handleViewStory} 
        onCreateStory={handleCreateStory} 
      />
      
      {activeStory && (
        <StoryView 
          activeStory={activeStory} 
          stories={mockStories} 
          onClose={() => setActiveStory(null)} 
        />
      )}
      
      <div className="space-y-6">
        <CreatePostCard onSubmit={handleCreatePost} />
        
        {isLoading ? (
          <FeedSkeleton />
        ) : (
          <>
            {posts.map((post) => (
              <div key={post.id} className="space-y-2">
                <EnhancedPostCard post={post} />
                <CommentSection 
                  postId={post.id} 
                  comments={postComments[post.id] || []} 
                  onAddComment={handleAddComment} 
                />
              </div>
            ))}
          </>
        )}
      </div>
      
      <FooterNav />
    </div>
  );
};

export default EnhancedFeed;
