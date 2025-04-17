
import { useAuth } from "@/contexts/AuthContext";
import FooterNav from "@/components/layout/FooterNav";
import VideoPlayer from "@/components/videos/VideoPlayer";
import AdCard from "@/components/videos/AdCard";
import { useVideos } from "@/hooks/use-videos";
import { VideoItem, AdItem } from "@/types/video";

const Videos = () => {
  const { user } = useAuth();
  const { currentItem, handleNextVideo } = useVideos();

  // Check if we have a valid item to display
  if (!currentItem) {
    return (
      <div className="h-[calc(100vh-4rem)] pb-16 md:pb-0 bg-black flex items-center justify-center text-white">
        <p>No videos available</p>
        <FooterNav />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] pb-16 md:pb-0 bg-black overflow-hidden">
      {'isAd' in currentItem ? (
        <AdCard ad={(currentItem as AdItem).ad} />
      ) : (
        <VideoPlayer video={currentItem as VideoItem} onNext={handleNextVideo} />
      )}
      <FooterNav />
    </div>
  );
};

export default Videos;
