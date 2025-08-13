import { createCryptoNotification } from "@/contexts/UnifiedNotificationContext";
import { notificationService } from "@/services/notificationService";
import { useAuth } from "@/contexts/AuthContext";

export interface CryptoNotificationData {
  title: string;
  message: string;
  symbol?: string;
  price?: number;
  priority?: "low" | "medium" | "high" | "urgent";
  actionUrl?: string;
  actionLabel?: string;
  type?: "price_alert" | "trade_completed" | "withdrawal" | "deposit" | "p2p_trade" | "portfolio_update" | "kyc_status";
}

class CryptoNotificationService {
  /**
   * Send a crypto notification to the unified notification system
   */
  async sendCryptoNotification(userId: string, data: CryptoNotificationData) {
    try {
      // Create notification in the unified system
      const notification = createCryptoNotification({
        title: data.title,
        message: data.message,
        symbol: data.symbol,
        price: data.price,
        priority: data.priority || "medium",
      });

      // Store in database via notification service
      await notificationService.createNotification(
        userId,
        "system", // Map crypto notifications to system type
        data.title,
        data.message
      );

      // Add to local notification state (this would be handled by context)
      const event = new CustomEvent('crypto-notification', {
        detail: { ...notification, id: Date.now().toString(), timestamp: new Date() }
      });
      window.dispatchEvent(event);

      return true;
    } catch (error) {
      console.error("Failed to send crypto notification:", error);
      return false;
    }
  }

  /**
   * Send trade completion notification
   */
  async notifyTradeCompleted(userId: string, tradeType: string, symbol: string, amount: number, price: number) {
    return this.sendCryptoNotification(userId, {
      title: "Trade Completed",
      message: `Successfully ${tradeType.toLowerCase()} ${amount} ${symbol} at $${price.toFixed(2)}`,
      symbol,
      price,
      priority: "high",
      actionUrl: "/app/crypto/portfolio",
      actionLabel: "View Portfolio",
      type: "trade_completed"
    });
  }

  /**
   * Send P2P trade notification
   */
  async notifyP2PTrade(userId: string, action: string, symbol: string, amount: number) {
    return this.sendCryptoNotification(userId, {
      title: "P2P Trade Update",
      message: `P2P trade ${action}: ${amount} ${symbol}`,
      symbol,
      priority: "high",
      actionUrl: "/app/crypto/p2p",
      actionLabel: "View P2P",
      type: "p2p_trade"
    });
  }

  /**
   * Send withdrawal notification
   */
  async notifyWithdrawal(userId: string, symbol: string, amount: number, status: string) {
    return this.sendCryptoNotification(userId, {
      title: "Withdrawal Update",
      message: `Withdrawal of ${amount} ${symbol} is ${status}`,
      symbol,
      priority: status === "completed" ? "high" : "medium",
      actionUrl: "/app/crypto/wallet",
      actionLabel: "View Wallet",
      type: "withdrawal"
    });
  }

  /**
   * Send deposit notification
   */
  async notifyDeposit(userId: string, symbol: string, amount: number) {
    return this.sendCryptoNotification(userId, {
      title: "Deposit Received",
      message: `Received ${amount} ${symbol} in your wallet`,
      symbol,
      priority: "high",
      actionUrl: "/app/crypto/wallet",
      actionLabel: "View Wallet",
      type: "deposit"
    });
  }

  /**
   * Send price alert notification
   */
  async notifyPriceAlert(userId: string, symbol: string, currentPrice: number, alertPrice: number, direction: "above" | "below") {
    return this.sendCryptoNotification(userId, {
      title: `Price Alert: ${symbol}`,
      message: `${symbol} is now ${direction} $${alertPrice} (Current: $${currentPrice})`,
      symbol,
      price: currentPrice,
      priority: "urgent",
      actionUrl: "/app/crypto/trading",
      actionLabel: "Trade Now",
      type: "price_alert"
    });
  }

  /**
   * Send portfolio update notification
   */
  async notifyPortfolioUpdate(userId: string, changePercent: number, totalValue: number) {
    const isPositive = changePercent >= 0;
    return this.sendCryptoNotification(userId, {
      title: "Portfolio Update",
      message: `Your portfolio is ${isPositive ? "up" : "down"} ${Math.abs(changePercent).toFixed(2)}% (Total: $${totalValue.toFixed(2)})`,
      priority: Math.abs(changePercent) > 10 ? "high" : "medium",
      actionUrl: "/app/crypto/portfolio",
      actionLabel: "View Portfolio",
      type: "portfolio_update"
    });
  }

  /**
   * Send KYC status notification
   */
  async notifyKYCStatus(userId: string, status: "approved" | "rejected" | "under_review") {
    const statusMessages = {
      approved: "Your KYC verification has been approved!",
      rejected: "Your KYC verification was rejected. Please try again.",
      under_review: "Your KYC verification is under review."
    };

    return this.sendCryptoNotification(userId, {
      title: "KYC Status Update",
      message: statusMessages[status],
      priority: status === "approved" ? "high" : "medium",
      actionUrl: "/app/crypto/settings",
      actionLabel: "View Status",
      type: "kyc_status"
    });
  }
}

export const cryptoNotificationService = new CryptoNotificationService();
export default cryptoNotificationService;
