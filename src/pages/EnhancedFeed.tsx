
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useFeed } from "@/hooks/use-feed";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import CreatePostCard from "@/components/feed/CreatePostCard";
import PostCard from "@/components/feed/PostCard";
import FeedSkeleton from "@/components/feed/FeedSkeleton";
import EmptyState from "@/components/feed/EmptyState";
import EnhancedStoriesWrapper from "@/components/feed/EnhancedStories";
import FeedFilters from "@/components/feed/FeedFilters";
import TrendingHashtags from "@/components/feed/TrendingHashtags";

const EnhancedFeed = () => {
  const { user } = useAuth();
  const { posts, isLoading, error, refetch } = useFeed();
  const [activeFilter, setActiveFilter] = useState("trending");

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-6 px-4">
        <FeedSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-6 px-4">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Failed to load feed. Please try again.</p>
        </div>
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
          <CreatePostCard onPostCreated={refetch} />
          
          {/* Posts Feed with Filtering */}
          <Tabs value={activeFilter} onValueChange={setActiveFilter}>
            <TabsContent value="trending">
              {posts.length === 0 ? (
                <EmptyState />
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
                {posts.filter(post => post.user_id !== user?.id).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="recent">
              <div className="space-y-6">
                {posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="featured">
              <div className="space-y-6">
                {posts.filter(post => post.softpoints && post.softpoints > 50).map((post) => (
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
