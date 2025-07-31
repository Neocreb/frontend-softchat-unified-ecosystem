import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Accessibility } from 'lucide-react';
import EnhancedAccessibilityFeatures from './EnhancedAccessibilityFeatures';

interface AccessibilityFABProps {
  videoElement?: HTMLVideoElement | null;
  className?: string;
}

const AccessibilityFAB: React.FC<AccessibilityFABProps> = ({ 
  videoElement, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`w-12 h-12 rounded-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 ${className}`}
          title="Accessibility Settings"
        >
          <Accessibility className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] bg-gray-900 border-gray-700 p-0">
        <VisuallyHidden>
          <DialogTitle>Accessibility Settings</DialogTitle>
        </VisuallyHidden>
        <div className="h-full overflow-auto p-6">
          <EnhancedAccessibilityFeatures 
            videoElement={videoElement}
            onSettingsChange={(settings) => {
              // Handle settings changes if needed
              console.log('Accessibility settings updated:', settings);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccessibilityFAB;
