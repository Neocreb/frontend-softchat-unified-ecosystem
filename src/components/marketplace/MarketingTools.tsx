import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Megaphone,
  Target,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Eye,
  ShoppingCart,
  Gift,
  Zap,
  BarChart3,
  Mail,
  MessageCircle,
  Share2,
  Star,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Copy,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface Campaign {
  id: string;
  name: string;
  type: "discount" | "bogo" | "free_shipping" | "bundle" | "flash_sale";
  status: "draft" | "active" | "paused" | "ended";
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  reach: number;
  clicks: number;
  conversions: number;
  revenue: number;
  targetAudience: {
    demographics: string[];
    interests: string[];
    location: string[];
  };
  products: string[];
  discountValue: number;
  discountType: "percentage" | "fixed";
  description: string;
}

interface Promotion {
  id: string;
  title: string;
  description: string;
  type: "coupon" | "sale" | "bundle" | "loyalty";
  code?: string;
  discount: number;
  discountType: "percentage" | "fixed";
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  applicableProducts: string[];
}

interface MarketingToolsProps {
  sellerId?: string;
}

const MarketingTools = ({ sellerId }: MarketingToolsProps) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
  const [isCreatePromotionOpen, setIsCreatePromotionOpen] = useState(false);

  const { toast } = useToast();

  // Mock data
  const mockCampaigns: Campaign[] = [
    {
      id: "camp_1",
      name: "Summer Electronics Sale",
      type: "discount",
      status: "active",
      startDate: "2024-01-20T00:00:00Z",
      endDate: "2024-02-20T23:59:59Z",
      budget: 1000,
      spent: 350,
      reach: 12500,
      clicks: 875,
      conversions: 47,
      revenue: 2350,
      targetAudience: {
        demographics: ["25-45", "Male", "Female"],
        interests: ["Technology", "Electronics", "Gadgets"],
        location: ["United States", "Canada"],
      },
      products: ["1", "2"],
      discountValue: 15,
      discountType: "percentage",
      description: "15% off all electronics for summer",
    },
    {
      id: "camp_2",
      name: "New Customer Welcome",
      type: "free_shipping",
      status: "active",
      startDate: "2024-01-15T00:00:00Z",
      endDate: "2024-03-15T23:59:59Z",
      budget: 500,
      spent: 125,
      reach: 5200,
      clicks: 320,
      conversions: 18,
      revenue: 890,
      targetAudience: {
        demographics: ["18-65"],
        interests: ["Shopping", "Online"],
        location: ["Worldwide"],
      },
      products: [],
      discountValue: 0,
      discountType: "fixed",
      description: "Free shipping for new customers",
    },
  ];

  const mockPromotions: Promotion[] = [
    {
      id: "promo_1",
      title: "SAVE15NOW",
      description: "15% off your entire order",
      type: "coupon",
      code: "SAVE15NOW",
      discount: 15,
      discountType: "percentage",
      minPurchase: 50,
      maxDiscount: 100,
      usageLimit: 1000,
      usedCount: 234,
      validFrom: "2024-01-20T00:00:00Z",
      validUntil: "2024-02-29T23:59:59Z",
      isActive: true,
      applicableProducts: [],
    },
    {
      id: "promo_2",
      title: "Flash Sale - Headphones",
      description: "Limited time offer on wireless headphones",
      type: "sale",
      discount: 25,
      discountType: "percentage",
      usageLimit: 100,
      usedCount: 67,
      validFrom: "2024-01-22T00:00:00Z",
      validUntil: "2024-01-25T23:59:59Z",
      isActive: true,
      applicableProducts: ["1"],
    },
  ];

  useEffect(() => {
    setCampaigns(mockCampaigns);
    setPromotions(mockPromotions);
  }, []);

  const [campaignForm, setCampaignForm] = useState({
    name: "",
    type: "discount" as Campaign["type"],
    startDate: "",
    endDate: "",
    budget: 100,
    discountValue: 10,
    discountType: "percentage" as "percentage" | "fixed",
    description: "",
    targetAudience: {
      demographics: [] as string[],
      interests: [] as string[],
      location: [] as string[],
    },
    products: [] as string[],
  });

  const [promotionForm, setPromotionForm] = useState({
    title: "",
    description: "",
    type: "coupon" as Promotion["type"],
    code: "",
    discount: 10,
    discountType: "percentage" as "percentage" | "fixed",
    minPurchase: 0,
    maxDiscount: 0,
    usageLimit: 100,
    validFrom: "",
    validUntil: "",
    applicableProducts: [] as string[],
  });

  const getStatusColor = (status: Campaign["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "ended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCampaignTypeIcon = (type: Campaign["type"]) => {
    switch (type) {
      case "discount":
        return <DollarSign className="w-4 h-4" />;
      case "bogo":
        return <Gift className="w-4 h-4" />;
      case "free_shipping":
        return <ShoppingCart className="w-4 h-4" />;
      case "bundle":
        return <Target className="w-4 h-4" />;
      case "flash_sale":
        return <Zap className="w-4 h-4" />;
      default:
        return <Megaphone className="w-4 h-4" />;
    }
  };

  const calculateROI = (campaign: Campaign) => {
    if (campaign.spent === 0) return 0;
    return ((campaign.revenue - campaign.spent) / campaign.spent) * 100;
  };

  const calculateCTR = (campaign: Campaign) => {
    if (campaign.reach === 0) return 0;
    return (campaign.clicks / campaign.reach) * 100;
  };

  const calculateConversionRate = (campaign: Campaign) => {
    if (campaign.clicks === 0) return 0;
    return (campaign.conversions / campaign.clicks) * 100;
  };

  const handleCreateCampaign = () => {
    const newCampaign: Campaign = {
      id: `camp_${Date.now()}`,
      name: campaignForm.name,
      type: campaignForm.type,
      status: "draft",
      startDate: campaignForm.startDate,
      endDate: campaignForm.endDate,
      budget: campaignForm.budget,
      spent: 0,
      reach: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      targetAudience: campaignForm.targetAudience,
      products: campaignForm.products,
      discountValue: campaignForm.discountValue,
      discountType: campaignForm.discountType,
      description: campaignForm.description,
    };

    setCampaigns((prev) => [newCampaign, ...prev]);
    setIsCreateCampaignOpen(false);

    // Reset form
    setCampaignForm({
      name: "",
      type: "discount",
      startDate: "",
      endDate: "",
      budget: 100,
      discountValue: 10,
      discountType: "percentage",
      description: "",
      targetAudience: { demographics: [], interests: [], location: [] },
      products: [],
    });

    toast({
      title: "Campaign Created",
      description: "Your marketing campaign has been created successfully",
    });
  };

  const handleCreatePromotion = () => {
    const newPromotion: Promotion = {
      id: `promo_${Date.now()}`,
      title: promotionForm.title,
      description: promotionForm.description,
      type: promotionForm.type,
      code: promotionForm.code,
      discount: promotionForm.discount,
      discountType: promotionForm.discountType,
      minPurchase: promotionForm.minPurchase,
      maxDiscount: promotionForm.maxDiscount,
      usageLimit: promotionForm.usageLimit,
      usedCount: 0,
      validFrom: promotionForm.validFrom,
      validUntil: promotionForm.validUntil,
      isActive: true,
      applicableProducts: promotionForm.applicableProducts,
    };

    setPromotions((prev) => [newPromotion, ...prev]);
    setIsCreatePromotionOpen(false);

    // Reset form
    setPromotionForm({
      title: "",
      description: "",
      type: "coupon",
      code: "",
      discount: 10,
      discountType: "percentage",
      minPurchase: 0,
      maxDiscount: 0,
      usageLimit: 100,
      validFrom: "",
      validUntil: "",
      applicableProducts: [],
    });

    toast({
      title: "Promotion Created",
      description: "Your promotion has been created successfully",
    });
  };

  const toggleCampaignStatus = (
    campaignId: string,
    newStatus: Campaign["status"],
  ) => {
    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === campaignId
          ? { ...campaign, status: newStatus }
          : campaign,
      ),
    );

    toast({
      title: "Campaign Updated",
      description: `Campaign status changed to ${newStatus}`,
    });
  };

  const togglePromotionStatus = (promotionId: string) => {
    setPromotions((prev) =>
      prev.map((promotion) =>
        promotion.id === promotionId
          ? { ...promotion, isActive: !promotion.isActive }
          : promotion,
      ),
    );

    toast({
      title: "Promotion Updated",
      description: "Promotion status has been updated",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Marketing Tools</h2>
          <p className="text-muted-foreground">
            Create and manage promotional campaigns
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog
            open={isCreatePromotionOpen}
            onOpenChange={setIsCreatePromotionOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Gift className="w-4 h-4 mr-2" />
                Create Promotion
              </Button>
            </DialogTrigger>
          </Dialog>
          <Dialog
            open={isCreateCampaignOpen}
            onOpenChange={setIsCreateCampaignOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Megaphone className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          {/* Campaign Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Active Campaigns
                    </p>
                    <p className="text-2xl font-bold">
                      {campaigns.filter((c) => c.status === "active").length}
                    </p>
                  </div>
                  <Megaphone className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Reach
                    </p>
                    <p className="text-2xl font-bold">
                      {campaigns
                        .reduce((sum, c) => sum + c.reach, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold">
                      $
                      {campaigns
                        .reduce((sum, c) => sum + c.revenue, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Avg. ROI
                    </p>
                    <p className="text-2xl font-bold">
                      {campaigns.length > 0
                        ? `${(campaigns.reduce((sum, c) => sum + calculateROI(c), 0) / campaigns.length).toFixed(1)}%`
                        : "0%"}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Campaigns List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id} className="border">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            {getCampaignTypeIcon(campaign.type)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{campaign.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {campaign.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                className={getStatusColor(campaign.status)}
                              >
                                {campaign.status}
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {campaign.type.replace("_", " ")}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {campaign.status === "active" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                toggleCampaignStatus(campaign.id, "paused")
                              }
                            >
                              <Pause className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                toggleCampaignStatus(campaign.id, "active")
                              }
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Campaign Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Budget
                          </p>
                          <p className="font-semibold">${campaign.budget}</p>
                          <Progress
                            value={(campaign.spent / campaign.budget) * 100}
                            className="h-1 mt-1"
                          />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Reach</p>
                          <p className="font-semibold">
                            {campaign.reach.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">CTR</p>
                          <p className="font-semibold">
                            {calculateCTR(campaign).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Conversion
                          </p>
                          <p className="font-semibold">
                            {calculateConversionRate(campaign).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Revenue
                          </p>
                          <p className="font-semibold">${campaign.revenue}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">ROI</p>
                          <p
                            className={cn(
                              "font-semibold",
                              calculateROI(campaign) >= 0
                                ? "text-green-600"
                                : "text-red-600",
                            )}
                          >
                            {calculateROI(campaign).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotions" className="space-y-6">
          {/* Promotions List */}
          <Card>
            <CardHeader>
              <CardTitle>Active Promotions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Promotion</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promotions.map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{promotion.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {promotion.description}
                          </p>
                          {promotion.code && (
                            <code className="text-xs bg-muted px-2 py-1 rounded mt-1 inline-block">
                              {promotion.code}
                            </code>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {promotion.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {promotion.discount}
                        {promotion.discountType === "percentage"
                          ? "%"
                          : "$"}{" "}
                        off
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {promotion.usedCount}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              / {promotion.usageLimit}
                            </span>
                          </div>
                          <Progress
                            value={
                              (promotion.usedCount / promotion.usageLimit) * 100
                            }
                            className="h-1"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(promotion.validUntil).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={promotion.isActive}
                          onCheckedChange={() =>
                            togglePromotionStatus(promotion.id)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Marketing Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {campaign.conversions} conversions
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${campaign.revenue}</p>
                        <p
                          className={cn(
                            "text-sm",
                            calculateROI(campaign) >= 0
                              ? "text-green-600"
                              : "text-red-600",
                          )}
                        >
                          {calculateROI(campaign).toFixed(1)}% ROI
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Promotions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {promotions.map((promotion) => (
                    <div
                      key={promotion.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{promotion.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {promotion.usedCount} uses
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {(
                            (promotion.usedCount / promotion.usageLimit) *
                            100
                          ).toFixed(1)}
                          %
                        </p>
                        <p className="text-sm text-muted-foreground">
                          usage rate
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          {/* Campaign Templates */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Flash Sale",
                description: "Limited time discount to drive urgency",
                icon: <Zap className="w-6 h-6" />,
                color: "bg-orange-100 text-orange-600",
              },
              {
                title: "New Customer Welcome",
                description: "Special offer for first-time buyers",
                icon: <Users className="w-6 h-6" />,
                color: "bg-blue-100 text-blue-600",
              },
              {
                title: "Seasonal Sale",
                description: "Holiday and seasonal promotions",
                icon: <Calendar className="w-6 h-6" />,
                color: "bg-green-100 text-green-600",
              },
              {
                title: "Bundle Deal",
                description: "Package multiple products together",
                icon: <Gift className="w-6 h-6" />,
                color: "bg-purple-100 text-purple-600",
              },
              {
                title: "Loyalty Rewards",
                description: "Reward your repeat customers",
                icon: <Star className="w-6 h-6" />,
                color: "bg-yellow-100 text-yellow-600",
              },
              {
                title: "Free Shipping",
                description: "Remove shipping costs to increase sales",
                icon: <ShoppingCart className="w-6 h-6" />,
                color: "bg-teal-100 text-teal-600",
              },
            ].map((template, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4",
                      template.color,
                    )}
                  >
                    {template.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{template.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.description}
                  </p>
                  <Button variant="outline" className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Campaign Dialog */}
      <Dialog
        open={isCreateCampaignOpen}
        onOpenChange={setIsCreateCampaignOpen}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Marketing Campaign</DialogTitle>
            <DialogDescription>
              Set up a new promotional campaign to boost your sales
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input
                  id="campaign-name"
                  placeholder="Enter campaign name"
                  value={campaignForm.name}
                  onChange={(e) =>
                    setCampaignForm({ ...campaignForm, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaign-type">Campaign Type</Label>
                <Select
                  value={campaignForm.type}
                  onValueChange={(value: Campaign["type"]) =>
                    setCampaignForm({ ...campaignForm, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discount">Discount Sale</SelectItem>
                    <SelectItem value="bogo">Buy One Get One</SelectItem>
                    <SelectItem value="free_shipping">Free Shipping</SelectItem>
                    <SelectItem value="bundle">Bundle Deal</SelectItem>
                    <SelectItem value="flash_sale">Flash Sale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaign-description">Description</Label>
              <Textarea
                id="campaign-description"
                placeholder="Describe your campaign..."
                value={campaignForm.description}
                onChange={(e) =>
                  setCampaignForm({
                    ...campaignForm,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="datetime-local"
                  value={campaignForm.startDate}
                  onChange={(e) =>
                    setCampaignForm({
                      ...campaignForm,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="datetime-local"
                  value={campaignForm.endDate}
                  onChange={(e) =>
                    setCampaignForm({
                      ...campaignForm,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={campaignForm.budget}
                  onChange={(e) =>
                    setCampaignForm({
                      ...campaignForm,
                      budget: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount-value">Discount Value</Label>
                <Input
                  id="discount-value"
                  type="number"
                  value={campaignForm.discountValue}
                  onChange={(e) =>
                    setCampaignForm({
                      ...campaignForm,
                      discountValue: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount-type">Discount Type</Label>
                <Select
                  value={campaignForm.discountType}
                  onValueChange={(value: "percentage" | "fixed") =>
                    setCampaignForm({ ...campaignForm, discountType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsCreateCampaignOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleCreateCampaign} className="flex-1">
                Create Campaign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Promotion Dialog */}
      <Dialog
        open={isCreatePromotionOpen}
        onOpenChange={setIsCreatePromotionOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Promotion</DialogTitle>
            <DialogDescription>
              Create a discount code or special offer
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="promo-title">Title</Label>
              <Input
                id="promo-title"
                placeholder="Enter promotion title"
                value={promotionForm.title}
                onChange={(e) =>
                  setPromotionForm({ ...promotionForm, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="promo-code">Promo Code</Label>
              <Input
                id="promo-code"
                placeholder="SAVE20"
                value={promotionForm.code}
                onChange={(e) =>
                  setPromotionForm({
                    ...promotionForm,
                    code: e.target.value.toUpperCase(),
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="promo-discount">Discount</Label>
                <Input
                  id="promo-discount"
                  type="number"
                  value={promotionForm.discount}
                  onChange={(e) =>
                    setPromotionForm({
                      ...promotionForm,
                      discount: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="promo-type">Type</Label>
                <Select
                  value={promotionForm.discountType}
                  onValueChange={(value: "percentage" | "fixed") =>
                    setPromotionForm({ ...promotionForm, discountType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">%</SelectItem>
                    <SelectItem value="fixed">$</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valid-from">Valid From</Label>
                <Input
                  id="valid-from"
                  type="date"
                  value={promotionForm.validFrom}
                  onChange={(e) =>
                    setPromotionForm({
                      ...promotionForm,
                      validFrom: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valid-until">Valid Until</Label>
                <Input
                  id="valid-until"
                  type="date"
                  value={promotionForm.validUntil}
                  onChange={(e) =>
                    setPromotionForm({
                      ...promotionForm,
                      validUntil: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="usage-limit">Usage Limit</Label>
              <Input
                id="usage-limit"
                type="number"
                value={promotionForm.usageLimit}
                onChange={(e) =>
                  setPromotionForm({
                    ...promotionForm,
                    usageLimit: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsCreatePromotionOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleCreatePromotion} className="flex-1">
                Create Promotion
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarketingTools;
