import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EnhancedPostCard from "@/components/feed/EnhancedPostCard";
import { Post } from "@/types/post";
import { Building, Verified } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Page {
  id: string;
  name: string;
  followers: number;
  category: string;
  verified: boolean;
  avatar: string;
  description?: string;
  pageType: 'business' | 'brand' | 'public_figure' | 'community' | 'organization';
  isFollowing?: boolean;
  isOwner?: boolean;
  website?: string;
  location?: string;
  email?: string;
  phone?: string;
  createdAt?: string;
  posts?: number;
  engagement?: number;
}

interface PagePost extends Post {
  pageId: string;
  pageName: string;
  pageAvatar: string;
  pageVerified: boolean;
}

interface ExplorePagesProps {
  pages: Page[];
}

const ExplorePages = ({ pages }: ExplorePagesProps) => {
  console.log('ExplorePages component rendered', { pages });
  const [pagePosts, setPagePosts] = useState<PagePost[]>([]);
  const [loading, setLoading] = useState(false);
  const [followedPages] = useState<Page[]>([]);
  const { toast } = useToast();

  // Mock user pages data
  const mockFollowedPages: Page[] = [
    {
      id: 'followed-1',
      name: 'TechCorp Inc.',
      followers: 25420,
      category: 'Technology',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100',
      pageType: 'business',
      isFollowing: true,
      description: 'Leading technology solutions provider'
    },
    {
      id: 'followed-2',
      name: 'Digital Marketing Hub',
      followers: 18340,
      category: 'Marketing',
      verified: false,
      avatar: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=100',
      pageType: 'brand',
      isFollowing: true,
      description: 'Your go-to source for digital marketing tips'
    }
  ];

  const mockMyPages: Page[] = [
    {
      id: 'my-1',
      name: 'Startup Studio',
      followers: 3450,
      category: 'Business',
      verified: false,
      avatar: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100',
      pageType: 'business',
      isOwner: true,
      description: 'Helping startups grow and scale',
      posts: 45,
      engagement: 87
    }
  ];

  // Load page posts on component mount
  useEffect(() => {
    loadPagePosts();
  }, []);

  const loadPagePosts = async () => {
    setLoading(true);

    // Mock page posts data - in real app, this would come from API
    const mockPagePosts: PagePost[] = [
      {
        id: "page-post-1",
        author: {
          name: "National Geographic",
          username: "natgeo",
          avatar: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=100",
          verified: true
        },
        content: "Witness the breathtaking aurora borealis dancing across the Arctic sky. This rare phenomenon occurs when charged particles from the sun interact with Earth's magnetic field. 🌌✨",
        image: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=500",
        createdAt: "3 hours ago",
        likes: 1543,
        comments: 89,
        shares: 234,
        liked: true,
        pageId: "followed-1",
        pageName: "National Geographic",
        pageAvatar: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=100",
        pageVerified: true
      },
      {
        id: "page-post-2",
        author: {
          name: "NASA",
          username: "nasa",
          avatar: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=100",
          verified: true
        },
        content: "The James Webb Space Telescope has captured unprecedented images of distant galaxies, revealing secrets from the early universe. Each dot of light represents thousands of stars! 🚀🌌",
        image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=500",
        createdAt: "5 hours ago",
        likes: 2156,
        comments: 167,
        shares: 445,
        liked: false,
        pageId: "3",
        pageName: "NASA",
        pageAvatar: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=100",
        pageVerified: true
      },
      {
        id: "page-post-3",
        author: {
          name: "Gordon Ramsay",
          username: "gordonramsay",
          avatar: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100",
          verified: true
        },
        content: "Perfection is in the details! Today's signature dish: Pan-seared scallops with cauliflower purée and crispy pancetta. The secret? Don't touch the scallops while they're searing! 🔥🍽️",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500",
        createdAt: "7 hours ago",
        likes: 987,
        comments: 145,
        shares: 89,
        liked: true,
        pageId: "7",
        pageName: "Gordon Ramsay",
        pageAvatar: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100",
        pageVerified: true
      },
      {
        id: "page-post-4",
        author: {
          name: "Tesla",
          username: "tesla",
          avatar: "https://images.unsplash.com/photo-1617886903355-9354bb57751e?w=100",
          verified: true
        },
        content: "Supercharger network expansion continues! We've now installed over 50,000 Superchargers worldwide, making long-distance electric travel more accessible than ever. The future is electric! ⚡🚗",
        image: "https://images.unsplash.com/photo-1617886903355-9354bb57751e?w=500",
        createdAt: "1 day ago",
        likes: 3421,
        comments: 278,
        shares: 567,
        liked: false,
        pageId: "2",
        pageName: "Tesla",
        pageAvatar: "https://images.unsplash.com/photo-1617886903355-9354bb57751e?w=100",
        pageVerified: true
      }
    ];

    // Sort posts: prioritize followed pages first, then by engagement
    const followedPageIds = [...mockFollowedPages, ...followedPages].map(p => p.id);
    const sortedPosts = mockPagePosts.sort((a, b) => {
      const aIsFollowed = followedPageIds.includes(a.pageId);
      const bIsFollowed = followedPageIds.includes(b.pageId);

      if (aIsFollowed && !bIsFollowed) return -1;
      if (!aIsFollowed && bIsFollowed) return 1;

      // If both are followed or both are not followed, sort by engagement
      return (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares);
    });

    setPagePosts(sortedPosts);
    setLoading(false);
  };





  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Posts from Pages</h3>
          {pagePosts.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {pagePosts.length} posts
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            Showing posts from pages you follow first
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadPagePosts}
            disabled={loading}
            className="text-xs"
          >
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : pagePosts.length > 0 ? (
        <div className="space-y-4">
          {pagePosts.map((post) => (
            <div key={post.id} className="space-y-2">
              {/* Page context header */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground px-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={post.pageAvatar} alt={post.pageName} />
                    <AvatarFallback>{post.pageName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">Posted by</span>
                  <span className="sm:hidden">By</span>
                  <span className="font-semibold text-primary flex items-center gap-1 truncate max-w-[200px]">
                    {post.pageName}
                    {post.pageVerified && (
                      <Verified className="h-3 w-3 text-blue-500" fill="currentColor" />
                    )}
                  </span>
                </div>
                {[...mockFollowedPages, ...followedPages].some(p => p.id === post.pageId) && (
                  <Badge variant="secondary" className="text-xs">Following</Badge>
                )}
              </div>
              <EnhancedPostCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Building className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground mb-2">No page posts found</p>
          <p className="text-sm text-muted-foreground mb-4">
            Follow some pages to see posts from brands and organizations you're interested in
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '/pages'}
          >
            Browse Pages
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExplorePages;
