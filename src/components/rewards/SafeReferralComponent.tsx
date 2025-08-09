import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  Copy,
  Share2,
  DollarSign,
  TrendingUp,
  Star,
  ExternalLink,
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { useToast } from "@/hooks/use-toast";

const SafeReferralComponent: React.FC = () => {
  const { toast } = useToast();

  const referralLink = "https://softchat.app/join?ref=DEMO123";
  
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const shareReferralLink = (platform: string) => {
    const message = "Join Softchat and start earning! Use my referral link:";
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
            Earn rewards by inviting friends to join Softchat
          </p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Share2 className="w-4 h-4 mr-2" />
          Generate New Link
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
    </div>
  );
};

export default SafeReferralComponent;
