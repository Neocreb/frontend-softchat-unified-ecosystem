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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

interface EarningsRecord {
  id: string;
  type: 'delivery' | 'bonus' | 'tip' | 'penalty';
  amount: number;
  date: string;
  description: string;
  orderNumber?: string;
  status: 'completed' | 'pending' | 'processing';
}

interface WithdrawalRequest {
  id: string;
  amount: number;
  method: string;
  accountDetails: string;
  requestDate: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  processingTime: string;
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
  totalEarnings: number;
  todayEarnings: number;
  weekEarnings: number;
  monthEarnings: number;
  availableBalance: number;
  pendingBalance: number;
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
  totalEarnings: 3420.50,
  todayEarnings: 156.75,
  weekEarnings: 892.40,
  monthEarnings: 3420.50,
  availableBalance: 2150.30,
  pendingBalance: 456.20,
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
  {
    id: "3",
    customerName: "Emma Davis",
    orderNumber: "SC240003",
    rating: 5,
    comment: "Amazing service! Driver went above and beyond to ensure safe delivery. Highly recommend!",
    deliveryDate: "2024-01-13T11:20:00Z",
    responseTime: 4.9,
    professionalismRating: 5,
    communicationRating: 5,
    packageConditionRating: 5,
  },
];

const mockEarnings: EarningsRecord[] = [
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

const mockWithdrawals: WithdrawalRequest[] = [
  {
    id: "1",
    amount: 500.00,
    method: "Bank Transfer",
    accountDetails: "****1234",
    requestDate: "2024-01-10T10:00:00Z",
    status: "completed",
    processingTime: "1-2 business days",
  },
  {
    id: "2",
    amount: 250.00,
    method: "PayPal",
    accountDetails: "****@email.com",
    requestDate: "2024-01-12T15:30:00Z",
    status: "processing",
    processingTime: "24-48 hours",
  },
];

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    type: "motorcycle",
    make: "Honda",
    model: "PCX 150",
    year: 2022,
    licensePlate: "ABC-1234",
    insurance: {
      provider: "SafeGuard Insurance",
      policyNumber: "POL123456789",
      expiryDate: "2024-12-31",
      status: "active",
    },
    maintenance: {
      lastService: "2024-01-01",
      nextService: "2024-04-01",
      status: "good",
    },
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
  const [earnings, setEarnings] = useState<EarningsRecord[]>(mockEarnings);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(mockWithdrawals);
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [selectedAssignment, setSelectedAssignment] = useState<DeliveryAssignment | null>(null);
  const [showAssignmentDetails, setShowAssignmentDetails] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const { toast } = useToast();

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

  const handleWithdraw = () => {
    if (!withdrawAmount || !withdrawMethod) {
      toast({
        title: "Error",
        description: "Please fill in all withdrawal details",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (amount > stats.availableBalance) {
      toast({
        title: "Error",
        description: "Insufficient balance for withdrawal",
        variant: "destructive",
      });
      return;
    }

    const newWithdrawal: WithdrawalRequest = {
      id: Date.now().toString(),
      amount,
      method: withdrawMethod,
      accountDetails: "****1234",
      requestDate: new Date().toISOString(),
      status: "pending",
      processingTime: withdrawMethod === "PayPal" ? "24-48 hours" : "1-2 business days",
    };

    setWithdrawals(prev => [newWithdrawal, ...prev]);
    setStats(prev => ({
      ...prev,
      availableBalance: prev.availableBalance - amount,
      pendingBalance: prev.pendingBalance + amount,
    }));

    setShowWithdrawModal(false);
    setWithdrawAmount("");
    setWithdrawMethod("");

    toast({
      title: "Withdrawal Requested",
      description: `Your withdrawal of ${formatCurrency(amount)} has been submitted and is being processed.`,
    });
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
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Delivery Provider Dashboard</h1>
          <p className="text-gray-600">Comprehensive management hub for your delivery operations</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-3 h-3 rounded-full",
              isOnline ? "bg-green-500" : "bg-red-500"
            )} />
            <span className="text-sm font-medium">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
          <Button
            onClick={() => setIsOnline(!isOnline)}
            variant={isOnline ? "outline" : "default"}
          >
            {isOnline ? "Go Offline" : "Go Online"}
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Balance</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.availableBalance)}</p>
                <p className="text-xs text-gray-500">Ready to withdraw</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Earnings</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.todayEarnings)}</p>
                <p className="text-xs text-gray-500">{stats.completedToday} deliveries</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customer Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{stats.rating}</p>
                  <div className="flex items-center">
                    {renderStarRating(stats.rating)}
                  </div>
                </div>
                <p className="text-xs text-gray-500">{stats.totalDeliveries} reviews</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold">{stats.completionRate}%</p>
                <p className="text-xs text-gray-500">Performance metric</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
          <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Active Deliveries Quick View */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Active Deliveries ({stats.activeAssignments})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {assignments.filter(a => ["accepted", "picked_up", "in_transit"].includes(a.status)).slice(0, 3).map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-3 last:mb-0">
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(assignment.status)}>
                          {assignment.status.replace('_', ' ')}
                        </Badge>
                        <span className="font-medium">#{assignment.orderNumber}</span>
                      </div>
                      <span className="text-green-600 font-medium">{formatCurrency(assignment.deliveryFee)}</span>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-3">
                    View All Deliveries
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Earnings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recent Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {earnings.slice(0, 5).map((earning) => (
                    <div key={earning.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{earning.description}</p>
                        <p className="text-sm text-gray-500">{formatDateTime(earning.date)}</p>
                      </div>
                      <span className="text-green-600 font-medium">+{formatCurrency(earning.amount)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Performance Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>On-Time Rate</span>
                      <span>{stats.onTimeRate}%</span>
                    </div>
                    <Progress value={stats.onTimeRate} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Customer Satisfaction</span>
                      <span>{stats.customerSatisfaction}/5</span>
                    </div>
                    <Progress value={(stats.customerSatisfaction / 5) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Completion Rate</span>
                      <span>{stats.completionRate}%</span>
                    </div>
                    <Progress value={stats.completionRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Route className="h-4 w-4 mr-2" />
                    View Optimized Routes
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Manage Schedule
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <HeadphonesIcon className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Enhanced Earnings Tab */}
        <TabsContent value="earnings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Earnings Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">This Week</p>
                      <p className="text-xl font-bold">{formatCurrency(stats.weekEarnings)}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">This Month</p>
                      <p className="text-xl font-bold">{formatCurrency(stats.monthEarnings)}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total Tips</p>
                      <p className="text-xl font-bold text-green-600">{formatCurrency(stats.totalTips)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Earnings History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Earnings History</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="delivery">Delivery</SelectItem>
                          <SelectItem value="tip">Tips</SelectItem>
                          <SelectItem value="bonus">Bonuses</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {earnings.map((earning) => (
                      <div key={earning.id} className="flex items-center justify-between p-3 border rounded-lg">
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
                            {earning.type === 'penalty' && <AlertCircle className="h-5 w-5 text-red-600" />}
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
                          <p className={cn(
                            "font-bold",
                            earning.type === 'penalty' ? "text-red-600" : "text-green-600"
                          )}>
                            {earning.type === 'penalty' ? '-' : '+'}{formatCurrency(earning.amount)}
                          </p>
                          <Badge variant={earning.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                            {earning.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Balance Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Balance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Available Balance</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.availableBalance)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pending Balance</p>
                    <p className="text-lg font-semibold text-orange-600">{formatCurrency(stats.pendingBalance)}</p>
                  </div>
                  <Separator />
                  <Button 
                    className="w-full" 
                    onClick={() => setShowWithdrawModal(true)}
                    disabled={stats.availableBalance < 10}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Withdraw Funds
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Minimum withdrawal: $10
                  </p>
                </CardContent>
              </Card>

              {/* Withdrawal History */}
              <Card>
                <CardHeader>
                  <CardTitle>Withdrawal History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {withdrawals.map((withdrawal) => (
                      <div key={withdrawal.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{formatCurrency(withdrawal.amount)}</span>
                          <Badge variant={
                            withdrawal.status === 'completed' ? 'default' :
                            withdrawal.status === 'processing' ? 'secondary' :
                            withdrawal.status === 'pending' ? 'outline' : 'destructive'
                          }>
                            {withdrawal.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{withdrawal.method}</p>
                        <p className="text-xs text-gray-500">{formatDateTime(withdrawal.requestDate)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Ratings & Reviews Tab */}
        <TabsContent value="ratings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
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
                  <CardTitle className="flex items-center justify-between">
                    <span>Customer Reviews</span>
                    <div className="flex gap-2">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Ratings</SelectItem>
                          <SelectItem value="5">5 Stars</SelectItem>
                          <SelectItem value="4">4 Stars</SelectItem>
                          <SelectItem value="3">3 Stars</SelectItem>
                          <SelectItem value="2">2 Stars</SelectItem>
                          <SelectItem value="1">1 Star</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardTitle>
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
                        <p className="text-gray-700 mb-3">{rating.comment}</p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Professionalism</p>
                            <div className="flex items-center gap-1">
                              {renderStarRating(rating.professionalismRating)}
                              <span className="text-gray-500">({rating.professionalismRating})</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-600">Communication</p>
                            <div className="flex items-center gap-1">
                              {renderStarRating(rating.communicationRating)}
                              <span className="text-gray-500">({rating.communicationRating})</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-600">Package Condition</p>
                            <div className="flex items-center gap-1">
                              {renderStarRating(rating.packageConditionRating)}
                              <span className="text-gray-500">({rating.packageConditionRating})</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Rating Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Rating Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = ratings.filter(r => Math.floor(r.rating) === star).length;
                    const percentage = (count / ratings.length) * 100;
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-sm w-6">{star}</span>
                        <Star className="h-4 w-4 text-yellow-500" />
                        <Progress value={percentage} className="flex-1 h-2" />
                        <span className="text-sm text-gray-500 w-8">{count}</span>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Improvement Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Improvement Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Communication</p>
                    <p className="text-sm text-blue-600">Send delivery updates to maintain high ratings</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">Timeliness</p>
                    <p className="text-sm text-green-600">Arrive within estimated time windows</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm font-medium text-purple-800">Package Care</p>
                    <p className="text-sm text-purple-600">Handle packages with extra care for fragile items</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Deliveries Tab (existing content) */}
        <TabsContent value="deliveries" className="space-y-4">
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
                    <span className="text-sm text-gray-500">{assignment.trackingNumber}</span>
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
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Vehicles Tab */}
        <TabsContent value="vehicles" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Vehicle Management</h3>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      {vehicle.make} {vehicle.model}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Year</p>
                      <p className="font-medium">{vehicle.year}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">License Plate</p>
                      <p className="font-medium">{vehicle.licensePlate}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Insurance</p>
                      <Badge variant={vehicle.insurance.status === 'active' ? 'default' : 'destructive'}>
                        {vehicle.insurance.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{vehicle.insurance.provider}</p>
                    <p className="text-xs text-gray-500">Expires: {vehicle.insurance.expiryDate}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Maintenance</p>
                      <Badge variant={
                        vehicle.maintenance.status === 'good' ? 'default' :
                        vehicle.maintenance.status === 'due' ? 'secondary' : 'destructive'
                      }>
                        {vehicle.maintenance.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">Last Service: {vehicle.maintenance.lastService}</p>
                    <p className="text-xs text-gray-500">Next Service: {vehicle.maintenance.nextService}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
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
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Work Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">
                Schedule management feature coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HeadphonesIcon className="h-5 w-5" />
                  Contact Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Support: 1-800-DELIVERY
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Live Chat Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Submit Support Ticket
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Training & Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Delivery Guidelines
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Safety Protocols
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Award className="h-4 w-4 mr-2" />
                  Certification Courses
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Withdrawal Modal */}
      <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Withdraw your available balance to your preferred payment method
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Available Balance</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.availableBalance)}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Withdrawal Amount</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min="10"
                max={stats.availableBalance}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Payment Method</label>
              <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowWithdrawModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleWithdraw} className="flex-1">
                Withdraw Funds
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assignment Details Dialog (existing) */}
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
