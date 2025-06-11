import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  MessageSquare,
  UserPlus,
  MoreHorizontal,
  Grid3X3,
  Camera,
  Heart,
  Share2,
  Bookmark,
  Play,
  Users,
  MapPin,
  Calendar,
  Link,
  Globe,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Shield,
  Verified,
  Edit,
  X,
  Plus,
  Eye,
  Lock,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Image,
  Video,
  Award,
  Star,
  TrendingUp,
} from "lucide-react";
import {
  enhancedProfileService,
  UserProfile,
} from "@/services/enhancedProfileService";
import KYCVerificationModal from "@/components/kyc/KYCVerificationModal";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

// Mock posts data
const mockPosts = [
  {
    id: "1",
    type: "image",
    content:
      "Beautiful sunset from my balcony today! 🌅 Sometimes you need to step away from the screen and enjoy the simple things in life.",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    timestamp: "2 hours ago",
    likes: 234,
    comments: 45,
    isLiked: false,
  },
  {
    id: "2",
    type: "video",
    content:
      "Working on some exciting new features! 🚀 Check out this sneak peek of what's coming to the platform.",
    imageUrl:
      "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=400&fit=crop",
    videoUrl:
      "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
    duration: "0:45",
    timestamp: "1 day ago",
    likes: 567,
    comments: 89,
    isLiked: true,
  },
  {
    id: "3",
    type: "image",
    content:
      "Just shipped a new feature! Really excited about the possibilities 🔥",
    imageUrl:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop",
    timestamp: "3 days ago",
    likes: 123,
    comments: 23,
    isLiked: false,
  },
  {
    id: "4",
    type: "image",
    content: "Coffee and code - the perfect combination ☕️",
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=400&fit=crop",
    timestamp: "1 week ago",
    likes: 89,
    comments: 12,
    isLiked: false,
  },
  {
    id: "5",
    type: "image",
    content: "Team building day! Great to meet everyone in person 👥",
    imageUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop",
    timestamp: "2 weeks ago",
    likes: 456,
    comments: 67,
    isLiked: true,
  },
  {
    id: "6",
    type: "image",
    content: "New workspace setup! Loving the productivity boost 💻",
    imageUrl:
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop",
    timestamp: "3 weeks ago",
    likes: 234,
    comments: 34,
    isLiked: false,
  },
];

// Mock media (all images and videos)
const mockMedia = mockPosts.filter(
  (post) => post.type === "image" || post.type === "video",
);

const EnhancedProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  const loadProfile = async () => {
    if (!user?.id) return;

    try {
      const profileData = await enhancedProfileService.getProfile(user.id);
      setProfile(profileData);
      setEditForm(profileData);
    } catch (error) {
      toast({
        title: "Failed to load profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing
        ? "You are no longer following this user"
        : "You are now following this user",
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200"></div>
          <div className="max-w-4xl mx-auto p-6">
            <div className="flex gap-6 mb-6">
              <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="flex gap-4">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const getKYCBadge = (level: number) => {
    const badges = {
      0: { text: "Unverified", color: "bg-gray-500", icon: "🔒" },
      1: { text: "Basic", color: "bg-blue-500", icon: "🆔" },
      2: { text: "Enhanced", color: "bg-green-500", icon: "✅" },
      3: { text: "Premium", color: "bg-purple-500", icon: "👑" },
    };
    return badges[level as keyof typeof badges] || badges[0];
  };

  const kycBadge = getKYCBadge(profile.kycLevel);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Profile Picture */}
            <div className="flex justify-center md:justify-start">
              <div className="relative">
                <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-white shadow-lg">
                  <AvatarImage src={profile.avatar} alt={profile.displayName} />
                  <AvatarFallback className="text-4xl">
                    {profile.displayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {/* Online status indicator */}
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              {/* Username and Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-light">{profile.username}</h1>
                  {profile.isVerified && (
                    <Verified className="w-5 h-5 text-blue-500 fill-current" />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEditProfile(true)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{profile.posts}</span>
                  <span className="text-muted-foreground">posts</span>
                </div>
                <button className="flex items-center gap-1 hover:text-muted-foreground transition-colors">
                  <span className="font-semibold">
                    {formatNumber(profile.followers)}
                  </span>
                  <span className="text-muted-foreground">followers</span>
                </button>
                <button className="flex items-center gap-1 hover:text-muted-foreground transition-colors">
                  <span className="font-semibold">
                    {formatNumber(profile.following)}
                  </span>
                  <span className="text-muted-foreground">following</span>
                </button>
              </div>

              {/* Bio and Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{profile.displayName}</span>
                  <Badge className={`${kycBadge.color} text-white text-xs`}>
                    {kycBadge.icon} {kycBadge.text}
                  </Badge>
                  <Badge className="bg-yellow-500 text-white text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    {profile.level}
                  </Badge>
                </div>

                {profile.title && (
                  <p className="text-muted-foreground">{profile.title}</p>
                )}

                {profile.bio && (
                  <p className="whitespace-pre-line text-sm leading-relaxed">
                    {profile.bio}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {profile.company && (
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{profile.company}</span>
                    </div>
                  )}
                  {profile.address && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {profile.address.city}, {profile.address.country}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Joined {formatDistanceToNow(new Date(profile.joinedDate))}{" "}
                      ago
                    </span>
                  </div>
                </div>

                {profile.website && (
                  <div className="flex items-center gap-1 text-sm">
                    <Link className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {profile.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Highlights */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-muted-foreground">Reputation:</span>
                  <span className="font-medium">{profile.reputation}/5.0</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Award className="w-4 h-4 text-orange-500" />
                  <span className="text-muted-foreground">Achievements:</span>
                  <span className="font-medium">
                    {profile.achievements.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Story Highlights */}
        <div className="px-6 md:px-8 pb-6">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <div className="flex flex-col items-center gap-1 min-w-0">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                <Plus className="w-6 h-6 text-gray-400" />
              </div>
              <span className="text-xs text-muted-foreground">New</span>
            </div>
            {profile.achievements.slice(0, 6).map((achievement, index) => (
              <div
                key={achievement.id}
                className="flex flex-col items-center gap-1 min-w-0"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0.5 cursor-pointer">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <span className="text-xl">{achievement.icon}</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground truncate max-w-[64px]">
                  {achievement.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-center border-none bg-transparent h-auto p-0">
            <TabsTrigger
              value="posts"
              className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent rounded-none px-6 py-3"
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="font-medium uppercase text-xs tracking-wider">
                Posts
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="media"
              className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent rounded-none px-6 py-3"
            >
              <Camera className="w-4 h-4" />
              <span className="font-medium uppercase text-xs tracking-wider">
                Media
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent rounded-none px-6 py-3"
            >
              <Users className="w-4 h-4" />
              <span className="font-medium uppercase text-xs tracking-wider">
                About
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="mt-0">
            <div className="grid grid-cols-3 gap-1 md:gap-2">
              {mockPosts.map((post) => (
                <div
                  key={post.id}
                  className="relative aspect-square group cursor-pointer"
                >
                  <img
                    src={post.imageUrl}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                  {post.type === "video" && (
                    <div className="absolute top-2 right-2">
                      <Video className="w-4 h-4 text-white" fill="white" />
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex items-center gap-4 text-white">
                      <div className="flex items-center gap-1">
                        <Heart className="w-5 h-5" fill="white" />
                        <span className="font-semibold">
                          {formatNumber(post.likes)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-5 h-5" fill="white" />
                        <span className="font-semibold">
                          {formatNumber(post.comments)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {mockPosts.length === 0 && (
              <div className="text-center py-12">
                <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Posts Yet</h3>
                <p className="text-muted-foreground">
                  When you share photos and videos, they'll appear on your
                  profile.
                </p>
                <Button className="mt-4">Share your first post</Button>
              </div>
            )}
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="mt-0">
            <div className="grid grid-cols-3 gap-1 md:gap-2">
              {mockMedia.map((media) => (
                <div
                  key={media.id}
                  className="relative aspect-square group cursor-pointer"
                >
                  <img
                    src={media.imageUrl}
                    alt="Media"
                    className="w-full h-full object-cover"
                  />
                  {media.type === "video" && (
                    <>
                      <div className="absolute top-2 right-2">
                        <Video className="w-4 h-4 text-white" fill="white" />
                      </div>
                      <div className="absolute bottom-2 left-2 text-white text-xs font-medium">
                        {media.duration}
                      </div>
                    </>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex items-center gap-4 text-white">
                      <div className="flex items-center gap-1">
                        <Heart className="w-5 h-5" fill="white" />
                        <span className="font-semibold">
                          {formatNumber(media.likes)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-5 h-5" fill="white" />
                        <span className="font-semibold">
                          {formatNumber(media.comments)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {mockMedia.length === 0 && (
              <div className="text-center py-12">
                <Image className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  No Photos or Videos
                </h3>
                <p className="text-muted-foreground">
                  When you share photos and videos, they'll appear here.
                </p>
              </div>
            )}
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="mt-0">
            <div className="max-w-2xl mx-auto p-6 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Full Name
                      </Label>
                      <p className="text-sm">
                        {profile.firstName} {profile.lastName}
                      </p>
                    </div>
                    {profile.dateOfBirth && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Date of Birth
                        </Label>
                        <p className="text-sm">
                          {new Date(profile.dateOfBirth).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Email
                      </Label>
                      <div className="flex items-center gap-2">
                        <p className="text-sm">{profile.email}</p>
                        {profile.emailVerified && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </div>
                    {profile.phone && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Phone
                        </Label>
                        <div className="flex items-center gap-2">
                          <p className="text-sm">{profile.phone}</p>
                          {profile.phoneVerified && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              {(profile.title || profile.company || profile.education) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Professional</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile.title && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">
                            Job Title
                          </Label>
                          <p className="text-sm">{profile.title}</p>
                        </div>
                      )}
                      {profile.company && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">
                            Company
                          </Label>
                          <p className="text-sm">{profile.company}</p>
                        </div>
                      )}
                      {profile.education && (
                        <div className="md:col-span-2">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Education
                          </Label>
                          <p className="text-sm">{profile.education}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Skills */}
              {profile.skills && profile.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Skills & Expertise
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profile.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
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
                          Unlocked{" "}
                          {formatDistanceToNow(
                            new Date(achievement.unlockedAt),
                          )}{" "}
                          ago
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* KYC Verification */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Verification Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      KYC Level {profile.kycLevel}
                    </span>
                    <Badge className={kycBadge.color}>{kycBadge.text}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Email Verified</span>
                      {profile.emailVerified ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <X className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Phone Verified</span>
                      {profile.phoneVerified ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <X className="w-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Two-Factor Authentication</span>
                      {profile.twoFactorEnabled ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <X className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>

                  <KYCVerificationModal
                    userId={profile.id}
                    currentLevel={profile.kycLevel}
                    onLevelUpdate={(newLevel) => {
                      setProfile((prev) =>
                        prev
                          ? { ...prev, kycLevel: newLevel as 0 | 1 | 2 | 3 }
                          : null,
                      );
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedProfile;
