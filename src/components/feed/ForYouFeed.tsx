import { useState, useEffect } from "react";
import EnhancedPostCard from "./EnhancedPostCard";
import CommentSection from "./CommentSection";
import FeedSkeleton from "./FeedSkeleton";
import UnifiedFeedContent from "./UnifiedFeedContent";
import { useFeed } from "@/hooks/use-feed";
import type { Post } from "@/components/feed/PostCard";

const ForYouFeed = () => {
  // Use the new unified feed system for personalized content
  return <UnifiedFeedContent feedType="for-you" />;
};

export default ForYouFeed;
