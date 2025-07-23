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
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </TabsContent>
            <TabsContent value="discover" className="space-y-4 mt-4">
              <EnhancedCreatePostCard />
              {posts.map((post) => (
                <EnhancedPostCard key={post.id} post={post} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Feed;
