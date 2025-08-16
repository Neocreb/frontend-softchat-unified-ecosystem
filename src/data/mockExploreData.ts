// Production-ready explore data structure
// In production, this data would be fetched from the API

export interface ExploreUser {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  isVerified: boolean;
  followerCount: number;
  bio?: string;
  badges: string[];
}

export interface ExploreGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isJoined: boolean;
  category: string;
  image?: string;
}

export interface ExploreHashtag {
  id: string;
  tag: string;
  postCount: number;
  trending: boolean;
}

export interface ExploreContent {
  id: string;
  type: 'post' | 'video' | 'story';
  title?: string;
  thumbnail?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    verified: boolean;
  };
  stats: {
    likes: number;
    views: number;
    comments: number;
  };
}

// Default empty data for production
export const exploreUsers: ExploreUser[] = [];

export const exploreGroups: ExploreGroup[] = [];

export const exploreHashtags: ExploreHashtag[] = [
  { id: '1', tag: 'marketplace', postCount: 0, trending: false },
  { id: '2', tag: 'trending', postCount: 0, trending: false },
  { id: '3', tag: 'featured', postCount: 0, trending: false },
  { id: '4', tag: 'popular', postCount: 0, trending: false },
];

export const exploreContent: ExploreContent[] = [];

// API functions for production use
export const exploreService = {
  async getUsers(page = 1, limit = 20): Promise<ExploreUser[]> {
    try {
      const response = await fetch(`/api/explore/users?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      return await response.json();
    } catch (error) {
      console.error('Error fetching explore users:', error);
      return [];
    }
  },

  async getGroups(category?: string): Promise<ExploreGroup[]> {
    try {
      const url = category 
        ? `/api/explore/groups?category=${category}`
        : '/api/explore/groups';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch groups');
      return await response.json();
    } catch (error) {
      console.error('Error fetching explore groups:', error);
      return [];
    }
  },

  async getHashtags(trending = false): Promise<ExploreHashtag[]> {
    try {
      const url = trending 
        ? '/api/explore/hashtags?trending=true'
        : '/api/explore/hashtags';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch hashtags');
      return await response.json();
    } catch (error) {
      console.error('Error fetching explore hashtags:', error);
      return exploreHashtags; // Return default hashtags as fallback
    }
  },

  async getContent(type?: string, page = 1): Promise<ExploreContent[]> {
    try {
      const url = type 
        ? `/api/explore/content?type=${type}&page=${page}`
        : `/api/explore/content?page=${page}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch content');
      return await response.json();
    } catch (error) {
      console.error('Error fetching explore content:', error);
      return [];
    }
  },

  async searchUsers(query: string): Promise<ExploreUser[]> {
    try {
      const response = await fetch(`/api/explore/search/users?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search users');
      return await response.json();
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  },

  async searchGroups(query: string): Promise<ExploreGroup[]> {
    try {
      const response = await fetch(`/api/explore/search/groups?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search groups');
      return await response.json();
    } catch (error) {
      console.error('Error searching groups:', error);
      return [];
    }
  },
};

export default {
  exploreUsers,
  exploreGroups,
  exploreHashtags,
  exploreContent,
  exploreService,
};
