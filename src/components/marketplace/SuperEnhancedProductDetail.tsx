import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Eye,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Zap,
  Shield,
  Truck,
  Award,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  Camera,
  Video,
  Maximize,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  ExternalLink,
  Users,
  Clock,
  MapPin,
  Package,
  CreditCard,
  Gift,
  AlertTriangle,
  Info,
  Plus,
  Minus,
  X,
  Copy,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Globe,
  Calendar,
  TrendingUp,
  BarChart,
  PieChart,
  Calculator,
  Bookmark,
  Flag,
  Archive,
  Tag,
  Sparkles,
  Crown,
  Flame,
  Target,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useAuth } from "@/contexts/AuthContext";
import { Product } from "@/types/marketplace";
import { cn } from "@/lib/utils";

interface SuperEnhancedProductDetailProps {
  productId: string;
  onClose?: () => void;
}

interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price?: number;
  stock?: number;
  image?: string;
}

interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  content: string;
  images: string[];
  videos: string[];
  verified: boolean;
  helpful: number;
  notHelpful: number;
  createdAt: string;
  replies: ProductReview[];
}

interface ProductQA {
  id: string;
  question: string;
  answer?: string;
  userId: string;
  userName: string;
  answeredBy?: string;
  answeredAt?: string;
  createdAt: string;
  helpful: number;
  verified: boolean;
}

export default function SuperEnhancedProductDetail({
  productId,
  onClose,
}: SuperEnhancedProductDetailProps) {
  const { getProduct, addToCart, addToWishlist } = useMarketplace();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [questions, setQuestions] = useState<ProductQA[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [viewerMode, setViewerMode] = useState<"normal" | "fullscreen" | "ar">(
    "normal",
  );
  const [currentTab, setCurrentTab] = useState("overview");
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const [stockAlert, setStockAlert] = useState(false);
  const [priceAlert, setPriceAlert] = useState<number | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showPriceHistory, setShowPriceHistory] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    content: "",
    images: [],
    videos: [],
  });
  const [newQuestion, setNewQuestion] = useState("");
  const [filterReviews, setFilterReviews] = useState({
    rating: 0,
    verified: false,
    withImages: false,
    sortBy: "newest",
  });

  const imageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    loadProductData();
  }, [productId]);

  const loadProductData = async () => {
    try {
      const productData = getProduct(productId);
      if (productData) {
        setProduct(productData);

        // Load additional data
        await Promise.all([
          loadReviews(),
          loadQuestions(),
          loadRelatedProducts(),
          loadPriceHistory(),
        ]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load product data",
        variant: "destructive",
      });
    }
  };

  const loadReviews = async () => {
    // Mock review data with enhanced features
    const mockReviews: ProductReview[] = [
      {
        id: "1",
        userId: "user1",
        userName: "Sarah Johnson",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100",
        rating: 5,
        title: "Exceptional quality and fast delivery!",
        content:
          "This product exceeded all my expectations. The build quality is outstanding and it arrived much faster than expected. The packaging was also very professional. Highly recommend!",
        images: [
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300",
          "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300",
        ],
        videos: ["https://www.w3schools.com/html/mov_bbb.mp4"],
        verified: true,
        helpful: 24,
        notHelpful: 2,
        createdAt: "2024-01-15T10:30:00Z",
        replies: [
          {
            id: "1-1",
            userId: "seller1",
            userName: "Store Owner",
            userAvatar:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
            rating: 0,
            title: "",
            content:
              "Thank you so much for your wonderful review! We're thrilled you love the product.",
            images: [],
            videos: [],
            verified: true,
            helpful: 5,
            notHelpful: 0,
            createdAt: "2024-01-16T09:15:00Z",
            replies: [],
          },
        ],
      },
      {
        id: "2",
        userId: "user2",
        userName: "Mike Chen",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        rating: 4,
        title: "Good value for money",
        content:
          "Overall satisfied with the purchase. Quality is good for the price point. Shipping was reasonable.",
        images: [],
        videos: [],
        verified: false,
        helpful: 12,
        notHelpful: 1,
        createdAt: "2024-01-10T14:20:00Z",
        replies: [],
      },
    ];

    setReviews(mockReviews);
  };

  const loadQuestions = async () => {
    const mockQuestions: ProductQA[] = [
      {
        id: "1",
        question: "Is this compatible with iPhone 15?",
        answer:
          "Yes, this product is fully compatible with iPhone 15 and all previous iPhone models.",
        userId: "user3",
        userName: "Alex Kim",
        answeredBy: "TechSupport Team",
        answeredAt: "2024-01-12T16:45:00Z",
        createdAt: "2024-01-10T11:30:00Z",
        helpful: 8,
        verified: true,
      },
      {
        id: "2",
        question: "What's the warranty period?",
        answer:
          "This product comes with a 2-year manufacturer warranty covering defects and malfunctions.",
        userId: "user4",
        userName: "Lisa Wang",
        answeredBy: "Customer Service",
        answeredAt: "2024-01-11T10:20:00Z",
        createdAt: "2024-01-09T15:45:00Z",
        helpful: 15,
        verified: true,
      },
    ];

    setQuestions(mockQuestions);
  };

  const loadRelatedProducts = async () => {
    // Mock related products
    setRelatedProducts([]);
  };

  const loadPriceHistory = async () => {
    // Mock price history data
    const mockPriceHistory = [299, 289, 279, 269, 259, 249];
    setPriceHistory(mockPriceHistory);
  };

  const handleImageMouseMove = (e: React.MouseEvent) => {
    if (!isZoomed || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x, y });
  };

  const handleAddToCart = () => {
    if (!product || !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      });
      return;
    }

    addToCart(product.id, quantity);
    toast({
      title: "Added to Cart",
      description: `${quantity} ${product.name} added to your cart`,
    });
  };

  const handleAddToWishlist = () => {
    if (!product || !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save items",
        variant: "destructive",
      });
      return;
    }

    setIsWishlisted(!isWishlisted);
    addToWishlist(product.id);
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      description: isWishlisted
        ? "Item removed from your wishlist"
        : "Item saved to your wishlist",
    });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out ${product?.name} on our marketplace!`;

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast({
          title: "Link copied",
          description: "Product link copied to clipboard",
        });
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  const handleSubmitReview = async () => {
    if (!newReview.title || !newReview.content) {
      toast({
        title: "Error",
        description: "Please fill in all review fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Review Submitted",
      description:
        "Thank you for your review! It will be published after moderation.",
    });

    setNewReview({ rating: 5, title: "", content: "", images: [], videos: [] });
  };

  const handleSubmitQuestion = async () => {
    if (!newQuestion.trim()) {
      toast({
        title: "Error",
        description: "Please enter your question",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Question Submitted",
      description:
        "Your question has been submitted and will be answered soon.",
    });

    setNewQuestion("");
  };

  const setPriceAlertHandler = () => {
    if (!priceAlert) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Price Alert Set",
      description: `You'll be notified when the price drops to $${priceAlert}`,
    });
  };

  const toggleStockAlert = () => {
    setStockAlert(!stockAlert);
    toast({
      title: stockAlert ? "Stock Alert Disabled" : "Stock Alert Enabled",
      description: stockAlert
        ? "You won't receive stock notifications"
        : "You'll be notified when this item is back in stock",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onRatingChange?: (rating: number) => void,
  ) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4 transition-colors",
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
          interactive && "cursor-pointer hover:text-yellow-400",
        )}
        onClick={() => interactive && onRatingChange?.(i + 1)}
      />
    ));
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach((review) => {
      distribution[review.rating - 1]++;
    });
    return distribution.reverse();
  };

  const filteredReviews = reviews
    .filter((review) => {
      if (filterReviews.rating > 0 && review.rating < filterReviews.rating)
        return false;
      if (filterReviews.verified && !review.verified) return false;
      if (filterReviews.withImages && review.images.length === 0) return false;
      return true;
    })
    .sort((a, b) => {
      switch (filterReviews.sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "rating_high":
          return b.rating - a.rating;
        case "rating_low":
          return a.rating - b.rating;
        case "helpful":
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Marketplace</span> /{" "}
            <span className="capitalize">{product.category}</span> /{" "}
            <span className="text-gray-900">{product.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Product Images - 5 columns */}
          <div className="lg:col-span-5 space-y-4">
            {/* Main Image */}
            <div
              ref={imageRef}
              className={cn(
                "relative aspect-square bg-gray-100 rounded-lg overflow-hidden group cursor-zoom-in",
                isZoomed && "cursor-zoom-out",
              )}
              onClick={() => setIsZoomed(!isZoomed)}
              onMouseMove={handleImageMouseMove}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <img
                src={product.image}
                alt={product.name}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-300",
                  isZoomed && "scale-150 origin-center",
                )}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                      }
                    : {}
                }
              />

              {/* Image Navigation */}
              {product.images && product.images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex((prev) =>
                        prev > 0 ? prev - 1 : (product.images?.length || 1) - 1,
                      );
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex((prev) =>
                        prev < (product.images?.length || 1) - 1 ? prev + 1 : 0,
                      );
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Image Tools */}
              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm"
                    >
                      <Maximize className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Fullscreen</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm"
                    >
                      <Camera className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>360° View</TooltipContent>
                </Tooltip>
              </div>

              {/* Product Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.isNew && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    New
                  </Badge>
                )}
                {product.isSponsored && (
                  <Badge
                    variant="secondary"
                    className="bg-amber-100 text-amber-800"
                  >
                    <Crown className="h-3 w-3 mr-1" />
                    Sponsored
                  </Badge>
                )}
                {product.discountPrice && (
                  <Badge variant="destructive">
                    <Flame className="h-3 w-3 mr-1" />
                    {Math.round(
                      ((product.price - product.discountPrice) /
                        product.price) *
                        100,
                    )}
                    % OFF
                  </Badge>
                )}
                {!product.inStock && (
                  <Badge
                    variant="secondary"
                    className="bg-red-100 text-red-800"
                  >
                    Out of Stock
                  </Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={cn(
                      "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors",
                      index === currentImageIndex
                        ? "border-blue-500"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Video className="h-4 w-4" />
                Watch Video
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                AR Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Save Image
              </Button>
            </div>
          </div>

          {/* Product Information - 4 columns */}
          <div className="lg:col-span-4 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className="text-blue-600 border-blue-200"
                >
                  {product.category}
                </Badge>
                {product.sellerVerified && (
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-200"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    Verified Seller
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                  <span className="text-sm text-gray-600 ml-1">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentTab("reviews")}
                >
                  See all reviews
                </Button>
              </div>
            </div>

            {/* Price */}
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-green-600">
                    {formatPrice(product.discountPrice || product.price)}
                  </span>
                  {product.discountPrice && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(product.price)}
                      </span>
                      <Badge variant="destructive" className="text-sm">
                        Save{" "}
                        {formatPrice(product.price - product.discountPrice)}
                      </Badge>
                    </>
                  )}
                </div>

                {/* Price History */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPriceHistory(!showPriceHistory)}
                    className="text-blue-600 p-0 h-auto"
                  >
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Price history
                  </Button>
                  {showPriceHistory && (
                    <div className="text-sm text-green-600">
                      ↓ 17% lower than last month
                    </div>
                  )}
                </div>

                {/* Price Alert */}
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Alert price"
                    value={priceAlert || ""}
                    onChange={(e) => setPriceAlert(Number(e.target.value))}
                    className="w-32"
                  />
                  <Button size="sm" onClick={setPriceAlertHandler}>
                    <Target className="h-4 w-4 mr-1" />
                    Set Alert
                  </Button>
                </div>
              </div>
            </Card>

            {/* Stock and Shipping */}
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {product.inStock ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-600 font-medium">
                          In Stock
                        </span>
                        <span className="text-sm text-gray-600">
                          (23 available)
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-red-600 font-medium">
                          Out of Stock
                        </span>
                      </>
                    )}
                  </div>
                  {!product.inStock && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleStockAlert}
                    >
                      <Bell
                        className={cn(
                          "h-4 w-4 mr-1",
                          stockAlert && "text-blue-600",
                        )}
                      />
                      Notify Me
                    </Button>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Shipping & Returns</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>• Free shipping on orders over $50</div>
                    <div>• Estimated delivery: 2-3 business days</div>
                    <div>• 30-day return policy</div>
                    <div>• Free returns and exchanges</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Variants Selection */}
            {product.variants && product.variants.length > 0 && (
              <Card className="p-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Select Options</h3>
                  {Object.entries(
                    product.variants.reduce(
                      (acc, variant) => {
                        const [type, value] = variant.name.split(": ");
                        if (!acc[type]) acc[type] = [];
                        acc[type].push(variant);
                        return acc;
                      },
                      {} as Record<string, typeof product.variants>,
                    ),
                  ).map(([type, options]) => (
                    <div key={type}>
                      <Label className="text-sm font-medium mb-2 block">
                        {type}
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {options.map((option) => (
                          <Button
                            key={option.id}
                            variant={
                              selectedVariants[type] === option.id
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [type]: option.id,
                              }))
                            }
                            className="flex items-center gap-2"
                          >
                            {option.value}
                            {option.price && option.price !== product.price && (
                              <span className="text-xs">
                                +{formatPrice(option.price - product.price)}
                              </span>
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Quantity and Add to Cart */}
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="quantity" className="font-medium">
                    Quantity:
                  </Label>
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max="10"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-16 text-center border-0 focus-visible:ring-0"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      disabled={quantity >= 10}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Buy Now
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    onClick={handleAddToWishlist}
                    className="flex items-center gap-1"
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4",
                        isWishlisted && "fill-red-500 text-red-500",
                      )}
                    />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowShareDialog(true)}
                    className="flex items-center gap-1"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Compare className="h-4 w-4" />
                    Compare
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Seller Info and Trust Signals - 3 columns */}
          <div className="lg:col-span-3 space-y-4">
            {/* Seller Card */}
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={product.sellerAvatar}
                      alt={product.sellerName}
                    />
                    <AvatarFallback>
                      {product.sellerName.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{product.sellerName}</h3>
                      {product.sellerVerified && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      {renderStars(product.sellerRating || 4.8)}
                      <span className="ml-1">
                        {product.sellerRating || 4.8} (2.1k reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Response time</div>
                    <div className="font-medium">Within 2 hours</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Ships from</div>
                    <div className="font-medium">California, US</div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Message
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Store
                  </Button>
                </div>
              </div>
            </Card>

            {/* Trust Signals */}
            <Card className="p-4">
              <h3 className="font-medium mb-3">Why buy from us?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium text-sm">Buyer Protection</div>
                    <div className="text-xs text-gray-600">
                      Full refund if item not as described
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium text-sm">Fast Shipping</div>
                    <div className="text-xs text-gray-600">
                      Ships within 24 hours
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="font-medium text-sm">Quality Guarantee</div>
                    <div className="text-xs text-gray-600">
                      30-day quality guarantee
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-orange-500" />
                  <div>
                    <div className="font-medium text-sm">Secure Payment</div>
                    <div className="text-xs text-gray-600">
                      SSL encrypted transactions
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-4">
              <h3 className="font-medium mb-3">Product Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Views today</span>
                  <span className="text-sm font-medium">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sold this week</span>
                  <span className="text-sm font-medium">89</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">In wishlist</span>
                  <span className="text-sm font-medium">3,421</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last updated</span>
                  <span className="text-sm font-medium">2 hours ago</span>
                </div>
              </div>
            </Card>

            {/* Similar Products */}
            <Card className="p-4">
              <h3 className="font-medium mb-3">Similar Products</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex gap-3">
                    <img
                      src={`https://images.unsplash.com/photo-${1505740420928 + item}-5e560c06d30e?w=60&h=60&fit=crop`}
                      alt="Similar product"
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        Similar Product {item}
                      </div>
                      <div className="text-sm text-green-600 font-semibold">
                        $199.99
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(4 + Math.random())}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-8">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({reviews.length})
              </TabsTrigger>
              <TabsTrigger value="qa">Q&A ({questions.length})</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 mb-6">{product.description}</p>

                    <h3 className="text-lg font-semibold mb-4">Key Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {[
                        "Premium build quality",
                        "Advanced technology",
                        "User-friendly design",
                        "Excellent value",
                        "Fast performance",
                        "Reliable durability",
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-lg font-semibold mb-4">
                      What's in the Box
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>1x {product.name}</li>
                      <li>1x User Manual</li>
                      <li>1x Warranty Card</li>
                      <li>1x Charging Cable (if applicable)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-4">General</h3>
                      <div className="space-y-3">
                        {[
                          ["Brand", product.sellerName],
                          ["Model", "PRO-2024"],
                          ["Color", "Multiple Options"],
                          ["Weight", "2.5 lbs"],
                          ["Dimensions", "12 x 8 x 3 inches"],
                        ].map(([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between py-2 border-b border-gray-100"
                          >
                            <span className="text-gray-600">{key}</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4">Technical</h3>
                      <div className="space-y-3">
                        {[
                          ["Battery Life", "Up to 24 hours"],
                          ["Connectivity", "Bluetooth 5.0, WiFi"],
                          ["Compatibility", "iOS 14+, Android 9+"],
                          ["Warranty", "2 years manufacturer"],
                          ["Certification", "FCC, CE certified"],
                        ].map(([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between py-2 border-b border-gray-100"
                          >
                            <span className="text-gray-600">{key}</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {/* Review Summary */}
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Overall Rating */}
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2">
                          {calculateAverageRating()}
                        </div>
                        <div className="flex items-center justify-center gap-1 mb-2">
                          {renderStars(Number(calculateAverageRating()))}
                        </div>
                        <div className="text-sm text-gray-600">
                          Based on {reviews.length} reviews
                        </div>
                      </div>

                      {/* Rating Distribution */}
                      <div className="space-y-2">
                        {getRatingDistribution().map((count, index) => (
                          <div
                            key={5 - index}
                            className="flex items-center gap-2"
                          >
                            <span className="text-sm w-4">{5 - index}</span>
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{
                                  width: `${reviews.length ? (count / reviews.length) * 100 : 0}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-8">
                              {count}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Review Filters */}
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">
                            Filter by rating
                          </Label>
                          <Select
                            value={filterReviews.rating.toString()}
                            onValueChange={(value) =>
                              setFilterReviews((prev) => ({
                                ...prev,
                                rating: Number(value),
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">All ratings</SelectItem>
                              <SelectItem value="5">5 stars</SelectItem>
                              <SelectItem value="4">4+ stars</SelectItem>
                              <SelectItem value="3">3+ stars</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={filterReviews.verified}
                              onChange={(e) =>
                                setFilterReviews((prev) => ({
                                  ...prev,
                                  verified: e.target.checked,
                                }))
                              }
                            />
                            <span className="text-sm">
                              Verified purchases only
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={filterReviews.withImages}
                              onChange={(e) =>
                                setFilterReviews((prev) => ({
                                  ...prev,
                                  withImages: e.target.checked,
                                }))
                              }
                            />
                            <span className="text-sm">With photos</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Write Review */}
                <Card>
                  <CardHeader>
                    <CardTitle>Write a Review</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="block text-sm font-medium mb-2">
                        Rating
                      </Label>
                      <div className="flex gap-1">
                        {renderStars(newReview.rating, true, (rating) =>
                          setNewReview((prev) => ({ ...prev, rating })),
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="review-title">Review Title</Label>
                      <Input
                        id="review-title"
                        placeholder="Summarize your experience"
                        value={newReview.title}
                        onChange={(e) =>
                          setNewReview((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="review-content">Your Review</Label>
                      <Textarea
                        id="review-content"
                        placeholder="Share your experience with this product..."
                        value={newReview.content}
                        onChange={(e) =>
                          setNewReview((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        rows={4}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <Button onClick={handleSubmitReview}>
                        Submit Review
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Camera className="h-4 w-4" />
                        Add Photos
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Reviews List */}
                <div className="space-y-4">
                  {filteredReviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarImage
                                src={review.userAvatar}
                                alt={review.userName}
                              />
                              <AvatarFallback>
                                {review.userName.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">
                                  {review.userName}
                                </span>
                                {review.verified && (
                                  <Badge variant="outline" className="text-xs">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Verified Purchase
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex gap-1">
                                  {renderStars(review.rating)}
                                </div>
                                <span className="text-sm text-gray-600">
                                  {new Date(
                                    review.createdAt,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <h4 className="font-medium mb-2">
                                {review.title}
                              </h4>
                              <p className="text-gray-700 mb-3">
                                {review.content}
                              </p>

                              {/* Review Images */}
                              {review.images.length > 0 && (
                                <div className="flex gap-2 mb-3">
                                  {review.images.map((img, index) => (
                                    <img
                                      key={index}
                                      src={img}
                                      alt={`Review ${index + 1}`}
                                      className="w-16 h-16 rounded object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                    />
                                  ))}
                                </div>
                              )}

                              {/* Review Actions */}
                              <div className="flex items-center gap-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-600"
                                >
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  Helpful ({review.helpful})
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-600"
                                >
                                  <ThumbsDown className="h-4 w-4 mr-1" />(
                                  {review.notHelpful})
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-600"
                                >
                                  <MessageCircle className="h-4 w-4 mr-1" />
                                  Reply
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-600"
                                >
                                  <Flag className="h-4 w-4 mr-1" />
                                  Report
                                </Button>
                              </div>

                              {/* Review Replies */}
                              {review.replies.length > 0 && (
                                <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-3">
                                  {review.replies.map((reply) => (
                                    <div key={reply.id} className="flex gap-3">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage
                                          src={reply.userAvatar}
                                          alt={reply.userName}
                                        />
                                        <AvatarFallback>
                                          {reply.userName.slice(0, 2)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="font-medium text-sm">
                                            {reply.userName}
                                          </span>
                                          {reply.verified && (
                                            <Badge
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              Seller
                                            </Badge>
                                          )}
                                          <span className="text-xs text-gray-600">
                                            {new Date(
                                              reply.createdAt,
                                            ).toLocaleDateString()}
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-700">
                                          {reply.content}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="qa" className="mt-6">
              <div className="space-y-6">
                {/* Ask Question */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ask a Question</CardTitle>
                    <div className="text-sm text-gray-600">
                      Get answers from other customers and the seller
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      <Input
                        placeholder="What would you like to know about this product?"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleSubmitQuestion}>
                        Ask Question
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Questions List */}
                <div className="space-y-4">
                  {questions.map((qa) => (
                    <Card key={qa.id}>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-start gap-2 mb-2">
                              <span className="font-medium text-blue-600">
                                Q:
                              </span>
                              <span className="text-gray-900">
                                {qa.question}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 ml-4">
                              Asked by {qa.userName} on{" "}
                              {new Date(qa.createdAt).toLocaleDateString()}
                            </div>
                          </div>

                          {qa.answer && (
                            <div className="pl-4 border-l-2 border-blue-200">
                              <div className="flex items-start gap-2 mb-2">
                                <span className="font-medium text-green-600">
                                  A:
                                </span>
                                <span className="text-gray-900">
                                  {qa.answer}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 ml-4 flex items-center gap-2">
                                Answered by {qa.answeredBy} on{" "}
                                {qa.answeredAt &&
                                  new Date(qa.answeredAt).toLocaleDateString()}
                                {qa.verified && (
                                  <Badge variant="outline" className="text-xs">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-4 pt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-600"
                            >
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              Helpful ({qa.helpful})
                            </Button>
                            {!qa.answer && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600"
                              >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Answer
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Shipping Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Standard Shipping</div>
                          <div className="text-sm text-gray-600">
                            5-7 business days
                          </div>
                        </div>
                        <div className="text-green-600 font-medium">Free</div>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Express Shipping</div>
                          <div className="text-sm text-gray-600">
                            2-3 business days
                          </div>
                        </div>
                        <div className="font-medium">$9.99</div>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Overnight Shipping</div>
                          <div className="text-sm text-gray-600">
                            1 business day
                          </div>
                        </div>
                        <div className="font-medium">$24.99</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Return Policy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">30-day return window</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Free return shipping</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">
                          Original packaging required
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">
                          Instant refund processing
                        </span>
                      </div>
                    </div>
                    <Separator />
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Full Return Policy
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Share Dialog */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share this product</DialogTitle>
              <DialogDescription>
                Share this product with your friends and family
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => handleShare("facebook")}
                className="flex items-center gap-2"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare("twitter")}
                className="flex items-center gap-2"
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare("linkedin")}
                className="flex items-center gap-2"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare("copy")}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
