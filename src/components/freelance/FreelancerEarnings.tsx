import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Wallet,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FreelanceWithdrawalMethods from "./FreelanceWithdrawalMethods";
import FreelanceTaxDocuments from "./FreelanceTaxDocuments";
import FreelanceInvoicing from "./FreelanceInvoicing";

interface EarningRecord {
  id: string;
  projectTitle: string;
  client: {
    name: string;
    avatar?: string;
  };
  amount: number;
  type: "milestone" | "hourly" | "fixed" | "bonus";
  status: "pending" | "completed" | "processing" | "failed";
  date: Date;
  description?: string;
  invoiceId?: string;
}

interface EarningsStats {
  totalEarnings: number;
  thisMonth: number;
  lastMonth: number;
  pending: number;
  averageProject: number;
  topClient: string;
  growthRate: number;
}

const mockEarnings: EarningRecord[] = [
  {
    id: "1",
    projectTitle: "E-commerce Website Development",
    client: { name: "Sarah Johnson", avatar: "/api/placeholder/40/40" },
    amount: 1500,
    type: "milestone",
    status: "completed",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    description: "Milestone 3: Frontend Development",
    invoiceId: "INV-001",
  },
  {
    id: "2",
    projectTitle: "Mobile App UI/UX Design",
    client: { name: "Marcus Chen", avatar: "/api/placeholder/40/40" },
    amount: 800,
    type: "fixed",
    status: "pending",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    description: "Final payment upon project completion",
  },
  {
    id: "3",
    projectTitle: "WordPress Website Redesign",
    client: { name: "Emily Davis", avatar: "/api/placeholder/40/40" },
    amount: 1200,
    type: "milestone",
    status: "completed",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    description: "Milestone 2: Design Implementation",
    invoiceId: "INV-002",
  },
  {
    id: "4",
    projectTitle: "Logo Design",
    client: { name: "David Wilson", avatar: "/api/placeholder/40/40" },
    amount: 500,
    type: "bonus",
    status: "completed",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    description: "Performance bonus for early delivery",
    invoiceId: "INV-003",
  },
  {
    id: "5",
    projectTitle: "Consulting Services",
    client: { name: "Alice Thompson", avatar: "/api/placeholder/40/40" },
    amount: 360,
    type: "hourly",
    status: "processing",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    description: "6 hours × $60/hour",
  },
];

const mockStats: EarningsStats = {
  totalEarnings: 24750,
  thisMonth: 4360,
  lastMonth: 3890,
  pending: 1200,
  averageProject: 1580,
  topClient: "Sarah Johnson",
  growthRate: 12.1,
};

export const FreelancerEarnings: React.FC = () => {
  const [earnings, setEarnings] = useState<EarningRecord[]>(mockEarnings);
  const [stats, setStats] = useState<EarningsStats>(mockStats);
  const [timeFilter, setTimeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeModal, setActiveModal] = useState<"withdrawal" | "tax" | "invoicing" | null>(null);

  const getStatusColor = (status: EarningRecord["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: EarningRecord["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "processing":
        return <CreditCard className="w-4 h-4" />;
      case "failed":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: EarningRecord["type"]) => {
    switch (type) {
      case "milestone":
        return "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300";
      case "hourly":
        return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300";
      case "fixed":
        return "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300";
      case "bonus":
        return "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300";
      default:
        return "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  const filteredEarnings = earnings.filter((earning) => {
    const matchesStatus = statusFilter === "all" || earning.status === statusFilter;
    
    let matchesTime = true;
    if (timeFilter === "thisMonth") {
      const thisMonth = new Date().getMonth();
      matchesTime = earning.date.getMonth() === thisMonth;
    } else if (timeFilter === "lastMonth") {
      const lastMonth = new Date().getMonth() - 1;
      matchesTime = earning.date.getMonth() === lastMonth;
    } else if (timeFilter === "thisYear") {
      const thisYear = new Date().getFullYear();
      matchesTime = earning.date.getFullYear() === thisYear;
    }
    
    return matchesStatus && matchesTime;
  });

  const EarningCard: React.FC<{ earning: EarningRecord }> = ({ earning }) => (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
              {earning.projectTitle}
            </h3>
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={earning.client.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                  {earning.client.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm text-gray-900 dark:text-white">
                  {earning.client.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(earning.date)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${earning.amount.toLocaleString()}
              </p>
              <Badge className={`${getTypeColor(earning.type)} text-xs`}>
                {earning.type}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge className={`${getStatusColor(earning.status)} flex items-center gap-1`}>
              {getStatusIcon(earning.status)}
              {earning.status}
            </Badge>
            {earning.invoiceId && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {earning.invoiceId}
              </span>
            )}
          </div>

          {earning.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              {earning.description}
            </p>
          )}

          <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            {earning.invoiceId && (
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const monthlyProgress = (stats.thisMonth / (stats.thisMonth + 1000)) * 100;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${stats.totalEarnings.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">This Month</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${stats.thisMonth.toLocaleString()}
                </p>
                <div className="flex items-center text-sm mt-1">
                  {stats.growthRate > 0 ? (
                    <ArrowUpRight className="w-4 h-4 mr-1 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1 text-red-500" />
                  )}
                  <span className={stats.growthRate > 0 ? "text-green-600" : "text-red-600"}>
                    {Math.abs(stats.growthRate)}% vs last month
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  ${stats.pending.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Avg Project</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${stats.averageProject.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Monthly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Current month earnings</span>
              <span className="font-semibold">${stats.thisMonth.toLocaleString()} / $5,500 goal</span>
            </div>
            <Progress value={monthlyProgress} className="h-3" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-lg font-bold text-green-600">{Math.round(monthlyProgress)}%</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Goal Progress</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-lg font-bold text-blue-600">
                  ${(5500 - stats.thisMonth).toLocaleString()}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Remaining</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-lg font-bold text-purple-600">12</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Days Left</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Earnings History</h2>
          <p className="text-gray-600 dark:text-gray-400">Track your income and payment history</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Wallet className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Earnings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEarnings.map((earning) => (
          <EarningCard key={earning.id} earning={earning} />
        ))}
      </div>

      {filteredEarnings.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="p-12 text-center">
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No earnings found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {timeFilter !== "all" || statusFilter !== "all" 
                ? "Try adjusting your filter criteria"
                : "Complete your first project to start earning"
              }
            </p>
            <Button>
              Browse Available Jobs
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            Payment Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => setActiveModal("withdrawal")}
            >
              <div className="text-left">
                <p className="font-medium">Withdrawal Methods</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage payment methods</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => setActiveModal("tax")}
            >
              <div className="text-left">
                <p className="font-medium">Tax Documents</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Download tax forms</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => setActiveModal("invoicing")}
            >
              <div className="text-left">
                <p className="font-medium">Invoicing</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Create and send invoices</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings Modals */}
      <Dialog open={activeModal === "withdrawal"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Withdrawal Methods</DialogTitle>
          </DialogHeader>
          <FreelanceWithdrawalMethods />
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "tax"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tax Documents</DialogTitle>
          </DialogHeader>
          <FreelanceTaxDocuments />
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "invoicing"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoicing</DialogTitle>
          </DialogHeader>
          <FreelanceInvoicing />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FreelancerEarnings;
