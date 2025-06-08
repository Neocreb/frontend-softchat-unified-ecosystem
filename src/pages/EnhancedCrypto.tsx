
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedP2PMarketplace from '@/components/crypto/EnhancedP2PMarketplace';
import SmartRecommendations from '@/components/ai/SmartRecommendations';
import ContentAnalyticsDashboard from '@/components/ai/ContentAnalyticsDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Brain, BarChart3, Shield } from 'lucide-react';

const EnhancedCrypto = () => {
  // Mock user ID - in real app, get from auth context
  const currentUserId = "user-123";

  const handleRecommendationClick = (postId: string) => {
    console.log('Navigate to post:', postId);
    // In a real app, navigate to the post
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Enhanced Crypto Trading</h1>
          <p className="text-muted-foreground">
            Advanced P2P trading with AI-powered insights
          </p>
        </div>
      </div>

      <Tabs defaultValue="trading" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trading" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trading
          </TabsTrigger>
          <TabsTrigger value="ai-insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trading">
          <EnhancedP2PMarketplace />
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Trading Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Market Analysis</h4>
                      <p className="text-sm text-blue-600">
                        Bitcoin is showing strong upward momentum. Consider buying opportunities 
                        between $52,000 - $53,000 based on current market conditions.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Trading Recommendation</h4>
                      <p className="text-sm text-green-600">
                        High-rated traders are currently offering competitive rates. 
                        Trader123 has a 98% completion rate and avg. 15min release time.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-yellow-800 mb-2">Risk Assessment</h4>
                      <p className="text-sm text-yellow-600">
                        Your trading pattern indicates low risk profile. Consider increasing 
                        your daily limit after KYC level 2 verification.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <SmartRecommendations 
                userId={currentUserId} 
                onRecommendationClick={handleRecommendationClick}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <ContentAnalyticsDashboard userId={currentUserId} />
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Advanced security features coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedCrypto;
