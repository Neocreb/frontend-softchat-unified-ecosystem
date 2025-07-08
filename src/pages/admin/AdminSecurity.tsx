import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Shield,
  Lock,
  AlertTriangle,
  Eye,
  Ban,
  CheckCircle,
  Key,
  Globe,
  UserX,
  Activity,
  RefreshCw,
} from "lucide-react";

const AdminSecurity = () => {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorRequired: true,
    loginAttemptLimit: true,
    ipWhitelisting: false,
    sessionTimeout: true,
    passwordComplexity: true,
    emailVerification: true,
  });

  const securityAlerts = [
    {
      id: "1",
      type: "suspicious_login",
      severity: "high",
      message: "Multiple failed login attempts from IP: 192.168.1.100",
      timestamp: "2024-01-28 10:30:15",
      status: "investigating",
    },
    {
      id: "2",
      type: "unusual_trade",
      severity: "medium",
      message: "Large crypto trade detected outside normal patterns",
      timestamp: "2024-01-28 10:25:43",
      status: "resolved",
    },
    {
      id: "3",
      type: "account_compromise",
      severity: "critical",
      message: "Potential account takeover detected for user ID: 12345",
      timestamp: "2024-01-28 10:20:12",
      status: "blocked",
    },
  ];

  const suspiciousUsers = [
    {
      id: "1",
      username: "suspicious_user1",
      email: "fake@email.com",
      reason: "Multiple account creation from same IP",
      riskScore: 85,
      status: "flagged",
      lastSeen: "2024-01-28 09:45:00",
    },
    {
      id: "2",
      username: "crypto_scammer",
      email: "scam@fake.org",
      reason: "Fraudulent trading activity",
      riskScore: 95,
      status: "banned",
      lastSeen: "2024-01-27 15:30:00",
    },
    {
      id: "3",
      username: "bot_account",
      email: "bot@automated.com",
      reason: "Automated posting behavior",
      riskScore: 70,
      status: "monitoring",
      lastSeen: "2024-01-28 10:15:00",
    },
  ];

  const securityMetrics = [
    { name: "Blocked Attacks", value: "247", change: "-12%" },
    { name: "Failed Logins", value: "1.2K", change: "+8%" },
    { name: "Flagged Users", value: "23", change: "+5%" },
    { name: "Security Score", value: "94%", change: "+2%" },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-yellow-500 text-black";
      default:
        return "bg-blue-500 text-white";
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return "text-red-600";
    if (score >= 60) return "text-orange-600";
    if (score >= 40) return "text-yellow-600";
    return "text-green-600";
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setSecuritySettings((prev) => ({ ...prev, [setting]: value }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Security Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor security threats and manage platform protection
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Scan Now
          </Button>
          <Button variant="outline">
            <Shield className="h-4 w-4 mr-2" />
            Security Report
          </Button>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <CardTitle className="text-2xl font-bold">
                {metric.value}
              </CardTitle>
              <CardDescription>{metric.name}</CardDescription>
              <div
                className={`text-sm mt-1 ${
                  metric.change.startsWith("-")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {metric.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
          <TabsTrigger value="users">Suspicious Users</TabsTrigger>
          <TabsTrigger value="settings">Security Settings</TabsTrigger>
          <TabsTrigger value="firewall">Firewall</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Alerts</CardTitle>
              <CardDescription>
                Recent security threats and incidents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{alert.type}</Badge>
                        </div>
                        <h3 className="font-medium">{alert.message}</h3>
                        <p className="text-sm text-gray-600">
                          {alert.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={
                          alert.status === "resolved"
                            ? "default"
                            : alert.status === "blocked"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {alert.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Ban className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Suspicious Users</CardTitle>
              <CardDescription>
                Users flagged for suspicious or malicious activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suspiciousUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white">
                        <UserX className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{user.username}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-600">{user.reason}</p>
                        <p className="text-xs text-gray-500">
                          Last seen: {user.lastSeen}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">Risk Score</p>
                        <p
                          className={`text-lg font-bold ${getRiskScoreColor(user.riskScore)}`}
                        >
                          {user.riskScore}%
                        </p>
                      </div>
                      <Badge
                        variant={
                          user.status === "banned"
                            ? "destructive"
                            : user.status === "flagged"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {user.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Ban className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Configuration</CardTitle>
              <CardDescription>
                Configure platform security policies and requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-gray-600">
                      Require 2FA for all administrator accounts
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorRequired}
                    onCheckedChange={(value) =>
                      handleSettingChange("twoFactorRequired", value)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Login Attempt Limit</Label>
                    <p className="text-sm text-gray-600">
                      Block accounts after failed login attempts
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.loginAttemptLimit}
                    onCheckedChange={(value) =>
                      handleSettingChange("loginAttemptLimit", value)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">IP Whitelisting</Label>
                    <p className="text-sm text-gray-600">
                      Restrict admin access to specific IP addresses
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.ipWhitelisting}
                    onCheckedChange={(value) =>
                      handleSettingChange("ipWhitelisting", value)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Session Timeout</Label>
                    <p className="text-sm text-gray-600">
                      Automatically logout inactive sessions
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.sessionTimeout}
                    onCheckedChange={(value) =>
                      handleSettingChange("sessionTimeout", value)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Password Complexity</Label>
                    <p className="text-sm text-gray-600">
                      Enforce strong password requirements
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.passwordComplexity}
                    onCheckedChange={(value) =>
                      handleSettingChange("passwordComplexity", value)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Verification</Label>
                    <p className="text-sm text-gray-600">
                      Require email verification for new accounts
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.emailVerification}
                    onCheckedChange={(value) =>
                      handleSettingChange("emailVerification", value)
                    }
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="firewall" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Firewall & Protection</CardTitle>
              <CardDescription>
                Network security and access control configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Firewall Configuration
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Advanced firewall and network protection settings coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSecurity;
