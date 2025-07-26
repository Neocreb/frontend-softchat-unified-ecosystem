import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Users,
  MessageCircle,
  Heart,
  Gift,
  Crown,
  Star,
  Zap,
  Timer,
  Trophy,
  Target,
  Settings,
  X,
  Send,
  Play,
  Pause,
  StopCircle,
  Volume2,
  VolumeX,
  DollarSign,
  TrendingUp,
  Award,
  Flame,
  Shield,
  Eye,
  ThumbsUp,
  Music,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface BattleCreator {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  level: number;
  battlesWon: number;
  battlesLost: number;
  winRate: number;
  isLive: boolean;
  isHost: boolean;
}

interface BattleGift {
  id: string;
  name: string;
  icon: string;
  softPointsValue: number;
  usdValue: number;
  hasSpecialEffect: boolean;
  effectType?: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface BattleMessage {
  id: string;
  user: {
    id: string;
    username: string;
    avatar: string;
    isSubscriber: boolean;
    isModerator: boolean;
  };
  message: string;
  timestamp: Date;
  type: "message" | "gift" | "vote" | "system";
  giftData?: {
    giftId: string;
    giftName: string;
    giftIcon: string;
    value: number;
    recipient: string;
  };
}

interface LiveBattleConfig {
  battleId: string;
  title: string;
  duration: number; // seconds
  creator1: BattleCreator;
  creator2: BattleCreator;
  scoringMethod: "gifts" | "votes" | "hybrid";
  allowVoting: boolean;
  allowGifts: boolean;
  entryFee: number;
  prizePot: number;
}

interface LiveBattleInterfaceProps {
  config: LiveBattleConfig;
  isParticipant?: boolean;
  userRole?: "creator1" | "creator2" | "viewer";
  onLeave: () => void;
}

const battleGifts: BattleGift[] = [
  {
    id: "rose",
    name: "Rose",
    icon: "🌹",
    softPointsValue: 1,
    usdValue: 0.01,
    hasSpecialEffect: false,
    rarity: "common",
  },
  {
    id: "heart",
    name: "Heart",
    icon: "❤️",
    softPointsValue: 5,
    usdValue: 0.05,
    hasSpecialEffect: true,
    effectType: "hearts",
    rarity: "common",
  },
  {
    id: "diamond",
    name: "Diamond",
    icon: "💎",
    softPointsValue: 10,
    usdValue: 0.10,
    hasSpecialEffect: true,
    effectType: "sparkles",
    rarity: "rare",
  },
  {
    id: "crown",
    name: "Crown",
    icon: "👑",
    softPointsValue: 50,
    usdValue: 0.50,
    hasSpecialEffect: true,
    effectType: "golden_rain",
    rarity: "epic",
  },
  {
    id: "rocket",
    name: "Rocket",
    icon: "🚀",
    softPointsValue: 100,
    usdValue: 1.00,
    hasSpecialEffect: true,
    effectType: "fireworks",
    rarity: "legendary",
  },
  {
    id: "dragon",
    name: "Dragon",
    icon: "🐉",
    softPointsValue: 500,
    usdValue: 5.00,
    hasSpecialEffect: true,
    effectType: "dragon_breath",
    rarity: "legendary",
  },
];

const LiveBattleInterface: React.FC<LiveBattleInterfaceProps> = ({
  config,
  isParticipant = false,
  userRole = "viewer",
  onLeave,
}) => {
  // Battle states
  const [battleStatus, setBattleStatus] = useState<"waiting" | "live" | "ended">("waiting");
  const [timeRemaining, setTimeRemaining] = useState(config.duration);
  const [isPaused, setIsPaused] = useState(false);

  // Scores
  const [creator1Score, setCreator1Score] = useState(0);
  const [creator2Score, setCreator2Score] = useState(0);
  const [creator1Gifts, setCreator1Gifts] = useState(0);
  const [creator2Gifts, setCreator2Gifts] = useState(0);
  const [creator1Votes, setCreator1Votes] = useState(0);
  const [creator2Votes, setCreator2Votes] = useState(0);

  // Live stream states
  const [isStreaming, setIsStreaming] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Viewer states
  const [viewerCount, setViewerCount] = useState(247);
  const [peakViewers, setPeakViewers] = useState(543);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedFor, setVotedFor] = useState<string | null>(null);

  // Chat and gifts
  const [messages, setMessages] = useState<BattleMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showGiftPanel, setShowGiftPanel] = useState(false);
  const [selectedGift, setSelectedGift] = useState<BattleGift | null>(null);
  const [giftQuantity, setGiftQuantity] = useState(1);

  // UI states
  const [activeTab, setActiveTab] = useState<"chat" | "leaderboard" | "stats">("chat");
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Effects and animations
  const [recentGifts, setRecentGifts] = useState<any[]>([]);
  const [comboGifts, setComboGifts] = useState<Record<string, number>>({});

  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { toast } = useToast();

  // Battle timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (battleStatus === "live" && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setBattleStatus("ended");
            handleBattleEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [battleStatus, isPaused, timeRemaining]);

  // Mock real-time updates
  useEffect(() => {
    if (battleStatus === "live") {
      const interval = setInterval(() => {
        // Simulate random gifts and score updates
        if (Math.random() < 0.3) {
          const isCreator1 = Math.random() < 0.5;
          const giftValue = Math.floor(Math.random() * 50) + 1;
          
          if (isCreator1) {
            setCreator1Gifts(prev => prev + giftValue);
            setCreator1Score(prev => prev + giftValue);
          } else {
            setCreator2Gifts(prev => prev + giftValue);
            setCreator2Score(prev => prev + giftValue);
          }
          
          // Add gift animation
          addGiftEffect(isCreator1 ? config.creator1.id : config.creator2.id, giftValue);
        }

        // Update viewer count
        setViewerCount(prev => {
          const change = Math.floor(Math.random() * 20) - 10;
          const newCount = Math.max(100, prev + change);
          setPeakViewers(current => Math.max(current, newCount));
          return newCount;
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [battleStatus, config.creator1.id, config.creator2.id]);

  const addGiftEffect = (creatorId: string, value: number) => {
    const effect = {
      id: Date.now().toString(),
      creatorId,
      value,
      timestamp: Date.now(),
    };
    
    setRecentGifts(prev => [...prev.slice(-4), effect]);
    
    // Remove effect after animation
    setTimeout(() => {
      setRecentGifts(prev => prev.filter(g => g.id !== effect.id));
    }, 3000);
  };

  const handleBattleStart = async () => {
    try {
      if (isParticipant) {
        // Initialize camera/microphone for creators
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        
        if (userRole === "creator1" && video1Ref.current) {
          video1Ref.current.srcObject = stream;
        } else if (userRole === "creator2" && video2Ref.current) {
          video2Ref.current.srcObject = stream;
        }
      }

      setBattleStatus("live");
      setIsStreaming(true);
      
      toast({
        title: "Battle Started!",
        description: "The live battle is now in progress",
      });
    } catch (error) {
      toast({
        title: "Failed to Start",
        description: "Could not access camera/microphone",
        variant: "destructive",
      });
    }
  };

  const handleBattleEnd = () => {
    setBattleStatus("ended");
    setIsStreaming(false);
    
    const winner = creator1Score > creator2Score ? config.creator1 : config.creator2;
    const winnerScore = Math.max(creator1Score, creator2Score);
    
    toast({
      title: "Battle Ended!",
      description: `${winner.displayName} wins with ${winnerScore.toLocaleString()} points!`,
    });
    
    // Clean up streams
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const handleSendGift = async (giftId: string, recipientId: string, quantity: number = 1) => {
    const gift = battleGifts.find(g => g.id === giftId);
    if (!gift) return;

    const totalValue = gift.softPointsValue * quantity;
    
    try {
      // Simulate gift transaction
      const giftData = {
        battleId: config.battleId,
        giftId,
        recipientId,
        quantity,
        totalValue,
        timestamp: new Date(),
      };

      // Update recipient's score and gifts
      if (recipientId === config.creator1.id) {
        setCreator1Gifts(prev => prev + totalValue);
        setCreator1Score(prev => prev + totalValue);
      } else {
        setCreator2Gifts(prev => prev + totalValue);
        setCreator2Score(prev => prev + totalValue);
      }

      // Add combo tracking
      const comboKey = `${giftId}_${recipientId}`;
      setComboGifts(prev => ({
        ...prev,
        [comboKey]: (prev[comboKey] || 0) + quantity,
      }));

      // Add chat message
      const giftMessage: BattleMessage = {
        id: Date.now().toString(),
        user: {
          id: "current_user",
          username: "You",
          avatar: "https://i.pravatar.cc/150?u=current",
          isSubscriber: false,
          isModerator: false,
        },
        message: `Sent ${quantity}x ${gift.name} to ${recipientId === config.creator1.id ? config.creator1.displayName : config.creator2.displayName}`,
        timestamp: new Date(),
        type: "gift",
        giftData: {
          giftId: gift.id,
          giftName: gift.name,
          giftIcon: gift.icon,
          value: totalValue,
          recipient: recipientId === config.creator1.id ? config.creator1.displayName : config.creator2.displayName,
        },
      };

      setMessages(prev => [...prev, giftMessage]);
      addGiftEffect(recipientId, totalValue);

      // Show special effects for rare gifts
      if (gift.hasSpecialEffect) {
        // Trigger special effect animation
        console.log(`Special effect: ${gift.effectType}`);
      }

      toast({
        title: "Gift Sent!",
        description: `${quantity}x ${gift.name} sent for ${totalValue} SP`,
      });

      setShowGiftPanel(false);
    } catch (error) {
      toast({
        title: "Gift Failed",
        description: "Could not send gift",
        variant: "destructive",
      });
    }
  };

  const handleVote = (creatorId: string) => {
    if (hasVoted) {
      toast({
        title: "Already Voted",
        description: "You can only vote once per battle",
        variant: "destructive",
      });
      return;
    }

    if (creatorId === config.creator1.id) {
      setCreator1Votes(prev => prev + 1);
      setCreator1Score(prev => prev + 10); // 10 points per vote
    } else {
      setCreator2Votes(prev => prev + 1);
      setCreator2Score(prev => prev + 10);
    }

    setHasVoted(true);
    setVotedFor(creatorId);

    toast({
      title: "Vote Cast!",
      description: `Voted for ${creatorId === config.creator1.id ? config.creator1.displayName : config.creator2.displayName}`,
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: BattleMessage = {
      id: Date.now().toString(),
      user: {
        id: "current_user",
        username: "You",
        avatar: "https://i.pravatar.cc/150?u=current",
        isSubscriber: false,
        isModerator: false,
      },
      message: newMessage,
      timestamp: new Date(),
      type: "message",
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getScorePercentage = (score: number) => {
    const total = creator1Score + creator2Score;
    return total > 0 ? (score / total) * 100 : 50;
  };

  return (
    <div className="fixed inset-0 bg-black text-white flex">
      {/* Main Battle Arena */}
      <div className="flex-1 relative">
        {/* Battle Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onLeave}
                className="text-white"
              >
                <X className="w-6 h-6" />
              </Button>
              <Badge
                variant="secondary"
                className={cn(
                  "animate-pulse",
                  battleStatus === "live" ? "bg-red-500/20 text-red-400" : "bg-gray-500/20 text-gray-400"
                )}
              >
                {battleStatus === "live" ? "🔴 LIVE" : battleStatus === "waiting" ? "⏳ WAITING" : "🏁 ENDED"}
              </Badge>
            </div>

            <div className="text-center">
              <h1 className="text-xl font-bold">{config.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {formatNumber(viewerCount)}
                </div>
                <div className="flex items-center gap-1">
                  <Timer className="w-4 h-4" />
                  {formatTime(timeRemaining)}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {config.prizePot} SP
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(true)}
                className="text-white"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Battle Arena */}
        <div className="h-full flex">
          {/* Creator 1 */}
          <div className="flex-1 relative">
            <video
              ref={video1Ref}
              autoPlay
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Creator 1 Info */}
            <div className="absolute top-20 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={config.creator1.avatar} />
                  <AvatarFallback>{config.creator1.displayName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold">{config.creator1.displayName}</h3>
                  <p className="text-sm text-gray-400">@{config.creator1.username}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="secondary" className="text-xs">
                      Level {config.creator1.level}
                    </Badge>
                    <span className="text-green-400">
                      {config.creator1.winRate}% WR
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Creator 1 Score */}
            <div className="absolute top-20 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 min-w-[120px]">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {formatNumber(creator1Score)}
                </div>
                <div className="text-xs text-gray-400">Points</div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Gifts:</span>
                    <span className="text-yellow-400">{formatNumber(creator1Gifts)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Votes:</span>
                    <span className="text-blue-400">{creator1Votes}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vote Button for Creator 1 */}
            {config.allowVoting && !hasVoted && battleStatus === "live" && (
              <Button
                onClick={() => handleVote(config.creator1.id)}
                className="absolute bottom-20 left-4 bg-purple-600 hover:bg-purple-700"
                size="sm"
              >
                <ThumbsUp className="w-4 h-4 mr-1" />
                Vote
              </Button>
            )}

            {/* Gift Button for Creator 1 */}
            {config.allowGifts && battleStatus === "live" && (
              <Button
                onClick={() => {
                  setSelectedGift(null);
                  setShowGiftPanel(true);
                  // Set recipient to creator1
                }}
                className="absolute bottom-20 left-20 bg-yellow-600 hover:bg-yellow-700"
                size="sm"
              >
                <Gift className="w-4 h-4 mr-1" />
                Gift
              </Button>
            )}
          </div>

          {/* VS Divider */}
          <div className="w-2 bg-gradient-to-b from-purple-500 to-pink-500 relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black rounded-full p-2">
              <span className="text-white font-bold text-sm">VS</span>
            </div>
          </div>

          {/* Creator 2 */}
          <div className="flex-1 relative">
            <video
              ref={video2Ref}
              autoPlay
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Creator 2 Info */}
            <div className="absolute top-20 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={config.creator2.avatar} />
                  <AvatarFallback>{config.creator2.displayName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold">{config.creator2.displayName}</h3>
                  <p className="text-sm text-gray-400">@{config.creator2.username}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="secondary" className="text-xs">
                      Level {config.creator2.level}
                    </Badge>
                    <span className="text-green-400">
                      {config.creator2.winRate}% WR
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Creator 2 Score */}
            <div className="absolute top-20 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 min-w-[120px]">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400">
                  {formatNumber(creator2Score)}
                </div>
                <div className="text-xs text-gray-400">Points</div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Gifts:</span>
                    <span className="text-yellow-400">{formatNumber(creator2Gifts)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Votes:</span>
                    <span className="text-blue-400">{creator2Votes}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vote Button for Creator 2 */}
            {config.allowVoting && !hasVoted && battleStatus === "live" && (
              <Button
                onClick={() => handleVote(config.creator2.id)}
                className="absolute bottom-20 right-4 bg-pink-600 hover:bg-pink-700"
                size="sm"
              >
                <ThumbsUp className="w-4 h-4 mr-1" />
                Vote
              </Button>
            )}

            {/* Gift Button for Creator 2 */}
            {config.allowGifts && battleStatus === "live" && (
              <Button
                onClick={() => {
                  setSelectedGift(null);
                  setShowGiftPanel(true);
                  // Set recipient to creator2
                }}
                className="absolute bottom-20 right-20 bg-yellow-600 hover:bg-yellow-700"
                size="sm"
              >
                <Gift className="w-4 h-4 mr-1" />
                Gift
              </Button>
            )}
          </div>
        </div>

        {/* Score Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-purple-400 min-w-[60px]">
              {formatNumber(creator1Score)}
            </span>
            <div className="flex-1 relative">
              <div className="h-6 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full flex">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
                    style={{ width: `${getScorePercentage(creator1Score)}%` }}
                  />
                  <div 
                    className="bg-gradient-to-r from-pink-500 to-pink-600 transition-all duration-500"
                    style={{ width: `${getScorePercentage(creator2Score)}%` }}
                  />
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {creator1Score === creator2Score ? "TIE" : 
                   creator1Score > creator2Score ? 
                   `${config.creator1.displayName} LEADS` : 
                   `${config.creator2.displayName} LEADS`}
                </span>
              </div>
            </div>
            <span className="text-sm font-medium text-pink-400 min-w-[60px] text-right">
              {formatNumber(creator2Score)}
            </span>
          </div>
        </div>

        {/* Recent Gift Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {recentGifts.map((gift) => (
            <div
              key={gift.id}
              className={cn(
                "absolute animate-bounce",
                gift.creatorId === config.creator1.id ? "left-1/4" : "right-1/4",
                "top-1/2 transform -translate-y-1/2"
              )}
            >
              <div className="bg-yellow-400 text-black rounded-full px-3 py-1 font-bold">
                +{gift.value} SP
              </div>
            </div>
          ))}
        </div>

        {/* Creator Controls (for participants) */}
        {isParticipant && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCameraOn(!isCameraOn)}
              className={cn(
                "rounded-full",
                isCameraOn ? "bg-white/20 text-white" : "bg-red-500/80 text-white"
              )}
            >
              {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMicOn(!isMicOn)}
              className={cn(
                "rounded-full",
                isMicOn ? "bg-white/20 text-white" : "bg-red-500/80 text-white"
              )}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>
            {battleStatus === "waiting" && (
              <Button
                onClick={handleBattleStart}
                className="bg-green-600 hover:bg-green-700 rounded-full px-4"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Battle
              </Button>
            )}
            {battleStatus === "live" && (
              <Button
                onClick={handleBattleEnd}
                variant="destructive"
                className="rounded-full px-4"
              >
                <StopCircle className="w-4 h-4 mr-2" />
                End Battle
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="leaderboard">Ranking</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} className="h-full">
            <TabsContent value="chat" className="h-full p-0 m-0">
              <div className="h-full flex flex-col">
                {/* Chat Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div key={message.id} className="space-y-1">
                        <div className="flex items-start gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={message.user.avatar} />
                            <AvatarFallback>{message.user.username[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-xs font-medium text-white truncate">
                                {message.user.username}
                              </span>
                              {message.user.isSubscriber && (
                                <Crown className="w-3 h-3 text-yellow-400" />
                              )}
                              {message.user.isModerator && (
                                <Shield className="w-3 h-3 text-green-400" />
                              )}
                            </div>
                            <p className="text-sm text-gray-300 break-words">
                              {message.message}
                            </p>
                            {message.giftData && (
                              <div className="mt-1 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{message.giftData.giftIcon}</span>
                                  <div className="text-xs">
                                    <div className="text-yellow-400 font-medium">
                                      {message.giftData.giftName}
                                    </div>
                                    <div className="text-gray-400">
                                      {message.giftData.value} SP to {message.giftData.recipient}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Chat Input */}
                <div className="p-4 border-t border-gray-700">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Say something..."
                      className="flex-1 bg-gray-800 border-gray-600 text-white"
                      maxLength={200}
                    />
                    <Button type="submit" size="sm" disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="leaderboard" className="h-full p-4 m-0">
              <div className="space-y-4">
                <h3 className="font-semibold text-white">Live Rankings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-purple-500 rounded-full text-white font-bold text-sm">
                        1
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {creator1Score > creator2Score ? config.creator1.displayName : config.creator2.displayName}
                        </div>
                        <div className="text-xs text-gray-400">Leading</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-purple-400">
                        {formatNumber(Math.max(creator1Score, creator2Score))}
                      </div>
                      <div className="text-xs text-gray-400">Points</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-600 rounded-full text-white font-bold text-sm">
                        2
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {creator1Score <= creator2Score ? config.creator1.displayName : config.creator2.displayName}
                        </div>
                        <div className="text-xs text-gray-400">Behind</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-400">
                        {formatNumber(Math.min(creator1Score, creator2Score))}
                      </div>
                      <div className="text-xs text-gray-400">Points</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <h4 className="font-medium text-white mb-3">Battle Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Peak Viewers:</span>
                      <span className="text-white">{formatNumber(peakViewers)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Gifts:</span>
                      <span className="text-white">{formatNumber(creator1Gifts + creator2Gifts)} SP</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Votes:</span>
                      <span className="text-white">{creator1Votes + creator2Votes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Prize Pool:</span>
                      <span className="text-yellow-400">{config.prizePot} SP</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="h-full p-4 m-0">
              <div className="space-y-4">
                <h3 className="font-semibold text-white">Battle Analytics</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-400">
                          {formatNumber(creator1Score)}
                        </div>
                        <div className="text-xs text-gray-400 mb-2">Creator 1 Score</div>
                        <Progress 
                          value={getScorePercentage(creator1Score)} 
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-pink-400">
                          {formatNumber(creator2Score)}
                        </div>
                        <div className="text-xs text-gray-400 mb-2">Creator 2 Score</div>
                        <Progress 
                          value={getScorePercentage(creator2Score)} 
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">Current Viewers</span>
                    </div>
                    <span className="text-white font-medium">{formatNumber(viewerCount)}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">Peak Viewers</span>
                    </div>
                    <span className="text-white font-medium">{formatNumber(peakViewers)}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">Chat Messages</span>
                    </div>
                    <span className="text-white font-medium">{messages.length}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-300">Total Gifts Value</span>
                    </div>
                    <span className="text-white font-medium">
                      {formatNumber(creator1Gifts + creator2Gifts)} SP
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-300">Total Votes</span>
                    </div>
                    <span className="text-white font-medium">{creator1Votes + creator2Votes}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Gift Panel Dialog */}
      <Dialog open={showGiftPanel} onOpenChange={setShowGiftPanel}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Send Gift</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {battleGifts.map((gift) => (
                <Button
                  key={gift.id}
                  variant={selectedGift?.id === gift.id ? "default" : "outline"}
                  className="h-20 flex flex-col items-center gap-1"
                  onClick={() => setSelectedGift(gift)}
                >
                  <span className="text-2xl">{gift.icon}</span>
                  <span className="text-xs">{gift.name}</span>
                  <span className="text-xs text-yellow-400">{gift.softPointsValue} SP</span>
                </Button>
              ))}
            </div>

            {selectedGift && (
              <div className="space-y-3">
                <div className="p-3 bg-gray-800 rounded">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedGift.icon}</span>
                    <div>
                      <h3 className="font-medium">{selectedGift.name}</h3>
                      <p className="text-sm text-gray-400">
                        {selectedGift.softPointsValue} SoftPoints
                      </p>
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-xs mt-1",
                          selectedGift.rarity === "legendary" && "bg-orange-500/20 text-orange-400",
                          selectedGift.rarity === "epic" && "bg-purple-500/20 text-purple-400",
                          selectedGift.rarity === "rare" && "bg-blue-500/20 text-blue-400",
                          selectedGift.rarity === "common" && "bg-gray-500/20 text-gray-400"
                        )}
                      >
                        {selectedGift.rarity}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGiftQuantity(Math.max(1, giftQuantity - 1))}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={giftQuantity}
                      onChange={(e) => setGiftQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="text-center bg-gray-800 border-gray-600"
                      min="1"
                      max="999"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGiftQuantity(giftQuantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span>Total Cost:</span>
                  <span className="font-bold text-yellow-400">
                    {(selectedGift.softPointsValue * giftQuantity).toLocaleString()} SP
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleSendGift(selectedGift.id, config.creator1.id, giftQuantity)}
                    className="flex-1"
                  >
                    Send to {config.creator1.displayName}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSendGift(selectedGift.id, config.creator2.id, giftQuantity)}
                    className="flex-1"
                  >
                    Send to {config.creator2.displayName}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LiveBattleInterface;
