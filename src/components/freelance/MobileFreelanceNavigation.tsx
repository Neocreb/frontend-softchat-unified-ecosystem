import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Home,
  Search,
  Briefcase,
  MessageSquare,
  Wallet,
  User,
  ShoppingCart,
  TrendingUp,
  Video,
  Plus,
  Bell,
  Bot,
  Award,
} from "lucide-react";

interface MobileFreelanceNavigationProps {
  className?: string;
  variant?: "default" | "freelance-focused" | "unified";
  showNotifications?: boolean;
  notificationCount?: number;
}

export const MobileFreelanceNavigation: React.FC<
  MobileFreelanceNavigationProps
> = ({
  className,
  variant = "unified",
  showNotifications = true,
  notificationCount = 0,
}) => {
  const location = useLocation();

  // Different navigation configurations based on variant
  const getNavItems = () => {
    const baseItems = [
      {
        icon: Home,
        label: "Home",
        href: "/app/feed",
        active:
          location.pathname === "/app" || location.pathname === "/app/feed",
        color: "text-blue-600",
      },
      {
        icon: Briefcase,
        label: "Jobs",
        href: "/app/freelance",
        active:
          location.pathname === "/app/freelance" ||
          location.pathname.startsWith("/app/freelance"),
        color: "text-green-600",
        special: true, // Highlighted for freelance
      },
      {
        icon: Wallet,
        label: "Wallet",
        href: "/app/wallet",
        active: location.pathname === "/app/wallet",
        color: "text-purple-600",
      },
      {
        icon: User,
        label: "Profile",
        href: "/app/profile",
        active: location.pathname === "/app/profile",
        color: "text-orange-600",
      },
      {
        icon: MessageSquare,
        label: "Messages",
        href: "/app/chat",
        active: location.pathname === "/app/chat",
        color: "text-pink-600",
        badge: notificationCount > 0 ? notificationCount : undefined,
      },
    ];

    switch (variant) {
      case "freelance-focused":
        return [
          baseItems[0], // Home
          baseItems[1], // Jobs (Freelance)
          {
            icon: Search,
            label: "Browse",
            href: "/app/freelance/browse",
            active: location.pathname === "/app/freelance/browse",
            color: "text-indigo-600",
          },
          baseItems[2], // Wallet
          baseItems[4], // Messages
        ];

      case "unified":
        return [
          baseItems[0], // Home
          {
            icon: Search,
            label: "Explore",
            href: "/app/explore",
            active: location.pathname === "/app/explore",
            color: "text-gray-600",
          },
          baseItems[1], // Freelance (Jobs)
          {
            icon: ShoppingCart,
            label: "Market",
            href: "/app/marketplace",
            active: location.pathname === "/app/marketplace",
            color: "text-green-600",
          },
          baseItems[2], // Wallet
          baseItems[3], // Profile
        ];

      default:
        return baseItems;
    }
  };

  const navItems = getNavItems();

  // Quick action items that appear in center or as floating action
  const quickActions = [
    {
      icon: Plus,
      label: "Post Job",
      href: "/app/freelance/post-job",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      icon: Bot,
      label: "AI Assistant",
      href: "/app/ai-assistant",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      icon: Award,
      label: "Rewards",
      href: "/app/rewards",
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ];

  return (
    <div className={cn("fixed bottom-0 inset-x-0 z-50", className)}>
      {/* Quick Actions Bar (appears above main nav) */}
      <div className="bg-background/95 backdrop-blur border-t border-border/50 px-4 py-2">
        <div className="flex items-center justify-center gap-2">
          {quickActions.map((action) => (
            <Link key={action.href} to={action.href}>
              <Button
                size="sm"
                className={cn(
                  "h-8 px-3 text-xs font-medium text-white shadow-lg",
                  action.color,
                )}
              >
                <action.icon className="w-3 h-3 mr-1" />
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-background/95 backdrop-blur border-t border-border">
        <div className="safe-area-pb">
          <div
            className={cn(
              "grid h-16 px-1",
              navItems.length === 5 ? "grid-cols-5" : "grid-cols-6",
            )}
          >
            {navItems.map((item) => (
              <Link key={item.href} to={item.href} className="w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full h-full flex flex-col items-center justify-center p-1 rounded-none gap-1 relative",
                    item.active
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    item.special && item.active && "bg-primary/10 text-primary",
                  )}
                >
                  <div className="relative">
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        item.active
                          ? item.color || "text-primary"
                          : "text-muted-foreground",
                        item.special && "h-6 w-6",
                      )}
                    />
                    {item.badge && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs flex items-center justify-center"
                      >
                        {item.badge > 99 ? "99+" : item.badge}
                      </Badge>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium leading-none",
                      item.active ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </span>
                  {item.active && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                  )}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Notification Bell (if enabled and has notifications) */}
      {showNotifications && notificationCount > 0 && (
        <div className="absolute top-2 right-4">
          <Link to="/app/notifications">
            <Button
              size="sm"
              className="h-8 w-8 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg"
            >
              <Bell className="w-4 h-4" />
              <Badge
                variant="secondary"
                className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-yellow-500 text-black"
              >
                {notificationCount > 9 ? "9+" : notificationCount}
              </Badge>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

// Extended navigation for different platform sections
export const FreelanceMobileNav: React.FC = () => (
  <MobileFreelanceNavigation variant="freelance-focused" />
);

export const UnifiedMobileNav: React.FC = () => (
  <MobileFreelanceNavigation variant="unified" />
);

export const DefaultMobileNav: React.FC = () => (
  <MobileFreelanceNavigation variant="default" />
);

export default MobileFreelanceNavigation;
