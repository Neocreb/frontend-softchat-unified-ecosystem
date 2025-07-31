import React, { useState, useEffect, useCallback } from "react";
import {
  DollarSign,
  TrendingUp,
  Users,
  Eye,
  Heart,
  Gift,
  Crown,
  Star,
  Zap,
  Target,
  Trophy,
  Award,
  Gem,
  Coins,
  CreditCard,
  Wallet,
  PiggyBank,
  LineChart,
  BarChart3,
  PieChart,
  Activity,
  Timer,
  Calendar,
  Settings,
  Plus,
  Minus,
  ArrowUp,
  ArrowDown,
  TrendingDown,
  Sparkles,
  Flame,
  ShoppingBag,
  Store,
  Package,
  Shirt,
  Coffee,
  Music,
  Mic,
  Video,
  Camera,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface MonetizationMetrics {
  totalEarnings: number;
  monthlyEarnings: number;
  dailyEarnings: number;
  viewRevenue: number;
  tipRevenue: number;
  adRevenue: number;
  sponsorshipRevenue: number;
  merchandiseRevenue: number;
  subscriptionRevenue: number;
  growthRate: number;
  projectedEarnings: number;
}

interface CreatorTier {
  id: string;
  name: string;
  requirements: {
    followers: number;
    views: number;
    earnings: number;
  };
  benefits: string[];
  revenueShare: number;
  color: string;
  icon: React.ReactNode;
}

interface SponsorshipOffer {
  id: string;
  brand: string;
  brandLogo: string;
  title: string;
  description: string;
  budget: number;
  requirements: string[];
  deadline: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

interface MerchandiseItem {
  id: string;
  name: string;
  category: string;
  price: number;
  sales: number;
  revenue: number;
  image: string;
  status: "active" | "draft" | "out-of-stock";
}

interface VideoMonetizationHubProps {
  videoId: string;
  creatorId: string;
  videoMetrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    duration: number;
  };
  onTipSent?: (amount: number) => void;
  onSubscribe?: (tier: string) => void;
  onPurchaseMerchandise?: (itemId: string) => void;
  className?: string;
}

const VideoMonetizationHub: React.FC<VideoMonetizationHubProps> = ({
  videoId,
  creatorId,
  videoMetrics,
  onTipSent,
  onSubscribe,
  onPurchaseMerchandise,
  className,
}) => {
  // State
  const [activeTab, setActiveTab] = useState<"tips" | "sponsor" | "merch" | "analytics">("tips");
  const [monetizationMetrics, setMonetizationMetrics] = useState<MonetizationMetrics>({
    totalEarnings: 12450.75,
    monthlyEarnings: 3240.50,
    dailyEarnings: 125.30,
    viewRevenue: 890.20,
    tipRevenue: 2340.30,
    adRevenue: 1560.40,
    sponsorshipRevenue: 5200.00,
    merchandiseRevenue: 2459.85,
    subscriptionRevenue: 0,
    growthRate: 23.5,
    projectedEarnings: 4200.00,
  });
  const [currentTier, setCurrentTier] = useState<CreatorTier | null>(null);
  const [sponsorshipOffers, setSponsorshipOffers] = useState<SponsorshipOffer[]>([]);
  const [merchandiseItems, setMerchandiseItems] = useState<MerchandiseItem[]>([]);
  const [tipAmount, setTipAmount] = useState(5);
  const [customTipAmount, setCustomTipAmount] = useState("");
  const [tipMessage, setTipMessage] = useState("");
  const [showTipSuccess, setShowTipSuccess] = useState(false);

  const { toast } = useToast();

  // Creator tiers
  const creatorTiers: CreatorTier[] = [
    {
      id: "bronze",
      name: "Bronze Creator",
      requirements: { followers: 1000, views: 10000, earnings: 100 },
      benefits: ["5% revenue share", "Basic analytics", "Community support"],
      revenueShare: 5,
      color: "bg-amber-600",
      icon: <Award className="w-4 h-4" />,
    },
    {
      id: "silver",
      name: "Silver Creator",
      requirements: { followers: 10000, views: 100000, earnings: 1000 },
      benefits: ["10% revenue share", "Advanced analytics", "Priority support", "Brand partnerships"],
      revenueShare: 10,
      color: "bg-gray-400",
      icon: <Star className="w-4 h-4" />,
    },
    {
      id: "gold",
      name: "Gold Creator",
      requirements: { followers: 50000, views: 500000, earnings: 5000 },
      benefits: ["15% revenue share", "Premium analytics", "Dedicated manager", "Exclusive opportunities"],
      revenueShare: 15,
      color: "bg-yellow-500",
      icon: <Crown className="w-4 h-4" />,
    },
    {
      id: "platinum",
      name: "Platinum Creator",
      requirements: { followers: 100000, views: 1000000, earnings: 10000 },
      benefits: ["20% revenue share", "Full analytics suite", "Personal brand manager", "Custom features"],
      revenueShare: 20,
      color: "bg-purple-500",
      icon: <Gem className="w-4 h-4" />,
    },
  ];

  const tipAmounts = [1, 5, 10, 25, 50, 100];

  // Load data
  useEffect(() => {
    loadMonetizationData();
  }, [creatorId]);

  const loadMonetizationData = async () => {
    try {
      // Mock data loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Determine current tier based on metrics
      const userTier = creatorTiers.find(tier => 
        videoMetrics.views >= tier.requirements.views &&
        monetizationMetrics.totalEarnings >= tier.requirements.earnings
      ) || creatorTiers[0];
      
      setCurrentTier(userTier);

      // Mock sponsorship offers
      setSponsorshipOffers([
        {
          id: "1",
          brand: "TechCorp",
          brandLogo: "https://i.pravatar.cc/50?u=techcorp",
          title: "Product Review Collaboration",
          description: "Review our latest gadget in a 2-minute video",
          budget: 500,
          requirements: ["10K+ followers", "Tech content focus", "2-minute video"],
          deadline: "2024-02-15",
          category: "Technology",
          difficulty: "easy",
        },
        {
          id: "2",
          brand: "FashionBrand",
          brandLogo: "https://i.pravatar.cc/50?u=fashion",
          title: "Style Challenge",
          description: "Create styling content featuring our new collection",
          budget: 1200,
          requirements: ["Fashion niche", "High engagement", "Multiple posts"],
          deadline: "2024-02-20",
          category: "Fashion",
          difficulty: "medium",
        },
      ]);

      // Mock merchandise
      setMerchandiseItems([
        {
          id: "1",
          name: "Creator T-Shirt",
          category: "Apparel",
          price: 25,
          sales: 45,
          revenue: 1125,
          image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300",
          status: "active",
        },
        {
          id: "2",
          name: "Custom Mug",
          category: "Accessories",
          price: 15,
          sales: 23,
          revenue: 345,
          image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=300",
          status: "active",
        },
      ]);

    } catch (error) {
      toast({
        title: "Load Error",
        description: "Failed to load monetization data",
        variant: "destructive",
      });
    }
  };

  const handleSendTip = async () => {
    const amount = customTipAmount ? parseFloat(customTipAmount) : tipAmount;
    
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid tip amount",
        variant: "destructive",
      });
      return;
    }

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMonetizationMetrics(prev => ({
        ...prev,
        tipRevenue: prev.tipRevenue + amount,
        totalEarnings: prev.totalEarnings + amount,
        dailyEarnings: prev.dailyEarnings + amount,
      }));

      setShowTipSuccess(true);
      setTimeout(() => setShowTipSuccess(false), 3000);

      if (onTipSent) {
        onTipSent(amount);
      }

      setCustomTipAmount("");
      setTipMessage("");

      toast({
        title: "Tip Sent!",
        description: `$${amount.toFixed(2)} tip sent successfully`,
      });

    } catch (error) {
      toast({
        title: "Tip Failed",
        description: "Failed to send tip. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAcceptSponsorship = async (offerId: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const offer = sponsorshipOffers.find(o => o.id === offerId);
      if (offer) {
        setMonetizationMetrics(prev => ({
          ...prev,
          sponsorshipRevenue: prev.sponsorshipRevenue + offer.budget,
          totalEarnings: prev.totalEarnings + offer.budget,
        }));

        setSponsorshipOffers(prev => prev.filter(o => o.id !== offerId));

        toast({
          title: "Sponsorship Accepted",
          description: `Partnership with ${offer.brand} confirmed!`,
        });
      }
    } catch (error) {
      toast({
        title: "Accept Failed",
        description: "Failed to accept sponsorship",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-500";
      case "medium": return "text-yellow-500";
      case "hard": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="w-12 h-12 rounded-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border-none backdrop-blur-sm"
        >
          <DollarSign className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className={cn("max-w-4xl h-[80vh] bg-black border-gray-800 text-white overflow-hidden", className)}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-yellow-400" />
            Creator Economy
            {currentTier && (
              <Badge className={cn("ml-2", currentTier.color)}>
                {currentTier.icon}
                <span className="ml-1">{currentTier.name}</span>
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Success Animation */}
        {showTipSuccess && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-green-600 text-white p-6 rounded-lg text-center">
              <Gift className="w-12 h-12 mx-auto mb-2" />
              <h3 className="text-xl font-bold">Tip Sent!</h3>
              <p>Thank you for supporting this creator</p>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab as any} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="tips" className="text-xs">
              <Gift className="w-4 h-4 mr-1" />
              Tips & Support
            </TabsTrigger>
            <TabsTrigger value="sponsor" className="text-xs">
              <Star className="w-4 h-4 mr-1" />
              Sponsorships
            </TabsTrigger>
            <TabsTrigger value="merch" className="text-xs">
              <Store className="w-4 h-4 mr-1" />
              Merchandise
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs">
              <BarChart3 className="w-4 h-4 mr-1" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-1">
            <TabsContent value="tips" className="space-y-4 mt-4">
              {/* Tip Creator Section */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Gift className="w-4 h-4 text-yellow-400" />
                    Support This Creator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Quick Tip Amounts */}
                  <div>
                    <Label className="text-sm mb-2 block">Quick Tip</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {tipAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant={tipAmount === amount ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTipAmount(amount)}
                          className="border-gray-600"
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <Label htmlFor="custom-tip" className="text-sm">Custom Amount</Label>
                    <div className="flex gap-2 mt-1">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                        <Input
                          id="custom-tip"
                          type="number"
                          value={customTipAmount}
                          onChange={(e) => setCustomTipAmount(e.target.value)}
                          placeholder="0.00"
                          className="bg-gray-700 border-gray-600 pl-8"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tip Message */}
                  <div>
                    <Label htmlFor="tip-message" className="text-sm">Message (Optional)</Label>
                    <Input
                      id="tip-message"
                      value={tipMessage}
                      onChange={(e) => setTipMessage(e.target.value)}
                      placeholder="Leave a message for the creator..."
                      className="bg-gray-700 border-gray-600 mt-1"
                    />
                  </div>

                  <Button 
                    onClick={handleSendTip}
                    className="w-full bg-yellow-600 hover:bg-yellow-700"
                    disabled={!tipAmount && !customTipAmount}
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Send Tip {formatCurrency(customTipAmount ? parseFloat(customTipAmount) || 0 : tipAmount)}
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Tips */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-sm">Recent Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { amount: 25, user: "Anonymous", message: "Great content!", time: "2 hours ago" },
                      { amount: 10, user: "john_doe", message: "Keep it up!", time: "1 day ago" },
                      { amount: 5, user: "creative_user", message: "Loved this video", time: "2 days ago" },
                    ].map((tip, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{tip.user}</div>
                          <div className="text-xs text-gray-400">{tip.message}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-yellow-400">{formatCurrency(tip.amount)}</div>
                          <div className="text-xs text-gray-400">{tip.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sponsor" className="space-y-4 mt-4">
              {/* Available Sponsorships */}
              <div className="space-y-3">
                {sponsorshipOffers.map((offer) => (
                  <Card key={offer.id} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={offer.brandLogo}
                            alt={offer.brand}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="font-medium">{offer.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{offer.brand}</Badge>
                              <Badge variant="outline" className={getDifficultyColor(offer.difficulty)}>
                                {offer.difficulty}
                              </Badge>
                              <Badge variant="outline" className="text-purple-400">
                                {offer.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-400">
                            {formatCurrency(offer.budget)}
                          </div>
                          <div className="text-xs text-gray-400">Budget</div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-300 mb-3">{offer.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="text-xs text-gray-400">Requirements:</div>
                        <div className="flex flex-wrap gap-1">
                          {offer.requirements.map((req, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                          Deadline: {new Date(offer.deadline).toLocaleDateString()}
                        </div>
                        <Button
                          onClick={() => handleAcceptSponsorship(offer.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Accept Offer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Creator Fund Info */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-gold-400" />
                    Creator Fund
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-gray-300">
                    Earn money from your video views! Join the Creator Fund to get paid for engaging content.
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-green-400">$0.003</div>
                      <div className="text-xs text-gray-400">Per View</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-400">$156.80</div>
                      <div className="text-xs text-gray-400">This Month</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-400">Gold</div>
                      <div className="text-xs text-gray-400">Your Tier</div>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    View Fund Details
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="merch" className="space-y-4 mt-4">
              {/* Merchandise Grid */}
              <div className="grid grid-cols-2 gap-4">
                {merchandiseItems.map((item) => (
                  <Card key={item.id} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm">{item.name}</h3>
                          <Badge
                            variant={item.status === "active" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {item.status}
                          </Badge>
                        </div>
                        
                        <div className="text-lg font-bold text-green-400">
                          {formatCurrency(item.price)}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                          <div>Sales: {item.sales}</div>
                          <div>Revenue: {formatCurrency(item.revenue)}</div>
                        </div>
                        
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => onPurchaseMerchandise?.(item.id)}
                        >
                          <ShoppingBag className="w-3 h-3 mr-1" />
                          Buy Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Add Merchandise */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <h3 className="font-medium mb-2">Add New Merchandise</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Create and sell custom merchandise to your fans
                  </p>
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4 mt-4">
              {/* Revenue Overview */}
              <div className="grid grid-cols-4 gap-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    <div className="text-2xl font-bold text-green-400">
                      {formatCurrency(monetizationMetrics.totalEarnings)}
                    </div>
                    <div className="text-xs text-gray-400">Total Earnings</div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                    <div className="text-2xl font-bold text-blue-400">
                      {formatCurrency(monetizationMetrics.monthlyEarnings)}
                    </div>
                    <div className="text-xs text-gray-400">This Month</div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Timer className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                    <div className="text-2xl font-bold text-purple-400">
                      {formatCurrency(monetizationMetrics.dailyEarnings)}
                    </div>
                    <div className="text-xs text-gray-400">Today</div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                    <div className="text-2xl font-bold text-yellow-400">
                      +{monetizationMetrics.growthRate}%
                    </div>
                    <div className="text-xs text-gray-400">Growth Rate</div>
                  </CardContent>
                </Card>
              </div>

              {/* Revenue Breakdown */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-sm">Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: "Sponsorships", amount: monetizationMetrics.sponsorshipRevenue, color: "bg-green-500" },
                    { label: "Merchandise", amount: monetizationMetrics.merchandiseRevenue, color: "bg-blue-500" },
                    { label: "Tips", amount: monetizationMetrics.tipRevenue, color: "bg-yellow-500" },
                    { label: "Ad Revenue", amount: monetizationMetrics.adRevenue, color: "bg-purple-500" },
                    { label: "View Revenue", amount: monetizationMetrics.viewRevenue, color: "bg-pink-500" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-3 h-3 rounded-full", item.color)} />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <div className="text-sm font-medium">
                        {formatCurrency(item.amount)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-sm">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Revenue per View</div>
                      <div className="text-lg font-bold">
                        {formatCurrency((monetizationMetrics.totalEarnings / videoMetrics.views) || 0)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Engagement Rate</div>
                      <div className="text-lg font-bold">
                        {((videoMetrics.likes + videoMetrics.comments) / videoMetrics.views * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-2">Creator Tier Progress</div>
                    <div className="space-y-2">
                      {currentTier && (
                        <div className="flex items-center justify-between text-sm">
                          <span>Current: {currentTier.name}</span>
                          <span>{currentTier.revenueShare}% revenue share</span>
                        </div>
                      )}
                      <Progress value={75} className="h-2" />
                      <div className="text-xs text-gray-400">
                        75% progress to next tier
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default VideoMonetizationHub;
