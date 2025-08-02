import React from 'react';
import { EnhancedAdminDashboard } from '../../components/admin/EnhancedAdminDashboard';
import { AdminPerformanceAnalytics } from '../../components/admin/AdminPerformanceAnalytics';
import { SystemManagementCenter } from '../../components/admin/SystemManagementCenter';
import { AuditSecurityCenter } from '../../components/admin/AuditSecurityCenter';
import { AdminCollaborationHub } from '../../components/admin/AdminCollaborationHub';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useAdminWebSocket } from '../../hooks/use-admin-websocket';
import { RealtimeAdminNotifications } from '../../components/admin/RealtimeAdminNotifications';

export default function EnhancedAdminDashboardPage() {
  const { isConnected, activeAdmins } = useAdminWebSocket();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Enhanced Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <span className="text-sm text-gray-600">
              {activeAdmins.length} admin{activeAdmins.length !== 1 ? 's' : ''} online
            </span>
          </div>
        </div>
        <RealtimeAdminNotifications />
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <EnhancedAdminDashboard />
        </TabsContent>

        <TabsContent value="collaboration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Collaboration Hub</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminCollaborationHub />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminPerformanceAnalytics />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Management</CardTitle>
            </CardHeader>
            <CardContent>
              <SystemManagementCenter />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit & Security</CardTitle>
            </CardHeader>
            <CardContent>
              <AuditSecurityCenter />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
