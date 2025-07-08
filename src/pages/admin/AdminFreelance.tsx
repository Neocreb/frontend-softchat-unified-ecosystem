import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  Users,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  FileText,
  TrendingUp,
} from "lucide-react";

const AdminFreelance = () => {
  const [stats] = useState({
    totalJobs: 1856,
    activeFreelancers: 324,
    totalEarnings: 456789,
    pendingDisputes: 12,
  });

  const mockJobs = [
    {
      id: "1",
      title: "React Developer Needed",
      client: "TechCorp",
      freelancer: "john_dev",
      budget: 2500,
      status: "in_progress",
      category: "Development",
      deadline: "2024-02-15",
    },
    {
      id: "2",
      title: "Logo Design Project",
      client: "StartupXYZ",
      freelancer: null,
      budget: 500,
      status: "open",
      category: "Design",
      deadline: "2024-02-10",
    },
    {
      id: "3",
      title: "Content Writing",
      client: "BlogCorp",
      freelancer: "writer_pro",
      budget: 300,
      status: "completed",
      category: "Writing",
      deadline: "2024-01-30",
    },
  ];

  const mockFreelancers = [
    {
      id: "1",
      name: "John Developer",
      username: "john_dev",
      skills: ["React", "Node.js", "TypeScript"],
      rating: 4.9,
      completedJobs: 45,
      earnings: 67890,
      status: "active",
    },
    {
      id: "2",
      name: "Sarah Designer",
      username: "design_sarah",
      skills: ["UI/UX", "Figma", "Photoshop"],
      rating: 4.8,
      completedJobs: 32,
      earnings: 43210,
      status: "active",
    },
    {
      id: "3",
      name: "Mike Writer",
      username: "writer_pro",
      skills: ["Content Writing", "Copywriting", "SEO"],
      rating: 4.7,
      completedJobs: 78,
      earnings: 23450,
      status: "suspended",
    },
  ];

  const mockDisputes = [
    {
      id: "1",
      jobTitle: "Website Development",
      client: "ClientA",
      freelancer: "DevB",
      amount: 1500,
      reason: "Quality issues",
      status: "investigating",
      created: "2024-01-25",
    },
    {
      id: "2",
      jobTitle: "Logo Design",
      client: "ClientC",
      freelancer: "DesignerD",
      amount: 300,
      reason: "Late delivery",
      status: "pending",
      created: "2024-01-26",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Freelance Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage freelance jobs, freelancers, and platform operations
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="bg-blue-500/10 p-3 rounded-full mb-4">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {stats.totalJobs.toLocaleString()}
            </CardTitle>
            <CardDescription>Total Jobs</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="bg-green-500/10 p-3 rounded-full mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {stats.activeFreelancers}
            </CardTitle>
            <CardDescription>Active Freelancers</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="bg-yellow-500/10 p-3 rounded-full mb-4">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              ${stats.totalEarnings.toLocaleString()}
            </CardTitle>
            <CardDescription>Total Earnings</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="bg-red-500/10 p-3 rounded-full mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {stats.pendingDisputes}
            </CardTitle>
            <CardDescription>Pending Disputes</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="jobs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="freelancers">Freelancers</TabsTrigger>
          <TabsTrigger value="disputes">Disputes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Management</CardTitle>
              <CardDescription>
                Monitor and manage all freelance job postings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{job.title}</h3>
                        <p className="text-sm text-gray-600">
                          {job.client} • {job.category}
                        </p>
                        {job.freelancer && (
                          <p className="text-sm text-blue-600">
                            Assigned to: {job.freelancer}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">${job.budget}</p>
                        <p className="text-sm text-gray-600">
                          Due: {job.deadline}
                        </p>
                      </div>
                      <Badge
                        variant={
                          job.status === "completed"
                            ? "default"
                            : job.status === "in_progress"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {job.status.replace("_", " ")}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="freelancers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Freelancer Management</CardTitle>
              <CardDescription>
                View and manage freelancer profiles and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockFreelancers.map((freelancer) => (
                  <div
                    key={freelancer.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                        {freelancer.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium">{freelancer.name}</h3>
                        <p className="text-sm text-gray-600">
                          @{freelancer.username} • ⭐ {freelancer.rating}
                        </p>
                        <div className="flex gap-1 mt-1">
                          {freelancer.skills.slice(0, 3).map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">
                          ${freelancer.earnings.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {freelancer.completedJobs} jobs completed
                        </p>
                      </div>
                      <Badge
                        variant={
                          freelancer.status === "active"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {freelancer.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disputes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dispute Resolution</CardTitle>
              <CardDescription>
                Manage and resolve freelance job disputes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDisputes.map((dispute) => (
                  <div
                    key={dispute.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{dispute.jobTitle}</h3>
                        <p className="text-sm text-gray-600">
                          {dispute.client} vs {dispute.freelancer}
                        </p>
                        <p className="text-sm text-gray-600">
                          {dispute.reason}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">
                          ${dispute.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {dispute.created}
                        </p>
                      </div>
                      <Badge
                        variant={
                          dispute.status === "investigating"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {dispute.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Freelance Analytics</CardTitle>
              <CardDescription>
                Performance metrics and trends analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Analytics Dashboard
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Detailed freelance analytics and insights coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminFreelance;
