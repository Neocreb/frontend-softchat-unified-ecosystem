import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Camera,
  BarChart3,
  Activity,
  Users,
  Store,
  Code,
  MessageSquare,
  Eye,
  TrendingUp,
} from "lucide-react";

const ProfileDirectAccess: React.FC = () => {
  const navigate = useNavigate();

  const enhancedFeatures = [
    {
      icon: <Camera className="h-4 w-4" />,
      title: "Enhanced Media Section",
      description: "Filter by All/Images/Videos, Grid/List views",
    },
    {
      icon: <BarChart3 className="h-4 w-4" />,
      title: "Creator Studio",
      description: "Analytics, performance metrics, growth tips",
    },
    {
      icon: <Activity className="h-4 w-4" />,
      title: "Activity Timeline",
      description: "Visual timeline with performance insights",
    },
    {
      icon: <Users className="h-4 w-4" />,
      title: "Enhanced About",
      description: "Skills, achievements, professional info",
    },
  ];

  const handleNavigateToProfile = () => {
    navigate("/app/profile");
  };

  const handleNavigateToFeed = () => {
    navigate("/app/feed");
  };

  const handleNavigateToCreatorStudio = () => {
    navigate("/app/creator-studio");
  };

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg">
            Enhanced Profile Page Features
          </CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            NEW
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p className="text-sm">
            You're currently on <strong>/feed</strong>. Click below to see the
            enhanced profile page!
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Navigation Button */}
        <div className="text-center">
          <Button
            onClick={handleNavigateToProfile}
            size="lg"
            className="w-full sm:w-auto px-8 py-3 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <User className="h-5 w-5 mr-2" />
            View Enhanced Profile Page
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>

        {/* Features Preview */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            New Features Added:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {enhancedFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/50 border"
              >
                <div className="text-blue-600 mt-0.5">{feature.icon}</div>
                <div className="min-w-0">
                  <div className="font-medium text-sm">{feature.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {feature.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Horizontal Tabs Preview */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            Horizontal Scrolling Tabs (7 Total):
          </h4>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { icon: MessageSquare, label: "Posts", count: "3" },
              { icon: Store, label: "Products", count: "0" },
              { icon: Code, label: "Services", count: "0" },
              { icon: Camera, label: "Media", count: "4" },
              { icon: BarChart3, label: "Creator Studio" },
              { icon: Activity, label: "Activity", count: "4" },
              { icon: Users, label: "About" },
            ].map((tab, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border text-sm whitespace-nowrap"
              >
                <tab.icon className="h-3 w-3" />
                <span>{tab.label}</span>
                {tab.count && (
                  <Badge variant="secondary" className="text-xs h-4 px-1">
                    {tab.count}
                  </Badge>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            ← Swipe left/right on mobile to see all tabs
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleNavigateToProfile}>
            <User className="h-4 w-4 mr-2" />
            Direct Link to /profile
          </Button>
          <Button variant="outline" size="sm" onClick={handleNavigateToFeed}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Stay on Feed
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNavigateToCreatorStudio}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Creator Studio
          </Button>
        </div>

        {/* Sample User Profile Link */}
        <div className="text-center pt-2 border-t">
          <p className="text-xs text-muted-foreground mb-2">
            Or view a sample user profile:
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/user/johndoe")}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Sample User Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileDirectAccess;
