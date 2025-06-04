
import { useState } from "react";
import EnhancedStories from "@/components/stories/EnhancedStories";
import { CreateStoryModal } from "@/components/feed/CreateStory";

const EnhancedStoriesWrapper = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateStory = async (content: {
    text?: string;
    file?: File;
    type: 'audio' | 'video' | 'image' | null
  }) => {
    // Handle story creation logic here
    console.log('Creating story:', content);
    setIsCreateModalOpen(false);
  };

  return (
    <>
      <EnhancedStories onCreateStory={() => setIsCreateModalOpen(true)} />
      <CreateStoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateStory}
      />
    </>
  );
};

export default EnhancedStoriesWrapper;
