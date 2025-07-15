import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sparkles,
  TrendingUp,
  Target,
  Star,
  DollarSign,
  Clock,
  Users,
  Briefcase,
  Award,
  Zap,
  Heart,
  Bookmark,
  Share2,
  MessageSquare,
  MapPin,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Crown,
  Shield,
  ThumbsUp,
  Eye,
  Brain,
  Lightbulb,
  TrendingDown,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SmartJob {
  id: string;
  title: string;
  client: {
    name: string;
    avatar: string;
    rating: number;
    location: string;
    verified: boolean;
    totalSpent: number;
  };
  matchScore: number;
  budget: {
    min: number;
    max: number;
    type: "fixed" | "hourly";
  };
  skills: string[];
  urgency: "low" | "medium" | "high";
  description: string;
  postedTime: string;
  proposalsCount: number;
  aiInsights: {
    successProbability: number;
    competitionLevel: "low" | "medium" | "high";
    estimatedDuration: string;
    skillMatch: number;
    budgetFit: number;
    clientHistory: string;
  };
  reasons: string[];
}

interface SmartFreelancer {
  id: string;
  name: string;
  avatar: string;
  title: string;
  rating: number;
  hourlyRate: number;
  matchScore: number;
  location: string;
  availability: "available" | "busy" | "unavailable";
  skills: string[];
  portfolioCount: number;
  completedJobs: number;
  responseTime: string;
  successRate: number;
  verified: boolean;
  aiInsights: {
    workQuality: number;
    reliability: number;
    communication: number;
    priceValue: number;
    expertise: number;
  };
  reasons: string[];
}

interface SmartRecommendationsProps {
  userType: "client" | "freelancer";
  onJobSelect?: (job: SmartJob) => void;
  onFreelancerSelect?: (freelancer: SmartFreelancer) => void;
}

const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  userType,
  onJobSelect,
  onFreelancerSelect,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("jobs");
  const [isLoading, setIsLoading] = useState(true);

  // Mock AI-powered job recommendations
  const smartJobs: SmartJob[] = [
    {
      id: "1",
      title: "Senior React Developer for E-commerce Platform",
      client: {
        name: "TechCommerce Inc.",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TechCommerce",
        rating: 4.9,
        location: "USA",
        verified: true,
        totalSpent: 125000,
      },
      matchScore: 94,
      budget: { min: 50, max: 80, type: "hourly" },
      skills: ["React", "TypeScript", "Node.js", "AWS", "MongoDB"],
      urgency: "high",
      description:
        "We're looking for a senior React developer to lead our e-commerce platform development...",
      postedTime: "2 hours ago",
      proposalsCount: 3,
      aiInsights: {
        successProbability: 85,
        competitionLevel: "low",
        estimatedDuration: "3-4 months",
        skillMatch: 96,
        budgetFit: 88,
        clientHistory: "Pays on time, clear requirements",
      },
      reasons: [
        "Perfect skill match with your React/TypeScript expertise",
        "Budget aligns with your hourly rate preference",
        "Client has excellent payment history",
        "Low competition - only 3 proposals so far",
      ],
    },
    {
      id: "2",
      title: "Mobile App UI/UX Design for FinTech Startup",
      client: {
        name: "FinFlow Solutions",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=FinFlow",
        rating: 4.7,
        location: "Canada",
        verified: true,
        totalSpent: 89000,
      },
      matchScore: 87,
      budget: { min: 3000, max: 5000, type: "fixed" },
      skills: ["UI/UX Design", "Figma", "Mobile Design", "Prototyping"],
      urgency: "medium",
      description:
        "Seeking an experienced UI/UX designer for our fintech mobile application...",
      postedTime: "1 day ago",
      proposalsCount: 8,
      aiInsights: {
        successProbability: 78,
        competitionLevel: "medium",
        estimatedDuration: "6-8 weeks",
        skillMatch: 89,
        budgetFit: 92,
        clientHistory: "Collaborative, provides good feedback",
      },
      reasons: [
        "Strong portfolio match in fintech design",
        "Budget is 15% above market average",
        "Client values design quality over price",
        "Previous similar projects show 95% success rate",
      ],
    },
  ];

  // Mock AI-powered freelancer recommendations
  const smartFreelancers: SmartFreelancer[] = [
    {
      id: "1",
      name: "Sarah Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      title: "Full-Stack React Developer",
      rating: 4.9,
      hourlyRate: 65,
      matchScore: 96,
      location: "San Francisco, CA",
      availability: "available",
      skills: ["React", "Node.js", "TypeScript", "AWS", "PostgreSQL"],
      portfolioCount: 24,
      completedJobs: 89,
      responseTime: "< 1 hour",
      successRate: 98,
      verified: true,
      aiInsights: {
        workQuality: 96,
        reliability: 98,
        communication: 94,
        priceValue: 88,
        expertise: 95,
      },
      reasons: [
        "Exceptional track record in React projects",
        "Response time matches your urgency needs",
        "Strong communication skills based on reviews",
        "Budget fits within your allocated range",
      ],
    },
    {
      id: "2",
      name: "Marcus Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
      title: "Senior Mobile Developer",
      rating: 4.8,
      hourlyRate: 55,
      matchScore: 91,
      location: "Austin, TX",
      availability: "available",
      skills: ["React Native", "Flutter", "iOS", "Android", "Firebase"],
      portfolioCount: 18,
      completedJobs: 67,
      responseTime: "< 2 hours",
      successRate: 96,
      verified: true,
      aiInsights: {
        workQuality: 93,
        reliability: 95,
        communication: 91,
        priceValue: 94,
        expertise: 89,
      },
      reasons: [
        "Specialized in mobile development you need",
        "Excellent value for money ratio",
        "Available immediately for your timeline",
        "Previous clients praise problem-solving skills",
      ],
    },
  ];

  useEffect(() => {
    // Simulate AI processing
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-green-600 bg-green-50";
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "text-green-600 bg-green-50";
      case "busy":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-red-600 bg-red-50";
    }
  };

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      default:
        return "text-red-600";
    }
  };

  const JobCard = ({ job }: { job: SmartJob }) => (
    <Card
      className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-400 cursor-pointer"
      onClick={() => onJobSelect?.(job)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg line-clamp-2">
                {job.title}
              </h3>
              <Badge className="bg-green-100 text-green-800">
                <Sparkles className="w-3 h-3 mr-1" />
                {job.matchScore}% Match
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={job.client.avatar} />
                  <AvatarFallback>{job.client.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{job.client.name}</span>
                {job.client.verified && (
                  <Shield className="w-4 h-4 text-blue-500" />
                )}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{job.client.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{job.client.location}</span>
              </div>
            </div>

            <p className="text-gray-600 line-clamp-2 mb-4">{job.description}</p>

            <div className="flex items-center gap-4 text-sm mb-4">
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-medium">
                  ${job.budget.min}-${job.budget.max}
                  {job.budget.type === "hourly" ? "/hr" : " fixed"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{job.postedTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{job.proposalsCount} proposals</span>
              </div>
              <Badge className={`text-xs ${getUrgencyColor(job.urgency)}`}>
                <Zap className="w-3 h-3 mr-1" />
                {job.urgency} priority
              </Badge>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {job.skills.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{job.skills.length - 4} more
                </Badge>
              )}
            </div>

            {/* AI Insights */}
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <h4 className="font-medium text-sm text-blue-900 mb-2 flex items-center gap-1">
                <Brain className="w-4 h-4" />
                AI Insights
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-600">Success Probability:</span>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={job.aiInsights.successProbability}
                      className="h-2 flex-1"
                    />
                    <span className="font-medium">
                      {job.aiInsights.successProbability}%
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Skill Match:</span>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={job.aiInsights.skillMatch}
                      className="h-2 flex-1"
                    />
                    <span className="font-medium">
                      {job.aiInsights.skillMatch}%
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Competition:</span>
                  <span
                    className={`font-medium ml-1 ${getCompetitionColor(job.aiInsights.competitionLevel)}`}
                  >
                    {job.aiInsights.competitionLevel}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium ml-1">
                    {job.aiInsights.estimatedDuration}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Reasons */}
            <div className="space-y-1">
              <h4 className="font-medium text-sm text-gray-900 flex items-center gap-1">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                Why this matches you:
              </h4>
              {job.reasons.slice(0, 2).map((reason, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Bookmark className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 mr-1" />
              Ask Question
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <ArrowRight className="w-4 h-4 mr-1" />
              Apply Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const FreelancerCard = ({ freelancer }: { freelancer: SmartFreelancer }) => (
    <Card
      className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-400 cursor-pointer"
      onClick={() => onFreelancerSelect?.(freelancer)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={freelancer.avatar} />
              <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{freelancer.name}</h3>
                <Badge className="bg-green-100 text-green-800">
                  <Target className="w-3 h-3 mr-1" />
                  {freelancer.matchScore}% Match
                </Badge>
                {freelancer.verified && (
                  <Crown className="w-4 h-4 text-yellow-500" />
                )}
              </div>

              <p className="text-gray-600 font-medium mb-2">
                {freelancer.title}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{freelancer.rating}</span>
                  <span className="text-gray-500">
                    ({freelancer.completedJobs} jobs)
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-medium">
                    ${freelancer.hourlyRate}/hr
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{freelancer.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm mb-4">
                <Badge
                  className={`text-xs ${getAvailabilityColor(freelancer.availability)}`}
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {freelancer.availability}
                </Badge>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{freelancer.responseTime} response</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>{freelancer.successRate}% success</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {freelancer.skills.slice(0, 5).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {freelancer.skills.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{freelancer.skills.length - 5} more
                  </Badge>
                )}
              </div>

              {/* AI Insights */}
              <div className="bg-green-50 rounded-lg p-3 mb-4">
                <h4 className="font-medium text-sm text-green-900 mb-2 flex items-center gap-1">
                  <BarChart3 className="w-4 h-4" />
                  AI Assessment
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span>Work Quality:</span>
                    <span className="font-medium">
                      {freelancer.aiInsights.workQuality}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reliability:</span>
                    <span className="font-medium">
                      {freelancer.aiInsights.reliability}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Communication:</span>
                    <span className="font-medium">
                      {freelancer.aiInsights.communication}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Value:</span>
                    <span className="font-medium">
                      {freelancer.aiInsights.priceValue}%
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Reasons */}
              <div className="space-y-1">
                <h4 className="font-medium text-sm text-gray-900 flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4 text-blue-500" />
                  Why this freelancer fits:
                </h4>
                {freelancer.reasons.slice(0, 2).map((reason, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
              Portfolio
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 mr-1" />
              Message
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <ArrowRight className="w-4 h-4 mr-1" />
              Hire Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="relative">
              <RefreshCw className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
              <Sparkles className="w-6 h-6 text-yellow-500 absolute top-0 right-1/2 transform translate-x-2 animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              AI is analyzing matches...
            </h3>
            <p className="text-gray-600">
              Our AI is finding the perfect{" "}
              {userType === "client" ? "freelancers" : "jobs"} for you
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            AI-Powered Smart Recommendations
            <Badge className="bg-yellow-100 text-yellow-800">
              <Crown className="w-3 h-3 mr-1" />
              Pro Feature
            </Badge>
          </CardTitle>
          <p className="text-gray-600">
            Personalized matches based on your profile, preferences, and success
            patterns
          </p>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Smart Job Matches
          </TabsTrigger>
          <TabsTrigger value="freelancers" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Perfect Freelancers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          {smartJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </TabsContent>

        <TabsContent value="freelancers" className="space-y-4">
          {smartFreelancers.map((freelancer) => (
            <FreelancerCard key={freelancer.id} freelancer={freelancer} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartRecommendations;
