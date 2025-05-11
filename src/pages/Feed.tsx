"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "@/components/feed/PostCard";
import EnhancedPostCard from "@/components/feed/EnhancedPostCard";
import EnhancedCreatePostCard from "@/components/feed/EnhancedCreatePostCard";
import FeedSidebar from "@/components/feed/FeedSidebar";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/lib/supabase/types";

// Define the Post type that matches what PostCard expects
export type Post = {
  id: string;
  content: string;
  createdAt: string;
  timestamp?: string; // Optional for backward compatibility
  likes: number;
  comments: number;
  shares: number; // Added missing property
  author: {
    name: string;
    username: string;
    handle: string;
    avatar: string;
    verified?: boolean;
  };
  image?: string;
  liked?: boolean;
};

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        // Fetch posts with author information
        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select(`
            *,
            profiles:user_id (
              name,
              username,
              avatar_url,
              is_verified
            )
          `)
          .order("created_at", { ascending: false });

        if (postsError) throw postsError;

        // Get post IDs for batch queries
        const postIds = postsData.map(post => post.id);

        // Fetch like counts
        const { data: likesData } = await supabase
          .from("post_likes")
          .select("post_id")
          .in("post_id", postIds);

        // Fetch comment counts
        const { data: commentsData } = await supabase
          .from("post_comments")
          .select("post_id")
          .in("post_id", postIds);

        // Transform data to match PostCard's expected type
        const formattedPosts = postsData.map(post => {
          const likeCount = likesData?.filter(like => like.post_id === post.id).length || 0;
          const commentCount = commentsData?.filter(comment => comment.post_id === post.id).length || 0;

          return {
            id: post.id,
            content: post.content,
            createdAt: post.created_at,
            timestamp: new Date(post.created_at).toLocaleTimeString(),
            likes: likeCount,
            comments: commentCount,
            shares: 0, // Default to 0 since shares isn't in your schema
            author: {
              name: post.profiles?.name || "Anonymous",
              username: post.profiles?.username || "anonymous",
              handle: `@${post.profiles?.username || "anonymous"}`,
              avatar: post.profiles?.avatar_url || "/default-avatar.png",
              verified: post.profiles?.is_verified || false,
            },
            image: post.image_url || undefined,
            liked: false, // You'll need to check this against the current user
          };
        });

        setPosts(formattedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="container max-w-6xl py-6">
        <div className="flex justify-center items-center h-64">
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-6">
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