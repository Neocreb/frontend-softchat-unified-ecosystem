import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";
import {
  // Analytics & Charts
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  Target,
  Zap,
  
  // Platform Features
  House,
  Search,
  Video,
  ShoppingBag,
  Briefcase,
  Coins,
  Gift,
  Calendar,
  MessageSquare,
  Users,
  Building,
  Radio,
  Megaphone,
  Award,
  Star,
  
  // Actions
  Download,
  RefreshCw,
  Filter,
  Settings,
  Plus,
  ExternalLink,
  MoreHorizontal,
  Bell,
  Heart,
  Share2,
  Play,
  
  // UI Elements
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Grid3X3,
  List,
  
  // Money & Revenue
  DollarSign,
  CreditCard,
  Wallet,
  HandCoins,
  
  // Content & Media
  FileText,
  Image,
  Film,
  Mic,
  Camera,
  
  // Social
  ThumbsUp,
  MessageCircle,
  UserPlus,
  Crown,
  
  // Time & Date
  Clock,
  Calendar as CalendarIcon,
  Timer,
  
  // Status & Growth
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  
  // Navigation
  Menu,
  X,
  ChevronLeft,
  Home,
} from "lucide-react";

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  trend: "up" | "down" | "neutral";
  icon: React.ElementType;
  color: string;
  description?: string;
}

interface FeatureAnalytics {
  name: string;
  icon: React.ElementType;
  color: string;
  metrics: MetricCard[];
  growth: number;
  active: boolean;
}

const EnhancedCreatorDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for comprehensive analytics
  const platformFeatures: FeatureAnalytics[] = [
    {
      name: "Feed & Social",
      icon: House,
      color: "bg-blue-500",
      growth: 23.5,
      active: true,
      metrics: [
        { title: "Total Posts", value: "1,247", change: 18.2, trend: "up", icon: FileText, color: "text-blue-600" },
        { title: "Engagement Rate", value: "8.4%", change: 12.3, trend: "up", icon: Heart, color: "text-pink-600" },
        { title: "Followers", value: "45.2K", change: 15.7, trend: "up", icon: Users, color: "text-green-600" },
        { title: "Reach", value: "892K", change: 28.1, trend: "up", icon: Eye, color: "text-purple-600" },
      ]
    },
    {
      name: "Video Content",
      icon: Video,
      color: "bg-red-500",
      growth: 31.8,
      active: true,
      metrics: [
        { title: "Videos Created", value: "156", change: 22.4, trend: "up", icon: Film, color: "text-red-600" },
        { title: "Total Views", value: "2.1M", change: 35.2, trend: "up", icon: Play, color: "text-blue-600" },
        { title: "Watch Time", value: "45.2h", change: 18.9, trend: "up", icon: Clock, color: "text-green-600" },
        { title: "Avg Duration", value: "3:24", change: 8.1, trend: "up", icon: Timer, color: "text-orange-600" },
      ]
    },
    {
      name: "Marketplace",
      icon: ShoppingBag,
      color: "bg-green-500",
      growth: 45.2,
      active: true,
      metrics: [
        { title: "Products Sold", value: "389", change: 52.1, trend: "up", icon: ShoppingBag, color: "text-green-600" },
        { title: "Revenue", value: "$12,450", change: 38.7, trend: "up", icon: DollarSign, color: "text-emerald-600" },
        { title: "Conversion Rate", value: "3.2%", change: 15.4, trend: "up", icon: Target, color: "text-blue-600" },
        { title: "Avg Order Value", value: "$32", change: 8.9, trend: "up", icon: CreditCard, color: "text-purple-600" },
      ]
    },
    {
      name: "Freelance",
      icon: Briefcase,
      color: "bg-orange-500",
      growth: 28.9,
      active: true,
      metrics: [
        { title: "Projects Completed", value: "47", change: 31.2, trend: "up", icon: CheckCircle, color: "text-green-600" },
        { title: "Client Rating", value: "4.9", change: 2.1, trend: "up", icon: Star, color: "text-yellow-600" },
        { title: "Earnings", value: "$8,920", change: 25.3, trend: "up", icon: Wallet, color: "text-green-600" },
        { title: "Response Time", value: "2.1h", change: -12.4, trend: "down", icon: Clock, color: "text-blue-600" },
      ]
    },
    {
      name: "Crypto Trading",
      icon: Coins,
      color: "bg-yellow-500",
      growth: 18.7,
      active: true,
      metrics: [
        { title: "Portfolio Value", value: "$24,567", change: 22.8, trend: "up", icon: TrendingUp, color: "text-green-600" },
        { title: "Trading Volume", value: "$156K", change: 45.1, trend: "up", icon: BarChart3, color: "text-blue-600" },
        { title: "Win Rate", value: "72%", change: 8.3, trend: "up", icon: Target, color: "text-emerald-600" },
        { title: "P&L Today", value: "+$342", change: 0, trend: "up", icon: HandCoins, color: "text-green-600" },
      ]
    },
    {
      name: "Messages & Chat",
      icon: MessageSquare,
      color: "bg-purple-500",
      growth: 19.4,
      active: true,
      metrics: [
        { title: "Messages Sent", value: "2,341", change: 15.6, trend: "up", icon: MessageCircle, color: "text-blue-600" },
        { title: "Active Chats", value: "89", change: 12.8, trend: "up", icon: Users, color: "text-green-600" },
        { title: "Response Rate", value: "94%", change: 3.2, trend: "up", icon: CheckCircle, color: "text-emerald-600" },
        { title: "Avg Response", value: "5min", change: -8.1, trend: "down", icon: Timer, color: "text-orange-600" },
      ]
    },
    {
      name: "Live Streaming",
      icon: Radio,
      color: "bg-pink-500",
      growth: 67.3,
      active: true,
      metrics: [
        { title: "Live Sessions", value: "23", change: 83.2, trend: "up", icon: Radio, color: "text-pink-600" },
        { title: "Peak Viewers", value: "1,247", change: 45.7, trend: "up", icon: Eye, color: "text-blue-600" },
        { title: "Stream Time", value: "34.2h", change: 28.9, trend: "up", icon: Clock, color: "text-green-600" },
        { title: "Super Chats", value: "$445", change: 92.1, trend: "up", icon: Gift, color: "text-yellow-600" },
      ]
    },
    {
      name: "Events & Calendar",
      icon: Calendar,
      color: "bg-indigo-500",
      growth: 34.6,
      active: true,
      metrics: [
        { title: "Events Created", value: "12", change: 50.0, trend: "up", icon: CalendarIcon, color: "text-indigo-600" },
        { title: "Attendees", value: "2,134", change: 42.3, trend: "up", icon: Users, color: "text-blue-600" },
        { title: "Event Revenue", value: "$3,240", change: 67.8, trend: "up", icon: DollarSign, color: "text-green-600" },
        { title: "Avg Rating", value: "4.7", change: 8.7, trend: "up", icon: Star, color: "text-yellow-600" },
      ]
    },
  ];

  const quickActions = [
    { name: "Create Post", icon: Plus, color: "bg-blue-500", href: "/feed" },
    { name: "New Video", icon: Video, color: "bg-red-500", href: "/videos" },
    { name: "List Product", icon: ShoppingBag, color: "bg-green-500", href: "/marketplace" },
    { name: "Find Job", icon: Briefcase, color: "bg-orange-500", href: "/freelance" },
    { name: "Trade Crypto", icon: Coins, color: "bg-yellow-500", href: "/crypto" },
    { name: "Go Live", icon: Radio, color: "bg-pink-500", href: "/live" },
    { name: "Create Event", icon: Calendar, color: "bg-indigo-500", href: "/events" },
    { name: "Start Chat", icon: MessageSquare, color: "bg-purple-500", href: "/chat" },
  ];

  const recentActivities = [
    { type: "video", content: "Your video 'How to Trade Crypto' reached 10K views", time: "2 hours ago", icon: Video, color: "text-red-500" },
    { type: "marketplace", content: "Product 'Digital Art Collection' sold for $89", time: "4 hours ago", icon: ShoppingBag, color: "text-green-500" },
    { type: "freelance", content: "New project proposal received from TechCorp", time: "6 hours ago", icon: Briefcase, color: "text-orange-500" },
    { type: "social", content: "Your post received 500+ likes and 50 comments", time: "8 hours ago", icon: Heart, color: "text-pink-500" },
    { type: "crypto", content: "Portfolio gained $234 from BTC trade", time: "12 hours ago", icon: TrendingUp, color: "text-green-500" },
  ];

  const topPerformingContent = [
    {
      id: 1,
      title: "Crypto Trading Tutorial",
      type: "Video",
      views: "45.2K",
      engagement: "12.4%",
      revenue: "$234",
      description: "Complete beginner's guide to cryptocurrency trading with practical examples",
      duration: "15:32",
      likes: "3.2K",
      comments: "567",
      shares: "234",
      publishDate: "2024-01-15",
      platform: "Video Content",
      thumbnail: "/api/placeholder/300/200",
      analytics: {
        watchTime: "92%",
        clickThrough: "8.5%",
        retention: "78%",
        topCountries: ["US", "UK", "Canada"],
        ageGroups: { "18-24": 35, "25-34": 40, "35-44": 20, "45+": 5 },
        trafficSources: { "Search": 45, "Direct": 30, "Social": 25 }
      }
    },
    {
      id: 2,
      title: "Digital Art Masterpiece",
      type: "Product",
      views: "23.1K",
      engagement: "8.7%",
      revenue: "$450",
      description: "Exclusive NFT collection featuring abstract digital artwork",
      price: "$45",
      sales: 10,
      rating: 4.9,
      reviews: 23,
      publishDate: "2024-01-10",
      platform: "Marketplace",
      thumbnail: "/api/placeholder/300/200",
      analytics: {
        conversionRate: "3.2%",
        cartAdds: "156",
        wishlistAdds: "89",
        topBuyers: ["Premium Users", "Art Collectors"],
        salesTrend: [5, 8, 12, 10, 15, 18, 10],
        refundRate: "2%"
      }
    },
    {
      id: 3,
      title: "Web Development Guide",
      type: "Post",
      views: "18.9K",
      engagement: "15.2%",
      revenue: "$89",
      description: "Step-by-step tutorial for building responsive websites with modern frameworks",
      readTime: "8 min",
      likes: "2.8K",
      comments: "412",
      shares: "189",
      publishDate: "2024-01-12",
      platform: "Feed & Social",
      thumbnail: "/api/placeholder/300/200",
      analytics: {
        avgReadTime: "6:32",
        bounceRate: "25%",
        shares: "189",
        saves: "456",
        demographics: { "Male": 65, "Female": 35 },
        topReferrers: ["Google", "Twitter", "LinkedIn"]
      }
    },
    {
      id: 4,
      title: "Live Q&A Session",
      type: "Stream",
      views: "12.7K",
      engagement: "23.1%",
      revenue: "$156",
      description: "Interactive live session answering community questions about freelancing",
      duration: "2:45:00",
      peakViewers: "1,247",
      totalMessages: "8,934",
      superChats: "$156",
      publishDate: "2024-01-18",
      platform: "Live Streaming",
      thumbnail: "/api/placeholder/300/200",
      analytics: {
        avgViewDuration: "45 min",
        chatEngagement: "78%",
        donations: "$89",
        newFollowers: "234",
        repeatViewers: "45%",
        peakTime: "8:30 PM"
      }
    },
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatCurrency = (amount: string | number): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]/g, '')) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(numAmount);
  };

  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case "down":
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      default:
        return <Activity className="w-3 h-3 text-gray-500" />;
    }
  };

  const filteredFeatures = platformFeatures.filter(feature =>
    feature.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedFeatures.length === 0 || selectedFeatures.includes(feature.name))
  );

  const totalRevenue = platformFeatures.reduce((sum, feature) => {
    const revenueMetric = feature.metrics.find(m => m.title.includes("Revenue") || m.title.includes("Earnings"));
    if (revenueMetric && typeof revenueMetric.value === 'string') {
      return sum + parseFloat(revenueMetric.value.replace(/[^0-9.-]/g, ''));
    }
    return sum;
  }, 0);

  const totalGrowth = platformFeatures.reduce((sum, feature) => sum + feature.growth, 0) / platformFeatures.length;

  // Detailed Feature Analytics Component
  const FeatureDetailPage = ({ featureName }: { featureName: string }) => {
    const feature = platformFeatures.find(f => f.name === featureName);
    if (!feature) return null;

    const Icon = feature.icon;

    // Generate additional detailed metrics for the subpage
    const detailedMetrics = {
      "Feed & Social": [
        { category: "Content Performance", metrics: [
          { name: "Total Posts", value: "1,247", change: "+18.2%", trend: "up", description: "Posts published this period" },
          { name: "Viral Posts", value: "23", change: "+45.7%", trend: "up", description: "Posts with >10K engagement" },
          { name: "Average Likes", value: "892", change: "+12.3%", trend: "up", description: "Per post engagement" },
          { name: "Comment Rate", value: "4.2%", change: "+8.9%", trend: "up", description: "Comments per view" },
        ]},
        { category: "Audience Growth", metrics: [
          { name: "New Followers", value: "2,341", change: "+25.4%", trend: "up", description: "This month" },
          { name: "Follower Growth Rate", value: "15.7%", change: "+3.2%", trend: "up", description: "Monthly growth" },
          { name: "Audience Retention", value: "87.3%", change: "+2.1%", trend: "up", description: "Active followers" },
          { name: "Demographics Score", value: "92/100", change: "+5.0%", trend: "up", description: "Target audience match" },
        ]},
        { category: "Engagement Analytics", metrics: [
          { name: "Engagement Rate", value: "8.4%", change: "+12.3%", trend: "up", description: "Overall engagement" },
          { name: "Share Rate", value: "2.1%", change: "+18.7%", trend: "up", description: "Shares per post" },
          { name: "Save Rate", value: "3.8%", change: "+22.1%", trend: "up", description: "Saves per post" },
          { name: "Story Views", value: "45.2K", change: "+31.4%", trend: "up", description: "Story impressions" },
        ]},
      ],
      "Video Content": [
        { category: "Video Performance", metrics: [
          { name: "Total Videos", value: "156", change: "+22.4%", trend: "up", description: "Videos created" },
          { name: "Total Views", value: "2.1M", change: "+35.2%", trend: "up", description: "All-time views" },
          { name: "Avg View Duration", value: "3:24", change: "+8.1%", trend: "up", description: "Average watch time" },
          { name: "Completion Rate", value: "68.7%", change: "+12.5%", trend: "up", description: "Videos watched to end" },
        ]},
        { category: "Monetization", metrics: [
          { name: "Ad Revenue", value: "$2,340", change: "+45.8%", trend: "up", description: "From video ads" },
          { name: "Sponsorship Deals", value: "12", change: "+200%", trend: "up", description: "Brand partnerships" },
          { name: "Tips Received", value: "$567", change: "+78.9%", trend: "up", description: "Viewer tips" },
          { name: "RPM", value: "$1.12", change: "+23.4%", trend: "up", description: "Revenue per mile" },
        ]},
        { category: "Audience Insights", metrics: [
          { name: "Subscribers", value: "89.2K", change: "+28.7%", trend: "up", description: "Video subscribers" },
          { name: "Notification Rate", value: "23.4%", change: "+5.6%", trend: "up", description: "Bell icon clicks" },
          { name: "Repeat Viewers", value: "45.8%", change: "+18.2%", trend: "up", description: "Return audience" },
          { name: "Peak Concurrent", value: "1,847", change: "+67.3%", trend: "up", description: "Live stream peak" },
        ]},
      ],
      "Marketplace": [
        { category: "Sales Performance", metrics: [
          { name: "Products Sold", value: "389", change: "+52.1%", trend: "up", description: "Units sold this period" },
          { name: "Total Revenue", value: "$12,450", change: "+38.7%", trend: "up", description: "Gross sales revenue" },
          { name: "Conversion Rate", value: "3.2%", change: "+15.4%", trend: "up", description: "Visitors to buyers" },
          { name: "Avg Order Value", value: "$32", change: "+8.9%", trend: "up", description: "Per transaction" },
        ]},
        { category: "Product Analytics", metrics: [
          { name: "Active Listings", value: "47", change: "+12.8%", trend: "up", description: "Live products" },
          { name: "Product Views", value: "45.2K", change: "+28.4%", trend: "up", description: "Product page visits" },
          { name: "Wishlist Adds", value: "1,234", change: "+67.8%", trend: "up", description: "Items saved" },
          { name: "Cart Abandonment", value: "23.4%", change: "-8.9%", trend: "down", description: "Checkout dropoff" },
        ]},
        { category: "Customer Metrics", metrics: [
          { name: "New Customers", value: "156", change: "+34.5%", trend: "up", description: "First-time buyers" },
          { name: "Repeat Customers", value: "89", change: "+45.2%", trend: "up", description: "Return buyers" },
          { name: "Customer Rating", value: "4.8/5", change: "+2.1%", trend: "up", description: "Average rating" },
          { name: "Return Rate", value: "2.1%", change: "-12.3%", trend: "down", description: "Product returns" },
        ]},
      ],
      "Freelance": [
        { category: "Project Performance", metrics: [
          { name: "Projects Completed", value: "47", change: "+31.2%", trend: "up", description: "Finished projects" },
          { name: "Active Projects", value: "8", change: "+60.0%", trend: "up", description: "In progress" },
          { name: "Project Success Rate", value: "95.7%", change: "+3.2%", trend: "up", description: "Successful completion" },
          { name: "Avg Project Value", value: "$890", change: "+25.3%", trend: "up", description: "Per project earning" },
        ]},
        { category: "Client Relations", metrics: [
          { name: "Client Rating", value: "4.9/5", change: "+2.1%", trend: "up", description: "Average client rating" },
          { name: "Repeat Clients", value: "67%", change: "+15.4%", trend: "up", description: "Return customers" },
          { name: "Response Time", value: "2.1h", change: "-12.4%", trend: "down", description: "Avg response time" },
          { name: "Communication Score", value: "98/100", change: "+5.2%", trend: "up", description: "Client feedback" },
        ]},
        { category: "Skills & Growth", metrics: [
          { name: "Skill Endorsements", value: "234", change: "+45.8%", trend: "up", description: "LinkedIn endorsements" },
          { name: "Portfolio Views", value: "2,340", change: "+67.2%", trend: "up", description: "Profile visits" },
          { name: "Proposal Win Rate", value: "23.4%", change: "+8.9%", trend: "up", description: "Proposals accepted" },
          { name: "Hourly Rate", value: "$45", change: "+12.5%", trend: "up", description: "Current rate" },
        ]},
      ],
      "Crypto Trading": [
        { category: "Portfolio Performance", metrics: [
          { name: "Portfolio Value", value: "$24,567", change: "+22.8%", trend: "up", description: "Total portfolio worth" },
          { name: "Total P&L", value: "+$3,456", change: "+145%", trend: "up", description: "Profit/Loss this period" },
          { name: "Best Performing", value: "ETH +45%", change: "+45.2%", trend: "up", description: "Top asset gain" },
          { name: "Portfolio Diversity", value: "12 assets", change: "+20.0%", trend: "up", description: "Different cryptocurrencies" },
        ]},
        { category: "Trading Analytics", metrics: [
          { name: "Total Trades", value: "234", change: "+56.7%", trend: "up", description: "Executed trades" },
          { name: "Win Rate", value: "72%", change: "+8.3%", trend: "up", description: "Profitable trades" },
          { name: "Avg Profit", value: "$156", change: "+23.4%", trend: "up", description: "Per winning trade" },
          { name: "Trading Volume", value: "$156K", change: "+45.1%", trend: "up", description: "Total volume traded" },
        ]},
        { category: "Risk Management", metrics: [
          { name: "Risk Score", value: "Medium", change: "Stable", trend: "neutral", description: "Portfolio risk level" },
          { name: "Stop Loss Hit", value: "15%", change: "-5.2%", trend: "down", description: "Stop losses triggered" },
          { name: "Max Drawdown", value: "8.4%", change: "-12.1%", trend: "down", description: "Largest portfolio drop" },
          { name: "Sharpe Ratio", value: "1.89", change: "+15.6%", trend: "up", description: "Risk-adjusted return" },
        ]},
      ],
      "Messages & Chat": [
        { category: "Communication Stats", metrics: [
          { name: "Messages Sent", value: "2,341", change: "+15.6%", trend: "up", description: "Total messages sent" },
          { name: "Messages Received", value: "3,456", change: "+23.4%", trend: "up", description: "Incoming messages" },
          { name: "Active Chats", value: "89", change: "+12.8%", trend: "up", description: "Ongoing conversations" },
          { name: "Group Chats", value: "23", change: "+35.7%", trend: "up", description: "Group conversations" },
        ]},
        { category: "Response Metrics", metrics: [
          { name: "Response Rate", value: "94%", change: "+3.2%", trend: "up", description: "Messages responded to" },
          { name: "Avg Response Time", value: "5min", change: "-8.1%", trend: "down", description: "Time to respond" },
          { name: "Peak Hours", value: "2-6 PM", change: "Stable", trend: "neutral", description: "Most active time" },
          { name: "Read Rate", value: "98.7%", change: "+1.4%", trend: "up", description: "Messages read" },
        ]},
        { category: "Engagement Quality", metrics: [
          { name: "Video Calls", value: "67", change: "+89.3%", trend: "up", description: "Video calls made" },
          { name: "Voice Messages", value: "234", change: "+45.2%", trend: "up", description: "Voice notes sent" },
          { name: "Media Shared", value: "456", change: "+67.8%", trend: "up", description: "Photos/videos shared" },
          { name: "Reaction Rate", value: "78%", change: "+12.5%", trend: "up", description: "Messages with reactions" },
        ]},
      ],
      "Live Streaming": [
        { category: "Stream Performance", metrics: [
          { name: "Live Sessions", value: "23", change: "+83.2%", trend: "up", description: "Streams this period" },
          { name: "Total Stream Time", value: "34.2h", change: "+28.9%", trend: "up", description: "Hours streamed" },
          { name: "Peak Viewers", value: "1,247", change: "+45.7%", trend: "up", description: "Highest concurrent viewers" },
          { name: "Avg Stream Duration", value: "1.5h", change: "+12.3%", trend: "up", description: "Average stream length" },
        ]},
        { category: "Monetization", metrics: [
          { name: "Super Chats", value: "$445", change: "+92.1%", trend: "up", description: "Paid chat messages" },
          { name: "Donations", value: "$234", change: "+156%", trend: "up", description: "Direct donations" },
          { name: "Subscriber Revenue", value: "$567", change: "+78.4%", trend: "up", description: "From subscriptions" },
          { name: "Sponsorship Revenue", value: "$890", change: "+234%", trend: "up", description: "Brand partnerships" },
        ]},
        { category: "Audience Engagement", metrics: [
          { name: "Chat Messages", value: "12.3K", change: "+67.8%", trend: "up", description: "Chat interactions" },
          { name: "New Followers", value: "567", change: "+89.2%", trend: "up", description: "From live streams" },
          { name: "Stream Saves", value: "89", change: "+45.6%", trend: "up", description: "Streams saved by viewers" },
          { name: "Clip Creation", value: "34", change: "+123%", trend: "up", description: "Viewer-created clips" },
        ]},
      ],
      "Events & Calendar": [
        { category: "Event Performance", metrics: [
          { name: "Events Created", value: "12", change: "+50.0%", trend: "up", description: "Events organized" },
          { name: "Total Attendees", value: "2,134", change: "+42.3%", trend: "up", description: "Across all events" },
          { name: "Avg Attendance Rate", value: "78.5%", change: "+12.4%", trend: "up", description: "RSVP vs actual" },
          { name: "Event Completion", value: "91.7%", change: "+8.3%", trend: "up", description: "Successfully completed" },
        ]},
        { category: "Revenue & Monetization", metrics: [
          { name: "Event Revenue", value: "$3,240", change: "+67.8%", trend: "up", description: "Ticket sales" },
          { name: "Avg Ticket Price", value: "$27", change: "+12.5%", trend: "up", description: "Per ticket" },
          { name: "Premium Tickets", value: "234", change: "+89.7%", trend: "up", description: "VIP/Premium sales" },
          { name: "Merchandise Sales", value: "$567", change: "+123%", trend: "up", description: "Event merchandise" },
        ]},
        { category: "Engagement & Feedback", metrics: [
          { name: "Event Rating", value: "4.7/5", change: "+8.7%", trend: "up", description: "Average rating" },
          { name: "Repeat Attendees", value: "45%", change: "+23.4%", trend: "up", description: "Return participants" },
          { name: "Social Shares", value: "567", change: "+78.9%", trend: "up", description: "Event shares" },
          { name: "Follow-up Engagement", value: "67%", change: "+34.2%", trend: "up", description: "Post-event interaction" },
        ]},
      ],
    };

    const currentDetailedMetrics = detailedMetrics[featureName as keyof typeof detailedMetrics] || [];

    return (
      <div className="space-y-6">
        {/* Feature Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedFeature(null)}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Overview
          </Button>
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", feature.color)}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{featureName} Analytics</h2>
              <p className="text-gray-600 dark:text-gray-400">Detailed performance metrics and insights</p>
            </div>
          </div>
        </div>

        {/* Quick Stats for this feature */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {feature.metrics.map((metric, index) => {
            const MetricIcon = metric.icon;
            return (
              <Card key={index} className="bg-gradient-to-r from-gray-50 to-white border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <MetricIcon className={cn("w-6 h-6", metric.color)} />
                    <div className="flex items-center gap-1 text-sm">
                      {getTrendIcon(metric.trend)}
                      <span className={cn(
                        "font-medium",
                        metric.trend === "up" ? "text-green-600" :
                        metric.trend === "down" ? "text-red-600" : "text-gray-600"
                      )}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{metric.title}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed Analytics Categories */}
        <div className="space-y-6">
          {currentDetailedMetrics.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="text-lg">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {category.metrics.map((metric, metricIndex) => (
                    <div key={metricIndex} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{metric.name}</h4>
                        <span className={cn(
                          "text-sm font-medium",
                          metric.trend === "up" ? "text-green-600" :
                          metric.trend === "down" ? "text-red-600" : "text-gray-600"
                        )}>
                          {metric.change}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {metric.value}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {metric.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Open {featureName}
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configure
          </Button>
        </div>
      </div>
    );
  };

  // Content Detail Component
  const ContentDetailView = ({ content }: { content: any }) => {
    const getContentIcon = (type: string) => {
      switch (type) {
        case "Video": return Video;
        case "Product": return ShoppingBag;
        case "Post": return FileText;
        case "Stream": return Radio;
        default: return FileText;
      }
    };

    const ContentIcon = getContentIcon(content.type);

    return (
      <div className="space-y-6">
        {/* Content Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedContent(null)}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Overview
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <ContentIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{content.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{content.type}</Badge>
                <Badge variant="outline">{content.platform}</Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Published on {new Date(content.publishDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Content Media */}
            <Card>
              <CardContent className="p-6">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                  <ContentIcon className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{content.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{content.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  {content.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {content.duration}
                    </span>
                  )}
                  {content.readTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {content.readTime}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {content.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {content.likes || content.sales} {content.type === "Product" ? "sales" : "likes"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{content.views}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Views</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{content.engagement}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Engagement</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{content.revenue}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Revenue</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {content.type === "Product" ? content.rating + "/5" :
                       content.type === "Stream" ? content.peakViewers : content.shares}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {content.type === "Product" ? "Rating" :
                       content.type === "Stream" ? "Peak" : "Shares"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {content.analytics && Object.entries(content.analytics).map(([key, value], index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-lg font-bold">
                        {Array.isArray(value) ? value.join(", ") :
                         typeof value === "object" ? JSON.stringify(value) : value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Original
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Content
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Content
                </Button>
              </CardContent>
            </Card>

            {/* Content Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Published</span>
                  <span className="font-medium">{new Date(content.publishDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Platform</span>
                  <span className="font-medium">{content.platform}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Content Type</span>
                  <span className="font-medium">{content.type}</span>
                </div>
                {content.comments && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Comments</span>
                    <span className="font-medium">{content.comments}</span>
                  </div>
                )}
                {content.reviews && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Reviews</span>
                    <span className="font-medium">{content.reviews}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Performance Score */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">A+</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Excellent performance compared to similar content
                  </p>
                  <Progress value={92} className="h-2" />
                  <p className="text-xs text-gray-500 mt-2">92/100 score</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Unified Creator Studio - Analytics Dashboard | SoftChat</title>
        <meta
          name="description"
          content="Comprehensive analytics dashboard for all platform features - social media, videos, marketplace, freelance, crypto, and more"
        />
      </Helmet>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between py-4 gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                    Unified Creator Studio
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Complete analytics across all platform features
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Pro Analytics
              </Badge>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="flex-1 lg:flex-none lg:w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search features..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 3 months</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-1 border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>

              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Total Revenue</p>
                    <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalRevenue)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-green-600">+{totalGrowth.toFixed(1)}%</span>
                  <span className="text-gray-600 ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Active Features</p>
                    <p className="text-2xl font-bold text-green-900">{platformFeatures.filter(f => f.active).length}</p>
                  </div>
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-green-600">All systems operational</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Avg Growth</p>
                    <p className="text-2xl font-bold text-purple-900">{totalGrowth.toFixed(1)}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight className="w-3 h-3 text-purple-500 mr-1" />
                  <span className="text-purple-600">Across all features</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700">Performance</p>
                    <p className="text-2xl font-bold text-orange-900">Excellent</p>
                  </div>
                  <Target className="w-8 h-8 text-orange-600" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <Star className="w-3 h-3 text-orange-500 mr-1" />
                  <span className="text-orange-600">Above benchmarks</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedFeature ? (
          <FeatureDetailPage featureName={selectedFeature} />
        ) : (
        <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
          <div className="w-full overflow-x-auto pb-2">
            <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground min-w-fit">
              <TabsTrigger value="overview" className="flex items-center gap-2 whitespace-nowrap px-3">
                <Eye className="w-4 h-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center gap-2 whitespace-nowrap px-3">
                <Layers className="w-4 h-4" />
                <span>Features</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2 whitespace-nowrap px-3">
                <FileText className="w-4 h-4" />
                <span>Content</span>
              </TabsTrigger>
              <TabsTrigger value="revenue" className="flex items-center gap-2 whitespace-nowrap px-3">
                <DollarSign className="w-4 h-4" />
                <span>Revenue</span>
              </TabsTrigger>
              <TabsTrigger value="audience" className="flex items-center gap-2 whitespace-nowrap px-3">
                <Users className="w-4 h-4" />
                <span>Audience</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2 whitespace-nowrap px-3">
                <BarChart3 className="w-4 h-4" />
                <span>Insights</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Jump to any platform feature to create content or manage your presence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all duration-200"
                        onClick={() => window.open(action.href, '_blank')}
                      >
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", action.color)}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs font-medium text-center">{action.name}</span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Platform Features Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Platform Analytics</h2>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredFeatures.length} of {platformFeatures.length} features
                  </span>
                </div>
              </div>

              <div className={cn(
                "grid gap-6",
                viewMode === "grid" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
              )}>
                {filteredFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-all duration-200 group cursor-pointer" onClick={() => setSelectedFeature(feature.name)}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", feature.color)}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{feature.name}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={feature.active ? "default" : "secondary"} className="text-xs">
                                  {feature.active ? "Active" : "Inactive"}
                                </Badge>
                                <div className="flex items-center gap-1 text-sm">
                                  <TrendingUp className="w-3 h-3 text-green-500" />
                                  <span className="text-green-600">+{feature.growth}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          {feature.metrics.map((metric, metricIndex) => {
                            const MetricIcon = metric.icon;
                            return (
                              <div key={metricIndex} className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <MetricIcon className={cn("w-4 h-4", metric.color)} />
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {metric.title}
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                                    {typeof metric.value === 'string' && metric.value.includes('$') 
                                      ? metric.value 
                                      : metric.value
                                    }
                                  </div>
                                  <div className="flex items-center gap-1 text-sm">
                                    {getTrendIcon(metric.trend)}
                                    <span className={cn(
                                      "font-medium",
                                      metric.trend === "up" ? "text-green-600" : 
                                      metric.trend === "down" ? "text-red-600" : "text-gray-600"
                                    )}>
                                      {metric.change > 0 ? '+' : ''}{metric.change}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => {
                      const Icon = activity.icon;
                      return (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <div className="flex-shrink-0">
                            <Icon className={cn("w-5 h-5", activity.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {activity.content}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    Top Performing Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPerformingContent.map((content, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {content.title}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {content.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {content.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {content.engagement}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              {content.revenue}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platformFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-all duration-200">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", feature.color)}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{feature.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={feature.active ? "default" : "secondary"} className="text-xs">
                              {feature.active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Growth Rate</span>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-green-600 font-medium">+{feature.growth}%</span>
                          </div>
                        </div>
                        <Progress value={feature.growth} className="h-2" />
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            View Details
                          </Button>
                          <Button size="sm" className="flex-1">
                            Manage
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Content Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Detailed content performance metrics across all platforms
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Analyze Content
              </Button>
            </div>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Revenue Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Comprehensive revenue tracking and forecasting
              </p>
              <Button>
                <BarChart3 className="w-4 h-4 mr-2" />
                View Revenue Dashboard
              </Button>
            </div>
          </TabsContent>

          {/* Audience Tab */}
          <TabsContent value="audience" className="space-y-6">
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Audience Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Deep insights into your audience across all platforms
              </p>
              <Button>
                <Eye className="w-4 h-4 mr-2" />
                Analyze Audience
              </Button>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">AI-Powered Insights</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Smart recommendations and predictive analytics
              </p>
              <Button>
                <Target className="w-4 h-4 mr-2" />
                Get Insights
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        )}
      </div>
    </div>
  );
};

export default EnhancedCreatorDashboard;
