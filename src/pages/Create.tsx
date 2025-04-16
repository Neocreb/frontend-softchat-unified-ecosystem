
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Video, UserPlus, Lock, Globe, Users } from "lucide-react";
import { useNotification } from "@/hooks/use-notification";
import FooterNav from "@/components/layout/FooterNav";

const Create = () => {
  const { user } = useAuth();
  const notify = useNotification();
  const [postContent, setPostContent] = useState("");
  const [privacy, setPrivacy] = useState<"public" | "friends" | "private">("public");
  const [selectedTab, setSelectedTab] = useState("post");
  const [isPosting, setIsPosting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handlePostSubmit = () => {
    if (!postContent.trim() && !selectedFile) return;
    
    setIsPosting(true);
    
    // Simulate API call
    setTimeout(() => {
      notify.success("Post created successfully!");
      setPostContent("");
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsPosting(false);
    }, 1500);
  };
  
  const handlePrivacyChange = (value: "public" | "friends" | "private") => {
    setPrivacy(value);
  };

  return (
    <div className="container pb-16 md:pb-0 pt-4">
      <h1 className="text-2xl font-bold mb-4">Create</h1>
      
      <Tabs defaultValue="post" value={selectedTab} onValueChange={setSelectedTab}>
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
        
        <TabsContent value="post" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <p className="font-medium">{user?.name || "User"}</p>
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 text-xs flex items-center gap-1"
                    onClick={() => {
                      const privacyOptions = ["public", "friends", "private"];
                      const currentIndex = privacyOptions.indexOf(privacy);
                      const nextIndex = (currentIndex + 1) % privacyOptions.length;
                      handlePrivacyChange(privacyOptions[nextIndex] as "public" | "friends" | "private");
                    }}
                  >
                    {privacy === "public" && <Globe className="h-3 w-3" />}
                    {privacy === "friends" && <Users className="h-3 w-3" />}
                    {privacy === "private" && <Lock className="h-3 w-3" />}
                    <span>
                      {privacy === "public" && "Public"}
                      {privacy === "friends" && "Friends"}
                      {privacy === "private" && "Only me"}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
            
            <Textarea
              placeholder="What's on your mind?"
              className="min-h-[120px] resize-none"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            
            {previewUrl && (
              <div className="relative">
                <img src={previewUrl} alt="Preview" className="w-full rounded-lg max-h-80 object-cover" />
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
            
            <div className="flex items-center justify-between">
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
                  onClick={() => {
                    notify.info("Tag a friend feature coming soon!");
                  }}
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
          </div>
        </TabsContent>
        
        <TabsContent value="video" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <p className="font-medium">{user?.name || "User"}</p>
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 text-xs flex items-center gap-1"
                    onClick={() => {
                      const privacyOptions = ["public", "friends", "private"];
                      const currentIndex = privacyOptions.indexOf(privacy);
                      const nextIndex = (currentIndex + 1) % privacyOptions.length;
                      handlePrivacyChange(privacyOptions[nextIndex] as "public" | "friends" | "private");
                    }}
                  >
                    {privacy === "public" && <Globe className="h-3 w-3" />}
                    {privacy === "friends" && <Users className="h-3 w-3" />}
                    {privacy === "private" && <Lock className="h-3 w-3" />}
                    <span>
                      {privacy === "public" && "Public"}
                      {privacy === "friends" && "Friends"}
                      {privacy === "private" && "Only me"}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
            
            <Textarea
              placeholder="Add a description for your video..."
              className="min-h-[80px] resize-none"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            
            {!previewUrl && (
              <div 
                className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                onClick={() => document.getElementById("video-upload")?.click()}
              >
                <Video className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-center">Click to upload a video</p>
                <p className="text-xs text-muted-foreground mt-1">MP4 or WebM format</p>
              </div>
            )}
            
            {previewUrl && (
              <div className="relative">
                <video 
                  src={previewUrl} 
                  controls
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
            
            <input 
              id="video-upload" 
              type="file" 
              accept="video/*" 
              className="hidden" 
              onChange={handleFileChange} 
            />
            
            <div className="flex justify-end">
              <Button 
                onClick={handlePostSubmit} 
                disabled={isPosting || !selectedFile}
              >
                {isPosting ? "Uploading..." : "Upload Video"}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <FooterNav />
    </div>
  );
};

export default Create;
