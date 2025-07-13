import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  ChevronLeft,
  Trash,
  Plus,
  Minus,
  RefreshCw,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

const MarketplaceCart = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, getCartTotal } =
    useMarketplace();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description:
          "Your cart is empty. Add some products before checking out.",
        variant: "destructive",
      });
      return;
    }

    navigate("/app/marketplace/checkout");
  };

  const subTotal = getCartTotal();
  const shippingCost = subTotal > 0 ? 5.99 : 0;
  const tax = subTotal * 0.08; // 8% tax
  const total = subTotal + shippingCost + tax;

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="container py-6">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/app/marketplace")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Your Cart</h1>
          <p className="text-muted-foreground">
            {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/app/marketplace/wishlist")}
          className="hidden sm:flex items-center gap-2"
        >
          View Wishlist
        </Button>
      </div>

      {cart.length === 0 ? (
        <Card className="bg-gray-50">
          <CardContent className="pt-6 text-center">
            <div className="py-12 space-y-4">
              <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto" />
              <h3 className="text-xl font-medium">Your Cart is Empty</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                You haven't added any products to your cart yet. Browse the
                marketplace to find products you love.
              </p>
              <Button
                className="mt-4"
                onClick={() => navigate("/app/marketplace")}
              >
                Browse Products
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">Shopping Cart</h2>
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-red-600"
                    onClick={clearCart}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Clear Cart
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="divide-y">
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="py-4 flex flex-col sm:flex-row gap-4"
                  >
                    <div
                      className="sm:w-24 h-24 sm:h-24 flex-shrink-0 cursor-pointer"
                      onClick={() =>
                        navigate(`/app/marketplace/product/${item.productId}`)
                      }
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                        <div>
                          <Badge variant="outline" className="mb-1">
                            {item.product.category}
                          </Badge>
                          <h3
                            className="font-medium cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() =>
                              navigate(
                                `/app/marketplace/product/${item.productId}`,
                              )
                            }
                          >
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Seller: {item.product.sellerName}
                          </p>

                          <div className="flex items-baseline gap-2">
                            {item.product.discountPrice ? (
                              <>
                                <span className="font-semibold">
                                  ${item.product.discountPrice.toFixed(2)}
                                </span>
                                <span className="text-sm text-muted-foreground line-through">
                                  ${item.product.price.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="font-semibold">
                                ${item.product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 mt-2 sm:mt-0">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 p-0"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.productId,
                                  item.quantity - 1,
                                )
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <div className="w-10 text-center">
                              <Input
                                className="h-8 text-center border-0 focus-visible:ring-0"
                                value={item.quantity}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (!isNaN(value) && value > 0) {
                                    handleUpdateQuantity(item.productId, value);
                                  }
                                }}
                                type="number"
                                min="1"
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 p-0"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.productId,
                                  item.quantity + 1,
                                )
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-red-600"
                            onClick={() => handleRemoveItem(item.productId)}
                          >
                            <Trash className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>

                      <div className="mt-2 text-right text-sm font-semibold">
                        Subtotal: $
                        {(
                          (item.product.discountPrice || item.product.price) *
                          item.quantity
                        ).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>

              <CardFooter className="flex justify-between border-t bg-gray-50">
                <Button
                  variant="outline"
                  onClick={() => navigate("/app/marketplace")}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Continue Shopping
                </Button>

                <Button
                  onClick={() => setIsProcessing(true)}
                  className="hidden sm:flex items-center gap-2"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Updating Cart...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Update Cart
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="border-b">
                <h2 className="text-lg font-medium">Order Summary</h2>
              </CardHeader>

              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subTotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatCurrency(shippingCost)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>

                <div className="text-sm text-muted-foreground">
                  Shipping and taxes will be calculated at checkout
                </div>
              </CardContent>

              <CardFooter className="border-t bg-gray-50 flex-col gap-3">
                <Button
                  className="w-full flex items-center gap-2"
                  onClick={handleCheckout}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Proceed to Checkout
                </Button>

                <div className="text-xs text-center text-muted-foreground">
                  By proceeding to checkout, you agree to our terms of service
                  and privacy policy.
                </div>
              </CardFooter>
            </Card>

            <div className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-3">Have a promo code?</h3>
                  <div className="flex gap-2">
                    <Input placeholder="Enter promo code" />
                    <Button variant="outline">Apply</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceCart;
