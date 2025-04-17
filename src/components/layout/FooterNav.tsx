
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Video, ShoppingCart, TrendingUp, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const FooterNav = () => {
  const location = useLocation();
  
  const navItems = [
    {
      icon: Home,
      label: "Feed",
      href: "/",
      active: location.pathname === "/" || location.pathname === "/feed",
    },
    {
      icon: Search,
      label: "Explore",
      href: "/explore",
      active: location.pathname === "/explore",
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
      active: location.pathname === "/crypto",
    },
    {
      icon: Wallet,
      label: "Wallet",
      href: "/wallet",
      active: location.pathname === "/wallet",
    },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 bg-background border-t md:hidden z-50">
      <div className="grid grid-cols-6 h-16">
        {navItems.map((item) => (
          <Link key={item.href} to={item.href} className="w-full">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full flex flex-col items-center justify-center py-2 px-1 h-full rounded-none",
                item.active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", item.active ? "text-primary" : "text-muted-foreground")} />
              <span className="text-xs mt-1">{item.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FooterNav;
