import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedVideoCall } from '../chat/EnhancedVideoCall';
import { Video, Phone } from 'lucide-react';

const VideoCallTest: React.FC = () => {
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video'>('video');

  const mockCallData = {
    participant: {
      id: 'test-user',
      name: 'Test User',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    type: callType,
    isIncoming: false,
    isGroup: false,
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Enhanced Video Call Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          This component tests the fixes for:
        </div>
        <ul className="text-sm space-y-1 ml-4 list-disc">
          <li>DialogContent accessibility (VisuallyHidden DialogTitle)</li>
          <li>Screen sharing permission error handling</li>
        </ul>
        
        <div className="space-y-2">
          <Button
            onClick={() => {
              setCallType('video');
              setShowVideoCall(true);
            }}
            className="w-full"
          >
            <Video className="w-4 h-4 mr-2" />
            Test Video Call
          </Button>
          
          <Button
            onClick={() => {
              setCallType('voice');
              setShowVideoCall(true);
            }}
            variant="outline"
            className="w-full"
          >
            <Phone className="w-4 h-4 mr-2" />
            Test Voice Call
          </Button>
        </div>

        <div className="text-xs text-gray-500 border-t pt-2">
          <strong>Test Instructions:</strong>
          <br />
          1. Open browser console to verify no accessibility warnings
          <br />
          2. Try screen sharing to test improved error handling
          <br />
          3. DialogTitle should be present but visually hidden
        </div>

        <EnhancedVideoCall
          isOpen={showVideoCall}
          onClose={() => setShowVideoCall(false)}
          callData={mockCallData}
          onAccept={() => console.log('Call accepted')}
          onDecline={() => console.log('Call declined')}
          onMute={(muted) => console.log('Mute toggled:', muted)}
          onVideoToggle={(enabled) => console.log('Video toggled:', enabled)}
          onScreenShare={(sharing) => console.log('Screen share toggled:', sharing)}
        />
      </CardContent>
    </Card>
  );
};

export default VideoCallTest;
