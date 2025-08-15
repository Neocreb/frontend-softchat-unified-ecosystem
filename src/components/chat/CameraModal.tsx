import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Camera, 
  CameraOff, 
  RotateCcw, 
  Download, 
  X,
  Zap,
  Square
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoTaken: (photoDataUrl: string) => void;
  isMobile?: boolean;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onPhotoTaken,
  isMobile = false,
}) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    try {
      setError(null);
      
      if (stream) {
        stopCamera();
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setHasPermission(false);
      setError('Unable to access camera. Please check permissions.');
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions and try again.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to canvas
    ctx.drawImage(video, 0, 0);

    // Convert to data URL
    const photoDataUrl = canvas.toDataURL('image/png');
    setCapturedPhoto(photoDataUrl);

    toast({
      title: "Photo captured!",
      description: "Review your photo and save it as a sticker",
    });
  };

  const savePhoto = () => {
    if (capturedPhoto) {
      onPhotoTaken(capturedPhoto);
      setCapturedPhoto(null);
      onClose();
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
  };

  const downloadPhoto = () => {
    if (!capturedPhoto) return;

    const link = document.createElement('a');
    link.download = `camera_capture_${Date.now()}.png`;
    link.href = capturedPhoto;
    link.click();
  };

  if (hasPermission === false) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={cn(
          "max-w-md",
          isMobile && "w-full h-full max-w-none rounded-none"
        )}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CameraOff className="w-5 h-5 text-red-500" />
              Camera Permission Denied
            </DialogTitle>
            <DialogDescription>
              We need camera access to take photos for stickers. Please enable camera permissions and try again.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center p-8">
              <CameraOff className="w-16 h-16 mx-auto text-red-500 mb-4" />
              <p className="text-sm text-muted-foreground">
                {error || "Camera access is required to take photos"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={startCamera} className="flex-1">
                Try Again
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "max-w-2xl p-0 overflow-hidden",
        isMobile && "w-full h-full max-w-none rounded-none"
      )}>
        <div className="relative bg-black">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm">
            <div className="flex items-center justify-between p-4">
              <DialogTitle className="text-white flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Camera
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Camera View or Captured Photo */}
          <div className={cn(
            "relative overflow-hidden",
            isMobile ? "aspect-[3/4]" : "aspect-video"
          )}>
            {capturedPhoto ? (
              <img
                src={capturedPhoto}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {hasPermission === null && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                    <div className="text-center text-white">
                      <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Starting camera...</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-4">
            {capturedPhoto ? (
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={retakePhoto}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake
                </Button>
                <Button
                  variant="outline"
                  onClick={downloadPhoto}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={savePhoto}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Use as Sticker
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                {/* Switch Camera */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={switchCamera}
                  className="text-white hover:bg-white/20"
                  disabled={!stream}
                >
                  <RotateCcw className="w-6 h-6" />
                </Button>

                {/* Capture Button */}
                <Button
                  size="icon"
                  onClick={takePhoto}
                  disabled={!stream}
                  className="w-16 h-16 rounded-full bg-white hover:bg-gray-100 text-black"
                >
                  <Square className="w-8 h-8" />
                </Button>

                {/* Placeholder for symmetry */}
                <div className="w-12 h-12" />
              </div>
            )}
          </div>
        </div>

        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
};

export default CameraModal;
