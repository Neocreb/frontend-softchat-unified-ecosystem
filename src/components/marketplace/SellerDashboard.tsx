import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  Heart,
  MessageCircle,
  Edit,
  Trash2,
  Sparkle,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Star,
  Calendar,
  BarChart3,
  Settings,
  FileText,
  Truck,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Upload,
  Filter,
  Search,
  RefreshCw,
} from "lucide-react";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useToast } from "@/components/ui/use-toast";
import { Product, BoostOption } from "@/types/marketplace";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UnifiedCampaignManager } from "@/components/campaigns/UnifiedCampaignManager";

interface Order {
  id: string;
  productName: string;
  customerName: string;
  amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
  quantity: number;
}

interface Analytics {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  averageRating: number;
  monthlyRevenue: number[];
  topSellingProducts: Product[];
  recentOrders: Order[];
}

const SellerDashboard = () => {
  const { myListings, deleteProduct, boostProduct, boostOptions, isLoading } =
    useMarketplace();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showBoostDialog, setShowBoostDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedBoostOption, setSelectedBoostOption] = useState<string | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  // Mock data for demonstration
  const mockOrders: Order[] = [
    {
      id: "1",
      productName: "Wireless Headphones",
      customerName: "John Doe",
      amount: 99.99,
      status: "pending",
      date: "2025-01-06",
      quantity: 1,
    },
    {
      id: "2",
      productName: "Smart Watch",
      customerName: "Jane Smith",
      amount: 199.99,
      status: "shipped",
      date: "2025-01-05",
      quantity: 2,
    },
    {
      id: "3",
      productName: "Phone Case",
      customerName: "Bob Johnson",
      amount: 29.99,
      status: "delivered",
      date: "2025-01-04",
      quantity: 1,
    },
  ];

  const mockAnalytics: Analytics = {
    totalSales: 15420.5,
    totalOrders: 156,
    totalProducts: myListings.length,
    averageRating: 4.7,
    monthlyRevenue: [1200, 1800, 2400, 3200, 2800, 3600],
    topSellingProducts: myListings.slice(0, 3),
    recentOrders: mockOrders,
  };

  useEffect(() => {
    setAnalytics(mockAnalytics);
  }, [myListings]);

  const handleCreateListing = () => {
    navigate("/app/marketplace");
    setTimeout(() => {
      const listTabElement = document.querySelector(
        '[value="list"]',
      ) as HTMLElement;
      if (listTabElement) listTabElement.click();
    }, 0);
  };

  const handleEditListing = (productId: string) => {
    navigate(`/app/marketplace/list?edit=${productId}`);
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
    if (!product.isSponsored || !product.boostedUntil) return false;

    const boostedUntil = new Date(product.boostedUntil);
    const now = new Date();

    return boostedUntil > now;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-semibold">Seller Dashboard</h2>
        <Button
          onClick={handleCreateListing}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>List New Product</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
          <TabsTrigger value="overview" className="text-xs md:text-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="products" className="text-xs md:text-sm">
            Products
          </TabsTrigger>
          <TabsTrigger value="orders" className="text-xs md:text-sm">
            Orders
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs md:text-sm">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs md:text-sm">
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {analytics && (
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Total Sales
                        </p>
                        <p className="text-lg font-bold">
                          ${analytics.totalSales.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">Orders</p>
                        <p className="text-lg font-bold">
                          {analytics.totalOrders}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Products
                        </p>
                        <p className="text-lg font-bold">
                          {analytics.totalProducts}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">Rating</p>
                        <p className="text-lg font-bold">
                          {analytics.averageRating}/5
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{order.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.customerName}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <span className="font-semibold">${order.amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="boosted">Boosted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {myListings.length === 0 ? (
            <Card className="bg-gray-50">
              <CardContent className="pt-6 text-center">
                <div className="py-6 space-y-4">
                  <div className="mx-auto rounded-full bg-muted h-12 w-12 flex items-center justify-center">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                  </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myListings.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="relative h-40">
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
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-more-horizontal"
                            >
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="19" cy="12" r="1" />
                              <circle cx="5" cy="12" r="1" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleEditListing(product.id)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Listing
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleOpenBoostDialog(product)}
                          >
                            <Sparkle className="h-4 w-4 mr-2" />
                            Boost Visibility
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleOpenDeleteDialog(product)}
                            className="text-red-500"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Listing
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {isProductBoosted(product) && (
                      <Badge className="absolute bottom-2 right-2 bg-amber-500">
                        Boosted
                      </Badge>
                    )}
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-base line-clamp-1">
                        {product.name}
                      </h3>
                      <span className="font-semibold">
                        ${(product.discountPrice || product.price).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Listed on {formatDate(product.createdAt)}
                    </p>
                  </CardHeader>

                  <CardContent className="pb-3">
                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div className="flex flex-col items-center">
                        <Eye className="h-4 w-4 mb-1 text-muted-foreground" />
                        <span>125 Views</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Heart className="h-4 w-4 mb-1 text-muted-foreground" />
                        <span>14 Saves</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <MessageCircle className="h-4 w-4 mb-1 text-muted-foreground" />
                        <span>3 Inquiries</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="border-t bg-gray-50 p-3 flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditListing(product.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleOpenBoostDialog(product)}
                      className="flex items-center gap-1"
                      disabled={isProductBoosted(product)}
                    >
                      <Sparkle className="h-4 w-4" />
                      {isProductBoosted(product) ? "Boosted" : "Boost"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <p className="font-medium">{order.productName}</p>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Customer: {order.customerName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {order.quantity}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Date: {formatDate(order.date)}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <span className="font-semibold text-lg">
                        ${order.amount}
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm">
                          <Truck className="h-4 w-4 mr-2" />
                          Ship
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="h-8 w-8 mr-2" />
                  Revenue chart would be implemented here
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.topSellingProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <span className="text-sm font-medium">#{index + 1}</span>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ${product.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input id="storeName" placeholder="Your Store Name" />
                </div>
                <div>
                  <Label htmlFor="storeEmail">Contact Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    placeholder="store@example.com"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="storeDescription">Store Description</Label>
                <Textarea
                  id="storeDescription"
                  placeholder="Describe your store..."
                />
              </div>
              <div className="flex gap-4">
                <Button>Save Changes</Button>
                <Button variant="outline">Reset</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Boost Product Dialog */}
      <Dialog open={showBoostDialog} onOpenChange={setShowBoostDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Boost Product Visibility</DialogTitle>
            <DialogDescription>
              Boosted products appear in the sponsored section across the
              marketplace for greater visibility.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <h4 className="text-sm font-medium mb-3">Select Boost Duration:</h4>
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
                  <CardContent className="p-3 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{option.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-blue-600">
                        ${option.price}
                      </span>
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
              Boost Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product listing? This action
              cannot be undone.
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
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellerDashboard;
