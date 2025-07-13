import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ArrowRight,
  Grid,
  List,
  SlidersHorizontal,
  Search,
  Filter,
  Star,
  Eye,
  ShoppingCart,
  Heart,
  MapPin,
  Truck,
  Shield,
  CreditCard,
} from "lucide-react";
import {
  MarketplaceProvider,
  useMarketplace,
} from "@/contexts/MarketplaceContext";
import ProductGrid from "@/components/marketplace/ProductGrid";
import ProductFilters from "@/components/marketplace/ProductFilters";
import FeaturedProducts from "@/components/marketplace/FeaturedProducts";
import SponsoredProducts from "@/components/marketplace/SponsoredProducts";
import CategoryMenu from "@/components/marketplace/CategoryMenu";
import CampaignsAndBoostingSystem from "@/components/marketplace/CampaignsAndBoostingSystem";
import SmartRecommendations from "@/components/marketplace/SmartRecommendations";
import SellerDashboard from "@/components/marketplace/SellerDashboard";
import ListProductForm from "@/components/marketplace/ListProductForm";
import WishlistProducts from "@/components/marketplace/WishlistProducts";
import EnhancedProductDetail from "@/components/marketplace/EnhancedProductDetail";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const MarketplaceContent = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [countdownTime, setCountdownTime] = useState({
    days: 2,
    hours: 14,
    minutes: 23,
    seconds: 45,
  });
  const [flashCountdown, setFlashCountdown] = useState({
    hours: 23,
    minutes: 45,
    seconds: 12,
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const {
    addToCart,
    addToWishlist,
    setFilter,
    sponsoredProducts,
    featuredProducts,
    isLoading,
  } = useMarketplace();

  // Redirect to auth if trying to access protected tabs while not authenticated
  useEffect(() => {
    if (
      !isAuthenticated &&
      (activeTab === "dashboard" || activeTab === "list")
    ) {
      setActiveTab("browse");
      toast({
        title: "Authentication required",
        description: "Please sign in to access this feature",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, activeTab, toast]);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownTime((prev) => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }

        return { days, hours, minutes, seconds };
      });

      setFlashCountdown((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setFilter({ category: category === "all" ? undefined : category });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilter({ searchQuery: query });
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

    try {
      addToCart(productId);
      toast({
        title: "Added to cart",
        description: "Product has been added to your cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      });
    }
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

    try {
      addToWishlist(productId);
      toast({
        title: "Added to wishlist",
        description: "Product has been added to your wishlist",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to wishlist",
        variant: "destructive",
      });
    }
  };

  const handleListProductSuccess = () => {
    toast({
      title: "Product Listed",
      description:
        "Your product has been successfully listed on the marketplace",
    });
    setActiveTab("dashboard");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Category Navigation Bar */}
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Marketplace</h2>
            <div className="w-full sm:w-auto overflow-x-auto">
              <TabsList className="min-w-max bg-gray-100 w-full sm:w-auto">
                <TabsTrigger value="browse" className="text-sm">
                  All Products
                </TabsTrigger>
                <TabsTrigger value="sponsored" className="text-sm">
                  Featured
                </TabsTrigger>
                {isAuthenticated && (
                  <>
                    <TabsTrigger value="dashboard" className="text-sm">
                      My Store
                    </TabsTrigger>
                    <TabsTrigger value="list" className="text-sm">
                      Sell
                    </TabsTrigger>
                    <TabsTrigger value="wishlist" className="text-sm">
                      Wishlist
                    </TabsTrigger>
                  </>
                )}
              </TabsList>
            </div>
          </div>
        </div>

        {/* Browse Products Tab */}
        <TabsContent value="browse" className="space-y-8 pt-4">
          {/* Enhanced Product Detail View */}
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
              {/* Advanced Search Bar */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search products, brands, or categories..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10 h-12"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relevance">Best Match</SelectItem>
                          <SelectItem value="price_low">
                            Price: Low to High
                          </SelectItem>
                          <SelectItem value="price_high">
                            Price: High to Low
                          </SelectItem>
                          <SelectItem value="rating">
                            Customer Rating
                          </SelectItem>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="bestselling">
                            Best Selling
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setShowAdvancedFilters(!showAdvancedFilters)
                        }
                        className="flex items-center gap-2"
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                      </Button>
                      <div className="flex border rounded-lg">
                        <Button
                          variant={viewMode === "grid" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("grid")}
                        >
                          <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={viewMode === "list" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("list")}
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Filters Panel */}
                  {showAdvancedFilters && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Price Range
                          </label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Min"
                              value={priceRange.min}
                              onChange={(e) =>
                                setPriceRange((prev) => ({
                                  ...prev,
                                  min: e.target.value,
                                }))
                              }
                            />
                            <Input
                              placeholder="Max"
                              value={priceRange.max}
                              onChange={(e) =>
                                setPriceRange((prev) => ({
                                  ...prev,
                                  max: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Rating
                          </label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Any rating" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="4">4+ Stars</SelectItem>
                              <SelectItem value="3">3+ Stars</SelectItem>
                              <SelectItem value="2">2+ Stars</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Condition
                          </label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Any condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="used">Used</SelectItem>
                              <SelectItem value="refurbished">
                                Refurbished
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Shipping
                          </label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Any shipping" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">
                                Free Shipping
                              </SelectItem>
                              <SelectItem value="fast">
                                Fast Delivery
                              </SelectItem>
                              <SelectItem value="local">
                                Local Pickup
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Campaign Banners */}
              <div className="space-y-4">
                {/* Black Friday Campaign Banner */}
                <Card className="bg-gradient-to-r from-black to-gray-800 text-white overflow-hidden">
                  <CardContent className="p-6 relative">
                    <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-sm font-bold transform rotate-12 translate-x-2">
                      HOT DEAL
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">
                          🔥 BLACK FRIDAY MEGA SALE
                        </h2>
                        <p className="text-gray-300 mb-3">
                          Up to 70% OFF on electronics and fashion
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="bg-red-500 px-3 py-1 rounded text-sm font-bold">
                            30% OFF
                          </div>
                          <div className="text-sm">
                            Ends in:{" "}
                            <span
                              className="font-mono font-bold text-red-400"
                              id="countdown-timer"
                            >
                              {countdownTime.days}d {countdownTime.hours}h{" "}
                              {countdownTime.minutes}m
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => {
                          setActiveCategory("electronics");
                          setFilter({ category: "electronics" });
                          toast({
                            title: "Black Friday Sale!",
                            description:
                              "Browsing electronics with special discounts!",
                          });
                        }}
                      >
                        Shop Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Flash Sale Banner */}
                <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">⚡</div>
                        <div>
                          <h3 className="text-lg font-bold">
                            FLASH SALE - 50% OFF Digital Products!
                          </h3>
                          <p className="text-orange-100 text-sm">
                            Limited time offer - Don't miss out!
                          </p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold" id="flash-countdown">
                          {String(flashCountdown.hours).padStart(2, "0")}:
                          {String(flashCountdown.minutes).padStart(2, "0")}:
                          {String(flashCountdown.seconds).padStart(2, "0")}
                        </div>
                        <p className="text-xs text-orange-100">Time left</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Trust & Security Banner */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center gap-8 text-sm text-blue-800">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Buyer Protection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      <span>Fast Shipping</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      <span>Verified Reviews</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {featuredProducts.length > 0 && (
                <FeaturedProducts
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                />
              )}

              {sponsoredProducts.length > 0 && (
                <SponsoredProducts
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                />
              )}

              {/* AI Smart Recommendations */}
              <SmartRecommendations
                onProductClick={(product) => setSelectedProduct(product.id)}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                onQuickView={(product) => setSelectedProduct(product.id)}
                maxItems={8}
                enableRealTimeUpdates={true}
              />

              <div className="flex flex-col md:flex-row gap-6">
                <aside className="w-full md:w-64 shrink-0">
                  <CategoryMenu
                    activeCategory={activeCategory}
                    onCategoryChange={handleCategoryChange}
                  />
                  <ProductFilters
                    activeCategory={activeCategory}
                    onCategoryChange={handleCategoryChange}
                    onSearch={handleSearch}
                  />
                </aside>

                <main className="flex-1">
                  {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array(6)
                        .fill(0)
                        .map((_, i) => (
                          <Skeleton key={i} className="h-[320px] rounded-lg" />
                        ))}
                    </div>
                  ) : (
                    <ProductGrid
                      category={activeCategory}
                      searchQuery={searchQuery}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                      onViewProduct={(product) =>
                        setSelectedProduct(product.id)
                      }
                    />
                  )}
                </main>
              </div>
            </>
          )}
        </TabsContent>

        {/* Sponsored Products Tab */}
        <TabsContent value="sponsored" className="space-y-8 pt-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-[320px] rounded-lg" />
                ))}
            </div>
          ) : sponsoredProducts.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Boosted Products</h2>
              <ProductGrid
                products={sponsoredProducts}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                onViewProduct={(product) => setSelectedProduct(product.id)}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">
                No Boosted Products
              </h3>
              <p className="text-muted-foreground">
                There are currently no boosted products in the marketplace.
              </p>
            </div>
          )}
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
              <h3 className="text-lg font-semibold mb-2">
                Authentication Required
              </h3>
              <p className="text-muted-foreground mb-4">
                Please sign in to list a product
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
              <h3 className="text-lg font-semibold mb-2">
                Authentication Required
              </h3>
              <p className="text-muted-foreground mb-4">
                Please sign in to view your wishlist
              </p>
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Marketplace = () => {
  return (
    <MarketplaceProvider>
      <MarketplaceContent />
    </MarketplaceProvider>
  );
};

export default Marketplace;
