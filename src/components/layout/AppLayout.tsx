import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Header from "./Header";
import FooterNav from "./FooterNav";
import DesktopFooter from "./DesktopFooter";
import SecondaryNav from "./SecondaryNav";
import FacebookStyleSidebar from "./FacebookStyleSidebar";
import CreatorStudioFAB from "@/components/video/CreatorStudioFAB";
import AIAssistantFAB from "@/components/ai/AIAssistantFAB";
import { useIsMobile } from "@/hooks/use-mobile";

const AppLayout = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Video pages should have full-screen experience
  const isVideoPage = location.pathname === "/videos";

  if (isVideoPage) {
    return (
      <div className="min-h-screen bg-background">
        <Outlet />
        {/* Footer navigation for videos with special styling */}
        {isMobile && <FooterNav />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      {/* Secondary Navigation for user pages (desktop only) */}
      <SecondaryNav />

      {/* Facebook-style sidebar - Mobile and Desktop */}
      <FacebookStyleSidebar
        isOpen={isMobile ? mobileMenuOpen : true}
        onClose={() => setMobileMenuOpen(false)}
        isMobile={isMobile}
      />

      {/* Main content area with sidebar for desktop */}
      <div className="flex flex-1 overflow-hidden">
        {/* Spacer for desktop sidebar */}
        {!isMobile && <div className="w-80"></div>}

        {/* Main content */}
        <main
          className={`flex-1 overflow-y-auto ${
            isMobile ? "pt-14 pb-20 px-2" : "pt-0 pb-6 px-4 ml-80" // ml-80 to account for sidebar width
          }`}
        >
          <div className="w-full max-w-full mx-auto">
            <div className={`${isMobile ? "py-2" : "py-4"}`}>
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      {/* Creator Studio Floating Action Button */}
      <CreatorStudioFAB />
      {/* AI Assistant Floating Action Button */}
      <AIAssistantFAB />
      {/* Desktop Footer */}
      {!isMobile && <DesktopFooter />}
      {/* Mobile Footer Navigation */}
      {isMobile && <FooterNav />}
    </div>
  );
};

export default AppLayout;
