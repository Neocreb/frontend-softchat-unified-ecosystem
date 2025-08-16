// Production-ready video data structure
// In production, this data would be fetched from the API

export interface VideoData {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  duration: number; // in seconds
  author: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    verified: boolean;
    followerCount: number;
  };
  stats: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  tags: string[];
  category: string;
  isLiked: boolean;
  isFollowing: boolean;
  timestamp: string;
  quality: {
    '360p'?: string;
    '720p'?: string;
    '1080p'?: string;
  };
}

export interface VideoComment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: VideoComment[];
}

export interface VideoPlaylist {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  videoCount: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// Default empty data for production
export const videosData: VideoData[] = [];

export const trendingVideos: VideoData[] = [];

export const videoPlaylists: VideoPlaylist[] = [];

// API functions for production use
export const videoService = {
  async getVideos(page = 1, limit = 20, category?: string): Promise<VideoData[]> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (category) params.append('category', category);

      const response = await fetch(`/api/videos?${params}`);
      if (!response.ok) throw new Error('Failed to fetch videos');
      return await response.json();
    } catch (error) {
      console.error('Error fetching videos:', error);
      return [];
    }
  },

  async getTrendingVideos(limit = 10): Promise<VideoData[]> {
    try {
      const response = await fetch(`/api/videos/trending?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch trending videos');
      return await response.json();
    } catch (error) {
      console.error('Error fetching trending videos:', error);
      return [];
    }
  },

  async getVideo(videoId: string): Promise<VideoData | null> {
    try {
      const response = await fetch(`/api/videos/${videoId}`);
      if (!response.ok) throw new Error('Video not found');
      return await response.json();
    } catch (error) {
      console.error('Error fetching video:', error);
      return null;
    }
  },

  async uploadVideo(videoData: {
    title: string;
    description?: string;
    file: File;
    thumbnail?: File;
    tags: string[];
    category: string;
    isPublic: boolean;
  }): Promise<VideoData> {
    try {
      const formData = new FormData();
      formData.append('title', videoData.title);
      if (videoData.description) formData.append('description', videoData.description);
      formData.append('video', videoData.file);
      if (videoData.thumbnail) formData.append('thumbnail', videoData.thumbnail);
      formData.append('tags', JSON.stringify(videoData.tags));
      formData.append('category', videoData.category);
      formData.append('isPublic', videoData.isPublic.toString());

      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload video');
      return await response.json();
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  },

  async likeVideo(videoId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/videos/${videoId}/like`, {
        method: 'POST',
      });
      return response.ok;
    } catch (error) {
      console.error('Error liking video:', error);
      return false;
    }
  },

  async addComment(videoId: string, content: string): Promise<VideoComment | null> {
    try {
      const response = await fetch(`/api/videos/${videoId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error('Failed to add comment');
      return await response.json();
    } catch (error) {
      console.error('Error adding comment:', error);
      return null;
    }
  },

  async getComments(videoId: string, page = 1): Promise<VideoComment[]> {
    try {
      const response = await fetch(`/api/videos/${videoId}/comments?page=${page}`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      return await response.json();
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },

  async shareVideo(videoId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/videos/${videoId}/share`, {
        method: 'POST',
      });
      return response.ok;
    } catch (error) {
      console.error('Error sharing video:', error);
      return false;
    }
  },

  async followUser(userId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: 'POST',
      });
      return response.ok;
    } catch (error) {
      console.error('Error following user:', error);
      return false;
    }
  },

  async searchVideos(query: string, page = 1): Promise<VideoData[]> {
    try {
      const response = await fetch(`/api/videos/search?q=${encodeURIComponent(query)}&page=${page}`);
      if (!response.ok) throw new Error('Failed to search videos');
      const data = await response.json();
      return data.videos || [];
    } catch (error) {
      console.error('Error searching videos:', error);
      return [];
    }
  },

  async getPlaylists(userId?: string): Promise<VideoPlaylist[]> {
    try {
      const url = userId ? `/api/playlists?userId=${userId}` : '/api/playlists';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch playlists');
      return await response.json();
    } catch (error) {
      console.error('Error fetching playlists:', error);
      return [];
    }
  },

  async createPlaylist(name: string, description?: string, isPublic = true): Promise<VideoPlaylist> {
    try {
      const response = await fetch('/api/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, isPublic }),
      });

      if (!response.ok) throw new Error('Failed to create playlist');
      return await response.json();
    } catch (error) {
      console.error('Error creating playlist:', error);
      throw error;
    }
  },

  async addToPlaylist(playlistId: string, videoId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/playlists/${playlistId}/videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error adding video to playlist:', error);
      return false;
    }
  },
};

export default {
  videosData,
  trendingVideos,
  videoPlaylists,
  videoService,
};
