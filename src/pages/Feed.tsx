
import { useEffect, useState } from "react";
import { Post, default as PostCard } from "@/components/feed/PostCard";
import CreatePostCard from "@/components/feed/CreatePostCard";
import FeedSidebar from "@/components/feed/FeedSidebar";

const mockPosts: Post[] = [
  {
    id: "1",
    author: {
      name: "John Doe",
      username: "johndoe",
      avatar: "/placeholder.svg",
      verified: true,
    },
    content: "Just made my first crypto trade on Softchat! The platform makes it so easy to get started with cryptocurrency trading. #crypto #softchat",
    createdAt: "10 minutes ago",
    likes: 24,
    comments: 3,
    shares: 1,
  },
  {
    id: "2",
    author: {
      name: "Sarah Johnson",
      username: "sarahj",
      avatar: "/placeholder.svg",
      verified: true,
    },
    content: "Check out this amazing product I just purchased from the Softchat marketplace! Great quality and fast shipping.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
    createdAt: "2 hours ago",
    likes: 142,
    comments: 12,
    shares: 5,
  },
  {
    id: "3",
    author: {
      name: "Alex Rivera",
      username: "alexr",
      avatar: "/placeholder.svg",
    },
    content: "Just reached Silver level in the rewards program! The points add up quickly when you're active on the platform. Has anyone redeemed their points yet? What did you get?",
    createdAt: "5 hours ago",
    likes: 56,
    comments: 8,
    shares: 2,
    liked: true,
  },
];

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading posts
    const timer = setTimeout(() => {
      setPosts(mockPosts);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CreatePostCard />
          
          {isLoading ? (
            // Loading skeleton
            <>
              {[1, 2, 3].map((index) => (
                <div key={index} className="space-y-4 bg-card rounded-lg border p-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                      <div className="h-3 w-24 bg-muted rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                    <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                    <div className="h-4 w-2/3 bg-muted rounded animate-pulse"></div>
                  </div>
                  <div className="h-40 bg-muted rounded animate-pulse"></div>
                </div>
              ))}
            </>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </>
          )}
        </div>
        
        <div className="hidden lg:block">
          <FeedSidebar />
        </div>
      </div>
    </div>
  );
};

export default Feed;
