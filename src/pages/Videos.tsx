
import { useAuth } from "@/contexts/AuthContext";
import FooterNav from "@/components/layout/FooterNav";
import VideoPlayer from "@/components/videos/VideoPlayer";
import AdCard from "@/components/videos/AdCard";
import { useVideos } from "@/hooks/use-videos";

const Videos = () => {
  const { user } = useAuth();
  const { currentItem, handleNextVideo } = useVideos();

  return (
    <div className="h-[calc(100vh-4rem)] pb-16 md:pb-0 bg-black overflow-hidden">
      {'isAd' in currentItem ? (
        <AdCard ad={currentItem.ad} />
      ) : (
        <VideoPlayer video={currentItem} onNext={handleNextVideo} />
      )}
      <FooterNav />
    </div>
  );
};

export default Videos;
