import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Image as ImageIcon,
  Video,
  Flag,
  MoreHorizontal,
  Calendar,
  Verified,
  Award,
  TrendingUp,
  Filter,
  SortAsc,
  Share2,
  Camera,
  Upload,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";
import { Product, Review } from "@/types/marketplace";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { cn, formatDate } from "@/lib/utils";

interface EnhancedReview extends Review {
  userName: string;
  userAvatar?: string;
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  userVoted?: "helpful" | "not_helpful" | null;
  images?: string[];
  videos?: string[];
  sellerResponse?: {
    message: string;
    date: string;
    sellerName: string;
  };
  tags?: string[];
  pros?: string[];
  cons?: string[];
  wouldRecommend?: boolean;
}

interface EnhancedReviewSystemProps {
  product: Product;
  reviews?: EnhancedReview[];
  onAddReview?: (review: Partial<EnhancedReview>) => void;
  canReview?: boolean;
}

const EnhancedReviewSystem = ({
  product,
  reviews: propReviews,
  onAddReview,
  canReview = true,
}: EnhancedReviewSystemProps) => {
  const [reviews, setReviews] = useState<EnhancedReview[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState("all");
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    comment: "",
    pros: [""],
    cons: [""],
    wouldRecommend: true,
    images: [] as File[],
    videos: [] as File[],
  });

  // Mock reviews data
  const mockReviews: EnhancedReview[] = [
    {
      id: "review_1",
      userId: "user_1",
      userName: "Sarah Johnson",
      userAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
      productId: product.id,
      rating: 5,
      title: "Absolutely amazing quality!",
      comment:
        "I've been using these headphones for 3 months now and they're incredible. The noise cancellation is top-notch, battery life is excellent, and the sound quality is crystal clear. Worth every penny!",
      isVerifiedPurchase: true,
      helpfulVotes: 24,
      userVoted: null,
      images: ["review1_img1.jpg", "review1_img2.jpg"],
      videos: ["review1_video.mp4"],
      pros: ["Excellent sound quality", "Long battery life", "Comfortable fit"],
      cons: ["Slightly heavy", "Expensive"],
      wouldRecommend: true,
      tags: ["quality", "comfort", "battery"],
      createdAt: "2024-01-10T14:30:00Z",
      updatedAt: "2024-01-10T14:30:00Z",
      sellerResponse: {
        message:
          "Thank you so much for the detailed review! We're thrilled you're enjoying the headphones.",
        date: "2024-01-11T09:15:00Z",
        sellerName: "AudioTech",
      },
    },
    {
      id: "review_2",
      userId: "user_2",
      userName: "Mike Chen",
      userAvatar: "https://randomuser.me/api/portraits/men/2.jpg",
      productId: product.id,
      rating: 4,
      title: "Great headphones with minor issues",
      comment:
        "Overall very satisfied with the purchase. Sound quality is great and they're comfortable for long listening sessions. Only complaint is that the touch controls can be a bit sensitive.",
      isVerifiedPurchase: true,
      helpfulVotes: 12,
      userVoted: null,
      images: ["review2_img1.jpg"],
      pros: ["Great sound", "Comfortable", "Good build quality"],
      cons: ["Sensitive touch controls"],
      wouldRecommend: true,
      tags: ["comfort", "controls"],
      createdAt: "2024-01-08T16:45:00Z",
      updatedAt: "2024-01-08T16:45:00Z",
    },
    {
      id: "review_3",
      userId: "user_3",
      userName: "Emma Wilson",
      userAvatar: "https://randomuser.me/api/portraits/women/3.jpg",
      productId: product.id,
      rating: 3,
      title: "Decent but not perfect",
      comment:
        "They're okay for the price. Sound quality is decent but I expected better noise cancellation based on the reviews. They do the job but there are better options out there.",
      isVerifiedPurchase: true,
      helpfulVotes: 8,
      userVoted: null,
      pros: ["Decent sound", "Good price"],
      cons: ["Average noise cancellation", "Build quality could be better"],
      wouldRecommend: false,
      tags: ["price", "noise-cancellation"],
      createdAt: "2024-01-05T11:20:00Z",
      updatedAt: "2024-01-05T11:20:00Z",
    },
  ];

  useEffect(() => {
    setReviews(propReviews || mockReviews);
  }, [propReviews]);

  const getFilteredAndSortedReviews = () => {
    let filtered = [...reviews];

    // Filter by rating
    if (filterRating !== "all") {
      filtered = filtered.filter(
        (review) => review.rating === parseInt(filterRating),
      );
    }

    // Sort reviews
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "highest_rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest_rating":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case "most_helpful":
        filtered.sort((a, b) => b.helpfulVotes - a.helpfulVotes);
        break;
    }

    return filtered;
  };

  const getRatingStats = () => {
    const stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      stats[review.rating as keyof typeof stats]++;
    });
    return stats;
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const handleVoteHelpful = (reviewId: string, helpful: boolean) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              helpfulVotes: review.helpfulVotes + (helpful ? 1 : -1),
              userVoted: helpful ? "helpful" : "not_helpful",
            }
          : review,
      ),
    );

    toast({
      title: "Vote recorded",
      description: `Thank you for your feedback on this review`,
    });
  };

  const handleAddToForm = (
    field: "pros" | "cons",
    index: number,
    value: string,
  ) => {
    setReviewForm((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addNewField = (field: "pros" | "cons") => {
    setReviewForm((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeField = (field: "pros" | "cons", index: number) => {
    setReviewForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmitReview = () => {
    if (!reviewForm.title.trim() || !reviewForm.comment.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newReview: EnhancedReview = {
      id: `review_${Date.now()}`,
      userId: user?.id || "current_user",
      userName: user?.username || "Anonymous",
      userAvatar: user?.avatar,
      productId: product.id,
      rating: reviewForm.rating,
      title: reviewForm.title,
      comment: reviewForm.comment,
      isVerifiedPurchase: true,
      helpfulVotes: 0,
      pros: reviewForm.pros.filter((p) => p.trim()),
      cons: reviewForm.cons.filter((c) => c.trim()),
      wouldRecommend: reviewForm.wouldRecommend,
      images: reviewForm.images.map((file) => file.name),
      videos: reviewForm.videos.map((file) => file.name),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);
    onAddReview?.(newReview);

    // Reset form
    setReviewForm({
      rating: 5,
      title: "",
      comment: "",
      pros: [""],
      cons: [""],
      wouldRecommend: true,
      images: [],
      videos: [],
    });

    setShowWriteReview(false);

    toast({
      title: "Review submitted",
      description: "Thank you for your review!",
    });
  };

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "w-3 h-3",
      md: "w-4 h-4",
      lg: "w-5 h-5",
    };

    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={cn(
              sizeClasses[size],
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
            )}
          />
        ))}
      </div>
    );
  };

  const ratingStats = getRatingStats();
  const averageRating = getAverageRating();
  const filteredReviews = getFilteredAndSortedReviews();

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Customer Reviews</span>
            {canReview && (
              <Button onClick={() => setShowWriteReview(true)}>
                Write a Review
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{averageRating}</div>
                {renderStars(Math.round(parseFloat(averageRating)), "lg")}
                <p className="text-sm text-muted-foreground mt-2">
                  Based on {reviews.length} reviews
                </p>
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm w-8">{rating} ★</span>
                  <Progress
                    value={
                      (ratingStats[rating as keyof typeof ratingStats] /
                        reviews.length) *
                      100
                    }
                    className="flex-1 h-2"
                  />
                  <span className="text-sm text-muted-foreground w-8">
                    {ratingStats[rating as keyof typeof ratingStats]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-wrap gap-3">
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest_rating">Highest Rating</SelectItem>
                <SelectItem value="lowest_rating">Lowest Rating</SelectItem>
                <SelectItem value="most_helpful">Most Helpful</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Review Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={review.userAvatar} />
                      <AvatarFallback>
                        {review.userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.userName}</span>
                        {review.isVerifiedPurchase && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-green-100 text-green-800"
                          >
                            <Verified className="w-3 h-3 mr-1" />
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Review
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Flag className="w-4 h-4 mr-2" />
                        Report Review
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Review Title */}
                <h4 className="font-semibold">{review.title}</h4>

                {/* Review Content */}
                <p className="text-muted-foreground">{review.comment}</p>

                {/* Pros and Cons */}
                {(review.pros?.length || review.cons?.length) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {review.pros && review.pros.length > 0 && (
                      <div>
                        <h5 className="font-medium text-sm text-green-800 mb-2">
                          Pros
                        </h5>
                        <ul className="space-y-1">
                          {review.pros.map((pro, index) => (
                            <li
                              key={index}
                              className="text-sm text-green-700 flex items-center gap-2"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {review.cons && review.cons.length > 0 && (
                      <div>
                        <h5 className="font-medium text-sm text-red-800 mb-2">
                          Cons
                        </h5>
                        <ul className="space-y-1">
                          {review.cons.map((con, index) => (
                            <li
                              key={index}
                              className="text-sm text-red-700 flex items-center gap-2"
                            >
                              <ThumbsDown className="w-3 h-3" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Media */}
                {(review.images?.length || review.videos?.length) && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Media</h5>
                    <div className="flex gap-2">
                      {review.images?.map((image, index) => (
                        <div
                          key={index}
                          className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center"
                        >
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        </div>
                      ))}
                      {review.videos?.map((video, index) => (
                        <div
                          key={index}
                          className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center"
                        >
                          <Video className="w-6 h-6 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendation */}
                {review.wouldRecommend !== undefined && (
                  <div className="flex items-center gap-2">
                    {review.wouldRecommend ? (
                      <Badge className="bg-green-100 text-green-800">
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        Recommends this product
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-red-800 border-red-200"
                      >
                        <ThumbsDown className="w-3 h-3 mr-1" />
                        Doesn't recommend
                      </Badge>
                    )}
                  </div>
                )}

                {/* Seller Response */}
                {review.sellerResponse && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-sm text-blue-900">
                        Response from {review.sellerResponse.sellerName}
                      </span>
                      <span className="text-xs text-blue-700">
                        {formatDate(review.sellerResponse.date)}
                      </span>
                    </div>
                    <p className="text-sm text-blue-800">
                      {review.sellerResponse.message}
                    </p>
                  </div>
                )}

                <Separator />

                {/* Review Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVoteHelpful(review.id, true)}
                        disabled={review.userVoted === "helpful"}
                        className={cn(
                          review.userVoted === "helpful" && "text-green-600",
                        )}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Helpful ({review.helpfulVotes})
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVoteHelpful(review.id, false)}
                        disabled={review.userVoted === "not_helpful"}
                        className={cn(
                          review.userVoted === "not_helpful" && "text-red-600",
                        )}
                      >
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        Not Helpful
                      </Button>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Reply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Write Review Dialog */}
      <Dialog open={showWriteReview} onOpenChange={setShowWriteReview}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your experience with {product.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Rating */}
            <div className="space-y-2">
              <Label>Overall Rating *</Label>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    size="sm"
                    className="p-1"
                    onClick={() =>
                      setReviewForm((prev) => ({ ...prev, rating: i + 1 }))
                    }
                  >
                    <Star
                      className={cn(
                        "w-6 h-6",
                        i < reviewForm.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300",
                      )}
                    />
                  </Button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {reviewForm.rating} star{reviewForm.rating !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Review Title *</Label>
              <Input
                id="title"
                placeholder="Summarize your review"
                value={reviewForm.title}
                onChange={(e) =>
                  setReviewForm((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment">Your Review *</Label>
              <Textarea
                id="comment"
                placeholder="Tell others about your experience with this product"
                rows={5}
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
              />
            </div>

            {/* Pros */}
            <div className="space-y-2">
              <Label>What did you like? (Optional)</Label>
              {reviewForm.pros.map((pro, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="What was good about this product?"
                    value={pro}
                    onChange={(e) =>
                      handleAddToForm("pros", index, e.target.value)
                    }
                  />
                  {reviewForm.pros.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeField("pros", index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addNewField("pros")}
              >
                Add Another Pro
              </Button>
            </div>

            {/* Cons */}
            <div className="space-y-2">
              <Label>What could be improved? (Optional)</Label>
              {reviewForm.cons.map((con, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="What could be better?"
                    value={con}
                    onChange={(e) =>
                      handleAddToForm("cons", index, e.target.value)
                    }
                  />
                  {reviewForm.cons.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeField("cons", index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addNewField("cons")}
              >
                Add Another Con
              </Button>
            </div>

            {/* Recommendation */}
            <div className="space-y-2">
              <Label>Would you recommend this product?</Label>
              <div className="flex gap-4">
                <Button
                  variant={reviewForm.wouldRecommend ? "default" : "outline"}
                  onClick={() =>
                    setReviewForm((prev) => ({ ...prev, wouldRecommend: true }))
                  }
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Yes
                </Button>
                <Button
                  variant={!reviewForm.wouldRecommend ? "default" : "outline"}
                  onClick={() =>
                    setReviewForm((prev) => ({
                      ...prev,
                      wouldRecommend: false,
                    }))
                  }
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  No
                </Button>
              </div>
            </div>

            {/* Media Upload */}
            <div className="space-y-2">
              <Label>Add Photos or Videos (Optional)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        setReviewForm((prev) => ({
                          ...prev,
                          images: [
                            ...prev.images,
                            ...Array.from(e.target.files!),
                          ],
                        }));
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Images (JPG, PNG, GIF)
                  </p>
                </div>
                <div>
                  <Input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        setReviewForm((prev) => ({
                          ...prev,
                          videos: [
                            ...prev.videos,
                            ...Array.from(e.target.files!),
                          ],
                        }));
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Videos (MP4, MOV, AVI)
                  </p>
                </div>
              </div>

              {/* Media Preview */}
              {(reviewForm.images.length > 0 ||
                reviewForm.videos.length > 0) && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Uploaded Files:</h5>
                  <div className="flex flex-wrap gap-2">
                    {reviewForm.images.map((file, index) => (
                      <Badge key={index} variant="outline">
                        <ImageIcon className="w-3 h-3 mr-1" />
                        {file.name}
                      </Badge>
                    ))}
                    {reviewForm.videos.map((file, index) => (
                      <Badge key={index} variant="outline">
                        <Video className="w-3 h-3 mr-1" />
                        {file.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowWriteReview(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleSubmitReview} className="flex-1">
                Submit Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedReviewSystem;
