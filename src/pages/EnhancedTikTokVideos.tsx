import React, { useState, useRef, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  Upload,
  Target,
  Swords,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InteractiveFeatures from "@/components/video/InteractiveFeatures";

// Temporary fallback for missing imports
const CreatorDashboard = () => <div>Creator Dashboard</div>;
const LiveStreamCreator = ({ onStreamStart, onStreamEnd }: any) => <div>Live Stream Creator</div>;
const MobileLiveStreamLayout = ({ content, isActive, isUserOwned, onEndStream }: any) => <div>Mobile Live Stream Layout</div>;

// Use fallback function for live content adapter
const liveContentToVideoData = (content: any) => ({
  id: content.id,
  user: content.user,
  description: content.description,
  music: { title: "Live Stream", artist: "Real Time" },
  stats: { likes: 0, comments: 0, shares: 0, views: "0 watching" },
  hashtags: ["live"],
  videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
  thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400",
  duration: 0,
  timestamp: "LIVE",
  isLiveStream: true,
  allowDuets: false,
  allowComments: true,
});

// Live content context removed for simplicity
import { cn } from "@/utils/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useVideoPlayback } from "@/hooks/use-video-playback";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
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

// Mock data for different tabs
const forYouVideos: VideoData[] = [
  {
    id: "1",
    user: {
      id: "1",
      username: "crypto_king",
      displayName: "Crypto King",
      avatar: "https://i.pravatar.cc/150?img=1",
      verified: true,
      followerCount: 234567,
    },
    description: "Bitcoin to the moon! 🚀 Who else is holding? #crypto #bitcoin #hodl",
    music: { title: "Crypto Anthem", artist: "Digital Dreams" },
    stats: { likes: 15400, comments: 892, shares: 445, views: "2.1M" },
    hashtags: ["crypto", "bitcoin", "hodl"],
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400",
    duration: 30,
    timestamp: "2h",
    allowDuets: true,
    allowComments: true,
  },
  {
    id: "2",
    user: {
      id: "2",
      username: "tech_trader",
      displayName: "Tech Trader",
      avatar: "https://i.pravatar.cc/150?img=2",
      verified: false,
      followerCount: 89456,
    },
    description: "Day trading tips that actually work! Follow for more 💰 #trading #stocks",
    music: { title: "Success Vibes", artist: "Motivation Mix" },
    stats: { likes: 8900, comments: 567, shares: 234, views: "890K" },
    hashtags: ["trading", "stocks", "daytrading"],
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400",
    duration: 45,
    timestamp: "5h",
    allowDuets: true,
    allowComments: true,
  },
];

const followingVideos: VideoData[] = [
  {
    id: "fl1",
    user: {
      id: "4",
      username: "photo_pro",
      displayName: "Photo Pro",
      avatar: "https://i.pravatar.cc/150?img=15",
      verified: true,
      followerCount: 15600,
      isFollowing: true,
    },
    description: "Testing my new camera setup! What do you think? 📸 #photography #newgear",
    music: { title: "Camera Click", artist: "Sound Effects" },
    stats: { likes: 450, comments: 78, shares: 12, views: "2.3K" },
    hashtags: ["photography", "newgear", "test"],
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
    duration: 25,
    timestamp: "1h",
    allowDuets: true,
    allowComments: true,
  },
];

const liveStreams: VideoData[] = [
  {
    id: "live1",
    user: {
      id: "live1",
      username: "crypto_guru",
      displayName: "Crypto Guru",
      avatar: "https://i.pravatar.cc/150?img=10",
      verified: true,
      followerCount: 50000,
    },
    description: "LIVE: Bitcoin analysis and market predictions! 🔴 Join the discussion",
    music: { title: "Live Stream", artist: "Real Time" },
    stats: { likes: 1250, comments: 345, shares: 89, views: "12.5K watching" },
    hashtags: ["live", "crypto", "bitcoin", "analysis"],
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400",
    duration: 0, // Live streams don't have fixed duration
    timestamp: "LIVE",
    isLiveStream: true,
    allowDuets: false,
    allowComments: true,
  },
  {
    id: "live2",
    user: {
      id: "live2",
      username: "trading_live",
      displayName: "Trading Live",
      avatar: "https://i.pravatar.cc/150?img=11",
      verified: false,
      followerCount: 25000,
    },
    description: "🔴 LIVE Trading Session - Day Trading with $10K! Come learn!",
    music: { title: "Live Stream", artist: "Real Time" },
    stats: { likes: 890, comments: 234, shares: 45, views: "8.9K watching" },
    hashtags: ["live", "trading", "daytrading", "learn"],
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400",
    duration: 0,
    timestamp: "LIVE",
    isLiveStream: true,
    allowDuets: false,
    allowComments: true,
  },
];

const battleVideos: VideoData[] = [
  {
    id: "battle1",
    user: {
      id: "battle1",
      username: "dance_master",
      displayName: "Dance Master",
      avatar: "https://i.pravatar.cc/150?img=3",
      verified: true,
      followerCount: 892000,
    },
    description: "⚔️ LIVE BATTLE: Epic Dance Battle vs @melody_queen! Vote with gifts! ⚡",
    music: { title: "Battle Theme", artist: "Epic Beats" },
    stats: { likes: 3240, comments: 890, shares: 234, views: "24.8K watching" },
    hashtags: ["livebattle", "dance", "epic", "compete"],
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    duration: 0,
    timestamp: "BATTLE",
    isLiveStream: true,
    allowDuets: false,
    allowComments: true,
  },
  {
    id: "battle2",
    user: {
      id: "battle2",
      username: "rap_king",
      displayName: "Rap King",
      avatar: "https://i.pravatar.cc/150?img=8",
      verified: true,
      followerCount: 567000,
    },
    description: "🎤 LIVE RAP BATTLE: Freestyle showdown! Drop bars and win SoftPoints! 💰",
    music: { title: "Hip Hop Battle", artist: "Street Beats" },
    stats: { likes: 1890, comments: 567, shares: 123, views: "15.2K watching" },
    hashtags: ["rapbattle", "freestyle", "hiphop", "bars"],
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    duration: 0,
    timestamp: "BATTLE",
    isLiveStream: true,
    allowDuets: false,
    allowComments: true,
  },
];

const VideoCard: React.FC<{
  video: VideoData;
  isActive: boolean;
  showControls?: boolean;
  onDuetCreate?: (video: VideoData) => void;
  onTapToShowControls?: () => void;
}> = ({ video, isActive, showControls = true, onDuetCreate, onTapToShowControls }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [isPlaying, setIsPlaying] = useState(isActive);
  const [isFollowing, setIsFollowing] = useState(video.user.isFollowing || false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();
  const { safePlay, safePause, togglePlayback } = useVideoPlayback();

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    let isComponentMounted = true;

    const handleVideoPlayback = async () => {
      if (!isComponentMounted) return;

      try {
        if (isActive && isPlaying) {
          await safePlay(videoElement);
        } else {
          safePause(videoElement);
        }
      } catch (error) {
        // Errors are already handled in the hook
      }
    };

    handleVideoPlayback();

    return () => {
      isComponentMounted = false;
      if (videoElement) {
        safePause(videoElement);
      }
    };
  }, [isActive, isPlaying, safePlay, safePause]);

  const togglePlay = useCallback(async () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    await togglePlayback(videoElement, isPlaying, setIsPlaying);
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
    description.length > 100 ? description.substring(0, 100) + "..." : description;

  const handleTapAnywhere = (e: React.MouseEvent) => {
    // Only show controls if tap is not on the video itself
    if (e.target !== e.currentTarget && onTapToShowControls) {
      onTapToShowControls();
    }
  };

  return (
    <div
      className="relative h-screen w-full bg-black snap-start snap-always"
      onClick={handleTapAnywhere}
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

      {/* Live indicator for live streams */}
      {video.isLiveStream && (
        <div className="absolute top-4 left-4 z-30">
          <Badge className="bg-red-500 text-white animate-pulse">
            <Radio className="w-3 h-3 mr-1" />
            LIVE
          </Badge>
        </div>
      )}

      {/* Battle indicator */}
      {video.timestamp === "BATTLE" && (
        <div className="absolute top-4 left-4 z-30">
          <Badge className="bg-orange-500 text-white animate-pulse">
            <Swords className="w-3 h-3 mr-1" />
            BATTLE
          </Badge>
        </div>
      )}

      {/* Play/Pause indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Button
            size="icon"
            variant="ghost"
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 hover:bg-white/30 border-none backdrop-blur-sm"
            onClick={togglePlay}
          >
            <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-white ml-1" />
          </Button>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

      {/* Content overlay */}
      <div className="absolute inset-0 flex">
        {/* Left side - user info and description */}
        <div className="flex-1 flex flex-col justify-end p-3 md:p-4 pb-44 md:pb-8">
          <div className="space-y-2 md:space-y-3">
            {/* User info */}
            <div className="flex items-center gap-2 md:gap-3">
              <Avatar className="w-10 h-10 md:w-12 md:h-12 border-2 border-white/20">
                <AvatarImage src={video.user.avatar} />
                <AvatarFallback>{video.user.displayName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 md:gap-2">
                  <span className="text-white font-semibold text-xs md:text-sm truncate">
                    @{video.user.username}
                  </span>
                  {video.user.verified && (
                    <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                <div className="text-white/80 text-[10px] md:text-xs">
                  {video.user.displayName}
                  {video.user.followerCount && (
                    <span className="ml-1">
                      • {formatNumber(video.user.followerCount)} followers
                    </span>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 text-[10px] md:text-xs px-2 md:px-3 py-1 h-6 md:h-auto"
                onClick={() => setIsFollowing(!isFollowing)}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            </div>

            {/* Description */}
            <div className="text-white text-xs md:text-sm">
              <p className="leading-relaxed line-clamp-2 md:line-clamp-3">
                {showMore ? description : truncatedDescription}
                {description.length > 100 && (
                  <button
                    onClick={() => setShowMore(!showMore)}
                    className="text-white/70 ml-1 underline"
                  >
                    {showMore ? "less" : "more"}
                  </button>
                )}
              </p>

              {/* Hashtags */}
              <div className="flex flex-wrap gap-1 mt-1 md:mt-2">
                {video.hashtags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-blue-300 text-xs md:text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Music info */}
            <div className="flex items-center gap-1 md:gap-2 text-white/80 text-[10px] md:text-xs">
              <Music className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">
                {video.music.title} - {video.music.artist}
              </span>
            </div>

            {/* Video metadata */}
            <div className="flex items-center gap-3 text-white/60 text-[10px] md:text-xs mt-1">
              {video.timestamp && (
                <span>
                  {video.timestamp === "BATTLE" ? "⚔️ LIVE BATTLE" :
                   video.isLiveStream ? "🔴 LIVE" : video.timestamp}
                </span>
              )}
              <span>{video.stats.views} {video.isLiveStream ? "watching" : "views"}</span>
            </div>
          </div>
        </div>

        {/* Right side - Interactive Features */}
        <div className="flex flex-col items-center justify-end gap-3 md:gap-4 p-2 md:p-4 pb-44 md:pb-8">
          <InteractiveFeatures
            videoId={video.id}
            isLiveStream={video.isLiveStream}
            allowDuets={video.allowDuets}
            allowComments={video.allowComments}
            isBattle={video.timestamp === "BATTLE"}
            battleData={video.timestamp === "BATTLE" ? {
              creator1: {
                id: video.user.id,
                username: video.user.username,
                displayName: video.user.displayName,
                avatar: video.user.avatar,
              },
              creator2: {
                id: "opponent_" + video.id,
                username: "opponent",
                displayName: "Opponent",
                avatar: "https://i.pravatar.cc/150?img=9",
              }
            } : undefined}
            onDuetCreate={(videoId) => {
              // Handle duet creation by opening the new duet recorder
              if (onDuetCreate) {
                onDuetCreate(video);
              }
            }}
          />
        </div>
      </div>

      {/* Volume control */}
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-4 right-4 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/30 hover:bg-black/50 border-none"
        onClick={() => setIsMuted(!isMuted)}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-white" />
        ) : (
          <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
        )}
      </Button>
    </div>
  );
};

const EnhancedTikTokVideos: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Get initial tab from URL params or default to "foryou"
  const initialTab = searchParams.get('tab') as "live" | "battle" | "foryou" | "following" || "foryou";
  const [activeTab, setActiveTab] = useState<"live" | "battle" | "foryou" | "following">(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showHeaderTabs, setShowHeaderTabs] = useState(true);
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  // Auto-hide navigation state
  // Auto-hide footer navigation state (NOT header tabs)
  const [isFooterNavVisible, setIsFooterNavVisible] = useState(true);
  const footerNavTimeoutRef = useRef<NodeJS.Timeout>();
  const headerTabsTimeoutRef = useRef<NodeJS.Timeout>();

  // Removed userBalance as it's not used
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  // Use a simple fallback for live content to avoid context errors
  const allLiveContent: any[] = [];
  const addLiveStream = (stream: any) => 'fallback-id';
  const addBattle = (battle: any) => 'fallback-id';
  const removeLiveContent = (id: string) => {};

  // Auto-hide FOOTER navigation after 3 seconds (header tabs should stay visible)
  useEffect(() => {
    const isVideoPage = window.location.pathname.includes('/videos');
    if (!isVideoPage) return;

    const resetFooterTimer = () => {
      if (footerNavTimeoutRef.current) {
        clearTimeout(footerNavTimeoutRef.current);
      }
      setIsFooterNavVisible(true);
      footerNavTimeoutRef.current = setTimeout(() => {
        setIsFooterNavVisible(false);
      }, 3000);
    };

    resetFooterTimer();

    return () => {
      if (footerNavTimeoutRef.current) {
        clearTimeout(footerNavTimeoutRef.current);
      }
    };
  }, []);

  // Auto-hide HEADER tabs after 4 seconds (separate from footer)
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showHeaderTabs) {
      timeout = setTimeout(() => {
        setShowHeaderTabs(false);
      }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [showHeaderTabs]);

  // Toggle header tabs visibility on tap (without affecting video pause)
  const toggleHeaderTabs = useCallback(() => {
    setShowHeaderTabs(true);
    if (headerTabsTimeoutRef.current) {
      clearTimeout(headerTabsTimeoutRef.current);
    }
    headerTabsTimeoutRef.current = setTimeout(() => {
      setShowHeaderTabs(false);
    }, 4000);
  }, []);

  // Toggle footer navigation visibility on tap
  const toggleFooterNavigation = useCallback(() => {
    setIsFooterNavVisible(!isFooterNavVisible);
    if (footerNavTimeoutRef.current) {
      clearTimeout(footerNavTimeoutRef.current);
    }
    if (!isFooterNavVisible) {
      footerNavTimeoutRef.current = setTimeout(() => {
        setIsFooterNavVisible(false);
      }, 3000);
    }
  }, [isFooterNavVisible]);

  // Get current videos based on active tab
  const getCurrentVideos = () => {
    switch (activeTab) {
      case "live":
        // Convert live content to video format for compatibility
        return (allLiveContent || []).filter(content => !content.battleData).map(liveContentToVideoData);
      case "battle":
        return battleVideos.concat((allLiveContent || []).filter(content => content.battleData).map(liveContentToVideoData));
      case "following":
        return followingVideos;
      default:
        return forYouVideos;
    }
  };

  const currentVideos = getCurrentVideos();

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

  // Handle scroll for video index
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

  const handleGoLive = () => {
    setShowCreateMenu(false);
    toast({
      title: "Live Stream",
      description: "Live streaming feature coming soon!",
    });
  };

  const handleUploadVideo = () => {
    setShowCreateMenu(false);
    toast({
      title: "Upload Video",
      description: "Video upload feature coming soon!",
    });
  };

  const handleRecordVideo = () => {
    setShowCreateMenu(false);
    toast({
      title: "Record Video",
      description: "Video recording feature coming soon!",
    });
  };

  const handleDuetCreate = (video: VideoData) => {
    toast({
      title: "Duet Feature",
      description: "Duet creation feature coming soon!",
    });
  };

  const handleStartBattle = () => {
    setShowCreateMenu(false);
    toast({
      title: "Battle Mode! ⚔️",
      description: "Battle feature coming soon!",
    });
  };

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden z-10">
      <Helmet>
        <title>Videos | SoftChat</title>
        <meta
          name="description"
          content="Discover trending videos, live streams, and content from creators you follow"
        />
      </Helmet>

      {/* Enhanced 6-Element Header Layout */}
      {showHeaderTabs && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 via-black/60 to-transparent">
          <div className="grid grid-cols-6 items-center gap-2 p-3 pt-8 min-h-[80px]">
            {/* 1. Search Icon (left side) */}
            <div className="flex justify-start">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearchOverlay(true)}
                className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10"
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>

            {/* 2. Live Tab (center) */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() => setActiveTab("live")}
                className={cn(
                  "flex flex-col items-center justify-center h-12 sm:h-14 px-2 sm:px-3 transition-all",
                  activeTab === "live" 
                    ? "text-red-500 bg-red-500/10" 
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
              >
                <Radio className="h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                <span className="text-[10px] sm:text-xs font-medium hidden xs:block">Live</span>
              </Button>
            </div>

            {/* 3. Battle Tab (center) */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() => setActiveTab("battle")}
                className={cn(
                  "flex flex-col items-center justify-center h-12 sm:h-14 px-2 sm:px-3 transition-all",
                  activeTab === "battle" 
                    ? "text-orange-500 bg-orange-500/10" 
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
              >
                <Swords className="h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                <span className="text-[10px] sm:text-xs font-medium hidden xs:block">Battle</span>
              </Button>
            </div>

            {/* 4. For You Tab (center) */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() => setActiveTab("foryou")}
                className={cn(
                  "flex flex-col items-center justify-center h-12 sm:h-14 px-2 sm:px-3 transition-all",
                  activeTab === "foryou" 
                    ? "text-white border-b-2 border-white" 
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
              >
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                <span className="text-[10px] sm:text-xs font-medium hidden xs:block sm:block">
                  {isMobile ? "You" : "For You"}
                </span>
              </Button>
            </div>

            {/* 5. Following Tab (center) */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() => setActiveTab("following")}
                className={cn(
                  "flex flex-col items-center justify-center h-12 sm:h-14 px-2 sm:px-3 transition-all",
                  activeTab === "following" 
                    ? "text-white border-b-2 border-white" 
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
              >
                <Users className="h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                <span className="text-[10px] sm:text-xs font-medium hidden xs:block sm:block">
                  {isMobile ? "Follow" : "Following"}
                </span>
              </Button>
            </div>

            {/* 6. Create Button + More options (right side) */}
            <div className="flex justify-end items-center gap-1">
              <DropdownMenu open={showCreateMenu} onOpenChange={setShowCreateMenu}>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-none h-8 w-8 sm:h-10 sm:w-10 sm:w-auto sm:px-3 rounded-full sm:rounded-lg"
                  >
                    <Plus className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline text-xs font-medium">Create</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-gray-900 border-gray-700 text-white mb-2"
                >
                  <DropdownMenuItem onClick={handleRecordVideo} className="hover:bg-gray-800">
                    <Camera className="w-4 h-4 mr-2" />
                    Record Video
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleUploadVideo} className="hover:bg-gray-800">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Video
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleGoLive} className="hover:bg-gray-800">
                    <Radio className="w-4 h-4 mr-2" />
                    Go Live
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleStartBattle} className="hover:bg-gray-800">
                    <Swords className="w-4 h-4 mr-2" />
                    Start Battle
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-6 w-6 sm:h-8 sm:w-8"
                onClick={() => toast({ title: "More Options", description: "Feature coming soon!" })}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Back to Feed Button - Shows when footer navigation is hidden */}
      {!isFooterNavVisible && (
        <Button
          onClick={() => navigate('/app/feed')}
          className="fixed bottom-6 left-4 z-50 bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-sm transition-all duration-300"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Feed
        </Button>
      )}

      {/* Video content area */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        style={{
          scrollBehavior: "smooth",
          paddingBottom: isFooterNavVisible && isMobile ? "80px" : "20px",
        }}
        onClick={toggleHeaderTabs}
      >
        <Tabs value={activeTab} className="h-full">
          <TabsContent value="live" className="h-full mt-0">
            {(allLiveContent || []).filter(content => !content.battleData).length > 0 ? (
              (allLiveContent || []).filter(content => !content.battleData).map((liveContent, index) => {
                return (
                  <MobileLiveStreamLayout
                    key={liveContent.id}
                    content={liveContent}
                    isActive={index === currentVideoIndex && activeTab === "live"}
                    isUserOwned={liveContent.isUserOwned}
                    onEndStream={() => {
                      removeLiveContent(liveContent.id);
                      toast({
                        title: "Stream Ended",
                        description: "Your live stream has been ended",
                      });
                    }}
                  />
                );
              })
            ) : (
              <div className="h-screen flex items-center justify-center">
                <div className="text-center text-white/60">
                  <Radio className="w-12 h-12 mx-auto mb-4 text-red-500" />
                  <p className="text-lg font-medium mb-2">No live content right now</p>
                  <p className="text-sm">Start a live stream to see content here!</p>
                  <div className="mt-4">
                    <Button
                      onClick={handleGoLive}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Radio className="w-4 h-4 mr-2" />
                      Go Live
                    </Button>
                  </div>
                </div>
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
                  onDuetCreate={handleDuetCreate}
                  onTapToShowControls={toggleHeaderTabs}
                />
              ))
            ) : (
              <div className="h-screen flex items-center justify-center">
                <div className="text-center text-white/60">
                  <Swords className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                  <p className="text-lg font-medium mb-2">No battles right now</p>
                  <p className="text-sm">Start a battle to compete with other creators!</p>
                  <div className="mt-4">
                    <Button
                      onClick={handleStartBattle}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      <Swords className="w-4 h-4 mr-2" />
                      Start Battle
                    </Button>
                  </div>
                </div>
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
                onDuetCreate={handleDuetCreate}
              />
            ))}
          </TabsContent>

          <TabsContent value="following" className="h-full mt-0">
            {followingVideos.length > 0 ? (
              followingVideos.map((video, index) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  isActive={index === currentVideoIndex && activeTab === "following"}
                  showControls={showControls}
                  onDuetCreate={handleDuetCreate}
                />
              ))
            ) : (
              <div className="h-screen flex items-center justify-center">
                <div className="text-center text-white/60">
                  <Users className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">No videos yet</p>
                  <p className="text-sm">Follow creators to see their content here!</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Search Overlay */}
      {showSearchOverlay && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
          <div className="w-full max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos, creators, sounds..."
                className="pl-10 pr-12 py-3 bg-gray-900 border-gray-700 text-white text-lg"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearchOverlay(false)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder for future features */}

      {/* Enhanced Footer Navigation with Auto-Hide */}
      {isFooterNavVisible && (
        <div
          className="fixed bottom-0 inset-x-0 bg-background/95 backdrop-blur border-t md:hidden z-[100] safe-area-pb transition-transform duration-300 ease-in-out"
          onClick={toggleFooterNavigation}
        >
          <div className="grid grid-cols-6 h-14 sm:h-16 px-1 w-full max-w-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/app/feed')}
              className="w-full flex flex-col items-center justify-center py-1 px-0.5 h-full rounded-none text-center min-w-0 text-muted-foreground"
            >
              <Home className="h-3 w-3 sm:h-4 sm:w-4 mb-0.5 sm:mb-1 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs leading-none truncate w-full">Feed</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/app/explore')}
              className="w-full flex flex-col items-center justify-center py-1 px-0.5 h-full rounded-none text-center min-w-0 text-muted-foreground"
            >
              <Search className="h-3 w-3 sm:h-4 sm:w-4 mb-0.5 sm:mb-1 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs leading-none truncate w-full">Explore</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/app/freelance')}
              className="w-full flex flex-col items-center justify-center py-1 px-0.5 h-full rounded-none text-center min-w-0 text-muted-foreground"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mb-0.5 sm:mb-1 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs leading-none truncate w-full">Freelance</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="w-full flex flex-col items-center justify-center py-1 px-0.5 h-full rounded-none text-center min-w-0 text-primary bg-primary/10"
            >
              <Video className="h-3 w-3 sm:h-4 sm:w-4 mb-0.5 sm:mb-1 flex-shrink-0 text-primary" />
              <span className="text-[10px] sm:text-xs leading-none truncate w-full">Videos</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/app/marketplace')}
              className="w-full flex flex-col items-center justify-center py-1 px-0.5 h-full rounded-none text-center min-w-0 text-muted-foreground"
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mb-0.5 sm:mb-1 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs leading-none truncate w-full">Market</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/app/crypto')}
              className="w-full flex flex-col items-center justify-center py-1 px-0.5 h-full rounded-none text-center min-w-0 text-muted-foreground"
            >
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mb-0.5 sm:mb-1 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs leading-none truncate w-full">Crypto</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedTikTokVideos;
