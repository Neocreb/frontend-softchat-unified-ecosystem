import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Image,
  Video,
  FileText,
  Music,
  Upload,
  X,
  Camera,
  Paperclip,
  Download,
  Share,
  Trash2,
  Eye,
  MoreVertical,
  Grid3X3,
  List,
  Calendar,
  User,
  Search,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { GroupParticipant } from "@/types/group-chat";

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  thumbnailUrl?: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  description?: string;
  tags?: string[];
  downloadCount?: number;
}

interface GroupMediaSharingProps {
  trigger: React.ReactNode;
  groupId: string;
  groupName: string;
  participants: GroupParticipant[];
  currentUserId: string;
  mediaFiles?: MediaFile[];
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onUploadFiles?: (files: File[], description?: string) => Promise<void>;
  onDeleteFile?: (fileId: string) => Promise<void>;
  onDownloadFile?: (fileId: string) => void;
  onShareFile?: (fileId: string) => void;
}

export const GroupMediaSharing: React.FC<GroupMediaSharingProps> = ({
  trigger,
  groupId,
  groupName,
  participants,
  currentUserId,
  mediaFiles = [],
  isOpen: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onUploadFiles,
  onDeleteFile,
  onDownloadFile,
  onShareFile,
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Modal state
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const onOpenChange = controlledOnOpenChange || setInternalOpen;

  // UI state
  const [activeTab, setActiveTab] = useState<'all' | 'images' | 'videos' | 'documents' | 'audio'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadDescription, setUploadDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Music className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getUploaderName = (uploaderId: string) => {
    const participant = participants.find(p => p.id === uploaderId);
    return participant?.name || 'Unknown User';
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 100MB`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    setSelectedFiles(validFiles);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !onUploadFiles) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 20;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 200);

      await onUploadFiles(selectedFiles, uploadDescription.trim() || undefined);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      toast({
        title: "Files uploaded successfully",
        description: `${selectedFiles.length} file(s) have been shared with the group.`,
      });

      // Reset form
      setSelectedFiles([]);
      setUploadDescription("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      toast({
        title: "Upload failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!onDeleteFile) return;

    try {
      await onDeleteFile(fileId);
      toast({
        title: "File deleted",
        description: "The file has been removed from the group.",
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Delete failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter media files
  const filteredFiles = mediaFiles.filter(file => {
    // Filter by type
    if (activeTab !== 'all' && file.type !== activeTab) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        file.name.toLowerCase().includes(query) ||
        file.description?.toLowerCase().includes(query) ||
        getUploaderName(file.uploadedBy).toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const tabs = [
    { id: 'all', label: 'All', count: mediaFiles.length },
    { id: 'images', label: 'Images', count: mediaFiles.filter(f => f.type === 'image').length },
    { id: 'videos', label: 'Videos', count: mediaFiles.filter(f => f.type === 'video').length },
    { id: 'documents', label: 'Documents', count: mediaFiles.filter(f => f.type === 'document').length },
    { id: 'audio', label: 'Audio', count: mediaFiles.filter(f => f.type === 'audio').length },
  ];

  const renderFileCard = (file: MediaFile) => {
    const isOwner = file.uploadedBy === currentUserId;
    
    if (viewMode === 'list') {
      return (
        <div key={file.id} className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
          <div className="flex-shrink-0">
            {file.type === 'image' ? (
              <img
                src={file.thumbnailUrl || file.url}
                alt={file.name}
                className="w-12 h-12 object-cover rounded"
              />
            ) : (
              <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                {getFileIcon(file.type)}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{file.name}</h4>
            <div className="text-sm text-muted-foreground">
              {formatFileSize(file.size)} • {getUploaderName(file.uploadedBy)} • {format(new Date(file.uploadedAt), 'MMM d, yyyy')}
            </div>
            {file.description && (
              <p className="text-sm text-muted-foreground truncate mt-1">{file.description}</p>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" onClick={() => onDownloadFile?.(file.id)}>
              <Download className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onShareFile?.(file.id)}>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                {isOwner && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      );
    }

    // Grid view
    return (
      <Card key={file.id} className="group overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative aspect-square">
          {file.type === 'image' ? (
            <img
              src={file.thumbnailUrl || file.url}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          ) : file.type === 'video' ? (
            <div className="relative w-full h-full bg-black">
              <video
                src={file.url}
                className="w-full h-full object-cover"
                muted
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Video className="h-8 w-8 text-white" />
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              {getFileIcon(file.type)}
              <span className="ml-2 text-sm font-medium">{file.type.toUpperCase()}</span>
            </div>
          )}
          
          {/* Overlay actions */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button size="sm" variant="secondary" onClick={() => onDownloadFile?.(file.id)}>
              <Download className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" onClick={() => onShareFile?.(file.id)}>
              <Share className="h-4 w-4" />
            </Button>
            {isOwner && (
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={() => handleDeleteFile(file.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* File type badge */}
          <Badge className="absolute top-2 left-2 text-xs">
            {file.type}
          </Badge>
        </div>
        
        <CardContent className="p-3">
          <h4 className="font-medium truncate">{file.name}</h4>
          <div className="text-xs text-muted-foreground mt-1">
            {formatFileSize(file.size)}
          </div>
          <div className="text-xs text-muted-foreground">
            {getUploaderName(file.uploadedBy)}
          </div>
          {file.description && (
            <p className="text-xs text-muted-foreground truncate mt-2">{file.description}</p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Paperclip className="h-5 w-5" />
              Group Media & Files
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="hover:bg-accent rounded-full p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <DialogDescription>
            Share and manage files in {groupName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Section */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Upload Files</h3>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Choose Files
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
              />

              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-muted rounded">
                        {getFileIcon(file.type as any)}
                        <span className="flex-1 text-sm">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Textarea
                    placeholder="Add a description (optional)..."
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    rows={2}
                  />

                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{Math.round(uploadProgress)}%</span>
                      </div>
                      <Progress value={uploadProgress} />
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedFiles([]);
                        setUploadDescription("");
                      }}
                      disabled={isUploading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpload}
                      disabled={isUploading}
                    >
                      Upload {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Filters and Search */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id as any)}
                  className="flex items-center gap-1"
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <Badge variant="secondary" className="text-xs h-4 px-1">
                      {tab.count}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-48"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {viewMode === 'grid' ? <Grid3X3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setViewMode('grid')}>
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    Grid View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setViewMode('list')}>
                    <List className="h-4 w-4 mr-2" />
                    List View
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Files Display */}
          <ScrollArea className="h-96">
            {filteredFiles.length > 0 ? (
              <div className={cn(
                viewMode === 'grid' 
                  ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  : "space-y-2"
              )}>
                {filteredFiles.map(renderFileCard)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Paperclip className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No files found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "Try adjusting your search" : "Be the first to share a file!"}
                </p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
