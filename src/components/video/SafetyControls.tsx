import React, { useState, useEffect } from "react";
import {
  Shield,
  Flag,
  AlertTriangle,
  Eye,
  EyeOff,
  Settings,
  UserX,
  MessageSquareOff,
  Bell,
  BellOff,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Filter,
  Search,
  MoreHorizontal,
  Archive,
  Trash2,
  AlertCircle,
  Info,
  Star,
  Heart,
  ThumbsDown,
  Ban,
  Volume2,
  VolumeX,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  UserCheck,
  Activity,
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Zap,
  Target,
  Award,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import abusePreventionService, {
  ContentReport,
  UserSuspension,
  ContentModerationAction,
  TrustScore,
  AbusePreventionUtils,
} from "@/services/abusePreventionService";
import { formatDistanceToNow } from "date-fns";

interface SafetyControlsProps {
  contentId?: string;
  contentType?: "duet" | "battle" | "highlight" | "comment" | "profile" | "message";
  contentOwnerId?: string;
  isOpen: boolean;
  onClose: () => void;
  triggerType?: "report" | "privacy" | "moderation" | "trust";
}

const SafetyControls: React.FC<SafetyControlsProps> = ({
  contentId,
  contentType,
  contentOwnerId,
  isOpen,
  onClose,
  triggerType = "privacy",
}) => {
  const { toast } = useToast();
  
  // State
  const [activeTab, setActiveTab] = useState(triggerType === "report" ? "report" : "privacy");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    allowDirectMessages: true,
    allowBattleInvites: true,
    allowMentions: true,
    allowTagging: true,
    restrictToFollowers: false,
    contentFiltering: "moderate" as "strict" | "moderate" | "off",
  });
  
  // Report state
  const [reportData, setReportData] = useState({
    reason: "",
    description: "",
    evidence: [] as string[],
  });
  
  // Blocked users
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [moderationActions, setModerationActions] = useState<ContentModerationAction[]>([]);
  const [trustScore, setTrustScore] = useState<TrustScore | null>(null);
  const [suspensions, setSuspensions] = useState<UserSuspension[]>([]);
  
  // Load data when component opens
  useEffect(() => {
    if (isOpen) {
      loadSafetyData();
    }
  }, [isOpen]);
  
  const loadSafetyData = async () => {
    try {
      await Promise.all([
        loadPrivacySettings(),
        loadBlockedUsers(),
        loadUserReports(),
        loadModerationActions(),
        loadTrustScore(),
        loadSuspensions(),
      ]);
    } catch (error) {
      console.error("Failed to load safety data:", error);
    }
  };
  
  const loadPrivacySettings = async () => {
    try {
      const settings = await abusePreventionService.getPrivacySettings();
      setPrivacySettings(settings);
    } catch (error) {
      console.error("Failed to load privacy settings:", error);
    }
  };
  
  const loadBlockedUsers = async () => {
    try {
      const users = await abusePreventionService.getBlockedUsers();
      setBlockedUsers(users);
    } catch (error) {
      console.error("Failed to load blocked users:", error);
    }
  };
  
  const loadUserReports = async () => {
    try {
      const userReports = await abusePreventionService.getUserReports();
      setReports(userReports);
    } catch (error) {
      console.error("Failed to load user reports:", error);
    }
  };
  
  const loadModerationActions = async () => {
    try {
      const actions = await abusePreventionService.getUserModerationActions();
      setModerationActions(actions);
    } catch (error) {
      console.error("Failed to load moderation actions:", error);
    }
  };
  
  const loadTrustScore = async () => {
    try {
      const score = await abusePreventionService.getUserTrustScore();
      setTrustScore(score);
    } catch (error) {
      console.error("Failed to load trust score:", error);
    }
  };
  
  const loadSuspensions = async () => {
    try {
      const userSuspensions = await abusePreventionService.getUserSuspensions();
      setSuspensions(userSuspensions);
    } catch (error) {
      console.error("Failed to load suspensions:", error);
    }
  };
  
  const handleReportContent = async () => {
    if (!contentId || !contentType || !reportData.reason) {
      toast({
        title: "Missing Information",
        description: "Please select a reason for reporting.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await abusePreventionService.reportContent({
        contentType,
        contentId,
        reason: reportData.reason,
        description: reportData.description,
        evidence: reportData.evidence,
      });
      
      toast({
        title: "Report Submitted",
        description: "Thank you for helping keep our community safe. We'll review your report.",
      });
      
      // Reset form
      setReportData({
        reason: "",
        description: "",
        evidence: [],
      });
      
      // Reload reports
      loadUserReports();
      
    } catch (error: any) {
      toast({
        title: "Failed to Submit Report",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdatePrivacySettings = async () => {
    setIsSubmitting(true);
    
    try {
      await abusePreventionService.updatePrivacySettings(privacySettings);
      
      toast({
        title: "Privacy Settings Updated",
        description: "Your privacy preferences have been saved.",
      });
      
    } catch (error: any) {
      toast({
        title: "Failed to Update Settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleBlockUser = async (userId: string, reason?: string) => {
    try {
      await abusePreventionService.blockUser(userId, reason);
      
      toast({
        title: "User Blocked",
        description: "You will no longer see content from this user.",
      });
      
      loadBlockedUsers();
      
    } catch (error: any) {
      toast({
        title: "Failed to Block User",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleUnblockUser = async (userId: string) => {
    try {
      await abusePreventionService.unblockUser(userId);
      
      toast({
        title: "User Unblocked",
        description: "You can now see content from this user again.",
      });
      
      loadBlockedUsers();
      
    } catch (error: any) {
      toast({
        title: "Failed to Unblock User",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleAppealAction = async (actionId: string, reason: string) => {
    try {
      await abusePreventionService.appealModerationAction(actionId, reason);
      
      toast({
        title: "Appeal Submitted",
        description: "Your appeal has been submitted for review.",
      });
      
      loadModerationActions();
      
    } catch (error: any) {
      toast({
        title: "Failed to Submit Appeal",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case "spam": return <Archive className="w-4 h-4" />;
      case "harassment": return <AlertTriangle className="w-4 h-4" />;
      case "inappropriate": return <EyeOff className="w-4 h-4" />;
      case "fraud": return <Ban className="w-4 h-4" />;
      case "copyright": return <Shield className="w-4 h-4" />;
      case "violence": return <AlertCircle className="w-4 h-4" />;
      case "hate_speech": return <XCircle className="w-4 h-4" />;
      case "misinformation": return <Info className="w-4 h-4" />;
      default: return <Flag className="w-4 h-4" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-400";
      case "reviewing": return "bg-blue-500/20 text-blue-400";
      case "resolved": return "bg-green-500/20 text-green-400";
      case "dismissed": return "bg-gray-500/20 text-gray-400";
      case "active": return "bg-red-500/20 text-red-400";
      case "appealed": return "bg-purple-500/20 text-purple-400";
      case "reversed": return "bg-green-500/20 text-green-400";
      case "expired": return "bg-gray-500/20 text-gray-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };
  
  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };
  
  const formatNumber = (num: number) => {
    return num.toFixed(0);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            Safety & Privacy Controls
          </DialogTitle>
          <DialogDescription>
            Manage your privacy settings, report content, and view your account status
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800">
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="blocked">Blocked</TabsTrigger>
            <TabsTrigger value="report">Report</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
            <TabsTrigger value="trust">Trust Score</TabsTrigger>
          </TabsList>
          
          {/* Privacy Settings Tab */}
          <TabsContent value="privacy" className="space-y-4">
            <ScrollArea className="h-[500px]">
              <div className="space-y-4 pr-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Communication Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquareOff className="w-4 h-4 text-blue-400" />
                        <div>
                          <Label>Allow Direct Messages</Label>
                          <p className="text-xs text-gray-400">Let others send you private messages</p>
                        </div>
                      </div>
                      <Switch
                        checked={privacySettings.allowDirectMessages}
                        onCheckedChange={(checked) => 
                          setPrivacySettings(prev => ({ ...prev, allowDirectMessages: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-400" />
                        <div>
                          <Label>Allow Battle Invites</Label>
                          <p className="text-xs text-gray-400">Let others invite you to battles</p>
                        </div>
                      </div>
                      <Switch
                        checked={privacySettings.allowBattleInvites}
                        onCheckedChange={(checked) => 
                          setPrivacySettings(prev => ({ ...prev, allowBattleInvites: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-yellow-400" />
                        <div>
                          <Label>Allow Mentions</Label>
                          <p className="text-xs text-gray-400">Let others mention you in content</p>
                        </div>
                      </div>
                      <Switch
                        checked={privacySettings.allowMentions}
                        onCheckedChange={(checked) => 
                          setPrivacySettings(prev => ({ ...prev, allowMentions: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-green-400" />
                        <div>
                          <Label>Allow Tagging in Content</Label>
                          <p className="text-xs text-gray-400">Let others tag you in their content</p>
                        </div>
                      </div>
                      <Switch
                        checked={privacySettings.allowTagging}
                        onCheckedChange={(checked) => 
                          setPrivacySettings(prev => ({ ...prev, allowTagging: checked }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Content & Visibility</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-orange-400" />
                        <div>
                          <Label>Restrict to Followers</Label>
                          <p className="text-xs text-gray-400">Only followers can interact with your content</p>
                        </div>
                      </div>
                      <Switch
                        checked={privacySettings.restrictToFollowers}
                        onCheckedChange={(checked) => 
                          setPrivacySettings(prev => ({ ...prev, restrictToFollowers: checked }))
                        }
                      />
                    </div>
                    
                    <div>
                      <Label className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-red-400" />
                        Content Filtering Level
                      </Label>
                      <Select
                        value={privacySettings.contentFiltering}
                        onValueChange={(value: "strict" | "moderate" | "off") =>
                          setPrivacySettings(prev => ({ ...prev, contentFiltering: value }))
                        }
                      >
                        <SelectTrigger className="mt-2 bg-gray-700 border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="strict">Strict - Hide most potentially inappropriate content</SelectItem>
                          <SelectItem value="moderate">Moderate - Hide obviously inappropriate content</SelectItem>
                          <SelectItem value="off">Off - Show all content</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-400 mt-1">
                        Controls what type of content you see from others
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Button
                  onClick={handleUpdatePrivacySettings}
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? "Saving..." : "Save Privacy Settings"}
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>
          
          {/* Blocked Users Tab */}
          <TabsContent value="blocked" className="space-y-4">
            <ScrollArea className="h-[500px]">
              <div className="space-y-3 pr-4">
                {blockedUsers.length > 0 ? (
                  blockedUsers.map((user) => (
                    <Card key={user.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.displayName}</div>
                              <div className="text-sm text-gray-400">@{user.username}</div>
                              {user.reason && (
                                <div className="text-xs text-gray-500">Reason: {user.reason}</div>
                              )}
                              <div className="text-xs text-gray-500">
                                Blocked {formatDistanceToNow(new Date(user.blockedAt))} ago
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            onClick={() => handleUnblockUser(user.id)}
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            Unblock
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <UserX className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Blocked Users</h3>
                    <p className="text-gray-400">
                      Users you block will appear here. You can unblock them at any time.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          {/* Report Content Tab */}
          <TabsContent value="report" className="space-y-4">
            <ScrollArea className="h-[500px]">
              <div className="space-y-4 pr-4">
                {contentId && contentType ? (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-lg">Report This Content</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>What's the issue?</Label>
                        <Select
                          value={reportData.reason}
                          onValueChange={(value) => setReportData(prev => ({ ...prev, reason: value }))}
                        >
                          <SelectTrigger className="mt-2 bg-gray-700 border-gray-600">
                            <SelectValue placeholder="Select a reason" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="spam">Spam or repetitive content</SelectItem>
                            <SelectItem value="harassment">Harassment or bullying</SelectItem>
                            <SelectItem value="inappropriate">Inappropriate content</SelectItem>
                            <SelectItem value="fraud">Fraudulent activity</SelectItem>
                            <SelectItem value="copyright">Copyright violation</SelectItem>
                            <SelectItem value="violence">Violence or dangerous content</SelectItem>
                            <SelectItem value="hate_speech">Hate speech</SelectItem>
                            <SelectItem value="misinformation">Misinformation</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="report-description">Additional Details (Optional)</Label>
                        <Textarea
                          id="report-description"
                          value={reportData.description}
                          onChange={(e) => setReportData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Please provide any additional context that would help us understand the issue..."
                          className="mt-2 bg-gray-700 border-gray-600"
                          rows={4}
                        />
                      </div>
                      
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Info className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-medium text-blue-400">How Reporting Works</span>
                        </div>
                        <ul className="text-xs text-blue-200 space-y-1">
                          <li>• Reports are reviewed by our moderation team</li>
                          <li>• False reports may result in restrictions on your account</li>
                          <li>• We'll take appropriate action if content violates our guidelines</li>
                        </ul>
                      </div>
                      
                      <Button
                        onClick={handleReportContent}
                        disabled={!reportData.reason || isSubmitting}
                        className="w-full bg-red-600 hover:bg-red-700"
                      >
                        {isSubmitting ? "Submitting Report..." : "Submit Report"}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-8 text-center">
                      <Flag className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Content to Report</h3>
                      <p className="text-gray-400">
                        Use the report button on specific content to report violations.
                      </p>
                    </CardContent>
                  </Card>
                )}
                
                {/* Previous Reports */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Your Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {reports.slice(0, 5).map((report) => (
                        <div key={report.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div className="flex items-center gap-3">
                            {getReasonIcon(report.reason)}
                            <div>
                              <div className="font-medium text-sm capitalize">
                                {report.reason.replace("_", " ")}
                              </div>
                              <div className="text-xs text-gray-400">
                                {formatDistanceToNow(new Date(report.createdAt))} ago
                              </div>
                            </div>
                          </div>
                          
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                        </div>
                      ))}
                      
                      {reports.length === 0 && (
                        <div className="text-center text-gray-400 py-4">
                          No reports submitted yet
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>
          
          {/* Moderation Tab */}
          <TabsContent value="moderation" className="space-y-4">
            <ScrollArea className="h-[500px]">
              <div className="space-y-4 pr-4">
                {/* Active Suspensions */}
                {suspensions.length > 0 && (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-lg text-red-400">Active Restrictions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {suspensions.filter(s => s.isActive).map((suspension) => (
                          <div key={suspension.id} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-400" />
                                <span className="font-medium text-red-400 capitalize">
                                  {suspension.type.replace("_", " ")}
                                </span>
                              </div>
                              {suspension.expiresAt && (
                                <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                                  Expires {formatDistanceToNow(new Date(suspension.expiresAt))}
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-300 mb-2">{suspension.reason}</div>
                            {suspension.description && (
                              <div className="text-xs text-gray-400">{suspension.description}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Moderation Actions */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Moderation History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {moderationActions.slice(0, 5).map((action) => (
                        <div key={action.id} className="p-3 bg-gray-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-orange-400" />
                              <span className="font-medium capitalize">
                                {action.action.replace("_", " ")}
                              </span>
                            </div>
                            <Badge className={getStatusColor(action.status)}>
                              {action.status}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-gray-300 mb-1">
                            {AbusePreventionUtils.formatModerationReason(action.reason, action.action)}
                          </div>
                          
                          <div className="text-xs text-gray-400">
                            {formatDistanceToNow(new Date(action.createdAt))} ago
                          </div>
                          
                          {action.appealable && !action.appealSubmitted && action.status === "active" && (
                            <Button
                              onClick={() => handleAppealAction(action.id, "I believe this action was taken in error")}
                              variant="outline"
                              size="sm"
                              className="mt-2 border-blue-500 text-blue-400 hover:bg-blue-500/20"
                            >
                              Appeal This Action
                            </Button>
                          )}
                          
                          {action.appealSubmitted && (
                            <div className="text-xs text-blue-400 mt-2">
                              Appeal submitted - {action.appealStatus}
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {moderationActions.length === 0 && (
                        <div className="text-center text-gray-400 py-4">
                          No moderation actions on your account
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>
          
          {/* Trust Score Tab */}
          <TabsContent value="trust" className="space-y-4">
            <ScrollArea className="h-[500px]">
              <div className="space-y-4 pr-4">
                {trustScore ? (
                  <>
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-lg">Trust Score</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className={cn("text-4xl font-bold", getTrustScoreColor(trustScore.overallScore))}>
                            {formatNumber(trustScore.overallScore)}
                          </div>
                          <div className="text-sm text-gray-400">out of 100</div>
                          <Badge className={cn(
                            "mt-2",
                            trustScore.riskLevel === "very_low" && "bg-green-500/20 text-green-400",
                            trustScore.riskLevel === "low" && "bg-blue-500/20 text-blue-400",
                            trustScore.riskLevel === "medium" && "bg-yellow-500/20 text-yellow-400",
                            trustScore.riskLevel === "high" && "bg-orange-500/20 text-orange-400",
                            trustScore.riskLevel === "very_high" && "bg-red-500/20 text-red-400"
                          )}>
                            {trustScore.riskLevel.replace("_", " ")} risk
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>Account Age</span>
                              <span>{formatNumber(trustScore.factors.accountAge)}%</span>
                            </div>
                            <Progress value={trustScore.factors.accountAge} className="h-2 mt-1" />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>Verification Status</span>
                              <span>{formatNumber(trustScore.factors.verificationStatus)}%</span>
                            </div>
                            <Progress value={trustScore.factors.verificationStatus} className="h-2 mt-1" />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>Community Standing</span>
                              <span>{formatNumber(trustScore.factors.communityStanding)}%</span>
                            </div>
                            <Progress value={trustScore.factors.communityStanding} className="h-2 mt-1" />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>Content Quality</span>
                              <span>{formatNumber(trustScore.factors.contentQuality)}%</span>
                            </div>
                            <Progress value={trustScore.factors.contentQuality} className="h-2 mt-1" />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>Engagement History</span>
                              <span>{formatNumber(trustScore.factors.engagementHistory)}%</span>
                            </div>
                            <Progress value={trustScore.factors.engagementHistory} className="h-2 mt-1" />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>Behavior Pattern</span>
                              <span>{formatNumber(trustScore.factors.behaviorPattern)}%</span>
                            </div>
                            <Progress value={trustScore.factors.behaviorPattern} className="h-2 mt-1" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-lg">How to Improve Your Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Continue creating quality content</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Engage positively with the community</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Follow community guidelines</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-blue-400" />
                            <span>Complete account verification</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-purple-400" />
                            <span>Maintain a positive reputation</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-8 text-center">
                      <Activity className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Trust Score Loading</h3>
                      <p className="text-gray-400">
                        Your trust score is being calculated based on your activity.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SafetyControls;
