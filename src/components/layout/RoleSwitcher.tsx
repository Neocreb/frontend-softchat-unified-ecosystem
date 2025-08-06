import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  User,
  Briefcase,
  ShoppingBag,
  Truck,
  Crown,
  ChevronDown,
  CheckCircle2,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface RoleConfig {
  role: UserRole;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  dashboardPath: string;
  color: string;
  requiresApproval?: boolean;
  comingSoon?: boolean;
}

const roleConfigs: RoleConfig[] = [
  {
    role: "user",
    label: "Social User",
    description: "Browse feed, chat, and connect with others",
    icon: User,
    dashboardPath: "/app/feed",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    role: "freelancer",
    label: "Freelancer",
    description: "Offer services and work on projects",
    icon: Briefcase,
    dashboardPath: "/app/freelance/dashboard",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  {
    role: "seller",
    label: "Marketplace Seller",
    description: "Sell products in the marketplace",
    icon: ShoppingBag,
    dashboardPath: "/app/marketplace/seller",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  },
  {
    role: "dispatch_rider",
    label: "Dispatch Partner",
    description: "Deliver packages and earn money",
    icon: Truck,
    dashboardPath: "/app/dispatch/dashboard",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    requiresApproval: true,
  },
  {
    role: "creator",
    label: "Content Creator",
    description: "Create and monetize content",
    icon: Crown,
    dashboardPath: "/app/creator-studio",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    comingSoon: true,
  },
];

export const RoleSwitcher: React.FC = () => {
  const { user, hasRole, activeRole, switchRole } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);

  if (!user) return null;

  const currentRoleConfig = roleConfigs.find(config => config.role === activeRole);
  const availableRoles = roleConfigs.filter(config => hasRole(config.role));
  const unavailableRoles = roleConfigs.filter(config => !hasRole(config.role));

  const handleRoleSwitch = async (newRole: UserRole) => {
    if (newRole === activeRole) return;

    setIsLoading(true);
    try {
      await switchRole(newRole);
      const roleConfig = roleConfigs.find(config => config.role === newRole);
      if (roleConfig) {
        navigate(roleConfig.dashboardPath);
        toast.success(`Switched to ${roleConfig.label} mode`);
      }
    } catch (error) {
      console.error("Error switching role:", error);
      toast.error("Failed to switch role");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRole = (role: UserRole) => {
    const roleConfig = roleConfigs.find(config => config.role === role);
    if (!roleConfig) return;

    if (roleConfig.comingSoon) {
      toast.info(`${roleConfig.label} is coming soon!`);
      return;
    }

    if (roleConfig.requiresApproval) {
      // Navigate to application page
      if (role === "dispatch_rider") {
        navigate("/app/dispatch/apply");
        toast.info("Complete the application to become a dispatch partner");
      }
    } else {
      // For roles that don't require approval, add them directly
      toast.info(`${roleConfig.label} application process not yet implemented`);
    }
    setShowRoleDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 min-w-0"
            disabled={isLoading}
          >
            {currentRoleConfig && (
              <>
                <currentRoleConfig.icon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline truncate">{currentRoleConfig.label}</span>
                <ChevronDown className="w-3 h-3 flex-shrink-0" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Active Role
          </DropdownMenuLabel>
          
          {currentRoleConfig && (
            <div className="px-2 py-1.5 mb-2">
              <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                <currentRoleConfig.icon className="w-5 h-5 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{currentRoleConfig.label}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {currentRoleConfig.description}
                  </p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              </div>
            </div>
          )}

          {availableRoles.length > 1 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Switch Role
              </DropdownMenuLabel>
              
              {availableRoles
                .filter(config => config.role !== activeRole)
                .map((roleConfig) => (
                  <DropdownMenuItem
                    key={roleConfig.role}
                    onClick={() => handleRoleSwitch(roleConfig.role)}
                    className="flex items-center gap-3 p-3 cursor-pointer"
                  >
                    <roleConfig.icon className="w-4 h-4" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{roleConfig.label}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {roleConfig.description}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowRoleDialog(true)}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400"
          >
            <Plus className="w-4 h-4" />
            Add New Role
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Add Role Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>
              Expand your capabilities by adding new roles to your account.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {unavailableRoles.map((roleConfig) => (
              <div
                key={roleConfig.role}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  roleConfig.comingSoon 
                    ? "opacity-60 cursor-not-allowed" 
                    : "hover:border-primary/50"
                }`}
                onClick={() => !roleConfig.comingSoon && handleAddRole(roleConfig.role)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <roleConfig.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm">{roleConfig.label}</h3>
                      {roleConfig.comingSoon && (
                        <Badge variant="secondary" className="text-xs">
                          Coming Soon
                        </Badge>
                      )}
                      {roleConfig.requiresApproval && (
                        <Badge variant="outline" className="text-xs">
                          Approval Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {roleConfig.description}
                    </p>
                    
                    {roleConfig.requiresApproval && !roleConfig.comingSoon && (
                      <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Application process required</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {unavailableRoles.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="font-medium text-lg mb-2">All Roles Available!</h3>
              <p className="text-muted-foreground">
                You have access to all available roles on the platform.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RoleSwitcher;
