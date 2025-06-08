
import { Outlet } from "react-router-dom";
import EnhancedHeader from "./EnhancedHeader";
import FooterNav from "./FooterNav";
import { useAuth } from "@/contexts/AuthContext";
import AdminSidebar from "./AdminSidebar";

const AppLayout = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className="flex min-h-screen flex-col">
      <EnhancedHeader />
      <div className="flex flex-1 w-full max-w-screen-xl mx-auto">
        {isAdmin && <AdminSidebar />}
        <main className="flex-1 w-full pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>
      <FooterNav />
    </div>
  );
};

export default AppLayout;
