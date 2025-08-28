import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  UserPlus,
  Share,
  Copy,
  Mail,
  MessageCircle,
  Gift,
  Crown,
  Users,
  TrendingUp,
  Award,
  Zap,
  ExternalLink,
  Check,
  X,
  Sparkles,
  Send,
  QrCode,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface UserInvitationSystemProps {
  currentUser?: {
    id: string;
    username: string;
    isPremium: boolean;
    referralCode: string;
    totalReferrals: number;
    successfulReferrals: number;
    referralEarnings: number;
  };
  onClose?: () => void;
  className?: string;
}

interface ReferralReward {
  id: string;
  type: "coins" | "premium" | "gift" | "badge";
  value: number | string;
  description: string;
  icon: React.ReactNode;
  requirement: string;
  completed: boolean;
}

interface InvitationMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  action: () => void;
  color: string;
}

interface PendingInvitation {
  id: string;
  email?: string;
  phone?: string;
  platform: string;
  status: "pending" | "accepted" | "expired";
  sentAt: string;
  reward?: string;
}

export const UserInvitationSystem: React.FC<UserInvitationSystemProps> = ({
  currentUser = {
    id: "user1",
    username: "demo_user",
    isPremium: false,
    referralCode: "DEMO2024",
    totalReferrals: 0,
    successfulReferrals: 0,
    referralEarnings: 0,
  },
  onClose,
  className,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("invite");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<PendingInvitation[]>([]);
  const [referralRewards, setReferralRewards] = useState<ReferralReward[]>([]);

  const referralLink = `https://eloity.app/join?ref=${currentUser.referralCode}`;
  
  useEffect(() => {
    // Initialize referral rewards
    setReferralRewards([
      {
        id: "first_invite",
        type: "coins",
        value: 100,
        description: "First successful invitation",
        icon: <Gift className="w-5 h-5" />,
        requirement: "1 successful referral",
        completed: currentUser.successfulReferrals >= 1,
      },
      {
        id: "five_invites",
        type: "premium",
        value: "7 days",
        description: "Premium access for 7 days",
        icon: <Crown className="w-5 h-5" />,
        requirement: "5 successful referrals",
        completed: currentUser.successfulReferrals >= 5,
      },
      {
        id: "ten_invites",
        type: "badge",
        value: "Influencer",
        description: "Special Influencer badge",
        icon: <Award className="w-5 h-5" />,
        requirement: "10 successful referrals",
        completed: currentUser.successfulReferrals >= 10,
      },
      {
        id: "twenty_invites",
        type: "coins",
        value: 1000,
        description: "Mega reward bonus",
        icon: <Sparkles className="w-5 h-5" />,
        requirement: "20 successful referrals",
        completed: currentUser.successfulReferrals >= 20,
      },
    ]);

    // Mock pending invitations
    setPendingInvites([
      {
        id: "1",
        email: "friend@example.com",
        platform: "email",
        status: "pending",
        sentAt: "2024-01-15T10:30:00Z",
        reward: "100 coins",
      },
      {
        id: "2",
        phone: "+1234567890",
        platform: "sms",
        status: "accepted",
        sentAt: "2024-01-14T15:20:00Z",
        reward: "100 coins",
      },
    ]);
  }, [currentUser.successfulReferrals]);

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Referral link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  const shareReferralLink = async (platform: string) => {
    const shareData = {
      title: "Join Eloity!",
      text: `Hey! Join me on Eloity, the amazing social platform. Use my referral link to get started: ${referralLink}`,
      url: referralLink,
    };

    if (navigator.share && platform === "native") {
      try {
        await navigator.share(shareData);
        toast({
          title: "Shared Successfully",
          description: "Your referral link has been shared",
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback for specific platforms
      let shareUrl = "";
      
      switch (platform) {
        case "whatsapp":
          shareUrl = `https://wa.me/?text=${encodeURIComponent(shareData.text)}`;
          break;
        case "telegram":
          shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareData.text)}`;
          break;
        case "twitter":
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}`;
          break;
        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
          break;
        default:
          copyReferralLink();
          return;
      }
      
      if (shareUrl) {
        window.open(shareUrl, "_blank", "width=600,height=400");
        toast({
          title: "Opening Share Dialog",
          description: `Sharing via ${platform}`,
        });
      }
    }
  };

  const sendEmailInvite = async () => {
    if (!inviteEmail) {
      toast({
        title: "Email Required",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate API call
      const newInvite: PendingInvitation = {
        id: Date.now().toString(),
        email: inviteEmail,
        platform: "email",
        status: "pending",
        sentAt: new Date().toISOString(),
        reward: "100 coins",
      };

      setPendingInvites(prev => [newInvite, ...prev]);
      setInviteEmail("");
      
      toast({
        title: "Invitation Sent!",
        description: `Invitation sent to ${inviteEmail}`,
      });
    } catch (error) {
      toast({
        title: "Send Failed",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    }
  };

  const generateQRCode = () => {
    // In a real app, you'd generate a proper QR code
    toast({
      title: "QR Code",
      description: "QR code generation feature coming soon!",
    });
  };

  const invitationMethods: InvitationMethod[] = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: <MessageCircle className="w-5 h-5" />,
      description: "Share via WhatsApp",
      action: () => shareReferralLink("whatsapp"),
      color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    },
    {
      id: "telegram",
      name: "Telegram",
      icon: <Send className="w-5 h-5" />,
      description: "Share via Telegram",
      action: () => shareReferralLink("telegram"),
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    },
    {
      id: "twitter",
      name: "Twitter",
      icon: <ExternalLink className="w-5 h-5" />,
      description: "Share on Twitter",
      action: () => shareReferralLink("twitter"),
      color: "bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: <Share className="w-5 h-5" />,
      description: "Share on Facebook",
      action: () => shareReferralLink("facebook"),
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    },
    {
      id: "copy",
      name: "Copy Link",
      icon: <Copy className="w-5 h-5" />,
      description: "Copy referral link",
      action: copyReferralLink,
      color: "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400",
    },
    {
      id: "qr",
      name: "QR Code",
      icon: <QrCode className="w-5 h-5" />,
      description: "Show QR code",
      action: generateQRCode,
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
    },
  ];

  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl">
          <UserPlus className="w-6 h-6 text-primary" />
          Invite Friends & Earn Rewards
        </CardTitle>
        <p className="text-muted-foreground">
          Share Eloity with friends and earn amazing rewards together!
        </p>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="invite">Invite</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
          </TabsList>

          {/* Invite Tab */}
          <TabsContent value="invite" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-primary">{currentUser.totalReferrals}</div>
                <div className="text-sm text-muted-foreground">Total Invites</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-green-600">{currentUser.successfulReferrals}</div>
                <div className="text-sm text-muted-foreground">Successful</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-yellow-600">{currentUser.referralEarnings}</div>
                <div className="text-sm text-muted-foreground">Coins Earned</div>
              </Card>
            </div>

            {/* Referral Link */}
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <h3 className="font-semibold mb-2">Your Referral Link</h3>
              <div className="flex gap-2">
                <Input
                  value={referralLink}
                  readOnly
                  className="flex-1 font-mono text-sm"
                />
                <Button onClick={copyReferralLink} variant="outline">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Share this link with friends to earn rewards when they join!
              </p>
            </Card>

            {/* Email Invitation */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Send Email Invitation</h3>
              <div className="space-y-3">
                <Input
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  type="email"
                />
                <Button onClick={sendEmailInvite} className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invitation
                </Button>
              </div>
            </Card>

            {/* Share Methods */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Share via Social Media</h3>
              <div className="grid grid-cols-2 gap-3">
                {invitationMethods.map((method) => (
                  <Button
                    key={method.id}
                    variant="outline"
                    onClick={method.action}
                    className="justify-start h-auto p-3"
                  >
                    <div className={`p-2 rounded-lg mr-3 ${method.color}`}>
                      {method.icon}
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-sm">{method.name}</div>
                      <div className="text-xs text-muted-foreground">{method.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Referral Rewards</h3>
              <p className="text-muted-foreground text-sm">
                Unlock amazing rewards as you invite more friends!
              </p>
            </div>

            <div className="space-y-3">
              {referralRewards.map((reward) => (
                <Card key={reward.id} className={cn(
                  "p-4 transition-all",
                  reward.completed 
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" 
                    : "bg-gray-50 dark:bg-gray-900/20"
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        reward.completed 
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                      )}>
                        {reward.icon}
                      </div>
                      <div>
                        <div className="font-medium">{reward.description}</div>
                        <div className="text-sm text-muted-foreground">{reward.requirement}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">
                        {typeof reward.value === "number" ? `${reward.value} coins` : reward.value}
                      </div>
                      <Badge variant={reward.completed ? "default" : "secondary"}>
                        {reward.completed ? "Claimed" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Premium Benefits */}
            <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-yellow-600" />
                <h4 className="font-semibold">Premium Referral Benefits</h4>
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Double referral rewards (200 coins per successful invite)</li>
                <li>• Exclusive premium badges for referrers</li>
                <li>• Priority support for referred friends</li>
                <li>• Special gift packages for milestone achievements</li>
              </ul>
            </Card>
          </TabsContent>

          {/* Tracking Tab */}
          <TabsContent value="tracking" className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Invitation Tracking</h3>
              <p className="text-muted-foreground text-sm">
                Monitor your sent invitations and their status
              </p>
            </div>

            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {pendingInvites.map((invite) => (
                  <Card key={invite.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          invite.status === "accepted" 
                            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                            : invite.status === "pending"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                        )}>
                          {invite.platform === "email" ? <Mail className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-medium">
                            {invite.email || invite.phone || "Unknown"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(invite.sentAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={
                            invite.status === "accepted" ? "default" :
                            invite.status === "pending" ? "secondary" : "destructive"
                          }
                        >
                          {invite.status}
                        </Badge>
                        {invite.reward && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {invite.reward}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}

                {pendingInvites.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No invitations sent yet</p>
                    <p className="text-sm">Start inviting friends to see them here!</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {onClose && (
          <div className="flex justify-end mt-6">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserInvitationSystem;
