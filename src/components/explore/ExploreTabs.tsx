
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ExploreTabsProps {
  activeTab: string;
  onValueChange: (value: string) => void;
}

const ExploreTabs = ({ activeTab, onValueChange }: ExploreTabsProps) => {
  return (
    <TabsList className="grid w-full grid-cols-4">
      <TabsTrigger value="pages">Pages</TabsTrigger>
      <TabsTrigger value="groups">Groups</TabsTrigger>
      <TabsTrigger value="events">Events</TabsTrigger>
      <TabsTrigger value="people">People</TabsTrigger>
    </TabsList>
  );
};

export default ExploreTabs;
