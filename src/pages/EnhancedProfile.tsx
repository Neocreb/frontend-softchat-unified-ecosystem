import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedProfileHeader from "@/components/profile/EnhancedProfileHeader";
import EnhancedProfileContent from "@/components/profile/EnhancedProfileContent";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import {
  ArrowLeft,
  Settings,
  Shield,
  Flag,
  MoreHorizontal,
  Copy,
  ExternalLink,
  MessageCircle,
  Star,
  Award,
  TrendingUp,
  Users,
  Eye,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserProfile, ExtendedUser, MockUser } from "@/types/user";
import { Product } from "@/types/marketplace";
import { profileService } from "@/services/profileService";

interface EnhancedProfileProps {
  username?: string; // Optional username parameter for viewing other profiles
}

const EnhancedProfile: React.FC<EnhancedProfileProps> = ({
  username: propUsername,
}) => {
  const { username: paramUsername } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Determine which username to use (prop takes precedence, then param)
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
  const [activeSection, setActiveSection] = useState("profile");

  // Determine if this is the current user's own profile
  const isOwnProfile =
    !targetUsername || (user && user.profile?.username === targetUsername);

  // Load profile data
  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);

      try {
        let profile: UserProfile | null = null;

        if (isOwnProfile && user?.profile) {
          // Use current user's profile
          profile = user.profile;
        } else if (targetUsername) {
          // Fetch profile by username
          profile = await profileService.getUserByUsername(targetUsername);

          if (!profile) {
            // Generate mock user for demonstration
            console.log(`Generating mock user for username: ${targetUsername}`);
            const mockUser = profileService.generateMockUser(targetUsername);
            profile = mockUser.profile!;

            // Set mock data
            setPosts(mockUser.mock_data.posts);
            setProducts(mockUser.mock_data.products);
            setServices(mockUser.mock_data.services);
          }
        }

        if (profile) {
          setProfileUser(profile);

          // Load follower/following counts
          if (profile.id) {
            const [followers, following] = await Promise.all([
              profileService.getFollowersCount(profile.id),
              profileService.getFollowingCount(profile.id),
            ]);

            setFollowerCount(followers);
            setFollowingCount(following);

            // Check if current user is following this profile
            if (user && user.id && !isOwnProfile) {
              const following = await profileService.isFollowing(
                user.id,
                profile.id,
              );
              setIsFollowing(following);
            }

            // Load content if not already loaded (for real users)
            if (!posts.length) {
              try {
                const [userPosts, userProducts, userServices] =
                  await Promise.all([
                    profileService.getUserPosts(profile.id),
                    profileService.getUserProducts(profile.id),
                    profileService.getUserServices(profile.id),
                  ]);

                // Handle posts
                if (userPosts && userPosts.length > 0) {
                  setPosts(formatPosts(userPosts));
                } else {
                  setPosts(generateMockPosts());
                }

                // Handle products
                if (userProducts && userProducts.length > 0) {
                  setProducts(formatProducts(userProducts));
                } else if (profile.marketplace_profile) {
                  setProducts(generateMockProducts());
                }

                // Handle services
                if (userServices && userServices.length > 0) {
                  setServices(formatServices(userServices));
                } else if (profile.freelance_profile) {
                  setServices(generateMockServices());
                }
              } catch (error: any) {
                console.warn(
                  "Error loading user content:",
                  error?.message || error,
                );
                // Set mock data on error
                setPosts(generateMockPosts());
                if (profile.marketplace_profile) {
                  setProducts(generateMockProducts());
                }
                if (profile.freelance_profile) {
                  setServices(generateMockServices());
                }
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
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast({
        title: "Error",
        description: "Failed to update follow status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMessage = () => {
    if (!profileUser) return;

    // Navigate to chat with this user
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
    } catch (error) {
      toast({
        title: "Share profile",
        description: `Share this profile: ${profileUrl}`,
      });
    }
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleAddToCart = (productId: string) => {
    toast({
      title: "Added to cart",
      description: "Product has been added to your cart.",
    });
  };

  const handleAddToWishlist = (productId: string) => {
    toast({
      title: "Added to wishlist",
      description: "Product has been added to your wishlist.",
    });
  };

  const handleContactSeller = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product && profileUser) {
      navigate(`/chat?user=${profileUser.username}&product=${productId}`);
    }
  };

  // Helper functions
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

    const postTemplates = [
      "Just completed another successful project! Really excited about the results 🚀",
      "Working on something amazing. Can't wait to share it with everyone! ✨",
      "Great day at the office! Love what I do 💼",
      "Learning new technologies is always exciting. #TechLife",
      "Beautiful sunset today! Nature never fails to inspire 🌅",
    ];

    return Array.from({ length: 3 }, (_, i) => ({
      id: `mock-${i + 1}`,
      content: postTemplates[i % postTemplates.length],
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

    const productTemplates = [
      {
        name: "Premium Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation",
        price: 199.99,
        category: "Electronics",
        image: "https://source.unsplash.com/400x400/?headphones",
      },
      {
        name: "Smart Fitness Tracker",
        description: "Advanced fitness tracker with heart rate monitoring",
        price: 149.99,
        category: "Electronics",
        image: "https://source.unsplash.com/400x400/?fitness,tracker",
      },
      {
        name: "Organic Coffee Beans",
        description: "Premium organic coffee beans from Colombia",
        price: 24.99,
        category: "Food & Beverages",
        image: "https://source.unsplash.com/400x400/?coffee,beans",
      },
    ];

    return productTemplates.map((template, i) => ({
      id: `mock-product-${i + 1}`,
      ...template,
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
      {
        id: "mock-service-2",
        title: "UI/UX Design Consultation",
        description:
          "Professional UI/UX design and user experience optimization",
        category: "Design",
        price_range: { min: 200, max: 1500 },
        delivery_time: 7,
        featured: false,
      },
    ];
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header Skeleton */}
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

        {/* Content Skeleton */}
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
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
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
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Profile Header */}
      <EnhancedProfileHeader
        profile={profileUser}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        followerCount={followerCount}
        followingCount={followingCount}
        onFollow={handleFollow}
        onMessage={handleMessage}
        onEdit={handleEdit}
        onShare={handleShare}
      />

      {/* Profile Content */}
      <div className="px-4 md:px-6 py-6">
        <EnhancedProfileContent
          profile={profileUser}
          isOwnProfile={isOwnProfile}
          posts={posts}
          products={products}
          services={services}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          onContactSeller={handleContactSeller}
        />
      </div>

      {/* Quick Stats Footer (Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4">
        <div className="grid grid-cols-4 gap-4 text-center text-sm">
          <div>
            <div className="font-bold">{profileUser.posts_count || 0}</div>
            <div className="text-muted-foreground">Posts</div>
          </div>
          <div>
            <div className="font-bold">{followerCount}</div>
            <div className="text-muted-foreground">Followers</div>
          </div>
          <div>
            <div className="font-bold">{followingCount}</div>
            <div className="text-muted-foreground">Following</div>
          </div>
          <div>
            <div className="font-bold flex items-center justify-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {profileUser.reputation || 0}
            </div>
            <div className="text-muted-foreground">Rating</div>
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
