import React, { createContext, useContext, useState, ReactNode } from 'react';

export type FeedViewMode = 'classic' | 'threaded';

interface ThreadedPost {
  id: string;
  content: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  parentId?: string; // For threaded replies
  threadId?: string; // Groups related posts
  isReply: boolean;
  quotedPost?: string; // For quote posts
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  gifts: number;
  liked?: boolean;
  bookmarked?: boolean;
  gifted?: boolean;
  image?: string;
  location?: string;
  depth?: number; // For nested display (0 = root, 1 = reply, etc.)
  type: 'post' | 'reply' | 'quote';
  originalPost?: ThreadedPost; // For quote posts
}

interface ThreadedComment {
  id: string;
  content: string;
  userId: string;
  username: string;
  user: {
    name: string;
    avatar: string;
    is_verified: boolean;
  };
  createdAt: string;
  likes: number;
  parentId?: string; // For nested comments
  replies?: ThreadedComment[];
  canPromoteToPost?: boolean; // Allow promotion to post
}

interface EnhancedFeedContextType {
  // View mode state
  viewMode: FeedViewMode;
  setViewMode: (mode: FeedViewMode) => void;
  
  // Post management
  posts: ThreadedPost[];
  addPost: (post: Omit<ThreadedPost, 'id' | 'createdAt'>) => void;
  updatePost: (postId: string, updates: Partial<ThreadedPost>) => void;
  removePost: (postId: string) => void;
  
  // Threading functions
  createReplyPost: (parentId: string, content: string, author: ThreadedPost['author']) => void;
  createQuotePost: (quotedPostId: string, content: string, author: ThreadedPost['author']) => void;
  promoteCommentToPost: (comment: ThreadedComment, parentPostId: string) => void;
  
  // Thread navigation
  getPostThread: (postId: string) => ThreadedPost[];
  getPostReplies: (postId: string) => ThreadedPost[];
  getThreadRoot: (postId: string) => ThreadedPost | null;
  
  // Interaction handling
  toggleLike: (postId: string) => void;
  toggleBookmark: (postId: string) => void;
  toggleGift: (postId: string) => void;
  incrementShares: (postId: string) => void;
}

const EnhancedFeedContext = createContext<EnhancedFeedContextType | undefined>(undefined);

export const useEnhancedFeed = () => {
  const context = useContext(EnhancedFeedContext);
  if (!context) {
    throw new Error('useEnhancedFeed must be used within an EnhancedFeedProvider');
  }
  return context;
};

interface EnhancedFeedProviderProps {
  children: ReactNode;
}

export const EnhancedFeedProvider: React.FC<EnhancedFeedProviderProps> = ({ children }) => {
  const [viewMode, setViewMode] = useState<FeedViewMode>('classic');
  const [posts, setPosts] = useState<ThreadedPost[]>([
    // Sample threaded data
    {
      id: '1',
      content: 'Just launched my new project! Excited to share it with everyone 🚀',
      author: {
        name: 'Sarah Chen',
        username: 'sarahc_dev',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        verified: true,
      },
      isReply: false,
      type: 'post',
      createdAt: '2h',
      likes: 45,
      comments: 12,
      shares: 8,
      gifts: 3,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500',
    },
    {
      id: '2',
      content: 'Congratulations! This looks amazing. Can\'t wait to try it out! 🎉',
      author: {
        name: 'Alex Rodriguez',
        username: 'alex_codes',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        verified: false,
      },
      parentId: '1',
      threadId: '1',
      isReply: true,
      type: 'reply',
      createdAt: '1h',
      likes: 12,
      comments: 3,
      shares: 1,
      gifts: 1,
      depth: 1,
    },
    {
      id: '3',
      content: 'The design choices here are incredible! Love the attention to detail.',
      author: {
        name: 'Maya Patel',
        username: 'maya_design',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        verified: true,
      },
      parentId: '1',
      threadId: '1',
      isReply: true,
      type: 'reply',
      createdAt: '45m',
      likes: 8,
      comments: 1,
      shares: 2,
      gifts: 0,
      depth: 1,
    },
  ]);

  const addPost = (post: Omit<ThreadedPost, 'id' | 'createdAt'>) => {
    const newPost: ThreadedPost = {
      ...post,
      id: Date.now().toString(),
      createdAt: 'now',
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const updatePost = (postId: string, updates: Partial<ThreadedPost>) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, ...updates } : post
    ));
  };

  const removePost = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  const createReplyPost = (parentId: string, content: string, author: ThreadedPost['author']) => {
    const parentPost = posts.find(p => p.id === parentId);
    if (!parentPost) return;

    const replyPost: ThreadedPost = {
      id: Date.now().toString(),
      content,
      author,
      parentId,
      threadId: parentPost.threadId || parentPost.id,
      isReply: true,
      type: 'reply',
      createdAt: 'now',
      likes: 0,
      comments: 0,
      shares: 0,
      gifts: 0,
      depth: (parentPost.depth || 0) + 1,
    };

    setPosts(prev => [replyPost, ...prev]);
    
    // Update parent comment count
    updatePost(parentId, { 
      comments: (parentPost.comments || 0) + 1 
    });
  };

  const createQuotePost = (quotedPostId: string, content: string, author: ThreadedPost['author']) => {
    const quotedPost = posts.find(p => p.id === quotedPostId);
    if (!quotedPost) return;

    const quotePost: ThreadedPost = {
      id: Date.now().toString(),
      content,
      author,
      quotedPost: quotedPostId,
      originalPost: quotedPost,
      isReply: false,
      type: 'quote',
      createdAt: 'now',
      likes: 0,
      comments: 0,
      shares: 0,
      gifts: 0,
    };

    setPosts(prev => [quotePost, ...prev]);
    
    // Update quoted post shares
    updatePost(quotedPostId, { 
      shares: (quotedPost.shares || 0) + 1 
    });
  };

  const promoteCommentToPost = (comment: ThreadedComment, parentPostId: string) => {
    const newPost: ThreadedPost = {
      id: Date.now().toString(),
      content: `💬 "${comment.content}" - promoting this insightful comment to a post!`,
      author: {
        name: comment.user.name,
        username: comment.username,
        avatar: comment.user.avatar,
        verified: comment.user.is_verified,
      },
      parentId: parentPostId,
      isReply: true,
      type: 'reply',
      createdAt: 'now',
      likes: comment.likes,
      comments: 0,
      shares: 0,
      gifts: 0,
    };

    setPosts(prev => [newPost, ...prev]);
  };

  const getPostThread = (postId: string): ThreadedPost[] => {
    const post = posts.find(p => p.id === postId);
    if (!post) return [];

    const threadId = post.threadId || post.id;
    return posts
      .filter(p => p.threadId === threadId || p.id === threadId)
      .sort((a, b) => {
        // Sort by depth first, then by creation time
        if (a.depth !== b.depth) {
          return (a.depth || 0) - (b.depth || 0);
        }
        return new Date(b.createdAt === 'now' ? Date.now() : 0).getTime() - 
               new Date(a.createdAt === 'now' ? Date.now() : 0).getTime();
      });
  };

  const getPostReplies = (postId: string): ThreadedPost[] => {
    return posts
      .filter(p => p.parentId === postId)
      .sort((a, b) => (a.depth || 0) - (b.depth || 0));
  };

  const getThreadRoot = (postId: string): ThreadedPost | null => {
    const post = posts.find(p => p.id === postId);
    if (!post) return null;

    if (!post.parentId) return post;

    const threadId = post.threadId || post.id;
    return posts.find(p => p.id === threadId && !p.parentId) || null;
  };

  const toggleLike = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    updatePost(postId, {
      liked: !post.liked,
      likes: post.liked ? post.likes - 1 : post.likes + 1,
    });
  };

  const toggleBookmark = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    updatePost(postId, {
      bookmarked: !post.bookmarked,
    });
  };

  const toggleGift = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    updatePost(postId, {
      gifted: !post.gifted,
      gifts: post.gifted ? post.gifts - 1 : post.gifts + 1,
    });
  };

  const incrementShares = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    updatePost(postId, {
      shares: post.shares + 1,
    });
  };

  const value = {
    viewMode,
    setViewMode,
    posts,
    addPost,
    updatePost,
    removePost,
    createReplyPost,
    createQuotePost,
    promoteCommentToPost,
    getPostThread,
    getPostReplies,
    getThreadRoot,
    toggleLike,
    toggleBookmark,
    toggleGift,
    incrementShares,
  };

  return (
    <EnhancedFeedContext.Provider value={value}>
      {children}
    </EnhancedFeedContext.Provider>
  );
};

export default EnhancedFeedProvider;
