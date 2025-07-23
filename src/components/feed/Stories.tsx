// components/stories/Stories.tsx
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle } from "lucide-react";
import { useNotification } from "@/hooks/use-notification";
import { CreateStoryModal } from "./CreateStory";
import { useAuth } from "@/contexts/AuthContext";
import { SponsoredStory } from "@/components/ads/SponsoredStory";
import { adSettings } from "../../../config/adSettings";


export type Story = {
  isUser: any;
  id: string;
  username: string;
  avatar: string;
  hasNewStory?: boolean;
};

interface StoriesProps {
  stories: Story[];
  onViewStory: (storyId: string) => void;
  onCreateStory?: () => void;
}

const Stories = ({ stories, onViewStory, onCreateStory }: StoriesProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [storiesWithAds, setStoriesWithAds] = useState<(Story | { id: string; type: 'sponsored_story' | 'ad_story' })[]>([]);
  const notification = useNotification();
  const { user } = useAuth();

  // Create stories list with ads
  useEffect(() => {
    const createStoriesWithAds = () => {
      const storyItems = [];
      let sponsoredAdCounter = 0;
      let nativeAdCounter = 0;

      // Add Softchat sponsored story as first item if ads are enabled
      if (adSettings.enableAds) {
        storyItems.push({
          id: 'softchat-sponsored-story',
          type: 'sponsored_story' as const
        });
      }

      for (let i = 0; i < stories.length; i++) {
        storyItems.push(stories[i]);

        // Insert story ad every 5th story
        if ((i + 1) % adSettings.storyAdFrequency === 0 && adSettings.enableAds) {
          nativeAdCounter++;
          storyItems.push({
            id: `story-ad-${nativeAdCounter}`,
            type: 'ad_story' as const
          });
        }
      }

      return storyItems;
    };

    setStoriesWithAds(createStoriesWithAds());
  }, [stories]);

  const handleCreateStory = async (content: {
    text?: string;
    file?: File;
    type: 'audio' | 'video' | 'image' | null
  }) => {
    try {
      // Here you would upload the file to your storage (e.g., Firebase, S3)
      // and create the story in your database
      const formData = new FormData();
      if (content.text) formData.append('text', content.text);
      if (content.file) formData.append('file', content.file);
      if (content.type) formData.append('type', content.type);

      // Example API call:
      // const response = await fetch('/api/stories', {
      //   method: 'POST',
      //   body: formData
      // });
      // const data = await response.json();

      notification.success("Story created successfully!");

      // You might want to refresh the stories list here
    } catch (error) {
      notification.error("Failed to create story");
      console.error("Error creating story:", error);
    }
  };

  return (
    <>
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-4 pb-2">
          {/* Create Story Button - Always first */}
          <div className="flex flex-col items-center space-y-1 min-w-[70px]">
            <div
              className="relative bg-gray-100 p-1 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Avatar className="h-16 w-16 border-2 border-white">
                <AvatarImage src={user?.user_metadata?.avatar || "/placeholder.svg"} alt={user?.user_metadata?.name || "@user"} />
                <AvatarFallback>{user?.user_metadata?.name?.substring(0, 2).toUpperCase() || "SC"}</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs border-2 border-white">
                <PlusCircle className="h-4 w-4" />
              </div>
            </div>
            <span className="text-xs">Create Story</span>
          </div>

          {/* Other stories */}
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center space-y-1 min-w-[70px]">
              <div
                className={`relative ${story.hasNewStory
                  ? 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 p-[2px]'
                  : 'bg-gray-200 p-[2px]'
                  } rounded-full cursor-pointer`}
                onClick={() => onViewStory(story.id)}
              >
                <Avatar className="h-16 w-16 border-2 border-white">
                  <AvatarImage src={story.avatar} />
                  <AvatarFallback>{story.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              <span className="text-xs">{story.username}</span>
            </div>
          ))}
        </div>
      </div>

      <CreateStoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateStory}
      />
    </>
  );
};

export default Stories;
