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
  Shield,
  Verified,
  Edit,
  Share2,
  MoreHorizontal,
  UserPlus,
  MessageCircle,
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
  const [activeTab, setActiveTab] = useState("overview");

  const isOwnProfile =
    !targetUsername || (user && user.profile?.username === targetUsername);

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
                    : generateMockPosts(),
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
                setPosts(generateMockPosts());
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

  // Event handlers
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

  const getLevelColor = (level: string) => {
    const colors = {
      bronze: "text-amber-600 border-amber-200 bg-amber-50",
      silver: "text-gray-600 border-gray-200 bg-gray-50",
      gold: "text-yellow-600 border-yellow-200 bg-yellow-50",
      platinum: "text-blue-600 border-blue-200 bg-blue-50",
      diamond: "text-purple-600 border-purple-200 bg-purple-50",
    };
    return colors[level as keyof typeof colors] || colors.bronze;
  };

  const getProfileCompletionPercentage = () => {
    if (!profileUser) return 0;
    const fields = [
      profileUser.bio,
      profileUser.location,
      profileUser.website,
      profileUser.skills?.length,
      profileUser.avatar_url,
      profileUser.banner_url,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  // Mock data generators
  const formatPosts = (postsData: any[]) => {
    return postsData.map((post) => ({
      id: post.id,
      content: post.content,
      image: post.image_url,
      created_at: post.created_at,
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

  const generateMockPosts = () => {
    if (!profileUser) return [];

    return Array.from({ length: 3 }, (_, i) => ({
      id: `mock-${i + 1}`,
      content: [
        "Just completed another successful project! Really excited about the results 🚀",
        "Working on something amazing. Can't wait to share it with everyone! ✨",
        "Great day building amazing products for the community! 💼",
      ][i],
      image:
        i === 0 ? `https://source.unsplash.com/800x600/?technology,${i}` : null,
      created_at: new Date(
        Date.now() - (i + 1) * 24 * 60 * 60 * 1000,
      ).toISOString(),
      likes: Math.floor(Math.random() * 100) + 10,
      comments: Math.floor(Math.random() * 20) + 2,
      shares: Math.floor(Math.random() * 10),
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

  return (
    <div className="min-h-screen bg-background mobile-container">
      {/* Navigation Header for other profiles */}
      {!isOwnProfile && (
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-2">
          <div className="flex items-center justify-between">
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

      {/* Enhanced Profile Header */}
      <div className="relative">
        {/* Banner */}
        <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 overflow-hidden rounded-b-lg">
          {profileUser.banner_url && (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${profileUser.banner_url})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

          {/* Online Status */}
          {profileUser.is_online && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-green-500/90 text-white px-3 py-1 rounded-full text-sm">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Online
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            {isOwnProfile && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowEditModal(true)}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
            <Button size="sm" variant="secondary" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="px-4 md:px-6">
          <div className="relative -mt-12 sm:-mt-16">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
              <div className="relative">
                <Avatar className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 border-4 border-white shadow-xl">
                  <AvatarImage
                    src={profileUser.avatar_url}
                    alt={profileUser.full_name}
                  />
                  <AvatarFallback className="text-2xl font-bold">
                    {profileUser.full_name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                {profileUser.is_online && (
                  <div className="absolute bottom-2 right-2 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 border-2 border-white rounded-full" />
                )}
                {isOwnProfile && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full"
                  >
                    <Camera className="w-3 h-3" />
                  </Button>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    {profileUser.full_name}
                  </h1>
                  {profileUser.is_verified && (
                    <Verified className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 fill-current" />
                  )}
                </div>

                <p className="text-muted-foreground mb-2">
                  @{profileUser.username}
                </p>

                {/* Role badges */}
                <div className="flex flex-wrap gap-2 mb-3">
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
                  <Badge
                    className={cn(
                      "text-xs",
                      getLevelColor(profileUser.level || "bronze"),
                    )}
                  >
                    {profileUser.level?.toUpperCase() || "BRONZE"}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold">
                      {profileUser.posts_count || 0}
                    </div>
                    <div className="text-muted-foreground text-xs">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">
                      {formatNumber(followerCount)}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Followers
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">
                      {formatNumber(followingCount)}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Following
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {profileUser.reputation || 0}
                    </div>
                    <div className="text-muted-foreground text-xs">Rating</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {!isOwnProfile && (
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    onClick={handleFollow}
                    className={cn(
                      "flex-1 sm:flex-none",
                      isFollowing &&
                        "bg-gray-200 text-gray-800 hover:bg-gray-300",
                    )}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleMessage}
                    className="flex-1 sm:flex-none"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 order-2 lg:order-1">
            {/* About */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">About</h3>
                  {profileUser.bio ? (
                    <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                      {profileUser.bio}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No bio available
                    </p>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  {profileUser.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{profileUser.location}</span>
                    </div>
                  )}
                  {profileUser.website && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="w-4 h-4" />
                      <a
                        href={profileUser.website}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {profileUser.website}
                      </a>
                    </div>
                  )}
                  {profileUser.join_date && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Joined{" "}
                        {formatDistanceToNow(new Date(profileUser.join_date))}{" "}
                        ago
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold">Progress</h3>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Profile Completion
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {getProfileCompletionPercentage()}%
                    </span>
                  </div>
                  <Progress
                    value={getProfileCompletionPercentage()}
                    className="h-2"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">
                    {profileUser.points || 0} points
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            {profileUser.skills?.length && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileUser.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Posts</span>
                </TabsTrigger>
                <TabsTrigger value="products">
                  <Store className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Products</span>
                </TabsTrigger>
                <TabsTrigger value="services">
                  <Code className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Services</span>
                </TabsTrigger>
                <TabsTrigger value="activity">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Activity</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {posts.length > 0 ? (
                  posts.map((post, index) => (
                    <Card key={post.id || index}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={profileUser.avatar_url}
                              alt={profileUser.full_name}
                            />
                            <AvatarFallback>
                              {profileUser.full_name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold">
                                {profileUser.full_name}
                              </span>
                              <span className="text-muted-foreground text-sm">
                                @{profileUser.username}
                              </span>
                              <span className="text-muted-foreground text-sm">
                                •
                              </span>
                              <span className="text-muted-foreground text-sm">
                                {formatDistanceToNow(new Date(post.created_at))}{" "}
                                ago
                              </span>
                            </div>
                            <p className="text-sm mb-3">{post.content}</p>
                            {post.image && (
                              <img
                                src={post.image}
                                alt="Post content"
                                className="rounded-lg max-w-full h-auto border mb-3"
                              />
                            )}
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                                <Heart className="h-4 w-4" />
                                <span>{post.likes}</span>
                              </button>
                              <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                                <MessageSquare className="h-4 w-4" />
                                <span>{post.comments}</span>
                              </button>
                              <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                                <Share2 className="h-4 w-4" />
                                <span>{post.shares}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-semibold mb-2">No posts yet</h3>
                      <p className="text-muted-foreground">
                        {isOwnProfile
                          ? "Share your first post to get started!"
                          : "This user hasn't posted anything yet."}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="products" className="space-y-4">
                {products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <Card
                        key={product.id}
                        className="group hover:shadow-lg transition-shadow"
                      >
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                          />
                          {product.isNew && (
                            <Badge className="absolute top-2 left-2 bg-green-500">
                              New
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2 line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold">
                              ${product.price}
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{product.rating}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Store className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-semibold mb-2">No products listed</h3>
                      <p className="text-muted-foreground">
                        {isOwnProfile
                          ? "List your first product to start selling!"
                          : "This user hasn't listed any products yet."}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="services" className="space-y-4">
                {services.length > 0 ? (
                  services.map((service) => (
                    <Card key={service.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Code className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2">
                              {service.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {service.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold">
                                ${service.price_range.min} - $
                                {service.price_range.max}
                              </span>
                              <Badge variant="secondary">
                                {service.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Code className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-semibold mb-2">
                        No services offered
                      </h3>
                      <p className="text-muted-foreground">
                        {isOwnProfile
                          ? "Offer your first service to start freelancing!"
                          : "This user doesn't offer any services yet."}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="activity">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <h3 className="font-semibold">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Heart className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="text-sm">
                            Liked a post about technology trends
                          </p>
                          <p className="text-xs text-muted-foreground">
                            2 hours ago
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Users className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm">
                            Started following @tech_innovator
                          </p>
                          <p className="text-xs text-muted-foreground">
                            5 hours ago
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Award className="h-5 w-5 text-purple-500" />
                        <div>
                          <p className="text-sm">
                            Earned a new achievement badge
                          </p>
                          <p className="text-xs text-muted-foreground">
                            1 day ago
                          </p>
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
      {showEditModal && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          profile={profileUser}
        />
      )}
    </div>
  );
};

export default EnhancedProfile;
