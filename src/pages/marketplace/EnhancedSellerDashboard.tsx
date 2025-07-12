import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart,
  LineChart,
  PieChart,
  Clock,
  MoreHorizontal,
  Eye,
  Heart,
  MessageCircle,
  Package,
  Edit,
  Trash2,
  Sparkles,
  Plus,
  TrendingUp,
  DollarSign,
  Users,
  Star,
  Target,
  Calendar,
  Zap,
  Trophy,
  AlertCircle,
  CheckCircle,
  XCircle,
  Copy,
  BarChart3,
  ShoppingCart,
  CreditCard,
  Activity,
} from "lucide-react";
import { useEnhancedMarketplace } from "@/contexts/EnhancedMarketplaceContext";
import { useToast } from "@/components/ui/use-toast";
import {
  Product,
  ProductBoost,
  BoostOption,
} from "@/types/enhanced-marketplace";

const EnhancedSellerDashboard = () => {
  const {
    myListings,
    deleteProduct,
    boostProduct,
    boostOptions,
    getProductBoosts,
    getMyBoosts,
    getSellerAnalytics,
    getProductPerformance,
    duplicateProduct,
  } = useEnhancedMarketplace();

  const { toast } = useToast();
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showBoostDialog, setShowBoostDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedBoostOption, setSelectedBoostOption] = useState<string | null>(
    null,
  );
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "daily" | "weekly" | "monthly"
  >("weekly");

  // Mock analytics data - in real app this would come from API
  const sellerAnalytics = {
    totalRevenue: 12450.67,
    totalOrders: 89,
    totalProducts: myListings.length,
    conversionRate: 3.2,
    averageOrderValue: 139.9,
    responseRate: 98,
    onTimeDeliveryRate: 95,
    customerSatisfaction: 4.8,
    boostROI: 245,
    monthlyRevenue: [8500, 9200, 11800, 12450],
    topProducts: myListings.slice(0, 3),
    recentOrders: [],
    categoryBreakdown: [
      { category: "Electronics", revenue: 7500, percentage: 60 },
      { category: "Fashion", revenue: 3000, percentage: 24 },
      { category: "Home", revenue: 1950, percentage: 16 },
    ],
  };

  const myBoosts = getMyBoosts();
  const activeBoosts = myBoosts.filter((b) => b.status === "active");

  const handleCreateListing = () => {
    navigate("/marketplace/list");
  };

  const handleEditListing = (productId: string) => {
    navigate(`/marketplace/list?edit=${productId}`);
  };

  const handleDuplicateProduct = async (productId: string) => {
    try {
      await duplicateProduct(productId);
      toast({
        title: "Product Duplicated",
        description: "A copy of your product has been created",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate product",
        variant: "destructive",
      });
    }
  };

  const handleOpenBoostDialog = (product: Product) => {
    setSelectedProduct(product);
    setShowBoostDialog(true);
  };

  const handleOpenDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteDialog(true);
  };

  const handleBoost = async () => {
    if (!selectedProduct || !selectedBoostOption) return;

    try {
      await boostProduct(selectedProduct.id, selectedBoostOption);
      toast({
        title: "Product Boosted",
        description: "Your product will now appear in sponsored sections",
      });
      setShowBoostDialog(false);
      setSelectedBoostOption(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to boost product. Please try again",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      await deleteProduct(selectedProduct.id);
      toast({
        title: "Product Deleted",
        description: "Your product has been removed from the marketplace",
      });
      setShowDeleteDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const isProductBoosted = (product: Product) => {
    if (!product.boostedUntil) return false;
    const boostedUntil = new Date(product.boostedUntil);
    const now = new Date();
    return boostedUntil > now;
  };

  const getBoostStatusBadge = (boost: ProductBoost) => {
    const statusColors = {
      active: "bg-green-500",
      pending: "bg-yellow-500",
      completed: "bg-blue-500",
      cancelled: "bg-red-500",
      rejected: "bg-red-600",
    };

    return (
      <Badge className={`${statusColors[boost.status]} text-white`}>
        {boost.status.charAt(0).toUpperCase() + boost.status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your products, track performance, and grow your business
          </p>
        </div>

        <Button
          onClick={handleCreateListing}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>List New Product</span>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="font-semibold">
                  ${sellerAnalytics.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Orders</p>
                <p className="font-semibold">{sellerAnalytics.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Products</p>
                <p className="font-semibold">{sellerAnalytics.totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="font-semibold">
                  {sellerAnalytics.customerSatisfaction}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Conversion</p>
                <p className="font-semibold">
                  {sellerAnalytics.conversionRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-600" />
              <div>
                <p className="text-sm text-muted-foreground">Boost ROI</p>
                <p className="font-semibold">{sellerAnalytics.boostROI}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="products">My Products</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="boosts">Boosts & Campaigns</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="space-y-6">
            {myListings.length === 0 ? (
              <Card className="bg-gray-50">
                <CardContent className="pt-6 text-center">
                  <div className="py-6 space-y-4">
                    <Package className="h-12 w-12 text-gray-400 mx-auto" />
                    <h3 className="text-lg font-medium">No Products Listed</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      You haven't listed any products yet. Create your first
                      listing to start selling on the marketplace.
                    </p>
                    <Button onClick={handleCreateListing} className="mt-2">
                      List Your First Product
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleEditListing(product.id)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDuplicateProduct(product.id)}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleOpenBoostDialog(product)}
                            >
                              <Sparkles className="h-4 w-4 mr-2" />
                              Boost Product
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleOpenDeleteDialog(product)}
                              className="text-red-500"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Product
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Status badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.status !== "active" && (
                          <Badge
                            variant={
                              product.status === "draft"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {product.status}
                          </Badge>
                        )}
                        {isProductBoosted(product) && (
                          <Badge className="bg-amber-500 text-white">
                            Boosted
                          </Badge>
                        )}
                        {product.isFeatured && (
                          <Badge className="bg-blue-500 text-white">
                            Featured
                          </Badge>
                        )}
                        {product.campaignIds &&
                          product.campaignIds.length > 0 && (
                            <Badge className="bg-purple-500 text-white">
                              Campaign
                            </Badge>
                          )}
                      </div>
                    </div>

                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-base line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="text-right">
                          <span className="font-semibold text-lg">
                            $
                            {(product.discountPrice || product.price).toFixed(
                              2,
                            )}
                          </span>
                          {product.discountPrice && (
                            <p className="text-sm text-muted-foreground line-through">
                              ${product.price.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Listed on {formatDate(product.createdAt)}
                      </p>
                    </CardHeader>

                    <CardContent className="pb-3">
                      <div className="grid grid-cols-3 gap-4 text-center text-sm">
                        <div className="flex flex-col items-center">
                          <Eye className="h-4 w-4 mb-1 text-muted-foreground" />
                          <span className="font-medium">
                            {product.viewCount}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Views
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <Heart className="h-4 w-4 mb-1 text-muted-foreground" />
                          <span className="font-medium">
                            {product.favoriteCount}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Likes
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <ShoppingCart className="h-4 w-4 mb-1 text-muted-foreground" />
                          <span className="font-medium">
                            {product.totalSales}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Sales
                          </span>
                        </div>
                      </div>

                      {/* Stock status */}
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Stock</span>
                          <span>{product.stockQuantity || "Unlimited"}</span>
                        </div>
                        {product.stockQuantity && product.stockQuantity > 0 && (
                          <Progress
                            value={
                              (product.stockQuantity /
                                (product.stockQuantity + product.totalSales)) *
                              100
                            }
                            className="h-2"
                          />
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="border-t bg-gray-50 p-3 flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditListing(product.id)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleOpenBoostDialog(product)}
                        className="flex items-center gap-1"
                        disabled={isProductBoosted(product)}
                        variant={
                          isProductBoosted(product) ? "secondary" : "default"
                        }
                      >
                        <Sparkles className="h-4 w-4" />
                        {isProductBoosted(product) ? "Boosted" : "Boost"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Revenue Trend</h3>
                  <div className="flex gap-2">
                    {(["daily", "weekly", "monthly"] as const).map((period) => (
                      <Button
                        key={period}
                        variant={
                          selectedPeriod === period ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedPeriod(period)}
                      >
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-300 mx-auto" />
                    <p className="text-muted-foreground mt-2">
                      Revenue chart will appear here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      $
                      {sellerAnalytics.monthlyRevenue[
                        sellerAnalytics.monthlyRevenue.length - 1
                      ].toLocaleString()}{" "}
                      this month
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-medium">Category Performance</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sellerAnalytics.categoryBreakdown.map((category) => (
                      <div key={category.category} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{category.category}</span>
                          <span>${category.revenue.toLocaleString()}</span>
                        </div>
                        <Progress value={category.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-medium">Key Metrics</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Average Order Value
                      </span>
                      <span className="font-medium">
                        ${sellerAnalytics.averageOrderValue}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Response Rate
                      </span>
                      <span className="font-medium">
                        {sellerAnalytics.responseRate}%
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        On-time Delivery
                      </span>
                      <span className="font-medium">
                        {sellerAnalytics.onTimeDeliveryRate}%
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Customer Satisfaction
                      </span>
                      <span className="font-medium flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {sellerAnalytics.customerSatisfaction}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-medium">Top Products</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sellerAnalytics.topProducts.map((product, index) => (
                      <div key={product.id} className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                          {index + 1}
                        </div>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {product.totalSales} sales
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="boosts">
          <div className="space-y-6">
            {/* Active Boosts */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">Active Boosts</h3>
              </CardHeader>
              <CardContent>
                {activeBoosts.length === 0 ? (
                  <div className="text-center py-6">
                    <Zap className="h-12 w-12 text-gray-400 mx-auto" />
                    <h3 className="text-lg font-medium mt-2">
                      No Active Boosts
                    </h3>
                    <p className="text-muted-foreground">
                      Boost your products to increase visibility and sales
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeBoosts.map((boost) => {
                      const product = myListings.find(
                        (p) => p.id === boost.productId,
                      );
                      if (!product) return null;

                      const endDate = new Date(boost.endDate || "");
                      const timeLeft = endDate.getTime() - Date.now();
                      const hoursLeft = Math.max(
                        0,
                        Math.floor(timeLeft / (1000 * 60 * 60)),
                      );

                      return (
                        <Card key={boost.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-16 h-16 rounded object-cover"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium">{product.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {boost.boostType.charAt(0).toUpperCase() +
                                    boost.boostType.slice(1)}{" "}
                                  Boost
                                </p>
                                <div className="flex items-center gap-4 mt-2">
                                  {getBoostStatusBadge(boost)}
                                  <span className="text-sm text-muted-foreground">
                                    {hoursLeft}h remaining
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">
                                  {boost.cost} {boost.currency}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {boost.impressions} impressions
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {boost.clicks} clicks
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Boost History */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">Boost History</h3>
              </CardHeader>
              <CardContent>
                {myBoosts.length === 0 ? (
                  <div className="text-center py-6">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto" />
                    <h3 className="text-lg font-medium mt-2">
                      No Boost History
                    </h3>
                    <p className="text-muted-foreground">
                      Your boost history will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myBoosts.slice(0, 5).map((boost) => {
                      const product = myListings.find(
                        (p) => p.id === boost.productId,
                      );
                      if (!product) return null;

                      return (
                        <div
                          key={boost.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <div>
                              <p className="font-medium text-sm">
                                {product.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {boost.boostType} •{" "}
                                {formatDate(boost.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {getBoostStatusBadge(boost)}
                            <span className="text-sm font-medium">
                              {boost.cost} {boost.currency}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ROI Summary */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">
                  Boost Performance Summary
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">245%</p>
                    <p className="text-sm text-muted-foreground">Average ROI</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">12,543</p>
                    <p className="text-sm text-muted-foreground">
                      Total Impressions
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">1,234</p>
                    <p className="text-sm text-muted-foreground">
                      Total Clicks
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">89</p>
                    <p className="text-sm text-muted-foreground">Conversions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="bg-gray-50">
            <CardContent className="pt-6 text-center">
              <div className="py-6 space-y-4">
                <Clock className="h-12 w-12 text-gray-400 mx-auto" />
                <h3 className="text-lg font-medium">No Orders Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  You haven't received any orders yet. Orders will appear here
                  once customers make purchases.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <div className="space-y-6">
            {/* Performance Score */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">
                  Overall Performance Score
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600">87</div>
                    <p className="text-sm text-muted-foreground">
                      Performance Score
                    </p>
                    <Badge className="mt-2 bg-green-500">Excellent</Badge>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Quality Score</span>
                        <span>92/100</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Service Score</span>
                        <span>89/100</span>
                      </div>
                      <Progress value={89} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Delivery Score</span>
                        <span>83/100</span>
                      </div>
                      <Progress value={83} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">Achievements & Badges</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Trophy className="h-8 w-8 text-yellow-600 mx-auto" />
                    <p className="text-sm font-medium mt-2">Top Seller</p>
                    <p className="text-xs text-muted-foreground">This Month</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Star className="h-8 w-8 text-blue-600 mx-auto" />
                    <p className="text-sm font-medium mt-2">5-Star Rating</p>
                    <p className="text-xs text-muted-foreground">
                      Quality Products
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg opacity-50">
                    <Zap className="h-8 w-8 text-gray-400 mx-auto" />
                    <p className="text-sm font-medium mt-2">Fast Shipper</p>
                    <p className="text-xs text-muted-foreground">
                      5 more orders needed
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg opacity-50">
                    <Users className="h-8 w-8 text-gray-400 mx-auto" />
                    <p className="text-sm font-medium mt-2">
                      Customer Favorite
                    </p>
                    <p className="text-xs text-muted-foreground">
                      50 more likes needed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Boost Product Dialog */}
      <Dialog open={showBoostDialog} onOpenChange={setShowBoostDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Boost Product Visibility</DialogTitle>
            <DialogDescription>
              Boosted products appear in sponsored sections and get higher
              visibility across the marketplace.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <h4 className="text-sm font-medium mb-3">Select Boost Package:</h4>
            <div className="space-y-3">
              {boostOptions.map((option) => (
                <Card
                  key={option.id}
                  className={`cursor-pointer transition-all ${
                    selectedBoostOption === option.id
                      ? "border-blue-500 bg-blue-50"
                      : ""
                  }`}
                  onClick={() => setSelectedBoostOption(option.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{option.name}</h4>
                          {option.popular && (
                            <Badge className="bg-blue-500 text-white text-xs">
                              Popular
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {option.description}
                        </p>
                        {option.features && (
                          <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                            {option.features.map((feature, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-1"
                              >
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <span className="font-semibold text-blue-600">
                          {option.price} {option.currency}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {option.duration}h duration
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBoostDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBoost} disabled={!selectedBoostOption}>
              <Sparkles className="h-4 w-4 mr-2" />
              Boost Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {selectedProduct && (
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded overflow-hidden">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{selectedProduct.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    $
                    {(
                      selectedProduct.discountPrice || selectedProduct.price
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedSellerDashboard;
