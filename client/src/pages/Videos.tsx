import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import FooterNav from "@/components/layout/FooterNav";
import VideoPlayer from "@/components/videos/VideoPlayer";
import AdCard from "@/components/videos/AdCard";
import EnhancedVideoCreator from "@/components/video/EnhancedVideoCreator";
import { useVideos } from "@/hooks/use-videos";
import { VideoItem, AdItem } from "@/types/video";
import { ArrowUpIcon, Plus, Compass, TrendingUp, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <div className="h-[calc(92vh-4rem)] pb-16 md:pb-0 bg-black flex items-center 
      overflow-hidden justify-center text-white">
        <p>No videos available</p>
        <FooterNav />
      </div>
    );
  }

  return (
    <div
      className="h-[calc(92vh-4rem)] pb-16 md:pb-0 bg-black overflow-hidden relative"
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

      {/* Navigation indicators (optional) */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <div className="flex justify-center pt-4">
          <span className="flex gap-2 text-gray-400 text-sm animate-bounce">Swipe up for next <ArrowUpIcon /></span>
        </div>
      </div>

      <FooterNav />
    </div>
  );
};

export default Videos;