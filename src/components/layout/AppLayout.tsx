import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Header from "./Header";
import FooterNav from "./FooterNav";
import DesktopFooter from "./DesktopFooter";
import ModernSidebar from "./ModernSidebar";
import CreatorStudioFAB from "@/components/video/CreatorStudioFAB";
import AIAssistantFAB from "@/components/ai/AIAssistantFAB";
import { useIsMobile } from "@/hooks/use-mobile";

const AppLayout = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Full-screen pages (videos, chat)
  const isFullScreenPage = location.pathname === "/videos" || location.pathname === "/chat";

  // Check if we're on a page that should have minimal layout
  const isMinimalLayout = isFullScreenPage;

  if (isVideoPage) {
    return (
      <div className="min-h-screen bg-background">
        <Outlet />
        {isMobile && <FooterNav />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Header - Cleaner design */}
      <Header
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Modern Sidebar - Only show on non-minimal layouts */}
        {!isMinimalLayout && (
          <ModernSidebar
            collapsed={sidebarCollapsed}
            isOpen={isMobile ? mobileMenuOpen : true}
            onClose={() => setMobileMenuOpen(false)}
            isMobile={isMobile}
          />
        )}

        {/* Main content area */}
        <main className={`flex-1 overflow-hidden ${!isMinimalLayout && !isMobile ? (sidebarCollapsed ? 'ml-16' : 'ml-72') : ''}`}>

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