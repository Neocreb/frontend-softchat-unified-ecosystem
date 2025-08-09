import React from 'react';
import { useHybridFeed } from '@/contexts/HybridFeedContext';
import HybridPostCard from './HybridPostCard';
import UnifiedFeedContent from './UnifiedFeedContent';
import TwitterThreadedFeed from './TwitterThreadedFeed';
import CommentSection from './CommentSection';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Users, TrendingUp } from 'lucide-react';

interface HybridFeedContentProps {
  feedType: string;
  viewMode: 'classic' | 'threaded';
}

const HybridFeedContent: React.FC<HybridFeedContentProps> = ({ feedType, viewMode }) => {
  const { posts } = useHybridFeed();

  // Mock comments for classic mode
  const mockComments = [
    {
      id: '1',
      content: 'Great post! Thanks for sharing.',
      userId: 'user1',
      username: 'johndoe',
      user: {
        name: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        is_verified: false,
      },
      createdAt: '2h',
      likes: 5,
    },
  ];

  const handleAddComment = (postId: string, comment: string) => {
    console.log('Add comment:', postId, comment);
    // In a real implementation, this would add the comment
  };

  // Filter posts based on view mode
  const getDisplayPosts = () => {
    if (viewMode === 'classic') {
      // In classic mode, show only root posts
      return posts.filter(post => !post.parentId);
    } else {
      // In threaded mode, show all posts with threading
      return posts;
    }
  };

  const displayPosts = getDisplayPosts();

  if (viewMode === 'classic') {
    // Classic mode: Just use the original unified content - no changes to classic behavior
    return <UnifiedFeedContent feedType={feedType} />;
  } else {
    // Threaded mode: Use Twitter-style threaded feed
    return <TwitterThreadedFeed feedType={feedType} />;
  }
};

export default HybridFeedContent;
