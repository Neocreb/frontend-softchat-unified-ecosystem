
import { Outlet } from "react-router-dom";
import EnhancedHeader from "./EnhancedHeader";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <EnhancedHeader />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
