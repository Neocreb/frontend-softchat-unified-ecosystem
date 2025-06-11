import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  SwipeUp,
  SwipeDown,
  SwipeLeft,
  SwipeRight,
  Vibrate,
  Share2,
  Download,
  Bookmark,
  Heart,
  MessageCircle,
  MoreVertical,
  ChevronUp,
  ChevronDown,
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move,
  Camera,
  Mic,
  Video,
  Image as ImageIcon,
  X,
  Check,
  Plus,
  Minus,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  Signal,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Hook for detecting mobile device and capabilities
export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState<string>("");

  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
        window.innerWidth < 768;
      const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const android = /Android/.test(navigator.userAgent);
      const pwa =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window as any).navigator.standalone === true;

      setIsMobile(mobile);
      setIsIOS(ios);
      setIsAndroid(android);
      setIsPWA(pwa);
    };

    const handleOnlineStatus = () => setIsOnline(navigator.onLine);

    const handleConnectionChange = () => {
      const connection =
        (navigator as any).connection ||
        (navigator as any).mozConnection ||
        (navigator as any).webkitConnection;
      if (connection) {
        setConnectionType(connection.effectiveType);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener("change", handleConnectionChange);
      handleConnectionChange();
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
      if (connection) {
        connection.removeEventListener("change", handleConnectionChange);
      }
    };
  }, []);

  return { isMobile, isIOS, isAndroid, isPWA, isOnline, connectionType };
};

// Swipe gesture hook
export const useSwipeGesture = (
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  onSwipeUp?: () => void,
  onSwipeDown?: () => void,
  threshold = 50,
) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(
    null,
  );

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > threshold;
    const isRightSwipe = distanceX < -threshold;
    const isUpSwipe = distanceY > threshold;
    const isDownSwipe = distanceY < -threshold;

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (isLeftSwipe && onSwipeLeft) onSwipeLeft();
      if (isRightSwipe && onSwipeRight) onSwipeRight();
    } else {
      if (isUpSwipe && onSwipeUp) onSwipeUp();
      if (isDownSwipe && onSwipeDown) onSwipeDown();
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};

// Pull-to-refresh component
interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  threshold = 100,
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const startY = useRef<number>(0);
  const { toast } = useToast();

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return;

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, (currentY - startY.current) * 0.5);

    if (distance > 0) {
      e.preventDefault();
      setPullDistance(distance);
    }
  };

  const handleTouchEnd = async () => {
    setIsPulling(false);

    if (pullDistance > threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
        toast({
          title: "Refreshed",
          description: "Content has been updated",
        });
      } catch (error) {
        toast({
          title: "Refresh failed",
          description: "Please try again",
          variant: "destructive",
        });
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
  };

  const refreshProgress = Math.min(pullDistance / threshold, 1);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {(isPulling || isRefreshing) && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center bg-background border-b transition-all duration-200 z-10"
          style={{
            transform: `translateY(${pullDistance - 60}px)`,
            height: "60px",
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 border-2 border-primary rounded-full transition-all duration-200 ${
                isRefreshing ? "animate-spin border-t-transparent" : ""
              }`}
              style={{
                transform: `rotate(${refreshProgress * 360}deg)`,
              }}
            />
            <span className="text-sm font-medium">
              {isRefreshing
                ? "Refreshing..."
                : refreshProgress >= 1
                  ? "Release to refresh"
                  : "Pull to refresh"}
            </span>
          </div>
        </div>
      )}

      <div
        style={{
          transform: `translateY(${isPulling ? pullDistance : 0}px)`,
          transition: isPulling ? "none" : "transform 0.3s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Touch-optimized action sheet
interface TouchActionSheetProps {
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  actions: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: "default" | "destructive";
  }[];
}

export const TouchActionSheet: React.FC<TouchActionSheetProps> = ({
  trigger,
  title,
  description,
  actions,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="bottom" className="h-fit max-h-[80vh]">
        <SheetHeader className="text-left">
          {title && <SheetTitle>{title}</SheetTitle>}
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>

        <div className="grid gap-2 mt-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "ghost"}
              className="justify-start h-12 text-left"
              onClick={() => {
                action.onClick();
                setOpen(false);
              }}
            >
              {action.icon && <span className="mr-3">{action.icon}</span>}
              {action.label}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Haptic feedback utilities
export const useHapticFeedback = () => {
  const { isMobile } = useMobileDetection();

  const light = useCallback(() => {
    if (isMobile && "vibrate" in navigator) {
      navigator.vibrate(10);
    }
  }, [isMobile]);

  const medium = useCallback(() => {
    if (isMobile && "vibrate" in navigator) {
      navigator.vibrate(50);
    }
  }, [isMobile]);

  const heavy = useCallback(() => {
    if (isMobile && "vibrate" in navigator) {
      navigator.vibrate(100);
    }
  }, [isMobile]);

  const success = useCallback(() => {
    if (isMobile && "vibrate" in navigator) {
      navigator.vibrate([50, 50, 50]);
    }
  }, [isMobile]);

  const error = useCallback(() => {
    if (isMobile && "vibrate" in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  }, [isMobile]);

  return { light, medium, heavy, success, error };
};

// Touch-optimized image viewer with gestures
interface TouchImageViewerProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export const TouchImageViewer: React.FC<TouchImageViewerProps> = ({
  src,
  alt,
  onClose,
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouch, setLastTouch] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [lastDistance, setLastDistance] = useState<number | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();

    if (e.touches.length === 1) {
      setIsDragging(true);
      setLastTouch({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    } else if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      setLastDistance(distance);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();

    if (e.touches.length === 1 && isDragging && lastTouch) {
      const deltaX = e.touches[0].clientX - lastTouch.x;
      const deltaY = e.touches[0].clientY - lastTouch.y;

      setPosition((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));

      setLastTouch({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    } else if (e.touches.length === 2 && lastDistance) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );

      const scaleChange = distance / lastDistance;
      const newScale = Math.min(Math.max(scale * scaleChange, 0.5), 3);

      setScale(newScale);
      setLastDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setLastTouch(null);
    setLastDistance(null);
  };

  const resetTransform = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev * 1.5, 3));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev / 1.5, 0.5));
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Controls */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white"
        >
          <X className="w-5 h-5" />
        </Button>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={zoomOut}
            className="text-white"
          >
            <ZoomOut className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetTransform}
            className="text-white"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={zoomIn}
            className="text-white"
          >
            <ZoomIn className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Image */}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="max-w-full max-h-full object-contain touch-none"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transition: isDragging ? "none" : "transform 0.2s ease",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        draggable={false}
      />

      {/* Zoom indicator */}
      {scale !== 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <Badge variant="secondary" className="text-white bg-black/50">
            {Math.round(scale * 100)}%
          </Badge>
        </div>
      )}
    </div>
  );
};

// Mobile-optimized video player
interface TouchVideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export const TouchVideoPlayer: React.FC<TouchVideoPlayerProps> = ({
  src,
  poster,
  autoPlay = false,
  loop = false,
  muted = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setProgress(isNaN(progress) ? 0 : progress);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
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

  const handleVideoClick = () => {
    togglePlayPause();
    showControlsTemporarily();
  };

  const showControlsTemporarily = () => {
    setShowControls(true);

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleProgressClick = (e: React.MouseEvent) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = clickX / rect.width;
    const newTime = clickRatio * video.duration;

    video.currentTime = newTime;
  };

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop={loop}
        muted={muted}
        playsInline
        className="w-full h-full object-cover"
        onClick={handleVideoClick}
      />

      {/* Play/Pause overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Button
            variant="ghost"
            size="lg"
            onClick={togglePlayPause}
            className="text-white bg-black/50 hover:bg-black/70 rounded-full w-16 h-16"
          >
            <Play className="w-8 h-8 ml-1" fill="white" />
          </Button>
        </div>
      )}

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Progress bar */}
        <div
          className="h-1 bg-white/30 cursor-pointer mx-4 mb-2"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-white transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlayPause}
            className="text-white"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="text-white"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Connection status indicator
export const ConnectionStatus: React.FC = () => {
  const { isOnline, connectionType } = useMobileDetection();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 text-sm z-50">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="w-4 h-4" />
        <span>You're offline</span>
      </div>
    </div>
  );
};

// Install PWA prompt
export const PWAInstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { isPWA } = useMobileDetection();

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowPrompt(false);
    }

    setDeferredPrompt(null);
  };

  if (!showPrompt || isPWA) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Download className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-sm">Install Softchat</h4>
            <p className="text-xs text-muted-foreground">
              Add to home screen for faster access
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowPrompt(false)}
            >
              <X className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={installPWA}>
              Install
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default {
  useMobileDetection,
  useSwipeGesture,
  useHapticFeedback,
  PullToRefresh,
  TouchActionSheet,
  TouchImageViewer,
  TouchVideoPlayer,
  ConnectionStatus,
  PWAInstallPrompt,
};
