/**
 * Enhanced camera permissions utility
 * Handles camera access, permission requests, and error scenarios
 */

export interface CameraError {
  type: 'permission-denied' | 'not-found' | 'not-readable' | 'overconstrained' | 'security' | 'unknown';
  message: string;
  userAction: string;
}

export interface CameraConstraints {
  video: {
    facingMode: 'user' | 'environment';
    width?: { ideal: number };
    height?: { ideal: number };
    frameRate?: { ideal: number };
  };
  audio: boolean;
}

/**
 * Check if browser supports camera access
 */
export const isCameraSupported = (): boolean => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

/**
 * Check current permission status for camera
 */
export const checkCameraPermissions = async (): Promise<PermissionState | null> => {
  if (!navigator.permissions) {
    return null;
  }

  try {
    const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
    return result.state;
  } catch (error) {
    console.warn('Permission query not supported:', error);
    return null;
  }
};

/**
 * Parse camera error and provide user-friendly information
 */
export const parseCameraError = (error: any): CameraError => {
  const errorName = error.name?.toLowerCase() || '';
  const errorMessage = error.message?.toLowerCase() || '';

  if (errorName === 'notallowederror' || errorMessage.includes('permission denied')) {
    return {
      type: 'permission-denied',
      message: 'Camera permission was denied',
      userAction: 'Please allow camera access in your browser settings and refresh the page'
    };
  }

  if (errorName === 'notfounderror' || errorMessage.includes('no device found')) {
    return {
      type: 'not-found',
      message: 'No camera device found',
      userAction: 'Please connect a camera device and try again'
    };
  }

  if (errorName === 'notreadableerror' || errorMessage.includes('not readable')) {
    return {
      type: 'not-readable',
      message: 'Camera is already in use by another application',
      userAction: 'Please close other apps using the camera and try again'
    };
  }

  if (errorName === 'overconstrainederror' || errorMessage.includes('overconstrained')) {
    return {
      type: 'overconstrained',
      message: 'Camera settings are not supported',
      userAction: 'The camera doesn\'t support the requested settings. Try switching cameras'
    };
  }

  if (errorName === 'securityerror' || errorMessage.includes('security')) {
    return {
      type: 'security',
      message: 'Camera access blocked for security reasons',
      userAction: 'Please ensure you\'re on a secure (HTTPS) connection'
    };
  }

  return {
    type: 'unknown',
    message: error.message || 'Unknown camera error occurred',
    userAction: 'Please try refreshing the page or contact support'
  };
};

/**
 * Request camera access with proper error handling
 */
export const requestCameraAccess = async (
  constraints: CameraConstraints
): Promise<{ stream: MediaStream | null; error: CameraError | null }> => {
  // Check browser support
  if (!isCameraSupported()) {
    return {
      stream: null,
      error: {
        type: 'unknown',
        message: 'Camera API not supported in this browser',
        userAction: 'Please use a modern browser that supports camera access'
      }
    };
  }

  // Check permission status first
  const permissionStatus = await checkCameraPermissions();
  if (permissionStatus === 'denied') {
    return {
      stream: null,
      error: {
        type: 'permission-denied',
        message: 'Camera permission is denied',
        userAction: 'Please enable camera permissions in your browser settings and refresh the page'
      }
    };
  }

  try {
    // Request camera access
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return { stream, error: null };
  } catch (error: any) {
    const cameraError = parseCameraError(error);
    console.error('Camera access failed:', error);
    return { stream: null, error: cameraError };
  }
};

/**
 * Stop camera stream safely
 */
export const stopCameraStream = (stream: MediaStream | null): void => {
  if (stream) {
    stream.getTracks().forEach(track => {
      track.stop();
    });
  }
};

/**
 * Get available camera devices
 */
export const getAvailableCameras = async (): Promise<MediaDeviceInfo[]> => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    return [];
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'videoinput');
  } catch (error) {
    console.error('Failed to enumerate camera devices:', error);
    return [];
  }
};

/**
 * Switch between front and back cameras
 */
export const switchCamera = async (
  currentStream: MediaStream | null,
  currentFacing: 'user' | 'environment',
  audioEnabled: boolean = true
): Promise<{ stream: MediaStream | null; facing: 'user' | 'environment'; error: CameraError | null }> => {
  // Stop current stream
  stopCameraStream(currentStream);

  const newFacing = currentFacing === 'user' ? 'environment' : 'user';
  
  const result = await requestCameraAccess({
    video: {
      facingMode: newFacing,
      width: { ideal: 720 },
      height: { ideal: 1280 }
    },
    audio: audioEnabled
  });

  return {
    stream: result.stream,
    facing: result.stream ? newFacing : currentFacing,
    error: result.error
  };
};

/**
 * Create permission request dialog content
 */
export const getCameraPermissionInstructions = (): {
  title: string;
  steps: string[];
  troubleshooting: string[];
} => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isChrome = userAgent.includes('chrome');
  const isFirefox = userAgent.includes('firefox');
  const isSafari = userAgent.includes('safari') && !userAgent.includes('chrome');
  const isEdge = userAgent.includes('edge');

  let steps: string[] = [];
  
  if (isChrome) {
    steps = [
      'Click the camera icon in the address bar',
      'Select "Always allow" for camera access',
      'Click "Done" and refresh the page'
    ];
  } else if (isFirefox) {
    steps = [
      'Click the shield icon in the address bar',
      'Click "Turn off Blocking" for camera',
      'Refresh the page and allow camera access'
    ];
  } else if (isSafari) {
    steps = [
      'Go to Safari > Settings for This Website',
      'Set Camera to "Allow"',
      'Refresh the page'
    ];
  } else if (isEdge) {
    steps = [
      'Click the camera icon in the address bar',
      'Select "Allow" for camera access',
      'Refresh the page'
    ];
  } else {
    steps = [
      'Look for a camera icon in your browser\'s address bar',
      'Click it and select "Allow" for camera access',
      'Refresh the page if needed'
    ];
  }

  return {
    title: 'Enable Camera Access',
    steps,
    troubleshooting: [
      'Make sure no other apps are using your camera',
      'Try refreshing the page',
      'Check your system camera privacy settings',
      'Restart your browser if issues persist'
    ]
  };
};
