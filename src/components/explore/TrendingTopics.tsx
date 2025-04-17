
import { TrendingUp } from "lucide-react";
import { formatNumber } from "@/utils/formatters";

interface TrendingTopic {
  id: string;
  name: string;
  posts: number;
  category: string;
}

interface TrendingTopicsProps {
  topics: TrendingTopic[];
}

const TrendingTopics = ({ topics }: TrendingTopicsProps) => {
  return (
    <div className="mt-4 space-y-4">
      {topics.length > 0 ? (
        topics.map((topic) => (
          <div key={topic.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
            <div>
              <p className="text-xs text-muted-foreground">{topic.category}</p>
              <h3 className="font-semibold">#{topic.name}</h3>
              <p className="text-sm text-muted-foreground">{formatNumber(topic.posts)} posts</p>
            </div>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No trending topics found</p>
        </div>
      )}
    </div>
  );
};

export default TrendingTopics;
