
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useFeed } from "@/hooks/use-feed";
import PostComposer from "./PostComposer";
import EnhancedPostCard from "./EnhancedPostCard";
import FeedSkeleton from "./FeedSkeleton";
import { NoPostsEmptyState } from "./EmptyState";
import EnhancedStoriesWrapper from "./EnhancedStories";
import TrendingHashtags from "./TrendingHashtags";
import FeedFilters from "./FeedFilters";
import FeedCreateTabs from "./FeedCreateTabs";
import { Users, Calendar, Trophy, MessageCircle, Bell, Image, Video, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const EnhancedFacebookFeed = () => {
  const { user } = useAuth();
  const { posts, isLoading, handleCreatePost } = useFeed();
  const [activeFilter, setActiveFilter] = useState("following");
  const [activeCreateTab, setActiveCreateTab] = useState("post");
  const [postTypeFilter, setPostTypeFilter] = useState("all");

  const handleCreatePostSubmit = (content: string, mediaUrl?: string, mediaType?: 'image' | 'video') => {
    handleCreatePost({ 
      content, 
      mediaUrl
    });
  };

  const getFilteredPosts = () => {
    let filteredPosts = posts;

    // Filter by content type
    if (postTypeFilter === "photo") {
      filteredPosts = filteredPosts.filter(post => post.mediaUrl && post.mediaUrl.includes('image'));
    } else if (postTypeFilter === "video") {
      filteredPosts = filteredPosts.filter(post => post.mediaUrl && post.mediaUrl.includes('video'));
    } else if (postTypeFilter === "poll") {
      filteredPosts = filteredPosts.filter(post => post.type === "poll");
    }

    // Filter by feed type
    switch (activeFilter) {
      case "trending":
        return filteredPosts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      case "recent":
        return filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case "featured":
        return filteredPosts.filter(post => (post.likes || 0) > 50);
      case "following":
      default:
        return filteredPosts;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container max-w-7xl mx-auto py-4 px-4">
          <FeedSkeleton />
        </div>
      </div>
    );
  }

  const filteredPosts = getFilteredPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container max-w-7xl mx-auto py-4 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20 space-y-4">
              {/* User Profile Quick Access */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <Link to="/profile" className="flex items-center space-x-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 p-3 rounded-lg transition-all duration-200">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "@user"} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">{user?.name || "User"}</p>
                      <p className="text-sm text-gray-600">View your profile</p>
                    </div>
                  </Link>
                </CardContent>
              </Card>

              {/* Quick Navigation */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4 space-y-2">
                  <Link to="/explore" className="flex items-center space-x-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 p-3 rounded-lg transition-all duration-200 group">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium">Explore</span>
                  </Link>
                  
                  <Link to="/rewards" className="flex items-center space-x-3 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 p-3 rounded-lg transition-all duration-200 group">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Trophy className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium">Rewards</span>
                  </Link>
                  
                  <Link to="/chat" className="flex items-center space-x-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 p-3 rounded-lg transition-all duration-200 group">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium">Messages</span>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-6 space-y-6">
            {/* Enhanced Stories Section */}
            <EnhancedStoriesWrapper />
            
            {/* Create Content Section */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Create Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FeedCreateTabs activeTab={activeCreateTab} onValueChange={setActiveCreateTab} />
                <PostComposer onSubmit={handleCreatePostSubmit} />
              </CardContent>
            </Card>
            
            {/* Post Type Filter */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Filter Posts</h3>
                  <div className="flex gap-2">
                    <Button
                      variant={postTypeFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPostTypeFilter("all")}
                    >
                      All
                    </Button>
                    <Button
                      variant={postTypeFilter === "photo" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPostTypeFilter("photo")}
                    >
                      <Image className="h-4 w-4 mr-1" />
                      Photos
                    </Button>
                    <Button
                      variant={postTypeFilter === "video" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPostTypeFilter("video")}
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Videos
                    </Button>
                    <Button
                      variant={postTypeFilter === "poll" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPostTypeFilter("poll")}
                    >
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Polls
                    </Button>
                  </div>
                </div>
                
                <FeedFilters 
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                />
              </CardContent>
            </Card>
            
            {/* Posts Feed */}
            <div className="space-y-6">
              {filteredPosts.length === 0 ? (
                <NoPostsEmptyState />
              ) : (
                filteredPosts.map((post) => (
                  <EnhancedPostCard key={post.id} post={post} />
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20 space-y-4">
              {/* Trending Hashtags */}
              <TrendingHashtags />
              
              {/* Quick Actions */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <Button variant="outline" className="w-full justify-start hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-2 hover:border-blue-300 transition-all duration-200" asChild>
                    <Link to="/videos">
                      <Video className="h-4 w-4 mr-2" />
                      Create Video
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 border-2 hover:border-green-300 transition-all duration-200" asChild>
                    <Link to="/explore">
                      <Users className="h-4 w-4 mr-2" />
                      Explore Groups
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 border-2 hover:border-purple-300 transition-all duration-200" asChild>
                    <Link to="/notifications">
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Suggested Connections */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    People You May Know
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`https://randomuser.me/api/portraits/women/${40 + i}.jpg`} />
                          <AvatarFallback>U{i}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">User {i}</p>
                          <p className="text-xs text-gray-600">5 mutual friends</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs">
                        Follow
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedFacebookFeed;
