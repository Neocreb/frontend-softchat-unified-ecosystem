
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
import Index from "./pages/Index";

// Create a query client
const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
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
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  if (!isAdmin()) {
    return <Navigate to="/feed" replace />;
  }
  
  return <>{children}</>;
};

// App routes component that uses auth context
const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // If still loading auth state, show splash screen
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Softchat...</p>
        </div>
      </div>
    );
  }
  
  return (
    <Routes>
      {/* Root path redirects based on auth state */}
      <Route path="/" element={<Index />} />
      
      {/* Auth route - redirects to feed if already authenticated */}
      <Route path="/auth" element={
        isAuthenticated ? <Navigate to="/feed" replace /> : <Auth />
      } />
      
      {/* Protected routes inside app layout */}
      <Route path="/" element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route path="feed" element={<EnhancedFeed />} />
        <Route path="profile" element={<Profile />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="crypto" element={<CryptoMarket />} />
        <Route path="rewards" element={<Rewards />} />
        <Route path="videos" element={<Videos />} />
        <Route path="chat" element={<Chat />} />
        <Route path="explore" element={<Explore />} />
      </Route>
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AppLayout />
        </AdminRoute>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
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
