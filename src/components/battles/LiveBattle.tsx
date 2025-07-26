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

interface LiveBattleProps {
  battleId: string;
  creator1: Creator;
  creator2: Creator;
  duration: number;
  onBattleEnd: (winnerId: string) => void;
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

const LiveBattle: React.FC<LiveBattleProps> = ({
  battleId,
  creator1,
  creator2,
  duration,
  onBattleEnd,
  onExit,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [viewers, setViewers] = useState(1247);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [showGifts, setShowGifts] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [scores, setScores] = useState({
    creator1: creator1.score,
    creator2: creator2.score,
  });
  const [comboCount, setComboCount] = useState(0);
  const [showCombo, setShowCombo] = useState(false);
  const [battlePhase, setBattlePhase] = useState<'active' | 'ending' | 'ended'>('active');
  
  const commentsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setBattlePhase('ending');
          setTimeout(() => {
            setBattlePhase('ended');
            const winnerId = scores.creator1 > scores.creator2 ? creator1.id : creator2.id;
            onBattleEnd(winnerId);
          }, 3000);
          return 0;
        }
        
        // Battle ending warning
        if (prev === 30) {
          toast({
            title: "30 seconds left! ⏰",
            description: "Battle ending soon!",
          });
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate live updates
  useEffect(() => {
    const updateInterval = setInterval(() => {
      // Random viewer count changes
      setViewers(prev => prev + Math.floor(Math.random() * 10 - 3));
      
      // Random score updates
      if (Math.random() > 0.7) {
        const isCreator1 = Math.random() > 0.5;
        const points = Math.floor(Math.random() * 20) + 1;
        
        setScores(prev => ({
          ...prev,
          [isCreator1 ? 'creator1' : 'creator2']: prev[isCreator1 ? 'creator1' : 'creator2'] + points
        }));
      }
      
      // Random comments
      if (Math.random() > 0.8) {
        const mockComments = [
          "Amazing battle! 🔥",
          "Go go go!",
          "This is insane! 💯",
          "Team blue! 💙",
          "Epic moves! 🚀",
        ];
        
        const newComment: Comment = {
          id: Date.now().toString(),
          user: {
            username: `user${Math.floor(Math.random() * 1000)}`,
            avatar: `https://i.pravatar.cc/32?u=${Math.random()}`,
          },
          message: mockComments[Math.floor(Math.random() * mockComments.length)],
          timestamp: new Date(),
        };
        
        setComments(prev => [...prev.slice(-20), newComment]);
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

  const sendGift = (gift: Gift, recipientId: string) => {
    const points = gift.value;
    setScores(prev => ({
      ...prev,
      [recipientId === creator1.id ? 'creator1' : 'creator2']: 
        prev[recipientId === creator1.id ? 'creator1' : 'creator2'] + points
    }));

    // Combo system
    setComboCount(prev => prev + 1);
    setShowCombo(true);
    setTimeout(() => setShowCombo(false), 2000);

    toast({
      title: `${gift.icon} ${gift.name} sent!`,
      description: `+${points} SP to ${recipientId === creator1.id ? creator1.displayName : creator2.displayName}`,
    });

    setShowGifts(false);
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

  const getLeadingCreator = () => {
    return scores.creator1 > scores.creator2 ? creator1 : creator2;
  };

  const getScorePercentage = (creatorScore: number) => {
    const total = scores.creator1 + scores.creator2;
    return total > 0 ? (creatorScore / total) * 100 : 50;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-600/20 to-blue-600/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onExit}>
            <X className="w-5 h-5 text-white" />
          </Button>
          
          <Badge className="bg-red-500 text-white animate-pulse">
            <Flame className="w-3 h-3 mr-1" />
            LIVE BATTLE
          </Badge>
          
          <div className="flex items-center gap-2 text-white">
            <Users className="w-4 h-4" />
            <span className="font-medium">{viewers.toLocaleString()}</span>
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {formatTime(timeLeft)}
          </div>
          {battlePhase === 'ending' && (
            <div className="text-yellow-400 text-sm animate-pulse">
              Battle Ending!
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
          </Button>
          
          <Button variant="ghost" size="icon">
            <Share2 className="w-5 h-5 text-white" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5 text-white" />
          </Button>
        </div>
      </div>

      {/* Battle Area */}
      <div className="flex-1 relative">
        {/* Split Screen */}
        <div className="grid grid-cols-2 h-full">
          {/* Creator 1 */}
          <div className="relative bg-gradient-to-br from-red-600/20 to-red-800/20">
            {/* Mock video feed */}
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <div className="text-center text-white">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={creator1.avatar} />
                  <AvatarFallback>{creator1.displayName[0]}</AvatarFallback>
                </Avatar>
                <div className="text-sm opacity-50">Camera feed would be here</div>
              </div>
            </div>

            {/* Creator 1 Info */}
            <div className="absolute top-4 left-4">
              <div className="bg-black/50 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={creator1.avatar} />
                    <AvatarFallback>{creator1.displayName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-white font-medium text-sm">{creator1.displayName}</div>
                    <div className="text-red-400 text-xs">@{creator1.username}</div>
                  </div>
                  {creator1.verified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full" />
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-red-400 text-sm">
                  <Trophy className="w-3 h-3" />
                  <span className="font-bold">{scores.creator1}</span>
                  <span className="text-xs">SP</span>
                </div>
              </div>
            </div>

            {/* Gift Button for Creator 1 */}
            <div className="absolute bottom-20 right-4">
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => {
                  setSelectedGift(null);
                  setShowGifts(true);
                }}
              >
                <Gift className="w-4 h-4 mr-1" />
                Gift
              </Button>
            </div>
          </div>

          {/* Creator 2 */}
          <div className="relative bg-gradient-to-br from-blue-600/20 to-blue-800/20">
            {/* Mock video feed */}
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <div className="text-center text-white">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={creator2.avatar} />
                  <AvatarFallback>{creator2.displayName[0]}</AvatarFallback>
                </Avatar>
                <div className="text-sm opacity-50">Camera feed would be here</div>
              </div>
            </div>

            {/* Creator 2 Info */}
            <div className="absolute top-4 right-4">
              <div className="bg-black/50 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-right">
                    <div className="text-white font-medium text-sm">{creator2.displayName}</div>
                    <div className="text-blue-400 text-xs">@{creator2.username}</div>
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={creator2.avatar} />
                    <AvatarFallback>{creator2.displayName[0]}</AvatarFallback>
                  </Avatar>
                  {creator2.verified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full" />
                  )}
                </div>
                
                <div className="flex items-center justify-end gap-1 text-blue-400 text-sm">
                  <span className="font-bold">{scores.creator2}</span>
                  <span className="text-xs">SP</span>
                  <Trophy className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Gift Button for Creator 2 */}
            <div className="absolute bottom-20 left-4">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  setSelectedGift(null);
                  setShowGifts(true);
                }}
              >
                <Gift className="w-4 h-4 mr-1" />
                Gift
              </Button>
            </div>
          </div>
        </div>

        {/* Center Line & Score Bar */}
        <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-red-500 to-blue-500" />
        
        {/* Score Progress Bar */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80">
          <div className="bg-black/50 rounded-full p-2 backdrop-blur-sm">
            <div className="relative h-6 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-red-500 transition-all duration-1000"
                style={{ width: `${getScorePercentage(scores.creator1)}%` }}
              />
              <div 
                className="absolute right-0 top-0 h-full bg-blue-500 transition-all duration-1000"
                style={{ width: `${getScorePercentage(scores.creator2)}%` }}
              />
              
              {/* Leader indicator */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                  {getLeadingCreator().displayName} LEADS
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Combo Display */}
        {showCombo && comboCount > 1 && (
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="bg-yellow-400 text-black px-6 py-3 rounded-full font-bold text-xl animate-bounce">
              🔥 COMBO x{comboCount}!
            </div>
          </div>
        )}

        {/* Battle End Animation */}
        {battlePhase === 'ending' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-40">
            <div className="text-center text-white">
              <div className="text-6xl mb-4 animate-pulse">⏰</div>
              <div className="text-2xl font-bold">Time's Up!</div>
              <div className="text-lg">Calculating results...</div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Panel */}
      <div className="h-32 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700">
        <div className="grid grid-cols-3 h-full">
          {/* Comments */}
          <div className="col-span-2 p-4">
            <div className="h-20 overflow-y-auto mb-2" ref={commentsRef}>
              <div className="space-y-1">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-2 text-sm">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={comment.user.avatar} />
                      <AvatarFallback className="text-xs">{comment.user.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <span className="text-yellow-400 font-medium">{comment.user.username}: </span>
                      <span className="text-white">{comment.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Send a message..."
                className="bg-gray-800 border-gray-600 text-white"
                onKeyPress={(e) => e.key === 'Enter' && sendComment()}
              />
              <Button size="sm" onClick={sendComment}>
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Gifts */}
          <div className="p-4">
            <div className="text-white text-sm font-medium mb-2">Quick Gifts</div>
            <div className="grid grid-cols-3 gap-1">
              {gifts.slice(0, 6).map((gift) => (
                <Button
                  key={gift.id}
                  variant="outline"
                  size="sm"
                  className="aspect-square p-1 text-lg"
                  onClick={() => {
                    setSelectedGift(gift);
                    setShowGifts(true);
                  }}
                >
                  {gift.icon}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gift Selection Modal */}
      {showGifts && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Send Gift</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowGifts(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              {gifts.map((gift) => (
                <Button
                  key={gift.id}
                  variant="outline"
                  className={cn(
                    "aspect-square p-4 flex flex-col items-center gap-1",
                    selectedGift?.id === gift.id && "border-yellow-400 bg-yellow-400/10"
                  )}
                  onClick={() => setSelectedGift(gift)}
                >
                  <div className="text-2xl">{gift.icon}</div>
                  <div className="text-xs text-center">
                    <div className="font-medium">{gift.name}</div>
                    <div className={gift.color}>{gift.value} SP</div>
                  </div>
                </Button>
              ))}
            </div>

            {selectedGift && (
              <div className="space-y-2">
                <div className="text-center text-white mb-4">
                  <div className="text-3xl mb-2">{selectedGift.icon}</div>
                  <div className="font-medium">{selectedGift.name}</div>
                  <div className="text-yellow-400">{selectedGift.value} SoftPoints</div>
                </div>
                
                <div className="text-white text-sm mb-4">Send to:</div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => sendGift(selectedGift, creator1.id)}
                  >
                    {creator1.displayName}
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
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

export default LiveBattle;
