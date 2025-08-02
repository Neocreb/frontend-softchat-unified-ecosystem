import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { 
  Search, 
  UserX, 
  UserCheck, 
  Ban, 
  Shield, 
  AlertTriangle, 
  DollarSign,
  Clock,
  MessageSquare,
  Settings,
  Eye,
  Edit,
  Trash2,
  Filter
} from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface User {
  id: string;
  username: string;
  email: string;
  status: 'active' | 'suspended' | 'banned' | 'pending';
  joinDate: string;
  lastActive: string;
  totalPosts: number;
  totalEarnings: number;
  verificationStatus: 'verified' | 'pending' | 'rejected' | 'none';
  riskScore: number;
  reports: number;
  country: string;
  avatar?: string;
}

interface UserAction {
  id: string;
  userId: string;
  action: 'suspend' | 'ban' | 'warn' | 'verify' | 'fee_adjustment';
  reason: string;
  duration?: string;
  adminId: string;
  timestamp: string;
  details?: any;
}

interface PlatformFees {
  transactionFee: number;
  withdrawalFee: number;
  freelanceCommission: number;
  cryptoTradingFee: number;
  campaignBoostFee: number;
  premiumSubscriptionFee: number;
}

export function UserManagementCenter() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<string>('');
  const [actionReason, setActionReason] = useState('');
  const [actionDuration, setActionDuration] = useState('');
  const [userActions, setUserActions] = useState<UserAction[]>([]);
  const [platformFees, setPlatformFees] = useState<PlatformFees>({
    transactionFee: 2.5,
    withdrawalFee: 1.0,
    freelanceCommission: 10.0,
    cryptoTradingFee: 0.5,
    campaignBoostFee: 5.0,
    premiumSubscriptionFee: 9.99
  });
  const [showFeeSettings, setShowFeeSettings] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        username: 'john_doe',
        email: 'john@example.com',
        status: 'active',
        joinDate: '2024-01-15',
        lastActive: '2024-01-20',
        totalPosts: 45,
        totalEarnings: 1250.50,
        verificationStatus: 'verified',
        riskScore: 2,
        reports: 0,
        country: 'US'
      },
      {
        id: '2',
        username: 'suspicious_user',
        email: 'suspect@example.com',
        status: 'suspended',
        joinDate: '2024-01-10',
        lastActive: '2024-01-18',
        totalPosts: 12,
        totalEarnings: 89.25,
        verificationStatus: 'pending',
        riskScore: 8,
        reports: 5,
        country: 'Unknown'
      },
      {
        id: '3',
        username: 'banned_spammer',
        email: 'spam@example.com',
        status: 'banned',
        joinDate: '2024-01-05',
        lastActive: '2024-01-16',
        totalPosts: 150,
        totalEarnings: 0,
        verificationStatus: 'rejected',
        riskScore: 10,
        reports: 25,
        country: 'Unknown'
      }
    ];
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  // Filter users based on search and status
  useEffect(() => {
    let filtered = users.filter(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter]);

  const handleUserAction = async (action: string, user: User) => {
    setSelectedUser(user);
    setActionType(action);
    setShowActionModal(true);
  };

  const executeUserAction = async () => {
    if (!selectedUser || !actionType || !actionReason) return;

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newAction: UserAction = {
      id: Date.now().toString(),
      userId: selectedUser.id,
      action: actionType as any,
      reason: actionReason,
      duration: actionDuration,
      adminId: 'current_admin',
      timestamp: new Date().toISOString(),
    };

    setUserActions(prev => [newAction, ...prev]);

    // Update user status
    setUsers(prev => prev.map(user => {
      if (user.id === selectedUser.id) {
        if (actionType === 'suspend') return { ...user, status: 'suspended' as const };
        if (actionType === 'ban') return { ...user, status: 'banned' as const };
        if (actionType === 'verify') return { ...user, verificationStatus: 'verified' as const };
      }
      return user;
    }));

    setLoading(false);
    setShowActionModal(false);
    setActionReason('');
    setActionDuration('');
  };

  const updatePlatformFees = async () => {
    setLoading(true);
    // Simulate API call to update fees
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setShowFeeSettings(false);
  };

  const getRiskColor = (score: number) => {
    if (score <= 3) return 'bg-green-100 text-green-800';
    if (score <= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      case 'banned': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users by username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={showFeeSettings} onOpenChange={setShowFeeSettings}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Platform Fees</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Platform Fee Configuration</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Transaction Fee (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={platformFees.transactionFee}
                  onChange={(e) => setPlatformFees(prev => ({
                    ...prev,
                    transactionFee: parseFloat(e.target.value)
                  }))}
                />
              </div>
              <div>
                <Label>Withdrawal Fee (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={platformFees.withdrawalFee}
                  onChange={(e) => setPlatformFees(prev => ({
                    ...prev,
                    withdrawalFee: parseFloat(e.target.value)
                  }))}
                />
              </div>
              <div>
                <Label>Freelance Commission (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={platformFees.freelanceCommission}
                  onChange={(e) => setPlatformFees(prev => ({
                    ...prev,
                    freelanceCommission: parseFloat(e.target.value)
                  }))}
                />
              </div>
              <div>
                <Label>Crypto Trading Fee (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={platformFees.cryptoTradingFee}
                  onChange={(e) => setPlatformFees(prev => ({
                    ...prev,
                    cryptoTradingFee: parseFloat(e.target.value)
                  }))}
                />
              </div>
              <div>
                <Label>Campaign Boost Fee (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={platformFees.campaignBoostFee}
                  onChange={(e) => setPlatformFees(prev => ({
                    ...prev,
                    campaignBoostFee: parseFloat(e.target.value)
                  }))}
                />
              </div>
              <div>
                <Label>Premium Subscription ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={platformFees.premiumSubscriptionFee}
                  onChange={(e) => setPlatformFees(prev => ({
                    ...prev,
                    premiumSubscriptionFee: parseFloat(e.target.value)
                  }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowFeeSettings(false)}>
                Cancel
              </Button>
              <Button onClick={updatePlatformFees} disabled={loading}>
                {loading ? 'Updating...' : 'Update Fees'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="actions">Action History</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Users ({filteredUsers.length})</span>
                <Badge variant="outline">{users.filter(u => u.status === 'active').length} Active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full" />
                          ) : (
                            <span className="text-lg font-semibold">{user.username[0].toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{user.username}</h3>
                            <Badge className={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                            {user.verificationStatus === 'verified' && (
                              <Badge variant="outline" className="text-blue-600 border-blue-600">
                                <Shield className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <span>Joined: {new Date(user.joinDate).toLocaleDateString()}</span>
                            <span>Posts: {user.totalPosts}</span>
                            <span>Earnings: ${user.totalEarnings.toFixed(2)}</span>
                            <span>Reports: {user.reports}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge className={getRiskColor(user.riskScore)}>
                          Risk: {user.riskScore}/10
                        </Badge>
                        
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          {user.status === 'active' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUserAction('suspend', user)}
                                className="text-yellow-600 hover:text-yellow-700"
                              >
                                <UserX className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUserAction('ban', user)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Ban className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          
                          {user.status === 'suspended' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUserAction('activate', user)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <UserCheck className="w-4 h-4" />
                            </Button>
                          )}
                          
                          {user.verificationStatus === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUserAction('verify', user)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Shield className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {user.riskScore > 7 && (
                      <Alert className="mt-3">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          High-risk user with {user.reports} reports. Consider review.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Admin Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userActions.map((action) => (
                  <div key={action.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {action.action.charAt(0).toUpperCase() + action.action.slice(1)} User
                        </p>
                        <p className="text-sm text-gray-600">
                          Reason: {action.reason}
                          {action.duration && ` | Duration: ${action.duration}`}
                        </p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>{new Date(action.timestamp).toLocaleString()}</p>
                        <p>by {action.adminId}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {userActions.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No recent actions</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</p>
                    <p className="text-sm text-gray-600">Active Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <UserX className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold">{users.filter(u => u.status === 'suspended').length}</p>
                    <p className="text-sm text-gray-600">Suspended</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Ban className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold">{users.filter(u => u.status === 'banned').length}</p>
                    <p className="text-sm text-gray-600">Banned</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Modal */}
      <Dialog open={showActionModal} onOpenChange={setShowActionModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType.charAt(0).toUpperCase() + actionType.slice(1)} User: {selectedUser?.username}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Reason *</Label>
              <Textarea
                placeholder="Provide a detailed reason for this action..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
              />
            </div>
            
            {(actionType === 'suspend' || actionType === 'ban') && (
              <div>
                <Label>Duration</Label>
                <Select value={actionDuration} onValueChange={setActionDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 Hours</SelectItem>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                    <SelectItem value="permanent">Permanent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowActionModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={executeUserAction} 
                disabled={!actionReason || loading}
                variant={actionType === 'ban' ? 'destructive' : 'default'}
              >
                {loading ? 'Processing...' : `Confirm ${actionType.charAt(0).toUpperCase() + actionType.slice(1)}`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
