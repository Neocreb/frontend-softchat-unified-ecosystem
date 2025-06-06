
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Video, ShoppingCart, TrendingUp, Plus, Award } from "lucide-react";
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
      label: "Create",
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
      label: "Shop",
      href: "/marketplace",
      active: location.pathname === "/marketplace",
    },
    {
      icon: TrendingUp,
      label: "Crypto",
      href: "/crypto",
      active: location.pathname === "/crypto",
    },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t md:hidden z-[100] shadow-lg">
      <div className="grid grid-cols-6 h-16">
        {navItems.map((item) => (
          <Link key={item.href} to={item.href} className="w-full">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full flex flex-col items-center justify-center py-2 px-1 h-full rounded-none transition-all duration-200",
                item.active ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                item.special && item.active && "bg-primary/10 text-primary"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-all duration-200", 
                item.active ? "text-primary" : "text-muted-foreground",
                item.special && "h-6 w-6",
                item.special && item.active && "text-primary"
              )} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FooterNav;
