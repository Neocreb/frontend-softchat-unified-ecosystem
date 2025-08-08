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
  Gift,
  ThumbsUp,
  MessageCircle,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import VirtualGiftsAndTips from "@/components/premium/VirtualGiftsAndTips";

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

interface StoryGroup {
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  stories: Story[];
}

interface EnhancedStoryViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyGroups: StoryGroup[];
  initialStoryIndex: number;
  initialUserIndex: number;
}

export function EnhancedStoryViewerModal({
  isOpen,
  onClose,
  storyGroups,
  initialStoryIndex = 0,
  initialUserIndex = 0,
}: EnhancedStoryViewerModalProps) {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [showInteractions, setShowInteractions] = useState(true);
  const [showGiftModal, setShowGiftModal] = useState(false);

  const progressRef = useRef<NodeJS.Timeout>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const currentUser = storyGroups[currentUserIndex];
  const currentStory = currentUser?.stories[currentStoryIndex];

  // Auto-progress timer
  useEffect(() => {
    if (!isOpen || !currentStory || isPaused) return;

    const duration = currentStory.duration * 1000;
    const interval = 50;
    const increment = (interval / duration) * 100;

    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          nextContent();
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

  // Navigate to next content from same user
  const nextContent = () => {
    if (currentStoryIndex < currentUser.stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
    } else {
      nextUser();
    }
  };

  // Navigate to previous content from same user
  const prevContent = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
    } else {
      prevUser();
    }
  };

  // Navigate to next user's stories
  const nextUser = () => {
    if (currentUserIndex < storyGroups.length - 1) {
      setCurrentUserIndex((prev) => prev + 1);
      setCurrentStoryIndex(0);
    } else {
      onClose();
    }
  };

  // Navigate to previous user's stories
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

  const handleGiftSent = () => {
    toast({
      title: "Gift sent!",
      description: `Your gift was sent to ${currentStory.user.name}`,
    });
    setShowGiftModal(false);
  };

  // Touch/swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    // Horizontal swipe threshold
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        // Swipe right - previous user
        prevUser();
      } else {
        // Swipe left - next user
        nextUser();
      }
    }

    touchStartRef.current = null;
  };

  // Screen tap handling for content navigation
  const handleScreenTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    if (x < width / 3) {
      prevContent();
    } else if (x > (2 * width) / 3) {
      nextContent();
    } else {
      handlePauseToggle();
    }
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
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-screen h-screen p-0 bg-black border-0 focus:outline-none">
          <VisuallyHidden>
            <DialogTitle>View Story</DialogTitle>
          </VisuallyHidden>
          <div 
            className="relative h-full flex flex-col"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Progress bars */}
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-30 flex gap-1">
              {currentUser.stories.map((_, index) => (
                <div
                  key={index}
                  className="flex-1 h-0.5 sm:h-1 bg-white/30 rounded-full overflow-hidden"
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
            <div className="absolute top-4 sm:top-6 left-2 sm:left-4 right-2 sm:right-4 z-30 flex items-center justify-between pt-4 sm:pt-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <Avatar className="w-7 h-7 sm:w-8 sm:h-8">
                  <AvatarImage src={currentStory.user.avatar} />
                  <AvatarFallback className="text-xs">
                    {currentStory.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-white font-semibold text-xs sm:text-sm">
                    {currentStory.user.name}
                  </h3>
                  <p className="text-white/80 text-xs">
                    {formatTimeAgo(currentStory.timestamp)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                {currentStory.type === "video" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-white hover:bg-white/20 w-7 h-7 sm:w-8 sm:h-8"
                  >
                    {isMuted ? (
                      <VolumeX className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePauseToggle}
                  className="text-white hover:bg-white/20 w-7 h-7 sm:w-8 sm:h-8"
                >
                  {isPaused ? (
                    <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                  ) : (
                    <Pause className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowInteractions(!showInteractions)}
                  className="text-white hover:bg-white/20 w-7 h-7 sm:w-8 sm:h-8"
                >
                  {showInteractions ? (
                    <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4" />
                  ) : (
                    <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/20 w-7 h-7 sm:w-8 sm:h-8"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>

            {/* Story Content */}
            <div 
              className="flex-1 relative flex items-center justify-center cursor-pointer"
              onClick={handleScreenTap}
            >
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
                  onEnded={nextContent}
                  onPause={() => setIsPaused(true)}
                  onPlay={() => setIsPaused(false)}
                />
              )}

              {currentStory.type === "text" && (
                <div
                  className={cn(
                    "w-full h-full flex items-center justify-center p-6 sm:p-8",
                    currentStory.backgroundColor ||
                      "bg-gradient-to-br from-blue-400 to-purple-600",
                  )}
                >
                  <p
                    className={cn(
                      "text-center text-xl sm:text-2xl font-bold leading-relaxed",
                      currentStory.textColor || "text-white",
                    )}
                  >
                    {currentStory.textContent}
                  </p>
                </div>
              )}

              {/* Navigation hint areas (invisible) */}
              <div className="absolute inset-0 z-10 flex">
                <div className="flex-1" />
                <div className="flex-1" />
                <div className="flex-1" />
              </div>
            </div>

            {/* Story Views (for own stories) */}
            {currentStory.isOwn && (
              <div className="absolute bottom-16 sm:bottom-20 left-2 sm:left-4 z-20">
                <div className="flex items-center gap-1 text-white/80 text-xs sm:text-sm">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{currentStory.views} views</span>
                </div>
              </div>
            )}

            {/* Interaction Section */}
            {!currentStory.isOwn && showInteractions && (
              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 z-30">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-1 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2">
                    <Input
                      placeholder={`Send message...`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="bg-transparent border-none text-white placeholder:text-white/60 text-xs sm:text-sm h-7 sm:h-8 focus-visible:ring-0"
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
                        className="w-6 h-6 sm:w-7 sm:h-7 bg-blue-500 hover:bg-blue-600 rounded-full p-1"
                      >
                        <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Interaction buttons */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleLike}
                      className={cn(
                        "text-white hover:bg-white/20 w-8 h-8 sm:w-10 sm:h-10 rounded-full",
                        isLiked && "text-red-500",
                      )}
                    >
                      <Heart className={cn("w-4 h-4 sm:w-5 sm:h-5", isLiked && "fill-current")} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowGiftModal(true)}
                      className="text-white hover:bg-white/20 w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                    >
                      <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        toast({
                          title: "Story liked!",
                          description: `You liked ${currentStory.user.name}'s story`,
                        });
                      }}
                      className="text-white hover:bg-white/20 w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                    >
                      <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </div>
                </div>

                {/* Swipe indicators */}
                <div className="flex justify-center mt-2 gap-4 text-white/60 text-xs">
                  <span>← Swipe for users</span>
                  <span>Tap for content →</span>
                </div>
              </div>
            )}

            {/* Navigation indicators */}
            {currentUserIndex > 0 && (
              <div className="absolute left-1 top-1/2 transform -translate-y-1/2 z-20">
                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-white/50" />
              </div>
            )}

            {currentUserIndex < storyGroups.length - 1 && (
              <div className="absolute right-1 top-1/2 transform -translate-y-1/2 z-20">
                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-white/50" />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Virtual Gifts Modal */}
      {showGiftModal && (
        <VirtualGiftsAndTips
          recipientId={currentStory.user.id}
          recipientName={currentStory.user.name}
          contentId={currentStory.id}
          trigger={null}
          recipientType="video"
        />
      )}
    </>
  );
}

export default EnhancedStoryViewerModal;
