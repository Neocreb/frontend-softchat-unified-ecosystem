import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  MoreHorizontal,
  Download,
  MessageSquare,
  Star,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Order } from "@/types/marketplace";

const MarketplaceOrders = () => {
  const { isAuthenticated, user } = useAuth();
  const { orders, getOrdersByUser, cancelOrder, markOrderAsDelivered } =
    useMarketplace();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      getOrdersByUser(user.id);
    }
  }, [isAuthenticated, user, getOrdersByUser]);

  useEffect(() => {
    if (orders) {
      let filtered = orders;
      if (activeTab !== "all") {
        filtered = orders.filter((order) => order.status === activeTab);
      }
      setFilteredOrders(filtered);
    }
  }, [orders, activeTab]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "shipped":
        return <Truck className="h-4 w-4 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      toast({
        title: "Order Cancelled",
        description: "Your order has been successfully cancelled.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsDelivered = async (orderId: string) => {
    try {
      await markOrderAsDelivered(orderId);
      toast({
        title: "Order Marked as Delivered",
        description: "Thank you for confirming delivery!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    }
  };

  const orderCounts = {
    all: orders?.length || 0,
    pending: orders?.filter((o) => o.status === "pending").length || 0,
    confirmed: orders?.filter((o) => o.status === "confirmed").length || 0,
    shipped: orders?.filter((o) => o.status === "shipped").length || 0,
    delivered: orders?.filter((o) => o.status === "delivered").length || 0,
    cancelled: orders?.filter((o) => o.status === "cancelled").length || 0,
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-4">
              Please sign in to view your orders
            </p>
            <Button onClick={() => (window.location.href = "/auth")}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">
          Track and manage your marketplace orders
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All ({orderCounts.all})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({orderCounts.pending})
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Confirmed ({orderCounts.confirmed})
          </TabsTrigger>
          <TabsTrigger value="shipped">
            Shipped ({orderCounts.shipped})
          </TabsTrigger>
          <TabsTrigger value="delivered">
            Delivered ({orderCounts.delivered})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({orderCounts.cancelled})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
                <p className="text-muted-foreground mb-4">
                  {activeTab === "all"
                    ? "You haven't placed any orders yet."
                    : `No orders with ${activeTab} status.`}
                </p>
                <Button
                  onClick={() => (window.location.href = "/app/marketplace")}
                >
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Order #{order.id}
                          {getStatusIcon(order.status)}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Placed on{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Contact Seller
                            </DropdownMenuItem>
                            {order.status === "delivered" && (
                              <DropdownMenuItem>
                                <Star className="h-4 w-4 mr-2" />
                                Leave Review
                              </DropdownMenuItem>
                            )}
                            {(order.status === "pending" ||
                              order.status === "confirmed") && (
                              <DropdownMenuItem
                                onClick={() => handleCancelOrder(order.id)}
                                className="text-red-600"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel Order
                              </DropdownMenuItem>
                            )}
                            {order.status === "shipped" && (
                              <DropdownMenuItem
                                onClick={() => handleMarkAsDelivered(order.id)}
                                className="text-green-600"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark as Delivered
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Order Items */}
                      <div className="space-y-2">
                        {order.items?.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg"
                          >
                            <img
                              src={
                                item.product?.images?.[0] || "/placeholder.jpg"
                              }
                              alt={item.product?.title || "Product"}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">
                                {item.product?.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                ${item.price * item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Summary */}
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          <p>Seller: {order.seller?.username}</p>
                          {order.trackingNumber && (
                            <p>Tracking: {order.trackingNumber}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            Total: ${order.totalAmount}
                          </p>
                        </div>
                      </div>

                      {/* Status-specific actions */}
                      {order.status === "shipped" && order.trackingNumber && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 text-blue-700">
                            <Truck className="h-4 w-4" />
                            <span className="font-medium">
                              Package is on the way!
                            </span>
                          </div>
                          <p className="text-sm text-blue-600 mt-1">
                            Track your package with number:{" "}
                            {order.trackingNumber}
                          </p>
                        </div>
                      )}

                      {order.status === "delivered" && (
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle className="h-4 w-4" />
                            <span className="font-medium">
                              Order delivered successfully!
                            </span>
                          </div>
                          <p className="text-sm text-green-600 mt-1">
                            Hope you enjoy your purchase. Don't forget to leave
                            a review!
                          </p>
                        </div>
                      )}

                      {order.status === "cancelled" && (
                        <div className="bg-red-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 text-red-700">
                            <AlertCircle className="h-4 w-4" />
                            <span className="font-medium">
                              Order was cancelled
                            </span>
                          </div>
                          <p className="text-sm text-red-600 mt-1">
                            Refund will be processed within 3-5 business days.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketplaceOrders;
