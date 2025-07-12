import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MarketplaceProvider } from "@/contexts/MarketplaceContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Smartphone, BarChart } from "lucide-react";
import { Product } from "@/types/marketplace";

// Import our enhanced components
import EnhancedProductBrowser from "@/components/marketplace/EnhancedProductBrowser";
import SuperEnhancedProductDetail from "@/components/marketplace/SuperEnhancedProductDetail";
import AdvancedSearchFilter from "@/components/marketplace/AdvancedSearchFilter";
import MobileMarketplace from "@/components/marketplace/MobileMarketplace";
import MarketplaceAnalytics from "@/components/marketplace/MarketplaceAnalytics";

// Import original components for fallback
import ProductGrid from "@/components/marketplace/ProductGrid";
import SellerDashboard from "@/components/marketplace/SellerDashboard";
import ListProductForm from "@/components/marketplace/ListProductForm";
import WishlistProducts from "@/components/marketplace/WishlistProducts";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EnhancedMarketplaceContent = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("browse");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [useEnhancedMode, setUseEnhancedMode] = useState(true);
  const [showProductDetail, setShowProductDetail] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Redirect to auth if trying to access protected tabs while not authenticated
  useEffect(() => {
    if (
      !isAuthenticated &&
      (activeTab === "dashboard" ||
        activeTab === "list" ||
        activeTab === "wishlist" ||
        activeTab === "analytics")
    ) {
      setActiveTab("browse");
      toast({
        title: "Authentication required",
        description: "Please sign in to access this feature",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, activeTab, toast]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  const handleFiltersChange = (filters: any) => {
    // Handle filter changes from AdvancedSearchFilter
    console.log("Filters changed:", filters);
  };

  const handleListProductSuccess = () => {
    toast({
      title: "Product Listed",
      description:
        "Your product has been successfully listed on the marketplace",
    });
    setActiveTab("dashboard");
  };

  // Show mobile version on small screens
  if (isMobile) {
    return <MobileMarketplace onProductSelect={handleProductSelect} />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header with Enhanced Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Enhanced Marketplace
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Experience our next-generation marketplace with advanced features
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={useEnhancedMode ? "default" : "outline"}
            size="sm"
            onClick={() => setUseEnhancedMode(!useEnhancedMode)}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Enhanced Mode
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMobile(true)}
            className="flex items-center gap-2"
          >
            <Smartphone className="h-4 w-4" />
            Mobile View
          </Button>
        </div>
      </div>

      {/* Feature Highlights */}
      {useEnhancedMode && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">
                    AI-Powered Search
                  </h3>
                  <p className="text-sm text-blue-700">
                    Smart suggestions and recommendations
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-purple-900">
                    Advanced Analytics
                  </h3>
                  <p className="text-sm text-purple-700">
                    Real-time marketplace insights
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-green-900">
                    Mobile Optimized
                  </h3>
                  <p className="text-sm text-green-700">
                    Seamless mobile experience
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto pb-2">
          <TabsList className="min-w-max">
            <TabsTrigger value="browse">Browse Products</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            {isAuthenticated && (
              <>
                <TabsTrigger value="dashboard">Seller Dashboard</TabsTrigger>
                <TabsTrigger value="list">List Product</TabsTrigger>
                <TabsTrigger value="wishlist">My Wishlist</TabsTrigger>
                <TabsTrigger value="cart">My Cart</TabsTrigger>
                <TabsTrigger value="orders">My Orders</TabsTrigger>
                <TabsTrigger value="analytics">
                  <BarChart className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
              </>
            )}
          </TabsList>
        </div>

        {/* Browse Products Tab */}
        <TabsContent value="browse" className="space-y-8 pt-4">
          {/* Enhanced Product Detail View */}
          {showProductDetail && selectedProduct ? (
            <div>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowProductDetail(false);
                  setSelectedProduct(null);
                }}
                className="mb-4"
              >
                ← Back to Products
              </Button>
              {useEnhancedMode ? (
                <SuperEnhancedProductDetail
                  productId={selectedProduct.id}
                  onClose={() => {
                    setShowProductDetail(false);
                    setSelectedProduct(null);
                  }}
                />
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2">
                    Product Details
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Enable Enhanced Mode for the full product detail experience
                  </p>
                  <Button
                    onClick={() => setUseEnhancedMode(true)}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Enable Enhanced Mode
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              {useEnhancedMode ? (
                <>
                  {/* Advanced Search and Filters */}
                  <AdvancedSearchFilter
                    onFiltersChange={handleFiltersChange}
                    showSaveSearch={isAuthenticated}
                    className="mb-6"
                  />

                  {/* Enhanced Product Browser */}
                  <EnhancedProductBrowser
                    onProductSelect={handleProductSelect}
                  />
                </>
              ) : (
                <>
                  {/* Legacy Mode with Basic Components */}
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-yellow-900">
                              Standard Marketplace Mode
                            </h3>
                            <p className="text-sm text-yellow-700">
                              You're using the basic marketplace experience.
                              Enable Enhanced Mode for advanced features!
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => setUseEnhancedMode(true)}
                          className="bg-yellow-600 hover:bg-yellow-700"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Upgrade Experience
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Basic Product Grid */}
                  <ProductGrid
                    category="all"
                    searchQuery=""
                    onAddToCart={(productId) => {
                      toast({
                        title: "Added to cart",
                        description: "Item has been added to your cart",
                      });
                    }}
                    onAddToWishlist={(productId) => {
                      toast({
                        title: "Added to wishlist",
                        description: "Item has been saved to your wishlist",
                      });
                    }}
                  />
                </>
              )}
            </>
          )}
        </TabsContent>

        {/* Featured Tab */}
        <TabsContent value="featured" className="space-y-8 pt-4">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Featured Products</h3>
            <p className="text-gray-600 mb-4">
              Discover hand-picked products and trending items
            </p>
            {useEnhancedMode ? (
              <EnhancedProductBrowser
                onProductSelect={handleProductSelect}
                initialFilters={{ categories: [], sortBy: "popular" }}
                showAdvanced={false}
                compactMode={true}
              />
            ) : (
              <div>
                <p className="text-gray-500 mb-4">
                  Enable Enhanced Mode for the full featured products experience
                </p>
                <Button
                  onClick={() => setUseEnhancedMode(true)}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Enable Enhanced Mode
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Seller Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4 pt-4">
          {isAuthenticated ? (
            <SellerDashboard />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">
                Authentication Required
              </h3>
              <p className="text-muted-foreground mb-4">
                Please sign in to view your seller dashboard
              </p>
              <Button onClick={() => (window.location.href = "/auth")}>
                Sign In
              </Button>
            </div>
          )}
        </TabsContent>

        {/* List Product Tab */}
        <TabsContent value="list" className="space-y-4 pt-4">
          {isAuthenticated ? (
            <ListProductForm onSuccess={handleListProductSuccess} />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">
                Authentication Required
              </h3>
              <p className="text-muted-foreground mb-4">
                Please sign in to list a product
              </p>
              <Button onClick={() => (window.location.href = "/auth")}>
                Sign In
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Wishlist Tab */}
        <TabsContent value="wishlist" className="space-y-4 pt-4">
          {isAuthenticated ? (
            <WishlistProducts
              onAddToCart={(productId) => {
                toast({
                  title: "Added to cart",
                  description: "Item has been moved to your cart",
                });
              }}
            />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">
                Authentication Required
              </h3>
              <p className="text-muted-foreground mb-4">
                Please sign in to view your wishlist
              </p>
              <Button onClick={() => (window.location.href = "/auth")}>
                Sign In
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Cart Tab */}
        <TabsContent value="cart" className="space-y-4 pt-4">
          {isAuthenticated ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">Shopping Cart</h3>
              <p className="text-muted-foreground mb-4">
                View and manage items in your cart
              </p>
              <Button
                onClick={() => (window.location.href = "/app/marketplace/cart")}
              >
                Go to Cart
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">
                Authentication Required
              </h3>
              <p className="text-muted-foreground mb-4">
                Please sign in to view your cart
              </p>
              <Button onClick={() => (window.location.href = "/auth")}>
                Sign In
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4 pt-4">
          {isAuthenticated ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">My Orders</h3>
              <p className="text-muted-foreground mb-4">
                Track and manage your marketplace orders
              </p>
              <Button
                onClick={() =>
                  (window.location.href = "/app/marketplace/orders")
                }
              >
                View Orders
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">
                Authentication Required
              </h3>
              <p className="text-muted-foreground mb-4">
                Please sign in to view your orders
              </p>
              <Button onClick={() => (window.location.href = "/auth")}>
                Sign In
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4 pt-4">
          {isAuthenticated ? (
            useEnhancedMode ? (
              <MarketplaceAnalytics showRecommendations={true} />
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">
                  Enhanced Analytics
                </h3>
                <p className="text-gray-600 mb-4">
                  Advanced marketplace analytics are available in Enhanced Mode
                </p>
                <Button
                  onClick={() => setUseEnhancedMode(true)}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Enable Enhanced Mode
                </Button>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">
                Authentication Required
              </h3>
              <p className="text-muted-foreground mb-4">
                Please sign in to view marketplace analytics
              </p>
              <Button onClick={() => (window.location.href = "/auth")}>
                Sign In
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default function EnhancedMarketplace() {
  return (
    <MarketplaceProvider>
      <EnhancedMarketplaceContent />
    </MarketplaceProvider>
  );
}
