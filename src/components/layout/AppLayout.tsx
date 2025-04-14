
import { Outlet } from "react-router-dom";
import EnhancedHeader from "./EnhancedHeader";
import { useAuth } from "@/contexts/AuthContext";
import AdminSidebar from "./AdminSidebar";

const AppLayout = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className="flex min-h-screen flex-col">
      <EnhancedHeader />
      <div className="flex flex-1">
        {isAdmin && <AdminSidebar />}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
