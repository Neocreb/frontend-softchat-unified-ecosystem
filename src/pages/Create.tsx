import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Briefcase,
  Plus,
  Search,
  Filter,
} from "lucide-react";

interface JobOffer {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  skills: string[];
  client: {
    name: string;
    avatar: string;
    rating: number;
    location: string;
  };
  proposals: number;
  posted: string;
  type: "hourly" | "fixed";
}

interface FreelancerProfile {
  id: string;
  name: string;
  avatar: string;
  title: string;
  rating: number;
  hourlyRate: number;
  skills: string[];
  completedJobs: number;
  location: string;
}

const mockJobOffers: JobOffer[] = [
  {
    id: "1",
    title: "Full-Stack Web Application Development",
    description:
      "Looking for an experienced developer to build a comprehensive e-commerce platform with React, Node.js, and MongoDB. Must have experience with payment integration and user authentication.",
    budget: 5000,
    deadline: "2024-02-15",
    skills: ["React", "Node.js", "MongoDB", "Payment Integration"],
    client: {
      name: "TechCorp Solutions",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      rating: 4.8,
      location: "San Francisco, CA",
    },
    proposals: 12,
    posted: "2 hours ago",
    type: "fixed",
  },
  {
    id: "2",
    title: "Mobile App UI/UX Design",
    description:
      "Need a talented designer to create a modern, user-friendly mobile app interface for a fitness tracking application. Must provide mockups and prototypes.",
    budget: 75,
    deadline: "2024-01-30",
    skills: ["UI/UX Design", "Figma", "Mobile Design", "Prototyping"],
    client: {
      name: "FitLife Startup",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=40&h=40&fit=crop&crop=face",
      rating: 4.6,
      location: "New York, NY",
    },
    proposals: 8,
    posted: "5 hours ago",
    type: "hourly",
  },
  {
    id: "3",
    title: "Content Writing for Tech Blog",
    description:
      "Seeking a skilled technical writer to create engaging blog posts about emerging technologies, AI, and software development trends.",
    budget: 45,
    deadline: "2024-02-05",
    skills: ["Technical Writing", "SEO", "Content Strategy", "Research"],
    client: {
      name: "DevInsights Media",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      rating: 4.9,
      location: "Austin, TX",
    },
    proposals: 15,
    posted: "1 day ago",
    type: "hourly",
  },
];

const mockFreelancers: FreelancerProfile[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=60&h=60&fit=crop&crop=face",
    title: "Full-Stack Developer",
    rating: 4.9,
    hourlyRate: 85,
    skills: ["React", "Node.js", "Python", "AWS"],
    completedJobs: 147,
    location: "Seattle, WA",
  },
  {
    id: "2",
    name: "Alex Chen",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
    title: "UI/UX Designer",
    rating: 4.8,
    hourlyRate: 70,
    skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
    completedJobs: 89,
    location: "Los Angeles, CA",
  },
  {
    id: "3",
    name: "Maria Rodriguez",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
    title: "Digital Marketing Specialist",
    rating: 4.7,
    hourlyRate: 55,
    skills: ["SEO", "Content Marketing", "Social Media", "Analytics"],
    completedJobs: 203,
    location: "Miami, FL",
  },
];

const Create = () => {
  const [activeTab, setActiveTab] = useState("browse-jobs");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    skills: "",
    type: "fixed",
  });

  const JobCard = ({ job }: { job: JobOffer }) => (
    <Card className="hover:shadow-md transition-shadow bg-card border-border">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              {job.title}
            </h3>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {job.description}
            </p>
          </div>
          <Badge
            variant={job.type === "fixed" ? "default" : "secondary"}
            className="ml-4"
          >
            {job.type === "fixed" ? "Fixed Price" : "Hourly"}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span className="font-medium">
                ${job.budget}
                {job.type === "hourly" ? "/hr" : ""}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{job.deadline}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{job.proposals} proposals</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={job.client.avatar} alt={job.client.name} />
              <AvatarFallback>{job.client.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{job.client.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{job.client.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{job.client.location}</span>
                </div>
              </div>
            </div>
          </div>
          <Button size="sm">Apply Now</Button>
        </div>
      </CardContent>
    </Card>
  );

  const FreelancerCard = ({
    freelancer,
  }: {
    freelancer: FreelancerProfile;
  }) => (
    <Card className="hover:shadow-md transition-shadow bg-card border-border">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={freelancer.avatar} alt={freelancer.name} />
            <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-card-foreground">
              {freelancer.name}
            </h3>
            <p className="text-muted-foreground text-sm mb-2">
              {freelancer.title}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{freelancer.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>${freelancer.hourlyRate}/hr</span>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span>{freelancer.completedJobs} jobs</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {freelancer.skills.map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{freelancer.location}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              View Profile
            </Button>
            <Button size="sm">Hire Now</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto bg-background">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Freelance Marketplace
        </h1>
        <p className="text-muted-foreground">
          Find talent or discover opportunities
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browse-jobs">Browse Jobs</TabsTrigger>
          <TabsTrigger value="find-talent">Find Talent</TabsTrigger>
          <TabsTrigger value="post-job">Post a Job</TabsTrigger>
          <TabsTrigger value="my-projects">My Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="browse-jobs" className="space-y-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search for jobs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="writing">Writing</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            {mockJobOffers.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="find-talent" className="space-y-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search for freelancers..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Skill" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="react">React</SelectItem>
                      <SelectItem value="nodejs">Node.js</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            {mockFreelancers.map((freelancer) => (
              <FreelancerCard key={freelancer.id} freelancer={freelancer} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="post-job" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">
                Post a New Job
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Job Title
                </label>
                <Input
                  placeholder="e.g., Build a React Native mobile app"
                  value={jobForm.title}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Description
                </label>
                <Textarea
                  placeholder="Describe your project in detail..."
                  rows={6}
                  value={jobForm.description}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">
                    Budget
                  </label>
                  <Input
                    placeholder="e.g., 5000"
                    value={jobForm.budget}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, budget: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">
                    Deadline
                  </label>
                  <Input
                    type="date"
                    value={jobForm.deadline}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, deadline: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Required Skills
                </label>
                <Input
                  placeholder="e.g., React, Node.js, MongoDB"
                  value={jobForm.skills}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, skills: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Project Type
                </label>
                <Select
                  value={jobForm.type}
                  onValueChange={(value) =>
                    setJobForm({ ...jobForm, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Price</SelectItem>
                    <SelectItem value="hourly">Hourly Rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" size="lg">
                Post Job
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-projects" className="space-y-6">
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-card-foreground mb-2">
              No Projects Yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Start by posting your first job or applying to projects
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Post Your First Job
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Create;
