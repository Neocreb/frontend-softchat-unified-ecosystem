import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Users,
  MessageCircle,
  Gift,
  Heart,
  Share2,
  UserPlus,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Settings,
  MoreHorizontal,
  X,
  Crown,
  Flame,
  Coins,
  Target,
  Trophy,
  Star,
  Volume2,
  VolumeX,
  Send,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Import existing components
import LiveBattle from '@/components/battles/LiveBattle';
import BattleSetup from '@/components/battles/BattleSetup';
import { LiveStreamPlayer } from '@/components/livestream/LiveStreamPlayer';
import { battleRedirectService } from '@/services/battleRedirectService';

interface LiveStream {
  id: string;
  title: string;
  streamerName: string;
  streamerAvatar: string;
  streamerUsername: string;
  verified: boolean;
  viewerCount: number;
  category: string;
  thumbnailUrl: string;
  description: string;
  isLive: boolean;
  startedAt: Date;
  tags: string[];
  gifts: number;
  likes: number;
  guests?: Guest[];
}

interface Guest {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  isHost: boolean;
  isMuted: boolean;
  hasVideo: boolean;
  joinedAt: Date;
  status: 'approved' | 'pending' | 'speaking';
}

interface GuestRequest {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  requestedAt: Date;
  message?: string;
}

interface Comment {
  id: string;
  user: {
    username: string;
    avatar: string;
    verified?: boolean;
  };
  message: string;
  timestamp: Date;
  isGift?: boolean;
  giftValue?: number;
}

interface Gift {
  id: string;
  name: string;
  icon: string;
  value: number;
  color: string;
}

// Mock data
const mockLiveStreams: LiveStream[] = [
  {
    id: '1',
    title: 'Daily Crypto Talk & Trading Tips 🚀',
    streamerName: 'Crypto King',
    streamerAvatar: 'https://i.pravatar.cc/150?img=1',
    streamerUsername: 'crypto_king',
    verified: true,
    viewerCount: 2435,
    category: 'Finance',
    thumbnailUrl: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400',
    description: 'Live crypto analysis and trading strategies',
    isLive: true,
    startedAt: new Date(Date.now() - 45 * 60 * 1000),
    tags: ['crypto', 'bitcoin', 'trading', 'live'],
    gifts: 1250,
    likes: 8934,
  },
  {
    id: '2',
    title: 'Gaming Night - Battle Royale Stream',
    streamerName: 'GamerPro',
    streamerAvatar: 'https://i.pravatar.cc/150?img=2',
    streamerUsername: 'gamer_pro',
    verified: false,
    viewerCount: 1892,
    category: 'Gaming',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
    description: 'Live gaming session with community',
    isLive: true,
    startedAt: new Date(Date.now() - 120 * 60 * 1000),
    tags: ['gaming', 'battle', 'fun', 'community'],
    gifts: 890,
    likes: 5432,
  },
];

const gifts: Gift[] = [
  { id: '1', name: 'Rose', icon: '🌹', value: 1, color: 'text-pink-400' },
  { id: '2', name: 'Heart', icon: '❤️', value: 5, color: 'text-red-400' },
  { id: '3', name: 'Diamond', icon: '💎', value: 10, color: 'text-blue-400' },
  { id: '4', name: 'Crown', icon: '👑', value: 25, color: 'text-yellow-400' },
  { id: '5', name: 'Rocket', icon: '🚀', value: 50, color: 'text-purple-400' },
  { id: '6', name: 'Fireworks', icon: '🎆', value: 100, color: 'text-rainbow' },
];

const LiveBattlePage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('live');
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showGifts, setShowGifts] = useState(false);
  const [showGuestRequests, setShowGuestRequests] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [guestRequests, setGuestRequests] = useState<GuestRequest[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [hasVideo, setHasVideo] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showBattleSetup, setShowBattleSetup] = useState(false);
  const [activeBattle, setActiveBattle] = useState<any>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const currentStream = mockLiveStreams[currentStreamIndex];

  // Simulate live comments
  useEffect(() => {
    const interval = setInterval(() => {
      const mockComments = [
        'Amazing stream! 🔥',
        'Love this content! ❤️',
        'Thanks for the tips!',
        'Great music choice! 🎵',
        'Keep it up! 💪',
        'This is so helpful!',
        'Wow! 😍',
        'Learning so much today',
        'Best streamer ever! ⭐',
        'Can you share that again?',
      ];

      const mockUsers = [
        { username: 'viewer1', avatar: 'https://i.pravatar.cc/32?u=1' },
        { username: 'fan2024', avatar: 'https://i.pravatar.cc/32?u=2' },
        { username: 'cryptofan', avatar: 'https://i.pravatar.cc/32?u=3' },
        { username: 'supporter', avatar: 'https://i.pravatar.cc/32?u=4' },
      ];

      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const randomMessage = mockComments[Math.floor(Math.random() * mockComments.length)];

      const newComment: Comment = {
        id: Date.now().toString(),
        user: randomUser,
        message: randomMessage,
        timestamp: new Date(),
      };

      setComments(prev => [...prev.slice(-50), newComment]);
    }, 3000 + Math.random() * 5000);

    return () => clearInterval(interval);
  }, []);

  // Mock guest requests
  useEffect(() => {
    if (isHost) {
      const mockRequests: GuestRequest[] = [
        {
          id: '1',
          userId: 'user1',
          username: 'techguru',
          displayName: 'Tech Guru',
          avatar: 'https://i.pravatar.cc/32?u=guest1',
          requestedAt: new Date(Date.now() - 60000),
          message: 'Can I join to discuss crypto?',
        },
        {
          id: '2',
          userId: 'user2',
          username: 'traderpro',
          displayName: 'Trader Pro',
          avatar: 'https://i.pravatar.cc/32?u=guest2',
          requestedAt: new Date(Date.now() - 30000),
        },
      ];
      setGuestRequests(mockRequests);
    }
  }, [isHost]);

  const sendComment = () => {
    if (!newComment.trim() || !user) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: {
        username: user.username || 'you',
        avatar: user.avatar || 'https://i.pravatar.cc/32?u=current',
      },
      message: newComment,
      timestamp: new Date(),
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');
  };

  const sendGift = (gift: Gift) => {
    if (!user) return;

    const giftComment: Comment = {
      id: Date.now().toString(),
      user: {
        username: user.username || 'you',
        avatar: user.avatar || 'https://i.pravatar.cc/32?u=current',
      },
      message: `sent ${gift.icon} ${gift.name}`,
      timestamp: new Date(),
      isGift: true,
      giftValue: gift.value,
    };

    setComments(prev => [...prev, giftComment]);
    setShowGifts(false);

    toast({
      title: 'Gift Sent! 🎁',
      description: `You sent ${gift.icon} ${gift.name} (${gift.value} SP)`,
    });
  };

  const approveGuest = (guestId: string) => {
    const request = guestRequests.find(r => r.id === guestId);
    if (!request) return;

    const newGuest: Guest = {
      id: request.userId,
      username: request.username,
      displayName: request.displayName,
      avatar: request.avatar,
      isHost: false,
      isMuted: false,
      hasVideo: true,
      joinedAt: new Date(),
      status: 'approved',
    };

    setGuests(prev => [...prev, newGuest]);
    setGuestRequests(prev => prev.filter(r => r.id !== guestId));

    toast({
      title: 'Guest Approved! ✅',
      description: `${request.displayName} joined the live stream`,
    });
  };

  const rejectGuest = (guestId: string) => {
    setGuestRequests(prev => prev.filter(r => r.id !== guestId));
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? 'Unliked' : 'Liked! ❤️',
      description: isLiked ? 'You unliked this stream' : 'You liked this stream',
    });
  };

  const requestToJoin = () => {
    if (!user) return;

    toast({
      title: 'Request Sent! 📤',
      description: 'Your request to join as a guest has been sent to the host',
    });
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden">
      <Helmet>
        <title>Live & Battles | Softchat</title>
        <meta name="description" content="Watch live streams and join epic battles" />
      </Helmet>

      {/* Tab Navigation */}
      <div className="relative z-50">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/90 backdrop-blur-sm border-b border-gray-800 rounded-none h-12">
            <TabsTrigger 
              value="live" 
              className="text-white data-[state=active]:text-pink-400 data-[state=active]:border-b-2 data-[state=active]:border-pink-400 rounded-none"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Live
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="battle" 
              className="text-white data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none"
            >
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Battle
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Live Tab Content */}
          <TabsContent value="live" className="mt-0 h-screen">
            <div className="relative h-full">
              {/* Main Video Stream */}
              <div className="absolute inset-0">
                <img
                  src={currentStream.thumbnailUrl}
                  alt={currentStream.title}
                  className="w-full h-full object-cover"
                />
                {/* Video overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
              </div>

              {/* Top Header */}
              <div className="absolute top-0 left-0 right-0 z-40 p-4 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border-2 border-white/30">
                      <AvatarImage src={currentStream.streamerAvatar} />
                      <AvatarFallback>{currentStream.streamerName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold text-sm">
                          {currentStream.streamerName}
                        </span>
                        {currentStream.verified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                      <div className="text-white/80 text-xs">{formatNumber(currentStream.viewerCount)} viewers</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-pink-500/20 border-pink-500/30 text-pink-400 hover:bg-pink-500/30 text-xs px-3 py-1"
                    >
                      + Follow
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white/80 hover:bg-white/10">
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Live indicator and category */}
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-red-500 text-white animate-pulse px-2 py-1 text-xs">
                    LIVE
                  </Badge>
                  <Badge variant="secondary" className="bg-black/40 text-white text-xs">
                    {currentStream.category}
                  </Badge>
                  <div className="text-white/60 text-xs">
                    Started {formatTime(currentStream.startedAt)} ago
                  </div>
                </div>
              </div>

              {/* Guest Grid (if applicable) */}
              {guests.length > 0 && (
                <div className="absolute top-24 left-4 right-20 z-30">
                  <div className="grid grid-cols-2 gap-2 max-w-xs">
                    {guests.slice(0, 6).map((guest) => (
                      <div
                        key={guest.id}
                        className="relative bg-black/40 backdrop-blur-sm rounded-lg border border-white/20 p-2"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={guest.avatar} />
                            <AvatarFallback>{guest.displayName[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-xs font-medium truncate">
                              {guest.displayName}
                            </div>
                            <div className="text-white/60 text-xs">
                              {guest.status === 'speaking' ? '🎤 Speaking' : 'Guest'}
                            </div>
                          </div>
                        </div>
                        {guest.isMuted && (
                          <div className="absolute top-1 right-1">
                            <MicOff className="w-3 h-3 text-red-400" />
                          </div>
                        )}
                      </div>
                    ))}
                    {guests.length > 6 && (
                      <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-white/20 p-2 flex items-center justify-center">
                        <span className="text-white text-xs">+{guests.length - 6} more</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 z-40 p-4">
                <div className="flex items-end justify-between">
                  {/* Left side - Stream info */}
                  <div className="flex-1 max-w-2xl">
                    <h3 className="text-white text-lg font-semibold mb-2 leading-tight">
                      {currentStream.title}
                    </h3>
                    <div className="text-white/80 text-sm mb-3">
                      {currentStream.description}
                    </div>
                    
                    {/* Hashtags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {currentStream.tags.map((tag) => (
                        <span key={tag} className="text-blue-300 text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right side - Action buttons */}
                  <div className="flex flex-col items-center gap-4 ml-4">
                    {/* Like button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/20"
                      onClick={toggleLike}
                    >
                      <Heart className={cn("w-6 h-6", isLiked && "fill-red-500 text-red-500")} />
                    </Button>
                    <span className="text-white text-xs text-center">
                      {formatNumber(currentStream.likes + (isLiked ? 1 : 0))}
                    </span>

                    {/* Comment button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/20"
                      onClick={() => setShowChat(!showChat)}
                    >
                      <MessageCircle className="w-6 h-6" />
                    </Button>
                    <span className="text-white text-xs text-center">
                      {formatNumber(comments.length)}
                    </span>

                    {/* Share button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/20"
                    >
                      <Share2 className="w-6 h-6" />
                    </Button>
                    <span className="text-white text-xs text-center">Share</span>

                    {/* Gift button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/20"
                      onClick={() => setShowGifts(!showGifts)}
                    >
                      <Gift className="w-6 h-6" />
                    </Button>
                    <span className="text-white text-xs text-center">Gift</span>

                    {/* More options */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/20"
                    >
                      <MoreHorizontal className="w-6 h-6" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Bottom Navigation Bar */}
              <div className="absolute bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
                <div className="flex items-center justify-around py-2 px-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col items-center gap-1 text-white/80 hover:text-white"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-xs">Message</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col items-center gap-1 text-white/80 hover:text-white"
                  >
                    <Star className="w-5 h-5" />
                    <span className="text-xs">Subscribe</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col items-center gap-1 text-white/80 hover:text-white"
                    onClick={requestToJoin}
                  >
                    <UserPlus className="w-5 h-5" />
                    <span className="text-xs">Join</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col items-center gap-1 text-white/80 hover:text-white"
                    onClick={() => setShowGuestRequests(!showGuestRequests)}
                  >
                    <Users className="w-5 h-5" />
                    <span className="text-xs">Guests</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col items-center gap-1 text-white/80 hover:text-white"
                  >
                    <Gift className="w-5 h-5" />
                    <span className="text-xs">Recharge</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col items-center gap-1 text-white/80 hover:text-white"
                    onClick={() => setShowGifts(!showGifts)}
                  >
                    <Gift className="w-5 h-5" />
                    <span className="text-xs">Gift</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col items-center gap-1 text-white/80 hover:text-white"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="text-xs">Share</span>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Battle Tab Content */}
          <TabsContent value="battle" className="mt-0 h-screen">
            {activeBattle ? (
              <LiveBattle
                battleId={activeBattle.id}
                creator1={activeBattle.creator1}
                creator2={activeBattle.creator2}
                duration={activeBattle.duration}
                onBattleEnd={(winnerId) => {
                  setActiveBattle(null);
                  toast({
                    title: 'Battle Ended!',
                    description: 'The battle has concluded.',
                  });
                }}
                onExit={() => setActiveBattle(null)}
              />
            ) : (
              <div className="relative h-full bg-gradient-to-br from-purple-900 via-blue-900 to-black">
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="text-center max-w-md">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                      Epic Battles Await
                    </h2>
                    <p className="text-white/80 text-lg mb-8">
                      Challenge creators, vote on your favorites, and win rewards!
                    </p>
                    <Button
                      onClick={() => setShowBattleSetup(true)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold"
                    >
                      Start Battle
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Transparent Chat Overlay */}
      {showChat && activeTab === 'live' && (
        <div className="fixed bottom-20 left-4 right-20 z-40 max-h-80">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 p-3">
            <div className="space-y-2 max-h-60 overflow-y-auto mb-3">
              {comments.slice(-10).map((comment) => (
                <div key={comment.id} className="flex items-start gap-2">
                  <Avatar className="w-6 h-6 flex-shrink-0">
                    <AvatarImage src={comment.user.avatar} />
                    <AvatarFallback className="text-xs">{comment.user.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-white font-medium text-sm">
                        {comment.user.username}
                      </span>
                      {comment.isGift && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">
                          Gift
                        </Badge>
                      )}
                    </div>
                    <p className="text-white/90 text-sm break-words">{comment.message}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Say something..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && sendComment()}
              />
              <Button size="sm" onClick={sendComment} className="px-3">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Gift Selection Overlay */}
      {showGifts && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Send Gift</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowGifts(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {gifts.map((gift) => (
                <Button
                  key={gift.id}
                  variant="outline"
                  className="aspect-square p-4 flex flex-col items-center gap-2 hover:bg-gray-800"
                  onClick={() => sendGift(gift)}
                >
                  <div className="text-2xl">{gift.icon}</div>
                  <div className="text-center">
                    <div className="text-white text-sm font-medium">{gift.name}</div>
                    <div className={cn("text-xs", gift.color)}>{gift.value} SP</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Guest Requests Panel */}
      {showGuestRequests && isHost && (
        <div className="fixed right-4 bottom-24 top-20 w-80 bg-gray-900/95 backdrop-blur-sm rounded-lg border border-gray-700 z-40 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Guest Requests</h3>
            <Button variant="ghost" size="icon" onClick={() => setShowGuestRequests(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {guestRequests.map((request) => (
              <div key={request.id} className="bg-gray-800 rounded-lg p-3">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={request.avatar} />
                    <AvatarFallback>{request.displayName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">{request.displayName}</div>
                    <div className="text-gray-400 text-xs">@{request.username}</div>
                  </div>
                </div>
                
                {request.message && (
                  <p className="text-gray-300 text-sm mb-3">{request.message}</p>
                )}
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => approveGuest(request.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => rejectGuest(request.id)}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            ))}
            
            {guestRequests.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No guest requests</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Battle Setup Modal */}
      <Dialog open={showBattleSetup} onOpenChange={setShowBattleSetup}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Battle</DialogTitle>
          </DialogHeader>
          <BattleSetup
            open={showBattleSetup}
            onOpenChange={setShowBattleSetup}
            onBattleStart={(battleConfig) => {
              // Create a mock battle from the config
              const mockBattle = {
                id: `battle-${Date.now()}`,
                title: battleConfig.title,
                creator1: {
                  id: '1',
                  username: 'user1',
                  displayName: 'Battle Creator',
                  avatar: 'https://i.pravatar.cc/150?img=1',
                  verified: false,
                  tier: 'pro_creator' as const,
                  score: 0,
                },
                creator2: {
                  id: '2',
                  username: 'opponent',
                  displayName: 'Challenger',
                  avatar: 'https://i.pravatar.cc/150?img=2',
                  verified: true,
                  tier: 'legend' as const,
                  score: 0,
                },
                duration: battleConfig.duration * 60, // Convert minutes to seconds
                description: battleConfig.description,
                isPublic: battleConfig.isPublic,
                allowVoting: battleConfig.allowVoting,
              };

              setActiveBattle(mockBattle);
              setShowBattleSetup(false);
              setActiveTab('battle'); // Switch to battle tab
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LiveBattlePage;
