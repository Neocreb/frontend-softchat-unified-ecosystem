
import { Star } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface UserRatingBadgeProps {
  rating: number;
  trades: number;
  kycLevel: number;
}

const UserRatingBadge = ({ rating, trades, kycLevel }: UserRatingBadgeProps) => {
  // Determine color based on rating (1-5 scale)
  const getColor = () => {
    if (rating >= 4.5) return "text-green-500";
    if (rating >= 3.5) return "text-blue-500";
    if (rating >= 2.5) return "text-yellow-500";
    return "text-red-500";
  };
  
  // KYC badge color and text
  const getKYCBadge = () => {
    if (kycLevel >= 3) return { color: "bg-green-500", text: "KYC 3" };
    if (kycLevel === 2) return { color: "bg-blue-500", text: "KYC 2" };
    if (kycLevel === 1) return { color: "bg-yellow-500", text: "KYC 1" };
    return { color: "bg-gray-400", text: "No KYC" };
  };
  
  const kycBadge = getKYCBadge();
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 cursor-help">
            <Star className={cn("h-3 w-3", getColor())} fill="currentColor" />
            <span className="text-xs">{rating.toFixed(1)}</span>
            <div className={cn("h-2 w-2 rounded-full", kycBadge.color)} />
          </div>
        </TooltipTrigger>
        <TooltipContent className="p-3 space-y-2 w-60">
          <div>
            <div className="font-medium">Trader Rating</div>
            <div className="flex items-center gap-0.5 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i}
                  className="h-4 w-4" 
                  fill={i < Math.floor(rating) ? "currentColor" : "none"}
                  strokeWidth={1}
                />
              ))}
              <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Based on {trades} completed trades
            </div>
          </div>
          
          <div>
            <div className="font-medium">Verification</div>
            <div className="flex items-center mt-1">
              <span className={cn("h-3 w-3 rounded-full mr-2", kycBadge.color)} />
              <span>{kycBadge.text}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {kycLevel === 0 && "User has not completed KYC verification"}
              {kycLevel === 1 && "Basic email and phone verification"}
              {kycLevel === 2 && "ID verification completed"}
              {kycLevel >= 3 && "Full identity verification with proof of address"}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UserRatingBadge;
