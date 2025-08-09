import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Sparkles,
  ArrowLeft,
  ChevronDown,
  Filter
} from 'lucide-react';
import { useEnhancedFeed } from '@/contexts/EnhancedFeedContext';
import PostCard from './PostCard';
import ThreadedPostCard from './ThreadedPostCard';
import FeedViewToggle from './FeedViewToggle';
import CreatePostCard from './CreatePostCard';
import CommentSection from './CommentSection';
import { cn } from '@/utils/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EnhancedFeedViewProps {
  currentThreadId?: string;
  onNavigateToThread?: (threadId: string) => void;
  onNavigateBack?: () => void;
}

const EnhancedFeedView: React.FC<EnhancedFeedViewProps> = ({
  currentThreadId,
  onNavigateToThread,
  onNavigateBack
}) => {
  const { 
    viewMode, 
    posts, 
    getPostThread, 
    getThreadRoot,
    addPost 
  } = useEnhancedFeed();
  
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');
  const [showOnlyRootPosts, setShowOnlyRootPosts] = useState(false);

  // Convert legacy posts to new format for classic view
  const convertToLegacyPost = (threadedPost: any) => ({
    id: threadedPost.id,
    author: {
      name: threadedPost.author.name,
      username: threadedPost.author.username,
      avatar: threadedPost.author.avatar,
      verified: threadedPost.author.verified,
    },
    content: threadedPost.content,
    image: threadedPost.image,
    createdAt: threadedPost.createdAt,
    likes: threadedPost.likes,
    comments: threadedPost.comments,
    shares: threadedPost.shares,
    liked: threadedPost.liked,
    bookmarked: threadedPost.bookmarked,
  });

  // Get posts based on current view and context
  const getDisplayPosts = () => {
    if (currentThreadId) {
      // Thread view - show full conversation
      return getPostThread(currentThreadId);
    }

    let filteredPosts = posts;
    
    if (viewMode === 'classic' || showOnlyRootPosts) {
      // Classic view - show only root posts
      filteredPosts = posts.filter(post => !post.parentId);
    }
    
    // Sort posts
    const sortedPosts = [...filteredPosts].sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.likes + b.shares + b.comments) - (a.likes + a.shares + a.comments);
        case 'trending':
          return b.likes - a.likes;
        case 'recent':
        default:
          return b.createdAt === 'now' ? 1 : a.createdAt === 'now' ? -1 : 0;
      }
    });

    return sortedPosts;
  };

  const displayPosts = getDisplayPosts();
  const threadRoot = currentThreadId ? getThreadRoot(currentThreadId) : null;

  const handleCreatePost = (content: string, image?: string) => {
    addPost({
      content,
      image,
      author: {
        name: 'Current User',
        username: 'currentuser',
        avatar: '/placeholder.svg',
        verified: false,
      },
      isReply: false,
      type: 'post',
      likes: 0,
      comments: 0,
      shares: 0,
      gifts: 0,
    });
  };

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

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b p-4">
        <div className="flex items-center justify-between">
          {currentThreadId ? (
            // Thread view header
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onNavigateBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              {threadRoot && (
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Thread by {threadRoot.author.name}</span>
                </div>
              )}
            </div>
          ) : (
            // Main feed header
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold">Home</h1>
              <Badge variant="outline" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {displayPosts.length} posts
              </Badge>
            </div>
          )}

          <FeedViewToggle />
        </div>

        {/* Feed controls */}
        {!currentThreadId && (
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                </SelectContent>
              </Select>

              {viewMode === 'threaded' && (
                <Button
                  variant={showOnlyRootPosts ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowOnlyRootPosts(!showOnlyRootPosts)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  {showOnlyRootPosts ? 'Show All' : 'Root Only'}
                </Button>
              )}
            </div>

            {/* View mode indicator */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {viewMode === 'threaded' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Threaded View
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create post - only show in main feed */}
      {!currentThreadId && (
        <CreatePostCard onSubmit={handleCreatePost} />
      )}

      {/* Posts Feed */}
      <div className="space-y-4">
        {displayPosts.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent>
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground">
                {currentThreadId 
                  ? "This thread is empty." 
                  : "Be the first to share something!"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          displayPosts.map((post) => (
            <div key={post.id}>
              {viewMode === 'classic' ? (
                // Classic view with original PostCard
                <div>
                  <PostCard post={convertToLegacyPost(post)} />
                  <CommentSection
                    postId={post.id}
                    comments={mockComments}
                    onAddComment={(postId, content) => {
                      console.log('Add comment:', postId, content);
                    }}
                  />
                </div>
              ) : (
                // Threaded view with enhanced PostCard
                <ThreadedPostCard
                  post={post}
                  showThread={!currentThreadId}
                  isInThread={!!currentThreadId}
                  onNavigateToPost={(postId) => {
                    if (onNavigateToThread) {
                      onNavigateToThread(postId);
                    }
                  }}
                />
              )}
            </div>
          ))
        )}
      </div>

      {/* Load more */}
      {displayPosts.length > 0 && !currentThreadId && (
        <div className="text-center py-8">
          <Button variant="outline" className="flex items-center gap-2">
            <ChevronDown className="h-4 w-4" />
            Load more posts
          </Button>
        </div>
      )}

      {/* Thread info footer */}
      {currentThreadId && threadRoot && (
        <Card className="p-4 bg-muted/30">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              End of thread by <span className="font-medium">{threadRoot.author.name}</span>
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to main feed
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default EnhancedFeedView;
