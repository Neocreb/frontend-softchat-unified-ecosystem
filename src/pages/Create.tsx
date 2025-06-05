
import React from "react";
import { useNotification } from "@/hooks/use-notification";
import CreatePostCard from "@/components/feed/CreatePostCard";
import EnhancedCreateTabs from "@/components/create/EnhancedCreateTabs";

const Create = () => {
  const notification = useNotification();

  const handlePostCreated = () => {
    notification.success("Post created successfully!");
  };

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create Content</h1>
          <p className="text-muted-foreground mt-2">
            Share your thoughts, stories, and creativity with the community
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Post */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Quick Post</h2>
            <CreatePostCard />
          </div>

          {/* Enhanced Creation Tools */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Create More</h2>
            <EnhancedCreateTabs />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
