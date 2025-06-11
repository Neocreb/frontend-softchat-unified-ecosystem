// src/components/feed/MediaUploadModal.tsx
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, Upload, Image, Video, Trash2 } from "lucide-react";
import { MediaUpload, feedService } from "@/services/feedService";
import { useToast } from "@/components/ui/use-toast";

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMediaUploaded: (media: MediaUpload[]) => void;
  maxFiles?: number;
}

export function MediaUploadModal({
  isOpen,
  onClose,
  onMediaUploaded,
  maxFiles = 10,
}: MediaUploadModalProps) {
  const [uploads, setUploads] = useState<MediaUpload[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const remainingSlots = maxFiles - uploads.length;

    if (fileArray.length > remainingSlots) {
      toast({
        title: "Too many files",
        description: `You can only upload ${remainingSlots} more file(s).`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const mediaUploads = await feedService.uploadMedia(fileArray);

      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        setUploads((prev) => [...prev, ...mediaUploads]);
        setIsUploading(false);
        setUploadProgress(0);
      }, 300);
    } catch (error) {
      toast({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "Failed to upload files",
        variant: "destructive",
      });
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeUpload = (index: number) => {
    setUploads((prev) => {
      const newUploads = [...prev];
      // Revoke the object URL to free memory
      if (newUploads[index].preview) {
        URL.revokeObjectURL(newUploads[index].preview!);
      }
      newUploads.splice(index, 1);
      return newUploads;
    });
  };

  const handleDone = () => {
    onMediaUploaded(uploads);
    setUploads([]);
    onClose();
  };

  const handleCancel = () => {
    // Clean up object URLs
    uploads.forEach((upload) => {
      if (upload.preview) {
        URL.revokeObjectURL(upload.preview);
      }
    });
    setUploads([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Upload Photos & Videos
          </DialogTitle>
        </DialogHeader>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">
            Drag photos and videos here
          </h3>
          <p className="text-gray-500 mb-4">or click to select files</p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || uploads.length >= maxFiles}
          >
            Select Files
          </Button>
          <p className="text-xs text-gray-400 mt-2">
            Supports: JPG, PNG, GIF, MP4, MOV (max {maxFiles} files)
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}

        {/* Uploaded Files Preview */}
        {uploads.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold">
              Selected Files ({uploads.length}/{maxFiles})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {uploads.map((upload, index) => (
                <Card key={index} className="relative group">
                  <div className="aspect-square relative overflow-hidden rounded-lg">
                    {upload.type === "image" ? (
                      <img
                        src={upload.preview}
                        alt="Upload preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="relative w-full h-full bg-black">
                        <video
                          src={upload.preview}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Video className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Remove button */}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeUpload(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>

                    {/* File type indicator */}
                    <div className="absolute bottom-2 left-2">
                      {upload.type === "video" ? (
                        <Badge variant="secondary" className="text-xs">
                          <Video className="w-3 h-3 mr-1" />
                          Video
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          <Image className="w-3 h-3 mr-1" />
                          Image
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleDone}
            disabled={uploads.length === 0}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Add to Post ({uploads.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Add Badge import
import { Badge } from "@/components/ui/badge";
