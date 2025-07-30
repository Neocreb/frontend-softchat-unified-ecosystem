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
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="flex items-center gap-4">
          <Badge className="bg-red-500 text-white animate-pulse">
            <Target className="w-3 h-3 mr-1" />
            LIVE BATTLE
          </Badge>
          <div className="flex items-center gap-2 text-white">
            <Clock className="w-4 h-4" />
            <span className="font-bold text-lg">{formatTime(timeRemaining)}</span>
          </div>
          <div className="text-white text-sm">
            Round {currentRound}/{totalRounds}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white">
            <Users className="w-4 h-4" />
            <span>{viewerCount.toLocaleString()} watching</span>
          </div>
          <Button onClick={onExit} variant="ghost" size="sm" className="text-white">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Battle Score Display */}
      <div className="bg-gray-900 p-4 border-b border-gray-800">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {/* Player 1 */}
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-blue-500">
              <AvatarImage src={creator1.avatar} />
              <AvatarFallback>{creator1.displayName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">{creator1.displayName}</span>
                {creator1.verified && <CheckCircle className="w-4 h-4 text-blue-500" />}
                <span className={getTierColor(creator1.tier)}>
                  {getTierIcon(creator1.tier)}
                </span>
              </div>
              <div className="text-blue-400 font-bold text-2xl">{scores.player1}</div>
            </div>
          </div>

          {/* VS */}
          <div className="text-center">
            <div className="text-white text-3xl font-bold">VS</div>
            <Progress value={(scores.player1 / (scores.player1 + scores.player2)) * 100} className="w-32 mt-2" />
          </div>

          {/* Player 2 */}
          <div className="flex items-center gap-3 flex-row-reverse">
            <Avatar className="w-12 h-12 border-2 border-red-500">
              <AvatarImage src={creator2.avatar} />
              <AvatarFallback>{creator2.displayName[0]}</AvatarFallback>
            </Avatar>
            <div className="text-right">
              <div className="flex items-center gap-2 flex-row-reverse">
                <span className="text-white font-bold">{creator2.displayName}</span>
                {creator2.verified && <CheckCircle className="w-4 h-4 text-blue-500" />}
                <span className={getTierColor(creator2.tier)}>
                  {getTierIcon(creator2.tier)}
                </span>
              </div>
              <div className="text-red-400 font-bold text-2xl">{scores.player2}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Battle Area - Split Screen */}
      <div className="flex-1 flex">
        {/* Player 1 Stream */}
        <div className="flex-1 relative bg-gray-900 border-r border-gray-800">
          <video
            ref={player1VideoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted={isMuted}
            poster="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"
          />
          
          {/* Player 1 Controls Overlay */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <Button
              size="sm"
              variant={isCamera1On ? "default" : "destructive"}
              onClick={() => setIsCamera1On(!isCamera1On)}
            >
              {isCamera1On ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant={isMic1On ? "default" : "destructive"}
              onClick={() => setIsMic1On(!isMic1On)}
            >
              {isMic1On ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>
          </div>

          {/* Player 1 Name Overlay */}
          <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full">
            <span className="font-bold">{creator1.displayName}</span>
          </div>

          {/* Vote for Player 1 */}
          <div className="absolute top-4 right-4">
            <Button
              onClick={() => handleVote('player1')}
              disabled={hasVoted}
              className={cn(
                "bg-blue-600 hover:bg-blue-700",
                userVote === 'player1' && "bg-blue-800 ring-2 ring-blue-400"
              )}
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Vote ({voteCount.player1})
            </Button>
          </div>
        </div>

        {/* Player 2 Stream */}
        <div className="flex-1 relative bg-gray-900">
          <video
            ref={player2VideoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted={isMuted}
            poster="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800"
          />
          
          {/* Player 2 Controls Overlay */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button
              size="sm"
              variant={isCamera2On ? "default" : "destructive"}
              onClick={() => setIsCamera2On(!isCamera2On)}
            >
              {isCamera2On ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant={isMic2On ? "default" : "destructive"}
              onClick={() => setIsMic2On(!isMic2On)}
            >
              {isMic2On ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>
          </div>

          {/* Player 2 Name Overlay */}
          <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full">
            <span className="font-bold">{creator2.displayName}</span>
          </div>

          {/* Vote for Player 2 */}
          <div className="absolute top-4 left-4">
            <Button
              onClick={() => handleVote('player2')}
              disabled={hasVoted}
              className={cn(
                "bg-red-600 hover:bg-red-700",
                userVote === 'player2' && "bg-red-800 ring-2 ring-red-400"
              )}
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Vote ({voteCount.player2})
            </Button>
          </div>
        </div>

        {/* Chat & Voting Panel */}
        <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col">
          {/* Gift Sending Section */}
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-white font-bold mb-3">Send Gifts</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                onClick={() => handleSendGift('player1', 50)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Gift className="w-4 h-4 mr-1" />
                50
              </Button>
              <Button
                size="sm"
                onClick={() => handleSendGift('player2', 50)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Gift className="w-4 h-4 mr-1" />
                50
              </Button>
              <Button
                size="sm"
                onClick={() => handleSendGift('player1', 100)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Crown className="w-4 h-4 mr-1" />
                100
              </Button>
              <Button
                size="sm"
                onClick={() => handleSendGift('player2', 100)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Crown className="w-4 h-4 mr-1" />
                100
              </Button>
            </div>
          </div>

          {/* Chat Section */}
          <div className="flex-1 flex flex-col">
            <div className="p-3 border-b border-gray-800">
              <h3 className="text-white font-bold">Battle Chat</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {comments.map((comment) => (
                <div key={comment.id} className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={comment.user.avatar} />
                      <AvatarFallback>{comment.user.username[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-blue-400 font-medium">{comment.user.username}</span>
                    {comment.user.verified && <CheckCircle className="w-3 h-3 text-blue-500" />}
                  </div>
                  <p className="text-white ml-8">{comment.text}</p>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-gray-800">
              <div className="flex gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Type a message..."
                  className="bg-gray-800 border-gray-700 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
                />
                <Button onClick={handleSendComment} size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
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
