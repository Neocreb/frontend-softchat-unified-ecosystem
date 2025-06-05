
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Clock, Star } from "lucide-react";

interface FeedFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FeedFilters = ({ activeFilter, onFilterChange }: FeedFiltersProps) => {
  return (
    <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b p-4 sticky top-0 z-10">
      <Tabs value={activeFilter} onValueChange={onFilterChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="following" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Following
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent
          </TabsTrigger>
          <TabsTrigger value="featured" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Featured
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default FeedFilters;
