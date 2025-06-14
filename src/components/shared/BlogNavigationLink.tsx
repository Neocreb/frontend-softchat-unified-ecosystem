import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, BookOpen, Rss, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogNavigationLinkProps {
  variant?: "default" | "minimal" | "featured";
  showRSSLink?: boolean;
  className?: string;
}

export default function BlogNavigationLink({
  variant = "default",
  showRSSLink = true,
  className,
}: BlogNavigationLinkProps) {
  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button variant="ghost" size="sm" asChild>
          <a
            href="/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs"
          >
            <BookOpen className="h-3 w-3 mr-1" />
            Blog
          </a>
        </Button>
        {showRSSLink && (
          <Button variant="ghost" size="sm" asChild>
            <a
              href="/api/blog/rss"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs"
            >
              <Rss className="h-3 w-3" />
            </a>
          </Button>
        )}
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <div
        className={cn(
          "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4",
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                SoftChat Learning Hub
              </h4>
              <Badge
                variant="outline"
                className="text-xs bg-blue-100 text-blue-700 border-blue-300"
              >
                New Articles
              </Badge>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Stay updated with the latest crypto education, trading strategies,
              and market insights
            </p>
          </div>
          <div className="flex items-center gap-2">
            {showRSSLink && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href="/api/blog/rss"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs"
                >
                  <Rss className="h-3 w-3" />
                </a>
              </Button>
            )}
            <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700">
              <a
                href="/blog"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs"
              >
                <span>Explore Blog</span>
                <ArrowRight className="h-3 w-3 ml-1" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 bg-muted/50 rounded-lg border",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">SoftChat Blog</p>
          <p className="text-xs text-muted-foreground">
            Educational content & market insights
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {showRSSLink && (
          <Button variant="ghost" size="sm" asChild>
            <a
              href="/api/blog/rss"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs"
              title="Subscribe to RSS Feed"
            >
              <Rss className="h-3 w-3" />
            </a>
          </Button>
        )}
        <Button variant="outline" size="sm" asChild>
          <a
            href="/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Visit Blog
          </a>
        </Button>
      </div>
    </div>
  );
}
