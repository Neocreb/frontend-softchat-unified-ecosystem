import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Share2,
  Users,
  Eye,
  Gift,
  Volume2,
  VolumeX,
  MoreVertical,
  Play,
  Pause,
  ArrowLeft,
  Home,
  SkipBack,
  SkipForward,
  Maximize,
  Minimize,
  RotateCcw,
  Settings,
  Download,
  Flag,
  BookmarkPlus,
  Send,
  Smile,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface VideoData {
  id: string;
  url: string;
  thumbnail?: string;
  duration: number;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
}

interface Comment {
  id: string;
  user: {
    username: string;
    avatar: string;
    verified?: boolean;
  };
  message: string;
  timestamp: Date;
}

interface EnhancedVideoPlayerProps {
  video: VideoData;
  autoPlay?: boolean;
  showNavigation?: boolean;
  onVideoEnd?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  className?: string;
}

const EnhancedVideoPlayer: React.FC<EnhancedVideoPlayerProps> = ({
  video,
  autoPlay = false,
  showNavigation = true,
  onVideoEnd,
  onNext,
  onPrevious,
  className,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  // Video state
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  
  // Interaction state
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [localStats, setLocalStats] = useState(video.stats);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  
  // Auto-hide navigation
  const [navVisible, setNavVisible] = useState(showNavigation);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isMobile] = useState(window.innerWidth < 768);
  
  // Auto-hide timer for navigation
  useEffect(() => {
    if (!showNavigation) return;
    
    const timer = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivity;
      if (timeSinceActivity >= 3000 && navVisible) {
        setNavVisible(false);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [lastActivity, navVisible, showNavigation]);
  
  // Activity detection
  const handleActivity = useCallback(() => {
    setLastActivity(Date.now());
    if (!navVisible && showNavigation) {
      setNavVisible(true);
    }
  }, [navVisible, showNavigation]);
  
  // Activity listeners
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'touchmove'];
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [handleActivity]);
  
  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };
    
    const handleDurationChange = () => {
      setDuration(video.duration);
    };
    
    const handlePlay = () => {
      setIsPlaying(true);
      setIsBuffering(false);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      onVideoEnd?.();
    };
    
    const handleWaiting = () => {
      setIsBuffering(true);
    };
    
    const handleCanPlay = () => {
      setIsBuffering(false);
    };
    
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('volumechange', handleVolumeChange);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [onVideoEnd]);
  
  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  // Video controls
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };
  
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    
    try {
      if (isFullscreen) {
        await document.exitFullscreen();
      } else {
        await containerRef.current.requestFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };
  
  const seekTo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };
  
  const handleProgressClick = (e: React.MouseEvent) => {
    if (!progressRef.current || !duration) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = clickX / rect.width;
    const newTime = clickRatio * duration;
    
    seekTo(newTime);
  };
  
  // Interaction handlers
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLocalStats(prev => ({
      ...prev,
      likes: prev.likes + (isLiked ? -1 : 1)
    }));
    
    toast({
      title: isLiked ? 'Removed from likes' : 'Added to likes',
      duration: 2000,
    });
  };
  
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? `Unfollowed @${video.author.username}` : `Following @${video.author.username}`,
      duration: 2000,
    });
  };
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: video.title,
          text: video.description,
          url: `${window.location.origin}/video/${video.id}`,
        });
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}/video/${video.id}`);
        toast({
          title: "Link copied!",
          description: "Video link copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };
  
  const sendComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      user: {
        username: 'you',
        avatar: 'https://i.pravatar.cc/32?u=you',
      },
      message: newComment,
      timestamp: new Date(),
    };
    
    setComments(prev => [...prev, comment]);
    setNewComment('');
    
    toast({
      title: "Comment posted!",
      duration: 2000,
    });
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div 
      ref={containerRef}
      className={cn("relative h-screen w-full bg-black overflow-hidden snap-start snap-always", className)}
      onClick={handleActivity}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={video.url}
        poster={video.thumbnail}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay={autoPlay}
        muted={isMuted}
        playsInline
        loop={false}
        preload="metadata"
        onClick={togglePlayPause}
      />
      
      {/* Loading/Buffering overlay */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="w-12 h-12 border-3 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Play/Pause overlay */}
      {!isPlaying && !isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Button
            size="icon"
            variant="ghost"
            className="w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 border-none backdrop-blur-sm"
            onClick={togglePlayPause}
          >
            <Play className="w-10 h-10 text-white fill-white ml-1" />
          </Button>
        </div>
      )}
      
      {/* Top Navigation Bar */}
      <div className={cn(
        "absolute top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out",
        navVisible ? "translate-y-0" : "-translate-y-full"
      )}>
        <div className="bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-white font-semibold">Videos</h1>
                <Badge variant="secondary" className="text-xs">
                  Tap to show nav
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        {/* Progress Bar */}
        <div 
          ref={progressRef}
          className="w-full h-1 bg-white/30 cursor-pointer mb-4 mx-4"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-white transition-all duration-100"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
        
        {/* Bottom Content */}
        <div className="p-4 pt-0">
          <div className="flex items-end justify-between">
            {/* Creator Info & Video Details */}
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-12 h-12 border-2 border-white">
                  <AvatarImage src={video.author.avatar} alt={video.author.name} />
                  <AvatarFallback>{video.author.name[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{video.author.username}</span>
                    {video.author.verified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                  
                  <Button
                    size="sm"
                    variant={isFollowing ? "outline" : "default"}
                    className="mt-1 h-7 text-xs"
                    onClick={handleFollow}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-white text-sm font-medium line-clamp-2">{video.title}</p>
                <p className="text-gray-300 text-xs line-clamp-2">{video.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>{formatNumber(localStats.views)} views</span>
                  <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col items-center gap-4">
              {/* Like */}
              <div className="flex flex-col items-center">
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30"
                  onClick={handleLike}
                >
                  <Heart className={cn(
                    "w-6 h-6",
                    isLiked ? "fill-red-500 text-red-500" : "text-white"
                  )} />
                </Button>
                <span className="text-xs text-white mt-1">
                  {formatNumber(localStats.likes)}
                </span>
              </div>
              
              {/* Comments */}
              <div className="flex flex-col items-center">
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30"
                  onClick={() => setShowComments(!showComments)}
                >
                  <MessageCircle className="w-6 h-6 text-white" />
                </Button>
                <span className="text-xs text-white mt-1">
                  {formatNumber(localStats.comments)}
                </span>
              </div>
              
              {/* Share */}
              <div className="flex flex-col items-center">
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30"
                  onClick={handleShare}
                >
                  <Share2 className="w-6 h-6 text-white" />
                </Button>
                <span className="text-xs text-white mt-1">
                  {formatNumber(localStats.shares)}
                </span>
              </div>
              
              {/* More Options */}
              <Button
                size="icon"
                variant="ghost"
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30"
              >
                <MoreVertical className="w-6 h-6 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Controls (fullscreen) */}
      {isFullscreen && (
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleMute}
            className="bg-black/50 hover:bg-black/70 text-white"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleFullscreen}
            className="bg-black/50 hover:bg-black/70 text-white"
          >
            <Minimize className="w-5 h-5" />
          </Button>
        </div>
      )}
      
      {/* Navigation Controls */}
      {(onNext || onPrevious) && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40 flex flex-col gap-4">
          {onPrevious && (
            <Button
              size="icon"
              variant="ghost"
              onClick={onPrevious}
              className="bg-black/30 hover:bg-black/50 text-white rounded-full"
            >
              <SkipBack className="w-5 h-5" />
            </Button>
          )}
          {onNext && (
            <Button
              size="icon"
              variant="ghost"
              onClick={onNext}
              className="bg-black/30 hover:bg-black/50 text-white rounded-full"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          )}
        </div>
      )}
      
      {/* Floating Back to Feed Button (when nav hidden) */}
      {!navVisible && showNavigation && (
        <div className="absolute top-4 left-4 z-40">
          <Button
            onClick={() => navigate('/app/feed')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg"
            size="sm"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Feed
          </Button>
        </div>
      )}
      
      {/* Comments Panel */}
      {showComments && (
        <div className="absolute bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-t border-gray-700 max-h-96">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Comments</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowComments(false)}
                className="text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-2">
                    <img
                      src={comment.user.avatar}
                      alt={comment.user.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium text-sm">
                          {comment.user.username}
                        </span>
                        {comment.user.verified && (
                          <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        )}
                      </div>
                      <p className="text-gray-300 text-sm">{comment.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-gray-800 border-gray-600 text-white"
                onKeyPress={(e) => e.key === 'Enter' && sendComment()}
              />
              <Button
                onClick={sendComment}
                disabled={!newComment.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Video snap behavior fix - this ensures proper scrolling */}
      <div className="absolute inset-0 pointer-events-none" style={{ scrollSnapAlign: 'start' }} />
    </div>
  );
};

export default EnhancedVideoPlayer;
