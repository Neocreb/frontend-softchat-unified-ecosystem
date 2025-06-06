
import { useState, useEffect, useRef, useCallback } from "react";
import { useVideos } from "@/hooks/use-videos";
import EnhancedVideoPlayer from "./EnhancedVideoPlayer";
import VideoComments from "./VideoComments";
import AdCard from "./AdCard";
import { VideoItem, AdItem } from "@/types/video";
import { ArrowUpIcon, MessageCircle, Share2, Heart, User, Plus, Music, Upload } from "lucide-react";
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
  const [showUpload, setShowUpload] = useState(false);
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

  const handleUpload = () => {
    setShowUpload(true);
    // In a real implementation, this would open a video upload modal/page
    console.log("Opening video upload interface...");
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
      {/* Enhanced Upload Button - Positioned at top center */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
        <Button
          onClick={handleUpload}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
        >
          <Upload className="h-5 w-5" />
          Upload Video
        </Button>
      </div>

      {/* Main Video Container - Fixed overlapping */}
      <div
        ref={containerRef}
        className="h-full w-full relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Current Video */}
        <div className="absolute inset-0 w-full h-full">
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

        {/* Enhanced TikTok-style UI Overlays */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Top gradient */}
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/60 to-transparent" />
          
          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black/80 to-transparent" />
        </div>

        {/* Video Info Overlay */}
        {currentVideo && (
          <div className="absolute bottom-24 left-4 right-24 text-white pointer-events-none z-20">
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

        {/* Enhanced Right Side Actions */}
        <div className="absolute right-4 bottom-32 flex flex-col space-y-6 pointer-events-auto z-20">
          {currentVideo && (
            <>
              {/* Enhanced Like Button */}
              <div className="flex flex-col items-center space-y-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-14 w-14 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 border-2 border-white/20",
                    likedVideos.has(currentVideo.id)
                      ? "bg-red-500/30 text-red-500 hover:bg-red-500/40 border-red-500/50"
                      : "bg-black/30 text-white hover:bg-black/50"
                  )}
                  onClick={() => handleLike(currentVideo.id)}
                >
                  <Heart className={cn("h-7 w-7", likedVideos.has(currentVideo.id) && "fill-current")} />
                </Button>
                <span className="text-white text-xs font-semibold">
                  {currentVideo.likes + (likedVideos.has(currentVideo.id) ? 1 : 0)}
                </span>
              </div>

              {/* Enhanced Comment Button */}
              <div className="flex flex-col items-center space-y-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-14 w-14 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm transition-all duration-200 hover:scale-110 border-2 border-white/20"
                  onClick={() => setShowComments(true)}
                >
                  <MessageCircle className="h-7 w-7" />
                </Button>
                <span className="text-white text-xs font-semibold">{currentVideo.comments}</span>
              </div>

              {/* Enhanced Share Button */}
              <div className="flex flex-col items-center space-y-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-14 w-14 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm transition-all duration-200 hover:scale-110 border-2 border-white/20"
                  onClick={handleShare}
                >
                  <Share2 className="h-7 w-7" />
                </Button>
                <span className="text-white text-xs font-semibold">{currentVideo.shares}</span>
              </div>

              {/* Profile Picture with Plus (Create) */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="h-14 w-14 border-3 border-white">
                    <AvatarImage src={currentVideo.author.avatar} alt={currentVideo.author.name} />
                    <AvatarFallback className="bg-gray-600 text-white">
                      {currentVideo.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    onClick={handleUpload}
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center p-0 transition-all duration-200 hover:scale-110"
                  >
                    <Plus className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Enhanced Progress Indicators */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 space-y-2 pointer-events-none z-20">
          {allItems.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-1 h-8 rounded-full transition-all duration-300",
                index === currentIndex ? "bg-white shadow-lg" : "bg-white/40"
              )}
            />
          ))}
        </div>

        {/* Enhanced Navigation Hints */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-auto z-20">
          <Button
            variant="ghost"
            size="icon"
            className="text-white bg-black/20 hover:bg-black/40 h-12 w-12 rounded-full opacity-60 hover:opacity-100 transition-all duration-200 backdrop-blur-sm border border-white/20"
            onClick={handlePrevVideo}
          >
            <ArrowUpIcon className="h-6 w-6 rotate-180" />
          </Button>
        </div>

        <div className="absolute left-4 bottom-32 pointer-events-auto z-20">
          <Button
            variant="ghost"
            size="icon"
            className="text-white bg-black/20 hover:bg-black/40 h-12 w-12 rounded-full opacity-60 hover:opacity-100 transition-all duration-200 backdrop-blur-sm border border-white/20"
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

      {/* Upload Modal Placeholder */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Upload Video</h2>
            <p className="text-gray-600 mb-4">Video upload feature coming soon!</p>
            <Button onClick={() => setShowUpload(false)} className="w-full">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TikTokVideoFeed;
