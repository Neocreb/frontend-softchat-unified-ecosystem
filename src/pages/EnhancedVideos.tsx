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
  description: string;
  music: {
    title: string;
    artist: string;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
    views: string;
  };
  hashtags: string[];
  videoUrl: string;
  thumbnail: string;
  duration: number;
}

const mockVideos: VideoData[] = [
  {
    id: "1",
    user: {
      id: "1",
      username: "crypto_king",
      displayName: "Crypto King",
      avatar: "https://i.pravatar.cc/150?img=1",
      verified: true,
    },
    description:
      "Bitcoin to the moon! 🚀 Who else is holding? #crypto #bitcoin #hodl",
    music: { title: "Crypto Anthem", artist: "Digital Dreams" },
    stats: { likes: 15400, comments: 892, shares: 445, views: "2.1M" },
    hashtags: ["crypto", "bitcoin", "hodl", "moon"],
    videoUrl:
      "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400",
    duration: 30,
  },
  {
    id: "2",
    user: {
      id: "2",
      username: "tech_trader",
      displayName: "Tech Trader",
      avatar: "https://i.pravatar.cc/150?img=2",
      verified: false,
    },
    description:
      "Day trading tips that actually work! Follow for more 💰 #trading #stocks",
    music: { title: "Success Vibes", artist: "Motivation Mix" },
    stats: { likes: 8900, comments: 567, shares: 234, views: "890K" },
    hashtags: ["trading", "stocks", "daytrading", "money"],
    videoUrl:
      "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400",
    duration: 45,
  },
];

const VideoCreator: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [mode, setMode] = useState<"photo" | "video" | "text">("video");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("original");
  const [selectedSpeed, setSelectedSpeed] = useState(1);
  const [showEffects, setShowEffects] = useState(false);
  const [showSounds, setShowSounds] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const filters = [
    { id: "original", name: "Original" },
    { id: "vintage", name: "Vintage" },
    { id: "cool", name: "Cool" },
    { id: "warm", name: "Warm" },
    { id: "dramatic", name: "Dramatic" },
  ];

  const speeds = [0.5, 1, 1.5, 2];
  const effects = ["None", "Blur", "Glow", "Rainbow", "Sparkle"];
  const sounds = ["Original", "Trending Mix", "Electronic", "Hip Hop", "Pop"];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  useEffect(() => {
    if (mode === "video") {
      startCamera();
    }
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mode]);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
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
            variant={mode === id ? "default" : "outline"}
            className={cn(
              "flex-1 max-w-28 h-12 flex flex-col items-center gap-1",
              mode === id
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white/10 text-white border-white/20 hover:bg-white/20",
            )}
            onClick={() => setMode(id as any)}
          >
            <Icon className="h-4 w-4" />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>

      {/* Camera Preview */}
      <div className="flex-1 relative bg-gray-900 mx-4 rounded-2xl overflow-hidden">
        {mode === "video" && (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{
              filter:
                selectedFilter === "vintage"
                  ? "sepia(0.8)"
                  : selectedFilter === "cool"
                    ? "hue-rotate(240deg)"
                    : selectedFilter === "warm"
                      ? "hue-rotate(30deg)"
                      : selectedFilter === "dramatic"
                        ? "contrast(1.5) saturate(1.3)"
                        : "none",
            }}
          />
        )}

        {mode === "photo" && (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <Camera className="h-16 w-16 text-gray-400" />
          </div>
        )}

        {mode === "text" && (
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <input
              type="text"
              placeholder="Type your text..."
              className="bg-transparent text-white text-2xl font-bold text-center outline-none placeholder-white/70 w-full px-4"
            />
          </div>
        )}

        {/* Recording Timer */}
        {isRecording && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            ● {formatTime(recordingTime)}
          </div>
        )}

        {/* Flip Camera Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-white bg-black/30 hover:bg-black/50 rounded-full"
        >
          <Zap className="h-5 w-5" />
        </Button>
      </div>

      {/* Controls */}
      <div className="p-4 space-y-4">
        {/* Filter Row */}
        <div className="flex gap-2 overflow-x-auto">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? "default" : "outline"}
              size="sm"
              className={cn(
                "whitespace-nowrap",
                selectedFilter === filter.id
                  ? "bg-blue-500 text-white"
                  : "text-white border-white/20 bg-white/10 hover:bg-white/20",
              )}
              onClick={() => setSelectedFilter(filter.id)}
            >
              {filter.name}
            </Button>
          ))}
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium w-12">Speed</span>
          <div className="flex gap-1">
            {speeds.map((speed) => (
              <Button
                key={speed}
                variant={selectedSpeed === speed ? "default" : "outline"}
                size="sm"
                className={cn(
                  "w-12 h-8",
                  selectedSpeed === speed
                    ? "bg-blue-500 text-white"
                    : "text-white border-white/20 bg-white/10",
                )}
                onClick={() => setSelectedSpeed(speed)}
              >
                {speed}x
              </Button>
            ))}
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="text-white bg-white/10 hover:bg-white/20 rounded-full w-12 h-12"
            onClick={() => setShowEffects(!showEffects)}
          >
            <Sparkles className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white bg-white/10 hover:bg-white/20 rounded-full w-12 h-12"
          >
            <Mic className="h-6 w-6" />
          </Button>

          {/* Record Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "w-16 h-16 rounded-full border-4 border-white flex items-center justify-center",
              isRecording ? "bg-red-500" : "bg-white",
            )}
            onClick={toggleRecording}
          >
            <div
              className={cn(
                "w-6 h-6 rounded-full",
                isRecording ? "bg-white" : "bg-red-500",
              )}
            />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white bg-white/10 hover:bg-white/20 rounded-full w-12 h-12"
          >
            <Timer className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white bg-white/10 hover:bg-white/20 rounded-full w-12 h-12"
            onClick={() => setShowSounds(!showSounds)}
          >
            <Music2 className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Effects Panel */}
      {showEffects && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/90 p-4 rounded-t-2xl">
          <h3 className="text-white font-semibold mb-3">Effects</h3>
          <div className="grid grid-cols-5 gap-2">
            {effects.map((effect) => (
              <Button
                key={effect}
                variant="outline"
                className="text-white border-white/20 bg-white/10 hover:bg-white/20 text-xs"
              >
                {effect}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Sounds Panel */}
      {showSounds && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/90 p-4 rounded-t-2xl">
          <h3 className="text-white font-semibold mb-3">Sounds</h3>
          <div className="space-y-2">
            {sounds.map((sound) => (
              <Button
                key={sound}
                variant="outline"
                className="w-full text-white border-white/20 bg-white/10 hover:bg-white/20 text-left justify-start"
              >
                <Music className="h-4 w-4 mr-2" />
                {sound}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const VideoCard: React.FC<{ video: VideoData; isActive: boolean }> = ({
  video,
  isActive,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive && isPlaying) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, isPlaying]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const togglePlayPause = () => {
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
          {video.stats.views} views
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
        <div className="flex-1 flex flex-col justify-end p-3 sm:p-4 pb-20 sm:pb-24 space-y-2 sm:space-y-3 max-w-[calc(100%-5rem)] sm:max-w-[calc(100%-6rem)]">
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
            <p className="leading-relaxed line-clamp-3 sm:line-clamp-none">
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
        <div className="flex flex-col items-center justify-end gap-3 sm:gap-4 p-3 sm:p-4 pb-20 sm:pb-24 w-16 sm:w-20">
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

const EnhancedVideos: React.FC = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"videos" | "live">("videos");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const scrollTop = containerRef.current?.scrollTop || 0;
    const videoHeight = window.innerHeight;
    const newIndex = Math.round(scrollTop / videoHeight);

    if (
      newIndex !== currentVideoIndex &&
      newIndex >= 0 &&
      newIndex < mockVideos.length
    ) {
      setCurrentVideoIndex(newIndex);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentVideoIndex]);

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
