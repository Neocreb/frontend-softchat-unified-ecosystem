import React, { useState, useEffect, useRef } from 'react';
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
  ThumbsUp,
  ThumbsDown,
  Send,
  RotateCcw,
  VideoOff,
  Video,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Creator {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  verified: boolean;
  tier: 'rising_star' | 'pro_creator' | 'legend';
  score: number;
}

interface BattleComment {
  id: string;
  user: {
    username: string;
    avatar: string;
    verified: boolean;
  };
  text: string;
  timestamp: Date;
  votes?: {
    player1: number;
    player2: number;
  };
}

interface EnhancedLiveBattleProps {
  battleId: string;
  creator1: Creator;
  creator2: Creator;
  duration: number;
  onBattleEnd: (winnerId: string) => void;
  onExit: () => void;
}

const EnhancedLiveBattle: React.FC<EnhancedLiveBattleProps> = ({
  battleId,
  creator1,
  creator2,
  duration,
  onBattleEnd,
  onExit,
}) => {
  const { toast } = useToast();
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds] = useState(3);
  const [isLive, setIsLive] = useState(true);
  const [viewerCount, setViewerCount] = useState(1247);
  const [scores, setScores] = useState({
    player1: creator1.score,
    player2: creator2.score,
  });
  
  // Real-time battle state
  const [player1Stream, setPlayer1Stream] = useState<MediaStream | null>(null);
  const [player2Stream, setPlayer2Stream] = useState<MediaStream | null>(null);
  const [isCamera1On, setIsCamera1On] = useState(true);
  const [isCamera2On, setIsCamera2On] = useState(true);
  const [isMic1On, setIsMic1On] = useState(true);
  const [isMic2On, setIsMic2On] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  
  // Voting system
  const [userVote, setUserVote] = useState<'player1' | 'player2' | null>(null);
  const [voteCount, setVoteCount] = useState({
    player1: 523,
    player2: 456,
  });
  const [hasVoted, setHasVoted] = useState(false);
  
  // Chat system
  const [comments, setComments] = useState<BattleComment[]>([
    {
      id: '1',
      user: { username: 'battlefan123', avatar: 'https://i.pravatar.cc/150?img=1', verified: false },
      text: 'This is intense! 🔥',
      timestamp: new Date(),
    },
    {
      id: '2', 
      user: { username: 'dancequeen', avatar: 'https://i.pravatar.cc/150?img=2', verified: true },
      text: 'Player 1 got some moves! 💃',
      timestamp: new Date(),
    },
  ]);
  const [newComment, setNewComment] = useState('');
  
  // Refs for video streams
  const player1VideoRef = useRef<HTMLVideoElement>(null);
  const player2VideoRef = useRef<HTMLVideoElement>(null);

  // Battle timer
  useEffect(() => {
    if (!isLive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (currentRound < totalRounds) {
            setCurrentRound(prev => prev + 1);
            return 60; // Reset to 60 seconds for next round
          } else {
            setIsLive(false);
            // Determine winner based on scores
            const winner = scores.player1 > scores.player2 ? creator1.id : creator2.id;
            onBattleEnd(winner);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLive, timeRemaining, currentRound, totalRounds, scores, creator1.id, creator2.id, onBattleEnd]);

  // Initialize video streams (mock implementation)
  useEffect(() => {
    const initializeStreams = async () => {
      try {
        // This would typically connect to actual camera streams
        // For demo purposes, we'll simulate the streams
        console.log('Initializing battle streams...');
      } catch (error) {
        console.error('Failed to initialize streams:', error);
      }
    };

    initializeStreams();
  }, []);

  const handleVote = (player: 'player1' | 'player2') => {
    if (hasVoted) return;
    
    setUserVote(player);
    setHasVoted(true);
    setVoteCount(prev => ({
      ...prev,
      [player]: prev[player] + 1,
    }));

    // Update scores based on vote
    setScores(prev => ({
      ...prev,
      [player]: prev[player] + 10,
    }));

    toast({
      title: "Vote Cast! 🗳️",
      description: `You voted for ${player === 'player1' ? creator1.displayName : creator2.displayName}`,
    });
  };

  const handleSendGift = (player: 'player1' | 'player2', giftValue: number) => {
    setScores(prev => ({
      ...prev,
      [player]: prev[player] + giftValue,
    }));

    toast({
      title: "Gift Sent! 🎁",
      description: `Sent ${giftValue} coins to ${player === 'player1' ? creator1.displayName : creator2.displayName}`,
    });
  };

  const handleSendComment = () => {
    if (!newComment.trim()) return;

    const comment: BattleComment = {
      id: Date.now().toString(),
      user: {
        username: 'you',
        avatar: 'https://i.pravatar.cc/150?u=current-user',
        verified: false,
      },
      text: newComment,
      timestamp: new Date(),
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'legend': return 'text-yellow-400';
      case 'pro_creator': return 'text-purple-400';
      case 'rising_star': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'legend': return <Crown className="w-4 h-4" />;
      case 'pro_creator': return <Star className="w-4 h-4" />;
      case 'rising_star': return <Zap className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Clean Top Header */}
      <div className="relative bg-gradient-to-r from-red-600 to-orange-600 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Battle indicator and timer */}
          <div className="flex items-center gap-3">
            <Badge className="bg-red-500 text-white animate-pulse px-3 py-1">
              <Target className="w-3 h-3 mr-1" />
              LIVE BATTLE
            </Badge>
            <div className="bg-black/30 rounded-full px-3 py-1">
              <span className="text-white font-bold text-lg">{formatTime(timeRemaining)}</span>
            </div>
            <div className="text-white text-sm opacity-90">
              Round {currentRound}/{totalRounds}
            </div>
          </div>

          {/* Right: Viewers and close */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-white">
              <Users className="w-4 h-4" />
              <span className="font-medium">{viewerCount.toLocaleString()}</span>
              <span className="text-sm opacity-90">watching</span>
            </div>
            <Button onClick={onExit} variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Player Scores - Positioned at top corners */}
        <div className="absolute top-12 left-0 right-0 flex justify-between px-4">
          {/* Player 1 Score */}
          <div className="bg-blue-600/90 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
            <Avatar className="w-8 h-8 border-2 border-white/50">
              <AvatarImage src={creator1.avatar} />
              <AvatarFallback>{creator1.displayName[0]}</AvatarFallback>
            </Avatar>
            <div className="text-white">
              <div className="font-bold text-lg">{scores.player1}</div>
              <div className="text-xs opacity-90">{creator1.displayName}</div>
            </div>
          </div>

          {/* Player 2 Score */}
          <div className="bg-red-600/90 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2 flex-row-reverse">
            <Avatar className="w-8 h-8 border-2 border-white/50">
              <AvatarImage src={creator2.avatar} />
              <AvatarFallback>{creator2.displayName[0]}</AvatarFallback>
            </Avatar>
            <div className="text-white text-right">
              <div className="font-bold text-lg">{scores.player2}</div>
              <div className="text-xs opacity-90">{creator2.displayName}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Battle Area - Clean Split Screen */}
      <div className="flex-1 flex relative">
        {/* Player 1 Stream */}
        <div className="flex-1 relative bg-gray-900">
          <video
            ref={player1VideoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted={isMuted}
            poster="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"
          />

          {/* Player 1 Name Badge */}
          <div className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full">
            <span className="font-medium text-sm">{creator1.displayName}</span>
          </div>

          {/* Player 1 Controls (bottom left) */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <Button
              size="sm"
              variant={isCamera1On ? "default" : "destructive"}
              onClick={() => setIsCamera1On(!isCamera1On)}
              className="bg-black/50 backdrop-blur-sm border-none"
            >
              {isCamera1On ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant={isMic1On ? "default" : "destructive"}
              onClick={() => setIsMic1On(!isMic1On)}
              className="bg-black/50 backdrop-blur-sm border-none"
            >
              {isMic1On ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Center Divider with VS */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-black/80 backdrop-blur-sm rounded-full p-3 border-2 border-white/20">
            <span className="text-white font-bold text-lg">VS</span>
          </div>
        </div>

        {/* Player 2 Stream */}
        <div className="flex-1 relative bg-gray-900 border-l border-gray-700">
          <video
            ref={player2VideoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted={isMuted}
            poster="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800"
          />

          {/* Player 2 Name Badge */}
          <div className="absolute top-4 right-4 bg-red-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full">
            <span className="font-medium text-sm">{creator2.displayName}</span>
          </div>

          {/* Player 2 Controls (bottom right) */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button
              size="sm"
              variant={isCamera2On ? "default" : "destructive"}
              onClick={() => setIsCamera2On(!isCamera2On)}
              className="bg-black/50 backdrop-blur-sm border-none"
            >
              {isCamera2On ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant={isMic2On ? "default" : "destructive"}
              onClick={() => setIsMic2On(!isMic2On)}
              className="bg-black/50 backdrop-blur-sm border-none"
            >
              {isMic2On ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Right Side Panel - TikTok Live Style */}
        <div className="w-16 sm:w-20 md:w-24 flex flex-col items-center justify-end gap-4 p-4 pb-20">
          {/* Vote for Player 1 */}
          <div className="flex flex-col items-center gap-2">
            <Button
              onClick={() => handleVote('player1')}
              disabled={hasVoted}
              size="lg"
              className={cn(
                "w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-600/90 hover:bg-blue-700 backdrop-blur-sm border-2",
                userVote === 'player1' ? "border-blue-400 bg-blue-800" : "border-white/20"
              )}
            >
              <ThumbsUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
            <span className="text-white text-xs font-medium">{voteCount.player1}</span>
            <span className="text-blue-400 text-xs">{creator1.displayName}</span>
          </div>

          {/* Vote for Player 2 */}
          <div className="flex flex-col items-center gap-2">
            <Button
              onClick={() => handleVote('player2')}
              disabled={hasVoted}
              size="lg"
              className={cn(
                "w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-600/90 hover:bg-red-700 backdrop-blur-sm border-2",
                userVote === 'player2' ? "border-red-400 bg-red-800" : "border-white/20"
              )}
            >
              <ThumbsUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
            <span className="text-white text-xs font-medium">{voteCount.player2}</span>
            <span className="text-red-400 text-xs">{creator2.displayName}</span>
          </div>

          {/* Gift Player 1 */}
          <div className="flex flex-col items-center gap-1">
            <Button
              onClick={() => handleSendGift('player1', 50)}
              size="lg"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-600/80 hover:bg-blue-700 backdrop-blur-sm border border-white/20"
            >
              <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
            <span className="text-white text-[10px]">Gift</span>
          </div>

          {/* Gift Player 2 */}
          <div className="flex flex-col items-center gap-1">
            <Button
              onClick={() => handleSendGift('player2', 50)}
              size="lg"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-600/80 hover:bg-red-700 backdrop-blur-sm border border-white/20"
            >
              <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
            <span className="text-white text-[10px]">Gift</span>
          </div>

          {/* Share Battle */}
          <div className="flex flex-col items-center gap-1">
            <Button
              size="lg"
              variant="ghost"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 text-white"
            >
              <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
            <span className="text-white text-[10px]">Share</span>
          </div>

          {/* More Options */}
          <div className="flex flex-col items-center gap-1">
            <Button
              size="lg"
              variant="ghost"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 text-white"
            >
              <MoreHorizontal className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
            <span className="text-white text-[10px]">More</span>
          </div>
        </div>
      </div>

      {/* Bottom Chat Section */}
      <div className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Recent Comments */}
          <div className="mb-3 max-h-20 overflow-y-auto space-y-1">
            {comments.slice(0, 3).map((comment) => (
              <div key={comment.id} className="flex items-center gap-2 text-sm">
                <span className="text-blue-400 font-medium">{comment.user.username}</span>
                <span className="text-white">{comment.text}</span>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="flex gap-3 items-center">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-800/70 border-gray-700 text-white placeholder-gray-400 rounded-full px-4"
              onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
            />
            <Button
              onClick={handleSendComment}
              size="sm"
              className="rounded-full bg-blue-600 hover:bg-blue-700 px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Global Controls */}
      <div className="bg-gray-900 border-t border-gray-800 p-4">
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={() => setIsMuted(!isMuted)}
            variant="ghost"
            size="sm"
            className="text-white"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          
          <Button variant="ghost" size="sm" className="text-white">
            <Share2 className="w-4 h-4 mr-2" />
            Share Battle
          </Button>
          
          <Button variant="ghost" size="sm" className="text-white">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLiveBattle;
