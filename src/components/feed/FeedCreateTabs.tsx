
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, BarChart3, Camera, Calendar } from "lucide-react";

interface FeedCreateTabsProps {
  activeTab: string;
  onValueChange: (value: string) => void;
}

const FeedCreateTabs = ({ activeTab, onValueChange }: FeedCreateTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onValueChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="post" className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Post
        </TabsTrigger>
        <TabsTrigger value="poll" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Poll
        </TabsTrigger>
        <TabsTrigger value="story" className="flex items-center gap-2">
          <Camera className="h-4 w-4" />
          Story
        </TabsTrigger>
        <TabsTrigger value="schedule" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Schedule
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default FeedCreateTabs;
