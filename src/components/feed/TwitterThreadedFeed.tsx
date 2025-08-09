import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  Gift,
  MoreHorizontal,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import VirtualGiftsAndTips from '@/components/premium/VirtualGiftsAndTips';

interface TwitterPost {
  id: string;
  content: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  gifts: number;
  liked?: boolean;
  bookmarked?: boolean;
  gifted?: boolean;
  media?: { type: 'image' | 'video'; url: string; alt?: string }[];
  parentId?: string;
  threadId?: string;
  repliedTo?: string;
  // Content type indicators
  type?: 'post' | 'sponsored' | 'product' | 'job' | 'event' | 'live' | 'skill';
  // Enhanced content properties
  isSponsored?: boolean;
  isLive?: boolean;
  price?: string;
  location?: string;
  skills?: string[];
  eventDate?: string;
  jobType?: string;
  company?: string;
  salary?: string;
  ctaText?: string;
  ctaUrl?: string;
}

interface TwitterThreadedFeedProps {
  feedType: string;
}

const TwitterThreadedFeed: React.FC<TwitterThreadedFeedProps> = ({ feedType }) => {
  const navigate = useNavigate();
  
  // Mock data representing a Twitter-style feed with threaded conversations
  const [posts, setPosts] = useState<TwitterPost[]>([
    {
      id: '1',
      content: 'Just launched my new project! Excited to share it with everyone 🚀',
      author: {
        name: 'Sarah Chen',
        username: 'sarahc_dev',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        verified: true,
      },
      createdAt: '2h',
      likes: 45,
      comments: 12,
      shares: 8,
      gifts: 3,
      media: [{
        type: 'image',
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500',
        alt: 'Project screenshot'
      }],
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
      createdAt: '1h',
      likes: 12,
      comments: 3,
      shares: 1,
      gifts: 1,
      parentId: '1',
      threadId: '1',
      repliedTo: 'sarahc_dev',
    },
    {
      id: '3',
      content: 'Working on some exciting new features. Can\'t wait to show you all what we\'re building! 💻✨',
      author: {
        name: 'Mike Johnson',
        username: 'mikej_dev',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        verified: false,
      },
      createdAt: '3h',
      likes: 23,
      comments: 7,
      shares: 3,
      gifts: 0,
    },
    {
      id: '4',
      content: 'The design choices here are incredible! Love the attention to detail.',
      author: {
        name: 'Maya Patel',
        username: 'maya_design',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        verified: true,
      },
      createdAt: '45m',
      likes: 8,
      comments: 1,
      shares: 2,
      gifts: 0,
      parentId: '1',
      threadId: '1',
      repliedTo: 'sarahc_dev',
    },
    {
      id: '5',
      content: 'Thanks Alex! Really appreciate the support. More updates coming soon!',
      author: {
        name: 'Sarah Chen',
        username: 'sarahc_dev',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        verified: true,
      },
      createdAt: '30m',
      likes: 5,
      comments: 2,
      shares: 0,
      gifts: 0,
      parentId: '2',
      threadId: '1',
      repliedTo: 'alex_codes',
    },
    {
      id: '6',
      content: 'Looking forward to the updates! Will this have API integration?',
      author: {
        name: 'Tom Wilson',
        username: 'tomw_tech',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f78?w=150',
        verified: false,
      },
      createdAt: '15m',
      likes: 3,
      comments: 1,
      shares: 0,
      gifts: 0,
      parentId: '5',
      threadId: '1',
      repliedTo: 'sarahc_dev',
    },
    {
      id: '7',
      content: 'Yes! Full REST API coming in v2.0 🚀',
      author: {
        name: 'Sarah Chen',
        username: 'sarahc_dev',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        verified: true,
      },
      createdAt: '10m',
      likes: 8,
      comments: 0,
      shares: 1,
      gifts: 1,
      parentId: '6',
      threadId: '1',
      repliedTo: 'tomw_tech',
    },
  ]);

  const handlePostClick = (postId: string, e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('[role="button"]')) {
      return;
    }
    navigate(`/app/post/${postId}`);
  };

  const handleLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(prev => prev.map(post => 
      post.id === postId ? {
        ...post,
        liked: !post.liked,
        likes: post.liked ? post.likes - 1 : post.likes + 1,
      } : post
    ));
  };

  const handleBookmark = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(prev => prev.map(post => 
      post.id === postId ? {
        ...post,
        bookmarked: !post.bookmarked,
      } : post
    ));
  };

  return (
    <div className="space-y-4">
      {/* Mode Indicator */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">🧵 Threaded View Active</h3>
                <p className="text-sm text-purple-700 dark:text-purple-200">
                  Click any post to view its full conversation thread
                </p>
              </div>
            </div>
            <div className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
              TWITTER-STYLE
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Twitter-style Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card 
            key={post.id}
            className="cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={(e) => handlePostClick(post.id, e)}
          >
            <CardHeader className="pb-3 pt-4 px-4">
              <div className="flex gap-3">
                {/* Thread Connection Line for Replies */}
                {post.parentId && (
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-4 bg-muted"></div>
                    <div className="w-8 h-0.5 bg-muted"></div>
                  </div>
                )}

                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{post.author.name}</span>
                    {post.author.verified && (
                      <Badge variant="default" className="px-1 py-0 h-4 bg-blue-500">
                        <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"/>
                        </svg>
                      </Badge>
                    )}
                    <span className="text-muted-foreground text-sm">@{post.author.username}</span>
                    <span className="text-muted-foreground text-sm">·</span>
                    <span className="text-muted-foreground text-sm">{post.createdAt}</span>
                  </div>

                  {/* Replying To Indicator */}
                  {post.repliedTo && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Replying to <span className="text-blue-500">@{post.repliedTo}</span>
                    </div>
                  )}
                </div>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="px-4 py-0 pb-3">
              {/* Post Content */}
              <div className="mb-3 leading-relaxed">
                {post.content}
              </div>

              {/* Post Media */}
              {post.media && post.media.length > 0 && (
                <div className="mb-3 rounded-lg overflow-hidden">
                  {post.media.map((media, index) => (
                    <img
                      key={index}
                      src={media.url}
                      alt={media.alt || 'Post image'}
                      className="w-full object-cover"
                    />
                  ))}
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleLike(post.id, e)}
                  className={cn(
                    "flex items-center gap-1 text-muted-foreground hover:text-red-500 transition-colors",
                    post.liked && "text-red-500"
                  )}
                >
                  <Heart className={cn("h-4 w-4", post.liked && "fill-current")} />
                  <span>{post.likes}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-muted-foreground hover:text-blue-500 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-muted-foreground hover:text-green-500 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span>{post.shares}</span>
                </Button>

                <VirtualGiftsAndTips
                  recipientId={post.author.username}
                  recipientName={post.author.name}
                  contentId={post.id}
                  trigger={
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "flex items-center gap-1 text-muted-foreground hover:text-purple-500 transition-colors",
                        post.gifted && "text-purple-500"
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Gift className={cn("h-4 w-4", post.gifted && "fill-current")} />
                      <span>{post.gifts}</span>
                    </Button>
                  }
                />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleBookmark(post.id, e)}
                  className={cn(
                    "text-muted-foreground hover:text-blue-500 transition-colors",
                    post.bookmarked && "text-blue-500"
                  )}
                >
                  <Bookmark className={cn("h-4 w-4", post.bookmarked && "fill-current")} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center py-6">
        <Button variant="outline">
          Load more posts
        </Button>
      </div>
    </div>
  );
};

export default TwitterThreadedFeed;
