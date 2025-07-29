import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Users,
  Gift,
  X,
  Send,
  Smile,
  Diamond,
  Crown,
  Radio,
  Target,
  Eye,
  Coins,
  DollarSign,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Settings,
  Square,
  UserPlus,
  Flame,
  Star,
  Trophy,
  Zap,
  Play,
  Pause,
  MoreVertical,
  Coffee,
  Cake,
  Sparkles,
  Music,
  HeartHandshake,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import { cn } from '../../lib/utils';
import { LiveStreamData } from '../../hooks/use-live-content';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../contexts/AuthContext';
import BattleVoting from '../voting/BattleVoting';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import VirtualGiftsAndTips from '../premium/VirtualGiftsAndTips';
import EnhancedBattleGifts, { BattleGift } from '../battles/EnhancedBattleGifts';

interface LiveChatMessage {
  id: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    verified: boolean;
    tier?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  };
  message: string;
  timestamp: Date;
  type: 'message' | 'gift' | 'join' | 'follow' | 'system' | 'reaction' | 'like' | 'support';
  giftInfo?: {
    giftType: string;
    value: number;
    animation: string;
    recipient?: 'creator1' | 'creator2';
  };
}

interface TikTokBattleLayoutProps {
  content: LiveStreamData;
  isActive: boolean;
  isUserOwned?: boolean;
  onEndStream?: () => void;
  className?: string;
}

const battleGifts = [
  { id: 'rose', emoji: '🌹', name: 'Rose', value: 1, color: 'text-pink-400' },
  { id: 'heart', emoji: '❤️', name: 'Heart', value: 5, color: 'text-red-400' },
  { id: 'diamond', emoji: '💎', name: 'Diamond', value: 10, color: 'text-blue-400' },
  { id: 'crown', emoji: '👑', name: 'Crown', value: 25, color: 'text-yellow-400' },
  { id: 'rocket', emoji: '🚀', name: 'Rocket', value: 50, color: 'text-purple-400' },
  { id: 'lion', emoji: '🦁', name: 'Lion', value: 100, color: 'text-orange-400' },
  { id: 'unicorn', emoji: '🦄', name: 'Unicorn', value: 200, color: 'text-pink-400' },
  { id: 'sports_car', emoji: '🏎️', name: 'Sports Car', value: 500, color: 'text-blue-400' },
  { id: 'yacht', emoji: '🛥️', name: 'Yacht', value: 1000, color: 'text-cyan-400' },
];

const mockChatMessages: LiveChatMessage[] = [
  {
    id: '1',
    user: {
      id: 'user1',
      username: 'topdog_viewer',
      displayName: 'Top Dog',
      avatar: 'https://i.pravatar.cc/150?img=11',
      verified: false,
      tier: 'gold',
    },
    message: 'liked the LIVE',
    timestamp: new Date(Date.now() - 10000),
    type: 'like',
  },
  {
    id: '2',
    user: {
      id: 'user2',
      username: 'battlefan',
      displayName: 'Battle Fan',
      avatar: 'https://i.pravatar.cc/150?img=12',
      verified: true,
      tier: 'diamond',
    },
    message: 'This battle is fire! 🔥',
    timestamp: new Date(Date.now() - 8000),
    type: 'message',
  },
  {
    id: '3',
    user: {
      id: 'user3',
      username: 'giftking',
      displayName: 'Gift King',
      avatar: 'https://i.pravatar.cc/150?img=13',
      verified: false,
      tier: 'platinum',
    },
    message: 'sent 1 stun hammer',
    timestamp: new Date(Date.now() - 5000),
    type: 'gift',
    giftInfo: {
      giftType: 'hammer',
      value: 250,
      animation: 'stun',
      recipient: 'creator1',
    },
  },
];

export const TikTokBattleLayout: React.FC<TikTokBattleLayoutProps> = ({
  content,
  isActive,
  isUserOwned = false,
  onEndStream,
  className,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Battle state
  const [battleScores, setBattleScores] = useState({
    creator1: content.battleData?.scores?.user1 || 723989,
    creator2: content.battleData?.scores?.user2 || 911341,
  });
  const [battleTime, setBattleTime] = useState(content.battleData?.timeRemaining || 150); // 02:30
  const [currentWinner, setCurrentWinner] = useState<'creator1' | 'creator2' | 'tie'>('creator2');
  
  // Stream state
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(isActive);
  const [localViewerCount, setLocalViewerCount] = useState(52500); // 52.5K like in screenshot
  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>(mockChatMessages);
  const [chatMessage, setChatMessage] = useState('');
  
  // UI state
  const [showGifts, setShowGifts] = useState(false);
  const [showVoting, setShowVoting] = useState(false);
  const [showQuickReactions, setShowQuickReactions] = useState(false);
  const [showStreamControls, setShowStreamControls] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<'creator1' | 'creator2'>('creator1');
  
  // Stream controls for owner
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const creator1VideoRef = useRef<HTMLVideoElement>(null);
  const creator2VideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Calculate battle progress (creator1 vs creator2)
  const getBattleProgress = () => {
    const total = battleScores.creator1 + battleScores.creator2;
    if (total === 0) return 50;
    return (battleScores.creator1 / total) * 100;
  };

  // Determine winner
  useEffect(() => {
    if (battleScores.creator1 > battleScores.creator2) {
      setCurrentWinner('creator1');
    } else if (battleScores.creator2 > battleScores.creator1) {
      setCurrentWinner('creator2');
    } else {
      setCurrentWinner('tie');
    }
  }, [battleScores]);

  // Battle timer countdown
  useEffect(() => {
    if (!isActive || battleTime <= 0) return;

    const interval = setInterval(() => {
      setBattleTime((prev) => {
        if (prev <= 1) {
          toast({
            title: "Battle Ended! 🏆",
            description: `Winner: ${currentWinner === 'creator1' ? content.user.displayName : content.battleData?.opponent?.displayName || 'Creator 2'}`,
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, battleTime, currentWinner, content.user.displayName, content.battleData?.opponent?.displayName, toast]);

  // Simulate real-time battle updates
  useEffect(() => {
    if (!isActive || battleTime <= 0) return;

    const interval = setInterval(() => {
      // Random score updates
      if (Math.random() < 0.4) {
        const scoreChange = Math.floor(Math.random() * 5000) + 1000;
        const recipient = Math.random() < 0.5 ? 'creator1' : 'creator2';
        
        setBattleScores(prev => ({
          ...prev,
          [recipient]: prev[recipient] + scoreChange,
        }));
      }

      // Random chat messages
      if (Math.random() < 0.3) {
        const mockUsers = [
          { username: 'battleviewer', displayName: 'Battle Viewer', avatar: 'https://i.pravatar.cc/150?img=14', verified: false, tier: 'bronze' as const },
          { username: 'giftlover', displayName: 'Gift Lover', avatar: 'https://i.pravatar.cc/150?img=15', verified: true, tier: 'gold' as const },
          { username: 'crownking', displayName: 'Crown King', avatar: 'https://i.pravatar.cc/150?img=16', verified: false, tier: 'diamond' as const },
        ];
        
        const mockMessages = [
          'Go team! 💪',
          'Amazing battle! 🔥',
          'This is intense! 😱',
          'Who will win? 🏆',
          'sent a gift! ��',
          'liked the LIVE',
          'Go creator1! 👏',
          'Creator2 for the win! 🚀',
        ];

        const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        const randomMessage = mockMessages[Math.floor(Math.random() * mockMessages.length)];
        
        const messageType = randomMessage === 'liked the LIVE' ? 'like' : 
                           randomMessage.includes('gift') ? 'gift' : 'message';
        
        const newMessage: LiveChatMessage = {
          id: `msg-${Date.now()}`,
          user: {
            id: `user-${Date.now()}`,
            ...randomUser,
          },
          message: randomMessage,
          timestamp: new Date(),
          type: messageType,
          ...(messageType === 'gift' && {
            giftInfo: {
              giftType: 'heart',
              value: Math.floor(Math.random() * 50) + 1,
              animation: 'float',
              recipient: Math.random() < 0.5 ? 'creator1' : 'creator2',
            }
          })
        };

        setChatMessages(prev => [...prev.slice(-15), newMessage]);
      }
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [isActive, battleTime]);

  // Initialize camera for user-owned stream
  useEffect(() => {
    if (isUserOwned && isActive && creator1VideoRef.current) {
      const initializeCamera = async () => {
        // Import the camera manager
        const { requestCameraPermission, getPermissionHelp } = await import('../../utils/cameraPermissions');

        const result = await requestCameraPermission({
          video: {
            width: { ideal: 720 },
            height: { ideal: 1280 },
            facingMode: 'user'
          },
          audio: true,
          fallbackToAudioOnly: false,
        });

        if (result.success && result.stream && creator1VideoRef.current) {
          creator1VideoRef.current.srcObject = result.stream;
          creator1VideoRef.current.muted = true;
          streamRef.current = result.stream;

          creator1VideoRef.current.play().catch(console.error);

          toast({
            title: "Battle Ready! ⚔️",
            description: "Camera and microphone connected successfully",
          });
        } else {
          toast({
            title: "Camera Access Required 📹",
            description: result.error || "Please enable camera access to start battle streaming",
            variant: "destructive",
            action: result.error?.includes('denied') ? (
              <div className="mt-2">
                <p className="text-xs text-white/80 whitespace-pre-line">
                  {getPermissionHelp()}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 text-xs underline text-blue-400 hover:text-blue-300"
                >
                  Try Again
                </button>
              </div>
            ) : undefined,
          });
        }
      };

      initializeCamera();
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [isUserOwned, isActive, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const handleSendGift = (gift: BattleGift, recipient: 'creator1' | 'creator2') => {
    if (!user) return;

    // Update battle scores with gift multiplier
    setBattleScores(prev => ({
      ...prev,
      [recipient]: prev[recipient] + gift.multiplier,
    }));

    const giftMessage: LiveChatMessage = {
      id: `gift-${Date.now()}`,
      user: {
        id: user.id,
        username: user.username || 'user',
        displayName: user.name || 'User',
        avatar: user.avatar || '',
        verified: false,
        tier: 'bronze',
      },
      message: `sent ${gift.name} ${gift.emoji} to ${recipient === 'creator1' ? content.user.displayName : content.battleData?.opponent?.displayName || 'Creator 2'}`,
      timestamp: new Date(),
      type: 'gift',
      giftInfo: {
        giftType: gift.id,
        value: gift.value,
        animation: gift.animation || 'sparkle',
        recipient,
      },
    };

    setChatMessages(prev => [...prev.slice(-15), giftMessage]);
    setShowGifts(false);

    toast({
      title: `${gift.name} sent! 🎁`,
      description: `+${gift.multiplier.toLocaleString()} battle points for ${recipient === 'creator1' ? 'Creator 1' : 'Creator 2'}`,
    });
  };

  const handleSendSupport = (recipient: 'creator1' | 'creator2') => {
    if (!user) return;

    const supportMessage: LiveChatMessage = {
      id: `support-${Date.now()}`,
      user: {
        id: user.id,
        username: user.username || 'user',
        displayName: user.name || 'User',
        avatar: user.avatar || '',
        verified: false,
        tier: 'bronze',
      },
      message: `is supporting ${recipient === 'creator1' ? content.user.displayName : content.battleData?.opponent?.displayName || 'Creator 2'}!`,
      timestamp: new Date(),
      type: 'support',
    };

    setChatMessages(prev => [...prev.slice(-15), supportMessage]);
    
    // Add support points
    setBattleScores(prev => ({
      ...prev,
      [recipient]: prev[recipient] + 1000,
    }));

    toast({
      title: "Support sent! 💪",
      description: `+1000 points for ${recipient === 'creator1' ? 'Creator 1' : 'Creator 2'}`,
    });
  };

  return (
    <div className={cn("relative h-screen w-full bg-black overflow-hidden", className)}>
      {/* Split Screen Videos */}
      <div className="absolute inset-0 flex">
        {/* Creator 1 - Left Side */}
        <div className="flex-1 relative">
          <video
            ref={creator1VideoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted={!isUserOwned}
            playsInline
            poster="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400"
          />

          {/* Camera placeholder for user-owned stream */}
          {isUserOwned && !streamRef.current && (
            <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center">
              <div className="text-center text-white p-6">
                <Video className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                <h3 className="text-lg font-semibold mb-2">Your Camera</h3>
                <p className="text-sm text-white/70 mb-4">Initializing camera for battle...</p>
                <Button
                  onClick={() => window.location.reload()}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Enable Camera
                </Button>
              </div>
            </div>
          )}

          {/* Creator 1 Score Overlay */}
          <div className="absolute top-20 left-4 right-4">
            <div className={cn(
              "bg-gradient-to-r p-3 rounded-lg",
              currentWinner === 'creator1' ? "from-yellow-500/90 to-orange-500/90" : "from-blue-500/70 to-purple-500/70"
            )}>
              <div className="text-center">
                <div className="text-white text-2xl font-bold">
                  {formatNumber(battleScores.creator1)}
                </div>
                <div className="text-white/90 text-sm font-medium">
                  {content.user.displayName}
                </div>
                {currentWinner === 'creator1' && (
                  <div className="flex items-center justify-center mt-1">
                    <Crown className="w-4 h-4 text-yellow-300 mr-1" />
                    <span className="text-yellow-300 text-xs font-bold">WINNING</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Creator 1 Profile */}
          <div className="absolute bottom-20 left-4">
            <div className="flex items-center gap-2 bg-black/50 rounded-lg p-2 backdrop-blur-sm">
              <Avatar className="w-8 h-8 border-2 border-blue-400">
                <AvatarImage src={content.user.avatar} />
                <AvatarFallback>{content.user.displayName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-white text-sm font-medium">@{content.user.username}</div>
                <div className="text-white/70 text-xs">{content.user.displayName}</div>
              </div>
            </div>
          </div>

          {/* Creator 1 Support Button */}
          <div className="absolute bottom-32 left-4">
            <Button
              onClick={() => handleSendSupport('creator1')}
              size="sm"
              className="bg-blue-500/80 hover:bg-blue-600/90 text-white backdrop-blur-sm"
            >
              💪 Support
            </Button>
          </div>
        </div>

        {/* Creator 2 - Right Side */}
        <div className="flex-1 relative">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            loop
            poster="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"
          />
          
          {/* Creator 2 Score Overlay */}
          <div className="absolute top-20 left-4 right-4">
            <div className={cn(
              "bg-gradient-to-r p-3 rounded-lg",
              currentWinner === 'creator2' ? "from-yellow-500/90 to-orange-500/90" : "from-red-500/70 to-pink-500/70"
            )}>
              <div className="text-center">
                <div className="text-white text-2xl font-bold">
                  {formatNumber(battleScores.creator2)}
                </div>
                <div className="text-white/90 text-sm font-medium">
                  {content.battleData?.opponent?.displayName || 'Creator 2'}
                </div>
                {currentWinner === 'creator2' && (
                  <div className="flex items-center justify-center mt-1">
                    <Crown className="w-4 h-4 text-yellow-300 mr-1" />
                    <span className="text-yellow-300 text-xs font-bold">WINNING</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Creator 2 Profile */}
          <div className="absolute bottom-20 right-4">
            <div className="flex items-center gap-2 bg-black/50 rounded-lg p-2 backdrop-blur-sm">
              <Avatar className="w-8 h-8 border-2 border-red-400">
                <AvatarImage src={content.battleData?.opponent?.avatar} />
                <AvatarFallback>{content.battleData?.opponent?.displayName?.[0] || 'C'}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-white text-sm font-medium">@{content.battleData?.opponent?.username || 'creator2'}</div>
                <div className="text-white/70 text-xs">{content.battleData?.opponent?.displayName || 'Creator 2'}</div>
              </div>
            </div>
          </div>

          {/* Creator 2 Support Button */}
          <div className="absolute bottom-32 right-4">
            <Button
              onClick={() => handleSendSupport('creator2')}
              size="sm"
              className="bg-red-500/80 hover:bg-red-600/90 text-white backdrop-blur-sm"
            >
              💪 Support
            </Button>
          </div>
        </div>
      </div>

      {/* Center VS Divider */}
      <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-transparent via-white to-transparent opacity-50" />
      
      {/* VS Indicator */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="bg-black/70 rounded-full w-16 h-16 flex items-center justify-center backdrop-blur-sm border-2 border-white/30">
          <span className="text-white font-bold text-lg">VS</span>
        </div>
      </div>

      {/* Top Status Bar */}
      <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between">
        {/* Left: Live indicator and viewer count */}
        <div className="flex items-center gap-2">
          <Badge className="bg-red-500 text-white font-semibold px-3 py-1 animate-pulse border-0">
            <Target className="w-3 h-3 mr-1" />
            LIVE BATTLE
          </Badge>
          <Badge className="bg-black/50 text-white border-0 backdrop-blur-sm">
            <Users className="w-3 h-3 mr-1" />
            {formatNumber(localViewerCount)}
          </Badge>
        </div>

        {/* Center: Battle timer */}
        <div className="bg-black/70 rounded-lg px-4 py-2 backdrop-blur-sm">
          <div className="text-white font-bold text-lg">
            Victory lap {formatTime(battleTime)}
          </div>
        </div>

        {/* Right: Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onEndStream}
          className="text-white hover:bg-white/20 rounded-full"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Daily Ranking Badge */}
      <div className="absolute top-20 left-4 z-30">
        <Badge className="bg-yellow-500/90 text-black font-semibold px-3 py-1.5 rounded-full border-0 shadow-lg">
          <Crown className="w-3 h-3 mr-1" />
          Daily Ranking
        </Badge>
      </div>

      {/* Featured Badge */}
      <div className="absolute top-20 right-4 z-30">
        <Badge className="bg-purple-500/90 text-white font-semibold px-3 py-1.5 rounded-full border-0 shadow-lg">
          <Star className="w-3 h-3 mr-1" />
          Featured
        </Badge>
      </div>

      {/* Battle Progress Bar */}
      <div className="absolute bottom-80 left-4 right-4 z-30">
        <div className="bg-black/70 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-300 text-sm font-medium">
              {formatNumber(battleScores.creator1)}
            </span>
            <span className="text-white text-xs">BATTLE SCORE</span>
            <span className="text-red-300 text-sm font-medium">
              {formatNumber(battleScores.creator2)}
            </span>
          </div>
          <Progress
            value={getBattleProgress()}
            className="h-2 bg-gray-600"
          />
          <div className="flex items-center justify-center mt-3">
            <Button
              onClick={() => setShowVoting(true)}
              size="sm"
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 rounded-full flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Vote Now
            </Button>
          </div>
        </div>
      </div>

      {/* Live Chat */}
      <div className="absolute bottom-32 left-4 right-20 z-30 space-y-1">
        {chatMessages.slice(-4).map((msg, index) => (
          <div
            key={msg.id}
            className="flex items-start gap-2 animate-in slide-in-from-bottom-2 duration-300"
            style={{
              animationDelay: `${index * 100}ms`,
              opacity: 0.9 + (index * 0.025)
            }}
          >
            <Avatar className="w-6 h-6 border border-white/30 flex-shrink-0">
              <AvatarImage src={msg.user.avatar} />
              <AvatarFallback className="text-xs">{msg.user.displayName[0]}</AvatarFallback>
            </Avatar>
            <div className="bg-black/60 rounded-xl px-3 py-1.5 backdrop-blur-sm max-w-xs border border-white/10">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-white text-xs font-semibold">{msg.user.username}</span>
                {msg.user.verified && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                )}
                {msg.type === 'gift' && (
                  <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-400">
                    Gift
                  </Badge>
                )}
                {msg.type === 'support' && (
                  <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                    Support
                  </Badge>
                )}
              </div>
              <p className="text-white text-xs leading-tight">{msg.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="p-3 sm:p-4 pt-6">
          <div className="flex items-center gap-2">
            {/* Chat Input */}
            <div className="flex-1 min-w-0">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type..."
                className="bg-white/15 border-white/20 text-white placeholder:text-white/60 rounded-full px-3 py-2 sm:px-4 sm:py-3 text-sm backdrop-blur-md"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && chatMessage.trim()) {
                    const newMessage: LiveChatMessage = {
                      id: `msg-${Date.now()}`,
                      user: {
                        id: user?.id || 'user',
                        username: user?.username || 'user',
                        displayName: user?.name || 'User',
                        avatar: user?.avatar || '',
                        verified: false,
                        tier: 'bronze',
                      },
                      message: chatMessage,
                      timestamp: new Date(),
                      type: 'message',
                    };
                    setChatMessages(prev => [...prev.slice(-15), newMessage]);
                    setChatMessage('');
                  }
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <Button
                onClick={() => setShowGifts(!showGifts)}
                variant="ghost"
                size="icon"
                className="text-pink-400 hover:bg-white/20 rounded-full w-10 h-10 backdrop-blur-sm"
              >
                <Gift className="w-5 h-5" />
              </Button>

              <Button
                onClick={() => setShowQuickReactions(!showQuickReactions)}
                variant="ghost"
                size="icon"
                className="text-yellow-400 hover:bg-white/20 rounded-full w-10 h-10 backdrop-blur-sm"
              >
                <Smile className="w-5 h-5" />
              </Button>

              <Button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `${content.user.displayName} vs ${content.battleData?.opponent?.displayName} - Live Battle`,
                      text: 'Check out this epic live battle!',
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    toast({
                      title: "Link Copied! 📋",
                      description: "Battle link copied to clipboard",
                    });
                  }
                }}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full w-10 h-10 backdrop-blur-sm"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom navigation area */}
        <div className="h-16 bg-black/50"></div>
      </div>

      {/* Enhanced Gift Selection Panel */}
      {showGifts && (
        <div className="absolute bottom-32 left-4 right-4 z-50">
          <EnhancedBattleGifts
            onSendGift={handleSendGift}
            selectedCreator={selectedCreator}
            onCreatorSelect={setSelectedCreator}
            creator1Name={content.user.displayName}
            creator2Name={content.battleData?.opponent?.displayName || 'Creator 2'}
            userBalance={25000} // Mock user balance
            onClose={() => setShowGifts(false)}
          />
        </div>
      )}

      {/* Stream Owner Controls */}
      {isUserOwned && showStreamControls && (
        <div className="absolute top-32 left-4 right-4 z-40 bg-black/80 rounded-lg p-4 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <Radio className="w-4 h-4" />
              Battle Controls
            </h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowStreamControls(false)}
              className="text-white hover:bg-white/20 rounded-full w-8 h-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Button
              onClick={() => {
                if (streamRef.current) {
                  const videoTrack = streamRef.current.getVideoTracks()[0];
                  if (videoTrack) {
                    videoTrack.enabled = !videoEnabled;
                    setVideoEnabled(!videoEnabled);
                  }
                }
              }}
              variant={videoEnabled ? "secondary" : "destructive"}
              size="sm"
              className="flex items-center gap-2"
            >
              {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              {videoEnabled ? "Camera On" : "Camera Off"}
            </Button>
            
            <Button
              onClick={() => {
                if (streamRef.current) {
                  const audioTrack = streamRef.current.getAudioTracks()[0];
                  if (audioTrack) {
                    audioTrack.enabled = !audioEnabled;
                    setAudioEnabled(!audioEnabled);
                  }
                }
              }}
              variant={audioEnabled ? "secondary" : "destructive"}
              size="sm"
              className="flex items-center gap-2"
            >
              {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              {audioEnabled ? "Mic On" : "Mic Off"}
            </Button>
          </div>

          <Button
            onClick={() => {
              if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
              }
              toast({
                title: "Battle Ended",
                description: "Your battle stream has been ended",
              });
              onEndStream?.();
            }}
            variant="destructive"
            size="sm"
            className="w-full flex items-center gap-2"
          >
            <Square className="w-4 h-4" />
            End Battle
          </Button>
        </div>
      )}

      {/* Quick Controls Button for Owner */}
      {isUserOwned && (
        <div className="absolute top-32 right-4 z-30">
          <Button
            onClick={() => setShowStreamControls(!showStreamControls)}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-3 rounded-full"
          >
            <Settings className="w-4 h-4 mr-1" />
            Controls
          </Button>
        </div>
      )}
    </div>
  );
};

export default TikTokBattleLayout;
