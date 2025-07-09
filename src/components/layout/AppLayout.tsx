import { Outlet, useLocation } from "react-router-dom";
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
      <Header />
      {/* Secondary Navigation for user pages (desktop only) */}
      <SecondaryNav />

      {/* Main content area with sidebar for desktop */}
      <div className="flex flex-1 overflow-hidden">
        {/* Facebook-style sidebar - Desktop only */}
        {!isMobile && (
          <div className="fixed left-0 top-20 bottom-0 z-10">
            <FacebookStyleSidebar />
          </div>
        )}

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
