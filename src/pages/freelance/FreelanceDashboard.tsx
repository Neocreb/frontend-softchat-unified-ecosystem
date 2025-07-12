import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "lucide-react";
import { SmartFreelanceMatching } from "@/components/freelance/SmartFreelanceMatching";
import { FreelanceBusinessIntelligence } from "@/components/freelance/FreelanceBusinessIntelligence";
import { FreelanceCollaborationTools } from "@/components/freelance/FreelanceCollaborationTools";
import { Project, FreelanceStats } from "@/types/freelance";
import { useFreelance, useEscrow } from "@/hooks/use-freelance";
import { useAuth } from "@/contexts/AuthContext";
import TaskTracker from "@/components/freelance/TaskTracker";
import NegotiationChat from "@/components/freelance/NegotiationChat";
import ReviewForm from "@/components/freelance/ReviewForm";
import { Skeleton } from "@/components/ui/skeleton";

export const FreelanceDashboard: React.FC = () => {
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<FreelanceStats | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { getProjects, getFreelanceStats, loading } = useFreelance();
  const { getUserEscrows } = useEscrow();
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      const [projectsData, statsData] = await Promise.all([
        getProjects(user.id, "freelancer"),
        getFreelanceStats(user.id),
      ]);

      if (projectsData) setActiveProjects(projectsData);
      if (statsData) setStats(statsData);
    };

    loadData();
  }, [user, getProjects, getFreelanceStats]);

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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUrgentTasks = () => {
    return [
      {
        id: "1",
        title: "Submit wireframes for review",
        project: "E-commerce Platform",
        dueDate: "2024-01-18",
        priority: "high",
      },
      {
        id: "2",
        title: "Client feedback response needed",
        project: "Mobile App Design",
        dueDate: "2024-01-19",
        priority: "medium",
      },
    ];
  };

  const getRecentActivities = () => {
    return [
      {
        id: "1",
        type: "message",
        title: "New message from Alice Johnson",
        project: "E-commerce Platform",
        timestamp: "2 hours ago",
      },
      {
        id: "2",
        type: "payment",
        title: "Payment received: $1,500",
        project: "Mobile App Design",
        timestamp: "1 day ago",
      },
      {
        id: "3",
        type: "milestone",
        title: "Milestone approved",
        project: "Website Redesign",
        timestamp: "2 days ago",
      },
    ];
  };

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
                <AvatarImage src={project.client.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {project.client.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {project.client.name}
                </span>
                <div className="text-xs text-muted-foreground">Client</div>
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
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-muted-foreground font-medium mb-1">
                Earned
              </div>
              <div className="font-bold text-lg text-green-600 dark:text-green-400">
                ${project.budget.paid.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t">
            <div className="text-xs text-muted-foreground">
              Due:{" "}
              {project.deadline
                ? new Date(project.deadline).toLocaleDateString()
                : "No deadline"}
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
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
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <p className="text-xs text-green-600">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                {change}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
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

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
            <TabsTrigger value="tasks" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Tasks & Progress</span>
              <span className="sm:hidden">Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Messages</span>
              <span className="sm:hidden">💬</span>
            </TabsTrigger>
            <TabsTrigger value="files" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Files</span>
              <span className="sm:hidden">📁</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Billing</span>
              <span className="sm:hidden">💰</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <TaskTracker projectId={selectedProject.id} userRole="freelancer" />
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
            <Card>
              <CardHeader>
                <CardTitle>Project Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No files yet</h3>
                  <p className="text-muted-foreground">
                    Upload project files and deliverables here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        Total Earned
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        ${selectedProject.budget.paid.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        Pending
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        ${selectedProject.budget.remaining.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        Total Budget
                      </div>
                      <div className="text-2xl font-bold">
                        ${selectedProject.budget.agreed.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Main dashboard view
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Freelance Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your projects and track your progress
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link to="/app/profile">
                <Plus className="w-4 h-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link to="/app/wallet">
                <Wallet className="w-4 h-4 mr-2" />
                View Wallet
              </Link>
            </Button>
          </div>
        </div>

        {/* Advanced Features Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">📊</span>
            </TabsTrigger>
            <TabsTrigger value="smart-matching" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">AI Matching</span>
              <span className="sm:hidden">🧠</span>
            </TabsTrigger>
            <TabsTrigger value="business-intel" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Business Intelligence</span>
              <span className="sm:hidden">📈</span>
            </TabsTrigger>
            <TabsTrigger value="collaboration" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Collaboration</span>
              <span className="sm:hidden">🤝</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
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
            ) : stats ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                  title="Total Earnings"
                  value={`$${stats.totalEarnings.toLocaleString()}`}
                  change="+12% this month"
                  icon={<DollarSign className="w-6 h-6 text-white" />}
                  color="bg-green-500"
                />
                <StatCard
                  title="Active Projects"
                  value={stats.activeProjects}
                  icon={<Briefcase className="w-6 h-6 text-white" />}
                  color="bg-blue-500"
                />
                <StatCard
                  title="Completed Projects"
                  value={stats.completedProjects}
                  icon={<CheckCircle2 className="w-6 h-6 text-white" />}
                  color="bg-purple-500"
                />
                <StatCard
                  title="Success Rate"
                  value={`${stats.successRate}%`}
                  icon={<Star className="w-6 h-6 text-white" />}
                  color="bg-orange-500"
                />
              </div>
            ) : null}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Active Projects */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Active Projects</CardTitle>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/app/freelance">View All</Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Skeleton key={i} className="h-32 w-full" />
                        ))}
                      </div>
                    ) : activeProjects.length > 0 ? (
                      <div className="space-y-4">
                        {activeProjects.map((project) => (
                          <ProjectCard key={project.id} project={project} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium">
                          No active projects
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Start applying to jobs to see your projects here
                        </p>
                        <Button asChild>
                          <Link to="/app/freelance">Browse Jobs</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
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
                            {activity.type === "message" && (
                              <MessageCircle className="w-4 h-4 text-blue-600" />
                            )}
                            {activity.type === "payment" && (
                              <DollarSign className="w-4 h-4 text-green-600" />
                            )}
                            {activity.type === "milestone" && (
                              <Target className="w-4 h-4 text-purple-600" />
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
                          <div className="text-xs text-muted-foreground">
                            {activity.timestamp}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Urgent Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      Urgent Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {getUrgentTasks().map((task) => (
                        <div key={task.id} className="p-3 border rounded-lg">
                          <div className="font-medium text-sm line-clamp-2 mb-1">
                            {task.title}
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">
                            {task.project}
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge
                              variant={
                                task.priority === "high"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {task.priority}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to="/app/wallet">
                        <Wallet className="w-4 h-4 mr-2" />
                        View Wallet
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to="/app/profile">
                        <Users className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to="/app/settings">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to="/app/support">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact Support
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Freelance-Specific Features */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-600" />
                      Freelance Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to="/app/freelance">
                        <Brain className="w-4 h-4 mr-2" />
                        AI Job Matching
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Rate Calculator
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to="/app/rewards">
                        <Trophy className="w-4 h-4 mr-2" />
                        Achievements
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Target className="w-4 h-4 mr-2" />
                      Project Planner
                    </Button>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>This Month</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Response Time
                      </span>
                      <span className="text-sm font-medium">&lt; 2 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Client Rating
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">4.9</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        On-time Delivery
                      </span>
                      <span className="text-sm font-medium">98%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Repeat Clients
                      </span>
                      <span className="text-sm font-medium">67%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="smart-matching">
            <SmartFreelanceMatching userType="freelancer" />
          </TabsContent>

          <TabsContent value="business-intel">
            <FreelanceBusinessIntelligence />
          </TabsContent>

          <TabsContent value="collaboration">
            <FreelanceCollaborationTools />
          </TabsContent>
        </Tabs>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedProject && (
        <ReviewForm
          project={selectedProject}
          userRole="freelancer"
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

export default FreelanceDashboard;
