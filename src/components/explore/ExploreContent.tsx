import { Tabs, TabsContent } from "@/components/ui/tabs";
import ExploreTabs from "./ExploreTabs";
import TrendingTopics from "./TrendingTopics";
import SuggestedUsers from "./SuggestedUsers";
import PopularHashtags from "./PopularHashtags";
import ExploreGroups from "./ExploreGroups";
import ExplorePages from "./ExplorePages";
import LiveCommunityEvents from "@/components/community/LiveCommunityEvents";

interface ExploreContentProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  filteredTopics: any[];
  filteredUsers: any[];
  filteredHashtags: any[];
  filteredGroups: any[];
  filteredPages: any[];
}

const ExploreContent = ({
  activeTab,
  setActiveTab,
  filteredTopics,
  filteredUsers,
  filteredHashtags,
  filteredGroups,
  filteredPages,
}: ExploreContentProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <ExploreTabs activeTab={activeTab} onValueChange={setActiveTab} />

      <TabsContent value="trending">
        <TrendingTopics topics={filteredTopics} />
      </TabsContent>

      <TabsContent value="people">
        <SuggestedUsers users={filteredUsers} />
      </TabsContent>

      <TabsContent value="hashtags">
        <PopularHashtags hashtags={filteredHashtags} />
      </TabsContent>

      <TabsContent value="groups">
        <ExploreGroups groups={filteredGroups} />
      </TabsContent>

      <TabsContent value="pages">
        <ExplorePages pages={filteredPages} />
      </TabsContent>

      <TabsContent value="events">
        <LiveCommunityEvents />
      </TabsContent>
    </Tabs>
  );
};

export default ExploreContent;
