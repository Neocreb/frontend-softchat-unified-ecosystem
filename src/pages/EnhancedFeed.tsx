
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useFeed } from "@/hooks/use-feed";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import CreatePostCard from "@/components/feed/CreatePostCard";
import PostCard from "@/components/feed/PostCard";
import FeedSkeleton from "@/components/feed/FeedSkeleton";
import { NoPostsEmptyState } from "@/components/feed/EmptyState";
import EnhancedStoriesWrapper from "@/components/feed/EnhancedStories";
import FeedFilters from "@/components/feed/FeedFilters";
import TrendingHashtags from "@/components/feed/TrendingHashtags";

const EnhancedFeed = () => {
  const { user } = useAuth();
  const { posts, isLoading, handleCreatePost } = useFeed();
  const [activeFilter, setActiveFilter] = useState("trending");

  const handleCreatePostSubmit = (content: string, image?: string) => {
    handleCreatePost({ content, mediaUrl: image });
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-6 px-4">
        <FeedSkeleton />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto">
      {/* Feed Filters */}
      <FeedFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6 px-4">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Enhanced Stories Section */}
          <EnhancedStoriesWrapper />
          
          {/* Create Post */}
          <CreatePostCard onSubmit={handleCreatePostSubmit} />
          
          {/* Posts Feed with Filtering */}
          <Tabs value={activeFilter} onValueChange={setActiveFilter}>
            <TabsContent value="trending">
              {posts.length === 0 ? (
                <NoPostsEmptyState />
              ) : (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="following">
              <div className="space-y-6">
                {posts.filter(post => post.author.username !== user?.user_metadata?.name).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="recent">
              <div className="space-y-6">
                {posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="featured">
              <div className="space-y-6">
                {posts.filter(post => post.likes && post.likes > 50).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <TrendingHashtags />
        </div>
      </div>
    </div>
  );
};

export default EnhancedFeed;
