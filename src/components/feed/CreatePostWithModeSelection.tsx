import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Image as ImageIcon,
  MessageSquare,
  List,
  Settings,
  Info,
  Smile,
  MapPin,
  Users,
  Globe,
  Lock,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useHybridFeed } from "@/contexts/HybridFeedContext";
import { useToast } from "@/components/ui/use-toast";
import { ActivityRewardService } from "@/services/activityRewardService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CreatePostWithModeSelectionProps {
  isOpen: boolean;
  onClose: () => void;
}

type PostMode = 'classic' | 'threaded' | 'both';
type PrivacyType = 'public' | 'friends' | 'private';

const CreatePostWithModeSelection: React.FC<CreatePostWithModeSelectionProps> = ({
  isOpen,
  onClose,
}) => {
  const [content, setContent] = useState("");
  const [selectedMode, setSelectedMode] = useState<PostMode>('both');
  const [privacy, setPrivacy] = useState<PrivacyType>('public');
  const [enableComments, setEnableComments] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  const { user } = useAuth();
  const { viewMode, addPost } = useHybridFeed();
  const { toast } = useToast();

  const handlePost = async () => {
    if (!content.trim()) {
      toast({
        title: "Post cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);

    try {
      const postId = `post_${Date.now()}`;
      
      // Create post with mode-specific properties
      const newPost = {
        content: content.trim(),
        author: {
          name: user?.name || 'User',
          username: user?.username || 'user',
          avatar: user?.avatar || '/placeholder.svg',
          verified: user?.verified || false,
        },
        likes: 0,
        comments: 0,
        shares: 0,
        gifts: 0,
        type: 'post' as const,
        isReply: false,
        privacy,
        // Mode-specific properties based on selection
        ...(selectedMode === 'threaded' && {
          threadId: postId,
          isThreadPost: true,
          parentId: null, // Root post for threaded mode
        }),
        ...(selectedMode === 'classic' && {
          isClassicPost: true,
          parentId: undefined, // Classic mode post
        }),
        ...(selectedMode === 'both' && {
          threadId: postId,
          isUniversalPost: true, // Shows in both modes
          parentId: null,
        }),
        // Additional metadata
        settings: {
          enableComments,
          preferredMode: selectedMode,
          publishedFromMode: viewMode,
        },
      };

      // Add post to feed
      addPost(newPost);

      // Track reward for creating a post
      if (user?.id) {
        try {
          const reward = await ActivityRewardService.logPostCreated(
            user.id,
            postId,
            {
              contentLength: content.length,
              hasImage: false,
              hasLink: content.includes("http"),
              publishMode: selectedMode,
              privacy: privacy,
            },
          );

          if (reward.success && reward.softPoints > 0) {
            toast({
              title: "Post published!",
              description: `Published to ${selectedMode === 'both' ? 'all modes' : selectedMode + ' mode'} and earned ${reward.softPoints} SoftPoints!`,
            });
          } else {
            toast({
              title: "Post published!",
              description: `Published to ${selectedMode === 'both' ? 'all modes' : selectedMode + ' mode'}`,
            });
          }
        } catch (error) {
          console.error("Failed to log post creation:", error);
          toast({
            title: "Post published!",
            description: `Published to ${selectedMode === 'both' ? 'all modes' : selectedMode + ' mode'}`,
          });
        }
      }

      // Reset form
      setContent("");
      setSelectedMode('both');
      setPrivacy('public');
      setEnableComments(true);
      onClose();
    } catch (error) {
      console.error("Failed to create post:", error);
      toast({
        title: "Failed to publish post",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const getModeDescription = (mode: PostMode) => {
    switch (mode) {
      case 'classic':
        return "Post will appear in Classic feed with traditional layout and nested comments";
      case 'threaded':
        return "Post will appear in Threaded feed as a conversation starter with reply posts";
      case 'both':
        return "Post will appear in both Classic and Threaded feeds (Recommended)";
    }
  };

  const getModeIcon = (mode: PostMode) => {
    switch (mode) {
      case 'classic':
        return <List className="h-4 w-4" />;
      case 'threaded':
        return <MessageSquare className="h-4 w-4" />;
      case 'both':
        return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Create Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Author Info */}
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user?.name || 'User'}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Publishing from</span>
                <Badge variant="outline" className="text-xs">
                  {getModeIcon(viewMode as PostMode)}
                  {viewMode === 'classic' ? 'Classic' : 'Threaded'} Mode
                </Badge>
              </div>
            </div>
          </div>

          {/* Content Input */}
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="resize-none"
          />

          {/* Publishing Mode Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <Label className="text-sm font-medium">Publishing Mode</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Choose where your post will appear in the feed</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Select value={selectedMode} onValueChange={(value: PostMode) => setSelectedMode(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="both">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Both Modes</span>
                    <Badge className="ml-auto text-xs">Recommended</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="classic">
                  <div className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    <span>Classic Mode Only</span>
                  </div>
                </SelectItem>
                <SelectItem value="threaded">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Threaded Mode Only</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <p className="text-xs text-muted-foreground">
              {getModeDescription(selectedMode)}
            </p>
          </div>

          <Separator />

          {/* Privacy & Settings */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Privacy & Settings</Label>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Audience</Label>
                <Select value={privacy} onValueChange={(value: PrivacyType) => setPrivacy(value)}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Globe className="h-3 w-3" />
                        <span>Public</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="friends">
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        <span>Friends</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center gap-2">
                        <Lock className="h-3 w-3" />
                        <span>Private</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Comments</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="comments"
                    checked={enableComments}
                    onCheckedChange={setEnableComments}
                  />
                  <Label htmlFor="comments" className="text-xs">
                    {enableComments ? 'Enabled' : 'Disabled'}
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <ImageIcon className="h-4 w-4 mr-2" />
                Photo
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Smile className="h-4 w-4 mr-2" />
                Emoji
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                Location
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handlePost}
                disabled={isPosting || !content.trim()}
              >
                {isPosting ? "Publishing..." : "Publish"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostWithModeSelection;
