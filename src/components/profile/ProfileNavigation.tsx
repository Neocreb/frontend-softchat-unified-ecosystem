import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Eye, ArrowRight, Star, Trophy, Zap } from "lucide-react";

interface ProfileNavigationProps {
  className?: string;
}

export const ProfileNavigation: React.FC<ProfileNavigationProps> = ({
  className,
}) => {
  const navigate = useNavigate();

  const quickLinks = [
    {
      title: "Your Profile",
      description: "View and edit your profile",
      path: "/app/profile",
      icon: <Users className="w-5 h-5" />,
      variant: "default" as const,
    },
    {
      title: "Profile Demo",
      description: "See the comprehensive profile system",
      path: "/app/demo/profiles",
      icon: <Eye className="w-5 h-5" />,
      variant: "outline" as const,
    },
    {
      title: "Discover Users",
      description: "Explore other users on the platform",
      path: "/app/explore",
      icon: <Star className="w-5 h-5" />,
      variant: "outline" as const,
    },
  ];

  const exampleProfiles = [
    { username: "sarah_tech", label: "Tech Seller", type: "Marketplace" },
    { username: "alex_dev", label: "Developer", type: "Freelancer" },
    { username: "mike_crypto", label: "Trader", type: "Crypto" },
    { username: "emma_creates", label: "Creator", type: "Content" },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Enhanced Profile System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Quick Actions
          </h3>
          <div className="space-y-2">
            {quickLinks.map((link, index) => (
              <Button
                key={index}
                variant={link.variant}
                className="w-full justify-between"
                onClick={() => navigate(link.path)}
              >
                <div className="flex items-center gap-2">
                  {link.icon}
                  <div className="text-left">
                    <div className="font-medium">{link.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {link.description}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Example Profiles</h3>
          <div className="grid grid-cols-2 gap-2">
            {exampleProfiles.map((profile, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="h-auto p-2 flex flex-col items-start"
                onClick={() => navigate(`/profile/${profile.username}`)}
              >
                <div className="font-medium text-xs">{profile.label}</div>
                <div className="text-xs text-muted-foreground">
                  @{profile.username}
                </div>
                <Badge variant="secondary" className="text-xs mt-1">
                  {profile.type}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-3">
          <h4 className="font-medium text-sm mb-2">🚀 Key Features</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Role-based profile extensions</li>
            <li>• Marketplace seller profiles</li>
            <li>• Freelancer service listings</li>
            <li>• Crypto trading profiles</li>
            <li>• Content creator showcases</li>
            <li>• Mock user generation</li>
            <li>• Profile discovery system</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileNavigation;
