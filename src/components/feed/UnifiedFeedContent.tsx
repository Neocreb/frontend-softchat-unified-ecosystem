import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Briefcase,
  ShoppingBag,
  Video,
  Calendar,
  Zap,
  Star,
  Eye,
  DollarSign,
  Globe,
  UserCheck,
  Play,
  Calendar as CalendarIcon,
  MapPin as LocationIcon,
  Building,
  Award,
  Settings,
  ShoppingCart,
  ExternalLink,
  Gift,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import {
  formatNumber,
  formatTimeAgo,
  mixContentIntelligently,
  filterContentByFeedType,
  getContentPriority
} from "@/utils/feedUtils";
import { EnhancedCommentsSection } from "@/components/feed/EnhancedCommentsSection";
import VirtualGiftsAndTips from "@/components/premium/VirtualGiftsAndTips";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ApplyModal from "@/components/freelance/ApplyModal";
import EnhancedProductDetail from "@/components/marketplace/EnhancedProductDetail";
import JobDetails from "@/components/freelance/JobDetails";
import { useEnhancedMarketplace } from "@/contexts/EnhancedMarketplaceContext";

// Unified content type interface
interface UnifiedFeedItem {
  id: string;
  type: 
    | "post" 
    | "product" 
    | "job" 
    | "freelancer_skill" 
    | "sponsored_post" 
    | "ad" 
    | "live_event" 
    | "community_event"
    | "story_recap"
    | "recommended_user"
    | "trending_topic";
  timestamp: Date;
  priority: number; // Higher number = higher priority in feed
  author?: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    badges?: string[];
  };
  content: any; // Specific content based on type
  interactions: {
    likes: number;
    comments: number;
    shares: number;
    saves?: number;
    views?: number;
  };
  userInteracted: {
    liked: boolean;
    commented: boolean;
    shared: boolean;
    saved: boolean;
  };
}

// Sample unified feed data with intelligent mixing
const generateUnifiedFeed = (): UnifiedFeedItem[] => {
  const baseItems: UnifiedFeedItem[] = [
    // Regular post
    {
      id: "post-1",
      type: "post",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      priority: 8,
      author: {
        id: "user-1",
        name: "Sarah Johnson",
        username: "sarahj",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
        verified: true,
        badges: ["Creator"],
      },
      content: {
        text: "Just launched my new AI-powered productivity app! 🚀 It's been months of hard work, but seeing it come to life is incredible. Check it out!",
        media: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
            alt: "App screenshot",
          },
        ],
        location: "San Francisco, CA",
      },
      interactions: {
        likes: 245,
        comments: 38,
        shares: 15,
        views: 1204,
      },
      userInteracted: {
        liked: false,
        commented: false,
        shared: false,
        saved: false,
      },
    },
    
    // Product recommendation
    {
      id: "product-1",
      type: "product",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      priority: 6,
      author: {
        id: "seller-1",
        name: "TechGear Store",
        username: "techgear",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TG",
        verified: true,
        badges: ["Trusted Seller"],
      },
      content: {
        title: "Wireless Noise-Canceling Headphones",
        description: "Premium quality headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound.",
        price: 129.99,
        originalPrice: 199.99,
        discount: 35,
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"],
        rating: 4.8,
        reviews: 2847,
        category: "Electronics",
        inStock: true,
        fastShipping: true,
      },
      interactions: {
        likes: 89,
        comments: 23,
        shares: 12,
        saves: 156,
      },
      userInteracted: {
        liked: false,
        commented: false,
        shared: false,
        saved: true,
      },
    },

    // Job posting
    {
      id: "job-1",
      type: "job",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      priority: 7,
      author: {
        id: "client-1",
        name: "StartupXYZ",
        username: "startupxyz",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SXY",
        verified: true,
        badges: ["Verified Client"],
      },
      content: {
        title: "Senior React Developer Needed",
        description: "We're looking for an experienced React developer to join our team and help build the future of e-commerce.",
        budget: {
          type: "hourly",
          min: 50,
          max: 80,
        },
        duration: "3-6 months",
        skills: ["React", "TypeScript", "Node.js", "AWS"],
        location: "Remote",
        urgency: "High",
        proposals: 8,
        clientRating: 4.9,
      },
      interactions: {
        likes: 45,
        comments: 12,
        shares: 8,
      },
      userInteracted: {
        liked: false,
        commented: false,
        shared: false,
        saved: false,
      },
    },

    // Freelancer skill showcase
    {
      id: "skill-1",
      type: "freelancer_skill",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      priority: 6,
      author: {
        id: "freelancer-1",
        name: "Alex Designer",
        username: "alexdesign",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
        verified: true,
        badges: ["Top Freelancer", "Design Expert"],
      },
      content: {
        title: "Professional Logo & Brand Identity Design",
        description: "Transform your business with stunning visual identity. Complete branding packages starting at $99.",
        portfolio: [
          "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300&h=300&fit=crop",
          "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=300&h=300&fit=crop",
        ],
        rating: 4.9,
        completedProjects: 127,
        startingPrice: 99,
        deliveryTime: "3-5 days",
        skills: ["Logo Design", "Brand Identity", "Graphic Design"],
        availability: "Available",
      },
      interactions: {
        likes: 67,
        comments: 15,
        shares: 9,
        saves: 89,
      },
      userInteracted: {
        liked: false,
        commented: false,
        shared: false,
        saved: false,
      },
    },

    // Live event
    {
      id: "event-1",
      type: "live_event",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      priority: 9,
      author: {
        id: "creator-1",
        name: "David Tech",
        username: "davidtech",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
        verified: true,
        badges: ["Live Creator"],
      },
      content: {
        title: "Live Coding: Building a React App",
        isLive: true,
        viewers: 234,
        thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
        category: "Technology",
        duration: "2:34:15",
      },
      interactions: {
        likes: 189,
        comments: 45,
        shares: 23,
        views: 234,
      },
      userInteracted: {
        liked: true,
        commented: false,
        shared: false,
        saved: false,
      },
    },

    // Community event
    {
      id: "community-1",
      type: "community_event",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      priority: 5,
      content: {
        title: "Tech Meetup: AI & Machine Learning",
        description: "Join us for an evening of discussions about the latest in AI and ML technologies.",
        date: "December 30, 2024",
        time: "6:00 PM - 9:00 PM",
        location: "Downtown Tech Hub",
        attendees: 45,
        maxAttendees: 100,
        organizer: "Tech Community SF",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
        isOnline: false,
        isFree: true,
      },
      interactions: {
        likes: 78,
        comments: 12,
        shares: 18,
      },
      userInteracted: {
        liked: false,
        commented: false,
        shared: false,
        saved: false,
      },
    },

    // Sponsored post
    {
      id: "sponsored-1",
      type: "sponsored_post",
      timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago
      priority: 4,
      author: {
        id: "sponsor-1",
        name: "SoftChat Premium",
        username: "softchat",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SC",
        verified: true,
        badges: ["Official"],
      },
      content: {
        title: "Unlock Your Creative Potential",
        description: "Join SoftChat Premium and get access to exclusive creator tools, priority support, and advanced analytics.",
        ctaText: "Upgrade Now",
        benefits: [
          "Advanced Analytics",
          "Priority Support",
          "Exclusive Tools",
          "Ad-Free Experience",
        ],
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
        price: "$9.99/month",
      },
      interactions: {
        likes: 123,
        comments: 34,
        shares: 8,
      },
      userInteracted: {
        liked: false,
        commented: false,
        shared: false,
        saved: false,
      },
    },

    // Another regular post
    {
      id: "post-2",
      type: "post",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      priority: 6,
      author: {
        id: "user-2",
        name: "Emma Wilson",
        username: "emmaw",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
        verified: false,
      },
      content: {
        text: "Beautiful sunset from my balcony today! Sometimes you need to step away from work and enjoy the simple things. 🌅✨",
        media: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
            alt: "Sunset view",
          },
        ],
      },
      interactions: {
        likes: 156,
        comments: 28,
        shares: 5,
      },
      userInteracted: {
        liked: true,
        commented: false,
        shared: false,
        saved: false,
      },
    },
  ];

  // Calculate priorities for all items
  const itemsWithCalculatedPriority = baseItems.map(item => ({
    ...item,
    priority: getContentPriority(
      item.type,
      item.timestamp,
      {
        likes: item.interactions.likes,
        comments: item.interactions.comments,
        shares: item.interactions.shares,
        views: item.interactions.views || 0
      },
      item.type === 'sponsored_post',
      item.author?.verified || false
    )
  }));

  // Use intelligent mixing to distribute content types evenly
  return mixContentIntelligently(itemsWithCalculatedPriority, {
    posts: 50,      // 50% regular posts
    products: 20,   // 20% product recommendations
    jobs: 15,       // 15% job/freelancer content
    ads: 10,        // 10% sponsored content
    events: 5,      // 5% events
  });
};

// Component for rendering different content types
const UnifiedFeedItemCard: React.FC<{
  item: UnifiedFeedItem;
  onInteraction: (itemId: string, type: string) => void;
}> = ({ item, onInteraction }) => {
  const { toast } = useToast();
  const { addToCart } = useEnhancedMarketplace();

  // Modal states
  const [showComments, setShowComments] = React.useState(false);
  const [showApplyModal, setShowApplyModal] = React.useState(false);
  const [showProductDetail, setShowProductDetail] = React.useState(false);
  const [showJobDetail, setShowJobDetail] = React.useState(false);

  const formatTime = (date: Date) => formatTimeAgo(date);

  const handleInteraction = (type: string) => {
    switch (type) {
      case "like":
        onInteraction(item.id, type);
        break;
      case "comment":
        setShowComments(!showComments);
        break;
      case "share":
        if (navigator.share) {
          navigator.share({
            title: item.content.title || item.content.text || "Check this out!",
            text: item.content.description || item.content.text,
            url: window.location.href,
          });
        } else {
          navigator.clipboard.writeText(window.location.href);
          toast({
            title: "Link copied!",
            description: "Post link copied to clipboard.",
          });
        }
        break;
      case "gift":
        // Handled inline with VirtualGiftsAndTips component
        break;
      case "buy":
        if (item.type === "product") {
          addToCart(item.id, 1);
          toast({
            title: "Added to Cart!",
            description: "Product added to your cart.",
          });
        }
        break;
      case "apply":
        if (item.type === "job") {
          setShowApplyModal(true);
        }
        break;
      case "hire":
        if (item.type === "freelancer_skill") {
          toast({
            title: "Contact Freelancer",
            description: "Opening contact form...",
          });
          // Could open hire modal here
        }
        break;
      case "save":
        onInteraction(item.id, type);
        const saveTitle = item.userInteracted.saved ? "Unsaved!" : "Saved!";
        const saveDescription = item.userInteracted.saved ? "Removed from saved items." : "Added to saved items.";
        toast({
          title: saveTitle,
          description: saveDescription,
        });
        break;
      default:
        onInteraction(item.id, type);
    }
  };

  const handleProductClick = () => {
    if (item.type === "product") {
      setShowProductDetail(true);
    }
  };

  const handleJobClick = () => {
    if (item.type === "job") {
      setShowJobDetail(true);
    }
  };

  const InteractionBar = () => (
    <div className="flex items-center justify-between pt-3 border-t">
      <div className="flex items-center gap-1 sm:gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleInteraction("like")}
          className={cn(
            "flex items-center gap-1 px-2 py-1.5 h-auto",
            item.userInteracted.liked && "text-red-500"
          )}
        >
          <Heart
            className={cn(
              "w-4 h-4",
              item.userInteracted.liked && "fill-current"
            )}
          />
          <span className="text-xs sm:text-sm">{formatNumber(item.interactions.likes)}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleInteraction("comment")}
          className={cn(
            "flex items-center gap-1 px-2 py-1.5 h-auto",
            showComments && "text-blue-500"
          )}
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-xs sm:text-sm">{formatNumber(item.interactions.comments)}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleInteraction("share")}
          className="flex items-center gap-1 px-2 py-1.5 h-auto"
        >
          <Share2 className="w-4 h-4" />
          <span className="text-xs sm:text-sm">{formatNumber(item.interactions.shares)}</span>
        </Button>
{item.author && (
          <VirtualGiftsAndTips
            recipientId={item.author.id}
            recipientName={item.author.name}
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 px-2 py-1.5 h-auto text-yellow-600 hover:text-yellow-700"
              >
                <Gift className="w-4 h-4" />
                <span className="text-xs sm:text-sm hidden sm:inline">Gift</span>
              </Button>
            }
          />
        )}
        {item.type === "product" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleInteraction("buy")}
            className="flex items-center gap-1 px-2 py-1.5 h-auto text-green-600"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Buy</span>
          </Button>
        )}
        {(item.type === "job" || item.type === "freelancer_skill") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleInteraction(item.type === "job" ? "apply" : "hire")}
            className="flex items-center gap-1 px-2 py-1.5 h-auto text-blue-600"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="text-xs sm:text-sm">{item.type === "job" ? "Apply" : "Hire"}</span>
          </Button>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleInteraction("save")}
        className={cn(
          "px-2 py-1.5 h-auto",
          item.userInteracted.saved && "text-blue-500"
        )}
      >
        <Bookmark
          className={cn(
            "w-4 h-4",
            item.userInteracted.saved && "fill-current"
          )}
        />
      </Button>
    </div>
  );

  // Regular post rendering
  if (item.type === "post") {
    return (
      <Card className="mb-4 sm:mb-6 mx-2 sm:mx-0">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={item.author?.avatar} />
                <AvatarFallback>{item.author?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{item.author?.name}</span>
                  {item.author?.verified && (
                    <Badge variant="secondary" className="h-4 w-4 p-0 rounded-full bg-blue-500">
                      <span className="text-white text-xs">✓</span>
                    </Badge>
                  )}
                  {item.author?.badges?.map((badge) => (
                    <Badge key={badge} variant="outline" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{formatTime(item.timestamp)}</span>
                  <Globe className="w-3 h-3" />
                  {item.content.location && (
                    <>
                      <span>•</span>
                      <MapPin className="w-3 h-3" />
                      <span>{item.content.location}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="px-4 pb-3">
            <p className="text-sm mb-3">{item.content.text}</p>
            {item.content.media && item.content.media.length > 0 && (
              <div className="relative">
                <img
                  src={item.content.media[0].url}
                  alt={item.content.media[0].alt}
                  className="w-full max-h-96 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="px-4 pb-4">
            <InteractionBar />

            {/* Comments Section */}
            {showComments && (
              <div className="mt-4 border-t pt-4">
                <EnhancedCommentsSection
                  postId={item.id}
                  isVisible={showComments}
                  commentsCount={item.interactions.comments}
                  onCommentsCountChange={(count) => {
                    // Update comments count if needed
                  }}
                />
              </div>
            )}
          </div>

          {/* Share handled natively in handleInteraction */}
        </CardContent>
      </Card>
    );
  }

  // Product recommendation rendering
  if (item.type === "product") {
    return (
      <Card className="mb-4 sm:mb-6 mx-2 sm:mx-0">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={item.author?.avatar} />
                <AvatarFallback>{item.author?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{item.author?.name}</span>
                  {item.author?.verified && (
                    <Badge variant="secondary" className="h-4 w-4 p-0 rounded-full bg-blue-500">
                      <span className="text-white text-xs">✓</span>
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    <ShoppingBag className="w-3 h-3 mr-1" />
                    Product
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{formatTime(item.timestamp)}</span>
                  <span>•</span>
                  <span>{item.content.category}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* Product Content */}
          <div className="px-4 pb-3">
            <div
              className="flex gap-3 sm:gap-4 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2"
              onClick={handleProductClick}
            >
              <div className="flex-shrink-0">
                <img
                  src={item.content.images[0]}
                  alt={item.content.title}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2 line-clamp-2">
                  {item.content.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 line-clamp-2">
                  {item.content.description}
                </p>
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs sm:text-sm font-medium">{item.content.rating}</span>
                    <span className="text-xs sm:text-sm text-gray-500">({formatNumber(item.content.reviews)})</span>
                  </div>
                  {item.content.fastShipping && (
                    <Badge variant="secondary" className="text-xs">
                      Fast Ship
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-base sm:text-lg font-bold text-green-600">
                    ${item.content.price}
                  </span>
                  {item.content.originalPrice && (
                    <>
                      <span className="text-xs sm:text-sm text-gray-500 line-through">
                        ${item.content.originalPrice}
                      </span>
                      <Badge variant="destructive" className="text-xs">
                        -{item.content.discount}%
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 pb-4">
            <InteractionBar />

            {/* Comments Section */}
            {showComments && (
              <div className="mt-4 border-t pt-4">
                <EnhancedCommentsSection
                  postId={item.id}
                  isVisible={showComments}
                  commentsCount={item.interactions.comments}
                  onCommentsCountChange={(count) => {
                    // Update comments count if needed
                  }}
                />
              </div>
            )}
          </div>

          {/* Modals */}
          {showProductDetail && (
            <Dialog open={showProductDetail} onOpenChange={setShowProductDetail}>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <EnhancedProductDetail productId={item.id} />
              </DialogContent>
            </Dialog>
          )}

        </CardContent>
      </Card>
    );
  }

  // Job posting rendering
  if (item.type === "job") {
    return (
      <Card className="mb-4 sm:mb-6 mx-2 sm:mx-0">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={item.author?.avatar} />
                <AvatarFallback>{item.author?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{item.author?.name}</span>
                  {item.author?.verified && (
                    <Badge variant="secondary" className="h-4 w-4 p-0 rounded-full bg-blue-500">
                      <span className="text-white text-xs">✓</span>
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    <Briefcase className="w-3 h-3 mr-1" />
                    Job
                  </Badge>
                  {item.content.urgency === "High" && (
                    <Badge variant="destructive" className="text-xs">
                      Urgent
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{formatTime(item.timestamp)}</span>
                  <span>•</span>
                  <span>{item.content.location}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* Job Content */}
          <div
            className="px-4 pb-3 cursor-pointer hover:bg-gray-50 rounded-lg mx-2 -mx-2"
            onClick={handleJobClick}
          >
            <h3 className="font-semibold text-lg mb-2">{item.content.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{item.content.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <span className="text-sm font-medium">Budget:</span>
                <p className="text-sm text-gray-600">
                  ${item.content.budget.min}-${item.content.budget.max}/{item.content.budget.type}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">Duration:</span>
                <p className="text-sm text-gray-600">{item.content.duration}</p>
              </div>
            </div>

            <div className="mb-3">
              <span className="text-sm font-medium">Skills:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {item.content.skills.map((skill: string) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{item.content.proposals} proposals</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{item.content.clientRating} client rating</span>
              </div>
            </div>
          </div>

          <div className="px-4 pb-4">
            <InteractionBar />

            {/* Comments Section */}
            {showComments && (
              <div className="mt-4 border-t pt-4">
                <EnhancedCommentsSection
                  postId={item.id}
                  isVisible={showComments}
                  commentsCount={item.interactions.comments}
                  onCommentsCountChange={(count) => {
                    // Update comments count if needed
                  }}
                />
              </div>
            )}
          </div>

          {/* Modals */}
          {showJobDetail && (
            <Dialog open={showJobDetail} onOpenChange={setShowJobDetail}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{item.content.title}</DialogTitle>
                </DialogHeader>
                <JobDetails
                  job={{
                    id: item.id,
                    title: item.content.title,
                    description: item.content.description,
                    category: "General",
                    subcategory: "Other",
                    budget: item.content.budget,
                    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    duration: item.content.duration,
                    experienceLevel: "intermediate" as const,
                    skills: item.content.skills,
                    client: {
                      id: item.author?.id || "",
                      name: item.author?.name || "",
                      email: `${item.author?.username}@example.com` || "",
                      avatar: item.author?.avatar || "",
                      location: item.content.location,
                      timezone: "UTC",
                      verified: item.author?.verified || false,
                      joinedDate: item.timestamp.toISOString(),
                      companyName: item.author?.name,
                      totalSpent: 0,
                      jobsPosted: item.content.proposals,
                      hireRate: 0.8,
                      rating: item.content.clientRating,
                      paymentVerified: true,
                    },
                    proposals: [],
                    status: "open" as const,
                    postedDate: item.timestamp.toISOString(),
                    applicationsCount: item.content.proposals,
                    visibility: "public" as const,
                  }}
                />
              </DialogContent>
            </Dialog>
          )}

          {showApplyModal && (
            <ApplyModal
              job={{
                id: item.id,
                title: item.content.title,
                description: item.content.description,
                budget: item.content.budget,
                duration: item.content.duration,
                skills: item.content.skills,
                location: item.content.location,
                urgency: item.content.urgency,
                proposals: item.content.proposals,
                clientRating: item.content.clientRating,
                client: {
                  id: item.author?.id || "",
                  name: item.author?.name || "",
                  username: item.author?.username || "",
                  avatar: item.author?.avatar || "",
                  verified: item.author?.verified || false,
                  rating: item.content.clientRating,
                },
                createdAt: item.timestamp.toISOString(),
                type: item.content.budget.type,
              }}
              onClose={() => setShowApplyModal(false)}
              onSubmit={() => {
                toast({
                  title: "Application Submitted!",
                  description: "Your application has been sent to the client.",
                });
                setShowApplyModal(false);
              }}
            />
          )}

        </CardContent>
      </Card>
    );
  }

  // Freelancer skill showcase rendering
  if (item.type === "freelancer_skill") {
    return (
      <Card className="mb-4 sm:mb-6 mx-2 sm:mx-0">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={item.author?.avatar} />
                <AvatarFallback>{item.author?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{item.author?.name}</span>
                  {item.author?.verified && (
                    <Badge variant="secondary" className="h-4 w-4 p-0 rounded-full bg-blue-500">
                      <span className="text-white text-xs">✓</span>
                    </Badge>
                  )}
                  {item.author?.badges?.map((badge) => (
                    <Badge key={badge} variant="outline" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{formatTime(item.timestamp)}</span>
                  <span>•</span>
                  <span>{item.content.availability}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* Freelancer Content */}
          <div className="px-4 pb-3">
            <h3 className="font-semibold text-lg mb-2">{item.content.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{item.content.description}</p>
            
            {/* Portfolio preview */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {item.content.portfolio.map((image: string, index: number) => (
                <img
                  key={index}
                  src={image}
                  alt={`Portfolio ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <span className="text-sm font-medium">Starting at:</span>
                <p className="text-lg font-bold text-green-600">${item.content.startingPrice}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Delivery:</span>
                <p className="text-sm text-gray-600">{item.content.deliveryTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{item.content.rating}</span>
              </div>
              <span>{item.content.completedProjects} projects</span>
            </div>

            <div className="flex flex-wrap gap-1">
              {item.content.skills.map((skill: string) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="px-4 pb-4">
            <InteractionBar />

            {/* Comments Section */}
            {showComments && (
              <div className="mt-4 border-t pt-4">
                <EnhancedCommentsSection
                  postId={item.id}
                  isVisible={showComments}
                  commentsCount={item.interactions.comments}
                  onCommentsCountChange={(count) => {
                    // Update comments count if needed
                  }}
                />
              </div>
            )}
          </div>

          {/* Modals */}
        </CardContent>
      </Card>
    );
  }

  // Live event rendering
  if (item.type === "live_event") {
    return (
      <Card className="mb-4 sm:mb-6 mx-2 sm:mx-0">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={item.author?.avatar} />
                <AvatarFallback>{item.author?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{item.author?.name}</span>
                  {item.author?.verified && (
                    <Badge variant="secondary" className="h-4 w-4 p-0 rounded-full bg-blue-500">
                      <span className="text-white text-xs">✓</span>
                    </Badge>
                  )}
                  {item.content.isLive && (
                    <Badge variant="destructive" className="text-xs animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                      LIVE
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{formatTime(item.timestamp)}</span>
                  <span>•</span>
                  <span>{item.content.category}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* Live Content */}
          <div className="relative">
            <img
              src={item.content.thumbnail}
              alt={item.content.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <Button size="lg" className="rounded-full bg-white bg-opacity-20 hover:bg-opacity-30">
                <Play className="w-8 h-8 text-white fill-white" />
              </Button>
            </div>
            <div className="absolute top-4 left-4 bg-black bg-opacity-70 px-2 py-1 rounded text-white text-sm">
              {item.content.duration}
            </div>
            <div className="absolute top-4 right-4 bg-red-500 px-2 py-1 rounded text-white text-sm flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatNumber(item.content.viewers)}
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{item.content.title}</h3>
            <InteractionBar />

            {/* Comments Section */}
            {showComments && (
              <div className="mt-4 border-t pt-4">
                <EnhancedCommentsSection
                  postId={item.id}
                  isVisible={showComments}
                  commentsCount={item.interactions.comments}
                  onCommentsCountChange={(count) => {
                    // Update comments count if needed
                  }}
                />
              </div>
            )}
          </div>

          {/* Modals */}
        </CardContent>
      </Card>
    );
  }

  // Community event rendering
  if (item.type === "community_event") {
    return (
      <Card className="mb-4 sm:mb-6 mx-2 sm:mx-0">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{item.content.organizer}</span>
                  <Badge variant="outline" className="text-xs">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    Event
                  </Badge>
                  {item.content.isFree && (
                    <Badge variant="secondary" className="text-xs">
                      Free
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{formatTime(item.timestamp)}</span>
                  <span>•</span>
                  <span>{item.content.location}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* Event Content */}
          <div className="relative">
            <img
              src={item.content.image}
              alt={item.content.title}
              className="w-full h-48 object-cover"
            />
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{item.content.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{item.content.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <span className="text-sm font-medium">Date & Time:</span>
                <p className="text-sm text-gray-600">{item.content.date}</p>
                <p className="text-sm text-gray-600">{item.content.time}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Attendees:</span>
                <p className="text-sm text-gray-600">
                  {item.content.attendees}/{item.content.maxAttendees} going
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Button size="sm" className="flex-1">
                <Users className="w-4 h-4 mr-2" />
                Join Event
              </Button>
              <Button size="sm" variant="outline">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            <InteractionBar />

            {/* Comments Section */}
            {showComments && (
              <div className="mt-4 border-t pt-4">
                <EnhancedCommentsSection
                  postId={item.id}
                  isVisible={showComments}
                  commentsCount={item.interactions.comments}
                  onCommentsCountChange={(count) => {
                    // Update comments count if needed
                  }}
                />
              </div>
            )}
          </div>

          {/* Modals */}
        </CardContent>
      </Card>
    );
  }

  // Sponsored post rendering
  if (item.type === "sponsored_post") {
    return (
      <Card className="mb-4 border-blue-200 bg-blue-50/30">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={item.author?.avatar} />
                <AvatarFallback>{item.author?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{item.author?.name}</span>
                  {item.author?.verified && (
                    <Badge variant="secondary" className="h-4 w-4 p-0 rounded-full bg-blue-500">
                      <span className="text-white text-xs">✓</span>
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs text-blue-600 border-blue-600">
                    Sponsored
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{formatTime(item.timestamp)}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* Sponsored Content */}
          <div className="relative">
            <img
              src={item.content.image}
              alt={item.content.title}
              className="w-full h-48 object-cover"
            />
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{item.content.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{item.content.description}</p>
            
            <div className="mb-3">
              <span className="text-sm font-medium mb-2 block">Features:</span>
              <div className="grid grid-cols-2 gap-2">
                {item.content.benefits.map((benefit: string) => (
                  <div key={benefit} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <span className="text-lg font-bold text-blue-600">{item.content.price}</span>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Crown className="w-4 h-4 mr-2" />
                {item.content.ctaText}
              </Button>
            </div>

            <InteractionBar />

            {/* Comments Section */}
            {showComments && (
              <div className="mt-4 border-t pt-4">
                <EnhancedCommentsSection
                  postId={item.id}
                  isVisible={showComments}
                  commentsCount={item.interactions.comments}
                  onCommentsCountChange={(count) => {
                    // Update comments count if needed
                  }}
                />
              </div>
            )}
          </div>

          {/* Modals */}
        </CardContent>
      </Card>
    );
  }

  return null;
};

// Main unified feed content component
const UnifiedFeedContent: React.FC<{ feedType: string }> = ({ feedType }) => {
  const [feedItems, setFeedItems] = useState<UnifiedFeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const allItems = generateUnifiedFeed();

      // Filter items based on feed type using utility
      const filteredItems = filterContentByFeedType(allItems, feedType);

      setFeedItems(filteredItems);
      setLoading(false);
    }, 1000);
  }, [feedType]);

  const handleInteraction = (itemId: string, type: string) => {
    setFeedItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item };
        if (type === "like") {
          updatedItem.userInteracted.liked = !item.userInteracted.liked;
          updatedItem.interactions.likes += item.userInteracted.liked ? -1 : 1;
        } else if (type === "save") {
          updatedItem.userInteracted.saved = !item.userInteracted.saved;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="w-32 h-4 bg-gray-200 rounded"></div>
                  <div className="w-24 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="w-full h-48 bg-gray-200 rounded-lg"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="pb-4">
      {feedItems.map((item) => (
        <UnifiedFeedItemCard
          key={item.id}
          item={item}
          onInteraction={handleInteraction}
        />
      ))}

      {feedItems.length === 0 && (
        <div className="text-center py-12 mx-2 sm:mx-0">
          <p className="text-gray-500 mb-4">No content available for this feed.</p>
          <Button variant="outline">Refresh</Button>
        </div>
      )}
    </div>
  );
};

export default UnifiedFeedContent;
