import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  RotateCcw,
  Download,
  Share2,
  MoreHorizontal,
  Subtitles,
  Cast,
  Bookmark,
  Clock,
  Gauge,
  Monitor,
  Smartphone,
  Tv,
  Headphones,
  Eye,
  EyeOff,
  Repeat,
  Shuffle,
  PictureInPicture2,
  Rewind,
  FastForward,
  Volume1,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface VideoQuality {
  quality: "auto" | "144p" | "240p" | "360p" | "480p" | "720p" | "1080p" | "1440p" | "2160p";
  label: string;
  width: number;
  height: number;
  bitrate?: number;
}

interface Caption {
  id: string;
  language: string;
  label: string;
  url: string;
  default?: boolean;
}

interface Chapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  thumbnail?: string;
}

interface VideoStats {
  currentTime: number;
  duration: number;
  buffered: number;
  played: number;
  fps: number;
  bitrate: number;
  droppedFrames: number;
}

interface EnhancedVideoPlayerProps {
  src: string | string[];
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  qualities?: VideoQuality[];
  captions?: Caption[];
  chapters?: Chapter[];
  allowDownload?: boolean;
  allowPiP?: boolean;
  allowCasting?: boolean;
  allowOfflineDownload?: boolean;
  showStats?: boolean;
  onTimeUpdate?: (time: number) => void;
  onQualityChange?: (quality: string) => void;
  onSpeedChange?: (speed: number) => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

const defaultQualities: VideoQuality[] = [
  { quality: "auto", label: "Auto", width: 0, height: 0 },
  { quality: "144p", label: "144p", width: 256, height: 144, bitrate: 150 },
  { quality: "240p", label: "240p", width: 426, height: 240, bitrate: 300 },
  { quality: "360p", label: "360p", width: 640, height: 360, bitrate: 800 },
  { quality: "480p", label: "480p", width: 854, height: 480, bitrate: 1500 },
  { quality: "720p", label: "720p HD", width: 1280, height: 720, bitrate: 2500 },
  { quality: "1080p", label: "1080p Full HD", width: 1920, height: 1080, bitrate: 5000 },
  { quality: "1440p", label: "1440p 2K", width: 2560, height: 1440, bitrate: 8000 },
  { quality: "2160p", label: "2160p 4K", width: 3840, height: 2160, bitrate: 15000 },
];

const playbackSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const EnhancedVideoPlayer: React.FC<EnhancedVideoPlayerProps> = ({
  src,
  poster,
  title,
  autoPlay = false,
  loop = false,
  muted = false,
  className,
  qualities = defaultQualities,
  captions = [],
  chapters = [],
  allowDownload = true,
  allowPiP = true,
  allowCasting = false,
  allowOfflineDownload = false,
  showStats = false,
  onTimeUpdate,
  onQualityChange,
  onSpeedChange,
  onFullscreenChange,
}) => {
  // Video state
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(muted ? 0 : 0.8);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Settings state
  const [selectedQuality, setSelectedQuality] = useState<string>("auto");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedCaption, setSelectedCaption] = useState<string>("off");
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  // UI state
  const [showSettingsPopover, setShowSettingsPopover] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showSpeedSelector, setShowSpeedSelector] = useState(false);
  const [showQualitySelector, setShowQualitySelector] = useState(false);
  const [showCaptionsSelector, setShowCaptionsSelector] = useState(false);
  const [showChaptersSelector, setShowChaptersSelector] = useState(false);
  const [videoStats, setVideoStats] = useState<VideoStats>({
    currentTime: 0,
    duration: 0,
    buffered: 0,
    played: 0,
    fps: 0,
    bitrate: 0,
    droppedFrames: 0,
  });

  // Advanced features state
  const [backgroundPlay, setBackgroundPlay] = useState(false);
  const [autoQuality, setAutoQuality] = useState(true);
  const [preloadNext, setPreloadNext] = useState(true);
  const [lowDataMode, setLowDataMode] = useState(false);
  const [theaterMode, setTheaterMode] = useState(false);
  const [ambientMode, setAmbientMode] = useState(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();

  // Auto-hide controls
  useEffect(() => {
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }

    if (showControls && isPlaying) {
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      setControlsTimeout(timeout);
    }

    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [showControls, isPlaying]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      if (onTimeUpdate) {
        onTimeUpdate(video.currentTime);
      }

      // Update current chapter
      const chapter = chapters.find(
        (ch) => video.currentTime >= ch.startTime && video.currentTime < ch.endTime
      );
      setCurrentChapter(chapter || null);
    };

    const updateDuration = () => {
      setDuration(video.duration);
    };

    const updateBuffered = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        setBuffered((bufferedEnd / video.duration) * 100);
      }
    };

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setError("Failed to load video");
      setIsLoading(false);
    };

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("progress", updateBuffered);
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("progress", updateBuffered);
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
    };
  }, [chapters, onTimeUpdate]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFS = !!document.fullscreenElement;
      setIsFullscreen(isFS);
      if (onFullscreenChange) {
        onFullscreenChange(isFS);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [onFullscreenChange]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlayPause();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skipBackward();
          break;
        case "ArrowRight":
          e.preventDefault();
          skipForward();
          break;
        case "ArrowUp":
          e.preventDefault();
          adjustVolume(0.1);
          break;
        case "ArrowDown":
          e.preventDefault();
          adjustVolume(-0.1);
          break;
        case "KeyF":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "KeyM":
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    if (isFullscreen) {
      document.addEventListener("keydown", handleKeyPress);
      return () => document.removeEventListener("keydown", handleKeyPress);
    }
  }, [isFullscreen]);

  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const skipForward = useCallback((seconds: number = 10) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.min(video.currentTime + seconds, video.duration);
  }, []);

  const skipBackward = useCallback((seconds: number = 10) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(video.currentTime - seconds, 0);
  }, []);

  const adjustVolume = useCallback((delta: number) => {
    const newVolume = Math.max(0, Math.min(1, volume + delta));
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  }, [volume, isMuted]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.muted = false;
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  const togglePiP = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !allowPiP) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiP(false);
      } else {
        await video.requestPictureInPicture();
        setIsPiP(true);
      }
    } catch (error) {
      toast({
        title: "Picture-in-Picture Error",
        description: "Could not enable Picture-in-Picture mode",
        variant: "destructive",
      });
    }
  }, [allowPiP, toast]);

  const handleSeek = useCallback((percentage: number) => {
    const video = videoRef.current;
    if (!video || !duration) return;

    const newTime = (percentage / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  }, [duration]);

  const handleQualityChange = useCallback((quality: string) => {
    setSelectedQuality(quality);
    if (onQualityChange) {
      onQualityChange(quality);
    }
    toast({
      title: "Quality Changed",
      description: `Video quality set to ${quality}`,
    });
  }, [onQualityChange, toast]);

  const handleSpeedChange = useCallback((speed: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = speed;
    setPlaybackSpeed(speed);
    if (onSpeedChange) {
      onSpeedChange(speed);
    }
    toast({
      title: "Speed Changed",
      description: `Playback speed set to ${speed}x`,
    });
  }, [onSpeedChange, toast]);

  const handleDownload = useCallback(() => {
    if (!allowDownload) return;

    const link = document.createElement("a");
    link.href = typeof src === "string" ? src : src[0];
    link.download = title || "video.mp4";
    link.click();

    toast({
      title: "Download Started",
      description: "Video download has begun",
    });
  }, [allowDownload, src, title, toast]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <TooltipProvider>
      <div
        ref={containerRef}
        className={cn(
          "relative bg-black rounded-lg overflow-hidden group",
          theaterMode && "fixed inset-0 z-50",
          className
        )}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => !isPlaying && setShowControls(false)}
        onMouseMove={() => setShowControls(true)}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          src={typeof src === "string" ? src : src[0]}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline
          className="w-full h-full object-cover"
          onClick={togglePlayPause}
          onLoadedMetadata={() => {
            if (videoRef.current) {
              setDuration(videoRef.current.duration);
            }
          }}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white text-center">
              <p className="text-lg font-medium mb-2">Video Error</p>
              <p className="text-sm text-gray-300">{error}</p>
            </div>
          </div>
        )}

        {/* Play/Pause Center Button */}
        {!isPlaying && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="icon"
              variant="ghost"
              className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
              onClick={togglePlayPause}
            >
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </Button>
          </div>
        )}

        {/* Controls Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {title && (
                <h3 className="text-white font-medium text-lg">{title}</h3>
              )}
              {currentChapter && (
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {currentChapter.title}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              {allowCasting && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-10 h-10 text-white hover:bg-white/20"
                    >
                      <Cast className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Cast to device</TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-10 h-10 text-white hover:bg-white/20"
                    onClick={() => setTheaterMode(!theaterMode)}
                  >
                    <Monitor className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Theater mode</TooltipContent>
              </Tooltip>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-10 h-10 text-white hover:bg-white/20"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 bg-black/90 border-gray-700">
                  <div className="space-y-4">
                    {allowOfflineDownload && (
                      <div className="flex items-center justify-between">
                        <Label htmlFor="offline-download" className="text-white">
                          Download for offline
                        </Label>
                        <Button size="sm" variant="outline" onClick={handleDownload}>
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="background-play" className="text-white">
                        Background play
                      </Label>
                      <Switch
                        id="background-play"
                        checked={backgroundPlay}
                        onCheckedChange={setBackgroundPlay}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-quality" className="text-white">
                        Auto quality
                      </Label>
                      <Switch
                        id="auto-quality"
                        checked={autoQuality}
                        onCheckedChange={setAutoQuality}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="low-data" className="text-white">
                        Data saver
                      </Label>
                      <Switch
                        id="low-data"
                        checked={lowDataMode}
                        onCheckedChange={setLowDataMode}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <div
                ref={progressRef}
                className="relative h-1 bg-white/30 rounded-full cursor-pointer group/progress"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percentage = ((e.clientX - rect.left) / rect.width) * 100;
                  handleSeek(percentage);
                }}
              >
                {/* Buffered Progress */}
                <div
                  className="absolute top-0 left-0 h-full bg-white/50 rounded-full"
                  style={{ width: `${buffered}%` }}
                />
                
                {/* Played Progress */}
                <div
                  className="absolute top-0 left-0 h-full bg-white rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
                
                {/* Scrubber */}
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"
                  style={{ left: `${progressPercentage}%` }}
                />
                
                {/* Chapter markers */}
                {chapters.map((chapter) => {
                  const position = (chapter.startTime / duration) * 100;
                  return (
                    <div
                      key={chapter.id}
                      className="absolute top-0 w-0.5 h-full bg-yellow-400"
                      style={{ left: `${position}%` }}
                      title={chapter.title}
                    />
                  );
                })}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Play/Pause */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-10 h-10 text-white hover:bg-white/20"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </Button>

                {/* Skip Controls */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 text-white hover:bg-white/20"
                      onClick={() => skipBackward()}
                    >
                      <Rewind className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>-10s</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 text-white hover:bg-white/20"
                      onClick={() => skipForward()}
                    >
                      <FastForward className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>+10s</TooltipContent>
                </Tooltip>

                {/* Volume */}
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-8 h-8 text-white hover:bg-white/20"
                    onClick={toggleMute}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : volume < 0.5 ? (
                      <Volume1 className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                  
                  <div className="w-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Slider
                      value={[isMuted ? 0 : volume * 100]}
                      onValueChange={([value]) => {
                        const newVolume = value / 100;
                        setVolume(newVolume);
                        if (videoRef.current) {
                          videoRef.current.volume = newVolume;
                        }
                        setIsMuted(newVolume === 0);
                      }}
                      max={100}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>
                </div>

                {/* Time Display */}
                <div className="text-white text-sm font-medium">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Speed Control */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20 text-xs"
                    >
                      <Gauge className="w-4 h-4 mr-1" />
                      {playbackSpeed}x
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-32 bg-black/90 border-gray-700">
                    <div className="space-y-1">
                      {playbackSpeeds.map((speed) => (
                        <Button
                          key={speed}
                          size="sm"
                          variant={playbackSpeed === speed ? "default" : "ghost"}
                          className="w-full justify-start text-white"
                          onClick={() => handleSpeedChange(speed)}
                        >
                          {speed}x
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Quality Selector */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20 text-xs"
                    >
                      <Monitor className="w-4 h-4 mr-1" />
                      {selectedQuality}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 bg-black/90 border-gray-700">
                    <div className="space-y-1">
                      {qualities.map((quality) => (
                        <Button
                          key={quality.quality}
                          size="sm"
                          variant={selectedQuality === quality.quality ? "default" : "ghost"}
                          className="w-full justify-start text-white"
                          onClick={() => handleQualityChange(quality.quality)}
                        >
                          {quality.label}
                          {quality.bitrate && (
                            <span className="ml-auto text-xs text-gray-400">
                              {quality.bitrate}k
                            </span>
                          )}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Captions */}
                {captions.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 text-white hover:bg-white/20"
                      >
                        <Subtitles className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 bg-black/90 border-gray-700">
                      <div className="space-y-1">
                        <Button
                          size="sm"
                          variant={selectedCaption === "off" ? "default" : "ghost"}
                          className="w-full justify-start text-white"
                          onClick={() => setSelectedCaption("off")}
                        >
                          Off
                        </Button>
                        {captions.map((caption) => (
                          <Button
                            key={caption.id}
                            size="sm"
                            variant={selectedCaption === caption.id ? "default" : "ghost"}
                            className="w-full justify-start text-white"
                            onClick={() => setSelectedCaption(caption.id)}
                          >
                            {caption.label}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}

                {/* PiP */}
                {allowPiP && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 text-white hover:bg-white/20"
                        onClick={togglePiP}
                      >
                        <PictureInPicture2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Picture-in-Picture</TooltipContent>
                  </Tooltip>
                )}

                {/* Fullscreen */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 text-white hover:bg-white/20"
                      onClick={toggleFullscreen}
                    >
                      {isFullscreen ? (
                        <Minimize className="w-4 h-4" />
                      ) : (
                        <Maximize className="w-4 h-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overlay */}
        {showStats && (
          <Card className="absolute top-4 left-4 bg-black/80 border-gray-700 text-white">
            <CardContent className="p-3 text-xs space-y-1">
              <div>Resolution: {qualities.find(q => q.quality === selectedQuality)?.width}x{qualities.find(q => q.quality === selectedQuality)?.height}</div>
              <div>Bitrate: {videoStats.bitrate}kbps</div>
              <div>FPS: {videoStats.fps}</div>
              <div>Dropped: {videoStats.droppedFrames}</div>
              <div>Buffer: {buffered.toFixed(1)}%</div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
};

export default EnhancedVideoPlayer;
