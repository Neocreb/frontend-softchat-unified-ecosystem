
import { useState, useEffect, useRef } from "react";
import { useVideos } from "@/hooks/use-videos";
import EnhancedVideoPlayer from "@/components/videos/EnhancedVideoPlayer";
import VideoComments from "@/components/videos/VideoComments";
import AdCard from "@/components/videos/AdCard";
import { VideoItem, AdItem } from "@/types/video";
import { ArrowUpIcon, MessageCircle, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const EnhancedVideosPage = () => {
  const {
    currentItem,
    swipeHandlers,
    handleNextVideo,
    handlePrevVideo,
    currentIndex,
    allItems
  } = useVideos();
  
  const [showComments, setShowComments] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchEndY, setTouchEndY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Enhanced touch handling for smooth vertical scrolling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (isTransitioning) return;
    
    const swipeThreshold = 100;
    const swipeDistance = touchStartY - touchEndY;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
      setIsTransitioning(true);
      
      if (swipeDistance > 0) {
        // Swipe up - next video
        handleNextVideo();
      } else {
        // Swipe down - previous video
        handlePrevVideo();
      }
      
      // Reset transition state after animation
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevVideo();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextVideo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextVideo, handlePrevVideo]);

  // Auto-scroll to center current video
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const targetScroll = currentIndex * container.clientHeight;
      container.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  if (!currentItem) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading videos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-4rem)] bg-black overflow-hidden">
      {/* Video Container with smooth scrolling */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {allItems.map((item, index) => (
          <div
            key={index}
            className="h-full w-full flex-shrink-0 snap-start relative"
            style={{ scrollSnapAlign: 'start' }}
          >
            {'isAd' in item ? (
              <AdCard
                ad={(item as AdItem).ad}
                onNext={handleNextVideo}
                onPrev={handlePrevVideo}
              />
            ) : (
              <EnhancedVideoPlayer
                video={item as VideoItem}
                onNext={handleNextVideo}
                onPrev={handlePrevVideo}
              />
            )}
          </div>
        ))}
      </div>

      {/* TikTok-style UI overlays */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/70 to-transparent pointer-events-none z-10">
        <div className="flex justify-center pt-4">
          <div className="flex items-center gap-2 text-white text-sm">
            <ArrowUpIcon className="h-4 w-4 animate-bounce" />
            <span>Swipe up for next</span>
          </div>
        </div>
      </div>

      {/* Progress indicators */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 space-y-1 z-20">
        {allItems.map((_, index) => (
          <div
            key={index}
            className={`w-1 h-6 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Navigation hints */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20">
        <Button
          variant="ghost"
          size="icon"
          className="text-white bg-black/20 hover:bg-black/40 h-12 w-12 rounded-full opacity-50 hover:opacity-100 transition-opacity"
          onClick={handlePrevVideo}
        >
          <ArrowUpIcon className="h-6 w-6 rotate-180" />
        </Button>
      </div>

      <div className="absolute left-4 bottom-32 z-20">
        <Button
          variant="ghost"
          size="icon"
          className="text-white bg-black/20 hover:bg-black/40 h-12 w-12 rounded-full opacity-50 hover:opacity-100 transition-opacity"
          onClick={handleNextVideo}
        >
          <ArrowUpIcon className="h-6 w-6" />
        </Button>
      </div>

      {/* Enhanced interaction panel */}
      {!('isAd' in currentItem) && (
        <div className="absolute right-4 bottom-32 flex flex-col gap-4 z-20">
          <Button
            variant="ghost"
            size="icon"
            className="text-white bg-black/20 hover:bg-black/40 h-14 w-14 rounded-full backdrop-blur-sm"
          >
            <Heart className="h-7 w-7" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-white bg-black/20 hover:bg-black/40 h-14 w-14 rounded-full backdrop-blur-sm"
            onClick={() => setShowComments(true)}
          >
            <MessageCircle className="h-7 w-7" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-white bg-black/20 hover:bg-black/40 h-14 w-14 rounded-full backdrop-blur-sm"
          >
            <Share2 className="h-7 w-7" />
          </Button>
        </div>
      )}

      {/* Comments modal */}
      <VideoComments
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        videoId={('isAd' in currentItem) ? '' : (currentItem as VideoItem).id}
      />

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

export default EnhancedVideosPage;
