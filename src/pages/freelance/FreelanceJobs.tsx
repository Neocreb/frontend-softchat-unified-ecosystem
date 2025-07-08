import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  Filter,
  BookOpen,
  Star,
  Award,
} from "lucide-react";
import { JobPosting } from "@/types/freelance";
import JobList from "@/components/freelance/JobList";
import JobDetails from "@/components/freelance/JobDetails";
import TalentsList, { Talent } from "@/components/freelance/TalentsList";
import TalentProfile from "@/components/freelance/TalentProfile";
import { useFreelance } from "@/hooks/use-freelance";
import { useAuth } from "@/contexts/AuthContext";

export const FreelanceJobs: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
  const [activeTab, setActiveTab] = useState("browse");
  const { user } = useAuth();

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
    // Handle successful application
    setSelectedJob(null);
    setActiveTab("proposals");
  };

  const handleHire = (talentId: string) => {
    // Handle talent hiring
    setSelectedTalent(null);
    // Could redirect to messaging or contract creation
  };

  // Quick stats (mock data)
  const quickStats = {
    availableJobs: 1247,
    newToday: 23,
    avgBudget: 2850,
    topCategory: "Web Development",
  };

  if (selectedJob) {
    return (
      <div className="container mx-auto px-4 py-6">
        <JobDetails
          jobId={selectedJob.id}
          onBack={handleBack}
          onApply={handleApply}
        />
      </div>
    );
  }

  if (selectedTalent) {
    return (
      <TalentProfile
        talentId={selectedTalent.id}
        onBack={handleBack}
        onHire={handleHire}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Freelance Jobs</h1>
            <p className="text-muted-foreground">
              Discover opportunities that match your skills
            </p>
          </div>

          {user && (
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Saved Jobs
              </Button>
              <Button>
                <BookOpen className="w-4 h-4 mr-2" />
                Job Alerts
              </Button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {quickStats.availableJobs.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Available Jobs
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {quickStats.newToday}
                  </div>
                  <div className="text-sm text-muted-foreground">New Today</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">
                    ${quickStats.avgBudget.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Avg Budget
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="text-lg font-bold">
                    {quickStats.topCategory}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Top Category
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="browse">Browse Jobs</TabsTrigger>
            <TabsTrigger value="talents">Browse Talents</TabsTrigger>
            <TabsTrigger value="proposals">My Proposals</TabsTrigger>
            <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-6">
            <JobList onJobSelect={handleJobSelect} showFilters={true} />
          </TabsContent>

          <TabsContent value="talents" className="mt-6">
            <TalentsList
              onTalentSelect={handleTalentSelect}
              showFilters={true}
            />
          </TabsContent>

          <TabsContent value="proposals" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Proposals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No proposals yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start applying to jobs to track your proposals here
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={() => setActiveTab("browse")}>
                      Browse Jobs
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("talents")}
                    >
                      Browse Talents
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Saved Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No saved jobs</h3>
                  <p className="text-muted-foreground mb-4">
                    Save interesting jobs to review them later
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={() => setActiveTab("browse")}>
                      Browse Jobs
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("talents")}
                    >
                      Browse Talents
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommended" className="mt-6">
            <div className="space-y-4">
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium">
                      Personalized Recommendations
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Complete your profile and add skills to receive job
                    recommendations tailored to your expertise.
                  </p>
                </CardContent>
              </Card>

              <JobList
                onJobSelect={handleJobSelect}
                filters={{ skills: ["React", "TypeScript"] }} // Mock recommended filters
                showFilters={false}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Featured Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  name: "Web Development",
                  count: 342,
                  color: "bg-blue-100 text-blue-800",
                },
                {
                  name: "Mobile Development",
                  count: 156,
                  color: "bg-green-100 text-green-800",
                },
                {
                  name: "Design",
                  count: 234,
                  color: "bg-purple-100 text-purple-800",
                },
                {
                  name: "Writing & Content",
                  count: 189,
                  color: "bg-orange-100 text-orange-800",
                },
                {
                  name: "Digital Marketing",
                  count: 123,
                  color: "bg-pink-100 text-pink-800",
                },
                {
                  name: "Data Science",
                  count: 89,
                  color: "bg-indigo-100 text-indigo-800",
                },
                {
                  name: "DevOps & Cloud",
                  count: 67,
                  color: "bg-gray-100 text-gray-800",
                },
                {
                  name: "AI & Machine Learning",
                  count: 45,
                  color: "bg-red-100 text-red-800",
                },
              ].map((category) => (
                <div
                  key={category.name}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{category.name}</h4>
                    <Badge className={category.color}>{category.count}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {category.count} active jobs
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips for Success */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-green-600" />
              Tips for Success
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium mb-2">Complete Your Profile</h4>
                <p className="text-sm text-muted-foreground">
                  A complete profile increases your chances of getting hired by
                  60%
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium mb-2">Apply Early</h4>
                <p className="text-sm text-muted-foreground">
                  Jobs posted in the last 24 hours get 5x more applications
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium mb-2">Personalize Proposals</h4>
                <p className="text-sm text-muted-foreground">
                  Tailored proposals have 3x higher acceptance rates
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreelanceJobs;
