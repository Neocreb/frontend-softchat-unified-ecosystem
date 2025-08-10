import { ActivityRewardService } from "@/services/activityRewardService";

export async function testRewardsIntegration() {
  console.log("🧪 Testing Rewards System Integration...");
  
  try {
    // Test 1: Check if reward summary endpoint is working
    console.log("📊 Testing reward summary API...");
    const summaryData = await ActivityRewardService.getRewardSummary("7d");
    if (summaryData) {
      console.log("✅ Reward summary API working:", summaryData);
    } else {
      console.log("⚠️ Reward summary API returned null (expected if not logged in)");
    }

    // Test 2: Check if reward history endpoint is working
    console.log("📚 Testing reward history API...");
    const historyData = await ActivityRewardService.getRewardHistory(1, 10);
    if (historyData) {
      console.log("✅ Reward history API working:", historyData);
    } else {
      console.log("⚠️ Reward history API returned null (expected if not logged in)");
    }

    // Test 3: Test device and session ID generation
    console.log("🔧 Testing utility functions...");
    const deviceId = localStorage.getItem("deviceId");
    const sessionId = sessionStorage.getItem("sessionId");
    console.log("✅ Device ID:", deviceId);
    console.log("✅ Session ID:", sessionId);

    return {
      success: true,
      tests: {
        summaryApi: !!summaryData,
        historyApi: !!historyData,
        deviceId: !!deviceId,
        sessionId: !!sessionId
      }
    };
  } catch (error) {
    console.error("❌ Rewards integration test failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

// Auto-run test when imported (only in development)
if (process.env.NODE_ENV === "development") {
  testRewardsIntegration();
}
