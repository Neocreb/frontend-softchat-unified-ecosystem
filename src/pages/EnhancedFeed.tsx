
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useFeed } from "@/hooks/use-feed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreatePostCard from "@/components/feed/CreatePostCard";
import PostCard from "@/components/feed/PostCard";
import FeedSkeleton from "@/components/feed/FeedSkeleton";
import { NoPostsEmptyState } from "@/components/feed/EmptyState";
import EnhancedStoriesWrapper from "@/components/feed/EnhancedStories";
import TrendingHashtags from "@/components/feed/TrendingHashtags";
import { Users, Calendar, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const EnhancedFeed = () => {
  const { user } = useAuth();
  const { posts, isLoading, handleCreatePost } = useFeed();
  const [activeFilter, setActiveFilter] = useState("following");

  const handleCreatePostSubmit = (content: string, image?: string) => {
    handleCreatePost({ content, mediaUrl: image });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container max-w-7xl mx-auto py-4 px-4">
          <FeedSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-7xl mx-auto py-4 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20 space-y-4">
              {/* User Quick Access */}
              <Card>
                <CardContent className="p-4">
                  <Link to="/profile" className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-medium">Your Profile</span>
                  </Link>
                  <Link to="/groups" className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="font-medium">Groups</span>
                  </Link>
                  <Link to="/achievements" className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                    </div>
                    <span className="font-medium">Achievements</span>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-6 space-y-4">
            {/* Enhanced Stories Section */}
            <EnhancedStoriesWrapper />
            
            {/* Create Post */}
            <CreatePostCard onSubmit={handleCreatePostSubmit} />
            
            {/* Feed Filters */}
            <Card>
              <CardContent className="p-2">
                <Tabs value={activeFilter} onValueChange={setActiveFilter}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="following">Following</TabsTrigger>
                    <TabsTrigger value="trending">Trending</TabsTrigger>
                    <TabsTrigger value="recent">Recent</TabsTrigger>
                    <TabsTrigger value="featured">Featured</TabsTrigger>
                  </TabsList>
                  
                  <div className="mt-4">
                    <TabsContent value="following" className="space-y-4">
                      {posts.filter(post => post.author.username !== user?.user_metadata?.name).length === 0 ? (
                        <NoPostsEmptyState />
                      ) : (
                        posts.filter(post => post.author.username !== user?.user_metadata?.name).map((post) => (
                          <PostCard key={post.id} post={post} />
                        ))
                      )}
                    </TabsContent>
                    
                    <TabsContent value="trending" className="space-y-4">
                      {posts.length === 0 ? (
                        <NoPostsEmptyState />
                      ) : (
                        posts.map((post) => (
                          <PostCard key={post.id} post={post} />
                        ))
                      )}
                    </TabsContent>
                    
                    <TabsContent value="recent" className="space-y-4">
                      {posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="featured" className="space-y-4">
                      {posts.filter(post => post.likes && post.likes > 50).map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20 space-y-4">
              <TrendingHashtags />
              
              {/* Quick Actions */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/create">
                        <Calendar className="h-4 w-4 mr-2" />
                        Create Event
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/groups">
                        <Users className="h-4 w-4 mr-2" />
                        Join Groups
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedFeed;
