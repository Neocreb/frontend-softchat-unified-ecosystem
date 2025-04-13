
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { Product } from "./ProductCard";

// Import mockProducts from ProductGrid
const mockProducts = [
  {
    id: "1",
    name: "Wireless Noise Cancelling Headphones",
    description: "Premium wireless headphones with active noise cancellation",
    price: 299.99,
    discountPrice: 249.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
    category: "electronics",
    rating: 4.8,
    inStock: true,
    isNew: true,
    isFeatured: true,
  },
  {
    id: "3",
    name: "Premium Cotton T-Shirt",
    description: "Comfortable 100% cotton t-shirt with modern fit",
    price: 29.99,
    discountPrice: 19.99,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHQlMjBzaGlydHxlbnwwfHwwfHx8MA%3D%3D",
    category: "clothing",
    rating: 4.2,
    inStock: true,
    isFeatured: true,
  },
  {
    id: "6",
    name: "Organic Face Serum",
    description: "Hydrating serum with natural ingredients",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNraW5jYXJlfGVufDB8fDB8fHww",
    category: "beauty",
    rating: 4.9,
    inStock: true,
    isFeatured: true,
  },
];

interface FeaturedProductsProps {
  onAddToCart: (productId: string) => void;
}

const FeaturedProducts = ({ onAddToCart }: FeaturedProductsProps) => {
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      // Filter featured products
      const featured = mockProducts.filter(p => p.isFeatured);
      setFeaturedProducts(featured);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleAddToCart = (productId: string) => {
    onAddToCart(productId);
  };
  
  if (loading) {
    return (
      <Card className="overflow-hidden">
        <div className="p-4">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex flex-col space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }
  
  if (featuredProducts.length === 0) {
    return null;
  }
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Featured Products</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
                
                {product.isNew && (
                  <Badge className="absolute top-2 left-2 bg-softchat-primary">New</Badge>
                )}
                
                {product.discountPrice && (
                  <Badge className="absolute top-2 right-2 bg-red-500">
                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                  </Badge>
                )}
              </div>
              
              <div className="mt-3">
                <h3 className="text-sm font-medium">{product.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <div>
                    {product.discountPrice ? (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">${product.discountPrice.toFixed(2)}</span>
                        <span className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className="font-semibold">${product.price.toFixed(2)}</span>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedProducts;
