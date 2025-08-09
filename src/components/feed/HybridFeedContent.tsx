import React from 'react';
import { useHybridFeed } from '@/contexts/HybridFeedContext';
import HybridPostCard from './HybridPostCard';
import UnifiedFeedContent from './UnifiedFeedContent';
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
    // Classic mode: Use existing UnifiedFeedContent for the feed structure,
    // but overlay our hybrid posts where applicable
    return (
      <div className="space-y-4">
        {/* Show mode indicator */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Classic Feed Mode</h3>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  Traditional social media layout with nested comments
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Render hybrid posts in classic mode */}
        {displayPosts.map((post) => (
          <div key={post.id} className="space-y-4">
            <HybridPostCard
              post={post}
              viewMode="classic"
              showThread={false}
            />
            {/* Add comment section for classic mode */}
            <CommentSection
              postId={post.id}
              comments={mockComments}
              onAddComment={handleAddComment}
            />
          </div>
        ))}

        {/* If no hybrid posts, fall back to unified content */}
        {displayPosts.length === 0 && (
          <UnifiedFeedContent feedType={feedType} />
        )}
      </div>
    );
  } else {
    // Threaded mode: Show all posts with threading UI
    return (
      <div className="space-y-4">
        {/* Show mode indicator */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">Threaded View Mode</h3>
                <p className="text-sm text-purple-700 dark:text-purple-200">
                  Twitter-style conversations where replies become standalone posts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Render all posts with threading */}
        <div className="space-y-6">
          {posts.map((post) => (
            <HybridPostCard
              key={post.id}
              post={post}
              viewMode="threaded"
              showThread={!post.parentId} // Show thread for root posts
            />
          ))}
        </div>

        {/* If no posts, show empty state */}
        {posts.length === 0 && (
          <Card className="p-8 text-center">
            <CardContent>
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No threaded conversations yet</h3>
              <p className="text-muted-foreground">
                Be the first to start a conversation in threaded mode!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
};

export default HybridFeedContent;
