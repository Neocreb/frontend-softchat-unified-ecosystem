import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  BookOpen, 
  GraduationCap, 
  Trophy, 
  Play, 
  Clock, 
  Users,
  Star,
  TrendingUp,
  Shield,
  Brain,
  Target
} from "lucide-react";
import { blogService } from "@/services/blogService";
import { BlogPost } from "@/types/blog";

const CryptoLearn = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access the learning center.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    loadBlogPosts();
  }, [user, navigate, toast]);

  const loadBlogPosts = async () => {
    try {
      const result = await blogService.getBlogPosts({ limit: 12 });
      setBlogPosts(result?.posts || []);
    } catch (error) {
      console.error("Failed to load blog posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToCrypto = () => {
    navigate("/app/crypto");
  };

  if (!user) {
    return null; // Will redirect to auth
  }

  const courses = [
    { 
      title: "Cryptocurrency Basics", 
      description: "Learn the fundamentals of digital currencies and blockchain technology", 
      level: "Beginner",
      duration: "2 hours",
      students: 1250,
      rating: 4.8,
      lessons: 8,
      icon: BookOpen,
      color: "from-green-500 to-emerald-600"
    },
    { 
      title: "Technical Analysis Mastery", 
      description: "Master chart patterns, indicators, and trading strategies", 
      level: "Intermediate",
      duration: "4 hours",
      students: 890,
      rating: 4.9,
      lessons: 12,
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-600"
    },
    { 
      title: "DeFi Fundamentals", 
      description: "Understand decentralized finance protocols and yield farming", 
      level: "Advanced",
      duration: "3 hours",
      students: 567,
      rating: 4.7,
      lessons: 10,
      icon: Target,
      color: "from-purple-500 to-violet-600"
    },
    { 
      title: "Risk Management", 
      description: "Learn how to protect your investments and minimize losses", 
      level: "Intermediate",
      duration: "2.5 hours",
      students: 750,
      rating: 4.8,
      lessons: 9,
      icon: Shield,
      color: "from-orange-500 to-red-600"
    },
    { 
      title: "Crypto Security Best Practices", 
      description: "Secure your digital assets with proper wallet and key management", 
      level: "Beginner",
      duration: "1.5 hours",
      students: 980,
      rating: 4.9,
      lessons: 6,
      icon: Shield,
      color: "from-red-500 to-pink-600"
    },
    { 
      title: "Advanced Trading Psychology", 
      description: "Master the mental aspects of trading and emotional control", 
      level: "Advanced",
      duration: "3.5 hours",
      students: 445,
      rating: 4.6,
      lessons: 11,
      icon: Brain,
      color: "from-indigo-500 to-purple-600"
    },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <>
      <Helmet>
        <title>Crypto Education Center - Learn Trading & Blockchain | Softchat</title>
        <meta name="description" content="Comprehensive cryptocurrency education with courses, tutorials, and expert insights on trading, blockchain, and DeFi." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToCrypto}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Crypto
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Learn
                </h1>
                <p className="text-muted-foreground">
                  Crypto education and tutorials
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <GraduationCap className="h-4 w-4 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                Learn & Earn
              </span>
            </div>
          </div>

          {/* Progress Banner */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Welcome to Crypto Academy</h3>
                    <p className="text-blue-100">Start your journey to becoming a crypto expert</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">0/6</div>
                  <div className="text-sm text-blue-100">Courses Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Tabs */}
          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Courses
              </TabsTrigger>
              <TabsTrigger value="articles" className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Articles
              </TabsTrigger>
              <TabsTrigger value="community" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Community
              </TabsTrigger>
            </TabsList>

            {/* Courses Tab */}
            <TabsContent value="courses" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-xl transition-all duration-300 group border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden hover:scale-[1.02]">
                    <div className={`h-2 bg-gradient-to-r ${course.color}`}></div>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className={`p-3 rounded-lg bg-gradient-to-r ${course.color}`}>
                            <course.icon className="h-6 w-6 text-white" />
                          </div>
                          <Badge className={getLevelColor(course.level)}>
                            {course.level}
                          </Badge>
                        </div>
                        
                        <div>
                          <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {course.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {course.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {course.lessons} lessons
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {course.students.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            {course.rating}
                          </div>
                        </div>

                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          <Play className="h-4 w-4 mr-2" />
                          Start Learning
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Articles Tab */}
            <TabsContent value="articles" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts && blogPosts.length > 0 ? (
                  blogPosts.slice(0, 9).map((post, index) => (
                    <Card
                      key={post.id}
                      className="cursor-pointer hover:shadow-xl transition-all duration-300 group border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden hover:scale-[1.02]"
                      onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                    >
                      {post.featuredImage && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-white/90 text-black">
                              {post.category.name}
                            </Badge>
                          </div>
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.readingTime}m read
                            </div>
                            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading educational content...</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Community Tab */}
            <TabsContent value="community" className="mt-6">
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Join Our Learning Community</h3>
                <p className="text-muted-foreground mb-6">
                  Connect with fellow crypto enthusiasts, share insights, and learn together
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <Card className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-blue-500 flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold mb-2">Discussion Forums</h4>
                    <p className="text-sm text-muted-foreground">Ask questions and share knowledge</p>
                  </Card>
                  <Card className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-green-500 flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold mb-2">Challenges</h4>
                    <p className="text-sm text-muted-foreground">Complete trading challenges</p>
                  </Card>
                  <Card className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-purple-500 flex items-center justify-center">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold mb-2">Leaderboard</h4>
                    <p className="text-sm text-muted-foreground">Track your learning progress</p>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default CryptoLearn;
