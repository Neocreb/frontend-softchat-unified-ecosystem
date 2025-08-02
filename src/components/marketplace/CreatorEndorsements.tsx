import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Star,
  Heart,
  MessageSquare,
  Share2,
  Play,
  Eye,
  Users,
  Verified,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  socialCommerceService,
  type CreatorEndorsement,
} from '@/services/socialCommerceService';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface CreatorEndorsementsProps {
  productId: string;
  className?: string;
  maxVisible?: number;
  showCreateEndorsement?: boolean;
}

const CreatorEndorsements: React.FC<CreatorEndorsementsProps> = ({
  productId,
  className,
  maxVisible = 3,
  showCreateEndorsement = false,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [endorsements, setEndorsements] = useState<CreatorEndorsement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [expandedEndorsement, setExpandedEndorsement] = useState<string | null>(null);

  useEffect(() => {
    loadEndorsements();
  }, [productId]);

  const loadEndorsements = async () => {
    setIsLoading(true);
    try {
      const data = await socialCommerceService.getProductEndorsements(productId);
      setEndorsements(data);
    } catch (error) {
      console.error('Failed to load endorsements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatorClick = (creatorId: string) => {
    navigate(`/app/user/${creatorId}`);
  };

  const handleEndorsementClick = (endorsement: CreatorEndorsement) => {
    // Navigate to the original content (post/video)
    switch (endorsement.endorsementType) {
      case 'video':
        navigate(`/app/videos/${endorsement.id}`);
        break;
      case 'post':
        navigate(`/app/post/${endorsement.id}`);
        break;
      default:
        // Expand the endorsement for inline viewing
        setExpandedEndorsement(
          expandedEndorsement === endorsement.id ? null : endorsement.id
        );
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getEndorsementTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-3 h-3" />;
      case 'post': return <MessageSquare className="w-3 h-3" />;
      case 'story': return <Eye className="w-3 h-3" />;
      default: return <Star className="w-3 h-3" />;
    }
  };

  const getAuthenticityBadge = (authenticity: string) => {
    switch (authenticity) {
      case 'sponsored':
        return <Badge variant="outline" className="text-xs">Sponsored</Badge>;
      case 'partnership':
        return <Badge variant="secondary" className="text-xs">Partnership</Badge>;
      default:
        return <Badge variant="default" className="text-xs">Organic</Badge>;
    }
  };

  const visibleEndorsements = showAll ? endorsements : endorsements.slice(0, maxVisible);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="h-5 bg-muted rounded w-48 animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-10 h-10 bg-muted rounded-full" />
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

  if (endorsements.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Creator Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No creator endorsements yet</p>
            <p className="text-xs mt-1">Be the first to review this product!</p>
            {showCreateEndorsement && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => {
                  toast({
                    title: "Feature Coming Soon",
                    description: "Creator endorsement creation will be available soon!",
                  });
                }}
              >
                Create Endorsement
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Creator Reviews ({endorsements.length})
          </CardTitle>
          {showCreateEndorsement && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast({
                  title: "Feature Coming Soon",
                  description: "Creator endorsement creation will be available soon!",
                });
              }}
            >
              Add Review
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {visibleEndorsements.map((endorsement) => (
          <div
            key={endorsement.id}
            className={cn(
              'border rounded-lg p-4 transition-all hover:shadow-md cursor-pointer',
              expandedEndorsement === endorsement.id && 'border-primary bg-primary/5'
            )}
            onClick={() => handleEndorsementClick(endorsement)}
          >
            {/* Creator Header */}
            <div className="flex items-start gap-3 mb-3">
              <Avatar
                className="w-10 h-10 cursor-pointer ring-2 ring-transparent hover:ring-primary/20 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreatorClick(endorsement.creatorId);
                }}
              >
                <AvatarImage src={endorsement.creatorAvatar} alt={endorsement.creatorName} />
                <AvatarFallback>{endorsement.creatorName.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm truncate">
                    {endorsement.creatorName}
                  </h4>
                  {endorsement.creatorVerified && (
                    <Verified className="w-4 h-4 text-blue-500 fill-current" />
                  )}
                  <div className="flex items-center gap-1">
                    {getEndorsementTypeIcon(endorsement.endorsementType)}
                    <span className="text-xs text-muted-foreground capitalize">
                      {endorsement.endorsementType}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{formatNumber(endorsement.creatorFollowers)} followers</span>
                  </div>
                  <span>•</span>
                  <span>{new Date(endorsement.timestamp).toLocaleDateString()}</span>
                  <span>•</span>
                  {getAuthenticityBadge(endorsement.authenticity)}
                </div>
              </div>

              {/* Rating if available */}
              {endorsement.rating && (
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'w-3 h-3',
                          i < endorsement.rating!
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{endorsement.rating}</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="mb-3">
              <p
                className={cn(
                  'text-sm leading-relaxed',
                  expandedEndorsement === endorsement.id
                    ? 'line-clamp-none'
                    : 'line-clamp-3'
                )}
              >
                {endorsement.content}
              </p>
              {endorsement.content.length > 150 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto text-xs mt-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedEndorsement(
                      expandedEndorsement === endorsement.id ? null : endorsement.id
                    );
                  }}
                >
                  {expandedEndorsement === endorsement.id ? (
                    <>
                      Show less <ChevronUp className="w-3 h-3 ml-1" />
                    </>
                  ) : (
                    <>
                      Read more <ChevronDown className="w-3 h-3 ml-1" />
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Engagement Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span>{formatNumber(endorsement.engagement.likes)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>{formatNumber(endorsement.engagement.comments)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Share2 className="w-3 h-3" />
                  <span>{formatNumber(endorsement.engagement.shares)}</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-auto p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEndorsementClick(endorsement);
                }}
              >
                View Original
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        ))}

        {/* Show More/Less Button */}
        {endorsements.length > maxVisible && (
          <div className="text-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="gap-2"
            >
              {showAll ? (
                <>
                  Show Less <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Show {endorsements.length - maxVisible} More{' '}
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        )}

        {/* Summary Stats */}
        <div className="border-t pt-4 mt-4">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-semibold">
                {(endorsements.reduce((acc, e) => acc + (e.rating || 0), 0) / 
                  endorsements.filter(e => e.rating).length || 0).toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">Avg Rating</div>
            </div>
            <div>
              <div className="font-semibold">
                {formatNumber(
                  endorsements.reduce((acc, e) => acc + e.engagement.likes, 0)
                )}
              </div>
              <div className="text-xs text-muted-foreground">Total Likes</div>
            </div>
            <div>
              <div className="font-semibold">
                {formatNumber(
                  endorsements.reduce((acc, e) => acc + e.creatorFollowers, 0)
                )}
              </div>
              <div className="text-xs text-muted-foreground">Total Reach</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatorEndorsements;
