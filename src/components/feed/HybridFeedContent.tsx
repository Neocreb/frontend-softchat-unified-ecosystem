import React from 'react';
import { useHybridFeed } from '@/contexts/HybridFeedContext';
import HybridPostCard from './HybridPostCard';
import UnifiedFeedContent from './UnifiedFeedContent';
import SavedContent from './SavedContent';
import CommentSection from './CommentSection';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface HybridFeedContentProps {
  feedType: string;
  viewMode: 'classic' | 'saved';
}

const HybridFeedContent: React.FC<HybridFeedContentProps> = ({ feedType, viewMode }) => {
  const { posts } = useHybridFeed();

  if (viewMode === 'saved') {
    // Show saved content when saved tab is selected
    return <SavedContent feedType={feedType} />;
  }

  // Classic mode: Show regular posts
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <HybridPostCard
          key={post.id}
          post={post}
          viewMode="classic"
          showThread={false}
        />
      ))}
      {posts.length === 0 && (
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
};

export default HybridFeedContent;
