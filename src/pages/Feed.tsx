
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "@/components/feed/PostCard";
import FeedSidebar from "@/components/feed/FeedSidebar";
import CreatePostCard from "@/components/feed/CreatePostCard";

// Sample posts data
const samplePosts = [
  {
    id: "1",
    authorName: "John Doe",
    authorHandle: "@johndoe",
    authorAvatar: "/placeholder.svg",
    content: "Just launched my new website! Check it out and let me know what you think.",
    timestamp: "2h ago",
    likes: 24,
    comments: 5,
    shares: 2,
  },
  {
    id: "2",
    authorName: "Jane Smith",
    authorHandle: "@janesmith",
    authorAvatar: "/placeholder.svg",
    content: "Excited to announce that I'll be speaking at the Web Development Conference next month! #WebDev #Conference",
    timestamp: "5h ago",
    likes: 56,
    comments: 12,
    shares: 8,
  },
  // Add more sample posts as needed
];

const Feed = () => {
  const [posts, setPosts] = useState(samplePosts);
  const [activeTab, setActiveTab] = useState("all");

  const handleCreatePost = (content: string) => {
    const newPost = {
      id: Date.now().toString(),
      authorName: "Your Name",
      authorHandle: "@yourhandle",
      authorAvatar: "/placeholder.svg",
      content,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      shares: 0,
    };
    
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="space-y-6 mt-6">
                <CreatePostCard onSubmit={handleCreatePost} />
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="following">
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Following Feed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Content from people you follow will appear here.</p>
                  <Button className="mt-4">Find People to Follow</Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="trending">
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Trending Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Popular content trending in your region will appear here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="hidden lg:block">
          <FeedSidebar />
        </div>
      </div>
    </div>
  );
};

export default Feed;
