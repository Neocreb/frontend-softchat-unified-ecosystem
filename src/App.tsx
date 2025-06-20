import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { MarketplaceProvider } from "./contexts/MarketplaceContext";
import { ChatProvider } from "./contexts/ChatContext";
import SafeThemeProvider from "./contexts/SafeThemeProvider";
// import { I18nProvider } from "./contexts/I18nContext"; // Temporarily disabled
import ErrorBoundary from "./components/ui/error-boundary";

import {
  AccessibilityProvider,
  AccessibilityControlPanel,
  KeyboardNavigationHelper,
  ReadingGuide,
} from "./components/accessibility/AccessibilityFeatures";
import { OnboardingTour } from "./components/onboarding/OnboardingTour";
import { NotificationSystem } from "./components/notifications/NotificationSystem";
import {
  ConnectionStatus,
  PWAInstallPrompt,
} from "./components/mobile/MobileOptimizations";
import MobileLayoutChecker from "./components/layout/MobileLayoutChecker";
import AppLayout from "./components/layout/AppLayout";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import EnhancedFeed from "./pages/EnhancedFeed";
import EnhancedFreelance from "./pages/EnhancedFreelance";
import EnhancedProfile from "./pages/EnhancedProfile";
import Wallet from "./pages/Wallet";
import Marketplace from "./pages/Marketplace";
import EnhancedMarketplace from "./pages/EnhancedMarketplace";
import MarketplaceCart from "./pages/marketplace/MarketplaceCart";
import MarketplaceCheckout from "./pages/marketplace/MarketplaceCheckout";
import MarketplaceList from "./pages/marketplace/MarketplaceList";
import MarketplaceSeller from "./pages/marketplace/MarketplaceSeller";
import MarketplaceWishlist from "./pages/marketplace/MarketplaceWishlist";
import MarketplaceDashboard from "./pages/marketplace/MarketplaceDashboard";
import CryptoMarket from "./pages/CryptoMarket";
import EnhancedCrypto from "./pages/EnhancedCrypto";
import NotFound from "./pages/NotFound";
import Rewards from "./pages/Rewards";
import EnhancedSettings from "./pages/EnhancedSettings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import EnhancedVideos from "./pages/EnhancedVideos";
import ImprovedVideos from "./pages/ImprovedVideos";
import EnhancedVideosV2 from "./pages/EnhancedVideosV2";
import CreatorStudio from "./pages/CreatorStudio";
import Chat from "./pages/Chat";
import Explore from "./pages/Explore";
import LandingPage from "./pages/LandingPage";
import TestComponent from "./pages/TestComponent";
import Notifications from "./pages/Notifications";
import Create from "./pages/Create";
import EnhancedPlatform from "./pages/EnhancedPlatform";
import EnhancedRewards from "./pages/EnhancedRewards";
import ProfileDemo from "./components/profile/ProfileDemo";
import AnalyticsDashboard from "./components/analytics/AnalyticsDashboard";
import DataManagement from "./components/data/DataManagement";
import GamificationSystem from "./components/gamification/GamificationSystem";
import AIFeatures from "./components/ai/AIFeatures";
import AIPersonalAssistantDashboard from "./components/ai/AIPersonalAssistant";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import CommunityEvents from "./pages/CommunityEvents";

// Create a query client with retry configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Only retry once to avoid excessive requests during auth issues
      refetchOnWindowFocus: false, // Disable refetching when window regains focus
    },
  },
});

// Protected route component - now properly typed
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth page if not authenticated
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }

  console.log("Authentication confirmed, rendering protected route");
  return <>{children}</>;
};

// Admin route component - now properly typed
interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking admin rights...</p>
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
    console.log("App routes: Auth is loading");
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Softchat...</p>
          <p className="text-xs text-muted-foreground mt-2">
            Initializing session
          </p>
        </div>
      </div>
    );
  }

  console.log("App routes: Auth state determined", { isAuthenticated });

  return (
    <Routes>
      {/* Root path shows original feature-rich landing page */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/test" element={<TestComponent />} />
      <Route path="/home" element={<Home />} />

      {/* Auth route - redirects to feed if already authenticated */}
      <Route
        path="/auth"
        element={isAuthenticated ? <Navigate to="/feed" replace /> : <Auth />}
      />

      {/* Public Blog routes - accessible to everyone */}
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />

      {/* Protected routes inside app layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MarketplaceProvider>
              <ChatProvider>
                <AppLayout />
              </ChatProvider>
            </MarketplaceProvider>
          </ProtectedRoute>
        }
      >
        <Route path="feed" element={<EnhancedFeed />} />
        <Route path="create" element={<EnhancedFreelance />} />
        <Route path="profile" element={<EnhancedProfile />} />
        <Route path="profile/:username" element={<EnhancedProfile />} />
        <Route path="user/:username" element={<EnhancedProfile />} />
        <Route path="demo/profiles" element={<ProfileDemo />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="messages" element={<Navigate to="/chat" replace />} />

        {/* Marketplace routes */}
        <Route path="marketplace" element={<EnhancedMarketplace />} />
        <Route path="marketplace/my" element={<MarketplaceDashboard />} />
        <Route path="marketplace/list" element={<MarketplaceList />} />
        <Route
          path="marketplace/seller/:username"
          element={<MarketplaceSeller />}
        />
        <Route path="marketplace/wishlist" element={<MarketplaceWishlist />} />
        <Route path="marketplace/cart" element={<MarketplaceCart />} />
        <Route path="marketplace/checkout" element={<MarketplaceCheckout />} />

        <Route path="crypto" element={<EnhancedCrypto />} />
        <Route path="rewards" element={<EnhancedRewards />} />
        <Route path="videos" element={<EnhancedVideosV2 />} />
        <Route path="videos-improved" element={<ImprovedVideos />} />
        <Route path="videos-enhanced" element={<EnhancedVideos />} />
        <Route path="chat" element={<Chat />} />
        <Route path="explore" element={<Explore />} />
        <Route path="events" element={<CommunityEvents />} />
        <Route path="settings" element={<EnhancedSettings />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="creator-studio" element={<CreatorStudio />} />
        <Route path="data" element={<DataManagement />} />
        <Route path="achievements" element={<GamificationSystem />} />
        <Route path="ai-assistant" element={<AIPersonalAssistantDashboard />} />
        <Route
          path="ai"
          element={
            <div className="space-y-6 p-6">
              <h1 className="text-2xl font-bold">AI Features</h1>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AIFeatures.SmartFeedCuration />
                <AIFeatures.AIContentAssistant />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AIFeatures.SmartPricePrediction />
                <AIFeatures.AutoContentModeration />
              </div>
            </div>
          }
        />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AppLayout />
          </AdminRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  console.log("App rendering");

  // Register service worker for PWA
  React.useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
    }
  }, []);

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <SafeThemeProvider>
          <ErrorBoundary fallback={<div>Loading application...</div>}>
            {/* <I18nProvider> Temporarily disabled to fix React hooks error */}
            <AuthProvider>
              <AccessibilityProvider>
                <TooltipProvider>
                  <AppRoutes />

                  {/* Global Components */}
                  <OnboardingTour />
                  <NotificationSystem />
                  <AccessibilityControlPanel />
                  <KeyboardNavigationHelper />
                  <ReadingGuide />
                  <ConnectionStatus />
                  <PWAInstallPrompt />
                  <MobileLayoutChecker />

                  {/* Toasters */}
                  <Toaster />
                  <Sonner />
                </TooltipProvider>
              </AccessibilityProvider>
            </AuthProvider>
            {/* </I18nProvider> Temporarily disabled */}
          </ErrorBoundary>
        </SafeThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
