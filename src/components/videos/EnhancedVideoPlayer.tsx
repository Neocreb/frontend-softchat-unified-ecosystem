
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings, 
  Heart, 
  MessageCircle, 
  Share2,
  Bookmark,
  PictureInPicture,
  SkipBack,
  SkipForward
} from "lucide-react";
import { cn } from "@/utils/utils";
import { VideoItem } from "@/types/video";

interface EnhancedVideoPlayerProps {
  video: VideoItem;
  onNext: () => void;
  onPrev: () => void;
}

const EnhancedVideoPlayer = ({ video, onNext, onPrev }: EnhancedVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState("720p");
  const [isBuffering, setIsBuffering] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = (value / 100) * duration;
  };

  const handleVolumeChange = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newVolume = value / 100;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  const togglePictureInPicture = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch (error) {
      console.error('Picture-in-picture failed:', error);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      className="relative h-full bg-black group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={video.url}
        autoPlay
        loop
        playsInline
        onClick={togglePlay}
      />

      {/* Buffering indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      {/* Controls overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60 transition-opacity duration-300",
        showControls ? "opacity-100" : "opacity-0"
      )}>
        {/* Top controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white bg-black/20 hover:bg-black/40"
              onClick={onPrev}
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white bg-black/20 hover:bg-black/40"
              onClick={onNext}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white bg-black/20 hover:bg-black/40"
              onClick={togglePictureInPicture}
            >
              <PictureInPicture className="h-5 w-5" />
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-white bg-black/20 hover:bg-black/40"
                onClick={() => setShowQualityMenu(!showQualityMenu)}
              >
                <Settings className="h-5 w-5" />
              </Button>
              {showQualityMenu && (
                <div className="absolute top-full right-0 mt-2 bg-black/80 rounded-lg p-2 min-w-[100px]">
                  {["480p", "720p", "1080p"].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setQuality(q);
                        setShowQualityMenu(false);
                      }}
                      className={cn(
                        "block w-full text-left px-3 py-2 text-white hover:bg-white/20 rounded",
                        quality === q && "bg-white/30"
                      )}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-white bg-black/20 hover:bg-black/40 h-16 w-16"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
          </Button>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress bar */}
          <div className="mb-4">
            <Progress 
              value={progress} 
              className="h-1 cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const progress = (clickX / rect.width) * 100;
                handleSeek(progress);
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                <div className="w-20">
                  <Progress 
                    value={isMuted ? 0 : volume * 100} 
                    className="h-1 cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const volume = (clickX / rect.width) * 100;
                      handleVolumeChange(volume);
                    }}
                  />
                </div>
              </div>
              
              <div className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={toggleFullscreen}
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Right side engagement panel */}
        <div className="absolute right-4 bottom-20 flex flex-col gap-4">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "text-white bg-black/20 hover:bg-black/40 h-12 w-12 rounded-full",
              liked && "text-red-500"
            )}
            onClick={() => setLiked(!liked)}
          >
            <Heart className={cn("h-6 w-6", liked && "fill-current")} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-white bg-black/20 hover:bg-black/40 h-12 w-12 rounded-full"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-white bg-black/20 hover:bg-black/40 h-12 w-12 rounded-full"
          >
            <Share2 className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "text-white bg-black/20 hover:bg-black/40 h-12 w-12 rounded-full",
              bookmarked && "text-yellow-500"
            )}
            onClick={() => setBookmarked(!bookmarked)}
          >
            <Bookmark className={cn("h-6 w-6", bookmarked && "fill-current")} />
          </Button>
        </div>
      </div>

      {/* Video info overlay */}
      <div className="absolute bottom-4 left-4 max-w-sm">
        <h3 className="text-white font-semibold mb-1">{video.description}</h3>
        <p className="text-white/80 text-sm">{video.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <img 
            src={video.author.avatar} 
            alt={video.author.name}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-white text-sm">{video.author.name}</span>
          <Button variant="outline" size="sm" className="ml-auto">
            Follow
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedVideoPlayer;
