import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { AdminRole } from "@/types/admin";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle } from "lucide-react";

interface AdminRouteProps {
  children: React.ReactNode;
  requiredRole?: AdminRole;
  requiredPermission?: string;
  fallbackPath?: string;
}

const AdminRoute: React.FC<AdminRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
  fallbackPath = "/admin/login",
}) => {
  const {
    isAdminAuthenticated,
    currentAdmin,
    hasRole,
    hasPermission,
    isLoading,
  } = useAdmin();
  const location = useLocation();

  // Debug logging
  React.useEffect(() => {
    console.log("AdminRoute check:", {
      isAdminAuthenticated,
      currentAdmin: !!currentAdmin,
      isLoading,
      location: location.pathname,
    });
  }, [isAdminAuthenticated, currentAdmin, isLoading, location.pathname]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-2">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-600 dark:text-gray-400">
              Verifying admin access...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated as admin
  if (!isAdminAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <div className="font-medium">Access Denied</div>
              <div>
                You need the <strong>{requiredRole.replace("_", " ")}</strong>{" "}
                role to access this page.
              </div>
              <div className="text-sm text-gray-600">
                Current roles: {currentAdmin?.roles.join(", ") || "None"}
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <div className="font-medium">Insufficient Permissions</div>
              <div>
                You need the <strong>{requiredPermission}</strong> permission to
                access this page.
              </div>
              <div className="text-sm text-gray-600">
                Contact a super administrator to request access.
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Render children if all checks pass
  return <>{children}</>;
};

export default AdminRoute;
