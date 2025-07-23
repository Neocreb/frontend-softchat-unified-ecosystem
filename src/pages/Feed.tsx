import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "@/components/feed/PostCard";
import EnhancedPostCard from "@/components/feed/EnhancedPostCard";
import EnhancedCreatePostCard from "@/components/feed/EnhancedCreatePostCard";
import FeedSidebar from "@/components/feed/FeedSidebar";
import { FeedNativeAdCard } from "@/components/ads/FeedNativeAdCard";
import { SponsoredPostCard } from "@/components/ads/SponsoredPostCard";
import { adSettings } from "../../config/adSettings";

// Define the Post type to match what PostCard expects
export type Post = {
  id: string;
  content: string;
  timestamp?: string; // Optional for backward compatibility
  createdAt: string; // Added required field
  likes: number;
  comments: number;
  shares: number;
  author: {
    name: string;
    username: string;
    handle: string;
    avatar: string;
    verified?: boolean;
  };
  image?: string; // Optional field for posts with images
  liked?: boolean; // Optional field to track if post is liked by current user
};

// Sample posts data
const posts: Post[] = [
  {
    id: "1",
    content:
      "Just launched our new AI-powered feature! Check it out at softchat.ai/new-features",
    timestamp: "2h ago",
    createdAt: "2h ago", // Added required field
    likes: 24,
    comments: 5,
    shares: 2,
    author: {
      name: "Sarah Johnson",
      username: "sarahj",
      handle: "@sarahj",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      verified: true,
    },
  },
  {
    id: "2",
    content:
      "Excited to announce that we've raised $5M in seed funding to build the future of social communication! 🚀",
    timestamp: "5h ago",
    createdAt: "5h ago", // Added required field
    likes: 142,
    comments: 36,
    shares: 28,
    author: {
      name: "David Chen",
      username: "davidc",
      handle: "@davidc",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    },
  },
  {
    id: "3",
    content:
      "What are your favorite productivity tools for remote work? I'm looking for recommendations!",
    timestamp: "8h ago",
    createdAt: "8h ago", // Added required field
    likes: 56,
    comments: 43,
    shares: 5,
    author: {
      name: "Alex Rivera",
      username: "alexr",
      handle: "@alexr",
      avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    },
  },
];

const Feed = () => {
  const [feedWithAds, setFeedWithAds] = useState<(Post | { id: string; type: 'native_ad' | 'sponsored_post' })[]>([]);

  // Create feed with ads
  useEffect(() => {
    const createFeedWithAds = () => {
      const feedItems = [];
      let nativeAdCounter = 0;
      let sponsoredAdCounter = 0;

      for (let i = 0; i < posts.length; i++) {
        feedItems.push(posts[i]);

        // Insert native ad every 6th post
        if ((i + 1) % adSettings.feedAdFrequency === 0 && adSettings.enableAds) {
          nativeAdCounter++;
          feedItems.push({
            id: `native-ad-${nativeAdCounter}`,
            type: 'native_ad' as const
          });
        }

        // Insert sponsored post every 8th post
        if ((i + 1) % adSettings.feedSponsoredFrequency === 0 && adSettings.enableAds) {
          sponsoredAdCounter++;
          feedItems.push({
            id: `sponsored-post-${sponsoredAdCounter}`,
            type: 'sponsored_post' as const
          });
        }
      }

      return feedItems;
    };

    setFeedWithAds(createFeedWithAds());
  }, []);

  const renderFeedItem = (item: Post | { id: string; type: 'native_ad' | 'sponsored_post' }, isEnhanced = false) => {
    if ('type' in item) {
      if (item.type === 'native_ad') {
        return (
          <FeedNativeAdCard
            key={item.id}
            onClick={() => {
              console.log('Native ad clicked');
              // Handle ad click
            }}
          />
        );
      } else if (item.type === 'sponsored_post') {
        return (
          <SponsoredPostCard
            key={item.id}
            title="Discover Softchat Premium"
            content="Unlock exclusive features, priority support, and enhanced creator tools. Join thousands of creators already earning more with Softchat Premium!"
            ctaText="Upgrade Now"
            onClick={() => {
              console.log('Sponsored post clicked');
              // Handle sponsored post click
            }}
          />
        );
      }
    }

    // Regular post
    const post = item as Post;
    return isEnhanced ? (
      <EnhancedPostCard key={post.id} post={post} />
    ) : (
      <PostCard key={post.id} post={post} />
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 hidden md:block">
          <FeedSidebar />
        </div>
        <div className="col-span-1 md:col-span-3">
          <Tabs defaultValue="following" className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="discover">Discover</TabsTrigger>
            </TabsList>
            <TabsContent value="following" className="space-y-4 mt-4">
              <EnhancedCreatePostCard />
              {feedWithAds.map((item) => renderFeedItem(item, false))}
            </TabsContent>
            <TabsContent value="discover" className="space-y-4 mt-4">
              <EnhancedCreatePostCard />
              {feedWithAds.map((item) => renderFeedItem(item, true))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Feed;
