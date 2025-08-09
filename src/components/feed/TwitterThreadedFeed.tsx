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
  MessageSquare,
  Crown,
  ShoppingCart,
  Briefcase,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  GraduationCap,
  Radio,
  Zap,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import VirtualGiftsAndTips from '@/components/premium/VirtualGiftsAndTips';
import EnhancedShareDialog from './EnhancedShareDialog';
import UnifiedActionButtons from './UnifiedActionButtons';
import { UnifiedActivityService } from '@/services/unifiedActivityService';
import { useNotification } from '@/hooks/use-notification';
import { useAuth } from '@/contexts/AuthContext';

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
  const notification = useNotification();
  const { user } = useAuth();
  
  // Mock data representing a comprehensive Twitter-style feed with diverse platform content
  const [posts, setPosts] = useState<TwitterPost[]>([
    // Original Thread Conversation
    {
      id: '1',
      type: 'post',
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

    // Sponsored Advertisement
    {
      id: 'ad1',
      type: 'sponsored',
      isSponsored: true,
      content: '✨ Unlock Premium Features with SoftChat Pro! Get advanced analytics, priority support, and exclusive tools for creators and businesses. Limited time offer - 50% off! 🎯',
      author: {
        name: 'SoftChat',
        username: 'softchat_official',
        avatar: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=150',
        verified: true,
      },
      createdAt: 'Sponsored',
      likes: 1200,
      comments: 89,
      shares: 245,
      gifts: 15,
      ctaText: 'Upgrade Now',
      ctaUrl: '/premium',
      media: [{
        type: 'image',
        url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500',
        alt: 'SoftChat Premium features'
      }],
    },

    {
      id: '2',
      type: 'post',
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

    // Marketplace Product
    {
      id: 'product1',
      type: 'product',
      content: '🎨 New Digital Art Collection Available! Hand-crafted NFT series featuring cyberpunk aesthetics. Each piece is unique and comes with unlockable content. Perfect for collectors and digital art enthusiasts!',
      author: {
        name: 'ArtistCo Gallery',
        username: 'artistco_nft',
        avatar: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=150',
        verified: true,
      },
      createdAt: '3h',
      likes: 156,
      comments: 23,
      shares: 34,
      gifts: 8,
      price: '0.25 ETH',
      ctaText: 'View Collection',
      ctaUrl: '/marketplace/nft-collection',
      media: [{
        type: 'image',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500',
        alt: 'Digital art NFT'
      }],
    },

    // Freelance Job Posting
    {
      id: 'job1',
      type: 'job',
      content: '💼 We\'re hiring! Looking for a talented Full-Stack Developer to join our growing startup. Work remotely, competitive salary, and equity options. Experience with React, Node.js, and cloud platforms required.',
      author: {
        name: 'TechStartup Inc',
        username: 'techstartup_co',
        avatar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150',
        verified: true,
      },
      createdAt: '4h',
      likes: 89,
      comments: 45,
      shares: 67,
      gifts: 3,
      jobType: 'Full-time Remote',
      company: 'TechStartup Inc',
      salary: '$80K - $120K + Equity',
      location: 'Remote',
      skills: ['React', 'Node.js', 'AWS', 'TypeScript'],
      ctaText: 'Apply Now',
      ctaUrl: '/freelance/jobs/fullstack-dev',
    },

    {
      id: '3',
      type: 'post',
      content: 'Working on some exciting new features. Can\'t wait to show you all what we\'re building! 💻✨',
      author: {
        name: 'Mike Johnson',
        username: 'mikej_dev',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        verified: false,
      },
      createdAt: '5h',
      likes: 23,
      comments: 7,
      shares: 3,
      gifts: 0,
    },

    // Live Event
    {
      id: 'event1',
      type: 'event',
      isLive: true,
      content: '🔴 LIVE: Crypto Trading Masterclass with industry experts! Learn advanced trading strategies, technical analysis, and risk management. Q&A session included. Don\'t miss out!',
      author: {
        name: 'CryptoAcademy',
        username: 'crypto_academy',
        avatar: 'https://images.unsplash.com/photo-1559445368-92d4e08c5e8f?w=150',
        verified: true,
      },
      createdAt: 'Live now',
      likes: 342,
      comments: 128,
      shares: 89,
      gifts: 25,
      eventDate: 'Now - 2h remaining',
      location: 'Virtual Event',
      ctaText: 'Join Live',
      ctaUrl: '/events/crypto-masterclass',
      media: [{
        type: 'image',
        url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500',
        alt: 'Crypto trading event'
      }],
    },

    {
      id: '4',
      type: 'post',
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

    // Skills/Course Promotion
    {
      id: 'skill1',
      type: 'skill',
      content: '📚 Master Web3 Development in 30 Days! Comprehensive course covering Smart Contracts, DApps, and DeFi protocols. Join 5000+ students already earning in the crypto space. Early bird discount ends soon!',
      author: {
        name: 'Web3 Academy',
        username: 'web3_academy',
        avatar: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150',
        verified: true,
      },
      createdAt: '6h',
      likes: 267,
      comments: 156,
      shares: 123,
      gifts: 18,
      price: '$199 (was $399)',
      skills: ['Solidity', 'Web3.js', 'Smart Contracts', 'DeFi'],
      ctaText: 'Enroll Now',
      ctaUrl: '/learn/web3-development',
      media: [{
        type: 'image',
        url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500',
        alt: 'Web3 development course'
      }],
    },

    {
      id: '5',
      type: 'post',
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
      type: 'post',
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
      type: 'post',
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

    // Community Event
    {
      id: 'community1',
      type: 'event',
      content: '🎉 SoftChat Community Meetup this Saturday! Join us for networking, workshops, and exciting announcements about upcoming features. Free food and swag for all attendees!',
      author: {
        name: 'SoftChat Events',
        username: 'softchat_events',
        avatar: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=150',
        verified: true,
      },
      createdAt: '8h',
      likes: 423,
      comments: 67,
      shares: 156,
      gifts: 12,
      eventDate: 'Saturday, 2:00 PM',
      location: 'Tech Hub Downtown',
      ctaText: 'RSVP Now',
      ctaUrl: '/events/community-meetup',
      media: [{
        type: 'image',
        url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500',
        alt: 'Community meetup event'
      }],
    },

    // Crypto Trading Post
    {
      id: 'crypto1',
      type: 'post',
      content: '📈 Bitcoin hitting new resistance at $45K! Technical analysis shows potential breakout above this level. MACD showing bullish divergence on 4H chart. What are your thoughts? #BTC #TechnicalAnalysis',
      author: {
        name: 'CryptoTrader Pro',
        username: 'cryptotrader_pro',
        avatar: 'https://images.unsplash.com/photo-1559445368-92d4e08c5e8f?w=150',
        verified: true,
      },
      createdAt: '2h',
      likes: 189,
      comments: 45,
      shares: 32,
      gifts: 7,
      media: [{
        type: 'image',
        url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500',
        alt: 'Bitcoin trading chart'
      }],
    },

    // Freelancer Showcase
    {
      id: 'freelance1',
      type: 'post',
      content: '✨ Just completed a fantastic UI/UX project for a fintech startup! 3 weeks from concept to final design. The client was thrilled with the modern, user-friendly interface. Looking for my next challenge!',
      author: {
        name: 'Designer Sarah',
        username: 'sarah_uxui',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        verified: false,
      },
      createdAt: '4h',
      likes: 76,
      comments: 23,
      shares: 15,
      gifts: 4,
      skills: ['UI/UX Design', 'Figma', 'Prototyping'],
      media: [{
        type: 'image',
        url: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500',
        alt: 'UI/UX design showcase'
      }],
    },

    // Live Stream Announcement
    {
      id: 'live1',
      type: 'event',
      isLive: true,
      content: '🔴 GOING LIVE: Building a React Native App from Scratch! Join me as I code a complete mobile app with authentication, real-time features, and more. Perfect for beginners! 🚀',
      author: {
        name: 'DevStreamer',
        username: 'dev_streamer',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        verified: true,
      },
      createdAt: 'Starting now',
      likes: 234,
      comments: 89,
      shares: 45,
      gifts: 18,
      eventDate: 'Live now - 3h stream',
      location: 'YouTube Live',
      ctaText: 'Join Stream',
      ctaUrl: '/live/react-native-tutorial',
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

  const handleLike = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const post = posts.find(p => p.id === postId);
    const newLikedState = !post?.liked;

    // Update UI immediately
    setPosts(prev => prev.map(post =>
      post.id === postId ? {
        ...post,
        liked: newLikedState,
        likes: post.liked ? post.likes - 1 : post.likes + 1,
      } : post
    ));

    // Track reward for liking
    if (newLikedState && user?.id) {
      try {
        const reward = await UnifiedActivityService.trackLike(user.id, postId);
        if (reward.success && reward.softPoints > 0) {
          notification.success(`+${reward.softPoints} SoftPoints earned!`, {
            description: "Thanks for engaging with the community!"
          });
        }
      } catch (error) {
        console.error("Failed to track like activity:", error);
      }
    }
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

  const handleComment = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to post detail page to view/add comments
    navigate(`/app/post/${postId}`);
  };

  const handleRepost = (originalPostId: string, content: string) => {
    // Create a new repost
    const newPost: TwitterPost = {
      id: `repost_${Date.now()}`,
      type: 'post',
      content: content || `Reposted from @${posts.find(p => p.id === originalPostId)?.author.username}`,
      author: {
        name: 'Current User', // In real app, use actual user data
        username: 'current_user',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        verified: false,
      },
      createdAt: 'now',
      likes: 0,
      comments: 0,
      shares: 0,
      gifts: 0,
      parentId: originalPostId,
    };

    setPosts(prev => [newPost, ...prev]);

    // Increment shares on original post
    setPosts(prev => prev.map(post =>
      post.id === originalPostId ? {
        ...post,
        shares: post.shares + 1,
      } : post
    ));
  };

  const handleQuotePost = (originalPostId: string, content: string) => {
    const originalPost = posts.find(p => p.id === originalPostId);
    if (!originalPost) return;

    // Create a new quote post
    const newPost: TwitterPost = {
      id: `quote_${Date.now()}`,
      type: 'post',
      content,
      author: {
        name: 'Current User', // In real app, use actual user data
        username: 'current_user',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        verified: false,
      },
      createdAt: 'now',
      likes: 0,
      comments: 0,
      shares: 0,
      gifts: 0,
      // Store reference to quoted post
      parentId: originalPostId,
    };

    setPosts(prev => [newPost, ...prev]);

    // Increment shares on original post
    setPosts(prev => prev.map(post =>
      post.id === originalPostId ? {
        ...post,
        shares: post.shares + 1,
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

                    {/* Content Type Badges */}
                    {post.isSponsored && (
                      <Badge className="px-2 py-0 h-4 bg-purple-500 text-white">
                        <Crown className="h-2.5 w-2.5 mr-1" />
                        Sponsored
                      </Badge>
                    )}
                    {post.type === 'product' && (
                      <Badge className="px-2 py-0 h-4 bg-green-500 text-white">
                        <ShoppingCart className="h-2.5 w-2.5 mr-1" />
                        Product
                      </Badge>
                    )}
                    {post.type === 'job' && (
                      <Badge className="px-2 py-0 h-4 bg-blue-600 text-white">
                        <Briefcase className="h-2.5 w-2.5 mr-1" />
                        Job
                      </Badge>
                    )}
                    {post.type === 'event' && (
                      <Badge className="px-2 py-0 h-4 bg-orange-500 text-white">
                        <Calendar className="h-2.5 w-2.5 mr-1" />
                        {post.isLive ? 'Live Event' : 'Event'}
                      </Badge>
                    )}
                    {post.type === 'skill' && (
                      <Badge className="px-2 py-0 h-4 bg-indigo-500 text-white">
                        <GraduationCap className="h-2.5 w-2.5 mr-1" />
                        Course
                      </Badge>
                    )}

                    <span className="text-muted-foreground text-sm">@{post.author.username}</span>
                    <span className="text-muted-foreground text-sm">·</span>
                    <span className="text-muted-foreground text-sm">{post.createdAt}</span>

                    {post.isLive && (
                      <div className="flex items-center gap-1 text-red-500">
                        <Radio className="h-3 w-3" />
                        <span className="text-xs font-medium">LIVE</span>
                      </div>
                    )}
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

              {/* Enhanced Content Info for Different Types */}
              {post.type === 'job' && (
                <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {post.jobType && (
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3 text-blue-600" />
                        <span className="font-medium">{post.jobType}</span>
                      </div>
                    )}
                    {post.salary && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-green-600" />
                        <span className="font-medium">{post.salary}</span>
                      </div>
                    )}
                    {post.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-600" />
                        <span>{post.location}</span>
                      </div>
                    )}
                    {post.company && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{post.company}</span>
                      </div>
                    )}
                  </div>
                  {post.skills && post.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {post.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {post.type === 'product' && post.price && (
                <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-lg text-green-700 dark:text-green-300">{post.price}</span>
                    </div>
                    <Badge className="bg-green-500 text-white">For Sale</Badge>
                  </div>
                </div>
              )}

              {post.type === 'event' && (
                <div className="mb-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-4 text-sm">
                    {post.eventDate && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-orange-600" />
                        <span className="font-medium">{post.eventDate}</span>
                      </div>
                    )}
                    {post.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-orange-600" />
                        <span>{post.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {post.type === 'skill' && (
                <div className="mb-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-indigo-600" />
                      <span className="font-semibold text-indigo-700 dark:text-indigo-300">Learning Path</span>
                    </div>
                    {post.price && (
                      <span className="font-bold text-lg text-indigo-700 dark:text-indigo-300">{post.price}</span>
                    )}
                  </div>
                  {post.skills && post.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {post.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-indigo-100 text-indigo-800">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

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

              {/* Enhanced Unified Action Buttons */}
              <UnifiedActionButtons
                postId={post.id}
                type={post.type}
                isLive={post.isLive}
                price={post.price}
                location={post.location}
                eventDate={post.eventDate}
                jobType={post.jobType}
                company={post.company}
                salary={post.salary}
                skills={post.skills}
                ctaText={post.ctaText}
                ctaUrl={post.ctaUrl}
                author={post.author}
              />

              {/* Enhanced Post Actions */}
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
                  onClick={(e) => handleComment(post.id, e)}
                  className="flex items-center gap-1 text-muted-foreground hover:text-blue-500 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments}</span>
                </Button>

                <EnhancedShareDialog
                  postId={post.id}
                  postContent={post.content}
                  postAuthor={post.author}
                  onRepost={(content) => handleRepost(post.id, content)}
                  onQuotePost={(content) => handleQuotePost(post.id, content)}
                  trigger={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-muted-foreground hover:text-green-500 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Share2 className="h-4 w-4" />
                      <span>{post.shares}</span>
                    </Button>
                  }
                />

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
