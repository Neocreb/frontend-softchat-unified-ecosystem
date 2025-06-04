
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Package } from "lucide-react";
import { Link } from "react-router-dom";

const MarketplaceSection = () => {
  const [wishlistCount] = useState(3);
  const [cartCount] = useState(2);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Shopping Cart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{cartCount}</div>
            <p className="text-sm text-muted-foreground mb-4">Items in cart</p>
            <Button asChild className="w-full">
              <Link to="/marketplace">View Cart</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Wishlist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{wishlistCount}</div>
            <p className="text-sm text-muted-foreground mb-4">Saved items</p>
            <Button variant="outline" asChild className="w-full">
              <Link to="/marketplace">View Wishlist</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-5 w-5" />
              Marketplace
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Browse products & earn rewards</p>
            <Button variant="outline" asChild className="w-full">
              <Link to="/marketplace">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketplaceSection;
