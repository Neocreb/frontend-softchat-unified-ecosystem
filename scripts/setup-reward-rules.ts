import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { rewardRules } from "../shared/activity-economy-schema";

// Use regular postgres connection for scripts to avoid WebSocket issues
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const sql = postgres(connectionString);
const db = drizzle({ client: sql });

const defaultRewardRules = [
  {
    actionType: "post_content",
    displayName: "Create Post",
    description: "Earn points for creating quality content",
    baseSoftPoints: "3.0",
    baseWalletBonus: "0",
    currency: "USDT",
    dailyLimit: 10,
    weeklyLimit: 50,
    monthlyLimit: 200,
    minimumTrustScore: "0",
    decayEnabled: true,
    decayStart: 3,
    decayRate: "0.15",
    minMultiplier: "0.2",
    requiresModeration: false,
    qualityThreshold: "0.5",
    isActive: true,
  },
  {
    actionType: "like_post",
    displayName: "Like Post",
    description: "Earn points for engaging with content",
    baseSoftPoints: "0.5",
    baseWalletBonus: "0",
    currency: "USDT",
    dailyLimit: 100,
    weeklyLimit: 500,
    monthlyLimit: 2000,
    minimumTrustScore: "0",
    decayEnabled: true,
    decayStart: 50,
    decayRate: "0.1",
    minMultiplier: "0.1",
    requiresModeration: false,
    qualityThreshold: "0",
    isActive: true,
  },
  {
    actionType: "comment_post",
    displayName: "Comment on Post",
    description: "Earn points for meaningful comments",
    baseSoftPoints: "1.5",
    baseWalletBonus: "0",
    currency: "USDT",
    dailyLimit: 50,
    weeklyLimit: 300,
    monthlyLimit: 1000,
    minimumTrustScore: "0",
    decayEnabled: true,
    decayStart: 20,
    decayRate: "0.12",
    minMultiplier: "0.15",
    requiresModeration: false,
    qualityThreshold: "0.3",
    isActive: true,
  },
  {
    actionType: "share_content",
    displayName: "Share Content",
    description: "Earn points for sharing quality content",
    baseSoftPoints: "2.0",
    baseWalletBonus: "0",
    currency: "USDT",
    dailyLimit: 20,
    weeklyLimit: 100,
    monthlyLimit: 300,
    minimumTrustScore: "10",
    decayEnabled: true,
    decayStart: 10,
    decayRate: "0.2",
    minMultiplier: "0.2",
    requiresModeration: false,
    qualityThreshold: "0.5",
    isActive: true,
  },
  {
    actionType: "daily_login",
    displayName: "Daily Login",
    description: "Earn points for daily engagement",
    baseSoftPoints: "5.0",
    baseWalletBonus: "0",
    currency: "USDT",
    dailyLimit: 1,
    weeklyLimit: 7,
    monthlyLimit: 31,
    minimumTrustScore: "0",
    decayEnabled: false,
    decayStart: 1,
    decayRate: "0",
    minMultiplier: "1.0",
    requiresModeration: false,
    qualityThreshold: "0",
    isActive: true,
  },
  {
    actionType: "purchase_product",
    displayName: "Purchase Product",
    description: "Earn points and wallet bonus for marketplace purchases",
    baseSoftPoints: "10.0",
    baseWalletBonus: "0.01", // 1% wallet bonus
    currency: "USDT",
    dailyLimit: null, // Unlimited
    weeklyLimit: null,
    monthlyLimit: null,
    minimumTrustScore: "0",
    minimumValue: "1.0",
    decayEnabled: false,
    decayStart: 1,
    decayRate: "0",
    minMultiplier: "1.0",
    requiresModeration: false,
    qualityThreshold: "0",
    isActive: true,
  },
  {
    actionType: "complete_profile",
    displayName: "Complete Profile",
    description: "One-time reward for completing profile",
    baseSoftPoints: "25.0",
    baseWalletBonus: "0",
    currency: "USDT",
    dailyLimit: 1,
    weeklyLimit: 1,
    monthlyLimit: 1,
    minimumTrustScore: "0",
    decayEnabled: false,
    decayStart: 1,
    decayRate: "0",
    minMultiplier: "1.0",
    requiresModeration: false,
    qualityThreshold: "0",
    isActive: true,
  },
  {
    actionType: "refer_user",
    displayName: "Refer User",
    description: "Earn points for successful referrals",
    baseSoftPoints: "50.0",
    baseWalletBonus: "1.0",
    currency: "USDT",
    dailyLimit: 10,
    weeklyLimit: 50,
    monthlyLimit: 200,
    minimumTrustScore: "20",
    decayEnabled: false,
    decayStart: 1,
    decayRate: "0",
    minMultiplier: "1.0",
    requiresModeration: true,
    qualityThreshold: "0",
    isActive: true,
  },
];

async function setupRewardRules() {
  try {
    console.log("Setting up reward rules...");

    // Check if rules already exist
    const existingRules = await db.select().from(rewardRules).limit(1);

    if (existingRules.length > 0) {
      console.log("Reward rules already exist. Skipping setup.");
      return;
    }

    // Insert default rules
    await db.insert(rewardRules).values(defaultRewardRules);

    console.log(
      `✅ Successfully created ${defaultRewardRules.length} reward rules:`,
    );
    defaultRewardRules.forEach((rule) => {
      console.log(
        `  - ${rule.displayName}: ${rule.baseSoftPoints} SP${rule.baseWalletBonus !== "0" ? ` + ${rule.baseWalletBonus} ${rule.currency}` : ""}`,
      );
    });
  } catch (error) {
    console.error("❌ Error setting up reward rules:", error);
    throw error;
  }
}

// Check if this is the main module
if (import.meta.url === new URL(process.argv[1], "file://").href) {
  setupRewardRules()
    .then(() => {
      console.log("🎉 Reward rules setup completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Setup failed:", error);
      process.exit(1);
    });
}

export { setupRewardRules };
