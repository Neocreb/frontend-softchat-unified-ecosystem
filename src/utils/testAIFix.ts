/**
 * Simple test to verify the AI service is working after the fix
 */

// Test directly in browser console
export const testAIServiceFix = () => {
  const mockUser = {
    id: "test-user",
    name: "TestUser",
    email: "test@example.com",
  };

  console.log("🔧 Testing AI Service Fix...");

  // Import and test the service
  import("../services/realTimeAIService").then(
    async ({ realTimeAIService }) => {
      try {
        // Test a simple greeting
        const response = await realTimeAIService.generateRealTimeResponse(
          "Hi Edith!",
          mockUser,
        );

        console.log("✅ AI Service Test Successful!");
        console.log("📝 Response:", response.message.substring(0, 100) + "...");
        console.log("📊 Confidence:", response.confidence + "%");
        console.log("🎯 Category:", response.category);

        return true;
      } catch (error) {
        console.error("❌ AI Service Test Failed:", error);
        return false;
      }
    },
  );
};

// Auto-export for browser console
if (typeof window !== "undefined") {
  (window as any).testAIServiceFix = testAIServiceFix;
  console.log(
    "🧪 Run 'testAIServiceFix()' in console to test the AI service fix",
  );
}
