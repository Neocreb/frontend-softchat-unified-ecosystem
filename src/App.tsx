import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import { setupGlobalErrorHandlers } from "@/lib/error-handler";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AdminProvider } from "./contexts/AdminContext";
import { MarketplaceProvider } from "./contexts/MarketplaceContext";
import { EnhancedMarketplaceProvider } from "./contexts/EnhancedMarketplaceContext";
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

import AppLayout from "./components/layout/AppLayout";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import EnhancedFeed from "./pages/EnhancedFeed";
import EnhancedFreelance from "./pages/EnhancedFreelance";
import FreelanceJobs from "./pages/freelance/FreelanceJobs";
import RoleSwitcherDashboard from "./pages/freelance/RoleSwitcherDashboard";
import UpdateProfile from "./pages/freelance/UpdateProfile";
import BrowseJobs from "./pages/freelance/BrowseJobs";
import Earnings from "./pages/freelance/Earnings";
import PostJob from "./pages/freelance/PostJob";
import FindFreelancers from "./pages/freelance/FindFreelancers";
import ManageProjects from "./pages/freelance/ManageProjects";
import ApproveWork from "./pages/freelance/ApproveWork";
import JobDetailPage from "./pages/freelance/JobDetailPage";
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
import SellerDashboard from "./pages/marketplace/SellerDashboard";
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
import AdminGroupsPages from "./pages/admin/AdminGroupsPages";
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./components/layout/AdminLayout";
import EnhancedVideos from "./pages/EnhancedVideos";
import ImprovedVideos from "./pages/ImprovedVideos";
import EnhancedVideosV2 from "./pages/EnhancedVideosV2";
import TikTokStyleVideos from "./pages/TikTokStyleVideos";
import EnhancedTikTokVideos from "./pages/EnhancedTikTokVideos";
import CameraPermissionTest from "./components/debug/CameraPermissionTest";
import CreatorStudio from "./pages/CreatorStudio";
import Chat from "./pages/Chat";
import Messages from "./pages/Messages";
import Explore from "./pages/Explore";
import GlobalSearch from "./pages/GlobalSearch";
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
import SimpleBlog from "./pages/SimpleBlog";
import BlogPost from "./pages/BlogPost";
import CommunityEvents from "./pages/CommunityEvents";
import SubscriptionManager from "./components/premium/SubscriptionManager";
import VirtualGiftsAndTips from "./components/premium/VirtualGiftsAndTips";
import EnhancedKYCVerification from "./components/kyc/EnhancedKYCVerification";
import { LiveStreamCreator } from "./components/livestream/LiveStreamCreator";
import Groups from "./pages/Groups";
import Pages from "./pages/Pages";
import GroupDetailView from "./components/groups/GroupDetailView";
import PageDetailView from "./components/pages/PageDetailView";
import GroupManagement from "./pages/GroupManagement";
import PageManagement from "./pages/PageManagement";
import SendGifts from "./pages/SendGifts";
import {
  FriendsPage,
  AdsPage,
  MemoriesPage,
  SavedPage,
  SupportPage,
  HelpPage,
} from "./pages/PlaceholderPages";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiesPolicy from "./pages/CookiesPolicy";
import AdvertisingPolicy from "./pages/AdvertisingPolicy";
import AdChoices from "./pages/AdChoices";
import MonetizationPolicy from "./pages/MonetizationPolicy";
import Premium from "./pages/Premium";
import CampaignCenter from "./components/campaigns/CampaignCenter";

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

// Messages redirect component to handle threadId parameter
const MessagesRedirect = () => {
  const { threadId } = useParams();
  return <Navigate to={`/app/chat/${threadId}`} replace />;
};

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
    return <Navigate to="/app/feed" replace />;
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
      <Route
        path="/blog"
        element={
          <ErrorBoundary fallback={<SimpleBlog />}>
            <Blog />
          </ErrorBoundary>
        }
      />
      <Route path="/blog/:slug" element={<BlogPost />} />

      {/* Auth route - handle loading state and redirects */}
      <Route
        path="/auth"
        element={
          isAuthenticated ? <Navigate to="/app/feed" replace /> : <Auth />
        }
      />

      {/* Protected routes - only render when not loading */}
      {!isLoading && (
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <WalletProvider>
                <MarketplaceProvider>
                  <EnhancedMarketplaceProvider>
                    <ChatProvider>
                      <AppLayout />
                    </ChatProvider>
                  </EnhancedMarketplaceProvider>
                </MarketplaceProvider>
              </WalletProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="feed" replace />} />
          <Route path="feed" element={<EnhancedFeed />} />
          <Route path="create" element={<EnhancedFreelance />} />
          <Route path="freelance" element={<FreelanceJobs />} />
          <Route path="freelance/dashboard" element={<RoleSwitcherDashboard />} />
          <Route path="freelance/update-profile" element={<UpdateProfile />} />
          <Route path="freelance/browse-jobs" element={<BrowseJobs />} />
          <Route path="freelance/earnings" element={<Earnings />} />
          <Route path="freelance/post-job" element={<PostJob />} />
          <Route path="freelance/find-freelancers" element={<FindFreelancers />} />
          <Route path="freelance/manage-projects" element={<ManageProjects />} />
          <Route path="freelance/approve-work" element={<ApproveWork />} />
          <Route path="freelance/job/:jobId" element={<JobDetailPage />} />
          <Route path="chat" element={<Chat />} />
          <Route path="chat/:threadId" element={<ChatRoom />} />
          <Route
            path="messages"
            element={<Navigate to="/app/chat" replace />}
          />
          <Route path="messages/:threadId" element={<MessagesRedirect />} />
          <Route path="chat-demo" element={<ChatDemo />} />
          <Route path="profile" element={<EnhancedProfile />} />
          <Route path="profile/:username" element={<EnhancedProfile />} />
          <Route path="user/:username" element={<EnhancedProfile />} />
          <Route path="demo/profiles" element={<ProfileDemo />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="notifications" element={<Notifications />} />

          {/* Marketplace routes */}
          <Route path="marketplace" element={<EnhancedMarketplace />} />
          <Route
            path="marketplace/browse"
            element={<Navigate to="/app/marketplace" replace />}
          />
          <Route
            path="marketplace/products"
            element={<Navigate to="/app/marketplace" replace />}
          />
          <Route
            path="marketplace/shop"
            element={<Navigate to="/app/marketplace" replace />}
          />
          <Route path="marketplace/my" element={<MarketplaceDashboard />} />
          <Route path="marketplace/seller" element={<SellerDashboard />} />
          <Route path="marketplace/list" element={<MarketplaceList />} />
          <Route
            path="marketplace/seller/:username"
            element={<MarketplaceSeller />}
          />
          <Route
            path="marketplace/wishlist"
            element={<MarketplaceWishlist />}
          />
          <Route path="marketplace/cart" element={<MarketplaceCart />} />
          <Route
            path="marketplace/checkout"
            element={<MarketplaceCheckout />}
          />

          <Route path="crypto" element={<EnhancedCrypto />} />
          <Route path="campaigns" element={<CampaignCenter />} />
          <Route path="rewards" element={<EnhancedRewards />} />
          <Route path="videos" element={<EnhancedTikTokVideos />} />
          <Route path="videos-improved" element={<ImprovedVideos />} />
          <Route path="videos-enhanced" element={<EnhancedVideos />} />
          <Route path="explore" element={<Explore />} />
          <Route path="global-search" element={<GlobalSearch />} />
          <Route path="events" element={<CommunityEvents />} />
          <Route path="premium" element={<Premium />} />
          <Route
            path="kyc"
            element={
              <div className="container mx-auto px-4 py-6">
                <div className="max-w-4xl mx-auto">
                  <EnhancedKYCVerification onComplete={() => {
                    // Handle completion - could navigate back or show success
                    window.history.back();
                  }} />
                </div>
              </div>
            }
          />
          <Route
            path="live-streaming"
            element={
              <div className="container mx-auto px-4 py-6">
                <div className="max-w-6xl mx-auto">
                  <LiveStreamCreator />
                </div>
              </div>
            }
          />
          <Route path="settings" element={<EnhancedSettings />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />

          {/* Facebook-style navigation pages */}
          <Route path="friends" element={<FriendsPage />} />
          <Route path="groups" element={<Groups />} />
          <Route path="groups/:groupId" element={<GroupDetailView />} />
          <Route path="ads" element={<AdsPage />} />
          <Route path="memories" element={<MemoriesPage />} />
          <Route path="saved" element={<SavedPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="pages" element={<Pages />} />
          <Route path="pages/:pageId" element={<PageDetailView />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsOfService />} />
          <Route path="advertising" element={<AdvertisingPolicy />} />
          <Route path="ad-choices" element={<AdChoices />} />
          <Route path="monetization-policy" element={<MonetizationPolicy />} />
          <Route path="cookies" element={<CookiesPolicy />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="creator-studio" element={<CreatorStudio />} />
          <Route path="send-gifts" element={<SendGifts />} />
          <Route path="data" element={<DataManagement />} />
          <Route path="achievements" element={<GamificationSystem />} />
          <Route path="camera-test" element={<CameraPermissionTest />} />
          <Route
            path="ai-assistant"
            element={<AIPersonalAssistantDashboard />}
          />
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
        <Route path="groups-pages" element={<AdminGroupsPages />} />
      </Route>

      {/* Legacy route redirects */}
      <Route path="/feed" element={<Navigate to="/app/feed" replace />} />
      <Route
        path="/marketplace"
        element={<Navigate to="/app/marketplace" replace />}
      />
      <Route
        path="/marketplace/browse"
        element={<Navigate to="/app/marketplace" replace />}
      />
      <Route
        path="/marketplace/products"
        element={<Navigate to="/app/marketplace" replace />}
      />
      <Route
        path="/marketplace/shop"
        element={<Navigate to="/app/marketplace" replace />}
      />
      <Route
        path="/marketplace/cart"
        element={<Navigate to="/app/marketplace/cart" replace />}
      />
      <Route
        path="/marketplace/wishlist"
        element={<Navigate to="/app/marketplace/wishlist" replace />}
      />
      <Route
        path="/marketplace/checkout"
        element={<Navigate to="/app/marketplace/checkout" replace />}
      />
      <Route
        path="/marketplace/my"
        element={<Navigate to="/app/marketplace/my" replace />}
      />
      <Route
        path="/marketplace/seller"
        element={<Navigate to="/app/marketplace/seller" replace />}
      />
      <Route
        path="/marketplace/list"
        element={<Navigate to="/app/marketplace/list" replace />}
      />
      <Route path="/chat" element={<Navigate to="/app/chat" replace />} />
      <Route path="/profile" element={<Navigate to="/app/profile" replace />} />
      <Route path="/wallet" element={<Navigate to="/app/wallet" replace />} />

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
