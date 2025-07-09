import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Header from "./Header";
import FooterNav from "./FooterNav";
import DesktopFooter from "./DesktopFooter";
import ModernSidebar from "./ModernSidebar";
import CreatorStudioFAB from "@/components/video/CreatorStudioFAB";
import AIAssistantFAB from "@/components/ai/AIAssistantFAB";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const AppLayout = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Full-screen pages (videos, chat)
  const isFullScreenPage =
    location.pathname === "/videos" || location.pathname === "/chat";

  // Full screen layout for specific pages
  if (isFullScreenPage) {
    return (
      <div className="min-h-screen bg-background">
        <Outlet />
        {isMobile && <FooterNav />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Clean, modern header */}
      <Header
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Modern organized sidebar */}
        <ModernSidebar
          collapsed={sidebarCollapsed}
          isOpen={isMobile ? mobileMenuOpen : true}
          onClose={() => setMobileMenuOpen(false)}
          isMobile={isMobile}
        />

        {/* Main content area */}
        <main
          className={cn(
            "flex-1 overflow-y-auto",
            !isMobile && (sidebarCollapsed ? "ml-16" : "ml-72"),
          )}
        >
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile navigation */}
      {isMobile && <FooterNav />}

      {/* Floating Action Buttons */}
      <CreatorStudioFAB />
      <AIAssistantFAB />

      {/* Desktop Footer */}
      {!isMobile && <DesktopFooter />}
    </div>
  );
};

export default AppLayout;
