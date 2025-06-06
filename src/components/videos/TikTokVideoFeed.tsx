
import { useState, useEffect, useRef, useCallback } from "react";
import { useVideos } from "@/hooks/use-videos";
import EnhancedVideoPlayer from "./EnhancedVideoPlayer";
import VideoComments from "./VideoComments";
import AdCard from "./AdCard";
import { VideoItem, AdItem } from "@/types/video";
import { ArrowUpIcon, MessageCircle, Share2, Heart, User, Plus, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/utils/utils";

const TikTokVideoFeed = () => {
  const {
    currentItem,
    handleNextVideo,
    handlePrevVideo,
    currentIndex,
    allItems
  } = useVideos();
  
  const [showComments, setShowComments] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchEndY, setTouchEndY] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = useCallback(() => {
    if (isTransitioning) return;
    
    const swipeThreshold = 100;
    const swipeDistance = touchStartY - touchEndY;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
      setIsTransitioning(true);
      
      if (swipeDistance > 0) {
        handleNextVideo();
      } else {
        handlePrevVideo();
      }
      
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [touchStartY, touchEndY, isTransitioning, handleNextVideo, handlePrevVideo]);

  const handleFollow = (userId: string) => {
    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleLike = (videoId: string) => {
    setLikedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  const handleShare = () => {
    if (navigator.share && currentItem && !('isAd' in currentItem)) {
      navigator.share({
        title: 'Check out this video',
        text: (currentItem as VideoItem).description,
        url: window.location.href,
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevVideo();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextVideo();
      } else if (e.key === ' ') {
        e.preventDefault();
        // Toggle play/pause
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextVideo, handlePrevVideo]);

  if (!currentItem) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-blue mx-auto mb-4"></div>
          <p className="text-lg">Loading amazing videos...</p>
        </div>
      </div>
    );
  }

  const currentVideo = !('isAd' in currentItem) ? currentItem as VideoItem : null;

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* Main Video Container */}
      <div
        ref={containerRef}
        className="h-full w-full relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Current Video */}
        <div className="absolute inset-0">
          {'isAd' in currentItem ? (
            <AdCard
              ad={(currentItem as AdItem).ad}
              onNext={handleNextVideo}
              onPrev={handlePrevVideo}
            />
          ) : (
            <EnhancedVideoPlayer
              video={currentItem as VideoItem}
              onNext={handleNextVideo}
              onPrev={handlePrevVideo}
            />
          )}
        </div>

        {/* TikTok-style UI Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top gradient */}
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/50 to-transparent" />
          
          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/70 to-transparent" />
        </div>

        {/* Video Info Overlay */}
        {currentVideo && (
          <div className="absolute bottom-20 left-4 right-20 text-white pointer-events-none">
            <div className="space-y-3">
              {/* Author Info */}
              <div className="flex items-center space-x-3 pointer-events-auto">
                <Avatar className="h-12 w-12 border-2 border-white">
                  <AvatarImage src={currentVideo.author.avatar} alt={currentVideo.author.name} />
                  <AvatarFallback className="bg-gray-600 text-white">
                    {currentVideo.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-lg">{currentVideo.author.username}</span>
                    {currentVideo.author.verified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-300">@{currentVideo.author.username}</p>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "rounded-full border-2 text-sm font-semibold px-6 transition-all duration-200",
                    followedUsers.has(currentVideo.author.username)
                      ? "bg-gray-600 border-gray-600 text-white hover:bg-gray-700"
                      : "bg-transparent border-white text-white hover:bg-white hover:text-black"
                  )}
                  onClick={() => handleFollow(currentVideo.author.username)}
                >
                  {followedUsers.has(currentVideo.author.username) ? "Following" : "Follow"}
                </Button>
              </div>

              {/* Video Description */}
              <p className="text-sm leading-relaxed max-w-xs">
                {currentVideo.description}
              </p>

              {/* Music Info */}
              <div className="flex items-center space-x-2 text-sm">
                <Music className="h-4 w-4" />
                <span className="truncate">Original audio - {currentVideo.author.name}</span>
              </div>
            </div>
          </div>
        )}

        {/* Right Side Actions */}
        <div className="absolute right-4 bottom-32 flex flex-col space-y-6 pointer-events-auto">
          {currentVideo && (
            <>
              {/* Like Button */}
              <div className="flex flex-col items-center space-y-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-14 w-14 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110",
                    likedVideos.has(currentVideo.id)
                      ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                      : "bg-black/20 text-white hover:bg-black/40"
                  )}
                  onClick={() => handleLike(currentVideo.id)}
                >
                  <Heart className={cn("h-7 w-7", likedVideos.has(currentVideo.id) && "fill-current")} />
                </Button>
                <span className="text-white text-xs font-semibold">
                  {currentVideo.likes + (likedVideos.has(currentVideo.id) ? 1 : 0)}
                </span>
              </div>

              {/* Comment Button */}
              <div className="flex flex-col items-center space-y-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-14 w-14 rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm transition-all duration-200 hover:scale-110"
                  onClick={() => setShowComments(true)}
                >
                  <MessageCircle className="h-7 w-7" />
                </Button>
                <span className="text-white text-xs font-semibold">{currentVideo.comments}</span>
              </div>

              {/* Share Button */}
              <div className="flex flex-col items-center space-y-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-14 w-14 rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm transition-all duration-200 hover:scale-110"
                  onClick={handleShare}
                >
                  <Share2 className="h-7 w-7" />
                </Button>
                <span className="text-white text-xs font-semibold">{currentVideo.shares}</span>
              </div>

              {/* Profile Picture (as button) */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="h-14 w-14 border-2 border-white">
                    <AvatarImage src={currentVideo.author.avatar} alt={currentVideo.author.name} />
                    <AvatarFallback className="bg-gray-600 text-white">
                      {currentVideo.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <Plus className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Progress Indicators */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 space-y-1 pointer-events-none">
          {allItems.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-1 h-6 rounded-full transition-all duration-300",
                index === currentIndex ? "bg-white" : "bg-white/30"
              )}
            />
          ))}
        </div>

        {/* Navigation Hints */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-auto">
          <Button
            variant="ghost"
            size="icon"
            className="text-white bg-black/20 hover:bg-black/40 h-12 w-12 rounded-full opacity-50 hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
            onClick={handlePrevVideo}
          >
            <ArrowUpIcon className="h-6 w-6 rotate-180" />
          </Button>
        </div>

        <div className="absolute left-4 bottom-32 pointer-events-auto">
          <Button
            variant="ghost"
            size="icon"
            className="text-white bg-black/20 hover:bg-black/40 h-12 w-12 rounded-full opacity-50 hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
            onClick={handleNextVideo}
          >
            <ArrowUpIcon className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Comments Modal */}
      <VideoComments
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        videoId={currentVideo?.id || ''}
      />

      {/* Custom Styles */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default TikTokVideoFeed;
