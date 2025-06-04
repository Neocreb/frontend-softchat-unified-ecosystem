
import { useState } from "react";
import { useVideos } from "@/hooks/use-videos";
import EnhancedVideoPlayer from "@/components/videos/EnhancedVideoPlayer";
import VideoComments from "@/components/videos/VideoComments";
import AdCard from "@/components/videos/AdCard";
import { VideoItem, AdItem } from "@/types/video";
import { ArrowUpIcon, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const EnhancedVideosPage = () => {
  const {
    currentItem,
    swipeHandlers,
    handleNextVideo,
    handlePrevVideo
  } = useVideos();
  
  const [showComments, setShowComments] = useState(false);

  if (!currentItem) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-black flex items-center justify-center text-white">
        <p>No videos available</p>
      </div>
    );
  }

  return (
    <div
      className="h-[calc(100vh-4rem)] bg-black overflow-hidden relative"
      {...swipeHandlers}
    >
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

      {/* Navigation indicators */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/70 to-transparent pointer-events-none z-10">
        <div className="flex justify-center pt-4">
          <span className="flex gap-2 text-gray-400 text-sm animate-bounce">
            Swipe up for next <ArrowUpIcon className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* Comments button for videos */}
      {!('isAd' in currentItem) && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-32 right-4 text-white bg-black/20 hover:bg-black/40 h-12 w-12 rounded-full z-20"
          onClick={() => setShowComments(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Comments modal */}
      <VideoComments
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        videoId={('isAd' in currentItem) ? '' : (currentItem as VideoItem).id}
      />
    </div>
  );
};

export default EnhancedVideosPage;
