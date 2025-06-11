import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
  Calendar,
  MapPin,
  Link,
  Users,
  Heart,
  MessageSquare,
  Star,
  TrendingUp,
  Award,
  Camera,
  Globe,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Gift,
  Shield,
  Verified,
  Edit,
  Save,
  X,
  Plus,
  Eye,
  EyeOff,
  Lock,
  CreditCard,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Copy,
  Upload,
  Building,
  DollarSign,
  Clock,
  Globe2,
  Smartphone,
  Bell,
  Database,
  UserCheck,
  Zap,
  Grid3X3,
  Image,
  Video,
  Play,
  MoreHorizontal,
  Share2,
  Bookmark,
  Key,
  History,
  FileDown,
  UserPlus,
  MessageCircle,
} from "lucide-react";
import {
  enhancedProfileService,
  UserProfile,
  BankAccount,
  SecurityLog,
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
      "Just closed my first big crypto trade today! 🚀 The market has been incredible lately. Feeling grateful for all the opportunities in this space!",
    imageUrl:
      "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400&h=400&fit=crop",
    timestamp: "2 hours ago",
    likes: 234,
    comments: 45,
    isLiked: false,
  },
  {
    id: "2",
    type: "video",
    content:
      "Working on some exciting new features! 🚀 Check out this sneak peek of what's coming next.",
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
      "Beautiful sunset from my balcony today! 🌅 Sometimes you need to stop and appreciate the simple things.",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    timestamp: "3 days ago",
    likes: 123,
    comments: 23,
    isLiked: false,
  },
];

const EnhancedProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isEditingCover, setIsEditingCover] = useState(false);

  // Form states for editing
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [uploading, setUploading] = useState(false);

  // Bank account states
  const [showAddBank, setShowAddBank] = useState(false);
  const [bankForm, setBankForm] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    routingNumber: "",
    currency: "USD",
    country: "United States",
  });

  useEffect(() => {
    loadProfile();
    loadSecurityLogs();
  }, [user?.id]);

  const loadProfile = async () => {
    if (!user?.id) return;

    try {
      const profileData = await enhancedProfileService.getProfile(user.id);
      setProfile(profileData);
      setEditForm(profileData);
    } catch (error) {
      console.error("Failed to load profile:", error);
      toast({
        title: "Failed to load profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadSecurityLogs = async () => {
    if (!user?.id) return;

    try {
      const logs = await enhancedProfileService.getSecurityLogs(user.id);
      setSecurityLogs(logs);
    } catch (error) {
      console.error("Failed to load security logs:", error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.id || !profile) return;

    setIsLoading(true);
    try {
      const updatedProfile = await enhancedProfileService.updateProfile(
        user.id,
        editForm,
      );
      setProfile(updatedProfile);
      setIsEditing(false);
      setEditingSection(null);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to update profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user?.id) return;

    setUploading(true);
    try {
      const avatarUrl = await enhancedProfileService.uploadAvatar(
        user.id,
        file,
      );

      setEditForm((prev) => ({ ...prev, avatar: avatarUrl }));

      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated.",
      });
    } catch (error) {
      toast({
        title: "Failed to upload avatar",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCoverPhotoUpload = () => {
    toast({
      title: "Cover Photo Updated",
      description: "Your cover photo has been updated successfully.",
    });
    setIsEditingCover(false);
  };

  const handleFollowUser = () => {
    toast({
      title: "Following",
      description: "You are now following this user.",
    });
  };

  const handleMessageUser = () => {
    toast({
      title: "Message Sent",
      description: "Opening chat conversation...",
    });
  };

  const handleAddBankAccount = async () => {
    if (!user?.id || !profile) return;

    try {
      const newAccount = await enhancedProfileService.addBankAccount(user.id, {
        ...bankForm,
        isDefault: profile.bankAccounts.length === 0,
      });

      setProfile((prev) =>
        prev
          ? { ...prev, bankAccounts: [...prev.bankAccounts, newAccount] }
          : prev,
      );

      setBankForm({
        accountName: "",
        accountNumber: "",
        bankName: "",
        routingNumber: "",
        currency: "USD",
        country: "United States",
      });
      setShowAddBank(false);

      toast({
        title: "Bank account added",
        description: "Your bank account has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to add bank account",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Helper functions
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getKYCBadge = (level: number) => {
    switch (level) {
      case 0:
        return { label: "Unverified", color: "text-red-600" };
      case 1:
        return { label: "Basic", color: "text-yellow-600" };
      case 2:
        return { label: "Verified", color: "text-blue-600" };
      case 3:
        return { label: "Premium", color: "text-green-600" };
      default:
        return { label: "Unknown", color: "text-gray-600" };
    }
  };

  const getReputation = (score: number) => {
    if (score >= 4.5) return { label: "Excellent", color: "text-green-600" };
    if (score >= 4.0) return { label: "Good", color: "text-blue-600" };
    if (score >= 3.0) return { label: "Average", color: "text-yellow-600" };
    return { label: "Poor", color: "text-red-600" };
  };

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const kycBadge = getKYCBadge(profile.kycLevel);
  const reputation = getReputation(profile.reputation);

  return (
    <div className="min-h-screen bg-background mobile-container">
      <div className="w-full max-w-6xl mx-auto">
        {/* Facebook-Style Cover Photo Section */}
        <div className="relative">
          {/* Cover Photo */}
          <div className="relative h-48 sm:h-56 md:h-72 lg:h-80 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 overflow-hidden rounded-b-lg">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${profile.coverPhoto || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80"})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

            {/* Cover Photo Actions */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-2">
              {isEditing && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/90 text-black hover:bg-white"
                  onClick={() => setIsEditingCover(true)}
                  disabled={uploading}
                >
                  <Camera className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Edit Cover</span>
                </Button>
              )}
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 text-black hover:bg-white"
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
                        <Image className="h-4 w-4 mr-2" />
                        Choose from Gallery
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCoverPhotoUpload}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
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
          <div className="px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="relative">
              {/* Profile Avatar - Positioned over cover photo */}
              <div className="relative -mt-12 sm:-mt-16 md:-mt-20 mb-4">
                <div className="relative inline-block">
                  <Avatar className="w-24 h-24 sm:w-28 sm:w-28 md:w-32 md:h-32 lg:w-36 lg:h-36 border-4 border-white shadow-xl">
                    <AvatarImage
                      src={editForm.avatar || profile.avatar}
                      alt={profile.displayName}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-xl sm:text-2xl font-bold">
                      {profile.displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  {/* Online status indicator */}
                  <div className="absolute bottom-2 right-2 h-4 w-4 sm:h-5 sm:w-5 bg-green-500 border-2 border-white rounded-full"></div>

                  {/* Edit Avatar Button */}
                  {isEditing && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-0 right-0 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white shadow-md hover:bg-gray-50"
                      onClick={() =>
                        document.getElementById("avatar-upload")?.click()
                      }
                      disabled={uploading}
                    >
                      <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  )}
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAvatarUpload(file);
                    }}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Enhanced Profile Info */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                        {profile.displayName}
                      </h1>
                      {profile.isVerified && (
                        <Verified className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 fill-current" />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base">
                      @{profile.username}
                    </p>
                    {profile.title && (
                      <p className="text-gray-700 font-medium text-sm sm:text-base">
                        {profile.title}
                      </p>
                    )}
                  </div>

                  {/* Enhanced Stats */}
                  <div className="flex items-center gap-4 sm:gap-6 text-sm sm:text-base">
                    <div className="text-center">
                      <div className="font-bold text-lg">{profile.posts}</div>
                      <div className="text-gray-600 text-xs sm:text-sm">
                        Posts
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">
                        {formatNumber(profile.followers)}
                      </div>
                      <div className="text-gray-600 text-xs sm:text-sm">
                        Followers
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">
                        {formatNumber(profile.following)}
                      </div>
                      <div className="text-gray-600 text-xs sm:text-sm">
                        Following
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {profile.reputation}
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
                      Level {profile.level}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        "border-green-400 text-green-600",
                        kycBadge.color,
                      )}
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      {kycBadge.label}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-green-400 text-green-600"
                    >
                      <div className="h-2 w-2 bg-green-500 rounded-full mr-1"></div>
                      Online
                    </Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 sm:gap-3">
                  {!isEditing ? (
                    <>
                      <Button
                        className="flex-1 sm:flex-none"
                        onClick={handleFollowUser}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Follow
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 sm:flex-none"
                        onClick={handleMessageUser}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="flex-1 sm:flex-none"
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm(profile);
                          setEditingSection(null);
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                        className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </>
                  )}
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1 space-y-4 order-2 lg:order-1">
              {/* Bio and Info Card */}
              <Card>
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">About</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                      {profile.bio ||
                        "Software Developer | Tech Enthusiast\nBuilding amazing experiences with code 🚀"}
                    </p>
                  </div>

                  <div className="space-y-3 text-sm">
                    {profile.address && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>
                          {profile.address.city}, {profile.address.country}
                        </span>
                      </div>
                    )}

                    {profile.company && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Briefcase className="w-4 h-4 flex-shrink-0" />
                        <span>{profile.company}</span>
                      </div>
                    )}

                    {profile.education && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <GraduationCap className="w-4 h-4 flex-shrink-0" />
                        <span>{profile.education}</span>
                      </div>
                    )}

                    {profile.website && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Globe className="w-4 h-4 flex-shrink-0" />
                        <a
                          href={profile.website}
                          className="text-blue-500 hover:underline break-all"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {profile.website}
                        </a>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>
                        Joined{" "}
                        {formatDistanceToNow(new Date(profile.joinedDate))} ago
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Achievements Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profile.achievements
                    .slice(0, 6)
                    .map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                      >
                        <div className="text-2xl">🏆</div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {achievement.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {achievement.description}
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-4 md:space-y-6"
              >
                <div className="mobile-tabs">
                  <TabsList className="grid w-full grid-cols-4">
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
                      value="settings"
                      className="mobile-tab touch-target"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Settings</span>
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
                              src={profile.avatar}
                              alt={profile.displayName}
                            />
                            <AvatarFallback>
                              {profile.displayName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className="font-semibold">
                                {profile.displayName}
                              </span>
                              {profile.isVerified && (
                                <Verified
                                  className="h-4 w-4 text-blue-500 flex-shrink-0"
                                  fill="currentColor"
                                />
                              )}
                              <span className="text-muted-foreground text-sm break-all">
                                @{profile.username}
                              </span>
                              <span className="text-muted-foreground text-sm">
                                •
                              </span>
                              <span className="text-muted-foreground text-sm">
                                {post.timestamp}
                              </span>
                            </div>
                            <p className="text-sm mb-3 whitespace-pre-line leading-relaxed">
                              {post.content}
                            </p>
                            {post.imageUrl && (
                              <div className="mb-4">
                                <img
                                  src={post.imageUrl}
                                  alt="Post content"
                                  className="rounded-lg max-w-full h-auto border"
                                />
                              </div>
                            )}
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <button className="flex items-center gap-1 hover:text-red-500 transition-colors touch-target">
                                <Heart
                                  className={cn(
                                    "h-4 w-4",
                                    post.isLiked && "fill-red-500 text-red-500",
                                  )}
                                />
                                <span>{post.likes}</span>
                              </button>
                              <button className="flex items-center gap-1 hover:text-blue-500 transition-colors touch-target">
                                <MessageSquare className="h-4 w-4" />
                                <span>{post.comments}</span>
                              </button>
                              <button className="flex items-center gap-1 hover:text-green-500 transition-colors touch-target">
                                <Share2 className="h-4 w-4" />
                                Share
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
                    {mockPosts
                      .filter((post) => post.imageUrl)
                      .map((post) => (
                        <div
                          key={post.id}
                          className="aspect-square rounded-lg overflow-hidden bg-muted hover:scale-105 transition-transform cursor-pointer"
                        >
                          <img
                            src={post.imageUrl}
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
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {isEditing && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input
                              id="displayName"
                              value={editForm.displayName || ""}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  displayName: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                              id="bio"
                              value={editForm.bio || ""}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  bio: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="title">Job Title</Label>
                            <Input
                              id="title"
                              value={editForm.title || ""}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  title: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-muted-foreground">
                            Receive email updates about your account
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">
                            Two-Factor Authentication
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedProfile;
