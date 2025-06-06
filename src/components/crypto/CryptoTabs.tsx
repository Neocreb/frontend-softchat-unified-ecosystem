
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CryptoTabsProps {
  activeTab: string;
  onValueChange: (value: string) => void;
}

const CryptoTabs = ({ activeTab, onValueChange }: CryptoTabsProps) => {
  return (
    <TabsList className="grid w-full grid-cols-4">
      <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
      <TabsTrigger value="markets">Markets</TabsTrigger>
      <TabsTrigger value="basic">Basic</TabsTrigger>
      <TabsTrigger value="trading">Trading</TabsTrigger>
    </TabsList>
  );
};

export default CryptoTabs;
