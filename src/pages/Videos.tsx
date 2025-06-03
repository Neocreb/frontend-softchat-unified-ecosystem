
import { useAuth } from "@/contexts/AuthContext";
import VideoPlayer from "@/components/videos/VideoPlayer";
import AdCard from "@/components/videos/AdCard";
import { useVideos } from "@/hooks/use-videos";
import { VideoItem, AdItem } from "@/types/video";
import { ArrowUpIcon } from "lucide-react";

const Videos = () => {
  const { user } = useAuth();
  const {
    currentItem,
    swipeHandlers,
    handleNextVideo,
    handlePrevVideo
  } = useVideos();

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
        <VideoPlayer
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
    </div>
  );
};

export default Videos;
