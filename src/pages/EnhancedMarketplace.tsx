import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Grid,
  List,
  Search,
  Star,
  Eye,
  ShoppingCart,
  Heart,
  MapPin,
  Truck,
  Shield,
  CreditCard,
  Zap,
  BarChart3,
  MessageCircle,
  Settings,
  Award,
  Package,
  TrendingUp,
  Scale,
  Headphones,
} from "lucide-react";
import {
  MarketplaceProvider,
  useMarketplace,
} from "@/contexts/MarketplaceContext";

// Import all the enhanced components
import EnhancedProductGrid from "@/components/marketplace/EnhancedProductGrid";
import ProductFilters from "@/components/marketplace/ProductFilters";
import FeaturedProducts from "@/components/marketplace/FeaturedProducts";
import SponsoredProducts from "@/components/marketplace/SponsoredProducts";
import CategoryMenu from "@/components/marketplace/CategoryMenu";
import EnhancedSellerDashboard from "@/components/marketplace/EnhancedSellerDashboard";
import ListProductForm from "@/components/marketplace/ListProductForm";
import WishlistProducts from "@/components/marketplace/WishlistProducts";
import EnhancedProductDetail from "@/components/marketplace/EnhancedProductDetail";
import QuickPurchase from "@/components/marketplace/QuickPurchase";
import ProductComparison from "@/components/marketplace/ProductComparison";
import ProductSharing from "@/components/marketplace/ProductSharing";
import SellerVerification from "@/components/marketplace/SellerVerification";
import BuyerProtection from "@/components/marketplace/BuyerProtection";
import EnhancedReviewSystem from "@/components/marketplace/EnhancedReviewSystem";
import InventoryTracker from "@/components/marketplace/InventoryTracker";
import ShippingTracker from "@/components/marketplace/ShippingTracker";
import MarketingTools from "@/components/marketplace/MarketingTools";
import CustomerSupport from "@/components/marketplace/CustomerSupport";
import SavedPaymentMethods from "@/components/marketplace/SavedPaymentMethods";
import SavedAddresses from "@/components/marketplace/SavedAddresses";

import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const EnhancedMarketplaceContent = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [comparisonProducts, setComparisonProducts] = useState<string[]>([]);

  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const {
    addToCart,
    addToWishlist,
    setFilter,
    sponsoredProducts,
    featuredProducts,
    products,
    isLoading,
  } = useMarketplace();

  // Redirect to auth if trying to access protected tabs while not authenticated
  useEffect(() => {
    if (
      !isAuthenticated &&
      (activeTab === "dashboard" ||
        activeTab === "list" ||
        activeTab === "inventory" ||
        activeTab === "marketing" ||
        activeTab === "verification")
    ) {
      setActiveTab("browse");
      toast({
        title: "Authentication required",
        description: "Please sign in to access seller features",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, activeTab, toast]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setFilter({ category: category === "all" ? undefined : category });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilter({ searchQuery: query });
  };

  const handleSortChange = (sortBy: string, sortOrder: string) => {
    setSortBy(sortBy);
    setSortOrder(sortOrder as "asc" | "desc");
    setFilter({ sortBy, sortOrder });
  };

  const handleAddToCart = (productId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    addToCart(productId);
    toast({
      title: "Added to cart",
      description: "Product has been added to your cart",
    });
  };

  const handleAddToWishlist = (productId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to your wishlist",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    addToWishlist(productId);
    toast({
      title: "Added to wishlist",
      description: "Product has been added to your wishlist",
    });
  };

  const handleListProductSuccess = () => {
    toast({
      title: "Product Listed",
      description:
        "Your product has been successfully listed on the marketplace",
    });
    setActiveTab("dashboard");
  };

  const handleAddToComparison = (productId: string) => {
    if (comparisonProducts.length >= 4) {
      toast({
        title: "Comparison limit reached",
        description: "You can compare up to 4 products at once",
        variant: "destructive",
      });
      return;
    }

    if (comparisonProducts.includes(productId)) {
      toast({
        title: "Already in comparison",
        description: "This product is already in your comparison list",
        variant: "destructive",
      });
      return;
    }

    setComparisonProducts((prev) => [...prev, productId]);
    toast({
      title: "Added to comparison",
      description: "Product added to comparison list",
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Enhanced Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🚀 Enhanced Marketplace
          </h1>
          <p className="text-muted-foreground">
            Discover amazing products with world-class shopping experience
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          {comparisonProducts.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setActiveTab("compare")}
              className="relative"
            >
              <Scale className="w-4 h-4 mr-2" />
              Compare
              <Badge className="ml-2 h-5 w-5 p-0 text-xs">
                {comparisonProducts.length}
              </Badge>
            </Button>
          )}
          <CustomerSupport embedded />
        </div>
      </div>

      {/* Enhanced Features Banner */}
      <Card className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 border-none">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">
              ✨ All 10 Enhanced Features Active ✨
            </h2>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <Badge className="bg-green-600">🔍 Smart Search</Badge>
              <Badge className="bg-blue-600">⚡ Quick Purchase</Badge>
              <Badge className="bg-purple-600">📊 Advanced Analytics</Badge>
              <Badge className="bg-orange-600">🛡️ Trust & Safety</Badge>
              <Badge className="bg-pink-600">📱 Social Commerce</Badge>
              <Badge className="bg-indigo-600">⚖️ Product Comparison</Badge>
              <Badge className="bg-teal-600">📦 Inventory Tracking</Badge>
              <Badge className="bg-red-600">🎯 Marketing Tools</Badge>
              <Badge className="bg-yellow-600">🎧 Live Support</Badge>
              <Badge className="bg-gray-600">🚀 Performance Optimized</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto pb-2">
          <TabsList className="min-w-max">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Browse Products
            </TabsTrigger>
            <TabsTrigger value="compare" className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              Compare ({comparisonProducts.length})
            </TabsTrigger>
            <TabsTrigger value="sponsored" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Featured
            </TabsTrigger>
            {isAuthenticated && (
              <>
                <TabsTrigger
                  value="dashboard"
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  Seller Dashboard
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  List Product
                </TabsTrigger>
                <TabsTrigger
                  value="inventory"
                  className="flex items-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  Inventory
                </TabsTrigger>
                <TabsTrigger
                  value="marketing"
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  Marketing
                </TabsTrigger>
                <TabsTrigger
                  value="verification"
                  className="flex items-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  Verification
                </TabsTrigger>
                <TabsTrigger
                  value="wishlist"
                  className="flex items-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  Wishlist
                </TabsTrigger>
                <TabsTrigger
                  value="account"
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Account
                </TabsTrigger>
              </>
            )}
            <TabsTrigger value="support" className="flex items-center gap-2">
              <Headphones className="w-4 h-4" />
              Support
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Browse Products Tab - Enhanced */}
        <TabsContent value="browse" className="space-y-8 pt-4">
          {selectedProduct ? (
            <div>
              <Button
                variant="ghost"
                onClick={() => setSelectedProduct(null)}
                className="mb-4"
              >
                ← Back to Products
              </Button>
              <EnhancedProductDetail productId={selectedProduct} />
            </div>
          ) : (
            <>
              {/* Enhanced Trust & Security Banner */}
              <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
                    <BuyerProtection showCompact />
                    <div className="flex items-center gap-2 text-blue-800">
                      <Truck className="h-4 w-4" />
                      <span>Free Shipping Available</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-800">
                      <CreditCard className="h-4 w-4" />
                      <span>Secure Payments</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-800">
                      <Star className="h-4 w-4" />
                      <span>Verified Reviews</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Featured and Sponsored Products */}
              {featuredProducts && featuredProducts.length > 0 && (
                <FeaturedProducts
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                />
              )}

              {sponsoredProducts && sponsoredProducts.length > 0 && (
                <SponsoredProducts
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                />
              )}

              {/* Main Product Browsing */}
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Enhanced Sidebar */}
                <aside className="w-full lg:w-80 shrink-0 space-y-6">
                  <CategoryMenu
                    activeCategory={activeCategory}
                    onCategoryChange={handleCategoryChange}
                  />
                  <ProductFilters
                    activeCategory={activeCategory}
                    onCategoryChange={handleCategoryChange}
                    onSearch={handleSearch}
                    onSortChange={handleSortChange}
                  />
                </aside>

                {/* Enhanced Product Grid */}
                <main className="flex-1">
                  {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {Array(12)
                        .fill(0)
                        .map((_, i) => (
                          <Skeleton key={i} className="h-[400px] rounded-lg" />
                        ))}
                    </div>
                  ) : (
                    <EnhancedProductGrid
                      category={activeCategory}
                      searchQuery={searchQuery}
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                      viewMode={viewMode}
                      onViewModeChange={setViewMode}
                      maxProducts={50}
                    />
                  )}
                </main>
              </div>
            </>
          )}
        </TabsContent>

        {/* Product Comparison Tab */}
        <TabsContent value="compare" className="space-y-6 pt-4">
          <ProductComparison
            initialProducts={
              products?.filter((p) => comparisonProducts.includes(p.id)) || []
            }
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        </TabsContent>

        {/* Featured Products Tab */}
        <TabsContent value="sponsored" className="space-y-8 pt-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-[400px] rounded-lg" />
                ))}
            </div>
          ) : (sponsoredProducts && sponsoredProducts.length > 0) ||
            (featuredProducts && featuredProducts.length > 0) ? (
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Featured & Sponsored Products
              </h2>
              <EnhancedProductGrid
                products={[
                  ...(featuredProducts || []),
                  ...(sponsoredProducts || []),
                ]}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <Zap className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                No Featured Products
              </h3>
              <p className="text-muted-foreground">
                Check back later for featured and sponsored products.
              </p>
            </div>
          )}
        </TabsContent>

        {/* Enhanced Seller Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4 pt-4">
          {isAuthenticated ? (
            <EnhancedSellerDashboard />
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                Authentication Required
              </h3>
              <p className="text-muted-foreground mb-4">
                Please sign in to view your enhanced seller dashboard with
                advanced analytics
              </p>
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            </div>
          )}
        </TabsContent>

        {/* List Product Tab */}
        <TabsContent value="list" className="space-y-4 pt-4">
          {isAuthenticated ? (
            <ListProductForm onSuccess={handleListProductSuccess} />
          ) : (
            <div className="text-center py-12">
              <Plus className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                Authentication Required
              </h3>
              <p className="text-muted-foreground mb-4">
                Please sign in to list products on the marketplace
              </p>
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            </div>
          )}
        </TabsContent>

        {/* Inventory Management Tab */}
        <TabsContent value="inventory" className="space-y-4 pt-4">
          {isAuthenticated ? (
            <div className="space-y-6">
              <InventoryTracker />
              <ShippingTracker />
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                Authentication Required
              </h3>
              <p className="text-muted-foreground mb-4">
                Please sign in to access inventory management tools
              </p>
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            </div>
          )}
        </TabsContent>

        {/* Marketing Tools Tab */}
        <TabsContent value="marketing" className="space-y-4 pt-4">
          {isAuthenticated ? (
            <MarketingTools />
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                Authentication Required
              </h3>
              <p className="text-muted-foreground mb-4">
                Please sign in to access marketing tools and analytics
              </p>
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            </div>
          )}
        </TabsContent>

        {/* Seller Verification Tab */}
        <TabsContent value="verification" className="space-y-4 pt-4">
          {isAuthenticated ? (
            <SellerVerification />
          ) : (
            <div className="text-center py-12">
              <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                Authentication Required
              </h3>
              <p className="text-muted-foreground mb-4">
                Please sign in to access seller verification
              </p>
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            </div>
          )}
        </TabsContent>

        {/* Wishlist Tab */}
        <TabsContent value="wishlist" className="space-y-4 pt-4">
          {isAuthenticated ? (
            <WishlistProducts onAddToCart={handleAddToCart} />
          ) : (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                Authentication Required
              </h3>
              <p className="text-muted-foreground mb-4">
                Please sign in to view your wishlist
              </p>
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            </div>
          )}
        </TabsContent>

        {/* Account Management Tab */}
        <TabsContent value="account" className="space-y-6 pt-4">
          {isAuthenticated ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SavedPaymentMethods />
              <SavedAddresses />
            </div>
          ) : (
            <div className="text-center py-12">
              <Settings className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                Authentication Required
              </h3>
              <p className="text-muted-foreground mb-4">
                Please sign in to manage your account settings
              </p>
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            </div>
          )}
        </TabsContent>

        {/* Customer Support Tab */}
        <TabsContent value="support" className="space-y-4 pt-4">
          <CustomerSupport />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const EnhancedMarketplace = () => {
  return (
    <MarketplaceProvider>
      <EnhancedMarketplaceContent />
    </MarketplaceProvider>
  );
};

export default EnhancedMarketplace;
