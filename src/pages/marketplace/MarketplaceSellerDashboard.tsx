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
  DollarSign,
  TrendingUp,
  Users,
  ShoppingCart,
  Star,
  Eye,
  MessageSquare,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
} from "lucide-react";
import SellerDashboard from "@/components/marketplace/SellerDashboard";
import OrderManagement from "@/components/marketplace/OrderManagement";
import { Product, Order } from "@/types/marketplace";

const MarketplaceSellerDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const {
    sellerProducts,
    sellerOrders,
    getSellerProducts,
    getSellerOrders,
    updateOrderStatus,
    deleteProduct,
  } = useMarketplace();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  useEffect(() => {
    if (isAuthenticated && user) {
      getSellerProducts(user.id);
      getSellerOrders(user.id);
    }
  }, [isAuthenticated, user, getSellerProducts, getSellerOrders]);

  const handleOrderStatusUpdate = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      toast({
        title: "Order Updated",
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

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        toast({
          title: "Product Deleted",
          description: "Product has been removed from your inventory",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        });
      }
    }
  };

  // Calculate seller statistics
  const totalProducts = sellerProducts?.length || 0;
  const totalOrders = sellerOrders?.length || 0;
  const totalRevenue =
    sellerOrders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;
  const averageRating =
    sellerProducts?.reduce((sum, product) => sum + (product.rating || 0), 0) /
      totalProducts || 0;

  const pendingOrders =
    sellerOrders?.filter((order) => order.status === "pending").length || 0;
  const completedOrders =
    sellerOrders?.filter((order) => order.status === "delivered").length || 0;

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-4">
              Please sign in to access your seller dashboard
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your products and track your sales
          </p>
        </div>
        <Button
          onClick={() => (window.location.href = "/app/marketplace/list")}
        >
          <Plus className="h-4 w-4 mr-2" />
          List New Product
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Products
                </p>
                <p className="text-2xl font-bold">{totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Orders
                </p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Average Rating
                </p>
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products ({totalProducts})</TabsTrigger>
          <TabsTrigger value="orders">Orders ({totalOrders})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sellerOrders?.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-2 border-b last:border-b-0"
                  >
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${order.totalAmount}</p>
                      <Badge
                        variant={
                          order.status === "delivered" ? "default" : "secondary"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                )) || (
                  <p className="text-muted-foreground text-center py-4">
                    No orders yet
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sellerProducts?.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-2 border-b last:border-b-0"
                  >
                    <img
                      src={product.images?.[0] || "/placeholder.jpg"}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium truncate">{product.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>${product.price}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{product.rating || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )) || (
                  <p className="text-muted-foreground text-center py-4">
                    No products listed yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() =>
                    (window.location.href = "/app/marketplace/list")
                  }
                >
                  <Plus className="h-6 w-6" />
                  <span>List New Product</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => setActiveTab("orders")}
                >
                  <Package className="h-6 w-6" />
                  <span>Manage Orders ({pendingOrders} pending)</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => setActiveTab("analytics")}
                >
                  <BarChart3 className="h-6 w-6" />
                  <span>View Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Products</h2>
            <Button
              onClick={() => (window.location.href = "/app/marketplace/list")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>

          {sellerProducts?.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Products Listed
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start selling by listing your first product
                </p>
                <Button
                  onClick={() =>
                    (window.location.href = "/app/marketplace/list")
                  }
                >
                  List Your First Product
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sellerProducts?.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <img
                      src={product.images?.[0] || "/placeholder.jpg"}
                      alt={product.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-semibold mb-2 truncate">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-green-600">
                        ${product.price}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{product.rating || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>Views: {product.views || 0}</span>
                      <span>Stock: {product.stock || 0}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Order Management</h2>
            <div className="flex gap-2">
              <Badge variant="secondary">{pendingOrders} pending</Badge>
              <Badge variant="default">{completedOrders} completed</Badge>
            </div>
          </div>

          {sellerOrders && sellerOrders.length > 0 ? (
            <OrderManagement
              orders={sellerOrders}
              onStatusUpdate={handleOrderStatusUpdate}
              onMarkAsShipped={(orderId, trackingNumber) => {
                // Handle tracking number update
                handleOrderStatusUpdate(orderId, "shipped");
              }}
              onMarkAsDelivered={(orderId) =>
                handleOrderStatusUpdate(orderId, "delivered")
              }
              onCancelOrder={(orderId) =>
                handleOrderStatusUpdate(orderId, "cancelled")
              }
              onDownloadInvoice={(orderId) => {
                // Handle invoice download
                console.log("Download invoice for order:", orderId);
              }}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                <p className="text-muted-foreground">
                  Orders will appear here when customers purchase your products
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <SellerDashboard />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seller Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Store Information</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your store name, description, and contact information
                </p>
                <Button variant="outline" className="mt-2">
                  Edit Store Info
                </Button>
              </div>

              <div>
                <h3 className="font-medium mb-2">Payment Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Configure how you receive payments for your sales
                </p>
                <Button variant="outline" className="mt-2">
                  Payment Setup
                </Button>
              </div>

              <div>
                <h3 className="font-medium mb-2">Shipping Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Set up shipping rates and delivery options
                </p>
                <Button variant="outline" className="mt-2">
                  Configure Shipping
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketplaceSellerDashboard;
