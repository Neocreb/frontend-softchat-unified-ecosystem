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
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  DollarSign,
  Users,
  FileText,
  Eye,
  Gavel,
  Lock,
  Unlock,
  RefreshCw,
  TrendingUp,
  User,
  Calendar,
  CreditCard,
  Bitcoin,
  Briefcase,
  ArrowRight,
  Timer
} from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface EscrowTransaction {
  id: string;
  type: 'freelance' | 'crypto_p2p' | 'marketplace';
  status: 'pending' | 'funded' | 'in_progress' | 'awaiting_delivery' | 'dispute' | 'completed' | 'cancelled' | 'refunded';
  amount: {
    value: number;
    currency: string;
    cryptoType?: string;
  };
  fee: {
    value: number;
    percentage: number;
  };
  participants: {
    buyer: {
      id: string;
      username: string;
      verified: boolean;
      trustScore: number;
    };
    seller: {
      id: string;
      username: string;
      verified: boolean;
      trustScore: number;
    };
  };
  details: {
    title: string;
    description: string;
    deliverables?: string[];
    deadline?: string;
    category?: string;
    requirements?: string;
  };
  timeline: {
    created: string;
    funded?: string;
    started?: string;
    delivered?: string;
    completed?: string;
    disputed?: string;
  };
  milestones?: {
    id: string;
    title: string;
    amount: number;
    status: 'pending' | 'released' | 'disputed';
    dueDate: string;
  }[];
  disputes?: {
    id: string;
    reason: string;
    initiatedBy: 'buyer' | 'seller';
    evidence: string[];
    timestamp: string;
  }[];
  riskScore: number;
  flags: string[];
  autoReleaseDate?: string;
  releaseConditions?: string;
}

interface EscrowAction {
  id: string;
  transactionId: string;
  action: 'release_funds' | 'refund' | 'hold' | 'request_evidence' | 'escalate' | 'resolve_dispute';
  reason: string;
  adminId: string;
  timestamp: string;
  details?: any;
  amount?: number;
}

export function EscrowManagementCenter() {
  const [transactions, setTransactions] = useState<EscrowTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<EscrowTransaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<EscrowTransaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionReason, setActionReason] = useState('');
  const [actionAmount, setActionAmount] = useState('');
  const [escrowActions, setEscrowActions] = useState<EscrowAction[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data
  useEffect(() => {
    const mockTransactions: EscrowTransaction[] = [
      {
        id: 'ESC001',
        type: 'freelance',
        status: 'awaiting_delivery',
        amount: { value: 2500, currency: 'USD' },
        fee: { value: 125, percentage: 5 },
        participants: {
          buyer: { id: 'buyer1', username: 'startup_ceo', verified: true, trustScore: 8.5 },
          seller: { id: 'seller1', username: 'web_developer_pro', verified: true, trustScore: 9.2 }
        },
        details: {
          title: 'E-commerce Website Development',
          description: 'Full-stack e-commerce website with payment integration and admin panel',
          deliverables: ['Frontend React app', 'Backend API', 'Admin dashboard', 'Payment integration'],
          deadline: '2024-02-15',
          category: 'Web Development'
        },
        timeline: {
          created: '2024-01-10T10:00:00Z',
          funded: '2024-01-11T14:30:00Z',
          started: '2024-01-12T09:00:00Z'
        },
        milestones: [
          { id: 'ms1', title: 'Frontend UI/UX', amount: 1000, status: 'released', dueDate: '2024-01-25' },
          { id: 'ms2', title: 'Backend API', amount: 1000, status: 'pending', dueDate: '2024-02-05' },
          { id: 'ms3', title: 'Final Integration & Testing', amount: 500, status: 'pending', dueDate: '2024-02-15' }
        ],
        riskScore: 3,
        flags: [],
        autoReleaseDate: '2024-02-20T00:00:00Z'
      },
      {
        id: 'ESC002',
        type: 'crypto_p2p',
        status: 'dispute',
        amount: { value: 50000, currency: 'USD', cryptoType: 'BTC' },
        fee: { value: 500, percentage: 1 },
        participants: {
          buyer: { id: 'buyer2', username: 'crypto_trader_99', verified: false, trustScore: 4.2 },
          seller: { id: 'seller2', username: 'btc_whale', verified: true, trustScore: 7.8 }
        },
        details: {
          title: 'Bitcoin P2P Trade - 1.2 BTC',
          description: 'P2P Bitcoin purchase with bank transfer payment',
          category: 'Cryptocurrency'
        },
        timeline: {
          created: '2024-01-18T15:20:00Z',
          funded: '2024-01-18T15:45:00Z',
          disputed: '2024-01-19T10:30:00Z'
        },
        disputes: [
          {
            id: 'disp1',
            reason: 'Buyer claims payment was sent but seller has not released crypto',
            initiatedBy: 'buyer',
            evidence: ['bank_transfer_receipt.pdf', 'payment_confirmation.jpg'],
            timestamp: '2024-01-19T10:30:00Z'
          }
        ],
        riskScore: 8,
        flags: ['high_value', 'unverified_buyer', 'payment_dispute'],
        autoReleaseDate: '2024-01-25T00:00:00Z'
      },
      {
        id: 'ESC003',
        type: 'marketplace',
        status: 'completed',
        amount: { value: 450, currency: 'USD' },
        fee: { value: 22.5, percentage: 5 },
        participants: {
          buyer: { id: 'buyer3', username: 'gadget_enthusiast', verified: true, trustScore: 9.1 },
          seller: { id: 'seller3', username: 'tech_store_official', verified: true, trustScore: 9.5 }
        },
        details: {
          title: 'Wireless Gaming Headset',
          description: 'Brand new Razer BlackShark V2 Pro wireless gaming headset',
          category: 'Electronics'
        },
        timeline: {
          created: '2024-01-08T12:00:00Z',
          funded: '2024-01-08T12:15:00Z',
          started: '2024-01-09T08:00:00Z',
          delivered: '2024-01-12T16:30:00Z',
          completed: '2024-01-14T09:00:00Z'
        },
        riskScore: 1,
        flags: []
      },
      {
        id: 'ESC004',
        type: 'freelance',
        status: 'dispute',
        amount: { value: 5000, currency: 'USD' },
        fee: { value: 250, percentage: 5 },
        participants: {
          buyer: { id: 'buyer4', username: 'marketing_agency', verified: true, trustScore: 6.8 },
          seller: { id: 'seller4', username: 'content_creator_x', verified: false, trustScore: 5.5 }
        },
        details: {
          title: 'Video Marketing Campaign',
          description: '10 promotional videos for social media marketing campaign',
          deliverables: ['10 60-second videos', 'Raw footage', 'Editing project files'],
          deadline: '2024-01-30',
          category: 'Video Production'
        },
        timeline: {
          created: '2024-01-05T14:00:00Z',
          funded: '2024-01-06T10:30:00Z',
          started: '2024-01-07T09:00:00Z',
          disputed: '2024-01-22T11:15:00Z'
        },
        disputes: [
          {
            id: 'disp2',
            reason: 'Delivered videos do not match quality standards specified in contract',
            initiatedBy: 'buyer',
            evidence: ['quality_comparison.pdf', 'original_brief.doc', 'delivered_samples.zip'],
            timestamp: '2024-01-22T11:15:00Z'
          }
        ],
        milestones: [
          { id: 'ms4', title: 'First 5 videos', amount: 2500, status: 'disputed', dueDate: '2024-01-20' },
          { id: 'ms5', title: 'Final 5 videos + revisions', amount: 2500, status: 'pending', dueDate: '2024-01-30' }
        ],
        riskScore: 7,
        flags: ['quality_dispute', 'deadline_approaching'],
        autoReleaseDate: '2024-02-05T00:00:00Z'
      }
    ];
    setTransactions(mockTransactions);
    setFilteredTransactions(mockTransactions);
  }, []);

  // Filter transactions
  useEffect(() => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.details.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.participants.buyer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.participants.seller.username.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, statusFilter, typeFilter]);

  const handleEscrowAction = async (action: string, transaction: EscrowTransaction) => {
    setSelectedTransaction(transaction);
    setActionType(action);
    setShowActionModal(true);
  };

  const executeEscrowAction = async () => {
    if (!selectedTransaction || !actionType || !actionReason) return;

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newAction: EscrowAction = {
      id: Date.now().toString(),
      transactionId: selectedTransaction.id,
      action: actionType as any,
      reason: actionReason,
      adminId: 'current_admin',
      timestamp: new Date().toISOString(),
      amount: actionAmount ? parseFloat(actionAmount) : undefined
    };

    setEscrowActions(prev => [newAction, ...prev]);

    // Update transaction status
    setTransactions(prev => prev.map(transaction => {
      if (transaction.id === selectedTransaction.id) {
        const updates: Partial<EscrowTransaction> = {};

        if (actionType === 'release_funds') {
          updates.status = 'completed';
          updates.timeline = { ...transaction.timeline, completed: new Date().toISOString() };
        }
        if (actionType === 'refund') {
          updates.status = 'refunded';
        }
        if (actionType === 'hold') {
          updates.status = 'pending';
        }
        if (actionType === 'resolve_dispute') {
          updates.status = 'completed';
        }

        return { ...transaction, ...updates };
      }
      return transaction;
    }));

    setLoading(false);
    setShowActionModal(false);
    setActionReason('');
    setActionAmount('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'funded': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'awaiting_delivery': return 'bg-orange-100 text-orange-800';
      case 'dispute': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'refunded': return 'bg-pink-100 text-pink-800';
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
      case 'freelance': return <Briefcase className="w-4 h-4" />;
      case 'crypto_p2p': return <Bitcoin className="w-4 h-4" />;
      case 'marketplace': return <CreditCard className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number, currency: string, cryptoType?: string) => {
    if (cryptoType) {
      return `${amount.toLocaleString()} ${currency} (${cryptoType})`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const calculateProgress = (transaction: EscrowTransaction) => {
    if (transaction.milestones) {
      const completed = transaction.milestones.filter(m => m.status === 'released').length;
      return (completed / transaction.milestones.length) * 100;
    }
    
    const statusProgress = {
      'pending': 10,
      'funded': 25,
      'in_progress': 50,
      'awaiting_delivery': 75,
      'completed': 100,
      'dispute': 60,
      'cancelled': 0,
      'refunded': 0
    };
    
    return statusProgress[transaction.status] || 0;
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search transactions..."
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
              <SelectItem value="funded">Funded</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="awaiting_delivery">Awaiting Delivery</SelectItem>
              <SelectItem value="dispute">Disputed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
              <SelectItem value="crypto_p2p">Crypto P2P</SelectItem>
              <SelectItem value="marketplace">Marketplace</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions ({filteredTransactions.length})</TabsTrigger>
          <TabsTrigger value="disputes">Disputes ({transactions.filter(t => t.status === 'dispute').length})</TabsTrigger>
          <TabsTrigger value="actions">Action History</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="border rounded-lg p-6 hover:bg-gray-50">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getTypeIcon(transaction.type)}
                            <span className="font-mono text-sm text-gray-600">{transaction.id}</span>
                            <Badge className={getStatusColor(transaction.status)}>
                              {transaction.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={getRiskColor(transaction.riskScore)}>
                              Risk: {transaction.riskScore}/10
                            </Badge>
                          </div>
                          <h3 className="text-lg font-semibold mb-2">{transaction.details.title}</h3>
                          <p className="text-gray-600 mb-3">{transaction.details.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Amount</p>
                              <p className="font-semibold">
                                {formatCurrency(transaction.amount.value, transaction.amount.currency, transaction.amount.cryptoType)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Fee</p>
                              <p className="font-semibold">
                                {formatCurrency(transaction.fee.value, transaction.amount.currency)} ({transaction.fee.percentage}%)
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Buyer</p>
                              <div className="flex items-center space-x-1">
                                <span>@{transaction.participants.buyer.username}</span>
                                {transaction.participants.buyer.verified && (
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-gray-600">Seller</p>
                              <div className="flex items-center space-x-1">
                                <span>@{transaction.participants.seller.username}</span>
                                {transaction.participants.seller.verified && (
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setShowTransactionModal(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          {transaction.status === 'dispute' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEscrowAction('resolve_dispute', transaction)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Gavel className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEscrowAction('request_evidence', transaction)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <FileText className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          
                          {(transaction.status === 'awaiting_delivery' || transaction.status === 'in_progress') && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEscrowAction('release_funds', transaction)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Unlock className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEscrowAction('hold', transaction)}
                                className="text-yellow-600 hover:text-yellow-700"
                              >
                                <Lock className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          
                          {transaction.status === 'funded' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEscrowAction('refund', transaction)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Progress</span>
                          <span className="text-sm text-gray-600">{calculateProgress(transaction).toFixed(0)}%</span>
                        </div>
                        <Progress value={calculateProgress(transaction)} className="h-2" />
                      </div>

                      {/* Milestones */}
                      {transaction.milestones && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Milestones</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {transaction.milestones.map((milestone) => (
                              <div key={milestone.id} className="flex items-center justify-between p-2 border rounded">
                                <div>
                                  <p className="text-sm font-medium">{milestone.title}</p>
                                  <p className="text-xs text-gray-600">
                                    {formatCurrency(milestone.amount, transaction.amount.currency)}
                                  </p>
                                </div>
                                <Badge 
                                  variant={milestone.status === 'released' ? 'default' : 'outline'}
                                  className={milestone.status === 'disputed' ? 'bg-red-100 text-red-800' : ''}
                                >
                                  {milestone.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Flags */}
                      {transaction.flags.length > 0 && (
                        <div>
                          <div className="flex flex-wrap gap-2">
                            {transaction.flags.map((flag, index) => (
                              <Badge key={index} variant="destructive" className="text-xs">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                {flag.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Auto-release warning */}
                      {transaction.autoReleaseDate && transaction.status !== 'completed' && (
                        <Alert>
                          <Timer className="h-4 w-4" />
                          <AlertDescription>
                            Auto-release scheduled for {new Date(transaction.autoReleaseDate).toLocaleString()}
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* High-risk warning */}
                      {transaction.riskScore > 7 && (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            High-risk transaction requiring careful monitoring and verification.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredTransactions.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No transactions found matching your filters</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disputes">
          <Card>
            <CardHeader>
              <CardTitle>Active Disputes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.filter(t => t.status === 'dispute').map((transaction) => (
                  <div key={transaction.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{transaction.details.title}</h4>
                        <p className="text-sm text-gray-600">{transaction.id}</p>
                      </div>
                      <Badge variant="destructive">Disputed</Badge>
                    </div>
                    
                    {transaction.disputes?.map((dispute) => (
                      <div key={dispute.id} className="bg-red-50 p-3 rounded">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            Initiated by {dispute.initiatedBy}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(dispute.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm mb-2">{dispute.reason}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-600">Evidence:</span>
                          {dispute.evidence.map((evidence, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {evidence}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex space-x-2 mt-3">
                      <Button
                        size="sm"
                        onClick={() => handleEscrowAction('resolve_dispute', transaction)}
                      >
                        Resolve Dispute
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEscrowAction('request_evidence', transaction)}
                      >
                        Request Evidence
                      </Button>
                    </div>
                  </div>
                ))}
                
                {transactions.filter(t => t.status === 'dispute').length === 0 && (
                  <p className="text-gray-500 text-center py-8">No active disputes</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Escrow Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {escrowActions.map((action) => (
                  <div key={action.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {action.action.replace('_', ' ').toUpperCase()} - {action.transactionId}
                        </p>
                        <p className="text-sm text-gray-600">
                          Reason: {action.reason}
                        </p>
                        {action.amount && (
                          <p className="text-sm text-gray-500">
                            Amount: ${action.amount.toLocaleString()}
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
                {escrowActions.length === 0 && (
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
                  <Shield className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{transactions.filter(t => t.status === 'in_progress' || t.status === 'awaiting_delivery').length}</p>
                    <p className="text-sm text-gray-600">Active Escrows</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold">{transactions.filter(t => t.status === 'dispute').length}</p>
                    <p className="text-sm text-gray-600">Disputes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      ${transactions.reduce((sum, t) => sum + t.amount.value, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Total Value</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      ${transactions.reduce((sum, t) => sum + t.fee.value, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Total Fees</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Transaction Detail Modal */}
      <Dialog open={showTransactionModal} onOpenChange={setShowTransactionModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transaction Details - {selectedTransaction?.id}</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Transaction ID</Label>
                  <p className="font-mono">{selectedTransaction.id}</p>
                </div>
                <div>
                  <Label>Type</Label>
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(selectedTransaction.type)}
                    <span>{selectedTransaction.type.replace('_', ' ')}</span>
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedTransaction.status)}>
                    {selectedTransaction.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <Label>Risk Score</Label>
                  <Badge className={getRiskColor(selectedTransaction.riskScore)}>
                    {selectedTransaction.riskScore}/10
                  </Badge>
                </div>
              </div>

              {/* Participants */}
              <div>
                <Label>Participants</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Buyer</h4>
                    <div className="space-y-1">
                      <p>@{selectedTransaction.participants.buyer.username}</p>
                      <p className="text-sm text-gray-600">Trust Score: {selectedTransaction.participants.buyer.trustScore}/10</p>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm">Verified:</span>
                        {selectedTransaction.participants.buyer.verified ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Seller</h4>
                    <div className="space-y-1">
                      <p>@{selectedTransaction.participants.seller.username}</p>
                      <p className="text-sm text-gray-600">Trust Score: {selectedTransaction.participants.seller.trustScore}/10</p>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm">Verified:</span>
                        {selectedTransaction.participants.seller.verified ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div>
                <Label>Financial Information</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-semibold">
                      {formatCurrency(selectedTransaction.amount.value, selectedTransaction.amount.currency, selectedTransaction.amount.cryptoType)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fee</p>
                    <p className="font-semibold">
                      {formatCurrency(selectedTransaction.fee.value, selectedTransaction.amount.currency)} ({selectedTransaction.fee.percentage}%)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Net to Seller</p>
                    <p className="font-semibold">
                      {formatCurrency(selectedTransaction.amount.value - selectedTransaction.fee.value, selectedTransaction.amount.currency)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <Label>Timeline</Label>
                <div className="mt-2 space-y-2">
                  {Object.entries(selectedTransaction.timeline).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-2 border rounded">
                      <span className="capitalize">{key.replace('_', ' ')}</span>
                      <span className="text-sm text-gray-600">
                        {new Date(value).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              {selectedTransaction.milestones && (
                <div>
                  <Label>Milestones</Label>
                  <div className="mt-2 space-y-2">
                    {selectedTransaction.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{milestone.title}</p>
                          <p className="text-sm text-gray-600">
                            Due: {new Date(milestone.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatCurrency(milestone.amount, selectedTransaction.amount.currency)}
                          </p>
                          <Badge 
                            variant={milestone.status === 'released' ? 'default' : 'outline'}
                            className={milestone.status === 'disputed' ? 'bg-red-100 text-red-800' : ''}
                          >
                            {milestone.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Modal */}
      <Dialog open={showActionModal} onOpenChange={setShowActionModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType.replace('_', ' ').toUpperCase()} - {selectedTransaction?.id}
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
            
            {(actionType === 'release_funds' || actionType === 'refund') && (
              <div>
                <Label>Amount (optional - leave blank for full amount)</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={actionAmount}
                  onChange={(e) => setActionAmount(e.target.value)}
                />
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowActionModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={executeEscrowAction} 
                disabled={!actionReason || loading}
                variant={actionType === 'refund' ? 'destructive' : 'default'}
              >
                {loading ? 'Processing...' : `Confirm ${actionType.replace('_', ' ')}`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
