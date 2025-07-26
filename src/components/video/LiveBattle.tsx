import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Square,
  Crown,
  Zap,
  Users,
  MessageCircle,
  Gift,
  Trophy,
  Star,
  Volume2,
  VolumeX,
  Settings,
  X,
  Timer,
  TrendingUp,
  Heart,
  Fire,
  Camera,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share2,
  Flag,
  MoreHorizontal,
  Sparkles,
  Target,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Coins,
  Clock,
  Eye,
  ThumbsUp,
  Send,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Rocket,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface BattleParticipant {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  isVerified: boolean;
  score: number;
  level: number;
  tier: "rising_star" | "pro_creator" | "legend";
  battlesWon: number;
  battlesLost: number;
  streamKey?: string;
  isReady: boolean;
  isLive: boolean;
}

interface BattleMessage {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  message: string;
  type: "chat" | "tip" | "system" | "reaction";
  timestamp: Date;
  giftType?: string;
  amount?: number;
  currency?: string;
}

interface BattleGift {
  id: string;
  name: string;
  icon: string;
  cost: number;
  currency: "SOFT_POINTS" | "USDT";
  animation: string;
  scoreValue: number;
  description: string;
}

interface BattleBet {
  participantId: string;
  amount: number;
  currency: "SOFT_POINTS" | "USDT";
  odds: number;
}

interface LiveBattleProps {
  battleId: string;
  participant1: BattleParticipant;
  participant2: BattleParticipant;
  duration: number; // Duration in seconds
  onClose: () => void;
  onBattleEnd?: (winner: BattleParticipant) => void;
  isHost?: boolean;
  currentUserId: string;
}

const LiveBattle: React.FC<LiveBattleProps> = ({
  battleId,
  participant1,
  participant2,
  duration,
  onClose,
  onBattleEnd,
  isHost = false,
  currentUserId,
}) => {
  const { toast } = useToast();
  
  // Battle state
  const [battleStatus, setBattleStatus] = useState<"waiting" | "starting" | "live" | "ended">("waiting");
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [participant1Score, setParticipant1Score] = useState(0);
  const [participant2Score, setParticipant2Score] = useState(0);
  const [winner, setWinner] = useState<BattleParticipant | null>(null);
  
  // Viewer state
  const [viewerCount, setViewerCount] = useState(127);
  const [messages, setMessages] = useState<BattleMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showChat, setShowChat] = useState(true);
  const [showGifts, setShowGifts] = useState(false);
  const [showBetting, setShowBetting] = useState(false);
  
  // Audio/Video state
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  
  // User interaction state
  const [userBet, setUserBet] = useState<BattleBet | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [selectedGift, setSelectedGift] = useState<BattleGift | null>(null);
  const [userSoftPoints, setUserSoftPoints] = useState(1500);
  
  // Video refs
  const participant1VideoRef = useRef<HTMLVideoElement>(null);
  const participant2VideoRef = useRef<HTMLVideoElement>(null);
  
  // Available gifts
  const battleGifts: BattleGift[] = [
    {
      id: "rose",
      name: "Rose",
      icon: "🌹",
      cost: 1,
      currency: "SOFT_POINTS",
      animation: "float",
      scoreValue: 1,
      description: "Send love and support"
    },
    {
      id: "crown",
      name: "Crown",
      icon: "👑",
      cost: 5,
      currency: "SOFT_POINTS",
      animation: "bounce",
      scoreValue: 5,
      description: "Crown them the winner"
    },
    {
      id: "rocket",
      name: "Rocket",
      icon: "🚀",
      cost: 10,
      currency: "SOFT_POINTS",
      animation: "zoom",
      scoreValue: 10,
      description: "Blast them to victory"
    },
    {
      id: "diamond",
      name: "Diamond",
      icon: "💎",
      cost: 25,
      currency: "SOFT_POINTS",
      animation: "sparkle",
      scoreValue: 25,
      description: "You're a diamond!"
    },
    {
      id: "fireworks",
      name: "Fireworks",
      icon: "🎆",
      cost: 50,
      currency: "SOFT_POINTS",
      animation: "explosion",
      scoreValue: 50,
      description: "Celebrate in style"
    },
    {
      id: "super_rocket",
      name: "Super Rocket",
      icon: "🚀✨",
      cost: 100,
      currency: "SOFT_POINTS",
      animation: "mega_zoom",
      scoreValue: 100,
      description: "Ultimate support"
    },
  ];
  
  // Mock initial messages
  useEffect(() => {
    const initialMessages: BattleMessage[] = [
      {
        id: "1",
        userId: "system",
        username: "System",
        avatar: "",
        message: "Battle starting soon! Place your bets!",
        type: "system",
        timestamp: new Date(Date.now() - 30000),
      },
      {
        id: "2",
        userId: "user1",
        username: "crypto_fan",
        avatar: "https://i.pravatar.cc/150?u=user1",
        message: `Let's go @${participant1.username}! 🔥`,
        type: "chat",
        timestamp: new Date(Date.now() - 25000),
      },
      {
        id: "3",
        userId: "user2",
        username: "battle_watcher",
        avatar: "https://i.pravatar.cc/150?u=user2",
        message: `@${participant2.username} got this! 💪`,
        type: "chat",
        timestamp: new Date(Date.now() - 20000),
      },
    ];
    setMessages(initialMessages);
  }, [participant1.username, participant2.username]);
  
  // Battle timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (battleStatus === "live" && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            endBattle();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [battleStatus, timeRemaining]);
  
  // Simulate viewer count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.floor(Math.random() * 20) - 10;
        return Math.max(50, prev + change);
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const startBattle = () => {
    setBattleStatus("starting");
    
    // 3-second countdown
    let countdown = 3;
    const countdownInterval = setInterval(() => {
      if (countdown > 0) {
        addSystemMessage(`Battle starts in ${countdown}...`);
        countdown--;
      } else {
        clearInterval(countdownInterval);
        setBattleStatus("live");
        addSystemMessage("🔥 BATTLE STARTED! 🔥");
        
        toast({
          title: "Battle Started!",
          description: "The competition is now live!",
        });
      }
    }, 1000);
  };
  
  const endBattle = () => {
    setBattleStatus("ended");
    
    // Determine winner
    const battleWinner = participant1Score > participant2Score ? participant1 : 
                        participant2Score > participant1Score ? participant2 : null;
    
    setWinner(battleWinner);
    
    if (battleWinner) {
      addSystemMessage(`🏆 ${battleWinner.displayName} wins the battle! 🏆`);
      toast({
        title: "Battle Ended!",
        description: `${battleWinner.displayName} is the winner!`,
      });
    } else {
      addSystemMessage("🤝 It's a tie! Amazing battle! 🤝");
      toast({
        title: "Battle Ended!",
        description: "It's a tie! What an incredible battle!",
      });
    }
    
    onBattleEnd?.(battleWinner || participant1);
    
    // Process bets
    if (userBet && battleWinner) {
      if (userBet.participantId === battleWinner.id) {
        const winnings = userBet.amount * userBet.odds;
        setUserSoftPoints(prev => prev + winnings);
        toast({
          title: "Bet Won!",
          description: `You won ${winnings} SoftPoints!`,
        });
      } else {
        toast({
          title: "Bet Lost",
          description: "Better luck next time!",
          variant: "destructive",
        });
      }
    }
  };
  
  const addSystemMessage = (message: string) => {
    const systemMessage: BattleMessage = {
      id: Date.now().toString(),
      userId: "system",
      username: "System",
      avatar: "",
      message,
      type: "system",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, systemMessage]);
  };
  
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: BattleMessage = {
      id: Date.now().toString(),
      userId: currentUserId,
      username: "You",
      avatar: "https://i.pravatar.cc/150?u=current",
      message: newMessage,
      type: "chat",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };
  
  const sendGift = (gift: BattleGift, participantId: string) => {
    if (userSoftPoints < gift.cost) {
      toast({
        title: "Insufficient SoftPoints",
        description: "You don't have enough SoftPoints for this gift.",
        variant: "destructive",
      });
      return;
    }
    
    setUserSoftPoints(prev => prev - gift.cost);
    
    // Update participant score
    if (participantId === participant1.id) {
      setParticipant1Score(prev => prev + gift.scoreValue);
    } else {
      setParticipant2Score(prev => prev + gift.scoreValue);
    }
    
    // Add gift message
    const giftMessage: BattleMessage = {
      id: Date.now().toString(),
      userId: currentUserId,
      username: "You",
      avatar: "https://i.pravatar.cc/150?u=current",
      message: `sent ${gift.icon} ${gift.name}`,
      type: "tip",
      timestamp: new Date(),
      giftType: gift.id,
      amount: gift.cost,
      currency: gift.currency,
    };
    
    setMessages(prev => [...prev, giftMessage]);
    setShowGifts(false);
    
    toast({
      title: "Gift Sent!",
      description: `You sent a ${gift.name} for ${gift.cost} SoftPoints!`,
    });
  };
  
  const placeBet = (participantId: string) => {
    if (userSoftPoints < betAmount) {
      toast({
        title: "Insufficient SoftPoints",
        description: "You don't have enough SoftPoints to place this bet.",
        variant: "destructive",
      });
      return;
    }
    
    if (userBet) {
      toast({
        title: "Bet Already Placed",
        description: "You can only place one bet per battle.",
        variant: "destructive",
      });
      return;
    }
    
    const participant = participantId === participant1.id ? participant1 : participant2;
    const odds = participantId === participant1.id ? 1.8 : 2.2; // Mock odds
    
    const bet: BattleBet = {
      participantId,
      amount: betAmount,
      currency: "SOFT_POINTS",
      odds,
    };
    
    setUserBet(bet);
    setUserSoftPoints(prev => prev - betAmount);
    setShowBetting(false);
    
    addSystemMessage(`You bet ${betAmount} SoftPoints on ${participant.displayName}!`);
    
    toast({
      title: "Bet Placed!",
      description: `Bet ${betAmount} SoftPoints on ${participant.displayName}`,
    });
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  
  const getScorePercentage = (score: number) => {
    const totalScore = participant1Score + participant2Score;
    return totalScore === 0 ? 50 : (score / totalScore) * 100;
  };
  
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-900 to-pink-900 border-b border-purple-800">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white font-semibold">LIVE BATTLE</span>
          </div>
          
          <Badge variant="secondary" className="bg-white/20 text-white">
            <Users className="w-3 h-3 mr-1" />
            {viewerCount.toLocaleString()}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Timer */}
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-xs text-purple-200">TIME LEFT</div>
          </div>
          
          {/* Battle Controls */}
          {isHost && battleStatus === "waiting" && (
            <Button
              onClick={startBattle}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Battle
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="text-white hover:bg-white/20"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
        </div>
      </div>
      
      {/* Main Battle Area */}
      <div className="flex-1 flex">
        {/* Left Participant */}
        <div className="flex-1 relative">
          {/* Video Stream */}
          <div className="relative h-full bg-gray-900">
            <video
              ref={participant1VideoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted={isMuted}
            />
            
            {!participant1.isLive && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <Camera className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                  <p className="text-lg font-medium">Waiting for stream...</p>
                </div>
              </div>
            )}
            
            {/* Participant Info */}
            <div className="absolute top-4 left-4 right-4">
              <div className="flex items-center gap-3 bg-black/60 backdrop-blur-sm rounded-lg p-3">
                <Avatar className="w-12 h-12 border-2 border-purple-400">
                  <AvatarImage src={participant1.avatar} />
                  <AvatarFallback>{participant1.displayName[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{participant1.displayName}</span>
                    {participant1.isVerified && (
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                    )}
                    <Badge className={cn(
                      "text-xs",
                      participant1.tier === "legend" && "bg-yellow-500/20 text-yellow-400",
                      participant1.tier === "pro_creator" && "bg-purple-500/20 text-purple-400",
                      participant1.tier === "rising_star" && "bg-blue-500/20 text-blue-400"
                    )}>
                      {participant1.tier.replace("_", " ")}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-gray-300">
                    Level {participant1.level} • {participant1.battlesWon}W / {participant1.battlesLost}L
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-400">
                    {participant1Score.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-300">SCORE</div>
                </div>
              </div>
            </div>
            
            {/* Score Bar */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-400 font-medium">
                    {getScorePercentage(participant1Score).toFixed(1)}%
                  </span>
                  <span className="text-pink-400 font-medium">
                    {getScorePercentage(participant2Score).toFixed(1)}%
                  </span>
                </div>
                
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full flex">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-300"
                      style={{ width: `${getScorePercentage(participant1Score)}%` }}
                    />
                    <div
                      className="bg-gradient-to-r from-pink-400 to-pink-500 transition-all duration-300"
                      style={{ width: `${getScorePercentage(participant2Score)}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Gift Button */}
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={() => setShowGifts(true)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  disabled={battleStatus !== "live"}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Send Gift
                </Button>
                
                <Button
                  onClick={() => setShowBetting(true)}
                  variant="outline"
                  className="border-purple-400 text-purple-400 hover:bg-purple-400/20"
                  disabled={battleStatus !== "waiting" || !!userBet}
                >
                  <Target className="w-4 h-4 mr-2" />
                  {userBet?.participantId === participant1.id ? "✓" : "Bet"}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* VS Separator */}
        <div className="w-24 bg-gradient-to-b from-purple-600 to-pink-600 flex items-center justify-center relative">
          <div className="text-white font-bold text-2xl">VS</div>
          
          {battleStatus === "live" && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-16 border-4 border-white rounded-full flex items-center justify-center animate-pulse">
                <Flame className="w-8 h-8 text-white" />
              </div>
            </div>
          )}
          
          {winner && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-center">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-1" />
                <div className="text-xs font-bold text-white">WINNER</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Right Participant */}
        <div className="flex-1 relative">
          {/* Video Stream */}
          <div className="relative h-full bg-gray-900">
            <video
              ref={participant2VideoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted={isMuted}
            />
            
            {!participant2.isLive && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <Camera className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                  <p className="text-lg font-medium">Waiting for stream...</p>
                </div>
              </div>
            )}
            
            {/* Participant Info */}
            <div className="absolute top-4 left-4 right-4">
              <div className="flex items-center gap-3 bg-black/60 backdrop-blur-sm rounded-lg p-3">
                <Avatar className="w-12 h-12 border-2 border-pink-400">
                  <AvatarImage src={participant2.avatar} />
                  <AvatarFallback>{participant2.displayName[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{participant2.displayName}</span>
                    {participant2.isVerified && (
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                    )}
                    <Badge className={cn(
                      "text-xs",
                      participant2.tier === "legend" && "bg-yellow-500/20 text-yellow-400",
                      participant2.tier === "pro_creator" && "bg-purple-500/20 text-purple-400",
                      participant2.tier === "rising_star" && "bg-blue-500/20 text-blue-400"
                    )}>
                      {participant2.tier.replace("_", " ")}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-gray-300">
                    Level {participant2.level} • {participant2.battlesWon}W / {participant2.battlesLost}L
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-pink-400">
                    {participant2Score.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-300">SCORE</div>
                </div>
              </div>
            </div>
            
            {/* Gift Button */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowGifts(true)}
                  className="flex-1 bg-pink-600 hover:bg-pink-700"
                  disabled={battleStatus !== "live"}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Send Gift
                </Button>
                
                <Button
                  onClick={() => setShowBetting(true)}
                  variant="outline"
                  className="border-pink-400 text-pink-400 hover:bg-pink-400/20"
                  disabled={battleStatus !== "waiting" || !!userBet}
                >
                  <Target className="w-4 h-4 mr-2" />
                  {userBet?.participantId === participant2.id ? "✓" : "Bet"}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col">
            {/* Chat Header */}
            <div className="p-3 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">Live Chat</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowChat(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Messages */}
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className="flex gap-2">
                    {message.type !== "system" && (
                      <Avatar className="w-6 h-6 flex-shrink-0">
                        <AvatarImage src={message.avatar} />
                        <AvatarFallback className="text-xs">
                          {message.username[0]}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      {message.type === "system" ? (
                        <div className="text-center">
                          <span className="text-yellow-400 text-sm font-medium bg-yellow-400/10 px-2 py-1 rounded">
                            {message.message}
                          </span>
                        </div>
                      ) : message.type === "tip" ? (
                        <div className="bg-purple-500/20 rounded-lg p-2">
                          <div className="text-purple-400 text-xs font-medium">
                            {message.username}
                          </div>
                          <div className="text-white text-sm">
                            {message.message} ({message.amount} {message.currency})
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="text-gray-400 text-xs">
                            {message.username}
                          </div>
                          <div className="text-white text-sm break-words">
                            {message.message}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {/* Message Input */}
            <div className="p-3 border-t border-gray-800">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Say something..."
                  className="flex-1 bg-gray-800 border-gray-700 text-white"
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  size="icon"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                <span>{userSoftPoints.toLocaleString()} SoftPoints</span>
                {userBet && (
                  <span className="text-yellow-400">
                    Bet: {userBet.amount} SP on {userBet.participantId === participant1.id ? participant1.displayName : participant2.displayName}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Chat Toggle Button */}
      {!showChat && (
        <Button
          onClick={() => setShowChat(true)}
          className="fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-700 rounded-full"
          size="icon"
        >
          <MessageCircle className="w-5 h-5" />
        </Button>
      )}
      
      {/* Gift Selection Modal */}
      <Dialog open={showGifts} onOpenChange={setShowGifts}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send a Gift</DialogTitle>
            <DialogDescription>
              Support your favorite creator and boost their score!
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-3 gap-4">
            {battleGifts.map((gift) => (
              <Card
                key={gift.id}
                className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => setSelectedGift(gift)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-2">{gift.icon}</div>
                  <div className="font-semibold mb-1">{gift.name}</div>
                  <div className="text-sm text-gray-400 mb-2">{gift.description}</div>
                  <div className="flex items-center justify-center gap-1 text-purple-400">
                    <Coins className="w-4 h-4" />
                    <span>{gift.cost} SP</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {selectedGift && (
            <div className="border-t border-gray-800 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white">Send {selectedGift.icon} {selectedGift.name}</p>
                  <p className="text-sm text-gray-400">Cost: {selectedGift.cost} SoftPoints</p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => sendGift(selectedGift, participant1.id)}
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={userSoftPoints < selectedGift.cost}
                  >
                    To {participant1.displayName}
                  </Button>
                  <Button
                    onClick={() => sendGift(selectedGift, participant2.id)}
                    className="bg-pink-600 hover:bg-pink-700"
                    disabled={userSoftPoints < selectedGift.cost}
                  >
                    To {participant2.displayName}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Betting Modal */}
      <Dialog open={showBetting} onOpenChange={setShowBetting}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Place Your Bet</DialogTitle>
            <DialogDescription>
              Predict the winner and earn SoftPoints! Betting closes when the battle starts.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Bet Amount (SoftPoints)</label>
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                min="1"
                max={userSoftPoints}
                className="mt-1 bg-gray-800 border-gray-700"
              />
              <p className="text-xs text-gray-500 mt-1">
                Available: {userSoftPoints.toLocaleString()} SoftPoints
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar>
                      <AvatarImage src={participant1.avatar} />
                      <AvatarFallback>{participant1.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{participant1.displayName}</div>
                      <div className="text-sm text-gray-400">Odds: 1.8x</div>
                    </div>
                  </div>
                  <Button
                    onClick={() => placeBet(participant1.id)}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={userSoftPoints < betAmount}
                  >
                    Bet {betAmount} SP
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar>
                      <AvatarImage src={participant2.avatar} />
                      <AvatarFallback>{participant2.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{participant2.displayName}</div>
                      <div className="text-sm text-gray-400">Odds: 2.2x</div>
                    </div>
                  </div>
                  <Button
                    onClick={() => placeBet(participant2.id)}
                    className="w-full bg-pink-600 hover:bg-pink-700"
                    disabled={userSoftPoints < betAmount}
                  >
                    Bet {betAmount} SP
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LiveBattle;
