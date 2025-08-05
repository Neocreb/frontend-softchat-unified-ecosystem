import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface DashboardRouteGuardProps {
  children: React.ReactNode;
}

/**
 * Route guard for freelance dashboard to ensure proper authentication
 * and provide loading states
 */
export const DashboardRouteGuard: React.FC<DashboardRouteGuardProps> = ({
  children,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading Freelance Dashboard...
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we prepare your workspace
          </p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth?redirect=/app/freelance/dashboard" replace />;
  }

  // Show error state if user is not properly loaded
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <span className="text-2xl text-red-600">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Unable to Load Dashboard
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            There was an issue loading your profile. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Render the dashboard if everything is okay
  return <>{children}</>;
};

export default DashboardRouteGuard;
