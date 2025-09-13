import { useState, useCallback, useEffect } from "react";
import { ContentItem, VideoItem } from "@/types/video";
import { realSocialService } from "@/services/realSocialService";

export const useVideos = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [allItems, setAllItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVideoContent = async () => {
      try {
        const posts = await realSocialService.getPosts(1, 20);
        const videoItems: VideoItem[] = posts
          .filter((post: any) => post.media_type === 'video' || (post.media_urls && post.media_urls.some((url: string) => url.includes('video'))))
          .map((post: any) => ({
            id: post.id,
            url: post.media_urls?.[0] || '',
            thumbnail: post.thumbnail || '/placeholder.svg',
            description: post.content || '',
            likes: post.like_count || 0,
            comments: post.comment_count || 0,
            shares: post.share_count || 0,
            author: {
              name: post.author_name || 'Creator',
              username: post.author_username || `user-${String(post.user_id || '').slice(0, 8)}`,
              avatar: post.author_avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=creator",
              verified: !!post.author_verified,
            },
            isFollowing: false,
          }));

        setAllItems(videoItems as ContentItem[]);
      } catch (error) {
        console.error('Error loading video content:', error);
        setAllItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideoContent();
  }, []);

  const handleNextVideo = useCallback(() => {
    setCurrentIndex((prev) => (prev < allItems.length - 1 ? prev + 1 : 0));
  }, [allItems.length]);

  const handlePrevVideo = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : allItems.length - 1));
  }, [allItems.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = useCallback(() => {
    if (touchStart - touchEnd > 50) {
      handleNextVideo();
    } else if (touchEnd - touchStart > 50) {
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
    isLoading,
    swipeHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    currentIndex,
  };
};
