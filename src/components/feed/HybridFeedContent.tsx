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
    // Classic mode: Show posts from HybridFeedContext in classic layout
    return (
      <div className="space-y-4">
        {displayPosts.map((post) => (
          <HybridPostCard
            key={post.id}
            post={post}
            viewMode="classic"
            showThread={false}
          />
        ))}
        {displayPosts.length === 0 && (
          <Card className="mx-2 sm:mx-0">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-600 max-w-sm">
                Be the first to share something amazing!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  } else {
    // Threaded mode: Show posts with threading structure
    const rootPosts = posts.filter(post => !post.parentId);

    return (
      <div className="space-y-4">
        {rootPosts.map((post) => (
          <div key={post.id} className="space-y-2">
            <HybridPostCard
              post={post}
              viewMode="threaded"
              showThread={true}
            />
            {/* Show replies in threaded view */}
            {posts
              .filter(p => p.parentId === post.id)
              .map((reply) => (
                <div key={reply.id} className="ml-8 border-l-2 border-gray-200 pl-4">
                  <HybridPostCard
                    post={reply}
                    viewMode="threaded"
                    showThread={false}
                    isInThread={true}
                  />
                </div>
              ))}
          </div>
        ))}
        {rootPosts.length === 0 && (
          <Card className="mx-2 sm:mx-0">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No threads yet
              </h3>
              <p className="text-gray-600 max-w-sm">
                Start a conversation to see threaded discussions here!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
};

export default HybridFeedContent;
