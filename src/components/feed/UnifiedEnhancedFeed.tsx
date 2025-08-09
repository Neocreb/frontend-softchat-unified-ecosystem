import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Grid3X3,
  List,
  MessageSquare,
  Globe,
  Users,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/utils/utils";
import PostCard from "./PostCard";
import ThreadedPostCard from "./ThreadedPostCard";
import EnhancedCreatePostWithDestination from "./EnhancedCreatePostWithDestination";
import { useEnhancedFeed } from "@/contexts/EnhancedFeedContext";
import { enhancedMockFeedData, enhancedThreadedMockData } from "@/data/enhancedMockFeedData";

interface UnifiedEnhancedFeedProps {
  initialMode?: 'classic' | 'threaded';
}

const UnifiedEnhancedFeed: React.FC<UnifiedEnhancedFeedProps> = ({
  initialMode = 'classic'
}) => {
  const [feedMode, setFeedMode] = useState<'classic' | 'threaded'>(initialMode);
  const [classicPosts] = useState(enhancedMockFeedData);
  const { posts: threadedPosts, viewMode, setViewMode } = useEnhancedFeed();

  // Combine mock data with context data for demonstration
  const allThreadedPosts = [...enhancedThreadedMockData, ...threadedPosts];

  const handlePostCreated = (post: any) => {
    console.log('New post created:', post);
  };

  const FeedModeToggle = () => (
    <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
      <Button
        variant={feedMode === 'classic' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setFeedMode('classic')}
        className="flex items-center gap-2"
      >
        <Grid3X3 className="h-4 w-4" />
        Classic Mode
      </Button>
      <Button
        variant={feedMode === 'threaded' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => {
          setFeedMode('threaded');
          setViewMode('threaded');
        }}
        className="flex items-center gap-2"
      >
        <MessageSquare className="h-4 w-4" />
        Thread Mode
      </Button>
    </div>
  );

  const FeatureHighlights = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Enhanced Social Features
        </CardTitle>
        <CardDescription>
          All interactions now work seamlessly across both feed modes with integrated rewards!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Enhanced Comments</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Threaded comments with promotion to posts, replies, and real-time interactions
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-green-500" />
              <span className="font-medium">Smart Sharing</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Copy links, external sharing, repost, and quote post functionality
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className="font-medium">Action Buttons</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Smart routing to marketplace, freelance, events, and live content
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">SoftPoints Rewards</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Earn rewards for all interactions, posts, and engagement activities
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-500" />
              <span className="font-medium">Publishing Options</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Choose to publish to Classic, Thread, or Both modes
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <List className="h-4 w-4 text-red-500" />
              <span className="font-medium">Content Types</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Products, jobs, events, services, videos, and live streams
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Feature Highlights */}
      <FeatureHighlights />

      {/* Feed Mode Toggle */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Social Feed</h2>
          <p className="text-muted-foreground">
            Experience unified social media, e-commerce, and freelancing
          </p>
        </div>
        <FeedModeToggle />
      </div>

      {/* Create Post */}
      <EnhancedCreatePostWithDestination
        defaultDestination={feedMode === 'classic' ? 'classic' : 'threaded'}
        onPostCreated={handlePostCreated}
      />

      {/* Content Type Legend */}
      <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-lg">
        <span className="text-sm font-medium">Content Types:</span>
        <Badge variant="outline">📱 Regular Posts</Badge>
        <Badge variant="outline">🛍️ Products</Badge>
        <Badge variant="outline">💼 Jobs</Badge>
        <Badge variant="outline">📅 Events</Badge>
        <Badge variant="outline">🔧 Services</Badge>
        <Badge variant="outline">📹 Videos</Badge>
        <Badge variant="outline">🔴 Live Streams</Badge>
      </div>

      {/* Feed Content */}
      <div className="space-y-4">
        {feedMode === 'classic' ? (
          <div className="space-y-4">
            {classicPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {allThreadedPosts.map((post) => (
              <ThreadedPostCard
                key={post.id}
                post={post}
                showThread={true}
                onNavigateToPost={(postId) => console.log('Navigate to:', postId)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Demo Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Try the Features!</CardTitle>
          <CardDescription>
            Interact with posts above to see all the enhanced functionality in action:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm">❤️</span>
              <span className="text-sm">Like posts to earn SoftPoints</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">💬</span>
              <span className="text-sm">Open comments to see threaded discussions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">🔄</span>
              <span className="text-sm">Share posts with copy link, repost, or quote options</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">🎁</span>
              <span className="text-sm">Send virtual gifts and tips to creators</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">🛒</span>
              <span className="text-sm">Click action buttons to navigate to relevant pages</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">📝</span>
              <span className="text-sm">Create posts with different content types and publishing options</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedEnhancedFeed;
