import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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

const FooterNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const isVideoPage = location.pathname.includes('/videos') || 
                    location.pathname.includes('/videos-improved') ||
                    location.pathname.includes('/tiktok');

  // Auto-hide navigation on video pages
  useEffect(() => {
    if (!isVideoPage) {
      setIsVisible(true);
      return;
    }

    const resetTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsVisible(true);
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    };

    const handleUserActivity = () => {
      resetTimer();
    };

    // Listen for user activity
    document.addEventListener('click', handleUserActivity);
    document.addEventListener('touchstart', handleUserActivity);
    document.addEventListener('keydown', handleUserActivity);

    // Initial timer
    resetTimer();

    return () => {
      document.removeEventListener('click', handleUserActivity);
      document.removeEventListener('touchstart', handleUserActivity);
      document.removeEventListener('keydown', handleUserActivity);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVideoPage]);

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
      active: location.pathname === "/app/videos" || location.pathname.includes('/videos'),
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

  return (
    <>
      {/* Back to Feed Button - Shows when navigation is hidden on video pages */}
      {isVideoPage && !isVisible && (
        <Button
          onClick={() => navigate('/app/feed')}
          className="fixed bottom-6 left-4 z-50 bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-sm transition-all duration-300 md:hidden"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Feed
        </Button>
      )}

      {/* Enhanced Footer Navigation */}
      <div 
        className={cn(
          "fixed bottom-0 inset-x-0 bg-background/95 backdrop-blur border-t md:hidden z-[100] safe-area-pb transition-all duration-300 ease-in-out",
          isVideoPage && !isVisible 
            ? "transform translate-y-full opacity-0" 
            : "transform translate-y-0 opacity-100"
        )}
        onClick={() => {
          if (isVideoPage) {
            setIsVisible(true);
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
              setIsVisible(false);
            }, 3000);
          }
        }}
      >
        <div className="grid grid-cols-6 h-14 sm:h-16 px-1 w-full max-w-full">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href} className="w-full min-w-0">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full flex flex-col items-center justify-center py-1 px-0.5 h-full rounded-none text-center min-w-0 transition-colors",
                  item.active ? "text-primary" : "text-muted-foreground",
                  item.special && item.active && "bg-primary/10",
                  "hover:bg-muted/20 hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "h-3 w-3 sm:h-4 sm:w-4 mb-0.5 sm:mb-1 flex-shrink-0 transition-colors",
                    item.active ? "text-primary" : "text-muted-foreground",
                    item.special && "h-4 w-4 sm:h-5 sm:w-5",
                  )}
                />
                <span className="text-[10px] sm:text-xs leading-none truncate w-full transition-colors">
                  {item.label}
                </span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default FooterNav;
