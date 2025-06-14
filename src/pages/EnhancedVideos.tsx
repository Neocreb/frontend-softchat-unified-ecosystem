import React, { useState, useRef, useEffect } from "react";
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
  User,
  Camera,
  Mic,
  Timer,
  Sparkles,
  Music2,
  ArrowLeft,
  X,
  Upload,
  Video as VideoIcon,
  Type,
  Palette,
  Zap,
  Play,
  Pause,
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
import { Slider } from "@/components/ui/slider";
import { cn } from "@/utils/utils";
import { SmartContentRecommendations } from "@/components/ai/SmartContentRecommendations";

interface VideoData {
  id: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    verified: boolean;
  };
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: number;
  stats: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  hashtags: string[];
  music: {
    title: string;
    artist: string;
    url: string;
  };
  timestamp: string;
}

const mockVideos: VideoData[] = [
  {
    id: "1",
    user: {
      id: "user1",
      username: "creative_creator",
      displayName: "Creative Creator",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    title: "Amazing sunset timelapse",
    description:
      "Captured this beautiful sunset from my balcony. The colors were absolutely incredible! 🌅 #sunset #timelapse #nature",
    videoUrl: "/placeholder-video.mp4",
    thumbnail: "/placeholder.svg?height=600&width=400",
    duration: 30,
    stats: {
      views: 125400,
      likes: 8900,
      comments: 234,
      shares: 67,
    },
    hashtags: ["sunset", "timelapse", "nature", "beautiful", "sky"],
    music: {
      title: "Calm Vibes",
      artist: "Peaceful Sounds",
      url: "/music/calm-vibes.mp3",
    },
    timestamp: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    user: {
      id: "user2",
      username: "dance_moves",
      displayName: "Dance Master",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: false,
    },
    title: "Quick dance tutorial",
    description:
      "Learn this easy dance move in just 30 seconds! Perfect for beginners 💃 #dance #tutorial #learn",
    videoUrl: "/placeholder-video.mp4",
    thumbnail: "/placeholder.svg?height=600&width=400",
    duration: 45,
    stats: {
      views: 89200,
      likes: 6700,
      comments: 156,
      shares: 89,
    },
    hashtags: ["dance", "tutorial", "learn", "moves", "easy"],
    music: {
      title: "Upbeat Dance",
      artist: "DJ Mix",
      url: "/music/upbeat-dance.mp3",
    },
    timestamp: "2024-01-14T15:45:00Z",
  },
  {
    id: "3",
    user: {
      id: "user3",
      username: "cooking_pro",
      displayName: "Chef Pro",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    title: "60-second pasta recipe",
    description:
      "Quick and delicious pasta recipe that anyone can make! 🍝 #cooking #recipe #pasta #quick",
    videoUrl: "/placeholder-video.mp4",
    thumbnail: "/placeholder.svg?height=600&width=400",
    duration: 60,
    stats: {
      views: 156800,
      likes: 12300,
      comments: 445,
      shares: 234,
    },
    hashtags: ["cooking", "recipe", "pasta", "quick", "easy"],
    music: {
      title: "Kitchen Beats",
      artist: "Cooking Sounds",
      url: "/music/kitchen-beats.mp3",
    },
    timestamp: "2024-01-13T12:20:00Z",
  },
];

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

const VideoCard: React.FC<{ video: VideoData; isActive: boolean }> = ({
  video,
  isActive,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const description = video.description;
  const truncatedDescription =
    description.length > 100
      ? description.substring(0, 100) + "..."
      : description;

  return (
    <div className="relative h-screen w-full bg-black snap-start snap-always overflow-hidden">
      {/* Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        preload="metadata"
        poster={video.thumbnail}
        onClick={togglePlayPause}
      >
        <source src={video.videoUrl} type="video/mp4" />
      </video>

      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Button
            variant="ghost"
            size="icon"
            className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 text-white"
            onClick={togglePlayPause}
          >
            <Play className="h-8 w-8" />
          </Button>
        </div>
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20" />

      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-30">
        <Badge
          variant="secondary"
          className="bg-black/40 text-white border-none text-xs"
        >
          {formatNumber(video.stats.views)} views
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Content Container */}
      <div className="absolute inset-0 flex">
        {/* Left side - content */}
        <div className="flex-1 flex flex-col justify-end p-3 sm:p-4 pb-24 sm:pb-28 space-y-2 sm:space-y-3 max-w-[calc(100%-4rem)] sm:max-w-[calc(100%-6rem)]">
          {/* User info */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-white/20 flex-shrink-0">
              <AvatarImage src={video.user.avatar} />
              <AvatarFallback>{video.user.displayName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-white font-semibold text-xs sm:text-sm truncate">
                  @{video.user.username}
                </span>
                {video.user.verified && (
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
              <div className="text-white/80 text-xs">
                {video.user.displayName}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 text-xs px-2 sm:px-3 py-1 h-6 sm:h-7 flex-shrink-0"
            >
              Follow
            </Button>
          </div>

          {/* Description */}
          <div className="text-white text-xs sm:text-sm space-y-1 sm:space-y-2">
            <p className="leading-relaxed line-clamp-3 sm:line-clamp-none break-words">
              {showMore ? description : truncatedDescription}
              {description.length > 100 && (
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="text-white/70 ml-1 underline hidden sm:inline"
                >
                  {showMore ? "less" : "more"}
                </button>
              )}
            </p>

            {/* Hashtags */}
            <div className="flex flex-wrap gap-1">
              {video.hashtags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-blue-300 text-xs">
                  #{tag}
                </span>
              ))}
              {video.hashtags.length > 3 && (
                <span className="text-blue-300/70 text-xs">
                  +{video.hashtags.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Music info */}
          <div className="flex items-center gap-2 text-white/80 text-xs bg-black/20 rounded-full px-2 sm:px-3 py-1 self-start max-w-full">
            <Music className="w-3 h-3 flex-shrink-0" />
            <span className="truncate max-w-32 sm:max-w-48">
              {video.music.title} - {video.music.artist}
            </span>
          </div>
        </div>

        {/* Right side - actions */}
        <div className="flex flex-col items-center justify-end gap-3 sm:gap-4 p-2 sm:p-4 pb-24 sm:pb-28 w-14 sm:w-20">
          {/* Like */}
          <div className="flex flex-col items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/30 border-none",
                isLiked && "bg-red-500/80 hover:bg-red-500",
              )}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart
                className={cn(
                  "w-4 h-4 sm:w-5 sm:h-5",
                  isLiked ? "fill-white text-white" : "text-white",
                )}
              />
            </Button>
            <span className="text-white text-xs font-medium text-center">
              {formatNumber(video.stats.likes + (isLiked ? 1 : 0))}
            </span>
          </div>

          {/* Comment */}
          <div className="flex flex-col items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/30 border-none"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </Button>
            <span className="text-white text-xs font-medium text-center">
              {formatNumber(video.stats.comments)}
            </span>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/30 border-none"
            >
              <Share className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </Button>
            <span className="text-white text-xs font-medium text-center">
              {formatNumber(video.stats.shares)}
            </span>
          </div>

          {/* Bookmark */}
          <Button
            size="icon"
            variant="ghost"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/30 border-none"
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </Button>

          {/* More */}
          <Button
            size="icon"
            variant="ghost"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/30 border-none"
          >
            <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const VideoCreator: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [mode, setMode] = useState<"photo" | "video" | "text">("video");
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-full h-full max-w-none p-0 bg-black text-white border-none">
        <VisuallyHidden>
          <DialogTitle>Create Content</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold">Create</h1>
          <div className="w-10" />
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center gap-2 px-4 mb-4">
          {[
            { id: "photo", icon: Camera, label: "Photo" },
            { id: "video", icon: VideoIcon, label: "Video" },
            { id: "text", icon: Type, label: "Text" },
          ].map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              variant={mode === id ? "default" : "ghost"}
              size="sm"
              onClick={() => setMode(id as any)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>

        {/* Camera/Video Interface */}
        <div className="flex-1 bg-gray-900 relative">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Camera className="h-24 w-24 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Camera preview would appear here</p>
            </div>
          </div>

          {/* Recording Controls */}
          {mode === "video" && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                >
                  <Upload className="h-6 w-6" />
                </Button>

                <Button
                  size="icon"
                  onClick={() => setIsRecording(!isRecording)}
                  className={cn(
                    "w-16 h-16 rounded-full border-4 border-white",
                    isRecording
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-transparent hover:bg-white/20",
                  )}
                >
                  {isRecording ? (
                    <div className="w-6 h-6 bg-white rounded-sm" />
                  ) : (
                    <div className="w-8 h-8 bg-red-500 rounded-full" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                >
                  <Zap className="h-6 w-6" />
                </Button>
              </div>

              {isRecording && (
                <div className="text-center mt-4">
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    REC {formatTime(timer)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Effects and Tools */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex justify-center gap-4">
            <Button variant="ghost" size="sm" className="text-white">
              <Palette className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="ghost" size="sm" className="text-white">
              <Music2 className="h-4 w-4 mr-2" />
              Music
            </Button>
            <Button variant="ghost" size="sm" className="text-white">
              <Timer className="h-4 w-4 mr-2" />
              Timer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const EnhancedVideos: React.FC = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"videos" | "live">("videos");
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        const videoHeight = window.innerHeight;
        const newIndex = Math.round(scrollTop / videoHeight);
        setCurrentVideoIndex(newIndex);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div className="h-screen bg-black text-white relative overflow-hidden w-full max-w-full">
      <Helmet>
        <title>Videos - Softchat</title>
        <meta
          name="description"
          content="Watch and create engaging videos on Softchat"
        />
      </Helmet>

      {/* Top Navigation Tabs */}
      <div className="flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center bg-gray-800 rounded-full p-1">
          <button
            onClick={() => setActiveTab("videos")}
            className={cn(
              "px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all",
              activeTab === "videos"
                ? "bg-white text-black"
                : "text-gray-300 hover:text-white",
            )}
          >
            <VideoIcon className="h-4 w-4 inline mr-2" />
            Videos
          </button>
          <button
            onClick={() => setActiveTab("live")}
            className={cn(
              "px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all",
              activeTab === "live"
                ? "bg-red-500 text-white"
                : "text-gray-300 hover:text-white",
            )}
          >
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline mr-2"></div>
            Live
          </button>
        </div>

        {/* AI Recommendations Toggle - Desktop only */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowRecommendations(!showRecommendations)}
          className="ml-4 text-white hover:bg-white/20 hidden sm:flex"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          AI Recommendations
        </Button>
      </div>

      {/* Videos Tab */}
      {activeTab === "videos" && (
        <>
          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto snap-y snap-mandatory scrollbar-hide"
          >
            {mockVideos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                isActive={index === currentVideoIndex}
              />
            ))}
          </div>

          {/* AI Video Recommendations - Only show on desktop and when toggled */}
          {showRecommendations && (
            <div className="absolute top-20 right-4 w-72 max-h-96 overflow-hidden z-10 hidden sm:block">
              <SmartContentRecommendations
                contentType="videos"
                availableContent={mockVideos}
                onContentSelect={(video) => {
                  const index = mockVideos.findIndex((v) => v.id === video.id);
                  if (index !== -1) {
                    setCurrentVideoIndex(index);
                    if (containerRef.current) {
                      containerRef.current.scrollTo({
                        top: index * window.innerHeight,
                        behavior: "smooth",
                      });
                    }
                  }
                }}
                maxItems={3}
                className="bg-black/80 backdrop-blur-sm border border-gray-700 rounded-lg"
                layout="list"
                showReasons={false}
              />
            </div>
          )}
        </>
      )}

      {/* Live Streams Tab */}
      {activeTab === "live" && (
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <VideoIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Live Streams</h3>
              <p className="text-gray-400 mb-6">Be the first to go live!</p>
              <Button
                onClick={() => setIsCreatorOpen(true)}
                className="bg-red-500 hover:bg-red-600"
              >
                Start Live Stream
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Button */}
      <div className="fixed bottom-20 sm:bottom-8 right-4 z-50">
        <Button
          onClick={() => setIsCreatorOpen(true)}
          className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 shadow-2xl"
        >
          <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </div>

      {/* Video Creator Modal */}
      {isCreatorOpen && (
        <VideoCreator onClose={() => setIsCreatorOpen(false)} />
      )}
    </div>
  );
};

export default EnhancedVideos;
