import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Star,
  Shield,
  Target,
  Zap,
  Award,
  Activity,
  Clock,
  Users,
  ShoppingBag,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { cn } from "@/lib/utils";

interface RewardsStatsProps {
  totalEarnings: number;
  currentSoftPoints: number;
  trustScore: {
    current: number;
    level: string;
    multiplier: number;
    nextLevelAt: number;
  };
  activityStats: {
    totalActivities: number;
    contentCreated: number;
    qualityScore: number;
    streakDays: number;
  };
  earningsByType: {
    contentCreation: number;
    engagement: number;
    marketplace: number;
    freelance: number;
    p2pTrading: number;
    referrals: number;
    challenges: number;
  };
  currency?: string;
}

const RewardsStats: React.FC<RewardsStatsProps> = ({
  totalEarnings,
  currentSoftPoints,
  trustScore,
  activityStats,
  earningsByType,
  currency = "USD",
}) => {
  const getTierColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "gold":
        return "text-yellow-600 bg-yellow-100";
      case "silver":
        return "text-gray-600 bg-gray-100";
      case "platinum":
        return "text-purple-600 bg-purple-100";
      case "diamond":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-orange-600 bg-orange-100"; // Bronze
    }
  };

  const getQualityScoreColor = (score: number) => {
    if (score >= 2.0) return "text-green-600 bg-green-100";
    if (score >= 1.5) return "text-yellow-600 bg-yellow-100";
    return "text-orange-600 bg-orange-100";
  };

  const getEarningsIcon = (type: string) => {
    switch (type) {
      case "contentCreation":
        return <Activity className="h-4 w-4" />;
      case "engagement":
        return <Users className="h-4 w-4" />;
      case "marketplace":
        return <ShoppingBag className="h-4 w-4" />;
      case "freelance":
        return <Briefcase className="h-4 w-4" />;
      case "p2pTrading":
        return <TrendingUp className="h-4 w-4" />;
      case "referrals":
        return <Users className="h-4 w-4" />;
      case "challenges":
        return <Target className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const getEarningsLabel = (type: string) => {
    switch (type) {
      case "contentCreation":
        return "Content Creation";
      case "engagement":
        return "Engagement";
      case "marketplace":
        return "Marketplace";
      case "freelance":
        return "Freelance";
      case "p2pTrading":
        return "P2P Trading";
      case "referrals":
        return "Referrals";
      case "challenges":
        return "Challenges";
      default:
        return type;
    }
  };

  const getTrendIcon = (value: number, total: number) => {
    const percentage = (value / total) * 100;
    if (percentage > 25) return <ArrowUpRight className="h-3 w-3 text-green-500" />;
    if (percentage > 10) return <Minus className="h-3 w-3 text-yellow-500" />;
    return <ArrowDownRight className="h-3 w-3 text-gray-500" />;
  };

  const trustProgressPercentage = (trustScore.current / trustScore.nextLevelAt) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Total Earnings */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-green-800">Total Earnings</span>
            </div>
            <Badge className="bg-green-600 text-white">
              All Time
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-green-700">
              {formatCurrency(totalEarnings, currency)}
            </div>
            <div className="text-sm text-green-600">
              {formatNumber(currentSoftPoints)} SoftPoints earned
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quality Score */}
      <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <span className="text-yellow-800">Quality Score</span>
            </div>
            <Badge className={cn("text-xs", getQualityScoreColor(activityStats.qualityScore))}>
              {activityStats.qualityScore >= 2.0 ? "Excellent" : 
               activityStats.qualityScore >= 1.5 ? "Good" : "Average"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-3xl font-bold text-yellow-700">
              {activityStats.qualityScore.toFixed(1)}x
            </div>
            <div className="text-sm text-yellow-600">
              Based on {activityStats.contentCreated} pieces of content
            </div>
            <Progress 
              value={(activityStats.qualityScore / 2.5) * 100} 
              className="h-2" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Trust Score */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800">Trust Score</span>
            </div>
            <Badge className={cn("text-xs", getTierColor(trustScore.level))}>
              {trustScore.level}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-blue-700">
                {trustScore.current}
              </div>
              <div className="text-sm text-blue-600">
                / {trustScore.nextLevelAt}
              </div>
            </div>
            <div className="text-sm text-blue-600">
              {trustScore.multiplier}x reward multiplier
            </div>
            <Progress value={trustProgressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card className="lg:col-span-2 xl:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-gray-900">
                {formatNumber(activityStats.totalActivities)}
              </div>
              <div className="text-sm text-gray-600">Total Activities</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-gray-900">
                {activityStats.contentCreated}
              </div>
              <div className="text-sm text-gray-600">Content Created</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1">
                {activityStats.streakDays}
                <Clock className="h-4 w-4 text-orange-500" />
              </div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1">
                <Award className="h-5 w-5 text-purple-500" />
              </div>
              <div className="text-sm text-gray-600">Achievements</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earnings Breakdown */}
      <Card className="lg:col-span-2 xl:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Earnings Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(earningsByType).map(([type, amount]) => (
              <div
                key={type}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-md">
                    {getEarningsIcon(type)}
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {getEarningsLabel(type)}
                    </div>
                    <div className="text-xs text-gray-600">
                      {formatCurrency(amount, currency)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(amount, totalEarnings)}
                  <span className="text-xs text-gray-500">
                    {((amount / totalEarnings) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardsStats;
