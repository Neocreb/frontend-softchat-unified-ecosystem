
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useFeed } from "@/hooks/use-feed";
import PostComposer from "./PostComposer";
import EnhancedPostCard from "./EnhancedPostCard";
import FeedSkeleton from "./FeedSkeleton";
import { NoPostsEmptyState } from "./EmptyState";
import EnhancedStoriesWrapper from "./EnhancedStories";
import TrendingHashtags from "./TrendingHashtags";
import { Users, Calendar, Trophy, MessageCircle, Bell, Bookmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const EnhancedFacebookFeed = () => {
  const { user } = useAuth();
  const { posts, isLoading, handleCreatePost } = useFeed();

  const handleCreatePostSubmit = (content: string, mediaUrl?: string, mediaType?: 'image' | 'video') => {
    handleCreatePost({ 
      content, 
      mediaUrl, 
      type: mediaType || 'text'
    });
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
              </div>

              {/* Quick Navigation */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4 space-y-2">
                  <Link to="/groups" className="flex items-center space-x-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 p-3 rounded-lg transition-all duration-200 group">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium">Groups</span>
                  </Link>
                  
                  <Link to="/achievements" className="flex items-center space-x-3 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 p-3 rounded-lg transition-all duration-200 group">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Trophy className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium">Achievements</span>
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
            
            {/* Post Composer */}
            <PostComposer onSubmit={handleCreatePostSubmit} />
            
            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.length === 0 ? (
                <NoPostsEmptyState />
              ) : (
                posts.map((post) => (
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
                    <Link to="/create">
                      <Calendar className="h-4 w-4 mr-2" />
                      Create Event
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 border-2 hover:border-green-300 transition-all duration-200" asChild>
                    <Link to="/groups">
                      <Users className="h-4 w-4 mr-2" />
                      Join Groups
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
