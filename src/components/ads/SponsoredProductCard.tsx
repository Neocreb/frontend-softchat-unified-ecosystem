import React from 'react';
import { Star, ShoppingCart, ExternalLink, Crown } from 'lucide-react';
import { adSettings } from '../../../config/adSettings';
import { cn } from '@/lib/utils';

interface SponsoredProductCardProps {
  title?: string;
  price?: string;
  originalPrice?: string;
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
  isSponsored?: boolean;
  onClick?: () => void;
  className?: string;
}

export const SponsoredProductCard: React.FC<SponsoredProductCardProps> = ({ 
  title = "Premium Product",
  price = "$29.99",
  originalPrice = "$39.99",
  rating = 4.8,
  reviewCount = 127,
  imageUrl,
  isSponsored = true,
  onClick,
  className 
}) => {
  // Placeholder – Replace with real AdSense/Adsterra/PropellerAds SDK
  if (!adSettings.enableAds || !adSettings.adsEnabled) {
    return null;
  }

  return (
    <div className={cn(
      "bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer",
      isSponsored && "border-purple-200 dark:border-purple-800",
      className
    )}
    onClick={onClick}>
      
      {/* Product Image */}
      <div className="relative aspect-square">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-200 to-blue-200 dark:from-purple-800 to-blue-800 flex items-center justify-center">
            <div className="text-center text-purple-700 dark:text-purple-300">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2" />
              <div className="text-sm font-medium">Product Image</div>
            </div>
          </div>
        )}
        
        {/* Sponsored Label */}
        {isSponsored && (
          <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Crown className="w-3 h-3" />
            {adSettings.adLabels.sponsored}
          </div>
        )}

        {/* Discount Badge */}
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          25% OFF
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-2 line-clamp-2">
          {title}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className={cn(
                  "w-3 h-3",
                  i < Math.floor(rating) 
                    ? "text-yellow-400 fill-current" 
                    : "text-gray-300 dark:text-gray-600"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            {rating} ({reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-lg text-purple-600 dark:text-purple-400">
            {price}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {originalPrice}
            </span>
          )}
        </div>

        {/* CTA Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>

        {/* Sponsored Footer */}
        {isSponsored && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1">
              <Crown className="w-3 h-3" />
              Promoted Product
            </div>
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </div>
        )}
      </div>

      {/* Future SDK Container */}
      <div 
        id="sponsored-product-ad"
        className="absolute inset-0 hidden"
        data-ad-slot="sponsored-product"
      >
      </div>
    </div>
  );
};
