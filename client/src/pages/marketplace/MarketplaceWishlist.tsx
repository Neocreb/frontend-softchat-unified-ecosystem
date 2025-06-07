
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartOff, ShoppingCart, ChevronLeft, Heart, Trash } from "lucide-react";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

const MarketplaceWishlist = () => {
  const { wishlist, removeFromWishlist, addToCart, setActiveProduct } = useMarketplace();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleAddToCart = (productId: string) => {
    addToCart(productId);
    toast({
      title: "Added to Cart",
      description: "Product has been added to your cart",
    });
  };
  
  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
  };
  
  const handleViewProduct = (product: any) => {
    setActiveProduct(product);
    // TODO: Navigate to product detail page once created
    // navigate(`/marketplace/product/${product.id}`);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="container py-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/marketplace")}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Your Wishlist</h1>
          <p className="text-muted-foreground">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/marketplace/cart')}
          className="flex items-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          View Cart
        </Button>
      </div>
      
      {wishlist.length === 0 ? (
        <Card className="bg-gray-50">
          <CardContent className="pt-6 text-center">
            <div className="py-12 space-y-4">
              <HeartOff className="h-16 w-16 text-gray-300 mx-auto" />
              <h3 className="text-xl font-medium">Your Wishlist is Empty</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                You haven't added any products to your wishlist yet. Browse the marketplace and save items for later.
              </p>
              <Button 
                className="mt-4"
                onClick={() => navigate('/marketplace')}
              >
                Browse Products
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {wishlist.map(item => (
            <Card key={item.productId} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div 
                  className="sm:w-40 h-40 sm:h-auto cursor-pointer"
                  onClick={() => handleViewProduct(item.product)}
                >
                  <img 
                    src={item.product.image} 
                    alt={item.product.name}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col sm:flex-row">
                  <div className="flex-1">
                    <div className="mb-1">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                        {item.product.category}
                      </Badge>
                      {item.product.isSponsored && (
                        <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 hover:bg-amber-50">
                          Sponsored
                        </Badge>
                      )}
                    </div>
                    <h3 
                      className="text-lg font-medium mb-1 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleViewProduct(item.product)}
                    >
                      {item.product.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-2">
                      {item.product.discountPrice ? (
                        <>
                          <span className="font-semibold">${item.product.discountPrice.toFixed(2)}</span>
                          <span className="text-sm text-muted-foreground line-through">
                            ${item.product.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="font-semibold">${item.product.price.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <Heart className="h-3.5 w-3.5 mr-1 text-red-500 fill-red-500" />
                        <span>Added {formatDate(item.addedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col gap-2 justify-end items-center sm:items-end mt-4 sm:mt-0">
                    <Button
                      onClick={() => handleAddToCart(item.productId)}
                      className="w-full sm:w-auto flex items-center gap-2"
                      disabled={!item.product.inStock}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {item.product.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveFromWishlist(item.productId)}
                      className="text-muted-foreground hover:text-red-600 hover:border-red-200"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketplaceWishlist;
