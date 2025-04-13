
import { useState, useEffect } from "react";
import ProductCard, { Product } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

// Mock product data
const mockProducts: Product[] = [
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
    id: "2",
    name: "Smart Watch Series 5",
    description: "Track your fitness and stay connected with this smart watch",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D",
    category: "electronics",
    rating: 4.5,
    inStock: true,
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
    id: "4",
    name: "Designer Sunglasses",
    description: "UV protection sunglasses with polarized lenses",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
    category: "accessories",
    rating: 4.7,
    inStock: false,
  },
  {
    id: "5",
    name: "Portable Bluetooth Speaker",
    description: "Waterproof speaker with 20 hours battery life",
    price: 89.99,
    discountPrice: 69.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ymx1ZXRvb3RoJTIwc3BlYWtlcnxlbnwwfHwwfHx8MA%3D%3D",
    category: "electronics",
    rating: 4.4,
    inStock: true,
    isNew: true,
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
  {
    id: "7",
    name: "Running Shoes",
    description: "Lightweight breathable shoes for runners",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8fDA%3D",
    category: "footwear",
    rating: 4.6,
    inStock: true,
  },
  {
    id: "8",
    name: "Coffee Maker",
    description: "Programmable drip coffee maker with thermal carafe",
    price: 149.99,
    discountPrice: 119.99,
    image: "https://images.unsplash.com/photo-1544486361-2ed1d35c1270?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y29mZmVlJTIwbWFrZXJ8ZW58MHx8MHx8fDA%3D",
    category: "home",
    rating: 4.3,
    inStock: true,
  },
];

interface ProductGridProps {
  category: string;
  searchQuery: string;
  onAddToCart: (productId: string) => void;
}

const ProductGrid = ({ category, searchQuery, onAddToCart }: ProductGridProps) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      let filteredProducts = [...mockProducts];
      
      // Filter by category if not "all"
      if (category !== "all") {
        filteredProducts = filteredProducts.filter(
          product => product.category === category
        );
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(
          product => 
            product.name.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query)
        );
      }
      
      setProducts(filteredProducts);
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [category, searchQuery]);
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index}>
            <div className="pt-[100%] relative">
              <Skeleton className="absolute inset-0" />
            </div>
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex justify-between">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-9 w-1/3" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">No products found</h3>
        <p className="text-muted-foreground mt-2">
          Try changing your search or filter criteria
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={onAddToCart} 
        />
      ))}
    </div>
  );
};

export default ProductGrid;

import { Card } from "@/components/ui/card";
