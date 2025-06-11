// src/components/feed/MediaUploadModal.tsx
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Image className="w-5 h-5" />
            Upload Photos & Videos
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Choose photos and videos to share with your followers
          </DialogDescription>
        </DialogHeader>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-4 text-gray-400" />
          <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
            Drag photos and videos here
          </h3>
          <p className="text-sm sm:text-base text-gray-500 mb-2 sm:mb-4">
            or click to select files
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || uploads.length >= maxFiles}
            size="sm"
            className="text-sm"
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
            <h4 className="font-semibold text-sm sm:text-base">
              Selected Files ({uploads.length}/{maxFiles})
            </h4>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
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
                          <Video className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Remove button */}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 w-5 h-5 sm:w-6 sm:h-6 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeUpload(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>

                    {/* File type indicator */}
                    <div className="absolute bottom-1 left-1">
                      {upload.type === "video" ? (
                        <Badge variant="secondary" className="text-xs">
                          <Video className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                          Video
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          <Image className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
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
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDone}
            disabled={uploads.length === 0}
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600"
          >
            Add to Post ({uploads.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
