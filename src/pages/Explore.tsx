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
    <div className="max-w-4xl mx-auto">
      <div className="space-y-6">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <Tabs defaultValue="discover" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Discover</span>
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Trending</span>
            </TabsTrigger>
            <TabsTrigger value="hashtags" className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              <span className="hidden sm:inline">Hashtags</span>
            </TabsTrigger>
            <TabsTrigger value="explore" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Explore</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SuggestedUsers
                  title="Featured Users"
                  variant="grid"
                  maxUsers={6}
                />
              </div>
              <div className="space-y-4">
                <SuggestedUsers title="New Users" variant="card" maxUsers={4} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trending" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Trending Sellers</CardTitle>
                </CardHeader>
                <CardContent>
                  <SuggestedUsers
                    variant="list"
                    maxUsers={3}
                    showTitle={false}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Freelancers</CardTitle>
                </CardHeader>
                <CardContent>
                  <SuggestedUsers
                    variant="list"
                    maxUsers={3}
                    showTitle={false}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Traders</CardTitle>
                </CardHeader>
                <CardContent>
                  <SuggestedUsers
                    variant="list"
                    maxUsers={3}
                    showTitle={false}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="hashtags" className="mt-6">
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

          <TabsContent value="explore" className="mt-6">
            <ExploreContent
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              filteredTopics={filteredTopics}
              filteredUsers={filteredUsers}
              filteredHashtags={filteredHashtags}
              filteredGroups={filteredGroups}
              filteredPages={filteredPages}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Explore;
