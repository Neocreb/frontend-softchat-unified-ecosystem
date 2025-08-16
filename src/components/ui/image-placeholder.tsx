import React from 'react';
import { Package, User, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImagePlaceholderProps {
  type?: 'product' | 'avatar' | 'category' | 'hero';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  children?: React.ReactNode;
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16', 
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
};

const iconMap = {
  product: Package,
  avatar: User,
  category: Package,
  hero: ImageIcon,
};

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  type = 'product',
  size = 'md',
  className,
  children,
}) => {
  const Icon = iconMap[type];
  
  return (
    <div 
      className={cn(
        'bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center',
        sizeClasses[size],
        className
      )}
    >
      {children || (
        <Icon className="w-1/2 h-1/2 text-gray-400" />
      )}
    </div>
  );
};

interface ProductImageProps {
  src?: string;
  alt?: string;
  className?: string;
  fallback?: React.ReactNode;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt = 'Product image',
  className,
  fallback,
}) => {
  const [hasError, setHasError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(!!src);

  React.useEffect(() => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
    } else {
      setHasError(false);
      setIsLoading(true);
    }
  }, [src]);

  if (!src || hasError) {
    return (
      <ImagePlaceholder 
        type="product" 
        className={cn('w-full h-full', className)}
      >
        {fallback}
      </ImagePlaceholder>
    );
  }

  return (
    <div className={cn('relative w-full h-full', className)}>
      {isLoading && (
        <ImagePlaceholder 
          type="product" 
          className="absolute inset-0 animate-pulse"
        />
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          'w-full h-full object-cover',
          isLoading ? 'opacity-0' : 'opacity-100',
          'transition-opacity duration-300'
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
};

export default ImagePlaceholder;
