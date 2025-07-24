// src/services/feedService.ts
export interface MediaUpload {
  type: "image" | "video";
  file: File;
  preview?: string;
}

export interface PostCreationData {
  content: string;
  media?: MediaUpload[];
  videoUrl?: string;
  thumbnail?: string;
  imageUrl?: string;
  tags?: string[];
  category?: string;
  type?: 'text' | 'image' | 'video';
  videoDuration?: number;
  feeling?: {
    emoji: string;
    text: string;
  };
  location?: {
    name: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  privacy?: "public" | "friends" | "private";
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

// Feelings/Activities data
export const FEELINGS = [
  { emoji: "😊", text: "happy" },
  { emoji: "😢", text: "sad" },
  { emoji: "😍", text: "in love" },
  { emoji: "😴", text: "sleepy" },
  { emoji: "🤯", text: "mind blown" },
  { emoji: "🥳", text: "celebrating" },
  { emoji: "😤", text: "frustrated" },
  { emoji: "🤔", text: "thoughtful" },
  { emoji: "😎", text: "cool" },
  { emoji: "🥰", text: "grateful" },
  { emoji: "💪", text: "motivated" },
  { emoji: "🌟", text: "amazing" },
];

export const ACTIVITIES = [
  { emoji: "🍕", text: "eating" },
  { emoji: "✈️", text: "traveling" },
  { emoji: "🏋️", text: "working out" },
  { emoji: "📚", text: "reading" },
  { emoji: "🎵", text: "listening to music" },
  { emoji: "📺", text: "watching" },
  { emoji: "💼", text: "working" },
  { emoji: "🎮", text: "gaming" },
  { emoji: "🍳", text: "cooking" },
  { emoji: "🛍️", text: "shopping" },
];

// Location suggestions (in real app, this would come from a maps API)
export const LOCATION_SUGGESTIONS = [
  { name: "New York, NY", coordinates: { lat: 40.7128, lng: -74.006 } },
  { name: "Los Angeles, CA", coordinates: { lat: 34.0522, lng: -118.2437 } },
  { name: "Chicago, IL", coordinates: { lat: 41.8781, lng: -87.6298 } },
  { name: "Miami, FL", coordinates: { lat: 25.7617, lng: -80.1918 } },
  { name: "San Francisco, CA", coordinates: { lat: 37.7749, lng: -122.4194 } },
  { name: "Seattle, WA", coordinates: { lat: 47.6062, lng: -122.3321 } },
  { name: "Austin, TX", coordinates: { lat: 30.2672, lng: -97.7431 } },
  { name: "Denver, CO", coordinates: { lat: 39.7392, lng: -104.9903 } },
];

class FeedService {
  // Helper method for delays with abort support
  private delay(ms: number, signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(new Error("Request was aborted"));
        return;
      }

      const timeout = setTimeout(() => {
        resolve();
      }, ms);

      signal?.addEventListener("abort", () => {
        clearTimeout(timeout);
        reject(new Error("Request was aborted"));
      });
    });
  }

  // Media upload functionality
  async uploadMedia(
    files: File[],
    signal?: AbortSignal,
  ): Promise<MediaUpload[]> {
    const uploads: MediaUpload[] = [];

    for (const file of files) {
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");

      if (!isVideo && !isImage) {
        throw new Error("Only image and video files are supported");
      }

      // Create preview URL
      const preview = URL.createObjectURL(file);

      uploads.push({
        type: isVideo ? "video" : "image",
        file,
        preview,
      });
    }

    return uploads;
  }

  // Create a new post
  async createPost(
    postData: PostCreationData,
    signal?: AbortSignal,
  ): Promise<any> {
    // Simulate API call with abort support
    await this.delay(1000, signal);

    const newPost = {
      id: Date.now().toString(),
      user: {
        id: "current-user",
        name: "You",
        username: "you",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
        isVerified: false,
      },
      content: postData.content,
      media:
        postData.media?.map((m) => ({
          type: m.type,
          url: m.preview || "",
          alt: `${m.type} post`,
        })) || [],
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isSaved: false,
      location: postData.location?.name,
      privacy: postData.privacy,
      feeling: postData.feeling,
    };

    return newPost;
  }

  // Like/unlike a post
  async toggleLike(
    postId: string,
    currentlyLiked: boolean,
    signal?: AbortSignal,
  ): Promise<{ isLiked: boolean; likesCount: number }> {
    // Simulate API call with abort support
    await this.delay(300, signal);

    return {
      isLiked: !currentlyLiked,
      likesCount: currentlyLiked ? -1 : 1, // This would be the actual count from API
    };
  }

  // Save/unsave a post
  async toggleSave(
    postId: string,
    currentlySaved: boolean,
    signal?: AbortSignal,
  ): Promise<{ isSaved: boolean }> {
    // Simulate API call with abort support
    await this.delay(300, signal);

    return {
      isSaved: !currentlySaved,
    };
  }

  // Share a post
  async sharePost(
    postId: string,
    signal?: AbortSignal,
  ): Promise<{ success: boolean; shareCount: number }> {
    // Simulate API call with abort support
    await this.delay(500, signal);

    return {
      success: true,
      shareCount: 1, // This would be updated count from API
    };
  }

  // Get comments for a post
  async getComments(postId: string, signal?: AbortSignal): Promise<Comment[]> {
    // Simulate API call with abort support
    await this.delay(300, signal);

    // In a real implementation, this would fetch from API
    // For now, return empty array to enable real-time comment functionality
    return [];
  }

  // Add a comment
  async addComment(
    postId: string,
    content: string,
    signal?: AbortSignal,
  ): Promise<Comment> {
    // Simulate API call with abort support
    await this.delay(400, signal);

    return {
      id: Date.now().toString(),
      userId: "current-user",
      userName: "You",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
      content,
      timestamp: "Just now",
      likes: 0,
      isLiked: false,
    };
  }

  // Search locations
  async searchLocations(
    query: string,
    signal?: AbortSignal,
  ): Promise<typeof LOCATION_SUGGESTIONS> {
    // Simulate API call with abort support
    await this.delay(300, signal);

    return LOCATION_SUGGESTIONS.filter((location) =>
      location.name.toLowerCase().includes(query.toLowerCase()),
    );
  }

  // Get current location
  async getCurrentLocation(): Promise<{
    name: string;
    coordinates: { lat: number; lng: number };
  } | null> {
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        },
      );

      // In a real app, you'd reverse geocode these coordinates
      return {
        name: "Current Location",
        coordinates: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
      };
    } catch (error) {
      console.error("Error getting location:", error);
      return null;
    }
  }

  // Get feed posts (for video integration)
  async getFeedPosts(signal?: AbortSignal): Promise<any[]> {
    await this.delay(500, signal);

    // Return mock posts with some video content
    return [
      {
        id: "feed1",
        userId: "user1",
        content: "Check out my latest video! 🎬 #video #content",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        thumbnail: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400",
        imageUrl: null,
        tags: ["video", "content", "amazing"],
        category: "Entertainment",
        videoDuration: 30,
        likes: 245,
        comments: 12,
        shares: 8,
        views: 1250,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        author: {
          id: "user1",
          name: "Alex Creator",
          username: "alexcreator",
          avatar: "https://i.pravatar.cc/150?img=10",
          verified: true,
          followerCount: 5420,
          isFollowing: false,
        }
      },
      {
        id: "feed2",
        userId: "user2",
        content: "Dancing in the rain! 💃 Who else loves rainy days? #dance #rain #mood",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        thumbnail: "https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=400",
        imageUrl: null,
        tags: ["dance", "rain", "mood", "vibes"],
        category: "Lifestyle",
        videoDuration: 45,
        likes: 892,
        comments: 45,
        shares: 23,
        views: 3420,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        author: {
          id: "user2",
          name: "Sophie Dance",
          username: "sophiedance",
          avatar: "https://i.pravatar.cc/150?img=25",
          verified: false,
          followerCount: 1250,
          isFollowing: true,
        }
      }
    ];
  }

  // Get user-specific posts
  async getUserPosts(userId: string, signal?: AbortSignal): Promise<any[]> {
    await this.delay(300, signal);

    // Return user's posts (filtered from all posts)
    const allPosts = await this.getFeedPosts(signal);
    return allPosts.filter(post => post.userId === userId);
  }

  // Update post stats
  async updatePostStats(postId: string, action: 'like' | 'comment' | 'share', increment: boolean = true, signal?: AbortSignal): Promise<boolean> {
    await this.delay(200, signal);

    // In a real implementation, this would update the database
    console.log(`Updated post ${postId} - ${action}: ${increment ? '+1' : '-1'}`);
    return true;
  }

  // Create post with enhanced data structure
  async createPost(postData: any, signal?: AbortSignal): Promise<any> {
    await this.delay(1000, signal);

    const newPost = {
      id: Date.now().toString(),
      userId: "current-user",
      content: postData.content,
      videoUrl: postData.videoUrl || null,
      thumbnail: postData.thumbnail || null,
      imageUrl: postData.imageUrl || null,
      tags: postData.tags || [],
      category: postData.category || 'General',
      type: postData.type || 'text',
      videoDuration: postData.videoDuration || null,
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      createdAt: new Date(),
      author: {
        id: "current-user",
        name: "You",
        username: "you",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
        verified: false,
        followerCount: 0,
        isFollowing: false,
      }
    };

    return newPost;
  }
}

export const feedService = new FeedService();
