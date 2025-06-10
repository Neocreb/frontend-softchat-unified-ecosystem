import { Outlet } from "react-router-dom";
import Header from "./Header";
import FooterNav from "./FooterNav";
import { useIsMobile } from "@/hooks/use-mobile";

const AppLayout = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Add proper spacing for fixed header (h-16 = 4rem = 64px) + additional padding */}
      <main
        className={`container mx-auto px-4 ${isMobile ? "pt-20 pb-24" : "pt-20 pb-6"}`}
      >
        <Outlet />
      </main>
      {isMobile && <FooterNav />}
    </div>
  );
};

export default AppLayout;
