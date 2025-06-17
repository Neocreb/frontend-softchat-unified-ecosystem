import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Image,
  Video,
  MapPin,
  Smile,
  Send,
  Camera,
  Plus,
  Play,
  Volume2,
  VolumeX,
  Users,
  Globe,
  Lock,
  ChevronLeft,
  ChevronRight,
  X,
  Edit,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { MediaUploadModal } from "@/components/feed/MediaUploadModal";
import { FeelingLocationModal } from "@/components/feed/FeelingLocationModal";
import { EnhancedCommentsSection } from "@/components/feed/EnhancedCommentsSection";
import { EnhancedStoryCreation } from "@/components/feed/EnhancedStoryCreation";
import { StoryViewerModal } from "@/components/feed/StoryViewerModal";
import { SmartContentRecommendations } from "@/components/ai/SmartContentRecommendations";
import { LiveStreamPlayer } from "@/components/livestream/LiveStreamPlayer";
import ProfileDirectAccess from "@/components/profile/ProfileDirectAccess";
import {
  MediaUpload,
  PostCreationData,
  feedService,
} from "@/services/feedService";
import {
  liveStreamingService,
  LiveStream,
} from "@/services/liveStreamingService";

// Mock data for stories
const initialMockStories = [
  {
    id: "2",
    user: {
      id: "2",
      name: "Alice Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      username: "alice_j",
    },
    type: "image" as const,
    media: {
      type: "image" as const,
      url: "https://images.unsplash.com/photo-1494790108755-2616c27b40f2?w=150&h=150&fit=crop&crop=face",
      preview:
        "https://images.unsplash.com/photo-1494790108755-2616c27b40f2?w=150&h=150&fit=crop&crop=face",
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    duration: 15,
    privacy: "public",
    views: 45,
    hasNew: true,
  },
  {
    id: "3",
    user: {
      id: "3",
      name: "Mike Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
      username: "mike_chen",
    },
    type: "text" as const,
    textContent: "Having an amazing day! ☀️",
    backgroundColor: "bg-gradient-to-br from-blue-400 to-purple-600",
    textColor: "text-white",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    duration: 10,
    privacy: "public",
    views: 23,
    hasNew: true,
  },
  {
    id: "4",
    user: {
      id: "4",
      name: "Sarah Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      username: "sarah_w",
    },
    type: "image" as const,
    media: {
      type: "image" as const,
      url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      preview:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    duration: 15,
    privacy: "public",
    views: 67,
    hasNew: false,
  },
  {
    id: "5",
    user: {
      id: "5",
      name: "David Kim",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      username: "david_kim",
    },
    type: "video" as const,
    media: {
      type: "video" as const,
      url: "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
      preview:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    duration: 20,
    privacy: "public",
    views: 89,
    hasNew: true,
  },
];

// Mock posts data with enhanced structure
const initialMockPosts = [
  {
    id: "1",
    user: {
      id: "1",
      name: "Alice Johnson",
      username: "alice_j",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      isVerified: true,
    },
    content:
      "Just closed my first big crypto trade today! 🚀 The market has been incredible lately. Thanks to everyone who shared trading tips!",
    media: [
      {
        type: "image" as const,
        url: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=800&h=600&fit=crop",
        alt: "Trading dashboard",
      },
    ],
    timestamp: "2 hours ago",
    likes: 234,
    comments: 45,
    shares: 12,
    isLiked: false,
    isSaved: false,
    location: "New York, NY",
    privacy: "public" as const,
  },
  {
    id: "2",
    user: {
      id: "2",
      name: "Mike Chen",
      username: "mike_chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
      isVerified: false,
    },
    content:
      "Amazing sunset from my balcony today! Sometimes you need to step away from the screen and enjoy the simple things in life. 🌅✨",
    media: [
      {
        type: "image" as const,
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        alt: "Beautiful sunset",
      },
    ],
    timestamp: "4 hours ago",
    likes: 567,
    comments: 89,
    shares: 23,
    isLiked: true,
    isSaved: true,
    privacy: "public" as const,
    feeling: { emoji: "😊", text: "grateful" },
  },
  {
    id: "3",
    user: {
      id: "3",
      name: "Sarah Wilson",
      username: "sarah_w",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      isVerified: true,
    },
    content:
      "New product launch is finally here! 🎉 After months of hard work, we're excited to share this with the SoftChat community. Check it out in our marketplace!",
    media: [
      {
        type: "video" as const,
        url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        thumbnail:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
        duration: "0:45",
      },
    ],
    timestamp: "1 day ago",
    likes: 1234,
    comments: 156,
    shares: 78,
    isLiked: false,
    isSaved: false,
    privacy: "public" as const,
  },
];

interface MediaItem {
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  alt?: string;
  duration?: string;
}

interface Post {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isVerified: boolean;
  };
  content: string;
  media: MediaItem[];
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
  location?: string;
  privacy: "public" | "friends" | "private";
  feeling?: {
    emoji: string;
    text: string;
  };
}

// Enhanced Stories Component
const Stories = ({
  stories,
  onCreateStory,
  onViewStory,
}: {
  stories: any[];
  onCreateStory: () => void;
  onViewStory: (storyIndex: number, userIndex: number) => void;
}) => {
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Check if current user has stories
  const userStories = stories.filter((story) => story.user.id === user?.id);
  const otherStories = stories.filter((story) => story.user.id !== user?.id);

  // Group other stories by user
  const groupedStories = otherStories.reduce(
    (acc, story) => {
      const userId = story.user.id;
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(story);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  const storyUsers = Object.keys(groupedStories);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const storyTime = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - storyTime.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "now";
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  const getStoryPreview = (userStories: any[]) => {
    // Get the most recent story for preview
    const latestStory = userStories.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )[0];

    if (latestStory.type === "image" && latestStory.media) {
      return latestStory.media.preview || latestStory.media.url;
    } else if (latestStory.type === "video" && latestStory.media) {
      return latestStory.media.preview;
    }
    return latestStory.user.avatar;
  };

  const hasUnviewedStories = (userStories: any[]) => {
    // In a real app, you'd check if user has viewed these stories
    return userStories.some((story) => {
      const hoursSincePost =
        (new Date().getTime() - new Date(story.timestamp).getTime()) /
        (1000 * 60 * 60);
      return hoursSincePost < 24; // Stories are "new" if posted in last 24 hours
    });
  };

  return (
    <Card className="mb-4 sm:mb-6">
      <CardContent className="p-3 sm:p-4">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md hidden sm:flex h-8 w-8"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide px-0 sm:px-8"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Your Story */}
            <div className="flex-shrink-0">
              <div
                className="relative cursor-pointer group touch-target"
                onClick={onCreateStory}
              >
                <div
                  className={cn(
                    "w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5",
                    userStories.length > 0
                      ? "bg-gradient-to-r from-purple-500 to-pink-500"
                      : "bg-gray-300",
                  )}
                >
                  <div className="w-full h-full bg-white rounded-full p-0.5">
                    <Avatar className="w-full h-full">
                      <AvatarImage
                        src={
                          userStories.length > 0
                            ? getStoryPreview(userStories)
                            : user?.avatar ||
                              "https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                        }
                      />
                      <AvatarFallback className="text-xs">
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Plus className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                </div>
              </div>
              <p className="text-xs text-center mt-1 sm:mt-2 max-w-[56px] sm:max-w-[64px] truncate">
                Your Story
              </p>
            </div>

            {/* Other Users' Stories */}
            {storyUsers.map((userId, userIndex) => {
              const userStories = groupedStories[userId];
              const latestStory = userStories[0];
              const hasNew = hasUnviewedStories(userStories);

              return (
                <div key={userId} className="flex-shrink-0">
                  <div
                    className="relative cursor-pointer group touch-target"
                    onClick={() => onViewStory(0, userIndex)}
                  >
                    <div
                      className={cn(
                        "w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5",
                        hasNew
                          ? "bg-gradient-to-r from-purple-500 to-pink-500"
                          : "bg-gray-300",
                      )}
                    >
                      <div className="w-full h-full bg-white rounded-full p-0.5">
                        <Avatar className="w-full h-full">
                          <AvatarImage src={getStoryPreview(userStories)} />
                          <AvatarFallback className="text-xs">
                            {latestStory.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    {/* Time indicator */}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                      <Badge
                        variant="secondary"
                        className="text-xs px-1 py-0 h-3 sm:h-4"
                      >
                        {formatTimeAgo(latestStory.timestamp)}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-center mt-2 sm:mt-3 max-w-[56px] sm:max-w-[64px] truncate">
                    {latestStory.user.name}
                  </p>
                </div>
              );
            })}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md hidden sm:flex h-8 w-8"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced Create Post Component
const CreatePost = ({
  onPostCreated,
}: {
  onPostCreated: (post: Post) => void;
}) => {
  const { user } = useAuth();
  const [postText, setPostText] = useState("");
  const [showFullComposer, setShowFullComposer] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaUpload[]>([]);
  const [selectedFeeling, setSelectedFeeling] = useState<{
    emoji: string;
    text: string;
  } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    coordinates?: { lat: number; lng: number };
  } | null>(null);
  const [privacy, setPrivacy] = useState<"public" | "friends" | "private">(
    "public",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal states
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showFeelingModal, setShowFeelingModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const { toast } = useToast();

  const handleCreatePost = async () => {
    if (!postText.trim() && selectedMedia.length === 0) return;

    setIsSubmitting(true);
    try {
      const postData: PostCreationData = {
        content: postText,
        media: selectedMedia,
        feeling: selectedFeeling || undefined,
        location: selectedLocation || undefined,
        privacy,
      };

      const newPost = await feedService.createPost(postData);

      // Add the new post to the feed
      onPostCreated(newPost);

      // Reset form
      setPostText("");
      setSelectedMedia([]);
      setSelectedFeeling(null);
      setSelectedLocation(null);
      setShowFullComposer(false);

      toast({
        title: "Post created!",
        description: "Your post has been shared with your followers.",
      });
    } catch (error) {
      toast({
        title: "Failed to create post",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeMedia = (index: number) => {
    setSelectedMedia((prev) => {
      const newMedia = [...prev];
      if (newMedia[index].preview) {
        URL.revokeObjectURL(newMedia[index].preview!);
      }
      newMedia.splice(index, 1);
      return newMedia;
    });
  };

  return (
    <>
      <Card className="mb-6">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
              <AvatarImage
                src={
                  user?.avatar ||
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                }
              />
              <AvatarFallback className="text-xs sm:text-sm">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div
              className="flex-1 bg-gray-100 rounded-full px-3 sm:px-4 py-2 sm:py-3 cursor-text touch-target min-w-0"
              onClick={() => setShowFullComposer(true)}
            >
              <span className="text-gray-500 text-sm sm:text-base truncate">
                What's on your mind, {user?.name?.split(" ")[0] || "User"}?
              </span>
            </div>
          </div>

          {showFullComposer && (
            <div className="space-y-3 sm:space-y-4">
              <Textarea
                placeholder="What's on your mind?"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                className="min-h-[80px] sm:min-h-[100px] resize-none border-none text-lg sm:text-xl placeholder:text-gray-400 leading-relaxed"
                autoFocus
              />

              {/* Selected Feeling */}
              {selectedFeeling && (
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                  <span className="text-lg">{selectedFeeling.emoji}</span>
                  <span className="text-sm text-blue-700">
                    feeling {selectedFeeling.text}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedFeeling(null)}
                    className="ml-auto h-6 w-6"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {/* Selected Location */}
              {selectedLocation && (
                <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-700">
                    at {selectedLocation.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedLocation(null)}
                    className="ml-auto h-6 w-6"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {/* Selected Media */}
              {selectedMedia.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  {selectedMedia.map((media, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square relative overflow-hidden rounded-lg">
                        {media.type === "image" ? (
                          <img
                            src={media.preview}
                            alt="Upload preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="relative w-full h-full bg-black">
                            <video
                              src={media.preview}
                              className="w-full h-full object-cover"
                              muted
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Video className="w-8 h-8 text-white" />
                            </div>
                          </div>
                        )}
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeMedia(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-500 hover:bg-blue-50 px-2 sm:px-3 text-xs sm:text-sm"
                    onClick={() => setShowMediaModal(true)}
                  >
                    <Image className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                    <span className="hidden xs:inline">Photo/Video</span>
                    <span className="xs:hidden">📷</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-orange-500 hover:bg-orange-50 px-2 sm:px-3 text-xs sm:text-sm"
                    onClick={() => setShowFeelingModal(true)}
                  >
                    <Smile className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                    <span className="hidden xs:inline">Feeling</span>
                    <span className="xs:hidden">😊</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:bg-red-50 px-2 sm:px-3 text-xs sm:text-sm"
                    onClick={() => setShowLocationModal(true)}
                  >
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                    <span className="hidden xs:inline">Location</span>
                    <span className="xs:hidden">📍</span>
                  </Button>
                </div>

                <div className="flex items-center gap-2 justify-between sm:justify-end">
                  <select
                    value={privacy}
                    onChange={(e) =>
                      setPrivacy(
                        e.target.value as "public" | "friends" | "private",
                      )
                    }
                    className="text-xs sm:text-sm border rounded px-2 py-1 bg-white"
                  >
                    <option value="public">🌍 Public</option>
                    <option value="friends">👥 Friends</option>
                    <option value="private">🔒 Private</option>
                  </select>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFullComposer(false)}
                      className="text-xs sm:text-sm px-3"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreatePost}
                      disabled={
                        (!postText.trim() && selectedMedia.length === 0) ||
                        isSubmitting
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-xs sm:text-sm px-3 sm:px-4"
                      size="sm"
                    >
                      {isSubmitting ? "Posting..." : "Post"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!showFullComposer && (
            <>
              <Separator className="my-3 sm:my-4" />
              <div className="flex flex-row gap-1 sm:gap-2">
                <Button
                  variant="ghost"
                  className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 sm:px-3 text-xs sm:text-sm"
                  onClick={() => setShowMediaModal(true)}
                >
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="hidden xs:inline">Live</span>
                  <span className="sm:hidden">📹</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 sm:px-3 text-xs sm:text-sm"
                  onClick={() => setShowMediaModal(true)}
                >
                  <Image className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                  <span className="hidden xs:inline">Photo</span>
                  <span className="sm:hidden">📷</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 sm:px-3 text-xs sm:text-sm"
                  onClick={() => setShowFeelingModal(true)}
                >
                  <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                  <span className="hidden xs:inline">Feeling</span>
                  <span className="sm:hidden">😊</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 sm:px-3 text-xs sm:text-sm"
                  onClick={() => setShowLocationModal(true)}
                >
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                  <span className="hidden xs:inline">Location</span>
                  <span className="sm:hidden">📍</span>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <MediaUploadModal
        isOpen={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        onMediaUploaded={(media) => {
          setSelectedMedia((prev) => [...prev, ...media]);
          setShowFullComposer(true);
        }}
      />

      <FeelingLocationModal
        isOpen={showFeelingModal}
        onClose={() => setShowFeelingModal(false)}
        onFeelingSelected={(feeling) => {
          setSelectedFeeling(feeling);
          setShowFullComposer(true);
        }}
        onLocationSelected={() => {}}
        defaultTab="feeling"
      />

      <FeelingLocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onFeelingSelected={() => {}}
        onLocationSelected={(location) => {
          setSelectedLocation(location);
          setShowFullComposer(true);
        }}
        defaultTab="location"
      />
    </>
  );
};

// Enhanced Post Component
const PostCard = ({
  post,
  onPostUpdate,
}: {
  post: Post;
  onPostUpdate: (updatedPost: Post) => void;
}) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [commentsCount, setCommentsCount] = useState(post.comments);
  const [sharesCount, setSharesCount] = useState(post.shares);
  const [showComments, setShowComments] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleLike = async () => {
    const previousState = { isLiked, likesCount };

    // Optimistic update
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      const result = await feedService.toggleLike(post.id, isLiked);
      setLikesCount(result.likesCount);
    } catch (error) {
      // Revert on error
      setIsLiked(previousState.isLiked);
      setLikesCount(previousState.likesCount);
      toast({
        title: "Failed to update like",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    const previousState = isSaved;

    // Optimistic update
    setIsSaved(!isSaved);

    try {
      await feedService.toggleSave(post.id, isSaved);
      toast({
        title: isSaved ? "Post removed from saved" : "Post saved",
        description: isSaved
          ? "Post removed from your saved items"
          : "Post saved to your collection",
      });
    } catch (error) {
      // Revert on error
      setIsSaved(previousState);
      toast({
        title: "Failed to update save status",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      const result = await feedService.sharePost(post.id);
      if (result.success) {
        setSharesCount((prev) => prev + result.shareCount);

        // Copy to clipboard
        if (navigator.share) {
          await navigator.share({
            title: `${post.user.name}'s post`,
            text: post.content,
            url: window.location.href,
          });
        } else {
          await navigator.clipboard.writeText(window.location.href);
          toast({
            title: "Link copied!",
            description: "Post link copied to clipboard.",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Failed to share post",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const getPrivacyIcon = () => {
    switch (post.privacy) {
      case "public":
        return <Globe className="w-3 h-3" />;
      case "friends":
        return <Users className="w-3 h-3" />;
      case "private":
        return <Lock className="w-3 h-3" />;
      default:
        return <Globe className="w-3 h-3" />;
    }
  };

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % post.media.length);
  };

  const prevMedia = () => {
    setCurrentMediaIndex(
      (prev) => (prev - 1 + post.media.length) % post.media.length,
    );
  };

  return (
    <Card className="mb-4 sm:mb-6">
      <CardContent className="p-0">
        {/* Post Header */}
        <div className="p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
              <AvatarImage src={post.user.avatar} />
              <AvatarFallback className="text-xs sm:text-sm">
                {post.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base truncate">
                  {post.user.name}
                </h3>
                {post.user.isVerified && (
                  <Badge
                    variant="secondary"
                    className="h-3 w-3 sm:h-4 sm:w-4 p-0 rounded-full bg-blue-500 flex-shrink-0"
                  >
                    <span className="text-white text-xs">✓</span>
                  </Badge>
                )}
                {post.feeling && (
                  <span className="text-xs sm:text-sm text-gray-600 truncate">
                    is feeling {post.feeling.emoji} {post.feeling.text}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 truncate">
                <span>{post.timestamp}</span>
                <span>•</span>
                {getPrivacyIcon()}
                {post.location && (
                  <>
                    <span>•</span>
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{post.location}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Post Content */}
        {post.content && (
          <div className="px-3 sm:px-4 pb-2 sm:pb-3">
            <p className="text-sm sm:text-base leading-relaxed break-words">
              {post.content}
            </p>
          </div>
        )}

        {/* Post Media */}
        {post.media.length > 0 && (
          <div className="relative">
            {post.media.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
                  onClick={prevMedia}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
                  onClick={nextMedia}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}

            {post.media[currentMediaIndex].type === "image" ? (
              <img
                src={post.media[currentMediaIndex].url}
                alt={post.media[currentMediaIndex].alt || "Post image"}
                className="w-full max-h-[600px] object-cover"
              />
            ) : (
              <div className="relative">
                <video
                  src={post.media[currentMediaIndex].url}
                  poster={post.media[currentMediaIndex].thumbnail}
                  className="w-full max-h-[600px] object-cover"
                  muted={isVideoMuted}
                  controls
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-4 right-4 bg-black/50 text-white hover:bg-black/70"
                  onClick={() => setIsVideoMuted(!isVideoMuted)}
                >
                  {isVideoMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            )}

            {post.media.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
                {post.media.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full",
                      index === currentMediaIndex ? "bg-white" : "bg-white/50",
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Post Actions */}
        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={cn(
                  "flex items-center gap-1 p-1 h-auto touch-target",
                  isLiked && "text-red-500",
                )}
              >
                <Heart
                  className={cn(
                    "w-4 h-4 sm:w-5 sm:h-5",
                    isLiked && "fill-current",
                  )}
                />
                <span className="text-xs sm:text-sm">{likesCount}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-1 p-1 h-auto touch-target"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm">{commentsCount}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 p-1 h-auto touch-target"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm">{sharesCount}</span>
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              className={cn(
                "p-1 h-auto w-auto touch-target",
                isSaved && "text-blue-500",
              )}
            >
              <Bookmark
                className={cn(
                  "w-4 h-4 sm:w-5 sm:h-5",
                  isSaved && "fill-current",
                )}
              />
            </Button>
          </div>

          {/* Enhanced Comments Section */}
          <EnhancedCommentsSection
            postId={post.id}
            isVisible={showComments}
            commentsCount={commentsCount}
            onCommentsCountChange={setCommentsCount}
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Main Feed Component
export default function EnhancedFeed() {
  const [posts, setPosts] = useState(initialMockPosts);
  const [stories, setStories] = useState(initialMockStories);
  const [isLoading, setIsLoading] = useState(false);
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
  const [selectedLiveStream, setSelectedLiveStream] =
    useState<LiveStream | null>(null);

  // Story modal states
  const [showStoryCreation, setShowStoryCreation] = useState(false);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);

  // Load live streams
  useEffect(() => {
    const loadLiveStreams = async () => {
      try {
        const streams = await liveStreamingService.getLiveStreams();
        setLiveStreams(streams.slice(0, 3)); // Show top 3 live streams
      } catch (error) {
        console.error("Error loading live streams:", error);
      }
    };
    loadLiveStreams();
  }, []);

  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
    );
  };

  const handleStoryCreated = (newStory: any) => {
    setStories((prev) => [newStory, ...prev]);
  };

  const handleViewStory = (storyIndex: number, userIndex: number) => {
    setSelectedStoryIndex(storyIndex);
    setSelectedUserIndex(userIndex);
    setShowStoryViewer(true);
  };

  // Simulate loading more posts
  const loadMorePosts = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Add more posts (in real app, fetch from API)
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full max-w-full overflow-x-hidden">
      <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-safe-area-bottom">
        {/* Enhanced Profile Access - Temporary for demo */}
        <div className="mb-6">
          <ProfileDirectAccess />
        </div>

        {/* Stories */}
        <Stories
          stories={stories}
          onCreateStory={() => setShowStoryCreation(true)}
          onViewStory={handleViewStory}
        />

        {/* Create Post */}
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Live Streams Section */}
        {liveStreams.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Live Now
                </h3>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {liveStreams.map((stream) => (
                  <div
                    key={stream.id}
                    className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setSelectedLiveStream(stream)}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={stream.streamerAvatar} />
                        <AvatarFallback>
                          {stream.streamerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {stream.title}
                      </p>
                      <p className="text-xs text-gray-600">
                        {stream.streamerName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {stream.category}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {stream.viewerCount} viewers
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Content Recommendations */}
        <SmartContentRecommendations
          contentType="posts"
          availableContent={posts}
          onContentSelect={(post) => {
            // Scroll to selected post or handle selection
            console.log("Selected recommended post:", post);
          }}
          maxItems={4}
          className="mb-6"
          layout="grid"
        />

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <div key={post.id}>
              <PostCard post={post} onPostUpdate={handlePostUpdate} />

              {/* Insert AI recommendations between posts occasionally */}
              {index === 2 && (
                <SmartContentRecommendations
                  contentType="mixed"
                  availableContent={[...posts, ...stories]}
                  onContentSelect={(content) => {
                    console.log("Selected mixed content:", content);
                  }}
                  maxItems={3}
                  className="my-6"
                  layout="carousel"
                  showReasons={true}
                />
              )}
            </div>
          ))}
        </div>

        {/* Load More */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* End of Feed */}
        <div className="text-center py-8">
          <p className="text-gray-500">You're all caught up!</p>
          <p className="text-sm text-gray-400 mt-1">
            Check back later for new posts
          </p>
        </div>
      </div>

      {/* Story Modals */}
      <EnhancedStoryCreation
        isOpen={showStoryCreation}
        onClose={() => setShowStoryCreation(false)}
        onStoryCreated={handleStoryCreated}
      />

      {/* Live Stream Modal */}
      {selectedLiveStream && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-end mb-4">
              <Button
                onClick={() => setSelectedLiveStream(null)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <LiveStreamPlayer
              stream={selectedLiveStream}
              autoplay={true}
              showChat={true}
              className="rounded-lg overflow-hidden"
            />
          </div>
        </div>
      )}

      <StoryViewerModal
        isOpen={showStoryViewer}
        onClose={() => setShowStoryViewer(false)}
        stories={stories}
        initialStoryIndex={selectedStoryIndex}
        initialUserIndex={selectedUserIndex}
      />
    </div>
  );
}
