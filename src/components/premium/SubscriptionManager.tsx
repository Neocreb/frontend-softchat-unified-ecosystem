import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Crown,
  Check,
  Star,
  Zap,
  TrendingUp,
  Users,
  Video,
  HardDrive,
  Bot,
  Calendar,
  DollarSign,
  Gift,
  Sparkles,
  ArrowUp,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  subscriptionService,
  SUBSCRIPTION_TIERS,
  SubscriptionTier,
  UserSubscription,
  SubscriptionUsage,
} from "@/services/subscriptionService";

interface SubscriptionManagerProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const [currentSubscription, setCurrentSubscription] =
    useState<UserSubscription | null>(null);
  const [usage, setUsage] = useState<SubscriptionUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.id) {
      loadSubscriptionData();
    }
  }, [user?.id]);

  const loadSubscriptionData = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const [subscription, usageData, analyticsData] = await Promise.all([
        subscriptionService.getUserSubscription(user.id),
        subscriptionService.getUsage(user.id),
        subscriptionService.getSubscriptionAnalytics(user.id),
      ]);

      setCurrentSubscription(subscription);
      setUsage(usageData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error("Error loading subscription data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (tierId: string) => {
    if (!user?.id) return;

    setSubscribing(tierId);
    try {
      const subscription = await subscriptionService.subscribeTo(
        user.id,
        tierId,
      );

      if (subscription) {
        toast({
          title: "Subscription activated!",
          description: `Welcome to ${SUBSCRIPTION_TIERS.find((t) => t.id === tierId)?.name}!`,
        });
        await loadSubscriptionData();
      } else {
        throw new Error("Failed to create subscription");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      toast({
        title: "Subscription failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setSubscribing(null);
    }
  };

  const handleCancel = async () => {
    if (!user?.id || !currentSubscription) return;

    try {
      const success = await subscriptionService.cancelSubscription(user.id);

      if (success) {
        toast({
          title: "Subscription cancelled",
          description:
            "Your subscription will remain active until the end of the billing period.",
        });
        await loadSubscriptionData();
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast({
        title: "Cancellation failed",
        description: "Please contact support for assistance.",
        variant: "destructive",
      });
    }
  };

  const getCurrentTier = (): SubscriptionTier => {
    if (!currentSubscription) {
      return (
        SUBSCRIPTION_TIERS.find((t) => t.id === "free") || SUBSCRIPTION_TIERS[0]
      );
    }
    return (
      SUBSCRIPTION_TIERS.find((t) => t.id === currentSubscription.tierId) ||
      SUBSCRIPTION_TIERS[0]
    );
  };

  const getUsagePercentage = (used: number, limit: number): number => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const formatPrice = (price: number): string => {
    return price === 0 ? "Free" : `$${price.toFixed(2)}`;
  };

  const currentTier = getCurrentTier();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{currentTier.icon}</span>
                <h3 className="text-xl font-bold">{currentTier.name}</h3>
                {currentTier.popular && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    Popular
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{currentTier.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {formatPrice(currentTier.price)}
                {currentTier.price > 0 && (
                  <span className="text-sm text-muted-foreground">/month</span>
                )}
              </div>
              {currentSubscription && (
                <p className="text-xs text-muted-foreground">
                  {currentSubscription.status === "trial" ? "Trial" : "Active"}
                  {currentSubscription.endDate && (
                    <>
                      {" "}
                      until{" "}
                      {new Date(
                        currentSubscription.endDate,
                      ).toLocaleDateString()}
                    </>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Usage Overview */}
          {usage && analytics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Video className="h-4 w-4" />
                    Videos
                  </span>
                  <span>
                    {usage.videoUploads}/
                    {currentTier.limits.videoUploads === -1
                      ? "∞"
                      : currentTier.limits.videoUploads}
                  </span>
                </div>
                <Progress
                  value={getUsagePercentage(
                    usage.videoUploads,
                    currentTier.limits.videoUploads,
                  )}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <HardDrive className="h-4 w-4" />
                    Storage
                  </span>
                  <span>
                    {usage.storageUsedGB.toFixed(1)}GB/
                    {currentTier.limits.storageGB}GB
                  </span>
                </div>
                <Progress
                  value={getUsagePercentage(
                    usage.storageUsedGB,
                    currentTier.limits.storageGB,
                  )}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Bot className="h-4 w-4" />
                    AI Credits
                  </span>
                  <span>
                    {usage.aiCreditsUsed}/
                    {currentTier.limits.aiCredits === -1
                      ? "∞"
                      : currentTier.limits.aiCredits}
                  </span>
                </div>
                <Progress
                  value={getUsagePercentage(
                    usage.aiCreditsUsed,
                    currentTier.limits.aiCredits,
                  )}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="plans" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="plans">Available Plans</TabsTrigger>
          <TabsTrigger value="usage">Usage & Analytics</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          {/* Subscription Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SUBSCRIPTION_TIERS.map((tier) => {
              const isCurrentTier = currentTier.id === tier.id;
              const isUpgrade =
                SUBSCRIPTION_TIERS.indexOf(tier) >
                SUBSCRIPTION_TIERS.indexOf(currentTier);

              return (
                <Card
                  key={tier.id}
                  className={`relative overflow-hidden ${
                    tier.popular ? "ring-2 ring-purple-500 shadow-lg" : ""
                  } ${isCurrentTier ? "bg-muted" : ""}`}
                >
                  {tier.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-1 text-xs font-medium">
                      Most Popular
                    </div>
                  )}

                  <CardHeader className={tier.popular ? "pt-8" : ""}>
                    <div className="text-center">
                      <div className="text-4xl mb-2">{tier.icon}</div>
                      <h3 className="text-xl font-bold">{tier.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        {tier.description}
                      </p>
                      <div className="mt-4">
                        <span className="text-3xl font-bold">
                          {formatPrice(tier.price)}
                        </span>
                        {tier.price > 0 && (
                          <span className="text-muted-foreground text-sm">
                            /{tier.interval}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {tier.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="w-full"
                      variant={
                        isCurrentTier
                          ? "secondary"
                          : tier.popular
                            ? "default"
                            : "outline"
                      }
                      disabled={isCurrentTier || subscribing === tier.id}
                      onClick={() => handleSubscribe(tier.id)}
                    >
                      {subscribing === tier.id ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                          Subscribing...
                        </div>
                      ) : isCurrentTier ? (
                        "Current Plan"
                      ) : isUpgrade ? (
                        <>
                          <ArrowUp className="h-4 w-4 mr-2" />
                          Upgrade
                        </>
                      ) : (
                        "Downgrade"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Cancel Subscription */}
          {currentSubscription &&
            currentSubscription.status === "active" &&
            currentTier.price > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <Alert>
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <span>Need to cancel your subscription?</span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleCancel}
                        >
                          Cancel Subscription
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          {analytics && (
            <>
              {/* Usage Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <Video className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Videos Used
                        </p>
                        <p className="text-2xl font-bold">
                          {analytics.usage?.videoUploads || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Storage Used
                        </p>
                        <p className="text-2xl font-bold">
                          {analytics.usage?.storageUsedGB.toFixed(1) || 0}GB
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          AI Credits
                        </p>
                        <p className="text-2xl font-bold">
                          {analytics.usage?.aiCreditsUsed || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Spent
                        </p>
                        <p className="text-2xl font-bold">
                          ${analytics.totalSpent.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Remaining Limits */}
              <Card>
                <CardHeader>
                  <CardTitle>Remaining This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Video Uploads
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {analytics.remaining.videos === -1
                            ? "Unlimited"
                            : analytics.remaining.videos}{" "}
                          remaining
                        </span>
                      </div>
                      <Progress
                        value={
                          analytics.remaining.videos === -1
                            ? 0
                            : ((currentTier.limits.videoUploads -
                                analytics.remaining.videos) /
                                currentTier.limits.videoUploads) *
                              100
                        }
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Storage</span>
                        <span className="text-sm text-muted-foreground">
                          {analytics.remaining.storage.toFixed(1)}GB remaining
                        </span>
                      </div>
                      <Progress
                        value={
                          ((currentTier.limits.storageGB -
                            analytics.remaining.storage) /
                            currentTier.limits.storageGB) *
                          100
                        }
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">AI Credits</span>
                        <span className="text-sm text-muted-foreground">
                          {analytics.remaining.aiCredits === -1
                            ? "Unlimited"
                            : analytics.remaining.aiCredits}{" "}
                          remaining
                        </span>
                      </div>
                      <Progress
                        value={
                          analytics.remaining.aiCredits === -1
                            ? 0
                            : ((currentTier.limits.aiCredits -
                                analytics.remaining.aiCredits) /
                                currentTier.limits.aiCredits) *
                              100
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No billing history available</p>
                <p className="text-sm">
                  Payment history will appear here once you subscribe to a paid
                  plan
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionManager;

// Export a dialog wrapper for easy use
export const SubscriptionDialog: React.FC<{
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}> = ({ trigger, isOpen, onOpenChange }) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <Dialog open={isOpen ?? open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Subscription Management
          </DialogTitle>
        </DialogHeader>
        <SubscriptionManager
          isOpen={isOpen ?? open}
          onOpenChange={handleOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
};
