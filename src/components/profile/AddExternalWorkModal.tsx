import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Link as LinkIcon,
  Image as ImageIcon,
  Play,
  FileText,
  Plus,
  X,
  Upload,
  Globe,
  Github,
  Figma,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AddExternalWorkModalProps {
  open: boolean;
  onClose: () => void;
  onAddWork: (work: any) => void;
}

const AddExternalWorkModal: React.FC<AddExternalWorkModalProps> = ({
  open,
  onClose,
  onAddWork,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "link" as "link" | "image" | "video" | "document",
    url: "",
    category: "",
    tags: [] as string[],
    thumbnail: "",
  });
  const [newTag, setNewTag] = useState("");

  const categories = [
    { id: "web_development", name: "Web Development" },
    { id: "mobile_app", name: "Mobile Apps" },
    { id: "ui_ux", name: "UI/UX Design" },
    { id: "backend", name: "Backend Development" },
    { id: "frontend", name: "Frontend Development" },
    { id: "fullstack", name: "Full Stack" },
    { id: "design", name: "Graphic Design" },
    { id: "branding", name: "Branding" },
    { id: "photography", name: "Photography" },
    { id: "video", name: "Video Production" },
    { id: "marketing", name: "Marketing" },
    { id: "writing", name: "Content Writing" },
    { id: "other", name: "Other" },
  ];

  const workTypes = [
    { id: "link", name: "Website/Portfolio Link", icon: LinkIcon, description: "Link to your work online" },
    { id: "image", name: "Image/Screenshot", icon: ImageIcon, description: "Upload images of your work" },
    { id: "video", name: "Video Demo", icon: Play, description: "Video showcasing your work" },
    { id: "document", name: "Document/PDF", icon: FileText, description: "PDF or document file" },
  ];

  const platformSuggestions = [
    { name: "GitHub", icon: Github, url: "https://github.com/" },
    { name: "Portfolio", icon: Globe, url: "https://" },
    { name: "Figma", icon: Figma, url: "https://figma.com/" },
    { name: "Dribbble", icon: ExternalLink, url: "https://dribbble.com/" },
    { name: "Behance", icon: ExternalLink, url: "https://behance.net/" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.url || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newWork = {
      id: Date.now().toString(),
      ...formData,
      created_at: new Date().toISOString(),
    };

    onAddWork(newWork);
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      type: "link",
      url: "",
      category: "",
      tags: [],
      thumbnail: "",
    });
    
    toast({
      title: "Work Added!",
      description: "Your external work has been added to your portfolio",
    });
    
    onClose();
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const getCurrentIcon = () => {
    const typeConfig = workTypes.find(t => t.id === formData.type);
    return typeConfig ? typeConfig.icon : LinkIcon;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add External Work
          </DialogTitle>
          <DialogDescription>
            Showcase your work from other platforms or upload files to display in your portfolio
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Work Type Selection */}
          <div className="space-y-3">
            <Label>Type of Work *</Label>
            <div className="grid grid-cols-2 gap-3">
              {workTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => setFormData(prev => ({ ...prev, type: type.id as any }))}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    formData.type === type.id 
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <type.icon className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-sm">{type.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{type.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., E-commerce Website Design"
            />
          </div>

          {/* URL/Link */}
          <div className="space-y-2">
            <Label htmlFor="url">
              {formData.type === "link" ? "Website URL" : 
               formData.type === "video" ? "Video URL" : 
               formData.type === "document" ? "Document URL" : "Image URL"} *
            </Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              placeholder={
                formData.type === "link" ? "https://yourportfolio.com/project" :
                formData.type === "video" ? "https://vimeo.com/video-id" :
                formData.type === "document" ? "https://drive.google.com/file/..." :
                "https://image-url.com/image.jpg"
              }
            />
            
            {/* Platform Suggestions */}
            {formData.type === "link" && (
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs text-muted-foreground">Quick links:</span>
                {platformSuggestions.map((platform) => (
                  <Button
                    key={platform.name}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => setFormData(prev => ({ ...prev, url: platform.url }))}
                  >
                    <platform.icon className="h-3 w-3 mr-1" />
                    {platform.name}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your work, technologies used, challenges solved..."
              rows={3}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Skills/Technologies</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="e.g., React, Node.js, Figma"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail (for videos and documents) */}
          {(formData.type === "video" || formData.type === "document") && (
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail URL (Optional)</Label>
              <Input
                id="thumbnail"
                type="url"
                value={formData.thumbnail}
                onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                placeholder="https://thumbnail-url.com/thumbnail.jpg"
              />
            </div>
          )}

          {/* Preview */}
          {formData.title && formData.url && (
            <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="text-sm font-medium mb-2">Preview:</div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {React.createElement(getCurrentIcon(), { className: "h-5 w-5 text-blue-600" })}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{formData.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {formData.category.replace('_', ' ')} • {formData.type}
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            <Plus className="h-4 w-4 mr-2" />
            Add Work
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddExternalWorkModal;
