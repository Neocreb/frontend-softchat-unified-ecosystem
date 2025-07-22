import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  Image,
  Video,
  Download,
  Trash2,
  Eye,
  Share2,
  AlertCircle,
  CheckCircle2,
  Clock,
  File
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  uploadedBy: string;
  url?: string;
  status: 'uploading' | 'completed' | 'error';
  progress?: number;
}

interface FileUploadProps {
  projectId?: string;
  allowedTypes?: string[];
  maxSize?: number; // in MB
  multiple?: boolean;
  onFileUploaded?: (file: FileItem) => void;
  onFileDeleted?: (fileId: string) => void;
  initialFiles?: FileItem[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  projectId,
  allowedTypes = ['*'],
  maxSize = 10,
  multiple = true,
  onFileUploaded,
  onFileDeleted,
  initialFiles = []
}) => {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (type.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (type.includes('pdf')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size exceeds ${maxSize}MB limit`;
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes('*')) {
      const isAllowed = allowedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type.includes(type);
      });
      if (!isAllowed) {
        return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
      }
    }

    return null;
  };

  const simulateUpload = (fileItem: FileItem): Promise<FileItem> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          const completedFile = { 
            ...fileItem, 
            status: 'completed' as const, 
            progress: 100,
            url: URL.createObjectURL(new Blob()) // Mock URL
          };
          resolve(completedFile);
        } else {
          setFiles(prev => prev.map(f => 
            f.id === fileItem.id ? { ...f, progress } : f
          ));
        }
      }, 100);
    });
  };

  const handleFileUpload = async (fileList: File[]) => {
    const validFiles: File[] = [];
    
    for (const file of fileList) {
      const error = validateFile(file);
      if (error) {
        toast({
          title: "Upload Error",
          description: `${file.name}: ${error}`,
          variant: "destructive",
        });
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    const newFiles: FileItem[] = validFiles.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      uploadedBy: "Current User", // This would come from auth context
      status: 'uploading',
      progress: 0,
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload for each file
    for (const fileItem of newFiles) {
      try {
        const completedFile = await simulateUpload(fileItem);
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id ? completedFile : f
        ));
        
        if (onFileUploaded) {
          onFileUploaded(completedFile);
        }
        
        toast({
          title: "Upload Complete",
          description: `${fileItem.name} uploaded successfully`,
        });
      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { ...f, status: 'error' } : f
        ));
        
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${fileItem.name}`,
          variant: "destructive",
        });
      }
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileUpload(droppedFiles);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFileUpload(selectedFiles);
    e.target.value = ''; // Reset input
  };

  const handleDelete = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (onFileDeleted) {
      onFileDeleted(fileId);
    }
    toast({
      title: "File Deleted",
      description: "File has been removed from the project",
    });
  };

  const handleDownload = (file: FileItem) => {
    if (file.url) {
      // In a real app, this would download the actual file
      const a = document.createElement('a');
      a.href = file.url;
      a.download = file.name;
      a.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card className={`border-2 border-dashed transition-colors ${
        isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
      }`}>
        <CardContent 
          className="p-8 text-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Upload Project Files</h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop files here, or click to select files
          </p>
          <input
            type="file"
            multiple={multiple}
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            accept={allowedTypes.includes('*') ? undefined : allowedTypes.join(',')}
          />
          <label htmlFor="file-upload">
            <Button asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </span>
            </Button>
          </label>
          <div className="mt-4 text-xs text-muted-foreground">
            Maximum file size: {maxSize}MB
            {allowedTypes.length > 0 && !allowedTypes.includes('*') && (
              <div>Allowed types: {allowedTypes.join(', ')}</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Project Files ({files.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    {getFileIcon(file.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium truncate">{file.name}</span>
                      <Badge 
                        variant={
                          file.status === 'completed' ? 'default' : 
                          file.status === 'error' ? 'destructive' : 
                          'secondary'
                        }
                      >
                        {file.status === 'uploading' && <Clock className="w-3 h-3 mr-1" />}
                        {file.status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {file.status === 'error' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {file.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                      <span>Uploaded by {file.uploadedBy}</span>
                      <span>{file.uploadedAt.toLocaleDateString()}</span>
                    </div>
                    
                    {file.status === 'uploading' && typeof file.progress === 'number' && (
                      <div className="mt-2">
                        <Progress value={file.progress} className="h-1" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {file.status === 'completed' && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownload(file)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(file.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {files.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No files yet</h3>
            <p className="text-muted-foreground">
              Upload project files and deliverables to share with your client
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUpload;
