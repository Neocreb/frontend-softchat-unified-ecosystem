import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EnhancedStoryViewerModal from "./EnhancedStoryViewerModal";

// Example story data matching the enhanced modal interface
const exampleStoryGroups = [
  {
    user: {
      id: "user1",
      name: "Blessing Eno Aseobong",
      username: "blessing_eno",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=blessing",
    },
    stories: [
      {
        id: "story1",
        user: {
          id: "user1",
          name: "Blessing Eno Aseobong",
          username: "blessing_eno",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=blessing",
        },
        type: "image" as const,
        media: {
          type: "image" as const,
          url: "https://cdn.builder.io/api/v1/image/assets%2F734d0850f9894f62a33e4d3534e53cc9%2F6852d355d2254e71b3b2fb561bbb451c?format=webp&width=800",
        },
        timestamp: "2024-01-15T12:00:00Z",
        duration: 5,
        privacy: "public",
        views: 42,
        isOwn: false,
      },
      {
        id: "story2",
        user: {
          id: "user1",
          name: "Blessing Eno Aseobong",
          username: "blessing_eno",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=blessing",
        },
        type: "text" as const,
        textContent: "Having an amazing day! 💄✨",
        backgroundColor: "bg-gradient-to-br from-pink-400 to-purple-600",
        textColor: "text-white",
        timestamp: "2024-01-15T13:00:00Z",
        duration: 4,
        privacy: "public",
        views: 38,
        isOwn: false,
      },
    ],
  },
  {
    user: {
      id: "user2",
      name: "John Doe",
      username: "johndoe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
    stories: [
      {
        id: "story3",
        user: {
          id: "user2",
          name: "John Doe",
          username: "johndoe",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
        },
        type: "video" as const,
        media: {
          type: "video" as const,
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        },
        timestamp: "2024-01-15T14:00:00Z",
        duration: 10,
        privacy: "public",
        views: 67,
        isOwn: false,
      },
    ],
  },
];

const StoryExample: React.FC = () => {
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [initialUserIndex, setInitialUserIndex] = useState(0);
  const [initialStoryIndex, setInitialStoryIndex] = useState(0);

  const openStory = (userIndex: number, storyIndex: number = 0) => {
    setInitialUserIndex(userIndex);
    setInitialStoryIndex(storyIndex);
    setIsStoryOpen(true);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Enhanced Story Viewer Demo</h2>
      <p className="text-gray-600">
        This demonstrates the enhanced story viewer with mobile responsiveness and all interaction features.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {exampleStoryGroups.map((group, index) => (
          <Card key={group.user.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-4" onClick={() => openStory(index)}>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={group.user.avatar}
                  alt={group.user.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{group.user.name}</h3>
                  <p className="text-sm text-gray-500">@{group.user.username}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {group.stories.map((story, storyIndex) => (
                  <div
                    key={story.id}
                    className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                    onClick={(e) => {
                      e.stopPropagation();
                      openStory(index, storyIndex);
                    }}
                  >
                    {story.type === "image" && story.media && (
                      <img
                        src={story.media.url}
                        alt="Story preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                    {story.type === "text" && (
                      <div className={`w-full h-full flex items-center justify-center p-2 ${story.backgroundColor || "bg-gradient-to-br from-blue-400 to-purple-600"}`}>
                        <p className={`text-xs font-bold text-center ${story.textColor || "text-white"}`}>
                          {story.textContent?.slice(0, 20)}...
                        </p>
                      </div>
                    )}
                    {story.type === "video" && (
                      <div className="w-full h-full bg-black flex items-center justify-center">
                        <span className="text-white text-xs">Video</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-3">
                View {group.stories.length} {group.stories.length === 1 ? "Story" : "Stories"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Enhanced Features:</h3>
        <ul className="text-sm space-y-1 text-gray-700">
          <li>• <strong>Mobile Responsive</strong>: Optimized for small screens with proper sizing</li>
          <li>• <strong>Navigation</strong>: Tap left/right for content, swipe left/right for different users</li>
          <li>• <strong>Interactions</strong>: Like (heart), send gifts, reply as messages</li>
          <li>• <strong>Controls</strong>: Show/hide interaction panel, pause/play, volume control</li>
          <li>• <strong>Visual Indicators</strong>: Progress bars, navigation hints, view counts</li>
          <li>• <strong>Accessibility</strong>: Proper focus management and screen reader support</li>
        </ul>
      </div>

      <EnhancedStoryViewerModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
        storyGroups={exampleStoryGroups}
        initialStoryIndex={initialStoryIndex}
        initialUserIndex={initialUserIndex}
      />
    </div>
  );
};

export default StoryExample;
