// src/services/feedService.ts
export interface MediaUpload {
  type: "image" | "video";
  file: File;
  preview?: string;
}

export interface PostCreationData {
  content: string;
  media?: MediaUpload[];
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
  privacy: "public" | "friends" | "private";
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
  // Media upload functionality
  async uploadMedia(files: File[]): Promise<MediaUpload[]> {
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
  async createPost(postData: PostCreationData): Promise<any> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

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
  ): Promise<{ isLiked: boolean; likesCount: number }> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      isLiked: !currentlyLiked,
      likesCount: currentlyLiked ? -1 : 1, // This would be the actual count from API
    };
  }

  // Save/unsave a post
  async toggleSave(
    postId: string,
    currentlySaved: boolean,
  ): Promise<{ isSaved: boolean }> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      isSaved: !currentlySaved,
    };
  }

  // Share a post
  async sharePost(
    postId: string,
  ): Promise<{ success: boolean; shareCount: number }> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      success: true,
      shareCount: 1, // This would be updated count from API
    };
  }

  // Get comments for a post
  async getComments(postId: string): Promise<Comment[]> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock comments data
    return [
      {
        id: "1",
        userId: "101",
        userName: "Alice Johnson",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
        content: "Great post! Really insightful.",
        timestamp: "2 hours ago",
        likes: 5,
        isLiked: false,
      },
      {
        id: "2",
        userId: "102",
        userName: "Mike Chen",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
        content: "I totally agree with this perspective!",
        timestamp: "1 hour ago",
        likes: 12,
        isLiked: true,
      },
    ];
  }

  // Add a comment
  async addComment(postId: string, content: string): Promise<Comment> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 400));

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
  async searchLocations(query: string): Promise<typeof LOCATION_SUGGESTIONS> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

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
}

export const feedService = new FeedService();
