import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Gift,
  ShoppingCart,
  Briefcase,
  Users,
  Play,
  Calendar,
  Store,
  Video,
  UserPlus,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/utils/utils";
import { useAuth } from "@/contexts/AuthContext";
import { ActivityRewardService } from "@/services/activityRewardService";
import { useNotification } from "@/hooks/use-notification";
import EnhancedShareModal from "./EnhancedShareModal";
import EnhancedCommentsModal from "./EnhancedCommentsModal";
import VirtualGiftsAndTips from "@/components/premium/VirtualGiftsAndTips";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostActionsProps {
  post: {
    id: string;
    content: string;
    author: {
      name: string;
      username: string;
      avatar: string;
      verified: boolean;
    };
    image?: string;
    createdAt: string;
    likes: number;
    comments: number;
    shares: number;
    gifts?: number;
    liked?: boolean;
    bookmarked?: boolean;
    gifted?: boolean;
    
    // Content type specific data
    contentType?: 'post' | 'product' | 'job' | 'event' | 'service' | 'video' | 'livestream';
    productId?: string;
    jobId?: string;
    eventId?: string;
    serviceId?: string;
    videoId?: string;
    livestreamId?: string;
    price?: number;
    currency?: string;
    location?: string;
    category?: string;
    isLive?: boolean;
    eventDate?: string;
    jobType?: 'freelance' | 'fulltime' | 'contract';
    skills?: string[];
  };
  feedMode?: 'classic' | 'threaded';
  onLikeChange?: (liked: boolean) => void;
  onBookmarkChange?: (bookmarked: boolean) => void;
  onGiftSent?: (giftId: string) => void;
  onCommentAdded?: (comment: any) => void;
  onShared?: () => void;
}

const EnhancedPostActions: React.FC<PostActionsProps> = ({
  post,
  feedMode = 'classic',
  onLikeChange,
  onBookmarkChange,
  onGiftSent,
  onCommentAdded,
  onShared,
}) => {
  const [liked, setLiked] = useState(post.liked || false);
  const [bookmarked, setBookmarked] = useState(post.bookmarked || false);
  const [gifted, setGifted] = useState(post.gifted || false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [commentsCount, setCommentsCount] = useState(post.comments);
  const [sharesCount, setSharesCount] = useState(post.shares);
  const [giftsCount, setGiftsCount] = useState(post.gifts || 0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [likeStartTime, setLikeStartTime] = useState<number | null>(null);

  const { user } = useAuth();
  const notification = useNotification();
  const navigate = useNavigate();

  const handleLike = async () => {
    const newLikedState = !liked;
    const timeSpent = likeStartTime ? Date.now() - likeStartTime : 0;

    setLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
    onLikeChange?.(newLikedState);

    // Track reward for liking
    if (newLikedState && user?.id) {
      try {
        const reward = await ActivityRewardService.logPostLiked(
          user.id,
          post.id,
          timeSpent / 1000
        );
        if (reward.success && reward.softPoints > 0) {
          notification.success(`+${reward.softPoints} SoftPoints earned!`);
        }
      } catch (error) {
        console.error("Failed to log like activity:", error);
      }
    }
  };

  const handleBookmark = () => {
    const newBookmarkedState = !bookmarked;
    setBookmarked(newBookmarkedState);
    onBookmarkChange?.(newBookmarkedState);
    
    notification.success(
      newBookmarkedState ? "Post saved" : "Post removed from saved items"
    );
  };

  const handleComment = () => {
    setShowCommentsModal(true);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleActionButton = async (actionType: string) => {
    let route = '';
    let rewardAction = '';

    switch (actionType) {
      case 'buy':
        if (post.productId) {
          route = `/marketplace/product/${post.productId}`;
          rewardAction = 'view_product';
        } else {
          route = '/marketplace';
        }
        break;
      
      case 'apply':
        if (post.jobId) {
          route = `/freelance/job/${post.jobId}`;
          rewardAction = 'view_job';
        } else {
          route = '/freelance/jobs';
        }
        break;
      
      case 'hire':
        if (post.author.username) {
          route = `/freelance/profile/${post.author.username}`;
          rewardAction = 'view_freelancer';
        } else {
          route = '/freelance/freelancers';
        }
        break;
      
      case 'join_event':
        if (post.eventId) {
          route = `/events/${post.eventId}`;
          rewardAction = 'view_event';
        } else {
          route = '/events';
        }
        break;
      
      case 'watch_live':
        if (post.livestreamId) {
          route = `/live/${post.livestreamId}`;
          rewardAction = 'view_livestream';
        } else if (post.videoId) {
          route = `/videos/${post.videoId}`;
          rewardAction = 'view_video';
        } else {
          route = '/videos';
        }
        break;
      
      case 'view_service':
        if (post.serviceId) {
          route = `/services/${post.serviceId}`;
          rewardAction = 'view_service';
        } else {
          route = '/services';
        }
        break;
      
      default:
        return;
    }

    // Track reward for action
    if (user?.id && rewardAction) {
      try {
        const reward = await ActivityRewardService.logActivity({
          userId: user.id,
          actionType: rewardAction as any,
          targetId: post.productId || post.jobId || post.eventId || post.id,
          targetType: post.contentType || 'post',
        });
        if (reward.success && reward.softPoints > 0) {
          notification.success(`+${reward.softPoints} SoftPoints earned!`);
        }
      } catch (error) {
        console.error("Failed to log action activity:", error);
      }
    }

    navigate(route);
  };

  const renderActionButton = () => {
    const { contentType, isLive, price, currency = 'USD', jobType } = post;

    switch (contentType) {
      case 'product':
        return (
          <Button
            size="sm"
            variant="default"
            onClick={() => handleActionButton('buy')}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Buy {price && `$${price}`}
          </Button>
        );
      
      case 'job':
        return (
          <Button
            size="sm"
            variant="default"
            onClick={() => handleActionButton('apply')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Briefcase className="h-4 w-4 mr-1" />
            Apply Now
          </Button>
        );
      
      case 'service':
        if (jobType === 'freelance') {
          return (
            <Button
              size="sm"
              variant="default"
              onClick={() => handleActionButton('hire')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Hire Me
            </Button>
          );
        }
        return (
          <Button
            size="sm"
            variant="default"
            onClick={() => handleActionButton('view_service')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Store className="h-4 w-4 mr-1" />
            View Service
          </Button>
        );
      
      case 'event':
        return (
          <Button
            size="sm"
            variant="default"
            onClick={() => handleActionButton('join_event')}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Calendar className="h-4 w-4 mr-1" />
            Join Event
          </Button>
        );
      
      case 'livestream':
        return (
          <Button
            size="sm"
            variant="default"
            onClick={() => handleActionButton('watch_live')}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLive ? (
              <>
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                Watch Live
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Watch
              </>
            )}
          </Button>
        );
      
      case 'video':
        return (
          <Button
            size="sm"
            variant="default"
            onClick={() => handleActionButton('watch_live')}
            className="bg-slate-600 hover:bg-slate-700 text-white"
          >
            <Video className="h-4 w-4 mr-1" />
            Watch Video
          </Button>
        );
      
      default:
        return null;
    }
  };

  const handleRepost = (content: string) => {
    setSharesCount(prev => prev + 1);
    onShared?.();
    notification.success("Post reposted to your feed!");
  };

  const handleQuotePost = (content: string, quotedPost: any) => {
    setSharesCount(prev => prev + 1);
    onShared?.();
    notification.success("Quote post shared to your feed!");
  };

  const handleCommentAddedCallback = (comment: any) => {
    setCommentsCount(prev => prev + 1);
    onCommentAdded?.(comment);
  };

  return (
    <>
      <div className="flex items-center justify-between pt-3 pb-1">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center gap-1 px-2",
              liked && "text-red-500"
            )}
            onClick={handleLike}
            onMouseDown={() => setLikeStartTime(Date.now())}
          >
            <Heart className={cn("h-4 w-4", liked && "fill-current")} />
            <span className="text-xs">{likesCount}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 px-2"
            onClick={handleComment}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{commentsCount}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 px-2"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            <span className="text-xs">{sharesCount}</span>
          </Button>

          {/* Gift Button with VirtualGiftsAndTips */}
          <VirtualGiftsAndTips
            recipientId={post.author.username}
            recipientName={post.author.name}
            contentId={post.id}
            onGiftSent={(giftId) => {
              setGifted(true);
              setGiftsCount(prev => prev + 1);
              onGiftSent?.(giftId);
            }}
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex items-center gap-1 px-2",
                  gifted && "text-purple-500"
                )}
              >
                <Gift className={cn("h-4 w-4", gifted && "fill-current")} />
                <span className="text-xs">{giftsCount}</span>
              </Button>
            }
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Action Button based on content type */}
          {renderActionButton()}

          {/* Bookmark and More options */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "px-2",
                bookmarked && "text-softchat-primary"
              )}
              onClick={handleBookmark}
            >
              <Bookmark className={cn("h-4 w-4", bookmarked && "fill-current")} />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="px-2">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => notification.info("Report post")}>
                  Report post
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => notification.info("Hide post")}>
                  Hide post
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => notification.info("Mute user")}>
                  Mute user
                </DropdownMenuItem>
                {post.contentType && (
                  <DropdownMenuItem onClick={() => navigate(`/post/${post.id}`)}>
                    View details
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Enhanced Modals */}
      <EnhancedShareModal
        post={post}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onRepost={handleRepost}
        onQuotePost={handleQuotePost}
        onShareComplete={() => setShowShareModal(false)}
      />

      <EnhancedCommentsModal
        post={post}
        isOpen={showCommentsModal}
        onClose={() => setShowCommentsModal(false)}
        onCommentAdded={handleCommentAddedCallback}
        onCommentLiked={(commentId) => console.log('Comment liked:', commentId)}
        onCommentPromoted={(comment) => console.log('Comment promoted:', comment)}
      />

      {/* Content type indicator */}
      {post.contentType && post.contentType !== 'post' && (
        <div className="mt-2">
          <Badge variant="outline" className="text-xs">
            {post.contentType === 'product' && <ShoppingCart className="h-3 w-3 mr-1" />}
            {post.contentType === 'job' && <Briefcase className="h-3 w-3 mr-1" />}
            {post.contentType === 'event' && <Calendar className="h-3 w-3 mr-1" />}
            {post.contentType === 'service' && <Store className="h-3 w-3 mr-1" />}
            {post.contentType === 'video' && <Video className="h-3 w-3 mr-1" />}
            {post.contentType === 'livestream' && <Play className="h-3 w-3 mr-1" />}
            {post.contentType.charAt(0).toUpperCase() + post.contentType.slice(1)}
          </Badge>
        </div>
      )}
    </>
  );
};

export default EnhancedPostActions;
