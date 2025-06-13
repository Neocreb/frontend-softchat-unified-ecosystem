import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  FileText,
  Calendar,
  TrendingUp,
  Users,
  Star,
} from "lucide-react";
import { Project, FreelanceStats } from "@/types/freelance";
import { freelanceService } from "@/services/freelanceService";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";

interface ProjectDashboardProps {
  userId: string;
  userType: "freelancer" | "client";
}

const ProjectDashboard: React.FC<ProjectDashboardProps> = ({
  userId,
  userType,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<FreelanceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [userId, userType]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [projectsData, statsData] = await Promise.all([
        freelanceService.getProjects(userId, userType),
        userType === "freelancer"
          ? freelanceService.getFreelanceStats(userId).catch(() => null)
          : null,
      ]);

      setProjects(projectsData || []);
      if (statsData) setStats(statsData);
    } catch (error) {
      console.error("Dashboard loading error:", error);
      setProjects([]);
      // Don't show error toast immediately, just set empty state
    } finally {
      setIsLoading(false);
    }
  };

  const getProjectStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "disputed":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getMilestoneProgress = (project: Project) => {
    const completedMilestones = project.milestones.filter(
      (m) => m.status === "approved",
    ).length;
    return (completedMilestones / project.milestones.length) * 100;
  };

  const getPaymentProgress = (project: Project) => {
    return (project.budget.paid / project.budget.agreed) * 100;
  };

  const filteredProjects = projects.filter((project) => {
    switch (activeTab) {
      case "active":
        return project.status === "active";
      case "completed":
        return project.status === "completed";
      case "all":
        return true;
      default:
        return true;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {userType === "freelancer" && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${stats.totalEarnings.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.activeProjects}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.clientSatisfaction}/5
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.completedProjects}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Projects Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            Active Projects (
            {projects.filter((p) => p.status === "active").length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({projects.filter((p) => p.status === "completed").length}
            )
          </TabsTrigger>
          <TabsTrigger value="all">
            All Projects ({projects.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredProjects.length === 0 ? (
            <Card className="bg-white border-gray-200">
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Projects Found
                </h3>
                <p className="text-gray-600">
                  {activeTab === "active"
                    ? "You don't have any active projects at the moment."
                    : "No projects match the selected filter."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="bg-white border-gray-200 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {project.job.title}
                          </h3>
                          <Badge
                            variant="outline"
                            className={getProjectStatusColor(project.status)}
                          >
                            {project.status.charAt(0).toUpperCase() +
                              project.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {project.job.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Started{" "}
                              {formatDistanceToNow(
                                new Date(project.startDate),
                                { addSuffix: true },
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span>
                              ${project.budget.agreed.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 ml-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={
                              userType === "freelancer"
                                ? project.client.avatar
                                : project.freelancer.avatar
                            }
                            alt={
                              userType === "freelancer"
                                ? project.client.name
                                : project.freelancer.name
                            }
                          />
                          <AvatarFallback>
                            {(userType === "freelancer"
                              ? project.client.name
                              : project.freelancer.name
                            ).charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {userType === "freelancer"
                              ? project.client.name
                              : project.freelancer.name}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>
                              {userType === "freelancer"
                                ? project.client.rating
                                : project.freelancer.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">
                            Project Progress
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {getMilestoneProgress(project).toFixed(0)}%
                          </span>
                        </div>
                        <Progress
                          value={getMilestoneProgress(project)}
                          className="h-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {
                            project.milestones.filter(
                              (m) => m.status === "approved",
                            ).length
                          }{" "}
                          of {project.milestones.length} milestones completed
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">
                            Payment Progress
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            ${project.budget.paid.toLocaleString()} / $
                            {project.budget.agreed.toLocaleString()}
                          </span>
                        </div>
                        <Progress
                          value={getPaymentProgress(project)}
                          className="h-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          ${project.budget.remaining.toLocaleString()} remaining
                        </p>
                      </div>
                    </div>

                    {/* Milestones */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Recent Milestones
                      </h4>
                      <div className="space-y-2">
                        {project.milestones.slice(0, 2).map((milestone) => (
                          <div
                            key={milestone.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <div className="flex items-center gap-2">
                              {milestone.status === "approved" ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : milestone.status === "in-progress" ? (
                                <Clock className="h-4 w-4 text-blue-500" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-gray-400" />
                              )}
                              <span className="text-sm text-gray-900">
                                {milestone.title}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900">
                                ${milestone.amount}
                              </div>
                              <div className="text-xs text-gray-600">
                                {milestone.status}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {project.status === "active" && (
                        <Button
                          size="sm"
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Update Progress
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDashboard;
