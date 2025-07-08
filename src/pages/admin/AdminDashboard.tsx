import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotification } from "@/hooks/use-notification";
import { AdminService } from "@/services/adminService";
import { AdminDashboardData, AdminUser } from "@/types/admin";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import {
  Users,
  ShoppingCart,
  TrendingUp,
  Award,
  Shield,
  AlertTriangle,
  Activity,
  Database,
  Cpu,
  HardDrive,
  LogOut,
  Settings,
  UserCheck,
  FileText,
  DollarSign,
  Eye,
  Clock,
  Bell,
} from "lucide-react";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#8dd1e1",
  "#d084d0",
];

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(
    null,
  );
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const notification = useNotification();

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      setIsLoading(true);

      // Check if admin is logged in
      const adminData = localStorage.getItem("admin_user");
      if (!adminData) {
        navigate("/admin/login");
        return;
      }

      const admin = JSON.parse(adminData);
      setCurrentAdmin(admin);

      // Fetch dashboard data
      const data = await AdminService.getDashboardData();
      setDashboardData(data);

      notification.success(`Welcome back, ${admin.name}!`);
    } catch (error) {
      console.error("Dashboard initialization error:", error);
      setError("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const sessionToken = localStorage.getItem("admin_session");
      if (sessionToken) {
        await AdminService.adminLogout(sessionToken);
      }

      localStorage.removeItem("admin_session");
      localStorage.removeItem("admin_user");

      notification.info("Logged out successfully");
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      super_admin: "bg-red-500 text-white",
      content_admin: "bg-blue-500 text-white",
      user_admin: "bg-green-500 text-white",
      marketplace_admin: "bg-purple-500 text-white",
      crypto_admin: "bg-yellow-500 text-black",
      freelance_admin: "bg-orange-500 text-white",
      support_admin: "bg-gray-500 text-white",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!dashboardData || !currentAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No data available</p>
      </div>
    );
  }

  const userActivityData = [
    {
      name: "Jan",
      posts: dashboardData.stats.totalPosts * 0.1,
      users: dashboardData.stats.totalUsers * 0.1,
    },
    {
      name: "Feb",
      posts: dashboardData.stats.totalPosts * 0.15,
      users: dashboardData.stats.totalUsers * 0.15,
    },
    {
      name: "Mar",
      posts: dashboardData.stats.totalPosts * 0.2,
      users: dashboardData.stats.totalUsers * 0.2,
    },
    {
      name: "Apr",
      posts: dashboardData.stats.totalPosts * 0.18,
      users: dashboardData.stats.totalUsers * 0.18,
    },
    {
      name: "May",
      posts: dashboardData.stats.totalPosts * 0.22,
      users: dashboardData.stats.totalUsers * 0.22,
    },
    {
      name: "Jun",
      posts: dashboardData.stats.totalPosts * 0.15,
      users: dashboardData.stats.totalUsers * 0.25,
    },
  ];

  const systemHealthData = [
    { name: "CPU", value: dashboardData.systemHealth.cpu, color: "#8884d8" },
    {
      name: "Memory",
      value: dashboardData.systemHealth.memory,
      color: "#82ca9d",
    },
    {
      name: "Storage",
      value: dashboardData.systemHealth.storage,
      color: "#ffc658",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  SoftChat Platform Control Center
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium text-gray-900 dark:text-white">
                {currentAdmin.name}
              </p>
              <div className="flex gap-1 justify-end">
                {currentAdmin.roles.map((role) => (
                  <Badge key={role} className={`text-xs ${getRoleColor(role)}`}>
                    {role.replace("_", " ")}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin/settings")}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>

            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* System Alert */}
        {dashboardData.stats.pendingModeration > 0 && (
          <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
            <Bell className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              You have {dashboardData.stats.pendingModeration} items pending
              moderation review.
              <Button
                variant="link"
                className="ml-2 h-auto p-0 text-amber-800 dark:text-amber-200"
                onClick={() => navigate("/admin/moderation")}
              >
                Review now →
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="bg-blue-500/10 p-3 rounded-full mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold">
                {formatNumber(dashboardData.stats.totalUsers)}
              </CardTitle>
              <CardDescription>Total Users</CardDescription>
              <div className="text-xs text-green-600 mt-1">
                {formatNumber(dashboardData.stats.activeUsers)} active
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="bg-orange-500/10 p-3 rounded-full mb-4">
                <ShoppingCart className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-2xl font-bold">
                {formatNumber(dashboardData.stats.totalProducts)}
              </CardTitle>
              <CardDescription>Marketplace Products</CardDescription>
              <div className="text-xs text-blue-600 mt-1">
                {formatNumber(dashboardData.stats.totalJobs)} jobs
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="bg-green-500/10 p-3 rounded-full mb-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold">
                {formatNumber(dashboardData.stats.totalTrades)}
              </CardTitle>
              <CardDescription>Total Trades</CardDescription>
              <div className="text-xs text-green-600 mt-1">
                ${formatNumber(dashboardData.stats.revenueMonth)} this month
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="bg-red-500/10 p-3 rounded-full mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold">
                {dashboardData.stats.pendingModeration}
              </CardTitle>
              <CardDescription>Pending Reviews</CardDescription>
              <div className="text-xs text-red-600 mt-1">
                Requires attention
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Activity</CardTitle>
                  <CardDescription>
                    Monthly posts and user growth
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={userActivityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="posts" fill="#8884d8" name="Posts" />
                        <Bar dataKey="users" fill="#82ca9d" name="New Users" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Administrators</CardTitle>
                  <CardDescription>
                    Currently online admin users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.activeAdmins.slice(0, 8).map((admin) => (
                      <div
                        key={admin.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {admin.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{admin.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {admin.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {admin.roles.slice(0, 2).map((role) => (
                            <Badge
                              key={role}
                              variant="secondary"
                              className="text-xs"
                            >
                              {role.replace("_", " ")}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Admin Activity
                </CardTitle>
                <CardDescription>
                  Latest administrative actions across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentActivity.slice(0, 10).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          <span className="text-blue-600">
                            {activity.adminName}
                          </span>{" "}
                          {activity.action.replace("_", " ")}
                          <span className="text-gray-600">
                            {" "}
                            {activity.targetType}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.action}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Content Moderation Queue
                </CardTitle>
                <CardDescription>
                  Items requiring administrative review
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.pendingModeration.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{item.contentType}</Badge>
                          <Badge
                            variant={
                              item.priority === "high"
                                ? "destructive"
                                : item.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {item.priority}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium">{item.reason}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {item.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Reported {new Date(item.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                        <Button size="sm" variant="destructive">
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="w-5 h-5" />
                    System Health
                  </CardTitle>
                  <CardDescription>
                    Real-time system performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemHealthData.map((metric) => (
                      <div key={metric.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{metric.name}</span>
                          <span className="font-medium">{metric.value}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${metric.value}%`,
                              backgroundColor: metric.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    API Performance
                  </CardTitle>
                  <CardDescription>
                    API response times and error rates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm">Average Latency</span>
                      <span className="font-medium text-green-600">
                        {dashboardData.systemHealth.apiLatency}ms
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm">Error Rate</span>
                      <span className="font-medium text-red-600">
                        {(dashboardData.systemHealth.errorRate * 100).toFixed(
                          2,
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
