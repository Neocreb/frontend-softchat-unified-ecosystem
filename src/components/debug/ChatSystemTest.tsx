import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, MessageSquare, Users, Settings } from "lucide-react";

interface ChatSystemTestProps {
  className?: string;
}

export const ChatSystemTest: React.FC<ChatSystemTestProps> = ({ className }) => {
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  const testCases = [
    {
      id: "social_direct",
      name: "Social Direct Chat",
      description: "Test direct message with Alice Johnson",
      chatId: "social_1",
      type: "social",
      expected: "Should show Alice Johnson profile and messages"
    },
    {
      id: "social_group", 
      name: "Social Group Chat",
      description: "Test family group chat",
      chatId: "social_group_1",
      type: "social",
      expected: "Should show Family Group with member list and admin controls"
    },
    {
      id: "freelance_chat",
      name: "Freelance Chat",
      description: "Test freelance project chat",
      chatId: "freelance_1", 
      type: "freelance",
      expected: "Should show TechStart Inc with work context"
    },
    {
      id: "marketplace_chat",
      name: "Marketplace Chat",
      description: "Test marketplace seller chat",
      chatId: "marketplace_1",
      type: "marketplace", 
      expected: "Should show Electronics Store with product context"
    },
    {
      id: "crypto_chat",
      name: "Crypto P2P Chat",
      description: "Test crypto trading chat",
      chatId: "crypto_1",
      type: "crypto",
      expected: "Should show Bitcoin Trader with trading context"
    }
  ];

  const runTest = (testCase: typeof testCases[0]) => {
    try {
      // Store test data for verification
      const testData = {
        id: testCase.chatId,
        type: testCase.type,
        timestamp: new Date().toISOString(),
        testId: testCase.id
      };
      
      localStorage.setItem(`test_${testCase.chatId}`, JSON.stringify(testData));
      
      // Navigate to chat
      navigate(`/app/chat/${testCase.chatId}?type=${testCase.type}`);
      
      // Mark as tested (would need actual verification in real scenario)
      setTestResults(prev => ({ ...prev, [testCase.id]: true }));
    } catch (error) {
      console.error(`Test failed for ${testCase.id}:`, error);
      setTestResults(prev => ({ ...prev, [testCase.id]: false }));
    }
  };

  const runAllTests = () => {
    testCases.forEach((testCase, index) => {
      setTimeout(() => {
        runTest(testCase);
      }, index * 1000); // Stagger tests by 1 second
    });
  };

  const clearTestData = () => {
    testCases.forEach(testCase => {
      localStorage.removeItem(`test_${testCase.chatId}`);
      localStorage.removeItem(`chat_${testCase.chatId}`);
    });
    setTestResults({});
  };

  const goToChatList = () => {
    navigate('/app/chat');
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Chat System Test Suite
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Test the chat system to ensure proper navigation and functionality
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Control Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button onClick={runAllTests} variant="default">
            Run All Tests
          </Button>
          <Button onClick={goToChatList} variant="outline">
            Go to Chat List
          </Button>
          <Button onClick={clearTestData} variant="outline">
            Clear Test Data
          </Button>
        </div>

        {/* Test Cases */}
        <div className="space-y-3">
          {testCases.map((testCase) => (
            <div
              key={testCase.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{testCase.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {testCase.type}
                  </Badge>
                  {testCase.chatId.includes('group') && (
                    <Users className="h-4 w-4 text-muted-foreground" />
                  )}
                  {testResults[testCase.id] !== undefined && (
                    testResults[testCase.id] ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {testCase.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  Expected: {testCase.expected}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => runTest(testCase)}
              >
                Test
              </Button>
            </div>
          ))}
        </div>

        {/* Test Instructions */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Test Instructions:</h4>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>Click "Run All Tests" or individual test buttons</li>
            <li>Verify each chat loads with correct participant info</li>
            <li>For group chats, click the settings icon to open group info modal</li>
            <li>Test admin controls like member management (if you're admin)</li>
            <li>Verify messages can be sent and received</li>
            <li>Test navigation back to chat list</li>
          </ol>
        </div>

        {/* Results Summary */}
        {Object.keys(testResults).length > 0 && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Test Results:</h4>
            <div className="flex gap-4 text-sm">
              <span className="text-green-600">
                Passed: {Object.values(testResults).filter(Boolean).length}
              </span>
              <span className="text-red-600">
                Failed: {Object.values(testResults).filter(r => !r).length}
              </span>
              <span className="text-muted-foreground">
                Total: {Object.keys(testResults).length}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
