
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNotification } from "@/hooks/use-notification";

export type Story = {
  id: string;
  username: string;
  avatar: string;
  isUser?: boolean;
  hasNewStory?: boolean;
};

interface StoriesProps {
  stories: Story[];
  onViewStory: (storyId: string) => void;
  onCreateStory: () => void;
}

const Stories = ({ stories, onViewStory, onCreateStory }: StoriesProps) => {
  const notification = useNotification();

  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex gap-4 pb-2">
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center space-y-1 min-w-[70px]">
            <div 
              className={`relative ${
                story.isUser 
                  ? 'bg-gray-100 p-1' 
                  : story.hasNewStory 
                    ? 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 p-[2px]' 
                    : 'bg-gray-200 p-[2px]'
              } rounded-full cursor-pointer`}
              onClick={() => story.isUser ? onCreateStory() : onViewStory(story.id)}
            >
              <Avatar className={`h-16 w-16 ${story.isUser ? '' : 'border-2 border-white'}`}>
                <AvatarImage src={story.avatar} />
                <AvatarFallback>{story.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {story.isUser && (
                <div className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs border-2 border-white">
                  <PlusCircle className="h-4 w-4" />
                </div>
              )}
            </div>
            <span className="text-xs">{story.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;
