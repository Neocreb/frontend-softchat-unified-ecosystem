
import { useState } from "react";
import ProductGrid from "@/components/marketplace/ProductGrid";
import ProductFilters from "@/components/marketplace/ProductFilters";
import FeaturedProducts from "@/components/marketplace/FeaturedProducts";
import { useToast } from "@/components/ui/use-toast";

const Marketplace = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { toast } = useToast();
  
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleAddToCart = (productId: string) => {
    toast({
      title: "Added to cart",
      description: "Product has been added to your cart",
    });
  };
  
  return (
    <div className="container py-6 space-y-8">
      <h1 className="text-2xl font-bold">Marketplace</h1>
      
      <FeaturedProducts onAddToCart={handleAddToCart} />
      
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 shrink-0">
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
          />
        </main>
      </div>
    </div>
  );
};

export default Marketplace;
