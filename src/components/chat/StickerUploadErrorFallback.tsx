import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  RefreshCw, 
  Upload, 
  X,
  ImageIcon,
  FileImage,
  Wifi,
  Server
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StickerUploadErrorFallbackProps {
  error?: Error | null;
  onRetry?: () => void;
  onClose?: () => void;
  className?: string;
}

export const StickerUploadErrorFallback: React.FC<StickerUploadErrorFallbackProps> = ({
  error,
  onRetry,
  onClose,
  className
}) => {
  const getErrorMessage = () => {
    if (!error) return "An unknown error occurred";
    
    const message = error.message.toLowerCase();
    
    if (message.includes("file") && message.includes("size")) {
      return {
        title: "File too large",
        description: "The selected image file is too large. Please use images smaller than 5MB.",
        icon: FileImage,
        suggestion: "Try compressing your image or selecting a smaller file."
      };
    }
    
    if (message.includes("format") || message.includes("type")) {
      return {
        title: "Unsupported file format",
        description: "The selected file format is not supported. Please use PNG, JPEG, GIF, or WebP images.",
        icon: ImageIcon,
        suggestion: "Convert your image to a supported format and try again."
      };
    }
    
    if (message.includes("network") || message.includes("fetch")) {
      return {
        title: "Network error",
        description: "Unable to upload files due to a network issue.",
        icon: Wifi,
        suggestion: "Check your internet connection and try again."
      };
    }
    
    if (message.includes("server") || message.includes("500")) {
      return {
        title: "Server error",
        description: "The server is temporarily unable to process your request.",
        icon: Server,
        suggestion: "Please try again in a few moments."
      };
    }
    
    if (message.includes("corrupted") || message.includes("invalid")) {
      return {
        title: "Corrupted image file",
        description: "The selected image file appears to be corrupted or invalid.",
        icon: AlertTriangle,
        suggestion: "Try selecting a different image file."
      };
    }
    
    return {
      title: "Upload failed",
      description: error.message || "Something went wrong while uploading your sticker images.",
      icon: AlertTriangle,
      suggestion: "Please try again or contact support if the problem persists."
    };
  };

  const errorInfo = getErrorMessage();
  const IconComponent = errorInfo.icon;

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 p-3 rounded-full bg-destructive/10">
          <IconComponent className="w-8 h-8 text-destructive" />
        </div>
        <CardTitle className="text-lg text-destructive">
          {errorInfo.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {errorInfo.description}
          </AlertDescription>
        </Alert>
        
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-sm text-muted-foreground">
            <strong>Suggestion:</strong> {errorInfo.suggestion}
          </p>
        </div>
        
        {/* Error details for debugging (collapsible) */}
        {error && (
          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer hover:text-foreground">
              Technical details
            </summary>
            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
              {error.stack || error.message}
            </pre>
          </details>
        )}
        
        <div className="flex gap-2 pt-2">
          {onRetry && (
            <Button 
              onClick={onRetry} 
              className="flex-1"
              variant="default"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
          
          {onClose && (
            <Button 
              onClick={onClose} 
              variant="outline"
              className={onRetry ? "" : "flex-1"}
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          )}
        </div>
        
        {/* Quick action suggestions */}
        <div className="space-y-2 pt-2 border-t">
          <p className="text-xs font-medium text-muted-foreground">Quick fixes:</p>
          <div className="grid grid-cols-1 gap-1 text-xs">
            <div className="flex items-center gap-2 p-2 rounded bg-muted/30">
              <Upload className="w-3 h-3" />
              <span>Use images smaller than 5MB</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-muted/30">
              <FileImage className="w-3 h-3" />
              <span>Support: PNG, JPEG, GIF, WebP</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-muted/30">
              <Wifi className="w-3 h-3" />
              <span>Check your internet connection</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StickerUploadErrorFallback;
