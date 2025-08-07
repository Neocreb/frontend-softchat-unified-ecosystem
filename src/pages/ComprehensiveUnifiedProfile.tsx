import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWalletContext } from "@/contexts/WalletContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Settings,
  Calendar,
  MapPin,
  Globe,
  Users,
  Heart,
  MessageSquare,
  Star,
  TrendingUp,
  Award,
  Camera,
  Briefcase,
  Gift,
  Shield,
  Verified,
  Crown,
  Edit,
  Share2,
  MoreHorizontal,
  UserPlus,
  MessageCircle,
  Check,
  Eye,
  Clock,
  Store,
  Code,
  Coins,
  DollarSign,
  Video,
  BarChart3,
  Activity,
  Trophy,
  Zap,
  Play,
  Wallet,
  Bell,
  CreditCard,
  Send,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  ShoppingBag,
  Package,
  Truck,
  FileText,
  MonitorPlay,
  Users2,
  CalendarDays,
  Handshake,
  TrendingDown,
  CircleDollarSign,
  Percent,
  Target,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Filter,
  SortDesc,
  Grid3X3,
  List,
  Image as ImageIcon,
  PieChart,
  LineChart,
  MoreVertical,
  Copy,
  QrCode,
  RefreshCw,
  Download,
  Upload,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle,
  Info,
  Flame,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/types/user";
import { profileService } from "@/services/profileService";

interface ComprehensiveUnifiedProfileProps {
  username?: string;
}

const ComprehensiveUnifiedProfile: React.FC<ComprehensiveUnifiedProfileProps> = ({
  username: propUsername,
}) => {
  const { username: paramUsername } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { walletBalance, transactions, isLoading: walletLoading } = useWalletContext();
  const { toast } = useToast();

  const targetUsername = propUsername || paramUsername;
  const isOwnProfile = !targetUsername || (user && user.profile?.username === targetUsername);

  // State management
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [viewMode, setViewMode] = useState("grid");

  // Comprehensive platform data for truly unified profile
  const unifiedProfileData = {
    // Basic Profile
    displayName: "Alex Johnson",
    username: "alexjohnson",
    bio: "Full-stack developer, crypto trader, content creator, and digital entrepreneur. Building the future of decentralized platforms 🚀",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    banner: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    location: "San Francisco, CA",
    joinDate: "January 2020",
    verified: true,
    premium: true,
    onlineStatus: "active",
    
    // Unified Platform Stats
    unifiedStats: {
      totalEarnings: 24580.75,
      platformLevel: 12,
      trustScore: 9.7,
      totalViews: 145600,
      totalLikes: 8940,
      globalRank: 156,
      completedTransactions: 342,
      successRate: 98.5,
    },

    // Social Media Stats
    social: {
      followers: 12840,
      following: 892,
      posts: 234,
      stories: 45,
      engagement: 7.8,
      totalReach: 2450000,
    },

    // Marketplace Activity
    marketplace: {
      totalSales: 45600,
      products: 23,
      orders: 156,
      rating: 4.9,
      reviews: 89,
      revenue: 8420,
      topCategory: "Electronics",
      sellerBadge: "Pro Seller",
    },

    // Freelance Activity
    freelance: {
      completedProjects: 67,
      activeProjects: 4,
      clientRating: 4.8,
      hourlyRate: 85,
      totalEarned: 12340,
      skills: ["React", "Node.js", "Python", "AWS"],
      availability: "Available",
      responseTime: "2 hours",
    },

    // Crypto Trading
    crypto: {
      totalTrades: 1240,
      successRate: 78.5,
      portfolioValue: 15600,
      p2pRating: 4.9,
      tradingVolume: 89400,
      favoriteCoins: ["BTC", "ETH", "USDT"],
      verificationLevel: "Advanced",
    },

    // Video Content
    videos: {
      totalVideos: 89,
      views: 345600,
      subscribers: 5640,
      likes: 23400,
      avgViewDuration: "4:23",
      topVideo: "How to Build a DeFi App",
      monetized: true,
      revenue: 2340,
    },

    // Delivery Services
    delivery: {
      completedDeliveries: 234,
      rating: 4.7,
      earnings: 1890,
      zones: ["SF Bay Area", "Downtown"],
      vehicle: "Car",
      status: "Offline",
    },

    // Community Events
    events: {
      hosted: 12,
      attended: 45,
      upcoming: 3,
      totalAttendees: 567,
      avgRating: 4.6,
      categories: ["Tech", "Crypto", "Networking"],
    },

    // Recent Activity Feed (Unified across all features)
    recentActivity: [
      {
        id: 1,
        type: "marketplace",
        action: "Sold product",
        title: "iPhone 14 Pro",
        amount: 850,
        timestamp: "2 hours ago",
        icon: Store,
        color: "text-green-600",
        link: "/app/marketplace/orders",
      },
      {
        id: 2,
        type: "freelance",
        action: "Project completed",
        title: "React Native App Development",
        amount: 2400,
        timestamp: "5 hours ago",
        icon: Code,
        color: "text-blue-600",
        link: "/app/freelance/projects",
      },
      {
        id: 3,
        type: "crypto",
        action: "P2P trade successful",
        title: "Sold 0.5 BTC",
        amount: 15000,
        timestamp: "1 day ago",
        icon: Coins,
        color: "text-orange-600",
        link: "/app/crypto/trades",
      },
      {
        id: 4,
        type: "social",
        action: "Video went viral",
        title: "DeFi Tutorial",
        views: 12500,
        timestamp: "2 days ago",
        icon: Video,
        color: "text-purple-600",
        link: "/app/videos",
      },
      {
        id: 5,
        type: "delivery",
        action: "Delivery completed",
        title: "Downtown delivery",
        amount: 25,
        timestamp: "3 days ago",
        icon: Truck,
        color: "text-indigo-600",
        link: "/app/delivery",
      },
    ],

    // Platform Achievements
    achievements: [
      { title: "Crypto Master", description: "Completed 1000+ trades", icon: Coins, date: "2024", tier: "gold" },
      { title: "Pro Seller", description: "Earned $10k+ in sales", icon: Store, date: "2024", tier: "platinum" },
      { title: "Top Freelancer", description: "5.0 rating with 50+ projects", icon: Code, date: "2023", tier: "diamond" },
      { title: "Content Creator", description: "100k+ video views", icon: Video, date: "2023", tier: "gold" },
      { title: "Community Leader", description: "Hosted 10+ events", icon: Users, date: "2023", tier: "silver" },
      { title: "Delivery Pro", description: "200+ deliveries completed", icon: Truck, date: "2022", tier: "bronze" },
    ],

    // Cross-Platform Analytics
    analytics: {
      monthlyEarnings: [
        { month: "Jan", total: 2400, marketplace: 800, freelance: 1200, crypto: 300, videos: 100 },
        { month: "Feb", total: 3200, marketplace: 1100, freelance: 1500, crypto: 450, videos: 150 },
        { month: "Mar", total: 2800, marketplace: 900, freelance: 1300, crypto: 400, videos: 200 },
      ],
      topEarningFeatures: [
        { feature: "Freelance", amount: 8340, percentage: 45 },
        { feature: "Marketplace", amount: 6200, percentage: 34 },
        { feature: "Crypto Trading", amount: 2890, percentage: 16 },
        { feature: "Video Content", amount: 950, percentage: 5 },
      ],
    },
  };

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        // In a real app, load actual user data
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [targetUsername]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "message":
        navigate(`/app/chat?user=${targetUsername}`);
        break;
      case "send-money":
        navigate(`/app/wallet?action=send&recipient=${targetUsername}`);
        break;
      case "hire":
        navigate(`/app/freelance?hire=${targetUsername}`);
        break;
      case "buy":
        navigate(`/app/marketplace?seller=${targetUsername}`);
        break;
      case "trade":
        navigate(`/app/crypto?trader=${targetUsername}`);
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="w-full max-w-7xl mx-auto px-4 py-6">
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Skeleton className="h-96 w-full rounded-lg" />
              <Skeleton className="h-96 w-full rounded-lg lg:col-span-2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
        <div className="space-y-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {/* Enhanced Profile Header */}
          <Card className="overflow-hidden">
            <div className="relative">
              {/* Banner */}
              <div
                className="h-48 sm:h-64 lg:h-72 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 relative bg-cover bg-center"
                style={{ backgroundImage: `url(${unifiedProfileData.banner})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                
                {/* Online Status & Platform Level */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-green-500/90 text-white border-0">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2" />
                    {unifiedProfileData.onlineStatus}
                  </Badge>
                  <Badge className="bg-purple-500/90 text-white border-0">
                    <Crown className="w-3 h-3 mr-1" />
                    Level {unifiedProfileData.unifiedStats.platformLevel}
                  </Badge>
                </div>

                {/* Quick Actions Menu */}
                <div className="absolute top-4 right-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white border-white/20"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Quick Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={() => handleQuickAction("message")}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Send Message
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleQuickAction("send-money")}>
                        <Send className="h-4 w-4 mr-2" />
                        Send Money
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleQuickAction("hire")}>
                        <Code className="h-4 w-4 mr-2" />
                        Hire for Project
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleQuickAction("buy")}>
                        <Store className="h-4 w-4 mr-2" />
                        View Store
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleQuickAction("trade")}>
                        <Coins className="h-4 w-4 mr-2" />
                        Start P2P Trade
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Platform Stats Overlay */}
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-4 gap-2 text-white">
                  <div className="text-center backdrop-blur-sm bg-white/10 rounded-lg p-2">
                    <div className="text-lg font-bold">${unifiedProfileData.unifiedStats.totalEarnings.toLocaleString()}</div>
                    <div className="text-xs opacity-90">Total Earned</div>
                  </div>
                  <div className="text-center backdrop-blur-sm bg-white/10 rounded-lg p-2">
                    <div className="text-lg font-bold flex items-center justify-center gap-1">
                      <Shield className="h-4 w-4" />
                      {unifiedProfileData.unifiedStats.trustScore}
                    </div>
                    <div className="text-xs opacity-90">Trust Score</div>
                  </div>
                  <div className="text-center backdrop-blur-sm bg-white/10 rounded-lg p-2">
                    <div className="text-lg font-bold">#{unifiedProfileData.unifiedStats.globalRank}</div>
                    <div className="text-xs opacity-90">Global Rank</div>
                  </div>
                  <div className="text-center backdrop-blur-sm bg-white/10 rounded-lg p-2">
                    <div className="text-lg font-bold">{unifiedProfileData.unifiedStats.successRate}%</div>
                    <div className="text-xs opacity-90">Success Rate</div>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <CardContent className="relative pt-0 px-6">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between -mt-16 sm:-mt-20">
                  <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <Avatar className="h-32 w-32 sm:h-36 sm:w-36 lg:h-40 lg:w-40 border-4 border-white shadow-xl">
                        <AvatarImage
                          src={unifiedProfileData.avatar}
                          alt={unifiedProfileData.displayName}
                        />
                        <AvatarFallback className="text-2xl font-bold">
                          {unifiedProfileData.displayName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Trust Score Badge */}
                      <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full px-2 py-1 text-sm font-bold flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        {unifiedProfileData.unifiedStats.trustScore}
                      </div>
                    </div>

                    {/* Name and Platform Badges */}
                    <div className="flex-1 space-y-3 mt-4 sm:mt-0 sm:mb-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                          {unifiedProfileData.displayName}
                        </h1>
                        {unifiedProfileData.verified && (
                          <Verified className="h-6 w-6 text-blue-500 fill-current" />
                        )}
                        {unifiedProfileData.premium && (
                          <Crown className="h-6 w-6 text-purple-500 fill-current" />
                        )}
                      </div>

                      <p className="text-lg text-muted-foreground">@{unifiedProfileData.username}</p>

                      {/* Platform Activity Badges */}
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                          <Store className="h-3 w-3 mr-1" />
                          {unifiedProfileData.marketplace.sellerBadge}
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                          <Code className="h-3 w-3 mr-1" />
                          Top Freelancer
                        </Badge>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                          <Coins className="h-3 w-3 mr-1" />
                          Crypto Trader
                        </Badge>
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                          <Video className="h-3 w-3 mr-1" />
                          Content Creator
                        </Badge>
                      </div>

                      {/* Platform Stats Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-xl font-bold">{unifiedProfileData.social.followers.toLocaleString()}</div>
                          <div className="text-muted-foreground">Followers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold">{unifiedProfileData.unifiedStats.totalViews.toLocaleString()}</div>
                          <div className="text-muted-foreground">Total Views</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold">{unifiedProfileData.unifiedStats.completedTransactions}</div>
                          <div className="text-muted-foreground">Transactions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold">Level {unifiedProfileData.unifiedStats.platformLevel}</div>
                          <div className="text-muted-foreground">Platform Level</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-4 lg:mt-0">
                    {!isOwnProfile && (
                      <>
                        <Button onClick={() => setIsFollowing(!isFollowing)} size="sm">
                          {isFollowing ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Following
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Follow
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAction("message")}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </>
                    )}
                    {isOwnProfile && (
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-6">
                  <p className="text-base leading-relaxed">{unifiedProfileData.bio}</p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {unifiedProfileData.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {unifiedProfileData.joinDate}
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Unified Platform Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar - Platform Features & Recent Activity */}
            <div className="space-y-6">
              {/* Platform Features Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Platform Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Marketplace */}
                  <div 
                    className="p-3 rounded-lg bg-green-50 border border-green-200 cursor-pointer hover:bg-green-100 transition-colors"
                    onClick={() => navigate("/app/marketplace")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Store className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium">Marketplace</div>
                          <div className="text-sm text-muted-foreground">{unifiedProfileData.marketplace.products} products</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-700">${unifiedProfileData.marketplace.revenue}</div>
                        <div className="text-xs text-green-600">★ {unifiedProfileData.marketplace.rating}</div>
                      </div>
                    </div>
                  </div>

                  {/* Freelance */}
                  <div 
                    className="p-3 rounded-lg bg-blue-50 border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => navigate("/app/freelance")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Code className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium">Freelance</div>
                          <div className="text-sm text-muted-foreground">{unifiedProfileData.freelance.completedProjects} projects</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-700">${unifiedProfileData.freelance.totalEarned}</div>
                        <div className="text-xs text-blue-600">★ {unifiedProfileData.freelance.clientRating}</div>
                      </div>
                    </div>
                  </div>

                  {/* Crypto Trading */}
                  <div 
                    className="p-3 rounded-lg bg-orange-50 border border-orange-200 cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => navigate("/app/crypto")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Coins className="h-5 w-5 text-orange-600" />
                        <div>
                          <div className="font-medium">Crypto Trading</div>
                          <div className="text-sm text-muted-foreground">{unifiedProfileData.crypto.totalTrades} trades</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-orange-700">${unifiedProfileData.crypto.portfolioValue}</div>
                        <div className="text-xs text-orange-600">{unifiedProfileData.crypto.successRate}% success</div>
                      </div>
                    </div>
                  </div>

                  {/* Video Content */}
                  <div 
                    className="p-3 rounded-lg bg-purple-50 border border-purple-200 cursor-pointer hover:bg-purple-100 transition-colors"
                    onClick={() => navigate("/app/videos")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Video className="h-5 w-5 text-purple-600" />
                        <div>
                          <div className="font-medium">Video Content</div>
                          <div className="text-sm text-muted-foreground">{unifiedProfileData.videos.totalVideos} videos</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-purple-700">{unifiedProfileData.videos.views.toLocaleString()}</div>
                        <div className="text-xs text-purple-600">views</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {unifiedProfileData.recentActivity.map((activity) => (
                    <div 
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate(activity.link)}
                    >
                      <div className="p-2 rounded-full bg-gray-100">
                        <activity.icon className={cn("h-4 w-4", activity.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{activity.action}</div>
                        <div className="text-sm text-muted-foreground truncate">{activity.title}</div>
                        <div className="text-xs text-muted-foreground">{activity.timestamp}</div>
                      </div>
                      {activity.amount && (
                        <div className="text-right">
                          <div className="font-bold text-green-600">
                            {activity.type === "social" ? `${activity.views} views` : `$${activity.amount}`}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    <Activity className="h-4 w-4 mr-2" />
                    View All Activity
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Platform Navigation Tabs */}
              <Card>
                <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
                  <div className="border-b px-6">
                    <TabsList className="h-auto p-0 bg-transparent w-full justify-start gap-0">
                      <TabsTrigger
                        value="overview"
                        className="px-4 py-3 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 bg-transparent rounded-none"
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Overview
                      </TabsTrigger>
                      <TabsTrigger
                        value="earnings"
                        className="px-4 py-3 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 bg-transparent rounded-none"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Earnings
                      </TabsTrigger>
                      <TabsTrigger
                        value="content"
                        className="px-4 py-3 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 bg-transparent rounded-none"
                      >
                        <Grid3X3 className="h-4 w-4 mr-2" />
                        Content
                      </TabsTrigger>
                      <TabsTrigger
                        value="achievements"
                        className="px-4 py-3 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 bg-transparent rounded-none"
                      >
                        <Trophy className="h-4 w-4 mr-2" />
                        Achievements
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="p-6">
                    {/* Overview Tab */}
                    <TabsContent value="overview" className="mt-0 space-y-6">
                      {/* Earnings Overview Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                            <div className="text-2xl font-bold text-green-700">
                              ${unifiedProfileData.unifiedStats.totalEarnings.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">Total Earnings</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                            <div className="text-2xl font-bold text-blue-700">$3,240</div>
                            <div className="text-sm text-muted-foreground">This Month</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <Award className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                            <div className="text-2xl font-bold text-purple-700">
                              {unifiedProfileData.achievements.length}
                            </div>
                            <div className="text-sm text-muted-foreground">Achievements</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <Percent className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                            <div className="text-2xl font-bold text-orange-700">
                              {unifiedProfileData.unifiedStats.successRate}%
                            </div>
                            <div className="text-sm text-muted-foreground">Success Rate</div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Cross-Platform Performance Chart */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Platform Performance</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {unifiedProfileData.analytics.topEarningFeatures.map((feature, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <div className="font-medium">{feature.feature}</div>
                                    <div className="text-sm text-muted-foreground">${feature.amount.toLocaleString()}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Progress value={feature.percentage} className="w-20" />
                                  <span className="text-sm font-medium">{feature.percentage}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Earnings Tab */}
                    <TabsContent value="earnings" className="mt-0 space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <LineChart className="h-5 w-5" />
                            Earnings Analytics
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-12">
                            <PieChart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium mb-2">Detailed Earnings Analytics</h3>
                            <p className="text-muted-foreground mb-4">
                              View comprehensive earnings breakdown across all platform features
                            </p>
                            <Button onClick={() => navigate("/app/wallet")}>
                              <Wallet className="h-4 w-4 mr-2" />
                              Open Full Analytics
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Content Tab */}
                    <TabsContent value="content" className="mt-0 space-y-6">
                      <div className="text-center py-12">
                        <Grid3X3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Unified Content Gallery</h3>
                        <p className="text-muted-foreground mb-4">
                          All your content across social posts, videos, products, and projects
                        </p>
                        <div className="flex gap-2 justify-center">
                          <Button variant="outline" onClick={() => navigate("/app/feed")}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Posts
                          </Button>
                          <Button variant="outline" onClick={() => navigate("/app/videos")}>
                            <Video className="h-4 w-4 mr-2" />
                            Videos
                          </Button>
                          <Button variant="outline" onClick={() => navigate("/app/marketplace")}>
                            <Store className="h-4 w-4 mr-2" />
                            Products
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Achievements Tab */}
                    <TabsContent value="achievements" className="mt-0 space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {unifiedProfileData.achievements.map((achievement, index) => (
                          <Card 
                            key={index}
                            className={cn(
                              "relative overflow-hidden border-2",
                              achievement.tier === "diamond" && "border-purple-300 bg-gradient-to-br from-purple-50 to-indigo-50",
                              achievement.tier === "platinum" && "border-gray-300 bg-gradient-to-br from-gray-50 to-slate-50",
                              achievement.tier === "gold" && "border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50",
                              achievement.tier === "silver" && "border-gray-400 bg-gradient-to-br from-gray-100 to-gray-50",
                              achievement.tier === "bronze" && "border-orange-300 bg-gradient-to-br from-orange-50 to-yellow-50"
                            )}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className={cn(
                                  "p-3 rounded-full",
                                  achievement.tier === "diamond" && "bg-purple-100",
                                  achievement.tier === "platinum" && "bg-gray-100",
                                  achievement.tier === "gold" && "bg-yellow-100",
                                  achievement.tier === "silver" && "bg-gray-200",
                                  achievement.tier === "bronze" && "bg-orange-100"
                                )}>
                                  <achievement.icon className={cn(
                                    "h-6 w-6",
                                    achievement.tier === "diamond" && "text-purple-600",
                                    achievement.tier === "platinum" && "text-gray-600",
                                    achievement.tier === "gold" && "text-yellow-600",
                                    achievement.tier === "silver" && "text-gray-500",
                                    achievement.tier === "bronze" && "text-orange-600"
                                  )} />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{achievement.title}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {achievement.description}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Earned in {achievement.date}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                            {/* Tier Badge */}
                            <div className={cn(
                              "absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold",
                              achievement.tier === "diamond" && "bg-purple-500 text-white",
                              achievement.tier === "platinum" && "bg-gray-500 text-white",
                              achievement.tier === "gold" && "bg-yellow-500 text-white",
                              achievement.tier === "silver" && "bg-gray-400 text-white",
                              achievement.tier === "bronze" && "bg-orange-500 text-white"
                            )}>
                              {achievement.tier.toUpperCase()}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveUnifiedProfile;
