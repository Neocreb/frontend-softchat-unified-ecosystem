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
  const { posts, getCurrentModePosts } = useHybridFeed();

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

  // Get posts for current mode using the context method
  const displayPosts = getCurrentModePosts();

  if (displayPosts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No posts yet</h3>
          <p className="text-sm text-muted-foreground">
            Be the first to create a post in {viewMode} mode!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {displayPosts.map((post) => (
        <HybridPostCard
          key={post.id}
          post={post}
          viewMode={viewMode}
          showThread={viewMode === 'threaded'}
          onNavigateToPost={(postId) => {
            console.log('Navigate to post:', postId);
          }}
        />
      ))}
    </div>
  );
};

export default HybridFeedContent;
