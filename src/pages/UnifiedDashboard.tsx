import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Briefcase,
  ShoppingBag,
  Truck,
  Crown,
  ArrowRight,
  Sparkles,
  TrendingUp,
  DollarSign,
  Clock,
} from "lucide-react";
import RoleSwitcher from "@/components/layout/RoleSwitcher";

interface DashboardCard {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  isActive?: boolean;
  isAvailable?: boolean;
  stats?: {
    label: string;
    value: string | number;
    change?: string;
  }[];
  comingSoon?: boolean;
}

export const UnifiedDashboard: React.FC = () => {
  const { user, hasRole, activeRole } = useAuth();
  const navigate = useNavigate();

  const dashboardCards: DashboardCard[] = [
    {
      role: "user",
      title: "Social Feed",
      description: "Connect with friends, share content, and discover new communities",
      icon: User,
      path: "/app/feed",
      isActive: activeRole === "user",
      isAvailable: hasRole("user"),
      stats: [
        { label: "Following", value: 245 },
        { label: "Followers", value: 189 },
        { label: "Posts", value: 87 },
      ],
    },
    {
      role: "freelancer",
      title: "Freelance Hub",
      description: "Manage projects, track earnings, and grow your freelance business",
      icon: Briefcase,
      path: "/app/freelance/dashboard",
      isActive: activeRole === "freelancer",
      isAvailable: hasRole("freelancer"),
      stats: [
        { label: "Active Projects", value: 3 },
        { label: "Total Earnings", value: "₦125,450" },
        { label: "Rating", value: "4.9/5" },
      ],
    },
    {
      role: "seller",
      title: "Marketplace Dashboard",
      description: "Manage your store, track sales, and analyze performance",
      icon: ShoppingBag,
      path: "/app/marketplace/seller",
      isActive: activeRole === "seller",
      isAvailable: hasRole("seller"),
      stats: [
        { label: "Products", value: 12 },
        { label: "Sales", value: "₦89,200" },
        { label: "Orders", value: 45 },
      ],
    },
    {
      role: "dispatch_rider",
      title: "Dispatch Partner",
      description: "Accept delivery requests, track earnings, and manage your schedule",
      icon: Truck,
      path: "/app/dispatch/dashboard",
      isActive: activeRole === "dispatch_rider",
      isAvailable: hasRole("dispatch_rider"),
      stats: [
        { label: "Deliveries", value: 156 },
        { label: "Earnings", value: "₦45,800" },
        { label: "Rating", value: "4.8/5" },
      ],
    },
    {
      role: "creator",
      title: "Creator Studio",
      description: "Create content, manage campaigns, and monetize your audience",
      icon: Crown,
      path: "/app/creator-studio",
      isActive: activeRole === "creator",
      isAvailable: hasRole("creator"),
      comingSoon: true,
      stats: [
        { label: "Subscribers", value: "2.1K" },
        { label: "Views", value: "45.2K" },
        { label: "Revenue", value: "₦12,340" },
      ],
    },
  ];

  // Auto-redirect if user only has one role
  useEffect(() => {
    const availableRoles = dashboardCards.filter(card => card.isAvailable && !card.comingSoon);
    
    if (availableRoles.length === 1 && availableRoles[0].isActive) {
      // User has only one role and it's already active, redirect to its dashboard
      navigate(availableRoles[0].path);
    }
  }, [hasRole, activeRole, navigate]);

  const availableCards = dashboardCards.filter(card => card.isAvailable);
  const unavailableCards = dashboardCards.filter(card => !card.isAvailable);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Choose your workspace or switch between your active roles
              </p>
            </div>
            <RoleSwitcher />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">₦172,450</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">247</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Tasks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">4.8</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">{availableCards.length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Roles</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Available Dashboards */}
        {availableCards.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Your Dashboards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCards.map((card) => (
                <Card 
                  key={card.role}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    card.isActive 
                      ? "border-primary bg-primary/5" 
                      : "hover:border-primary/50"
                  } ${card.comingSoon ? "opacity-60" : ""}`}
                  onClick={() => !card.comingSoon && navigate(card.path)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          card.isActive 
                            ? "bg-primary/20" 
                            : "bg-gray-100 dark:bg-gray-800"
                        }`}>
                          <card.icon className={`w-6 h-6 ${
                            card.isActive ? "text-primary" : "text-gray-600 dark:text-gray-400"
                          }`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{card.title}</CardTitle>
                          {card.isActive && (
                            <Badge variant="secondary" className="mt-1">
                              Active
                            </Badge>
                          )}
                          {card.comingSoon && (
                            <Badge variant="outline" className="mt-1">
                              Coming Soon
                            </Badge>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {card.description}
                    </p>
                    
                    {card.stats && !card.comingSoon && (
                      <div className="grid grid-cols-3 gap-3">
                        {card.stats.map((stat, index) => (
                          <div key={index} className="text-center">
                            <p className="font-bold text-sm">{stat.value}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {stat.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Roles to Add */}
        {unavailableCards.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Expand Your Opportunities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unavailableCards.map((card) => (
                <Card 
                  key={card.role}
                  className="border-dashed border-2 hover:border-primary/50 transition-all duration-200"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <card.icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{card.title}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          Apply Now
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {card.description}
                    </p>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        if (card.role === "dispatch_rider") {
                          navigate("/app/dispatch/apply");
                        } else {
                          // Handle other role applications
                          console.log(`Apply for ${card.role}`);
                        }
                      }}
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedDashboard;
