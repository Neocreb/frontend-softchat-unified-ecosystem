import { useState, useRef } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Image, 
  Link, 
  Smile, 
  X, 
  Camera, 
  MapPin, 
  Heart,
  Film,
  Mic,
  Settings,
  Globe,
  MessageSquare,
  Users,
  Store,
  Briefcase,
  Calendar,
  Video,
  Play,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useFeed } from "@/contexts/FeedContext";
import { useEnhancedFeed } from "@/contexts/EnhancedFeedContext";
import { ActivityRewardService } from "@/services/activityRewardService";
import { useNotification } from "@/hooks/use-notification";

// Available feelings
const feelings = [
  { id: "happy", emoji: "😊", label: "happy" },
  { id: "excited", emoji: "🤩", label: "excited" },
  { id: "grateful", emoji: "🙏", label: "grateful" },
  { id: "blessed", emoji: "✨", label: "blessed" },
  { id: "love", emoji: "❤️", label: "in love" },
  { id: "sad", emoji: "😢", label: "sad" },
  { id: "angry", emoji: "😠", label: "angry" },
  { id: "tired", emoji: "😴", label: "tired" },
  { id: "motivated", emoji: "💪", label: "motivated" },
  { id: "peaceful", emoji: "😌", label: "peaceful" },
  { id: "confused", emoji: "🤔", label: "confused" },
  { id: "proud", emoji: "🥳", label: "proud" },
];

// Common emojis
const commonEmojis = [
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
  "🙂", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "🤗",
  "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥",
  "😮", "🤐", "😯", "😪", "😫", "🥱", "😴", "😌", "😛", "😜",
];

// Content types
const contentTypes = [
  { id: "post", label: "Regular Post", icon: MessageSquare },
  { id: "product", label: "Product", icon: Store },
  { id: "job", label: "Job Posting", icon: Briefcase },
  { id: "event", label: "Event", icon: Calendar },
  { id: "service", label: "Service", icon: Users },
  { id: "video", label: "Video", icon: Video },
  { id: "livestream", label: "Live Stream", icon: Play },
];

type PublishDestination = 'classic' | 'threaded' | 'both';
type ContentType = 'post' | 'product' | 'job' | 'event' | 'service' | 'video' | 'livestream';

interface EnhancedCreatePostWithDestinationProps {
  defaultDestination?: PublishDestination;
  onPostCreated?: (post: any) => void;
}

const EnhancedCreatePostWithDestination: React.FC<EnhancedCreatePostWithDestinationProps> = ({ 
  defaultDestination = 'both',
  onPostCreated 
}) => {
  const [content, setContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFeeling, setSelectedFeeling] = useState<any>(null);
  const [location, setLocation] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFeelingPicker, setShowFeelingPicker] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showPublishSettings, setShowPublishSettings] = useState(false);
  const [publishDestination, setPublishDestination] = useState<PublishDestination>(defaultDestination);
  const [contentType, setContentType] = useState<ContentType>('post');
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [eventDate, setEventDate] = useState("");
  const [jobType, setJobType] = useState("freelance");
  const [skills, setSkills] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { addPost: addClassicPost } = useFeed();
  const { addPost: addThreadedPost } = useEnhancedFeed();
  const notification = useNotification();

  const handlePost = async () => {
    if (!content.trim() && !previewImage && !linkUrl) {
      toast({
        title: "Post cannot be empty",
        description: "Please add some content, an image, or a link.",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);

    // Create new post object with enhanced data
    const newPost = {
      id: `post-${Date.now()}`,
      type: "post",
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
      content: content,
      image: previewImage,
      location: location || undefined,
      feeling: selectedFeeling ? `feeling ${selectedFeeling.label} ${selectedFeeling.emoji}` : undefined,
      link: linkUrl || undefined,
      contentType,
      price: price ? parseFloat(price) : undefined,
      currency: currency || 'USD',
      eventDate: eventDate || undefined,
      jobType: jobType || undefined,
      skills: skills ? skills.split(',').map(s => s.trim()) : undefined,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      gifts: 0,
      liked: false,
      bookmarked: false,
      gifted: false,
      isReply: false,
      threadId: undefined,
      parentId: undefined,
      depth: 0,
    };

    // Create threaded version for enhanced feed
    const threadedPost = {
      id: newPost.id,
      content: newPost.content,
      author: {
        name: newPost.author.name,
        username: newPost.author.username,
        avatar: newPost.author.avatar,
        verified: newPost.author.verified,
      },
      image: newPost.image,
      location: newPost.location,
      createdAt: 'now',
      likes: 0,
      comments: 0,
      shares: 0,
      gifts: 0,
      liked: false,
      bookmarked: false,
      gifted: false,
      isReply: false,
      type: 'post' as const,
      contentType,
      price: newPost.price,
      currency: newPost.currency,
      eventDate: newPost.eventDate,
      jobType: newPost.jobType,
      skills: newPost.skills,
    };

    // Simulate post creation
    setTimeout(async () => {
      setIsPosting(false);

      // Add post to selected destination(s)
      try {
        if (publishDestination === 'classic' || publishDestination === 'both') {
          addClassicPost(newPost);
        }
        
        if (publishDestination === 'threaded' || publishDestination === 'both') {
          addThreadedPost(threadedPost);
        }

        // Track reward for post creation
        if (user?.id) {
          try {
            const reward = await ActivityRewardService.logPostCreated(
              user.id,
              newPost.id,
              {
                contentType,
                hasImage: !!previewImage,
                hasLocation: !!location,
                hasLink: !!linkUrl,
                contentLength: content.length,
                publishDestination,
              }
            );
            if (reward.success && reward.softPoints > 0) {
              notification.success(`+${reward.softPoints} SoftPoints earned for posting!`);
            }
          } catch (error) {
            console.error("Failed to log post creation:", error);
          }
        }

        // Reset form
        setContent("");
        setPreviewImage(null);
        setSelectedFeeling(null);
        setLocation("");
        setLinkUrl("");
        setShowLinkInput(false);
        setContentType('post');
        setPrice("");
        setEventDate("");
        setSkills("");

        // Notify parent component
        if (onPostCreated) {
          onPostCreated(newPost);
        }

        const destinationText = 
          publishDestination === 'both' ? 'Classic and Thread modes' :
          publishDestination === 'classic' ? 'Classic mode' : 'Thread mode';

        toast({
          title: "Post created!",
          description: `Your ${contentType} has been published to ${destinationText}.`,
        });
      } catch (error) {
        console.error("Failed to create post:", error);
        toast({
          title: "Failed to create post",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  const handleFileUpload = (type: 'image' | 'video' | 'audio') => {
    if (type === 'image') {
      fileInputRef.current?.click();
    } else if (type === 'video') {
      videoInputRef.current?.click();
    } else if (type === 'audio') {
      audioInputRef.current?.click();
    }
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

  const addEmoji = (emoji: string) => {
    const cursorPosition = content.length;
    const newContent = content.slice(0, cursorPosition) + emoji + content.slice(cursorPosition);
    setContent(newContent);
  };

  const getContentTypeIcon = (type: ContentType) => {
    const contentTypeData = contentTypes.find(ct => ct.id === type);
    return contentTypeData?.icon || MessageSquare;
  };

  return (
    <Card className="mb-4 sm:mb-6">
      <CardContent className="pt-4">
        <div className="flex space-x-3">
          <Avatar>
            <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "@user"} />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            {/* Content Type Selector */}
            <div className="mb-3">
              <Select value={contentType} onValueChange={(value: ContentType) => setContentType(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Post type" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <Textarea
              placeholder={`What's on your mind, ${user?.name?.split(' ')[0] || 'friend'}?`}
              className="resize-none border-0 focus-visible:ring-0 focus-visible:ring-transparent p-2 h-20"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {/* Content type specific fields */}
            {contentType === 'product' && (
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-24"
                />
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="NGN">NGN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {contentType === 'event' && (
              <div className="mt-2">
                <Input
                  type="datetime-local"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  placeholder="Event date and time"
                />
              </div>
            )}

            {(contentType === 'job' || contentType === 'service') && (
              <div className="space-y-2 mt-2">
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="fulltime">Full-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Required skills (comma separated)"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>
            )}

            {/* Selected feeling and location display */}
            {(selectedFeeling || location) && (
              <div className="flex items-center gap-2 mt-2 mb-3">
                {selectedFeeling && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    feeling {selectedFeeling.label} {selectedFeeling.emoji}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => setSelectedFeeling(null)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                )}
                {location && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {location}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => setLocation("")}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            )}

            {/* Link URL display */}
            {linkUrl && (
              <div className="mt-2 mb-3">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <Link className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-600 truncate flex-1">{linkUrl}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setLinkUrl("")}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}

            {/* Link input */}
            {showLinkInput && (
              <div className="mt-2 mb-3 flex gap-2">
                <Input
                  placeholder="Enter URL..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" onClick={() => setShowLinkInput(false)}>
                  Add
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowLinkInput(false)}
                >
                  Cancel
                </Button>
              </div>
            )}

            {previewImage && (
              <div className="relative mt-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full h-6 w-6 p-1 z-10"
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
      
      <CardFooter className="border-t pt-3 flex flex-col gap-3">
        {/* Publishing Destination Selector */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Publish to:</Label>
            <Dialog open={showPublishSettings} onOpenChange={setShowPublishSettings}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Publishing Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Choose where to publish:</Label>
                    <RadioGroup 
                      value={publishDestination} 
                      onValueChange={(value: PublishDestination) => setPublishDestination(value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="classic" id="classic" />
                        <Label htmlFor="classic" className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Classic Mode Only
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="threaded" id="threaded" />
                        <Label htmlFor="threaded" className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Thread Mode Only
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="both" />
                        <Label htmlFor="both" className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Both Modes
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {publishDestination === 'classic' && "Your post will only appear in Classic feed mode."}
                    {publishDestination === 'threaded' && "Your post will only appear in Thread feed mode."}
                    {publishDestination === 'both' && "Your post will appear in both Classic and Thread feed modes for maximum visibility."}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            <Button
              variant={publishDestination === 'classic' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPublishDestination('classic')}
              className="flex-1"
            >
              <Globe className="h-4 w-4 mr-1" />
              Classic
            </Button>
            <Button
              variant={publishDestination === 'threaded' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPublishDestination('threaded')}
              className="flex-1"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Thread
            </Button>
            <Button
              variant={publishDestination === 'both' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPublishDestination('both')}
              className="flex-1"
            >
              <Users className="h-4 w-4 mr-1" />
              Both
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center w-full">
          <div className="flex flex-wrap gap-2">
            {/* Hidden file inputs */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <input
              type="file"
              ref={videoInputRef}
              className="hidden"
              accept="video/*"
            />
            <input
              type="file"
              ref={audioInputRef}
              className="hidden"
              accept="audio/*"
            />

            {/* Media buttons */}
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground flex-shrink-0"
              onClick={() => handleFileUpload('image')}
              disabled={isUploading}
            >
              {isUploading ? (
                <>Loading...</>
              ) : (
                <>
                  <Image className="h-4 w-4 mr-2" />
                  <span className="hidden xs:inline">Photo</span>
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground flex-shrink-0"
              onClick={() => handleFileUpload('video')}
            >
              <Film className="h-4 w-4 mr-2" />
              <span className="hidden xs:inline">Video</span>
            </Button>

            {/* Link button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground flex-shrink-0"
              onClick={() => setShowLinkInput(!showLinkInput)}
            >
              <Link className="h-4 w-4 mr-2" />
              <span className="hidden xs:inline">Link</span>
            </Button>

            {/* Emoji picker */}
            <Dialog open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground flex-shrink-0">
                  <Smile className="h-4 w-4 mr-2" />
                  <span className="hidden xs:inline">Emoji</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Choose an emoji</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-10 gap-2 max-h-64 overflow-y-auto">
                  {commonEmojis.map((emoji, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="h-8 w-8 p-0 text-lg hover:bg-gray-100"
                      onClick={() => {
                        addEmoji(emoji);
                        setShowEmojiPicker(false);
                      }}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            {/* Feeling picker */}
            <Dialog open={showFeelingPicker} onOpenChange={setShowFeelingPicker}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground flex-shrink-0">
                  <Heart className="h-4 w-4 mr-2" />
                  <span className="hidden xs:inline">Feeling</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>How are you feeling?</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {feelings.map((feeling) => (
                    <Button
                      key={feeling.id}
                      variant="outline"
                      className="justify-start h-auto p-3"
                      onClick={() => {
                        setSelectedFeeling(feeling);
                        setShowFeelingPicker(false);
                      }}
                    >
                      <span className="text-lg mr-2">{feeling.emoji}</span>
                      <span className="text-sm">{feeling.label}</span>
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            {/* Location input */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground flex-shrink-0">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="hidden xs:inline">Location</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add location</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Where are you?"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setLocation("")}>
                      Cancel
                    </Button>
                    <Button onClick={() => setLocation(location)}>
                      Add Location
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Button
            variant="default"
            size="sm"
            onClick={handlePost}
            disabled={isPosting || (!content.trim() && !previewImage && !linkUrl)}
            className="flex-shrink-0"
          >
            {isPosting ? "Posting..." : "Post"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EnhancedCreatePostWithDestination;
