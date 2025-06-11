import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Settings,
  Palette,
  Bell,
  Shield,
  Globe2,
  DollarSign,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  MessageSquare,
  TrendingUp,
  Building,
  CreditCard,
  Zap,
  Database,
  UserCheck,
  Camera,
  Volume2,
  Moon,
  Sun,
  Plus,
  X,
  Upload,
  Star,
  Code,
  Briefcase,
  GraduationCap,
  MapPin,
  Link as LinkIcon,
  Phone,
  FileText,
  Save,
  Edit,
  Trash,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import KYCVerificationModal from "@/components/kyc/KYCVerificationModal";
import BankAccountSettings from "@/components/wallet/BankAccountSettings";

const EnhancedSettings = () => {
  const { user, updateProfile, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  // Profile states
  const [skills, setSkills] = useState<string[]>(user?.profile?.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [interests, setInterests] = useState<string[]>(
    user?.profile?.interests || [],
  );
  const [newInterest, setNewInterest] = useState("");
  const [languages, setLanguages] = useState<string[]>(
    user?.profile?.languages || ["English"],
  );
  const [newLanguage, setNewLanguage] = useState("");

  // Personal information states
  const [fullName, setFullName] = useState(user?.profile?.full_name || "");
  const [bio, setBio] = useState(user?.profile?.bio || "");
  const [location, setLocation] = useState(user?.profile?.location || "");
  const [website, setWebsite] = useState(user?.profile?.website || "");
  const [phone, setPhone] = useState(user?.profile?.phone || "");

  // Professional information states
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");

  // Freelance profile states
  const [professionalTitle, setProfessionalTitle] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [availability, setAvailability] = useState("available");
  const [experienceLevel, setExperienceLevel] = useState("intermediate");
  const [portfolioUrl, setPortfolioUrl] = useState("");

  // Marketplace profile states
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [businessType, setBusinessType] = useState("individual");

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [tradingAlerts, setTradingAlerts] = useState(true);
  const [socialActivity, setSocialActivity] = useState(true);

  // Privacy settings
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowDirectMessages, setAllowDirectMessages] = useState("everyone");
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  // Security settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [kycLevel, setKycLevel] = useState(user?.profile?.kyc_level || 0);

  // Skills management
  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  // Interests management
  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setInterests(interests.filter((interest) => interest !== interestToRemove));
  };

  // Languages management
  const addLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage("");
    }
  };

  const removeLanguage = (languageToRemove: string) => {
    if (languages.length > 1) {
      // Keep at least one language
      setLanguages(
        languages.filter((language) => language !== languageToRemove),
      );
    }
  };

  // Save profile changes
  const saveProfileChanges = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        full_name: fullName,
        bio,
        location,
        website,
        phone,
        skills,
        interests,
        languages,
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save freelance profile
  const saveFreelanceProfile = async () => {
    setIsLoading(true);
    try {
      // This would update the freelance-specific profile data
      await updateProfile({
        freelance_profile: {
          professional_title: professionalTitle,
          hourly_rate: parseFloat(hourlyRate) || 0,
          availability,
          experience_level: experienceLevel,
          portfolio_url: portfolioUrl,
        },
      });

      toast({
        title: "Freelance profile updated",
        description: "Your freelance profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update freelance profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save marketplace profile
  const saveMarketplaceProfile = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        marketplace_profile: {
          store_name: storeName,
          store_description: storeDescription,
          business_type: businessType,
        },
      });

      toast({
        title: "Store profile updated",
        description: "Your marketplace profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update store profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Change password
  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // This would call the password change API
      toast({
        title: "Password changed",
        description: "Your password has been changed successfully.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getKYCStatusBadge = (level: number) => {
    const statuses = [
      {
        label: "Not Verified",
        color: "bg-gray-500",
        icon: <Shield className="w-3 h-3" />,
      },
      {
        label: "Basic",
        color: "bg-blue-500",
        icon: <UserCheck className="w-3 h-3" />,
      },
      {
        label: "Intermediate",
        color: "bg-yellow-500",
        icon: <CheckCircle className="w-3 h-3" />,
      },
      {
        label: "Advanced",
        color: "bg-green-500",
        icon: <Star className="w-3 h-3" />,
      },
    ];
    const status = statuses[level] || statuses[0];
    return (
      <Badge className={`${status.color} text-white`}>
        {status.icon}
        <span className="ml-1">{status.label}</span>
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, Country"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>
                <Button onClick={saveProfileChanges} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Skills & Expertise */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Skills & Expertise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Skills</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    />
                    <Button onClick={addSkill} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {skill}
                        <button onClick={() => removeSkill(skill)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Interests</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      placeholder="Add an interest"
                      onKeyPress={(e) => e.key === "Enter" && addInterest()}
                    />
                    <Button onClick={addInterest} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        {interest}
                        <button onClick={() => removeInterest(interest)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Languages</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      placeholder="Add a language"
                      onKeyPress={(e) => e.key === "Enter" && addLanguage()}
                    />
                    <Button onClick={addLanguage} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((language, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {language}
                        {languages.length > 1 && (
                          <button onClick={() => removeLanguage(language)}>
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button onClick={saveProfileChanges} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Skills
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Settings */}
          <TabsContent value="professional" className="space-y-6">
            {/* Freelance Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Freelance Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="professionalTitle">
                      Professional Title
                    </Label>
                    <Input
                      id="professionalTitle"
                      value={professionalTitle}
                      onChange={(e) => setProfessionalTitle(e.target.value)}
                      placeholder="e.g., Full Stack Developer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <Label htmlFor="availability">Availability</Label>
                    <Select
                      value={availability}
                      onValueChange={setAvailability}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="busy">Busy</SelectItem>
                        <SelectItem value="unavailable">Unavailable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="experienceLevel">Experience Level</Label>
                    <Select
                      value={experienceLevel}
                      onValueChange={setExperienceLevel}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                  <Input
                    id="portfolioUrl"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://yourportfolio.com"
                  />
                </div>
                <Button onClick={saveFreelanceProfile} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Freelance Profile
                </Button>
              </CardContent>
            </Card>

            {/* Marketplace Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Marketplace Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input
                      id="storeName"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="Your Store Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessType">Business Type</Label>
                    <Select
                      value={businessType}
                      onValueChange={setBusinessType}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="storeDescription">Store Description</Label>
                  <Textarea
                    id="storeDescription"
                    value={storeDescription}
                    onChange={(e) => setStoreDescription(e.target.value)}
                    placeholder="Describe your store and products..."
                    rows={3}
                  />
                </div>
                <Button onClick={saveMarketplaceProfile} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Store Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Settings */}
          <TabsContent value="financial" className="space-y-6">
            {/* KYC Verification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Identity Verification (KYC)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Verification Level</p>
                    <p className="text-sm text-muted-foreground">
                      Higher levels unlock more features and trading limits
                    </p>
                  </div>
                  {getKYCStatusBadge(kycLevel)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div
                      className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${kycLevel >= 0 ? "bg-green-500 text-white" : "bg-gray-200"}`}
                    >
                      <Shield className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-medium">Basic</p>
                  </div>
                  <div className="text-center">
                    <div
                      className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${kycLevel >= 1 ? "bg-green-500 text-white" : "bg-gray-200"}`}
                    >
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-medium">Identity</p>
                  </div>
                  <div className="text-center">
                    <div
                      className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${kycLevel >= 2 ? "bg-green-500 text-white" : "bg-gray-200"}`}
                    >
                      <FileText className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-medium">Documents</p>
                  </div>
                  <div className="text-center">
                    <div
                      className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${kycLevel >= 3 ? "bg-green-500 text-white" : "bg-gray-200"}`}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-medium">Advanced</p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowKYCModal(true)}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {kycLevel === 0
                    ? "Start Verification"
                    : "Upgrade Verification"}
                </Button>
              </CardContent>
            </Card>

            {/* Bank Account Settings */}
            <BankAccountSettings />

            {/* Trading Limits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Trading Limits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-500" />
                    <p className="text-2xl font-bold">$1,000</p>
                    <p className="text-sm text-muted-foreground">Daily Limit</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <DollarSign className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                    <p className="text-2xl font-bold">$5,000</p>
                    <p className="text-sm text-muted-foreground">
                      Weekly Limit
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <DollarSign className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                    <p className="text-2xl font-bold">$20,000</p>
                    <p className="text-sm text-muted-foreground">
                      Monthly Limit
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Complete KYC verification to increase your trading limits
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important updates via email
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications">
                      Push Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get instant notifications
                    </p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="orderUpdates">Order Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Marketplace order status changes
                    </p>
                  </div>
                  <Switch
                    id="orderUpdates"
                    checked={orderUpdates}
                    onCheckedChange={setOrderUpdates}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="tradingAlerts">Trading Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Crypto trading and price alerts
                    </p>
                  </div>
                  <Switch
                    id="tradingAlerts"
                    checked={tradingAlerts}
                    onCheckedChange={setTradingAlerts}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="socialActivity">Social Activity</Label>
                    <p className="text-sm text-muted-foreground">
                      Likes, comments, and follows
                    </p>
                  </div>
                  <Switch
                    id="socialActivity"
                    checked={socialActivity}
                    onCheckedChange={setSocialActivity}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketingEmails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Product updates and promotions
                    </p>
                  </div>
                  <Switch
                    id="marketingEmails"
                    checked={marketingEmails}
                    onCheckedChange={setMarketingEmails}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Privacy Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="profileVisibility">Profile Visibility</Label>
                  <Select
                    value={profileVisibility}
                    onValueChange={setProfileVisibility}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="followers">Followers Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="allowDirectMessages">
                    Who can message you
                  </Label>
                  <Select
                    value={allowDirectMessages}
                    onValueChange={setAllowDirectMessages}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyone">Everyone</SelectItem>
                      <SelectItem value="followers">Followers Only</SelectItem>
                      <SelectItem value="none">No One</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showOnlineStatus">Show Online Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Let others see when you're online
                    </p>
                  </div>
                  <Switch
                    id="showOnlineStatus"
                    checked={showOnlineStatus}
                    onCheckedChange={setShowOnlineStatus}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showEmail">Show Email in Profile</Label>
                    <p className="text-sm text-muted-foreground">
                      Display your email publicly
                    </p>
                  </div>
                  <Switch
                    id="showEmail"
                    checked={showEmail}
                    onCheckedChange={setShowEmail}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showPhone">Show Phone in Profile</Label>
                    <p className="text-sm text-muted-foreground">
                      Display your phone number publicly
                    </p>
                  </div>
                  <Switch
                    id="showPhone"
                    checked={showPhone}
                    onCheckedChange={setShowPhone}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactorEnabled">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Switch
                    id="twoFactorEnabled"
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="loginNotifications">
                      Login Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified of new logins
                    </p>
                  </div>
                  <Switch
                    id="loginNotifications"
                    checked={loginNotifications}
                    onCheckedChange={setLoginNotifications}
                  />
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Change Password</h3>
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                  <Button onClick={changePassword} disabled={isLoading}>
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Theme Preferences</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Toggle dark/light theme
                      </p>
                    </div>
                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={(checked) =>
                        setTheme(checked ? "dark" : "light")
                      }
                    />
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-600">
                    Danger Zone
                  </h3>
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-800">
                          Delete Account
                        </p>
                        <p className="text-sm text-red-600">
                          Permanently delete your account and all data
                        </p>
                      </div>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* KYC Modal */}
        {showKYCModal && (
          <KYCVerificationModal
            userId={user?.id || ""}
            currentLevel={kycLevel}
            onLevelUpdate={(newLevel) => {
              setKycLevel(newLevel);
              setShowKYCModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default EnhancedSettings;
