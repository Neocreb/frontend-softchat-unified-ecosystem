
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Story } from "./Stories";

interface StoryViewProps {
  activeStory: string;
  stories: Story[];
  onClose: () => void;
}

const StoryView = ({ activeStory, stories, onClose }: StoryViewProps) => {
  const currentStory = stories.find(s => s.id === activeStory);
  
  if (!currentStory) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={onClose}>
      <div className="relative w-full max-w-md h-[80vh]">
        <div className="absolute top-0 inset-x-0 flex p-4">
          <div className="flex-1 flex gap-1">
            {stories.filter(s => !s.isUser).map((story) => (
              <div 
                key={story.id} 
                className={`h-1 flex-1 rounded-full ${story.id === activeStory ? 'bg-white' : 'bg-gray-500'}`}
              />
            ))}
          </div>
        </div>
        
        <div className="absolute top-4 right-4">
          <Button variant="ghost" size="icon" className="text-white" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </Button>
        </div>
        
        <div className="h-full flex items-center justify-center">
          <img 
            src={currentStory.avatar} 
            alt="Story" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-white">
              <AvatarImage src={currentStory.avatar} alt="Story user" />
              <AvatarFallback>
                {currentStory.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-white">
              <p className="font-medium">{currentStory.username}</p>
              <p className="text-xs opacity-80">Just now</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryView;
