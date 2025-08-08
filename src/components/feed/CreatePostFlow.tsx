import React, { useState, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  X, 
  ArrowLeft, 
  Image as ImageIcon, 
  Video, 
  Music, 
  MapPin, 
  UserPlus, 
  Smile,
  Globe,
  Users,
  Lock,
  Clock,
  DollarSign,
  Megaphone,
  TestTube,
  BookOpen
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useFeed } from "@/contexts/FeedContext";

interface CreatePostFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

type PostStep = "create" | "settings";

const CreatePostFlow: React.FC<CreatePostFlowProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<PostStep>("create");
  const [content, setContent] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [feeling, setFeeling] = useState("");
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);
  
  // Settings
  const [audience, setAudience] = useState("public");
  const [shareToStory, setShareToStory] = useState(false);
  const [enableComments, setEnableComments] = useState(true);
  const [enableBoost, setEnableBoost] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { addPost } = useFeed();

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedMedia(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (currentStep === "create") {
      setCurrentStep("settings");
    }
  };

  const handleBack = () => {
    if (currentStep === "settings") {
      setCurrentStep("create");
    }
  };

  const handlePost = () => {
    const newPost = {
      id: `post-${Date.now()}`,
      type: "post" as const,
      timestamp: new Date(),
      priority: 8,
      author: {
        id: user?.id || "current-user",
        name: user?.name || "You",
        username: user?.username || "user",
        avatar: user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
        verified: user?.verified || false,
        badges: user?.badges || [],
      },
      content: {
        text: content,
        media: mediaPreview ? [{
          type: selectedMedia?.type.startsWith('video') ? 'video' : 'image',
          url: mediaPreview,
          alt: "User uploaded media",
        }] : [],
        location: location || undefined,
        feeling: feeling || undefined,
        taggedUsers: taggedUsers,
      },
      interactions: {
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0,
      },
      userInteracted: {
        liked: false,
        commented: false,
        shared: false,
        saved: false,
      },
    };

    addPost(newPost);
    
    toast({
      title: "Post published!",
      description: "Your post has been shared with your audience.",
    });

    // Reset and close
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep("create");
    setContent("");
    setSelectedMedia(null);
    setMediaPreview(null);
    setLocation("");
    setFeeling("");
    setTaggedUsers([]);
    setShareToStory(false);
    setEnableBoost(false);
    onClose();
  };

  const canProceed = content.trim() || mediaPreview;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg w-full h-[90vh] p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            {currentStep === "settings" && (
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h2 className="text-lg font-semibold">
              {currentStep === "create" ? "Create post" : "Post settings"}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            {currentStep === "create" && (
              <Button 
                onClick={handleNext} 
                disabled={!canProceed}
                size="sm"
              >
                Next
              </Button>
            )}
            {currentStep === "settings" && (
              <Button onClick={handlePost} size="sm">
                Post
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {currentStep === "create" && (
            <div className="p-4 space-y-4">
              {/* User info */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <div className="flex items-center gap-1 text-sm text-blue-600">
                    <Globe className="h-3 w-3" />
                    <span>Public</span>
                  </div>
                </div>
              </div>

              {/* Text input */}
              <Textarea
                placeholder="Say something about this photo..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px] border-0 resize-none text-lg placeholder:text-gray-400 focus-visible:ring-0"
              />

              {/* Media preview */}
              {mediaPreview && (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full z-10"
                    onClick={() => {
                      setMediaPreview(null);
                      setSelectedMedia(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {selectedMedia?.type.startsWith('video') ? (
                    <video
                      src={mediaPreview}
                      className="w-full max-h-96 rounded-lg object-cover"
                      controls
                    />
                  ) : (
                    <img
                      src={mediaPreview}
                      alt="Preview"
                      className="w-full max-h-96 rounded-lg object-cover"
                    />
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="grid grid-cols-3 gap-3 pt-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={handleMediaSelect}
                />
                
                <Button
                  variant="outline"
                  className="h-16 flex-col gap-1"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-6 w-6 text-green-500" />
                  <span className="text-xs">Photo</span>
                </Button>
                
                <Button variant="outline" className="h-16 flex-col gap-1">
                  <Video className="h-6 w-6 text-red-500" />
                  <span className="text-xs">Video</span>
                </Button>
                
                <Button variant="outline" className="h-16 flex-col gap-1">
                  <Music className="h-6 w-6 text-purple-500" />
                  <span className="text-xs">Music</span>
                </Button>
              </div>

              {/* Quick options */}
              <div className="space-y-3 pt-4">
                <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                  <UserPlus className="h-5 w-5 text-blue-500" />
                  <span>Tag people</span>
                </Button>
                
                <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                  <Smile className="h-5 w-5 text-yellow-500" />
                  <span>Feeling/activity</span>
                </Button>
                
                <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                  <MapPin className="h-5 w-5 text-red-500" />
                  <span>Check in</span>
                </Button>
              </div>
            </div>
          )}

          {currentStep === "settings" && (
            <div className="space-y-1">
              {/* Post preview */}
              <div className="p-4 border-b">
                <h3 className="font-semibold mb-3">Post preview</h3>
                {mediaPreview && (
                  <div className="mb-3">
                    {selectedMedia?.type.startsWith('video') ? (
                      <video
                        src={mediaPreview}
                        className="w-32 h-32 rounded-lg object-cover"
                        muted
                      />
                    ) : (
                      <img
                        src={mediaPreview}
                        alt="Preview"
                        className="w-32 h-32 rounded-lg object-cover"
                      />
                    )}
                  </div>
                )}
                {content && (
                  <p className="text-sm text-gray-600 line-clamp-3">{content}</p>
                )}
              </div>

              {/* Settings options */}
              <div className="space-y-1">
                <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Post audience</p>
                      <p className="text-sm text-gray-500">Public</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4 rotate-45" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Scheduling options</p>
                      <p className="text-sm text-blue-600">Publish now</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4 rotate-45" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Share to your story</p>
                    </div>
                  </div>
                  <Switch checked={shareToStory} onCheckedChange={setShareToStory} />
                </div>

                <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Monetization</p>
                      <p className="text-sm text-blue-600">Earn money on your content</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4 rotate-45" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Megaphone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Boost post</p>
                      <p className="text-sm text-gray-500">
                        You'll choose settings after you click Post. You can only boost public posts.
                      </p>
                    </div>
                  </div>
                  <Switch checked={enableBoost} onCheckedChange={setEnableBoost} />
                </div>

                <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <UserPlus className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Collaborator</p>
                      <p className="text-sm text-gray-500">Share credit for your post with a collaborator.</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4 rotate-45" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <TestTube className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">A/B tests</p>
                      <p className="text-sm text-gray-500">Off</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4 rotate-45" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostFlow;
