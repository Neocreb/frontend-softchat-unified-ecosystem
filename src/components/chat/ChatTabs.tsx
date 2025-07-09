import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Briefcase,
  ShoppingBag,
  Coins,
  Bot,
  MessageSquare,
} from "lucide-react";
import { UnifiedChatType, UnifiedChatTab } from "@/types/unified-chat";
import { cn } from "@/lib/utils";

interface ChatTabsProps {
  tabs: UnifiedChatTab[];
  activeTab: UnifiedChatType;
  onTabChange: (tab: UnifiedChatType) => void;
  totalUnreadCount?: number;
  className?: string;
}

const iconMap = {
  Users,
  Briefcase,
  ShoppingBag,
  Coins,
  Bot,
  MessageSquare,
};

const colorMap = {
  blue: "text-blue-600 bg-blue-50 border-blue-200",
  green: "text-green-600 bg-green-50 border-green-200",
  orange: "text-orange-600 bg-orange-50 border-orange-200",
  yellow: "text-yellow-600 bg-yellow-50 border-yellow-200",
  purple: "text-purple-600 bg-purple-50 border-purple-200",
  gray: "text-gray-600 bg-gray-50 border-gray-200",
};

export const ChatTabs: React.FC<ChatTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  totalUnreadCount,
  className,
}) => {
  return (
    <div className={cn("w-full", className)}>
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-5 gap-1 h-auto p-1">
          {tabs.map((tab) => {
            const IconComponent =
              iconMap[tab.icon as keyof typeof iconMap] || MessageSquare;
            const isActive = activeTab === tab.id;
            const hasUnread = (tab.count || 0) > 0;

            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 px-2 text-xs relative transition-all duration-200",
                  "data-[state=active]:bg-background data-[state=active]:shadow-sm",
                  isActive &&
                    tab.color &&
                    colorMap[tab.color as keyof typeof colorMap],
                  hasUnread && !isActive && "font-medium",
                )}
              >
                <div className="relative">
                  <IconComponent
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive ? "text-current" : "text-muted-foreground",
                    )}
                  />
                  {hasUnread && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs flex items-center justify-center min-w-[16px]"
                    >
                      {tab.count! > 99 ? "99+" : tab.count}
                    </Badge>
                  )}
                </div>
                <span
                  className={cn(
                    "truncate max-w-full transition-colors",
                    isActive ? "text-current" : "text-muted-foreground",
                  )}
                >
                  {tab.label}
                </span>

                {/* AI Assistant special indicator */}
                {tab.id === "ai_assistant" && (
                  <div className="absolute top-1 right-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  </div>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {/* Total unread count for mobile */}
      {totalUnreadCount && totalUnreadCount > 0 && (
        <div className="flex justify-center mt-2 lg:hidden">
          <Badge variant="outline" className="text-xs">
            {totalUnreadCount} unread message{totalUnreadCount > 1 ? "s" : ""}
          </Badge>
        </div>
      )}
    </div>
  );
};
