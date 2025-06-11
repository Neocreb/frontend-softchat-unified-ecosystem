import { useState } from "react";
import SearchBar from "@/components/explore/SearchBar";
import ExploreContent from "@/components/explore/ExploreContent";
import SuggestedUsers from "@/components/profile/SuggestedUsers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useExplore } from "@/hooks/use-explore";
import { Users, TrendingUp, Hash, Globe } from "lucide-react";

const Explore = () => {
  const {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    filteredTopics,
    filteredUsers,
    filteredHashtags,
    filteredGroups,
    filteredPages,
  } = useExplore();

  return (
    <div className="max-w-[680px] mx-auto">
      <div className="space-y-4">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <ExploreContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filteredTopics={filteredTopics}
          filteredUsers={filteredUsers}
          filteredHashtags={filteredHashtags}
          filteredGroups={filteredGroups}
          filteredPages={filteredPages}
        />
      </div>
    </div>
  );
};

export default Explore;
