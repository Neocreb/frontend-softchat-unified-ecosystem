import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Truck,
  Package,
  Clock,
  DollarSign,
  Star,
  MapPin,
  Camera,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Navigation,
  Phone,
  Calendar,
  TrendingUp,
  Eye,
  Wallet,
  CreditCard,
  Download,
  Upload,
  Settings,
  User,
  Shield,
  Award,
  BarChart3,
  FileText,
  Route,
  Fuel,
  Wrench,
  GraduationCap,
  HeadphonesIcon,
  Bell,
  Filter,
  Search,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Target,
  Zap,
  Timer,
  Activity,
  TrendingDown,
  Calendar as CalendarIcon,
  Users,
  Map,
  PlusCircle,
  Edit,
  Trash2,
  ArrowRight,
  ExternalLink,
  Send,
  History,
  RefreshCw,
  Info,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWalletContext } from "@/contexts/WalletContext";
import { cn } from "@/lib/utils";

interface DeliveryAssignment {
  id: string;
  orderId: string;
  orderNumber: string;
  status: string;
  pickupAddress: any;
  deliveryAddress: any;
  packageDetails: any;
  deliveryFee: number;
  estimatedDeliveryTime: string;
  actualPickupTime?: string;
  actualDeliveryTime?: string;
  trackingNumber: string;
  customerNotes?: string;
  specialInstructions?: string;
  createdAt: string;
}

interface CustomerRating {
  id: string;
  customerName: string;
  orderNumber: string;
  rating: number;
  comment: string;
  deliveryDate: string;
  responseTime: number;
  professionalismRating: number;
  communicationRating: number;
  packageConditionRating: number;
}

interface DeliveryEarnings {
  id: string;
  type: 'delivery' | 'bonus' | 'tip' | 'penalty';
  amount: number;
  date: string;
  description: string;
  orderNumber?: string;
  status: 'completed' | 'pending' | 'processing';
}

interface Vehicle {
  id: string;
  type: 'motorcycle' | 'bicycle' | 'car' | 'van';
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  insurance: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
    status: 'active' | 'expired' | 'pending';
  };
  maintenance: {
    lastService: string;
    nextService: string;
    status: 'good' | 'due' | 'overdue';
  };
}

interface ProviderStats {
  totalDeliveries: number;
  completedToday: number;
  todayEarnings: number;
  weekEarnings: number;
  monthEarnings: number;
  totalEarnings: number;
  deliveryBalance: number; // Delivery earnings not yet transferred to wallet
  rating: number;
  onTimeRate: number;
  activeAssignments: number;
  completionRate: number;
  averageDeliveryTime: number;
  customerSatisfaction: number;
  totalTips: number;
  bonusesEarned: number;
}

const mockStats: ProviderStats = {
  totalDeliveries: 247,
  completedToday: 8,
  todayEarnings: 156.75,
  weekEarnings: 892.40,
  monthEarnings: 3420.50,
  totalEarnings: 5420.50,
  deliveryBalance: 1450.30, // Available for transfer to main wallet
  rating: 4.8,
  onTimeRate: 94.2,
  activeAssignments: 3,
  completionRate: 98.5,
  averageDeliveryTime: 28,
  customerSatisfaction: 4.7,
  totalTips: 324.75,
  bonusesEarned: 180.00,
};

const mockRatings: CustomerRating[] = [
  {
    id: "1",
    customerName: "Sarah Johnson",
    orderNumber: "SC240001",
    rating: 5,
    comment: "Excellent service! Package arrived quickly and in perfect condition. Very professional driver.",
    deliveryDate: "2024-01-15T14:30:00Z",
    responseTime: 4.8,
    professionalismRating: 5,
    communicationRating: 5,
    packageConditionRating: 5,
  },
  {
    id: "2",
    customerName: "Mike Chen",
    orderNumber: "SC240002",
    rating: 4,
    comment: "Good delivery service. Driver was polite and delivered on time.",
    deliveryDate: "2024-01-14T16:45:00Z",
    responseTime: 4.2,
    professionalismRating: 4,
    communicationRating: 4,
    packageConditionRating: 5,
  },
];

const mockEarnings: DeliveryEarnings[] = [
  {
    id: "1",
    type: "delivery",
    amount: 12.50,
    date: "2024-01-15T14:30:00Z",
    description: "Delivery fee for order SC240001",
    orderNumber: "SC240001",
    status: "completed",
  },
  {
    id: "2",
    type: "tip",
    amount: 5.00,
    date: "2024-01-15T14:30:00Z",
    description: "Customer tip for order SC240001",
    orderNumber: "SC240001",
    status: "completed",
  },
  {
    id: "3",
    type: "bonus",
    amount: 25.00,
    date: "2024-01-15T00:00:00Z",
    description: "Peak hour delivery bonus",
    status: "completed",
  },
];

const mockAssignments: DeliveryAssignment[] = [
  {
    id: "1",
    orderId: "order-1",
    orderNumber: "SC240001",
    status: "accepted",
    pickupAddress: {
      name: "TechStore Inc",
      address: "123 Business St, Downtown",
      phone: "+1-555-0123",
    },
    deliveryAddress: {
      name: "John Smith",
      address: "456 Residential Ave, Suburbs",
      phone: "+1-555-0456",
    },
    packageDetails: {
      weight: 2.5,
      dimensions: { length: 30, width: 20, height: 15 },
      value: 299.99,
      description: "Electronics - Smartphone",
      fragile: true,
    },
    deliveryFee: 12.50,
    estimatedDeliveryTime: "2024-01-15T16:00:00Z",
    trackingNumber: "SC240001ABC",
    customerNotes: "Please ring doorbell, leave at door if no answer",
    createdAt: "2024-01-15T10:30:00Z",
  },
];

export default function DeliveryProviderDashboard() {
  const [assignments, setAssignments] = useState<DeliveryAssignment[]>(mockAssignments);
  const [stats, setStats] = useState<ProviderStats>(mockStats);
  const [ratings, setRatings] = useState<CustomerRating[]>(mockRatings);
  const [earnings, setEarnings] = useState<DeliveryEarnings[]>(mockEarnings);
  const [selectedAssignment, setSelectedAssignment] = useState<DeliveryAssignment | null>(null);
  const [showAssignmentDetails, setShowAssignmentDetails] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isOnline, setIsOnline] = useState(true);
  const { toast } = useToast();
  const { walletBalance, refreshWallet } = useWalletContext();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "picked_up":
        return "bg-purple-100 text-purple-800";
      case "in_transit":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4" />;
      case "picked_up":
        return <Package className="h-4 w-4" />;
      case "in_transit":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "failed":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleTransferToWallet = async () => {
    if (!transferAmount) {
      toast({
        title: "Error",
        description: "Please enter an amount to transfer",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(transferAmount);
    if (amount > stats.deliveryBalance) {
      toast({
        title: "Error",
        description: "Insufficient delivery balance for transfer",
        variant: "destructive",
      });
      return;
    }

    if (amount < 5) {
      toast({
        title: "Error",
        description: "Minimum transfer amount is $5.00",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update local delivery balance
      setStats(prev => ({
        ...prev,
        deliveryBalance: prev.deliveryBalance - amount,
      }));

      // This would typically make an API call to transfer funds to the main wallet
      // For demo purposes, we'll simulate a successful transfer
      
      setShowTransferModal(false);
      setTransferAmount("");

      // Refresh wallet to show updated balance
      await refreshWallet();

      toast({
        title: "Transfer Successful",
        description: `${formatCurrency(amount)} has been transferred to your main wallet under 'Ecommerce' category as delivery earnings.`,
      });
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description: "Unable to transfer funds. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStarRating = (rating: number, size: "sm" | "md" = "sm") => {
    const starSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              starSize,
              star <= rating
                ? "text-yellow-500 fill-current"
                : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header with Status */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Delivery Provider Hub</h1>
          <p className="text-gray-600">Professional delivery management dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-3 h-3 rounded-full",
              isOnline ? "bg-green-500" : "bg-red-500"
            )} />
            <span className="text-sm font-medium">
              {isOnline ? "Online & Available" : "Offline"}
            </span>
          </div>
          <Button
            onClick={() => setIsOnline(!isOnline)}
            variant={isOnline ? "outline" : "default"}
            size="sm"
          >
            {isOnline ? "Go Offline" : "Go Online"}
          </Button>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left Sidebar - Earnings & Quick Actions */}
        <div className="xl:col-span-1 space-y-6">
          {/* Earnings Summary Card */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <DollarSign className="h-5 w-5" />
                Delivery Earnings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-green-700">Available Balance</p>
                <p className="text-3xl font-bold text-green-800">{formatCurrency(stats.deliveryBalance)}</p>
                <p className="text-xs text-green-600">Ready to transfer</p>
              </div>
              
              <Button 
                onClick={() => setShowTransferModal(true)}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={stats.deliveryBalance < 5}
              >
                <Send className="h-4 w-4 mr-2" />
                Transfer to Wallet
              </Button>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="text-center p-2 bg-white/50 rounded">
                  <p className="text-xs text-green-700">Today</p>
                  <p className="font-bold text-green-800">{formatCurrency(stats.todayEarnings)}</p>
                </div>
                <div className="text-center p-2 bg-white/50 rounded">
                  <p className="text-xs text-green-700">This Week</p>
                  <p className="font-bold text-green-800">{formatCurrency(stats.weekEarnings)}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-green-300">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-green-700">Main Wallet Balance:</span>
                  <span className="font-medium text-green-800">
                    {formatCurrency(walletBalance?.ecommerce || 0)}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 border-green-300 text-green-700 hover:bg-green-50"
                  onClick={() => window.open('/app/wallet', '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-2" />
                  View Main Wallet
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Rating</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{stats.rating}</span>
                  {renderStarRating(stats.rating)}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">On-Time Rate</span>
                <span className="font-medium">{stats.onTimeRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="font-medium">{stats.completionRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Deliveries</span>
                <span className="font-medium">{stats.totalDeliveries}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Route className="h-4 w-4 mr-2" />
                Optimize Routes
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <HeadphonesIcon className="h-4 w-4 mr-2" />
                Support
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="xl:col-span-3">
          <div className="space-y-6">
            {/* Quick Actions Style Tab Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  Dashboard Navigation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <Button
                    variant="outline"
                    className={cn(
                      "text-white border-none hover:scale-105 transition-all duration-200 flex flex-col items-center gap-2 h-auto py-4",
                      activeTab === "overview"
                        ? "bg-blue-600 shadow-lg ring-2 ring-blue-200 scale-105"
                        : "bg-blue-500 hover:bg-blue-600"
                    )}
                    onClick={() => setActiveTab("overview")}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span className="text-xs font-medium">Overview</span>
                  </Button>

                  <Button
                    variant="outline"
                    className={cn(
                      "text-white border-none hover:scale-105 transition-all duration-200 flex flex-col items-center gap-2 h-auto py-4",
                      activeTab === "deliveries"
                        ? "bg-orange-600 shadow-lg ring-2 ring-orange-200 scale-105"
                        : "bg-orange-500 hover:bg-orange-600"
                    )}
                    onClick={() => setActiveTab("deliveries")}
                  >
                    <Truck className="h-4 w-4" />
                    <span className="text-xs font-medium">Active</span>
                    {stats.activeAssignments > 0 && (
                      <Badge variant="secondary" className="text-xs bg-white/20">
                        {stats.activeAssignments}
                      </Badge>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className={cn(
                      "text-white border-none hover:scale-105 transition-all duration-200 flex flex-col items-center gap-2 h-auto py-4",
                      activeTab === "earnings"
                        ? "bg-green-600 shadow-lg ring-2 ring-green-200 scale-105"
                        : "bg-green-500 hover:bg-green-600"
                    )}
                    onClick={() => setActiveTab("earnings")}
                  >
                    <DollarSign className="h-4 w-4" />
                    <span className="text-xs font-medium">Earnings</span>
                  </Button>

                  <Button
                    variant="outline"
                    className={cn(
                      "text-white border-none hover:scale-105 transition-all duration-200 flex flex-col items-center gap-2 h-auto py-4",
                      activeTab === "ratings"
                        ? "bg-yellow-600 shadow-lg ring-2 ring-yellow-200 scale-105"
                        : "bg-yellow-500 hover:bg-yellow-600"
                    )}
                    onClick={() => setActiveTab("ratings")}
                  >
                    <Star className="h-4 w-4" />
                    <span className="text-xs font-medium">Reviews</span>
                  </Button>

                  <Button
                    variant="outline"
                    className={cn(
                      "text-white border-none hover:scale-105 transition-all duration-200 flex flex-col items-center gap-2 h-auto py-4",
                      activeTab === "vehicles"
                        ? "bg-purple-600 shadow-lg ring-2 ring-purple-200 scale-105"
                        : "bg-purple-500 hover:bg-purple-600"
                    )}
                    onClick={() => setActiveTab("vehicles")}
                  >
                    <Truck className="h-4 w-4" />
                    <span className="text-xs font-medium">Vehicles</span>
                  </Button>

                  <Button
                    variant="outline"
                    className={cn(
                      "text-white border-none hover:scale-105 transition-all duration-200 flex flex-col items-center gap-2 h-auto py-4",
                      activeTab === "analytics"
                        ? "bg-indigo-600 shadow-lg ring-2 ring-indigo-200 scale-105"
                        : "bg-indigo-500 hover:bg-indigo-600"
                    )}
                    onClick={() => setActiveTab("analytics")}
                  >
                    <Activity className="h-4 w-4" />
                    <span className="text-xs font-medium">Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
              {/* Today's Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Today's Deliveries</p>
                        <p className="text-2xl font-bold">{stats.completedToday}</p>
                      </div>
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Active Orders</p>
                        <p className="text-2xl font-bold">{stats.activeAssignments}</p>
                      </div>
                      <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Truck className="h-5 w-5 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Avg Delivery Time</p>
                        <p className="text-2xl font-bold">{stats.averageDeliveryTime}m</p>
                      </div>
                      <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Timer className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Active Deliveries Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Active Deliveries</span>
                    <Badge variant="secondary">{stats.activeAssignments} active</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {assignments.filter(a => ["accepted", "picked_up", "in_transit"].includes(a.status)).slice(0, 3).map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-3 last:mb-0">
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(assignment.status)}>
                          {assignment.status.replace('_', ' ')}
                        </Badge>
                        <div>
                          <p className="font-medium">#{assignment.orderNumber}</p>
                          <p className="text-sm text-gray-500">{assignment.deliveryAddress.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{formatCurrency(assignment.deliveryFee)}</p>
                        <Button size="sm" variant="outline" className="mt-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                  {assignments.filter(a => ["accepted", "picked_up", "in_transit"].includes(a.status)).length === 0 && (
                    <p className="text-center text-gray-500 py-4">No active deliveries</p>
                  )}
                </CardContent>
              </Card>

              {/* Recent Earnings */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {earnings.slice(0, 5).map((earning) => (
                      <div key={earning.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            earning.type === 'delivery' ? "bg-blue-100" :
                            earning.type === 'tip' ? "bg-green-100" :
                            earning.type === 'bonus' ? "bg-purple-100" : "bg-red-100"
                          )}>
                            {earning.type === 'delivery' && <Truck className="h-4 w-4 text-blue-600" />}
                            {earning.type === 'tip' && <DollarSign className="h-4 w-4 text-green-600" />}
                            {earning.type === 'bonus' && <Award className="h-4 w-4 text-purple-600" />}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{earning.description}</p>
                            <p className="text-xs text-gray-500">{formatDateTime(earning.date)}</p>
                          </div>
                        </div>
                        <span className="font-bold text-green-600">+{formatCurrency(earning.amount)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              </div>
            )}

            {/* Active Deliveries Tab */}
            {activeTab === "deliveries" && (
              <div className="space-y-4">
              {assignments.filter(a => ["accepted", "picked_up", "in_transit"].includes(a.status)).map((assignment) => (
                <Card key={assignment.id} className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setSelectedAssignment(assignment);
                    setShowAssignmentDetails(true);
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(assignment.status)}>
                          {getStatusIcon(assignment.status)}
                          <span className="ml-1 capitalize">{assignment.status.replace('_', ' ')}</span>
                        </Badge>
                        <span className="font-medium">#{assignment.orderNumber}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{formatCurrency(assignment.deliveryFee)}</p>
                        <p className="text-xs text-gray-500">Delivery fee</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-sm">Pickup</p>
                            <p className="text-sm text-gray-600">{assignment.pickupAddress.name}</p>
                            <p className="text-xs text-gray-500">{assignment.pickupAddress.address}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-sm">Delivery</p>
                            <p className="text-sm text-gray-600">{assignment.deliveryAddress.name}</p>
                            <p className="text-xs text-gray-500">{assignment.deliveryAddress.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          {assignment.packageDetails.weight}kg
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          ETA: {formatDateTime(assignment.estimatedDeliveryTime)}
                        </span>
                      </div>
                      <Button size="sm">
                        <Navigation className="h-4 w-4 mr-2" />
                        Navigate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              </div>
            )}

            {/* Earnings Tab */}
            {activeTab === "earnings" && (
              <div className="space-y-6">
              {/* Earnings Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-600">This Week</p>
                    <p className="text-xl font-bold">{formatCurrency(stats.weekEarnings)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-600">This Month</p>
                    <p className="text-xl font-bold">{formatCurrency(stats.monthEarnings)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-600">Total Tips</p>
                    <p className="text-xl font-bold text-green-600">{formatCurrency(stats.totalTips)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-600">Bonuses</p>
                    <p className="text-xl font-bold text-purple-600">{formatCurrency(stats.bonusesEarned)}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Earnings History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Earnings History</span>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {earnings.map((earning) => (
                      <div key={earning.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            earning.type === 'delivery' ? "bg-blue-100" :
                            earning.type === 'tip' ? "bg-green-100" :
                            earning.type === 'bonus' ? "bg-purple-100" : "bg-red-100"
                          )}>
                            {earning.type === 'delivery' && <Truck className="h-5 w-5 text-blue-600" />}
                            {earning.type === 'tip' && <DollarSign className="h-5 w-5 text-green-600" />}
                            {earning.type === 'bonus' && <Award className="h-5 w-5 text-purple-600" />}
                          </div>
                          <div>
                            <p className="font-medium">{earning.description}</p>
                            <p className="text-sm text-gray-500">{formatDateTime(earning.date)}</p>
                            {earning.orderNumber && (
                              <Badge variant="outline" className="text-xs mt-1">
                                {earning.orderNumber}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">+{formatCurrency(earning.amount)}</p>
                          <Badge variant="default" className="text-xs">
                            {earning.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "ratings" && (
              <div className="space-y-6">
              {/* Rating Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      {renderStarRating(stats.rating, "md")}
                    </div>
                    <p className="text-2xl font-bold">{stats.rating}</p>
                    <p className="text-sm text-gray-600">Overall Rating</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">{mockRatings.length}</p>
                    <p className="text-sm text-gray-600">Total Reviews</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">4.8</p>
                    <p className="text-sm text-gray-600">Professionalism</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">4.7</p>
                    <p className="text-sm text-gray-600">Communication</p>
                  </CardContent>
                </Card>
              </div>

              {/* Reviews List */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ratings.map((rating) => (
                      <div key={rating.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-medium">{rating.customerName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {renderStarRating(rating.rating)}
                              <span className="text-sm text-gray-500">
                                Order #{rating.orderNumber}
                              </span>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDateTime(rating.deliveryDate)}
                          </span>
                        </div>
                        <p className="text-gray-700">{rating.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              </div>
            )}

            {/* Vehicles Tab */}
            {activeTab === "vehicles" && (
              <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Vehicle Management</h3>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Vehicle
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Honda PCX 150 (2022)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">License Plate</p>
                        <p className="font-medium">ABC-1234</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Status</p>
                        <Badge variant="default">Active</Badge>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">Insurance</p>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <p className="text-sm text-gray-600">SafeGuard Insurance</p>
                      <p className="text-xs text-gray-500">Expires: Dec 31, 2024</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">Maintenance</p>
                        <Badge variant="default">Good</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Last Service: Jan 1, 2024</p>
                      <p className="text-xs text-gray-500">Next Service: Apr 1, 2024</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Timer className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-2xl font-bold">{stats.averageDeliveryTime} min</p>
                    <p className="text-sm text-gray-600">Avg Delivery Time</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Target className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <p className="text-2xl font-bold">{stats.onTimeRate}%</p>
                    <p className="text-sm text-gray-600">On-Time Rate</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <p className="text-2xl font-bold">{stats.completionRate}%</p>
                    <p className="text-sm text-gray-600">Completion Rate</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <p className="text-2xl font-bold">{stats.customerSatisfaction}</p>
                    <p className="text-sm text-gray-600">Customer Score</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800">Excellent Performance</p>
                          <p className="text-sm text-green-600">Your on-time delivery rate is above 90%</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Star className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-800">High Customer Satisfaction</p>
                          <p className="text-sm text-blue-600">Customers consistently rate your service highly</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transfer to Wallet Modal */}
      <Dialog open={showTransferModal} onOpenChange={setShowTransferModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Earnings to Main Wallet</DialogTitle>
            <DialogDescription>
              Transfer your delivery earnings to your main platform wallet for unified fund management
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-medium text-blue-800">Transfer Information</p>
              </div>
              <p className="text-sm text-blue-700">
                Funds will be transferred to your main wallet under "Ecommerce" category as delivery provider earnings. 
                You can then withdraw from your main wallet to your bank account.
              </p>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Available Delivery Balance</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.deliveryBalance)}</p>
            </div>

            <div>
              <label className="text-sm font-medium">Transfer Amount</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                min="5"
                max={stats.deliveryBalance}
              />
              <p className="text-xs text-gray-500 mt-1">Minimum transfer: $5.00</p>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Current Main Wallet Balance (Ecommerce): <span className="font-medium">{formatCurrency(walletBalance?.ecommerce || 0)}</span></p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowTransferModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleTransferToWallet} className="flex-1" disabled={!transferAmount || parseFloat(transferAmount) < 5}>
                Transfer to Wallet
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assignment Details Dialog */}
      <Dialog open={showAssignmentDetails} onOpenChange={setShowAssignmentDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Delivery Assignment Details</DialogTitle>
            <DialogDescription>
              Complete information for assignment #{selectedAssignment?.orderNumber}
            </DialogDescription>
          </DialogHeader>

          {selectedAssignment && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(selectedAssignment.status)}>
                  {getStatusIcon(selectedAssignment.status)}
                  <span className="ml-1 capitalize">{selectedAssignment.status.replace('_', ' ')}</span>
                </Badge>
                <span className="font-bold text-green-600">
                  {formatCurrency(selectedAssignment.deliveryFee)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-red-500" />
                    Pickup Location
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">{selectedAssignment.pickupAddress.name}</p>
                    <p>{selectedAssignment.pickupAddress.address}</p>
                    <p className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {selectedAssignment.pickupAddress.phone}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-500" />
                    Delivery Location
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">{selectedAssignment.deliveryAddress.name}</p>
                    <p>{selectedAssignment.deliveryAddress.address}</p>
                    <p className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {selectedAssignment.deliveryAddress.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Package Details
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <p><span className="font-medium">Description:</span> {selectedAssignment.packageDetails.description}</p>
                  <p><span className="font-medium">Weight:</span> {selectedAssignment.packageDetails.weight}kg</p>
                  <p><span className="font-medium">Dimensions:</span> {selectedAssignment.packageDetails.dimensions.length} x {selectedAssignment.packageDetails.dimensions.width} x {selectedAssignment.packageDetails.dimensions.height} cm</p>
                  <p><span className="font-medium">Value:</span> {formatCurrency(selectedAssignment.packageDetails.value)}</p>
                  {selectedAssignment.packageDetails.fragile && (
                    <Badge variant="destructive" className="text-xs">Fragile</Badge>
                  )}
                </div>
              </div>

              {selectedAssignment.customerNotes && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Customer Notes
                  </h4>
                  <p className="bg-blue-50 p-3 rounded-lg text-sm">{selectedAssignment.customerNotes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAssignmentDetails(false)}
                >
                  Close
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    toast({
                      title: "Opening Navigation",
                      description: "Opening maps app for directions...",
                    });
                  }}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
