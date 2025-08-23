import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPlus, UserMinus, Users, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export interface FollowButtonProps {
  type: 'user' | 'group' | 'page';
  isFollowing: boolean;
  onToggleFollow: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'compact';
  size?: 'sm' | 'default' | 'lg';
  disabled?: boolean;
  className?: string;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  type,
  isFollowing,
  onToggleFollow,
  variant = 'default',
  size = 'sm',
  disabled = false,
  className
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    e.preventDefault();
    
    if (disabled || isLoading) return;

    setIsLoading(true);
    try {
      await onToggleFollow();
      
      // Show appropriate toast message
      const actionText = getActionText();
      const entityText = getEntityText();
      
      toast({
        title: isFollowing ? `Un${actionText.toLowerCase()}ed!` : `${actionText}ed!`,
        description: isFollowing 
          ? `You have un${actionText.toLowerCase()}ed this ${entityText}.`
          : `You are now ${actionText.toLowerCase()}ing this ${entityText}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update follow status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getActionText = () => {
    switch (type) {
      case 'user': return isFollowing ? 'Unfollow' : 'Follow';
      case 'group': return isFollowing ? 'Leave' : 'Join';
      case 'page': return isFollowing ? 'Unfollow' : 'Follow';
      default: return isFollowing ? 'Unfollow' : 'Follow';
    }
  };

  const getEntityText = () => {
    switch (type) {
      case 'user': return 'user';
      case 'group': return 'group';
      case 'page': return 'page';
      default: return 'user';
    }
  };

  const getIcon = () => {
    if (type === 'group') {
      return isFollowing ? <Users className="h-4 w-4" /> : <Users className="h-4 w-4" />;
    }
    return isFollowing ? <UserMinus className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />;
  };

  const getButtonVariant = () => {
    if (variant === 'compact') {
      return isFollowing ? 'outline' : 'default';
    }
    return variant;
  };

  if (variant === 'compact') {
    return (
      <Button
        onClick={handleClick}
        disabled={disabled || isLoading}
        variant={getButtonVariant()}
        size="sm"
        className={cn(
          "h-8 px-3 text-xs font-medium transition-all",
          isFollowing && "border-green-200 bg-green-50 text-green-700 hover:bg-green-100",
          className
        )}
      >
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : isFollowing ? (
          <>
            <Check className="h-3 w-3 mr-1" />
            {type === 'group' ? 'Joined' : 'Following'}
          </>
        ) : (
          <>
            {getIcon()}
            <span className="ml-1">{getActionText()}</span>
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isLoading}
      variant={getButtonVariant()}
      size={size}
      className={cn(
        "transition-all",
        isFollowing && variant === 'default' && "bg-green-600 hover:bg-green-700",
        className
      )}
    >
      {isLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <>
          {getIcon()}
          <span className="ml-2">{getActionText()}</span>
        </>
      )}
    </Button>
  );
};

// Compact version for use in cards and lists
export const CompactFollowButton: React.FC<Omit<FollowButtonProps, 'variant'>> = (props) => (
  <FollowButton {...props} variant="compact" />
);

export default FollowButton;
