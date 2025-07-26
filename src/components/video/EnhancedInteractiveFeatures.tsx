import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Gift,
  Star,
  Users,
  Sword,
  Zap,
  Crown,
  TrendingUp,
  Copy,
  Download,
  Flag,
  MoreHorizontal,
  Eye,
  ThumbsUp,
  Music,
  Sparkles,
  Timer,
  Trophy,
  Battle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import VideoDuetRecorder from "./VideoDuetRecorder";
import LiveBattleInterface from "./LiveBattleInterface";
import { duetBattleMonetizationService, formatCurrency } from "@/services/duetBattleMonetizationService";

interface VideoData {
  id: string;
  url: string;
  duration: number;
  creatorId: string;
  creatorUsername: string;
  creatorDisplayName: string;
  creatorAvatar: string;
  title: string;
  description: string;
  thumbnail: string;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  commentCount: number;
  allowDuets: boolean;
  allowComments: boolean;
  isMonetized: boolean;
  softPointsEarned: number;
  tipCount: number;
}

interface LiveViewerInfo {
  id: string;
  username: string;
  avatar: string;
  isSubscriber: boolean;
  joinedAt: Date;
}

interface GiftOption {
  id: string;
  name: string;
  icon: string;
  softPointsValue: number;
  usdValue: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  hasAnimation: boolean;
}

interface EnhancedInteractiveFeaturesProps {
  videoData: VideoData;
  isLiveStream?: boolean;
  allowDuets?: boolean;
  allowComments?: boolean;
  allowBattles?: boolean;
  onDuetCreate?: (originalVideoId: string) => void;
  onBattleInvite?: (targetUserId: string) => void;
  onReplyCreate?: (originalVideoId: string) => void;
  onTipSent?: (amount: number, currency: string) => void;
  className?: string;
}

const giftOptions: GiftOption[] = [
  { id: "rose", name: "Rose", icon: "🌹", softPointsValue: 1, usdValue: 0.01, rarity: "common", hasAnimation: false },
  { id: "heart", name: "Heart", icon: "❤️", softPointsValue: 5, usdValue: 0.05, rarity: "common", hasAnimation: true },
  { id: "star", name: "Star", icon: "⭐", softPointsValue: 10, usdValue: 0.10, rarity: "rare", hasAnimation: true },
  { id: "diamond", name: "Diamond", icon: "💎", softPointsValue: 25, usdValue: 0.25, rarity: "rare", hasAnimation: true },
  { id: "crown", name: "Crown", icon: "👑", softPointsValue: 50, usdValue: 0.50, rarity: "epic", hasAnimation: true },
  { id: "rocket", name: "Rocket", icon: "🚀", softPointsValue: 100, usdValue: 1.00, rarity: "epic", hasAnimation: true },
  { id: "dragon", name: "Dragon", icon: "🐉", softPointsValue: 500, usdValue: 5.00, rarity: "legendary", hasAnimation: true },
];

const EnhancedInteractiveFeatures: React.FC<EnhancedInteractiveFeaturesProps> = ({
  videoData,
  isLiveStream = false,
  allowDuets = true,
  allowComments = true,
  allowBattles = false,
  onDuetCreate,
  onBattleInvite,
  onReplyCreate,
  onTipSent,
  className,
}) => {
  // UI States
  const [showReactions, setShowReactions] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showDuetRecorder, setShowDuetRecorder] = useState(false);
  const [showBattleInterface, setShowBattleInterface] = useState(false);
  const [showTipDialog, setShowTipDialog] = useState(false);
  const [showBattleInviteDialog, setShowBattleInviteDialog] = useState(false);

  // Interaction States
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);

  // Live Stream States
  const [liveViewers, setLiveViewers] = useState<LiveViewerInfo[]>([]);
  const [viewerCount, setViewerCount] = useState(videoData.viewCount);

  // Tip/Gift States
  const [selectedGift, setSelectedGift] = useState<GiftOption | null>(null);
  const [customTipAmount, setCustomTipAmount] = useState(10);
  const [tipMessage, setTipMessage] = useState("");

  // Battle States
  const [battleConfig, setBattleConfig] = useState({
    duration: 180, // 3 minutes
    entryFee: 10,
    battleType: "live_duel" as const,
  });

  const { toast } = useToast();

  // Mock live viewer updates
  useEffect(() => {
    if (isLiveStream) {
      const interval = setInterval(() => {
        setViewerCount((prev) => {
          const change = Math.floor(Math.random() * 10) - 5;
          return Math.max(1, prev + change);
        });

        // Simulate viewer join/leave
        if (Math.random() < 0.3) {
          const mockViewer: LiveViewerInfo = {
            id: Date.now().toString(),
            username: `viewer_${Math.floor(Math.random() * 1000)}`,
            avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
            isSubscriber: Math.random() < 0.2,
            joinedAt: new Date(),
          };
          setLiveViewers((prev) => [...prev.slice(-9), mockViewer]);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isLiveStream]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    videoData.likeCount += isLiked ? -1 : 1;
    
    if (!isLiked) {
      // Award SoftPoints for engagement
      toast({
        title: "Liked! +1 SP",
        description: "Thanks for engaging with the content",
      });
    }
  };

  const handleShare = (platform: string) => {
    const shareUrl = `${window.location.origin}/video/${videoData.id}`;
    const shareText = `Check out this amazing video by @${videoData.creatorUsername}!`;

    if (platform === "copy") {
      navigator.clipboard.writeText(shareUrl);
      toast({ title: "Link copied to clipboard!" });
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
    } else if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
    }

    videoData.shareCount += 1;
    setShowShareDialog(false);

    // Award SoftPoints for sharing
    toast({
      title: "Shared! +2 SP",
      description: "Thanks for spreading the word!",
    });
  };

  const handleDuetRequest = () => {
    if (!allowDuets) {
      toast({
        title: "Duets Not Allowed",
        description: "This video doesn't allow duets",
        variant: "destructive",
      });
      return;
    }

    setShowDuetRecorder(true);
  };

  const handleBattleInvite = () => {
    if (!allowBattles) {
      toast({
        title: "Battles Not Available",
        description: "Battle feature is not available for this content",
        variant: "destructive",
      });
      return;
    }

    setShowBattleInviteDialog(true);
  };

  const handleSendTip = async (giftId?: string, amount?: number) => {
    try {
      const tipAmount = giftId ? 
        giftOptions.find(g => g.id === giftId)?.softPointsValue || 0 : 
        amount || customTipAmount;

      if (tipAmount <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please select a valid tip amount",
          variant: "destructive",
        });
        return;
      }

      // Process tip through monetization service
      const result = await duetBattleMonetizationService.processDuetTip({
        duetId: videoData.id, // Using videoId as duetId for regular videos
        tipperId: "current-user-id", // This would come from auth context
        amount: tipAmount,
        currency: "SOFT_POINTS",
        message: tipMessage,
        originalCreatorShare: tipAmount * 0.95, // 95% to creator, 5% platform fee
        duetCreatorShare: 0,
      });

      if (result.success) {
        videoData.softPointsEarned += tipAmount * 0.95;
        videoData.tipCount += 1;

        toast({
          title: "Tip Sent! ✨",
          description: `${formatCurrency(tipAmount)} sent to @${videoData.creatorUsername}`,
        });

        onTipSent?.(tipAmount, "SOFT_POINTS");
        setShowTipDialog(false);
        setTipMessage("");
      } else {
        toast({
          title: "Tip Failed",
          description: result.error || "Could not process tip",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send tip",
        variant: "destructive",
      });
    }
  };

  const handleBattleStart = (opponentId: string) => {
    const mockBattleConfig = {
      battleId: `battle_${Date.now()}`,
      title: `${videoData.creatorDisplayName} vs Opponent`,
      duration: battleConfig.duration,
      creator1: {
        id: videoData.creatorId,
        username: videoData.creatorUsername,
        displayName: videoData.creatorDisplayName,
        avatar: videoData.creatorAvatar,
        level: 15,
        battlesWon: 23,
        battlesLost: 7,
        winRate: 76.7,
        isLive: true,
        isHost: true,
      },
      creator2: {
        id: opponentId,
        username: "opponent_user",
        displayName: "Opponent User",
        avatar: "https://i.pravatar.cc/150?u=opponent",
        level: 12,
        battlesWon: 18,
        battlesLost: 12,
        winRate: 60.0,
        isLive: true,
        isHost: false,
      },
      scoringMethod: "hybrid" as const,
      allowVoting: true,
      allowGifts: true,
      entryFee: battleConfig.entryFee,
      prizePot: battleConfig.entryFee * 20, // 20x entry fee as prize pot
    };

    setShowBattleInterface(true);
    setShowBattleInviteDialog(false);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <>
      <div className={cn("space-y-4", className)}>
        {/* Main Interaction Buttons */}
        <div className="space-y-4">
          {/* Like Button */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm"
              onClick={handleLike}
            >
              <Heart className={cn("w-6 h-6", isLiked && "fill-red-500 text-red-500")} />
            </Button>
            <span className="text-white text-xs mt-1 text-center block">
              {formatNumber(videoData.likeCount)}
            </span>
          </div>

          {/* Comments */}
          {allowComments && (
            <div>
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm"
              >
                <MessageCircle className="w-6 h-6" />
              </Button>
              <span className="text-white text-xs mt-1 text-center block">
                {formatNumber(videoData.commentCount)}
              </span>
            </div>
          )}

          {/* Share */}
          <div>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm"
              onClick={() => setShowShareDialog(true)}
            >
              <Share2 className="w-6 h-6" />
            </Button>
            <span className="text-white text-xs mt-1 text-center block">
              {formatNumber(videoData.shareCount)}
            </span>
          </div>

          {/* Duet Button */}
          {allowDuets && (
            <div>
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm"
                onClick={handleDuetRequest}
              >
                <Users className="w-6 h-6" />
              </Button>
              <span className="text-white text-xs mt-1 text-center block">
                Duet
              </span>
            </div>
          )}

          {/* Battle Button */}
          {allowBattles && (
            <div>
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-full bg-purple-500/30 hover:bg-purple-500/50 text-white border-none backdrop-blur-sm"
                onClick={handleBattleInvite}
              >
                <Sword className="w-6 h-6" />
              </Button>
              <span className="text-white text-xs mt-1 text-center block">
                Battle
              </span>
            </div>
          )}

          {/* Tip/Gift Button */}
          {videoData.isMonetized && (
            <div>
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-full bg-yellow-500/30 hover:bg-yellow-500/50 text-white border-none backdrop-blur-sm"
                onClick={() => setShowTipDialog(true)}
              >
                <Gift className="w-6 h-6" />
              </Button>
              <span className="text-white text-xs mt-1 text-center block">
                {formatCurrency(videoData.softPointsEarned, "")}
              </span>
            </div>
          )}
        </div>

        {/* Live Stream Info */}
        {isLiveStream && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white text-xs font-medium">LIVE</span>
              <span className="text-white/70 text-xs">{formatNumber(viewerCount)}</span>
            </div>
            
            {/* Recent Viewers */}
            {liveViewers.length > 0 && (
              <div className="flex -space-x-2">
                {liveViewers.slice(-3).map((viewer) => (
                  <Avatar key={viewer.id} className="w-6 h-6 border-2 border-white">
                    <AvatarImage src={viewer.avatar} />
                    <AvatarFallback className="text-xs">{viewer.username[0]}</AvatarFallback>
                  </Avatar>
                ))}
                {liveViewers.length > 3 && (
                  <div className="w-6 h-6 bg-gray-600 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs text-white">+{liveViewers.length - 3}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Creator Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={videoData.creatorAvatar} />
              <AvatarFallback>{videoData.creatorDisplayName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-white font-medium">{videoData.creatorDisplayName}</h3>
              <p className="text-white/70 text-sm">@{videoData.creatorUsername}</p>
            </div>
            <Button
              variant={isSubscribed ? "secondary" : "default"}
              size="sm"
              onClick={() => setIsSubscribed(!isSubscribed)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSubscribed ? "Following" : "Follow"}
            </Button>
          </div>

          {/* Video Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1 text-white/70">
              <Eye className="w-3 h-3" />
              {formatNumber(videoData.viewCount)} views
            </div>
            <div className="flex items-center gap-1 text-white/70">
              <Zap className="w-3 h-3 text-yellow-400" />
              {videoData.tipCount} tips
            </div>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="bg-black border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Share Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4"
                onClick={() => handleShare("copy")}
              >
                <Copy className="w-6 h-6" />
                <span className="text-xs">Copy Link</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4"
                onClick={() => handleShare("twitter")}
              >
                <Share2 className="w-6 h-6" />
                <span className="text-xs">Twitter</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4"
                onClick={() => handleShare("facebook")}
              >
                <Share2 className="w-6 h-6" />
                <span className="text-xs">Facebook</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tip/Gift Dialog */}
      <Dialog open={showTipDialog} onOpenChange={setShowTipDialog}>
        <DialogContent className="bg-black border-gray-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Send Gift to @{videoData.creatorUsername}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Quick Gift Options */}
            <div className="grid grid-cols-4 gap-3">
              {giftOptions.slice(0, 8).map((gift) => (
                <Button
                  key={gift.id}
                  variant="outline"
                  className="h-16 flex flex-col items-center gap-1 p-2"
                  onClick={() => handleSendTip(gift.id)}
                >
                  <span className="text-lg">{gift.icon}</span>
                  <span className="text-xs">{gift.softPointsValue} SP</span>
                </Button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Custom Amount (SoftPoints)</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={customTipAmount}
                  onChange={(e) => setCustomTipAmount(parseInt(e.target.value) || 0)}
                  className="flex-1 bg-gray-800 border-gray-600"
                  min="1"
                  max="10000"
                />
                <Button onClick={() => handleSendTip(undefined, customTipAmount)}>
                  Send
                </Button>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Message (Optional)</label>
              <Textarea
                value={tipMessage}
                onChange={(e) => setTipMessage(e.target.value)}
                placeholder="Add a message with your tip..."
                className="bg-gray-800 border-gray-600"
                rows={2}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Battle Invite Dialog */}
      <Dialog open={showBattleInviteDialog} onOpenChange={setShowBattleInviteDialog}>
        <DialogContent className="bg-black border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Challenge to Battle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Battle Duration</label>
                <div className="flex gap-2">
                  {[60, 120, 180, 300].map((duration) => (
                    <Button
                      key={duration}
                      variant={battleConfig.duration === duration ? "default" : "outline"}
                      size="sm"
                      onClick={() => setBattleConfig({ ...battleConfig, duration })}
                    >
                      {duration / 60}m
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Entry Fee (SoftPoints)</label>
                <Slider
                  value={[battleConfig.entryFee]}
                  onValueChange={([value]) => setBattleConfig({ ...battleConfig, entryFee: value })}
                  min={5}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>5 SP</span>
                  <span className="font-medium text-white">{battleConfig.entryFee} SP</span>
                  <span>100 SP</span>
                </div>
              </div>

              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="font-medium">Prize Pool</span>
                </div>
                <div className="text-2xl font-bold text-yellow-400">
                  {formatCurrency(battleConfig.entryFee * 20)}
                </div>
                <div className="text-xs text-gray-400">
                  Winner: {formatCurrency(battleConfig.entryFee * 12)} • 
                  Runner-up: {formatCurrency(battleConfig.entryFee * 6)} • 
                  Viewers: {formatCurrency(battleConfig.entryFee * 2)}
                </div>
              </div>
            </div>

            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => handleBattleStart("opponent_user_id")}
            >
              <Sword className="w-4 h-4 mr-2" />
              Start Battle Challenge
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Duet Recorder */}
      {showDuetRecorder && (
        <VideoDuetRecorder
          originalVideo={{
            id: videoData.id,
            url: videoData.url,
            duration: videoData.duration,
            creatorId: videoData.creatorId,
            creatorUsername: videoData.creatorUsername,
            title: videoData.title,
            thumbnail: videoData.thumbnail,
            allowDuets: videoData.allowDuets,
          }}
          onClose={() => setShowDuetRecorder(false)}
          onDuetCreated={(duet) => {
            setShowDuetRecorder(false);
            onDuetCreate?.(videoData.id);
            toast({
              title: "Duet Created! 🎉",
              description: "Your duet has been published successfully",
            });
          }}
        />
      )}

      {/* Battle Interface */}
      {showBattleInterface && (
        <LiveBattleInterface
          config={{
            battleId: `battle_${Date.now()}`,
            title: `${videoData.creatorDisplayName} vs Challenger`,
            duration: battleConfig.duration,
            creator1: {
              id: videoData.creatorId,
              username: videoData.creatorUsername,
              displayName: videoData.creatorDisplayName,
              avatar: videoData.creatorAvatar,
              level: 15,
              battlesWon: 23,
              battlesLost: 7,
              winRate: 76.7,
              isLive: true,
              isHost: true,
            },
            creator2: {
              id: "opponent_user_id",
              username: "challenger",
              displayName: "Challenger",
              avatar: "https://i.pravatar.cc/150?u=challenger",
              level: 12,
              battlesWon: 18,
              battlesLost: 12,
              winRate: 60.0,
              isLive: true,
              isHost: false,
            },
            scoringMethod: "hybrid",
            allowVoting: true,
            allowGifts: true,
            entryFee: battleConfig.entryFee,
            prizePot: battleConfig.entryFee * 20,
          }}
          userRole="viewer"
          onLeave={() => setShowBattleInterface(false)}
        />
      )}
    </>
  );
};

export default EnhancedInteractiveFeatures;
