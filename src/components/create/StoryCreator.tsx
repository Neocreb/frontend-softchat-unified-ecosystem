
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Image, Type, Palette } from "lucide-react";
import { useToast } = "@/hooks/use-toast";

const StoryCreator = () => {
  const [storyType, setStoryType] = useState<"text" | "image" | "video">("text");
  const [textContent, setTextContent] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#3b82f6");
  const { toast } = useToast();

  const handleCreateStory = () => {
    if (storyType === "text" && !textContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text for your story",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Story Created!",
      description: "Your story has been added successfully",
    });

    // Reset form
    setTextContent("");
    setStoryType("text");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a Story</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Story Type</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <Button
              variant={storyType === "text" ? "default" : "outline"}
              onClick={() => setStoryType("text")}
              className="flex items-center gap-2"
            >
              <Type className="h-4 w-4" />
              Text
            </Button>
            <Button
              variant={storyType === "image" ? "default" : "outline"}
              onClick={() => setStoryType("image")}
              className="flex items-center gap-2"
            >
              <Image className="h-4 w-4" />
              Image
            </Button>
            <Button
              variant={storyType === "video" ? "default" : "outline"}
              onClick={() => setStoryType("video")}
              className="flex items-center gap-2"
            >
              <Camera className="h-4 w-4" />
              Video
            </Button>
          </div>
        </div>

        {storyType === "text" && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text-content">Story Text</Label>
              <Input
                id="text-content"
                placeholder="What's on your mind?"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="bg-color">Background Color</Label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="color"
                  id="bg-color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-12 h-10 rounded border"
                />
                <Palette className="h-4 w-4" />
              </div>
            </div>
            <div
              className="w-full h-32 rounded-lg flex items-center justify-center text-white font-medium"
              style={{ backgroundColor }}
            >
              {textContent || "Your story preview"}
            </div>
          </div>
        )}

        {storyType === "image" && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-500">Click to upload an image or drag and drop</p>
            </div>
          </div>
        )}

        {storyType === "video" && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-500">Click to record a video or upload</p>
            </div>
          </div>
        )}

        <Button onClick={handleCreateStory} className="w-full">
          Create Story
        </Button>
      </CardContent>
    </Card>
  );
};

export default StoryCreator;
