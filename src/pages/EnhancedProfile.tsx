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

  const isOwnProfile =
    !targetUsername || (user && user.profile?.username === targetUsername);

  // Create enhanced mock profile from original structure
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
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
    location: profile.location || "San Francisco, CA",
    website: profile.website || "https://johndoe.dev",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    company: "Tech Innovations Inc.",
    education: "Stanford University",
    jobTitle: "Senior Full Stack Developer",
    joinedDate: new Date(profile.join_date || "2021-01-15"),
    followers: followerCount,
    following: followingCount,
    posts: profile.posts_count || 189,
    verified: profile.is_verified || true,
    level: profile.level || "Gold",
    reputation: profile.reputation || 4.8,
    completedTasks: 87,
    totalTasks: 100,
    isOnline: profile.is_online || true,
    lastSeen: new Date(profile.last_active || new Date()),
    skills: profile.skills || [
      "JavaScript",
      "React",
      "Node.js",
      "Python",
      "AI/ML",
      "TypeScript",
      "GraphQL",
      "AWS",
    ],
    achievements: profile.achievements || [
      {
        name: "Early Adopter",
        icon: "🚀",
        description: "Joined in the first month",
        date: "2021-01-15",
      },
      {
        name: "Top Contributor",
        icon: "⭐",
        description: "100+ helpful posts",
        date: "2023-06-15",
      },
      {
        name: "Community Leader",
        icon: "👑",
        description: "Helped 500+ users",
        date: "2023-12-01",
      },
      {
        name: "Coding Streak",
        icon: "🔥",
        description: "30-day coding streak",
        date: "2024-01-01",
      },
    ],
    socialStats: {
      totalLikes: 24560,
      totalShares: 5670,
      totalComments: 8900,
      profileViews: profile.profile_views || 123400,
    },
    relationshipStatus: "Single",
    languages: profile.languages || ["English", "Spanish", "French"],
    interests: profile.interests || [
      "Technology",
      "Photography",
      "Travel",
      "Music",
      "Gaming",
    ],
  });

  // Mock posts data from original
  const createMockPosts = (mockProfile: any) => [
    {
      id: "1",
      content:
        "Just shipped a new feature! Really excited about the possibilities 🚀\n\nThis update includes:\n✨ Dark mode improvements\n🔥 Performance optimizations\n🎨 New UI components\n📱 Better mobile experience",
      images: [
        "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      ],
      createdAt: new Date("2024-01-15T10:30:00Z"),
      likes: 124,
      comments: 23,
      shares: 12,
      type: "post",
    },
    {
      id: "2",
      content:
        "Working on something amazing with the team. Can't wait to share it with everyone! 🎯\n\nBeen focusing on:\n🎨 User experience improvements\n⚡ Performance optimizations\n🛡️ Security enhancements\n\n#TechLife #Innovation #BuildingTheFuture",
      images: [
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      ],
      createdAt: new Date("2024-01-14T15:45:00Z"),
      likes: 189,
      comments: 35,
      shares: 18,
      type: "post",
    },
    {
      id: "3",
      content:
        "Attended an amazing tech conference today! 🎤 Learned so much about AI and machine learning trends for 2024. The future is incredibly bright! 🌟\n\nKey takeaways:\n🤖 AI integration in everyday apps\n📊 Better data visualization\n🔮 Predictive analytics improvements",
      images: [],
      createdAt: new Date("2024-01-13T18:20:00Z"),
      likes: 267,
      comments: 41,
      shares: 25,
      type: "post",
    },
  ];

  // Mock media data from original
  const createMockMedia = () => [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      type: "image",
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      type: "image",
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      type: "image",
    },
    {
      id: "4",
      url: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      type: "image",
    },
    {
      id: "5",
      url: "https://images.unsplash.com/photo-1518085250350-d8e8c328c70e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      type: "image",
    },
    {
      id: "6",
      url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      type: "image",
    },
  ];

  // Load profile data
  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);

      try {
        let profile: UserProfile | null = null;

        if (isOwnProfile && user?.profile) {
          profile = user.profile;
        } else if (targetUsername) {
          profile = await profileService.getUserByUsername(targetUsername);

          if (!profile) {
            const mockUser = profileService.generateMockUser(targetUsername);
            profile = mockUser.profile!;
            setPosts(mockUser.mock_data.posts);
            setProducts(mockUser.mock_data.products);
            setServices(mockUser.mock_data.services);
          }
        }

        if (profile) {
          setProfileUser(profile);

          if (profile.id) {
            const [followers, following] = await Promise.all([
              profileService.getFollowersCount(profile.id),
              profileService.getFollowingCount(profile.id),
            ]);

            setFollowerCount(followers);
            setFollowingCount(following);

            if (user && user.id && !isOwnProfile) {
              const followingStatus = await profileService.isFollowing(
                user.id,
                profile.id,
              );
              setIsFollowing(followingStatus);
            }

            // Load content if not already loaded
            if (!posts.length) {
              try {
                const [userPosts, userProducts, userServices] =
                  await Promise.all([
                    profileService.getUserPosts(profile.id),
                    profileService.getUserProducts(profile.id),
                    profileService.getUserServices(profile.id),
                  ]);

                setPosts(
                  userPosts?.length
                    ? formatPosts(userPosts)
                    : createMockPosts(createMockProfile(profile)),
                );
                setProducts(
                  userProducts?.length
                    ? formatProducts(userProducts)
                    : generateMockProducts(),
                );
                setServices(
                  userServices?.length
                    ? formatServices(userServices)
                    : generateMockServices(),
                );
              } catch (error: any) {
                console.warn(
                  "Error loading user content:",
                  error?.message || error,
                );
                setPosts(createMockPosts(createMockProfile(profile)));
                if (profile.marketplace_profile)
                  setProducts(generateMockProducts());
                if (profile.freelance_profile)
                  setServices(generateMockServices());
              }
            }
          }
        } else {
          toast({
            title: "Profile not found",
            description: "The requested profile could not be found.",
            variant: "destructive",
          });
          navigate("/feed");
        }
      } catch (error: any) {
        console.error("Error loading profile:", error?.message || error);
        toast({
          title: "Error loading profile",
          description: "Failed to load the profile. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [targetUsername, isOwnProfile, user]);

  // Event handlers from original
  const handleCoverPhotoUpload = () => {
    toast({
      title: "Cover Photo Updated",
      description: "Your cover photo has been updated successfully.",
    });
    setIsEditingCover(false);
  };

  const handleAvatarUpload = () => {
    toast({
      title: "Profile Picture Updated",
      description: "Your profile picture has been updated successfully.",
    });
    setIsEditingAvatar(false);
  };

  const handleFollow = async () => {
    if (!user || !profileUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to follow users.",
        variant: "destructive",
      });
      return;
    }

    try {
      await profileService.toggleFollow(user.id, profileUser.id, isFollowing);
      setIsFollowing(!isFollowing);
      setFollowerCount((prev) => (isFollowing ? prev - 1 : prev + 1));

      toast({
        title: isFollowing ? "Unfollowed" : "Following",
        description: `You ${isFollowing ? "unfollowed" : "are now following"} ${profileUser.full_name}`,
      });
    } catch (error: any) {
      console.error("Error toggling follow:", error?.message || error);
      toast({
        title: "Error",
        description: "Failed to update follow status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMessage = () => {
    if (!profileUser) return;
    navigate(`/chat?user=${profileUser.username}`);
    toast({
      title: "Opening chat",
      description: `Starting conversation with ${profileUser.full_name}`,
    });
  };

  const handleShare = async () => {
    if (!profileUser) return;
    const profileUrl = `${window.location.origin}/profile/${profileUser.username}`;

    try {
      await navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Profile link copied",
        description: "The profile link has been copied to your clipboard.",
      });
    } catch {
      toast({
        title: "Share profile",
        description: `Share this profile: ${profileUrl}`,
      });
    }
  };

  // Helper functions
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Mock data generators
  const formatPosts = (postsData: any[]) => {
    return postsData.map((post) => ({
      id: post.id,
      content: post.content,
      images: post.image_url ? [post.image_url] : [],
      createdAt: new Date(post.created_at),
      likes: post.likes || Math.floor(Math.random() * 50),
      comments: post.comments || Math.floor(Math.random() * 10),
      shares: Math.floor(Math.random() * 5),
    }));
  };

  const formatProducts = (productsData: any[]): Product[] => {
    return productsData.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discount_price,
      image:
        product.image_url || "https://source.unsplash.com/400x400/?product",
      category: product.category || "General",
      rating: product.rating || 4.5,
      reviewCount: product.review_count || 0,
      inStock: product.in_stock !== false,
      isNew:
        new Date(product.created_at).getTime() >
        Date.now() - 7 * 24 * 60 * 60 * 1000,
      isFeatured: product.is_featured || false,
      sellerId: product.seller_id,
      sellerName: profileUser?.full_name || "User",
      sellerAvatar: profileUser?.avatar_url || "",
      sellerVerified: profileUser?.is_verified || false,
      createdAt: product.created_at,
      updatedAt: product.updated_at || product.created_at,
      condition: product.condition || "new",
    }));
  };

  const formatServices = (servicesData: any[]) => {
    return servicesData.map((service) => ({
      id: service.id,
      title: service.title,
      description: service.description,
      category: service.category || "Development",
      price_range: {
        min: service.min_price || 50,
        max: service.max_price || 500,
      },
      delivery_time: service.delivery_time || 7,
      featured: service.featured || false,
    }));
  };

  const generateMockProducts = (): Product[] => {
    if (!profileUser?.marketplace_profile) return [];

    const templates = [
      {
        name: "Premium Wireless Headphones",
        price: 199.99,
        category: "Electronics",
      },
      { name: "Smart Fitness Tracker", price: 149.99, category: "Electronics" },
      {
        name: "Organic Coffee Beans",
        price: 24.99,
        category: "Food & Beverages",
      },
    ];

    return templates.map((template, i) => ({
      id: `mock-product-${i + 1}`,
      ...template,
      description: `High-quality ${template.name.toLowerCase()} with excellent features`,
      image: `https://source.unsplash.com/400x400/?${template.category.toLowerCase()}`,
      rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
      reviewCount: Math.floor(Math.random() * 50) + 5,
      inStock: true,
      isNew: i === 0,
      isFeatured: i === 1,
      sellerId: profileUser.id,
      sellerName: profileUser.full_name || "User",
      sellerAvatar: profileUser.avatar_url || "",
      sellerVerified: profileUser.is_verified || false,
      createdAt: new Date(
        Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      updatedAt: new Date().toISOString(),
      condition: "new" as const,
    }));
  };

  const generateMockServices = () => {
    if (!profileUser?.freelance_profile) return [];

    return [
      {
        id: "mock-service-1",
        title: "Full Stack Web Development",
        description:
          "Complete web application development from design to deployment",
        category: "Development",
        price_range: { min: 500, max: 5000 },
        delivery_time: 14,
        featured: true,
      },
    ];
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="relative">
          <Skeleton className="h-64 w-full rounded-b-lg" />
          <div className="px-6 -mt-16 relative">
            <div className="flex items-end gap-4">
              <Skeleton className="w-32 h-32 rounded-full border-4 border-white" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 mt-8 space-y-4">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (!profileUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Profile not found</h2>
            <p className="text-muted-foreground mb-4">
              The requested profile could not be found.
            </p>
            <Button onClick={() => navigate("/feed")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Create mock profile for all the original functionality
  const mockProfile = createMockProfile(profileUser);
  const mockPosts = createMockPosts(mockProfile);
  const mockMedia = createMockMedia();

  return (
    <div className="min-h-screen bg-background mobile-container">
      {/* Navigation Header for other profiles */}
      {!isOwnProfile && (
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-2">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="font-semibold">{profileUser.full_name}</h1>
                <p className="text-sm text-muted-foreground">
                  @{profileUser.username}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Enhanced Facebook-Style Cover Photo Section from Original */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="relative h-48 sm:h-56 md:h-72 lg:h-80 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 overflow-hidden rounded-b-lg">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${coverPhotoUrl || mockProfile.banner})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

          {/* Cover Photo Actions */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-2">
            {isOwnProfile && (
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 text-black hover:bg-white"
                onClick={() => setIsEditingCover(true)}
              >
                <Camera className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Edit Cover</span>
              </Button>
            )}
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 text-black hover:bg-white"
              onClick={handleShare}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Edit Cover Photo Modal */}
          {isEditingCover && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Update Cover Photo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-3">
                    <Button className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                    <Button variant="outline" className="w-full">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Choose from Gallery
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCoverPhotoUpload} className="flex-1">
                      <Check className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingCover(false)}
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Profile Information Section */}
        <div className="px-3 sm:px-4 md:px-6">
          <div className="relative">
            {/* Profile Avatar */}
            <div className="relative -mt-12 sm:-mt-16 md:-mt-20 mb-4">
              <div className="relative inline-block">
                <Avatar className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-36 lg:w-36 border-4 border-white shadow-xl">
                  <AvatarImage
                    src={mockProfile.avatar}
                    alt={mockProfile.displayName}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-xl sm:text-2xl font-bold">
                    {mockProfile.displayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                {/* Online Status Indicator */}
                {mockProfile.isOnline && (
                  <div className="absolute bottom-2 right-2 h-4 w-4 sm:h-5 sm:w-5 bg-green-500 border-2 border-white rounded-full"></div>
                )}

                {/* Avatar Edit Button */}
                {isOwnProfile && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white shadow-md hover:bg-gray-50"
                    onClick={() => setIsEditingAvatar(true)}
                  >
                    <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                      {mockProfile.displayName}
                    </h1>
                    {mockProfile.verified && (
                      <Verified className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 fill-current" />
                    )}
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base">
                    @{mockProfile.username}
                  </p>
                  {mockProfile.jobTitle && (
                    <p className="text-gray-700 font-medium text-sm sm:text-base">
                      {mockProfile.jobTitle}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 sm:gap-6 text-sm sm:text-base">
                  <div className="text-center">
                    <div className="font-bold text-lg">{mockProfile.posts}</div>
                    <div className="text-gray-600 text-xs sm:text-sm">
                      Posts
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">
                      {formatNumber(mockProfile.followers)}
                    </div>
                    <div className="text-gray-600 text-xs sm:text-sm">
                      Followers
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">
                      {mockProfile.following}
                    </div>
                    <div className="text-gray-600 text-xs sm:text-sm">
                      Following
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {mockProfile.reputation}
                    </div>
                    <div className="text-gray-600 text-xs sm:text-sm">
                      Rating
                    </div>
                  </div>
                </div>

                {/* Level and Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className="border-yellow-400 text-yellow-600"
                  >
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    {mockProfile.level}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-green-400 text-green-600"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                  {mockProfile.isOnline && (
                    <Badge
                      variant="outline"
                      className="border-green-400 text-green-600"
                    >
                      <div className="h-2 w-2 bg-green-500 rounded-full mr-1"></div>
                      Online
                    </Badge>
                  )}
                  {/* Role badges */}
                  {profileUser.marketplace_profile && (
                    <Badge
                      variant="outline"
                      className="border-green-400 text-green-600 text-xs"
                    >
                      <Store className="w-3 h-3 mr-1" />
                      Seller
                    </Badge>
                  )}
                  {profileUser.freelance_profile && (
                    <Badge
                      variant="outline"
                      className="border-blue-400 text-blue-600 text-xs"
                    >
                      <Code className="w-3 h-3 mr-1" />
                      Freelancer
                    </Badge>
                  )}
                  {profileUser.crypto_profile && (
                    <Badge
                      variant="outline"
                      className="border-orange-400 text-orange-600 text-xs"
                    >
                      <Coins className="w-3 h-3 mr-1" />
                      Trader
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-3">
                {!isOwnProfile ? (
                  <>
                    <Button
                      className="flex-1 sm:flex-none"
                      onClick={handleFollow}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 sm:flex-none"
                      onClick={handleMessage}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setShowEditModal(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Edit Profile</span>
                  </Button>
                )}
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-3 sm:px-4 md:px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Enhanced Sidebar from Original */}
          <div className="lg:col-span-1 space-y-4 order-2 lg:order-1">
            {/* Bio and Info Card */}
            <Card>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">About</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                    {mockProfile.bio}
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  {mockProfile.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span>{mockProfile.location}</span>
                    </div>
                  )}

                  {mockProfile.company && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="w-4 h-4 flex-shrink-0" />
                      <span>{mockProfile.company}</span>
                    </div>
                  )}

                  {mockProfile.education && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap className="w-4 h-4 flex-shrink-0" />
                      <span>{mockProfile.education}</span>
                    </div>
                  )}

                  {mockProfile.website && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="w-4 h-4 flex-shrink-0" />
                      <a
                        href={mockProfile.website}
                        className="text-blue-500 hover:underline break-all"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {mockProfile.website}
                      </a>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>
                      Joined {formatDistanceToNow(mockProfile.joinedDate)} ago
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Stats Card from Original */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Activity Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-blue-600">
                      {(mockProfile.socialStats.totalLikes / 1000).toFixed(1)}K
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total Likes
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-green-600">
                      {(mockProfile.socialStats.profileViews / 1000).toFixed(0)}
                      K
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Profile Views
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-purple-600">
                      {(mockProfile.socialStats.totalShares / 1000).toFixed(1)}K
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total Shares
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-orange-600">
                      {(mockProfile.socialStats.totalComments / 1000).toFixed(
                        1,
                      )}
                      K
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Comments
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Profile Completion</span>
                    <span>
                      {Math.round(
                        (mockProfile.completedTasks / mockProfile.totalTasks) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      (mockProfile.completedTasks / mockProfile.totalTasks) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Skills Card from Original */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockProfile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Achievements Card from Original */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockProfile.achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {achievement.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {achievement.description}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(achievement.date))} ago
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Languages Card from Original */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockProfile.languages.map((language, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {language}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Interests Card from Original */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockProfile.interests.map((interest, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content from Original */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4 md:space-y-6"
            >
              <div className="mobile-tabs">
                <TabsList className="grid w-full grid-cols-4 mobile-grid-4">
                  <TabsTrigger
                    value="posts"
                    className="mobile-tab touch-target"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Posts</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="media"
                    className="mobile-tab touch-target"
                  >
                    <Camera className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Media</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="activity"
                    className="mobile-tab touch-target"
                  >
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Activity</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="about"
                    className="mobile-tab touch-target"
                  >
                    <Users className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">About</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="posts" className="space-y-4">
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
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="font-semibold">
                              {mockProfile.displayName}
                            </span>
                            {mockProfile.verified && (
                              <Verified
                                className="h-4 w-4 text-blue-500 flex-shrink-0"
                                fill="currentColor"
                              />
                            )}
                            <span className="text-muted-foreground text-sm break-all">
                              @{mockProfile.username}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              •
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {formatDistanceToNow(post.createdAt)} ago
                            </span>
                          </div>
                          <p className="text-sm mb-3 whitespace-pre-line leading-relaxed">
                            {post.content}
                          </p>
                          {post.images.length > 0 && (
                            <div className="mb-4">
                              <img
                                src={post.images[0]}
                                alt="Post content"
                                className="rounded-lg max-w-full h-auto border"
                              />
                            </div>
                          )}
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <button className="flex items-center gap-1 hover:text-red-500 transition-colors touch-target">
                              <Heart className="h-4 w-4" />
                              <span>{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-blue-500 transition-colors touch-target">
                              <MessageSquare className="h-4 w-4" />
                              <span>{post.comments}</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-green-500 transition-colors touch-target">
                              <Share2 className="h-4 w-4" />
                              <span>{post.shares}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="media" className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-2 sm:gap-4">
                  {mockMedia.map((media) => (
                    <div
                      key={media.id}
                      className="aspect-square rounded-lg overflow-hidden bg-muted hover:scale-105 transition-transform cursor-pointer"
                    >
                      <img
                        src={media.url}
                        alt="Media content"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Heart className="h-5 w-5 text-red-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          Liked a post by{" "}
                          <span className="font-medium">@tech_guru</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Users className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          Started following{" "}
                          <span className="font-medium">@design_pro</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          4 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          Commented on a post about AI trends
                        </p>
                        <p className="text-xs text-muted-foreground">
                          6 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Award className="h-5 w-5 text-purple-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          Earned the "Community Leader" achievement
                        </p>
                        <p className="text-xs text-muted-foreground">
                          1 day ago
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="about" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Contact Information</h4>
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 flex-shrink-0" />
                          <span className="break-all">{mockProfile.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 flex-shrink-0" />
                          <span>{mockProfile.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">
                        Professional Background
                      </h4>
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <div className="flex items-start gap-2">
                          <Briefcase className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium text-foreground">
                              {mockProfile.jobTitle}
                            </div>
                            <div>{mockProfile.company}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 flex-shrink-0" />
                          <span>Computer Science, {mockProfile.education}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Personal Information</h4>
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 flex-shrink-0" />
                          <span>
                            Relationship Status:{" "}
                            {mockProfile.relationshipStatus}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 flex-shrink-0" />
                          <span>
                            Languages: {mockProfile.languages.join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
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
