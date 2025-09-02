import { useState, useCallback, useEffect } from "react";
import { ContentItem, VideoItem, AdItem } from "@/types/video";
import { mockAdData } from "@/data/mockVideosData";
import { realSocialService } from "@/services/realSocialService";

export const useVideos = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [allItems, setAllItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load real video content from Supabase
  useEffect(() => {
    const loadVideoContent = async () => {
      try {
        const posts = await realSocialService.getPosts(1, 20);
        
        // Filter posts that have video content
        const videoPosts = posts.filter(post => 
          post.media_type === 'video' || 
          (post.media_urls && post.media_urls.some(url => url.includes('video')))
        );

        // Transform to video format
        const videoItems: VideoItem[] = videoPosts.map(post => ({
          id: post.id,
          url: post.media_urls?.[0] || '',
          title: post.content.substring(0, 50) + (post.content.length > 50 ? '...' : ''),
          description: post.content,
          creator: {
            id: post.user_id,
            name: post.author_name || "Creator",
            username: post.author_username || `user-${post.user_id.slice(0, 8)}`,
            avatar: post.author_avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=creator",
            verified: false,
          },
          stats: {
            likes: post.like_count || 0,
            comments: post.comment_count || 0,
            shares: post.share_count || 0,
            views: Math.floor(Math.random() * 10000) + 1000, // Mock for now
          },
          hashtags: ['#video', '#content'],
          isAd: false
        }));

        // Add some ads between videos
        const itemsWithAds: ContentItem[] = [];
        videoItems.forEach((video, index) => {
          itemsWithAds.push(video);
          // Insert ad every 3 videos
          if ((index + 1) % 3 === 0) {
            itemsWithAds.push({ isAd: true, ad: mockAdData } as AdItem);
          }
        });

        setAllItems(itemsWithAds);
      } catch (error) {
        console.error('Error loading video content:', error);
        // Fallback to showing just ad content
        setAllItems([{ isAd: true, ad: mockAdData } as AdItem]);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideoContent();
  }, []);

  const handleNextVideo = useCallback(() => {
    setCurrentIndex((prev) =>
      prev < allItems.length - 1 ? prev + 1 : 0
    );
  }, [allItems.length]);

  const handlePrevVideo = useCallback(() => {
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : allItems.length - 1
    );
  }, [allItems.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = useCallback(() => {
    if (touchStart - touchEnd > 50) {
      // Swipe up
      handleNextVideo();
    } else if (touchEnd - touchStart > 50) {
      // Swipe down
      handlePrevVideo();
    }
  }, [touchStart, touchEnd, handleNextVideo, handlePrevVideo]);

  const getCurrentItem = (): ContentItem | null => {
    if (allItems.length === 0) return null;
    return allItems[currentIndex % allItems.length];
  };

  return {
    currentItem: getCurrentItem(),
    handleNextVideo,
    handlePrevVideo,
    allItems,
    swipeHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    currentIndex,
  };
};