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
      "Just closed my first big crypto trade today! 🚀 The market has been incredible lately.",
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
      "Working on some exciting new features! 🚀 Check out this sneak peek.",
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
    content: "Beautiful sunset from my balcony today! 🌅",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
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

const EnhancedProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Form states for editing
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
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
        title: "Avatar uploaded",
        description: "Your profile picture has been updated.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again with a different image.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddBankAccount = async () => {
    if (!user?.id) return;

    try {
      const newAccount = await enhancedProfileService.addBankAccount(user.id, {
        ...bankForm,
        isDefault: profile?.bankAccounts.length === 0,
      });

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              bankAccounts: [...prev.bankAccounts, newAccount],
            }
          : null,
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
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    }
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

  const getKYCBadge = (level: number) => {
    const badges = {
      0: { text: "Unverified", color: "bg-gray-500", icon: "🔒" },
      1: { text: "Basic", color: "bg-blue-500", icon: "🆔" },
      2: { text: "Enhanced", color: "bg-green-500", icon: "✅" },
      3: { text: "Premium", color: "bg-purple-500", icon: "👑" },
    };
    return badges[level as keyof typeof badges] || badges[0];
  };

  const getReputation = (score: number) => {
    if (score >= 4.5)
      return { text: "Excellent", color: "text-green-600", stars: 5 };
    if (score >= 4.0)
      return { text: "Very Good", color: "text-blue-600", stars: 4 };
    if (score >= 3.5)
      return { text: "Good", color: "text-yellow-600", stars: 3 };
    if (score >= 3.0)
      return { text: "Average", color: "text-orange-600", stars: 2 };
    return { text: "Poor", color: "text-red-600", stars: 1 };
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

  const kycBadge = getKYCBadge(profile.kycLevel);
  const reputation = getReputation(profile.reputation);

  return (
    <div className="min-h-screen bg-background w-full max-w-full overflow-x-hidden">
      <div className="w-full max-w-5xl mx-auto">
        {/* Instagram/Facebook-Style Profile Header */}
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8">
            {/* Profile Picture */}
            <div className="flex justify-center sm:justify-start">
              <div className="relative flex-shrink-0">
                <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={editForm.avatar || profile.avatar}
                    alt={profile.displayName}
                  />
                  <AvatarFallback className="text-4xl">
                    {profile.displayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {/* Online status indicator */}
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                {/* Edit Avatar Button */}
                {isEditing && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                    onClick={() =>
                      document.getElementById("avatar-upload")?.click()
                    }
                    disabled={uploading}
                  >
                    <Camera className="h-4 w-4" />
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
                  {!isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Profile
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab("settings")}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm(profile);
                          setEditingSection(null);
                        }}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        {isLoading ? "Saving..." : "Save"}
                      </Button>
                    </>
                  )}
                  <Button variant="outline" size="icon" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Stats - Instagram Style */}
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

              {/* Enhanced Bio and Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold">{profile.displayName}</span>
                  <Badge className={`${kycBadge.color} text-white text-xs`}>
                    {kycBadge.icon} KYC {kycBadge.text}
                  </Badge>
                  <Badge className="bg-yellow-500 text-white text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    {profile.level}
                  </Badge>
                  <Badge
                    className={`text-xs ${reputation.color} bg-transparent border`}
                  >
                    <Star className="w-3 h-3 mr-1" />
                    {profile.reputation}/5.0
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

                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
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

              {/* Quick Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-muted-foreground">Trading:</span>
                  <span className="font-medium">{profile.reputation}/5.0</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-orange-500" />
                  <span className="text-muted-foreground">Achievements:</span>
                  <span className="font-medium">
                    {profile.achievements.length}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span className="text-muted-foreground">Security:</span>
                  <span className="font-medium">Level {profile.kycLevel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Story Highlights - Achievement Highlights */}
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

        {/* Enhanced Tabs with ALL Features */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile Tabs - Horizontal Scroll */}
          <div className="block sm:hidden w-full overflow-x-auto">
            <TabsList className="inline-flex w-max min-w-full justify-start border-none bg-transparent h-auto p-0">
              <TabsTrigger
                value="posts"
                className="flex items-center gap-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent rounded-none px-3 py-3 whitespace-nowrap"
              >
                <Grid3X3 className="w-4 h-4" />
                <span className="font-medium uppercase text-xs tracking-wider">
                  Posts
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="media"
                className="flex items-center gap-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent rounded-none px-3 py-3 whitespace-nowrap"
              >
                <Camera className="w-4 h-4" />
                <span className="font-medium uppercase text-xs tracking-wider">
                  Media
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="flex items-center gap-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent rounded-none px-3 py-3 whitespace-nowrap"
              >
                <Users className="w-4 h-4" />
                <span className="font-medium uppercase text-xs tracking-wider">
                  About
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="professional"
                className="flex items-center gap-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent rounded-none px-3 py-3 whitespace-nowrap"
              >
                <Briefcase className="w-4 h-4" />
                <span className="font-medium uppercase text-xs tracking-wider">
                  Work
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="financial"
                className="flex items-center gap-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent rounded-none px-3 py-3 whitespace-nowrap"
              >
                <CreditCard className="w-4 h-4" />
                <span className="font-medium uppercase text-xs tracking-wider">
                  Finance
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="flex items-center gap-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent rounded-none px-3 py-3 whitespace-nowrap"
              >
                <Shield className="w-4 h-4" />
                <span className="font-medium uppercase text-xs tracking-wider">
                  Security
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex items-center gap-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent rounded-none px-3 py-3 whitespace-nowrap"
              >
                <Settings className="w-4 h-4" />
                <span className="font-medium uppercase text-xs tracking-wider">
                  Settings
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Desktop Tabs - Full Width Grid */}
          <div className="hidden sm:block w-full">
            <TabsList className="w-full grid grid-cols-7 justify-center border-none bg-transparent h-auto p-0">
              <TabsTrigger
                value="posts"
                className="flex items-center justify-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent rounded-none px-2 lg:px-4 py-3"
              >
                <Grid3X3 className="w-4 h-4" />
                <span className="font-medium uppercase text-xs tracking-wider hidden md:inline">
                  Posts
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="media"
                className="flex items-center justify-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent rounded-none px-2 lg:px-4 py-3"
              >
                <Camera className="w-4 h-4" />
                <span className="font-medium uppercase text-xs tracking-wider hidden md:inline">
                  Media
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="flex items-center justify-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent rounded-none px-2 lg:px-4 py-3"
              >
                <Users className="w-4 h-4" />
                <span className="font-medium uppercase text-xs tracking-wider hidden md:inline">
                  About
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="professional"
                className="flex items-center justify-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent rounded-none px-2 lg:px-4 py-3"
              >
                <Briefcase className="w-4 h-4" />
                <span className="font-medium uppercase text-xs tracking-wider hidden md:inline">
                  Work
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="financial"
                className="flex items-center justify-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent rounded-none px-2 lg:px-4 py-3"
              >
                <CreditCard className="w-4 h-4" />
                <span className="font-medium uppercase text-xs tracking-wider hidden md:inline">
                  Finance
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="flex items-center justify-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent rounded-none px-2 lg:px-4 py-3"
              >
                <Shield className="w-4 h-4" />
                <span className="font-medium uppercase text-xs tracking-wider hidden md:inline">
                  Security
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex items-center justify-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent rounded-none px-2 lg:px-4 py-3"
              >
                <Settings className="w-4 h-4" />
                <span className="font-medium uppercase text-xs tracking-wider hidden md:inline">
                  Settings
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Posts Tab - Instagram Style Grid */}
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

          {/* Media Tab - Only Images and Videos */}
          <TabsContent value="media" className="mt-0">
            <div className="grid grid-cols-3 gap-1 md:gap-2">
              {mockPosts
                .filter(
                  (post) => post.type === "image" || post.type === "video",
                )
                .map((media) => (
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
                        {media.duration && (
                          <div className="absolute bottom-2 left-2 text-white text-xs font-medium">
                            {media.duration}
                          </div>
                        )}
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

            {mockPosts.filter(
              (post) => post.type === "image" || post.type === "video",
            ).length === 0 && (
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

          {/* About Tab - Personal Information */}
          <TabsContent value="about" className="mt-0">
            <div className="max-w-2xl mx-auto p-6 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Personal Information
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setEditingSection(
                            editingSection === "personal" ? null : "personal",
                          )
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editingSection === "personal" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={editForm.firstName || ""}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={editForm.lastName || ""}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              lastName: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={editForm.dateOfBirth || ""}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              dateOfBirth: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={editForm.phone || ""}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={editForm.bio || ""}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              bio: e.target.value,
                            }))
                          }
                          className="min-h-[100px]"
                        />
                      </div>
                    </div>
                  ) : (
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
                      <div className="md:col-span-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          Location
                        </Label>
                        {profile.address ? (
                          <p className="text-sm">
                            {profile.address.city}, {profile.address.state},{" "}
                            {profile.address.country}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No location provided
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Skills */}
              {profile.skills && profile.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Expertise</CardTitle>
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
                  <CardTitle>Achievements</CardTitle>
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
                      <div className="text-xs text-muted-foreground">
                        {achievement.progress}/{achievement.maxProgress}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Professional Tab */}
          <TabsContent value="professional" className="mt-0">
            <div className="max-w-2xl mx-auto p-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Professional Information
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setEditingSection(
                            editingSection === "professional"
                              ? null
                              : "professional",
                          )
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editingSection === "professional" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title</Label>
                        <Input
                          id="title"
                          value={editForm.title || ""}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={editForm.company || ""}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              company: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Input
                          id="industry"
                          value={editForm.industry || ""}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              industry: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">Experience</Label>
                        <Input
                          id="experience"
                          value={editForm.experience || ""}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              experience: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="education">Education</Label>
                        <Input
                          id="education"
                          value={editForm.education || ""}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              education: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={editForm.website || ""}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              website: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={editForm.linkedIn || ""}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              linkedIn: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  ) : (
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
                      {profile.industry && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">
                            Industry
                          </Label>
                          <p className="text-sm">{profile.industry}</p>
                        </div>
                      )}
                      {profile.experience && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">
                            Experience
                          </Label>
                          <p className="text-sm">{profile.experience}</p>
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
                  )}
                </CardContent>
              </Card>

              {/* Professional Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Professional Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profile.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {profile.website}
                      </a>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  )}
                  {profile.linkedIn && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-blue-600">💼</span>
                      <a
                        href={profile.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        LinkedIn Profile
                      </a>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  )}
                  {profile.github && (
                    <div className="flex items-center gap-2 text-sm">
                      <span>🐱</span>
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        GitHub Profile
                      </a>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  )}
                  {profile.portfolio && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <a
                        href={profile.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Portfolio
                      </a>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="mt-0">
            <div className="max-w-2xl mx-auto p-6 space-y-6">
              {/* Bank Accounts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Bank Accounts
                    </div>
                    <Button onClick={() => setShowAddBank(true)} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Account
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.bankAccounts.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No bank accounts added yet
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setShowAddBank(true)}
                        className="mt-4"
                      >
                        Add Your First Account
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {profile.bankAccounts.map((account) => (
                        <div key={account.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-full">
                                <Building className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {account.bankName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  ****{account.accountNumber.slice(-4)} •{" "}
                                  {account.currency}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {account.isDefault && (
                                <Badge variant="secondary">Default</Badge>
                              )}
                              {account.isVerified ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Clock className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Add Bank Account Form */}
              {showAddBank && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Add Bank Account
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowAddBank(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                          id="bankName"
                          value={bankForm.bankName}
                          onChange={(e) =>
                            setBankForm((prev) => ({
                              ...prev,
                              bankName: e.target.value,
                            }))
                          }
                          placeholder="Chase Bank"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountName">Account Holder Name</Label>
                        <Input
                          id="accountName"
                          value={bankForm.accountName}
                          onChange={(e) =>
                            setBankForm((prev) => ({
                              ...prev,
                              accountName: e.target.value,
                            }))
                          }
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          value={bankForm.accountNumber}
                          onChange={(e) =>
                            setBankForm((prev) => ({
                              ...prev,
                              accountNumber: e.target.value,
                            }))
                          }
                          placeholder="1234567890"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="routingNumber">Routing Number</Label>
                        <Input
                          id="routingNumber"
                          value={bankForm.routingNumber}
                          onChange={(e) =>
                            setBankForm((prev) => ({
                              ...prev,
                              routingNumber: e.target.value,
                            }))
                          }
                          placeholder="021000021"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select
                          value={bankForm.currency}
                          onValueChange={(value) =>
                            setBankForm((prev) => ({
                              ...prev,
                              currency: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {enhancedProfileService
                              .getSupportedCurrencies()
                              .map((currency) => (
                                <SelectItem
                                  key={currency.code}
                                  value={currency.code}
                                >
                                  {currency.code} - {currency.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={bankForm.country}
                          onChange={(e) =>
                            setBankForm((prev) => ({
                              ...prev,
                              country: e.target.value,
                            }))
                          }
                          placeholder="United States"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowAddBank(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddBankAccount} className="flex-1">
                        Add Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Currency Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Currency Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="preferredCurrency">
                        Preferred Currency
                      </Label>
                      <Select
                        value={profile.preferredCurrency}
                        onValueChange={(value) => {
                          setProfile((prev) =>
                            prev ? { ...prev, preferredCurrency: value } : null,
                          );
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {enhancedProfileService
                            .getSupportedCurrencies()
                            .map((currency) => (
                              <SelectItem
                                key={currency.code}
                                value={currency.code}
                              >
                                {currency.symbol} {currency.code} -{" "}
                                {currency.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="mt-0">
            <div className="max-w-2xl mx-auto p-6 space-y-6">
              {/* KYC Verification */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Verification Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-6">
                    <div className="text-4xl mb-4">{kycBadge.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">
                      KYC Level {profile.kycLevel}
                    </h3>
                    <Badge className={`${kycBadge.color} text-white mb-4`}>
                      {kycBadge.text}
                    </Badge>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(profile.kycLevel / 3) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {profile.kycLevel === 0 &&
                        "Complete verification to unlock trading features"}
                      {profile.kycLevel === 1 &&
                        "Basic verification complete - upgrade for higher limits"}
                      {profile.kycLevel === 2 &&
                        "Enhanced verification complete - excellent security"}
                      {profile.kycLevel === 3 &&
                        "Premium verification - maximum security and features"}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email Verified</span>
                      {profile.emailVerified ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Phone Verified</span>
                      {profile.phoneVerified ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Two-Factor Authentication</span>
                      {profile.twoFactorEnabled ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
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

              {/* Recent Security Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Security Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {securityLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {log.success ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                          )}
                          <div>
                            <p className="font-medium text-sm">{log.action}</p>
                            <p className="text-xs text-muted-foreground">
                              {log.location} • {log.device}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(log.timestamp))} ago
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {log.ipAddress}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-0">
            <div className="max-w-2xl mx-auto p-6 space-y-6">
              {/* Privacy Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Privacy Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">
                          Profile Visibility
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Who can see your profile
                        </p>
                      </div>
                      <Select
                        value={profile.profileVisibility}
                        onValueChange={(value) => {
                          setProfile((prev) =>
                            prev
                              ? { ...prev, profileVisibility: value as any }
                              : null,
                          );
                        }}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="followers">Followers</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Show Email</Label>
                        <p className="text-sm text-muted-foreground">
                          Display email on profile
                        </p>
                      </div>
                      <Switch
                        checked={profile.showEmail}
                        onCheckedChange={(checked) => {
                          setProfile((prev) =>
                            prev ? { ...prev, showEmail: checked } : null,
                          );
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Show Phone</Label>
                        <p className="text-sm text-muted-foreground">
                          Display phone number on profile
                        </p>
                      </div>
                      <Switch
                        checked={profile.showPhone}
                        onCheckedChange={(checked) => {
                          setProfile((prev) =>
                            prev ? { ...prev, showPhone: checked } : null,
                          );
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Show Location</Label>
                        <p className="text-sm text-muted-foreground">
                          Display location on profile
                        </p>
                      </div>
                      <Switch
                        checked={profile.showLocation}
                        onCheckedChange={(checked) => {
                          setProfile((prev) =>
                            prev ? { ...prev, showLocation: checked } : null,
                          );
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">
                          Allow Direct Messages
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Let others send you messages
                        </p>
                      </div>
                      <Switch
                        checked={profile.allowDirectMessages}
                        onCheckedChange={(checked) => {
                          setProfile((prev) =>
                            prev
                              ? { ...prev, allowDirectMessages: checked }
                              : null,
                          );
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Account Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={async () => {
                        try {
                          const blob =
                            await enhancedProfileService.exportUserData(
                              profile.id,
                            );
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = "user-data.json";
                          a.click();
                          URL.revokeObjectURL(url);

                          toast({
                            title: "Data exported",
                            description:
                              "Your data has been downloaded successfully.",
                          });
                        } catch (error) {
                          toast({
                            title: "Export failed",
                            description: "Please try again later.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export My Data
                    </Button>

                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => {
                        // Handle account deletion
                        const confirmation = prompt(
                          'Type "DELETE" to confirm account deletion:',
                        );
                        if (confirmation === "DELETE") {
                          toast({
                            title: "Account deletion initiated",
                            description:
                              "Your account will be deleted within 24 hours.",
                          });
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
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
