import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Share,
  Volume2,
  VolumeX,
  MoreHorizontal,
  Bookmark,
  Play,
  Pause,
  Users,
  Crown,
  Flame,
  Target,
  Clock,
  Zap,
  Gift,
  Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useVideoPlayback } from '@/hooks/use-video-playback';
import { LiveStreamData } from '@/hooks/use-live-content';
import { useToast } from '@/hooks/use-toast';

interface LiveContentCardProps {
  content: LiveStreamData;
  isActive: boolean;
  onBattleJoin?: (battleId: string) => void;
  onStreamJoin?: (streamId: string) => void;
  className?: string;
}

const LiveContentCard: React.FC<LiveContentCardProps> = ({
  content,
  isActive,
  onBattleJoin,
  onStreamJoin,
  className,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isPlaying, setIsPlaying] = useState(isActive);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const { safePlay, safePause } = useVideoPlayback();

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleVideoPlayback = async () => {
      try {
        if (isActive && isPlaying) {
          await safePlay(videoElement);
        } else {
          safePause(videoElement);
        }
      } catch (error) {
        // Video playback error handling
      }
    };

    handleVideoPlayback();
  }, [isActive, isPlaying, safePlay, safePause]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed like" : "Liked!",
      description: `${content.user.displayName}'s ${content.type}`,
    });
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Unfollowed" : "Following!",
      description: `@${content.user.username}`,
    });
  };

  const handleJoin = () => {
    if (content.type === 'battle') {
      onBattleJoin?.(content.id);
    } else {
      onStreamJoin?.(content.id);
    }
  };

  const getTimeElapsed = () => {
    const elapsed = Date.now() - content.startedAt.getTime();
    const minutes = Math.floor(elapsed / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const getBattleProgress = () => {
    if (!content.battleData?.scores) return 50;
    const total = content.battleData.scores.user1 + content.battleData.scores.user2;
    if (total === 0) return 50;
    return (content.battleData.scores.user1 / total) * 100;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("relative h-screen w-full bg-black overflow-hidden", className)}>
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
        loop
        muted={isMuted}
        playsInline
        poster={`https://images.unsplash.com/photo-${content.type === 'battle' ? '1571019613454-1cb2f99b2d8b' : '1639762681485-074b7f938ba0'}?w=400`}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      {/* Live/Battle Indicator */}
      <div className="absolute top-4 left-4 z-30">
        <Badge
          className={cn(
            "text-white font-semibold px-3 py-1 animate-pulse border-0",
            content.type === 'battle' ? "bg-red-600" : "bg-red-500"
          )}
        >
          {content.type === 'battle' ? (
            <>
              <Target className="w-3 h-3 mr-1" />
              BATTLE
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
              LIVE
            </>
          )}
        </Badge>
      </div>

      {/* Viewer Count */}
      <div className="absolute top-4 right-4 z-30">
        <div className="bg-black/50 rounded-full px-3 py-1 backdrop-blur-sm">
          <div className="flex items-center text-white text-sm">
            <Users className="w-4 h-4 mr-1" />
            <span>{content.viewerCount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Battle-specific UI */}
      {content.type === 'battle' && content.battleData && (
        <>
          {/* Battle Timer */}
          <div className="absolute top-16 left-4 z-30">
            <div className="bg-yellow-500/90 rounded-lg px-3 py-1 backdrop-blur-sm">
              <div className="flex items-center text-black text-sm font-bold">
                <Clock className="w-4 h-4 mr-1" />
                {formatTime(content.battleData.timeRemaining || 0)}
              </div>
            </div>
          </div>

          {/* Battle Scores */}
          <div className="absolute top-1/2 left-4 right-4 transform -translate-y-1/2 z-30">
            <div className="bg-black/70 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8 border-2 border-blue-400">
                    <AvatarImage src={content.user.avatar} />
                    <AvatarFallback>{content.user.displayName[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-white font-medium">{content.battleData.scores?.user1}</span>
                </div>
                <div className="text-white font-bold">VS</div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{content.battleData.scores?.user2}</span>
                  <Avatar className="w-8 h-8 border-2 border-red-400">
                    <AvatarImage src={content.battleData.opponent?.avatar} />
                    <AvatarFallback>{content.battleData.opponent?.displayName[0]}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <Progress 
                value={getBattleProgress()} 
                className="h-2 bg-gray-600"
              />
            </div>
          </div>
        </>
      )}

      {/* Content Info */}
      <div className="absolute bottom-16 left-4 right-20 z-30">
        <div className="space-y-3">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border-2 border-white">
              <AvatarImage src={content.user.avatar} />
              <AvatarFallback>{content.user.displayName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">@{content.user.username}</span>
                {content.user.verified && (
                  <Badge variant="secondary" className="bg-blue-500 text-white text-xs px-1 py-0 border-0">
                    ✓
                  </Badge>
                )}
              </div>
              <div className="text-white/80 text-sm">{getTimeElapsed()} ago</div>
            </div>
            <Button
              onClick={handleFollow}
              variant={isFollowing ? "secondary" : "outline"}
              size="sm"
              className={cn(
                "text-white font-medium border-white hover:bg-white hover:text-black",
                isFollowing && "bg-white text-black"
              )}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          </div>

          {/* Title */}
          <h3 className="text-white text-lg font-bold">{content.title}</h3>

          {/* Description */}
          <div className="text-white/90 text-sm">
            <p className={cn(!showMore && "line-clamp-2")}>
              {content.description}
            </p>
            {content.description.length > 100 && (
              <button
                onClick={() => setShowMore(!showMore)}
                className="text-white/60 hover:text-white text-xs mt-1"
              >
                {showMore ? "Show less" : "Show more"}
              </button>
            )}
          </div>

          {/* Join Button */}
          <Button
            onClick={handleJoin}
            className={cn(
              "w-full font-semibold",
              content.type === 'battle' 
                ? "bg-red-600 hover:bg-red-700 text-white" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
          >
            {content.type === 'battle' ? (
              <>
                <Trophy className="w-4 h-4 mr-2" />
                Join Battle
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Join Stream
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-16 right-4 z-30">
        <div className="flex flex-col gap-4">
          {/* Like Button */}
          <Button
            onClick={handleLike}
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 text-white flex flex-col items-center"
          >
            <Heart className={cn("w-6 h-6", isLiked && "fill-red-500 text-red-500")} />
            <span className="text-xs mt-1">2.1K</span>
          </Button>

          {/* Comment Button */}
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 text-white flex flex-col items-center"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs mt-1">456</span>
          </Button>

          {/* Share Button */}
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 text-white flex flex-col items-center"
          >
            <Share className="w-6 h-6" />
            <span className="text-xs mt-1">89</span>
          </Button>

          {/* Gift Button (for battles) */}
          {content.type === 'battle' && (
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 text-white flex flex-col items-center"
            >
              <Gift className="w-6 h-6 text-yellow-400" />
              <span className="text-xs mt-1">Gift</span>
            </Button>
          )}

          {/* Volume Button */}
          <Button
            onClick={() => setIsMuted(!isMuted)}
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 text-white"
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </Button>

          {/* More Options */}
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 text-white"
          >
            <MoreHorizontal className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveContentCard;
