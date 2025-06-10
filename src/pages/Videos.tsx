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
  Search,
  User,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import EnhancedVideoCreator from "@/components/video/EnhancedVideoCreator";
import { cn } from "@/utils/utils";

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
    music: {
      title: "Crypto Anthem",
      artist: "Digital Dreams",
    },
    stats: {
      likes: 15400,
      comments: 892,
      shares: 445,
      views: "2.1M",
    },
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
      "Day trading tips that actually work! Follow for more 💰 #trading #stocks #daytrading",
    music: {
      title: "Success Vibes",
      artist: "Motivation Mix",
    },
    stats: {
      likes: 8900,
      comments: 567,
      shares: 234,
      views: "890K",
    },
    hashtags: ["trading", "stocks", "daytrading", "money"],
    videoUrl:
      "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400",
    duration: 45,
  },
  {
    id: "3",
    user: {
      id: "3",
      username: "nft_creator",
      displayName: "NFT Creator",
      avatar: "https://i.pravatar.cc/150?img=3",
      verified: true,
    },
    description:
      "Just dropped my latest NFT collection! Link in bio 🎨 #nft #digitalart #opensea",
    music: {
      title: "Digital Dreams",
      artist: "Electronic Beats",
    },
    stats: {
      likes: 12600,
      comments: 445,
      shares: 789,
      views: "1.5M",
    },
    hashtags: ["nft", "digitalart", "opensea", "blockchain"],
    videoUrl:
      "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400",
    duration: 25,
  },
  {
    id: "4",
    user: {
      id: "4",
      username: "defi_guru",
      displayName: "DeFi Guru",
      avatar: "https://i.pravatar.cc/150?img=4",
      verified: true,
    },
    description:
      "Yield farming strategies for 2024! This is not financial advice 📈 #defi #yield #farming",
    music: {
      title: "Future Finance",
      artist: "Crypto Sounds",
    },
    stats: {
      likes: 9800,
      comments: 321,
      shares: 156,
      views: "750K",
    },
    hashtags: ["defi", "yield", "farming", "protocol"],
    videoUrl:
      "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400",
    duration: 60,
  },
  {
    id: "5",
    user: {
      id: "5",
      username: "web3_dev",
      displayName: "Web3 Developer",
      avatar: "https://i.pravatar.cc/150?img=5",
      verified: false,
    },
    description:
      "Building the future of the internet! Check out my latest dApp 🌐 #web3 #blockchain #dapp",
    music: {
      title: "Code & Create",
      artist: "Dev Beats",
    },
    stats: {
      likes: 7200,
      comments: 189,
      shares: 95,
      views: "420K",
    },
    hashtags: ["web3", "blockchain", "dapp", "coding"],
    videoUrl:
      "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400",
    duration: 40,
  },
];

const VideoCard: React.FC<{ video: VideoData; isActive: boolean }> = ({
  video,
  isActive,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive]);

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

  return (
    <div className="relative h-screen w-full bg-black snap-start snap-always">
      {/* Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        preload="metadata"
        poster={video.thumbnail}
      >
        <source src={video.videoUrl} type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />

      {/* Content overlay */}
      <div className="absolute inset-0 flex">
        {/* Left side - user info and description */}
        <div className="flex-1 flex flex-col justify-end p-4 pb-20 md:pb-4">
          <div className="space-y-3">
            {/* User info */}
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 border-2 border-white/20">
                <AvatarImage src={video.user.avatar} />
                <AvatarFallback>{video.user.displayName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold text-sm truncate">
                    @{video.user.username}
                  </span>
                  {video.user.verified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-white rounded-full" />
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
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 text-xs px-3 py-1 h-auto"
              >
                Follow
              </Button>
            </div>

            {/* Description */}
            <div className="text-white text-sm">
              <p className="leading-relaxed">
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
              <div className="flex flex-wrap gap-1 mt-2">
                {video.hashtags.map((tag) => (
                  <span key={tag} className="text-blue-300 text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Music info */}
            <div className="flex items-center gap-2 text-white/80 text-xs">
              <Music className="w-3 h-3" />
              <span className="truncate">
                {video.music.title} - {video.music.artist}
              </span>
            </div>
          </div>
        </div>

        {/* Right side - action buttons */}
        <div className="flex flex-col items-center justify-end gap-6 p-4 pb-20 md:pb-8">
          {/* Like button */}
          <div className="flex flex-col items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                "w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 border-none",
                isLiked && "bg-red-500/80 hover:bg-red-500",
              )}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart
                className={cn(
                  "w-6 h-6",
                  isLiked ? "fill-white text-white" : "text-white",
                )}
              />
            </Button>
            <span className="text-white text-xs font-medium">
              {formatNumber(video.stats.likes + (isLiked ? 1 : 0))}
            </span>
          </div>

          {/* Comment button */}
          <div className="flex flex-col items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 border-none"
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </Button>
            <span className="text-white text-xs font-medium">
              {formatNumber(video.stats.comments)}
            </span>
          </div>

          {/* Share button */}
          <div className="flex flex-col items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 border-none"
            >
              <Share className="w-6 h-6 text-white" />
            </Button>
            <span className="text-white text-xs font-medium">
              {formatNumber(video.stats.shares)}
            </span>
          </div>

          {/* Bookmark button */}
          <Button
            size="icon"
            variant="ghost"
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 border-none"
          >
            <Bookmark className="w-6 h-6 text-white" />
          </Button>

          {/* More options */}
          <Button
            size="icon"
            variant="ghost"
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 border-none"
          >
            <MoreHorizontal className="w-6 h-6 text-white" />
          </Button>
        </div>
      </div>

      {/* Volume control */}
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 border-none"
        onClick={() => setIsMuted(!isMuted)}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </Button>

      {/* Views count */}
      <div className="absolute top-4 left-4">
        <Badge
          variant="secondary"
          className="bg-black/40 text-white border-none"
        >
          {video.stats.views} views
        </Badge>
      </div>
    </div>
  );
};

const Videos: React.FC = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

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
        newIndex < mockVideos.length
      ) {
        setCurrentVideoIndex(newIndex);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentVideoIndex]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Videos | Softchat</title>
      </Helmet>

      {/* Videos uses the main app header, no need for separate header */}

      {/* Main Content */}
      <div className="relative">
        {/* Desktop Sidebar */}
        <div className="hidden md:block fixed left-0 top-0 h-full w-16 bg-black/50 z-40">
          <div className="flex flex-col items-center pt-20 space-y-6">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-800"
            >
              <Home className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-800"
            >
              <Search className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-800"
            >
              <Heart className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-800"
            >
              <User className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Video Feed */}
        <div className="md:ml-16 -mt-20 md:-mt-20 pb-20 md:pb-0">
          <div className="max-w-md mx-auto">
            {mockVideos.map((video, index) => (
              <div
                key={video.id}
                className="relative h-[calc(100vh-3.5rem)] md:h-screen w-full snap-start flex items-center justify-center"
              >
                {/* Video */}
                <video
                  src={video.videoUrl}
                  poster={video.thumbnail}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  muted
                  loop
                  autoPlay
                />

                {/* Overlays */}
                <div className="absolute top-0 left-0 w-full h-full bg-black/30"></div>

                {/* Video Info */}
                <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-16 md:right-20 z-30">
                  <div className="text-white">
                    <div className="flex items-center space-x-2 md:space-x-3 mb-2">
                      <img
                        src={video.user.avatar}
                        alt={video.user.displayName}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-xs md:text-sm truncate">
                          {video.user.displayName}
                        </h3>
                        <p className="text-xs text-gray-300 truncate">
                          @{video.user.username}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white border-white hover:bg-white hover:text-black text-xs px-2 md:px-3 py-1 h-7 md:h-8"
                      >
                        Follow
                      </Button>
                    </div>
                    <p className="text-xs md:text-sm mb-2 line-clamp-2">
                      {video.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {video.hashtags.slice(0, 3).map((tag, tagIndex) => (
                        <span key={tagIndex} className="text-xs text-blue-300">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Video Actions */}
                <div className="absolute right-3 md:right-4 bottom-24 md:bottom-20 flex flex-col space-y-3 md:space-y-4 z-30">
                  <div className="flex flex-col items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-gray-800/50 bg-black/30 rounded-full h-10 w-10 md:h-12 md:w-12"
                    >
                      <Heart className="h-5 w-5 md:h-6 md:w-6" />
                    </Button>
                    <span className="text-white text-xs mt-1">
                      {video.stats.likes}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-gray-800/50 bg-black/30 rounded-full h-10 w-10 md:h-12 md:w-12"
                    >
                      <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
                    </Button>
                    <span className="text-white text-xs mt-1">
                      {video.stats.comments}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-gray-800/50 bg-black/30 rounded-full h-10 w-10 md:h-12 md:w-12"
                    >
                      <Share className="h-5 w-5 md:h-6 md:w-6" />
                    </Button>
                    <span className="text-white text-xs mt-1">
                      {video.stats.shares}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-gray-800/50 bg-black/30 rounded-full h-10 w-10 md:h-12 md:w-12"
                    >
                      <MoreHorizontal className="h-5 w-5 md:h-6 md:w-6" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create Button */}
        <Button
          onClick={() => setIsCreatorOpen(true)}
          className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white rounded-full w-12 h-12 md:w-16 md:h-16 shadow-lg"
        >
          <Plus className="h-6 w-6 md:h-8 md:w-8" />
        </Button>
      </div>

      {/* Creator Modal */}
      <Dialog open={isCreatorOpen} onOpenChange={setIsCreatorOpen}>
        <DialogContent className="max-w-2xl bg-black border border-gray-800 rounded-lg p-4">
          <EnhancedVideoCreator onClose={() => setIsCreatorOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Videos;
