import React from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { adSettings } from '../../../config/adSettings';
import { cn } from '@/lib/utils';

interface VideoInterstitialAdProps {
  onClick?: () => void;
  className?: string;
}

export const VideoInterstitialAd: React.FC<VideoInterstitialAdProps> = ({ 
  onClick,
  className 
}) => {
  // Placeholder – Replace with real AdSense/Adsterra/PropellerAds SDK
  if (!adSettings.enableAds || !adSettings.adsEnabled) {
    return null;
  }

  return (
    <div className={cn(
      "relative bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl overflow-hidden border border-purple-200 dark:border-purple-800 cursor-pointer hover:shadow-lg transition-all duration-300",
      className
    )}
    onClick={onClick}>
      
      {/* Ad Label */}
      <div className="absolute top-3 left-3 bg-gray-500/80 text-white text-xs px-2 py-1 rounded z-10">
        {adSettings.adLabels.external}
      </div>

      {/* Thumbnail Area */}
      <div className="relative aspect-video bg-gradient-to-br from-purple-300 to-blue-300 dark:from-purple-700 to-blue-700">
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/50 rounded-full p-4 hover:bg-black/70 transition-colors">
            <Play className="w-8 h-8 text-white fill-current" />
          </div>
        </div>

        {/* Placeholder Thumbnail Content */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/70 text-white p-3 rounded">
            <h4 className="font-semibold text-sm mb-1">Sponsored Content</h4>
            <p className="text-xs opacity-90">Advertisement placeholder video</p>
          </div>
        </div>
      </div>

      {/* Ad Content */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1 truncate">
              Sample Video Advertisement
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
              This is a placeholder for video interstitial ads that will be served by ad networks.
            </p>
            
            {/* Ad Metadata */}
            <div className="flex items-center gap-2 mt-2">
              <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                Sponsored Video
              </div>
              <div className="text-xs text-gray-400">
                • SDK Ready
              </div>
            </div>
          </div>
          
          <ExternalLink className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
        </div>
      </div>

      {/* Future SDK Container */}
      <div 
        id="video-interstitial-ad"
        className="absolute inset-0 hidden"
        data-ad-slot="video-interstitial"
      >
      </div>
    </div>
  );
};
