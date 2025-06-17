import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import {
  ArrowLeft,
  Settings,
  Calendar,
  MapPin,
  Globe,
  Users,
  Heart,
  MessageSquare,
  Star,
  TrendingUp,
  Award,
  Camera,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Gift,
  Shield,
  Verified,
  Edit,
  Share2,
  MoreHorizontal,
  UserPlus,
  MessageCircle,
  Image as ImageIcon,
  Upload,
  Check,
  X,
  Eye,
  Clock,
  Store,
  Code,
  Coins,
  DollarSign,
  Video,
  Grid3X3,
  List,
  Filter,
  BarChart3,
  Target,
  Lightbulb,
  Calendar as CalendarIcon,
  Activity,
  Trophy,
  Zap,
  Play,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/types/user";
import { Product } from "@/types/marketplace";
import { profileService } from "@/services/profileService";

interface EnhancedProfileProps {
  username?: string;
}

const EnhancedProfile: React.FC<EnhancedProfileProps> = ({
  username: propUsername,
}) => {
  const { username: paramUsername } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const targetUsername = propUsername || paramUsername;

  // State management
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [posts, setPosts] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditingCover, setIsEditingCover] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState("");

  // New state for enhanced features
  const [mediaFilter, setMediaFilter] = useState("all");
  const [mediaViewMode, setMediaViewMode] = useState("grid");

  const isOwnProfile =
    !targetUsername || (user && user.profile?.username === targetUsername);

  // Enhanced mock profile data
  const createMockProfile = (profile: UserProfile) => ({
    id: profile.id,
    username: profile.username,
    displayName: profile.full_name,
    bio:
      profile.bio ||
      "Software Developer | Tech Enthusiast | Coffee Lover ☕\nBuilding the future one line of code at a time 🚀\n\n🌟 Passionate about creating amazing user experiences\n📱 Mobile-first developer\n🎯 Always learning new technologies",
    avatar:
      profile.avatar_url ||
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    banner:
      profile.banner_url ||
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
    joinDate: "January 2020",
    verified: true,
    followers: 2847,
    following: 892,
    posts: 156,
    engagement: 94,
    profileViews: 15620,
    jobTitle: "Senior Full Stack Developer",
    company: "TechCorp Inc.",
    education: "Stanford University",
    relationshipStatus: "Single",
    languages: ["English", "Spanish", "French"],
    skills: [
      "React",
      "TypeScript",
      "Node.js",
      "Python",
      "AWS",
      "Docker",
      "GraphQL",
      "PostgreSQL",
      "MongoDB",
      "React Native",
    ],
    interests: ["Technology", "Travel", "Photography", "Coffee", "Hiking"],
    achievements: [
      { title: "Top Contributor", date: "2024", icon: Trophy },
      { title: "Verified Creator", date: "2023", icon: Verified },
      { title: "Early Adopter", date: "2020", icon: Star },
    ],
    creatorStats: {
      totalViews: 125000,
      totalLikes: 8940,
      totalShares: 1230,
      engagementRate: 7.8,
      subscriberGrowth: 12.5,
      avgViewDuration: "3:42",
    },
  });

  // Enhanced mock data
  const mockPosts = [
    {
      id: 1,
      content:
        "Just shipped a new feature! 🚀 Excited to see how users engage with it. Building in public is such a rewarding experience.",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8,
      shares: 3,
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
    },
    {
      id: 2,
      content:
        "Coffee and code - the perfect combination for a productive morning ☕💻",
      timestamp: "1 day ago",
      likes: 42,
      comments: 12,
      shares: 5,
    },
    {
      id: 3,
      content:
        "Attending the tech conference today! Looking forward to networking and learning about the latest trends in AI and web development.",
      timestamp: "3 days ago",
      likes: 67,
      comments: 23,
      shares: 8,
    },
  ];

  const mockMedia = [
    {
      id: 1,
      type: "image",
      url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
      title: "New Feature Launch",
      description: "Screenshot of our latest feature",
      date: "2 hours ago",
      likes: 24,
      views: 156,
    },
    {
      id: 2,
      type: "video",
      url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
      title: "Coding Tutorial",
      description: "How to build a React component",
      date: "1 day ago",
      likes: 67,
      views: 892,
      duration: "5:23",
    },
    {
      id: 3,
      type: "image",
      url: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
      title: "Workspace Setup",
      description: "My current development setup",
      date: "3 days ago",
      likes: 89,
      views: 234,
    },
    {
      id: 4,
      type: "video",
      url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
      title: "Conference Talk",
      description: "Speaking about modern web development",
      date: "1 week ago",
      likes: 156,
      views: 1240,
      duration: "25:14",
    },
  ];

  const mockActivity = [
    {
      id: 1,
      type: "post",
      action: "Published a new post",
      content: "Just shipped a new feature!",
      timestamp: "2 hours ago",
      engagement: { likes: 24, comments: 8, shares: 3 },
    },
    {
      id: 2,
      type: "video",
      action: "Uploaded a video",
      content: "Coding Tutorial: React Components",
      timestamp: "1 day ago",
      engagement: { likes: 67, views: 892, duration: "5:23" },
    },
    {
      id: 3,
      type: "achievement",
      action: "Earned an achievement",
      content: "Top Contributor Badge",
      timestamp: "3 days ago",
      icon: Trophy,
    },
    {
      id: 4,
      type: "follow",
      action: "Gained 25 new followers",
      content: "Profile growth milestone",
      timestamp: "1 week ago",
      engagement: { followers: 25 },
    },
  ];

  const filteredMedia = mockMedia.filter((item) => {
    if (mediaFilter === "all") return true;
    if (mediaFilter === "images") return item.type === "image";
    if (mediaFilter === "videos") return item.type === "video";
    return true;
  });

  // Mock profile data
  const mockProfile = profileUser
    ? createMockProfile(profileUser)
    : {
        id: "1",
        username: "johndoe",
        displayName: "John Doe",
        bio: "Software Developer | Tech Enthusiast | Coffee Lover ☕\nBuilding the future one line of code at a time 🚀\n\n🌟 Passionate about creating amazing user experiences\n📱 Mobile-first developer\n🎯 Always learning new technologies",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        banner:
          "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        location: "San Francisco, CA",
        website: "https://johndoe.dev",
        joinDate: "January 2020",
        verified: true,
        followers: 2847,
        following: 892,
        posts: 156,
        engagement: 94,
        profileViews: 15620,
        jobTitle: "Senior Full Stack Developer",
        company: "TechCorp Inc.",
        education: "Stanford University",
        relationshipStatus: "Single",
        languages: ["English", "Spanish", "French"],
        skills: [
          "React",
          "TypeScript",
          "Node.js",
          "Python",
          "AWS",
          "Docker",
          "GraphQL",
          "PostgreSQL",
          "MongoDB",
          "React Native",
        ],
        interests: ["Technology", "Travel", "Photography", "Coffee", "Hiking"],
        achievements: [
          { title: "Top Contributor", date: "2024", icon: Trophy },
          { title: "Verified Creator", date: "2023", icon: Verified },
          { title: "Early Adopter", date: "2020", icon: Star },
        ],
        creatorStats: {
          totalViews: 125000,
          totalLikes: 8940,
          totalShares: 1230,
          engagementRate: 7.8,
          subscriberGrowth: 12.5,
          avgViewDuration: "3:42",
        },
      };

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        if (isOwnProfile && user?.profile) {
          setProfileUser(user.profile);
          setFollowerCount(Math.floor(Math.random() * 1000) + 100);
          setFollowingCount(Math.floor(Math.random() * 500) + 50);
          setPosts(mockPosts);
          setProducts([]);
          setServices([]);
        } else if (targetUsername) {
          const profile = await profileService.getProfile(targetUsername);
          if (profile) {
            setProfileUser(profile);
            const [userPosts, userProducts, userServices] = await Promise.all([
              profileService.getUserPosts(profile.id),
              profileService.getUserProducts(profile.id),
              profileService.getUserServices(profile.id),
            ]);
            setPosts(userPosts?.length ? userPosts : mockPosts);
            setProducts(userProducts?.length ? userProducts : []);
            setServices(userServices?.length ? userServices : []);
            setFollowerCount(Math.floor(Math.random() * 1000) + 100);
            setFollowingCount(Math.floor(Math.random() * 500) + 50);
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [targetUsername, isOwnProfile, user, toast]);

  const handleFollow = async () => {
    setIsFollowing(!isFollowing);
    setFollowerCount((prev) => (isFollowing ? prev - 1 : prev + 1));
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: `You are ${isFollowing ? "no longer" : "now"} following ${mockProfile.displayName}`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="flex gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4 lg:py-6">
        <div className="space-y-4 sm:space-y-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {/* Profile Header */}
          <Card className="overflow-hidden">
            <div className="relative">
              {/* Banner */}
              <div
                className="h-32 sm:h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative bg-cover bg-center"
                style={{ backgroundImage: `url(${mockProfile.banner})` }}
              >
                <div className="absolute inset-0 bg-black/20" />
                {isOwnProfile && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-4 right-4 backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white border-white/20"
                    onClick={() => setIsEditingCover(true)}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Edit Cover
                  </Button>
                )}
              </div>

              {/* Profile Info */}
              <CardContent className="relative pt-0">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12 sm:-mt-16">
                  <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white shadow-lg">
                        <AvatarImage
                          src={mockProfile.avatar}
                          alt={mockProfile.displayName}
                        />
                        <AvatarFallback className="text-xl sm:text-2xl font-bold">
                          {mockProfile.displayName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {isOwnProfile && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                          onClick={() => setIsEditingAvatar(true)}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Name and Basic Info */}
                    <div className="flex-1 space-y-2 mt-4 sm:mt-0 sm:mb-2">
                      <div className="flex items-center gap-2">
                        <h1 className="text-xl sm:text-2xl font-bold">
                          {mockProfile.displayName}
                        </h1>
                        {mockProfile.verified && (
                          <Verified className="h-5 w-5 text-blue-500 fill-current" />
                        )}
                      </div>
                      <p className="text-muted-foreground">
                        @{mockProfile.username}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {mockProfile.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Joined {mockProfile.joinDate}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {mockProfile.profileViews.toLocaleString()} profile
                          views
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-4 sm:mt-0">
                    {isOwnProfile ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => setShowEditModal(true)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                        <Button variant="outline" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={handleFollow} className="px-6">
                          {isFollowing ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Following
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Follow
                            </>
                          )}
                        </Button>
                        <Button variant="outline">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        <Button variant="outline" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-6">
                  <p className="text-sm whitespace-pre-line">
                    {mockProfile.bio}
                  </p>
                  {mockProfile.website && (
                    <a
                      href={mockProfile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline mt-2"
                    >
                      <Globe className="h-4 w-4" />
                      {mockProfile.website.replace("https://", "")}
                    </a>
                  )}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 mt-6 py-4 border-t">
                  <div className="text-center">
                    <div className="text-xl font-bold">{mockProfile.posts}</div>
                    <div className="text-sm text-muted-foreground">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">
                      {followerCount.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Followers
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">
                      {followingCount.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Following
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">
                      {mockProfile.engagement}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Engagement
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Enhanced Horizontal Scrolling Tabs */}
          <Card>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="relative border-b">
                <TabsList className="flex w-full overflow-x-auto gap-0 p-0 h-auto bg-transparent whitespace-nowrap scrollbar-hide">
                  <TabsTrigger
                    value="posts"
                    className="flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 bg-transparent"
                  >
                    <MessageSquare className="h-4 w-4 flex-shrink-0" />
                    <span>Posts</span>
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {mockPosts.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="products"
                    className="flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 bg-transparent"
                  >
                    <Store className="h-4 w-4 flex-shrink-0" />
                    <span>Products</span>
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {products.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="services"
                    className="flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 bg-transparent"
                  >
                    <Code className="h-4 w-4 flex-shrink-0" />
                    <span>Services</span>
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {services.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="media"
                    className="flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 bg-transparent"
                  >
                    <Camera className="h-4 w-4 flex-shrink-0" />
                    <span>Media</span>
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {mockMedia.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="creator-studio"
                    className="flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 bg-transparent"
                  >
                    <BarChart3 className="h-4 w-4 flex-shrink-0" />
                    <span>Creator Studio</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="activity"
                    className="flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 bg-transparent"
                  >
                    <Activity className="h-4 w-4 flex-shrink-0" />
                    <span>Activity</span>
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {mockActivity.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="about"
                    className="flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 bg-transparent"
                  >
                    <Users className="h-4 w-4 flex-shrink-0" />
                    <span>About</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Contents */}
              <div className="p-4 sm:p-6">
                {/* Posts Tab */}
                <TabsContent value="posts" className="space-y-6 mt-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Posts</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{mockPosts.length} posts</span>
                      <span>•</span>
                      <span>
                        {mockPosts.reduce((sum, post) => sum + post.likes, 0)}{" "}
                        total likes
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {mockPosts.map((post) => (
                      <Card
                        key={post.id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10 flex-shrink-0">
                              <AvatarImage
                                src={mockProfile.avatar}
                                alt={mockProfile.displayName}
                              />
                              <AvatarFallback>
                                {mockProfile.displayName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-3">
                              <div>
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="font-medium">
                                    {mockProfile.displayName}
                                  </span>
                                  <span className="text-muted-foreground">
                                    @{mockProfile.username}
                                  </span>
                                  <span className="text-muted-foreground">
                                    •
                                  </span>
                                  <span className="text-muted-foreground">
                                    {post.timestamp}
                                  </span>
                                </div>
                                <p className="mt-2">{post.content}</p>
                              </div>

                              {post.image && (
                                <div className="rounded-lg overflow-hidden">
                                  <img
                                    src={post.image}
                                    alt="Post image"
                                    className="w-full h-auto max-h-96 object-cover"
                                  />
                                </div>
                              )}

                              <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
                                <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
                                  <Heart className="h-4 w-4" />
                                  {post.likes}
                                </button>
                                <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                                  <MessageSquare className="h-4 w-4" />
                                  {post.comments}
                                </button>
                                <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
                                  <Share2 className="h-4 w-4" />
                                  {post.shares}
                                </button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Products Tab */}
                <TabsContent value="products" className="space-y-6 mt-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Products</h3>
                    {isOwnProfile && (
                      <Button size="sm">
                        <Store className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    )}
                  </div>

                  {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products.map((product) => (
                        <Card
                          key={product.id}
                          className="hover:shadow-md transition-shadow"
                        >
                          <div className="aspect-square bg-gray-100 rounded-t-lg"></div>
                          <CardContent className="p-4">
                            <h4 className="font-medium">{product.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {product.description}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <span className="font-bold text-lg">
                                ${product.price}
                              </span>
                              <Button size="sm">View</Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Store className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h4 className="text-lg font-medium mb-2">
                        No products yet
                      </h4>
                      <p className="text-muted-foreground">
                        {isOwnProfile
                          ? "Start selling your products to your audience"
                          : "This user hasn't listed any products yet"}
                      </p>
                    </div>
                  )}
                </TabsContent>

                {/* Services Tab */}
                <TabsContent value="services" className="space-y-6 mt-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Services</h3>
                    {isOwnProfile && (
                      <Button size="sm">
                        <Code className="h-4 w-4 mr-2" />
                        Add Service
                      </Button>
                    )}
                  </div>

                  {services.length > 0 ? (
                    <div className="space-y-4">
                      {services.map((service) => (
                        <Card
                          key={service.id}
                          className="hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium">{service.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {service.description}
                                </p>
                                <div className="flex items-center gap-4 mt-3">
                                  <span className="font-bold text-lg">
                                    ${service.price}
                                  </span>
                                  <Badge variant="secondary">
                                    {service.category}
                                  </Badge>
                                </div>
                              </div>
                              <Button size="sm">View Details</Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Code className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h4 className="text-lg font-medium mb-2">
                        No services yet
                      </h4>
                      <p className="text-muted-foreground">
                        {isOwnProfile
                          ? "Offer your skills and services to potential clients"
                          : "This user hasn't listed any services yet"}
                      </p>
                    </div>
                  )}
                </TabsContent>

                {/* Enhanced Media Tab */}
                <TabsContent value="media" className="space-y-6 mt-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">Media</h3>
                      <p className="text-sm text-muted-foreground">
                        Photos and videos
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Filter Controls */}
                      <Select
                        value={mediaFilter}
                        onValueChange={setMediaFilter}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="images">Images</SelectItem>
                          <SelectItem value="videos">Videos</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* View Mode Toggle */}
                      <div className="flex border rounded-lg p-1">
                        <Button
                          variant={
                            mediaViewMode === "grid" ? "default" : "ghost"
                          }
                          size="sm"
                          onClick={() => setMediaViewMode("grid")}
                          className="h-8 w-8 p-0"
                        >
                          <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={
                            mediaViewMode === "list" ? "default" : "ghost"
                          }
                          size="sm"
                          onClick={() => setMediaViewMode("list")}
                          className="h-8 w-8 p-0"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {filteredMedia.length > 0 ? (
                    mediaViewMode === "grid" ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {filteredMedia.map((item) => (
                          <div
                            key={item.id}
                            className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                          >
                            <img
                              src={item.url}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="text-white text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                  {item.type === "video" ? (
                                    <>
                                      <Play className="h-4 w-4" />
                                      <span className="text-sm">
                                        {item.duration}
                                      </span>
                                    </>
                                  ) : (
                                    <ImageIcon className="h-4 w-4" />
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                  <span className="flex items-center gap-1">
                                    <Heart className="h-3 w-3" />
                                    {item.likes}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {item.views}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge
                              variant={
                                item.type === "video" ? "default" : "secondary"
                              }
                              className="absolute top-2 left-2 text-xs"
                            >
                              {item.type === "video" ? "Video" : "Image"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredMedia.map((item) => (
                          <Card
                            key={item.id}
                            className="hover:shadow-md transition-shadow"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                  <img
                                    src={item.url}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium truncate">
                                        {item.title}
                                      </h4>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {item.description}
                                      </p>
                                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                        <span>{item.date}</span>
                                        <span className="flex items-center gap-1">
                                          <Heart className="h-3 w-3" />
                                          {item.likes}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Eye className="h-3 w-3" />
                                          {item.views}
                                        </span>
                                        {item.type === "video" && (
                                          <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {item.duration}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <Badge
                                      variant={
                                        item.type === "video"
                                          ? "default"
                                          : "secondary"
                                      }
                                    >
                                      {item.type === "video"
                                        ? "Video"
                                        : "Image"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )
                  ) : (
                    <div className="text-center py-12">
                      <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h4 className="text-lg font-medium mb-2">
                        No media found
                      </h4>
                      <p className="text-muted-foreground">
                        {mediaFilter === "all"
                          ? "No photos or videos have been shared yet"
                          : `No ${mediaFilter} found`}
                      </p>
                    </div>
                  )}
                </TabsContent>

                {/* Creator Studio Tab */}
                <TabsContent value="creator-studio" className="space-y-6 mt-0">
                  <div>
                    <h3 className="text-lg font-semibold">Creator Studio</h3>
                    <p className="text-sm text-muted-foreground">
                      Analytics, insights, and growth recommendations
                    </p>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Total Views
                            </p>
                            <p className="text-2xl font-bold">
                              {mockProfile.creatorStats.totalViews.toLocaleString()}
                            </p>
                          </div>
                          <Eye className="h-8 w-8 text-blue-500" />
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-sm">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <span className="text-green-500">
                            +{mockProfile.creatorStats.subscriberGrowth}%
                          </span>
                          <span className="text-muted-foreground">
                            this month
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Total Likes
                            </p>
                            <p className="text-2xl font-bold">
                              {mockProfile.creatorStats.totalLikes.toLocaleString()}
                            </p>
                          </div>
                          <Heart className="h-8 w-8 text-red-500" />
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-sm">
                          <span className="text-green-500">+15.3%</span>
                          <span className="text-muted-foreground">
                            this week
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Engagement Rate
                            </p>
                            <p className="text-2xl font-bold">
                              {mockProfile.creatorStats.engagementRate}%
                            </p>
                          </div>
                          <Zap className="h-8 w-8 text-yellow-500" />
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-sm">
                          <span className="text-green-500">Above average</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Avg. View Duration
                            </p>
                            <p className="text-2xl font-bold">
                              {mockProfile.creatorStats.avgViewDuration}
                            </p>
                          </div>
                          <Clock className="h-8 w-8 text-purple-500" />
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-sm">
                          <span className="text-green-500">+8.2%</span>
                          <span className="text-muted-foreground">
                            vs last month
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Growth Tips */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        Growth Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Target className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Post consistently</h4>
                          <p className="text-sm text-muted-foreground">
                            Your audience engages most on Tuesdays and Thursdays
                            at 2-4 PM
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Engage with comments</h4>
                          <p className="text-sm text-muted-foreground">
                            Posts with creator responses get 40% more engagement
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <Video className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            Create more video content
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Your videos perform 3x better than image posts
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Best Performing Content */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Performing Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockPosts.slice(0, 3).map((post, index) => (
                          <div
                            key={post.id}
                            className="flex items-center gap-3 p-3 rounded-lg border"
                          >
                            <div className="w-8 h-8 rounded bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                              #{index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium truncate">
                                {post.content}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                <span>{post.likes} likes</span>
                                <span>{post.comments} comments</span>
                                <span>{post.shares} shares</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Enhanced Activity Tab */}
                <TabsContent value="activity" className="space-y-6 mt-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Activity Overview
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Recent activity and performance insights
                      </p>
                    </div>
                  </div>

                  {/* Activity Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {mockPosts.length}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Posts This Month
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {mockPosts.reduce((sum, post) => sum + post.likes, 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total Likes
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {mockProfile.profileViews.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Profile Views
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {mockActivity.map((activity, index) => (
                          <div
                            key={activity.id}
                            className="flex items-start gap-4"
                          >
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                {activity.type === "post" && (
                                  <MessageSquare className="h-4 w-4 text-white" />
                                )}
                                {activity.type === "video" && (
                                  <Video className="h-4 w-4 text-white" />
                                )}
                                {activity.type === "achievement" && (
                                  <Trophy className="h-4 w-4 text-white" />
                                )}
                                {activity.type === "follow" && (
                                  <Users className="h-4 w-4 text-white" />
                                )}
                              </div>
                              {index < mockActivity.length - 1 && (
                                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gray-200"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium">
                                    {activity.action}
                                  </p>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {activity.content}
                                  </p>
                                  {activity.engagement && (
                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                      {activity.engagement.likes && (
                                        <span>
                                          {activity.engagement.likes} likes
                                        </span>
                                      )}
                                      {activity.engagement.views && (
                                        <span>
                                          {activity.engagement.views} views
                                        </span>
                                      )}
                                      {activity.engagement.followers && (
                                        <span>
                                          +{activity.engagement.followers}{" "}
                                          followers
                                        </span>
                                      )}
                                      {activity.engagement.duration && (
                                        <span>
                                          {activity.engagement.duration}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                                  {activity.timestamp}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Enhanced About Tab */}
                <TabsContent value="about" className="space-y-6 mt-0">
                  <div>
                    <h3 className="text-lg font-semibold">
                      About {mockProfile.displayName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Personal and professional information
                    </p>
                  </div>

                  {/* Personal Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium">Location</div>
                            <div className="text-sm text-muted-foreground">
                              {mockProfile.location}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium">Website</div>
                            <a
                              href={mockProfile.website}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {mockProfile.website?.replace("https://", "")}
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium">Joined</div>
                            <div className="text-sm text-muted-foreground">
                              {mockProfile.joinDate}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium">
                              Profile Views
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {mockProfile.profileViews.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Skills & Expertise */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Skills & Expertise</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-3">
                          Technical Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {mockProfile.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="text-sm font-medium mb-3">Interests</h4>
                        <div className="flex flex-wrap gap-2">
                          {mockProfile.interests.map((interest) => (
                            <Badge key={interest} variant="outline">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="text-sm font-medium mb-3">Languages</h4>
                        <div className="flex flex-wrap gap-2">
                          {mockProfile.languages.map((language) => (
                            <Badge key={language} variant="outline">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Professional Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Professional</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Briefcase className="h-4 w-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {mockProfile.jobTitle}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {mockProfile.company}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <GraduationCap className="h-4 w-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Education</div>
                          <div className="text-sm text-muted-foreground">
                            Computer Science, {mockProfile.education}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Achievements & Badges */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Achievements & Badges</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mockProfile.achievements.map((achievement) => (
                          <div
                            key={achievement.title}
                            className="flex items-center gap-3 p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50"
                          >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                              <achievement.icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className="font-medium">
                                {achievement.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {achievement.date}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        profile={mockProfile}
      />
    </div>
  );
};

export default EnhancedProfile;
