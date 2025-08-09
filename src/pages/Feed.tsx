import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "@/components/feed/PostCard";
import EnhancedPostCard from "@/components/feed/EnhancedPostCard";
import EnhancedCreatePostWithDestination from "@/components/feed/EnhancedCreatePostWithDestination";
import FeedSidebar from "@/components/feed/FeedSidebar";
import { FeedNativeAdCard } from "@/components/ads/FeedNativeAdCard";
import { SponsoredPostCard } from "@/components/ads/SponsoredPostCard";
import { adSettings } from "../../config/adSettings";
import { enhancedMockFeedData } from "@/data/enhancedMockFeedData";

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

// Enhanced posts data with different content types
const posts: Post[] = enhancedMockFeedData.map(post => ({
  ...post,
  author: {
    ...post.author,
    handle: `@${post.author.username}`,
  },
  timestamp: post.createdAt,
}));

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
              <EnhancedCreatePostWithDestination defaultDestination="classic" />
              {feedWithAds.map((item) => renderFeedItem(item, false))}
            </TabsContent>
            <TabsContent value="discover" className="space-y-4 mt-4">
              <EnhancedCreatePostWithDestination defaultDestination="classic" />
              {feedWithAds.map((item) => renderFeedItem(item, true))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Feed;
