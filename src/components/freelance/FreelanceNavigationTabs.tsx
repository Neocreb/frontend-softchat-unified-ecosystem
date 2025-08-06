import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  badge?: string;
  disabled?: boolean;
}

interface FreelanceNavigationTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  variant?: "default" | "compact";
}

export const FreelanceNavigationTabs: React.FC<FreelanceNavigationTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
  variant = "default"
}) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    const handleResize = () => checkScroll();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [tabs]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const scrollToActiveTab = () => {
    if (scrollRef.current) {
      const activeElement = scrollRef.current.querySelector(`[data-tab-id="${activeTab}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  };

  useEffect(() => {
    scrollToActiveTab();
  }, [activeTab]);

  const isCompact = variant === "compact";

  return (
    <div className={cn(
      "relative bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700",
      className
    )}>
      <div className="relative flex items-center">
        {/* Left scroll arrow */}
        {showLeftArrow && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-0 z-10 h-full rounded-none bg-gradient-to-r from-white dark:from-gray-800 to-transparent pr-8 hover:bg-white dark:hover:bg-gray-800"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Scrollable tabs container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scroll-smooth"
          onScroll={checkScroll}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitScrollbar: { display: 'none' }
          }}
        >
          <div className="flex min-w-fit">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              
              return (
                <button
                  key={tab.id}
                  data-tab-id={tab.id}
                  onClick={() => !tab.disabled && onTabChange(tab.id)}
                  disabled={tab.disabled}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-3 min-w-fit whitespace-nowrap border-b-2 transition-all duration-200 text-sm font-medium",
                    isActive
                      ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10"
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600",
                    tab.disabled && "opacity-50 cursor-not-allowed",
                    isCompact ? "px-3 py-2" : "px-4 py-3"
                  )}
                >
                  <Icon className={cn(
                    "flex-shrink-0",
                    isCompact ? "w-4 h-4" : "w-5 h-5"
                  )} />
                  
                  <div className={cn("flex items-center gap-2", isCompact && "text-xs")}>
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <Badge 
                        variant={isActive ? "default" : "secondary"} 
                        className={cn(
                          "text-xs min-w-[1.25rem] h-5 flex items-center justify-center",
                          isCompact && "text-2xs h-4 min-w-4"
                        )}
                      >
                        {tab.badge}
                      </Badge>
                    )}
                  </div>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right scroll arrow */}
        {showRightArrow && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 z-10 h-full rounded-none bg-gradient-to-l from-white dark:from-gray-800 to-transparent pl-8 hover:bg-white dark:hover:bg-gray-800"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Tab description tooltip area */}
      {!isCompact && (
        <div className="px-4 py-2 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {tabs.find(tab => tab.id === activeTab)?.description || ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default FreelanceNavigationTabs;
