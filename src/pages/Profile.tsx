
import ProfileHeader from "@/components/profile/ProfileHeader";
import { Post, default as PostCard } from "@/components/feed/PostCard";
import { useEffect, useState } from "react";

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
      name: "John Doe",
      username: "johndoe",
      avatar: "/placeholder.svg",
      verified: true,
    },
    content: "Working on a new project using React and TypeScript. Loving the developer experience so far!",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
    createdAt: "2 days ago",
    likes: 68,
    comments: 5,
    shares: 2,
  },
  {
    id: "3",
    author: {
      name: "John Doe",
      username: "johndoe",
      avatar: "/placeholder.svg",
      verified: true,
    },
    content: "Beautiful day for a hike! 🏞️ #outdoors #nature",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop",
    createdAt: "1 week ago",
    likes: 142,
    comments: 12,
    shares: 5,
    liked: true,
  },
];

const Profile = () => {
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
      <ProfileHeader />
      
      <div className="mt-6 space-y-6">
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
    </div>
  );
};

export default Profile;
