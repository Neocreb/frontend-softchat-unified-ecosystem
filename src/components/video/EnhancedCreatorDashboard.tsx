import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  DollarSign,
  Calendar,
  Clock,
  Target,
  Award,
  Zap,
  Globe,
  Download,
  Filter,
  RefreshCw,
  Settings,
  PieChart,
  LineChart,
  Activity,
  Smartphone,
  Monitor,
  MapPin,
  Play,
  Pause,
  SkipForward,
  UserPlus,
  UserMinus,
  Coins,
  CreditCard,
  Gift,
  Handshake,
  Video,
  Music,
  Hash,
  Star,
  ThumbsUp,
  Bookmark,
  FileText,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Brain,
  Rocket,
  Crown,
  Flame,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Minus,
  Equal,
  X,
  Trophy,
  Shield,
  Timer,
  Package,
  Store,
  Wallet,
  Bitcoin,
  CandlestickChart,
  AreaChart,
  TrendingDownIcon,
  CalendarDays,
  Megaphone,
  Users2,
  MousePointer,
  Layers,
  Percent,
  TowerControl,
  BarChart2,
  PieChartIcon,
  TrendingUpIcon,
  DollarSignIcon,
  UsersIcon,
  EyeIcon,
  HeartIcon,
  MessageCircleIcon,
  Share2Icon,
  VideoIcon,
  PlayIcon,
  TargetIcon,
  Maximize,
  Minimize,
  RotateCcw,
  Info,
  HelpCircle,
  BookOpen,
  GraduationCap,
  Briefcase,
  Building,
  ShoppingBag,
  CreditCardIcon,
  BankNote,
  Receipt,
  Calculator,
  ChartLine,
  ChartBar,
  ChartPie,
  ChartArea,
  ChartColumn,
  TrendChart,
  BarChart4
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

// Enhanced Analytics Interfaces
interface DetailedMetric {
  label: string;
  value: number;
  previousValue?: number;
  change: number;
  changeType: "increase" | "decrease" | "neutral";
  format: "number" | "currency" | "percentage" | "duration" | "rate";
  trend: number[];
  goal?: number;
  benchmark?: number;
  description?: string;
  confidence?: number;
}

interface ContentAnalytics {
  id: string;
  type: "video" | "post" | "story" | "live";
  title: string;
  thumbnail: string;
  publishedAt: Date;
  metrics: {
    views: number;
    uniqueViews: number;
    impressions: number;
    reach: number;
    engagement: {
      likes: number;
      comments: number;
      shares: number;
      saves: number;
      rate: number;
    };
    retention: {
      averageViewDuration: number;
      retentionRate: number;
      dropOffPoints: { time: number; percentage: number }[];
    };
    revenue: {
      adRevenue: number;
      tips: number;
      subscriptions: number;
      merchandise: number;
      total: number;
    };
    demographics: {
      age: { range: string; percentage: number }[];
      gender: { type: string; percentage: number }[];
      location: { country: string; percentage: number }[];
    };
    trafficSources: {
      source: string;
      percentage: number;
      views: number;
    }[];
  };
  performance: {
    ctr: number; // Click-through rate
    cpm: number; // Cost per mille
    rpm: number; // Revenue per mille
    conversionRate: number;
    viralityCoefficient: number;
  };
  tags: string[];
  category: string;
  monetized: boolean;
  boosted: boolean;
}

interface AudienceInsight {
  metric: string;
  value: string | number;
  description: string;
  trend: "up" | "down" | "stable";
  impact: "high" | "medium" | "low";
  actionable: boolean;
  recommendation?: string;
}

interface RevenueStream {
  source: string;
  amount: number;
  percentage: number;
  change: number;
  growth: number;
  projection: number;
  icon: React.ReactNode;
  subStreams?: {
    name: string;
    amount: number;
    percentage: number;
  }[];
}

interface PredictiveInsight {
  id: string;
  type: "opportunity" | "warning" | "trend" | "recommendation" | "alert";
  title: string;
  description: string;
  confidence: number;
  impact: "high" | "medium" | "low";
  timeframe: string;
  actionable: boolean;
  actions?: string[];
  estimatedValue?: number;
  category: "content" | "audience" | "monetization" | "growth" | "optimization";
}

interface CompetitorAnalysis {
  competitor: string;
  metrics: {
    followers: number;
    avgViews: number;
    engagementRate: number;
    postFrequency: number;
  };
  comparison: {
    followers: "higher" | "lower" | "similar";
    engagement: "higher" | "lower" | "similar";
    content: "higher" | "lower" | "similar";
  };
}

// Enhanced Mock Data
const enhancedMetrics: DetailedMetric[] = [
  {
    label: "Total Views",
    value: 2847291,
    previousValue: 2156432,
    change: 32.1,
    changeType: "increase",
    format: "number",
    trend: [2156432, 2287654, 2456789, 2634567, 2847291],
    goal: 3000000,
    benchmark: 2500000,
    description: "Total video views across all content",
    confidence: 95
  },
  {
    label: "Unique Viewers",
    value: 1547832,
    previousValue: 1298765,
    change: 19.2,
    changeType: "increase",
    format: "number",
    trend: [1298765, 1367890, 1423456, 1487654, 1547832],
    goal: 1800000,
    benchmark: 1400000,
    description: "Individual users who watched your content",
    confidence: 92
  },
  {
    label: "Engagement Rate",
    value: 12.7,
    previousValue: 10.3,
    change: 23.3,
    changeType: "increase",
    format: "percentage",
    trend: [10.3, 10.8, 11.4, 12.1, 12.7],
    goal: 15.0,
    benchmark: 8.5,
    description: "Percentage of viewers who engaged with content",
    confidence: 89
  },
  {
    label: "Total Revenue",
    value: 18540,
    previousValue: 14230,
    change: 30.3,
    changeType: "increase",
    format: "currency",
    trend: [14230, 15678, 16445, 17890, 18540],
    goal: 25000,
    benchmark: 15000,
    description: "Total earnings from all revenue streams",
    confidence: 97
  },
  {
    label: "Subscriber Growth",
    value: 4.2,
    previousValue: 2.8,
    change: 50.0,
    changeType: "increase",
    format: "percentage",
    trend: [2.8, 3.1, 3.6, 3.9, 4.2],
    goal: 6.0,
    benchmark: 3.5,
    description: "Monthly subscriber growth rate",
    confidence: 85
  },
  {
    label: "Average Watch Time",
    value: 324,
    previousValue: 298,
    change: 8.7,
    changeType: "increase",
    format: "duration",
    trend: [298, 305, 312, 318, 324],
    goal: 400,
    benchmark: 280,
    description: "Average time viewers spend watching videos",
    confidence: 91
  },
  {
    label: "CTR (Click-through Rate)",
    value: 8.4,
    previousValue: 6.9,
    change: 21.7,
    changeType: "increase",
    format: "percentage",
    trend: [6.9, 7.2, 7.8, 8.1, 8.4],
    goal: 10.0,
    benchmark: 7.0,
    description: "Percentage of impressions that resulted in views",
    confidence: 88
  },
  {
    label: "Revenue Per View",
    value: 0.0065,
    previousValue: 0.0052,
    change: 25.0,
    changeType: "increase",
    format: "currency",
    trend: [0.0052, 0.0055, 0.0058, 0.0062, 0.0065],
    goal: 0.008,
    benchmark: 0.005,
    description: "Average revenue generated per video view",
    confidence: 93
  }
];

const topContent: ContentAnalytics[] = [
  {
    id: "1",
    type: "video",
    title: "AI Art Creation: Complete Tutorial for Beginners",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    metrics: {
      views: 456789,
      uniqueViews: 387654,
      impressions: 892456,
      reach: 567890,
      engagement: {
        likes: 23456,
        comments: 1876,
        shares: 3456,
        saves: 2134,
        rate: 15.2
      },
      retention: {
        averageViewDuration: 387,
        retentionRate: 68.4,
        dropOffPoints: [
          { time: 30, percentage: 15 },
          { time: 120, percentage: 35 },
          { time: 300, percentage: 55 }
        ]
      },
      revenue: {
        adRevenue: 234.50,
        tips: 156.78,
        subscriptions: 89.23,
        merchandise: 45.67,
        total: 526.18
      },
      demographics: {
        age: [
          { range: "18-24", percentage: 35 },
          { range: "25-34", percentage: 40 },
          { range: "35-44", percentage: 20 },
          { range: "45+", percentage: 5 }
        ],
        gender: [
          { type: "Male", percentage: 65 },
          { type: "Female", percentage: 32 },
          { type: "Other", percentage: 3 }
        ],
        location: [
          { country: "United States", percentage: 45 },
          { country: "United Kingdom", percentage: 18 },
          { country: "Canada", percentage: 12 },
          { country: "Germany", percentage: 8 },
          { country: "Others", percentage: 17 }
        ]
      },
      trafficSources: [
        { source: "YouTube Search", percentage: 35, views: 159876 },
        { source: "Suggested Videos", percentage: 28, views: 127901 },
        { source: "Direct/Subscriptions", percentage: 20, views: 91357 },
        { source: "External", percentage: 12, views: 54814 },
        { source: "Social Media", percentage: 5, views: 22841 }
      ]
    },
    performance: {
      ctr: 9.2,
      cpm: 4.56,
      rpm: 2.34,
      conversionRate: 3.8,
      viralityCoefficient: 1.67
    },
    tags: ["AI", "Art", "Tutorial", "Beginner", "Creative"],
    category: "Education",
    monetized: true,
    boosted: false
  },
  {
    id: "2", 
    type: "video",
    title: "Behind the Scenes: My Creative Process",
    thumbnail: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    metrics: {
      views: 234567,
      uniqueViews: 198432,
      impressions: 567890,
      reach: 345678,
      engagement: {
        likes: 18345,
        comments: 1234,
        shares: 2345,
        saves: 1567,
        rate: 12.8
      },
      retention: {
        averageViewDuration: 298,
        retentionRate: 72.1,
        dropOffPoints: [
          { time: 25, percentage: 12 },
          { time: 90, percentage: 28 },
          { time: 240, percentage: 48 }
        ]
      },
      revenue: {
        adRevenue: 145.30,
        tips: 234.56,
        subscriptions: 67.89,
        merchandise: 23.45,
        total: 471.20
      },
      demographics: {
        age: [
          { range: "18-24", percentage: 30 },
          { range: "25-34", percentage: 45 },
          { range: "35-44", percentage: 20 },
          { range: "45+", percentage: 5 }
        ],
        gender: [
          { type: "Female", percentage: 58 },
          { type: "Male", percentage: 40 },
          { type: "Other", percentage: 2 }
        ],
        location: [
          { country: "United States", percentage: 38 },
          { country: "United Kingdom", percentage: 22 },
          { country: "Canada", percentage: 15 },
          { country: "Australia", percentage: 10 },
          { country: "Others", percentage: 15 }
        ]
      },
      trafficSources: [
        { source: "Subscriptions", percentage: 42, views: 98518 },
        { source: "YouTube Search", percentage: 25, views: 58641 },
        { source: "Suggested Videos", percentage: 20, views: 46913 },
        { source: "Social Media", percentage: 8, views: 18765 },
        { source: "External", percentage: 5, views: 11730 }
      ]
    },
    performance: {
      ctr: 8.7,
      cpm: 3.89,
      rpm: 2.01,
      conversionRate: 4.2,
      viralityCoefficient: 1.34
    },
    tags: ["Behind the Scenes", "Creative", "Process", "Inspiration"],
    category: "Lifestyle",
    monetized: true,
    boosted: true
  }
];

const audienceInsights: AudienceInsight[] = [
  {
    metric: "Peak Activity Time",
    value: "8-10 PM EST",
    description: "Your audience is most active during evening hours",
    trend: "stable",
    impact: "high",
    actionable: true,
    recommendation: "Schedule content releases between 7-9 PM for maximum reach"
  },
  {
    metric: "Top Demographics",
    value: "25-34 years (42%)",
    description: "Young professionals make up the largest segment",
    trend: "up",
    impact: "high",
    actionable: true,
    recommendation: "Create content targeting career development and lifestyle"
  },
  {
    metric: "Geographic Focus",
    value: "North America (68%)",
    description: "Majority of viewers from US and Canada",
    trend: "up",
    impact: "medium",
    actionable: true,
    recommendation: "Consider time zones for live content and releases"
  },
  {
    metric: "Device Preference",
    value: "Mobile (78%)",
    description: "Most engagement happens on mobile devices",
    trend: "up",
    impact: "high",
    actionable: true,
    recommendation: "Optimize thumbnails and titles for mobile viewing"
  },
  {
    metric: "Content Preference",
    value: "Educational (65%)",
    description: "Tutorial and educational content performs best",
    trend: "up",
    impact: "high",
    actionable: true,
    recommendation: "Focus on educational content with clear learning outcomes"
  },
  {
    metric: "Average Session Duration",
    value: "12.4 minutes",
    description: "Users spend significant time consuming your content",
    trend: "up",
    impact: "medium",
    actionable: true,
    recommendation: "Create longer-form content to maximize engagement"
  },
  {
    metric: "Subscription Rate",
    value: "3.8%",
    description: "Good conversion from viewers to subscribers",
    trend: "stable",
    impact: "medium",
    actionable: true,
    recommendation: "Add stronger call-to-actions in videos to increase rate"
  },
  {
    metric: "Return Viewer Rate",
    value: "67%",
    description: "Strong audience loyalty and retention",
    trend: "up",
    impact: "high",
    actionable: false,
    recommendation: "Continue current content strategy to maintain loyalty"
  }
];

const revenueStreams: RevenueStream[] = [
  {
    source: "Video Ad Revenue",
    amount: 8750,
    percentage: 47,
    change: 18.3,
    growth: 23.5,
    projection: 11200,
    icon: <Video className="w-4 h-4" />,
    subStreams: [
      { name: "Pre-roll Ads", amount: 3500, percentage: 40 },
      { name: "Mid-roll Ads", amount: 2800, percentage: 32 },
      { name: "End Screens", amount: 1750, percentage: 20 },
      { name: "Overlay Ads", amount: 700, percentage: 8 }
    ]
  },
  {
    source: "Tips & Donations",
    amount: 4200,
    percentage: 23,
    change: 35.7,
    growth: 42.1,
    projection: 6100,
    icon: <Gift className="w-4 h-4" />,
    subStreams: [
      { name: "Super Chat", amount: 1680, percentage: 40 },
      { name: "Direct Tips", amount: 1260, percentage: 30 },
      { name: "Live Stream Gifts", amount: 840, percentage: 20 },
      { name: "Fan Funding", amount: 420, percentage: 10 }
    ]
  },
  {
    source: "Subscription Revenue",
    amount: 3590,
    percentage: 19,
    change: 12.7,
    growth: 15.4,
    projection: 4200,
    icon: <Users className="w-4 h-4" />,
    subStreams: [
      { name: "Tier 1 ($4.99)", amount: 1795, percentage: 50 },
      { name: "Tier 2 ($9.99)", amount: 1077, percentage: 30 },
      { name: "Tier 3 ($24.99)", amount: 718, percentage: 20 }
    ]
  },
  {
    source: "Brand Partnerships",
    amount: 1890,
    percentage: 10,
    change: 45.2,
    growth: 67.8,
    projection: 3200,
    icon: <Handshake className="w-4 h-4" />,
    subStreams: [
      { name: "Sponsored Videos", amount: 1323, percentage: 70 },
      { name: "Product Placements", amount: 378, percentage: 20 },
      { name: "Affiliate Commissions", amount: 189, percentage: 10 }
    ]
  },
  {
    source: "Merchandise Sales",
    amount: 110,
    percentage: 1,
    change: -5.3,
    growth: -2.1,
    projection: 105,
    icon: <Star className="w-4 h-4" />,
    subStreams: [
      { name: "T-shirts", amount: 55, percentage: 50 },
      { name: "Accessories", amount: 33, percentage: 30 },
      { name: "Digital Products", amount: 22, percentage: 20 }
    ]
  }
];

const predictiveInsights: PredictiveInsight[] = [
  {
    id: "1",
    type: "opportunity",
    title: "AI Content Trend Surge",
    description: "AI-related content is trending 340% this week. Your AI art tutorial performed exceptionally well. Consider creating a series.",
    confidence: 92,
    impact: "high",
    timeframe: "Next 2 weeks",
    actionable: true,
    actions: ["Create AI tutorial series", "Collaborate with AI tools", "Join AI-related conversations"],
    estimatedValue: 2500,
    category: "content"
  },
  {
    id: "2",
    type: "recommendation",
    title: "Optimal Publishing Schedule",
    description: "Based on audience analysis, posting at 7 PM EST on Wednesdays could increase engagement by 28%.",
    confidence: 87,
    impact: "medium",
    timeframe: "Immediate",
    actionable: true,
    actions: ["Schedule Wednesday releases", "Prepare content in advance", "Monitor engagement patterns"],
    estimatedValue: 350,
    category: "optimization"
  },
  {
    id: "3",
    type: "warning",
    title: "Content Saturation Risk",
    description: "Your niche is becoming saturated. Diversifying content topics could maintain growth trajectory.",
    confidence: 76,
    impact: "medium",
    timeframe: "Next month",
    actionable: true,
    actions: ["Research new topics", "Survey audience interests", "Test different content formats"],
    estimatedValue: -500,
    category: "growth"
  },
  {
    id: "4",
    type: "trend",
    title: "Mobile Engagement Growth",
    description: "Mobile viewership increased 45% this month. Optimizing for mobile could boost overall engagement.",
    confidence: 94,
    impact: "high",
    timeframe: "Ongoing",
    actionable: true,
    actions: ["Optimize thumbnails for mobile", "Create vertical content", "Test mobile-first strategies"],
    estimatedValue: 800,
    category: "audience"
  },
  {
    id: "5",
    type: "alert",
    title: "Revenue Plateau Warning",
    description: "Ad revenue growth is slowing. Diversifying income streams is recommended to maintain growth.",
    confidence: 83,
    impact: "high",
    timeframe: "Next 3 months",
    actionable: true,
    actions: ["Launch merchandise line", "Increase sponsored content", "Develop premium offerings"],
    estimatedValue: 1200,
    category: "monetization"
  }
];

const competitorData: CompetitorAnalysis[] = [
  {
    competitor: "TechCreator123",
    metrics: {
      followers: 234567,
      avgViews: 45678,
      engagementRate: 8.4,
      postFrequency: 3.2
    },
    comparison: {
      followers: "higher",
      engagement: "lower",
      content: "similar"
    }
  },
  {
    competitor: "ArtTutorialPro",
    metrics: {
      followers: 156789,
      avgViews: 67890,
      engagementRate: 12.1,
      postFrequency: 2.8
    },
    comparison: {
      followers: "lower",
      engagement: "similar",
      content: "higher"
    }
  }
];

const EnhancedCreatorDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [showInsights, setShowInsights] = useState(true);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

  const formatNumber = (num: number, format: string = "number"): string => {
    switch (format) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: num < 1 ? 4 : 0,
        }).format(num);
      case "percentage":
        return `${num.toFixed(1)}%`;
      case "duration":
        const minutes = Math.floor(num / 60);
        const seconds = num % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
      case "rate":
        return `${num.toFixed(2)}%`;
      default:
        if (num >= 1000000) {
          return (num / 1000000).toFixed(1) + "M";
        } else if (num >= 1000) {
          return (num / 1000).toFixed(1) + "K";
        }
        return num.toLocaleString();
    }
  };

  const getChangeIndicator = (change: number, type: string = "increase") => {
    const isPositive = change > 0;
    const isNegative = change < 0;

    return (
      <div
        className={cn(
          "flex items-center gap-1 text-sm font-medium",
          isPositive && "text-green-600 dark:text-green-400",
          isNegative && "text-red-600 dark:text-red-400",
          change === 0 && "text-gray-500 dark:text-gray-400",
        )}
      >
        {isPositive && <TrendingUp className="w-3 h-3" />}
        {isNegative && <TrendingDown className="w-3 h-3" />}
        {change === 0 && <Equal className="w-3 h-3" />}
        <span>{isPositive ? '+' : ''}{change.toFixed(1)}%</span>
      </div>
    );
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <Rocket className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case "alert":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "recommendation":
        return <Lightbulb className="w-5 h-5 text-blue-600" />;
      case "trend":
        return <TrendingUp className="w-5 h-5 text-purple-600" />;
      default:
        return <Brain className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Helmet>
        <title>Enhanced Creator Dashboard | Softchat</title>
        <meta
          name="description"
          content="Comprehensive analytics dashboard for content creators with detailed insights and predictions"
        />
      </Helmet>

      {/* Enhanced Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between py-4 lg:h-20 gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                    Enhanced Creator Studio
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Advanced analytics & insights platform
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 dark:from-purple-900 dark:to-blue-900 dark:text-purple-200 text-xs lg:text-sm"
                >
                  Pro Analytics
                </Badge>
                <Badge
                  variant="outline"
                  className="text-green-700 border-green-300 dark:text-green-400 dark:border-green-600 text-xs"
                >
                  Real-time
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-3 w-full lg:w-auto">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32 lg:w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 3 months</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setComparisonMode(!comparisonMode)}
                className={cn(
                  "hidden lg:flex",
                  comparisonMode && "bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300"
                )}
              >
                <AreaChart className="w-4 h-4 mr-2" />
                Compare
              </Button>

              <Button variant="outline" size="sm" className="hidden lg:flex">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>

              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2 lg:mr-2" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>

              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          {/* Enhanced Tab Navigation */}
          <div className="w-full overflow-x-auto">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 lg:w-auto min-w-fit gap-2 h-12 lg:h-auto p-1 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger
                value="overview"
                className="flex items-center gap-2 text-sm lg:text-base data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="content"
                className="flex items-center gap-2 text-sm lg:text-base data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Video className="w-4 h-4" />
                <span className="hidden sm:inline">Content</span>
              </TabsTrigger>
              <TabsTrigger
                value="audience"
                className="flex items-center gap-2 text-sm lg:text-base data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Audience</span>
              </TabsTrigger>
              <TabsTrigger
                value="revenue"
                className="flex items-center gap-2 text-sm lg:text-base data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <DollarSign className="w-4 h-4" />
                <span className="hidden sm:inline">Revenue</span>
              </TabsTrigger>
              <TabsTrigger
                value="insights"
                className="flex items-center gap-2 text-sm lg:text-base data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Brain className="w-4 h-4" />
                <span className="hidden sm:inline">AI Insights</span>
              </TabsTrigger>
              <TabsTrigger
                value="growth"
                className="flex items-center gap-2 text-sm lg:text-base data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Rocket className="w-4 h-4" />
                <span className="hidden sm:inline">Growth</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Enhanced Key Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {enhancedMetrics.slice(0, 8).map((metric, index) => (
                <Card
                  key={index}
                  className={cn(
                    "hover:shadow-lg transition-all duration-200 cursor-pointer border-0 shadow-md",
                    selectedMetric === metric.label && "ring-2 ring-blue-500 shadow-xl",
                    "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
                  )}
                  onClick={() => setSelectedMetric(selectedMetric === metric.label ? null : metric.label)}
                >
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {metric.label}
                          </p>
                          {metric.confidence && (
                            <Badge variant="outline" className="text-xs py-0">
                              {metric.confidence}%
                            </Badge>
                          )}
                        </div>
                        <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                          {formatNumber(metric.value, metric.format)}
                        </p>
                        {metric.goal && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Goal: {formatNumber(metric.goal, metric.format)}</span>
                              <span>{((metric.value / metric.goal) * 100).toFixed(0)}%</span>
                            </div>
                            <Progress 
                              value={(metric.value / metric.goal) * 100} 
                              className="h-1"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end">
                        {getChangeIndicator(metric.change, metric.changeType)}
                        {metric.trend && (
                          <div className="mt-2">
                            <div className="flex items-end gap-1 h-8">
                              {metric.trend.slice(-5).map((value, idx) => {
                                const height = ((value - Math.min(...metric.trend)) / 
                                  (Math.max(...metric.trend) - Math.min(...metric.trend))) * 100;
                                return (
                                  <div
                                    key={idx}
                                    className={cn(
                                      "w-1 rounded-t",
                                      idx === metric.trend.length - 1 ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                                    )}
                                    style={{ height: `${Math.max(height, 10)}%` }}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {metric.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {metric.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Insights Panel */}
            {showInsights && (
              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Quick Insights
                    <Badge variant="secondary" className="text-xs">
                      AI-Powered
                    </Badge>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowInsights(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {predictiveInsights.slice(0, 3).map((insight) => (
                      <div
                        key={insight.id}
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-3">
                          {getInsightIcon(insight.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm">{insight.title}</h4>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  insight.impact === "high" && "border-red-300 text-red-700 dark:border-red-600 dark:text-red-400",
                                  insight.impact === "medium" && "border-yellow-300 text-yellow-700 dark:border-yellow-600 dark:text-yellow-400",
                                  insight.impact === "low" && "border-green-300 text-green-700 dark:border-green-600 dark:text-green-400"
                                )}
                              >
                                {insight.impact}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                              {insight.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Progress value={insight.confidence} className="w-16 h-1" />
                                <span className="text-xs text-gray-500">{insight.confidence}%</span>
                              </div>
                              {insight.actionable && (
                                <Button size="sm" variant="outline" className="text-xs h-6 px-2">
                                  Act
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Top Content Performance */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Top Performing Content
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topContent.map((content, index) => (
                    <div
                      key={content.id}
                      className={cn(
                        "p-4 rounded-lg border transition-all duration-200 cursor-pointer",
                        selectedContent === content.id 
                          ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700" 
                          : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                      )}
                      onClick={() => setSelectedContent(selectedContent === content.id ? null : content.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-medium text-gray-500 w-8 text-center">
                          #{index + 1}
                        </div>
                        <img
                          src={content.thumbnail}
                          alt={content.title}
                          className="w-16 h-12 lg:w-20 lg:h-14 rounded object-cover shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-sm lg:text-base truncate">
                              {content.title}
                            </h4>
                            <div className="flex gap-1">
                              {content.monetized && (
                                <Badge variant="outline" className="text-xs">
                                  <DollarSign className="w-3 h-3 mr-1" />
                                  Monetized
                                </Badge>
                              )}
                              {content.boosted && (
                                <Badge variant="outline" className="text-xs">
                                  <Zap className="w-3 h-3 mr-1" />
                                  Boosted
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3 text-blue-500" />
                              <span className="font-medium">{formatNumber(content.metrics.views)}</span>
                              <span className="text-gray-500">views</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3 text-red-500" />
                              <span className="font-medium">{content.metrics.engagement.rate}%</span>
                              <span className="text-gray-500">engagement</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3 text-green-500" />
                              <span className="font-medium">{formatNumber(content.metrics.revenue.total, "currency")}</span>
                              <span className="text-gray-500">revenue</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-purple-500" />
                              <span className="font-medium">{formatDistanceToNow(content.publishedAt)}</span>
                              <span className="text-gray-500">ago</span>
                            </div>
                          </div>

                          {selectedContent === content.id && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
                                <div>
                                  <h5 className="font-medium mb-2">Performance Metrics</h5>
                                  <div className="space-y-1">
                                    <div className="flex justify-between">
                                      <span>CTR:</span>
                                      <span>{content.performance.ctr}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Retention:</span>
                                      <span>{content.metrics.retention.retentionRate}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>RPM:</span>
                                      <span>${content.performance.rpm}</span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h5 className="font-medium mb-2">Top Traffic Sources</h5>
                                  <div className="space-y-1">
                                    {content.metrics.trafficSources.slice(0, 3).map((source) => (
                                      <div key={source.source} className="flex justify-between">
                                        <span className="truncate">{source.source}:</span>
                                        <span>{source.percentage}%</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h5 className="font-medium mb-2">Revenue Breakdown</h5>
                                  <div className="space-y-1">
                                    <div className="flex justify-between">
                                      <span>Ads:</span>
                                      <span>{formatNumber(content.metrics.revenue.adRevenue, "currency")}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Tips:</span>
                                      <span>{formatNumber(content.metrics.revenue.tips, "currency")}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Subs:</span>
                                      <span>{formatNumber(content.metrics.revenue.subscriptions, "currency")}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Additional tabs would continue here with similar enhanced designs... */}
          
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedCreatorDashboard;
