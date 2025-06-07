
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Briefcase, 
  Plus, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Users, 
  TrendingUp,
  Filter,
  Bookmark,
  Send,
  FileText,
  Award,
  Calendar,
  Eye,
  ThumbsUp,
  MessageCircle,
  Zap,
  Target,
  Shield,
  BookOpen,
  CheckCircle
} from "lucide-react";
import { useNotification } from "@/hooks/use-notification";

interface Job {
  id: string;
  title: string;
  description: string;
  client: {
    name: string;
    avatar: string;
    rating: number;
    totalSpent: number;
    location: string;
    verified: boolean;
    jobsPosted: number;
    hireRate: number;
  };
  budget: {
    type: 'fixed' | 'hourly';
    amount: number;
    range?: { min: number; max: number };
  };
  skills: string[];
  duration: string;
  experience: 'entry' | 'intermediate' | 'expert';
  proposals: number;
  postedAt: string;
  category: string;
  featured: boolean;
  urgency: 'low' | 'medium' | 'high';
  paymentVerified: boolean;
}

interface Proposal {
  id: string;
  jobId: string;
  freelancer: {
    name: string;
    avatar: string;
    rating: number;
    completedJobs: number;
    skills: string[];
    hourlyRate: number;
    successRate: number;
    responseTime: string;
    lastActive: string;
  };
  coverLetter: string;
  proposedRate: number;
  proposedDuration: string;
  deliverables: string[];
  submittedAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'interview';
}

interface FreelancerProfile {
  id: string;
  name: string;
  avatar: string;
  title: string;
  rating: number;
  completedJobs: number;
  totalEarnings: number;
  skills: string[];
  hourlyRate: number;
  availability: string;
  responseTime: string;
  successRate: number;
  languages: string[];
  certifications: string[];
  portfolio: Array<{
    id: string;
    title: string;
    description: string;
    image: string;
    technologies: string[];
  }>;
}

const Freelance = () => {
  const { user } = useAuth();
  const notify = useNotification();
  const [activeTab, setActiveTab] = useState("browse");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [topFreelancers, setTopFreelancers] = useState<FreelancerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Job posting form states
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobCategory, setJobCategory] = useState("");
  const [jobBudgetType, setJobBudgetType] = useState<'fixed' | 'hourly'>('fixed');
  const [jobBudget, setJobBudget] = useState("");
  const [jobDuration, setJobDuration] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [jobSkills, setJobSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [jobUrgency, setJobUrgency] = useState<'low' | 'medium' | 'high'>('medium');

  const categories = [
    "all", "web-development", "mobile-development", "design", "writing", 
    "marketing", "data-science", "ai-ml", "blockchain", "business", "translation",
    "video-editing", "accounting", "legal", "customer-service"
  ];

  const skillSuggestions = [
    "React", "Node.js", "Python", "JavaScript", "TypeScript", "UI/UX Design",
    "Graphic Design", "Content Writing", "SEO", "Digital Marketing", "Data Analysis",
    "Machine Learning", "Blockchain", "Smart Contracts", "Project Management",
    "WordPress", "Shopify", "Video Editing", "Translation", "Customer Support"
  ];

  useEffect(() => {
    loadJobs();
    loadMyJobs();
    loadProposals();
    loadTopFreelancers();
  }, [selectedCategory, searchQuery]);

  const loadJobs = async () => {
    setIsLoading(true);
    // Enhanced mock data with more realistic job listings
    const mockJobs: Job[] = [
      {
        id: "1",
        title: "Full Stack React Developer for E-commerce Platform",
        description: "Looking for an experienced React developer to build a modern e-commerce platform with payment integration, admin dashboard, and mobile responsiveness. Must have experience with Node.js, MongoDB, and payment gateways like Stripe.",
        client: {
          name: "TechCorp Inc.",
          avatar: "/placeholder.svg",
          rating: 4.8,
          totalSpent: 25000,
          location: "United States",
          verified: true,
          jobsPosted: 12,
          hireRate: 85
        },
        budget: { type: 'fixed', amount: 5000 },
        skills: ["React", "Node.js", "MongoDB", "Payment Integration", "JavaScript"],
        duration: "2-3 months",
        experience: 'intermediate',
        proposals: 15,
        postedAt: "2 hours ago",
        category: "web-development",
        featured: true,
        urgency: 'high',
        paymentVerified: true
      },
      {
        id: "2",
        title: "AI Chatbot Development with Natural Language Processing",
        description: "Seeking an AI specialist to develop an intelligent chatbot for customer service. Must have experience with NLP, machine learning, and chat interfaces. Integration with existing CRM required.",
        client: {
          name: "StartupXYZ",
          avatar: "/placeholder.svg",
          rating: 4.5,
          totalSpent: 12000,
          location: "Canada",
          verified: true,
          jobsPosted: 8,
          hireRate: 75
        },
        budget: { type: 'hourly', amount: 75, range: { min: 60, max: 90 } },
        skills: ["Python", "NLP", "TensorFlow", "OpenAI API", "Machine Learning"],
        duration: "1-2 months",
        experience: 'expert',
        proposals: 8,
        postedAt: "4 hours ago",
        category: "ai-ml",
        featured: false,
        urgency: 'medium',
        paymentVerified: true
      },
      {
        id: "3",
        title: "Mobile App UI/UX Design for Fitness Platform",
        description: "Design a modern, user-friendly mobile app interface for a fitness tracking platform. Need wireframes, prototypes, and final designs. Experience with fitness apps preferred.",
        client: {
          name: "FitLife Solutions",
          avatar: "/placeholder.svg",
          rating: 4.9,
          totalSpent: 8000,
          location: "United Kingdom",
          verified: true,
          jobsPosted: 5,
          hireRate: 90
        },
        budget: { type: 'fixed', amount: 2500 },
        skills: ["UI/UX Design", "Figma", "Mobile Design", "Prototyping"],
        duration: "3-4 weeks",
        experience: 'intermediate',
        proposals: 22,
        postedAt: "1 day ago",
        category: "design",
        featured: false,
        urgency: 'low',
        paymentVerified: true
      },
      {
        id: "4",
        title: "Content Marketing Specialist for Tech Startup",
        description: "Looking for a content marketing expert to create engaging blog posts, social media content, and email campaigns. Must understand tech industry trends and SEO best practices.",
        client: {
          name: "InnovateTech",
          avatar: "/placeholder.svg",
          rating: 4.6,
          totalSpent: 15000,
          location: "Australia",
          verified: true,
          jobsPosted: 15,
          hireRate: 80
        },
        budget: { type: 'hourly', amount: 45, range: { min: 35, max: 55 } },
        skills: ["Content Writing", "SEO", "Social Media Marketing", "Email Marketing"],
        duration: "3-6 months",
        experience: 'intermediate',
        proposals: 18,
        postedAt: "2 days ago",
        category: "marketing",
        featured: true,
        urgency: 'medium',
        paymentVerified: true
      }
    ];

    setJobs(mockJobs);
    setIsLoading(false);
  };

  const loadMyJobs = async () => {
    const mockMyJobs: Job[] = [
      {
        id: "my-1",
        title: "Content Writer for Tech Blog",
        description: "Looking for a skilled content writer to create engaging articles about latest technology trends, AI, and software development. Must have technical writing experience.",
        client: {
          name: user?.name || "You",
          avatar: user?.avatar || "/placeholder.svg",
          rating: 4.7,
          totalSpent: 3000,
          location: "Remote",
          verified: true,
          jobsPosted: 3,
          hireRate: 85
        },
        budget: { type: 'fixed', amount: 1500 },
        skills: ["Content Writing", "SEO", "Technology", "Technical Writing"],
        duration: "1 month",
        experience: 'intermediate',
        proposals: 12,
        postedAt: "3 days ago",
        category: "writing",
        featured: false,
        urgency: 'medium',
        paymentVerified: true
      }
    ];

    setMyJobs(mockMyJobs);
  };

  const loadProposals = async () => {
    const mockProposals: Proposal[] = [
      {
        id: "prop-1",
        jobId: "my-1",
        freelancer: {
          name: "Sarah Johnson",
          avatar: "/placeholder.svg",
          rating: 4.9,
          completedJobs: 45,
          skills: ["Content Writing", "SEO", "Technical Writing", "Blog Writing"],
          hourlyRate: 35,
          successRate: 95,
          responseTime: "2 hours",
          lastActive: "Online now"
        },
        coverLetter: "I'm an experienced tech writer with 5+ years creating engaging content for technology blogs. I specialize in making complex topics accessible to readers and have worked with several SaaS companies to improve their content strategy.",
        proposedRate: 1400,
        proposedDuration: "3 weeks",
        deliverables: ["10 Blog Posts", "SEO Optimization", "Social Media Snippets", "Content Calendar"],
        submittedAt: "2 days ago",
        status: 'pending'
      },
      {
        id: "prop-2",
        jobId: "my-1",
        freelancer: {
          name: "Michael Chen",
          avatar: "/placeholder.svg",
          rating: 4.7,
          completedJobs: 32,
          skills: ["Content Writing", "Technical Documentation", "Copywriting"],
          hourlyRate: 42,
          successRate: 88,
          responseTime: "4 hours",
          lastActive: "2 hours ago"
        },
        coverLetter: "As a former software developer turned technical writer, I bring a unique perspective to tech content creation. I can explain complex concepts clearly and have a strong understanding of the development process.",
        proposedRate: 1350,
        proposedDuration: "4 weeks",
        deliverables: ["12 Blog Posts", "Technical Documentation", "SEO Strategy"],
        submittedAt: "1 day ago",
        status: 'interview'
      }
    ];

    setProposals(mockProposals);
  };

  const loadTopFreelancers = async () => {
    const mockFreelancers: FreelancerProfile[] = [
      {
        id: "f1",
        name: "Alex Rodriguez",
        avatar: "/placeholder.svg",
        title: "Full Stack Developer",
        rating: 4.9,
        completedJobs: 89,
        totalEarnings: 125000,
        skills: ["React", "Node.js", "Python", "AWS", "MongoDB"],
        hourlyRate: 85,
        availability: "Available now",
        responseTime: "1 hour",
        successRate: 98,
        languages: ["English", "Spanish"],
        certifications: ["AWS Certified", "React Professional"],
        portfolio: [
          {
            id: "p1",
            title: "E-commerce Platform",
            description: "Built a full-featured e-commerce platform with React and Node.js",
            image: "/placeholder.svg",
            technologies: ["React", "Node.js", "MongoDB", "Stripe"]
          }
        ]
      },
      {
        id: "f2",
        name: "Emma Thompson",
        avatar: "/placeholder.svg",
        title: "UI/UX Designer",
        rating: 4.8,
        completedJobs: 67,
        totalEarnings: 89000,
        skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research"],
        hourlyRate: 75,
        availability: "Available in 1 week",
        responseTime: "2 hours",
        successRate: 96,
        languages: ["English", "French"],
        certifications: ["Google UX Design", "Adobe Certified"],
        portfolio: [
          {
            id: "p2",
            title: "Mobile Banking App",
            description: "Designed user-friendly mobile banking interface",
            image: "/placeholder.svg",
            technologies: ["Figma", "Prototyping", "User Testing"]
          }
        ]
      }
    ];

    setTopFreelancers(mockFreelancers);
  };

  const handlePostJob = () => {
    if (!jobTitle || !jobDescription || !jobBudget || !jobCategory) {
      notify.error("Please fill in all required fields");
      return;
    }

    const newJob: Job = {
      id: Date.now().toString(),
      title: jobTitle,
      description: jobDescription,
      client: {
        name: user?.name || "You",
        avatar: user?.avatar || "/placeholder.svg",
        rating: 4.7,
        totalSpent: 0,
        location: "Remote",
        verified: true,
        jobsPosted: 1,
        hireRate: 0
      },
      budget: {
        type: jobBudgetType,
        amount: parseFloat(jobBudget)
      },
      skills: jobSkills,
      duration: jobDuration,
      experience: jobExperience as any,
      proposals: 0,
      postedAt: "Just now",
      category: jobCategory,
      featured: false,
      urgency: jobUrgency,
      paymentVerified: false
    };

    setMyJobs(prev => [newJob, ...prev]);
    
    // Reset form
    setJobTitle("");
    setJobDescription("");
    setJobCategory("");
    setJobBudget("");
    setJobDuration("");
    setJobExperience("");
    setJobSkills([]);
    setJobUrgency('medium');

    notify.success("Job posted successfully!");
    setActiveTab("my-jobs");
  };

  const addSkill = () => {
    if (newSkill && !jobSkills.includes(newSkill)) {
      setJobSkills([...jobSkills, newSkill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setJobSkills(jobSkills.filter(s => s !== skill));
  };

  const filteredJobs = jobs.filter(job => {
    const matchesCategory = selectedCategory === "all" || job.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">Urgent</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-xs">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Freelance Marketplace</h1>
          <p className="text-muted-foreground">Connect with top talent or find your next opportunity</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setActiveTab("browse")} className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Find Work
          </Button>
          <Button onClick={() => setActiveTab("post-job")} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Post a Job
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{jobs.length}K+</div>
            <div className="text-sm text-muted-foreground">Active Jobs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">50K+</div>
            <div className="text-sm text-muted-foreground">Freelancers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">95%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">$2M+</div>
            <div className="text-sm text-muted-foreground">Total Paid</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Browse Jobs
          </TabsTrigger>
          <TabsTrigger value="freelancers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Top Talent
          </TabsTrigger>
          <TabsTrigger value="my-jobs" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            My Jobs
          </TabsTrigger>
          <TabsTrigger value="proposals" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Proposals
          </TabsTrigger>
          <TabsTrigger value="post-job" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Post Job
          </TabsTrigger>
        </TabsList>
        
        {/* Browse Jobs Tab */}
        <TabsContent value="browse" className="space-y-6">
          {/* Enhanced Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search jobs, skills, or companies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="web-development">Web Development</SelectItem>
                    <SelectItem value="mobile-development">Mobile Development</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="data-science">Data Science</SelectItem>
                    <SelectItem value="ai-ml">AI & ML</SelectItem>
                    <SelectItem value="blockchain">Blockchain</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="translation">Translation</SelectItem>
                    <SelectItem value="video-editing">Video Editing</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Job Listings */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold hover:text-primary cursor-pointer">
                          {job.title}
                        </h3>
                        {job.featured && <Badge variant="secondary">Featured</Badge>}
                        {getUrgencyBadge(job.urgency)}
                        {job.paymentVerified && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <Shield className="h-3 w-3 mr-1" />
                            Payment Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {job.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.slice(0, 5).map((skill) => (
                          <Badge key={skill} variant="outline">{skill}</Badge>
                        ))}
                        {job.skills.length > 5 && (
                          <Badge variant="outline">+{job.skills.length - 5} more</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {job.budget.type === 'fixed' 
                            ? `$${job.budget.amount.toLocaleString()} fixed` 
                            : `$${job.budget.amount}/hr`
                          }
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          {job.experience} level
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {job.proposals} proposals
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-6 text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={job.client.avatar} />
                          <AvatarFallback>{job.client.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-sm">{job.client.name}</span>
                            {job.client.verified && <Badge variant="secondary" className="h-4 text-xs">Verified</Badge>}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {job.client.rating}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.client.location}
                        </div>
                        <div>${job.client.totalSpent.toLocaleString()}+ spent</div>
                        <div>{job.client.jobsPosted} jobs posted</div>
                        <div>{job.client.hireRate}% hire rate</div>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">{job.postedAt}</div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                        <Button size="sm">Apply Now</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Top Freelancers Tab */}
        <TabsContent value="freelancers" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Top Rated Freelancers</h2>
            <Button variant="outline">View All</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topFreelancers.map((freelancer) => (
              <Card key={freelancer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={freelancer.avatar} />
                      <AvatarFallback>{freelancer.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{freelancer.name}</h3>
                      <p className="text-muted-foreground">{freelancer.title}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{freelancer.rating}</span>
                        </div>
                        <span>{freelancer.completedJobs} jobs</span>
                        <span className="text-green-600">${freelancer.hourlyRate}/hr</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Skills</div>
                      <div className="flex flex-wrap gap-1">
                        {freelancer.skills.slice(0, 4).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                        ))}
                        {freelancer.skills.length > 4 && (
                          <Badge variant="outline" className="text-xs">+{freelancer.skills.length - 4}</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Success Rate</div>
                        <div className="font-medium">{freelancer.successRate}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Response Time</div>
                        <div className="font-medium">{freelancer.responseTime}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Send className="h-4 w-4 mr-1" />
                        Invite
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* My Jobs Tab */}
        <TabsContent value="my-jobs" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Posted Jobs</h2>
            <Button onClick={() => setActiveTab("post-job")} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Post New Job
            </Button>
          </div>
          
          <div className="space-y-4">
            {myJobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        {getUrgencyBadge(job.urgency)}
                      </div>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {job.description}
                      </p>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          ${job.budget.amount.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {job.proposals} proposals
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          45 views
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Posted {job.postedAt}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">View Proposals</Button>
                      <Button variant="destructive" size="sm">Close</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Enhanced Proposals Tab */}
        <TabsContent value="proposals" className="space-y-6">
          <h2 className="text-xl font-semibold">Received Proposals</h2>
          
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <Card key={proposal.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={proposal.freelancer.avatar} />
                        <AvatarFallback>{proposal.freelancer.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{proposal.freelancer.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {proposal.freelancer.rating}
                          </div>
                          <span>•</span>
                          <span>{proposal.freelancer.completedJobs} jobs</span>
                          <span>•</span>
                          <span>{proposal.freelancer.successRate}% success</span>
                          <span>•</span>
                          <span>${proposal.freelancer.hourlyRate}/hr</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span className="text-green-600">{proposal.freelancer.lastActive}</span>
                          <span>•</span>
                          <span>Responds in {proposal.freelancer.responseTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold">${proposal.proposedRate}</div>
                      <div className="text-sm text-muted-foreground">in {proposal.proposedDuration}</div>
                      <Badge variant={proposal.status === 'pending' ? 'secondary' : 'default'} className="mt-1">
                        {proposal.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Cover Letter</h4>
                    <p className="text-muted-foreground">{proposal.coverLetter}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Deliverables</h4>
                    <div className="flex flex-wrap gap-2">
                      {proposal.deliverables.map((deliverable) => (
                        <Badge key={deliverable} variant="outline" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {deliverable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {proposal.freelancer.skills.map((skill) => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Submitted {proposal.submittedAt}
                    </span>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Profile
                      </Button>
                      <Button variant="destructive" size="sm">Decline</Button>
                      <Button size="sm">
                        {proposal.status === 'interview' ? 'Hire' : 'Interview'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Enhanced Post Job Tab */}
        <TabsContent value="post-job" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post a New Job</CardTitle>
              <CardDescription>
                Describe what you need done and find the perfect freelancer for your project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="job-title">Job Title *</Label>
                <Input
                  id="job-title"
                  placeholder="e.g. Build a responsive website with React"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job-description">Job Description *</Label>
                <Textarea
                  id="job-description"
                  placeholder="Describe your project in detail. Include what you need done, any specific requirements, timeline, and what success looks like..."
                  className="min-h-[120px]"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={jobCategory} onValueChange={setJobCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web-development">Web Development</SelectItem>
                      <SelectItem value="mobile-development">Mobile Development</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="writing">Writing</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="data-science">Data Science</SelectItem>
                      <SelectItem value="ai-ml">AI & ML</SelectItem>
                      <SelectItem value="blockchain">Blockchain</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="translation">Translation</SelectItem>
                      <SelectItem value="video-editing">Video Editing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Experience Level</Label>
                  <Select value={jobExperience} onValueChange={setJobExperience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Project Urgency</Label>
                  <Select value={jobUrgency} onValueChange={(value) => setJobUrgency(value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Budget *</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fixed" 
                      checked={jobBudgetType === 'fixed'}
                      onCheckedChange={() => setJobBudgetType('fixed')}
                    />
                    <Label htmlFor="fixed">Fixed Price</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hourly" 
                      checked={jobBudgetType === 'hourly'}
                      onCheckedChange={() => setJobBudgetType('hourly')}
                    />
                    <Label htmlFor="hourly">Hourly Rate</Label>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span>$</span>
                  <Input
                    type="number"
                    placeholder={jobBudgetType === 'fixed' ? "5000" : "50"}
                    value={jobBudget}
                    onChange={(e) => setJobBudget(e.target.value)}
                    className="w-32"
                  />
                  <span className="text-muted-foreground">
                    {jobBudgetType === 'fixed' ? 'USD' : 'USD/hour'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Project Duration</Label>
                <Select value={jobDuration} onValueChange={setJobDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-7 days">1-7 days</SelectItem>
                    <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                    <SelectItem value="2-4 weeks">2-4 weeks</SelectItem>
                    <SelectItem value="1-2 months">1-2 months</SelectItem>
                    <SelectItem value="2-3 months">2-3 months</SelectItem>
                    <SelectItem value="3-6 months">3-6 months</SelectItem>
                    <SelectItem value="6+ months">6+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Required Skills *</Label>
                <div className="flex gap-2">
                  <Select value={newSkill} onValueChange={setNewSkill}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select skills" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillSuggestions.map((skill) => (
                        <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={addSkill}>Add</Button>
                </div>
                
                {jobSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {jobSkills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Job Posting Tips
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Be specific about your requirements and expectations</li>
                  <li>• Include examples or references when possible</li>
                  <li>• Set a realistic budget and timeline</li>
                  <li>• List all required skills to attract qualified freelancers</li>
                </ul>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline">Save as Draft</Button>
                <Button onClick={handlePostJob}>
                  Post Job - Free
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Freelance;
