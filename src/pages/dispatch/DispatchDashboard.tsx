import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  MapPin,
  Navigation,
  Package,
  DollarSign,
  Star,
  Clock,
  Phone,
  MessageCircle,
  Camera,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Menu,
  Settings,
  User,
  Wallet,
  BarChart3,
  History,
  Bell,
  LogOut,
  RefreshCw,
  Fuel,
  Route,
  Timer,
  Zap,
  Award,
  TrendingUp,
  Calendar,
  Shield,
  Info,
  Play,
  Pause,
  Home,
  Target,
  ChevronRight,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DispatchStats, DeliveryOrder, LocationUpdate } from "@/types/dispatch";
import { toast } from "sonner";

// Mock data for demonstration
const mockStats: DispatchStats = {
  totalEarnings: 45250,
  thisMonthEarnings: 12780,
  totalDeliveries: 145,
  completedDeliveries: 138,
  averageRating: 4.8,
  onTimeRate: 94,
  activeOrders: 2,
  pendingPayouts: 3450,
};

const mockActiveOrders: DeliveryOrder[] = [
  {
    id: "del_001",
    orderId: "ord_123",
    customerId: "user_456",
    sellerId: "seller_789",
    deliveryType: "food",
    priority: "express",
    status: "pickup_in_progress",
    pickupAddress: "Shoprite, Ikeja City Mall, Lagos",
    deliveryAddress: "15 Allen Avenue, Ikeja, Lagos",
    pickupLocation: { lat: 6.6018, lng: 3.3515 },
    deliveryLocation: { lat: 6.5964, lng: 3.3469 },
    pickupContactName: "Restaurant Manager",
    pickupContactPhone: "+234 901 234 5678",
    deliveryContactName: "John Doe",
    deliveryContactPhone: "+234 802 345 6789",
    deliveryFee: 1500,
    partnerEarnings: 1200,
    estimatedDeliveryTime: "2024-01-15T15:30:00Z",
    instructions: "Call customer when you arrive. Building has security gate.",
    packageDetails: {
      weight: 2.5,
      dimensions: { length: 30, width: 25, height: 15 },
      value: 5000,
      description: "Food delivery - handle with care",
      fragile: false,
      requiresSignature: false,
    },
    createdAt: "2024-01-15T14:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
  },
  {
    id: "del_002",
    orderId: "ord_124",
    customerId: "user_457",
    sellerId: "seller_790",
    deliveryType: "package",
    priority: "standard",
    status: "assigned",
    pickupAddress: "Jumia Warehouse, Victoria Island, Lagos",
    deliveryAddress: "42 Admiralty Road, Lekki Phase 1, Lagos",
    pickupLocation: { lat: 6.4281, lng: 3.4219 },
    deliveryLocation: { lat: 6.4398, lng: 3.4697 },
    pickupContactName: "Warehouse Staff",
    pickupContactPhone: "+234 901 234 5679",
    deliveryContactName: "Sarah Johnson",
    deliveryContactPhone: "+234 803 456 7890",
    deliveryFee: 2000,
    partnerEarnings: 1600,
    estimatedDeliveryTime: "2024-01-15T17:00:00Z",
    instructions: "Package requires signature. Customer works from home.",
    packageDetails: {
      weight: 1.2,
      dimensions: { length: 20, width: 15, height: 10 },
      value: 15000,
      description: "Electronics - fragile",
      fragile: true,
      requiresSignature: true,
    },
    createdAt: "2024-01-15T13:30:00Z",
    updatedAt: "2024-01-15T14:00:00Z",
  },
];

export const DispatchDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [stats, setStats] = useState<DispatchStats>(mockStats);
  const [activeOrders, setActiveOrders] = useState<DeliveryOrder[]>(mockActiveOrders);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Unable to get your location");
        }
      );
    }
  }, []);

  // Toggle online status
  const toggleOnlineStatus = useCallback(async () => {
    try {
      setIsOnline(!isOnline);
      // Here you would update the server
      toast.success(isOnline ? "You're now offline" : "You're now online and ready for deliveries");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  }, [isOnline]);

  // Accept delivery request
  const acceptDelivery = useCallback(async (orderId: string) => {
    try {
      // Update order status
      setActiveOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, status: "pickup_in_progress" }
            : order
        )
      );
      toast.success("Delivery accepted! Navigate to pickup location.");
    } catch (error) {
      console.error("Error accepting delivery:", error);
      toast.error("Failed to accept delivery");
    }
  }, []);

  // Update delivery status
  const updateDeliveryStatus = useCallback(async (orderId: string, status: string) => {
    try {
      setActiveOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, status: status as any }
            : order
        )
      );
      toast.success(`Delivery status updated to: ${status.replace('_', ' ')}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  }, []);

  // Refresh data
  const refreshData = useCallback(async () => {
    setRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Data refreshed");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data");
    } finally {
      setRefreshing(false);
    }
  }, []);

  const StatusCard: React.FC<{
    title: string;
    value: string | number;
    change?: string;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, icon, color }) => (
    <Card className="flex-1 min-w-0">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white truncate">{value}</p>
            {change && (
              <p className="text-xs text-green-600 dark:text-green-400">{change}</p>
            )}
          </div>
          <div className={`p-2 rounded-lg ${color} flex-shrink-0`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );

  const OrderCard: React.FC<{ order: DeliveryOrder }> = ({ order }) => (
    <Card 
      className="mb-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => setSelectedOrder(order)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={order.priority === "express" ? "destructive" : "secondary"} className="text-xs">
                {order.priority}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {order.deliveryType}
              </Badge>
            </div>
            <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
              Order #{order.orderId.slice(-6)}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-green-600 dark:text-green-400">₦{order.partnerEarnings?.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{order.estimatedDeliveryTime ? 
              new Date(order.estimatedDeliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
              'No ETA'}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-gray-600 dark:text-gray-400 truncate">{order.pickupAddress}</p>
          </div>
          <div className="flex items-start gap-2">
            <Navigation className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-gray-600 dark:text-gray-400 truncate">{order.deliveryAddress}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <Badge 
            variant={
              order.status === "assigned" ? "secondary" :
              order.status === "pickup_in_progress" ? "default" :
              order.status === "picked_up" ? "default" :
              order.status === "delivery_in_progress" ? "default" :
              "secondary"
            }
            className="text-xs"
          >
            {order.status.replace('_', ' ')}
          </Badge>
          
          <div className="flex gap-2">
            {order.status === "assigned" && (
              <Button size="sm" onClick={(e) => {
                e.stopPropagation();
                acceptDelivery(order.id);
              }}>
                Accept
              </Button>
            )}
            {order.status === "pickup_in_progress" && (
              <Button size="sm" variant="outline" onClick={(e) => {
                e.stopPropagation();
                updateDeliveryStatus(order.id, "picked_up");
              }}>
                Picked Up
              </Button>
            )}
            {order.status === "picked_up" && (
              <Button size="sm" variant="outline" onClick={(e) => {
                e.stopPropagation();
                updateDeliveryStatus(order.id, "delivery_in_progress");
              }}>
                Start Delivery
              </Button>
            )}
            {order.status === "delivery_in_progress" && (
              <Button size="sm" onClick={(e) => {
                e.stopPropagation();
                updateDeliveryStatus(order.id, "delivered");
              }}>
                Delivered
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {user?.name || 'Dispatch Partner'}
                </p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshData}
                disabled={refreshing}
                className="p-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="py-4 space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className="font-medium">Go {isOnline ? 'Offline' : 'Online'}</span>
                      </div>
                      <Switch checked={isOnline} onCheckedChange={toggleOnlineStatus} />
                    </div>

                    <div className="space-y-2">
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link to="/profile">
                          <User className="w-4 h-4 mr-3" />
                          Profile Settings
                        </Link>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link to="/wallet">
                          <Wallet className="w-4 h-4 mr-3" />
                          Wallet & Earnings
                        </Link>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link to="/support">
                          <MessageCircle className="w-4 h-4 mr-3" />
                          Support
                        </Link>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" onClick={logout}>
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="orders" className="text-xs">Orders</TabsTrigger>
            <TabsTrigger value="earnings" className="text-xs">Earnings</TabsTrigger>
            <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <StatusCard
                title="Today's Earnings"
                value={`₦${(stats.thisMonthEarnings / 30).toFixed(0)}`}
                change="+8.2%"
                icon={<DollarSign className="w-5 h-5 text-white" />}
                color="bg-gradient-to-br from-green-500 to-emerald-600"
              />
              <StatusCard
                title="Rating"
                value={`${stats.averageRating}/5`}
                icon={<Star className="w-5 h-5 text-white" />}
                color="bg-gradient-to-br from-yellow-500 to-orange-600"
              />
              <StatusCard
                title="Active Orders"
                value={stats.activeOrders}
                icon={<Package className="w-5 h-5 text-white" />}
                color="bg-gradient-to-br from-blue-500 to-cyan-600"
              />
              <StatusCard
                title="On-Time Rate"
                value={`${stats.onTimeRate}%`}
                icon={<Clock className="w-5 h-5 text-white" />}
                color="bg-gradient-to-br from-purple-500 to-violet-600"
              />
            </div>

            {/* Active Orders Summary */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Active Deliveries</CardTitle>
                  <Badge variant="secondary">{activeOrders.length} orders</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {activeOrders.length > 0 ? (
                  <div className="space-y-3">
                    {activeOrders.slice(0, 2).map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                    {activeOrders.length > 2 && (
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab("orders")}>
                        View All Orders ({activeOrders.length})
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">No active orders</p>
                    <p className="text-sm text-gray-500">
                      {isOnline ? "Waiting for new delivery requests..." : "Go online to receive orders"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weekly Performance */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Deliveries</span>
                      <span className="font-medium">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Distance</span>
                      <span className="font-medium">145 km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Hours Online</span>
                      <span className="font-medium">42h</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Earnings</span>
                      <span className="font-medium text-green-600">₦8,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Avg. Rating</span>
                      <span className="font-medium">4.9</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tips</span>
                      <span className="font-medium text-blue-600">₦750</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Orders</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {activeOrders.length > 0 ? (
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Active Orders
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {isOnline ? "Waiting for new delivery requests..." : "Go online to start receiving orders"}
                </p>
                {!isOnline && (
                  <Button onClick={toggleOnlineStatus}>
                    Go Online
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Earnings Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          ₦{stats.totalEarnings.toLocaleString()}
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          ₦{stats.thisMonthEarnings.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                        <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                          ₦{stats.pendingPayouts.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Payout Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium">Weekly Payout</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Every Friday</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">₦3,450</p>
                        <p className="text-xs text-gray-500">Next: Jan 19</p>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <Wallet className="w-4 h-4 mr-2" />
                      View Payment History
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Performance Bonuses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">On-Time Bonus</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">95%+ on-time rate</p>
                        </div>
                      </div>
                      <p className="font-bold text-blue-600">+₦500</p>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium">Rating Bonus</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">4.8+ rating</p>
                        </div>
                      </div>
                      <p className="font-bold text-purple-600">+₦300</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Delivery History</h2>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="text-center py-8">
                  <History className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Delivery history will appear here</p>
                  <p className="text-sm text-gray-500">Complete your first delivery to see history</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Detail Sheet */}
      {selectedOrder && (
        <Sheet open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Order Details #{selectedOrder.orderId.slice(-6)}</SheetTitle>
            </SheetHeader>
            <div className="py-4 space-y-6 overflow-y-auto">
              <div className="flex items-center justify-between">
                <Badge variant={selectedOrder.priority === "express" ? "destructive" : "secondary"}>
                  {selectedOrder.priority} delivery
                </Badge>
                <Badge variant="outline">
                  {selectedOrder.deliveryType}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <p className="font-medium text-red-600">Pickup</p>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedOrder.pickupAddress}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {selectedOrder.pickupContactName} • {selectedOrder.pickupContactPhone}
                  </p>
                </div>

                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Navigation className="w-4 h-4 text-green-600" />
                    <p className="font-medium text-green-600">Delivery</p>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedOrder.deliveryAddress}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {selectedOrder.deliveryContactName} • {selectedOrder.deliveryContactPhone}
                  </p>
                </div>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Package Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Description:</span>
                      <span>{selectedOrder.packageDetails?.description}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Weight:</span>
                      <span>{selectedOrder.packageDetails?.weight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Value:</span>
                      <span>₦{selectedOrder.packageDetails?.value.toLocaleString()}</span>
                    </div>
                    {selectedOrder.packageDetails?.fragile && (
                      <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="text-yellow-600 font-medium">Handle with care - Fragile</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {selectedOrder.instructions && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Special Instructions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedOrder.instructions}</p>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-3">
                <Button className="flex-1">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Customer
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
                <Button variant="outline" className="flex-1">
                  <Navigation className="w-4 h-4 mr-2" />
                  Navigate
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-3">
        {isOnline && (
          <Button size="lg" className="rounded-full shadow-lg">
            <Navigation className="w-5 h-5" />
          </Button>
        )}
        <Button
          variant={isOnline ? "secondary" : "default"}
          size="lg"
          className="rounded-full shadow-lg"
          onClick={toggleOnlineStatus}
        >
          {isOnline ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
};

export default DispatchDashboard;
