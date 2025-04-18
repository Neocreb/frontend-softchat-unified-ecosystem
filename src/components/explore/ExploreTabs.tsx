
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ExploreTabsProps {
  activeTab: string;
  onValueChange: (value: string) => void;
}

const ExploreTabs = ({ activeTab, onValueChange }: ExploreTabsProps) => {
  return (
    <TabsList className="grid w-full grid-cols-5">
      <TabsTrigger value="trending">Trending</TabsTrigger>
      <TabsTrigger value="people">People</TabsTrigger>
      <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
      <TabsTrigger value="groups">Groups</TabsTrigger>
      <TabsTrigger value="pages">Pages</TabsTrigger>
    </TabsList>
  );
};

export default ExploreTabs;
