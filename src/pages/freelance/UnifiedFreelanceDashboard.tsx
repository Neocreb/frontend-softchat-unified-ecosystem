import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useFreelance } from "@/hooks/use-freelance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  UserCheck, 
  Briefcase,
  TrendingUp,
  Loader2,
  ArrowRight
} from "lucide-react";
import FreelanceDashboard from "./FreelanceDashboard";
import ClientDashboard from "./ClientDashboard";
import { Project } from "@/types/freelance";

interface UserRole {
  hasFreelancerProfile: boolean;
  hasClientProjects: boolean;
  activeFreelanceProjects: number;
  activeClientProjects: number;
  preferredRole?: "freelancer" | "client";
}

const UnifiedFreelanceDashboard: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<"freelancer" | "client" | "both">("freelancer");
  const { user } = useAuth();
  const { getProjects } = useFreelance();

  useEffect(() => {
    const detectUserRole = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Get projects where user is freelancer
        const freelancerProjects = await getProjects(user.id, "freelancer").catch(() => []);

        // Get projects where user is client
        const clientProjects = await getProjects(user.id, "client").catch(() => []);

        const role: UserRole = {
          hasFreelancerProfile: (freelancerProjects || []).length > 0,
          hasClientProjects: (clientProjects || []).length > 0,
          activeFreelanceProjects: (freelancerProjects || []).filter((p: Project) => p.status === "active").length,
          activeClientProjects: (clientProjects || []).filter((p: Project) => p.status === "active").length,
        };

        // Always allow users to choose their preferred role
        // Don't auto-select based on existing projects
        if (role.hasFreelancerProfile && role.hasClientProjects) {
          role.preferredRole = role.activeFreelanceProjects >= role.activeClientProjects ? "freelancer" : "client";
          setSelectedView("both"); // Show role selector
        } else if (role.hasClientProjects && !role.hasFreelancerProfile) {
          role.preferredRole = "client";
          setSelectedView("both"); // Still show both options
        } else {
          role.preferredRole = "freelancer";
          setSelectedView("both"); // Always show both options for choice
        }

        setUserRole(role);
      } catch (error) {
        console.error("Error detecting user role:", error);
        // Default setup - always show both options
        setUserRole({
          hasFreelancerProfile: false,
          hasClientProjects: false,
          activeFreelanceProjects: 0,
          activeClientProjects: 0,
          preferredRole: "freelancer",
        });
        setSelectedView("both");
      } finally {
        setLoading(false);
      }
    };

    detectUserRole();
  }, [user, getProjects]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h3 className="text-lg font-medium">Loading your dashboard...</h3>
            <p className="text-muted-foreground">Detecting your role and projects</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userRole) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">Unable to load dashboard</h3>
          <p className="text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  // If user is new or needs to choose role, show role selector
  if (selectedView === "both") {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Welcome Back!
            </h1>
            <p className="text-muted-foreground text-lg">
              You're active as both a freelancer and a client. Choose your view:
            </p>
          </div>

          {/* Role Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Freelancer Role */}
            <Card className="border-2 hover:border-blue-300 transition-all duration-200 cursor-pointer hover:shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600 mx-auto" />
                </div>
                <CardTitle className="text-xl">Freelancer Dashboard</CardTitle>
                <p className="text-muted-foreground">Manage your freelance projects and clients</p>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-bold text-lg text-blue-600">
                      {userRole.activeFreelanceProjects}
                    </div>
                    <div className="text-muted-foreground">Active Projects</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-bold text-lg text-green-600">
                      {userRole.hasFreelancerProfile ? "Active" : "Setup Needed"}
                    </div>
                    <div className="text-muted-foreground">Profile Status</div>
                  </div>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => setSelectedView("freelancer")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  View Freelancer Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Client Role */}
            <Card className="border-2 hover:border-green-300 transition-all duration-200 cursor-pointer hover:shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4">
                  <UserCheck className="w-8 h-8 text-green-600 mx-auto" />
                </div>
                <CardTitle className="text-xl">Client Dashboard</CardTitle>
                <p className="text-muted-foreground">Manage your projects and hired freelancers</p>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-bold text-lg text-green-600">
                      {userRole.activeClientProjects}
                    </div>
                    <div className="text-muted-foreground">Active Projects</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-bold text-lg text-blue-600">
                      {userRole.hasClientProjects ? "Active" : "Ready"}
                    </div>
                    <div className="text-muted-foreground">Client Status</div>
                  </div>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => setSelectedView("client")}
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  View Client Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Your Activity Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {userRole.activeFreelanceProjects}
                  </div>
                  <div className="text-sm text-muted-foreground">Freelance Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {userRole.activeClientProjects}
                  </div>
                  <div className="text-sm text-muted-foreground">Client Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {userRole.activeFreelanceProjects + userRole.activeClientProjects}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Active</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">2</div>
                  <div className="text-sm text-muted-foreground">Roles</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Role */}
          {userRole.preferredRole && (
            <Card className="max-w-md mx-auto border-amber-200 bg-amber-50">
              <CardContent className="pt-6 text-center">
                <div className="p-3 bg-amber-100 rounded-full w-12 h-12 mx-auto mb-3">
                  {userRole.preferredRole === "freelancer" ? (
                    <Users className="w-6 h-6 text-amber-600 mx-auto" />
                  ) : (
                    <UserCheck className="w-6 h-6 text-amber-600 mx-auto" />
                  )}
                </div>
                <h3 className="font-semibold mb-2">Recommended for you</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Based on your recent activity, we recommend starting with your{" "}
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    {userRole.preferredRole}
                  </Badge>{" "}
                  dashboard
                </p>
                <Button 
                  size="sm"
                  onClick={() => setSelectedView(userRole.preferredRole!)}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  Go to {userRole.preferredRole} dashboard
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Show the selected dashboard with permanent role switcher
  return (
    <div>
      {/* Always Show Role Switcher */}
      <div className="container mx-auto px-4 py-4 border-b bg-gray-50/50 dark:bg-gray-900/50">
        <div className="flex justify-center">
          <Tabs
            value={selectedView === "both" ? userRole?.preferredRole || "freelancer" : selectedView}
            onValueChange={(value: string) => setSelectedView(value as "freelancer" | "client")}
          >
            <TabsList className="grid w-full grid-cols-2 max-w-sm bg-white dark:bg-gray-800 shadow-sm">
              <TabsTrigger value="freelancer" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Freelancer</span>
                <span className="sm:hidden">Work</span>
                {userRole && userRole.activeFreelanceProjects > 0 && (
                  <Badge className="ml-1 bg-blue-600 text-white text-xs px-1.5 py-0.5">
                    {userRole.activeFreelanceProjects}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="client" className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white">
                <UserCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Client</span>
                <span className="sm:hidden">Hire</span>
                {userRole && userRole.activeClientProjects > 0 && (
                  <Badge className="ml-1 bg-green-600 text-white text-xs px-1.5 py-0.5">
                    {userRole.activeClientProjects}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="text-center mt-2">
          <p className="text-sm text-muted-foreground">
            {selectedView === "freelancer" ? (
              "Manage your freelance projects and find work"
            ) : (
              "Hire freelancers and manage your projects"
            )}
          </p>
        </div>
      </div>

      {/* Dashboard Content */}
      {selectedView === "freelancer" && <FreelanceDashboard />}
      {selectedView === "client" && <ClientDashboard />}
    </div>
  );
};

export default UnifiedFreelanceDashboard;
