import React from 'react';
import { ExternalLink, Heart, MessageCircle, Share } from 'lucide-react';
import { adSettings } from '../../../config/adSettings';
import { cn } from '@/lib/utils';

interface FeedNativeAdCardProps {
  onClick?: () => void;
  className?: string;
}

export const FeedNativeAdCard: React.FC<FeedNativeAdCardProps> = ({ 
  onClick,
  className 
}) => {
  // Placeholder – Replace with real AdSense/Adsterra/PropellerAds SDK
  if (!adSettings.enableAds || !adSettings.adsEnabled) {
    return null;
  }

  return (
    <div className={cn(
      "bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden",
      className
    )}>
      
      {/* Post Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">AD</span>
          </div>
          
          {/* User Info */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-gray-900 dark:text-white">
                Sponsored Content
              </span>
              <div className="bg-gray-500/80 text-white text-xs px-2 py-0.5 rounded">
                {adSettings.adLabels.external}
              </div>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Advertisement • Just now
            </span>
          </div>
        </div>
        
        <ExternalLink className="w-4 h-4 text-gray-400" />
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-gray-900 dark:text-white mb-3">
          Discover amazing products and services tailored just for you! 
          <span className="text-purple-600 dark:text-purple-400"> Learn more</span>
        </p>
      </div>

      {/* Ad Image/Banner */}
      <div 
        className="relative aspect-video bg-gradient-to-br from-purple-200 to-blue-200 dark:from-purple-800 to-blue-800 cursor-pointer hover:opacity-90 transition-opacity"
        onClick={onClick}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-purple-700 dark:text-purple-300">
            <div className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
              <ExternalLink className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg mb-2">Your Ad Here</h3>
            <p className="text-sm opacity-80">Native advertisement space</p>
            <div className="text-xs opacity-60 mt-2">SDK Integration Ready</div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="p-4">
        <button 
          onClick={onClick}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg font-medium text-sm transition-colors"
        >
          Learn More
        </button>
      </div>

      {/* Post Actions (to mimic real posts) */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
            <Heart className="w-5 h-5" />
            <span className="text-sm">42</span>
          </button>
          <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">8</span>
          </button>
          <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors">
            <Share className="w-5 h-5" />
            <span className="text-sm">Share</span>
          </button>
        </div>
        
        <div className="text-xs text-gray-400">
          Sponsored
        </div>
      </div>

      {/* Future SDK Container */}
      <div 
        id="feed-native-ad"
        className="absolute inset-0 hidden"
        data-ad-slot="feed-native"
      >
      </div>
    </div>
  );
};
