import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Users, 
  Shield, 
  FileText, 
  DollarSign, 
  Gavel, 
  Settings,
  AlertTriangle,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  Star
} from 'lucide-react';

// Import all the new admin components
import { UserManagementCenter } from '../../components/admin/UserManagementCenter';
import { ContentModerationCenter } from '../../components/admin/ContentModerationCenter';
import { CampaignApprovalCenter } from '../../components/admin/CampaignApprovalCenter';
import { EscrowManagementCenter } from '../../components/admin/EscrowManagementCenter';
import { DisputeResolutionCenter } from '../../components/admin/DisputeResolutionCenter';
import { PlatformSettingsCenter } from '../../components/admin/PlatformSettingsCenter';
import { useAdminWebSocket } from '../../hooks/use-admin-websocket';
import { RealtimeAdminNotifications } from '../../components/admin/RealtimeAdminNotifications';

export default function ComprehensiveAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { isConnected, activeAdmins } = useAdminWebSocket();

  // Mock statistics data - replace with actual data from your APIs
  const stats = {
    totalUsers: 12847,
    activeUsers: 8934,
    suspendedUsers: 45,
    bannedUsers: 12,
    pendingContent: 234,
    flaggedContent: 67,
    activeCampaigns: 89,
    pendingCampaigns: 23,
    activeEscrows: 156,
    disputedEscrows: 8,
    openDisputes: 12,
    urgentDisputes: 3,
    totalRevenue: 124589.50,
    platformFees: 8234.60
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Comprehensive platform management and control center</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <Badge variant="outline">
              {activeAdmins.length} admin{activeAdmins.length !== 1 ? 's' : ''} online
            </Badge>
          </div>
        </div>
        <RealtimeAdminNotifications />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="escrow">Escrow</TabsTrigger>
          <TabsTrigger value="disputes">Disputes</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {stats.activeUsers.toLocaleString()} active
                      </Badge>
                      <Badge className="bg-red-100 text-red-800 text-xs">
                        {stats.suspendedUsers + stats.bannedUsers} restricted
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <FileText className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.pendingContent + stats.flaggedContent}</p>
                    <p className="text-sm text-gray-600">Content Review</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                        {stats.pendingContent} pending
                      </Badge>
                      <Badge className="bg-red-100 text-red-800 text-xs">
                        {stats.flaggedContent} flagged
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Shield className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.activeEscrows}</p>
                    <p className="text-sm text-gray-600">Active Escrows</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className="bg-blue-100 text-blue-800 text-xs">
                        {stats.activeEscrows} active
                      </Badge>
                      <Badge className="bg-red-100 text-red-800 text-xs">
                        {stats.disputedEscrows} disputed
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <div className="mt-1">
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        ${stats.platformFees.toLocaleString()} fees
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center space-y-2"
                  onClick={() => setActiveTab('users')}
                >
                  <Users className="w-6 h-6" />
                  <span>Manage Users</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center space-y-2"
                  onClick={() => setActiveTab('content')}
                >
                  <FileText className="w-6 h-6" />
                  <span>Moderate Content</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center space-y-2"
                  onClick={() => setActiveTab('campaigns')}
                >
                  <TrendingUp className="w-6 h-6" />
                  <span>Review Campaigns</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center space-y-2"
                  onClick={() => setActiveTab('disputes')}
                >
                  <Gavel className="w-6 h-6" />
                  <span>Resolve Disputes</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity and Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New user registration spike</p>
                      <p className="text-sm text-gray-600">+127 users in the last hour</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +15%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Campaign approval pending</p>
                      <p className="text-sm text-gray-600">High-value crypto campaign needs review</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Clock className="w-3 h-3 mr-1" />
                      Urgent
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dispute resolved successfully</p>
                      <p className="text-sm text-gray-600">Freelance project dispute - partial refund</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Resolved
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span>Priority Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-800">High-risk user activity detected</p>
                        <p className="text-sm text-red-600">User @suspicious_trader flagged for review</p>
                      </div>
                      <Button size="sm" variant="outline">Review</Button>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-yellow-800">Escrow deadline approaching</p>
                        <p className="text-sm text-yellow-600">Auto-release in 6 hours for ESC001</p>
                      </div>
                      <Button size="sm" variant="outline">Manage</Button>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-blue-800">Platform maintenance scheduled</p>
                        <p className="text-sm text-blue-600">Scheduled for tonight 2:00 AM UTC</p>
                      </div>
                      <Button size="sm" variant="outline">Configure</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="users">
          <UserManagementCenter />
        </TabsContent>

        {/* Content Moderation Tab */}
        <TabsContent value="content">
          <ContentModerationCenter />
        </TabsContent>

        {/* Campaign Approval Tab */}
        <TabsContent value="campaigns">
          <CampaignApprovalCenter />
        </TabsContent>

        {/* Escrow Management Tab */}
        <TabsContent value="escrow">
          <EscrowManagementCenter />
        </TabsContent>

        {/* Dispute Resolution Tab */}
        <TabsContent value="disputes">
          <DisputeResolutionCenter />
        </TabsContent>

        {/* Platform Settings Tab */}
        <TabsContent value="settings">
          <PlatformSettingsCenter />
        </TabsContent>
      </Tabs>
    </div>
  );
}
