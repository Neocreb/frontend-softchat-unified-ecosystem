import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";

// Stripe configuration
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

// Payment types
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;
  metadata?: Record<string, string>;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
  };
  billing?: {
    name?: string;
    email?: string;
    address?: Stripe.Address;
  };
}

export interface Subscription {
  id: string;
  status: string;
  priceId: string;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: string;
  dueDate: Date;
  paidAt?: Date;
  downloadUrl?: string;
}

// Transaction types for our platform
export type TransactionType =
  | "marketplace_purchase"
  | "freelance_payment"
  | "crypto_deposit"
  | "subscription_payment"
  | "tip"
  | "boost_payment"
  | "withdrawal";

export interface TransactionData {
  userId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, any>;
  feePercentage?: number; // Platform fee
}

export class PaymentService {
  // Create payment intent
  static async createPaymentIntent(
    data: TransactionData,
  ): Promise<PaymentIntent> {
    try {
      const feeAmount = data.feePercentage
        ? Math.round(data.amount * (data.feePercentage / 100))
        : 0;
      const totalAmount = data.amount + feeAmount;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount, // Amount in cents
        currency: data.currency.toLowerCase(),
        metadata: {
          userId: data.userId,
          type: data.type,
          originalAmount: data.amount.toString(),
          feeAmount: feeAmount.toString(),
          ...data.metadata,
        },
        description: data.description,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        id: paymentIntent.id,
        amount: totalAmount,
        currency: data.currency,
        status: paymentIntent.status,
        clientSecret: paymentIntent.client_secret!,
        metadata: paymentIntent.metadata,
      };
    } catch (error) {
      console.error("Payment intent creation failed:", error);
      throw new Error("Failed to create payment intent");
    }
  }

  // Confirm payment intent
  static async confirmPaymentIntent(
    paymentIntentId: string,
  ): Promise<PaymentIntent> {
    try {
      const paymentIntent =
        await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === "succeeded") {
        // Process successful payment
        await this.processSuccessfulPayment(paymentIntent);
      }

      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        clientSecret: paymentIntent.client_secret!,
        metadata: paymentIntent.metadata,
      };
    } catch (error) {
      console.error("Payment confirmation failed:", error);
      throw new Error("Failed to confirm payment");
    }
  }

  // Process successful payment
  private static async processSuccessfulPayment(
    paymentIntent: Stripe.PaymentIntent,
  ): Promise<void> {
    const { metadata } = paymentIntent;
    const transactionType = metadata?.type as TransactionType;
    const userId = metadata?.userId;

    switch (transactionType) {
      case "marketplace_purchase":
        await this.processMarketplacePurchase(paymentIntent, metadata);
        break;
      case "freelance_payment":
        await this.processFreelancePayment(paymentIntent, metadata);
        break;
      case "crypto_deposit":
        await this.processCryptoDeposit(paymentIntent, metadata);
        break;
      case "subscription_payment":
        await this.processSubscriptionPayment(paymentIntent, metadata);
        break;
      case "tip":
        await this.processTip(paymentIntent, metadata);
        break;
      case "boost_payment":
        await this.processBoostPayment(paymentIntent, metadata);
        break;
    }

    // Record transaction in database
    await this.recordTransaction(paymentIntent);

    // Send confirmation email
    // await emailService.sendPaymentConfirmation(userId, paymentIntent);
  }

  // Process marketplace purchase
  private static async processMarketplacePurchase(
    paymentIntent: Stripe.PaymentIntent,
    metadata: Record<string, string>,
  ): Promise<void> {
    const { productId, sellerId, quantity } = metadata;

    // Update product inventory
    // Create order record
    // Notify seller
    // Send purchase confirmation to buyer

    console.log(`Processing marketplace purchase: ${productId} x ${quantity}`);
  }

  // Process freelance payment
  private static async processFreelancePayment(
    paymentIntent: Stripe.PaymentIntent,
    metadata: Record<string, string>,
  ): Promise<void> {
    const { projectId, milestoneId, freelancerId } = metadata;

    // Release escrow payment
    // Update project milestone status
    // Notify freelancer
    // Update freelancer earnings

    console.log(`Processing freelance payment for project: ${projectId}`);
  }

  // Process crypto deposit
  private static async processCryptoDeposit(
    paymentIntent: Stripe.PaymentIntent,
    metadata: Record<string, string>,
  ): Promise<void> {
    const { userId, cryptoType } = metadata;
    const amount = paymentIntent.amount / 100; // Convert from cents

    // Add funds to user's crypto wallet
    // Record crypto transaction
    // Send deposit confirmation

    console.log(`Processing crypto deposit: $${amount} for ${cryptoType}`);
  }

  // Process subscription payment
  private static async processSubscriptionPayment(
    paymentIntent: Stripe.PaymentIntent,
    metadata: Record<string, string>,
  ): Promise<void> {
    const { subscriptionId, planType } = metadata;

    // Update user subscription status
    // Grant premium features
    // Send subscription confirmation

    console.log(`Processing subscription payment: ${planType}`);
  }

  // Process tip
  private static async processTip(
    paymentIntent: Stripe.PaymentIntent,
    metadata: Record<string, string>,
  ): Promise<void> {
    const { recipientId, postId } = metadata;
    const amount = paymentIntent.amount / 100;

    // Add tip to recipient's earnings
    // Record tip transaction
    // Notify recipient
    // Update post tip count

    console.log(`Processing tip: $${amount} to user ${recipientId}`);
  }

  // Process boost payment
  private static async processBoostPayment(
    paymentIntent: Stripe.PaymentIntent,
    metadata: Record<string, string>,
  ): Promise<void> {
    const { postId, productId, boostDuration } = metadata;

    // Activate boost for content
    // Set boost expiration
    // Update content visibility

    console.log(`Processing boost payment for ${postId || productId}`);
  }

  // Record transaction in database
  private static async recordTransaction(
    paymentIntent: Stripe.PaymentIntent,
  ): Promise<void> {
    // Save transaction to database with all relevant details
    console.log(`Recording transaction: ${paymentIntent.id}`);
  }

  // Create payment method
  static async createPaymentMethod(
    customerId: string,
    paymentMethodId: string,
  ): Promise<PaymentMethod> {
    try {
      const paymentMethod = await stripe.paymentMethods.attach(
        paymentMethodId,
        {
          customer: customerId,
        },
      );

      return {
        id: paymentMethod.id,
        type: paymentMethod.type,
        card: paymentMethod.card
          ? {
              brand: paymentMethod.card.brand,
              last4: paymentMethod.card.last4,
              expiryMonth: paymentMethod.card.exp_month,
              expiryYear: paymentMethod.card.exp_year,
            }
          : undefined,
      };
    } catch (error) {
      console.error("Payment method creation failed:", error);
      throw new Error("Failed to create payment method");
    }
  }

  // Get user payment methods
  static async getUserPaymentMethods(
    customerId: string,
  ): Promise<PaymentMethod[]> {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
      });

      return paymentMethods.data.map((pm) => ({
        id: pm.id,
        type: pm.type,
        card: pm.card
          ? {
              brand: pm.card.brand,
              last4: pm.card.last4,
              expiryMonth: pm.card.exp_month,
              expiryYear: pm.card.exp_year,
            }
          : undefined,
      }));
    } catch (error) {
      console.error("Failed to get payment methods:", error);
      throw new Error("Failed to get payment methods");
    }
  }

  // Create customer
  static async createCustomer(email: string, name?: string): Promise<string> {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          createdAt: new Date().toISOString(),
        },
      });

      return customer.id;
    } catch (error) {
      console.error("Customer creation failed:", error);
      throw new Error("Failed to create customer");
    }
  }

  // Create subscription
  static async createSubscription(
    customerId: string,
    priceId: string,
    paymentMethodId?: string,
  ): Promise<Subscription> {
    try {
      const subscriptionData: Stripe.SubscriptionCreateParams = {
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: "default_incomplete",
        expand: ["latest_invoice.payment_intent"],
      };

      if (paymentMethodId) {
        subscriptionData.default_payment_method = paymentMethodId;
      }

      const subscription = await stripe.subscriptions.create(subscriptionData);

      return {
        id: subscription.id,
        status: subscription.status,
        priceId,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      };
    } catch (error) {
      console.error("Subscription creation failed:", error);
      throw new Error("Failed to create subscription");
    }
  }

  // Cancel subscription
  static async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
      return true;
    } catch (error) {
      console.error("Subscription cancellation failed:", error);
      return false;
    }
  }

  // Create payout (for seller/freelancer earnings)
  static async createPayout(
    accountId: string,
    amount: number,
    currency: string = "usd",
  ): Promise<boolean> {
    try {
      await stripe.transfers.create({
        amount: amount * 100, // Convert to cents
        currency,
        destination: accountId,
        description: "Softchat earnings payout",
      });
      return true;
    } catch (error) {
      console.error("Payout creation failed:", error);
      return false;
    }
  }

  // Create connected account for sellers/freelancers
  static async createConnectedAccount(
    email: string,
    country: string = "US",
  ): Promise<string> {
    try {
      const account = await stripe.accounts.create({
        type: "express",
        email,
        country,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });

      return account.id;
    } catch (error) {
      console.error("Connected account creation failed:", error);
      throw new Error("Failed to create connected account");
    }
  }

  // Generate account link for onboarding
  static async createAccountLink(accountId: string): Promise<string> {
    try {
      const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: `${process.env.FRONTEND_URL}/seller/onboarding/refresh`,
        return_url: `${process.env.FRONTEND_URL}/seller/onboarding/complete`,
        type: "account_onboarding",
      });

      return accountLink.url;
    } catch (error) {
      console.error("Account link creation failed:", error);
      throw new Error("Failed to create account link");
    }
  }

  // Handle webhook events
  static async handleWebhook(body: string, signature: string): Promise<void> {
    try {
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
      const event = stripe.webhooks.constructEvent(
        body,
        signature,
        endpointSecret,
      );

      switch (event.type) {
        case "payment_intent.succeeded":
          await this.handlePaymentIntentSucceeded(
            event.data.object as Stripe.PaymentIntent,
          );
          break;
        case "payment_intent.payment_failed":
          await this.handlePaymentIntentFailed(
            event.data.object as Stripe.PaymentIntent,
          );
          break;
        case "invoice.payment_succeeded":
          await this.handleInvoicePaymentSucceeded(
            event.data.object as Stripe.Invoice,
          );
          break;
        case "customer.subscription.deleted":
          await this.handleSubscriptionDeleted(
            event.data.object as Stripe.Subscription,
          );
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error("Webhook handling failed:", error);
      throw error;
    }
  }

  private static async handlePaymentIntentSucceeded(
    paymentIntent: Stripe.PaymentIntent,
  ): Promise<void> {
    console.log(`Payment succeeded: ${paymentIntent.id}`);
    await this.processSuccessfulPayment(paymentIntent);
  }

  private static async handlePaymentIntentFailed(
    paymentIntent: Stripe.PaymentIntent,
  ): Promise<void> {
    console.log(`Payment failed: ${paymentIntent.id}`);
    // Handle failed payment - notify user, update order status, etc.
  }

  private static async handleInvoicePaymentSucceeded(
    invoice: Stripe.Invoice,
  ): Promise<void> {
    console.log(`Invoice payment succeeded: ${invoice.id}`);
    // Handle successful subscription payment
  }

  private static async handleSubscriptionDeleted(
    subscription: Stripe.Subscription,
  ): Promise<void> {
    console.log(`Subscription deleted: ${subscription.id}`);
    // Handle subscription cancellation - remove premium features, etc.
  }

  // Get payment analytics
  static async getPaymentAnalytics(
    startDate: Date,
    endDate: Date,
  ): Promise<{
    totalRevenue: number;
    totalTransactions: number;
    averageTransactionValue: number;
    revenueByType: Record<TransactionType, number>;
  }> {
    try {
      // This would typically query your database for transaction data
      // For now, we'll return mock data
      return {
        totalRevenue: 125000,
        totalTransactions: 1850,
        averageTransactionValue: 67.57,
        revenueByType: {
          marketplace_purchase: 75000,
          freelance_payment: 35000,
          crypto_deposit: 10000,
          subscription_payment: 4000,
          tip: 800,
          boost_payment: 200,
          withdrawal: 0,
        },
      };
    } catch (error) {
      console.error("Payment analytics failed:", error);
      throw new Error("Failed to get payment analytics");
    }
  }

  // Refund payment
  static async refundPayment(
    paymentIntentId: string,
    amount?: number,
    reason?: string,
  ): Promise<boolean> {
    try {
      const refundData: Stripe.RefundCreateParams = {
        payment_intent: paymentIntentId,
        reason: reason as Stripe.RefundCreateParams.Reason,
      };

      if (amount) {
        refundData.amount = amount * 100; // Convert to cents
      }

      await stripe.refunds.create(refundData);
      return true;
    } catch (error) {
      console.error("Refund failed:", error);
      return false;
    }
  }
}

// Platform fee calculator
export class FeeCalculator {
  private static readonly platformFees: Record<TransactionType, number> = {
    marketplace_purchase: 2.9, // 2.9%
    freelance_payment: 5.0, // 5.0%
    crypto_deposit: 1.5, // 1.5%
    subscription_payment: 0, // No fee for subscriptions
    tip: 2.0, // 2.0%
    boost_payment: 0, // No fee for boosts
    withdrawal: 0, // No fee for withdrawals
  };

  static calculateFee(amount: number, type: TransactionType): number {
    const feePercentage = this.platformFees[type] || 0;
    return Math.round(amount * (feePercentage / 100));
  }

  static getNetAmount(amount: number, type: TransactionType): number {
    const fee = this.calculateFee(amount, type);
    return amount - fee;
  }

  static getFeePercentage(type: TransactionType): number {
    return this.platformFees[type] || 0;
  }
}

export { PaymentService as default };
