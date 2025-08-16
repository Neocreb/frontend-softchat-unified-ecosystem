// Production-ready feed data structure
// In production, this data would be fetched from the API

export interface FeedPost {
  id: string;
  type: 'text' | 'image' | 'video' | 'marketplace';
  content: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    verified: boolean;
  };
  media?: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  }[];
  stats: {
    likes: number;
    comments: number;
    shares: number;
    views?: number;
  };
  timestamp: string;
  isLiked: boolean;
  isBookmarked: boolean;
  comments: FeedComment[];
}

export interface FeedComment {
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
  replies?: FeedComment[];
}

export interface FeedStory {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  thumbnail?: string;
  isViewed: boolean;
  timestamp: string;
}

// Default empty data for production
export const feedPosts: FeedPost[] = [];

export const feedStories: FeedStory[] = [];

// API functions for production use
export const feedService = {
  async getPosts(page = 1, limit = 20): Promise<FeedPost[]> {
    try {
      const response = await fetch(`/api/feed/posts?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      return await response.json();
    } catch (error) {
      console.error('Error fetching feed posts:', error);
      return [];
    }
  },

  async getStories(): Promise<FeedStory[]> {
    try {
      const response = await fetch('/api/feed/stories');
      if (!response.ok) throw new Error('Failed to fetch stories');
      return await response.json();
    } catch (error) {
      console.error('Error fetching feed stories:', error);
      return [];
    }
  },

  async createPost(postData: {
    content: string;
    type: FeedPost['type'];
    media?: File[];
  }): Promise<FeedPost> {
    try {
      const formData = new FormData();
      formData.append('content', postData.content);
      formData.append('type', postData.type);
      
      if (postData.media) {
        postData.media.forEach((file, index) => {
          formData.append(`media_${index}`, file);
        });
      }

      const response = await fetch('/api/feed/posts', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to create post');
      return await response.json();
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  async likePost(postId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/feed/posts/${postId}/like`, {
        method: 'POST',
      });
      return response.ok;
    } catch (error) {
      console.error('Error liking post:', error);
      return false;
    }
  },

  async addComment(postId: string, content: string): Promise<FeedComment | null> {
    try {
      const response = await fetch(`/api/feed/posts/${postId}/comments`, {
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

  async sharePost(postId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/feed/posts/${postId}/share`, {
        method: 'POST',
      });
      return response.ok;
    } catch (error) {
      console.error('Error sharing post:', error);
      return false;
    }
  },

  async bookmarkPost(postId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/feed/posts/${postId}/bookmark`, {
        method: 'POST',
      });
      return response.ok;
    } catch (error) {
      console.error('Error bookmarking post:', error);
      return false;
    }
  },

  async deletePost(postId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/feed/posts/${postId}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting post:', error);
      return false;
    }
  },
};

export default {
  feedPosts,
  feedStories,
  feedService,
};
