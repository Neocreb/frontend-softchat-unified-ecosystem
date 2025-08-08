import React from "react";
import StoryExample from "@/components/feed/StoryExample";

const StoryDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <StoryExample />
      </div>
    </div>
  );
};

export default StoryDemo;
