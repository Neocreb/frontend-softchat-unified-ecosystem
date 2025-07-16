import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image, Link, Smile } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ActivityRewardService } from "@/services/activityRewardService";

interface CreatePostCardProps {
  onSubmit: (content: string, image?: string) => void;
}

const CreatePostCard = ({ onSubmit }: CreatePostCardProps) => {
  const [content, setContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handlePost = () => {
    if (!content.trim()) {
      toast({
        title: "Post cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);

    // Call the onSubmit prop
    onSubmit(content);

    // Reset state
    setIsPosting(false);
    setContent("");

    toast({
      title: "Post created!",
      description: "Your post has been published",
    });
  };

  const handleFileUpload = () => {
    setIsUploading(true);

    // Simulate file upload
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Image uploaded",
        description: "Your image has been attached to your post",
      });
    }, 1500);
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex space-x-3">
          <Avatar>
            <AvatarImage
              src={user?.avatar || "/placeholder.svg"}
              alt={user?.name || "@user"}
            />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="What's on your mind?"
              className="resize-none border-0 focus-visible:ring-0 focus-visible:ring-transparent p-2 h-20"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 flex justify-between">
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={handleFileUpload}
            disabled={isUploading}
          >
            <Image className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : "Image"}
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
          disabled={isPosting || !content.trim()}
        >
          {isPosting ? "Posting..." : "Post"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreatePostCard;
