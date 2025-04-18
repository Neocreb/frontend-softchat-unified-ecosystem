
import { TrendingUp, Users, Hash, LayoutGrid, Store } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ExploreTabsProps {
  defaultValue: string;
  onValueChange?: (value: string) => void;
}

const ExploreTabs = ({ defaultValue, onValueChange }: ExploreTabsProps) => {
  return (
    <TabsList className="grid w-full grid-cols-5">
      <TabsTrigger value="trending" className="flex items-center gap-1">
        <TrendingUp className="h-4 w-4" />
        <span className="hidden sm:inline">Trending</span>
      </TabsTrigger>
      <TabsTrigger value="people" className="flex items-center gap-1">
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline">People</span>
      </TabsTrigger>
      <TabsTrigger value="hashtags" className="flex items-center gap-1">
        <Hash className="h-4 w-4" />
        <span className="hidden sm:inline">Hashtags</span>
      </TabsTrigger>
      <TabsTrigger value="groups" className="flex items-center gap-1">
        <LayoutGrid className="h-4 w-4" />
        <span className="hidden sm:inline">Groups</span>
      </TabsTrigger>
      <TabsTrigger value="pages" className="flex items-center gap-1">
        <Store className="h-4 w-4" />
        <span className="hidden sm:inline">Pages</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default ExploreTabs;
