import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  Target, 
  Users, 
  Eye,
  TrendingUp,
  AlertTriangle,
  FileText,
  Image,
  Video,
  Calendar,
  MapPin,
  Tag,
  BarChart3,
  Pause,
  Play,
  StopCircle
} from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface Campaign {
  id: string;
  title: string;
  description: string;
  advertiser: {
    id: string;
    name: string;
    email: string;
    company: string;
    verified: boolean;
  };
  type: 'sponsored_post' | 'banner_ad' | 'video_ad' | 'influencer_campaign' | 'product_placement';
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'paused' | 'completed';
  budget: {
    total: number;
    daily: number;
    spent: number;
    currency: string;
  };
  targeting: {
    demographics: string[];
    interests: string[];
    locations: string[];
    ageRange: string;
    gender: string;
  };
  content: {
    text?: string;
    images?: string[];
    videos?: string[];
    ctaText?: string;
    landingUrl?: string;
  };
  schedule: {
    startDate: string;
    endDate: string;
    timezone: string;
  };
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpm: number;
  };
  createdAt: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  riskScore: number;
  complianceChecks: {
    contentPolicy: boolean;
    ageAppropriate: boolean;
    legalCompliance: boolean;
    brandSafety: boolean;
  };
}

interface ApprovalAction {
  id: string;
  campaignId: string;
  action: 'approve' | 'reject' | 'request_changes' | 'pause' | 'resume';
  reason: string;
  adminId: string;
  timestamp: string;
  notes?: string;
}

export function CampaignApprovalCenter() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionReason, setActionReason] = useState('');
  const [actionNotes, setActionNotes] = useState('');
  const [approvalActions, setApprovalActions] = useState<ApprovalAction[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data
  useEffect(() => {
    const mockCampaigns: Campaign[] = [
      {
        id: '1',
        title: 'Summer Fashion Collection 2024',
        description: 'Promote our new summer fashion line targeting young adults interested in sustainable fashion.',
        advertiser: {
          id: 'adv1',
          name: 'Sarah Johnson',
          email: 'sarah@fashionco.com',
          company: 'EcoFashion Co.',
          verified: true
        },
        type: 'sponsored_post',
        status: 'pending',
        budget: {
          total: 5000,
          daily: 200,
          spent: 0,
          currency: 'USD'
        },
        targeting: {
          demographics: ['18-34', 'College educated'],
          interests: ['Fashion', 'Sustainability', 'Lifestyle'],
          locations: ['US', 'CA', 'UK'],
          ageRange: '18-34',
          gender: 'All'
        },
        content: {
          text: 'Discover our eco-friendly summer collection! 🌱 Sustainable fashion that looks good and feels good. Shop now with 20% off!',
          images: ['/campaigns/fashion1.jpg', '/campaigns/fashion2.jpg'],
          ctaText: 'Shop Now',
          landingUrl: 'https://ecofashion.com/summer2024'
        },
        schedule: {
          startDate: '2024-06-01',
          endDate: '2024-08-31',
          timezone: 'UTC'
        },
        performance: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          ctr: 0,
          cpm: 0
        },
        createdAt: '2024-01-15T10:00:00Z',
        submittedAt: '2024-01-20T09:30:00Z',
        riskScore: 2,
        complianceChecks: {
          contentPolicy: true,
          ageAppropriate: true,
          legalCompliance: true,
          brandSafety: true
        }
      },
      {
        id: '2',
        title: 'Cryptocurrency Trading Platform',
        description: 'High-yield crypto trading platform with guaranteed returns. Join now!',
        advertiser: {
          id: 'adv2',
          name: 'Unknown User',
          email: 'contact@cryptoscam.com',
          company: 'CryptoGains Inc.',
          verified: false
        },
        type: 'banner_ad',
        status: 'pending',
        budget: {
          total: 10000,
          daily: 500,
          spent: 0,
          currency: 'USD'
        },
        targeting: {
          demographics: ['25-55', 'High income'],
          interests: ['Cryptocurrency', 'Investing', 'Finance'],
          locations: ['Worldwide'],
          ageRange: '25-55',
          gender: 'All'
        },
        content: {
          text: 'Make $1000/day with our AI trading bot! Guaranteed profits! No experience needed!',
          images: ['/campaigns/crypto-scam.jpg'],
          ctaText: 'Get Rich Quick',
          landingUrl: 'https://suspicious-crypto.com'
        },
        schedule: {
          startDate: '2024-01-25',
          endDate: '2024-12-31',
          timezone: 'UTC'
        },
        performance: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          ctr: 0,
          cpm: 0
        },
        createdAt: '2024-01-20T14:30:00Z',
        submittedAt: '2024-01-20T15:00:00Z',
        riskScore: 9,
        complianceChecks: {
          contentPolicy: false,
          ageAppropriate: false,
          legalCompliance: false,
          brandSafety: false
        }
      },
      {
        id: '3',
        title: 'Fitness App Launch Campaign',
        description: 'Promote our new fitness tracking app with personalized workout plans.',
        advertiser: {
          id: 'adv3',
          name: 'Mike Chen',
          email: 'mike@fitapp.com',
          company: 'FitLife Technologies',
          verified: true
        },
        type: 'video_ad',
        status: 'approved',
        budget: {
          total: 8000,
          daily: 300,
          spent: 2400,
          currency: 'USD'
        },
        targeting: {
          demographics: ['22-45', 'Health conscious'],
          interests: ['Fitness', 'Health', 'Wellness', 'Sports'],
          locations: ['US', 'CA', 'AU'],
          ageRange: '22-45',
          gender: 'All'
        },
        content: {
          text: 'Transform your fitness journey with personalized workouts, nutrition tracking, and expert guidance.',
          videos: ['/campaigns/fitness-app.mp4'],
          ctaText: 'Download Free',
          landingUrl: 'https://fitlife.app/download'
        },
        schedule: {
          startDate: '2024-01-10',
          endDate: '2024-03-10',
          timezone: 'UTC'
        },
        performance: {
          impressions: 45000,
          clicks: 1800,
          conversions: 120,
          ctr: 4.0,
          cpm: 5.33
        },
        createdAt: '2024-01-05T11:00:00Z',
        submittedAt: '2024-01-08T16:00:00Z',
        reviewedAt: '2024-01-09T10:30:00Z',
        reviewedBy: 'admin_1',
        reviewNotes: 'Approved - complies with all policies and targets appropriate audience.',
        riskScore: 1,
        complianceChecks: {
          contentPolicy: true,
          ageAppropriate: true,
          legalCompliance: true,
          brandSafety: true
        }
      }
    ];
    setCampaigns(mockCampaigns);
    setFilteredCampaigns(mockCampaigns);
  }, []);

  // Filter campaigns
  useEffect(() => {
    let filtered = campaigns.filter(campaign => {
      const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           campaign.advertiser.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
      const matchesType = typeFilter === 'all' || campaign.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });

    setFilteredCampaigns(filtered);
  }, [campaigns, searchTerm, statusFilter, typeFilter]);

  const handleCampaignAction = async (action: string, campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setActionType(action);
    setShowActionModal(true);
  };

  const executeApprovalAction = async () => {
    if (!selectedCampaign || !actionType || !actionReason) return;

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newAction: ApprovalAction = {
      id: Date.now().toString(),
      campaignId: selectedCampaign.id,
      action: actionType as any,
      reason: actionReason,
      adminId: 'current_admin',
      timestamp: new Date().toISOString(),
      notes: actionNotes
    };

    setApprovalActions(prev => [newAction, ...prev]);

    // Update campaign status
    setCampaigns(prev => prev.map(campaign => {
      if (campaign.id === selectedCampaign.id) {
        const updates: Partial<Campaign> = {
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'current_admin',
          reviewNotes: actionReason
        };

        if (actionType === 'approve') updates.status = 'approved';
        if (actionType === 'reject') updates.status = 'rejected';
        if (actionType === 'pause') updates.status = 'paused';
        if (actionType === 'resume') updates.status = 'active';

        return { ...campaign, ...updates };
      }
      return campaign;
    }));

    setLoading(false);
    setShowActionModal(false);
    setActionReason('');
    setActionNotes('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (score: number) => {
    if (score <= 3) return 'bg-green-100 text-green-800';
    if (score <= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sponsored_post': return <FileText className="w-4 h-4" />;
      case 'banner_ad': return <Image className="w-4 h-4" />;
      case 'video_ad': return <Video className="w-4 h-4" />;
      case 'influencer_campaign': return <Users className="w-4 h-4" />;
      case 'product_placement': return <Tag className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatBudget = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search campaigns or advertisers..."
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sponsored_post">Sponsored Post</SelectItem>
              <SelectItem value="banner_ad">Banner Ad</SelectItem>
              <SelectItem value="video_ad">Video Ad</SelectItem>
              <SelectItem value="influencer_campaign">Influencer Campaign</SelectItem>
              <SelectItem value="product_placement">Product Placement</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns ({filteredCampaigns.length})</TabsTrigger>
          <TabsTrigger value="actions">Approval History</TabsTrigger>
          <TabsTrigger value="stats">Performance Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {filteredCampaigns.map((campaign) => (
                  <div key={campaign.id} className="border rounded-lg p-6 hover:bg-gray-50">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getTypeIcon(campaign.type)}
                            <h3 className="text-lg font-semibold">{campaign.title}</h3>
                            <Badge className={getStatusColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                            <Badge className={getRiskColor(campaign.riskScore)}>
                              Risk: {campaign.riskScore}/10
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{campaign.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Advertiser: {campaign.advertiser.company}</span>
                            <span>Budget: {formatBudget(campaign.budget.total, campaign.budget.currency)}</span>
                            <span>Submitted: {new Date(campaign.submittedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedCampaign(campaign);
                              setShowCampaignModal(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          {campaign.status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCampaignAction('approve', campaign)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCampaignAction('reject', campaign)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          
                          {campaign.status === 'active' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCampaignAction('pause', campaign)}
                              className="text-yellow-600 hover:text-yellow-700"
                            >
                              <Pause className="w-4 h-4" />
                            </Button>
                          )}
                          
                          {campaign.status === 'paused' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCampaignAction('resume', campaign)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Compliance Checks */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className={`flex items-center space-x-2 p-2 rounded ${campaign.complianceChecks.contentPolicy ? 'bg-green-50' : 'bg-red-50'}`}>
                          {campaign.complianceChecks.contentPolicy ? 
                            <CheckCircle className="w-4 h-4 text-green-600" /> : 
                            <XCircle className="w-4 h-4 text-red-600" />
                          }
                          <span className="text-sm">Content Policy</span>
                        </div>
                        <div className={`flex items-center space-x-2 p-2 rounded ${campaign.complianceChecks.ageAppropriate ? 'bg-green-50' : 'bg-red-50'}`}>
                          {campaign.complianceChecks.ageAppropriate ? 
                            <CheckCircle className="w-4 h-4 text-green-600" /> : 
                            <XCircle className="w-4 h-4 text-red-600" />
                          }
                          <span className="text-sm">Age Appropriate</span>
                        </div>
                        <div className={`flex items-center space-x-2 p-2 rounded ${campaign.complianceChecks.legalCompliance ? 'bg-green-50' : 'bg-red-50'}`}>
                          {campaign.complianceChecks.legalCompliance ? 
                            <CheckCircle className="w-4 h-4 text-green-600" /> : 
                            <XCircle className="w-4 h-4 text-red-600" />
                          }
                          <span className="text-sm">Legal Compliance</span>
                        </div>
                        <div className={`flex items-center space-x-2 p-2 rounded ${campaign.complianceChecks.brandSafety ? 'bg-green-50' : 'bg-red-50'}`}>
                          {campaign.complianceChecks.brandSafety ? 
                            <CheckCircle className="w-4 h-4 text-green-600" /> : 
                            <XCircle className="w-4 h-4 text-red-600" />
                          }
                          <span className="text-sm">Brand Safety</span>
                        </div>
                      </div>

                      {/* Performance (for active/completed campaigns) */}
                      {(campaign.status === 'active' || campaign.status === 'completed') && (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t">
                          <div>
                            <p className="text-sm text-gray-600">Impressions</p>
                            <p className="text-lg font-semibold">{campaign.performance.impressions.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Clicks</p>
                            <p className="text-lg font-semibold">{campaign.performance.clicks.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">CTR</p>
                            <p className="text-lg font-semibold">{campaign.performance.ctr.toFixed(2)}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">CPM</p>
                            <p className="text-lg font-semibold">${campaign.performance.cpm.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Budget Spent</p>
                            <div className="space-y-1">
                              <p className="text-lg font-semibold">
                                {formatBudget(campaign.budget.spent, campaign.budget.currency)}
                              </p>
                              <Progress 
                                value={(campaign.budget.spent / campaign.budget.total) * 100} 
                                className="h-2"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* High-risk warning */}
                      {campaign.riskScore > 7 && (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            High-risk campaign. Review carefully for compliance violations and potential fraud.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredCampaigns.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No campaigns found matching your filters</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Approval Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {approvalActions.map((action) => (
                  <div key={action.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {action.action.charAt(0).toUpperCase() + action.action.slice(1)} Campaign
                        </p>
                        <p className="text-sm text-gray-600">
                          Reason: {action.reason}
                        </p>
                        {action.notes && (
                          <p className="text-sm text-gray-500 mt-1">
                            Notes: {action.notes}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>{new Date(action.timestamp).toLocaleString()}</p>
                        <p>by {action.adminId}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {approvalActions.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No recent actions</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold">{campaigns.filter(c => c.status === 'pending').length}</p>
                    <p className="text-sm text-gray-600">Pending Review</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{campaigns.filter(c => c.status === 'approved' || c.status === 'active').length}</p>
                    <p className="text-sm text-gray-600">Approved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold">{campaigns.filter(c => c.status === 'rejected').length}</p>
                    <p className="text-sm text-gray-600">Rejected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {formatBudget(
                        campaigns.reduce((sum, c) => sum + c.budget.total, 0),
                        'USD'
                      )}
                    </p>
                    <p className="text-sm text-gray-600">Total Budget</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Campaign Detail Modal */}
      <Dialog open={showCampaignModal} onOpenChange={setShowCampaignModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Campaign Details</DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Campaign Title</Label>
                  <p className="font-medium">{selectedCampaign.title}</p>
                </div>
                <div>
                  <Label>Type</Label>
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(selectedCampaign.type)}
                    <span>{selectedCampaign.type.replace('_', ' ')}</span>
                  </div>
                </div>
                <div>
                  <Label>Advertiser</Label>
                  <p>{selectedCampaign.advertiser.company}</p>
                  <p className="text-sm text-gray-600">{selectedCampaign.advertiser.email}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedCampaign.status)}>
                    {selectedCampaign.status}
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label>Description</Label>
                <p className="mt-2">{selectedCampaign.description}</p>
              </div>

              {/* Budget */}
              <div>
                <Label>Budget Information</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-600">Total Budget</p>
                    <p className="font-semibold">{formatBudget(selectedCampaign.budget.total, selectedCampaign.budget.currency)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Daily Budget</p>
                    <p className="font-semibold">{formatBudget(selectedCampaign.budget.daily, selectedCampaign.budget.currency)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Spent</p>
                    <p className="font-semibold">{formatBudget(selectedCampaign.budget.spent, selectedCampaign.budget.currency)}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <Label>Campaign Content</Label>
                <div className="mt-2 space-y-3">
                  {selectedCampaign.content.text && (
                    <div>
                      <p className="text-sm text-gray-600">Text Content</p>
                      <div className="p-3 bg-gray-50 rounded">
                        {selectedCampaign.content.text}
                      </div>
                    </div>
                  )}
                  {selectedCampaign.content.ctaText && (
                    <div>
                      <p className="text-sm text-gray-600">Call to Action</p>
                      <p className="font-medium">{selectedCampaign.content.ctaText}</p>
                    </div>
                  )}
                  {selectedCampaign.content.landingUrl && (
                    <div>
                      <p className="text-sm text-gray-600">Landing URL</p>
                      <a href={selectedCampaign.content.landingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {selectedCampaign.content.landingUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Targeting */}
              <div>
                <Label>Targeting</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-600">Demographics</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedCampaign.targeting.demographics.map((demo, index) => (
                        <Badge key={index} variant="outline">{demo}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Interests</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedCampaign.targeting.interests.map((interest, index) => (
                        <Badge key={index} variant="outline">{interest}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Locations</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedCampaign.targeting.locations.map((location, index) => (
                        <Badge key={index} variant="outline">{location}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Age Range</p>
                    <p>{selectedCampaign.targeting.ageRange}</p>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div>
                <Label>Schedule</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p>{new Date(selectedCampaign.schedule.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">End Date</p>
                    <p>{new Date(selectedCampaign.schedule.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Modal */}
      <Dialog open={showActionModal} onOpenChange={setShowActionModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType.charAt(0).toUpperCase() + actionType.slice(1)} Campaign
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
            
            <div>
              <Label>Additional Notes</Label>
              <Textarea
                placeholder="Optional additional notes or feedback..."
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowActionModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={executeApprovalAction} 
                disabled={!actionReason || loading}
                variant={actionType === 'reject' ? 'destructive' : 'default'}
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
