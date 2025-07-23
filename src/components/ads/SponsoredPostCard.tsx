import React from 'react';
import { Heart, MessageCircle, Share, Bookmark, Crown } from 'lucide-react';
import { adSettings } from '../../../config/adSettings';
import { cn } from '@/lib/utils';

interface SponsoredPostCardProps {
  title?: string;
  content?: string;
  imageUrl?: string;
  ctaText?: string;
  onClick?: () => void;
  className?: string;
}

export const SponsoredPostCard: React.FC<SponsoredPostCardProps> = ({ 
  title = "Discover Softchat Premium",
  content = "Unlock exclusive features, priority support, and enhanced creator tools. Join thousands of creators already earning more with Softchat Premium!",
  imageUrl,
  ctaText = "Upgrade Now",
  onClick,
  className 
}) => {
  // This is for internal Softchat campaigns and promotions
  if (!adSettings.enableAds) {
    return null;
  }

  return (
    <div className={cn(
      "bg-white dark:bg-gray-900 rounded-xl border border-purple-200 dark:border-purple-800 overflow-hidden",
      className
    )}>
      
      {/* Post Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          {/* Softchat Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          
          {/* Softchat Info */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-gray-900 dark:text-white">
                Softchat
              </span>
              <div className="w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <div className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded">
                {adSettings.adLabels.sponsored}
              </div>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Official • Promoted
            </span>
          </div>
        </div>
        
        <Bookmark className="w-4 h-4 text-gray-400" />
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {content}
        </p>
      </div>

      {/* Sponsored Content Image */}
      {imageUrl ? (
        <div className="relative">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full aspect-video object-cover"
          />
        </div>
      ) : (
        <div className="relative aspect-video bg-gradient-to-br from-purple-500 to-blue-600">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <Crown className="w-16 h-16 mx-auto mb-3 opacity-80" />
              <h3 className="font-bold text-xl mb-2">Softchat Premium</h3>
              <p className="text-sm opacity-90 max-w-sm">
                Enhanced features for creators and businesses
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="p-4">
        <button 
          onClick={onClick}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-[1.02]"
        >
          {ctaText}
        </button>
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
            <Heart className="w-5 h-5" />
            <span className="text-sm">1.2k</span>
          </button>
          <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">89</span>
          </button>
          <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors">
            <Share className="w-5 h-5" />
            <span className="text-sm">Share</span>
          </button>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
          <Crown className="w-3 h-3" />
          <span>Softchat Official</span>
        </div>
      </div>
    </div>
  );
};
