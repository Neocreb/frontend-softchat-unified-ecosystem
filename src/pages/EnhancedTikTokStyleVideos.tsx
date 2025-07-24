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
  Radio,
  Circle,
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
import { feedService } from "@/services/feedService";

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
  isFromFeed?: boolean; // Flag to identify feed videos
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

interface LiveStreamData {
  id: string;
  title: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    verified: boolean;
    followerCount?: number;
  };
  viewers: number;
  category: string;
  thumbnail: string;
  isLive: boolean;
  startedAt: string;
  tags: string[];
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
];

// Mock data for "Live" tab (live streams)
const liveStreams: LiveStreamData[] = [
  {
    id: "live1",
    title: "Crypto Market Analysis - Live Trading Session 📈",
    user: {
      id: "5",
      username: "trading_pro",
      displayName: "Trading Pro",
      avatar: "https://i.pravatar.cc/150?img=25",
      verified: true,
      followerCount: 45000,
    },
    viewers: 1247,
    category: "Finance & Trading",
    thumbnail:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400",
    isLive: true,
    startedAt: "30m",
    tags: ["crypto", "trading", "live", "btc"],
  },
  {
    id: "live2",
    title: "Cooking Live: Making Perfect Pasta 🍝",
    user: {
      id: "6",
      username: "chef_maria",
      displayName: "Chef Maria",
      avatar: "https://i.pravatar.cc/150?img=30",
      verified: false,
      followerCount: 8900,
    },
    viewers: 567,
    category: "Food & Cooking",
    thumbnail:
      "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400",
    isLive: true,
    startedAt: "15m",
    tags: ["cooking", "pasta", "recipe", "live"],
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

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  return (
    <div className="relative h-screen w-full snap-start bg-black flex items-center justify-center">
      {/* Video */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        preload="metadata"
        poster={video.thumbnail}
        onClick={togglePlay}
      />

      {/* Challenge banner (if exists) */}
      {video.challenge && showControls && (
        <div className="absolute top-20 left-4 right-4 z-30">
          <div className="bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">
                  {video.challenge.title}
                </p>
                <p className="text-white/80 text-xs">
                  #{video.challenge.hashtag}
                </p>
              </div>
              <Button
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 text-xs px-3 py-1"
              >
                Join
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Left side - User info and description */}
      {showControls && (
        <div className="absolute bottom-6 left-4 right-20 z-30 text-white">
          {/* User info */}
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-12 h-12 border-2 border-white/30">
              <AvatarImage src={video.user.avatar} />
              <AvatarFallback>{video.user.username[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base">
                  {video.user.displayName}
                </span>
                {video.user.verified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
                {video.isFromFeed && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                    From Feed
                  </Badge>
                )}
              </div>
              <p className="text-white/70 text-sm">@{video.user.username}</p>
            </div>
            {!isFollowing && (
              <Button
                onClick={handleFollow}
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white border-0 px-4 py-1 rounded-lg font-semibold"
              >
                Follow
              </Button>
            )}
          </div>

          {/* Description */}
          <div className="mb-3">
            <p className="text-white text-sm leading-relaxed">
              {showMore
                ? video.description
                : video.description.length > 100
                  ? `${video.description.slice(0, 100)}...`
                  : video.description}
              {video.description.length > 100 && (
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="text-white/70 text-sm ml-2 underline"
                >
                  {showMore ? "Show less" : "Show more"}
                </button>
              )}
            </p>

            {/* Hashtags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {video.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="text-white/80 text-sm font-medium cursor-pointer hover:text-white"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Music info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-spin-slow">
              <Music className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/90 text-sm font-medium truncate">
                {video.music.title} • {video.music.artist}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Right side - Action buttons */}
      {showControls && (
        <div className="absolute bottom-20 right-4 z-30 flex flex-col gap-6">
          {/* Like button */}
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLike}
              className={cn(
                "w-12 h-12 rounded-full backdrop-blur-sm border",
                isLiked
                  ? "bg-red-500/20 border-red-500/50 text-red-400"
                  : "bg-black/30 border-white/20 text-white hover:bg-white/20"
              )}
            >
              <Heart
                className={cn("w-6 h-6", isLiked && "fill-current")}
              />
            </Button>
            <span className="text-white text-xs mt-1 font-medium">
              {(video.stats.likes + (isLiked ? 1 : 0)).toLocaleString()}
            </span>
          </div>

          {/* Comment button */}
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full bg-black/30 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
            <span className="text-white text-xs mt-1 font-medium">
              {video.stats.comments.toLocaleString()}
            </span>
          </div>

          {/* Share button */}
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full bg-black/30 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <Share className="w-6 h-6" />
            </Button>
            <span className="text-white text-xs mt-1 font-medium">
              {video.stats.shares.toLocaleString()}
            </span>
          </div>

          {/* Bookmark button */}
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmark}
              className={cn(
                "w-12 h-12 rounded-full backdrop-blur-sm border",
                isBookmarked
                  ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400"
                  : "bg-black/30 border-white/20 text-white hover:bg-white/20"
              )}
            >
              <Bookmark
                className={cn("w-6 h-6", isBookmarked && "fill-current")}
              />
            </Button>
          </div>

          {/* Gift button */}
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 backdrop-blur-sm"
            >
              <Gift className="w-6 h-6" />
            </Button>
          </div>

          {/* Profile picture */}
          <div className="flex flex-col items-center mt-2">
            <div className="relative">
              <Avatar className="w-12 h-12 border-2 border-white">
                <AvatarImage src={video.user.avatar} />
                <AvatarFallback>{video.user.username[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              {!isFollowing && (
                <Button
                  onClick={handleFollow}
                  size="icon"
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full border-2 border-white"
                >
                  <Plus className="w-3 h-3 text-white" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mute/Unmute button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleMute}
        className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/50 border border-white/20 text-white hover:bg-black/70 backdrop-blur-sm"
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

const LiveStreamCard: React.FC<{
  stream: LiveStreamData;
  showControls?: boolean;
}> = ({ stream, showControls = true }) => {
  return (
    <div className="relative h-screen w-full snap-start bg-black flex items-center justify-center">
      {/* Live stream thumbnail/video placeholder */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${stream.thumbnail})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Live indicator */}
      <div className="absolute top-4 left-4 z-30">
        <div className="flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full">
          <Circle className="w-3 h-3 text-white fill-current animate-pulse" />
          <span className="text-white text-sm font-semibold">LIVE</span>
        </div>
      </div>

      {/* Viewer count */}
      <div className="absolute top-4 right-4 z-30">
        <Badge className="bg-black/50 text-white border-0 backdrop-blur-sm text-xs">
          <Users className="w-3 h-3 mr-1" />
          {stream.viewers.toLocaleString()}
        </Badge>
      </div>

      {/* Stream info */}
      {showControls && (
        <div className="absolute bottom-6 left-4 right-20 z-30 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-12 h-12 border-2 border-white/30">
              <AvatarImage src={stream.user.avatar} />
              <AvatarFallback>{stream.user.username[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base">
                  {stream.user.displayName}
                </span>
                {stream.user.verified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <p className="text-white/70 text-sm">@{stream.user.username}</p>
            </div>
          </div>

          <div className="mb-3">
            <h3 className="text-white text-lg font-semibold mb-2">{stream.title}</h3>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <span>{stream.category}</span>
              <span>•</span>
              <span>Started {stream.startedAt} ago</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {stream.tags.map((tag) => (
              <span
                key={tag}
                className="text-white/80 text-sm font-medium cursor-pointer hover:text-white"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Join live stream button */}
      <div className="absolute bottom-20 right-4 z-30">
        <Button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold">
          <Radio className="w-4 h-4 mr-2" />
          Join Live
        </Button>
      </div>
    </div>
  );
};

const EnhancedTikTokStyleVideos: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"foryou" | "following" | "live">("foryou");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isAdvancedRecorderOpen, setIsAdvancedRecorderOpen] = useState(false);
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [feedVideos, setFeedVideos] = useState<VideoData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const currentVideos = activeTab === "foryou" 
    ? [...forYouVideos, ...feedVideos] 
    : activeTab === "following" 
    ? followingVideos 
    : [];

  // Load videos from feed
  useEffect(() => {
    const loadFeedVideos = async () => {
      try {
        // This would be replaced with actual API call to get posts with videos
        // For now, we'll simulate it
        const mockFeedVideos: VideoData[] = [];
        setFeedVideos(mockFeedVideos);
      } catch (error) {
        console.error("Error loading feed videos:", error);
      }
    };

    loadFeedVideos();
  }, []);

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
        newIndex < (activeTab === "live" ? liveStreams.length : currentVideos.length)
      ) {
        setCurrentVideoIndex(newIndex);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentVideoIndex, currentVideos.length, activeTab]);

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
          content="Discover trending videos, live streams and content from creators you follow"
        />
      </Helmet>

      {/* Enhanced TikTok-style header with Live tab */}
      {showControls && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center justify-between p-4 pt-8">
            {/* Search and Live buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Users className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearchOverlay(true)}
                className="text-white hover:bg-white/20"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>

            {/* Central tabs - Enhanced TikTok style with Live tab */}
            <div className="flex-1 flex justify-center">
              <Tabs
                value={activeTab}
                onValueChange={(value) =>
                  setActiveTab(value as "foryou" | "following" | "live")
                }
                className="w-auto"
              >
                <TabsList className="bg-transparent border-0 h-auto p-0 space-x-6">
                  <TabsTrigger
                    value="live"
                    className={cn(
                      "bg-transparent border-0 text-lg font-semibold px-0 pb-2 data-[state=active]:bg-transparent",
                      "data-[state=active]:text-red-400 data-[state=active]:border-b-2 data-[state=active]:border-red-400",
                      "text-white/60 hover:text-white transition-colors flex items-center gap-2",
                    )}
                  >
                    <Radio className="w-4 h-4" />
                    Live
                  </TabsTrigger>
                  <TabsTrigger
                    value="foryou"
                    className={cn(
                      "bg-transparent border-0 text-lg font-semibold px-0 pb-2 data-[state=active]:bg-transparent",
                      "data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white",
                      "text-white/60 hover:text-white transition-colors",
                    )}
                  >
                    For You
                  </TabsTrigger>
                  <TabsTrigger
                    value="following"
                    className={cn(
                      "bg-transparent border-0 text-lg font-semibold px-0 pb-2 data-[state=active]:bg-transparent",
                      "data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white",
                      "text-white/60 hover:text-white transition-colors",
                    )}
                  >
                    Following
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Coffee className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <MoreHorizontal className="w-5 h-5" />
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
            {liveStreams.length > 0 ? (
              liveStreams.map((stream, index) => (
                <LiveStreamCard
                  key={stream.id}
                  stream={stream}
                  showControls={showControls}
                />
              ))
            ) : (
              <div className="h-screen flex flex-col items-center justify-center text-white p-8">
                <Radio className="w-24 h-24 text-white/40 mb-6" />
                <h3 className="text-2xl font-bold mb-4">No live streams</h3>
                <p className="text-white/70 text-center text-lg leading-relaxed mb-8 max-w-sm">
                  No one is live right now. Check back later or discover
                  creators in the For You tab!
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
          <TabsContent value="foryou" className="h-full mt-0">
            {currentVideos.map((video, index) => (
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

      {/* Enhanced floating action buttons - optimized positioning */}
      <div className="fixed bottom-6 right-4 z-40 flex flex-col gap-3">
        {/* Creator Dashboard */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDashboardOpen(true)}
          className="w-12 h-12 rounded-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 backdrop-blur-sm shadow-lg"
          title="Creator Studio"
        >
          <Crown className="w-5 h-5" />
        </Button>

        {/* Discover */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDiscoveryOpen(true)}
          className="w-12 h-12 rounded-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 backdrop-blur-sm shadow-lg"
          title="Discover Trends"
        >
          <TrendingUp className="w-5 h-5" />
        </Button>
      </div>

      {/* Main create button - repositioned to center bottom for better access */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <Button
          onClick={() => setIsAdvancedRecorderOpen(true)}
          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-2xl w-16 h-16 shadow-xl transition-all duration-200 hover:scale-105 relative overflow-hidden"
          title="Create Video"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 opacity-30 animate-pulse"></div>
          <Plus className="h-8 w-8 relative z-10" />
        </Button>
      </div>

      {/* Navigation hint */}
      {showControls && ((activeTab === "live" && liveStreams.length > 1) || (activeTab !== "live" && currentVideos.length > 1)) && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-30">
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
                    {["#crypto", "#dance", "#ai", "#tech", "#viral", "#live"].map(
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

export default EnhancedTikTokStyleVideos;
