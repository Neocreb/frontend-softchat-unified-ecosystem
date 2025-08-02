import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { 
  Settings, 
  DollarSign, 
  Shield, 
  Globe, 
  Mail, 
  Bell, 
  Database,
  Lock,
  Eye,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Monitor,
  Users,
  Zap,
  Cloud,
  Server,
  CreditCard,
  Percent,
  Calendar,
  Clock,
  FileText,
  Image,
  Video,
  MessageSquare
} from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface PlatformSettings {
  general: {
    platformName: string;
    description: string;
    supportEmail: string;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    emailVerificationRequired: boolean;
    maxFileUploadSize: number; // MB
    allowedFileTypes: string[];
    defaultCurrency: string;
    defaultLanguage: string;
    timezone: string;
  };
  fees: {
    transactionFee: number;
    withdrawalFee: number;
    freelanceCommission: number;
    marketplaceCommission: number;
    cryptoTradingFee: number;
    campaignBoostFee: number;
    premiumSubscriptionPrice: number;
    minimumWithdrawal: number;
    maximumWithdrawal: number;
    processingFee: number;
    internationalFee: number;
  };
  security: {
    passwordMinLength: number;
    requireTwoFactor: boolean;
    sessionTimeout: number; // minutes
    maxLoginAttempts: number;
    lockoutDuration: number; // minutes
    requireVerificationForWithdrawals: boolean;
    ipWhitelisting: boolean;
    suspiciousActivityThreshold: number;
    autoSuspendHighRisk: boolean;
  };
  content: {
    maxPostLength: number;
    maxCommentLength: number;
    maxImageSize: number; // MB
    maxVideoSize: number; // MB
    allowedVideoFormats: string[];
    allowedImageFormats: string[];
    moderationEnabled: boolean;
    autoModerationThreshold: number;
    requireApprovalForAds: boolean;
    maxHashtagsPerPost: number;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    systemAlerts: boolean;
    disputeNotifications: boolean;
    maintenanceNotifications: boolean;
    securityAlerts: boolean;
  };
  limits: {
    maxUsersPerDay: number;
    maxTransactionsPerUser: number;
    maxWithdrawalsPerDay: number;
    apiRateLimit: number; // requests per minute
    maxConcurrentSessions: number;
    maxFriendsPerUser: number;
    maxGroupsPerUser: number;
    maxPostsPerDay: number;
  };
}

interface ConfigurationHistory {
  id: string;
  section: string;
  changes: { field: string; oldValue: any; newValue: any }[];
  changedBy: string;
  timestamp: string;
  reason: string;
}

export function PlatformSettingsCenter() {
  const [settings, setSettings] = useState<PlatformSettings>({
    general: {
      platformName: 'SoftChat Platform',
      description: 'A comprehensive social media and freelance platform',
      supportEmail: 'support@softchat.com',
      maintenanceMode: false,
      registrationEnabled: true,
      emailVerificationRequired: true,
      maxFileUploadSize: 50,
      allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'mp4', 'mov', 'avi'],
      defaultCurrency: 'USD',
      defaultLanguage: 'en',
      timezone: 'UTC'
    },
    fees: {
      transactionFee: 2.5,
      withdrawalFee: 1.0,
      freelanceCommission: 10.0,
      marketplaceCommission: 5.0,
      cryptoTradingFee: 0.5,
      campaignBoostFee: 3.0,
      premiumSubscriptionPrice: 9.99,
      minimumWithdrawal: 10,
      maximumWithdrawal: 10000,
      processingFee: 0.5,
      internationalFee: 2.0
    },
    security: {
      passwordMinLength: 8,
      requireTwoFactor: false,
      sessionTimeout: 480,
      maxLoginAttempts: 5,
      lockoutDuration: 30,
      requireVerificationForWithdrawals: true,
      ipWhitelisting: false,
      suspiciousActivityThreshold: 80,
      autoSuspendHighRisk: true
    },
    content: {
      maxPostLength: 2000,
      maxCommentLength: 500,
      maxImageSize: 10,
      maxVideoSize: 100,
      allowedVideoFormats: ['mp4', 'mov', 'avi', 'webm'],
      allowedImageFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      moderationEnabled: true,
      autoModerationThreshold: 75,
      requireApprovalForAds: true,
      maxHashtagsPerPost: 10
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      marketingEmails: false,
      systemAlerts: true,
      disputeNotifications: true,
      maintenanceNotifications: true,
      securityAlerts: true
    },
    limits: {
      maxUsersPerDay: 1000,
      maxTransactionsPerUser: 100,
      maxWithdrawalsPerDay: 10,
      apiRateLimit: 1000,
      maxConcurrentSessions: 5,
      maxFriendsPerUser: 5000,
      maxGroupsPerUser: 100,
      maxPostsPerDay: 50
    }
  });

  const [originalSettings, setOriginalSettings] = useState<PlatformSettings>(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveReason, setSaveReason] = useState('');
  const [configHistory, setConfigHistory] = useState<ConfigurationHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Check for changes
  useEffect(() => {
    const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setHasChanges(hasChanges);
  }, [settings, originalSettings]);

  const updateSetting = (section: keyof PlatformSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const saveSettings = async () => {
    if (!saveReason.trim()) return;

    setLoading(true);
    
    // Calculate changes
    const changes: { field: string; oldValue: any; newValue: any }[] = [];
    Object.keys(settings).forEach(section => {
      Object.keys(settings[section as keyof PlatformSettings]).forEach(field => {
        const oldValue = (originalSettings[section as keyof PlatformSettings] as any)[field];
        const newValue = (settings[section as keyof PlatformSettings] as any)[field];
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          changes.push({
            field: `${section}.${field}`,
            oldValue,
            newValue
          });
        }
      });
    });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Add to history
    const historyEntry: ConfigurationHistory = {
      id: Date.now().toString(),
      section: activeTab,
      changes,
      changedBy: 'current_admin',
      timestamp: new Date().toISOString(),
      reason: saveReason
    };

    setConfigHistory(prev => [historyEntry, ...prev]);
    setOriginalSettings(settings);
    setHasChanges(false);
    setLoading(false);
    setShowSaveModal(false);
    setSaveReason('');
  };

  const resetSettings = () => {
    setSettings(originalSettings);
    setHasChanges(false);
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `platform-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings.general.defaultCurrency
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Platform Settings</h1>
          <p className="text-gray-600">Configure platform-wide settings and parameters</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <Alert className="mr-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You have unsaved changes
              </AlertDescription>
            </Alert>
          )}
          
          <Button variant="outline" onClick={exportSettings}>
            <FileText className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline" onClick={resetSettings} disabled={!hasChanges}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          
          <Button 
            onClick={() => setShowSaveModal(true)} 
            disabled={!hasChanges}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="fees">Fees & Pricing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="limits">Limits</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>General Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Platform Name</Label>
                  <Input
                    value={settings.general.platformName}
                    onChange={(e) => updateSetting('general', 'platformName', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Support Email</Label>
                  <Input
                    type="email"
                    value={settings.general.supportEmail}
                    onChange={(e) => updateSetting('general', 'supportEmail', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Default Currency</Label>
                  <Select 
                    value={settings.general.defaultCurrency} 
                    onValueChange={(value) => updateSetting('general', 'defaultCurrency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Default Language</Label>
                  <Select 
                    value={settings.general.defaultLanguage} 
                    onValueChange={(value) => updateSetting('general', 'defaultLanguage', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Platform Description</Label>
                <Textarea
                  value={settings.general.description}
                  onChange={(e) => updateSetting('general', 'description', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label>Max File Upload Size (MB)</Label>
                  <Input
                    type="number"
                    value={settings.general.maxFileUploadSize}
                    onChange={(e) => updateSetting('general', 'maxFileUploadSize', parseInt(e.target.value))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.general.maintenanceMode}
                    onCheckedChange={(checked) => updateSetting('general', 'maintenanceMode', checked)}
                  />
                  <Label>Maintenance Mode</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.general.registrationEnabled}
                    onCheckedChange={(checked) => updateSetting('general', 'registrationEnabled', checked)}
                  />
                  <Label>Registration Enabled</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Fees & Pricing Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label>Transaction Fee (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={settings.fees.transactionFee}
                    onChange={(e) => updateSetting('fees', 'transactionFee', parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current: {settings.fees.transactionFee}% per transaction
                  </p>
                </div>
                <div>
                  <Label>Withdrawal Fee (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={settings.fees.withdrawalFee}
                    onChange={(e) => updateSetting('fees', 'withdrawalFee', parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current: {settings.fees.withdrawalFee}% per withdrawal
                  </p>
                </div>
                <div>
                  <Label>Freelance Commission (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={settings.fees.freelanceCommission}
                    onChange={(e) => updateSetting('fees', 'freelanceCommission', parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current: {settings.fees.freelanceCommission}% per project
                  </p>
                </div>
                <div>
                  <Label>Marketplace Commission (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={settings.fees.marketplaceCommission}
                    onChange={(e) => updateSetting('fees', 'marketplaceCommission', parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current: {settings.fees.marketplaceCommission}% per sale
                  </p>
                </div>
                <div>
                  <Label>Crypto Trading Fee (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={settings.fees.cryptoTradingFee}
                    onChange={(e) => updateSetting('fees', 'cryptoTradingFee', parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current: {settings.fees.cryptoTradingFee}% per trade
                  </p>
                </div>
                <div>
                  <Label>Campaign Boost Fee (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={settings.fees.campaignBoostFee}
                    onChange={(e) => updateSetting('fees', 'campaignBoostFee', parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current: {settings.fees.campaignBoostFee}% per boost
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Premium Subscription Price ({settings.general.defaultCurrency})</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={settings.fees.premiumSubscriptionPrice}
                    onChange={(e) => updateSetting('fees', 'premiumSubscriptionPrice', parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current: {formatCurrency(settings.fees.premiumSubscriptionPrice)}/month
                  </p>
                </div>
                <div>
                  <Label>Processing Fee ({settings.general.defaultCurrency})</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={settings.fees.processingFee}
                    onChange={(e) => updateSetting('fees', 'processingFee', parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current: {formatCurrency(settings.fees.processingFee)} per transaction
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Minimum Withdrawal ({settings.general.defaultCurrency})</Label>
                  <Input
                    type="number"
                    value={settings.fees.minimumWithdrawal}
                    onChange={(e) => updateSetting('fees', 'minimumWithdrawal', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Maximum Withdrawal ({settings.general.defaultCurrency})</Label>
                  <Input
                    type="number"
                    value={settings.fees.maximumWithdrawal}
                    onChange={(e) => updateSetting('fees', 'maximumWithdrawal', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Security Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label>Password Min Length</Label>
                  <Input
                    type="number"
                    min="6"
                    max="32"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Max Login Attempts</Label>
                  <Input
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Lockout Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={settings.security.lockoutDuration}
                    onChange={(e) => updateSetting('security', 'lockoutDuration', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Suspicious Activity Threshold</Label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={settings.security.suspiciousActivityThreshold}
                    onChange={(e) => updateSetting('security', 'suspiciousActivityThreshold', parseInt(e.target.value))}
                  />
                  <p className="text-xs text-gray-500 mt-1">Risk score 1-100</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.security.requireTwoFactor}
                      onCheckedChange={(checked) => updateSetting('security', 'requireTwoFactor', checked)}
                    />
                    <Label>Require Two-Factor Authentication</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.security.requireVerificationForWithdrawals}
                      onCheckedChange={(checked) => updateSetting('security', 'requireVerificationForWithdrawals', checked)}
                    />
                    <Label>Require Verification for Withdrawals</Label>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.security.ipWhitelisting}
                      onCheckedChange={(checked) => updateSetting('security', 'ipWhitelisting', checked)}
                    />
                    <Label>Enable IP Whitelisting</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.security.autoSuspendHighRisk}
                      onCheckedChange={(checked) => updateSetting('security', 'autoSuspendHighRisk', checked)}
                    />
                    <Label>Auto-Suspend High Risk Users</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Content Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label>Max Post Length (characters)</Label>
                  <Input
                    type="number"
                    value={settings.content.maxPostLength}
                    onChange={(e) => updateSetting('content', 'maxPostLength', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Max Comment Length (characters)</Label>
                  <Input
                    type="number"
                    value={settings.content.maxCommentLength}
                    onChange={(e) => updateSetting('content', 'maxCommentLength', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Max Hashtags Per Post</Label>
                  <Input
                    type="number"
                    value={settings.content.maxHashtagsPerPost}
                    onChange={(e) => updateSetting('content', 'maxHashtagsPerPost', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Max Image Size (MB)</Label>
                  <Input
                    type="number"
                    value={settings.content.maxImageSize}
                    onChange={(e) => updateSetting('content', 'maxImageSize', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Max Video Size (MB)</Label>
                  <Input
                    type="number"
                    value={settings.content.maxVideoSize}
                    onChange={(e) => updateSetting('content', 'maxVideoSize', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Auto-Moderation Threshold</Label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={settings.content.autoModerationThreshold}
                    onChange={(e) => updateSetting('content', 'autoModerationThreshold', parseInt(e.target.value))}
                  />
                  <p className="text-xs text-gray-500 mt-1">Score 1-100</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.content.moderationEnabled}
                    onCheckedChange={(checked) => updateSetting('content', 'moderationEnabled', checked)}
                  />
                  <Label>Enable Content Moderation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.content.requireApprovalForAds}
                    onCheckedChange={(checked) => updateSetting('content', 'requireApprovalForAds', checked)}
                  />
                  <Label>Require Approval for Advertisements</Label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Allowed Image Formats</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {settings.content.allowedImageFormats.map((format, index) => (
                      <Badge key={index} variant="outline">{format}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Allowed Video Formats</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {settings.content.allowedVideoFormats.map((format, index) => (
                      <Badge key={index} variant="outline">{format}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notification Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Communication Channels</h4>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
                    />
                    <Label>Email Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.notifications.pushNotifications}
                      onCheckedChange={(checked) => updateSetting('notifications', 'pushNotifications', checked)}
                    />
                    <Label>Push Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.notifications.smsNotifications}
                      onCheckedChange={(checked) => updateSetting('notifications', 'smsNotifications', checked)}
                    />
                    <Label>SMS Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.notifications.marketingEmails}
                      onCheckedChange={(checked) => updateSetting('notifications', 'marketingEmails', checked)}
                    />
                    <Label>Marketing Emails</Label>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">System Notifications</h4>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.notifications.systemAlerts}
                      onCheckedChange={(checked) => updateSetting('notifications', 'systemAlerts', checked)}
                    />
                    <Label>System Alerts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.notifications.disputeNotifications}
                      onCheckedChange={(checked) => updateSetting('notifications', 'disputeNotifications', checked)}
                    />
                    <Label>Dispute Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.notifications.maintenanceNotifications}
                      onCheckedChange={(checked) => updateSetting('notifications', 'maintenanceNotifications', checked)}
                    />
                    <Label>Maintenance Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.notifications.securityAlerts}
                      onCheckedChange={(checked) => updateSetting('notifications', 'securityAlerts', checked)}
                    />
                    <Label>Security Alerts</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="w-5 h-5" />
                <span>Platform Limits</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label>Max Users Per Day</Label>
                  <Input
                    type="number"
                    value={settings.limits.maxUsersPerDay}
                    onChange={(e) => updateSetting('limits', 'maxUsersPerDay', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Max Transactions Per User</Label>
                  <Input
                    type="number"
                    value={settings.limits.maxTransactionsPerUser}
                    onChange={(e) => updateSetting('limits', 'maxTransactionsPerUser', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Max Withdrawals Per Day</Label>
                  <Input
                    type="number"
                    value={settings.limits.maxWithdrawalsPerDay}
                    onChange={(e) => updateSetting('limits', 'maxWithdrawalsPerDay', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>API Rate Limit (req/min)</Label>
                  <Input
                    type="number"
                    value={settings.limits.apiRateLimit}
                    onChange={(e) => updateSetting('limits', 'apiRateLimit', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Max Concurrent Sessions</Label>
                  <Input
                    type="number"
                    value={settings.limits.maxConcurrentSessions}
                    onChange={(e) => updateSetting('limits', 'maxConcurrentSessions', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Max Posts Per Day</Label>
                  <Input
                    type="number"
                    value={settings.limits.maxPostsPerDay}
                    onChange={(e) => updateSetting('limits', 'maxPostsPerDay', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Max Friends Per User</Label>
                  <Input
                    type="number"
                    value={settings.limits.maxFriendsPerUser}
                    onChange={(e) => updateSetting('limits', 'maxFriendsPerUser', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Max Groups Per User</Label>
                  <Input
                    type="number"
                    value={settings.limits.maxGroupsPerUser}
                    onChange={(e) => updateSetting('limits', 'maxGroupsPerUser', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Configuration History */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {configHistory.map((entry) => (
              <div key={entry.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {entry.section.charAt(0).toUpperCase() + entry.section.slice(1)} Settings Updated
                    </p>
                    <p className="text-sm text-gray-600">
                      {entry.changes.length} change{entry.changes.length !== 1 ? 's' : ''}: {entry.reason}
                    </p>
                    <div className="mt-1">
                      {entry.changes.slice(0, 3).map((change, index) => (
                        <Badge key={index} variant="outline" className="text-xs mr-1">
                          {change.field}
                        </Badge>
                      ))}
                      {entry.changes.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{entry.changes.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{new Date(entry.timestamp).toLocaleString()}</p>
                    <p>by {entry.changedBy}</p>
                  </div>
                </div>
              </div>
            ))}
            {configHistory.length === 0 && (
              <p className="text-gray-500 text-center py-8">No configuration changes yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save Modal */}
      <Dialog open={showSaveModal} onOpenChange={setShowSaveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Configuration Changes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Reason for Changes *</Label>
              <Textarea
                placeholder="Provide a reason for these configuration changes..."
                value={saveReason}
                onChange={(e) => setSaveReason(e.target.value)}
                rows={3}
              />
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                These changes will affect the entire platform and all users. Please ensure you have reviewed all modifications carefully.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowSaveModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={saveSettings} 
                disabled={!saveReason.trim() || loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
