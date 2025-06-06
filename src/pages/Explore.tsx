
import { useState } from "react";
import { useExplore } from "@/hooks/use-explore";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ExploreContent from "@/components/explore/ExploreContent";
import SearchBar from "@/components/explore/SearchBar";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, FileText, User } from "lucide-react";

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pages");
  
  const {
    filteredUsers,
    filteredGroups,
    filteredPages
  } = useExplore();

  // Mock events data since it's not in the hook
  const filteredEvents = [
    {
      id: "1",
      name: "Tech Conference 2024",
      date: "March 15, 2024",
      location: "San Francisco, CA",
      attendees: 1250,
      category: "Technology",
      cover: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500",
      organizer: "Tech Events Inc"
    },
    {
      id: "2", 
      name: "Music Festival",
      date: "April 20, 2024",
      location: "Austin, TX",
      attendees: 5000,
      category: "Music",
      cover: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500",
      organizer: "Music Events LLC"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-4xl mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Explore</h1>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Pages
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Groups
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="people" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              People
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <ExploreContent
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              filteredUsers={filteredUsers}
              filteredGroups={filteredGroups}
              filteredPages={filteredPages}
              filteredEvents={filteredEvents}
            />
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Explore;
