import { useState, useEffect, useCallback, useRef } from "react";
import CreatePostCard from "@/components/feed/CreatePostCard";
import EnhancedPostCard from "@/components/feed/EnhancedPostCard";
import FooterNav from "@/components/layout/FooterNav";
import { useNotification } from "@/hooks/use-notification";
import Stories, { Story } from "@/components/feed/Stories";
import StoryView from "@/components/feed/StoryView";
import CommentSection from "@/components/feed/CommentSection";
import FeedSkeleton from "@/components/feed/FeedSkeleton";
import { useFeed } from "@/hooks/use-feed";
import { mockStories } from "@/data/mockFeedData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, UserPlus, Video } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const EnhancedFeed = () => {
  const [activeStory, setActiveStory] = useState<string | null>(null);
  const {
    posts,
    isLoading,
    postComments,
    handleCreatePost,
    handleAddComment,
    loadMorePosts,
    hasMore
  } = useFeed();
  const notification = useNotification();
  const { user } = useAuth();
  const [postContent, setPostContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasMore && !isLoading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, isLoading, loadMorePosts]);

  const handleViewStory = (storyId: string) => {
    setActiveStory(storyId);
    setTimeout(() => {
      setActiveStory(null);
    }, 5000);
  };

  const handleCreateStory = () => {
    notification.info("Story creation coming soon!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostSubmit = async () => {
    if (!postContent.trim() && !selectedFile) return;

    setIsPosting(true);
    try {
      await handleCreatePost(postContent, previewUrl || undefined);
      setPostContent("");
      setSelectedFile(null);
      setPreviewUrl(null);
      notification.success("Post created successfully");
    } catch (error) {
      notification.error("Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  const handleVideoUpload = () => {
    notification.info("Video upload coming soon!");
  };

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-2xl mx-auto px-4 py-6 pb-20 md:pb-6">
        <Stories
          stories={mockStories}
          onViewStory={handleViewStory}
          onCreateStory={handleCreateStory}
        />

        {activeStory && (
          <StoryView
            activeStory={activeStory}
            stories={mockStories}
            onClose={() => setActiveStory(null)}
          />
        )}

        {/* Create Post Box with Tabs */}
        <div className="bg-background rounded-lg shadow mb-6 overflow-hidden">
          <Tabs defaultValue="post" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="post" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                <span>Post</span>
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                <span>Video</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="post" className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                  <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <Textarea
                  placeholder="What's on your mind?"
                  className="flex-1 resize-none"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
              </div>

              {previewUrl && (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full rounded-lg max-h-80 object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 rounded-full"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                  >
                    &times;
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-muted-foreground"
                    onClick={() => document.getElementById("image-upload")?.click()}
                  >
                    <Image className="h-5 w-5" />
                    <span>Photo</span>
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-muted-foreground"
                    onClick={() => notification.info("Tag a friend feature coming soon!")}
                  >
                    <UserPlus className="h-5 w-5" />
                    <span>Tag</span>
                  </Button>
                </div>

                <Button
                  onClick={handlePostSubmit}
                  disabled={isPosting || (!postContent.trim() && !selectedFile)}
                >
                  {isPosting ? "Posting..." : "Post"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="video" className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                  <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <Textarea
                  placeholder="Add a description for your video..."
                  className="flex-1 resize-none"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
              </div>

              <div
                className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                onClick={handleVideoUpload}
              >
                <Video className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-center">Click to upload a video</p>
                <p className="text-xs text-muted-foreground mt-1">MP4 or WebM format</p>
              </div>

              <div className="flex justify-end mt-4">
                <Button onClick={handleVideoUpload}>Upload Video</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          {isLoading && posts.length === 0 ? (
            <FeedSkeleton />
          ) : (
            <>
              {posts.map((post) => (
                <div key={post.id} className="space-y-2">
                  <EnhancedPostCard post={post} />
                  <CommentSection
                    postId={post.id}
                    comments={postComments[post.id] || []}
                    onAddComment={handleAddComment}
                  />
                </div>
              ))}

              {/* Infinite scroll loader */}
              <div ref={loaderRef} className="flex justify-center py-4">
                {isLoading && posts.length > 0 ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                ) : hasMore ? (
                  <p className="text-muted-foreground text-sm">Scroll to load more</p>
                ) : (
                  <p className="text-muted-foreground text-sm">No more posts to load</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedFeed;