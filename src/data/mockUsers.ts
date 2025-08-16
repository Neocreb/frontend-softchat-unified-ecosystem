// Production-ready user data structure
// In production, this data would be fetched from the API

export interface User {
  id: string;
  username: string;
  name: string;
  email?: string;
  avatar?: string;
  banner?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinedDate: string;
  isVerified: boolean;
  isPrivate: boolean;
  stats: {
    followers: number;
    following: number;
    posts: number;
    likes: number;
  };
  badges: UserBadge[];
  preferences: UserPreferences;
  marketplaceProfile?: MarketplaceProfile;
}

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    showEmail: boolean;
    showLocation: boolean;
    allowMessages: boolean;
    allowTags: boolean;
  };
}

export interface MarketplaceProfile {
  sellerId?: string;
  sellerName?: string;
  businessType: 'individual' | 'business';
  businessInfo?: {
    companyName: string;
    registrationNumber: string;
    taxId: string;
    address: string;
    phone: string;
    email: string;
  };
  sellerRating: number;
  totalSales: number;
  productsListed: number;
  joinedMarketplace: string;
  isVerifiedSeller: boolean;
  specializations: string[];
  policies: {
    returnPolicy: string;
    shippingPolicy: string;
    refundPolicy: string;
  };
}

export interface UserActivity {
  id: string;
  type: 'post' | 'like' | 'comment' | 'follow' | 'purchase' | 'sale';
  description: string;
  timestamp: string;
  metadata?: any;
}

// Default empty data for production
export const users: User[] = [];

export const currentUser: User | null = null;

// API functions for production use
export const userService = {
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch('/api/users/me');
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },

  async getUser(userId: string): Promise<User | null> {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  async getUserByUsername(username: string): Promise<User | null> {
    try {
      const response = await fetch(`/api/users/username/${username}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return null;
    }
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      return await response.json();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  async uploadAvatar(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/users/me/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload avatar');
      const data = await response.json();
      return data.avatarUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },

  async uploadBanner(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('banner', file);

      const response = await fetch('/api/users/me/banner', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload banner');
      const data = await response.json();
      return data.bannerUrl;
    } catch (error) {
      console.error('Error uploading banner:', error);
      throw error;
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

  async unfollowUser(userId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/users/${userId}/unfollow`, {
        method: 'POST',
      });
      return response.ok;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      return false;
    }
  },

  async getFollowers(userId: string, page = 1): Promise<User[]> {
    try {
      const response = await fetch(`/api/users/${userId}/followers?page=${page}`);
      if (!response.ok) throw new Error('Failed to fetch followers');
      return await response.json();
    } catch (error) {
      console.error('Error fetching followers:', error);
      return [];
    }
  },

  async getFollowing(userId: string, page = 1): Promise<User[]> {
    try {
      const response = await fetch(`/api/users/${userId}/following?page=${page}`);
      if (!response.ok) throw new Error('Failed to fetch following');
      return await response.json();
    } catch (error) {
      console.error('Error fetching following:', error);
      return [];
    }
  },

  async searchUsers(query: string, page = 1): Promise<User[]> {
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}&page=${page}`);
      if (!response.ok) throw new Error('Failed to search users');
      const data = await response.json();
      return data.users || [];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  },

  async getUserActivity(userId: string, page = 1): Promise<UserActivity[]> {
    try {
      const response = await fetch(`/api/users/${userId}/activity?page=${page}`);
      if (!response.ok) throw new Error('Failed to fetch user activity');
      return await response.json();
    } catch (error) {
      console.error('Error fetching user activity:', error);
      return [];
    }
  },

  async updatePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    try {
      const response = await fetch('/api/users/me/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) throw new Error('Failed to update preferences');
      return await response.json();
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  },

  async createMarketplaceProfile(profileData: Omit<MarketplaceProfile, 'sellerRating' | 'totalSales' | 'productsListed' | 'joinedMarketplace'>): Promise<MarketplaceProfile> {
    try {
      const response = await fetch('/api/users/me/marketplace-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error('Failed to create marketplace profile');
      return await response.json();
    } catch (error) {
      console.error('Error creating marketplace profile:', error);
      throw error;
    }
  },

  async updateMarketplaceProfile(updates: Partial<MarketplaceProfile>): Promise<MarketplaceProfile> {
    try {
      const response = await fetch('/api/users/me/marketplace-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update marketplace profile');
      return await response.json();
    } catch (error) {
      console.error('Error updating marketplace profile:', error);
      throw error;
    }
  },

  async deleteAccount(): Promise<boolean> {
    try {
      const response = await fetch('/api/users/me', {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting account:', error);
      return false;
    }
  },
};

export default {
  users,
  currentUser,
  userService,
};
