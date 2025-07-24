import { feedService } from './feedService';

export interface FeedVideoData {
  id: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    verified: boolean;
    followerCount?: number;
    isFollowing?: boolean;
  };
  description: string;
  music: {
    title: string;
    artist: string;
    id?: string;
    duration?: number;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
    views: string;
    saves?: number;
  };
  hashtags: string[];
  videoUrl: string;
  thumbnail: string;
  duration: number;
  timestamp?: string;
  category?: string;
  isFromFeed: boolean;
  allowDuets?: boolean;
  allowComments?: boolean;
  hasCaption?: boolean;
  isSponsored?: boolean;
}

class VideoFeedIntegrationService {
  /**
   * Get videos uploaded through the feed system
   */
  async getFeedVideos(): Promise<FeedVideoData[]> {
    try {
      // Get posts from feed service that have video content
      const feedPosts = await feedService.getFeedPosts();
      
      // Filter and transform posts with videos to video format
      const videoFeeds: FeedVideoData[] = feedPosts
        .filter(post => post.videoUrl && post.videoUrl.trim() !== '')
        .map(post => ({
          id: `feed_${post.id}`,
          user: {
            id: post.userId,
            username: post.author?.username || 'unknown',
            displayName: post.author?.name || 'Unknown User',
            avatar: post.author?.avatar || 'https://i.pravatar.cc/150?img=1',
            verified: post.author?.verified || false,
            followerCount: post.author?.followerCount || 0,
            isFollowing: post.author?.isFollowing || false,
          },
          description: post.content || '',
          music: {
            title: 'Original Sound',
            artist: post.author?.name || 'Unknown',
            id: `original_${post.id}`,
            duration: 30,
          },
          stats: {
            likes: post.likes || 0,
            comments: post.comments || 0,
            shares: post.shares || 0,
            views: this.formatViewCount(post.views || 0),
            saves: 0,
          },
          hashtags: post.tags || [],
          videoUrl: post.videoUrl,
          thumbnail: post.thumbnail || post.imageUrl || 'https://via.placeholder.com/400x600?text=Video',
          duration: post.videoDuration || 30,
          timestamp: this.formatTimestamp(post.createdAt),
          category: post.category || 'User Content',
          isFromFeed: true,
          allowDuets: true,
          allowComments: true,
          hasCaption: Boolean(post.content),
          isSponsored: false,
        }));

      return videoFeeds;
    } catch (error) {
      console.error('Error fetching feed videos:', error);
      return [];
    }
  }

  /**
   * Upload a video through the feed system
   */
  async uploadVideoToFeed(videoFile: File, metadata: {
    description: string;
    hashtags: string[];
    category?: string;
    thumbnail?: File;
  }): Promise<boolean> {
    try {
      // Upload the video file
      const uploadResult = await feedService.uploadMedia([videoFile]);
      
      if (uploadResult.length === 0) {
        throw new Error('Failed to upload video');
      }

      // Create a post with the video
      const postData = {
        content: metadata.description,
        videoUrl: uploadResult[0].url,
        thumbnail: uploadResult[0].thumbnail,
        tags: metadata.hashtags,
        category: metadata.category,
        type: 'video' as const,
      };

      await feedService.createPost(postData);
      return true;
    } catch (error) {
      console.error('Error uploading video to feed:', error);
      return false;
    }
  }

  /**
   * Get user's own videos from feed
   */
  async getUserFeedVideos(userId: string): Promise<FeedVideoData[]> {
    try {
      const userPosts = await feedService.getUserPosts(userId);
      
      const userVideos: FeedVideoData[] = userPosts
        .filter(post => post.videoUrl && post.videoUrl.trim() !== '')
        .map(post => ({
          id: `user_feed_${post.id}`,
          user: {
            id: post.userId,
            username: post.author?.username || 'user',
            displayName: post.author?.name || 'User',
            avatar: post.author?.avatar || 'https://i.pravatar.cc/150?img=1',
            verified: post.author?.verified || false,
            followerCount: post.author?.followerCount || 0,
            isFollowing: false,
          },
          description: post.content || '',
          music: {
            title: 'Original Sound',
            artist: post.author?.name || 'User',
            id: `user_original_${post.id}`,
            duration: 30,
          },
          stats: {
            likes: post.likes || 0,
            comments: post.comments || 0,
            shares: post.shares || 0,
            views: this.formatViewCount(post.views || 0),
            saves: 0,
          },
          hashtags: post.tags || [],
          videoUrl: post.videoUrl,
          thumbnail: post.thumbnail || post.imageUrl || 'https://via.placeholder.com/400x600?text=My+Video',
          duration: post.videoDuration || 30,
          timestamp: this.formatTimestamp(post.createdAt),
          category: post.category || 'My Content',
          isFromFeed: true,
          allowDuets: true,
          allowComments: true,
          hasCaption: Boolean(post.content),
          isSponsored: false,
        }));

      return userVideos;
    } catch (error) {
      console.error('Error fetching user feed videos:', error);
      return [];
    }
  }

  /**
   * Update video stats (likes, comments, shares)
   */
  async updateVideoStats(videoId: string, action: 'like' | 'comment' | 'share', increment: boolean = true): Promise<boolean> {
    try {
      // Extract the original post ID from the video ID
      const postId = videoId.replace(/^(feed_|user_feed_)/, '');
      
      // Update the corresponding post stats
      return await feedService.updatePostStats(postId, action, increment);
    } catch (error) {
      console.error('Error updating video stats:', error);
      return false;
    }
  }

  /**
   * Format view count for display
   */
  private formatViewCount(views: number): string {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  }

  /**
   * Format timestamp for display
   */
  private formatTimestamp(createdAt: Date | string): string {
    const date = new Date(createdAt);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d`;
    }
  }
}

export const videoFeedIntegrationService = new VideoFeedIntegrationService();
