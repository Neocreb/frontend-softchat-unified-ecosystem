import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Shield,
  CheckCircle,
  Clock,
  RefreshCw,
  CreditCard,
  Truck,
  Star,
  Award,
  Lock,
  Eye,
  MessageCircle,
  AlertTriangle,
  Info,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BuyerProtectionProps {
  orderId?: string;
  sellerId?: string;
  productId?: string;
  showCompact?: boolean;
}

const BuyerProtection = ({
  orderId,
  sellerId,
  productId,
  showCompact = false,
}: BuyerProtectionProps) => {
  const protectionFeatures = [
    {
      icon: <Shield className="w-5 h-5 text-green-600" />,
      title: "Purchase Protection",
      description:
        "Get your money back if the item doesn't arrive or isn't as described",
      coverage: "Up to $2,500",
      active: true,
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-blue-600" />,
      title: "Easy Returns",
      description: "Return most items within 30 days for a full refund",
      coverage: "30-day returns",
      active: true,
    },
    {
      icon: <CreditCard className="w-5 h-5 text-purple-600" />,
      title: "Secure Payments",
      description: "Your payment information is encrypted and protected",
      coverage: "Bank-level security",
      active: true,
    },
    {
      icon: <Eye className="w-5 h-5 text-orange-600" />,
      title: "Seller Verification",
      description: "All sellers are verified and monitored for quality",
      coverage: "Identity verified",
      active: true,
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-indigo-600" />,
      title: "24/7 Support",
      description: "Get help anytime with our customer support team",
      coverage: "Always available",
      active: true,
    },
  ];

  const trustMetrics = {
    buyerSatisfaction: 96.8,
    disputeResolutionRate: 99.2,
    averageResolutionTime: "2.3 days",
    protectedPurchases: "2.4M+",
  };

  if (showCompact) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Shield className="w-4 h-4" />
            Buyer Protection
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Buyer Protection Guarantee
            </DialogTitle>
            <DialogDescription>
              Your purchase is protected with our comprehensive buyer guarantee
            </DialogDescription>
          </DialogHeader>
          <BuyerProtectionContent />
        </DialogContent>
      </Dialog>
    );
  }

  return <BuyerProtectionContent />;

  function BuyerProtectionContent() {
    return (
      <div className="space-y-6">
        {/* Protection Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-600" />
              Buyer Protection Guarantee
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Shop with confidence knowing your purchase is protected
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {protectionFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-2 bg-background border rounded-lg">
                    {feature.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{feature.title}</h4>
                      {feature.active && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-green-100 text-green-800"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                    <p className="text-xs font-medium text-primary">
                      {feature.coverage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trust Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              Trust & Safety Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-green-600">
                  {trustMetrics.buyerSatisfaction}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Buyer Satisfaction
                </div>
                <Progress
                  value={trustMetrics.buyerSatisfaction}
                  className="h-2"
                />
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-blue-600">
                  {trustMetrics.disputeResolutionRate}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Disputes Resolved
                </div>
                <Progress
                  value={trustMetrics.disputeResolutionRate}
                  className="h-2"
                />
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-purple-600">
                  {trustMetrics.averageResolutionTime}
                </div>
                <div className="text-sm text-muted-foreground">
                  Avg. Resolution Time
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-orange-600">
                  {trustMetrics.protectedPurchases}
                </div>
                <div className="text-sm text-muted-foreground">
                  Protected Purchases
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle>How Buyer Protection Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-medium">1. Secure Purchase</h4>
                  <p className="text-sm text-muted-foreground">
                    Make a purchase using our secure payment system. Your money
                    is held safely until delivery.
                  </p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Truck className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-medium">2. Track & Receive</h4>
                  <p className="text-sm text-muted-foreground">
                    Track your order and receive it as described. You have time
                    to inspect and ensure satisfaction.
                  </p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-medium">3. Protection Activated</h4>
                  <p className="text-sm text-muted-foreground">
                    If there's an issue, our protection covers you with refunds,
                    returns, or dispute resolution.
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">What's Covered</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Item not received</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Item significantly not as described</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Item damaged during shipping</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Seller not responding to messages</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Return policy violations</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Fraudulent activity</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              Safety Tips for Buyers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-sm text-green-900">
                      Verify Seller Information
                    </h5>
                    <p className="text-xs text-green-700">
                      Check seller ratings, reviews, and verification badges
                      before purchasing.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-sm text-blue-900">
                      Read Product Descriptions
                    </h5>
                    <p className="text-xs text-blue-700">
                      Carefully read product details, specifications, and return
                      policies.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-sm text-purple-900">
                      Communicate Safely
                    </h5>
                    <p className="text-xs text-purple-700">
                      Use our messaging system for all communication with
                      sellers.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-sm text-yellow-900">
                      Avoid Suspicious Offers
                    </h5>
                    <p className="text-xs text-yellow-700">
                      Be cautious of deals that seem too good to be true or
                      requests for off-platform payments.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-sm text-orange-900">
                      Track Your Orders
                    </h5>
                    <p className="text-xs text-orange-700">
                      Monitor order status and delivery tracking information
                      regularly.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <Shield className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-sm text-red-900">
                      Report Issues Quickly
                    </h5>
                    <p className="text-xs text-red-700">
                      Contact support immediately if you encounter any problems
                      with your order.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1" variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Live Chat Support
              </Button>
              <Button className="flex-1" variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                Help Center
              </Button>
              <Button className="flex-1">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Report an Issue
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Our support team is available 24/7 to help resolve any issues with
              your purchase
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
};

export default BuyerProtection;
