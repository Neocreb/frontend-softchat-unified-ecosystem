import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface NavigationContextType {
  isNavVisible: boolean;
  toggleNav: () => void;
  hideNav: () => void;
  showNav: () => void;
  isVideoPage: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: React.ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const location = useLocation();
  
  // Check if current page is a video page
  const isVideoPage = location.pathname === '/app/videos' ||
    location.pathname.startsWith('/app/videos') ||
    location.pathname === '/app/videos-improved' ||
    location.pathname === '/app/videos-enhanced' ||
    location.pathname === '/app/live-streaming';

  // Auto-hide navigation on video pages
  useEffect(() => {
    if (isVideoPage) {
      const timer = setTimeout(() => {
        setIsNavVisible(false);
      }, 3000); // Hide after 3 seconds on video page

      return () => clearTimeout(timer);
    } else {
      setIsNavVisible(true);
    }
  }, [isVideoPage, location.pathname]);

  const toggleNav = () => {
    setIsNavVisible(prev => !prev);
  };

  const hideNav = () => {
    setIsNavVisible(false);
  };

  const showNav = () => {
    setIsNavVisible(true);
  };

  return (
    <NavigationContext.Provider
      value={{
        isNavVisible,
        toggleNav,
        hideNav,
        showNav,
        isVideoPage,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
