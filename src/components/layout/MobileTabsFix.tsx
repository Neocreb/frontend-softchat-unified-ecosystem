import React from "react";

// Component to add styles for better mobile tab handling
const MobileTabsFix: React.FC = () => {
  return (
    <style jsx global>{`
      /* Ensure tab icons and text are fully visible on mobile */
      @media (max-width: 768px) {
        [role="tablist"] {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }

        [role="tab"] {
          flex-shrink: 0;
          min-width: 70px;
          white-space: nowrap;
        }

        /* Fix for tab content being cut off */
        .tab-trigger-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px 12px;
          min-height: 60px;
          justify-content: center;
        }

        /* Ensure tab icons are fully visible */
        .tab-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        /* Ensure tab text is fully visible */
        .tab-text {
          font-size: 10px;
          line-height: 1;
          text-align: center;
          white-space: nowrap;
          overflow: visible;
        }
      }
    `}</style>
  );
};

export default MobileTabsFix;
