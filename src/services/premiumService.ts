import { apiCall } from "@/lib/api";

export interface PremiumSubscription {
  id: string;
  tier: "silver" | "gold" | "pro";
  status: string;
  billingType: "monthly" | "yearly";
  price: string;
  startDate: string;
  endDate: string;
  monthlyBoostCredits: number;
  usedBoostCredits: number;
  feeDiscountPercentage?: string;
}

export interface SubscribeRequest {
  tier: "silver" | "gold" | "pro";
  billingType: "monthly" | "yearly";
}

class PremiumServiceClass {
  static async subscribe(
    data: SubscribeRequest,
  ): Promise<{ success: boolean; subscription: PremiumSubscription }> {
    const response = await apiCall("/api/premium/subscribe", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  }

  static async getPremiumStatus(): Promise<{
    subscription: PremiumSubscription | null;
    isPremium: boolean;
  }> {
    const response = await apiCall("/api/premium/status");
    return response;
  }

  static getTierInfo(tier: string) {
    const tierInfo = {
      silver: {
        name: "Silver",
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        icon: "🥈",
        monthlyPrice: 9.99,
        yearlyPrice: 99.99,
        features: [
          "5 free boosts per month",
          "5% platform fee discount",
          "Priority customer support",
          "Enhanced profile badge",
          "Basic analytics",
        ],
      },
      gold: {
        name: "Gold",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        icon: "🥇",
        monthlyPrice: 19.99,
        yearlyPrice: 199.99,
        features: [
          "15 free boosts per month",
          "10% platform fee discount",
          "Priority customer support",
          "Gold profile badge",
          "Advanced analytics",
          "Custom profile themes",
          "Early access to new features",
        ],
      },
      pro: {
        name: "Pro",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        icon: "👑",
        monthlyPrice: 39.99,
        yearlyPrice: 399.99,
        features: [
          "50 free boosts per month",
          "20% platform fee discount",
          "Dedicated account manager",
          "Pro profile badge",
          "Premium analytics dashboard",
          "Custom branding options",
          "API access",
          "White-label solutions",
          "Advanced automation tools",
        ],
      },
    };

    return tierInfo[tier as keyof typeof tierInfo] || tierInfo.silver;
  }

  static formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  static getDaysRemaining(endDate: string): number {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  static getSubscriptionStatusColor(status: string): string {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      case "expired":
        return "text-gray-600 bg-gray-50";
      case "paused":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  }

  static calculateYearlySavings(tier: string): number {
    const info = this.getTierInfo(tier);
    const monthlyTotal = info.monthlyPrice * 12;
    const yearlySavings = monthlyTotal - info.yearlyPrice;
    return Math.round(yearlySavings);
  }

  static getBoostCreditsRemaining(subscription: PremiumSubscription): number {
    return Math.max(
      0,
      subscription.monthlyBoostCredits - subscription.usedBoostCredits,
    );
  }
}

// Export both class and instance
export const PremiumService = PremiumServiceClass;
export const premiumService = new PremiumServiceClass();
