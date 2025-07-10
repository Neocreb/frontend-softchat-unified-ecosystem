import { Link, useLocation } from "react-router-dom";
import {
  User,
  Settings,
  Bell,
  MessageCircle,
  Wallet,
  Award,
  Shield,
  CreditCard,
  TrendingUp,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const SecondaryNav = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  // Only show on profile and settings related pages
  const showSecondaryNav = [
    "/app/profile",
    "/app/settings",
    "/app/wallet",
    "/app/notifications",
    "/app/chat",
    "/app/rewards",
  ].some((path) => location.pathname.startsWith(path));

  if (isMobile || !showSecondaryNav) return null;

  const navItems = [
    {
      icon: User,
      label: "Profile",
      href: "/app/profile",
      active: location.pathname === "/app/profile",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/app/settings",
      active: location.pathname === "/app/settings",
    },
    {
      icon: Wallet,
      label: "Wallet",
      href: "/app/wallet",
      active: location.pathname === "/app/wallet",
    },
    {
      icon: Award,
      label: "Rewards",
      href: "/app/rewards",
      active: location.pathname === "/app/rewards",
    },
    {
      icon: Bell,
      label: "Notifications",
      href: "/app/notifications",
      active: location.pathname === "/app/notifications",
    },
    {
      icon: MessageCircle,
      label: "Messages",
      href: "/app/chat",
      active:
        location.pathname === "/app/chat" ||
        location.pathname.startsWith("/app/chat"),
    },
  ];

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-none border-b-2 transition-colors whitespace-nowrap",
                item.active
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted",
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SecondaryNav;
