
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowRight } from "lucide-react";
import { MarketplaceProvider, useMarketplace } from "@/contexts/MarketplaceContext";
import ProductGrid from "@/components/marketplace/ProductGrid";
import ProductFilters from "@/components/marketplace/ProductFilters";
import FeaturedProducts from "@/components/marketplace/FeaturedProducts";
import SponsoredProducts from "@/components/marketplace/SponsoredProducts";
import CategoryMenu from "@/components/marketplace/CategoryMenu";
import SellerDashboard from "@/components/marketplace/SellerDashboard";
import ListProductForm from "@/components/marketplace/ListProductForm";
import WishlistProducts from "@/components/marketplace/WishlistProducts";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const MarketplaceContent = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const {
    addToCart,
    addToWishlist,
    setFilter,
    sponsoredProducts,
    featuredProducts,
    isLoading
  } = useMarketplace();

  // Redirect to auth if trying to access protected tabs while not authenticated
  useEffect(() => {
    if (!isAuthenticated && (activeTab === "dashboard" || activeTab === "list")) {
      setActiveTab("browse");
      toast({
        title: "Authentication required",
        description: "Please sign in to access this feature",
        variant: "destructive"
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

  const handleAddToCart = (productId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to your cart",
        variant: "destructive"
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
        variant: "destructive"
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
      description: "Your product has been successfully listed on the marketplace",
    });
    setActiveTab("dashboard");
  };

  return (
    <div className="container py-6 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Marketplace</h1>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="overflow-x-auto pb-2">
          <TabsList className="min-w-max">
            <TabsTrigger value="browse">Browse Products</TabsTrigger>
            <TabsTrigger value="sponsored">Boosted Products</TabsTrigger>
            {isAuthenticated && (
              <>
                <TabsTrigger value="dashboard">Seller Dashboard</TabsTrigger>
                <TabsTrigger value="list">List Product</TabsTrigger>
                <TabsTrigger value="wishlist">My Wishlist</TabsTrigger>
              </>
            )}
          </TabsList>
        </div>

        {/* Browse Products Tab */}
        <TabsContent value="browse" className="space-y-8 pt-4">
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
                  {Array(6).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-[320px] rounded-lg" />
                  ))}
                </div>
              ) : (
                <ProductGrid
                  category={activeCategory}
                  searchQuery={searchQuery}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                />
              )}
            </main>
          </div>
        </TabsContent>

        {/* Sponsored Products Tab */}
        <TabsContent value="sponsored" className="space-y-8 pt-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
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
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No Boosted Products</h3>
              <p className="text-muted-foreground">There are currently no boosted products in the marketplace.</p>
            </div>
          )}
        </TabsContent>

        {/* Seller Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4 pt-4">
          {isAuthenticated ? (
            <SellerDashboard />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
              <p className="text-muted-foreground mb-4">Please sign in to view your seller dashboard</p>
              <Button onClick={() => navigate('/auth')}>
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
              <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
              <p className="text-muted-foreground mb-4">Please sign in to list a product</p>
              <Button onClick={() => navigate('/auth')}>
                Sign In
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Wishlist Tab */}
        <TabsContent value="wishlist" className="space-y-4 pt-4">
          {isAuthenticated ? (
            <WishlistProducts
              onAddToCart={handleAddToCart}
            />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
              <p className="text-muted-foreground mb-4">Please sign in to view your wishlist</p>
              <Button onClick={() => navigate('/auth')}>
                Sign In
              </Button>
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
