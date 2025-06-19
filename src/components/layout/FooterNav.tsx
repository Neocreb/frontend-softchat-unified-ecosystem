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
} from "lucide-react";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";

const FooterNav = () => {
  const location = useLocation();

  const navItems = [
    {
      icon: Home,
      label: "Feed",
      href: "/feed",
      active: location.pathname === "/" || location.pathname === "/feed",
    },
    {
      icon: Search,
      label: "Explore",
      href: "/explore",
      active: location.pathname === "/explore",
    },
    {
      icon: Plus,
      label: "Freelance",
      href: "/create",
      active: location.pathname === "/create",
      special: true,
    },
    {
      icon: Video,
      label: "Videos",
      href: "/videos",
      active: location.pathname === "/videos",
    },
    {
      icon: ShoppingCart,
      label: "Market",
      href: "/marketplace",
      active: location.pathname === "/marketplace",
    },
    {
      icon: TrendingUp,
      label: "Crypto",
      href: "/crypto",
      active:
        location.pathname === "/crypto" ||
        location.pathname.startsWith("/crypto"),
    },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 bg-background/95 backdrop-blur border-t md:hidden z-[100] safe-area-pb">
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
