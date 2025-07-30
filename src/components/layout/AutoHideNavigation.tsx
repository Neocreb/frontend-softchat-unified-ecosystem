import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Home,
  Video,
  Users,
  MessageSquare,
  Search,
  User,
  Bell,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface AutoHideNavigationProps {
  children: React.ReactNode;
  autoHideRoutes?: string[];
  hideDelay?: number;
  className?: string;
}

export const AutoHideNavigation: React.FC<AutoHideNavigationProps> = ({
  children,
  autoHideRoutes = ['/app/videos', '/app/videos-improved', '/app/live', '/app/battle'],
  hideDelay = 3000,
  className,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isNavigationVisible, setIsNavigationVisible] = useState(true);
  const [isAutoHideActive, setIsAutoHideActive] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isMobile] = useState(window.innerWidth < 768);

  // Check if current route should auto-hide navigation
  const shouldAutoHide = autoHideRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  // Handle user activity
  const handleActivity = useCallback(() => {
    setLastActivity(Date.now());
    if (shouldAutoHide && !isNavigationVisible) {
      setIsNavigationVisible(true);
    }
  }, [shouldAutoHide, isNavigationVisible]);

  // Auto-hide timer
  useEffect(() => {
    if (!shouldAutoHide) {
      setIsNavigationVisible(true);
      setIsAutoHideActive(false);
      return;
    }

    setIsAutoHideActive(true);

    const timer = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivity;
      if (timeSinceActivity >= hideDelay && isNavigationVisible) {
        setIsNavigationVisible(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [shouldAutoHide, lastActivity, hideDelay, isNavigationVisible]);

  // Activity listeners
  useEffect(() => {
    if (!shouldAutoHide) return;

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'touchmove'];
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [handleActivity, shouldAutoHide]);

  // Toggle navigation visibility
  const toggleNavigation = () => {
    setIsNavigationVisible(!isNavigationVisible);
    setLastActivity(Date.now());
  };

  // Navigation items
  const navigationItems = [
    { icon: Home, label: 'Feed', path: '/app/feed', active: location.pathname === '/app/feed' },
    { icon: Video, label: 'Videos', path: '/app/videos', active: location.pathname.startsWith('/app/videos') },
    { icon: Users, label: 'Live', path: '/app/videos?tab=live', active: location.pathname.startsWith('/app/videos') && new URLSearchParams(location.search).get('tab') === 'live' },
    { icon: Search, label: 'Explore', path: '/app/explore', active: location.pathname.startsWith('/app/explore') },
    { icon: MessageSquare, label: 'Chat', path: '/app/chat', active: location.pathname.startsWith('/app/chat') },
  ];

  const getPageTitle = () => {
    if (location.pathname.startsWith('/app/videos')) return 'Videos';
    if (location.pathname.startsWith('/app/live')) return 'Live & Battles';
    if (location.pathname.startsWith('/app/battle')) return 'Battle';
    if (location.pathname.startsWith('/app/explore')) return 'Explore';
    if (location.pathname.startsWith('/app/chat')) return 'Messages';
    return 'SoftChat';
  };

  return (
    <div className={cn("relative min-h-screen bg-black", className)}>
      {/* Top Navigation Bar */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out",
          isNavigationVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="bg-black/90 backdrop-blur-md border-b border-gray-800">
          <div className="flex items-center justify-between p-3 md:p-4">
            {/* Left Section */}
            <div className="flex items-center gap-3">
              {shouldAutoHide && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="text-white hover:bg-white/10"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )}
              
              <div>
                <h1 className="text-white font-semibold text-lg md:text-xl">
                  {getPageTitle()}
                </h1>
                {shouldAutoHide && isAutoHideActive && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    Tap to show nav
                  </Badge>
                )}
              </div>
            </div>

            {/* Center Navigation (Desktop) */}
            {!isMobile && !shouldAutoHide && (
              <div className="flex items-center gap-1">
                {navigationItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={item.active ? "default" : "ghost"}
                    size="sm"
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "flex items-center gap-2 text-white",
                      item.active && "bg-primary text-primary-foreground"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                ))}
              </div>
            )}

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {user && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/app/notifications')}
                    className="text-white hover:bg-white/10 relative"
                  >
                    <Bell className="w-5 h-5" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/app/profile')}
                    className="text-white hover:bg-white/10"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-6 h-6 rounded-full"
                    />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      {isMobile && (
        <div
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out",
            isNavigationVisible ? "translate-y-0" : "translate-y-full"
          )}
        >
          <div className="bg-black/90 backdrop-blur-md border-t border-gray-800 pb-safe">
            <div className="flex items-center justify-around p-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex flex-col items-center gap-1 text-white h-auto py-2 px-3 min-w-[60px]",
                    item.active && "text-primary"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5",
                    item.active && "text-primary"
                  )} />
                  <span className="text-xs">{item.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Back to Feed Button (when nav is hidden) */}
      {shouldAutoHide && !isNavigationVisible && (
        <div className="fixed bottom-4 left-4 z-40">
          <Button
            onClick={() => navigate('/app/feed')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg"
            size="sm"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Feed
          </Button>
        </div>
      )}

      {/* Navigation Toggle Indicator (when hidden) */}
      {shouldAutoHide && !isNavigationVisible && (
        <div className="fixed top-2 left-1/2 transform -translate-x-1/2 z-40">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleNavigation}
            className="bg-black/50 hover:bg-black/70 text-white rounded-full px-3 py-1 backdrop-blur-sm"
          >
            <ChevronDown className="w-4 h-4 mr-1" />
            Tap to show
          </Button>
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          shouldAutoHide ? "pt-0" : isMobile ? "pt-16 pb-16" : "pt-20",
          !isNavigationVisible && isMobile && shouldAutoHide && "pb-0"
        )}
        onClick={handleActivity}
      >
        {children}
      </div>

      {/* Overlay for navigation toggle on video pages */}
      {shouldAutoHide && (
        <div
          className="fixed inset-0 z-30 pointer-events-none"
          onClick={(e) => {
            e.preventDefault();
            toggleNavigation();
          }}
          style={{ pointerEvents: isNavigationVisible ? 'none' : 'auto' }}
        />
      )}
    </div>
  );
};

// Hook for components to control navigation visibility
export const useAutoHideNavigation = () => {
  const [forceVisible, setForceVisible] = useState(false);
  
  const showNavigation = useCallback(() => {
    setForceVisible(true);
    // Auto-hide after 3 seconds
    setTimeout(() => setForceVisible(false), 3000);
  }, []);

  const hideNavigation = useCallback(() => {
    setForceVisible(false);
  }, []);

  return {
    forceVisible,
    showNavigation,
    hideNavigation,
  };
};

export default AutoHideNavigation;
