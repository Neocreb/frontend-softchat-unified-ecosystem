import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Copy,
  Share2,
  DollarSign,
  TrendingUp,
  Star,
  ExternalLink,
  Heart,
  Info,
  Gift,
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { useToast } from "@/hooks/use-toast";
import { AutomaticRewardSharingService } from "@/services/automaticRewardSharingService";

const SafeReferralComponent: React.FC = () => {
  const { toast } = useToast();
  const [sharingStats, setSharingStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const referralLink = "https://eloity.app/join?ref=DEMO123";

  useEffect(() => {
    loadSharingStats();
  }, []);

  const loadSharingStats = async () => {
    try {
      setIsLoading(true);
      const stats = await AutomaticRewardSharingService.getSharingStats();
      setSharingStats(stats);
    } catch (error) {
      console.error('Failed to load sharing stats:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const shareReferralLink = (platform: string) => {
    const message = "Join Eloity and start earning! Use my referral link:";
    const url = encodeURIComponent(referralLink);
    const text = encodeURIComponent(message);
    
    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Referral Program</h1>
          <p className="text-muted-foreground">
            Earn rewards by inviting friends to join Eloity
          </p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Share2 className="w-4 h-4 mr-2" />
          Generate New Link
        </Button>
      </div>

      {/* Automatic Reward Sharing Info */}
      <Alert className="border-blue-200 bg-blue-50">
        <Gift className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <strong>Automatic Reward Sharing is Active!</strong>
              <p className="text-sm mt-1">
                When you earn rewards from content creation, engagement, and platform activities,
                0.5% is automatically shared with your referrals as a thank you for growing our community.
                This only applies to creator economy earnings, not personal transactions.
              </p>
            </div>
            <div className="ml-4 text-right">
              <p className="text-xs text-blue-600">This Month</p>
              <p className="font-semibold text-blue-800">
                {isLoading ? "..." : formatCurrency(sharingStats?.thisMonthShared || 0)} shared
              </p>
              <p className="font-semibold text-blue-800">
                {isLoading ? "..." : formatCurrency(sharingStats?.thisMonthReceived || 0)} received
              </p>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Referrals</p>
                <p className="text-2xl font-bold text-blue-900">23</p>
                <p className="text-xs text-blue-600">18 active</p>
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
                <p className="text-sm font-medium text-green-700">Total Earnings</p>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(340.50)}
                </p>
                <p className="text-xs text-green-600">
                  {formatCurrency(45.2)} this month
                </p>
              </div>
              <div className="p-3 bg-green-200 rounded-full">
                <DollarSign className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-pink-50 to-pink-100 border-pink-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-700">Reward Sharing</p>
                <p className="text-2xl font-bold text-pink-900">
                  {isLoading ? "..." : formatCurrency(sharingStats?.totalShared || 0)}
                </p>
                <p className="text-xs text-pink-600">
                  0.5% auto-shared with referrals
                </p>
              </div>
              <div className="p-3 bg-pink-200 rounded-full">
                <Heart className="w-6 h-6 text-pink-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Conversion Rate</p>
                <p className="text-2xl font-bold text-purple-900">26.7%</p>
              </div>
              <div className="p-3 bg-purple-200 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">Tier Status</p>
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                  <Star className="w-4 h-4 mr-1" />
                  Silver
                </Badge>
              </div>
              <div className="p-3 bg-yellow-200 rounded-full">
                <Star className="w-6 h-6 text-yellow-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Share */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Your Referral Link
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Share this link</span>
                <Button size="sm" variant="outline" onClick={copyReferralLink}>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
              <Input value={referralLink} readOnly className="text-xs" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareReferralLink("twitter")}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareReferralLink("facebook")}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareReferralLink("whatsapp")}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                WhatsApp
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recent Referral Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Alice Johnson", action: "signed up", reward: "$10", time: "2 hours ago", status: "completed" },
              { name: "Mike Smith", action: "made first purchase", reward: "$5", time: "1 day ago", status: "completed" },
              { name: "Sarah Wilson", action: "signed up", reward: "$10", time: "3 days ago", status: "pending" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {activity.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{activity.name} {activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{activity.reward}</p>
                  <Badge variant={activity.status === "completed" ? "default" : "secondary"} className="text-xs">
                    {activity.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Referrals Work</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">1. Share Your Link</h3>
              <p className="text-sm text-muted-foreground">
                Share your unique referral link with friends and family
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">2. Friends Join</h3>
              <p className="text-sm text-muted-foreground">
                When someone signs up using your link, they become your referral
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-full">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">3. Earn Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Both you and your friend earn rewards for activities and purchases
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Automatic Reward Sharing Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Automatic Reward Sharing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-2">How It Works</h3>
              <p className="text-sm text-gray-700 mb-3">
                As part of our commitment to community growth, 0.5% of your creator economy earnings
                are automatically shared with the people you've referred to Eloity.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">✅ Included Earnings:</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Content creation rewards</li>
                    <li>• Ad revenue sharing</li>
                    <li>• Engagement bonuses</li>
                    <li>• Challenge completions</li>
                    <li>• Battle voting rewards</li>
                    <li>• Gifts and tips received</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">❌ Not Included:</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Freelance project payments</li>
                    <li>• Marketplace sales</li>
                    <li>• Crypto trading profits</li>
                    <li>• Direct user payments</li>
                    <li>• Withdrawal transactions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Your Sharing Impact</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Total Shared:</span>
                    <span className="font-medium text-green-900">
                      {isLoading ? "Loading..." : formatCurrency(sharingStats?.totalShared || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Transactions:</span>
                    <span className="font-medium text-green-900">
                      {isLoading ? "..." : (sharingStats?.sharingTransactionsCount || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">This Month:</span>
                    <span className="font-medium text-green-900">
                      {isLoading ? "..." : formatCurrency(sharingStats?.thisMonthShared || 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">You've Received</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Total Received:</span>
                    <span className="font-medium text-blue-900">
                      {isLoading ? "Loading..." : formatCurrency(sharingStats?.totalReceived || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">From Others:</span>
                    <span className="font-medium text-blue-900">
                      {isLoading ? "..." : (sharingStats?.receivingTransactionsCount || 0)} people
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">This Month:</span>
                    <span className="font-medium text-blue-900">
                      {isLoading ? "..." : formatCurrency(sharingStats?.thisMonthReceived || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">Important Information</h4>
                  <p className="text-sm text-yellow-700">
                    Automatic reward sharing is enabled by default and helps build a supportive community.
                    This system is part of our Terms of Service and ensures that those who help grow the platform
                    benefit from community success. The 0.5% is taken from platform reward earnings only,
                    never from your personal business transactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Tiers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Referral Tiers & Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg bg-orange-50 border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold text-orange-700">Bronze (0-9 referrals)</span>
                </div>
                <ul className="text-sm text-orange-600 space-y-1">
                  <li>• $10 per referral</li>
                  <li>• 5% revenue share</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg bg-gray-50 border-gray-300">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold text-gray-700">Silver (10-24 referrals)</span>
                  <Badge className="bg-gray-500 text-white text-xs">Current</Badge>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• $15 per referral</li>
                  <li>• 7.5% revenue share</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-300">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold text-yellow-700">Gold (25+ referrals)</span>
                </div>
                <ul className="text-sm text-yellow-600 space-y-1">
                  <li>• $25 per referral</li>
                  <li>• 10% revenue share</li>
                  <li>• Priority support</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SafeReferralComponent;
