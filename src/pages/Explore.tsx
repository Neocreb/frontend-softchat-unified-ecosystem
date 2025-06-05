
import { useState } from "react";
import { useExplore } from "@/hooks/use-explore";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ExploreContent from "@/components/explore/ExploreContent";
import SearchBar from "@/components/explore/SearchBar";
import GroupsTab from "@/components/explore/GroupsTab";
import EventsTab from "@/components/explore/EventsTab";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Users, Hash, Building, Calendar } from "lucide-react";

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("trending");
  
  const {
    filteredTopics,
    filteredUsers,
    filteredHashtags,
    filteredGroups,
    filteredPages
  } = useExplore(searchQuery);

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Explore</h1>
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="people" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            People
          </TabsTrigger>
          <TabsTrigger value="hashtags" className="flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Hashtags
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Groups
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Pages
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="trending">
            <ExploreContent
              activeTab="trending"
              setActiveTab={setActiveTab}
              filteredTopics={filteredTopics}
              filteredUsers={filteredUsers}
              filteredHashtags={filteredHashtags}
              filteredGroups={filteredGroups}
              filteredPages={filteredPages}
            />
          </TabsContent>

          <TabsContent value="people">
            <ExploreContent
              activeTab="people"
              setActiveTab={setActiveTab}
              filteredTopics={filteredTopics}
              filteredUsers={filteredUsers}
              filteredHashtags={filteredHashtags}
              filteredGroups={filteredGroups}
              filteredPages={filteredPages}
            />
          </TabsContent>

          <TabsContent value="hashtags">
            <ExploreContent
              activeTab="hashtags"
              setActiveTab={setActiveTab}
              filteredTopics={filteredTopics}
              filteredUsers={filteredUsers}
              filteredHashtags={filteredHashtags}
              filteredGroups={filteredGroups}
              filteredPages={filteredPages}
            />
          </TabsContent>

          <TabsContent value="groups">
            <GroupsTab />
          </TabsContent>

          <TabsContent value="events">
            <EventsTab />
          </TabsContent>

          <TabsContent value="pages">
            <ExploreContent
              activeTab="pages"
              setActiveTab={setActiveTab}
              filteredTopics={filteredTopics}
              filteredUsers={filteredUsers}
              filteredHashtags={filteredHashtags}
              filteredGroups={filteredGroups}
              filteredPages={filteredPages}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Explore;
