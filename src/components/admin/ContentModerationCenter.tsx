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
import { Checkbox } from '../ui/checkbox';
import { 
  Search, 
  Trash2, 
  Eye, 
  Flag, 
  MessageSquare, 
  Image, 
  Video, 
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  MoreHorizontal,
  User,
  Calendar,
  Hash
} from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface ContentItem {
  id: string;
  type: 'post' | 'comment' | 'video' | 'image' | 'story';
  content: string;
  authorId: string;
  authorUsername: string;
  createdAt: string;
  reports: number;
  reportReasons: string[];
  status: 'active' | 'flagged' | 'hidden' | 'deleted';
  moderationScore: number;
  hashtags: string[];
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  media?: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  };
}

interface ModerationAction {
  id: string;
  contentId: string;
  action: 'approve' | 'hide' | 'delete' | 'flag' | 'warning';
  reason: string;
  adminId: string;
  timestamp: string;
  appeals?: number;
}

interface ModerationFilter {
  type: string;
  status: string;
  reportThreshold: number;
  dateRange: string;
  moderationScore: number;
}

export function ContentModerationCenter() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showContentModal, setShowContentModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionReason, setActionReason] = useState('');
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);
  const [moderationActions, setModerationActions] = useState<ModerationAction[]>([]);
  const [filters, setFilters] = useState<ModerationFilter>({
    type: 'all',
    status: 'all',
    reportThreshold: 0,
    dateRange: 'all',
    moderationScore: 0
  });
  const [loading, setLoading] = useState(false);

  // Mock data
  useEffect(() => {
    const mockContent: ContentItem[] = [
      {
        id: '1',
        type: 'post',
        content: 'This is a normal post about my day at the beach. Had a great time with friends!',
        authorId: 'user1',
        authorUsername: 'beach_lover',
        createdAt: '2024-01-20T10:30:00Z',
        reports: 0,
        reportReasons: [],
        status: 'active',
        moderationScore: 2,
        hashtags: ['#beach', '#friends', '#fun'],
        engagement: { likes: 45, comments: 12, shares: 3, views: 234 }
      },
      {
        id: '2',
        type: 'post',
        content: 'This content contains inappropriate language and hate speech that violates community guidelines.',
        authorId: 'user2',
        authorUsername: 'problematic_user',
        createdAt: '2024-01-20T09:15:00Z',
        reports: 8,
        reportReasons: ['hate speech', 'harassment', 'inappropriate content'],
        status: 'flagged',
        moderationScore: 9,
        hashtags: ['#controversial'],
        engagement: { likes: 2, comments: 15, shares: 0, views: 89 }
      },
      {
        id: '3',
        type: 'video',
        content: 'Check out this amazing dance video!',
        authorId: 'user3',
        authorUsername: 'dancer_pro',
        createdAt: '2024-01-20T08:45:00Z',
        reports: 1,
        reportReasons: ['copyright'],
        status: 'active',
        moderationScore: 3,
        hashtags: ['#dance', '#music', '#viral'],
        engagement: { likes: 156, comments: 28, shares: 12, views: 1247 },
        media: {
          type: 'video',
          url: '/video/dance.mp4',
          thumbnail: '/thumbs/dance-thumb.jpg'
        }
      },
      {
        id: '4',
        type: 'comment',
        content: 'This is spam content promoting illegal activities and fake products.',
        authorId: 'user4',
        authorUsername: 'spam_account',
        createdAt: '2024-01-20T07:20:00Z',
        reports: 15,
        reportReasons: ['spam', 'scam', 'fake products'],
        status: 'flagged',
        moderationScore: 10,
        hashtags: [],
        engagement: { likes: 0, comments: 0, shares: 0, views: 45 }
      }
    ];
    setContent(mockContent);
    setFilteredContent(mockContent);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = content.filter(item => {
      const matchesSearch = item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.authorUsername.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filters.type === 'all' || item.type === filters.type;
      const matchesStatus = filters.status === 'all' || item.status === filters.status;
      const matchesReports = item.reports >= filters.reportThreshold;
      const matchesScore = item.moderationScore >= filters.moderationScore;
      
      return matchesSearch && matchesType && matchesStatus && matchesReports && matchesScore;
    });

    setFilteredContent(filtered);
  }, [content, searchTerm, filters]);

  const handleContentAction = async (action: string, contentItem: ContentItem) => {
    setSelectedContent(contentItem);
    setActionType(action);
    setShowActionModal(true);
  };

  const executeModerationAction = async () => {
    if (!selectedContent || !actionType || !actionReason) return;

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newAction: ModerationAction = {
      id: Date.now().toString(),
      contentId: selectedContent.id,
      action: actionType as any,
      reason: actionReason,
      adminId: 'current_admin',
      timestamp: new Date().toISOString()
    };

    setModerationActions(prev => [newAction, ...prev]);

    // Update content status
    setContent(prev => prev.map(item => {
      if (item.id === selectedContent.id) {
        if (actionType === 'delete') return { ...item, status: 'deleted' as const };
        if (actionType === 'hide') return { ...item, status: 'hidden' as const };
        if (actionType === 'approve') return { ...item, status: 'active' as const };
      }
      return item;
    }));

    setLoading(false);
    setShowActionModal(false);
    setActionReason('');
  };

  const handleBulkAction = async (action: string) => {
    if (bulkSelected.length === 0) return;

    setLoading(true);
    
    // Simulate bulk API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update multiple items
    setContent(prev => prev.map(item => {
      if (bulkSelected.includes(item.id)) {
        if (action === 'delete') return { ...item, status: 'deleted' as const };
        if (action === 'hide') return { ...item, status: 'hidden' as const };
        if (action === 'approve') return { ...item, status: 'active' as const };
      }
      return item;
    }));

    setBulkSelected([]);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'flagged': return 'bg-red-100 text-red-800';
      case 'hidden': return 'bg-yellow-100 text-yellow-800';
      case 'deleted': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score <= 3) return 'bg-green-100 text-green-800';
    if (score <= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'post': return <FileText className="w-4 h-4" />;
      case 'comment': return <MessageSquare className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search content or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {bulkSelected.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{bulkSelected.length} selected</span>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('approve')}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('hide')}>
                <Eye className="w-4 h-4 mr-1" />
                Hide
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <Label>Content Type</Label>
              <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="post">Posts</SelectItem>
                  <SelectItem value="comment">Comments</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="hidden">Hidden</SelectItem>
                  <SelectItem value="deleted">Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Min Reports</Label>
              <Input
                type="number"
                min="0"
                value={filters.reportThreshold}
                onChange={(e) => setFilters(prev => ({ ...prev, reportThreshold: parseInt(e.target.value) || 0 }))}
              />
            </div>
            
            <div>
              <Label>Min Risk Score</Label>
              <Input
                type="number"
                min="0"
                max="10"
                value={filters.moderationScore}
                onChange={(e) => setFilters(prev => ({ ...prev, moderationScore: parseInt(e.target.value) || 0 }))}
              />
            </div>
            
            <div>
              <Label>Date Range</Label>
              <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Content Queue ({filteredContent.length})</TabsTrigger>
          <TabsTrigger value="actions">Moderation History</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {filteredContent.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start space-x-4">
                      <Checkbox
                        checked={bulkSelected.includes(item.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setBulkSelected(prev => [...prev, item.id]);
                          } else {
                            setBulkSelected(prev => prev.filter(id => id !== item.id));
                          }
                        }}
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getContentIcon(item.type)}
                            <Badge variant="outline">{item.type}</Badge>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                            <Badge className={getScoreColor(item.moderationScore)}>
                              Risk: {item.moderationScore}/10
                            </Badge>
                            {item.reports > 0 && (
                              <Badge variant="destructive">
                                <Flag className="w-3 h-3 mr-1" />
                                {item.reports} reports
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedContent(item);
                                setShowContentModal(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            
                            {item.status === 'flagged' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleContentAction('approve', item)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleContentAction('hide', item)}
                                  className="text-yellow-600 hover:text-yellow-700"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleContentAction('delete', item)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            
                            {item.status === 'active' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleContentAction('flag', item)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Flag className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>@{item.authorUsername}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(item.createdAt).toLocaleString()}</span>
                            </span>
                          </div>
                          
                          <p className="text-gray-800 line-clamp-2">{item.content}</p>
                          
                          {item.hashtags.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <Hash className="w-4 h-4 text-blue-500" />
                              <div className="flex flex-wrap gap-1">
                                {item.hashtags.map((tag, index) => (
                                  <span key={index} className="text-blue-500 text-sm">{tag}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{item.engagement.likes} likes</span>
                            <span>{item.engagement.comments} comments</span>
                            <span>{item.engagement.shares} shares</span>
                            <span>{item.engagement.views} views</span>
                          </div>
                          
                          {item.reportReasons.length > 0 && (
                            <div className="mt-2">
                              <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                  Reported for: {item.reportReasons.join(', ')}
                                </AlertDescription>
                              </Alert>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredContent.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No content found matching your filters</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Moderation Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {moderationActions.map((action) => (
                  <div key={action.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {action.action.charAt(0).toUpperCase() + action.action.slice(1)} Content
                        </p>
                        <p className="text-sm text-gray-600">
                          Reason: {action.reason}
                        </p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>{new Date(action.timestamp).toLocaleString()}</p>
                        <p>by {action.adminId}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {moderationActions.length === 0 && (
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
                  <Flag className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold">{content.filter(c => c.status === 'flagged').length}</p>
                    <p className="text-sm text-gray-600">Flagged Content</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{content.filter(c => c.status === 'active').length}</p>
                    <p className="text-sm text-gray-600">Active Content</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Eye className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold">{content.filter(c => c.status === 'hidden').length}</p>
                    <p className="text-sm text-gray-600">Hidden Content</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Trash2 className="w-8 h-8 text-gray-600" />
                  <div>
                    <p className="text-2xl font-bold">{content.filter(c => c.status === 'deleted').length}</p>
                    <p className="text-sm text-gray-600">Deleted Content</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Content Detail Modal */}
      <Dialog open={showContentModal} onOpenChange={setShowContentModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Content Details</DialogTitle>
          </DialogHeader>
          {selectedContent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Author</Label>
                  <p className="font-medium">@{selectedContent.authorUsername}</p>
                </div>
                <div>
                  <Label>Created</Label>
                  <p>{new Date(selectedContent.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <Label>Type</Label>
                  <Badge>{selectedContent.type}</Badge>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedContent.status)}>
                    {selectedContent.status}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label>Content</Label>
                <div className="mt-2 p-4 border rounded-lg bg-gray-50">
                  <p>{selectedContent.content}</p>
                </div>
              </div>
              
              {selectedContent.media && (
                <div>
                  <Label>Media</Label>
                  <div className="mt-2 border rounded-lg p-4">
                    {selectedContent.media.type === 'image' ? (
                      <img src={selectedContent.media.url} alt="Content media" className="max-w-full h-auto" />
                    ) : (
                      <video controls className="max-w-full h-auto">
                        <source src={selectedContent.media.url} />
                      </video>
                    )}
                  </div>
                </div>
              )}
              
              {selectedContent.reportReasons.length > 0 && (
                <div>
                  <Label>Report Reasons</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedContent.reportReasons.map((reason, index) => (
                      <Badge key={index} variant="destructive">{reason}</Badge>
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
              {actionType.charAt(0).toUpperCase() + actionType.slice(1)} Content
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

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowActionModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={executeModerationAction} 
                disabled={!actionReason || loading}
                variant={actionType === 'delete' ? 'destructive' : 'default'}
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
