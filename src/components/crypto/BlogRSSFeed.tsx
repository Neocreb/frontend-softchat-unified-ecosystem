import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Clock,
  ExternalLink,
  RefreshCw,
  Rss,
  TrendingUp,
  User,
} from "lucide-react";
import { BlogPost } from "@/types/blog";
import { blogService } from "@/services/blogService";
import { cn } from "@/lib/utils";

interface BlogRSSFeedProps {
  limit?: number;
  showHeader?: boolean;
  className?: string;
}

export default function BlogRSSFeed({
  limit = 6,
  showHeader = true,
  className,
}: BlogRSSFeedProps) {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadBlogPosts();
  }, [limit]);

  const loadBlogPosts = async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      // Get featured crypto content for better relevance
      const posts = await blogService.getFeaturedCryptoContent(limit);
      setBlogPosts(posts);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to load blog posts:", error);
      // Fallback to regular crypto posts
      try {
        const fallbackPosts = await blogService.getCryptoLearningPosts(limit);
        setBlogPosts(fallbackPosts);
      } catch (fallbackError) {
        console.error("Failed to load fallback blog posts:", fallbackError);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadBlogPosts(true);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "BEGINNER":
        return "bg-green-100 text-green-800 border-green-200";
      case "INTERMEDIATE":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ADVANCED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "1 day ago";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        {showHeader && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Rss className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-semibold">
                Latest from SoftChat Blog
              </h3>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: limit }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rss className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-semibold">Latest from SoftChat Blog</h3>
            <Badge variant="outline" className="text-xs">
              RSS Feed
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-xs"
            >
              <RefreshCw
                className={cn("h-3 w-3 mr-1", isRefreshing && "animate-spin")}
              />
              Refresh
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href="/blog"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View All
              </a>
            </Button>
          </div>
        </div>
      )}

      {blogPosts.length === 0 ? (
        <Card className="p-8 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">
            No blog posts available
          </h4>
          <p className="text-sm text-gray-500 mb-4">
            Blog content is currently being loaded. Please try refreshing.
          </p>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogPosts.map((post) => (
            <Card
              key={post.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 group overflow-hidden"
              onClick={() =>
                window.open(
                  `/blog/${post.slug}`,
                  "_blank",
                  "noopener,noreferrer",
                )
              }
            >
              {post.featuredImage && (
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute top-2 right-2">
                    <Badge
                      className={cn(
                        "text-white text-xs shadow-lg",
                        post.category.color,
                      )}
                    >
                      {post.category.name}
                    </Badge>
                  </div>

                  {/* Difficulty Badge */}
                  {post.difficulty && (
                    <div className="absolute top-2 left-2">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs shadow-lg",
                          getDifficultyColor(post.difficulty),
                        )}
                      >
                        {post.difficulty}
                      </Badge>
                    </div>
                  )}

                  {/* Trending indicator for high engagement */}
                  {(post.likes > 200 || post.views > 1000) && (
                    <div className="absolute bottom-2 right-2">
                      <Badge className="bg-red-500 text-white text-xs shadow-lg">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    </div>
                  )}
                </div>
              )}

              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Title */}
                  <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                    {post.title}
                  </h4>

                  {/* Excerpt */}
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs px-2 py-0.5"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        +{post.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Related Assets */}
                  {post.relatedAssets && post.relatedAssets.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {post.relatedAssets.slice(0, 4).map((asset) => (
                        <Badge
                          key={asset}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5"
                        >
                          {asset}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-4 h-4 rounded-full flex-shrink-0"
                      />
                      <span className="truncate">{post.author.name}</span>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.readingTime}m</span>
                      </div>
                      <span className="text-xs">
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* RSS Feed Info */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Last updated: {lastUpdated.toLocaleTimeString()} •
          <a
            href="/api/blog/rss"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 text-orange-600 hover:text-orange-700 underline"
          >
            Subscribe to RSS Feed
          </a>
        </p>
      </div>
    </div>
  );
}
