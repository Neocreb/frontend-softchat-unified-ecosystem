import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Truck,
  Shield,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Check,
  Clock,
  Package,
  Zap,
  DollarSign,
  Gift,
  AlertCircle,
  Lock,
  Users,
} from "lucide-react";
import DeliveryProviderSelection from "@/components/delivery/DeliveryProviderSelection";
import { CartItem, Address, PaymentMethod, Order } from "@/types/marketplace";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface EnhancedCheckoutFlowProps {
  cartItems: CartItem[];
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  onCreateOrder: (
    orderData: Omit<Order, "id" | "createdAt" | "updatedAt">,
  ) => Promise<Order>;
  onAddAddress: (address: Omit<Address, "id">) => Promise<Address>;
  onAddPaymentMethod: (
    method: Omit<PaymentMethod, "id" | "createdAt">,
  ) => Promise<PaymentMethod>;
  onApplyPromoCode: (
    code: string,
  ) => Promise<{ discount: number; description: string }>;
  onCalculateShipping: (addressId: string) => Promise<number>;
  onClose: () => void;
}

interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}

export default function EnhancedCheckoutFlow({
  cartItems,
  addresses,
  paymentMethods,
  onCreateOrder,
  onAddAddress,
  onAddPaymentMethod,
  onApplyPromoCode,
  onCalculateShipping,
  onClose,
}: EnhancedCheckoutFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedShippingAddress, setSelectedShippingAddress] =
    useState<string>("");
  const [selectedBillingAddress, setSelectedBillingAddress] =
    useState<string>("");
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState<string>("standard");
  const [selectedDeliveryProvider, setSelectedDeliveryProvider] = useState<any>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<string>("standard");
  const [showDeliverySelection, setShowDeliverySelection] = useState(false);
  const [hasPhysicalItems, setHasPhysicalItems] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    discount: number;
    description: string;
  } | null>(null);
  const [orderNotes, setOrderNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});
  const [newPaymentMethod, setNewPaymentMethod] = useState<
    Partial<PaymentMethod>
  >({});
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0,
  });

  const { toast } = useToast();

  // Initialize default selections
  useEffect(() => {
    const defaultShipping =
      addresses.find((addr) => addr.isDefault && addr.type === "shipping") ||
      addresses[0];
    const defaultBilling =
      addresses.find((addr) => addr.isDefault && addr.type === "billing") ||
      addresses[0];
    const defaultPayment =
      paymentMethods.find((pm) => pm.isDefault) || paymentMethods[0];

    if (defaultShipping) setSelectedShippingAddress(defaultShipping.id!);
    if (defaultBilling) setSelectedBillingAddress(defaultBilling.id!);
    if (defaultPayment) setSelectedPaymentMethod(defaultPayment.id);

    // Check if cart contains physical items
    const physicalItems = cartItems.some(item =>
      item.product.type === "physical" || !item.product.type
    );
    setHasPhysicalItems(physicalItems);
  }, [addresses, paymentMethods, cartItems]);

  // Calculate order summary
  useEffect(() => {
    const calculateSummary = async () => {
      const subtotal = cartItems.reduce(
        (sum, item) =>
          sum +
          (item.product.discountPrice || item.product.price) * item.quantity,
        0,
      );

      let shipping = 0;
      if (selectedShippingAddress && hasPhysicalItems) {
        try {
          if (selectedDeliveryProvider) {
            // Use delivery provider pricing
            shipping = selectedDeliveryProvider.estimatedFee || 0;
          } else {
            // Use traditional shipping calculation
            shipping = await onCalculateShipping(selectedShippingAddress);
            if (selectedShippingMethod === "express") shipping += 10;
            if (selectedShippingMethod === "overnight") shipping += 25;
          }
        } catch (error) {
          console.error("Failed to calculate shipping:", error);
        }
      }

      const tax = subtotal * 0.08; // 8% tax rate
      const discount = appliedPromo?.discount || 0;
      const total = subtotal + shipping + tax - discount;

      setOrderSummary({ subtotal, shipping, tax, discount, total });
    };

    calculateSummary();
  }, [
    cartItems,
    selectedShippingAddress,
    selectedShippingMethod,
    appliedPromo,
    onCalculateShipping,
  ]);

  const steps = [
    { id: 1, title: "Shipping", icon: Truck },
    { id: 2, title: "Payment", icon: CreditCard },
    { id: 3, title: "Review", icon: Check },
  ];

  const shippingMethods = [
    {
      id: "standard",
      name: "Standard Shipping",
      time: "5-7 business days",
      price: 0,
    },
    {
      id: "express",
      name: "Express Shipping",
      time: "2-3 business days",
      price: 10,
    },
    {
      id: "overnight",
      name: "Overnight Shipping",
      time: "1 business day",
      price: 25,
    },
  ];

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) return;

    try {
      const result = await onApplyPromoCode(promoCode);
      setAppliedPromo(result);
      toast({
        title: "Promo code applied",
        description: result.description,
      });
    } catch (error) {
      toast({
        title: "Invalid promo code",
        description: "The promo code you entered is not valid or has expired.",
        variant: "destructive",
      });
    }
  };

  const handleAddAddress = async () => {
    if (
      !newAddress.fullName ||
      !newAddress.addressLine1 ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.postalCode ||
      !newAddress.country
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const address = await onAddAddress(newAddress as Omit<Address, "id">);
      setSelectedShippingAddress(address.id!);
      setShowAddAddressModal(false);
      setNewAddress({});
      toast({
        title: "Address added",
        description: "Your new address has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddPaymentMethod = async () => {
    if (!newPaymentMethod.name || !newPaymentMethod.type) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const method = await onAddPaymentMethod(
        newPaymentMethod as Omit<PaymentMethod, "id" | "createdAt">,
      );
      setSelectedPaymentMethod(method.id);
      setShowAddPaymentModal(false);
      setNewPaymentMethod({});
      toast({
        title: "Payment method added",
        description: "Your new payment method has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save payment method. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedShippingAddress || !selectedPaymentMethod) {
      toast({
        title: "Missing information",
        description: "Please select shipping address and payment method.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const shippingAddress = addresses.find(
        (addr) => addr.id === selectedShippingAddress,
      )!;
      const billingAddress = useSameAddress
        ? shippingAddress
        : addresses.find((addr) => addr.id === selectedBillingAddress)!;
      const paymentMethod = paymentMethods.find(
        (pm) => pm.id === selectedPaymentMethod,
      )!;

      const orderData: Omit<Order, "id" | "createdAt" | "updatedAt"> = {
        customerId: "current-user", // This would come from auth context
        customerName: shippingAddress.fullName,
        customerEmail: "user@example.com", // This would come from auth context
        items: cartItems.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.image,
          sellerId: item.product.sellerId,
          sellerName: item.product.sellerName,
          quantity: item.quantity,
          unitPrice: item.product.discountPrice || item.product.price,
          totalPrice:
            (item.product.discountPrice || item.product.price) * item.quantity,
          selectedVariants: item.selectedVariants,
          status: "pending",
        })),
        subtotal: orderSummary.subtotal,
        shippingCost: orderSummary.shipping,
        taxAmount: orderSummary.tax,
        discountAmount: orderSummary.discount,
        totalAmount: orderSummary.total,
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: paymentMethod.name,
        shippingAddress,
        billingAddress,
        notes: orderNotes,
      };

      const order = await onCreateOrder(orderData);

      toast({
        title: "Order placed successfully!",
        description: `Your order #${order.id} has been placed and will be processed soon.`,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Order failed",
        description:
          "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            Complete your order by providing shipping and payment information.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step Indicator */}
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                      currentStep >= step.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-gray-300 text-gray-500",
                    )}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span
                    className={cn(
                      "ml-2 text-sm font-medium",
                      currentStep >= step.id ? "text-primary" : "text-gray-500",
                    )}
                  >
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "mx-4 h-0.5 w-16 transition-colors",
                        currentStep > step.id ? "bg-primary" : "bg-gray-300",
                      )}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Shipping Address */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-base font-semibold">
                        Shipping Address
                      </Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddAddressModal(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New
                      </Button>
                    </div>
                    <RadioGroup
                      value={selectedShippingAddress}
                      onValueChange={setSelectedShippingAddress}
                    >
                      {addresses
                        .filter(
                          (addr) => !addr.type || addr.type === "shipping",
                        )
                        .map((address) => (
                          <div
                            key={address.id}
                            className="flex items-start space-x-2"
                          >
                            <RadioGroupItem
                              value={address.id!}
                              id={address.id}
                              className="mt-1"
                            />
                            <Label
                              htmlFor={address.id}
                              className="flex-1 cursor-pointer"
                            >
                              <Card className="p-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="font-medium">
                                      {address.fullName}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {address.company && (
                                        <div>{address.company}</div>
                                      )}
                                      <div>{address.addressLine1}</div>
                                      {address.addressLine2 && (
                                        <div>{address.addressLine2}</div>
                                      )}
                                      <div>
                                        {address.city}, {address.state}{" "}
                                        {address.postalCode}
                                      </div>
                                      <div>{address.country}</div>
                                      {address.phone && (
                                        <div>{address.phone}</div>
                                      )}
                                    </div>
                                  </div>
                                  {address.isDefault && (
                                    <Badge variant="secondary">Default</Badge>
                                  )}
                                </div>
                              </Card>
                            </Label>
                          </div>
                        ))}
                    </RadioGroup>
                  </div>

                  {/* Shipping Method */}
                  <div>
                    <Label className="text-base font-semibold mb-4 block">
                      Shipping Method
                    </Label>
                    <RadioGroup
                      value={selectedShippingMethod}
                      onValueChange={setSelectedShippingMethod}
                    >
                      {shippingMethods.map((method) => (
                        <div
                          key={method.id}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem value={method.id} id={method.id} />
                          <Label
                            htmlFor={method.id}
                            className="flex-1 cursor-pointer"
                          >
                            <Card className="p-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium flex items-center gap-2">
                                    {method.name}
                                    {method.id === "express" && (
                                      <Zap className="h-4 w-4 text-yellow-500" />
                                    )}
                                    {method.id === "overnight" && (
                                      <Clock className="h-4 w-4 text-red-500" />
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {method.time}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium">
                                    {method.price === 0
                                      ? "Free"
                                      : formatPrice(method.price)}
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Billing Address */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <Checkbox
                        id="same-address"
                        checked={useSameAddress}
                        onCheckedChange={setUseSameAddress}
                      />
                      <Label htmlFor="same-address">
                        Billing address is the same as shipping address
                      </Label>
                    </div>

                    {!useSameAddress && (
                      <div>
                        <Label className="text-base font-semibold mb-4 block">
                          Billing Address
                        </Label>
                        <RadioGroup
                          value={selectedBillingAddress}
                          onValueChange={setSelectedBillingAddress}
                        >
                          {addresses
                            .filter(
                              (addr) => !addr.type || addr.type === "billing",
                            )
                            .map((address) => (
                              <div
                                key={address.id}
                                className="flex items-start space-x-2"
                              >
                                <RadioGroupItem
                                  value={address.id!}
                                  id={`billing-${address.id}`}
                                  className="mt-1"
                                />
                                <Label
                                  htmlFor={`billing-${address.id}`}
                                  className="flex-1 cursor-pointer"
                                >
                                  <Card className="p-3">
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <div className="font-medium">
                                          {address.fullName}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          {address.company && (
                                            <div>{address.company}</div>
                                          )}
                                          <div>{address.addressLine1}</div>
                                          {address.addressLine2 && (
                                            <div>{address.addressLine2}</div>
                                          )}
                                          <div>
                                            {address.city}, {address.state}{" "}
                                            {address.postalCode}
                                          </div>
                                          <div>{address.country}</div>
                                        </div>
                                      </div>
                                      {address.isDefault && (
                                        <Badge variant="secondary">
                                          Default
                                        </Badge>
                                      )}
                                    </div>
                                  </Card>
                                </Label>
                              </div>
                            ))}
                        </RadioGroup>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-base font-semibold">
                        Payment Method
                      </Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddPaymentModal(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New
                      </Button>
                    </div>
                    <RadioGroup
                      value={selectedPaymentMethod}
                      onValueChange={setSelectedPaymentMethod}
                    >
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className="flex items-start space-x-2"
                        >
                          <RadioGroupItem
                            value={method.id}
                            id={method.id}
                            className="mt-1"
                          />
                          <Label
                            htmlFor={method.id}
                            className="flex-1 cursor-pointer"
                          >
                            <Card className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <CreditCard className="h-5 w-5 text-gray-500" />
                                  <div>
                                    <div className="font-medium">
                                      {method.name}
                                    </div>
                                    {method.type === "card" && (
                                      <div className="text-sm text-gray-600">
                                        Expires {method.expiryMonth}/
                                        {method.expiryYear}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {method.isDefault && (
                                  <Badge variant="secondary">Default</Badge>
                                )}
                              </div>
                            </Card>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Promo Code */}
                  <div>
                    <Label className="text-base font-semibold mb-4 block">
                      Promo Code
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleApplyPromoCode} variant="outline">
                        Apply
                      </Button>
                    </div>
                    {appliedPromo && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center gap-2 text-green-800">
                          <Gift className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {appliedPromo.description}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    Order Review
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Items */}
                  <div>
                    <Label className="text-base font-semibold mb-4 block">
                      Order Items
                    </Label>
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div
                          key={`${item.productId}-${JSON.stringify(item.selectedVariants)}`}
                          className="flex items-center gap-3 p-3 border rounded-lg"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <div className="font-medium">
                              {item.product.name}
                            </div>
                            {item.selectedVariants && (
                              <div className="text-sm text-gray-600">
                                {Object.entries(item.selectedVariants).map(
                                  ([key, value]) => (
                                    <span key={key} className="mr-2">
                                      {key}: {value}
                                    </span>
                                  ),
                                )}
                              </div>
                            )}
                            <div className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {formatPrice(
                                (item.product.discountPrice ||
                                  item.product.price) * item.quantity,
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Notes */}
                  <div>
                    <Label
                      htmlFor="order-notes"
                      className="text-base font-semibold"
                    >
                      Order Notes (Optional)
                    </Label>
                    <Textarea
                      id="order-notes"
                      placeholder="Any special instructions for your order..."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  {/* Security Notice */}
                  <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <div className="text-sm text-blue-800">
                      <div className="font-medium">Secure Checkout</div>
                      <div>
                        Your payment information is encrypted and secure.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              <div className="flex gap-2">
                {currentStep < 3 ? (
                  <Button
                    onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                    disabled={
                      (currentStep === 1 && !selectedShippingAddress) ||
                      (currentStep === 2 && !selectedPaymentMethod)
                    }
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={
                      isProcessing ||
                      !selectedShippingAddress ||
                      !selectedPaymentMethod
                    }
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isProcessing ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Place Order
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(orderSummary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {orderSummary.shipping === 0
                        ? "Free"
                        : formatPrice(orderSummary.shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatPrice(orderSummary.tax)}</span>
                  </div>
                  {orderSummary.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(orderSummary.discount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(orderSummary.total)}</span>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4" />
                    <span>Buyer Protection</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Lock className="h-4 w-4" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="h-4 w-4" />
                    <span>30-Day Returns</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Address Modal */}
        <Dialog
          open={showAddAddressModal}
          onOpenChange={setShowAddAddressModal}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={newAddress.fullName || ""}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={newAddress.company || ""}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        company: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="addressLine1">Address Line 1 *</Label>
                <Input
                  id="addressLine1"
                  value={newAddress.addressLine1 || ""}
                  onChange={(e) =>
                    setNewAddress((prev) => ({
                      ...prev,
                      addressLine1: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                  id="addressLine2"
                  value={newAddress.addressLine2 || ""}
                  onChange={(e) =>
                    setNewAddress((prev) => ({
                      ...prev,
                      addressLine2: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={newAddress.city || ""}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={newAddress.state || ""}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        state: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    value={newAddress.postalCode || ""}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        postalCode: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Select
                  value={newAddress.country || ""}
                  onValueChange={(value) =>
                    setNewAddress((prev) => ({ ...prev, country: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="United Kingdom">
                      United Kingdom
                    </SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newAddress.phone || ""}
                  onChange={(e) =>
                    setNewAddress((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddAddressModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddAddress}>Save Address</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Payment Method Modal */}
        <Dialog
          open={showAddPaymentModal}
          onOpenChange={setShowAddPaymentModal}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Payment Type</Label>
                <Select
                  value={newPaymentMethod.type || ""}
                  onValueChange={(value) =>
                    setNewPaymentMethod((prev) => ({
                      ...prev,
                      type: value as any,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="bank">Bank Account</SelectItem>
                    <SelectItem value="wallet">Digital Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newPaymentMethod.type === "card" && (
                <>
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={newPaymentMethod.last4 || ""}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(-4);
                        setNewPaymentMethod((prev) => ({
                          ...prev,
                          last4: value,
                          name: `Card ending in ${value}`,
                        }));
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryMonth">Expiry Month</Label>
                      <Select
                        value={newPaymentMethod.expiryMonth?.toString() || ""}
                        onValueChange={(value) =>
                          setNewPaymentMethod((prev) => ({
                            ...prev,
                            expiryMonth: parseInt(value),
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {String(i + 1).padStart(2, "0")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="expiryYear">Expiry Year</Label>
                      <Select
                        value={newPaymentMethod.expiryYear?.toString() || ""}
                        onValueChange={(value) =>
                          setNewPaymentMethod((prev) => ({
                            ...prev,
                            expiryYear: parseInt(value),
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = new Date().getFullYear() + i;
                            return (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
              {newPaymentMethod.type && newPaymentMethod.type !== "card" && (
                <div>
                  <Label htmlFor="paymentName">Payment Method Name</Label>
                  <Input
                    id="paymentName"
                    placeholder="e.g., My Bank Account"
                    value={newPaymentMethod.name || ""}
                    onChange={(e) =>
                      setNewPaymentMethod((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddPaymentModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddPaymentMethod}>
                  Save Payment Method
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
