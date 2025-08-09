import React from "react";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  ExternalLink,
  Calendar,
  Play,
  Users,
  MapPin,
  DollarSign,
  Briefcase,
  GraduationCap,
  Building,
  Star,
} from "lucide-react";
import { useNotification } from "@/hooks/use-notification";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface UnifiedActionButtonsProps {
  item: {
    id: string;
    type: 'post' | 'product' | 'job' | 'freelancer_skill' | 'live_event' | 'community_event';
    content?: any;
  };
  className?: string;
  variant?: 'compact' | 'full';
}

const UnifiedActionButtons: React.FC<UnifiedActionButtonsProps> = ({
  item,
  className,
  variant = 'compact'
}) => {
  const notification = useNotification();
  const navigate = useNavigate();

  const handleBuy = () => {
    // Navigate to marketplace with product filter or general marketplace
    navigate(`/app/marketplace`);
    notification.success("Opening marketplace to purchase product...");
  };

  const handleApply = () => {
    // Navigate to job detail page
    navigate(`/app/freelance/job/${item.id}`);
    notification.success("Opening job details to apply...");
  };

  const handleHire = () => {
    // Navigate to find freelancers page for now
    navigate(`/app/freelance/find-freelancers`);
    notification.success("Opening freelancer directory to hire...");
  };

  const handleJoinEvent = () => {
    // Navigate to events page
    navigate(`/app/events`);
    notification.success("Opening events to join...");
  };

  const handleWatchLive = () => {
    // Navigate to videos with live tab
    navigate(`/app/videos?tab=live`);
    notification.success("Opening live streams...");
  };

  const renderActionButton = () => {
    switch (item.type) {
      case 'product':
        return (
          <Button
            onClick={handleBuy}
            size={variant === 'compact' ? 'sm' : 'default'}
            className={cn(
              "flex items-center gap-2",
              variant === 'compact' ? "px-3 py-1.5 h-auto text-xs" : "",
              "bg-green-600 hover:bg-green-700 text-white"
            )}
          >
            <ShoppingCart className={variant === 'compact' ? "h-3 w-3" : "h-4 w-4"} />
            <span>Buy {item.content?.price && `$${item.content.price}`}</span>
          </Button>
        );

      case 'job':
        return (
          <Button
            onClick={handleApply}
            size={variant === 'compact' ? 'sm' : 'default'}
            className={cn(
              "flex items-center gap-2",
              variant === 'compact' ? "px-3 py-1.5 h-auto text-xs" : "",
              "bg-blue-600 hover:bg-blue-700 text-white"
            )}
          >
            <Briefcase className={variant === 'compact' ? "h-3 w-3" : "h-4 w-4"} />
            <span>Apply</span>
          </Button>
        );

      case 'freelancer_skill':
        return (
          <Button
            onClick={handleHire}
            size={variant === 'compact' ? 'sm' : 'default'}
            className={cn(
              "flex items-center gap-2",
              variant === 'compact' ? "px-3 py-1.5 h-auto text-xs" : "",
              "bg-purple-600 hover:bg-purple-700 text-white"
            )}
          >
            <GraduationCap className={variant === 'compact' ? "h-3 w-3" : "h-4 w-4"} />
            <span>Hire {item.content?.rate && `$${item.content.rate}/hr`}</span>
          </Button>
        );

      case 'live_event':
        return (
          <Button
            onClick={handleWatchLive}
            size={variant === 'compact' ? 'sm' : 'default'}
            className={cn(
              "flex items-center gap-2",
              variant === 'compact' ? "px-3 py-1.5 h-auto text-xs" : "",
              "bg-red-600 hover:bg-red-700 text-white"
            )}
          >
            <Play className={variant === 'compact' ? "h-3 w-3" : "h-4 w-4"} />
            <span>Watch Live</span>
          </Button>
        );

      case 'community_event':
        return (
          <Button
            onClick={handleJoinEvent}
            size={variant === 'compact' ? 'sm' : 'default'}
            className={cn(
              "flex items-center gap-2",
              variant === 'compact' ? "px-3 py-1.5 h-auto text-xs" : "",
              "bg-orange-600 hover:bg-orange-700 text-white"
            )}
          >
            <Calendar className={variant === 'compact' ? "h-3 w-3" : "h-4 w-4"} />
            <span>Join Event</span>
          </Button>
        );

      default:
        return null;
    }
  };

  const actionButton = renderActionButton();
  if (!actionButton) return null;

  return (
    <div className={cn("flex items-center", className)}>
      {actionButton}
      
      {/* Additional context info for compact variant */}
      {variant === 'compact' && (
        <div className="ml-2 flex items-center gap-1 text-xs text-muted-foreground">
          {item.content?.location && (
            <>
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-20">{item.content.location}</span>
            </>
          )}
          {item.content?.rating && (
            <>
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{item.content.rating}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UnifiedActionButtons;
