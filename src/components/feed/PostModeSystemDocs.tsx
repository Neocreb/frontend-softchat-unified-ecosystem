import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  List,
  Sparkles,
  CheckCircle,
  Info,
  Settings,
  Zap,
} from "lucide-react";

const PostModeSystemDocs: React.FC = () => {
  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Enhanced Post Mode System</h1>
        <p className="text-muted-foreground">
          Complete guide to the new mode-aware posting and reward system
        </p>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            System Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The enhanced post mode system allows users to create posts that can be targeted
            to specific feed modes (Classic or Threaded) or appear in both modes simultaneously.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <List className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-medium">Classic Mode</h3>
              <p className="text-sm text-muted-foreground">
                Traditional social feed with nested comments
              </p>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-medium">Threaded Mode</h3>
              <p className="text-sm text-muted-foreground">
                Twitter-style conversations with reply posts
              </p>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <h3 className="font-medium">Universal Posts</h3>
              <p className="text-sm text-muted-foreground">
                Appear in both modes automatically
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Key Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">✅ Fixed Issues</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Posts now publish to the correct mode they were created in</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Reward system properly tracks post creation activities</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Comment, share, and gift icons work in all modes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Enhanced share modal with repost/quote functionality</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">🚀 New Features</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>Mode selection during post creation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Settings className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Privacy and comment settings per post</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Smart mode filtering and post visibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Enhanced repost and quote post functionality</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mode Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Publishing Mode Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <h3 className="font-medium">Both Modes</h3>
                  <Badge className="ml-auto text-xs">Recommended</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Post appears in both Classic and Threaded feeds, maximizing reach and engagement.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <List className="h-4 w-4 text-blue-500" />
                  <h3 className="font-medium">Classic Only</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Post only appears in Classic feed with traditional layout and nested comments.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-green-500" />
                  <h3 className="font-medium">Threaded Only</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Post only appears in Threaded feed as a conversation starter with reply posts.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reward System */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Reward System Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The reward system now properly tracks all post creation activities and awards
            SoftPoints based on content quality, user trust score, and engagement.
          </p>
          
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-2">Reward Calculation Factors:</h3>
            <ul className="text-sm space-y-1">
              <li>• <strong>Base Points:</strong> 3 SoftPoints per post</li>
              <li>• <strong>Trust Multiplier:</strong> Based on user trust score</li>
              <li>• <strong>Content Quality:</strong> Length, media, links considered</li>
              <li>• <strong>Publishing Mode:</strong> Universal posts may receive bonus</li>
              <li>• <strong>Daily Limits:</strong> Maximum 3 rewarded posts per day</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Technical Implementation */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Implementation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Key Components:</h3>
              <ul className="text-sm space-y-1 font-mono">
                <li>• CreatePostWithModeSelection.tsx</li>
                <li>• HybridFeedContext.tsx (updated)</li>
                <li>• PostActions.tsx (enhanced)</li>
                <li>• EnhancedShareModal.tsx</li>
                <li>• UnifiedActionButtons.tsx</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Updated Features:</h3>
              <ul className="text-sm space-y-1">
                <li>• Mode-aware post filtering</li>
                <li>• Enhanced interaction tracking</li>
                <li>• Cross-mode compatibility</li>
                <li>• Reward integration</li>
                <li>• Share functionality</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostModeSystemDocs;
