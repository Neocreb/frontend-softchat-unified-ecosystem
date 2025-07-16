import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Gift,
  Eye,
  Users,
  Zap,
  ChevronLeft,
  ChevronRight,
  Filter,
  Calendar,
  DollarSign,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import { fetchWithAuth } from "@/lib/fetch-utils";

interface RevenueItem {
  id: string;
  type: string;
  amount: number;
  currency: string;
  softPoints: number;
  date: string;
  fromUser?: {
    id: string;
    name: string;
    avatar?: string;
  };
  description: string;
  status: string;
}

interface RevenueHistoryProps {
  userId: string;
}

const RevenueHistory = ({ userId }: RevenueHistoryProps) => {
  const [history, setHistory] = useState<RevenueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [filter, page]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(
        `/api/creator/revenue/history?type=${filter}&page=${page}&limit=20`,
      );

      if (response.ok) {
        const data = await response.json();
        setHistory(data.data || []);
        setHasMore(data.data && data.data.length === 20);
      } else {
        // Demo data fallback
        setHistory(getMockHistory());
      }
    } catch (error) {
      console.error("Failed to load revenue history:", error);
      setHistory(getMockHistory());
    } finally {
      setLoading(false);
    }
  };

  const getMockHistory = (): RevenueItem[] => [
    {
      id: "rev_001",
      type: "tip_received",
      amount: 25,
      currency: "USDT",
      softPoints: 1,
      date: new Date().toISOString(),
      fromUser: {
        id: "user_1",
        name: "Alice Johnson",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b5f5?w=40",
      },
      description: "Tip for amazing content!",
      status: "completed",
    },
    {
      id: "rev_002",
      type: "view_payment",
      amount: 0,
      currency: "SOFT_POINTS",
      softPoints: 5,
      date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      description: "1,000 views milestone reached",
      status: "completed",
    },
    {
      id: "rev_003",
      type: "subscription_payment",
      amount: 9.99,
      currency: "USDT",
      softPoints: 10,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      fromUser: {
        id: "user_2",
        name: "Bob Smith",
        avatar:
          "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40",
      },
      description: "Monthly subscription",
      status: "completed",
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "tip_received":
        return <Gift className="w-4 h-4 text-pink-500" />;
      case "subscription_payment":
        return <Users className="w-4 h-4 text-blue-500" />;
      case "view_payment":
        return <Eye className="w-4 h-4 text-green-500" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const config = {
      tip_received: {
        label: "Tip",
        variant: "default" as const,
        class: "bg-pink-100 text-pink-800",
      },
      subscription_payment: {
        label: "Subscription",
        variant: "default" as const,
        class: "bg-blue-100 text-blue-800",
      },
      view_payment: {
        label: "Views",
        variant: "default" as const,
        class: "bg-green-100 text-green-800",
      },
      boost_deduction: {
        label: "Boost",
        variant: "destructive" as const,
        class: "bg-red-100 text-red-800",
      },
    };

    const typeConfig = config[type as keyof typeof config] || {
      label: "Other",
      variant: "secondary" as const,
      class: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge variant={typeConfig.variant} className={typeConfig.class}>
        {typeConfig.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Revenue History
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select
                value={filter}
                onValueChange={(value) => {
                  setFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="tip">Tips</SelectItem>
                  <SelectItem value="subscription">Subscriptions</SelectItem>
                  <SelectItem value="view">Views</SelectItem>
                  <SelectItem value="boost">Boosts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center gap-4 p-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
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
            <div className="space-y-3">
              {history.length === 0 ? (
                <div className="text-center py-8">
                  <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No Revenue History
                  </h3>
                  <p className="text-muted-foreground">
                    Start creating content to see your earnings here.
                  </p>
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="p-3 bg-muted rounded-full">
                      {getTypeIcon(item.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getTypeBadge(item.type)}
                        <span className="text-sm text-muted-foreground">
                          {formatDateTime(item.date)}
                        </span>
                      </div>

                      <p className="font-medium text-sm mb-1">
                        {item.description}
                      </p>

                      {item.fromUser && (
                        <div className="flex items-center gap-2">
                          <Avatar className="w-5 h-5">
                            <AvatarImage src={item.fromUser.avatar} />
                            <AvatarFallback className="text-xs">
                              {item.fromUser.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">
                            from {item.fromUser.name}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      {item.amount > 0 && (
                        <p className="font-medium text-green-600">
                          +{formatCurrency(item.amount)}
                        </p>
                      )}
                      {item.softPoints > 0 && (
                        <p className="text-xs text-purple-600 flex items-center justify-end gap-1">
                          <Zap className="w-3 h-3" />
                          {item.softPoints} SP
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Pagination */}
          {history.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              <span className="text-sm text-muted-foreground">Page {page}</span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={!hasMore}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueHistory;
