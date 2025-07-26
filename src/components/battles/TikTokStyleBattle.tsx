import React, { useState, useEffect, useRef } from 'react';
import {
  Crown,
  Gift,
  Users,
  X,
  Volume2,
  VolumeX,
  Share2,
  MessageCircle,
  Heart,
  Flame,
  Trophy,
  Star,
  Camera,
  Mic,
  MicOff,
  DollarSign,
  CheckCircle,
  Timer,
  Coins,
  Zap,
  Send,
  MoreHorizontal,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Creator {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  verified: boolean;
  followers: number;
  isLive: boolean;
}

interface Gift {
  id: string;
  name: string;
  icon: string;
  value: number;
  color: string;
}

interface Comment {
  id: string;
  user: {
    username: string;
    avatar: string;
  };
  message: string;
  timestamp: Date;
}

interface TikTokStyleBattleProps {
  battleId: string;
  creator1: Creator;
  creator2: Creator;
  duration: number;
  onExit: () => void;
}

const gifts: Gift[] = [
  { id: '1', name: 'Rose', icon: '🌹', value: 1, color: 'text-pink-400' },
  { id: '2', name: 'Heart', icon: '❤️', value: 5, color: 'text-red-400' },
  { id: '3', name: 'Diamond', icon: '💎', value: 10, color: 'text-blue-400' },
  { id: '4', name: 'Crown', icon: '👑', value: 25, color: 'text-yellow-400' },
  { id: '5', name: 'Rocket', icon: '🚀', value: 50, color: 'text-purple-400' },
  { id: '6', name: 'Fireworks', icon: '🎆', value: 100, color: 'text-rainbow' },
];

const TikTokStyleBattle: React.FC<TikTokStyleBattleProps> = ({
  battleId,
  creator1,
  creator2,
  duration,
  onExit,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [viewers, setViewers] = useState(502 + 239);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: { username: 'Trusted_Boy001', avatar: 'https://i.pravatar.cc/32?u=1' },
      message: 'bring me up',
      timestamp: new Date(),
    },
    {
      id: '2', 
      user: { username: 'Miahzinspire', avatar: 'https://i.pravatar.cc/32?u=2' },
      message: 'joined',
      timestamp: new Date(),
    },
    {
      id: '3',
      user: { username: 'ADUKE529💖💖', avatar: 'https://i.pravatar.cc/32?u=3' },
      message: 'joined',
      timestamp: new Date(),
    },
  ]);
  const [newComment, setNewComment] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [showGifts, setShowGifts] = useState(false);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [hasUserVoted, setHasUserVoted] = useState(false);
  const [userVotedCreatorId, setUserVotedCreatorId] = useState<string>();
  const [votingClosed, setVotingClosed] = useState(false);
  
  // Battle scores based on TikTok screenshot
  const [scores, setScores] = useState({
    creator1: 502,
    creator2: 239,
  });

  const commentsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 0;
        
        // Close voting after 3 minutes (180 seconds)
        if (prev === 180) {
          setVotingClosed(true);
          toast({
            title: "Voting Closed! 🔒",
            description: "Voting window has ended",
          });
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [toast]);

  // Auto-scroll comments
  useEffect(() => {
    if (commentsRef.current) {
      commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
    }
  }, [comments]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

    setComments(prev => [...prev.slice(-20), comment]);
    setNewComment('');
  };

  const handleVote = (creatorId: string) => {
    if (hasUserVoted) {
      toast({
        title: "Already Voted! ❌",
        description: "You can only vote once per battle",
        variant: "destructive",
      });
      return;
    }

    if (votingClosed) {
      toast({
        title: "Voting Closed! 🔒", 
        description: "Voting window has ended",
        variant: "destructive",
      });
      return;
    }

    setHasUserVoted(true);
    setUserVotedCreatorId(creatorId);
    
    // Update scores
    setScores(prev => ({
      ...prev,
      [creatorId === creator1.id ? 'creator1' : 'creator2']: 
        prev[creatorId === creator1.id ? 'creator1' : 'creator2'] + 1
    }));

    toast({
      title: "Vote Placed! 🎯",
      description: `Voted for ${creatorId === creator1.id ? creator1.displayName : creator2.displayName}`,
    });
  };

  const sendGift = (gift: Gift, recipientId: string) => {
    setScores(prev => ({
      ...prev,
      [recipientId === creator1.id ? 'creator1' : 'creator2']: 
        prev[recipientId === creator1.id ? 'creator1' : 'creator2'] + gift.value
    }));

    toast({
      title: `${gift.icon} ${gift.name} sent!`,
      description: `+${gift.value} to ${recipientId === creator1.id ? creator1.displayName : creator2.displayName}`,
    });

    setShowGifts(false);
    setSelectedGift(null);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Status Bar */}
      <div className="flex items-center justify-between p-3 text-white text-sm bg-black/50">
        <div className="flex items-center gap-1">
          <span>{formatTime(timeLeft)}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <span>LTE</span>
          </div>
          <div className="bg-white/20 rounded px-1 text-xs">24</div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent absolute top-6 left-0 right-0 z-10">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={creator1.avatar} />
            <AvatarFallback>{creator1.displayName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-white font-medium text-sm">{creator1.displayName}</div>
            <div className="text-white/70 text-xs flex items-center gap-1">
              <Heart className="w-3 h-3 fill-current" />
              {creator1.followers.toLocaleString()}
            </div>
          </div>
          <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white px-4 rounded-full">
            + Follow
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-white">
            <Users className="w-4 h-4" />
            <span className="text-sm">{viewers}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onExit}>
            <X className="w-5 h-5 text-white" />
          </Button>
        </div>
      </div>

      {/* Top Categories */}
      <div className="absolute top-20 left-4 right-4 z-10 flex items-center gap-2">
        <Badge className="bg-yellow-500/90 text-black px-3 py-1 rounded-full">
          🔥 Daily Ranking
        </Badge>
        <div className="flex-1"></div>
        <Badge className="bg-purple-500/90 text-white px-3 py-1 rounded-full flex items-center gap-1">
          <span>💗</span>
          <span>Explore</span>
          <span>›</span>
        </Badge>
      </div>

      {/* Battle Display - Split Screen */}
      <div className="flex-1 relative">
        {/* Background Battle Display */}
        <div className="absolute inset-0 grid grid-cols-2">
          {/* Creator 1 Side */}
          <div className="relative bg-gradient-to-br from-red-600/20 to-red-800/20">
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <Avatar className="w-32 h-32">
                <AvatarImage src={creator1.avatar} />
                <AvatarFallback className="text-4xl">{creator1.displayName[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Creator 2 Side */}
          <div className="relative bg-gradient-to-br from-blue-600/20 to-blue-800/20">
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <Avatar className="w-32 h-32">
                <AvatarImage src={creator2.avatar} />
                <AvatarFallback className="text-4xl">{creator2.displayName[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Battle Interface Overlay */}
        <div className="absolute inset-0 flex flex-col">
          {/* Host Box - Centered Battle Display */}
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-4 max-w-sm w-full mx-4">
              <div className="text-center mb-4">
                <div className="text-white text-lg font-bold">Host</div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={scores.creator1 > scores.creator2 ? creator1.avatar : creator2.avatar} />
                    <AvatarFallback>
                      {scores.creator1 > scores.creator2 ? creator1.displayName[0] : creator2.displayName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-white">
                    <div className="font-medium">{scores.creator1 > scores.creator2 ? creator1.displayName : creator2.displayName}</div>
                    <div className="text-blue-400 text-sm flex items-center gap-1">
                      <Coins className="w-3 h-3" />
                      {Math.max(scores.creator1, scores.creator2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Battle Grid */}
              <div className="grid grid-cols-2 gap-2">
                {/* Creator 1 */}
                <div className={cn(
                  "border-2 rounded-lg p-3 text-center transition-all",
                  userVotedCreatorId === creator1.id ? "border-red-500 bg-red-500/20" : "border-blue-500"
                )}>
                  <Avatar className="w-8 h-8 mx-auto mb-1">
                    <AvatarImage src={creator1.avatar} />
                    <AvatarFallback className="text-xs">{creator1.displayName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-white text-xs font-medium mb-1">{creator1.displayName}</div>
                  <div className="text-blue-400 text-sm flex items-center justify-center gap-1">
                    <Coins className="w-3 h-3" />
                    {scores.creator1}
                  </div>
                  {!hasUserVoted && !votingClosed && (
                    <Button
                      size="sm"
                      onClick={() => handleVote(creator1.id)}
                      className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white text-xs py-1"
                    >
                      Vote
                    </Button>
                  )}
                  {hasUserVoted && userVotedCreatorId === creator1.id && (
                    <div className="mt-2 text-red-400 text-xs flex items-center justify-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Voted
                    </div>
                  )}
                </div>

                {/* Creator 2 */}
                <div className={cn(
                  "border-2 rounded-lg p-3 text-center transition-all",
                  userVotedCreatorId === creator2.id ? "border-red-500 bg-red-500/20" : "border-blue-500"
                )}>
                  <Avatar className="w-8 h-8 mx-auto mb-1">
                    <AvatarImage src={creator2.avatar} />
                    <AvatarFallback className="text-xs">{creator2.displayName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-white text-xs font-medium mb-1">{creator2.displayName}</div>
                  <div className="text-blue-400 text-sm flex items-center justify-center gap-1">
                    <Coins className="w-3 h-3" />
                    {scores.creator2}
                  </div>
                  {!hasUserVoted && !votingClosed && (
                    <Button
                      size="sm"
                      onClick={() => handleVote(creator2.id)}
                      className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white text-xs py-1"
                    >
                      Vote
                    </Button>
                  )}
                  {hasUserVoted && userVotedCreatorId === creator2.id && (
                    <div className="mt-2 text-red-400 text-xs flex items-center justify-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Voted
                    </div>
                  )}
                </div>
              </div>

              {/* Battle Timer */}
              <div className="mt-4 text-center">
                <div className="text-white/70 text-xs">Time Remaining</div>
                <div className="text-white font-bold">{formatTime(timeLeft)}</div>
                {!votingClosed && timeLeft > 180 && (
                  <div className="text-yellow-400 text-xs mt-1">
                    Voting closes in {formatTime(timeLeft - 180)}
                  </div>
                )}
                {votingClosed && (
                  <div className="text-red-400 text-xs mt-1">Voting Closed</div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Comment Section - TikTok Style */}
          <div className="bg-black/20 backdrop-blur-sm p-4 space-y-3">
            {/* Live Comments */}
            <div className="space-y-2 max-h-32 overflow-y-auto" ref={commentsRef}>
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2 text-sm">
                  <Avatar className="w-6 h-6 flex-shrink-0">
                    <AvatarImage src={comment.user.avatar} />
                    <AvatarFallback className="text-xs">{comment.user.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <span className="text-white font-medium">{comment.user.username}: </span>
                    <span className="text-white/90">{comment.message}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Action Bar - TikTok Style */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 rounded-full"
              >
                <MessageCircle className="w-6 h-6" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 rounded-full"
                onClick={() => setShowGifts(true)}
              >
                <Gift className="w-6 h-6" />
              </Button>

              <div className="flex-1 flex items-center gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Type..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-full"
                  onKeyPress={(e) => e.key === 'Enter' && sendComment()}
                />
                <Button
                  size="icon"
                  onClick={sendComment}
                  className="bg-white/10 hover:bg-white/20 text-white rounded-full"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 rounded-full"
              >
                <Users className="w-6 h-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 rounded-full"
              >
                <Share2 className="w-6 h-6" />
              </Button>

              <div className="text-white text-sm font-medium">15</div>
            </div>
          </div>
        </div>
      </div>

      {/* Gift Selection Modal */}
      {showGifts && (
        <div className="absolute inset-0 bg-black/70 flex items-end justify-center z-50">
          <div className="bg-gray-900 rounded-t-3xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Send Gift</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowGifts(false)}>
                <X className="w-5 h-5 text-white" />
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              {gifts.map((gift) => (
                <Button
                  key={gift.id}
                  variant="outline"
                  className={cn(
                    "aspect-square p-4 flex flex-col items-center gap-1 border-gray-600 hover:border-yellow-400",
                    selectedGift?.id === gift.id && "border-yellow-400 bg-yellow-400/10"
                  )}
                  onClick={() => setSelectedGift(gift)}
                >
                  <div className="text-2xl">{gift.icon}</div>
                  <div className="text-xs text-center text-white">
                    <div className="font-medium">{gift.name}</div>
                    <div className={gift.color}>{gift.value}</div>
                  </div>
                </Button>
              ))}
            </div>

            {selectedGift && (
              <div className="space-y-4">
                <div className="text-center text-white">
                  <div className="text-4xl mb-2">{selectedGift.icon}</div>
                  <div className="font-medium">{selectedGift.name}</div>
                  <div className="text-yellow-400">{selectedGift.value} coins</div>
                </div>
                
                <div className="text-white text-sm mb-3">Send to:</div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => sendGift(selectedGift, creator1.id)}
                  >
                    {creator1.displayName}
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => sendGift(selectedGift, creator2.id)}
                  >
                    {creator2.displayName}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TikTokStyleBattle;
