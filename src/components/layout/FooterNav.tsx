import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Search,
  Video,
  ShoppingCart,
  TrendingUp,
  Wallet,
  Plus,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/contexts/NavigationContext";

const FooterNav = () => {
  const location = useLocation();
  const { isNavVisible, isVideoPage, toggleNav } = useNavigation();

  const navItems = [
    {
      icon: Home,
      label: "Feed",
      href: "/app/feed",
      active: location.pathname === "/app" || location.pathname === "/app/feed",
    },
    {
      icon: Search,
      label: "Explore",
      href: "/app/explore",
      active: location.pathname === "/app/explore",
    },
    {
      icon: Plus,
      label: "Freelance",
      href: "/app/freelance",
      active:
        location.pathname === "/app/freelance" ||
        location.pathname.startsWith("/app/freelance"),
      special: true,
    },
    {
      icon: Video,
      label: "Videos",
      href: "/app/videos",
      active: location.pathname === "/app/videos",
    },
    {
      icon: ShoppingCart,
      label: "Market",
      href: "/app/marketplace",
      active: location.pathname === "/app/marketplace",
    },
    {
      icon: TrendingUp,
      label: "Crypto",
      href: "/app/crypto",
      active:
        location.pathname === "/app/crypto" ||
        location.pathname.startsWith("/app/crypto"),
    },
  ];

  // Don't render on video pages if navigation is hidden
  if (isVideoPage && !isNavVisible) {
    return (
      <div className="fixed bottom-4 left-4 z-[100] md:hidden">
        <Button
          variant="default"
          size="sm"
          onClick={() => toggleNav()}
          className="rounded-full h-12 w-12 p-0 shadow-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 inset-x-0 bg-background/95 backdrop-blur border-t md:hidden z-[100] safe-area-pb transition-transform duration-300",
        isVideoPage && "cursor-pointer"
      )}
      onClick={isVideoPage ? toggleNav : undefined}
    >
      <div className="grid grid-cols-6 h-14 sm:h-16 px-1 w-full max-w-full">
        {navItems.map((item) => (
          <Link key={item.href} to={item.href} className="w-full min-w-0">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full flex flex-col items-center justify-center py-1 px-0.5 h-full rounded-none text-center min-w-0",
                item.active ? "text-primary" : "text-muted-foreground",
                item.special && item.active && "bg-primary/10",
              )}
            >
              <item.icon
                className={cn(
                  "h-3 w-3 sm:h-4 sm:w-4 mb-0.5 sm:mb-1 flex-shrink-0",
                  item.active ? "text-primary" : "text-muted-foreground",
                  item.special && "h-4 w-4 sm:h-5 sm:w-5",
                )}
              />
              <span className="text-[10px] sm:text-xs leading-none truncate w-full">
                {item.label}
              </span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FooterNav;
