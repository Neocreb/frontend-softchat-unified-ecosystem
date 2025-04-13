
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Star } from "lucide-react";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
};

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleLike = () => {
    setIsLiked(!isLiked);
  };
  
  const handleAddToCart = () => {
    onAddToCart(product.id);
  };
  
  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;
  
  return (
    <Card 
      className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative pt-[100%] overflow-hidden bg-muted">
        <img 
          src={product.image} 
          alt={product.name} 
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
        
        {product.isNew && (
          <Badge className="absolute top-2 left-2 bg-softchat-primary">New</Badge>
        )}
        
        {product.discountPrice && (
          <Badge className="absolute top-2 right-2 bg-red-500">-{discountPercentage}%</Badge>
        )}
        
        <Button
          variant="outline"
          size="icon"
          className={`absolute top-2 right-2 h-8 w-8 rounded-full ${product.discountPrice ? "right-16" : ""} ${
            isLiked ? "bg-red-100 text-red-500 border-red-200" : "bg-white/80 backdrop-blur-sm"
          }`}
          onClick={handleLike}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
        </Button>
      </div>
      
      <CardHeader className="p-3 pb-0">
        <div className="text-sm text-muted-foreground">{product.category}</div>
        <h3 className="font-medium line-clamp-2 h-12">{product.name}</h3>
      </CardHeader>
      
      <CardContent className="p-3 pt-1 flex-grow">
        <div className="flex items-center gap-1 text-sm">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span>{product.rating.toFixed(1)}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 flex justify-between items-center">
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
          className="h-8"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          <ShoppingCart className="h-4 w-4 mr-1" />
          {product.inStock ? "Add" : "Sold Out"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
