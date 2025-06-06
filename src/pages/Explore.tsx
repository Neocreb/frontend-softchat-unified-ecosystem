
import { useState } from "react";
import SearchBar from "@/components/explore/SearchBar";
import ExploreContent from "@/components/explore/ExploreContent";
import { useExplore } from "@/hooks/use-explore";

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
    filteredPages
  } = useExplore();

  return (
    <div className="container max-w-[680px] mx-auto pb-16 md:pb-0 pt-4">
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
