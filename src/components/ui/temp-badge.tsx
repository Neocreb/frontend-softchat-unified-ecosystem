import React from "react";
import { cn } from "@/lib/utils";

interface TempBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

export function TempBadge({ className, variant = "default", ...props }: TempBadgeProps) {
  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case "secondary":
        return "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80";
      case "destructive":
        return "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80";  
      case "outline":
        return "text-foreground";
      case "success":
        return "border-transparent bg-green-500 text-green-50 hover:bg-green-500/80";
      case "warning":
        return "border-transparent bg-yellow-500 text-yellow-50 hover:bg-yellow-500/80";
      default:
        return "border-transparent bg-primary text-primary-foreground hover:bg-primary/80";
    }
  };

  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        getVariantClasses(variant),
        className
      )} 
      {...props} 
    />
  );
}

// Export as Badge for compatibility  
export const Badge = TempBadge;
export const badgeVariants = () => ""; // placeholder
export default Badge;