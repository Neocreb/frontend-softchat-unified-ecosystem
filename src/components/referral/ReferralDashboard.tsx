import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  DollarSign,
  TrendingUp,
  Copy,
  Share2,
  Gift,
  Crown,
  ExternalLink,
  Plus,
  Award,
  Target,
  Calendar,
  Star,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  ReferralService,
  type ReferralLink,
  type ReferralStats,
  type PartnershipTier,
} from "@/services/referralService";
import { formatCurrency, formatNumber } from "@/utils/formatters";

const ReferralDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [referralLinks, setReferralLinks] = useState<ReferralLink[]>([]);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(
    null,
  );
  const [partnershipTiers, setPartnershipTiers] = useState<PartnershipTier[]>(
    [],
  );
  const [partnershipStatus, setPartnershipStatus] = useState<any>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    if (user) {
      loadReferralData();
    }
  }, [user]);

  const loadReferralData = async () => {
    setIsLoading(true);
    try {
      const [links, stats, tiers, status] = await Promise.all([
        ReferralService.getReferralLinks(),
        ReferralService.getReferralStats(),
        ReferralService.getPartnershipTiers(),
        ReferralService.getPartnershipStatus(),
      ]);

      setReferralLinks(links);
      setReferralStats(stats);
      setPartnershipTiers(tiers);
      setPartnershipStatus(status);
    } catch (error) {
      console.error("Error loading referral data:", error);
      toast({
        title: "Error",
        description: "Failed to load referral data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewLink = async () => {
    setIsGeneratingLink(true);
    try {
      const newLink = await ReferralService.generateReferralLink({
        type: "general",
        description: "Personal referral link",
      });

      if (newLink) {
        setReferralLinks((prev) => [newLink, ...prev]);
        toast({
          title: "Link Generated!",
          description: "Your new referral link is ready to share",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate referral link",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const copyLink = async (url: string) => {
    const success = await ReferralService.copyToClipboard(url);
    if (success) {
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const shareLink = (url: string) => {
    if (navigator.share) {
      navigator.share({
        title: "Join Softchat",
        text: "Join me on Softchat and start earning from your activities!",
        url: url,
      });
    } else {
      copyLink(url);
    }
  };

  const claimRewards = async () => {
    setIsClaiming(true);
    try {
      const result = await ReferralService.claimReferralRewards();

      if (result.success) {
        toast({
          title: "Rewards Claimed!",
          description: `Successfully claimed ${formatCurrency(result.amount)}`,
        });
        loadReferralData(); // Refresh data
      } else {
        toast({
          title: "Claim Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to claim rewards",
        variant: "destructive",
      });
    } finally {
      setIsClaiming(false);
    }
  };

  const getPartnershipProgress = () => {
    if (!referralStats || !partnershipTiers.length) return null;

    const currentReferrals = referralStats.totalReferrals;
    const nextTier = partnershipTiers.find(
      (tier) => tier.minimumReferrals > currentReferrals,
    );

    if (!nextTier) {
      return {
        tierName: "Platinum Partner",
        progress: 100,
        remaining: 0,
        total:
          partnershipTiers[partnershipTiers.length - 1]?.minimumReferrals ||
          500,
      };
    }

    const progress = (currentReferrals / nextTier.minimumReferrals) * 100;

    return {
      tierName: nextTier.name,
      progress: Math.min(progress, 100),
      remaining: Math.max(0, nextTier.minimumReferrals - currentReferrals),
      total: nextTier.minimumReferrals,
    };
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const partnershipProgress = getPartnershipProgress();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Referral Program</h1>
          <p className="text-muted-foreground">
            Earn lifetime commissions by inviting friends to Softchat
          </p>
        </div>
        <div className="flex items-center gap-2">
          {partnershipStatus?.isPartner && (
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Crown className="w-3 h-3 mr-1" />
              {partnershipStatus.tier || "Partner"}
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={loadReferralData}
            disabled={isLoading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">
                  Total Referrals
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {referralStats?.totalReferrals || 0}
                </p>
                <p className="text-xs text-blue-600">
                  {referralStats?.activeReferrals || 0} active
                </p>
              </div>
              <div className="p-3 bg-blue-200 rounded-full">
                <Users className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">
                  Total Earnings
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(referralStats?.totalEarnings || 0)}
                </p>
                <p className="text-xs text-green-600">
                  {formatCurrency(referralStats?.thisMonthEarnings || 0)} this
                  month
                </p>
              </div>
              <div className="p-3 bg-green-200 rounded-full">
                <DollarSign className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">
                  Conversion Rate
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {referralStats?.conversionRate?.toFixed(1) || 0}%
                </p>
                <p className="text-xs text-purple-600">Above average</p>
              </div>
              <div className="p-3 bg-purple-200 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">
                  Pending Rewards
                </p>
                <p className="text-2xl font-bold text-orange-900">
                  {formatCurrency(referralStats?.pendingRewards || 0)}
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs p-0 h-auto text-orange-600 hover:text-orange-800"
                  onClick={claimRewards}
                  disabled={isClaiming || !referralStats?.pendingRewards}
                >
                  {isClaiming ? "Claiming..." : "Claim Now"}
                </Button>
              </div>
              <div className="p-3 bg-orange-200 rounded-full">
                <Gift className="w-6 h-6 text-orange-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Partnership Progress */}
      {partnershipProgress && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Partnership Progress
              </CardTitle>
              <Badge variant="outline">
                Next: {partnershipProgress.tierName}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress to {partnershipProgress.tierName}</span>
                  <span>
                    {partnershipProgress.remaining} referrals remaining
                  </span>
                </div>
                <Progress
                  value={partnershipProgress.progress}
                  className="h-3"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Refer {partnershipProgress.remaining} more friends to unlock the{" "}
                {partnershipProgress.tierName} tier with higher commissions and
                exclusive benefits.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="links">My Links</TabsTrigger>
          <TabsTrigger value="partnership">Partnership</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={generateNewLink}
                  disabled={isGeneratingLink}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isGeneratingLink ? "Generating..." : "Generate New Link"}
                </Button>

                {referralLinks.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Your Main Link:</p>
                    <div className="flex items-center gap-2">
                      <Input
                        value={referralLinks[0]?.referralUrl || ""}
                        readOnly
                        className="text-xs"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyLink(referralLinks[0]?.referralUrl || "")
                        }
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          shareLink(referralLinks[0]?.referralUrl || "")
                        }
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Earning Potential */}
            <Card>
              <CardHeader>
                <CardTitle>Earning Potential</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency(partnershipStatus?.commissionRate || 5)}
                    </p>
                    <p className="text-xs text-blue-600">Per Referral</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">
                      {partnershipStatus?.commissionRate || 5}%
                    </p>
                    <p className="text-xs text-green-600">Commission Rate</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">How You Earn:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Signup bonus: $5 per new user</li>
                    <li>• Activity commission: 5% of their earnings</li>
                    <li>• Purchase bonus: 2% of their spending</li>
                    <li>• Lifetime earnings from their activity</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Links Tab */}
        <TabsContent value="links" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">My Referral Links</h3>
            <Button onClick={generateNewLink} disabled={isGeneratingLink}>
              <Plus className="w-4 h-4 mr-2" />
              New Link
            </Button>
          </div>

          <div className="grid gap-4">
            {referralLinks.map((link) => (
              <Card key={link.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{link.type}</Badge>
                        {link.isActive ? (
                          <Badge className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </div>
                      <p className="text-sm font-mono bg-gray-50 p-2 rounded">
                        {link.referralUrl}
                      </p>
                      {link.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {link.description}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyLink(link.referralUrl)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => shareLink(link.referralUrl)}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-xs text-right text-muted-foreground">
                        <p>{link.clickCount} clicks</p>
                        <p>{link.signupCount} signups</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Partnership Tab */}
        <TabsContent value="partnership" className="space-y-6">
          <div className="grid gap-6">
            {partnershipTiers.map((tier) => (
              <Card
                key={tier.id}
                className={`relative ${
                  partnershipStatus?.tier === tier.id
                    ? "ring-2 ring-purple-500"
                    : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="w-5 h-5" />
                      {tier.name}
                    </CardTitle>
                    {partnershipStatus?.tier === tier.id && (
                      <Badge className="bg-purple-100 text-purple-800">
                        Current Tier
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Benefits:</h4>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-center gap-2">
                          <DollarSign className="w-3 h-3 text-green-500" />
                          {tier.commissionRate}% commission rate
                        </li>
                        <li className="flex items-center gap-2">
                          <Gift className="w-3 h-3 text-blue-500" />+
                          {tier.bonusRewards} SP bonus rewards
                        </li>
                        {tier.exclusiveFeatures.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Star className="w-3 h-3 text-yellow-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Requirements:</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        {tier.requirements.map((req, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Target className="w-3 h-3" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Clicks</span>
                    <span className="font-medium">
                      {referralLinks.reduce(
                        (sum, link) => sum + link.clickCount,
                        0,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Signups</span>
                    <span className="font-medium">
                      {referralLinks.reduce(
                        (sum, link) => sum + link.signupCount,
                        0,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Conversion Rate</span>
                    <span className="font-medium text-green-600">
                      {referralStats?.conversionRate?.toFixed(1) || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Lifetime Earnings</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(referralStats?.lifetimeCommissions || 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips for Success</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-sm text-blue-800">
                      Share Authentically
                    </h4>
                    <p className="text-xs text-blue-600">
                      Share your genuine experience with Softchat
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-sm text-green-800">
                      Target Right Audience
                    </h4>
                    <p className="text-xs text-green-600">
                      Share with people interested in earning online
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-sm text-purple-800">
                      Be Helpful
                    </h4>
                    <p className="text-xs text-purple-600">
                      Help your referrals get started and engaged
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReferralDashboard;
