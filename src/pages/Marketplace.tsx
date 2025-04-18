
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { MarketplaceProvider, useMarketplace } from "@/contexts/MarketplaceContext";
import ProductGrid from "@/components/marketplace/ProductGrid";
import ProductFilters from "@/components/marketplace/ProductFilters";
import FeaturedProducts from "@/components/marketplace/FeaturedProducts";
import SponsoredProducts from "@/components/marketplace/SponsoredProducts";
import CategoryMenu from "@/components/marketplace/CategoryMenu";
import { useAuth } from "@/contexts/AuthContext";

const MarketplaceContent = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart, addToWishlist, setFilter, sponsoredProducts } = useMarketplace();
  
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setFilter({ category: category === "all" ? undefined : category });
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilter({ searchQuery: query });
  };
  
  const handleAddToCart = (productId: string) => {
    addToCart(productId);
    toast({
      title: "Added to cart",
      description: "Product has been added to your cart",
    });
  };

  const handleAddToWishlist = (productId: string) => {
    addToWishlist(productId);
    toast({
      title: "Added to wishlist",
      description: "Product has been added to your wishlist",
    });
  };

  const handleCreateListing = () => {
    navigate("/marketplace/list");
  };
  
  return (
    <div className="container py-6 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Marketplace</h1>
        
        {isAuthenticated && (
          <Button onClick={handleCreateListing} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>List Product</span>
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="space-y-8">
          <FeaturedProducts 
            onAddToCart={handleAddToCart} 
            onAddToWishlist={handleAddToWishlist}
          />
          
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
              <ProductGrid 
                category={activeCategory}
                searchQuery={searchQuery}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            </main>
          </div>
        </TabsContent>
        
        <TabsContent value="featured" className="space-y-8">
          <FeaturedProducts 
            showAll
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        </TabsContent>
        
        <TabsContent value="recent" className="space-y-8">
          <ProductGrid 
            sortBy="recent"
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        </TabsContent>
        
        <TabsContent value="popular" className="space-y-8">
          <ProductGrid 
            sortBy="popular"
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
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
