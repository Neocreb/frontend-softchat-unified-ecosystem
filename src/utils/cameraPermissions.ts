import { toast } from "@/hooks/use-toast";

export interface CameraPermissionResult {
  success: boolean;
  stream?: MediaStream;
  error?: string;
  permissionState?: 'granted' | 'denied' | 'prompt';
}

export interface CameraOptions {
  video?: boolean | MediaTrackConstraints;
  audio?: boolean | MediaTrackConstraints;
  fallbackToAudioOnly?: boolean;
  retryOnDenied?: boolean;
}

class CameraPermissionManager {
  private static instance: CameraPermissionManager;
  private permissionCache: Map<string, PermissionState> = new Map();

  static getInstance(): CameraPermissionManager {
    if (!CameraPermissionManager.instance) {
      CameraPermissionManager.instance = new CameraPermissionManager();
    }
    return CameraPermissionManager.instance;
  }

  async checkPermissions(): Promise<{ camera: PermissionState; microphone: PermissionState }> {
    try {
      const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      const microphonePermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      
      this.permissionCache.set('camera', cameraPermission.state);
      this.permissionCache.set('microphone', microphonePermission.state);
      
      return {
        camera: cameraPermission.state,
        microphone: microphonePermission.state,
      };
    } catch (error) {
      console.warn('Permission API not supported:', error);
      return {
        camera: 'prompt',
        microphone: 'prompt',
      };
    }
  }

  async requestCameraAccess(options: CameraOptions = {}): Promise<CameraPermissionResult> {
    const {
      video = {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user'
      },
      audio = true,
      fallbackToAudioOnly = true,
      retryOnDenied = false
    } = options;

    // Check current permissions
    const permissions = await this.checkPermissions();
    
    // If camera is explicitly denied, show helpful message
    if (permissions.camera === 'denied') {
      this.showPermissionDeniedHelp();
      return {
        success: false,
        error: 'Camera permission denied',
        permissionState: 'denied'
      };
    }

    try {
      // First attempt: Request full camera and audio access
      const stream = await navigator.mediaDevices.getUserMedia({
        video,
        audio
      });

      toast({
        title: "Camera Ready! 📹",
        description: "Camera and microphone access granted",
      });

      return {
        success: true,
        stream,
        permissionState: 'granted'
      };

    } catch (error) {
      console.error('Camera access failed:', error);
      
      // Parse the error type
      const errorName = (error as any)?.name || '';
      const errorMessage = (error as any)?.message || '';

      // Handle specific error types
      if (errorName === 'NotAllowedError' || errorMessage.includes('Permission denied')) {
        this.showPermissionDeniedHelp();
        return {
          success: false,
          error: 'Permission denied by user',
          permissionState: 'denied'
        };
      }

      if (errorName === 'NotFoundError') {
        this.showNoDeviceHelp();
        return {
          success: false,
          error: 'No camera device found',
          permissionState: 'denied'
        };
      }

      if (errorName === 'NotReadableError') {
        this.showDeviceBusyHelp();
        return {
          success: false,
          error: 'Camera is being used by another application',
          permissionState: 'denied'
        };
      }

      // Try fallback: Audio only
      if (fallbackToAudioOnly && video) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio
          });

          toast({
            title: "Audio Only Mode 🎤",
            description: "Camera unavailable, but microphone is working",
            variant: "default",
          });

          return {
            success: true,
            stream: audioStream,
            permissionState: 'granted'
          };

        } catch (audioError) {
          console.error('Audio fallback failed:', audioError);
        }
      }

      // Show generic error with retry option
      this.showGenericError(errorMessage, retryOnDenied);
      
      return {
        success: false,
        error: errorMessage,
        permissionState: 'denied'
      };
    }
  }

  private showPermissionDeniedHelp(): void {
    toast({
      title: "Camera Permission Required 🎥",
      description: "Please allow camera access in your browser settings",
      variant: "destructive",
      action: (
        <div className="flex flex-col gap-2">
          <button
            onClick={this.openPermissionHelp}
            className="text-sm underline text-blue-400 hover:text-blue-300"
          >
            How to enable camera?
          </button>
        </div>
      ),
    });
  }

  private showNoDeviceHelp(): void {
    toast({
      title: "No Camera Found 📹",
      description: "Please connect a camera device to start streaming",
      variant: "destructive",
    });
  }

  private showDeviceBusyHelp(): void {
    toast({
      title: "Camera In Use 🔒",
      description: "Close other apps using your camera and try again",
      variant: "destructive",
    });
  }

  private showGenericError(message: string, showRetry: boolean): void {
    toast({
      title: "Camera Error ❌",
      description: message || "Unable to access camera. Please check your settings.",
      variant: "destructive",
      action: showRetry ? (
        <button
          onClick={() => window.location.reload()}
          className="text-sm underline text-blue-400 hover:text-blue-300"
        >
          Retry
        </button>
      ) : undefined,
    });
  }

  private openPermissionHelp(): void {
    const userAgent = navigator.userAgent.toLowerCase();
    let helpUrl = 'https://support.google.com/chrome/answer/2693767';
    
    if (userAgent.includes('firefox')) {
      helpUrl = 'https://support.mozilla.org/en-US/kb/how-manage-your-camera-and-microphone-permissions';
    } else if (userAgent.includes('safari')) {
      helpUrl = 'https://support.apple.com/guide/safari/websites-ibrwe2159f50/mac';
    } else if (userAgent.includes('edge')) {
      helpUrl = 'https://support.microsoft.com/en-us/microsoft-edge/camera-and-microphone-permissions-in-microsoft-edge-87b0d8c2-c7e3-4a5b-9e8e-1c9b1e8d5e9f';
    }

    // Show help modal instead of opening external link
    toast({
      title: "Enable Camera Permissions 📹",
      description: "1. Click the camera icon in your address bar\n2. Select 'Allow'\n3. Refresh the page",
      variant: "default",
    });
  }

  async retryWithSimpleConstraints(): Promise<CameraPermissionResult> {
    try {
      // Try with minimal constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      toast({
        title: "Camera Connected! ✅",
        description: "Successfully connected to your camera",
      });

      return {
        success: true,
        stream,
        permissionState: 'granted'
      };

    } catch (error) {
      return this.requestCameraAccess({ fallbackToAudioOnly: true });
    }
  }

  stopStream(stream: MediaStream): void {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        console.log(`Stopped ${track.kind} track`);
      });
    }
  }

  async getAvailableDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return {
        cameras: devices.filter(device => device.kind === 'videoinput'),
        microphones: devices.filter(device => device.kind === 'audioinput'),
      };
    } catch (error) {
      console.error('Failed to enumerate devices:', error);
      return { cameras: [], microphones: [] };
    }
  }
}

// Export singleton instance
export const cameraManager = CameraPermissionManager.getInstance();

// Convenience functions
export async function requestCameraPermission(options?: CameraOptions): Promise<CameraPermissionResult> {
  return cameraManager.requestCameraAccess(options);
}

export async function checkCameraPermissions() {
  return cameraManager.checkPermissions();
}

export function stopCameraStream(stream: MediaStream): void {
  cameraManager.stopStream(stream);
}

export async function getAvailableCameras() {
  return cameraManager.getAvailableDevices();
}