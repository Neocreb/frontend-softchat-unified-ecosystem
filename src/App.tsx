
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AppLayout from "./components/layout/AppLayout";
import Auth from "./pages/Auth";
import EnhancedFeed from "./pages/EnhancedFeed";
import Profile from "./pages/Profile";
import Wallet from "./pages/Wallet";
import Marketplace from "./pages/Marketplace";
import CryptoMarket from "./pages/CryptoMarket";
import NotFound from "./pages/NotFound";
import Rewards from "./pages/Rewards";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import Videos from "./pages/Videos";
import Chat from "./pages/Chat";
import Explore from "./pages/Explore";

// Create a client
const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Admin route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// App routes component that uses auth context
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route path="/auth" element={
        isAuthenticated ? <Navigate to="/" replace /> : <Auth />
      } />
      
      <Route path="/" element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route index element={<EnhancedFeed />} />
        <Route path="profile" element={<Profile />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="crypto" element={<CryptoMarket />} />
        <Route path="rewards" element={<Rewards />} />
        <Route path="videos" element={<Videos />} />
        <Route path="chat" element={<Chat />} />
        <Route path="explore" element={<Explore />} />
        
        {/* Admin Routes */}
        <Route path="admin/dashboard" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="admin/users" element={
          <AdminRoute>
            <UserManagement />
          </AdminRoute>
        } />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <AppRoutes />
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
