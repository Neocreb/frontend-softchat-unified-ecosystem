import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import UnifiedHeader from "./UnifiedHeader";
import FooterNav from "./FooterNav";
import DesktopFooter from "./DesktopFooter";
import SecondaryNav from "./SecondaryNav";
import FacebookStyleSidebar from "./FacebookStyleSidebar";
import CreatorStudioFAB from "@/components/video/CreatorStudioFAB";
import AIAssistantFAB from "@/components/ai/AIAssistantFAB";
import FreelanceFAB from "@/components/freelance/FreelanceFAB";
import { useIsMobile } from "@/hooks/use-mobile";
import { themeClasses, cn } from "@/utils/themeUtils";

const AppLayout = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Video pages should have full-screen experience
  const isVideoPage = location.pathname === "/app/videos";

  if (isVideoPage) {
    return (
      <div className={cn(themeClasses.background, "min-h-screen")}>
        <Outlet />
        {/* Video pages handle their own navigation */}
      </div>
    );
  }

  return (
    <div className={cn(themeClasses.background, "min-h-screen flex flex-col")}>
      <UnifiedHeader
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      {/* Secondary Navigation for user pages (desktop only) */}
      <SecondaryNav />

      {/* Main content area with sidebar for desktop */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Facebook-style sidebar - positioned for desktop, overlay for mobile */}
        {!isMobile && (
          <div className="fixed left-0 top-14 bottom-0 w-80 z-30">
            <FacebookStyleSidebar
              isOpen={true}
              onClose={() => setMobileMenuOpen(false)}
              isMobile={false}
            />
          </div>
        )}

        {/* Mobile sidebar */}
        {isMobile && (
          <FacebookStyleSidebar
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            isMobile={true}
          />
        )}

        {/* Spacer for desktop sidebar */}
        {!isMobile && <div className="w-80 flex-shrink-0"></div>}

        {/* Main content */}
        <main
          className={`flex-1 overflow-y-auto ${
            isMobile ? "pt-14 pb-20 px-2" : "pt-2 pb-4 px-4"
          }`}
        >
          <div className="w-full max-w-full mx-auto">
            <div className={`${isMobile ? "py-1" : "py-2"}`}>
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Footer navigation for mobile */}
      {isMobile && <FooterNav />}

      {/* Floating Action Buttons */}
      <CreatorStudioFAB />
      <AIAssistantFAB />
      <FreelanceFAB />

      {/* Desktop footer */}
      {!isMobile && <DesktopFooter />}
    </div>
  );
};

export default AppLayout;
