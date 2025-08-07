import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ShoppingCart,
  Heart,
  Star,
  Package,
  Clock,
  CheckCircle,
  Truck,
  CreditCard,
  MapPin,
  Bell,
  MessageCircle,
  RefreshCw,
  Eye,
  MoreHorizontal,
  Download,
  XCircle,
  AlertTriangle,
  Gift,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Target,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface Order {
  id: string;
  orderNumber: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  date: string;
  total: number;
  items: {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    seller: string;
  }[];
  tracking?: string;
  estimatedDelivery?: string;
}

interface WishlistItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  rating: number;
  reviews: number;
  dateAdded: string;
}

interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
}

// Mock data
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "MP-2024-001",
    status: "delivered",
    date: "2024-01-15",
    total: 299.99,
    tracking: "TRK123456789",
    estimatedDelivery: "2024-01-18",
    items: [
      {
        id: "1",
        name: "iPhone 14 Pro Max",
        image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
        price: 299.99,
        quantity: 1,
        seller: "Tech Store",
      },
    ],
  },
  {
    id: "2",
    orderNumber: "MP-2024-002",
    status: "shipped",
    date: "2024-01-20",
    total: 149.99,
    tracking: "TRK987654321",
    estimatedDelivery: "2024-01-25",
    items: [
      {
        id: "2",
        name: "Nike Air Max 270",
        image:
          "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
        price: 149.99,
        quantity: 1,
        seller: "Shoe World",
      },
    ],
  },
];

const mockWishlist: WishlistItem[] = [
  {
    id: "1",
    name: "MacBook Pro 16-inch",
    image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
    price: 2299,
    originalPrice: 2499,
    inStock: true,
    rating: 4.9,
    reviews: 890,
    dateAdded: "2024-01-10",
  },
  {
    id: "2",
    name: "Sony WH-1000XM4",
    image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
    price: 279,
    originalPrice: 349,
    inStock: true,
    rating: 4.8,
    reviews: 2890,
    dateAdded: "2024-01-12",
  },
];

const mockReviews: Review[] = [
  {
    id: "1",
    productId: "1",
    productName: "iPhone 14 Pro Max",
    productImage: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    rating: 5,
    comment:
      "Excellent phone! Camera quality is amazing and battery life is great.",
    date: "2024-01-18",
    helpful: 12,
    verified: true,
  },
];

export default function BuyerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "shipped":
        return <Truck className="w-4 h-4 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const buyerStats = {
    totalOrders: mockOrders.length,
    totalSpent: mockOrders.reduce((sum, order) => sum + order.total, 0),
    wishlistItems: mockWishlist.length,
    reviewsWritten: mockReviews.length,
    savedAmount: mockWishlist.reduce(
      (sum, item) => sum + ((item.originalPrice || item.price) - item.price),
      0,
    ),
    favoriteCategory: "Electronics",
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.name || "Customer"}! Manage your orders,
          wishlist, and account settings.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {buyerStats.totalOrders}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(buyerStats.totalSpent)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Wishlist Items
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {buyerStats.wishlistItems}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Money Saved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(buyerStats.savedAmount)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Gift className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Orders</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate("/app/marketplace/orders")}
              >
                <Eye className="w-4 h-4 mr-2" />
                View All Orders
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {mockOrders.map((order) => (
              <Card
                key={order.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </Badge>
                      <span className="text-sm text-gray-600">
                        Order #{order.orderNumber}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatPrice(order.total)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(order.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-600">
                            Qty: {item.quantity} • {item.seller}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {order.tracking && (
                        <span className="text-sm text-gray-600">
                          <Truck className="w-4 h-4 inline mr-1" />
                          {order.tracking}
                        </span>
                      )}
                      {order.estimatedDelivery && (
                        <span className="text-sm text-gray-600">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Est. {formatDate(order.estimatedDelivery)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewOrderDetails(order)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      {order.status === "delivered" && (
                        <Button variant="outline" size="sm">
                          <Star className="w-4 h-4 mr-2" />
                          Review
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Wishlist Tab */}
        <TabsContent value="wishlist" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Wishlist</h2>
            <Button variant="outline" size="sm">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add All to Cart
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockWishlist.map((item) => (
              <Card
                key={item.id}
                className="group hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    >
                      <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    </Button>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                        -
                        {Math.round(
                          ((item.originalPrice - item.price) /
                            item.originalPrice) *
                            100,
                        )}
                        %
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-medium text-lg mb-2 line-clamp-2">
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-1 mb-2">
                    {renderStars(item.rating)}
                    <span className="text-sm text-gray-600">
                      ({item.reviews})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-bold text-red-600">
                      {formatPrice(item.price)}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={item.inStock ? "default" : "destructive"}>
                      {item.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Added {formatDate(item.dateAdded)}
                    </span>
                  </div>

                  <Button className="w-full" disabled={!item.inStock}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Reviews</h2>
            <Badge variant="secondary">
              {mockReviews.length} reviews written
            </Badge>
          </div>

          <div className="space-y-4">
            {mockReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={review.productImage}
                      alt={review.productName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{review.productName}</h3>
                        <div className="flex items-center gap-2">
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified Purchase
                            </Badge>
                          )}
                          <span className="text-sm text-gray-600">
                            {formatDate(review.date)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-600">
                          {review.rating}/5
                        </span>
                      </div>

                      <p className="text-gray-700 mb-3">{review.comment}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {review.helpful} people found this helpful
                        </span>
                        <Button variant="outline" size="sm">
                          Edit Review
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Other tabs placeholders */}
        <TabsContent value="addresses">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Addresses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Manage your shipping addresses here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Manage your payment methods here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Manage your account preferences here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Order Details Modal */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order #{selectedOrder?.orderNumber} -{" "}
              {formatDate(selectedOrder?.date || "")}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(selectedOrder.status)}>
                  {getStatusIcon(selectedOrder.status)}
                  <span className="ml-1 capitalize">
                    {selectedOrder.status}
                  </span>
                </Badge>
                <span className="font-semibold text-lg">
                  {formatPrice(selectedOrder.total)}
                </span>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Items</h4>
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium">{item.name}</h5>
                      <p className="text-sm text-gray-600">
                        Sold by {item.seller}
                      </p>
                      <p className="text-sm">
                        Qty: {item.quantity} • {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {selectedOrder.tracking && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Tracking Information</h4>
                    <p className="text-sm text-gray-600">
                      Tracking Number:{" "}
                      <span className="font-mono">
                        {selectedOrder.tracking}
                      </span>
                    </p>
                    {selectedOrder.estimatedDelivery && (
                      <p className="text-sm text-gray-600">
                        Estimated Delivery:{" "}
                        {formatDate(selectedOrder.estimatedDelivery)}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowOrderDetails(false)}
            >
              Close
            </Button>
            <Button>Track Package</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
