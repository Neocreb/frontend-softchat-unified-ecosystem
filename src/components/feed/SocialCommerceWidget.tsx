import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  ShoppingBag,
  Heart,
  Users,
  Star,
  TrendingUp,
  Eye,
  ArrowRight,
  Sparkles,
  ShoppingCart,
  ExternalLink,
} from 'lucide-react';
import {
  socialCommerceService,
  type ProductRecommendation,
  type CreatorEndorsement,
} from '@/services/socialCommerceService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface SocialCommerceWidgetProps {
  className?: string;
  type?: 'trending' | 'recommended' | 'similar';
  limit?: number;
  showSocialProof?: boolean;
}

const SocialCommerceWidget: React.FC<SocialCommerceWidgetProps> = ({
  className,
  type = 'recommended',
  limit = 4,
  showSocialProof = true,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, [type, user?.id]);

  const loadProducts = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      let recommendations: ProductRecommendation[] = [];
      
      switch (type) {
        case 'trending':
          recommendations = await socialCommerceService.getTrendingAmongNetwork(user.id, limit);
          break;
        case 'similar':
          recommendations = await socialCommerceService.getSimilarUserPurchases(user.id, limit);
          break;
        default:
          recommendations = await socialCommerceService.getPersonalizedRecommendations(user.id, { limit });
      }
      
      setProducts(recommendations);
    } catch (error) {
      console.error('Failed to load product recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = async (product: ProductRecommendation) => {
    // Track interaction
    await socialCommerceService.trackInteraction({
      userId: user?.id || '',
      type: 'view',
      targetId: product.productId,
      targetType: 'product',
      timestamp: new Date(),
      metadata: { source: 'social_commerce_widget', reason: product.reason },
    });

    navigate(`/app/marketplace/product/${product.productId}`);
  };

  const handleCreatorClick = async (creatorId: string) => {
    navigate(`/app/user/${creatorId}`);
  };

  const getWidgetTitle = () => {
    switch (type) {
      case 'trending': return '🔥 Trending in Your Network';
      case 'similar': return '👥 People Like You Bought';
      default: return '✨ Recommended for You';
    }
  };

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case 'creator_endorsement': return <Star className="w-3 h-3 text-yellow-500" />;
      case 'trending': return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'similar_users': return <Users className="w-3 h-3 text-blue-500" />;
      case 'social_activity': return <Heart className="w-3 h-3 text-pink-500" />;
      default: return <Sparkles className="w-3 h-3 text-purple-500" />;
    }
  };

  const formatPrice = (price: number, discountPrice?: number) => {
    if (discountPrice) {
      return (
        <div className="flex items-center gap-2">
          <span className="font-bold text-green-600">${discountPrice}</span>
          <span className="text-sm text-muted-foreground line-through">${price}</span>
        </div>
      );
    }
    return <span className="font-bold">${price}</span>;
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-16 h-16 bg-muted rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            {getWidgetTitle()}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/app/marketplace')}
            className="text-xs"
          >
            View All
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 pb-4">
        <div className="space-y-0">
          {products.map((product, index) => (
            <div
              key={product.productId}
              className={cn(
                'p-4 hover:bg-muted/50 transition-colors cursor-pointer border-b last:border-b-0',
                expandedProduct === product.productId && 'bg-muted/30'
              )}
              onClick={() => handleProductClick(product)}
            >
              <div className="flex gap-3">
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={product.productImage}
                    alt={product.productName}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  {product.discountPrice && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 text-xs px-1 py-0"
                    >
                      {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                    </Badge>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-medium text-sm line-clamp-1 pr-2">
                      {product.productName}
                    </h3>
                    {formatPrice(product.price, product.discountPrice)}
                  </div>

                  {/* Seller & Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-muted-foreground">
                      by {product.sellerName}
                    </span>
                    {product.sellerVerified && (
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        ✓
                      </Badge>
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs">{product.rating}</span>
                      <span className="text-xs text-muted-foreground">
                        ({product.reviewCount})
                      </span>
                    </div>
                  </div>

                  {/* Social Proof & Reason */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {getReasonIcon(product.reason)}
                      <span>{product.reasonDetails}</span>
                    </div>
                    
                    {showSocialProof && product.socialProof.friendsPurchased > 0 && (
                      <div className="flex items-center gap-1 text-xs">
                        <Users className="w-3 h-3" />
                        <span>{product.socialProof.friendsPurchased} friends bought</span>
                      </div>
                    )}
                  </div>

                  {/* Creator Endorsements */}
                  {showSocialProof && product.socialProof.creatorEndorsements.length > 0 && (
                    <div className="mt-2 flex items-center gap-1">
                      <div className="flex -space-x-1">
                        {product.socialProof.creatorEndorsements.slice(0, 3).map((creatorId, i) => (
                          <Avatar
                            key={creatorId}
                            className="w-5 h-5 border border-background cursor-pointer hover:scale-110 transition-transform"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCreatorClick(creatorId);
                            }}
                          >
                            <AvatarImage src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${30 + i}.jpg`} />
                            <AvatarFallback className="text-xs">C</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        +{product.socialProof.creatorEndorsements.length} creators recommend
                      </span>
                    </div>
                  )}

                  {/* Quick Action Buttons */}
                  <div className="mt-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to cart functionality
                        toast({
                          title: "Added to Cart",
                          description: `${product.productName} added to your cart`,
                        });
                      }}
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Add to Cart
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 text-xs flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product);
                      }}
                    >
                      View Details
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="px-4 pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs"
            onClick={() => navigate('/app/marketplace')}
          >
            <ShoppingBag className="w-3 h-3 mr-1" />
            Explore More Products
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialCommerceWidget;
