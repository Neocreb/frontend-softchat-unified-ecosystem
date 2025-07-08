import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { useNotification } from "@/hooks/use-notification";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    mfaCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [requiresMFA, setRequiresMFA] = useState(false);

  const navigate = useNavigate();
  const notification = useNotification();
  const { loginAsAdmin, isAdminAuthenticated, isLoading } = useAdmin();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAdminAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await loginAsAdmin(
        credentials.email,
        credentials.password,
      );

      if (result.success) {
        notification.success("Welcome to the admin panel!");
        navigate("/admin/dashboard");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      setError("An unexpected error occurred");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Access</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Secure login for platform administrators
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            This is a restricted area. All access attempts are logged and
            monitored.
          </AlertDescription>
        </Alert>

        {/* Login Form */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl text-center flex items-center justify-center gap-2">
              <Lock className="w-5 h-5" />
              Administrator Login
            </CardTitle>
            <CardDescription className="text-center">
              Enter your admin credentials to access the control panel
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@softchat.com"
                  value={credentials.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your secure password"
                    value={credentials.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    required
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* MFA Field (if required) */}
              {requiresMFA && (
                <div className="space-y-2">
                  <Label htmlFor="mfaCode">
                    Two-Factor Authentication Code
                  </Label>
                  <Input
                    id="mfaCode"
                    type="text"
                    placeholder="000000"
                    value={credentials.mfaCode}
                    onChange={(e) =>
                      handleInputChange("mfaCode", e.target.value)
                    }
                    maxLength={6}
                    className="h-11 text-center text-lg tracking-widest"
                  />
                </div>
              )}

              {/* Error Display */}
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Secure Login
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-4">
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              SSL Encrypted
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Activity Monitored
            </Badge>
            <Badge variant="secondary" className="text-xs">
              MFA Protected
            </Badge>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            SoftChat Admin Panel v2.0 • Unauthorized access is prohibited
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
