
import { useState, useRef } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image, Link, Smile, X, Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const EnhancedCreatePostCard = () => {
  const [content, setContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handlePost = () => {
    if (!content.trim() && !previewImage) {
      toast({
        title: "Post cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);
    
    // Simulate post creation
    setTimeout(() => {
      setIsPosting(false);
      setContent("");
      setPreviewImage(null);
      toast({
        title: "Post created!",
        description: "Your post has been published",
      });
    }, 1000);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Create a preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const removePreviewImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex space-x-3">
          <Avatar>
            <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "@user"} />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="What's on your mind?"
              className="resize-none border-0 focus-visible:ring-0 focus-visible:ring-transparent p-2 h-20"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            
            {previewImage && (
              <div className="relative mt-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full h-6 w-6 p-1"
                  onClick={removePreviewImage}
                >
                  <X className="h-4 w-4" />
                </Button>
                <img
                  src={previewImage}
                  alt="Preview"
                  className="rounded-md max-h-48 w-auto object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 flex justify-between">
        <div className="flex space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground" 
            onClick={handleFileUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <>Loading...</>
            ) : (
              <>
                <Image className="h-4 w-4 mr-2" />
                Image
              </>
            )}
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Camera className="h-4 w-4 mr-2" />
            Photo
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Link className="h-4 w-4 mr-2" />
            Link
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Smile className="h-4 w-4 mr-2" />
            Emoji
          </Button>
        </div>
        <Button 
          variant="default" 
          size="sm" 
          onClick={handlePost}
          disabled={isPosting || (!content.trim() && !previewImage)}
        >
          {isPosting ? "Posting..." : "Post"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EnhancedCreatePostCard;
