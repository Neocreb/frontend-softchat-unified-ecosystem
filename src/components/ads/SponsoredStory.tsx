import React from 'react';
import { Crown, ExternalLink } from 'lucide-react';
import { adSettings } from '../../../config/adSettings';
import { cn } from '@/lib/utils';

interface SponsoredStoryProps {
  title?: string;
  imageUrl?: string;
  isInternal?: boolean;
  onClick?: () => void;
  className?: string;
}

export const SponsoredStory: React.FC<SponsoredStoryProps> = ({ 
  title = "Sponsored",
  imageUrl,
  isInternal = false,
  onClick,
  className 
}) => {
  // Placeholder – Replace with real AdSense/Adsterra/PropellerAds SDK
  if (!adSettings.enableAds || !adSettings.adsEnabled) {
    return null;
  }

  const label = isInternal ? adSettings.adLabels.sponsored : adSettings.adLabels.external;

  return (
    <div className={cn(
      "relative flex-shrink-0 cursor-pointer group",
      className
    )}
    onClick={onClick}>
      
      {/* Story Container */}
      <div className="relative w-20 h-20 rounded-full p-0.5 bg-gradient-to-tr from-purple-500 to-blue-500">
        
        {/* Story Image/Content */}
        <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-purple-200 to-blue-200 dark:from-purple-800 to-blue-800 flex items-center justify-center">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center">
              {isInternal ? (
                <Crown className="w-6 h-6 text-purple-600 dark:text-purple-300 mx-auto" />
              ) : (
                <ExternalLink className="w-6 h-6 text-purple-600 dark:text-purple-300 mx-auto" />
              )}
            </div>
          )}
        </div>

        {/* Ad Label Badge */}
        <div className="absolute -top-1 -right-1 bg-gray-500/90 text-white text-xs px-1.5 py-0.5 rounded-full">
          {label}
        </div>
      </div>

      {/* Story Title */}
      <div className="mt-2 text-center">
        <p className="text-xs text-gray-700 dark:text-gray-300 truncate max-w-[80px]">
          {title}
        </p>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 rounded-full bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Future SDK Container */}
      <div 
        id="sponsored-story-ad"
        className="absolute inset-0 hidden"
        data-ad-slot="sponsored-story"
      >
      </div>
    </div>
  );
};

// Extended Story Ad for full-screen view
export const SponsoredStoryFull: React.FC<{
  onClose: () => void;
  isInternal?: boolean;
  className?: string;
}> = ({ 
  onClose, 
  isInternal = false,
  className 
}) => {
  const label = isInternal ? adSettings.adLabels.sponsored : adSettings.adLabels.advertisement;

  return (
    <div className={cn(
      "fixed inset-0 bg-black z-50 flex items-center justify-center",
      className
    )}>
      
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors z-10"
      >
        ×
      </button>

      {/* Ad Label */}
      <div className="absolute top-4 left-4 bg-black/70 text-white text-sm px-3 py-1 rounded z-10">
        {label}
      </div>

      {/* Story Content */}
      <div className="relative w-full max-w-md h-full bg-gradient-to-br from-purple-600 to-blue-600">
        
        {/* Story Ad Content */}
        <div className="absolute inset-0 flex items-center justify-center text-white text-center p-8">
          <div>
            {isInternal ? (
              <>
                <Crown className="w-16 h-16 mx-auto mb-4 opacity-80" />
                <h2 className="text-2xl font-bold mb-4">Softchat Premium</h2>
                <p className="text-lg opacity-90 mb-6">
                  Unlock exclusive features and boost your earning potential
                </p>
                <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold">
                  Upgrade Now
                </button>
              </>
            ) : (
              <>
                <ExternalLink className="w-16 h-16 mx-auto mb-4 opacity-80" />
                <h2 className="text-2xl font-bold mb-4">Advertisement</h2>
                <p className="text-lg opacity-90 mb-6">
                  Sponsored content placeholder
                </p>
                <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold">
                  Learn More
                </button>
              </>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute top-2 left-4 right-4 h-1 bg-white/30 rounded-full">
          <div className="h-full bg-white rounded-full w-1/3 transition-all duration-5000" />
        </div>
      </div>

      {/* Future SDK Container */}
      <div 
        id="sponsored-story-full-ad"
        className="absolute inset-0 hidden"
        data-ad-slot="sponsored-story-full"
      >
      </div>
    </div>
  );
};
