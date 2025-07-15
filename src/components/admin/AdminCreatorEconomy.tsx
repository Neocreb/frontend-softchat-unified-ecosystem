import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Users,
  TrendingUp,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Ban,
  PlayCircle,
  PauseCircle,
  Coins,
  Award,
  FileText,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface CreatorEarningsData {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  totalEarnings: number;
  softPointsEarned: number;
  contentCount: number;
  status: "active" | "suspended" | "under_review";
  tier: string;
  lastActive: string;
  flaggedTransactions: number;
}

interface PayoutRequest {
  id: string;
  creatorId: string;
  creatorName: string;
  amount: number;
  currency: string;
  payoutMethod: string;
  status: "pending" | "approved" | "rejected" | "processing" | "completed";
  requestedAt: string;
  adminNotes?: string;
}

interface RevenueSettingData {
  id: string;
  category: string;
  settingKey: string;
  rate: number;
  currency: string;
  softPointsRate: number;
  isActive: boolean;
  description: string;
}

interface PlatformStats {
  totalCreators: number;
  activeCreators: number;
  totalEarnings: number;
  totalSoftPointsIssued: number;
  pendingPayouts: number;
  flaggedAccounts: number;
}

const AdminCreatorEconomy: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with actual API calls
  const [platformStats] = useState<PlatformStats>({
    totalCreators: 12456,
    activeCreators: 8934,
    totalEarnings: 2847392.5,
    totalSoftPointsIssued: 45789234,
    pendingPayouts: 284,
    flaggedAccounts: 23,
  });

  const [creatorEarnings] = useState<CreatorEarningsData[]>([
    {
      id: "1",
      creatorId: "user1",
      creatorName: "Sarah Johnson",
      creatorUsername: "@sarah_creates",
      totalEarnings: 15420.5,
      softPointsEarned: 89234,
      contentCount: 456,
      status: "active",
      tier: "gold",
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      flaggedTransactions: 0,
    },
    {
      id: "2",
      creatorId: "user2",
      creatorName: "Mike Chen",
      creatorUsername: "@miketech",
      totalEarnings: 8934.75,
      softPointsEarned: 45672,
      contentCount: 289,
      status: "under_review",
      tier: "silver",
      lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      flaggedTransactions: 3,
    },
    {
      id: "3",
      creatorId: "user3",
      creatorName: "Emma Wilson",
      creatorUsername: "@emma_art",
      totalEarnings: 23156.25,
      softPointsEarned: 128459,
      contentCount: 678,
      status: "active",
      tier: "platinum",
      lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      flaggedTransactions: 0,
    },
  ]);

  const [payoutRequests] = useState<PayoutRequest[]>([
    {
      id: "1",
      creatorId: "user1",
      creatorName: "Sarah Johnson",
      amount: 1250.0,
      currency: "USD",
      payoutMethod: "bank_transfer",
      status: "pending",
      requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      creatorId: "user3",
      creatorName: "Emma Wilson",
      amount: 3420.75,
      currency: "USD",
      payoutMethod: "crypto_wallet",
      status: "approved",
      requestedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const [revenueSettings] = useState<RevenueSettingData[]>([
    {
      id: "1",
      category: "views",
      settingKey: "standard_rate",
      rate: 0.001,
      currency: "USD",
      softPointsRate: 0.005,
      isActive: true,
      description: "Standard rate per view for content monetization",
    },
    {
      id: "2",
      category: "tips",
      settingKey: "softpoints_per_tip",
      rate: 1.0,
      currency: "SP",
      softPointsRate: 1.0,
      isActive: true,
      description: "SoftPoints awarded per tip received",
    },
    {
      id: "3",
      category: "subscriptions",
      settingKey: "softpoints_per_subscription",
      rate: 10.0,
      currency: "SP",
      softPointsRate: 10.0,
      isActive: true,
      description: "SoftPoints awarded per new subscription",
    },
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      case "under_review":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
        );
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTierBadge = (tier: string) => {
    const colors = {
      bronze: "bg-orange-100 text-orange-800",
      silver: "bg-gray-100 text-gray-800",
      gold: "bg-yellow-100 text-yellow-800",
      platinum: "bg-purple-100 text-purple-800",
      diamond: "bg-blue-100 text-blue-800",
    };

    return (
      <Badge
        className={
          colors[tier as keyof typeof colors] || "bg-gray-100 text-gray-800"
        }
      >
        {tier.toUpperCase()}
      </Badge>
    );
  };

  const handleApprovePayout = (id: string) => {
    console.log("Approving payout:", id);
    // Implement approval logic
  };

  const handleRejectPayout = (id: string) => {
    console.log("Rejecting payout:", id);
    // Implement rejection logic
  };

  const handleSuspendCreator = (id: string) => {
    console.log("Suspending creator:", id);
    // Implement suspension logic
  };

  const handleUpdateSettings = (
    id: string,
    settings: Partial<RevenueSettingData>,
  ) => {
    console.log("Updating settings:", id, settings);
    // Implement settings update logic
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Creator Economy Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and manage creator earnings, payouts, and monetization
            settings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Creators
              </span>
            </div>
            <div className="text-2xl font-bold">
              {formatNumber(platformStats.totalCreators)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <PlayCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Creators
              </span>
            </div>
            <div className="text-2xl font-bold">
              {formatNumber(platformStats.activeCreators)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Earnings
              </span>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(platformStats.totalEarnings)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                SoftPoints Issued
              </span>
            </div>
            <div className="text-2xl font-bold">
              {formatNumber(platformStats.totalSoftPointsIssued)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending Payouts
              </span>
            </div>
            <div className="text-2xl font-bold">
              {platformStats.pendingPayouts}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Flagged Accounts
              </span>
            </div>
            <div className="text-2xl font-bold">
              {platformStats.flaggedAccounts}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="creators">Creators</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Revenue Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">
                    Revenue Chart Placeholder
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {creatorEarnings.slice(0, 5).map((creator, index) => (
                    <div key={creator.id} className="flex items-center gap-3">
                      <div className="text-sm font-medium text-gray-500 w-6">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{creator.creatorName}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {creator.creatorUsername}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {formatCurrency(creator.totalEarnings)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formatNumber(creator.softPointsEarned)} SP
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Creators Tab */}
        <TabsContent value="creators" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle>Creator Management</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search creators..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Creator</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Total Earnings</TableHead>
                    <TableHead>SoftPoints</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creatorEarnings.map((creator) => (
                    <TableRow key={creator.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {creator.creatorName}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {creator.creatorUsername}
                          </div>
                          {creator.flaggedTransactions > 0 && (
                            <Badge
                              variant="destructive"
                              className="text-xs mt-1"
                            >
                              {creator.flaggedTransactions} flagged
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getTierBadge(creator.tier)}</TableCell>
                      <TableCell>
                        {formatCurrency(creator.totalEarnings)}
                      </TableCell>
                      <TableCell>
                        {formatNumber(creator.softPointsEarned)}
                      </TableCell>
                      <TableCell>{creator.contentCount}</TableCell>
                      <TableCell>{getStatusBadge(creator.status)}</TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(creator.lastActive), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          {creator.status === "active" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSuspendCreator(creator.id)}
                            >
                              <Ban className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payouts Tab */}
        <TabsContent value="payouts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payout Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Creator</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payoutRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="font-medium">{request.creatorName}</div>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(request.amount)} {request.currency}
                      </TableCell>
                      <TableCell className="capitalize">
                        {request.payoutMethod.replace("_", " ")}
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(request.requestedAt), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>
                        {request.status === "pending" && (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApprovePayout(request.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRejectPayout(request.id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Revenue Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {revenueSettings.map((setting) => (
                  <div key={setting.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium capitalize">
                          {setting.category} -{" "}
                          {setting.settingKey.replace("_", " ")}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {setting.description}
                        </p>
                      </div>
                      <Switch checked={setting.isActive} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm">Rate</Label>
                        <Input
                          type="number"
                          step="0.0001"
                          value={setting.rate}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Currency</Label>
                        <Input value={setting.currency} className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-sm">SoftPoints Rate</Label>
                        <Input
                          type="number"
                          step="0.001"
                          value={setting.softPointsRate}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <Button
                        onClick={() =>
                          handleUpdateSettings(setting.id, setting)
                        }
                        size="sm"
                      >
                        Update Settings
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCreatorEconomy;
