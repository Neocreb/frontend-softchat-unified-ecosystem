import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Eye,
  DollarSign,
  Gift,
  Users,
  Search,
  TrendingUp,
  Play,
  FileText,
  Image,
  Star,
  Zap,
} from "lucide-react";
import { formatCurrency, formatNumber, formatDate } from "@/utils/formatters";
import { fetchWithAuth } from "@/lib/fetch-utils";

interface ContentItem {
  id: string;
  title: string;
  type: "post" | "video" | "story" | "reel";
  thumbnail?: string;
  views: number;
  earnings: number;
  tips: number;
  softPoints: number;
  isMonetized: boolean;
  createdAt: string;
  performance: {
    engagement: number;
    revenue: number;
  };
}

interface MonetizedContentProps {
  userId: string;
}

const MonetizedContent = ({ userId }: MonetizedContentProps) => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`/api/creator/content`);

      if (response.ok) {
        const data = await response.json();
        setContent(data.data || []);
      } else {
        // Demo data fallback
        setContent(getMockContent());
      }
    } catch (error) {
      console.error("Failed to load content:", error);
      setContent(getMockContent());
    } finally {
      setLoading(false);
    }
  };

  const getMockContent = (): ContentItem[] => [
    {
      id: "1",
      title: "AI Art Creation Tutorial",
      type: "video",
      thumbnail:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300",
      views: 45689,
      earnings: 240.5,
      tips: 12,
      softPoints: 45,
      isMonetized: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      performance: {
        engagement: 12.4,
        revenue: 240.5,
      },
    },
    {
      id: "2",
      title: "Behind the scenes of my creative process",
      type: "post",
      thumbnail:
        "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300",
      views: 23456,
      earnings: 125.3,
      tips: 8,
      softPoints: 23,
      isMonetized: true,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      performance: {
        engagement: 9.8,
        revenue: 125.3,
      },
    },
    {
      id: "3",
      title: "Quick Recipe: 30-Second Pasta",
      type: "reel",
      thumbnail:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300",
      views: 18923,
      earnings: 89.75,
      tips: 15,
      softPoints: 19,
      isMonetized: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      performance: {
        engagement: 15.2,
        revenue: 89.75,
      },
    },
  ];

  const getContentIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="w-4 h-4" />;
      case "post":
        return <FileText className="w-4 h-4" />;
      case "story":
        return <Image className="w-4 h-4" />;
      case "reel":
        return <Play className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "bg-red-100 text-red-800";
      case "post":
        return "bg-blue-100 text-blue-800";
      case "story":
        return "bg-purple-100 text-purple-800";
      case "reel":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredContent = content.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  const totalStats = content.reduce(
    (acc, item) => ({
      views: acc.views + item.views,
      earnings: acc.earnings + item.earnings,
      tips: acc.tips + item.tips,
      softPoints: acc.softPoints + item.softPoints,
    }),
    { views: 0, earnings: 0, tips: 0, softPoints: 0 },
  );

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-xl font-bold">
                  {formatNumber(totalStats.views)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-xl font-bold">
                  {formatCurrency(totalStats.earnings)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Gift className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tips Received</p>
                <p className="text-xl font-bold">{totalStats.tips}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">SoftPoints</p>
                <p className="text-xl font-bold">{totalStats.softPoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Monetized Content</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <div className="flex gap-1">
                {["all", "video", "post", "reel", "story"].map((type) => (
                  <Button
                    key={type}
                    variant={filter === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(type)}
                    className="capitalize"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center gap-4 p-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContent.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Content Found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || filter !== "all"
                      ? "Try adjusting your search or filters."
                      : "Start creating monetized content to see it here."}
                  </p>
                </div>
              ) : (
                filteredContent.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="relative">
                      <img
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="absolute -top-1 -right-1">
                        <Badge
                          className={`text-xs ${getContentTypeColor(item.type)}`}
                        >
                          <span className="mr-1">
                            {getContentIcon(item.type)}
                          </span>
                          {item.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium mb-1 line-clamp-1">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {formatNumber(item.views)} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Gift className="w-3 h-3" />
                          {item.tips} tips
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {item.performance.engagement}% engagement
                        </span>
                        <span className="text-xs">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-medium text-green-600 mb-1">
                        {formatCurrency(item.earnings)}
                      </p>
                      <p className="text-xs text-purple-600 flex items-center justify-end gap-1">
                        <Star className="w-3 h-3" />
                        {item.softPoints} SP
                      </p>
                      {item.isMonetized && (
                        <Badge variant="outline" className="text-xs mt-1">
                          Monetized
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MonetizedContent;
