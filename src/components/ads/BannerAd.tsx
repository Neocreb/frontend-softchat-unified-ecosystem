import React from 'react';
import { adSettings } from '../../../config/adSettings';
import { cn } from '@/lib/utils';

interface BannerAdProps {
  position?: 'top' | 'bottom' | 'center';
  className?: string;
  isMobile?: boolean;
}

export const BannerAd: React.FC<BannerAdProps> = ({ 
  position = 'center', 
  className,
  isMobile = false 
}) => {
  // Placeholder – Replace with real AdSense/Adsterra/PropellerAds SDK
  if (!adSettings.enableAds || !adSettings.adsEnabled) {
    return null;
  }

  const dimensions = isMobile 
    ? adSettings.bannerDimensions.mobile 
    : adSettings.bannerDimensions.desktop;

  return (
    <div className={cn(
      "relative flex items-center justify-center bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg overflow-hidden",
      className
    )}
    style={{
      width: isMobile ? '100%' : `${dimensions.width}px`,
      height: `${dimensions.height}px`,
      maxWidth: '100%'
    }}>
      {/* Ad Label */}
      <div className="absolute top-1 left-1 bg-gray-500/80 text-white text-xs px-1.5 py-0.5 rounded">
        {adSettings.adLabels.external}
      </div>
      
      {/* Placeholder Content */}
      <div className="text-center p-4">
        <div className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">
          Advertisement Space
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {dimensions.width} × {dimensions.height}
        </div>
        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          SDK Integration Ready
        </div>
      </div>

      {/* Future SDK Container */}
      <div 
        id={`banner-ad-${position}`}
        className="absolute inset-0 hidden"
        data-ad-slot="banner"
        data-position={position}
      >
        {/* Real ad content will be inserted here by SDK */}
      </div>
    </div>
  );
};
