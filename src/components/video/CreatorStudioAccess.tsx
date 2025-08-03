import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Eye,
  Heart,
  Zap,
  Star,
  Crown,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CreatorStudioAccessProps {
  className?: string;
  showFullButton?: boolean;
}

const CreatorStudioAccess: React.FC<CreatorStudioAccessProps> = ({
  className,
  showFullButton = true,
}) => {
  const navigate = useNavigate();

  const quickStats = [
    {
      label: "Total Views",
      value: "2.8M",
      change: "+23.5%",
      icon: <Eye className="w-4 h-4" />,
    },
    {
      label: "Engagement",
      value: "8.7%",
      change: "+2.1%",
      icon: <Heart className="w-4 h-4" />,
    },
    {
      label: "Revenue",
      value: "$12.5K",
      change: "+15.8%",
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      label: "Followers",
      value: "89.5K",
      change: "+4.2%",
      icon: <Users className="w-4 h-4" />,
    },
  ];

  const insights = [
    {
      title: "AI Trend Alert",
      description: "AI art tutorials trending +340%",
      type: "opportunity",
    },
    {
      title: "Best Time",
      description: "Post at 7 PM for 23% more engagement",
      type: "tip",
    },
    {
      title: "Revenue Goal",
      description: "On track to hit $15K this month",
      type: "progress",
    },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Quick Access Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Creator Studio</h3>
            <p className="text-sm text-muted-foreground">
              Advanced analytics & insights
            </p>
          </div>
        </div>
        <Badge
          variant="secondary"
          className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
        >
          <Crown className="w-3 h-3 mr-1" />
          Pro
        </Badge>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-muted-foreground">{stat.icon}</div>
                <div
                  className={cn(
                    "text-xs font-medium",
                    stat.change.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500",
                  )}
                >
                  {stat.change}
                </div>
              </div>
              <div className="font-bold text-lg">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-2 bg-muted/30 rounded-lg"
            >
              <div
                className={cn(
                  "w-2 h-2 rounded-full mt-2",
                  insight.type === "opportunity" && "bg-green-500",
                  insight.type === "tip" && "bg-blue-500",
                  insight.type === "progress" && "bg-purple-500",
                )}
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{insight.title}</div>
                <div className="text-xs text-muted-foreground">
                  {insight.description}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {showFullButton && (
          <Button
            onClick={() => navigate("/app/unified-creator-studio")}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Open Creator Studio
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => navigate("/app/unified-creator-studio?tab=insights")}
          className="flex-1"
        >
          View Insights
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="justify-start"
          onClick={() => navigate("/app/unified-creator-studio?tab=content")}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Content Analytics
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="justify-start"
          onClick={() => navigate("/app/creator-studio?tab=revenue")}
        >
          <DollarSign className="w-4 h-4 mr-2" />
          Revenue Tracking
        </Button>
      </div>
    </div>
  );
};

export default CreatorStudioAccess;
