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
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

// Mock data for stories
const mockStories = [
  {
    id: "1",
    user: { id: "1", name: "Your Story", avatar: "", username: "you" },
    preview: null,
    isOwn: true,
  },
  {
    id: "2",
    user: {
      id: "2",
      name: "Alice Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      username: "alice_j",
    },
    preview:
      "https://images.unsplash.com/photo-1494790108755-2616c27b40f2?w=150&h=150&fit=crop&crop=face",
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
    preview:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
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
    preview:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
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
    preview:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    hasNew: true,
  },
];

// Mock posts data
const mockPosts = [
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
        type: "image",
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
    privacy: "public",
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
        type: "image",
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
    privacy: "public",
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
        type: "video",
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
    privacy: "public",
  },
  {
    id: "4",
    user: {
      id: "4",
      name: "David Kim",
      username: "david_kim",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      isVerified: false,
    },
    content:
      "Coffee and code - the perfect combination for a productive morning! ☕️ Working on some exciting new features for the platform.",
    media: [],
    timestamp: "2 days ago",
    likes: 89,
    comments: 12,
    shares: 3,
    isLiked: true,
    isSaved: false,
    privacy: "friends",
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
}

// Stories Component
const Stories = () => {
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

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide px-8"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {mockStories.map((story) => (
              <div key={story.id} className="flex-shrink-0">
                <div className="relative cursor-pointer group">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-full p-0.5",
                      story.hasNew
                        ? "bg-gradient-to-r from-purple-500 to-pink-500"
                        : "bg-gray-300",
                    )}
                  >
                    <div className="w-full h-full bg-white rounded-full p-0.5">
                      <Avatar className="w-full h-full">
                        <AvatarImage src={story.user.avatar || story.preview} />
                        <AvatarFallback>
                          {story.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  {story.isOwn && (
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Plus className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-center mt-2 max-w-[64px] truncate">
                  {story.isOwn ? "Your Story" : story.user.name}
                </p>
              </div>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Create Post Component
const CreatePost = () => {
  const { user } = useAuth();
  const [postText, setPostText] = useState("");
  const [showFullComposer, setShowFullComposer] = useState(false);
  const { toast } = useToast();

  const handleCreatePost = () => {
    if (!postText.trim()) return;

    toast({
      title: "Post created!",
      description: "Your post has been shared with your followers.",
    });

    setPostText("");
    setShowFullComposer(false);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage
              src={
                user?.avatar ||
                "https://api.dicebear.com/7.x/avataaars/svg?seed=user"
              }
            />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 cursor-text"
            onClick={() => setShowFullComposer(true)}
          >
            <span className="text-gray-500">
              What's on your mind, {user?.name?.split(" ")[0] || "User"}?
            </span>
          </div>
        </div>

        {showFullComposer && (
          <div className="space-y-4">
            <Textarea
              placeholder="What's on your mind?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="min-h-[100px] resize-none border-none text-xl placeholder:text-gray-400"
              autoFocus
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-500 hover:bg-blue-50"
                >
                  <Image className="w-5 h-5 mr-1" />
                  Photo
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-500 hover:bg-green-50"
                >
                  <Video className="w-5 h-5 mr-1" />
                  Video
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-orange-500 hover:bg-orange-50"
                >
                  <Smile className="w-5 h-5 mr-1" />
                  Feeling
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:bg-red-50"
                >
                  <MapPin className="w-5 h-5 mr-1" />
                  Location
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullComposer(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePost}
                  disabled={!postText.trim()}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        )}

        {!showFullComposer && <Separator className="my-4" />}

        {!showFullComposer && (
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="ghost"
              className="flex items-center justify-center gap-2 py-3"
            >
              <Camera className="w-5 h-5 text-green-500" />
              <span className="hidden sm:inline">Live Video</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center justify-center gap-2 py-3"
            >
              <Image className="w-5 h-5 text-blue-500" />
              <span className="hidden sm:inline">Photo/Video</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center justify-center gap-2 py-3"
            >
              <Smile className="w-5 h-5 text-orange-500" />
              <span className="hidden sm:inline">Feeling</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Post Component
const PostCard = ({ post }: { post: Post }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Post removed from saved" : "Post saved",
      description: isSaved
        ? "Post removed from your saved items"
        : "Post saved to your collection",
    });
  };

  const handleComment = () => {
    if (!commentText.trim()) return;

    toast({
      title: "Comment added!",
      description: "Your comment has been posted.",
    });

    setCommentText("");
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
    <Card className="mb-6">
      <CardContent className="p-0">
        {/* Post Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.user.avatar} />
              <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <h3 className="font-semibold text-sm">{post.user.name}</h3>
                {post.user.isVerified && (
                  <Badge
                    variant="secondary"
                    className="h-4 w-4 p-0 rounded-full bg-blue-500"
                  >
                    <span className="text-white text-xs">✓</span>
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>{post.timestamp}</span>
                <span>•</span>
                {getPrivacyIcon()}
                {post.location && (
                  <>
                    <span>•</span>
                    <span>{post.location}</span>
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
          <div className="px-4 pb-3">
            <p className="text-sm leading-relaxed">{post.content}</p>
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
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={cn(
                  "flex items-center gap-1 p-0 h-auto",
                  isLiked && "text-red-500",
                )}
              >
                <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
                <span className="text-sm">{likesCount}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-1 p-0 h-auto"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">{post.comments}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 p-0 h-auto"
              >
                <Share2 className="w-5 h-5" />
                <span className="text-sm">{post.shares}</span>
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              className={cn("p-0 h-auto", isSaved && "text-blue-500")}
            >
              <Bookmark className={cn("w-5 h-5", isSaved && "fill-current")} />
            </Button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="space-y-3 pt-3 border-t">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={
                      user?.avatar ||
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                    }
                  />
                  <AvatarFallback>
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 bg-gray-100 rounded-full px-3 py-2 text-sm outline-none"
                    onKeyPress={(e) => e.key === "Enter" && handleComment()}
                  />
                  <Button
                    size="icon"
                    onClick={handleComment}
                    disabled={!commentText.trim()}
                    className="w-8 h-8 rounded-full"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Feed Component
export default function EnhancedFeed() {
  const [posts, setPosts] = useState(mockPosts);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading more posts
  const loadMorePosts = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Add more posts (in real app, fetch from API)
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Stories */}
        <Stories />

        {/* Create Post */}
        <CreatePost />

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
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
    </div>
  );
}
