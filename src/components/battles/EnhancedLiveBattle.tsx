import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Crown,
  Gift,
  Users,
  Clock,
  X,
  Volume2,
  VolumeX,
  Maximize,
  MessageCircle,
  Heart,
  Flame,
  Trophy,
  Zap,
  Target,
  Star,
  Settings,
  Camera,
  Mic,
  MicOff,
  Share2,
  DollarSign,
  TrendingUp,
  Lock,
  CheckCircle,
  XCircle,
  Coins,
  ChevronUp,
  ChevronDown,
  Send,
  ArrowLeft,
  Sword,
  Shield,
  Sparkles,
  Rocket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import BattleVoting from '@/components/voting/BattleVoting';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Creator {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  verified: boolean;
  tier: 'rising_star' | 'pro_creator' | 'legend';
  score: number;
}

interface AnimalGift {
  id: string;
  name: string;
  icon: string;
  value: number;
  rarity: 'common' | 'rare' | 'epic' | 'mythic';
  color: string;
  effect: string;
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
  type?: 'message' | 'gift' | 'vote' | 'reaction';
}

interface Vote {
  id: string;
  amount: number;
  creatorId: string;
  odds: number;
  potentialWinning: number;
  timestamp: Date;
  status: 'active' | 'won' | 'lost' | 'refunded';
}

interface BattleResults {
  winnerId: string;
  totalPool: number;
  winningCreatorBonus: number;
  platformFee: number;
  userWinnings: number;
  userVoteOutcome: 'won' | 'lost' | 'none';
}

interface EnhancedLiveBattleProps {
  battleId: string;
  creator1: Creator;
  creator2: Creator;
  battleType?: 'dance' | 'rap' | 'comedy' | 'general';
  timeRemaining?: number;
  duration?: number;
  isUserOwned?: boolean;
  creator1VideoRef?: React.RefObject<HTMLVideoElement>;
  creator2VideoRef?: React.RefObject<HTMLVideoElement>;
  onBattleEnd?: (winnerId: string) => void;
  onEndBattle?: () => void;
  onExit?: () => void;
}

// Enhanced animal gifts with TikTok-style effects
const animalGifts: AnimalGift[] = [
  { id: '1', name: 'Lion', icon: '🦁', value: 10, rarity: 'common', color: 'text-yellow-500', effect: 'roar' },
  { id: '2', name: 'Dragon', icon: '🐉', value: 50, rarity: 'rare', color: 'text-red-500', effect: 'fire' },
  { id: '3', name: 'Tiger', icon: '🐅', value: 25, rarity: 'common', color: 'text-orange-500', effect: 'prowl' },
  { id: '4', name: 'Eagle', icon: '🦅', value: 75, rarity: 'epic', color: 'text-blue-500', effect: 'soar' },
  { id: '5', name: 'Panda', icon: '🐼', value: 100, rarity: 'rare', color: 'text-green-500', effect: 'bamboo' },
  { id: '6', name: 'Unicorn', icon: '🦄', value: 500, rarity: 'mythic', color: 'text-purple-500', effect: 'magic' },
];

// Quick emoji reactions
const quickEmojis = ['❤️', '🔥', '👏', '😍', '💯', '🎉'];

const EnhancedLiveBattle: React.FC<EnhancedLiveBattleProps> = ({
  battleId,
  creator1,
  creator2,
  battleType = 'general',
  timeRemaining,
  duration,
  isUserOwned = false,
  creator1VideoRef,
  creator2VideoRef,
  onBattleEnd,
  onEndBattle,
  onExit,
}) => {
  const [timeLeft, setTimeLeft] = useState(timeRemaining || duration || 300);
  const [viewers, setViewers] = useState(1247);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<Creator | null>(null);
  const [showGifts, setShowGifts] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [scores, setScores] = useState({
    creator1: creator1.score,
    creator2: creator2.score,
  });
  const [giftAnimations, setGiftAnimations] = useState<any[]>([]);
  const [reactionAnimations, setReactionAnimations] = useState<any[]>([]);
  const [battlePhase, setBattlePhase] = useState<'active' | 'ending' | 'ended'>('active');
  const [showChat, setShowChat] = useState(false);

  // Voting state
  const [showVoting, setShowVoting] = useState(false);
  const [userBalance] = useState(2500);
  const [userVotes, setUserVotes] = useState<Vote[]>([]);
  const [votingPool, setVotingPool] = useState({
    creator1Total: 450,
    creator2Total: 780,
    totalPool: 1230,
    totalVoters: 23,
  });
  const [battleResults, setBattleResults] = useState<BattleResults | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  const commentsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Mobile detection
  const [isMobile] = useState(window.innerWidth < 768);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setBattlePhase('ending');
          setTimeout(() => {
            setBattlePhase('ended');
            const winnerId = scores.creator1 > scores.creator2 ? creator1.id : creator2.id;
            // Calculate and show results
            handleBattleEnd(winnerId);
          }, 3000);
          return 0;
        }

        // Battle ending warning and voting lock
        if (prev === 30) {
          toast({
            title: "30 seconds left! ⏰",
            description: "Voting is now locked!",
          });
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [scores, creator1.id, creator2.id, toast]);

  // Simulate live updates
  useEffect(() => {
    const updateInterval = setInterval(() => {
      // Random viewer count changes
      setViewers(prev => prev + Math.floor(Math.random() * 10 - 3));
      
      // Random score updates
      if (Math.random() > 0.7) {
        const isCreator1 = Math.random() > 0.5;
        const points = Math.floor(Math.random() * 25) + 5;
        
        setScores(prev => ({
          ...prev,
          [isCreator1 ? 'creator1' : 'creator2']: prev[isCreator1 ? 'creator1' : 'creator2'] + points
        }));
      }
      
      // Random comments
      if (Math.random() > 0.8) {
        const mockComments = [
          "This battle is insane! 🔥",
          "Go team blue! 💙",
          "Amazing skills! 🚀",
          "Team red! ❤️",
          "Epic moves! 💯",
          "Can't stop watching! 👀",
        ];
        
        const newComment: Comment = {
          id: Date.now().toString(),
          user: {
            username: `user${Math.floor(Math.random() * 1000)}`,
            avatar: `https://i.pravatar.cc/32?u=${Math.random()}`,
            verified: Math.random() > 0.8,
          },
          message: mockComments[Math.floor(Math.random() * mockComments.length)],
          timestamp: new Date(),
        };
        
        setComments(prev => [...prev.slice(-30), newComment]);
      }
    }, 2000);

    return () => clearInterval(updateInterval);
  }, []);

  // Auto-scroll comments
  useEffect(() => {
    if (commentsRef.current) {
      commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
    }
  }, [comments]);

  const handleBattleEnd = (winnerId: string) => {
    const totalPool = votingPool.totalPool;
    const platformFee = totalPool * 0.1;
    const winningCreatorBonus = totalPool * 0.2;
    const winnersPool = totalPool * 0.7;

    const userWinningVotes = userVotes.filter(vote => vote.creatorId === winnerId);
    const totalWinningVotes = winnerId === creator1.id ? votingPool.creator1Total : votingPool.creator2Total;
    const userWinnings = totalWinningVotes > 0
      ? userWinningVotes.reduce((sum, vote) => sum + vote.amount, 0) * (winnersPool / totalWinningVotes)
      : 0;

    const userVoteOutcome = userVotes.length === 0 ? 'none' :
      userWinningVotes.length > 0 ? 'won' : 'lost';

    setBattleResults({
      winnerId,
      totalPool,
      winningCreatorBonus,
      platformFee,
      userWinnings,
      userVoteOutcome,
    });

    setTimeout(() => {
      setShowResults(true);
    }, 1000);

    setTimeout(() => {
      onBattleEnd(winnerId);
    }, 5000);
  };

  const sendGift = (gift: AnimalGift, recipientId: string) => {
    const points = gift.value;
    setScores(prev => ({
      ...prev,
      [recipientId === creator1.id ? 'creator1' : 'creator2']: 
        prev[recipientId === creator1.id ? 'creator1' : 'creator2'] + points
    }));

    // Create gift animation
    const animation = {
      id: Date.now().toString(),
      gift,
      recipient: recipientId,
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
    };
    
    setGiftAnimations(prev => [...prev, animation]);

    // Screen shake for mythic gifts
    if (gift.rarity === 'mythic') {
      document.body.style.animation = 'shake 0.5s';
      setTimeout(() => {
        document.body.style.animation = '';
      }, 500);
    }

    // Remove animation after duration
    setTimeout(() => {
      setGiftAnimations(prev => prev.filter(a => a.id !== animation.id));
    }, 3000);

    toast({
      title: `${gift.icon} ${gift.name} sent!`,
      description: `+${points} SP to ${recipientId === creator1.id ? creator1.displayName : creator2.displayName}`,
    });

    setShowGifts(false);
    setSelectedRecipient(null);
  };

  const sendReaction = (emoji: string) => {
    const animation = {
      id: Date.now().toString(),
      emoji,
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
    };
    
    setReactionAnimations(prev => [...prev, animation]);
    
    setTimeout(() => {
      setReactionAnimations(prev => prev.filter(a => a.id !== animation.id));
    }, 2000);

    setShowReactions(false);

    toast({
      title: `Reaction sent! ${emoji}`,
      description: "Your reaction was added to the battle",
    });
  };

  const sendComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: {
        username: 'you',
        avatar: 'https://i.pravatar.cc/32?u=you',
      },
      message: newComment,
      timestamp: new Date(),
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlaceVote = (vote: Omit<Vote, 'id' | 'timestamp' | 'status'>) => {
    if (userVotes.length > 0) {
      toast({
        title: "Vote Already Placed! 🚫",
        description: "You can only vote once per battle",
        variant: "destructive",
      });
      return;
    }

    const newVote: Vote = {
      ...vote,
      id: Date.now().toString(),
      timestamp: new Date(),
      status: 'active',
    };

    setUserVotes(prev => [...prev, newVote]);
    setVotingPool(prev => ({
      ...prev,
      creator1Total: vote.creatorId === creator1.id ? prev.creator1Total + vote.amount : prev.creator1Total,
      creator2Total: vote.creatorId === creator2.id ? prev.creator2Total + vote.amount : prev.creator2Total,
      totalPool: prev.totalPool + vote.amount,
      totalVoters: prev.totalVoters + 1,
    }));

    toast({
      title: "Vote Placed! 🎯",
      description: `${vote.amount} SP on ${vote.creatorId === creator1.id ? creator1.displayName : creator2.displayName}`,
    });
  };

  const getLeadingCreator = () => {
    return scores.creator1 > scores.creator2 ? creator1 : creator2;
  };

  const getScorePercentage = (creatorScore: number) => {
    const total = scores.creator1 + scores.creator2;
    return total > 0 ? (creatorScore / total) * 100 : 50;
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden snap-start snap-always">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-3 md:p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size={isMobile ? "sm" : "icon"} onClick={onExit} className="text-white">
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
          
          <Badge className="bg-red-500 text-white animate-pulse text-xs md:text-sm">
            <Flame className="w-2 h-2 md:w-3 md:h-3 mr-1" />
            LIVE BATTLE
          </Badge>
          
          <div className="flex items-center gap-1 md:gap-2 text-white">
            <Users className="w-3 h-3 md:w-4 md:h-4" />
            <span className="font-medium text-sm md:text-base">{viewers.toLocaleString()}</span>
          </div>
        </div>

        <div className="text-center">
          <div className="text-lg md:text-2xl font-bold text-white">
            {formatTime(timeLeft)}
          </div>
          {battlePhase === 'ending' && (
            <div className="text-yellow-400 text-xs md:text-sm animate-pulse">
              Battle Ending!
            </div>
          )}
          {timeLeft > 30 && (
            <div className="text-xs text-gray-300 mt-1 hidden md:block">
              Voting closes in {Math.max(0, timeLeft - 30)}s
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          {timeLeft > 30 && (
            <Button
              onClick={() => setShowVoting(true)}
              size={isMobile ? "sm" : "default"}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-2 md:px-4"
            >
              <DollarSign className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              {isMobile ? "Vote" : "Place Vote"}
            </Button>
          )}

          <Button variant="ghost" size={isMobile ? "sm" : "icon"} onClick={() => setIsMuted(!isMuted)} className="text-white">
            {isMuted ? <VolumeX className="w-4 h-4 md:w-5 md:h-5" /> : <Volume2 className="w-4 h-4 md:w-5 md:h-5" />}
          </Button>
        </div>
      </div>

      {/* Battle Area - Split Screen */}
      <div className="flex h-full pt-16 md:pt-20">
        {/* Creator 1 Side */}
        <div className="relative flex-1 bg-gradient-to-br from-red-600/20 to-red-800/20">
          {/* Real video feed for Creator 1 if available */}
          {creator1VideoRef ? (
            <video
              ref={creator1VideoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
          ) : (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <div className="text-center text-white">
                <Avatar className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4">
                  <AvatarImage src={creator1.avatar} />
                  <AvatarFallback>{creator1.displayName[0]}</AvatarFallback>
                </Avatar>
                <div className="text-sm opacity-50">
                  {isUserOwned ? 'Your camera feed' : 'Camera feed'}
                </div>
              </div>
            </div>
          )}

          {/* Creator 1 Info */}
          <div className="absolute top-4 left-4">
            <div className="bg-black/50 rounded-lg p-2 md:p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="w-6 h-6 md:w-8 md:h-8">
                  <AvatarImage src={creator1.avatar} />
                  <AvatarFallback>{creator1.displayName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-white font-medium text-xs md:text-sm">{creator1.displayName}</div>
                  <div className="text-red-400 text-xs">@{creator1.username}</div>
                </div>
                {creator1.verified && <Crown className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />}
              </div>
              
              <div className="flex items-center gap-1 text-red-400 text-sm">
                <Trophy className="w-3 h-3" />
                <span className="font-bold">{scores.creator1}</span>
                <span className="text-xs">SP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Creator 2 Side */}
        <div className="relative flex-1 bg-gradient-to-br from-blue-600/20 to-blue-800/20">
          {/* Real video feed for Creator 2 if available */}
          {creator2VideoRef ? (
            <video
              ref={creator2VideoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
          ) : (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <div className="text-center text-white">
                <Avatar className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4">
                  <AvatarImage src={creator2.avatar} />
                  <AvatarFallback>{creator2.displayName[0]}</AvatarFallback>
                </Avatar>
                <div className="text-sm opacity-50">Opponent camera feed</div>
              </div>
            </div>
          )}

          {/* Creator 2 Info */}
          <div className="absolute top-4 right-4">
            <div className="bg-black/50 rounded-lg p-2 md:p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-right">
                  <div className="text-white font-medium text-xs md:text-sm">{creator2.displayName}</div>
                  <div className="text-blue-400 text-xs">@{creator2.username}</div>
                </div>
                <Avatar className="w-6 h-6 md:w-8 md:h-8">
                  <AvatarImage src={creator2.avatar} />
                  <AvatarFallback>{creator2.displayName[0]}</AvatarFallback>
                </Avatar>
                {creator2.verified && <Crown className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />}
              </div>
              
              <div className="flex items-center justify-end gap-1 text-blue-400 text-sm">
                <span className="font-bold">{scores.creator2}</span>
                <span className="text-xs">SP</span>
                <Trophy className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center Divider & Score Progress */}
      <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-gradient-to-b from-red-500 to-blue-500" />
      
      {/* Enhanced Score Progress Bar - Mobile Optimized */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 md:w-80">
        <div className="bg-black/50 rounded-full p-1 md:p-2 backdrop-blur-sm">
          <div className="relative h-4 md:h-6 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-red-500 transition-all duration-1000"
              style={{ width: `${getScorePercentage(scores.creator1)}%` }}
            />
            <div 
              className="absolute right-0 top-0 h-full bg-blue-500 transition-all duration-1000"
              style={{ width: `${getScorePercentage(scores.creator2)}%` }}
            />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-yellow-400 text-black px-1 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-bold">
                {getLeadingCreator().displayName} LEADS
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gift Animations */}
      {giftAnimations.map((animation) => (
        <div
          key={animation.id}
          className="absolute pointer-events-none z-30"
          style={{
            left: `${animation.x}%`,
            top: `${animation.y}%`,
            animation: `giftFloat 3s ease-out forwards`,
          }}
        >
          <div className={cn(
            "text-4xl md:text-6xl",
            animation.gift.rarity === 'mythic' && "animate-pulse"
          )}>
            {animation.gift.icon}
          </div>
          {animation.gift.rarity === 'mythic' && (
            <div className="absolute inset-0 animate-ping">
              <Sparkles className="w-8 h-8 text-purple-400" />
            </div>
          )}
        </div>
      ))}

      {/* Reaction Animations */}
      {reactionAnimations.map((animation) => (
        <div
          key={animation.id}
          className="absolute pointer-events-none z-30 text-3xl md:text-4xl"
          style={{
            left: `${animation.x}%`,
            top: `${animation.y}%`,
            animation: `reactionFloat 2s ease-out forwards`,
          }}
        >
          {animation.emoji}
        </div>
      ))}

      {/* Mobile-Optimized Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black via-black/90 to-transparent">
        {/* Chat Messages (Mobile) */}
        {showChat && isMobile && (
          <div className="bg-black/90 max-h-40 overflow-y-auto p-3 border-t border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold text-sm">Live Chat</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChat(false)}
                className="text-white p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div ref={commentsRef} className="space-y-1 mb-2 max-h-20 overflow-y-auto">
              {comments.slice(-5).map((comment) => (
                <div key={comment.id} className="flex items-start gap-1 text-xs">
                  <span className="text-yellow-400 font-medium">{comment.user.username}:</span>
                  <span className="text-white break-words">{comment.message}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Say something..."
                className="bg-gray-800 border-gray-600 text-white text-sm h-8"
                onKeyPress={(e) => e.key === 'Enter' && sendComment()}
              />
              <Button size="sm" onClick={sendComment} className="h-8 px-2">
                <Send className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Gift Selection UI - Enhanced for Mobile */}
        {showGifts && (
          <div className="bg-black/95 p-3 md:p-4 border-t border-gray-700">
            {!selectedRecipient ? (
              <div>
                <h3 className="text-white font-semibold mb-3 text-center">Choose recipient for your gift</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => setSelectedRecipient(creator1)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 p-3 h-auto"
                  >
                    <Crown className="w-4 h-4" />
                    <div className="text-left">
                      <div className="font-medium">{creator1.displayName}</div>
                      <div className="text-xs opacity-75">Team Red</div>
                    </div>
                  </Button>
                  <Button
                    onClick={() => setSelectedRecipient(creator2)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 p-3 h-auto"
                  >
                    <Sword className="w-4 h-4" />
                    <div className="text-left">
                      <div className="font-medium">{creator2.displayName}</div>
                      <div className="text-xs opacity-75">Team Blue</div>
                    </div>
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">Send gift to {selectedRecipient.displayName}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRecipient(null)}
                    className="text-white p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {animalGifts.map((gift) => (
                    <Button
                      key={gift.id}
                      onClick={() => sendGift(gift, selectedRecipient.id)}
                      className={cn(
                        "flex flex-col items-center gap-1 p-2 h-auto border transition-all",
                        gift.rarity === 'mythic' && "animate-pulse shadow-lg shadow-purple-500/50",
                        gift.rarity === 'epic' && "shadow-lg shadow-blue-500/30",
                        gift.rarity === 'rare' && "shadow-lg shadow-yellow-500/30"
                      )}
                      variant="outline"
                    >
                      <div className="text-2xl md:text-3xl">{gift.icon}</div>
                      <div className="text-center">
                        <div className="text-xs font-medium">{gift.name}</div>
                        <div className={cn("text-xs", gift.color)}>{gift.value} SP</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Reactions Panel */}
        {showReactions && (
          <div className="bg-black/90 p-3 border-t border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold text-sm">Quick Reactions</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReactions(false)}
                className="text-white p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {quickEmojis.map((emoji, index) => (
                <Button
                  key={index}
                  onClick={() => sendReaction(emoji)}
                  className="text-2xl hover:scale-125 transition-transform p-1 h-auto bg-white/10 hover:bg-white/20"
                  variant="ghost"
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Action Bar - Mobile Optimized */}
        <div className="flex items-center justify-between p-2 md:p-3">
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              onClick={() => setShowChat(!showChat)}
              variant="ghost"
              size={isMobile ? "sm" : "icon"}
              className="text-white bg-white/10 hover:bg-white/20 rounded-full"
            >
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
            <Button
              onClick={() => setShowReactions(!showReactions)}
              variant="ghost"
              size={isMobile ? "sm" : "icon"}
              className="text-white bg-white/10 hover:bg-white/20 rounded-full"
            >
              <Heart className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </div>

          <Button
            onClick={() => setShowGifts(!showGifts)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 md:px-6"
          >
            <Gift className="w-4 h-4 mr-1 md:mr-2" />
            Send Gift
          </Button>

          <div className="flex items-center gap-1 md:gap-2">
            <Button
              onClick={() => {
                navigator.share?.({
                  title: "Epic Battle!",
                  text: `${creator1.displayName} vs ${creator2.displayName}`,
                  url: window.location.href,
                });
              }}
              variant="ghost"
              size={isMobile ? "sm" : "icon"}
              className="text-white bg-white/10 hover:bg-white/20 rounded-full"
            >
              <Share2 className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Chat Sidebar */}
      {!isMobile && (
        <div className="fixed right-4 top-24 bottom-20 w-72 z-30">
          <Card className="h-full bg-black/70 border-gray-600 backdrop-blur-sm">
            <CardContent className="p-0 h-full flex flex-col">
              <div className="p-3 border-b border-gray-600">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Live Chat
                </h3>
              </div>
              
              <div ref={commentsRef} className="flex-1 p-3 overflow-y-auto">
                <div className="space-y-2">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-2">
                      <img
                        src={comment.user.avatar}
                        alt={comment.user.username}
                        className="w-6 h-6 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400 font-medium text-xs">
                            {comment.user.username}
                          </span>
                          {comment.user.verified && (
                            <CheckCircle className="w-3 h-3 text-blue-500" />
                          )}
                        </div>
                        <p className="text-white text-xs break-words">{comment.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-3 border-t border-gray-600">
                <div className="flex gap-2">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Say something..."
                    className="flex-1 bg-gray-800 border-gray-600 text-white text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && sendComment()}
                  />
                  <Button size="sm" onClick={sendComment}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Battle Voting Modal */}
      {showVoting && (
        <Dialog open={showVoting} onOpenChange={setShowVoting}>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-lg md:max-w-2xl z-[110] mx-4">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Battle Voting</DialogTitle>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto">
              <BattleVoting
                battleId={battleId}
                creator1={{
                  ...creator1,
                  currentScore: scores.creator1,
                  winRate: 75,
                  totalVotes: 145,
                  isLeading: scores.creator1 > scores.creator2,
                }}
                creator2={{
                  ...creator2,
                  currentScore: scores.creator2,
                  winRate: 68,
                  totalVotes: 89,
                  isLeading: scores.creator2 > scores.creator1,
                }}
                isLive={timeLeft > 0}
                timeRemaining={timeLeft}
                userBalance={userBalance}
                onPlaceVote={handlePlaceVote}
                userVotes={userVotes}
                votingPool={votingPool}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes giftFloat {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-120px) scale(1.5);
          }
        }
        
        @keyframes reactionFloat {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-80px) scale(1.2);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default EnhancedLiveBattle;
