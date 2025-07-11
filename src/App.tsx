import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { setupGlobalErrorHandlers } from "@/lib/error-handler";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AdminProvider } from "./contexts/AdminContext";
import { MarketplaceProvider } from "./contexts/MarketplaceContext";
import { ChatProvider } from "./contexts/ChatContext";
import { WalletProvider } from "./contexts/WalletContext";
import SafeThemeProvider from "./contexts/SafeThemeProvider";
import { I18nProvider } from "./contexts/I18nContext";
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
import PerformanceMonitor from "./components/debug/PerformanceMonitor";
import AppLayout from "./components/layout/AppLayout";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import EnhancedFeed from "./pages/EnhancedFeed";
import EnhancedFreelance from "./pages/EnhancedFreelance";
import FreelanceJobs from "./pages/freelance/FreelanceJobs";
import FreelanceDashboard from "./pages/freelance/FreelanceDashboard";
import Inbox from "./chat/Inbox";
import ChatRoom from "./chat/ChatRoom";
import ChatDemo from "./pages/ChatDemo";
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
import AdminLogin from "./pages/AdminLogin";
import AdminManagement from "./pages/admin/AdminManagement";
import PlatformSettings from "./pages/admin/PlatformSettings";
import ContentModeration from "./pages/admin/ContentModeration";
import AdminMarketplace from "./pages/admin/AdminMarketplace";
import AdminCrypto from "./pages/admin/AdminCrypto";
import AdminFreelance from "./pages/admin/AdminFreelance";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminLogs from "./pages/admin/AdminLogs";
import AdminSecurity from "./pages/admin/AdminSecurity";
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./components/layout/AdminLayout";
import EnhancedVideos from "./pages/EnhancedVideos";
import ImprovedVideos from "./pages/ImprovedVideos";
import EnhancedVideosV2 from "./pages/EnhancedVideosV2";
import TikTokStyleVideos from "./pages/TikTokStyleVideos";
import CreatorStudio from "./pages/CreatorStudio";
import Chat from "./pages/Chat";
import Messages from "./pages/Messages";
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
import SubscriptionManager from "./components/premium/SubscriptionManager";
import VirtualGiftsAndTips from "./components/premium/VirtualGiftsAndTips";
import EnhancedKYCVerification from "./components/kyc/EnhancedKYCVerification";
import { LiveStreamCreator } from "./components/livestream/LiveStreamCreator";
import {
  FriendsPage,
  GroupsPage,
  AdsPage,
  MemoriesPage,
  SavedPage,
  SupportPage,
  PagesPage,
  PrivacyPage,
  TermsPage,
  AdvertisingPage,
  AdChoicesPage,
  CookiesPage,
  HelpPage,
} from "./pages/PlaceholderPages";

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

// Legacy admin route component for backward compatibility
interface LegacyAdminRouteProps {
  children: React.ReactNode;
}

const LegacyAdminRoute = ({ children }: LegacyAdminRouteProps) => {
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

  console.log("App routes: Auth state", { isAuthenticated, isLoading });

  return (
    <Routes>
      {/* Admin login - accessible without authentication */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Root path shows original feature-rich landing page */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/test" element={<TestComponent />} />
      <Route path="/home" element={<Home />} />

      {/* Public Blog routes - accessible to everyone */}
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />

      {/* Auth route - handle loading state and redirects */}
      <Route
        path="/auth"
        element={isAuthenticated ? <Navigate to="/feed" replace /> : <Auth />}
      />

      {/* Protected routes - only render when not loading */}
      {!isLoading && (
        <>
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <EnhancedFeed />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <EnhancedFreelance />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelance"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <FreelanceJobs />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelance/dashboard"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <FreelanceDashboard />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <Chat />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:threadId"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <ChatRoom />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route path="/messages" element={<Navigate to="/chat" replace />} />
          <Route
            path="/messages/:threadId"
            element={<Navigate to="/chat/:threadId" replace />}
          />
          <Route
            path="/chat-demo"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <ChatDemo />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <EnhancedProfile />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:username"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <EnhancedProfile />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/:username"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <EnhancedProfile />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/demo/profiles"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <ProfileDemo />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <Wallet />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <Notifications />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />

          {/* Marketplace routes */}
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <EnhancedMarketplace />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketplace/my"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <MarketplaceDashboard />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketplace/list"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <MarketplaceList />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketplace/seller/:username"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <MarketplaceSeller />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketplace/wishlist"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <MarketplaceWishlist />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketplace/cart"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <MarketplaceCart />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketplace/checkout"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <MarketplaceCheckout />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="/crypto"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <EnhancedCrypto />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/rewards"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <EnhancedRewards />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/videos"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <TikTokStyleVideos />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/videos-improved"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <ImprovedVideos />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/videos-enhanced"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <EnhancedVideos />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/explore"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <Explore />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <CommunityEvents />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/premium"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <div className="container mx-auto px-4 py-6">
                          <div className="max-w-4xl mx-auto">
                            <SubscriptionManager />
                            <div className="mt-8">
                              <VirtualGiftsAndTips />
                            </div>
                          </div>
                        </div>
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/kyc"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <div className="container mx-auto px-4 py-6">
                          <div className="max-w-4xl mx-auto">
                            <EnhancedKYCVerification />
                          </div>
                        </div>
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/live-streaming"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <div className="container mx-auto px-4 py-6">
                          <div className="max-w-6xl mx-auto">
                            <LiveStreamCreator />
                          </div>
                        </div>
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <EnhancedSettings />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <AnalyticsDashboard />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />

          {/* Facebook-style navigation pages */}
          <Route
            path="/friends"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <FriendsPage />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <GroupsPage />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ads"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <AdsPage />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/memories"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <MemoriesPage />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <SavedPage />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <SupportPage />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pages"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <PagesPage />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/privacy"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <PrivacyPage />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/terms"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <TermsPage />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/advertising"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <AdvertisingPage />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ad-choices"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <AdChoicesPage />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cookies"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <CookiesPage />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <HelpPage />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/creator-studio"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <CreatorStudio />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/data"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <DataManagement />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/achievements"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <GamificationSystem />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-assistant"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
                        <AIPersonalAssistantDashboard />
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai"
            element={
              <ProtectedRoute>
                <WalletProvider>
                  <MarketplaceProvider>
                    <ChatProvider>
                      <AppLayout>
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
                      </AppLayout>
                    </ChatProvider>
                  </MarketplaceProvider>
                </WalletProvider>
              </ProtectedRoute>
            }
          />
        </>
      )}

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="management" element={<AdminManagement />} />
        <Route path="settings" element={<PlatformSettings />} />
        <Route path="moderation" element={<ContentModeration />} />
        <Route path="marketplace" element={<AdminMarketplace />} />
        <Route path="crypto" element={<AdminCrypto />} />
        <Route path="freelance" element={<AdminFreelance />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="logs" element={<AdminLogs />} />
        <Route path="security" element={<AdminSecurity />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  console.log("App rendering");

  // Setup global error handlers for fetch aborts
  React.useEffect(() => {
    setupGlobalErrorHandlers();
  }, []);

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
          <ErrorBoundary
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-2">
                    Application Error
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Something went wrong. Please refresh the page.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded"
                  >
                    Refresh Page
                  </button>
                </div>
              </div>
            }
          >
            <I18nProvider>
              <AuthProvider>
                <AdminProvider>
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
                      <PerformanceMonitor />

                      {/* Toasters */}
                      <Toaster />
                      <Sonner />
                    </TooltipProvider>
                  </AccessibilityProvider>
                </AdminProvider>
              </AuthProvider>
            </I18nProvider>
          </ErrorBoundary>
        </SafeThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
