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
  Monitor,
  Languages,
  MapPin,
  Calendar,
  RefreshCw,
  Save,
  X,
  Plus,
  ExternalLink,
  Copy,
  QrCode,
  Key,
  History,
  FileDown,
} from "lucide-react";
import {
  enhancedProfileService,
  UserSettings,
} from "@/services/enhancedProfileService";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const EnhancedSettings = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const { toast } = useToast();

  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // 2FA setup states
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState("");

  // Password change states
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Account deletion states
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  useEffect(() => {
    loadSettings();
  }, [user?.id]);

  const loadSettings = async () => {
    if (!user?.id) return;

    try {
      const userSettings = await enhancedProfileService.getUserSettings(
        user.id,
      );
      setSettings(userSettings);
    } catch (error) {
      toast({
        title: "Failed to load settings",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (updatedSettings: Partial<UserSettings>) => {
    if (!user?.id || !settings) return;

    setIsSaving(true);
    try {
      const newSettings = await enhancedProfileService.updateSettings(
        user.id,
        updatedSettings,
      );
      setSettings(newSettings);

      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to save settings",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    saveSettings({ theme: newTheme });
  };

  const handle2FASetup = async () => {
    if (!user?.id) return;

    try {
      const { secret, qrCode: qr } = await enhancedProfileService.enable2FA(
        user.id,
      );
      setQrCode(qr);
      setBackupCodes(["ABC123", "DEF456", "GHI789", "JKL012", "MNO345"]); // Mock codes
      setShow2FASetup(true);
    } catch (error) {
      toast({
        title: "Failed to setup 2FA",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const verify2FA = async () => {
    if (!user?.id || !verificationCode) return;

    try {
      // Mock verification - in real app, verify the code
      if (verificationCode === "123456") {
        await saveSettings({ twoFactorAuth: true });
        setShow2FASetup(false);
        setVerificationCode("");

        toast({
          title: "2FA enabled",
          description:
            "Two-factor authentication has been enabled successfully.",
        });
      } else {
        toast({
          title: "Invalid code",
          description: "Please enter a valid verification code.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const disable2FA = async () => {
    if (!user?.id) return;

    try {
      const success = await enhancedProfileService.disable2FA(
        user.id,
        "123456",
      );
      if (success) {
        await saveSettings({ twoFactorAuth: false });

        toast({
          title: "2FA disabled",
          description: "Two-factor authentication has been disabled.",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to disable 2FA",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure both passwords are identical.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    // Simulate password change
    toast({
      title: "Password changed",
      description: "Your password has been updated successfully.",
    });

    setShowPasswordChange(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleAccountDeletion = async () => {
    if (deleteConfirmation !== "DELETE") {
      toast({
        title: "Invalid confirmation",
        description: 'Please type "DELETE" to confirm.',
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) return;

    try {
      const success = await enhancedProfileService.deleteAccount(
        user.id,
        deleteConfirmation,
      );
      if (success) {
        toast({
          title: "Account deletion initiated",
          description: "Your account will be deleted within 24 hours.",
        });
        logout();
      }
    } catch (error) {
      toast({
        title: "Deletion failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const exportData = async () => {
    if (!user?.id) return;

    try {
      const blob = await enhancedProfileService.exportUserData(user.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `softchat-data-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported",
        description: "Your data has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background w-full max-w-full overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto p-3 sm:p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and settings
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="general" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-1">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-1"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="trading" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Trading</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-1">
              <UserCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe2 className="h-5 w-5" />
                  Regional Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={settings.language}
                      onValueChange={(value) =>
                        saveSettings({ language: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {enhancedProfileService
                          .getSupportedLanguages()
                          .map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Time Zone</Label>
                    <Select
                      value={settings.timeZone}
                      onValueChange={(value) =>
                        saveSettings({ timeZone: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
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

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={settings.currency}
                      onValueChange={(value) =>
                        saveSettings({ currency: value })
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
                              {currency.symbol} {currency.code} -{" "}
                              {currency.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select
                      value={settings.dateFormat}
                      onValueChange={(value) =>
                        saveSettings({ dateFormat: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeFormat">Time Format</Label>
                    <Select
                      value={settings.timeFormat}
                      onValueChange={(value) =>
                        saveSettings({ timeFormat: value as "12h" | "24h" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
                        <SelectItem value="24h">24 Hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Theme Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label className="font-medium mb-3 block">Theme Mode</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <Button
                        variant={
                          settings.theme === "light" ? "default" : "outline"
                        }
                        onClick={() => handleThemeChange("light")}
                        className="flex flex-col items-center gap-2 h-auto py-4"
                      >
                        <Sun className="h-6 w-6" />
                        <span>Light</span>
                      </Button>
                      <Button
                        variant={
                          settings.theme === "dark" ? "default" : "outline"
                        }
                        onClick={() => handleThemeChange("dark")}
                        className="flex flex-col items-center gap-2 h-auto py-4"
                      >
                        <Moon className="h-6 w-6" />
                        <span>Dark</span>
                      </Button>
                      <Button
                        variant={
                          settings.theme === "system" ? "default" : "outline"
                        }
                        onClick={() => handleThemeChange("system")}
                        className="flex flex-col items-center gap-2 h-auto py-4"
                      >
                        <Monitor className="h-6 w-6" />
                        <span>System</span>
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Auto-play Videos</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically play videos in feed
                        </p>
                      </div>
                      <Switch
                        checked={settings.autoPlayVideos}
                        onCheckedChange={(checked) =>
                          saveSettings({ autoPlayVideos: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Auto-load Images</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically load images when scrolling
                        </p>
                      </div>
                      <Switch
                        checked={settings.autoLoadImages}
                        onCheckedChange={(checked) =>
                          saveSettings({ autoLoadImages: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">
                          Show Balance in Header
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Display wallet balance in navigation
                        </p>
                      </div>
                      <Switch
                        checked={settings.showBalanceInHeader}
                        onCheckedChange={(checked) =>
                          saveSettings({ showBalanceInHeader: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Communication Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Direct Messages</Label>
                      <p className="text-sm text-muted-foreground">
                        Who can send you messages
                      </p>
                    </div>
                    <Select
                      value={settings.allowDirectMessages}
                      onValueChange={(value) =>
                        saveSettings({ allowDirectMessages: value as any })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="followers">Followers</SelectItem>
                        <SelectItem value="none">No one</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Allow Tagging</Label>
                      <p className="text-sm text-muted-foreground">
                        Let others tag you in posts
                      </p>
                    </div>
                    <Switch
                      checked={settings.allowTagging}
                      onCheckedChange={(checked) =>
                        saveSettings({ allowTagging: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Allow Mentions</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when mentioned
                      </p>
                    </div>
                    <Switch
                      checked={settings.allowMentions}
                      onCheckedChange={(checked) =>
                        saveSettings({ allowMentions: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Push Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">New Messages</Label>
                      <p className="text-sm text-muted-foreground">
                        Direct messages and chats
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Social Activity</Label>
                      <p className="text-sm text-muted-foreground">
                        Likes, comments, follows
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Trading Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Price alerts and trade executions
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">System Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Platform updates and maintenance
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Profile Visibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Profile Visibility</Label>
                      <p className="text-sm text-muted-foreground">
                        Who can see your profile
                      </p>
                    </div>
                    <Select
                      value={settings.profileVisibility}
                      onValueChange={(value) =>
                        saveSettings({ profileVisibility: value as any })
                      }
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
                      <Label className="font-medium">Show Online Status</Label>
                      <p className="text-sm text-muted-foreground">
                        Let others see when you're online
                      </p>
                    </div>
                    <Switch
                      checked={settings.showOnlineStatus}
                      onCheckedChange={(checked) =>
                        saveSettings({ showOnlineStatus: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">
                        Search Engine Indexing
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Allow search engines to find your profile
                      </p>
                    </div>
                    <Switch
                      checked={settings.allowSearchEngineIndexing}
                      onCheckedChange={(checked) =>
                        saveSettings({ allowSearchEngineIndexing: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Data Analytics</Label>
                      <p className="text-sm text-muted-foreground">
                        Help improve the platform with usage data
                      </p>
                    </div>
                    <Switch
                      checked={settings.allowDataAnalytics}
                      onCheckedChange={(checked) =>
                        saveSettings({ allowDataAnalytics: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Content Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Sensitive Content</Label>
                      <p className="text-sm text-muted-foreground">
                        Show potentially sensitive content
                      </p>
                    </div>
                    <Switch
                      checked={settings.showSensitiveContent}
                      onCheckedChange={(checked) =>
                        saveSettings({ showSensitiveContent: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">NSFW Content</Label>
                      <p className="text-sm text-muted-foreground">
                        Show not-safe-for-work content
                      </p>
                    </div>
                    <Switch
                      checked={settings.nsfw}
                      onCheckedChange={(checked) =>
                        saveSettings({ nsfw: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Auto-play Media</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically play videos and GIFs
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoplayMedia}
                      onCheckedChange={(checked) =>
                        saveSettings({ autoplayMedia: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Authentication & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {/* Password Change */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Key className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Password</p>
                        <p className="text-sm text-muted-foreground">
                          Last changed 30 days ago
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowPasswordChange(true)}
                    >
                      Change Password
                    </Button>
                  </div>

                  {/* 2FA */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">
                          {settings.twoFactorAuth ? "Enabled" : "Not enabled"}
                        </p>
                      </div>
                    </div>
                    {settings.twoFactorAuth ? (
                      <Button variant="outline" onClick={disable2FA}>
                        Disable 2FA
                      </Button>
                    ) : (
                      <Button onClick={handle2FASetup}>Enable 2FA</Button>
                    )}
                  </div>

                  {/* Login Notifications */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Login Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get alerts for new logins
                      </p>
                    </div>
                    <Switch
                      checked={settings.loginNotifications}
                      onCheckedChange={(checked) =>
                        saveSettings({ loginNotifications: checked })
                      }
                    />
                  </div>

                  {/* Session Timeout */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">
                        Auto-logout after inactivity
                      </p>
                    </div>
                    <Select
                      value={settings.sessionTimeout.toString()}
                      onValueChange={(value) =>
                        saveSettings({ sessionTimeout: parseInt(value) })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                        <SelectItem value="0">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Remember Me</Label>
                      <p className="text-sm text-muted-foreground">
                        Stay logged in on this device
                      </p>
                    </div>
                    <Switch
                      checked={settings.allowRememberMe}
                      onCheckedChange={(checked) =>
                        saveSettings({ allowRememberMe: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Password Change Modal */}
            {showPasswordChange && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Change Password
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPasswordChange(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowPasswordChange(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handlePasswordChange} className="flex-1">
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 2FA Setup Modal */}
            {show2FASetup && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Setup Two-Factor Authentication
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShow2FASetup(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-48 h-48 bg-gray-100 mx-auto mb-4 rounded-lg flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-gray-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Scan this QR code with your authenticator app
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backupCodes">Backup Codes</Label>
                    <div className="grid grid-cols-1 gap-2 p-3 bg-muted rounded-lg text-sm font-mono">
                      {backupCodes.map((code, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span>{code}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigator.clipboard.writeText(code)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Save these backup codes in a secure location
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="verificationCode">Verification Code</Label>
                    <Input
                      id="verificationCode"
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShow2FASetup(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={verify2FA}
                      className="flex-1"
                      disabled={!verificationCode}
                    >
                      Verify & Enable
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Trading Settings */}
          <TabsContent value="trading" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trading Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Confirm All Trades</Label>
                      <p className="text-sm text-muted-foreground">
                        Require confirmation for every trade
                      </p>
                    </div>
                    <Switch
                      checked={settings.confirmAllTrades}
                      onCheckedChange={(checked) =>
                        saveSettings({ confirmAllTrades: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">
                        Advanced Order Types
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Enable stop-loss, take-profit orders
                      </p>
                    </div>
                    <Switch
                      checked={settings.advancedOrderTypes}
                      onCheckedChange={(checked) =>
                        saveSettings({ advancedOrderTypes: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">
                        Default Trading Pair
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Default pair when opening trader
                      </p>
                    </div>
                    <Select
                      value={settings.defaultTradingPair}
                      onValueChange={(value) =>
                        saveSettings({ defaultTradingPair: value })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BTC/USD">BTC/USD</SelectItem>
                        <SelectItem value="ETH/USD">ETH/USD</SelectItem>
                        <SelectItem value="BTC/ETH">BTC/ETH</SelectItem>
                        <SelectItem value="LTC/USD">LTC/USD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Management */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileDown className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Export Your Data</p>
                        <p className="text-sm text-muted-foreground">
                          Download all your account data
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={exportData}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <History className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Activity History</p>
                        <p className="text-sm text-muted-foreground">
                          View your recent activity
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">View History</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 border border-destructive rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium text-destructive">
                          Delete Account
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all data
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => setShowDeleteAccount(true)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>

                    {showDeleteAccount && (
                      <div className="space-y-4 pt-4 border-t">
                        <div className="bg-destructive/10 p-4 rounded-lg">
                          <p className="text-sm text-destructive font-medium mb-2">
                            ⚠️ This action cannot be undone!
                          </p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>
                              • All your posts and content will be deleted
                            </li>
                            <li>• Your profile will be permanently removed</li>
                            <li>• Any funds will need to be withdrawn first</li>
                            <li>• This action is irreversible</li>
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="deleteConfirmation">
                            Type "DELETE" to confirm account deletion
                          </Label>
                          <Input
                            id="deleteConfirmation"
                            value={deleteConfirmation}
                            onChange={(e) =>
                              setDeleteConfirmation(e.target.value)
                            }
                            placeholder="Type DELETE here"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowDeleteAccount(false);
                              setDeleteConfirmation("");
                            }}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleAccountDeletion}
                            disabled={deleteConfirmation !== "DELETE"}
                            className="flex-1"
                          >
                            Delete My Account
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={logout}
                  >
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedSettings;
