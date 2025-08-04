import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  Filter,
  Search,
  Star,
  Award,
  Plus,
  Bell,
  Settings,
  ChevronDown,
  Grid3x3,
  List,
  MapPin,
  Calendar,
  Zap,
  Target,
  TrendingDown,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  ChevronRight,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  FileText,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Crown,
  Shield,
  Globe,
  Coffee,
} from "lucide-react";
import { JobPosting } from "@/types/freelance";
import JobList from "./JobList";
import JobDetails from "./JobDetails";
import TalentsList, { Talent } from "./TalentsList";
import TalentProfile from "./TalentProfile";
import { useFreelance } from "@/hooks/use-freelance";
import { useAuth } from "@/contexts/AuthContext";
import AdvancedFreelanceFilters from "./AdvancedFreelanceFilters";
import SmartRecommendations from "./SmartRecommendations";

export const EnhancedFreelanceHub: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
  const [activeTab, setActiveTab] = useState("browse");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleJobSelect = (job: JobPosting) => {
    setSelectedJob(job);
  };

  const handleTalentSelect = (talent: Talent) => {
    setSelectedTalent(talent);
  };

  const handleBack = () => {
    setSelectedJob(null);
    setSelectedTalent(null);
  };

  const handleApply = (jobId: string) => {
    setSelectedJob(null);
    setActiveTab("proposals");
  };

  const handleHire = (talentId: string) => {
    setSelectedTalent(null);
  };

  // Enhanced stats with trending indicators
  const stats = {
    activeJobs: { value: 1247, change: +12, trend: "up" },
    newToday: { value: 23, change: +3, trend: "up" },
    avgBudget: { value: 2850, change: +150, trend: "up" },
    successRate: { value: 94, change: +2, trend: "up" },
  };

  const quickActions = [
    {
      label: "Post a Job",
      icon: <Plus className="w-4 h-4" />,
      action: () => navigate("/app/freelance/post-job"),
      variant: "default" as const,
      premium: false,
    },
    {
      label: "Post Skill",
      icon: <Award className="w-4 h-4" />,
      action: () => navigate("/app/freelance/post-skill"),
      variant: "outline" as const,
      premium: false,
    },
    {
      label: "AI Match",
      icon: <Sparkles className="w-4 h-4" />,
      action: () => setActiveTab("recommended"),
      variant: "outline" as const,
      premium: true,
    },
    {
      label: "Dashboard",
      icon: <BarChart3 className="w-4 h-4" />,
      action: () => navigate("/app/freelance/dashboard"),
      variant: "outline" as const,
      premium: false,
    },
  ];

  const trendingCategories = [
    { name: "AI/ML Development", jobs: 234, growth: "+23%" },
    { name: "Mobile Apps", jobs: 189, growth: "+18%" },
    { name: "Web Design", jobs: 156, growth: "+15%" },
    { name: "Content Writing", jobs: 143, growth: "+12%" },
    { name: "Data Analysis", jobs: 98, growth: "+28%" },
  ];

  const recentActivity = [
    {
      type: "application",
      title: "Applied to React Developer position",
      time: "2 hours ago",
      status: "pending",
    },
    {
      type: "message",
      title: "New message from TechCorp Inc.",
      time: "4 hours ago",
      status: "unread",
    },
    {
      type: "job",
      title: "New job matches your profile",
      time: "6 hours ago",
      status: "new",
    },
  ];

  const RenderTabs = () => (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex items-center justify-between mb-6">
        <TabsList className="bg-white border shadow-sm h-auto flex-wrap sm:h-12 w-full justify-start">
          <TabsTrigger
            value="browse"
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 px-3 sm:px-6 flex-shrink-0"
          >
            <Briefcase className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Browse Jobs</span>
            <span className="sm:hidden">Jobs</span>
          </TabsTrigger>
          <TabsTrigger
            value="talents"
            className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 px-3 sm:px-6 flex-shrink-0"
          >
            <Users className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Find Talent</span>
            <span className="sm:hidden">Talent</span>
          </TabsTrigger>
          <TabsTrigger
            value="proposals"
            className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 px-3 sm:px-6 flex-shrink-0"
          >
            <FileText className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">My Proposals</span>
            <span className="sm:hidden">Props</span>
          </TabsTrigger>
          <TabsTrigger
            value="saved"
            className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 px-3 sm:px-6 flex-shrink-0"
          >
            <Bookmark className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Saved</span>
            <span className="sm:hidden">Save</span>
          </TabsTrigger>
          <TabsTrigger
            value="recommended"
            className="data-[state=active]:bg-yellow-50 data-[state=active]:text-yellow-700 px-2 sm:px-6 flex-shrink-0"
          >
            <Sparkles className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">AI Recommended</span>
            <span className="sm:hidden">AI</span>
            <Badge
              variant="secondary"
              className="ml-1 sm:ml-2 bg-yellow-100 text-yellow-800 text-xs"
            >
              <span className="hidden sm:inline">Pro</span>
              <span className="sm:hidden">★</span>
            </Badge>
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center bg-white border rounded-lg shadow-sm">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none h-8 w-8 p-0"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none h-8 w-8 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="shadow-sm h-8">
                <Filter className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Filters</span>
                <ChevronDown className="w-4 h-4 ml-1 sm:ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuItem>Web Development</DropdownMenuItem>
              <DropdownMenuItem>Mobile Development</DropdownMenuItem>
              <DropdownMenuItem>Design & Creative</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Budget Range</DropdownMenuLabel>
              <DropdownMenuItem>$0 - $500</DropdownMenuItem>
              <DropdownMenuItem>$500 - $2000</DropdownMenuItem>
              <DropdownMenuItem>$2000+</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" className="shadow-sm h-8">
            <RefreshCw className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      <TabsContent value="browse" className="space-y-6">
        <JobList
          onJobSelect={handleJobSelect}
          viewMode={viewMode}
          searchQuery={searchQuery}
        />
      </TabsContent>

      <TabsContent value="talents" className="space-y-6">
        <TalentsList
          onTalentSelect={handleTalentSelect}
          viewMode={viewMode}
          searchQuery={searchQuery}
        />
      </TabsContent>

      <TabsContent value="proposals" className="space-y-6">
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Your Proposals
          </h3>
          <p className="text-gray-600 mb-6">
            Track your job applications and their status
          </p>
          <Button onClick={() => setActiveTab("browse")}>
            Browse Jobs to Apply
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="saved" className="space-y-6">
        <div className="text-center py-12">
          <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Saved Jobs & Talents
          </h3>
          <p className="text-gray-600 mb-6">
            Your bookmarked opportunities and favorite freelancers
          </p>
          <Button onClick={() => setActiveTab("browse")}>
            Discover More Opportunities
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="recommended" className="space-y-6">
        <SmartRecommendations
          userType="freelancer"
          onJobSelect={handleJobSelect}
          onFreelancerSelect={handleTalentSelect}
        />
      </TabsContent>
    </Tabs>
  );

  // Show job details modal
  if (selectedJob) {
    return (
      <div className="min-h-screen bg-gray-50">
        <JobDetails
          job={selectedJob}
          onBack={handleBack}
          onApply={handleApply}
        />
      </div>
    );
  }

  // Show talent profile modal
  if (selectedTalent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TalentProfile
          talent={selectedTalent}
          onBack={handleBack}
          onHire={handleHire}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header Section */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                  <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <span className="truncate">Freelance Hub</span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 flex-shrink-0"
                >
                  <Activity className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Connect with top talent and exciting opportunities worldwide
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant}
                  onClick={action.action}
                  className="shadow-sm relative text-sm"
                  size="sm"
                >
                  {action.icon}
                  <span className="ml-1 sm:ml-2 hidden sm:inline">
                    {action.label}
                  </span>
                  <span className="ml-1 sm:hidden">
                    {action.label === "Post a Job"
                      ? "Post"
                      : action.label === "AI Match"
                        ? "AI"
                        : action.label === "Dashboard"
                          ? "Dashboard"
                          : action.label}
                  </span>
                  {action.premium && (
                    <Crown className="w-3 h-3 ml-1 text-yellow-500" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Advanced Search and Filters */}
            <AdvancedFreelanceFilters
              onFiltersChange={(newFilters) => {
                setFilters(newFilters);
                setSearchQuery(newFilters.searchQuery);
              }}
              initialFilters={{ searchQuery }}
            />

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Jobs</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.activeJobs.value.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        +{stats.activeJobs.change}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">New Today</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.newToday.value}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        +{stats.newToday.change}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg Budget</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${stats.avgBudget.value.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        +${stats.avgBudget.change}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.successRate.value}%
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        +{stats.successRate.change}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Tabs */}
            <RenderTabs />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  onClick={() => navigate("/app/freelance/post-job")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Post a New Job
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/app/freelance/post-skill")}
                >
                  <Award className="w-4 h-4 mr-2" />
                  Post Skill/Talent
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/app/chat')}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  View Messages
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/app/analytics')}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics Dashboard
                </Button>
              </CardContent>
            </Card>

            {/* Trending Categories */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Trending Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingCategories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {category.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {category.jobs} jobs
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      {category.growth}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5 text-orange-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div
                      className={`p-1 rounded-full ${
                        activity.type === "application"
                          ? "bg-blue-100"
                          : activity.type === "message"
                            ? "bg-green-100"
                            : "bg-yellow-100"
                      }`}
                    >
                      {activity.type === "application" && (
                        <FileText className="w-3 h-3 text-blue-600" />
                      )}
                      {activity.type === "message" && (
                        <MessageSquare className="w-3 h-3 text-green-600" />
                      )}
                      {activity.type === "job" && (
                        <Briefcase className="w-3 h-3 text-yellow-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-600">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Success Tips */}
            <Card className="shadow-sm border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-600" />
                  Success Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Complete your profile</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Add portfolio samples</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">Get verified badge</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedFreelanceHub;
