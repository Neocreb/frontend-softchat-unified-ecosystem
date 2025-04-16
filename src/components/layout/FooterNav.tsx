
import { Link, useLocation } from "react-router-dom";
import { Home, Search, MessageCircle, User, PlusCircle, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const FooterNav = () => {
  const location = useLocation();
  
  const navItems = [
    {
      icon: Home,
      label: "Home",
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
      icon: PlusCircle,
      label: "Create",
      href: "/create",
      active: location.pathname === "/create",
    },
    {
      icon: Video,
      label: "Videos",
      href: "/videos",
      active: location.pathname === "/videos",
    },
    {
      icon: MessageCircle,
      label: "Chat",
      href: "/chat",
      active: location.pathname === "/chat",
    },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 bg-background border-t md:hidden z-50">
      <div className="grid grid-cols-5 h-16">
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
