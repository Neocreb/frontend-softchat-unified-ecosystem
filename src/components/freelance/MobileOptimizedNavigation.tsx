import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  ChevronDown,
  Home,
  FolderOpen,
  Plus,
  Users,
  MessageCircle,
  Star,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  badge?: string;
}

interface MobileOptimizedNavigationProps {
  navigationItems: NavigationItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  userRole: "freelancer" | "client";
  className?: string;
}

export const MobileOptimizedNavigation: React.FC<MobileOptimizedNavigationProps> = ({
  navigationItems,
  activeTab,
  onTabChange,
  userRole,
  className,
}) => {
  // Mobile navigation for screens smaller than 768px
  const MobileNavSheet = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="text-left">
            {userRole === "freelancer" ? "Freelance Hub" : "Client Hub"}
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 px-4 py-4">
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200",
                  activeTab === item.id
                    ? userRole === "freelancer"
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {item.description}
                  </p>
                </div>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );

  // Tablet navigation for screens 768px - 1024px
  const TabletNavDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="hidden md:flex lg:hidden">
          <Home className="w-4 h-4 mr-2" />
          {navigationItems.find(item => item.id === activeTab)?.label || "Navigation"}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {navigationItems.map((item, index) => (
          <React.Fragment key={item.id}>
            <DropdownMenuItem
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex items-center gap-3 py-3",
                activeTab === item.id && "bg-gray-100 dark:bg-gray-800"
              )}
            >
              <item.icon className="w-4 h-4" />
              <div className="flex-1">
                <p className="font-medium">{item.label}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
              {item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </DropdownMenuItem>
            {index < navigationItems.length - 1 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Horizontal scrollable tabs for smaller screens
  const ScrollableTabs = () => (
    <div className="md:hidden border-b bg-white dark:bg-gray-800">
      <ScrollArea className="w-full">
        <div className="flex gap-1 p-2 min-w-max">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                activeTab === item.id
                  ? userRole === "freelancer"
                    ? "bg-blue-500 text-white"
                    : "bg-green-500 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
              {item.badge && (
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "text-xs ml-1",
                    activeTab === item.id && "bg-white/20 text-white"
                  )}
                >
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className={className}>
      {/* Mobile Sheet Navigation */}
      <MobileNavSheet />
      
      {/* Tablet Dropdown Navigation */}
      <TabletNavDropdown />
      
      {/* Scrollable Tabs for Small Mobile */}
      <ScrollableTabs />
    </div>
  );
};

export default MobileOptimizedNavigation;
