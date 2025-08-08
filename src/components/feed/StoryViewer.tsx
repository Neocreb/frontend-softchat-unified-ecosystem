import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight, Heart, MessageCircle, Send, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Story {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    isUser: boolean;
  };
  timestamp: Date;
  content: {
    text?: string;
    media?: {
      type: 'image' | 'video' | 'audio';
      url: string;
    };
  };
  views: number;
  hasNew: boolean;
}

interface StoryViewerProps {
  isOpen: boolean;
  onClose: () => void;
  stories: Story[];
  currentStoryIndex: number;
  onStoryChange: (index: number) => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  isOpen,
  onClose,
  stories,
  currentStoryIndex,
  onStoryChange,
}) => {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5000); // 5 seconds per story

  const currentStory = stories[currentStoryIndex];

  useEffect(() => {
    if (!isOpen || isPaused || !currentStory) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 100) {
          // Move to next story
          if (currentStoryIndex < stories.length - 1) {
            onStoryChange(currentStoryIndex + 1);
            return 5000;
          } else {
            // End of stories
            onClose();
            return 0;
          }
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isPaused, currentStoryIndex, stories.length, onStoryChange, onClose, currentStory]);

  useEffect(() => {
    setTimeLeft(5000);
    setProgress(0);
  }, [currentStoryIndex]);

  useEffect(() => {
    setProgress(((5000 - timeLeft) / 5000) * 100);
  }, [timeLeft]);

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      onStoryChange(currentStoryIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentStoryIndex < stories.length - 1) {
      onStoryChange(currentStoryIndex + 1);
    } else {
      onClose();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const screenWidth = window.innerWidth;
    const touchX = touch.clientX;
    
    if (touchX < screenWidth / 2) {
      handlePrevious();
    } else {
      handleNext();
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  if (!currentStory) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm h-full sm:h-[600px] p-0 bg-black border-0 overflow-hidden">
        <div className="relative w-full h-full flex flex-col">
          {/* Progress bars */}
          <div className="flex gap-1 p-2 absolute top-0 left-0 right-0 z-10">
            {stories.map((_, index) => (
              <div
                key={index}
                className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className={cn(
                    "h-full bg-white transition-all duration-100 ease-linear",
                    index === currentStoryIndex ? "w-full" : index < currentStoryIndex ? "w-full" : "w-0"
                  )}
                  style={{
                    width: index === currentStoryIndex ? `${progress}%` : index < currentStoryIndex ? '100%' : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="flex items-center justify-between p-4 pt-8 absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border-2 border-white">
                <AvatarImage src={currentStory.user.avatar} />
                <AvatarFallback className="text-xs">
                  {currentStory.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-white">
                <p className="text-sm font-medium">{currentStory.user.name}</p>
                <p className="text-xs opacity-80">{formatTimeAgo(currentStory.timestamp)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-8 w-8"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? '▶️' : '⏸️'}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-8 w-8"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Story content */}
          <div
            className="flex-1 relative bg-black flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const width = rect.width;
              
              if (clickX < width / 2) {
                handlePrevious();
              } else {
                handleNext();
              }
            }}
          >
            {currentStory.content.media ? (
              <div className="w-full h-full flex items-center justify-center">
                {currentStory.content.media.type === 'image' && (
                  <img
                    src={currentStory.content.media.url}
                    alt="Story content"
                    className="max-w-full max-h-full object-contain"
                  />
                )}
                {currentStory.content.media.type === 'video' && (
                  <video
                    src={currentStory.content.media.url}
                    className="max-w-full max-h-full object-contain"
                    autoPlay
                    loop
                    muted
                  />
                )}
                {currentStory.content.media.type === 'audio' && (
                  <div className="text-center text-white p-8">
                    <div className="mb-4">🎵</div>
                    <audio
                      src={currentStory.content.media.url}
                      controls
                      autoPlay
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-white p-8">
                <p className="text-lg">{currentStory.content.text}</p>
              </div>
            )}

            {/* Text overlay for stories with both media and text */}
            {currentStory.content.text && currentStory.content.media && (
              <div className="absolute bottom-20 left-4 right-4 text-white">
                <p className="text-sm bg-black/50 p-2 rounded">
                  {currentStory.content.text}
                </p>
              </div>
            )}
          </div>

          {/* Navigation buttons for desktop */}
          <div className="hidden sm:block">
            {currentStoryIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}
            {currentStoryIndex < stories.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}
          </div>

          {/* Bottom actions */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Send message"
                  className="flex-1 bg-transparent border border-white/30 rounded-full px-4 py-2 text-white placeholder-white/60 text-sm"
                />
                <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoryViewer;
