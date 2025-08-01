import { ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface MobileResponsiveWrapperProps {
  children: ReactNode;
  className?: string;
  mobileBreakpoint?: number;
}

export function MobileResponsiveWrapper({ 
  children, 
  className,
  mobileBreakpoint = 768 
}: MobileResponsiveWrapperProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mobileBreakpoint]);

  return (
    <div 
      className={cn(
        'w-full',
        'prevent-mobile-overflow',
        'mobile-text-content',
        isMobile && [
          'text-sm',           // Smaller text on mobile
          'px-3 py-2',         // Mobile padding
          'space-y-2',         // Mobile spacing
        ],
        !isMobile && [
          'text-base',         // Base text on desktop
          'px-6 py-4',         // Desktop padding
          'space-y-4',         // Desktop spacing
        ],
        className
      )}
    >
      {children}
    </div>
  );
}

export default MobileResponsiveWrapper;
