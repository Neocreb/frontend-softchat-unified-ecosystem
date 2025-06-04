
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share, Volume2, VolumeX, Play, Pause, ArrowUp, ArrowDown } from "lucide-react";
import { VideoItem } from "@/types/video";

interface EnhancedVideoPlayerProps {
  video: VideoItem;
  onNext: () => void;
  onPrev: () => void;
}

const EnhancedVideoPlayer = ({ video, onNext, onPrev }: EnhancedVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, [video]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    togglePlay();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video.description || 'Check out this video!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      {/* Video */}
      <video
        ref={videoRef}
        src={video.url}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        onClick={handleVideoClick}
      />

      {/* Play/Pause overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Button
            variant="ghost"
            size="icon"
            className="h-20 w-20 rounded-full bg-white/20 hover:bg-white/30 text-white"
            onClick={togglePlay}
          >
            <Play className="h-10 w-10 ml-1" />
          </Button>
        </div>
      )}

      {/* Navigation hints */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white/50 text-sm">
        <ArrowUp className="h-4 w-4 mb-1" />
        <span className="text-xs">Swipe up</span>
      </div>
      
      <div className="absolute bottom-1/2 left-4 transform translate-y-1/2 text-white/50 text-sm">
        <ArrowDown className="h-4 w-4 mb-1" />
        <span className="text-xs">Swipe down</span>
      </div>

      {/* Right side controls */}
      <div className="absolute bottom-20 right-4 flex flex-col items-center space-y-6 text-white">
        {/* Creator info */}
        <div className="flex flex-col items-center space-y-2">
          <Avatar className="h-12 w-12 border-2 border-white">
            <AvatarImage src={video.author.avatar || "/placeholder.svg"} />
            <AvatarFallback>{video.author.username?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          {!isFollowing && (
            <Button
              size="icon"
              className="h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 -mt-3"
              onClick={handleFollow}
            >
              <span className="text-xs font-bold">+</span>
            </Button>
          )}
        </div>

        {/* Like button */}
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 text-white hover:bg-white/20"
            onClick={handleLike}
          >
            <Heart className={`h-7 w-7 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <span className="text-xs mt-1">{video.likes || 0}</span>
        </div>

        {/* Comment button */}
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 text-white hover:bg-white/20"
          >
            <MessageCircle className="h-7 w-7" />
          </Button>
          <span className="text-xs mt-1">{video.comments || 0}</span>
        </div>

        {/* Share button */}
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 text-white hover:bg-white/20"
            onClick={handleShare}
          >
            <Share className="h-7 w-7" />
          </Button>
          <span className="text-xs mt-1">Share</span>
        </div>

        {/* Mute button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 text-white hover:bg-white/20"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX className="h-7 w-7" /> : <Volume2 className="h-7 w-7" />}
        </Button>
      </div>

      {/* Bottom content info */}
      <div className="absolute bottom-4 left-4 right-20 text-white">
        <div className="space-y-2">
          <h3 className="font-semibold">@{video.author.username || 'user'}</h3>
          <p className="text-sm">{video.description}</p>
        </div>
      </div>

      {/* Top gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
      
      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
    </div>
  );
};

export default EnhancedVideoPlayer;
