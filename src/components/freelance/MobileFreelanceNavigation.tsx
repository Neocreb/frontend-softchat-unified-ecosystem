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
  DollarSign,
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
      icon: DollarSign,
      label: "Creator Economy",
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
                  "h-8 px-3 text-xs font-medium transition-colors",
                  action.color,
                  "text-white shadow-md",
                )}
              >
                <action.icon className="w-3 h-3 mr-1.5" />
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-background/95 backdrop-blur border-t border-border/50">
        <div className="grid grid-cols-5 items-center justify-center px-2 py-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 relative",
                  item.active
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted/60",
                  item.special &&
                    !item.active &&
                    "bg-green-50 border border-green-200",
                )}
              >
                <div className="relative">
                  <IconComponent
                    className={cn(
                      "w-5 h-5 transition-colors",
                      item.active
                        ? "text-primary"
                        : item.special
                          ? "text-green-600"
                          : item.color,
                    )}
                  />
                  {item.badge && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center min-w-[16px]"
                    >
                      {item.badge > 9 ? "9+" : item.badge}
                    </Badge>
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium mt-1 truncate w-full text-center",
                    item.active
                      ? "text-primary"
                      : item.special
                        ? "text-green-600 font-semibold"
                        : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Notification Overlay (when enabled) */}
      {showNotifications && notificationCount > 0 && (
        <div className="absolute top-0 right-4">
          <Button
            size="sm"
            className="h-7 px-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg"
          >
            <Bell className="w-3 h-3 mr-1" />
            {notificationCount}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MobileFreelanceNavigation;
