
import { useState } from "react";
import { ContentItem, VideoItem, AdItem } from "@/types/video";
import { mockVideos, mockAdData } from "@/data/mockVideosData";

export const useVideos = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Combine videos and ads into a single content feed
  const allItems: ContentItem[] = [
    ...mockVideos.slice(0, 2), 
    { isAd: true, ad: mockAdData } as AdItem, 
    ...mockVideos.slice(2)
  ];

  const handleNextVideo = () => {
    if (currentIndex < allItems.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const getCurrentItem = (): ContentItem | null => {
    if (allItems.length === 0) return null;
    return allItems[currentIndex % allItems.length];
  };

  return {
    currentItem: getCurrentItem(),
    handleNextVideo,
    allItems
  };
};
