import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UnifiedFeedItem {
  id: string;
  type: 
    | "post" 
    | "product" 
    | "job" 
    | "freelancer_skill" 
    | "sponsored_post" 
    | "ad" 
    | "live_event" 
    | "community_event"
    | "story_recap"
    | "recommended_user"
    | "trending_topic";
  timestamp: Date;
  priority: number;
  author?: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    badges?: string[];
  };
  content: any;
  interactions: {
    likes: number;
    comments: number;
    shares: number;
    saves?: number;
    views?: number;
  };
  userInteracted: {
    liked: boolean;
    commented: boolean;
    shared: boolean;
    saved: boolean;
  };
}

interface FeedContextType {
  userPosts: UnifiedFeedItem[];
  addPost: (post: UnifiedFeedItem) => void;
  removePost: (postId: string) => void;
  updatePost: (postId: string, updates: Partial<UnifiedFeedItem>) => void;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const useFeed = () => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
};

interface FeedProviderProps {
  children: ReactNode;
}

export const FeedProvider: React.FC<FeedProviderProps> = ({ children }) => {
  const [userPosts, setUserPosts] = useState<UnifiedFeedItem[]>([]);

  const addPost = (post: UnifiedFeedItem) => {
    setUserPosts(prev => [post, ...prev]);
  };

  const removePost = (postId: string) => {
    setUserPosts(prev => prev.filter(post => post.id !== postId));
  };

  const updatePost = (postId: string, updates: Partial<UnifiedFeedItem>) => {
    setUserPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, ...updates } : post
    ));
  };

  const value = {
    userPosts,
    addPost,
    removePost,
    updatePost,
  };

  return (
    <FeedContext.Provider value={value}>
      {children}
    </FeedContext.Provider>
  );
};

export default FeedProvider;
