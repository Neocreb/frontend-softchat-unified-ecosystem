// src/components/feed/StoryViewerModal.tsx
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Send,
  MoreHorizontal,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Eye,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface Story {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  type: "image" | "video" | "text";
  content?: string;
  media?: {
    type: "image" | "video";
    url: string;
    preview?: string;
  };
  textContent?: string;
  backgroundColor?: string;
  textColor?: string;
  timestamp: string;
  duration: number;
  privacy: string;
  views: number;
  isOwn?: boolean;
}

interface StoryViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stories: Story[];
  initialStoryIndex: number;
  initialUserIndex: number;
}

export function StoryViewerModal({
  isOpen,
  onClose,
  stories,
  initialStoryIndex = 0,
  initialUserIndex = 0,
}: StoryViewerModalProps) {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  const progressRef = useRef<NodeJS.Timeout>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Group stories by user
  const userStories = stories.reduce(
    (acc, story) => {
      const userId = story.user.id;
      if (!acc[userId]) {
        acc[userId] = {
          user: story.user,
          stories: [],
        };
      }
      acc[userId].stories.push(story);
      return acc;
    },
    {} as Record<string, { user: any; stories: Story[] }>,
  );

  const userIds = Object.keys(userStories);
  const currentUser = userStories[userIds[currentUserIndex]];
  const currentStory = currentUser?.stories[currentStoryIndex];

  // Auto-progress timer
  useEffect(() => {
    if (!isOpen || !currentStory || isPaused) return;

    const duration = currentStory.duration * 1000; // Convert to milliseconds
    const interval = 50; // Update every 50ms for smooth progress
    const increment = (interval / duration) * 100;

    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          // Move to next story
          nextStory();
          return 0;
        }
        return newProgress;
      });
    }, interval);

    return () => {
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
    };
  }, [currentStory, isPaused, isOpen]);

  // Reset progress when story changes
  useEffect(() => {
    setProgress(0);
    setIsLiked(false);
    setReplyText("");
  }, [currentUserIndex, currentStoryIndex]);

  const nextStory = () => {
    if (currentStoryIndex < currentUser.stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
    } else {
      nextUser();
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
    } else {
      prevUser();
    }
  };

  const nextUser = () => {
    if (currentUserIndex < userIds.length - 1) {
      setCurrentUserIndex((prev) => prev + 1);
      setCurrentStoryIndex(0);
    } else {
      onClose();
    }
  };

  const prevUser = () => {
    if (currentUserIndex > 0) {
      setCurrentUserIndex((prev) => prev - 1);
      setCurrentStoryIndex(0);
    }
  };

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);

    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed like" : "Liked story",
      description: isLiked ? "Like removed from story" : "You liked this story",
    });
  };

  const handleReply = () => {
    if (!replyText.trim()) return;

    toast({
      title: "Reply sent!",
      description: `Your reply was sent to ${currentStory.user.name}`,
    });
    setReplyText("");
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const storyTime = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - storyTime.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  if (!isOpen || !currentStory) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-screen h-screen p-0 bg-black">
        <VisuallyHidden>
          <DialogTitle>View Story</DialogTitle>
        </VisuallyHidden>
        <div className="relative h-full flex flex-col">
          {/* Progress bars */}
          <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
            {currentUser.stories.map((_, index) => (
              <div
                key={index}
                className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{
                    width:
                      index < currentStoryIndex
                        ? "100%"
                        : index === currentStoryIndex
                          ? `${progress}%`
                          : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-6 left-4 right-4 z-20 flex items-center justify-between pt-6">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={currentStory.user.avatar} />
                <AvatarFallback>
                  {currentStory.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-white font-semibold text-sm">
                  {currentStory.user.name}
                </h3>
                <p className="text-white/80 text-xs">
                  {formatTimeAgo(currentStory.timestamp)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentStory.type === "video" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:bg-white/20 w-8 h-8"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePauseToggle}
                className="text-white hover:bg-white/20 w-8 h-8"
              >
                {isPaused ? (
                  <Play className="w-4 h-4" />
                ) : (
                  <Pause className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20 w-8 h-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Navigation areas (invisible) */}
          <div className="absolute inset-0 z-10 flex">
            <div className="flex-1 cursor-pointer" onClick={prevStory} />
            <div className="flex-1 cursor-pointer" onClick={nextStory} />
          </div>

          {/* Story Content */}
          <div className="flex-1 relative flex items-center justify-center">
            {currentStory.type === "image" && currentStory.media && (
              <img
                src={currentStory.media.url}
                alt="Story"
                className="w-full h-full object-cover"
              />
            )}

            {currentStory.type === "video" && currentStory.media && (
              <video
                ref={videoRef}
                src={currentStory.media.url}
                className="w-full h-full object-cover"
                muted={isMuted}
                autoPlay
                onEnded={nextStory}
                onPause={() => setIsPaused(true)}
                onPlay={() => setIsPaused(false)}
              />
            )}

            {currentStory.type === "text" && (
              <div
                className={cn(
                  "w-full h-full flex items-center justify-center p-8",
                  currentStory.backgroundColor ||
                    "bg-gradient-to-br from-blue-400 to-purple-600",
                )}
              >
                <p
                  className={cn(
                    "text-center text-2xl font-bold leading-relaxed",
                    currentStory.textColor || "text-white",
                  )}
                >
                  {currentStory.textContent}
                </p>
              </div>
            )}
          </div>

          {/* Story Views (for own stories) */}
          {currentStory.isOwn && (
            <div className="absolute bottom-20 left-4 z-20">
              <div className="flex items-center gap-1 text-white/80 text-sm">
                <Eye className="w-4 h-4" />
                <span>{currentStory.views} views</span>
              </div>
            </div>
          )}

          {/* Reply Section */}
          {!currentStory.isOwn && (
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2 bg-black/50 rounded-full px-4 py-2">
                  <Input
                    placeholder={`Reply to ${currentStory.user.name}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="bg-transparent border-none text-white placeholder:text-white/60 text-sm"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleReply();
                      }
                    }}
                  />
                  {replyText.trim() && (
                    <Button
                      size="icon"
                      onClick={handleReply}
                      className="w-8 h-8 bg-blue-500 hover:bg-blue-600"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLike}
                  className={cn(
                    "text-white hover:bg-white/20 w-10 h-10",
                    isLiked && "text-red-500",
                  )}
                >
                  <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
                </Button>
              </div>
            </div>
          )}

          {/* Navigation arrows */}
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20">
            {(currentUserIndex > 0 || currentStoryIndex > 0) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={prevStory}
                className="text-white hover:bg-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            )}
          </div>

          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20">
            {(currentUserIndex < userIds.length - 1 ||
              currentStoryIndex < currentUser.stories.length - 1) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={nextStory}
                className="text-white hover:bg-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
