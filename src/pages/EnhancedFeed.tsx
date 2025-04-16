import { useEffect, useState } from "react";
import { Post } from "@/components/feed/PostCard";
import CreatePostCard from "@/components/feed/CreatePostCard";
import EnhancedPostCard from "@/components/feed/EnhancedPostCard";
import { useNotification } from "@/hooks/use-notification";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FooterNav from "@/components/layout/FooterNav";
import { useAuth } from "@/contexts/AuthContext";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostComment } from "@/types/user";

const mockComments: PostComment[] = [
  {
    id: "1",
    post_id: "1",
    user_id: "101",
    content: "This is amazing news! Can't wait to see how the token performs.",
    created_at: "2023-04-15T10:30:00Z",
    user: {
      name: "John Smith",
      username: "johnsmith",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      is_verified: false
    }
  },
  {
    id: "2",
    post_id: "1",
    user_id: "102",
    content: "I've been following this project for months. It's finally paying off!",
    created_at: "2023-04-15T11:15:00Z",
    user: {
      name: "Emma Wilson",
      username: "emmaw",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      is_verified: true
    }
  }
];

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
    id: "ad1",
    isAd: true,
    author: {
      name: "FitLife Pro",
      username: "fitlifepro",
      avatar: "https://randomuser.me/api/portraits/men/88.jpg",
      verified: true,
    },
    content: "Transform your body and mind with our new fitness app! Get personalized workouts, nutrition plans, and more. 🏋️‍♂️",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop",
    createdAt: "Sponsored",
    likes: 0,
    comments: 0,
    shares: 0,
    adUrl: "https://example.com/fitlife",
    adCta: "Download Now",
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

const stories = [
  { id: "1", username: "you", avatar: "https://randomuser.me/api/portraits/men/32.jpg", isUser: true },
  { id: "2", username: "mysteriox", avatar: "https://randomuser.me/api/portraits/men/43.jpg", hasNewStory: true },
  { id: "3", username: "foxxydude", avatar: "https://randomuser.me/api/portraits/men/62.jpg", hasNewStory: true },
  { id: "4", username: "mikeyduy", avatar: "https://randomuser.me/api/portraits/men/52.jpg", hasNewStory: true },
  { id: "5", username: "suppe", avatar: "https://randomuser.me/api/portraits/men/66.jpg" },
  { id: "6", username: "jane_doe", avatar: "https://randomuser.me/api/portraits/women/22.jpg", hasNewStory: true },
  { id: "7", username: "chris90", avatar: "https://randomuser.me/api/portraits/men/29.jpg" },
  { id: "8", username: "lisa", avatar: "https://randomuser.me/api/portraits/women/65.jpg", hasNewStory: true },
];

const EnhancedFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStory, setActiveStory] = useState<string | null>(null);
  const [postComments, setPostComments] = useState<Record<string, PostComment[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const notification = useNotification();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setPosts(mockPosts);
      
      const initialComments: Record<string, PostComment[]> = {};
      mockPosts.forEach(post => {
        initialComments[post.id] = post.id === "1" ? mockComments : [];
      });
      setPostComments(initialComments);
      
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCreatePost = (content: string, image?: string) => {
    const newPost: Post = {
      id: `new-${Date.now()}`,
      author: {
        name: user?.name || "John Doe",
        username: user?.profile?.username || "johndoe",
        avatar: user?.avatar || "/placeholder.svg",
        verified: !!user?.profile?.is_verified,
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

  const handleAddComment = (postId: string) => {
    const commentText = commentInputs[postId];
    if (!commentText || !commentText.trim()) return;

    const newComment: PostComment = {
      id: `new-${Date.now()}`,
      post_id: postId,
      user_id: user?.id || "current-user",
      content: commentText,
      created_at: new Date().toISOString(),
      user: {
        name: user?.name || "You",
        username: user?.profile?.username || "you",
        avatar: user?.avatar || "/placeholder.svg",
        is_verified: !!user?.profile?.is_verified
      }
    };

    setPostComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));

    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: post.comments + 1 }
        : post
    ));

    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
    
    notification.success("Comment added");
  };

  const handleViewStory = (storyId: string) => {
    setActiveStory(storyId);
    
    setTimeout(() => {
      setActiveStory(null);
    }, 5000);
  };

  const handleCreateStory = () => {
    notification.info("Story creation coming soon!");
  };

  return (
    <div className="max-w-full mx-auto px-4 py-6 pb-20 md:pb-6 md:max-w-3xl">
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-4 pb-2">
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center space-y-1 min-w-[70px]">
              <div 
                className={`relative ${
                  story.isUser 
                    ? 'bg-gray-100 p-1' 
                    : story.hasNewStory 
                      ? 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 p-[2px]' 
                      : 'bg-gray-200 p-[2px]'
                } rounded-full cursor-pointer`}
                onClick={() => story.isUser ? handleCreateStory() : handleViewStory(story.id)}
              >
                <Avatar className={`h-16 w-16 ${story.isUser ? '' : 'border-2 border-white'}`}>
                  <AvatarImage src={story.avatar} />
                  <AvatarFallback>{story.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {story.isUser && (
                  <div className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs border-2 border-white">
                    <PlusCircle className="h-4 w-4" />
                  </div>
                )}
              </div>
              <span className="text-xs">{story.username}</span>
            </div>
          ))}
        </div>
      </div>
      
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={() => setActiveStory(null)}>
          <div className="relative w-full max-w-md h-[80vh]">
            <div className="absolute top-0 inset-x-0 flex p-4">
              <div className="flex-1 flex gap-1">
                {stories.filter(s => !s.isUser).map((story, idx) => (
                  <div 
                    key={story.id} 
                    className={`h-1 flex-1 rounded-full ${story.id === activeStory ? 'bg-white' : 'bg-gray-500'}`}
                  />
                ))}
              </div>
            </div>
            
            <div className="absolute top-4 right-4">
              <Button variant="ghost" size="icon" className="text-white" onClick={() => setActiveStory(null)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </Button>
            </div>
            
            <div className="h-full flex items-center justify-center">
              <img 
                src={stories.find(s => s.id === activeStory)?.avatar} 
                alt="Story" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarImage src={stories.find(s => s.id === activeStory)?.avatar} alt="Story user" />
                  <AvatarFallback>
                    {stories.find(s => s.id === activeStory)?.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-white">
                  <p className="font-medium">{stories.find(s => s.id === activeStory)?.username}</p>
                  <p className="text-xs opacity-80">Just now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        <CreatePostCard onSubmit={handleCreatePost} />
        
        {isLoading ? (
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
              <div key={post.id} className="space-y-2">
                <EnhancedPostCard post={post} />
                
                <div className="px-4 pb-2">
                  {postComments[post.id] && postComments[post.id].length > 0 && (
                    <div className="py-2 space-y-3">
                      {postComments[post.id].map(comment => (
                        <div key={comment.id} className="flex items-start gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                            <AvatarFallback>{comment.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="bg-muted rounded-2xl px-3 py-2 flex-1">
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-sm">{comment.user.name}</span>
                              {comment.user.is_verified && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 pt-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                      <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="w-full rounded-full bg-muted px-4 py-2 text-sm"
                        value={commentInputs[post.id] || ""}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      />
                      {(commentInputs[post.id] || "").length > 0 && (
                        <button
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500"
                          onClick={() => handleAddComment(post.id)}
                        >
                          Post
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      
      <FooterNav />
    </div>
  );
};

export default EnhancedFeed;
