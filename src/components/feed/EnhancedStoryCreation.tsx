import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  X,
  Image,
  Video,
  Type,
  Camera,
  Clock,
  Globe,
  Users,
  Lock,
  Upload,
  Palette,
  Smile,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface EnhancedStoryCreationProps {
  isOpen: boolean;
  onClose: () => void;
  onStoryCreated?: (story: any) => void;
}

const TEXT_BACKGROUNDS = [
  { name: "Blue", class: "bg-gradient-to-br from-blue-400 to-purple-600" },
  { name: "Pink", class: "bg-gradient-to-br from-pink-400 to-red-600" },
  { name: "Green", class: "bg-gradient-to-br from-green-400 to-teal-600" },
  { name: "Orange", class: "bg-gradient-to-br from-orange-400 to-yellow-600" },
  { name: "Purple", class: "bg-gradient-to-br from-purple-400 to-indigo-600" },
  { name: "Black", class: "bg-black" },
];

export function EnhancedStoryCreation({
  isOpen,
  onClose,
  onStoryCreated,
}: EnhancedStoryCreationProps) {
  const [activeMode, setActiveMode] = useState<"photo" | "video" | "text">(
    "photo",
  );
  const [textContent, setTextContent] = useState("");
  const [selectedBackground, setSelectedBackground] = useState(0);
  const [privacy, setPrivacy] = useState("everyone");
  const [duration, setDuration] = useState("15");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 50MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    const validTypes =
      activeMode === "photo"
        ? ["image/jpeg", "image/png", "image/gif", "image/webp"]
        : ["video/mp4", "video/webm", "video/quicktime"];

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: `Please select a valid ${activeMode} file`,
        variant: "destructive",
      });
      return;
    }

    setUploadedMedia(file);
    const previewUrl = URL.createObjectURL(file);
    setMediaPreview(previewUrl);
  };

  const removeMedia = () => {
    setUploadedMedia(null);
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
      setMediaPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePublish = async () => {
    if (activeMode === "text" && !textContent.trim()) {
      toast({
        title: "Missing content",
        description: "Please add some text to your story",
        variant: "destructive",
      });
      return;
    }

    if ((activeMode === "photo" || activeMode === "video") && !uploadedMedia) {
      toast({
        title: "Missing media",
        description: `Please upload a ${activeMode} for your story`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newStory = {
        id: `story_${Date.now()}`,
        type: activeMode,
        content: textContent,
        media: uploadedMedia ? URL.createObjectURL(uploadedMedia) : null,
        background:
          activeMode === "text"
            ? TEXT_BACKGROUNDS[selectedBackground].class
            : null,
        privacy,
        duration: parseInt(duration),
        createdAt: new Date().toISOString(),
      };

      onStoryCreated?.(newStory);

      toast({
        title: "Story published!",
        description: "Your story has been shared successfully",
      });

      handleClose();
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to publish your story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setTextContent("");
    setSelectedBackground(0);
    setPrivacy("everyone");
    setDuration("15");
    removeMedia();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm sm:max-w-md h-[90vh] p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-4 border-b flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">
            Create Story
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Mode Selector */}
        <div className="p-4 border-b">
          <div className="grid grid-cols-3 gap-2">
            {[
              { mode: "photo" as const, icon: Image, label: "Photo" },
              { mode: "video" as const, icon: Video, label: "Video" },
              { mode: "text" as const, icon: Type, label: "Text" },
            ].map(({ mode, icon: Icon, label }) => (
              <Button
                key={mode}
                variant={activeMode === mode ? "default" : "outline"}
                className="flex flex-col items-center gap-2 h-16"
                onClick={() => setActiveMode(mode)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 overflow-y-auto">
          {activeMode === "text" ? (
            <div className="space-y-4">
              {/* Text Preview */}
              <Card
                className={cn(
                  "aspect-[9/16] flex items-center justify-center p-6 relative overflow-hidden",
                  TEXT_BACKGROUNDS[selectedBackground].class,
                )}
              >
                <Textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Type your story here..."
                  className="bg-transparent border-none text-white placeholder-white/70 text-lg font-medium text-center resize-none w-full h-full flex items-center justify-center"
                  maxLength={150}
                />
              </Card>

              {/* Background Selector */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Background</p>
                <div className="grid grid-cols-6 gap-2">
                  {TEXT_BACKGROUNDS.map((bg, index) => (
                    <button
                      key={index}
                      className={cn(
                        "w-8 h-8 rounded-full border-2",
                        bg.class,
                        selectedBackground === index
                          ? "border-black ring-2 ring-blue-500"
                          : "border-gray-300",
                      )}
                      onClick={() => setSelectedBackground(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Media Upload Area */}
              <Card className="aspect-[9/16] flex items-center justify-center border-2 border-dashed border-gray-300 relative overflow-hidden">
                {mediaPreview ? (
                  <div className="relative w-full h-full">
                    {activeMode === "photo" ? (
                      <img
                        src={mediaPreview}
                        alt="Story preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={mediaPreview}
                        className="w-full h-full object-cover"
                        controls
                      />
                    )}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={removeMedia}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="space-y-2">
                      <Upload className="h-12 w-12 mx-auto text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">
                          Upload {activeMode}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activeMode === "photo"
                            ? "JPG, PNG up to 10MB"
                            : "MP4, WebM up to 50MB"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2"
                    >
                      <Camera className="h-4 w-4" />
                      Choose {activeMode}
                    </Button>
                  </div>
                )}
              </Card>

              {/* Text Overlay for Media */}
              {mediaPreview && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Add text (optional)</p>
                  <Textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Add text to your story..."
                    className="resize-none"
                    rows={2}
                    maxLength={100}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="p-4 border-t space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Duration */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Duration</span>
              </div>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 seconds</SelectItem>
                  <SelectItem value="10">10 seconds</SelectItem>
                  <SelectItem value="15">15 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Privacy */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {privacy === "everyone" ? (
                  <Globe className="h-4 w-4" />
                ) : privacy === "friends" ? (
                  <Users className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">Privacy</span>
              </div>
              <Select value={privacy} onValueChange={setPrivacy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="everyone">Everyone</SelectItem>
                  <SelectItem value="friends">Friends</SelectItem>
                  <SelectItem value="close">Close Friends</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Publish Button */}
          <Button
            onClick={handlePublish}
            disabled={isUploading}
            className="w-full h-12 text-base font-medium"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Publishing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Publish Story
              </>
            )}
          </Button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={activeMode === "photo" ? "image/*" : "video/*"}
          onChange={handleMediaUpload}
          className="hidden"
        />
      </DialogContent>
    </Dialog>
  );
}
