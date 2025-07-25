import React from "react";
import { cn } from "@/lib/utils";

interface OnlineStatusIndicatorProps {
  isOnline: boolean;
  lastSeen?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export const OnlineStatusIndicator: React.FC<OnlineStatusIndicatorProps> = ({
  isOnline,
  lastSeen,
  size = "md",
  showLabel = false,
  className
}) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3", 
    lg: "w-4 h-4"
  };

  const formatLastSeen = (lastSeen: string) => {
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "rounded-full border-2 border-background",
        sizeClasses[size],
        isOnline 
          ? "bg-gradient-to-br from-green-400 to-green-500 shadow-lg shadow-green-500/25 animate-pulse" 
          : "bg-gradient-to-br from-gray-400 to-gray-500"
      )} />
      
      {showLabel && (
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {isOnline ? "Online" : lastSeen ? `Last seen ${formatLastSeen(lastSeen)}` : "Offline"}
        </span>
      )}
    </div>
  );
};

export default OnlineStatusIndicator;
