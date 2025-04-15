
import { useEffect, useState } from "react";
import { Post } from "@/components/feed/PostCard";
import CreatePostCard from "@/components/feed/CreatePostCard";
import EnhancedPostCard from "@/components/feed/EnhancedPostCard";
import { useNotification } from "@/hooks/use-notification";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockPosts: Post[] = [
  {
    id: "1",
    author: {
      name: "Andrew Miller",
      username: "andrew",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      verified: true,
    },
    content: "It's a record-breaking day for ION! The token has reached a new all-time high, shattering expectations and proving that innovation and resilience always win.",
    createdAt: "5m ago",
    likes: 12000,
    comments: 12,
    shares: 442,
  },
  {
    id: "2",
    author: {
      name: "Mark Poland",
      username: "markpoland",
      avatar: "https://randomuser.me/api/portraits/men/44.jpg",
      verified: true,
    },
    content: "✨ It's Official: Bitcoin Hits $100,000! 🚀\n\nToday marks a historic moment in the world of finance. Bitcoin, the first cryptocurrency, has officially crossed the $100,000 mark—a milestone that once seemed like a distant dream but has now become reality. 🌙✨",
    createdAt: "5m ago",
    likes: 8500,
    comments: 320,
    shares: 256,
  },
  {
    id: "3",
    author: {
      name: "Sarah Johnson",
      username: "sarahj",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      verified: true,
    },
    content: "Just launched my new NFT collection on Softchat marketplace! Check it out and let me know what you think. #NFT #DigitalArt",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop",
    createdAt: "2h ago",
    likes: 356,
    comments: 42,
    shares: 18,
  },
];

// Mock user stories
const stories = [
  { id: "1", username: "you", avatar: "https://randomuser.me/api/portraits/men/32.jpg", isUser: true },
  { id: "2", username: "mysteriox", avatar: "https://randomuser.me/api/portraits/men/43.jpg" },
  { id: "3", username: "foxxydude", avatar: "https://randomuser.me/api/portraits/men/62.jpg" },
  { id: "4", username: "mikeyduy", avatar: "https://randomuser.me/api/portraits/men/52.jpg" },
  { id: "5", username: "suppe", avatar: "https://randomuser.me/api/portraits/men/66.jpg" },
];

const EnhancedFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const notification = useNotification();

  useEffect(() => {
    // Simulate loading posts
    const timer = setTimeout(() => {
      setPosts(mockPosts);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCreatePost = (content: string, image?: string) => {
    // In a real app, we would call an API to create the post
    const newPost: Post = {
      id: `new-${Date.now()}`,
      author: {
        name: "John Doe",
        username: "johndoe",
        avatar: "/placeholder.svg",
        verified: true,
      },
      content,
      image,
      createdAt: "Just now",
      likes: 0,
      comments: 0,
      shares: 0,
    };

    setPosts([newPost, ...posts]);
    notification.success("Post created successfully");
  };

  return (
    <div className="container py-6 max-w-3xl mx-auto">
      {/* Header with search and notifications */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search" 
            className="pl-9 bg-gray-100 border-none rounded-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="h-6 w-6" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500">
              3
            </Badge>
          </div>
          <Avatar className="h-10 w-10 bg-purple-500">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      {/* Stories row */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-4 pb-2">
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center space-y-1 min-w-[70px]">
              <div className={`relative ${story.isUser ? 'bg-gray-100 p-1' : 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 p-[2px]'} rounded-2xl`}>
                <Avatar className={`h-16 w-16 ${story.isUser ? '' : 'border-2 border-white'}`}>
                  <AvatarImage src={story.avatar} />
                  <AvatarFallback>{story.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {story.isUser && (
                  <div className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs border-2 border-white">
                    +
                  </div>
                )}
              </div>
              <span className="text-xs">{story.username}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Create post and feed */}
      <div className="space-y-6">
        <CreatePostCard onSubmit={handleCreatePost} />
        
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
              <EnhancedPostCard key={post.id} post={post} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default EnhancedFeed;
