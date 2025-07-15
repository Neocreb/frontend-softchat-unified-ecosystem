import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Users,
  Briefcase,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Shield,
  Flag,
  Gavel,
  CreditCard,
  Clock,
  MessageSquare,
  Star,
  Award,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Ban,
  Play,
  Pause,
  MoreHorizontal,
  Edit,
  Trash2,
  FileText,
  Database,
  Activity,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Zap,
  Crown,
  Target,
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  activeFreelancers: number;
  activeClients: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageProjectValue: number;
  disputeRate: number;
  successRate: number;
  platformFees: number;
}

interface UserAccount {
  id: string;
  name: string;
  email: string;
  type: "freelancer" | "client" | "admin";
  status: "active" | "suspended" | "pending" | "banned";
  avatar?: string;
  rating: number;
  totalProjects: number;
  totalEarnings: number;
  joinedAt: Date;
  lastActive: Date;
  verificationStatus: "verified" | "pending" | "rejected" | "none";
  flags: UserFlag[];
  location: string;
  skills?: string[];
  completionRate: number;
}

interface ProjectRecord {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  freelancerId: string;
  freelancerName: string;
  status: "active" | "completed" | "cancelled" | "disputed";
  budget: number;
  startDate: Date;
  endDate?: Date;
  category: string;
  milestones: number;
  completedMilestones: number;
  escrowStatus: "pending" | "funded" | "released" | "disputed";
  flagged: boolean;
}

interface UserFlag {
  id: string;
  reason: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  reporterId: string;
  timestamp: Date;
  status: "open" | "investigating" | "resolved" | "dismissed";
}

interface SystemAlert {
  id: string;
  type: "security" | "payment" | "dispute" | "performance" | "maintenance";
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  actions?: string[];
}

const EnhancedAdminPanel: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);

  useEffect(() => {
    initializeAdminData();
  }, []);

  const initializeAdminData = () => {
    // Initialize admin statistics
    const adminStats: AdminStats = {
      totalUsers: 12847,
      activeFreelancers: 8934,
      activeClients: 3913,
      totalProjects: 45672,
      activeProjects: 1247,
      completedProjects: 42891,
      totalRevenue: 2847000,
      monthlyRevenue: 187500,
      averageProjectValue: 1850,
      disputeRate: 2.3,
      successRate: 96.7,
      platformFees: 142350,
    };

    // Sample user data
    const sampleUsers: UserAccount[] = [
      {
        id: "user_1",
        name: "John Developer",
        email: "john.dev@example.com",
        type: "freelancer",
        status: "active",
        rating: 4.9,
        totalProjects: 87,
        totalEarnings: 156000,
        joinedAt: new Date("2023-01-15"),
        lastActive: new Date(),
        verificationStatus: "verified",
        flags: [],
        location: "San Francisco, CA",
        skills: ["React", "Node.js", "TypeScript"],
        completionRate: 98.5,
      },
      {
        id: "user_2",
        name: "Jane Designer",
        email: "jane.design@example.com",
        type: "freelancer",
        status: "suspended",
        rating: 4.2,
        totalProjects: 34,
        totalEarnings: 78000,
        joinedAt: new Date("2023-03-20"),
        lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        verificationStatus: "pending",
        flags: [
          {
            id: "flag_1",
            reason: "Quality complaints",
            description: "Multiple clients reported quality issues",
            severity: "medium",
            reporterId: "system",
            timestamp: new Date(),
            status: "investigating",
          },
        ],
        location: "New York, NY",
        skills: ["UI/UX", "Figma", "Adobe Creative Suite"],
        completionRate: 89.2,
      },
      {
        id: "user_3",
        name: "TechCorp Inc.",
        email: "contact@techcorp.com",
        type: "client",
        status: "active",
        rating: 4.7,
        totalProjects: 23,
        totalEarnings: 0,
        joinedAt: new Date("2023-06-10"),
        lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        verificationStatus: "verified",
        flags: [],
        location: "Austin, TX",
        completionRate: 95.7,
      },
    ];

    // Sample project data
    const sampleProjects: ProjectRecord[] = [
      {
        id: "proj_1",
        title: "E-commerce Website Development",
        clientId: "user_3",
        clientName: "TechCorp Inc.",
        freelancerId: "user_1",
        freelancerName: "John Developer",
        status: "active",
        budget: 5000,
        startDate: new Date("2024-01-15"),
        category: "Web Development",
        milestones: 4,
        completedMilestones: 2,
        escrowStatus: "funded",
        flagged: false,
      },
      {
        id: "proj_2",
        title: "Mobile App UI Design",
        clientId: "user_3",
        clientName: "TechCorp Inc.",
        freelancerId: "user_2",
        freelancerName: "Jane Designer",
        status: "disputed",
        budget: 3000,
        startDate: new Date("2024-01-10"),
        category: "Design",
        milestones: 3,
        completedMilestones: 1,
        escrowStatus: "disputed",
        flagged: true,
      },
    ];

    // Sample system alerts
    const sampleAlerts: SystemAlert[] = [
      {
        id: "alert_1",
        type: "dispute",
        priority: "high",
        title: "New Dispute Requires Attention",
        message: "Project #proj_2 has been flagged for dispute resolution",
        timestamp: new Date(),
        acknowledged: false,
        actions: ["Review Dispute", "Contact Parties", "Escalate"],
      },
      {
        id: "alert_2",
        type: "security",
        priority: "medium",
        title: "Suspicious Login Activity",
        message: "Multiple failed login attempts detected from new location",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        acknowledged: false,
        actions: ["Review Logs", "Contact User", "Lock Account"],
      },
      {
        id: "alert_3",
        type: "payment",
        priority: "critical",
        title: "Payment Processing Error",
        message: "Escrow release failed for 3 transactions",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        acknowledged: true,
        actions: ["Retry Payment", "Contact Support", "Manual Review"],
      },
    ];

    setStats(adminStats);
    setUsers(sampleUsers);
    setProjects(sampleProjects);
    setAlerts(sampleAlerts);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "suspended":
        return "bg-yellow-100 text-yellow-800";
      case "banned":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      case "disputed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const DashboardStats = ({ stats }: { stats: AdminStats }) => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">
                  {stats.totalUsers.toLocaleString()}
                </p>
                <p className="text-xs text-green-600">+12% this month</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Projects
                </p>
                <p className="text-2xl font-bold">
                  {stats.activeProjects.toLocaleString()}
                </p>
                <p className="text-xs text-blue-600">Live projects</p>
              </div>
              <Briefcase className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Monthly Revenue
                </p>
                <p className="text-2xl font-bold">
                  ${stats.monthlyRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-green-600">+8% vs last month</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Success Rate
                </p>
                <p className="text-2xl font-bold">{stats.successRate}%</p>
                <p className="text-xs text-green-600">Project completion</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const UserManagement = () => {
    const filteredUsers = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === "all" || user.status === filterStatus;
      return matchesSearch && matchesFilter;
    });

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {filteredUsers.map((user) => (
            <Card
              key={user.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{user.name}</h4>
                        <Badge
                          variant="outline"
                          className={
                            user.type === "freelancer"
                              ? "text-blue-600"
                              : "text-purple-600"
                          }
                        >
                          {user.type}
                        </Badge>
                        {user.verificationStatus === "verified" && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        {user.flags.length > 0 && (
                          <Flag className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                        <span>Joined {user.joinedAt.toLocaleDateString()}</span>
                        <span>
                          Last active {user.lastActive.toLocaleDateString()}
                        </span>
                        <span>{user.totalProjects} projects</span>
                        {user.type === "freelancer" && (
                          <span>★ {user.rating}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                      {user.type === "freelancer" && (
                        <p className="text-sm font-medium mt-1">
                          ${user.totalEarnings.toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserDetails(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const ProjectManagement = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Project Management</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{project.title}</h4>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      {project.flagged && (
                        <Flag className="w-4 h-4 text-red-500" />
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Client:</span>
                        <p className="font-medium">{project.clientName}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Freelancer:</span>
                        <p className="font-medium">{project.freelancerName}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Budget:</span>
                        <p className="font-medium">
                          ${project.budget.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Progress:</span>
                        <p className="font-medium">
                          {project.completedMilestones}/{project.milestones}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2">
                      <Progress
                        value={
                          (project.completedMilestones / project.milestones) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                  </div>

                  <div className="flex gap-1 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedProject(project);
                        setShowProjectDetails(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const SystemAlerts = () => {
    const criticalAlerts = alerts.filter(
      (alert) => alert.priority === "critical",
    );
    const unacknowledgedAlerts = alerts.filter((alert) => !alert.acknowledged);

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">System Alerts</h3>
          <Badge variant="outline" className="text-red-600">
            {unacknowledgedAlerts.length} unacknowledged
          </Badge>
        </div>

        <div className="space-y-2">
          {alerts.map((alert) => (
            <Card
              key={alert.id}
              className={`border-l-4 ${getPriorityColor(alert.priority)}`}
            >
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{alert.title}</h4>
                      <Badge className={getPriorityColor(alert.priority)}>
                        {alert.priority}
                      </Badge>
                      {!alert.acknowledged && (
                        <Badge variant="outline" className="text-orange-600">
                          New
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {alert.message}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{alert.timestamp.toLocaleString()}</span>
                      <span className="capitalize">{alert.type}</span>
                    </div>

                    {alert.actions && alert.actions.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {alert.actions.map((action, index) => (
                          <Button key={index} variant="outline" size="sm">
                            {action}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1 ml-4">
                    {!alert.acknowledged && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setAlerts((prev) =>
                            prev.map((a) =>
                              a.id === alert.id
                                ? { ...a, acknowledged: true }
                                : a,
                            ),
                          );
                        }}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <p className="text-gray-600">
            Comprehensive freelance platform management
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Activity className="w-4 h-4 mr-2" />
            System Health
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="alerts">
            Alerts ({alerts.filter((a) => !a.acknowledged).length})
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {stats && <DashboardStats stats={stats} />}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.slice(0, 3).map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center gap-3 p-2 border rounded"
                    >
                      <Badge
                        className={getPriorityColor(alert.priority)}
                        variant="outline"
                      >
                        {alert.priority}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.title}</p>
                        <p className="text-xs text-gray-500">
                          {alert.timestamp.toLocaleString()}
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
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Active Freelancers</span>
                    <span className="font-semibold">
                      {stats?.activeFreelancers.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fees (Month)</span>
                    <span className="font-semibold text-green-600">
                      ${stats?.platformFees.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dispute Rate</span>
                    <span className="font-semibold text-red-600">
                      {stats?.disputeRate}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Project Value</span>
                    <span className="font-semibold">
                      ${stats?.averageProjectValue}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <ProjectManagement />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <SystemAlerts />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Advanced analytics dashboard coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Platform configuration and settings...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Details Dialog */}
      {selectedUser && (
        <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getStatusColor(selectedUser.status)}>
                      {selectedUser.status}
                    </Badge>
                    <Badge variant="outline">{selectedUser.type}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Total Projects</Label>
                  <p className="font-semibold">{selectedUser.totalProjects}</p>
                </div>
                <div>
                  <Label>Completion Rate</Label>
                  <p className="font-semibold">
                    {selectedUser.completionRate}%
                  </p>
                </div>
                <div>
                  <Label>Rating</Label>
                  <p className="font-semibold">★ {selectedUser.rating}</p>
                </div>
                <div>
                  <Label>Total Earnings</Label>
                  <p className="font-semibold">
                    ${selectedUser.totalEarnings.toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedUser.flags.length > 0 && (
                <div>
                  <Label>Flags</Label>
                  <div className="space-y-2 mt-2">
                    {selectedUser.flags.map((flag) => (
                      <div key={flag.id} className="p-2 border rounded">
                        <p className="font-medium">{flag.reason}</p>
                        <p className="text-sm text-gray-600">
                          {flag.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EnhancedAdminPanel;
