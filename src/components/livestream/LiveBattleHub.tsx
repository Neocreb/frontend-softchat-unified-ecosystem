import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Users,
  Gift,
  X,
  Send,
  Smile,
  Play,
  Pause,
  UserPlus,
  Crown,
  Radio,
  Target,
  Clock,
  Eye,
  Coins,
  DollarSign,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Settings,
  Square,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Sparkles,
  Flame,
  Zap,
  Trophy,
  Star,
  TrendingUp,
  Coffee,
  Diamond,
  Plus,
  Minimize,
  Maximize,
  Flag,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent } from '../ui/card';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { cn } from '../../lib/utils';
import { LiveStreamData } from '../../hooks/use-live-content';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface LiveParticipant {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  verified: boolean;
  role: 'host' | 'co-host' | 'guest';
  isHost?: boolean;
  micEnabled: boolean;
  videoEnabled: boolean;
  currentScore?: number;
}

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
  type: 'message' | 'gift' | 'join' | 'follow' | 'system' | 'reaction' | 'vote';
  giftInfo?: {
    giftType: string;
    value: number;
    animation: string;
  };
}

interface GiftType {
  id: string;
  name: string;
  emoji: string;
  value: number;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface VotingPool {
  creator1Total: number;
  creator2Total: number;
  totalPool: number;
  totalVoters: number;
}

interface LiveBattleHubProps {
  content: LiveStreamData;
  isActive: boolean;
  isUserOwned?: boolean;
  onEndStream?: () => void;
  className?: string;
}

const giftTypes: GiftType[] = [
  { id: 'heart', name: 'Heart', emoji: '❤️', value: 1, color: 'text-red-400', rarity: 'common' },
  { id: 'like', name: 'Like', emoji: '👍', value: 2, color: 'text-blue-400', rarity: 'common' },
  { id: 'star', name: 'Star', emoji: '⭐', value: 5, color: 'text-yellow-400', rarity: 'common' },
  { id: 'fire', name: 'Fire', emoji: '🔥', value: 10, color: 'text-orange-400', rarity: 'rare' },
  { id: 'diamond', name: 'Diamond', emoji: '💎', value: 25, color: 'text-blue-400', rarity: 'rare' },
  { id: 'crown', name: 'Crown', emoji: '👑', value: 50, color: 'text-yellow-400', rarity: 'epic' },
  { id: 'rocket', name: 'Rocket', emoji: '🚀', value: 100, color: 'text-purple-400', rarity: 'epic' },
  { id: 'rainbow', name: 'Rainbow', emoji: '🌈', value: 250, color: 'text-rainbow', rarity: 'legendary' },
];

const quickReactions = ['❤️', '🔥', '👏', '😍', '💎', '🚀', '👑', '⭐'];

const mockParticipants: LiveParticipant[] = [
  {
    id: '1',
    username: 'host_user',
    displayName: 'Live Host',
    avatar: 'https://i.pravatar.cc/150?img=1',
    verified: true,
    role: 'host',
    isHost: true,
    micEnabled: true,
    videoEnabled: true,
    currentScore: 1250,
  },
  {
    id: '2',
    username: 'cohost_user',
    displayName: 'Co-Host',
    avatar: 'https://i.pravatar.cc/150?img=2',
    verified: false,
    role: 'co-host',
    micEnabled: true,
    videoEnabled: true,
    currentScore: 890,
  },
];

export const LiveBattleHub: React.FC<LiveBattleHubProps> = ({
  content,
  isActive,
  isUserOwned = false,
  onEndStream,
  className,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Stream state
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(isActive);
  const [localViewerCount, setLocalViewerCount] = useState(content.viewerCount || 127);
  const [localLikes, setLocalLikes] = useState(Math.floor((content.viewerCount || 127) * 0.8));
  const [streamDuration, setStreamDuration] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  // Mode and participants
  const [streamMode, setStreamMode] = useState<'livestream' | 'battle'>(content.type === 'battle' ? 'battle' : 'livestream');
  const [participants, setParticipants] = useState<LiveParticipant[]>(mockParticipants);
  const [maxParticipants] = useState(6);

  // Chat and interactions
  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [showChatOverlay, setShowChatOverlay] = useState(false);
  const [showGifts, setShowGifts] = useState(false);
  const [showInviteGuest, setShowInviteGuest] = useState(false);
  const [showQuickReactions, setShowQuickReactions] = useState(false);

  // Battle state
  const [battleTimeLeft, setBattleTimeLeft] = useState(content?.battleData?.timeRemaining || 300);
  const [battlePhase, setBattlePhase] = useState<'active' | 'voting_closed' | 'ending' | 'ended'>('active');
  const [showVoting, setShowVoting] = useState(false);
  const [userBalance] = useState(2500);
  const [userVotes, setUserVotes] = useState<any[]>([]);
  const [votingPool, setVotingPool] = useState<VotingPool>({
    creator1Total: 450,
    creator2Total: 780,
    totalPool: 1230,
    totalVoters: 23,
  });

  // Stream controls for owner
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Reactions and animations
  const [reactions, setReactions] = useState<any[]>([]);
  const [comboCount, setComboCount] = useState(0);
  const [showCombo, setShowCombo] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Calculate stream duration
  useEffect(() => {
    if (content.startedAt && content.startedAt instanceof Date) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - content.startedAt.getTime()) / 1000);
        setStreamDuration(elapsed);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [content.startedAt]);

  // Battle countdown timer
  useEffect(() => {
    if (streamMode === 'battle' && battleTimeLeft > 0) {
      const timer = setInterval(() => {
        setBattleTimeLeft((prev) => {
          if (prev <= 1) {
            setBattlePhase('ending');
            setTimeout(() => setBattlePhase('ended'), 3000);
            return 0;
          }
          
          // Close voting 30 seconds before end
          if (prev === 30) {
            setBattlePhase('voting_closed');
            toast({
              title: "Voting Closed! ⏰",
              description: "30 seconds left in battle",
            });
          }
          
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [streamMode, battleTimeLeft, toast]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Simulate real-time interactions
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      // Random viewer count changes
      setLocalViewerCount(prev => prev + Math.floor(Math.random() * 6 - 2));
      
      // Random likes
      if (Math.random() < 0.3) {
        setLocalLikes(prev => prev + Math.floor(Math.random() * 3) + 1);
      }

      // Random chat messages
      if (Math.random() < 0.4) {
        const mockMessages = [
          "Amazing stream! 🔥",
          "Love this content!",
          "Keep it up! 💪",
          "This is so cool!",
          "Great job! ⭐",
          "Following now! 🚀",
        ];

        const newMessage: LiveChatMessage = {
          id: `msg-${Date.now()}`,
          user: {
            id: `user-${Date.now()}`,
            username: `viewer${Math.floor(Math.random() * 1000)}`,
            displayName: `Viewer ${Math.floor(Math.random() * 1000)}`,
            avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 10)}`,
            verified: Math.random() > 0.8,
            tier: ['bronze', 'silver', 'gold', 'platinum', 'diamond'][Math.floor(Math.random() * 5)] as any,
          },
          message: mockMessages[Math.floor(Math.random() * mockMessages.length)],
          timestamp: new Date(),
          type: 'message',
        };

        setChatMessages(prev => [...prev.slice(-50), newMessage]);
      }
    }, 3000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, [isActive]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const hours = Math.floor(mins / 60);
    
    if (hours > 0) {
      return `${hours}:${(mins % 60).toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const handleSendChat = () => {
    if (!chatMessage.trim() || !user) return;

    const newMessage: LiveChatMessage = {
      id: `msg-${Date.now()}`,
      user: {
        id: user.id,
        username: user.username || 'user',
        displayName: user.name || 'User',
        avatar: user.avatar || '',
        verified: false,
        tier: 'bronze',
      },
      message: chatMessage,
      timestamp: new Date(),
      type: 'message',
    };

    setChatMessages(prev => [...prev.slice(-50), newMessage]);
    setChatMessage('');
  };

  const handleSendGift = (gift: GiftType, recipientId?: string) => {
    if (!user) return;

    // Add animation
    addReaction(gift.emoji);

    // For battles, add to participant score
    if (streamMode === 'battle' && recipientId) {
      setParticipants(prev => prev.map(p => 
        p.id === recipientId 
          ? { ...p, currentScore: (p.currentScore || 0) + gift.value }
          : p
      ));
    }

    // Add to chat
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
      message: `Sent ${gift.name} ${gift.emoji}`,
      timestamp: new Date(),
      type: 'gift',
      giftInfo: {
        giftType: gift.id,
        value: gift.value,
        animation: 'sparkle',
      },
    };

    setChatMessages(prev => [...prev.slice(-50), giftMessage]);
    setShowGifts(false);

    // Combo system
    setComboCount(prev => prev + 1);
    setShowCombo(true);
    setTimeout(() => setShowCombo(false), 2000);

    toast({
      title: `${gift.emoji} ${gift.name} sent!`,
      description: `${gift.value} SP sent to ${recipientId ? 'participant' : 'stream'}`,
    });
  };

  const addReaction = useCallback((emoji: string) => {
    const reaction = {
      id: `reaction-${Date.now()}`,
      emoji,
      x: Math.random() * 100,
      y: Math.random() * 100,
      timestamp: Date.now(),
    };
    
    setReactions(prev => [...prev, reaction]);
    
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== reaction.id));
    }, 3000);
  }, []);

  const handleQuickReaction = (emoji: string) => {
    addReaction(emoji);
    setShowQuickReactions(false);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      setLocalLikes(prev => prev + 1);
      addReaction('❤️');
    }
  };

  const handleInviteGuest = () => {
    if (participants.length >= maxParticipants) {
      toast({
        title: "Maximum Guests Reached",
        description: `You can have up to ${maxParticipants} total participants`,
        variant: "destructive",
      });
      return;
    }

    const newGuest: LiveParticipant = {
      id: `guest-${Date.now()}`,
      username: `guest${Math.floor(Math.random() * 1000)}`,
      displayName: `Guest ${Math.floor(Math.random() * 1000)}`,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 10)}`,
      verified: false,
      role: 'guest',
      micEnabled: true,
      videoEnabled: true,
    };

    setParticipants(prev => [...prev, newGuest]);
    setShowInviteGuest(false);

    toast({
      title: "Guest Invited! 👥",
      description: `${newGuest.displayName} joined the stream`,
    });
  };

  const initiateBattle = () => {
    if (participants.length < 2) {
      toast({
        title: "Need More Participants",
        description: "You need at least 2 participants to start a battle",
        variant: "destructive",
      });
      return;
    }

    setStreamMode('battle');
    setBattleTimeLeft(180); // 3 minutes
    setBattlePhase('active');

    // Initialize scores for participants
    setParticipants(prev => prev.map(p => ({ ...p, currentScore: 0 })));

    toast({
      title: "Battle Started! ⚔️",
      description: "3-minute battle has begun!",
    });
  };

  const renderLivestreamMode = () => (
    <>
      {/* Main video container with participants */}
      <div className="absolute inset-0">
        {/* Primary host video (fullscreen) */}
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted={isMuted}
            playsInline
            poster={`https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800`}
            onClick={togglePlayPause}
          />
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Button
                size="icon"
                variant="ghost"
                className="w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 border-none backdrop-blur-sm"
                onClick={togglePlayPause}
              >
                <Play className="w-10 h-10 text-white fill-white ml-1" />
              </Button>
            </div>
          )}
        </div>

        {/* Co-hosts grid overlay */}
        {participants.length > 1 && (
          <div className="absolute top-4 right-4 grid grid-cols-2 gap-2 max-w-xs">
            {participants.slice(1, 6).map((participant, index) => (
              <div
                key={participant.id}
                className="relative w-20 h-28 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20"
              >
                <Avatar className="w-full h-full rounded-lg">
                  <AvatarImage src={participant.avatar} className="object-cover" />
                  <AvatarFallback className="text-xs">{participant.displayName[0]}</AvatarFallback>
                </Avatar>
                
                {/* Participant info overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1">
                  <div className="text-white text-xs truncate">{participant.displayName}</div>
                  <div className="flex items-center gap-1">
                    {!participant.micEnabled && <MicOff className="w-2 h-2 text-red-400" />}
                    {!participant.videoEnabled && <VideoOff className="w-2 h-2 text-red-400" />}
                    {participant.role === 'host' && <Crown className="w-2 h-2 text-yellow-400" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Host info */}
      <div className="absolute bottom-4 left-4 max-w-xs">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="w-10 h-10 border-2 border-white">
              <AvatarImage src={participants[0]?.avatar} />
              <AvatarFallback>{participants[0]?.displayName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <span className="text-white font-semibold text-sm">@{participants[0]?.username}</span>
                {participants[0]?.verified && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                )}
                <Badge className="bg-orange-500 text-white text-xs px-1 py-0">
                  🔥 Trending
                </Badge>
              </div>
              <div className="text-white/80 text-xs">
                {participants[0]?.displayName} • {formatNumber(localViewerCount)} watching
              </div>
            </div>
          </div>
          
          {/* Quick actions for livestream */}
          <div className="flex gap-2">
            {isUserOwned && participants.length < maxParticipants && (
              <Button
                size="sm"
                onClick={() => setShowInviteGuest(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <UserPlus className="w-3 h-3 mr-1" />
                Invite
              </Button>
            )}
            {isUserOwned && participants.length >= 2 && (
              <Button
                size="sm"
                onClick={initiateBattle}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Target className="w-3 h-3 mr-1" />
                Battle
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const renderBattleMode = () => (
    <>
      {/* Battle grid layout */}
      <div className="absolute inset-0">
        <div className={cn(
          "grid h-full gap-1",
          participants.length <= 2 ? "grid-cols-2" : 
          participants.length <= 4 ? "grid-cols-2 grid-rows-2" :
          "grid-cols-3 grid-rows-2"
        )}>
          {participants.slice(0, 6).map((participant, index) => (
            <div
              key={participant.id}
              className="relative bg-gray-800 overflow-hidden"
            >
              {/* Participant video */}
              <Avatar className="w-full h-full rounded-none">
                <AvatarImage src={participant.avatar} className="object-cover" />
                <AvatarFallback className="text-2xl">{participant.displayName[0]}</AvatarFallback>
              </Avatar>

              {/* Participant overlay info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
              
              {/* Top info */}
              <div className="absolute top-2 left-2 right-2">
                <div className="flex items-center justify-between">
                  <div className="bg-black/70 rounded-lg px-2 py-1">
                    <div className="flex items-center gap-1">
                      <span className="text-white font-medium text-sm">{participant.displayName}</span>
                      {participant.verified && <div className="w-3 h-3 bg-blue-500 rounded-full" />}
                      {participant.isHost && <Crown className="w-3 h-3 text-yellow-400" />}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {!participant.micEnabled && <MicOff className="w-4 h-4 text-red-400" />}
                    {!participant.videoEnabled && <VideoOff className="w-4 h-4 text-red-400" />}
                  </div>
                </div>
              </div>

              {/* Score display */}
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-black/70 rounded-lg p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm font-medium">
                      {participant.currentScore || 0} SP
                    </span>
                    {!isUserOwned && (
                      <Button
                        size="sm"
                        onClick={() => setShowGifts(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-2 py-1 h-auto"
                      >
                        <Gift className="w-3 h-3 mr-1" />
                        Gift
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Battle timer and stats */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-center">
          <div className="text-white font-bold text-xl mb-1">
            {formatTime(battleTimeLeft)}
          </div>
          {battlePhase === 'voting_closed' && (
            <div className="text-yellow-400 text-sm animate-pulse">
              Voting Closed!
            </div>
          )}
          {battlePhase === 'ending' && (
            <div className="text-red-400 text-sm animate-pulse">
              Battle Ending!
            </div>
          )}
          
          {/* Voting stats */}
          {votingPool.totalPool > 0 && (
            <div className="mt-2 text-xs text-gray-300">
              Pool: {votingPool.totalPool} SP • {votingPool.totalVoters} voters
            </div>
          )}
        </div>
      </div>

      {/* Vote button */}
      {battlePhase === 'active' && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <Button
            onClick={() => setShowVoting(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Vote
          </Button>
        </div>
      )}
    </>
  );

  return (
    <div className={cn("relative h-screen w-full bg-black overflow-hidden snap-start snap-always", className)}>
      {/* Dynamic badge */}
      <div className="absolute top-4 left-4 z-40">
        <Badge
          className={cn(
            "text-white font-semibold px-3 py-1 animate-pulse border-0",
            streamMode === 'battle' ? "bg-red-600" : "bg-red-500"
          )}
        >
          {streamMode === 'battle' ? (
            <>
              <Target className="w-3 h-3 mr-1" />
              ⚔️ BATTLE
            </>
          ) : (
            <>
              <Radio className="w-3 h-3 mr-1" />
              🔴 LIVE
            </>
          )}
        </Badge>
      </div>

      {/* Top right info */}
      <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
        <div className="bg-black/50 rounded-full px-3 py-1 backdrop-blur-sm">
          <div className="flex items-center text-white text-sm">
            <Users className="w-4 h-4 mr-1" />
            <span>{formatNumber(localViewerCount)}</span>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
            <DropdownMenuItem className="text-white">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white">
              <Flag className="w-4 h-4 mr-2" />
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 rounded-full"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Stream/Battle content */}
      {streamMode === 'livestream' ? renderLivestreamMode() : renderBattleMode()}

      {/* Floating reactions */}
      {reactions.map((reaction) => (
        <div
          key={reaction.id}
          className="absolute pointer-events-none z-50"
          style={{
            left: `${reaction.x}%`,
            top: `${reaction.y}%`,
            animation: 'float-up 3s ease-out forwards',
          }}
        >
          <span className="text-3xl">{reaction.emoji}</span>
        </div>
      ))}

      {/* Combo display */}
      {showCombo && comboCount > 1 && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-yellow-400 text-black px-6 py-3 rounded-full font-bold text-xl animate-bounce">
            🔥 COMBO x{comboCount}!
          </div>
        </div>
      )}

      {/* Chat toggle button (mobile) */}
      <div className="absolute bottom-24 right-4 z-40 md:hidden">
        <Button
          onClick={() => setShowChatOverlay(!showChatOverlay)}
          size="icon"
          className="rounded-full bg-gray-900/90 hover:bg-gray-800 text-white border border-gray-600"
        >
          <MessageCircle className="w-5 h-5" />
        </Button>
      </div>

      {/* Right sidebar - Chat and actions */}
      <div className={cn(
        "absolute right-4 top-20 bottom-4 w-80 z-30 flex flex-col gap-3",
        "hidden md:flex"
      )}>
        {/* Live chat */}
        {showChat && (
          <Card className="flex-1 bg-black/70 border-gray-600 backdrop-blur-sm min-h-0">
            <CardContent className="p-0 h-full flex flex-col">
              <div className="p-3 border-b border-gray-600">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Live Chat
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowChat(false)}
                    className="text-white/60 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-3">
                <div className="space-y-2">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-2">
                      <Avatar className="w-6 h-6 border">
                        <AvatarImage src={msg.user.avatar} />
                        <AvatarFallback className="text-xs">
                          {msg.user.displayName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-xs text-blue-400">
                            {msg.user.username}
                          </span>
                          {msg.user.verified && (
                            <div className="w-3 h-3 bg-blue-500 rounded-full" />
                          )}
                          {msg.type === 'gift' && (
                            <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-400">
                              Gift
                            </Badge>
                          )}
                        </div>
                        <p className="text-white text-xs break-words">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>
              
              {!isUserOwned && (
                <div className="p-3 border-t border-gray-600">
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Say something..."
                      className="flex-1 bg-gray-800 border-gray-600 text-white text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
                    />
                    <Button 
                      onClick={handleSendChat}
                      size="sm"
                      disabled={!chatMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowQuickReactions(!showQuickReactions)}
                      className="text-white/60 hover:text-white px-2 py-1 h-auto"
                    >
                      <Smile className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowGifts(true)}
                      className="text-yellow-400 hover:text-yellow-300 px-2 py-1 h-auto"
                    >
                      <Gift className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleLike}
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white flex flex-col items-center"
          >
            <Heart className={cn("w-6 h-6", isLiked && "fill-red-500 text-red-500")} />
            <span className="text-xs mt-1">{formatNumber(localLikes)}</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white flex flex-col items-center"
          >
            <Share2 className="w-6 h-6" />
            <span className="text-xs mt-1">Share</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowGifts(true)}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white flex flex-col items-center"
          >
            <Gift className="w-6 h-6" />
            <span className="text-xs mt-1">Gift</span>
          </Button>

          <Button
            onClick={() => setIsMuted(!isMuted)}
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white"
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Stream controls for owner */}
      {isUserOwned && (
        <div className="absolute bottom-4 left-4 z-40 flex gap-2">
          <Button
            onClick={() => setVideoEnabled(!videoEnabled)}
            size="icon"
            className={cn(
              "rounded-full",
              !videoEnabled && "bg-red-500 hover:bg-red-600"
            )}
          >
            {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </Button>
          
          <Button
            onClick={() => setAudioEnabled(!audioEnabled)}
            size="icon"
            className={cn(
              "rounded-full",
              !audioEnabled && "bg-red-500 hover:bg-red-600"
            )}
          >
            {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </Button>
          
          <Button
            onClick={() => setShowSettings(!showSettings)}
            size="icon"
            className="rounded-full"
          >
            <Settings className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={onEndStream}
            size="icon"
            className="rounded-full bg-red-600 hover:bg-red-700"
          >
            <Square className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Mobile chat overlay */}
      {showChatOverlay && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm z-50 border-t border-gray-600 md:hidden">
          <div className="p-4 max-h-[60vh] flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Live Chat
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowChatOverlay(false)}
                className="text-white hover:bg-white/10"
              >
                <ChevronDown className="w-5 h-5" />
              </Button>
            </div>

            <ScrollArea className="flex-1 mb-3 min-h-[120px] max-h-[200px]">
              <div className="space-y-2">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-2 text-sm">
                    <Avatar className="w-6 h-6 flex-shrink-0">
                      <AvatarImage src={msg.user.avatar} />
                      <AvatarFallback className="text-xs">{msg.user.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <span className="text-blue-400 font-medium">{msg.user.username}: </span>
                      <span className="text-white break-words">{msg.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Send a message..."
                className="flex-1 bg-gray-800 border-gray-600 text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
              />
              <Button size="sm" onClick={handleSendChat}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quick reactions popup */}
      {showQuickReactions && (
        <div className="absolute right-4 bottom-96 z-50 bg-black/80 rounded-lg p-2 backdrop-blur-sm">
          <div className="grid grid-cols-4 gap-1">
            {quickReactions.map((emoji, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => handleQuickReaction(emoji)}
                className="text-2xl hover:scale-125 transition-transform p-1"
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Gift selection modal */}
      {showGifts && (
        <Dialog open={showGifts} onOpenChange={setShowGifts}>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md z-[110]">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Send Gift</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-4 gap-3">
              {giftTypes.map((gift) => (
                <Button
                  key={gift.id}
                  variant="outline"
                  onClick={() => handleSendGift(gift)}
                  className="aspect-square p-2 flex flex-col items-center gap-1 border-gray-600 hover:bg-gray-700"
                >
                  <span className="text-2xl">{gift.emoji}</span>
                  <span className="text-xs text-center">
                    <div className="font-medium">{gift.name}</div>
                    <div className={gift.color}>{gift.value} SP</div>
                  </span>
                </Button>
              ))}
            </div>

            {/* For battles, show participant selection */}
            {streamMode === 'battle' && (
              <div className="mt-4">
                <div className="text-white text-sm mb-2">Send to participant:</div>
                <div className="grid grid-cols-2 gap-2">
                  {participants.slice(0, 2).map((participant) => (
                    <Button
                      key={participant.id}
                      variant="outline"
                      className="border-gray-600 text-white hover:bg-gray-700"
                      onClick={() => handleSendGift(giftTypes[0], participant.id)}
                    >
                      {participant.displayName}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Invite guest modal */}
      {showInviteGuest && (
        <Dialog open={showInviteGuest} onOpenChange={setShowInviteGuest}>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md z-[110]">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Invite Guest</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="text-gray-300 text-sm">
                Current participants: {participants.length}/{maxParticipants}
              </div>
              
              <div className="space-y-2">
                <Input 
                  placeholder="Search users to invite..."
                  className="bg-gray-800 border-gray-600 text-white"
                />
                
                <div className="space-y-2">
                  {/* Mock suggested users */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 5}`} />
                          <AvatarFallback>U{i}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-white text-sm">User {i}</div>
                          <div className="text-gray-400 text-xs">@user{i}</div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={handleInviteGuest}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Invite
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Floating animations CSS */}
      <style jsx>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) scale(1.5);
          }
        }
      `}</style>
    </div>
  );
};

export default LiveBattleHub;
