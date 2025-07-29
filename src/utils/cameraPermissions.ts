export interface CameraError {
  type: 'permission-denied' | 'not-found' | 'not-readable' | 'unknown';
  message: string;
  userAction: string;
}

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
    
    // If camera is explicitly denied, return error
    if (permissions.camera === 'denied') {
      return {
        success: false,
        error: 'Camera permission denied. Please enable camera access in your browser settings.',
        permissionState: 'denied'
      };
    }

    try {
      // First attempt: Request full camera and audio access
      const stream = await navigator.mediaDevices.getUserMedia({
        video,
        audio
      });

      console.log('Camera access granted successfully');
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
        return {
          success: false,
          error: 'Camera permission denied. Please click the camera icon in your address bar and allow access.',
          permissionState: 'denied'
        };
      }

      if (errorName === 'NotFoundError') {
        return {
          success: false,
          error: 'No camera device found. Please connect a camera to start streaming.',
          permissionState: 'denied'
        };
      }

      if (errorName === 'NotReadableError') {
        return {
          success: false,
          error: 'Camera is being used by another application. Please close other apps and try again.',
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

          console.log('Fallback to audio-only mode successful');
          return {
            success: true,
            stream: audioStream,
            permissionState: 'granted'
          };

        } catch (audioError) {
          console.error('Audio fallback failed:', audioError);
        }
      }

      return {
        success: false,
        error: errorMessage || 'Unable to access camera. Please check your camera settings and try again.',
        permissionState: 'denied'
      };
    }
  }

  async retryWithSimpleConstraints(): Promise<CameraPermissionResult> {
    try {
      // Try with minimal constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      console.log('Camera connected with simple constraints');
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

  getPermissionInstructions(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('chrome')) {
      return '1. Click the camera icon in your address bar\n2. Select "Allow"\n3. Refresh the page';
    } else if (userAgent.includes('firefox')) {
      return '1. Click the shield/camera icon in the address bar\n2. Choose "Allow"\n3. Refresh the page';
    } else if (userAgent.includes('safari')) {
      return '1. Go to Safari > Settings > Websites > Camera\n2. Select "Allow" for this site\n3. Refresh the page';
    } else if (userAgent.includes('edge')) {
      return '1. Click the camera icon in the address bar\n2. Select "Allow"\n3. Refresh the page';
    }
    
    return '1. Look for camera/microphone icons in your browser\n2. Allow access to camera and microphone\n3. Refresh the page';
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

export function getPermissionHelp(): string {
  return cameraManager.getPermissionInstructions();
}

export function createCameraError(errorName: string, errorMessage: string): CameraError {
  if (errorName === 'NotAllowedError' || errorMessage.includes('Permission denied')) {
    return {
      type: 'permission-denied',
      message: 'Camera permission denied',
      userAction: 'Please allow camera access in your browser settings and refresh the page.'
    };
  }

  if (errorName === 'NotFoundError') {
    return {
      type: 'not-found',
      message: 'No camera device found',
      userAction: 'Please connect a camera device and try again.'
    };
  }

  if (errorName === 'NotReadableError') {
    return {
      type: 'not-readable',
      message: 'Camera is being used by another application',
      userAction: 'Please close other apps using your camera and try again.'
    };
  }

  return {
    type: 'unknown',
    message: errorMessage || 'Unknown camera error',
    userAction: 'Please check your camera settings and try again.'
  };
}

export function isCameraSupported(): boolean {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

export async function switchCamera(
  currentStream: MediaStream | null,
  facingMode: 'user' | 'environment',
  audioEnabled: boolean = true
): Promise<CameraPermissionResult> {
  // Stop current stream
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }

  // Request new stream with different camera
  return requestCameraPermission({
    video: { facingMode },
    audio: audioEnabled,
    fallbackToAudioOnly: false,
  });
}
