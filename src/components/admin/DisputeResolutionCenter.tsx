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
  Gavel,
  Scale,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Eye,
  User,
  Calendar,
  MessageSquare,
  Paperclip,
  Download,
  Upload,
  Timer,
  TrendingUp,
  Users,
  DollarSign,
  Star,
  Flag,
  Shield,
  Send,
  ShoppingCart,
  CreditCard
} from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface Dispute {
  id: string;
  caseNumber: string;
  type: 'freelance' | 'marketplace' | 'crypto_p2p' | 'content' | 'payment';
  status: 'open' | 'investigating' | 'mediation' | 'arbitration' | 'resolved' | 'closed' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  category: string;
  disputeAmount: {
    value: number;
    currency: string;
  };
  parties: {
    complainant: {
      id: string;
      username: string;
      verified: boolean;
      trustScore: number;
      previousDisputes: number;
    };
    respondent: {
      id: string;
      username: string;
      verified: boolean;
      trustScore: number;
      previousDisputes: number;
    };
  };
  timeline: {
    created: string;
    responded?: string;
    investigated?: string;
    mediated?: string;
    arbitrated?: string;
    resolved?: string;
    closed?: string;
  };
  assignedAdmin: {
    id: string;
    name: string;
    specialization: string[];
  };
  evidence: {
    id: string;
    type: 'document' | 'image' | 'video' | 'screenshot' | 'chat_log' | 'transaction_record';
    filename: string;
    uploadedBy: 'complainant' | 'respondent' | 'admin';
    uploadedAt: string;
    verified: boolean;
  }[];
  communications: {
    id: string;
    sender: 'complainant' | 'respondent' | 'admin' | 'mediator';
    message: string;
    timestamp: string;
    isPrivate: boolean;
  }[];
  resolution: {
    outcome: 'favor_complainant' | 'favor_respondent' | 'partial_refund' | 'mediated_agreement' | 'dismissed';
    reasoning: string;
    compensation?: {
      amount: number;
      recipient: 'complainant' | 'respondent';
    };
    conditions?: string[];
  } | null;
  escalationHistory: {
    id: string;
    from: string;
    to: string;
    reason: string;
    timestamp: string;
  }[];
  deadlines: {
    response: string;
    evidence: string;
    resolution: string;
  };
  flags: string[];
  riskScore: number;
  satisfactionRating?: {
    complainant?: number;
    respondent?: number;
    average?: number;
  };
}

interface ArbitrationAction {
  id: string;
  disputeId: string;
  action: 'assign' | 'investigate' | 'request_evidence' | 'schedule_hearing' | 'resolve' | 'escalate' | 'close';
  details: string;
  adminId: string;
  timestamp: string;
  metadata?: any;
}

export function DisputeResolutionCenter() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [filteredDisputes, setFilteredDisputes] = useState<Dispute[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionDetails, setActionDetails] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isPrivateMessage, setIsPrivateMessage] = useState(false);
  const [arbitrationActions, setArbitrationActions] = useState<ArbitrationAction[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data
  useEffect(() => {
    const mockDisputes: Dispute[] = [
      {
        id: 'DISP001',
        caseNumber: 'ARB-2024-001',
        type: 'freelance',
        status: 'investigating',
        priority: 'high',
        title: 'Website Development Project - Scope Disagreement',
        description: 'Client claims deliverables do not match agreed specifications. Developer claims client changed requirements mid-project.',
        category: 'Contract Dispute',
        disputeAmount: { value: 5000, currency: 'USD' },
        parties: {
          complainant: {
            id: 'user1',
            username: 'startup_founder',
            verified: true,
            trustScore: 7.5,
            previousDisputes: 0
          },
          respondent: {
            id: 'user2',
            username: 'fullstack_dev',
            verified: true,
            trustScore: 8.2,
            previousDisputes: 1
          }
        },
        timeline: {
          created: '2024-01-18T10:00:00Z',
          responded: '2024-01-19T14:30:00Z',
          investigated: '2024-01-20T09:15:00Z'
        },
        assignedAdmin: {
          id: 'admin1',
          name: 'Sarah Johnson',
          specialization: ['freelance_disputes', 'contract_law']
        },
        evidence: [
          {
            id: 'ev1',
            type: 'document',
            filename: 'original_contract.pdf',
            uploadedBy: 'complainant',
            uploadedAt: '2024-01-18T10:30:00Z',
            verified: true
          },
          {
            id: 'ev2',
            type: 'screenshot',
            filename: 'email_correspondence.png',
            uploadedBy: 'respondent',
            uploadedAt: '2024-01-19T15:00:00Z',
            verified: true
          },
          {
            id: 'ev3',
            type: 'document',
            filename: 'revised_requirements.pdf',
            uploadedBy: 'complainant',
            uploadedAt: '2024-01-20T08:45:00Z',
            verified: false
          }
        ],
        communications: [
          {
            id: 'comm1',
            sender: 'complainant',
            message: 'The delivered website does not include the e-commerce functionality that was clearly specified in our contract.',
            timestamp: '2024-01-18T10:15:00Z',
            isPrivate: false
          },
          {
            id: 'comm2',
            sender: 'respondent',
            message: 'The client requested additional features beyond the original scope and refused to pay for the extra work.',
            timestamp: '2024-01-19T14:45:00Z',
            isPrivate: false
          },
          {
            id: 'comm3',
            sender: 'admin',
            message: 'I have reviewed the initial evidence. Both parties please provide timeline documentation of when requirements were communicated.',
            timestamp: '2024-01-20T09:30:00Z',
            isPrivate: false
          }
        ],
        resolution: null,
        escalationHistory: [],
        deadlines: {
          response: '2024-01-22T23:59:59Z',
          evidence: '2024-01-25T23:59:59Z',
          resolution: '2024-01-30T23:59:59Z'
        },
        flags: ['high_value', 'scope_creep'],
        riskScore: 6
      },
      {
        id: 'DISP002',
        caseNumber: 'ARB-2024-002',
        type: 'crypto_p2p',
        status: 'mediation',
        priority: 'urgent',
        title: 'Bitcoin P2P Trade - Payment Not Released',
        description: 'Buyer sent fiat payment but seller refuses to release cryptocurrency claiming payment not received.',
        category: 'Payment Dispute',
        disputeAmount: { value: 45000, currency: 'USD' },
        parties: {
          complainant: {
            id: 'user3',
            username: 'crypto_buyer_pro',
            verified: false,
            trustScore: 6.1,
            previousDisputes: 2
          },
          respondent: {
            id: 'user4',
            username: 'btc_merchant',
            verified: true,
            trustScore: 9.1,
            previousDisputes: 0
          }
        },
        timeline: {
          created: '2024-01-19T16:20:00Z',
          responded: '2024-01-20T10:15:00Z',
          investigated: '2024-01-20T15:30:00Z',
          mediated: '2024-01-21T11:00:00Z'
        },
        assignedAdmin: {
          id: 'admin2',
          name: 'Michael Chen',
          specialization: ['crypto_disputes', 'payment_verification']
        },
        evidence: [
          {
            id: 'ev4',
            type: 'document',
            filename: 'bank_transfer_receipt.pdf',
            uploadedBy: 'complainant',
            uploadedAt: '2024-01-19T16:30:00Z',
            verified: true
          },
          {
            id: 'ev5',
            type: 'screenshot',
            filename: 'banking_app_confirmation.png',
            uploadedBy: 'complainant',
            uploadedAt: '2024-01-19T16:35:00Z',
            verified: true
          },
          {
            id: 'ev6',
            type: 'document',
            filename: 'bank_statement.pdf',
            uploadedBy: 'respondent',
            uploadedAt: '2024-01-20T10:30:00Z',
            verified: true
          }
        ],
        communications: [
          {
            id: 'comm4',
            sender: 'complainant',
            message: 'I have sent the payment as agreed but the seller is not releasing my Bitcoin. Here is proof of payment.',
            timestamp: '2024-01-19T16:25:00Z',
            isPrivate: false
          },
          {
            id: 'comm5',
            sender: 'respondent',
            message: 'I have not received any payment in my account. The buyer may have sent to wrong account details.',
            timestamp: '2024-01-20T10:20:00Z',
            isPrivate: false
          },
          {
            id: 'comm6',
            sender: 'admin',
            message: 'After reviewing bank records, payment was sent to correct account but may be delayed due to international transfer. Seller, please check for pending transactions.',
            timestamp: '2024-01-21T11:15:00Z',
            isPrivate: false
          }
        ],
        resolution: null,
        escalationHistory: [],
        deadlines: {
          response: '2024-01-21T23:59:59Z',
          evidence: '2024-01-24T23:59:59Z',
          resolution: '2024-01-28T23:59:59Z'
        },
        flags: ['high_value', 'international_payment', 'unverified_buyer'],
        riskScore: 8
      },
      {
        id: 'DISP003',
        caseNumber: 'ARB-2024-003',
        type: 'marketplace',
        status: 'resolved',
        priority: 'medium',
        title: 'Product Quality Issue - Laptop Purchase',
        description: 'Buyer received laptop in damaged condition, seller claims it was properly packaged.',
        category: 'Product Quality',
        disputeAmount: { value: 1200, currency: 'USD' },
        parties: {
          complainant: {
            id: 'user5',
            username: 'tech_enthusiast',
            verified: true,
            trustScore: 8.8,
            previousDisputes: 0
          },
          respondent: {
            id: 'user6',
            username: 'electronics_store',
            verified: true,
            trustScore: 9.3,
            previousDisputes: 1
          }
        },
        timeline: {
          created: '2024-01-15T14:20:00Z',
          responded: '2024-01-16T09:30:00Z',
          investigated: '2024-01-17T11:15:00Z',
          resolved: '2024-01-19T16:45:00Z',
          closed: '2024-01-20T10:00:00Z'
        },
        assignedAdmin: {
          id: 'admin3',
          name: 'Emily Rodriguez',
          specialization: ['marketplace_disputes', 'product_quality']
        },
        evidence: [
          {
            id: 'ev7',
            type: 'image',
            filename: 'damaged_laptop_photos.zip',
            uploadedBy: 'complainant',
            uploadedAt: '2024-01-15T14:30:00Z',
            verified: true
          },
          {
            id: 'ev8',
            type: 'document',
            filename: 'shipping_insurance_claim.pdf',
            uploadedBy: 'respondent',
            uploadedAt: '2024-01-16T10:00:00Z',
            verified: true
          }
        ],
        communications: [
          {
            id: 'comm7',
            sender: 'complainant',
            message: 'The laptop arrived with a cracked screen and dented casing. This was clearly damaged during shipping.',
            timestamp: '2024-01-15T14:25:00Z',
            isPrivate: false
          },
          {
            id: 'comm8',
            sender: 'respondent',
            message: 'We packaged the laptop properly with bubble wrap and insurance. This appears to be shipping damage.',
            timestamp: '2024-01-16T09:45:00Z',
            isPrivate: false
          }
        ],
        resolution: {
          outcome: 'partial_refund',
          reasoning: 'Evidence shows damage occurred during shipping. Partial refund granted to buyer, seller to file insurance claim.',
          compensation: {
            amount: 600,
            recipient: 'complainant'
          },
          conditions: ['Seller files shipping insurance claim', 'Buyer returns damaged item']
        },
        escalationHistory: [],
        deadlines: {
          response: '2024-01-18T23:59:59Z',
          evidence: '2024-01-20T23:59:59Z',
          resolution: '2024-01-25T23:59:59Z'
        },
        flags: ['shipping_damage'],
        riskScore: 3,
        satisfactionRating: {
          complainant: 4,
          respondent: 3,
          average: 3.5
        }
      }
    ];
    setDisputes(mockDisputes);
    setFilteredDisputes(mockDisputes);
  }, []);

  // Filter disputes
  useEffect(() => {
    let filtered = disputes.filter(dispute => {
      const matchesSearch = dispute.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dispute.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dispute.parties.complainant.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dispute.parties.respondent.username.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || dispute.status === statusFilter;
      const matchesType = typeFilter === 'all' || dispute.type === typeFilter;
      const matchesPriority = priorityFilter === 'all' || dispute.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesPriority;
    });

    setFilteredDisputes(filtered);
  }, [disputes, searchTerm, statusFilter, typeFilter, priorityFilter]);

  const handleDisputeAction = async (action: string, dispute: Dispute) => {
    setSelectedDispute(dispute);
    setActionType(action);
    setShowActionModal(true);
  };

  const executeArbitrationAction = async () => {
    if (!selectedDispute || !actionType || !actionDetails) return;

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newAction: ArbitrationAction = {
      id: Date.now().toString(),
      disputeId: selectedDispute.id,
      action: actionType as any,
      details: actionDetails,
      adminId: 'current_admin',
      timestamp: new Date().toISOString()
    };

    setArbitrationActions(prev => [newAction, ...prev]);

    // Update dispute status
    setDisputes(prev => prev.map(dispute => {
      if (dispute.id === selectedDispute.id) {
        const updates: Partial<Dispute> = {};

        if (actionType === 'resolve') {
          updates.status = 'resolved';
          updates.timeline = { ...dispute.timeline, resolved: new Date().toISOString() };
        }
        if (actionType === 'escalate') {
          updates.status = 'escalated';
        }
        if (actionType === 'investigate') {
          updates.status = 'investigating';
          updates.timeline = { ...dispute.timeline, investigated: new Date().toISOString() };
        }

        return { ...dispute, ...updates };
      }
      return dispute;
    }));

    setLoading(false);
    setShowActionModal(false);
    setActionDetails('');
  };

  const sendMessage = async () => {
    if (!selectedDispute || !newMessage.trim()) return;

    const newCommunication = {
      id: Date.now().toString(),
      sender: 'admin' as const,
      message: newMessage,
      timestamp: new Date().toISOString(),
      isPrivate: isPrivateMessage
    };

    setDisputes(prev => prev.map(dispute => {
      if (dispute.id === selectedDispute.id) {
        return {
          ...dispute,
          communications: [...dispute.communications, newCommunication]
        };
      }
      return dispute;
    }));

    setNewMessage('');
    setIsPrivateMessage(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'mediation': return 'bg-purple-100 text-purple-800';
      case 'arbitration': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'escalated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
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
      case 'freelance': return <Users className="w-4 h-4" />;
      case 'marketplace': return <ShoppingCart className="w-4 h-4" />;
      case 'crypto_p2p': return <DollarSign className="w-4 h-4" />;
      case 'content': return <FileText className="w-4 h-4" />;
      case 'payment': return <CreditCard className="w-4 h-4" />;
      default: return <Gavel className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const isDeadlinePassing = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const hoursUntilDeadline = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilDeadline <= 24 && hoursUntilDeadline > 0;
  };

  const isOverdue = (deadline: string) => {
    return new Date() > new Date(deadline);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search disputes..."
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
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="mediation">Mediation</SelectItem>
              <SelectItem value="arbitration">Arbitration</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="escalated">Escalated</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
              <SelectItem value="marketplace">Marketplace</SelectItem>
              <SelectItem value="crypto_p2p">Crypto P2P</SelectItem>
              <SelectItem value="content">Content</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="disputes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="disputes">Disputes ({filteredDisputes.length})</TabsTrigger>
          <TabsTrigger value="urgent">Urgent ({disputes.filter(d => d.priority === 'urgent' || isDeadlinePassing(d.deadlines.resolution)).length})</TabsTrigger>
          <TabsTrigger value="actions">Action History</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="disputes">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {filteredDisputes.map((dispute) => (
                  <div key={dispute.id} className="border rounded-lg p-6 hover:bg-gray-50">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getTypeIcon(dispute.type)}
                            <span className="font-mono text-sm text-gray-600">{dispute.caseNumber}</span>
                            <Badge className={getStatusColor(dispute.status)}>
                              {dispute.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={getPriorityColor(dispute.priority)}>
                              {dispute.priority}
                            </Badge>
                            <Badge className={getRiskColor(dispute.riskScore)}>
                              Risk: {dispute.riskScore}/10
                            </Badge>
                          </div>
                          <h3 className="text-lg font-semibold mb-2">{dispute.title}</h3>
                          <p className="text-gray-600 mb-3 line-clamp-2">{dispute.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Amount</p>
                              <p className="font-semibold">
                                {formatCurrency(dispute.disputeAmount.value, dispute.disputeAmount.currency)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Complainant</p>
                              <div className="flex items-center space-x-1">
                                <span>@{dispute.parties.complainant.username}</span>
                                {dispute.parties.complainant.verified && (
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-gray-600">Respondent</p>
                              <div className="flex items-center space-x-1">
                                <span>@{dispute.parties.respondent.username}</span>
                                {dispute.parties.respondent.verified && (
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-gray-600">Assigned to</p>
                              <p className="font-medium">{dispute.assignedAdmin.name}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedDispute(dispute);
                              setShowDisputeModal(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedDispute(dispute);
                              setShowCommunicationModal(true);
                            }}
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          
                          {dispute.status === 'investigating' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDisputeAction('resolve', dispute)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDisputeAction('escalate', dispute)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <TrendingUp className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          
                          {dispute.status === 'open' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDisputeAction('investigate', dispute)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Scale className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Deadlines */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className={`p-2 rounded text-sm ${isOverdue(dispute.deadlines.response) ? 'bg-red-50 text-red-800' : isDeadlinePassing(dispute.deadlines.response) ? 'bg-yellow-50 text-yellow-800' : 'bg-gray-50'}`}>
                          <p className="font-medium">Response Due</p>
                          <p className="text-xs">{new Date(dispute.deadlines.response).toLocaleDateString()}</p>
                        </div>
                        <div className={`p-2 rounded text-sm ${isOverdue(dispute.deadlines.evidence) ? 'bg-red-50 text-red-800' : isDeadlinePassing(dispute.deadlines.evidence) ? 'bg-yellow-50 text-yellow-800' : 'bg-gray-50'}`}>
                          <p className="font-medium">Evidence Due</p>
                          <p className="text-xs">{new Date(dispute.deadlines.evidence).toLocaleDateString()}</p>
                        </div>
                        <div className={`p-2 rounded text-sm ${isOverdue(dispute.deadlines.resolution) ? 'bg-red-50 text-red-800' : isDeadlinePassing(dispute.deadlines.resolution) ? 'bg-yellow-50 text-yellow-800' : 'bg-gray-50'}`}>
                          <p className="font-medium">Resolution Due</p>
                          <p className="text-xs">{new Date(dispute.deadlines.resolution).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {/* Evidence Summary */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{dispute.evidence.length} evidence files</span>
                          <span>{dispute.communications.length} messages</span>
                          <span>Created {new Date(dispute.timeline.created).toLocaleDateString()}</span>
                        </div>
                        
                        {dispute.satisfactionRating && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm">{dispute.satisfactionRating.average?.toFixed(1)}/5</span>
                          </div>
                        )}
                      </div>

                      {/* Flags */}
                      {dispute.flags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {dispute.flags.map((flag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Flag className="w-3 h-3 mr-1" />
                              {flag.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Urgent warnings */}
                      {(dispute.priority === 'urgent' || isDeadlinePassing(dispute.deadlines.resolution)) && (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            {dispute.priority === 'urgent' ? 'Urgent dispute requiring immediate attention.' : 'Resolution deadline approaching within 24 hours.'}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredDisputes.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No disputes found matching your filters</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="urgent">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Urgent Disputes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {disputes.filter(d => d.priority === 'urgent' || isDeadlinePassing(d.deadlines.resolution)).map((dispute) => (
                  <div key={dispute.id} className="border-l-4 border-red-500 pl-4 py-3 bg-red-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{dispute.title}</h4>
                        <p className="text-sm text-gray-600">{dispute.caseNumber}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getPriorityColor(dispute.priority)}>
                            {dispute.priority}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            Resolution due: {new Date(dispute.deadlines.resolution).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedDispute(dispute);
                          setShowDisputeModal(true);
                        }}
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Arbitration Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {arbitrationActions.map((action) => (
                  <div key={action.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {action.action.replace('_', ' ').toUpperCase()} - {action.disputeId}
                        </p>
                        <p className="text-sm text-gray-600">
                          Details: {action.details}
                        </p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>{new Date(action.timestamp).toLocaleString()}</p>
                        <p>by {action.adminId}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {arbitrationActions.length === 0 && (
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
                  <Scale className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{disputes.filter(d => d.status === 'open' || d.status === 'investigating').length}</p>
                    <p className="text-sm text-gray-600">Active Disputes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold">{disputes.filter(d => d.priority === 'urgent').length}</p>
                    <p className="text-sm text-gray-600">Urgent Cases</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{disputes.filter(d => d.status === 'resolved').length}</p>
                    <p className="text-sm text-gray-600">Resolved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      ${disputes.reduce((sum, d) => sum + d.disputeAmount.value, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Total Disputed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dispute Detail Modal */}
      <Dialog open={showDisputeModal} onOpenChange={setShowDisputeModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Dispute Details - {selectedDispute?.caseNumber}</DialogTitle>
          </DialogHeader>
          {selectedDispute && (
            <div className="space-y-6">
              {/* Case Overview */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Case Number</Label>
                  <p className="font-mono">{selectedDispute.caseNumber}</p>
                </div>
                <div>
                  <Label>Type</Label>
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(selectedDispute.type)}
                    <span>{selectedDispute.type.replace('_', ' ')}</span>
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedDispute.status)}>
                    {selectedDispute.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Badge className={getPriorityColor(selectedDispute.priority)}>
                    {selectedDispute.priority}
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label>Description</Label>
                <p className="mt-2 p-3 bg-gray-50 rounded">{selectedDispute.description}</p>
              </div>

              {/* Parties */}
              <div>
                <Label>Parties Involved</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-blue-600">Complainant</h4>
                    <div className="space-y-1">
                      <p>@{selectedDispute.parties.complainant.username}</p>
                      <p className="text-sm text-gray-600">Trust Score: {selectedDispute.parties.complainant.trustScore}/10</p>
                      <p className="text-sm text-gray-600">Previous Disputes: {selectedDispute.parties.complainant.previousDisputes}</p>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm">Verified:</span>
                        {selectedDispute.parties.complainant.verified ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-red-600">Respondent</h4>
                    <div className="space-y-1">
                      <p>@{selectedDispute.parties.respondent.username}</p>
                      <p className="text-sm text-gray-600">Trust Score: {selectedDispute.parties.respondent.trustScore}/10</p>
                      <p className="text-sm text-gray-600">Previous Disputes: {selectedDispute.parties.respondent.previousDisputes}</p>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm">Verified:</span>
                        {selectedDispute.parties.respondent.verified ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Evidence */}
              <div>
                <Label>Evidence ({selectedDispute.evidence.length} files)</Label>
                <div className="mt-2 space-y-2">
                  {selectedDispute.evidence.map((evidence) => (
                    <div key={evidence.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <Paperclip className="w-4 h-4" />
                        <div>
                          <p className="font-medium">{evidence.filename}</p>
                          <p className="text-sm text-gray-600">
                            Uploaded by {evidence.uploadedBy} on {new Date(evidence.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {evidence.verified && (
                          <Badge variant="outline" className="text-green-600">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Communications */}
              <div>
                <Label>Communications ({selectedDispute.communications.length} messages)</Label>
                <div className="mt-2 max-h-60 overflow-y-auto space-y-3">
                  {selectedDispute.communications.map((comm) => (
                    <div key={comm.id} className={`p-3 rounded ${comm.sender === 'admin' ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium capitalize">{comm.sender}</span>
                        <div className="flex items-center space-x-2">
                          {comm.isPrivate && (
                            <Badge variant="outline" className="text-xs">Private</Badge>
                          )}
                          <span className="text-xs text-gray-500">
                            {new Date(comm.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm">{comm.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolution */}
              {selectedDispute.resolution && (
                <div>
                  <Label>Resolution</Label>
                  <div className="mt-2 p-4 bg-green-50 border border-green-200 rounded">
                    <div className="mb-3">
                      <span className="font-semibold">Outcome: </span>
                      <Badge className="ml-2">
                        {selectedDispute.resolution.outcome.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="mb-3">{selectedDispute.resolution.reasoning}</p>
                    {selectedDispute.resolution.compensation && (
                      <p className="text-sm">
                        <span className="font-medium">Compensation: </span>
                        {formatCurrency(selectedDispute.resolution.compensation.amount, selectedDispute.disputeAmount.currency)} 
                        to {selectedDispute.resolution.compensation.recipient}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Communication Modal */}
      <Dialog open={showCommunicationModal} onOpenChange={setShowCommunicationModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Message - {selectedDispute?.caseNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Message</Label>
              <Textarea
                placeholder="Type your message to the parties..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="private"
                checked={isPrivateMessage}
                onChange={(e) => setIsPrivateMessage(e.target.checked)}
              />
              <Label htmlFor="private">Send as private admin note</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCommunicationModal(false)}>
                Cancel
              </Button>
              <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Action Modal */}
      <Dialog open={showActionModal} onOpenChange={setShowActionModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType.replace('_', ' ').toUpperCase()} - {selectedDispute?.caseNumber}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Action Details *</Label>
              <Textarea
                placeholder="Provide detailed information about this action..."
                value={actionDetails}
                onChange={(e) => setActionDetails(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowActionModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={executeArbitrationAction} 
                disabled={!actionDetails || loading}
                variant={actionType === 'escalate' ? 'destructive' : 'default'}
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
