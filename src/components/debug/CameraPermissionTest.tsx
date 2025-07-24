import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { 
  requestCameraAccess, 
  checkCameraPermissions, 
  isCameraSupported,
  CameraError
} from '@/utils/cameraPermissions';
import CameraPermissionDialog from '@/components/ui/camera-permission-dialog';

interface TestResult {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  details?: string;
}

const CameraPermissionTest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraError, setCameraError] = useState<CameraError | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);

  const addResult = (result: TestResult) => {
    setTestResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setTestResults([]);
    setCameraError(null);
  };

  const testBrowserSupport = () => {
    const isSupported = isCameraSupported();
    addResult({
      type: isSupported ? 'success' : 'error',
      message: `Browser Camera Support: ${isSupported ? 'Supported' : 'Not Supported'}`,
      details: isSupported 
        ? 'Your browser supports camera access via getUserMedia API'
        : 'Your browser does not support the getUserMedia API'
    });
  };

  const testPermissionStatus = async () => {
    const status = await checkCameraPermissions();
    addResult({
      type: status === 'granted' ? 'success' : status === 'denied' ? 'error' : 'warning',
      message: `Camera Permission Status: ${status || 'Unknown'}`,
      details: status 
        ? `Browser reports camera permission as: ${status}`
        : 'Browser does not support permission query API'
    });
  };

  const testCameraAccess = async () => {
    setIsLoading(true);
    
    try {
      const result = await requestCameraAccess({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });

      if (result.error) {
        setCameraError(result.error);
        addResult({
          type: 'error',
          message: 'Camera Access Failed',
          details: `${result.error.message}: ${result.error.userAction}`
        });
        setShowPermissionDialog(true);
      } else if (result.stream) {
        addResult({
          type: 'success',
          message: 'Camera Access Successful',
          details: 'Successfully obtained camera stream with requested constraints'
        });
        
        // Stop the stream after testing
        result.stream.getTracks().forEach(track => track.stop());
      }
    } catch (error) {
      addResult({
        type: 'error',
        message: 'Unexpected Error',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runAllTests = async () => {
    clearResults();
    testBrowserSupport();
    await testPermissionStatus();
    await testCameraAccess();
  };

  const getResultIcon = (type: TestResult['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Camera className="w-4 h-4 text-blue-500" />;
    }
  };

  const handleRetryCamera = () => {
    setShowPermissionDialog(false);
    setCameraError(null);
    testCameraAccess();
  };

  const handleCancelCamera = () => {
    setShowPermissionDialog(false);
    setCameraError(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Camera Permission Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={testBrowserSupport} variant="outline" size="sm">
              Test Browser Support
            </Button>
            <Button onClick={testPermissionStatus} variant="outline" size="sm">
              Check Permissions
            </Button>
            <Button 
              onClick={testCameraAccess} 
              variant="outline" 
              size="sm"
              disabled={isLoading}
            >
              {isLoading ? 'Testing...' : 'Test Camera Access'}
            </Button>
            <Button onClick={runAllTests} disabled={isLoading}>
              Run All Tests
            </Button>
            <Button onClick={clearResults} variant="ghost" size="sm">
              Clear Results
            </Button>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Test Results:</h3>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-2 p-3 rounded-lg border bg-gray-50 dark:bg-gray-900"
                  >
                    {getResultIcon(result.type)}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{result.message}</div>
                      {result.details && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {result.details}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <CameraPermissionDialog
        open={showPermissionDialog}
        onOpenChange={setShowPermissionDialog}
        error={cameraError}
        onRetry={handleRetryCamera}
        onCancel={handleCancelCamera}
      />
    </div>
  );
};

export default CameraPermissionTest;
