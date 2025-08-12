import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  ArrowUpDown,
  Clock,
  Eye,
  Heart,
  ArrowLeft,
} from "lucide-react";
import { blogService } from "@/services/blogService";
import { cryptoService } from "@/services/cryptoService";
import { BlogPost } from "@/types/blog";
import { News, EducationContent } from "@/types/crypto";
import { cn } from "@/lib/utils";

export default function CryptoLearn() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [educationContent, setEducationContent] = useState<EducationContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEducationData();
  }, []);

  const loadEducationData = async () => {
    setIsLoading(true);
    try {
      const results = await Promise.allSettled([
        blogService.getBlogPosts({ limit: 12 }),
        cryptoService.getNews(12),
        cryptoService.getEducationContent(),
      ]);

      if (results[0].status === "fulfilled")
        setBlogPosts(results[0].value?.posts || []);
      if (results[1].status === "fulfilled") setNews(results[1].value || []);
      if (results[2].status === "fulfilled")
        setEducationContent(results[2].value || []);
    } catch (error) {
      console.error("Failed to load education data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading educational content...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Header with Back Navigation */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg p-4 sm:p-6">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.history.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Overview
              </Button>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Learn & News
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                Educational content, blog articles, and latest cryptocurrency news
              </p>
            </div>
          </div>

          {/* Blog RSS Feed Section */}
          <div className="space-y-6 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 sm:p-6 border border-blue-200/50 dark:border-blue-700/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold flex items-center gap-3 text-blue-800 dark:text-blue-200">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    Latest from SoftChat Blog
                  </h3>
                  <p className="text-sm text-blue-600/80 dark:text-blue-300/80">
                    Stay updated with crypto insights, trading strategies, and market analysis
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/50 hover:bg-white"
                    asChild
                  >
                    <a
                      href="/api/blog/rss"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs sm:text-sm"
                    >
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      RSS Feed
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    asChild
                  >
                    <a
                      href="/blog"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      View All Articles
                      <ArrowUpDown className="h-3 w-3 rotate-45" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {blogPosts && blogPosts.length > 0 ? (
                blogPosts.slice(0, 9).map((post, index) => (
                  <Card
                    key={post.id}
                    className="cursor-pointer hover:shadow-xl transition-all duration-300 group border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden hover:scale-[1.02]"
                    onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                  >
                    {post.featuredImage && (
                      <div className="relative h-40 sm:h-48 overflow-hidden">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>

                        {/* Article Number Badge */}
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-white/90 text-black font-bold text-xs px-2 py-1">
                            #{index + 1}
                          </Badge>
                        </div>

                        <div className="absolute top-3 right-3">
                          <Badge
                            className={cn(
                              "text-white text-xs font-semibold shadow-lg",
                              post.category.color,
                            )}
                          >
                            {post.category.name}
                          </Badge>
                        </div>

                        {post.difficulty && (
                          <div className="absolute bottom-3 left-3">
                            <Badge
                              className={cn(
                                "text-xs font-semibold shadow-lg border-0",
                                post.difficulty === "BEGINNER" &&
                                  "bg-green-500 text-white",
                                post.difficulty === "INTERMEDIATE" &&
                                  "bg-yellow-500 text-white",
                                post.difficulty === "ADVANCED" &&
                                  "bg-red-500 text-white",
                              )}
                            >
                              {post.difficulty}
                            </Badge>
                          </div>
                        )}

                        {/* Reading Time Badge */}
                        <div className="absolute bottom-3 right-3">
                          <Badge
                            variant="secondary"
                            className="bg-white/90 text-black text-xs"
                          >
                            <Clock className="w-3 h-3 mr-1" />
                            {post.readingTime}m
                          </Badge>
                        </div>
                      </div>
                    )}
                    <CardContent className="p-5">
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <h3 className="font-bold text-base sm:text-lg line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                            {post.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                            {post.excerpt}
                          </p>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 2 && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-gray-100 dark:bg-gray-700"
                            >
                              +{post.tags.length - 2} more
                            </Badge>
                          )}
                        </div>

                        {/* Author and Meta */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <img
                                src={post.author.avatar}
                                alt={post.author.name}
                                className="w-6 h-6 rounded-full ring-2 ring-gray-100 dark:ring-gray-700"
                              />
                              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white dark:border-gray-800"></div>
                            </div>
                            <span className="text-sm font-medium truncate text-gray-700 dark:text-gray-300">
                              {post.author.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{post.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              <span>{post.likes}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center text-muted-foreground py-8">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p>Loading blog articles...</p>
                </div>
              )}
            </div>
          </div>

          {/* News & Education Section */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">
              News & Market Updates
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* News Articles */}
              {news && news.length > 0 ? (
                news.slice(0, 6).map((article) => (
                  <Card
                    key={article.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <Badge variant="outline" className="text-xs">
                          News
                        </Badge>
                        <h3 className="font-semibold text-sm line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {article.summary}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{article.source}</span>
                          <span>
                            {new Date(article.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center text-muted-foreground py-8">
                  <p>Loading news articles...</p>
                </div>
              )}

              {/* Education Content */}
              {educationContent && educationContent.length > 0
                ? educationContent.slice(0, 3).map((content) => (
                    <Card
                      key={content.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <Badge variant="outline" className="text-xs">
                            Education
                          </Badge>
                          <h3 className="font-semibold text-sm line-clamp-2">
                            {content.title}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-3">
                            {content.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{content.author}</span>
                            <span>{content.duration} min read</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
