import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Send, Calendar, PlayCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/hooks/use-notification';
import { UnifiedActivityService } from '@/services/unifiedActivityService';

interface QuickActionButtonProps {
  postId: string;
  type: 'product' | 'job' | 'event' | 'live';
  actionType: 'buy_direct' | 'apply_quick' | 'join_direct' | 'watch_live';
  label: string;
  price?: string;
  currency?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  postId,
  type,
  actionType,
  label,
  price,
  currency = 'USD',
  variant = 'default',
  size = 'sm',
  className = '',
  onClick
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const notification = useNotification();

  const handleQuickAction = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      notification.error('Please log in to continue');
      navigate('/auth');
      return;
    }

    try {
      switch (actionType) {
        case 'buy_direct':
          // Add to cart directly without going to product page
          const productPrice = price ? parseFloat(price.replace(/[^0-9.]/g, '')) : 0;
          
          const purchaseReward = await UnifiedActivityService.trackProductPurchase(
            user.id,
            postId,
            productPrice
          );

          if (purchaseReward.success && purchaseReward.softPoints > 0) {
            notification.success(`Added to cart! +${purchaseReward.softPoints} SoftPoints earned`, {
              description: 'Item added to your cart'
            });
          } else {
            notification.success('Added to cart!', {
              description: 'You can checkout from your cart'
            });
          }

          // Navigate to cart page
          navigate('/app/marketplace/cart', {
            state: {
              newItem: {
                productId: postId,
                name: `Product ${postId}`,
                price: productPrice,
                currency,
                quantity: 1
              }
            }
          });
          break;

        case 'apply_quick':
          // Quick apply - navigate to application form
          const applyReward = await UnifiedActivityService.trackJobApplication(
            user.id,
            postId,
            { source: 'quick_apply' }
          );

          if (applyReward.success && applyReward.softPoints > 0) {
            notification.success(`Application started! +${applyReward.softPoints} SoftPoints earned`, {
              description: 'Complete your application to apply'
            });
          }

          navigate(`/app/freelance/job/${postId}?action=apply`);
          break;

        case 'join_direct':
          // Quick join event
          const joinReward = await UnifiedActivityService.trackEventJoin(
            user.id,
            postId,
            { source: 'quick_join' }
          );

          if (joinReward.success && joinReward.softPoints > 0) {
            notification.success(`Joined event! +${joinReward.softPoints} SoftPoints earned`, {
              description: 'You will receive event updates'
            });
          } else {
            notification.success('Successfully joined the event!');
          }

          // Navigate to event page
          navigate(`/app/events/${postId}`);
          break;

        case 'watch_live':
          // Join live content
          const liveReward = await UnifiedActivityService.trackVideoWatch(
            user.id,
            postId,
            { type: 'live_stream', source: 'quick_watch' }
          );

          if (liveReward.success && liveReward.softPoints > 0) {
            notification.success(`Joining live! +${liveReward.softPoints} SoftPoints earned`, {
              description: 'Enjoy the live content'
            });
          }

          // Navigate to live stream or event
          if (type === 'event') {
            navigate(`/app/events/${postId}`);
          } else {
            navigate(`/app/videos?tab=live&stream=${postId}`);
          }
          break;
      }

      // Call custom onClick if provided
      if (onClick) {
        onClick(e);
      }
    } catch (error) {
      console.error('Quick action failed:', error);
      notification.error('Action failed. Please try again.');
    }
  };

  const getIcon = () => {
    switch (actionType) {
      case 'buy_direct':
        return <ShoppingCart className="h-4 w-4 mr-2" />;
      case 'apply_quick':
        return <Send className="h-4 w-4 mr-2" />;
      case 'join_direct':
        return <Calendar className="h-4 w-4 mr-2" />;
      case 'watch_live':
        return <PlayCircle className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  const getVariantClass = () => {
    switch (actionType) {
      case 'buy_direct':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'apply_quick':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'join_direct':
        return 'bg-orange-600 hover:bg-orange-700 text-white';
      case 'watch_live':
        return 'bg-red-600 hover:bg-red-700 text-white animate-pulse';
      default:
        return '';
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleQuickAction}
      className={`${getVariantClass()} ${className}`}
    >
      {getIcon()}
      {label}
    </Button>
  );
};

export default QuickActionButton;
