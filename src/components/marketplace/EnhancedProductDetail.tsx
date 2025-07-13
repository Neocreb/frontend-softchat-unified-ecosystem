import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Search,
  ArrowLeft,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
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
  verified: boolean;
  helpful: number;
  createdAt: string;
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
}

interface RelatedProduct {
  id: string;
  name: string;
  price: string;
  image: string;
  rating: number;
  reviews: number;
}

interface EnhancedProductDetailProps {
  productId: string;
}

const EnhancedProductDetail: React.FC<EnhancedProductDetailProps> = ({
  productId,
}) => {
  const { addToCart, addToWishlist } = useMarketplace();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [questions, setQuestions] = useState<ProductQA[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    content: "",
    images: [],
  });
  const [newQuestion, setNewQuestion] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<RelatedProduct[]>([]);
  const { toast } = useToast();

  // Mock product data - replace with API call
  const product = {
    id: productId,
    name: "Premium Wireless Headphones",
    brand: "AudioTech",
    price: "$299.99",
    originalPrice: "$399.99",
    discount: "25%",
    rating: 4.5,
    reviewCount: 1247,
    inStock: true,
    stockCount: 23,
    description:
      "Experience crystal-clear audio with our premium wireless headphones featuring noise cancellation and 30-hour battery life.",
    features: [
      "Active Noise Cancellation",
      "30-hour battery life",
      "Premium comfort design",
      "Wireless charging case",
      "Voice assistant support",
    ],
    specifications: {
      "Driver Size": "40mm",
      "Frequency Response": "20Hz - 20kHz",
      "Battery Life": "30 hours",
      "Charging Time": "2 hours",
      Weight: "250g",
      Connectivity: "Bluetooth 5.0",
    },
    variants: [
      { id: "1", name: "Midnight Black", color: "#000000" },
      { id: "2", name: "Pearl White", color: "#FFFFFF" },
      { id: "3", name: "Rose Gold", color: "#E8B4B8" },
    ],
    images: [
      {
        id: "1",
        url: "/api/placeholder/600/600",
        alt: "Main view",
        isPrimary: true,
      },
      {
        id: "2",
        url: "/api/placeholder/600/600",
        alt: "Side view",
        isPrimary: false,
      },
      {
        id: "3",
        url: "/api/placeholder/600/600",
        alt: "Detail view",
        isPrimary: false,
      },
      {
        id: "4",
        url: "/api/placeholder/600/600",
        alt: "Packaging",
        isPrimary: false,
      },
    ],
    seller: {
      id: "seller1",
      name: "AudioTech Official",
      rating: 4.8,
      responseTime: "2 hours",
      verified: true,
    },
    shipping: {
      free: true,
      estimatedDays: "2-3",
      express: true,
    },
  };

  useEffect(() => {
    loadProductData();
  }, [productId]);

  const loadProductData = async () => {
    try {
      // Load reviews
      setReviews([
        {
          id: "1",
          userId: "user1",
          userName: "Sarah Johnson",
          userAvatar: "/api/placeholder/40/40",
          rating: 5,
          title: "Excellent sound quality!",
          content:
            "These headphones exceeded my expectations. The noise cancellation is amazing and the battery lasts all day.",
          images: ["/api/placeholder/100/100"],
          verified: true,
          helpful: 24,
          createdAt: "2024-01-15",
        },
        {
          id: "2",
          userId: "user2",
          userName: "Mike Chen",
          userAvatar: "/api/placeholder/40/40",
          rating: 4,
          title: "Good value for money",
          content:
            "Great headphones for the price. Comfortable to wear for long periods.",
          images: [],
          verified: false,
          helpful: 12,
          createdAt: "2024-01-10",
        },
      ]);

      // Load Q&A
      setQuestions([
        {
          id: "1",
          question: "Are these compatible with iPhone?",
          answer:
            "Yes, these headphones are fully compatible with iPhone and all Bluetooth devices.",
          userId: "user3",
          userName: "Alex Kim",
          answeredBy: "AudioTech Support",
          answeredAt: "2024-01-12",
          createdAt: "2024-01-10",
          helpful: 8,
        },
      ]);

      // Load related products
      setRelatedProducts([
        {
          id: "related1",
          name: "Wireless Earbuds Pro",
          price: "$199.99",
          image: "/api/placeholder/200/200",
          rating: 4.3,
          reviews: 892,
        },
        {
          id: "related2",
          name: "Premium Speaker Set",
          price: "$449.99",
          image: "/api/placeholder/200/200",
          rating: 4.7,
          reviews: 654,
        },
      ]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load product data",
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      addToCart(productId, quantity);
      toast({
        title: "Added to Cart",
        description: `${quantity} ${product.name} added to your cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      });
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to make a purchase",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      addToCart(productId, quantity);
      navigate("/app/marketplace/checkout");
      toast({
        title: "Proceeding to Checkout",
        description: "Product added to cart and redirecting to checkout...",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to proceed to checkout",
        variant: "destructive",
      });
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      description: isWishlisted
        ? "Item removed from your wishlist"
        : "Item saved to your wishlist",
    });
  };

  const handleSubmitReview = () => {
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
      description: "Thank you for your review!",
    });
    setNewReview({ rating: 5, title: "", content: "", images: [] });
  };

  const handleSubmitQuestion = () => {
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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length,
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      // Simulate search results
      const mockResults: RelatedProduct[] = [
        {
          id: "search1",
          name: `${query} - Premium Edition`,
          price: "$299.99",
          image: "/api/placeholder/200/200",
          rating: 4.5,
          reviews: 234,
        },
        {
          id: "search2",
          name: `${query} - Budget Friendly`,
          price: "$149.99",
          image: "/api/placeholder/200/200",
          rating: 4.2,
          reviews: 156,
        },
      ];
      setSearchResults(mockResults);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Enhanced Navigation Bar with Search */}
      <div className="mb-6 flex items-center gap-4 p-4 bg-white border rounded-lg shadow-sm">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>

        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search similar products..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline">Product Detail</Badge>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Results for "{searchQuery}"
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <img
                    src={result.image}
                    alt={result.name}
                    className="w-full aspect-square object-cover rounded mb-2"
                  />
                  <h4 className="font-medium text-sm mb-1 line-clamp-2">
                    {result.name}
                  </h4>
                  <div className="flex items-center gap-1 mb-1">
                    {renderStars(result.rating)}
                    <span className="text-xs text-gray-600">
                      ({result.reviews})
                    </span>
                  </div>
                  <p className="font-bold text-green-600">{result.price}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
            <img
              src={product.images[currentImageIndex].url}
              alt={product.images[currentImageIndex].alt}
              className="w-full h-full object-cover transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
            />

            {/* Image Navigation */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={prevImage}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={nextImage}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            {/* Zoom Controls */}
            <div className="absolute bottom-2 right-2 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.2))}
              >
                -
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.2))}
              >
                +
              </Button>
            </div>
          </div>

          {/* Thumbnail Images */}
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={image.id}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  index === currentImageIndex
                    ? "border-blue-500"
                    : "border-gray-200"
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{product.brand}</Badge>
              {product.seller.verified && (
                <Badge variant="outline" className="text-green-600">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified Seller
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {renderStars(product.rating)}
                <span className="text-sm text-gray-600 ml-1">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-green-600">
              {product.price}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  {product.originalPrice}
                </span>
                <Badge variant="destructive">{product.discount} OFF</Badge>
              </>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {product.inStock ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-600">
                  In Stock ({product.stockCount} available)
                </span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-red-600">Out of Stock</span>
              </>
            )}
          </div>

          {/* Shipping Info */}
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
            <Truck className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium">
                {product.shipping.free ? "Free Shipping" : "Shipping Available"}
              </p>
              <p className="text-sm text-gray-600">
                Estimated delivery: {product.shipping.estimatedDays} business
                days
              </p>
            </div>
          </div>

          {/* Variants */}
          {product.variants.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Color</h3>
              <div className="flex gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedVariant === variant.id
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: variant.color }}
                    onClick={() => setSelectedVariant(variant.id)}
                    title={variant.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label htmlFor="quantity" className="font-medium">
                Quantity:
              </label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={product.stockCount}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-20"
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddToCart} className="flex-1">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                variant="outline"
                className="flex-1"
              >
                <Zap className="w-4 h-4 mr-2" />
                Buy Now
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleWishlist}
                className="flex-1"
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
                />
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsComparing(!isComparing)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews ({product.reviewCount})
          </TabsTrigger>
          <TabsTrigger value="qa">Q&A ({questions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-700 mb-4">{product.description}</p>
              <h4 className="font-medium mb-3">Key Features:</h4>
              <ul className="list-disc list-inside space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-gray-700">
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b">
                    <span className="font-medium">{key}:</span>
                    <span className="text-gray-700">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          <div className="space-y-6">
            {/* Review Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold">{product.rating}</div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {renderStars(product.rating)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {product.reviewCount} reviews
                    </div>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{stars}</span>
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${Math.random() * 80 + 10}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Write Review */}
                <div className="border-t pt-6">
                  <h4 className="font-medium mb-3">Write a Review</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Rating
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() =>
                              setNewReview({ ...newReview, rating: star })
                            }
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= newReview.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <Input
                      placeholder="Review title"
                      value={newReview.title}
                      onChange={(e) =>
                        setNewReview({ ...newReview, title: e.target.value })
                      }
                    />
                    <Textarea
                      placeholder="Share your experience with this product..."
                      value={newReview.content}
                      onChange={(e) =>
                        setNewReview({ ...newReview, content: e.target.value })
                      }
                    />
                    <Button onClick={handleSubmitReview}>Submit Review</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews List */}
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={review.userAvatar}
                      alt={review.userName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{review.userName}</span>
                        {review.verified && (
                          <Badge variant="outline" className="text-xs">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-600">
                          {review.createdAt}
                        </span>
                      </div>
                      <h4 className="font-medium mb-2">{review.title}</h4>
                      <p className="text-gray-700 mb-3">{review.content}</p>
                      {review.images.length > 0 && (
                        <div className="flex gap-2 mb-3">
                          {review.images.map((img, index) => (
                            <img
                              key={index}
                              src={img}
                              alt="Review"
                              className="w-16 h-16 rounded object-cover"
                            />
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm">
                          👍 Helpful ({review.helpful})
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="qa" className="mt-4">
          <div className="space-y-6">
            {/* Ask Question */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-medium mb-3">Ask a Question</h4>
                <div className="flex gap-3">
                  <Input
                    placeholder="What would you like to know about this product?"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSubmitQuestion}>Ask</Button>
                </div>
              </CardContent>
            </Card>

            {/* Q&A List */}
            {questions.map((qa) => (
              <Card key={qa.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Q:</span>
                        <span className="text-gray-700">{qa.question}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Asked by {qa.userName} on {qa.createdAt}
                      </div>
                    </div>
                    {qa.answer && (
                      <div className="pl-4 border-l-2 border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-blue-600">A:</span>
                          <span className="text-gray-700">{qa.answer}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Answered by {qa.answeredBy} on {qa.answeredAt}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-4 pt-2">
                      <Button variant="ghost" size="sm">
                        👍 Helpful ({qa.helpful})
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      <Card>
        <CardHeader>
          <CardTitle>Related Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-square object-cover rounded mb-3"
                />
                <h4 className="font-medium mb-2 line-clamp-2">
                  {product.name}
                </h4>
                <div className="flex items-center gap-1 mb-2">
                  {renderStars(product.rating)}
                  <span className="text-xs text-gray-600">
                    ({product.reviews})
                  </span>
                </div>
                <p className="font-bold text-green-600">{product.price}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedProductDetail;
