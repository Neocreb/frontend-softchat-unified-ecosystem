import { Tabs, TabsContent } from "@/components/ui/tabs";
import ExploreTabs from "./ExploreTabs";
import TrendingTopics from "./TrendingTopics";
import SuggestedUsers from "./SuggestedUsers";
import PopularHashtags from "./PopularHashtags";
import ExploreGroups from "./ExploreGroups";
import ExplorePages from "./ExplorePages";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight, Play, Users, TrendingUp } from "lucide-react";

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
        <Card className="text-center py-12">
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Live Community Events</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Join real-time collaborative experiences including crypto
                trading sessions, marketplace flash sales, and interactive
                workshops.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>3 Live Now</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-blue-500" />
                <span>500+ Participants</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span>Earn Rewards</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link to="/app/events">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  <Play className="w-4 h-4 mr-2" />
                  Explore All Events
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground">
                Get the full experience with analytics, search, and event
                creation
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ExploreContent;
