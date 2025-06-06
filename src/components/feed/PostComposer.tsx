
import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image, Video, Smile, MapPin, Users, X, Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface PostComposerProps {
  onSubmit: (content: string, mediaUrl?: string, mediaType?: 'image' | 'video') => void;
}

const PostComposer = ({ onSubmit }: PostComposerProps) => {
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handlePost = async () => {
    if (!content.trim() && !previewMedia) {
      toast({
        title: "Post cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);
    
    try {
      await onSubmit(content, previewMedia?.url, previewMedia?.type);
      setContent("");
      setPreviewMedia(null);
      toast({
        title: "Post created!",
        description: "Your post has been published successfully",
      });
    } catch (error) {
      toast({
        title: "Error posting",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const handleFileUpload = (type: 'image' | 'video') => {
    if (type === 'image') {
      fileInputRef.current?.click();
    } else {
      videoInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewMedia({
        url: e.target?.result as string,
        type
      });
    };
    reader.readAsDataURL(file);
  };

  const removePreviewMedia = () => {
    setPreviewMedia(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  return (
    <Card className="mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "@user"} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-4">
            <Textarea
              placeholder="What's on your mind?"
              className="resize-none border-0 focus-visible:ring-0 focus-visible:ring-transparent p-0 text-lg placeholder:text-gray-500 min-h-[60px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {previewMedia && (
              <div className="relative rounded-xl overflow-hidden bg-gray-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full h-8 w-8 p-1 z-10"
                  onClick={removePreviewMedia}
                >
                  <X className="h-4 w-4" />
                </Button>
                
                {previewMedia.type === 'image' ? (
                  <img
                    src={previewMedia.url}
                    alt="Preview"
                    className="w-full max-h-96 object-cover"
                  />
                ) : (
                  <video
                    src={previewMedia.url}
                    className="w-full max-h-96 object-cover"
                    controls
                  />
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'image')}
                />
                <input
                  type="file"
                  ref={videoInputRef}
                  className="hidden"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, 'video')}
                />
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:bg-blue-50 gap-2"
                  onClick={() => handleFileUpload('image')}
                >
                  <Image className="h-5 w-5" />
                  Photo
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-600 hover:bg-green-50 gap-2"
                  onClick={() => handleFileUpload('video')}
                >
                  <Video className="h-5 w-5" />
                  Video
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-orange-600 hover:bg-orange-50 gap-2"
                >
                  <Smile className="h-5 w-5" />
                  Feeling
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 gap-2"
                >
                  <MapPin className="h-5 w-5" />
                  Location
                </Button>
              </div>
              
              <Button
                onClick={handlePost}
                disabled={isPosting || (!content.trim() && !previewMedia)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-2 rounded-full font-semibold transition-all duration-200 transform hover:scale-105"
              >
                {isPosting ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostComposer;
