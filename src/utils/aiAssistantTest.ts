import { realTimeAIService } from "@/services/realTimeAIService";

/**
 * Test utility to verify real-time AI functionality
 */
export const testAIAssistant = async () => {
  console.log("🤖 Testing Edith AI Assistant Real-time Capabilities...\n");

  const mockUser = {
    id: "test-user",
    name: "Test User",
    email: "test@example.com",
  };

  const testQueries = [
    "What time is it?",
    "What's the current Bitcoin price?",
    "How's the weather today?",
    "Show me the latest news",
    "Calculate 25 * 8",
    "What can you help me with?",
  ];

  for (const query of testQueries) {
    try {
      console.log(`📝 Query: "${query}"`);
      const response = await realTimeAIService.generateRealTimeResponse(
        query,
        mockUser,
      );
      console.log(`🎯 Response: ${response.message.substring(0, 100)}...`);
      console.log(`📊 Confidence: ${response.confidence}%`);
      console.log(`📚 Sources: ${response.sources.join(", ")}`);
      console.log(`🎬 Actions: ${response.suggestedActions.length} available`);
      console.log(
        `❓ Follow-ups: ${response.followUpQuestions.length} questions`,
      );
      console.log("---\n");
    } catch (error) {
      console.error(`❌ Error testing query "${query}":`, error);
    }
  }

  console.log("✅ AI Assistant Test Complete!");
};

/**
 * Quick test for specific real-time features
 */
export const testSpecificFeatures = async () => {
  const mockUser = { id: "test", name: "Tester", email: "test@test.com" };

  console.log("🕐 Time Test:");
  const timeResponse = await realTimeAIService.generateRealTimeResponse(
    "what time is it",
    mockUser,
  );
  console.log(timeResponse.message);

  console.log("\n💰 Crypto Test:");
  const cryptoResponse = await realTimeAIService.generateRealTimeResponse(
    "bitcoin price",
    mockUser,
  );
  console.log(cryptoResponse.message);

  console.log("\n🧮 Calculation Test:");
  const calcResponse = await realTimeAIService.generateRealTimeResponse(
    "calculate 15 + 27",
    mockUser,
  );
  console.log(calcResponse.message);
};

// Export for browser console testing
if (typeof window !== "undefined") {
  (window as any).testAI = testAIAssistant;
  (window as any).testAIFeatures = testSpecificFeatures;
}
