import React, { useState, useRef, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import {
  Heart,
  MessageCircle,
  Share,
  Plus,
  Music,
  Volume2,
  VolumeX,
  MoreHorizontal,
  Bookmark,
  Search,
  User,
  Home,
  Sparkles,
  Award,
  Target,
  Eye,
  Users,
  ChevronUp,
  ChevronDown,
  Settings,
  Filter,
  TrendingUp,
  Maximize,
  Minimize,
  Play,
  Pause,
  X,
  Clock,
  Hash,
  Globe,
  Star,
  Zap,
  ArrowLeft,
  Camera,
  Video,
  Mic,
  UserPlus,
  Crown,
  Flame,
  Coffee,
  Gift,
  Swords,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedVideoCreator from "@/components/video/EnhancedVideoCreator";
import AdvancedVideoRecorder from "@/components/video/AdvancedVideoRecorder";
import ContentDiscoveryEngine from "@/components/video/ContentDiscoveryEngine";
import InteractiveFeatures from "@/components/video/InteractiveFeatures";
import CreatorDashboard from "@/components/video/CreatorDashboard";
import { cn } from "@/utils/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useVideoPlayback } from "@/hooks/use-video-playback";
import VirtualGiftsAndTips from "@/components/premium/VirtualGiftsAndTips";

interface VideoData {
  id: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    verified: boolean;
    followerCount?: number;
    isFollowing?: boolean;
  };
  description: string;
  music: {
    title: string;
    artist: string;
    id?: string;
    duration?: number;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
    views: string;
    saves?: number;
  };
  hashtags: string[];
  videoUrl: string;
  thumbnail: string;
  duration: number;
  timestamp?: string;
  category?: string;
  isLiveStream?: boolean;
  allowDuets?: boolean;
  allowComments?: boolean;
  hasCaption?: boolean;
  isSponsored?: boolean;
  challenge?: {
    id: string;
    title: string;
    hashtag: string;
  };
}

// Mock data for "For You" tab (trending/algorithm-based videos)
const forYouVideos: VideoData[] = [
  {
    id: "fy1",
    user: {
      id: "1",
      username: "crypto_king",
      displayName: "Crypto King",
      avatar: "https://i.pravatar.cc/150?img=1",
      verified: true,
      followerCount: 234567,
      isFollowing: false,
    },
    description:
      "Bitcoin to the moon! 🚀 Who else is holding? This AI-powered analysis shows why we're still early! #crypto #bitcoin #hodl #ai",
    music: {
      title: "Crypto Anthem",
      artist: "Digital Dreams",
      id: "crypto-anthem-1",
      duration: 30,
    },
    stats: {
      likes: 15400,
      comments: 892,
      shares: 445,
      views: "2.1M",
      saves: 3240,
    },
    hashtags: ["crypto", "bitcoin", "hodl", "moon", "ai"],
    videoUrl:
      "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400",
    duration: 30,
    timestamp: "2h",
    category: "Finance & Crypto",
    allowDuets: true,
    allowComments: true,
    hasCaption: true,
    challenge: {
      id: "crypto-prediction-2024",
      title: "Crypto Prediction Challenge",
      hashtag: "CryptoPrediction2024",
    },
  },
  {
    id: "fy2",
    user: {
      id: "2",
      username: "dance_queen",
      displayName: "Dance Queen",
      avatar: "https://i.pravatar.cc/150?img=15",
      verified: true,
      followerCount: 1200000,
      isFollowing: false,
    },
    description:
      "Teaching you the hottest dance moves! 💃 Follow for more dance tutorials #dance #viral #tutorial",
    music: {
      title: "Viral Hit 2024",
      artist: "DJ TrendMaker",
      id: "viral-hit-1",
      duration: 45,
    },
    stats: {
      likes: 89000,
      comments: 5670,
      shares: 2340,
      views: "8.9M",
      saves: 12000,
    },
    hashtags: ["dance", "viral", "tutorial", "trending"],
    videoUrl:
      "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=400",
    duration: 45,
    timestamp: "4h",
    category: "Dance & Entertainment",
    allowDuets: true,
    allowComments: true,
    hasCaption: false,
  },
  {
    id: "fy3",
    user: {
      id: "3",
      username: "tech_guru",
      displayName: "Tech Guru",
      avatar: "https://i.pravatar.cc/150?img=8",
      verified: true,
      followerCount: 567890,
      isFollowing: false,
    },
    description:
      "Mind-blowing AI tools you NEED to try! 🤯 This changes everything! Link in bio #ai #tech #tools",
    music: {
      title: "Future Tech",
      artist: "Synthwave Studios",
    },
    stats: {
      likes: 45600,
      comments: 2890,
      shares: 1230,
      views: "3.4M",
    },
    hashtags: ["ai", "tech", "tools", "mindblown"],
    videoUrl:
      "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400",
    duration: 35,
    timestamp: "6h",
    category: "Technology",
  },
];

// Mock data for "Live" tab (live streaming videos)
const liveVideos: VideoData[] = [
  {
    id: "live1",
    user: {
      id: "live1",
      username: "live_streamer",
      displayName: "Live Streamer",
      avatar: "https://i.pravatar.cc/150?img=25",
      verified: true,
      followerCount: 45000,
      isFollowing: false,
    },
    description:
      "🔴 LIVE: Trading crypto in real time! Ask me anything about the markets 📈 #live #crypto #trading",
    music: {
      title: "Live Stream Audio",
      artist: "Real Time",
    },
    stats: {
      likes: 2340,
      comments: 156,
      shares: 23,
      views: "1.2K watching",
    },
    hashtags: ["live", "crypto", "trading", "realtime"],
    videoUrl:
      "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400",
    duration: 0,
    timestamp: "Live",
    category: "Live Stream",
    isLiveStream: true,
    allowDuets: false,
    allowComments: true,
    hasCaption: false,
  },
  {
    id: "live2",
    user: {
      id: "live2",
      username: "music_live",
      displayName: "DJ LiveMix",
      avatar: "https://i.pravatar.cc/150?img=30",
      verified: false,
      followerCount: 12000,
      isFollowing: false,
    },
    description:
      "🎵 Live DJ set from my studio! Drop song requests in chat 🎧 #live #dj #music",
    music: {
      title: "Live DJ Mix",
      artist: "DJ LiveMix",
    },
    stats: {
      likes: 890,
      comments: 67,
      shares: 12,
      views: "456 watching",
    },
    hashtags: ["live", "dj", "music", "requests"],
    videoUrl:
      "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    duration: 0,
    timestamp: "Live",
    category: "Music",
    isLiveStream: true,
    allowDuets: false,
    allowComments: true,
    hasCaption: false,
  },
];

// Mock data for "Battle" tab (battle/competition videos)
const battleVideos: VideoData[] = [
  {
    id: "battle1",
    user: {
      id: "battle1",
      username: "dance_warrior",
      displayName: "Dance Warrior",
      avatar: "https://i.pravatar.cc/150?img=18",
      verified: true,
      followerCount: 67000,
      isFollowing: false,
    },
    description:
      "⚔️ Dance Battle Finals! Vote for the winner! 💃🕺 #battle #dance #competition #vote",
    music: {
      title: "Battle Beats",
      artist: "Competition Mix",
    },
    stats: {
      likes: 15600,
      comments: 2340,
      shares: 890,
      views: "3.4M",
    },
    hashtags: ["battle", "dance", "competition", "vote"],
    videoUrl:
      "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=400",
    duration: 60,
    timestamp: "1h",
    category: "Battle",
    allowDuets: true,
    allowComments: true,
    hasCaption: true,
    challenge: {
      id: "dance-battle-2024",
      title: "Ultimate Dance Battle",
      hashtag: "DanceBattle2024",
    },
  },
  {
    id: "battle2",
    user: {
      id: "battle2",
      username: "rap_king",
      displayName: "Rap King",
      avatar: "https://i.pravatar.cc/150?img=22",
      verified: false,
      followerCount: 23000,
      isFollowing: false,
    },
    description:
      "🎤 Rap Battle Championship! Who won this round? 🔥 #battle #rap #hiphop #fire",
    music: {
      title: "Rap Battle Beat",
      artist: "Beat Maker",
    },
    stats: {
      likes: 8900,
      comments: 1200,
      shares: 445,
      views: "1.8M",
    },
    hashtags: ["battle", "rap", "hiphop", "fire"],
    videoUrl:
      "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    duration: 45,
    timestamp: "3h",
    category: "Battle",
    allowDuets: true,
    allowComments: true,
    hasCaption: false,
  },
];

// Mock data for "Following" tab (videos from followed users)
const followingVideos: VideoData[] = [
  {
    id: "fl1",
    user: {
      id: "4",
      username: "my_friend_alex",
      displayName: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?img=12",
      verified: false,
      followerCount: 1234,
      isFollowing: true,
    },
    description:
      "Just got my new camera! Testing it out 📸 What do you think? #photography #newgear",
    music: {
      title: "Chill Vibes",
      artist: "Lofi Beats",
    },
    stats: {
      likes: 234,
      comments: 45,
      shares: 12,
      views: "2.3K",
    },
    hashtags: ["photography", "newgear", "test"],
    videoUrl:
      "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
    duration: 25,
    timestamp: "1h",
    category: "Photography",
  },
  {
    id: "fl2",
    user: {
      id: "5",
      username: "fitness_sarah",
      displayName: "Sarah Fit",
      avatar: "https://i.pravatar.cc/150?img=20",
      verified: false,
      followerCount: 8900,
      isFollowing: true,
    },
    description:
      "Morning workout routine! Who's joining me? 💪 #fitness #workout #morning",
    music: {
      title: "Pump It Up",
      artist: "Workout Beats",
    },
    stats: {
      likes: 1200,
      comments: 189,
      shares: 67,
      views: "12K",
    },
    hashtags: ["fitness", "workout", "morning", "motivation"],
    videoUrl:
      "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    duration: 40,
    timestamp: "3h",
    category: "Fitness",
  },
];

const VideoCard: React.FC<{
  video: VideoData;
  isActive: boolean;
  showControls?: boolean;
}> = ({ video, isActive, showControls = true }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [isPlaying, setIsPlaying] = useState(isActive);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(
    video.user.isFollowing || false,
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();
  const { safePlay, safePause, togglePlayback } = useVideoPlayback();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isComponentMounted = true;

    const handleVideoPlayback = async () => {
      if (!isComponentMounted) return;

      try {
        if (isActive && isPlaying) {
          await safePlay(video);
        } else {
          safePause(video);
        }
      } catch (error) {
        // Errors are already handled in the hook
      }
    };

    handleVideoPlayback();

    return () => {
      isComponentMounted = false;
      if (video) {
        safePause(video);
      }
    };
  }, [isActive, isPlaying, safePlay, safePause]);

  const togglePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    await togglePlayback(video, isPlaying, setIsPlaying);
  }, [isPlaying, togglePlayback]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const description = video.description;
  const truncatedDescription =
    description.length > 100
      ? description.substring(0, 100) + "..."
      : description;

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Add haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    // Add heart animation class temporarily
    const button = document.querySelector(
      `[data-video-id="${video.id}"] .like-button`,
    );
    if (button) {
      button.classList.add("tiktok-heart-animation");
      setTimeout(() => button.classList.remove("tiktok-heart-animation"), 600);
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div
      className="relative h-screen w-full bg-black snap-start snap-always"
      data-video-id={video.id}
    >
      {/* Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        preload="metadata"
        poster={video.thumbnail}
        onClick={togglePlay}
      >
        <source src={video.videoUrl} type="video/mp4" />
      </video>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/40" />

      {/* Challenge Banner - TikTok style */}
      {video.challenge && showControls && (
        <div className="absolute top-12 left-4 right-24 z-30">
          <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-md border border-white/20 rounded-full px-3 py-2">
            <div className="flex items-center gap-2">
              <Flame className="w-3 h-3 text-orange-400" />
              <span className="text-white text-sm font-semibold">
                #{video.challenge.hashtag}
              </span>
              <Badge
                variant="secondary"
                className="bg-white/20 text-white text-xs border-0"
              >
                Trending
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Play/Pause overlay - TikTok style */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="icon"
            variant="ghost"
            className="w-20 h-20 rounded-full bg-black/40 hover:bg-black/60 border-2 border-white/30 backdrop-blur-sm"
            onClick={togglePlay}
          >
            <Play className="w-10 h-10 text-white fill-white ml-1" />
          </Button>
        </div>
      )}

      {/* Main content overlay - TikTok layout */}
      <div className="absolute inset-0 flex">
        {/* Left side - User info and description */}
        <div className="flex-1 flex flex-col justify-end p-4 pb-32 md:pb-8">
          <div className="space-y-3 max-w-[75%]">
            {/* User info with follow button */}
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 border-2 border-white/30">
                <AvatarImage src={video.user.avatar} />
                <AvatarFallback>{video.user.displayName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-base truncate">
                    @{video.user.username}
                  </span>
                  {video.user.verified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                  {video.isLiveStream && (
                    <Badge className="bg-red-500 text-white text-xs animate-pulse border-0">
                      LIVE
                    </Badge>
                  )}
                </div>
                {video.user.followerCount && (
                  <div className="text-white/80 text-sm">
                    {formatNumber(video.user.followerCount)} followers
                  </div>
                )}
              </div>
              {!isFollowing && (
                <Button
                  size="sm"
                  onClick={handleFollow}
                  className="bg-red-500 hover:bg-red-600 text-white border-0 rounded-md px-4 py-1.5 text-sm font-semibold tiktok-follow-pulse"
                >
                  Follow
                </Button>
              )}
            </div>

            {/* Description */}
            <div className="text-white">
              <p className="text-base leading-relaxed mb-2">
                {showMore ? description : truncatedDescription}
                {description.length > 100 && (
                  <button
                    onClick={() => setShowMore(!showMore)}
                    className="text-white/80 ml-1 underline text-sm"
                  >
                    {showMore ? "less" : "more"}
                  </button>
                )}
              </p>

              {/* Hashtags */}
              <div className="flex flex-wrap gap-1">
                {video.hashtags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="text-blue-300 text-base font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Music info - TikTok style */}
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-2 w-fit">
              <Music className="w-4 h-4 text-white flex-shrink-0" />
              <span className="text-white text-sm truncate max-w-[200px]">
                {video.music.title} - {video.music.artist}
              </span>
            </div>

            {/* Video metadata */}
            <div className="flex items-center gap-3 text-white/70 text-sm">
              {video.timestamp && <span>{video.timestamp}</span>}
              {video.category && (
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-0 text-xs"
                >
                  {video.category}
                </Badge>
              )}
              {video.hasCaption && (
                <Badge
                  variant="secondary"
                  className="bg-blue-500/30 text-blue-200 border-0 text-xs"
                >
                  CC
                </Badge>
              )}
              {video.isSponsored && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-500/30 text-yellow-200 border-0 text-xs"
                >
                  Sponsored
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Action buttons (TikTok style) */}
        <div className="flex flex-col items-center justify-end gap-3 p-2 pb-28 md:pb-8 w-14">
          {/* User avatar with follow button overlay */}
          <div className="relative mb-3">
            <Avatar className="w-10 h-10 border-2 border-white">
              <AvatarImage src={video.user.avatar} />
              <AvatarFallback>{video.user.displayName[0]}</AvatarFallback>
            </Avatar>
            {!isFollowing && (
              <Button
                size="sm"
                onClick={handleFollow}
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-red-500 hover:bg-red-600 p-0 border-2 border-white"
              >
                <Plus className="w-2.5 h-2.5 text-white" />
              </Button>
            )}
          </div>

          {/* Like button */}
          <div className="flex flex-col items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleLike}
              className={cn(
                "like-button w-12 h-12 rounded-full transition-all duration-200",
                isLiked
                  ? "bg-red-500/20 text-red-500 scale-105"
                  : "bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm",
              )}
            >
              <Heart
                className={cn(
                  "w-7 h-7",
                  isLiked ? "fill-red-500 text-red-500" : "",
                )}
              />
            </Button>
            <span className="text-white text-xs font-semibold">
              {formatNumber(video.stats.likes + (isLiked ? 1 : 0))}
            </span>
          </div>

          {/* Comments */}
          <div className="flex flex-col items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="w-12 h-12 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm"
            >
              <MessageCircle className="w-7 h-7" />
            </Button>
            <span className="text-white text-xs font-semibold">
              {formatNumber(video.stats.comments)}
            </span>
          </div>

          {/* Gift button */}
          <div className="flex flex-col items-center gap-1">
            <VirtualGiftsAndTips
              recipientId={video.user.id}
              recipientName={video.user.displayName}
              trigger={
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-12 h-12 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm"
                >
                  <Gift className="w-7 h-7" />
                </Button>
              }
            />
            <span className="text-white text-xs font-semibold">Gift</span>
          </div>

          {/* Bookmark */}
          <div className="flex flex-col items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={cn(
                "w-12 h-12 rounded-full transition-all duration-200 backdrop-blur-sm",
                isBookmarked
                  ? "bg-yellow-500/20 text-yellow-500"
                  : "bg-black/30 text-white hover:bg-black/50",
              )}
            >
              <Bookmark
                className={cn(
                  "w-7 h-7",
                  isBookmarked ? "fill-yellow-500 text-yellow-500" : "",
                )}
              />
            </Button>
            {video.stats.saves && (
              <span className="text-white text-xs font-semibold">
                {formatNumber(video.stats.saves)}
              </span>
            )}
          </div>

          {/* Share */}
          <div className="flex flex-col items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="w-12 h-12 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm"
            >
              <Share className="w-7 h-7" />
            </Button>
            <span className="text-white text-xs font-semibold">
              {formatNumber(video.stats.shares)}
            </span>
          </div>

          {/* More options */}
          <Button
            size="icon"
            variant="ghost"
            className="w-12 h-12 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm"
          >
            <MoreHorizontal className="w-7 h-7" />
          </Button>

          {/* Rotating disc for music - TikTok style */}
          <div className="relative mt-2">
            <div className="w-11 h-11 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center tiktok-disc-spin">
              <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center">
                <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Volume control */}
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-16 right-3 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 border-none z-30"
        onClick={() => setIsMuted(!isMuted)}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-white" />
        ) : (
          <Volume2 className="w-4 h-4 text-white" />
        )}
      </Button>

      {/* Views badge */}
      <div className="absolute top-4 left-4 z-30">
        <Badge className="bg-black/50 text-white border-0 backdrop-blur-sm text-xs">
          <Eye className="w-3 h-3 mr-1" />
          {video.stats.views}
        </Badge>
      </div>
    </div>
  );
};

const TikTokStyleVideos: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"live" | "battle" | "foryou" | "following">("foryou");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isAdvancedRecorderOpen, setIsAdvancedRecorderOpen] = useState(false);
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const currentVideos =
    activeTab === "live" ? liveVideos :
    activeTab === "battle" ? battleVideos :
    activeTab === "foryou" ? forYouVideos :
    followingVideos;

  // Auto-hide controls after inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [showControls]);

  // Handle scroll to change videos
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const videoHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / videoHeight);

      if (
        newIndex !== currentVideoIndex &&
        newIndex >= 0 &&
        newIndex < currentVideos.length
      ) {
        setCurrentVideoIndex(newIndex);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentVideoIndex, currentVideos.length]);

  // Reset video index when switching tabs
  useEffect(() => {
    setCurrentVideoIndex(0);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const handleVideoCreated = (videoFile: File, metadata: any) => {
    // Handle video creation - would typically upload to server
    setIsAdvancedRecorderOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden z-10">
      <Helmet>
        <title>Videos | SoftChat</title>
        <meta
          name="description"
          content="Discover trending videos and content from creators you follow"
        />
      </Helmet>

      {/* Enhanced header with 6 elements */}
      {showControls && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 via-black/50 to-transparent">
          <div className="flex items-center justify-between p-2 sm:p-4 pt-6 sm:pt-8">
            {/* Left side - Search */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearchOverlay(true)}
                className="text-white hover:bg-white/20 w-8 h-8 sm:w-10 sm:h-10"
                title="Search"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>

            {/* Central tabs - 4 tabs in responsive layout */}
            <div className="flex-1 flex justify-center px-2 sm:px-4">
              <Tabs
                value={activeTab}
                onValueChange={(value) =>
                  setActiveTab(value as "live" | "battle" | "foryou" | "following")
                }
                className="w-full max-w-md"
              >
                <TabsList className="bg-transparent border-0 h-auto p-0 grid grid-cols-4 gap-1 sm:gap-3 w-full">
                  <TabsTrigger
                    value="live"
                    className={cn(
                      "bg-transparent border-0 text-xs sm:text-sm font-semibold px-1 sm:px-2 pb-1 sm:pb-2 data-[state=active]:bg-transparent flex items-center gap-1",
                      "data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-red-500",
                      "text-white/60 hover:text-white transition-colors",
                    )}
                    title="Live Streams"
                  >
                    <Radio className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Live</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="battle"
                    className={cn(
                      "bg-transparent border-0 text-xs sm:text-sm font-semibold px-1 sm:px-2 pb-1 sm:pb-2 data-[state=active]:bg-transparent flex items-center gap-1",
                      "data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-orange-500",
                      "text-white/60 hover:text-white transition-colors",
                    )}
                    title="Battles"
                  >
                    <Swords className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Battle</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="foryou"
                    className={cn(
                      "bg-transparent border-0 text-xs sm:text-sm font-semibold px-1 sm:px-2 pb-1 sm:pb-2 data-[state=active]:bg-transparent",
                      "data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white",
                      "text-white/60 hover:text-white transition-colors",
                    )}
                    title="For You"
                  >
                    <span className="hidden xs:inline">For You</span>
                    <span className="xs:hidden text-[10px]">You</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="following"
                    className={cn(
                      "bg-transparent border-0 text-xs sm:text-sm font-semibold px-1 sm:px-2 pb-1 sm:pb-2 data-[state=active]:bg-transparent",
                      "data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white",
                      "text-white/60 hover:text-white transition-colors",
                    )}
                    title="Following"
                  >
                    <span className="hidden xs:inline">Following</span>
                    <span className="xs:hidden text-[10px]">Follow</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Right side - Create button and menu */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                onClick={() => setIsAdvancedRecorderOpen(true)}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg w-8 h-8 sm:w-10 sm:h-10 p-0"
                title="Create Video"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 w-8 h-8 sm:w-10 sm:h-10"
                title="More options"
              >
                <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Video content area */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        style={{
          scrollBehavior: "smooth",
          paddingBottom: isMobile ? "80px" : "20px",
        }}
        onClick={() => setShowControls(!showControls)}
      >
        <Tabs value={activeTab} className="h-full">
          <TabsContent value="live" className="h-full mt-0">
            {liveVideos.length > 0 ? (
              liveVideos.map((video, index) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  isActive={index === currentVideoIndex && activeTab === "live"}
                  showControls={showControls}
                />
              ))
            ) : (
              <div className="h-screen flex flex-col items-center justify-center text-white p-8">
                <Radio className="w-24 h-24 text-red-400 mb-6" />
                <h3 className="text-2xl font-bold mb-4">No live streams</h3>
                <p className="text-white/70 text-center text-lg leading-relaxed mb-8 max-w-sm">
                  No one is streaming right now. Check back later or start your own live stream!
                </p>
                <Button
                  onClick={() => setIsAdvancedRecorderOpen(true)}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg font-semibold rounded-xl"
                >
                  Go Live
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="battle" className="h-full mt-0">
            {battleVideos.length > 0 ? (
              battleVideos.map((video, index) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  isActive={index === currentVideoIndex && activeTab === "battle"}
                  showControls={showControls}
                />
              ))
            ) : (
              <div className="h-screen flex flex-col items-center justify-center text-white p-8">
                <Swords className="w-24 h-24 text-orange-400 mb-6" />
                <h3 className="text-2xl font-bold mb-4">No battles yet</h3>
                <p className="text-white/70 text-center text-lg leading-relaxed mb-8 max-w-sm">
                  No battle videos available. Create one to start competing with other creators!
                </p>
                <Button
                  onClick={() => setIsAdvancedRecorderOpen(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold rounded-xl"
                >
                  Start Battle
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="foryou" className="h-full mt-0">
            {forYouVideos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                isActive={index === currentVideoIndex && activeTab === "foryou"}
                showControls={showControls}
              />
            ))}
          </TabsContent>
          <TabsContent value="following" className="h-full mt-0">
            {followingVideos.length > 0 ? (
              followingVideos.map((video, index) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  isActive={
                    index === currentVideoIndex && activeTab === "following"
                  }
                  showControls={showControls}
                />
              ))
            ) : (
              <div className="h-screen flex flex-col items-center justify-center text-white p-8">
                <UserPlus className="w-24 h-24 text-white/40 mb-6" />
                <h3 className="text-2xl font-bold mb-4">No videos yet</h3>
                <p className="text-white/70 text-center text-lg leading-relaxed mb-8 max-w-sm">
                  Follow creators to see their latest videos here. Discover
                  amazing creators in the For You tab!
                </p>
                <Button
                  onClick={() => setActiveTab("foryou")}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg font-semibold rounded-xl"
                >
                  Discover creators
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick actions - moved to bottom right */}
      <div className="fixed bottom-28 md:bottom-12 right-2 z-40 flex flex-col gap-2">
        {/* Creator Dashboard */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDashboardOpen(true)}
          className="w-11 h-11 rounded-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 backdrop-blur-sm"
          title="Creator Studio"
        >
          <Crown className="w-5 h-5" />
        </Button>

        {/* Discover */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDiscoveryOpen(true)}
          className="w-11 h-11 rounded-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 backdrop-blur-sm"
          title="Discover Trends"
        >
          <TrendingUp className="w-5 h-5" />
        </Button>
      </div>

      {/* Navigation hint */}
      {showControls && currentVideos.length > 1 && (
        <div className="absolute bottom-36 md:bottom-20 left-1/2 transform -translate-x-1/2 z-30">
          <div className="flex flex-col items-center gap-1 text-white/50">
            <ChevronUp className="w-5 h-5 animate-bounce" />
            <span className="text-xs">Swipe up</span>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {showSearchOverlay && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-60 flex flex-col">
          <div className="flex items-center gap-3 p-4 pt-12">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearchOverlay(false)}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos, sounds, or creators"
                className="pl-10 pr-4 py-3 bg-gray-800 border-gray-600 text-white text-lg rounded-xl"
                autoFocus
              />
            </div>
          </div>

          {/* Search suggestions */}
          <div className="flex-1 p-4">
            {searchQuery ? (
              <div>
                <p className="text-gray-400 text-sm mb-4">
                  Search results for "{searchQuery}"
                </p>
                <p className="text-white">
                  No results found. Try a different search term.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-semibold mb-3">Trending</h3>
                  <div className="space-y-2">
                    {["#crypto", "#dance", "#ai", "#tech", "#viral"].map(
                      (tag) => (
                        <div
                          key={tag}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10"
                        >
                          <Hash className="w-5 h-5 text-blue-400" />
                          <span className="text-white">{tag}</span>
                          <TrendingUp className="w-4 h-4 text-green-400 ml-auto" />
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Advanced Video Recorder */}
      {isAdvancedRecorderOpen && (
        <AdvancedVideoRecorder
          onClose={() => setIsAdvancedRecorderOpen(false)}
          onVideoCreated={handleVideoCreated}
        />
      )}

      {/* Content Discovery Engine */}
      <Dialog open={isDiscoveryOpen} onOpenChange={setIsDiscoveryOpen}>
        <DialogContent className="max-w-4xl w-[95vw] h-[90vh] bg-black border-gray-800 p-0">
          <VisuallyHidden>
            <DialogTitle>Content Discovery</DialogTitle>
          </VisuallyHidden>
          <ContentDiscoveryEngine
            onHashtagSelect={(hashtag) => {
              setSearchQuery(`#${hashtag}`);
              setIsDiscoveryOpen(false);
            }}
            onSoundSelect={(soundId) => {
              setIsDiscoveryOpen(false);
              setIsAdvancedRecorderOpen(true);
            }}
            onChallengeSelect={(challengeId) => {
              setIsDiscoveryOpen(false);
              setIsAdvancedRecorderOpen(true);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Creator Dashboard */}
      <Dialog open={isDashboardOpen} onOpenChange={setIsDashboardOpen}>
        <DialogContent className="max-w-6xl w-[95vw] h-[90vh] bg-gray-900 border-gray-700 p-0">
          <VisuallyHidden>
            <DialogTitle>Creator Dashboard</DialogTitle>
          </VisuallyHidden>
          <div className="h-full overflow-auto p-6">
            <CreatorDashboard />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TikTokStyleVideos;
