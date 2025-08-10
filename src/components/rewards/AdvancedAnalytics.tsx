import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Clock,
  Target,
  Lightbulb,
  Calendar,
  DollarSign,
  Users,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { cn } from "@/lib/utils";

interface AnalyticsData {
  timeRange: '7d' | '30d' | '90d';
  totalEarnings: number;
  avgDailyEarnings: number;
  bestDay: { date: string; amount: number };
  worstDay: { date: string; amount: number };
  growthRate: number;
  topEarningSource: string;
  insights: Insight[];
  predictions: Prediction[];
  comparisons: Comparison[];
}

interface Insight {
  id: string;
  type: 'tip' | 'warning' | 'opportunity' | 'achievement';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
  action?: string;
}

interface Prediction {
  id: string;
  title: string;
  value: number;
  confidence: number;
  timeframe: string;
  category: string;
}

interface Comparison {
  id: string;
  metric: string;
  yourValue: number;
  avgValue: number;
  percentile: number;
  trend: 'up' | 'down' | 'stable';
}

interface AdvancedAnalyticsProps {
  className?: string;
  earningsByType: {
    contentCreation: number;
    engagement: number;
    marketplace: number;
    freelance: number;
    p2pTrading: number;
    referrals: number;
    challenges: number;
    battleVoting: number;
    battleRewards: number;
    giftsAndTips: number;
  };
}

const AdvancedAnalytics = ({ className, earningsByType }: AdvancedAnalyticsProps) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedTab, setSelectedTab] = useState<'insights' | 'predictions' | 'comparisons'>('insights');

  // Mock analytics data based on time range
  const getAnalyticsData = (range: '7d' | '30d' | '90d'): AnalyticsData => {
    const multiplier = range === '7d' ? 0.25 : range === '30d' ? 1 : 3;
    const totalEarnings = Object.values(earningsByType).reduce((sum, val) => sum + val, 0) * multiplier;
    
    return {
      timeRange: range,
      totalEarnings,
      avgDailyEarnings: totalEarnings / (range === '7d' ? 7 : range === '30d' ? 30 : 90),
      bestDay: { date: "Jan 15", amount: 125.50 },
      worstDay: { date: "Jan 8", amount: 12.25 },
      growthRate: range === '7d' ? 8.5 : range === '30d' ? 15.2 : 32.8,
      topEarningSource: "Content Creation",
      insights: [
        {
          id: "1",
          type: "opportunity",
          title: "Peak Earning Hours",
          description: "You earn 40% more between 6-9 PM. Consider scheduling more activities during these hours.",
          impact: "high",
          actionable: true,
          action: "Schedule content uploads for 6-9 PM"
        },
        {
          id: "2",
          type: "tip",
          title: "Weekend Boost",
          description: "Your weekend earnings are 25% higher than weekdays. Weekend battles and content perform better.",
          impact: "medium",
          actionable: true,
          action: "Focus on weekend content creation"
        },
        {
          id: "3",
          type: "warning",
          title: "Battle Vote Accuracy",
          description: "Your battle vote success rate dropped to 62% this month. Consider analyzing creator stats more carefully.",
          impact: "medium",
          actionable: true,
          action: "Review battle voting strategy"
        },
        {
          id: "4",
          type: "achievement",
          title: "Consistency Champion",
          description: "You've maintained steady earnings for 3 weeks straight! This consistency is helping build your reputation.",
          impact: "low",
          actionable: false
        }
      ],
      predictions: [
        {
          id: "1",
          title: "Next Week Earnings",
          value: totalEarnings * 0.28,
          confidence: 85,
          timeframe: "7 days",
          category: "Total Earnings"
        },
        {
          id: "2",
          title: "Battle Vote Potential",
          value: 156.50,
          confidence: 72,
          timeframe: "14 days",
          category: "Battle Voting"
        },
        {
          id: "3",
          title: "Content Performance",
          value: 89.25,
          confidence: 91,
          timeframe: "7 days",
          category: "Content Creation"
        }
      ],
      comparisons: [
        {
          id: "1",
          metric: "Daily Earnings",
          yourValue: totalEarnings / (range === '7d' ? 7 : range === '30d' ? 30 : 90),
          avgValue: 45.20,
          percentile: 78,
          trend: "up"
        },
        {
          id: "2",
          metric: "Battle Win Rate",
          yourValue: 68,
          avgValue: 55,
          percentile: 82,
          trend: "up"
        },
        {
          id: "3",
          metric: "Content Quality Score",
          yourValue: 1.8,
          avgValue: 1.4,
          percentile: 85,
          trend: "stable"
        },
        {
          id: "4",
          metric: "Engagement Rate",
          yourValue: 12.5,
          avgValue: 8.2,
          percentile: 89,
          trend: "up"
        }
      ]
    };
  };

  const analyticsData = getAnalyticsData(timeRange);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'tip': return <Lightbulb className="h-4 w-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'opportunity': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'achievement': return <CheckCircle className="h-4 w-4 text-purple-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'tip': return 'border-blue-200 bg-blue-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'opportunity': return 'border-green-200 bg-green-50';
      case 'achievement': return 'border-purple-200 bg-purple-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high': return <Badge className="bg-red-500">High Impact</Badge>;
      case 'medium': return <Badge className="bg-yellow-500">Medium Impact</Badge>;
      case 'low': return <Badge className="bg-blue-500">Low Impact</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <BarChart3 className="h-4 w-4 text-gray-500" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Analytics Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics & Insights</h2>
          <p className="text-muted-foreground">Optimize your earning strategy with data-driven insights</p>
        </div>
        <Select value={timeRange} onValueChange={(value: '7d' | '30d' | '90d') => setTimeRange(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">{formatCurrency(analyticsData.totalEarnings)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+{analyticsData.growthRate}%</span>
              <span className="text-muted-foreground ml-1">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Daily Average</p>
                <p className="text-2xl font-bold">{formatCurrency(analyticsData.avgDailyEarnings)}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              Best: {formatCurrency(analyticsData.bestDay.amount)} ({analyticsData.bestDay.date})
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Top Source</p>
                <p className="text-2xl font-bold text-truncate">{analyticsData.topEarningSource}</p>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {formatCurrency(earningsByType.contentCreation)} earned
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Growth Rate</p>
                <p className="text-2xl font-bold">+{analyticsData.growthRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              Compared to previous {timeRange}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        {[
          { value: 'insights', label: 'AI Insights', icon: Lightbulb },
          { value: 'predictions', label: 'Predictions', icon: TrendingUp },
          { value: 'comparisons', label: 'Comparisons', icon: Users }
        ].map((tab) => (
          <Button
            key={tab.value}
            variant={selectedTab === tab.value ? "default" : "outline"}
            onClick={() => setSelectedTab(tab.value as any)}
            className="flex items-center gap-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedTab === 'insights' && (
        <div className="space-y-4">
          {analyticsData.insights.map((insight) => (
            <Card key={insight.id} className={cn("transition-all hover:shadow-md", getInsightColor(insight.type))}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{insight.title}</h3>
                      {getImpactBadge(insight.impact)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {insight.description}
                    </p>
                    {insight.actionable && insight.action && (
                      <Button size="sm" variant="outline" className="text-xs">
                        <Target className="h-3 w-3 mr-1" />
                        {insight.action}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedTab === 'predictions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyticsData.predictions.map((prediction) => (
            <Card key={prediction.id}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold">{prediction.title}</h3>
                    <p className="text-xs text-muted-foreground">{prediction.category}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(prediction.value)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      in {prediction.timeframe}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Confidence</span>
                      <span className="font-medium">{prediction.confidence}%</span>
                    </div>
                    <div className={cn(
                      "h-2 rounded-full",
                      prediction.confidence >= 80 ? "bg-green-200" : 
                      prediction.confidence >= 60 ? "bg-yellow-200" : "bg-red-200"
                    )}>
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          prediction.confidence >= 80 ? "bg-green-500" : 
                          prediction.confidence >= 60 ? "bg-yellow-500" : "bg-red-500"
                        )}
                        style={{ width: `${prediction.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedTab === 'comparisons' && (
        <div className="space-y-4">
          {analyticsData.comparisons.map((comparison) => (
            <Card key={comparison.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getTrendIcon(comparison.trend)}
                    <div>
                      <h3 className="font-semibold">{comparison.metric}</h3>
                      <p className="text-sm text-muted-foreground">
                        You vs Platform Average
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {typeof comparison.yourValue === 'number' && comparison.yourValue < 100 
                        ? comparison.yourValue.toFixed(1) 
                        : formatNumber(comparison.yourValue)}
                      {comparison.metric.includes('Rate') ? '%' : ''}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Avg: {typeof comparison.avgValue === 'number' && comparison.avgValue < 100 
                        ? comparison.avgValue.toFixed(1) 
                        : formatNumber(comparison.avgValue)}
                      {comparison.metric.includes('Rate') ? '%' : ''}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Badge 
                      variant={comparison.percentile >= 75 ? "default" : comparison.percentile >= 50 ? "secondary" : "outline"}
                      className={cn(
                        comparison.percentile >= 75 && "bg-green-500",
                        comparison.percentile >= 50 && comparison.percentile < 75 && "bg-yellow-500"
                      )}
                    >
                      {comparison.percentile}th percentile
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      Better than {comparison.percentile}% of users
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvancedAnalytics;
