
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hash } from "lucide-react";

const TrendingHashtags = () => {
  const trendingTags = [
    { tag: "SoftChat", posts: 1234 },
    { tag: "CryptoTrading", posts: 856 },
    { tag: "TechNews", posts: 642 },
    { tag: "DigitalArt", posts: 523 },
    { tag: "BlockchainTech", posts: 445 },
    { tag: "DeFi", posts: 387 },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Hash className="h-4 w-4" />
          Trending Hashtags
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {trendingTags.map((item, index) => (
            <div key={item.tag} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  #{index + 1}
                </span>
                <span className="font-medium">#{item.tag}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {item.posts} posts
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingHashtags;
