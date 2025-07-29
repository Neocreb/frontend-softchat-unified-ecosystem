import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Camera,
  RefreshCw,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle2,
  X,
} from "lucide-react";
import { getPermissionHelp, CameraError } from "@/utils/cameraPermissions";

interface CameraPermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  error: CameraError | null;
  onRetry: () => void;
  onCancel: () => void;
}

export const CameraPermissionDialog: React.FC<CameraPermissionDialogProps> = ({
  open,
  onOpenChange,
  error,
  onRetry,
  onCancel,
}) => {
  const instructionsText = getPermissionHelp();

  // Parse the instructions text into structured format
  const instructions = {
    title: "Enable Camera Permissions",
    steps: instructionsText.split('\n').map(line => line.replace(/^\d+\.\s*/, '')),
    troubleshooting: [
      "Try refreshing the page after enabling permissions",
      "Check if another app is using your camera",
      "Make sure you're on a secure (HTTPS) connection",
      "Try using a different browser if the issue persists"
    ]
  };

  const getErrorIcon = () => {
    if (!error) return <Camera className="w-6 h-6 text-blue-500" />;
    
    switch (error.type) {
      case 'permission-denied':
        return <Shield className="w-6 h-6 text-red-500" />;
      case 'not-found':
        return <Camera className="w-6 h-6 text-orange-500" />;
      case 'not-readable':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      default:
        return <X className="w-6 h-6 text-red-500" />;
    }
  };

  const getErrorColor = () => {
    if (!error) return 'border-blue-200 bg-blue-50';
    
    switch (error.type) {
      case 'permission-denied':
        return 'border-red-200 bg-red-50';
      case 'not-found':
        return 'border-orange-200 bg-orange-50';
      case 'not-readable':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-red-200 bg-red-50';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getErrorIcon()}
            {error ? 'Camera Access Issue' : 'Camera Permission Required'}
          </DialogTitle>
          <DialogDescription>
            {error ? error.message : 'We need access to your camera to record videos'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Error-specific content */}
          {error && (
            <Card className={getErrorColor()}>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">What to do:</h4>
                <p className="text-sm">{error.userAction}</p>
              </CardContent>
            </Card>
          )}

          {/* Permission instructions */}
          {error?.type === 'permission-denied' && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  {instructions.title}
                </h4>
                <ol className="space-y-2 text-sm">
                  {instructions.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}

          {/* Troubleshooting */}
          {error && (
            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
                Still having issues? Click for troubleshooting tips
              </summary>
              <div className="mt-2 space-y-1">
                {instructions.troubleshooting.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-3 h-3 mt-1 flex-shrink-0" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </details>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 pt-4">
            <Button onClick={onRetry} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>

          {/* Additional help */}
          <div className="text-xs text-gray-500 text-center">
            Make sure you're using a secure (HTTPS) connection and your camera isn't being used by another app.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CameraPermissionDialog;
