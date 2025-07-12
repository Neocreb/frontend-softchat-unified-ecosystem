import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Zap,
  CreditCard,
  Truck,
  Shield,
  Check,
  Clock,
  AlertCircle,
  MapPin,
  Lock,
} from "lucide-react";
import { Product, Address, PaymentMethod, Order } from "@/types/marketplace";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { cn } from "@/lib/utils";

interface QuickPurchaseProps {
  product: Product;
  quantity?: number;
  selectedVariant?: string;
  onOrderComplete?: (order: Order) => void;
  className?: string;
}

const QuickPurchase = ({
  product,
  quantity = 1,
  selectedVariant,
  onOrderComplete,
  className,
}: QuickPurchaseProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const { addresses, paymentMethods, createOrder } = useMarketplace();
  const { toast } = useToast();

  // Load saved preferences
  useEffect(() => {
    if (isAuthenticated && addresses.length > 0) {
      // Use default address or first available
      const defaultAddress =
        addresses.find((addr) => addr.isDefault) || addresses[0];
      setSelectedAddress(defaultAddress.id);
    }

    if (isAuthenticated && paymentMethods.length > 0) {
      // Use default payment method or first available
      const defaultPayment =
        paymentMethods.find((pm) => pm.isDefault) || paymentMethods[0];
      setSelectedPayment(defaultPayment.id);
    }
  }, [isAuthenticated, addresses, paymentMethods]);

  const calculateTotal = () => {
    const itemPrice = product.discountPrice || product.price;
    const subtotal = itemPrice * quantity;
    const tax = subtotal * 0.08; // 8% tax
    const shipping = product.shippingInfo?.freeShipping
      ? 0
      : product.shippingInfo?.shippingCost || 5.99;
    return {
      subtotal,
      tax,
      shipping,
      total: subtotal + tax + shipping,
    };
  };

  const totals = calculateTotal();

  const selectedAddressData = addresses.find(
    (addr) => addr.id === selectedAddress,
  );
  const selectedPaymentData = paymentMethods.find(
    (pm) => pm.id === selectedPayment,
  );

  const handleQuickPurchase = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a purchase",
        variant: "destructive",
      });
      return;
    }

    if (!selectedAddress || !selectedPayment) {
      toast({
        title: "Missing Information",
        description: "Please select a shipping address and payment method",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const order: Order = {
        id: `order_${Date.now()}`,
        userId: user?.id || "",
        items: [
          {
            id: `item_${Date.now()}`,
            productId: product.id,
            productName: product.name,
            productImage: product.image,
            price: product.discountPrice || product.price,
            quantity,
            selectedVariant,
            sellerId: product.sellerId,
            sellerName: product.sellerName,
          },
        ],
        shippingAddress: selectedAddressData!,
        paymentMethod: selectedPaymentData!,
        subtotal: totals.subtotal,
        tax: totals.tax,
        shippingCost: totals.shipping,
        total: totals.total,
        status: "confirmed",
        paymentStatus: "paid",
        trackingNumber: `TRK${Date.now()}`,
        estimatedDelivery: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await createOrder(order);
      setOrderConfirmed(true);
      onOrderComplete?.(order);

      toast({
        title: "Order Confirmed!",
        description: `Your order #${order.id} has been placed successfully`,
      });

      // Auto-close after success
      setTimeout(() => {
        setIsOpen(false);
        setOrderConfirmed(false);
      }, 3000);
    } catch (error) {
      console.error("Order processing failed:", error);
      toast({
        title: "Order Failed",
        description:
          "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const isQuickPurchaseEnabled = () => {
    return (
      isAuthenticated &&
      addresses.length > 0 &&
      paymentMethods.length > 0 &&
      product.inStock
    );
  };

  if (orderConfirmed) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className={cn(
              "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800",
              className,
            )}
            disabled={!isQuickPurchaseEnabled()}
          >
            <Zap className="w-4 h-4 mr-2" />
            Quick Buy
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Order Confirmed!</h3>
            <p className="text-muted-foreground">
              Your order has been placed successfully. You'll receive a
              confirmation email shortly.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700",
            className,
          )}
          disabled={!isQuickPurchaseEnabled()}
        >
          <Zap className="w-4 h-4 mr-2" />
          Quick Buy
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-600" />
            Quick Purchase
          </DialogTitle>
          <DialogDescription>
            Complete your purchase in seconds with saved payment and shipping
            information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium line-clamp-1">{product.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Sold by {product.sellerName}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-semibold">
                      ${(product.discountPrice || product.price).toFixed(2)}
                    </span>
                    {product.discountPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      Qty: {quantity}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Shipping Address
            </Label>
            {addresses.length > 0 ? (
              <Select
                value={selectedAddress}
                onValueChange={setSelectedAddress}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shipping address" />
                </SelectTrigger>
                <SelectContent>
                  {addresses.map((address) => (
                    <SelectItem key={address.id} value={address.id}>
                      <div className="flex items-center gap-2">
                        <span>{address.name}</span>
                        {address.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {address.street}, {address.city}, {address.zipCode}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="p-4 border rounded-lg bg-muted/20">
                <p className="text-sm text-muted-foreground">
                  No saved addresses. Please add an address in your account
                  settings.
                </p>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment Method
            </Label>
            {paymentMethods.length > 0 ? (
              <Select
                value={selectedPayment}
                onValueChange={setSelectedPayment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((payment) => (
                    <SelectItem key={payment.id} value={payment.id}>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <span>**** **** **** {payment.lastFour}</span>
                        {payment.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="p-4 border rounded-lg bg-muted/20">
                <p className="text-sm text-muted-foreground">
                  No saved payment methods. Please add a payment method in your
                  account settings.
                </p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  Shipping
                </span>
                <span>
                  {totals.shipping === 0
                    ? "FREE"
                    : `$${totals.shipping.toFixed(2)}`}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${totals.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
            <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">Secure Purchase</p>
              <p className="text-blue-700">
                Your payment information is encrypted and secure. This purchase
                is protected by our buyer guarantee.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleQuickPurchase}
              disabled={isProcessing || !selectedAddress || !selectedPayment}
              className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Complete Purchase
                </>
              )}
            </Button>
          </div>

          {/* Estimated Delivery */}
          {selectedAddress && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
              <Clock className="w-4 h-4" />
              <span>
                Estimated delivery:{" "}
                {new Date(
                  Date.now() + 7 * 24 * 60 * 60 * 1000,
                ).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickPurchase;
