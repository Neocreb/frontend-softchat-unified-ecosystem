import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  Star,
  MessageCircle,
  Download,
  Eye,
  Search,
  Filter,
  Calendar,
  MapPin,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Order, OrderStatus, Review } from "@/types/marketplace";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface OrderManagementProps {
  orders: Order[];
  userType: "buyer" | "seller";
  onUpdateOrderStatus?: (orderId: string, status: OrderStatus) => Promise<void>;
  onCancelOrder?: (orderId: string, reason: string) => Promise<void>;
  onRequestReturn?: (orderId: string, reason: string) => Promise<void>;
  onAddReview?: (
    productId: string,
    rating: number,
    content: string,
  ) => Promise<Review>;
  onMessageSeller?: (
    sellerId: string,
    message: string,
    orderId?: string,
  ) => Promise<void>;
  onDownloadInvoice?: (orderId: string) => Promise<void>;
}

export default function OrderManagement({
  orders,
  userType,
  onUpdateOrderStatus,
  onCancelOrder,
  onRequestReturn,
  onAddReview,
  onMessageSeller,
  onDownloadInvoice,
}: OrderManagementProps) {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [selectedProductForReview, setSelectedProductForReview] =
    useState<string>("");
  const [sortBy, setSortBy] = useState<string>("recent");

  const { toast } = useToast();

  // Filter and sort orders
  useEffect(() => {
    let filtered = [...orders];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.items.some(
            (item) =>
              item.productName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              item.sellerName.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "recent":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "amount-high":
        filtered.sort((a, b) => b.totalAmount - a.totalAmount);
        break;
      case "amount-low":
        filtered.sort((a, b) => a.totalAmount - b.totalAmount);
        break;
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchQuery, sortBy]);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "returned":
        return <RotateCcw className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "returned":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    if (!onUpdateOrderStatus) return;

    try {
      await onUpdateOrderStatus(orderId, status);
      toast({
        title: "Order updated",
        description: `Order status changed to ${status}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder || !onCancelOrder || !cancelReason.trim()) return;

    try {
      await onCancelOrder(selectedOrder.id, cancelReason);
      toast({
        title: "Order cancelled",
        description: "Your order has been cancelled successfully",
      });
      setShowCancelDialog(false);
      setCancelReason("");
      setSelectedOrder(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel order",
        variant: "destructive",
      });
    }
  };

  const handleRequestReturn = async () => {
    if (!selectedOrder || !onRequestReturn || !returnReason.trim()) return;

    try {
      await onRequestReturn(selectedOrder.id, returnReason);
      toast({
        title: "Return requested",
        description: "Your return request has been submitted",
      });
      setShowReturnDialog(false);
      setReturnReason("");
      setSelectedOrder(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request return",
        variant: "destructive",
      });
    }
  };

  const handleAddReview = async () => {
    if (!onAddReview || !selectedProductForReview || !reviewContent.trim())
      return;

    try {
      await onAddReview(selectedProductForReview, reviewRating, reviewContent);
      toast({
        title: "Review added",
        description: "Your review has been submitted successfully",
      });
      setShowReviewDialog(false);
      setReviewContent("");
      setReviewRating(5);
      setSelectedProductForReview("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add review",
        variant: "destructive",
      });
    }
  };

  const handleDownloadInvoice = async (orderId: string) => {
    if (!onDownloadInvoice) return;

    try {
      await onDownloadInvoice(orderId);
      toast({
        title: "Invoice downloaded",
        description: "Invoice has been downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download invoice",
        variant: "destructive",
      });
    }
  };

  const canCancelOrder = (order: Order) => {
    return ["pending", "confirmed"].includes(order.status);
  };

  const canRequestReturn = (order: Order) => {
    return order.status === "delivered" && userType === "buyer";
  };

  const canLeaveReview = (order: Order) => {
    return order.status === "delivered" && userType === "buyer";
  };

  const getOrderSummary = () => {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0,
    );
    const ordersByStatus = orders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return { totalOrders, totalSpent, ordersByStatus };
  };

  const summary = getOrderSummary();

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{summary.totalOrders}</div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {formatPrice(summary.totalSpent)}
                </div>
                <div className="text-sm text-gray-600">
                  {userType === "buyer" ? "Total Spent" : "Total Revenue"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {summary.ordersByStatus.delivered || 0}
                </div>
                <div className="text-sm text-gray-600">Delivered</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">
                  {summary.ordersByStatus.pending || 0}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders by ID or product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="amount-high">Highest Amount</SelectItem>
                <SelectItem value="amount-low">Lowest Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-gray-600">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters or search terms."
                  : "You haven't placed any orders yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-lg">
                        Order #{order.id}
                      </h3>
                      <Badge
                        className={cn(
                          "flex items-center gap-1",
                          getStatusColor(order.status),
                        )}
                      >
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </Badge>
                      {order.trackingNumber && (
                        <Badge variant="outline" className="text-xs">
                          Tracking: {order.trackingNumber}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span>
                          {order.items.length} item
                          {order.items.length > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span className="font-semibold text-lg text-primary">
                          {formatPrice(order.totalAmount)}
                        </span>
                      </div>
                      {order.estimatedDelivery && (
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          <span>
                            Est. {formatDate(order.estimatedDelivery)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Order Items Preview */}
                    <div className="space-y-2">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {item.productName}
                            </div>
                            <div className="text-xs text-gray-600">
                              Qty: {item.quantity} ×{" "}
                              {formatPrice(item.unitPrice)}
                            </div>
                            {userType === "seller" && (
                              <div className="text-xs text-gray-600">
                                Customer: {order.customerName}
                              </div>
                            )}
                          </div>
                          <div className="text-sm font-medium">
                            {formatPrice(item.totalPrice)}
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-sm text-gray-600 pl-15">
                          +{order.items.length - 2} more item
                          {order.items.length - 2 > 1 ? "s" : ""}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderDetails(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>

                    {userType === "seller" && order.status === "confirmed" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          handleUpdateStatus(order.id, "processing")
                        }
                      >
                        Mark Processing
                      </Button>
                    )}

                    {userType === "seller" && order.status === "processing" && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(order.id, "shipped")}
                      >
                        Mark Shipped
                      </Button>
                    )}

                    {userType === "buyer" && canCancelOrder(order) && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to cancel this order? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="my-4">
                            <Label htmlFor="cancel-reason">
                              Reason for cancellation
                            </Label>
                            <Textarea
                              id="cancel-reason"
                              placeholder="Please provide a reason for cancelling this order..."
                              value={cancelReason}
                              onChange={(e) => setCancelReason(e.target.value)}
                              className="mt-2"
                            />
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep Order</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                setSelectedOrder(order);
                                handleCancelOrder();
                              }}
                              className="bg-red-600 hover:bg-red-700"
                              disabled={!cancelReason.trim()}
                            >
                              Cancel Order
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}

                    {userType === "buyer" && canRequestReturn(order) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowReturnDialog(true);
                        }}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Return
                      </Button>
                    )}

                    {userType === "buyer" && canLeaveReview(order) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowReviewDialog(true);
                        }}
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadInvoice(order.id)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Invoice
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Order Details Modal */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Complete information about this order
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Status and Tracking */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Badge
                      className={cn(
                        "flex items-center gap-1 text-sm",
                        getStatusColor(selectedOrder.status),
                      )}
                    >
                      {getStatusIcon(selectedOrder.status)}
                      {selectedOrder.status.charAt(0).toUpperCase() +
                        selectedOrder.status.slice(1)}
                    </Badge>
                    {selectedOrder.trackingNumber && (
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        <span className="text-sm">
                          Tracking: {selectedOrder.trackingNumber}
                        </span>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Order Date:</span>{" "}
                      {formatDate(selectedOrder.createdAt)}
                    </div>
                    <div>
                      <span className="font-medium">Payment Status:</span>{" "}
                      {selectedOrder.paymentStatus}
                    </div>
                    {selectedOrder.estimatedDelivery && (
                      <div>
                        <span className="font-medium">Est. Delivery:</span>{" "}
                        {formatDate(selectedOrder.estimatedDelivery)}
                      </div>
                    )}
                    {selectedOrder.actualDelivery && (
                      <div>
                        <span className="font-medium">Delivered:</span>{" "}
                        {formatDate(selectedOrder.actualDelivery)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                      >
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.productName}</h4>
                          <p className="text-sm text-gray-600">
                            Seller: {item.sellerName}
                          </p>
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
                          <p className="text-sm">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {formatPrice(item.totalPrice)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatPrice(item.unitPrice)} each
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping and Billing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm">
                      <div className="font-medium">
                        {selectedOrder.shippingAddress.fullName}
                      </div>
                      {selectedOrder.shippingAddress.company && (
                        <div>{selectedOrder.shippingAddress.company}</div>
                      )}
                      <div>{selectedOrder.shippingAddress.addressLine1}</div>
                      {selectedOrder.shippingAddress.addressLine2 && (
                        <div>{selectedOrder.shippingAddress.addressLine2}</div>
                      )}
                      <div>
                        {selectedOrder.shippingAddress.city},{" "}
                        {selectedOrder.shippingAddress.state}{" "}
                        {selectedOrder.shippingAddress.postalCode}
                      </div>
                      <div>{selectedOrder.shippingAddress.country}</div>
                      {selectedOrder.shippingAddress.phone && (
                        <div>{selectedOrder.shippingAddress.phone}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Billing Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Payment Method:</span>{" "}
                        {selectedOrder.paymentMethod}
                      </div>
                      <div className="pt-2">
                        <div className="font-medium">
                          {selectedOrder.billingAddress.fullName}
                        </div>
                        <div>{selectedOrder.billingAddress.addressLine1}</div>
                        {selectedOrder.billingAddress.addressLine2 && (
                          <div>{selectedOrder.billingAddress.addressLine2}</div>
                        )}
                        <div>
                          {selectedOrder.billingAddress.city},{" "}
                          {selectedOrder.billingAddress.state}{" "}
                          {selectedOrder.billingAddress.postalCode}
                        </div>
                        <div>{selectedOrder.billingAddress.country}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatPrice(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>
                        {selectedOrder.shippingCost === 0
                          ? "Free"
                          : formatPrice(selectedOrder.shippingCost)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>{formatPrice(selectedOrder.taxAmount)}</span>
                    </div>
                    {selectedOrder.discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>
                          -{formatPrice(selectedOrder.discountAmount)}
                        </span>
                      </div>
                    )}
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>{formatPrice(selectedOrder.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              {selectedOrder.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Order Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedOrder.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Return Request Modal */}
      <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Return</DialogTitle>
            <DialogDescription>
              Please provide a reason for returning this order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="return-reason">Reason for return</Label>
              <Textarea
                id="return-reason"
                placeholder="Please explain why you want to return this order..."
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="mt-2"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowReturnDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRequestReturn}
                disabled={!returnReason.trim()}
              >
                Request Return
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Modal */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
            <DialogDescription>
              Share your experience with this product.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Product</Label>
              <Select
                value={selectedProductForReview}
                onValueChange={setSelectedProductForReview}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a product to review" />
                </SelectTrigger>
                <SelectContent>
                  {selectedOrder?.items.map((item, index) => (
                    <SelectItem key={index} value={item.productId}>
                      {item.productName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Rating</Label>
              <div className="flex items-center gap-1 mt-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-6 w-6 cursor-pointer transition-colors",
                      i < reviewRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300",
                    )}
                    onClick={() => setReviewRating(i + 1)}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="review-content">Review</Label>
              <Textarea
                id="review-content"
                placeholder="Share your thoughts about this product..."
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                className="mt-2"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowReviewDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddReview}
                disabled={!selectedProductForReview || !reviewContent.trim()}
              >
                Submit Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
