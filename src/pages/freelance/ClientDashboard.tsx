import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  Briefcase,
  MessageCircle,
  Calendar,
  FileText,
  Users,
  Award,
  Target,
  Activity,
  Wallet,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Brain,
  Shield,
  Trophy,
  BarChart3,
  Bell,
  Zap,
  Settings,
  ExternalLink,
  TrendingDown,
  Sparkles,
  Layers,
  Search,
  Filter,
  Eye,
  ThumbsUp,
  ThumbsDown,
  CreditCard,
  Download,
  Upload,
  Edit,
  UserCheck,
} from "lucide-react";
import { Project, FreelanceStats } from "@/types/freelance";
import { useFreelance, useEscrow } from "@/hooks/use-freelance";
import { useAuth } from "@/contexts/AuthContext";
import TaskTracker from "@/components/freelance/TaskTracker";
import NegotiationChat from "@/components/freelance/NegotiationChat";
import ReviewForm from "@/components/freelance/ReviewForm";
import CreateJobModal from "@/components/freelance/CreateJobModal";
import FileUpload from "@/components/freelance/FileUpload";
import { Skeleton } from "@/components/ui/skeleton";
import { UnifiedCampaignManager } from "@/components/campaigns/UnifiedCampaignManager";

interface ClientStats {
  totalSpent: number;
  activeProjects: number;
  completedProjects: number;
  averageProjectRating: number;
  totalSavings: number;
  freelancersHired: number;
}

export const ClientDashboard: React.FC = () => {
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [clientStats, setClientStats] = useState<ClientStats | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { getProjects, loading } = useFreelance();
  const { getUserEscrows } = useEscrow();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        // Load projects where user is the client
        const projectsData = await getProjects(user.id, "client");
        if (projectsData) {
          setActiveProjects(projectsData);
          
          // Calculate client-specific stats
          const stats: ClientStats = {
            totalSpent: projectsData.reduce((sum, p) => sum + p.budget.paid, 0),
            activeProjects: projectsData.filter(p => p.status === "active").length,
            completedProjects: projectsData.filter(p => p.status === "completed").length,
            averageProjectRating: 4.7, // This would come from actual ratings
            totalSavings: projectsData.reduce((sum, p) => sum + (p.budget.market_rate - p.budget.agreed), 0),
            freelancersHired: new Set(projectsData.map(p => p.freelancer.id)).size,
          };
          setClientStats(stats);
        }
      } catch (error) {
        console.error("Error loading client data:", error);
      }
    };

    loadData();
  }, [user, getProjects]);

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "disputed":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUrgentActions = () => {
    return [
      {
        id: "1",
        title: "Review milestone delivery",
        project: "E-commerce Platform",
        freelancer: "John Doe",
        dueDate: "2024-01-18",
        priority: "high",
        type: "review",
      },
      {
        id: "2",
        title: "Payment approval needed",
        project: "Mobile App Design",
        freelancer: "Jane Smith",
        dueDate: "2024-01-19",
        priority: "medium",
        type: "payment",
      },
      {
        id: "3",
        title: "Project scope clarification",
        project: "Website Redesign",
        freelancer: "Mike Johnson",
        dueDate: "2024-01-20",
        priority: "medium",
        type: "communication",
      },
    ];
  };

  const getRecentActivities = () => {
    return [
      {
        id: "1",
        type: "milestone",
        title: "Milestone completed by Alice Johnson",
        project: "E-commerce Platform",
        timestamp: "2 hours ago",
        action: "review",
      },
      {
        id: "2",
        type: "message",
        title: "New message from Bob Wilson",
        project: "Mobile App Design",
        timestamp: "1 day ago",
        action: "reply",
      },
      {
        id: "3",
        type: "proposal",
        title: "3 new proposals received",
        project: "Website Redesign",
        timestamp: "2 days ago",
        action: "review",
      },
    ];
  };

  const filteredProjects = activeProjects.filter((project) => {
    const matchesSearch = project.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.freelancer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
    <Card
      className="hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50"
      onClick={() => setSelectedProject(project)}
    >
      <CardContent className="pt-6 pb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg line-clamp-1 mb-2 text-gray-900 dark:text-white">
              {project.job.title}
            </h3>
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-8 h-8 ring-2 ring-white dark:ring-gray-800 shadow-sm">
                <AvatarImage src={project.freelancer.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white font-semibold">
                  {project.freelancer.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {project.freelancer.name}
                </span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{project.freelancer.rating}</span>
                  <span>• {project.freelancer.skills?.[0]}</span>
                </div>
              </div>
            </div>
          </div>
          <Badge
            className={`${getProjectStatusColor(project.status)} px-3 py-1 font-medium shadow-sm`}
          >
            {project.status}
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Progress</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              75%
            </span>
          </div>
          <Progress value={75} className="h-3 bg-gray-100 dark:bg-gray-800" />

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-muted-foreground font-medium mb-1">
                Budget
              </div>
              <div className="font-bold text-lg text-gray-900 dark:text-white">
                ${project.budget.agreed.toLocaleString()}
              </div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-muted-foreground font-medium mb-1">
                Paid
              </div>
              <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                ${project.budget.paid.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="text-sm text-muted-foreground font-medium">
              <Clock className="w-4 h-4 inline mr-1" />
              Due:{" "}
              {project.deadline
                ? new Date(project.deadline).toLocaleDateString()
                : "No deadline"}
            </div>
            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <span className="text-xs font-medium">Manage Project</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    change?: string;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, icon, color }) => (
    <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 hover:shadow-lg transition-all duration-200">
      <CardContent className="pt-6 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {value}
            </p>
            {change && (
              <p className="text-sm font-medium">
                <TrendingUp className="w-4 h-4 inline mr-1 text-green-500" />
                <span className="text-green-600 dark:text-green-400">
                  {change}
                </span>
              </p>
            )}
          </div>
          <div className={`p-4 rounded-xl ${color} shadow-lg`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );

  // If a project is selected, show project details
  if (selectedProject) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => setSelectedProject(null)}
            className="w-full sm:w-auto"
          >
            ← Back to Dashboard
          </Button>
          <div className="w-full sm:w-auto">
            <h1 className="text-xl sm:text-2xl font-bold">
              {selectedProject.job.title}
            </h1>
            <p className="text-muted-foreground">Project Management</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 gap-1">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="milestones" className="text-xs sm:text-sm">
              Milestones
            </TabsTrigger>
            <TabsTrigger value="messages" className="text-xs sm:text-sm">
              Messages
            </TabsTrigger>
            <TabsTrigger value="files" className="text-xs sm:text-sm">
              Files
            </TabsTrigger>
            <TabsTrigger value="billing" className="text-xs sm:text-sm">
              Billing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-muted-foreground">{selectedProject.job.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Budget</h4>
                        <p className="text-2xl font-bold">${selectedProject.budget.agreed.toLocaleString()}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Timeline</h4>
                        <p className="text-muted-foreground">
                          {selectedProject.deadline 
                            ? `Due ${new Date(selectedProject.deadline).toLocaleDateString()}`
                            : "No deadline set"
                          }
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <TaskTracker projectId={selectedProject.id} userRole="client" />
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Freelancer Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={selectedProject.freelancer.avatar} />
                        <AvatarFallback>{selectedProject.freelancer.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{selectedProject.freelancer.name}</h4>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{selectedProject.freelancer.rating} rating</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Skills</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.freelancer.skills?.map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        )) || <span className="text-muted-foreground">No skills listed</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Project Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Files
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Release Payment
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Star className="w-4 h-4 mr-2" />
                      Leave Review
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Edit className="w-4 h-4 mr-2" />
                      Modify Project
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="milestones">
            <TaskTracker projectId={selectedProject.id} userRole="client" />
          </TabsContent>

          <TabsContent value="messages">
            <NegotiationChat
              projectId={selectedProject.id}
              currentUserId={user?.id || ""}
              projectStatus={selectedProject.status as any}
              participants={{
                client: {
                  id: selectedProject.client.id,
                  name: selectedProject.client.name,
                  avatar: selectedProject.client.avatar,
                },
                freelancer: {
                  id: selectedProject.freelancer.id,
                  name: selectedProject.freelancer.name,
                  avatar: selectedProject.freelancer.avatar,
                },
              }}
            />
          </TabsContent>

          <TabsContent value="files">
            <FileUpload
              projectId={selectedProject.id}
              allowedTypes={['*']}
              maxSize={25}
              multiple={true}
              onFileUploaded={(file) => {
                console.log('File uploaded:', file);
                // Here you would typically update the project's file list
              }}
              onFileDeleted={(fileId) => {
                console.log('File deleted:', fileId);
                // Here you would typically remove the file from the project
              }}
            />
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        Total Budget
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        ${selectedProject.budget.agreed.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        Paid
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        ${selectedProject.budget.paid.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        Remaining
                      </div>
                      <div className="text-2xl font-bold">
                        ${selectedProject.budget.remaining.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Release Next Payment
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download Invoice
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Main client dashboard view
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-2">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl shadow-lg">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Client Dashboard
              </h1>
              <p className="text-muted-foreground text-lg font-medium">
                Manage your projects and freelancers
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => setShowCreateJobModal(true)}
              className="w-full sm:w-auto h-12 px-6 font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Plus className="w-5 h-5 mr-2" />
              Post New Job
            </Button>
            <Button
              asChild
              className="w-full sm:w-auto h-12 px-6 font-medium bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-lg"
            >
              <Link to="/app/freelance">
                <Search className="w-5 h-5 mr-2" />
                Find Freelancers
              </Link>
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search projects or freelancers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 border rounded-md"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="disputed">Disputed</option>
                </select>
                <Button variant="outline">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-4">
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : clientStats ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="Total Spent"
              value={`$${clientStats.totalSpent.toLocaleString()}`}
              change="+8% this month"
              icon={<DollarSign className="w-7 h-7 text-white" />}
              color="bg-gradient-to-br from-blue-500 to-cyan-600"
            />
            <StatCard
              title="Active Projects"
              value={clientStats.activeProjects}
              icon={<Briefcase className="w-7 h-7 text-white" />}
              color="bg-gradient-to-br from-green-500 to-emerald-600"
            />
            <StatCard
              title="Completed Projects"
              value={clientStats.completedProjects}
              icon={<CheckCircle2 className="w-7 h-7 text-white" />}
              color="bg-gradient-to-br from-purple-500 to-violet-600"
            />
            <StatCard
              title="Freelancers Hired"
              value={clientStats.freelancersHired}
              icon={<Users className="w-7 h-7 text-white" />}
              color="bg-gradient-to-br from-orange-500 to-amber-600"
            />
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Projects */}
            <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-6">
                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Layers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  Your Projects
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateJobModal(true)}
                  className="font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New Project
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-32 w-full" />
                    ))}
                  </div>
                ) : filteredProjects.length > 0 ? (
                  <div className="space-y-4">
                    {filteredProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium">
                      No projects found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm || filterStatus !== "all" 
                        ? "Try adjusting your search or filters"
                        : "Start by posting your first job to find talented freelancers"
                      }
                    </p>
                    <Button onClick={() => setShowCreateJobModal(true)}>
                      Post Your First Job
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getRecentActivities().map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <div className="p-2 bg-blue-50 rounded-full">
                        {activity.type === "milestone" && (
                          <Target className="w-4 h-4 text-blue-600" />
                        )}
                        {activity.type === "message" && (
                          <MessageCircle className="w-4 h-4 text-green-600" />
                        )}
                        {activity.type === "proposal" && (
                          <FileText className="w-4 h-4 text-purple-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {activity.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {activity.project}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-muted-foreground">
                          {activity.timestamp}
                        </div>
                        <Button size="sm" variant="outline">
                          {activity.action}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Urgent Actions */}
            <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-lg font-bold">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  Action Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getUrgentActions().map((action) => (
                    <div key={action.id} className="p-3 border rounded-lg">
                      <div className="font-medium text-sm line-clamp-2 mb-1">
                        {action.title}
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {action.project} • {action.freelancer}
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={
                            action.priority === "high"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {action.priority}
                        </Badge>
                        <Button size="sm" variant="outline">
                          {action.type === "review" && <Eye className="w-3 h-3 mr-1" />}
                          {action.type === "payment" && <CreditCard className="w-3 h-3 mr-1" />}
                          {action.type === "communication" && <MessageCircle className="w-3 h-3 mr-1" />}
                          Action
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-lg font-bold">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setShowCreateJobModal(true)}
                >
                  <Plus className="w-5 h-5 mr-3" />
                  Post New Job
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                  asChild
                >
                  <Link to="/app/freelance">
                    <Search className="w-5 h-5 mr-3" />
                    Browse Freelancers
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                  asChild
                >
                  <Link to="/app/wallet">
                    <Wallet className="w-5 h-5 mr-3" />
                    View Wallet
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                  asChild
                >
                  <Link to="/app/chat">
                    <MessageCircle className="w-5 h-5 mr-3" />
                    Messages
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Client Performance */}
            <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-lg font-bold">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  Your Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Project Success Rate
                  </span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Avg. Response Time
                  </span>
                  <span className="text-sm font-medium">&lt; 4 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Freelancer Rating
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">4.8/5</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Budget Efficiency
                  </span>
                  <span className="text-sm font-medium">15% saved</span>
                </div>
              </CardContent>
            </Card>

            {/* Campaigns & Promotions */}
            <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-lg font-bold">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  Campaigns & Boosts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UnifiedCampaignManager
                  context="client"
                  entityId={user?.id}
                  entityType="job"
                  showCreateButton={true}
                  compact={true}
                  maxCampaigns={3}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Create Job Modal */}
      {showCreateJobModal && (
        <CreateJobModal
          isOpen={showCreateJobModal}
          onClose={() => setShowCreateJobModal(false)}
          onSubmit={(jobData) => {
            console.log("Job created:", jobData);
            setShowCreateJobModal(false);
            // Refresh projects
          }}
        />
      )}

      {/* Review Modal */}
      {showReviewModal && selectedProject && (
        <ReviewForm
          project={selectedProject}
          userRole="client"
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSubmit={(review) => {
            console.log("Review submitted:", review);
            setShowReviewModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ClientDashboard;
