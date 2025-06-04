import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, X, Heart, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/utils/utils";

interface Story {
  id: string;
  user_id: string;
  content: string;
  media_url?: string;
  media_type: string;
  expires_at: string;
  created_at: string;
  view_count: number;
  user: {
    name: string;
    avatar: string;
  };
  viewed: boolean;
}

interface EnhancedStoriesProps {
  onCreateStory: () => void;
}

const EnhancedStories = ({ onCreateStory }: EnhancedStoriesProps) => {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isViewing, setIsViewing] = useState(false);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    // Use mock data since stories table isn't in TypeScript definitions yet
    const mockStories: Story[] = [
      {
        id: '1',
        user_id: 'user1',
        content: 'Beautiful sunset today! 🌅',
        media_url: '/placeholder.svg',
        media_type: 'image',
        expires_at: new Date(Date.now() + 86400000).toISOString(),
        created_at: new Date(Date.now() - 3600000).toISOString(),
        view_count: 15,
        user: {
          name: 'Alice Johnson',
          avatar: '/placeholder.svg'
        },
        viewed: false
      },
      {
        id: '2',
        user_id: 'user2',
        content: 'Just finished a great workout! 💪',
        media_url: '/placeholder.svg',
        media_type: 'image',
        expires_at: new Date(Date.now() + 86400000).toISOString(),
        created_at: new Date(Date.now() - 7200000).toISOString(),
        view_count: 23,
        user: {
          name: 'Bob Smith',
          avatar: '/placeholder.svg'
        },
        viewed: true
      }
    ];
    setStories(mockStories);
  };

  const viewStory = async (story: Story, index: number) => {
    setActiveStory(story);
    setCurrentStoryIndex(index);
    setIsViewing(true);
    setProgress(0);

    // Auto-progress story
    const duration = story.media_type === 'video' ? 15000 : 5000;
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration / 100));
        if (newProgress >= 100) {
          clearInterval(interval);
          nextStory();
          return 100;
        }
        return newProgress;
      });
    }, 100);
  };

  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      const nextIndex = currentStoryIndex + 1;
      viewStory(stories[nextIndex], nextIndex);
    } else {
      closeStoryViewer();
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      const prevIndex = currentStoryIndex - 1;
      viewStory(stories[prevIndex], prevIndex);
    }
  };

  const closeStoryViewer = () => {
    setIsViewing(false);
    setActiveStory(null);
    setProgress(0);
  };

  return (
    <>
      {/* Stories row */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-4 pb-2">
          {/* Create Story Button */}
          <div className="flex flex-col items-center space-y-1 min-w-[70px]">
            <div
              className="relative bg-gray-100 p-1 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={onCreateStory}
            >
              <Avatar className="h-16 w-16 border-2 border-white">
                <AvatarImage src={user?.user_metadata?.avatar || "/placeholder.svg"} />
                <AvatarFallback>{user?.user_metadata?.name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full h-6 w-6 flex items-center justify-center border-2 border-white">
                <PlusCircle className="h-4 w-4" />
              </div>
            </div>
            <span className="text-xs text-center">Your Story</span>
          </div>

          {/* Stories from other users */}
          {stories.map((story, index) => (
            <div key={story.id} className="flex flex-col items-center space-y-1 min-w-[70px]">
              <div
                className={cn(
                  "relative p-[2px] rounded-full cursor-pointer",
                  !story.viewed 
                    ? "bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500" 
                    : "bg-gray-300"
                )}
                onClick={() => viewStory(story, index)}
              >
                <Avatar className="h-16 w-16 border-2 border-white">
                  <AvatarImage src={story.user.avatar} />
                  <AvatarFallback>{story.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              <span className="text-xs text-center truncate w-16">{story.user.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Story viewer */}
      {isViewing && activeStory && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          {/* Progress bars */}
          <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
            {stories.map((_, index) => (
              <div key={index} className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full bg-white transition-all duration-100",
                    index < currentStoryIndex && "w-full",
                    index === currentStoryIndex && `w-[${progress}%]`,
                    index > currentStoryIndex && "w-0"
                  )}
                />
              </div>
            ))}
          </div>

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white z-10"
            onClick={closeStoryViewer}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Story content */}
          <div className="relative w-full max-w-sm h-full flex items-center justify-center">
            {activeStory.media_type === 'video' ? (
              <video
                src={activeStory.media_url}
                className="w-full h-full object-cover"
                autoPlay
                muted
              />
            ) : (
              <img
                src={activeStory.media_url || '/placeholder.svg'}
                alt="Story"
                className="w-full h-full object-cover"
              />
            )}

            {/* Navigation areas */}
            <div 
              className="absolute left-0 top-0 w-1/3 h-full cursor-pointer"
              onClick={prevStory}
            />
            <div 
              className="absolute right-0 top-0 w-1/3 h-full cursor-pointer"
              onClick={nextStory}
            />

            {/* Story info */}
            <div className="absolute bottom-20 left-4 right-4">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarImage src={activeStory.user.avatar} />
                  <AvatarFallback>{activeStory.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-medium">{activeStory.user.name}</p>
                  <p className="text-white/70 text-sm">
                    {new Date(activeStory.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              {activeStory.content && (
                <p className="text-white text-sm">{activeStory.content}</p>
              )}
            </div>

            {/* Engagement buttons */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-4">
              <Button variant="ghost" size="icon" className="text-white">
                <Heart className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white">
                <MessageCircle className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EnhancedStories;
