import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Car,
  Phone,
  Mail,
  Star,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  FileText,
  Settings,
  Ban,
  Shield,
  Award,
  Calendar,
  Package,
  Route,
  BarChart3,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  MessageCircle,
} from "lucide-react";
import { DispatchPartner, DispatchStats, DeliveryOrder } from "@/types/dispatch";
import { toast } from "sonner";

// Mock data for demonstration
const mockPartners: DispatchPartner[] = [
  {
    id: "dp_001",
    userId: "user_001",
    applicationStatus: "approved",
    applicationDate: "2024-01-10T10:00:00Z",
    approvalDate: "2024-01-12T14:30:00Z",
    fullName: "John Doe",
    phoneNumber: "+234 801 234 5678",
    address: "15 Allen Avenue, Ikeja, Lagos",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    vehicleType: "motorcycle",
    vehicleModel: "Honda CB125F",
    vehicleYear: 2022,
    licensePlate: "ABC-123-XYZ",
    isActive: true,
    isOnline: true,
    totalDeliveries: 145,
    completedDeliveries: 138,
    cancelledDeliveries: 7,
    averageRating: 4.8,
    totalRatings: 120,
    onTimeDeliveryRate: 94.5,
    totalEarnings: 45250,
    pendingPayouts: 3450,
    isVerified: true,
    verificationLevel: "standard",
    complianceScore: 95,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-15T16:45:00Z",
  },
  {
    id: "dp_002",
    userId: "user_002", 
    applicationStatus: "pending",
    applicationDate: "2024-01-14T09:15:00Z",
    fullName: "Sarah Johnson",
    phoneNumber: "+234 802 345 6789",
    address: "42 Admiralty Road, Lekki Phase 1, Lagos",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    vehicleType: "bicycle",
    vehicleModel: "Mountain Bike",
    vehicleYear: 2023,
    licensePlate: "N/A",
    isActive: false,
    isOnline: false,
    totalDeliveries: 0,
    completedDeliveries: 0,
    cancelledDeliveries: 0,
    averageRating: 0,
    totalRatings: 0,
    onTimeDeliveryRate: 0,
    totalEarnings: 0,
    pendingPayouts: 0,
    isVerified: false,
    verificationLevel: "basic",
    complianceScore: 100,
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-14T09:15:00Z",
  },
  {
    id: "dp_003",
    userId: "user_003",
    applicationStatus: "suspended",
    applicationDate: "2024-01-05T15:30:00Z",
    approvalDate: "2024-01-07T11:20:00Z",
    fullName: "Mike Chen",
    phoneNumber: "+234 803 456 7890",
    address: "78 Victoria Island, Lagos",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    vehicleType: "car",
    vehicleModel: "Toyota Corolla",
    vehicleYear: 2020,
    licensePlate: "DEF-456-ABC",
    isActive: false,
    isOnline: false,
    totalDeliveries: 89,
    completedDeliveries: 82,
    cancelledDeliveries: 7,
    averageRating: 4.2,
    totalRatings: 75,
    onTimeDeliveryRate: 78.5,
    totalEarnings: 28750,
    pendingPayouts: 0,
    isVerified: true,
    verificationLevel: "standard",
    complianceScore: 65,
    createdAt: "2024-01-05T15:30:00Z",
    updatedAt: "2024-01-13T20:10:00Z",
  },
];

const mockOverviewStats = {
  totalPartners: 156,
  activePartners: 98,
  pendingApplications: 23,
  suspendedPartners: 8,
  totalDeliveries: 12450,
  completedDeliveries: 11780,
  averageRating: 4.6,
  totalEarnings: 2850000,
};

export const AdminDispatchPartners: React.FC = () => {
  const [partners, setPartners] = useState<DispatchPartner[]>(mockPartners);
  const [filteredPartners, setFilteredPartners] = useState<DispatchPartner[]>(mockPartners);
  const [selectedPartner, setSelectedPartner] = useState<DispatchPartner | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showSuspensionDialog, setShowSuspensionDialog] = useState(false);
  const [actionReason, setActionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [overviewStats, setOverviewStats] = useState(mockOverviewStats);

  // Filter partners based on search and filters
  useEffect(() => {
    let filtered = partners;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(partner =>
        partner.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.phoneNumber.includes(searchTerm) ||
        partner.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.vehicleType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(partner => partner.applicationStatus === statusFilter);
    }

    // Verification filter
    if (verificationFilter !== "all") {
      if (verificationFilter === "verified") {
        filtered = filtered.filter(partner => partner.isVerified);
      } else if (verificationFilter === "unverified") {
        filtered = filtered.filter(partner => !partner.isVerified);
      }
    }

    setFilteredPartners(filtered);
  }, [partners, searchTerm, statusFilter, verificationFilter]);

  const handleApprovePartner = useCallback(async (partnerId: string) => {
    setIsProcessing(true);
    try {
      setPartners(prev => prev.map(partner => 
        partner.id === partnerId 
          ? { 
              ...partner, 
              applicationStatus: "approved", 
              approvalDate: new Date().toISOString(),
              isActive: true,
              isVerified: true 
            }
          : partner
      ));
      toast.success("Partner approved successfully");
      setShowApprovalDialog(false);
      setSelectedPartner(null);
    } catch (error) {
      console.error("Error approving partner:", error);
      toast.error("Failed to approve partner");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleRejectPartner = useCallback(async (partnerId: string, reason: string) => {
    setIsProcessing(true);
    try {
      setPartners(prev => prev.map(partner => 
        partner.id === partnerId 
          ? { 
              ...partner, 
              applicationStatus: "rejected",
              rejectionReason: reason,
              isActive: false 
            }
          : partner
      ));
      toast.success("Partner application rejected");
      setShowApprovalDialog(false);
      setSelectedPartner(null);
      setActionReason("");
    } catch (error) {
      console.error("Error rejecting partner:", error);
      toast.error("Failed to reject partner");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleSuspendPartner = useCallback(async (partnerId: string, reason: string) => {
    setIsProcessing(true);
    try {
      setPartners(prev => prev.map(partner => 
        partner.id === partnerId 
          ? { 
              ...partner, 
              applicationStatus: "suspended",
              isActive: false,
              isOnline: false 
            }
          : partner
      ));
      toast.success("Partner suspended");
      setShowSuspensionDialog(false);
      setSelectedPartner(null);
      setActionReason("");
    } catch (error) {
      console.error("Error suspending partner:", error);
      toast.error("Failed to suspend partner");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Rejected</Badge>;
      case "suspended":
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    change?: string;
    changeType?: "increase" | "decrease";
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, changeType = "increase", icon, color }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{value}</p>
            {change && (
              <div className="flex items-center text-sm">
                {changeType === "increase" ? (
                  <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
                )}
                <span className={changeType === "increase" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                  {change}
                </span>
              </div>
            )}
          </div>
          <div className={`p-4 rounded-xl ${color} shadow-sm`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dispatch Partners Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage delivery partners, applications, and performance analytics
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="partners">Partners</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Partners"
                value={overviewStats.totalPartners}
                change="+12% this month"
                icon={<Users className="w-6 h-6 text-white" />}
                color="bg-gradient-to-br from-blue-500 to-cyan-600"
              />
              <StatCard
                title="Active Partners"
                value={overviewStats.activePartners}
                change="+5% this week"
                icon={<UserCheck className="w-6 h-6 text-white" />}
                color="bg-gradient-to-br from-green-500 to-emerald-600"
              />
              <StatCard
                title="Pending Applications"
                value={overviewStats.pendingApplications}
                icon={<Clock className="w-6 h-6 text-white" />}
                color="bg-gradient-to-br from-yellow-500 to-orange-600"
              />
              <StatCard
                title="Average Rating"
                value={`${overviewStats.averageRating}/5`}
                change="+0.2 this month"
                icon={<Star className="w-6 h-6 text-white" />}
                color="bg-gradient-to-br from-purple-500 to-violet-600"
              />
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {partners
                      .filter(p => p.applicationStatus === "pending")
                      .slice(0, 5)
                      .map((partner) => (
                        <div key={partner.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>{partner.fullName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{partner.fullName}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{partner.city}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(partner.applicationStatus)}
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(partner.applicationDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Deliveries</span>
                      <span className="font-bold">{overviewStats.totalDeliveries.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</span>
                      <span className="font-bold text-green-600">
                        {((overviewStats.completedDeliveries / overviewStats.totalDeliveries) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Platform Earnings</span>
                      <span className="font-bold text-blue-600">₦{overviewStats.totalEarnings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Partner Satisfaction</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">{overviewStats.averageRating}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Partners Tab */}
          <TabsContent value="partners" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search partners by name, phone, city..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Verification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="unverified">Unverified</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Partners Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Partners ({filteredPartners.length})</CardTitle>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Invite Partner
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Partner</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Deliveries</TableHead>
                        <TableHead>Earnings</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPartners.map((partner) => (
                        <TableRow key={partner.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback>{partner.fullName[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{partner.fullName}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{partner.phoneNumber}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className={`w-2 h-2 rounded-full ${partner.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                                  <span className="text-xs text-gray-500">
                                    {partner.isOnline ? 'Online' : 'Offline'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{partner.city}, {partner.state}</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Car className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium">{partner.vehicleType}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{partner.vehicleModel}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(partner.applicationStatus)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{partner.averageRating}</span>
                              <span className="text-xs text-gray-500">({partner.totalRatings})</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm font-medium">{partner.totalDeliveries}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {partner.completedDeliveries} completed
                            </p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm font-medium">₦{partner.totalEarnings.toLocaleString()}</p>
                            {partner.pendingPayouts > 0 && (
                              <p className="text-xs text-yellow-600">₦{partner.pendingPayouts} pending</p>
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedPartner(partner)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Partner
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {partner.applicationStatus === "pending" && (
                                  <>
                                    <DropdownMenuItem 
                                      onClick={() => {
                                        setSelectedPartner(partner);
                                        setShowApprovalDialog(true);
                                      }}
                                      className="text-green-600"
                                    >
                                      <CheckCircle2 className="w-4 h-4 mr-2" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => {
                                        setSelectedPartner(partner);
                                        setShowApprovalDialog(true);
                                      }}
                                      className="text-red-600"
                                    >
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Reject
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {partner.applicationStatus === "approved" && (
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      setSelectedPartner(partner);
                                      setShowSuspensionDialog(true);
                                    }}
                                    className="text-orange-600"
                                  >
                                    <Ban className="w-4 h-4 mr-2" />
                                    Suspend
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Applications ({partners.filter(p => p.applicationStatus === "pending").length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {partners
                    .filter(p => p.applicationStatus === "pending")
                    .map((partner) => (
                      <Card key={partner.id} className="border-l-4 border-l-yellow-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Avatar className="w-12 h-12">
                                <AvatarFallback>{partner.fullName[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{partner.fullName}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{partner.phoneNumber}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {partner.vehicleType} • {partner.city}, {partner.state}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Applied {new Date(partner.applicationDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedPartner(partner)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Review
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleApprovePartner(partner.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setSelectedPartner(partner);
                                  setShowApprovalDialog(true);
                                }}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  
                  {partners.filter(p => p.applicationStatus === "pending").length === 0 && (
                    <div className="text-center py-12">
                      <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No Pending Applications
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        All applications have been processed
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Partner Performance Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Excellent (4.5+ rating)</span>
                      <div className="flex items-center gap-2">
                        <Progress value={75} className="w-24 h-2" />
                        <span className="text-sm font-medium">75%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Good (4.0-4.4 rating)</span>
                      <div className="flex items-center gap-2">
                        <Progress value={20} className="w-24 h-2" />
                        <span className="text-sm font-medium">20%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Fair (3.5-3.9 rating)</span>
                      <div className="flex items-center gap-2">
                        <Progress value={5} className="w-24 h-2" />
                        <span className="text-sm font-medium">5%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Route className="w-5 h-5" />
                    Vehicle Type Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Motorcycles</span>
                      <div className="flex items-center gap-2">
                        <Progress value={60} className="w-24 h-2" />
                        <span className="text-sm font-medium">60%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cars</span>
                      <div className="flex items-center gap-2">
                        <Progress value={25} className="w-24 h-2" />
                        <span className="text-sm font-medium">25%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Bicycles</span>
                      <div className="flex items-center gap-2">
                        <Progress value={15} className="w-24 h-2" />
                        <span className="text-sm font-medium">15%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Partners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {partners
                    .filter(p => p.applicationStatus === "approved")
                    .sort((a, b) => b.averageRating - a.averageRating)
                    .slice(0, 5)
                    .map((partner, index) => (
                      <div key={partner.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full font-bold text-sm">
                            #{index + 1}
                          </div>
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>{partner.fullName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{partner.fullName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{partner.city}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold">{partner.averageRating}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {partner.totalDeliveries} deliveries
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dispatch Partner Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="commissionRate">Default Commission Rate (%)</Label>
                    <Input id="commissionRate" defaultValue="15" type="number" />
                  </div>
                  <div>
                    <Label htmlFor="minRating">Minimum Rating Requirement</Label>
                    <Input id="minRating" defaultValue="4.0" type="number" step="0.1" />
                  </div>
                  <div>
                    <Label htmlFor="maxDistance">Maximum Delivery Distance (km)</Label>
                    <Input id="maxDistance" defaultValue="50" type="number" />
                  </div>
                  <div>
                    <Label htmlFor="payoutSchedule">Payout Schedule</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Partner Detail Dialog */}
        {selectedPartner && !showApprovalDialog && !showSuspensionDialog && (
          <Dialog open={!!selectedPartner} onOpenChange={() => setSelectedPartner(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Partner Details - {selectedPartner.fullName}</DialogTitle>
                <DialogDescription>
                  Complete information about this dispatch partner
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Personal Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {selectedPartner.fullName}</p>
                      <p><strong>Phone:</strong> {selectedPartner.phoneNumber}</p>
                      <p><strong>Address:</strong> {selectedPartner.address}</p>
                      <p><strong>City:</strong> {selectedPartner.city}, {selectedPartner.state}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Vehicle Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Type:</strong> {selectedPartner.vehicleType}</p>
                      <p><strong>Model:</strong> {selectedPartner.vehicleModel}</p>
                      <p><strong>Year:</strong> {selectedPartner.vehicleYear}</p>
                      <p><strong>License Plate:</strong> {selectedPartner.licensePlate}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Performance Metrics</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Total Deliveries:</strong> {selectedPartner.totalDeliveries}</p>
                      <p><strong>Completed:</strong> {selectedPartner.completedDeliveries}</p>
                      <p><strong>Cancelled:</strong> {selectedPartner.cancelledDeliveries}</p>
                      <p><strong>Average Rating:</strong> {selectedPartner.averageRating}/5 ({selectedPartner.totalRatings} reviews)</p>
                      <p><strong>On-Time Rate:</strong> {selectedPartner.onTimeDeliveryRate}%</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Financial Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Total Earnings:</strong> ₦{selectedPartner.totalEarnings.toLocaleString()}</p>
                      <p><strong>Pending Payouts:</strong> ₦{selectedPartner.pendingPayouts.toLocaleString()}</p>
                      <p><strong>Verification Level:</strong> {selectedPartner.verificationLevel}</p>
                      <p><strong>Compliance Score:</strong> {selectedPartner.complianceScore}/100</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedPartner(null)}>
                  Close
                </Button>
                {selectedPartner.applicationStatus === "pending" && (
                  <>
                    <Button 
                      onClick={() => handleApprovePartner(selectedPartner.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve Partner
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => setShowApprovalDialog(true)}
                    >
                      Reject Application
                    </Button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Approval/Rejection Dialog */}
        {showApprovalDialog && selectedPartner && (
          <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Partner Application Decision</DialogTitle>
                <DialogDescription>
                  Make a decision on {selectedPartner.fullName}'s application
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reason">Reason (required for rejection)</Label>
                  <Textarea
                    id="reason"
                    placeholder="Provide a reason for rejection..."
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleApprovePartner(selectedPartner.id)}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? "Processing..." : "Approve"}
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleRejectPartner(selectedPartner.id, actionReason)}
                  disabled={isProcessing || !actionReason.trim()}
                >
                  {isProcessing ? "Processing..." : "Reject"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Suspension Dialog */}
        {showSuspensionDialog && selectedPartner && (
          <Dialog open={showSuspensionDialog} onOpenChange={setShowSuspensionDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Suspend Partner</DialogTitle>
                <DialogDescription>
                  Suspend {selectedPartner.fullName} from the platform
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    This will immediately deactivate the partner and prevent them from receiving new delivery requests.
                  </AlertDescription>
                </Alert>
                
                <div>
                  <Label htmlFor="suspensionReason">Reason for Suspension *</Label>
                  <Textarea
                    id="suspensionReason"
                    placeholder="Provide a detailed reason for suspension..."
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowSuspensionDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleSuspendPartner(selectedPartner.id, actionReason)}
                  disabled={isProcessing || !actionReason.trim()}
                >
                  {isProcessing ? "Processing..." : "Suspend Partner"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default AdminDispatchPartners;
