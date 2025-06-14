import React, { useEffect } from "react";

// Component to add styles for better mobile tab handling
const MobileTabsFix: React.FC = () => {
  useEffect(() => {
    // Add global styles for mobile tab fixes
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      /* Ensure tab icons and text are fully visible on mobile */
      @media (max-width: 768px) {
        [role="tablist"] {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }

        [role="tab"] {
          flex-shrink: 0;
          min-width: 70px !important;
          white-space: nowrap;
        }

        /* Fix video page layout */
        .video-page-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 10;
        }

        /* Ensure mobile navigation doesn't interfere with videos */
        .video-full-screen {
          padding-bottom: 80px;
        }
      }
    `;

    document.head.appendChild(styleElement);

    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  return null;
};

export default MobileTabsFix;
