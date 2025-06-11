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

const EnhancedProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  const handleBannerUpload = async (file: File) => {
    if (!user?.id) return;

    setUploading(true);
    try {
      const bannerUrl = await enhancedProfileService.uploadBanner(
        user.id,
        file,
      );
      setEditForm((prev) => ({ ...prev, banner: bannerUrl }));

      toast({
        title: "Banner uploaded",
        description: "Your profile banner has been updated.",
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

  const getKYCBadge = (level: number) => {
    const badges = {
      0: { text: "Unverified", color: "bg-gray-500", icon: "🔒" },
      1: { text: "Basic KYC", color: "bg-blue-500", icon: "🆔" },
      2: { text: "Enhanced KYC", color: "bg-green-500", icon: "✅" },
      3: { text: "Premium KYC", color: "bg-purple-500", icon: "👑" },
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
          <div className="h-64 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          <div className="max-w-7xl mx-auto p-6">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="space-y-4">
                <div className="h-48 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
              <div className="lg:col-span-3 h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const kycBadge = getKYCBadge(profile.kycLevel);
  const reputation = getReputation(profile.reputation);

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Banner Section */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 overflow-hidden">
        {profile.banner && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
            style={{ backgroundImage: `url(${profile.banner})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Edit Banner Button */}
        {isEditing && (
          <div className="absolute top-4 right-4">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/20 border-white/20 text-white hover:bg-white/30"
              onClick={() => document.getElementById("banner-upload")?.click()}
              disabled={uploading}
            >
              <Camera className="h-4 w-4 mr-2" />
              {uploading ? "Uploading..." : "Change Banner"}
            </Button>
            <input
              id="banner-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleBannerUpload(file);
              }}
              className="hidden"
            />
          </div>
        )}

        {/* Profile Header */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
              {/* Avatar with Edit Button */}
              <div className="relative">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={editForm.avatar || profile.avatar}
                    alt={profile.displayName}
                  />
                  <AvatarFallback className="text-2xl">
                    {profile.displayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
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

              {/* Profile Info */}
              <div className="flex-1 text-white">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {profile.displayName}
                  </h1>
                  {profile.isVerified && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-600 text-white"
                    >
                      <Verified className="h-3 w-3 mr-1" fill="currentColor" />
                      Verified
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={`border-yellow-400 text-yellow-400`}
                  >
                    <Star className="h-3 w-3 mr-1" fill="currentColor" />
                    {profile.level}
                  </Badge>
                  <Badge className={`${kycBadge.color} text-white`}>
                    <span className="mr-1">{kycBadge.icon}</span>
                    {kycBadge.text}
                  </Badge>
                </div>
                <p className="text-blue-100 mb-2">@{profile.username}</p>
                <div className="flex items-center gap-4 text-sm text-blue-200 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{profile.followers.toLocaleString()} followers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{profile.posts} posts</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span className={reputation.color}>
                      {profile.reputation}/5.0 ({reputation.text})
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Joined {formatDistanceToNow(new Date(profile.joinedDate))}{" "}
                      ago
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                {!isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={() => setActiveTab("settings")}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
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
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {profile.followers.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Followers
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {profile.following.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Following
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {profile.posts}
                    </div>
                    <div className="text-xs text-muted-foreground">Posts</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {profile.reputation}
                    </div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Profile Completion</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.achievements.slice(0, 3).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg"
                  >
                    <div className="text-xl">{achievement.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {achievement.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  View All Achievements
                </Button>
              </CardContent>
            </Card>

            {/* KYC Status */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Verification Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email</span>
                    {profile.emailVerified ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Phone</span>
                    {profile.phoneVerified ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">2FA</span>
                    {profile.twoFactorEnabled ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      KYC Level {profile.kycLevel}
                    </span>
                    <Badge className={kycBadge.color}>{kycBadge.text}</Badge>
                  </div>
                  <Progress
                    value={(profile.kycLevel / 3) * 100}
                    className="h-2"
                  />
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

          {/* Main Content Tabs */}
          <div className="lg:col-span-3">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="professional">Professional</TabsTrigger>
                <TabsTrigger value="financial">Financial</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      About Me
                      {isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setEditingSection(
                              editingSection === "bio" ? null : "bio",
                            )
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {editingSection === "bio" ? (
                      <Textarea
                        value={editForm.bio || ""}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        placeholder="Tell us about yourself..."
                        className="min-h-[100px]"
                      />
                    ) : (
                      <p className="text-muted-foreground whitespace-pre-line">
                        {profile.bio || "No bio added yet."}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.email}</span>
                        {profile.emailVerified && (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        )}
                      </div>
                      {profile.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.phone}</span>
                          {profile.phoneVerified && (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          )}
                        </div>
                      )}
                      {profile.address && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {profile.address.city}, {profile.address.country}
                          </span>
                        </div>
                      )}
                      {profile.website && (
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {profile.website}
                          </a>
                          <ExternalLink className="h-3 w-3" />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Professional Links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
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
                          <ExternalLink className="h-3 w-3" />
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
                          <ExternalLink className="h-3 w-3" />
                        </div>
                      )}
                      {profile.portfolio && (
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={profile.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            Portfolio
                          </a>
                          <ExternalLink className="h-3 w-3" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

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
              </TabsContent>

              {/* Personal Information Tab */}
              <TabsContent value="personal" className="space-y-6">
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
                          <Label htmlFor="gender">Gender</Label>
                          <Select
                            value={editForm.gender || ""}
                            onValueChange={(value) =>
                              setEditForm((prev) => ({
                                ...prev,
                                gender: value as any,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer_not_to_say">
                                Prefer not to say
                              </SelectItem>
                            </SelectContent>
                          </Select>
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
                        <div className="space-y-2">
                          <Label htmlFor="timeZone">Time Zone</Label>
                          <Select
                            value={editForm.timeZone || ""}
                            onValueChange={(value) =>
                              setEditForm((prev) => ({
                                ...prev,
                                timeZone: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                              {enhancedProfileService
                                .getSupportedTimezones()
                                .map((tz) => (
                                  <SelectItem key={tz.code} value={tz.code}>
                                    {tz.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
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
                              {new Date(
                                profile.dateOfBirth,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        {profile.gender && (
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                              Gender
                            </Label>
                            <p className="text-sm capitalize">
                              {profile.gender.replace("_", " ")}
                            </p>
                          </div>
                        )}
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">
                            Time Zone
                          </Label>
                          <p className="text-sm">{profile.timeZone}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">
                            Language
                          </Label>
                          <p className="text-sm">{profile.language}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">
                            Preferred Currency
                          </Label>
                          <p className="text-sm">{profile.preferredCurrency}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Address Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Address Information
                      {isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setEditingSection(
                              editingSection === "address" ? null : "address",
                            )
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {editingSection === "address" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2 space-y-2">
                          <Label htmlFor="street">Street Address</Label>
                          <Input
                            id="street"
                            value={editForm.address?.street || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                address: {
                                  ...prev.address!,
                                  street: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={editForm.address?.city || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                address: {
                                  ...prev.address!,
                                  city: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State/Province</Label>
                          <Input
                            id="state"
                            value={editForm.address?.state || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                address: {
                                  ...prev.address!,
                                  state: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={editForm.address?.country || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                address: {
                                  ...prev.address!,
                                  country: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                          <Input
                            id="zipCode"
                            value={editForm.address?.zipCode || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                address: {
                                  ...prev.address!,
                                  zipCode: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm">
                        {profile.address ? (
                          <div>
                            <p>{profile.address.street}</p>
                            <p>
                              {profile.address.city}, {profile.address.state}{" "}
                              {profile.address.zipCode}
                            </p>
                            <p>{profile.address.country}</p>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">
                            No address information provided.
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Professional Tab */}
              <TabsContent value="professional" className="space-y-6">
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
              </TabsContent>

              {/* Financial Tab */}
              <TabsContent value="financial" className="space-y-6">
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
                          <div
                            key={account.id}
                            className="p-4 border rounded-lg"
                          >
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

                {/* Add Bank Account Modal */}
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
                          <Label htmlFor="accountName">
                            Account Holder Name
                          </Label>
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
                        <Button
                          onClick={handleAddBankAccount}
                          className="flex-1"
                        >
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
                              prev
                                ? { ...prev, preferredCurrency: value }
                                : null,
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
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                {/* Security Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl mb-2">
                          {profile.twoFactorEnabled ? "🔐" : "🔓"}
                        </div>
                        <p className="font-medium">Two-Factor Auth</p>
                        <p className="text-sm text-muted-foreground">
                          {profile.twoFactorEnabled ? "Enabled" : "Disabled"}
                        </p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl mb-2">✅</div>
                        <p className="font-medium">Email Verified</p>
                        <p className="text-sm text-muted-foreground">
                          {profile.emailVerified ? "Verified" : "Not Verified"}
                        </p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl mb-2">📱</div>
                        <p className="font-medium">Phone Verified</p>
                        <p className="text-sm text-muted-foreground">
                          {profile.phoneVerified ? "Verified" : "Not Verified"}
                        </p>
                      </div>
                    </div>
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
                              <p className="font-medium text-sm">
                                {log.action}
                              </p>
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
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
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

                {/* Notification Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notification Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-3">
                          Email Notifications
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="font-medium">
                                Marketing Emails
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Product updates and promotions
                              </p>
                            </div>
                            <Switch
                              checked={
                                profile.notificationSettings.email.marketing
                              }
                              onCheckedChange={(checked) => {
                                setProfile((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        notificationSettings: {
                                          ...prev.notificationSettings,
                                          email: {
                                            ...prev.notificationSettings.email,
                                            marketing: checked,
                                          },
                                        },
                                      }
                                    : null,
                                );
                              }}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="font-medium">
                                Social Activity
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Likes, comments, and follows
                              </p>
                            </div>
                            <Switch
                              checked={
                                profile.notificationSettings.email
                                  .socialActivity
                              }
                              onCheckedChange={(checked) => {
                                setProfile((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        notificationSettings: {
                                          ...prev.notificationSettings,
                                          email: {
                                            ...prev.notificationSettings.email,
                                            socialActivity: checked,
                                          },
                                        },
                                      }
                                    : null,
                                );
                              }}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="font-medium">
                                System Alerts
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Security and account alerts
                              </p>
                            </div>
                            <Switch
                              checked={
                                profile.notificationSettings.email.systemAlerts
                              }
                              onCheckedChange={(checked) => {
                                setProfile((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        notificationSettings: {
                                          ...prev.notificationSettings,
                                          email: {
                                            ...prev.notificationSettings.email,
                                            systemAlerts: checked,
                                          },
                                        },
                                      }
                                    : null,
                                );
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-3">Push Notifications</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="font-medium">Messages</Label>
                              <p className="text-sm text-muted-foreground">
                                New direct messages
                              </p>
                            </div>
                            <Switch
                              checked={
                                profile.notificationSettings.push.messages
                              }
                              onCheckedChange={(checked) => {
                                setProfile((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        notificationSettings: {
                                          ...prev.notificationSettings,
                                          push: {
                                            ...prev.notificationSettings.push,
                                            messages: checked,
                                          },
                                        },
                                      }
                                    : null,
                                );
                              }}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="font-medium">
                                Trading Activity
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Trade executions and orders
                              </p>
                            </div>
                            <Switch
                              checked={profile.notificationSettings.push.trades}
                              onCheckedChange={(checked) => {
                                setProfile((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        notificationSettings: {
                                          ...prev.notificationSettings,
                                          push: {
                                            ...prev.notificationSettings.push,
                                            trades: checked,
                                          },
                                        },
                                      }
                                    : null,
                                );
                              }}
                            />
                          </div>
                        </div>
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
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedProfile;
