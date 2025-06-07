import { Outlet } from "react-router-dom";
import Header from "./Header";
import FooterNav from "./FooterNav";
import { useIsMobile } from "@/hooks/use-mobile";

const AppLayout = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className={`container mx-auto px-4 py-6 ${isMobile ? 'pt-20 pb-20' : 'pt-6'}`}>
        <Outlet />
      </main>
      {isMobile && <FooterNav />}
    </div>
  );
};

export default AppLayout;