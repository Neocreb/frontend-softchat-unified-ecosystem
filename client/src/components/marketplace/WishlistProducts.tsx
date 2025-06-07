
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";

interface WishlistProductsProps {
  onAddToCart: (productId: string) => void;
}

const WishlistProducts = ({ onAddToCart }: WishlistProductsProps) => {
  const { wishlist, removeFromWishlist, setActiveProduct, isLoading } = useMarketplace();
  const { toast } = useToast();
  
  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
    toast({
      title: "Removed from wishlist",
      description: "Product has been removed from your wishlist"
    });
  };
  
  const handleViewProduct = (product: any) => {
    setActiveProduct(product);
    // TODO: Navigate to product detail page once created
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Wishlist</h2>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-[320px] rounded-lg" />
          ))}
        </div>
      ) : wishlist.length === 0 ? (
        <Card className="bg-gray-50 p-8 text-center">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="rounded-full bg-gray-100 p-4">
              <Heart className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium">Your wishlist is empty</h3>
            <p className="text-muted-foreground max-w-md">
              Save products you're interested in by clicking the heart icon on product cards.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <Card key={item.productId} className="overflow-hidden group">
              <div className="relative h-48">
                <img 
                  src={item.product.image} 
                  alt={item.product.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-colors flex items-center justify-center">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleViewProduct(item.product)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-medium truncate">{item.product.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <span className="font-semibold text-green-600">
                      ${(item.product.discountPrice || item.product.price).toFixed(2)}
                    </span>
                    {item.product.discountPrice && (
                      <span className="text-gray-400 text-sm line-through ml-2">
                        ${item.product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    Added {formatDistanceToNow(new Date(item.addedAt), { addSuffix: true })}
                  </span>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    onClick={() => onAddToCart(item.productId)}
                    className="flex-1"
                    variant="default"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button 
                    onClick={() => handleRemoveFromWishlist(item.productId)}
                    variant="outline"
                    size="icon"
                  >
                    <Heart className="h-4 w-4 fill-current text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistProducts;
