import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Square, 
  Trash2, 
  Shield, 
  UserX, 
  Mail, 
  Download, 
  Upload,
  AlertTriangle,
  Clock,
  CheckCircle,
  X,
  Play,
  Pause,
  MoreHorizontal,
  Users,
  Filter,
  Eye,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface BulkOperation {
  id: string;
  type: 'delete' | 'suspend' | 'verify' | 'email' | 'role_change' | 'export' | 'custom';
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresConfirmation: boolean;
  requiresInput?: boolean;
  inputLabel?: string;
  inputType?: 'text' | 'textarea' | 'select' | 'multiselect';
  inputOptions?: { label: string; value: string }[];
  dangerLevel: 'low' | 'medium' | 'high' | 'critical';
  permissions?: string[];
}

interface BulkJob {
  id: string;
  operationType: string;
  operationName: string;
  totalItems: number;
  processedItems: number;
  successCount: number;
  errorCount: number;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  errors: string[];
  results: any[];
}

interface BulkOperationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: any[];
  onSelectionChange: (items: any[]) => void;
  availableOperations: BulkOperation[];
  onExecuteOperation: (operation: BulkOperation, params: any, items: any[]) => Promise<void>;
  isLoading?: boolean;
}

export const BulkOperationsModal: React.FC<BulkOperationsModalProps> = ({
  isOpen,
  onClose,
  selectedItems,
  onSelectionChange,
  availableOperations,
  onExecuteOperation,
  isLoading = false
}) => {
  const [activeTab, setActiveTab] = useState('operations');
  const [selectedOperation, setSelectedOperation] = useState<BulkOperation | null>(null);
  const [operationParams, setOperationParams] = useState<Record<string, any>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [jobs, setJobs] = useState<BulkJob[]>([]);
  
  // Mock job data - would be fetched from API
  useEffect(() => {
    if (isOpen) {
      const mockJobs: BulkJob[] = [
        {
          id: 'job-1',
          operationType: 'suspend',
          operationName: 'Suspend Users',
          totalItems: 150,
          processedItems: 150,
          successCount: 148,
          errorCount: 2,
          status: 'completed',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          startedAt: new Date(Date.now() - 3600000).toISOString(),
          completedAt: new Date(Date.now() - 3000000).toISOString(),
          errors: ['User ID 123 not found', 'Permission denied for user ID 456'],
          results: []
        },
        {
          id: 'job-2',
          operationType: 'email',
          operationName: 'Send Notification Email',
          totalItems: 1000,
          processedItems: 750,
          successCount: 740,
          errorCount: 10,
          status: 'running',
          createdAt: new Date(Date.now() - 1800000).toISOString(),
          startedAt: new Date(Date.now() - 1800000).toISOString(),
          errors: ['Invalid email format', 'SMTP timeout'],
          results: []
        }
      ];
      setJobs(mockJobs);
    }
  }, [isOpen]);
  
  const handleExecuteOperation = async () => {
    if (!selectedOperation) return;
    
    try {
      await onExecuteOperation(selectedOperation, operationParams, selectedItems);
      setShowConfirmation(false);
      setSelectedOperation(null);
      setOperationParams({});
    } catch (error) {
      console.error('Bulk operation failed:', error);
    }
  };
  
  const getDangerColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-red-400';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'running': return <Play className="h-4 w-4 text-blue-500" />;
      case 'failed': return <X className="h-4 w-4 text-red-500" />;
      case 'cancelled': return <Pause className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Bulk Operations
            {selectedItems.length > 0 && (
              <Badge variant="secondary">{selectedItems.length} items selected</Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="jobs">Active Jobs</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="operations" className="space-y-4">
            {selectedItems.length === 0 ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No items selected. Please select items from the table to perform bulk operations.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Selected Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        {selectedItems.length} items
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectionChange([])}
                      >
                        Clear Selection
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Available Operations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {availableOperations.map((operation) => {
                        const Icon = operation.icon;
                        return (
                          <div
                            key={operation.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                              selectedOperation?.id === operation.id ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => setSelectedOperation(operation)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-md ${getDangerColor(operation.dangerLevel)} bg-opacity-10`}>
                                <Icon className={`h-5 w-5 text-${operation.dangerLevel === 'critical' ? 'red' : operation.dangerLevel === 'high' ? 'red' : operation.dangerLevel === 'medium' ? 'yellow' : 'green'}-600`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{operation.name}</h3>
                                  <div className={`w-2 h-2 rounded-full ${getDangerColor(operation.dangerLevel)}`} />
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {operation.description}
                                </p>
                                {operation.requiresConfirmation && (
                                  <Badge variant="outline" className="mt-2 text-xs">
                                    Requires confirmation
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {selectedOperation && (
                      <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                        <h4 className="font-medium mb-3">Operation Parameters</h4>
                        
                        {selectedOperation.requiresInput && (
                          <div className="space-y-3">
                            <Label>{selectedOperation.inputLabel}</Label>
                            {selectedOperation.inputType === 'textarea' ? (
                              <Textarea
                                placeholder={`Enter ${selectedOperation.inputLabel?.toLowerCase()}`}
                                value={operationParams[selectedOperation.id] || ''}
                                onChange={(e) => setOperationParams(prev => ({
                                  ...prev,
                                  [selectedOperation.id]: e.target.value
                                }))}
                              />
                            ) : selectedOperation.inputType === 'select' ? (
                              <Select
                                value={operationParams[selectedOperation.id] || ''}
                                onValueChange={(value) => setOperationParams(prev => ({
                                  ...prev,
                                  [selectedOperation.id]: value
                                }))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder={`Select ${selectedOperation.inputLabel?.toLowerCase()}`} />
                                </SelectTrigger>
                                <SelectContent>
                                  {selectedOperation.inputOptions?.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                placeholder={`Enter ${selectedOperation.inputLabel?.toLowerCase()}`}
                                value={operationParams[selectedOperation.id] || ''}
                                onChange={(e) => setOperationParams(prev => ({
                                  ...prev,
                                  [selectedOperation.id]: e.target.value
                                }))}
                              />
                            )}
                          </div>
                        )}
                        
                        <div className="flex gap-3 mt-4">
                          <Button
                            onClick={() => {
                              if (selectedOperation.requiresConfirmation) {
                                setShowConfirmation(true);
                              } else {
                                handleExecuteOperation();
                              }
                            }}
                            disabled={isLoading}
                            variant={selectedOperation.dangerLevel === 'critical' ? 'destructive' : 'default'}
                          >
                            Execute Operation
                          </Button>
                          
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedOperation(null);
                              setOperationParams({});
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="jobs" className="space-y-4">
            <div className="space-y-3">
              {jobs.filter(job => job.status === 'running' || job.status === 'pending').map((job) => (
                <Card key={job.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(job.status)}
                        <h3 className="font-medium">{job.operationName}</h3>
                        <Badge variant={job.status === 'running' ? 'default' : 'secondary'}>
                          {job.status}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {job.processedItems} / {job.totalItems} items
                      </div>
                    </div>
                    
                    <Progress 
                      value={(job.processedItems / job.totalItems) * 100} 
                      className="mb-3"
                    />
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Success:</span>
                        <span className="ml-2 text-green-600 font-medium">{job.successCount}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Errors:</span>
                        <span className="ml-2 text-red-600 font-medium">{job.errorCount}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Started:</span>
                        <span className="ml-2">{new Date(job.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    
                    {job.errors.length > 0 && (
                      <div className="mt-3 p-2 bg-red-50 rounded text-sm">
                        <span className="font-medium text-red-800">Recent Errors:</span>
                        <ul className="mt-1 text-red-700">
                          {job.errors.slice(0, 3).map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              {jobs.filter(job => job.status === 'running' || job.status === 'pending').length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No active jobs
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <div className="space-y-3">
              {jobs.filter(job => job.status === 'completed' || job.status === 'failed').map((job) => (
                <Card key={job.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(job.status)}
                        <h3 className="font-medium">{job.operationName}</h3>
                        <Badge variant={job.status === 'completed' ? 'default' : 'destructive'}>
                          {job.status}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {new Date(job.completedAt || job.createdAt).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 mt-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total:</span>
                        <span className="ml-2 font-medium">{job.totalItems}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Success:</span>
                        <span className="ml-2 text-green-600 font-medium">{job.successCount}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Errors:</span>
                        <span className="ml-2 text-red-600 font-medium">{job.errorCount}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Success Rate:</span>
                        <span className="ml-2 font-medium">
                          {Math.round((job.successCount / job.totalItems) * 100)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Confirm Bulk Operation
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  You are about to perform <strong>{selectedOperation?.name}</strong> on{' '}
                  <strong>{selectedItems.length}</strong> items. This action cannot be undone.
                </AlertDescription>
              </Alert>
              
              {selectedOperation?.dangerLevel === 'critical' && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    This is a critical operation that may permanently affect data integrity.
                    Please ensure you have proper backups before proceeding.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleExecuteOperation}
                  disabled={isLoading}
                  variant={selectedOperation?.dangerLevel === 'critical' ? 'destructive' : 'default'}
                >
                  {isLoading ? 'Processing...' : 'Confirm & Execute'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

// Bulk Selection Hook
export const useBulkSelection = <T extends { id: string }>(items: T[]) => {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  
  const selectAll = () => setSelectedItems([...items]);
  const selectNone = () => setSelectedItems([]);
  const toggleItem = (item: T) => {
    setSelectedItems(prev => 
      prev.find(i => i.id === item.id)
        ? prev.filter(i => i.id !== item.id)
        : [...prev, item]
    );
  };
  
  const isSelected = (item: T) => selectedItems.some(i => i.id === item.id);
  const isAllSelected = items.length > 0 && selectedItems.length === items.length;
  const isPartiallySelected = selectedItems.length > 0 && selectedItems.length < items.length;
  
  return {
    selectedItems,
    selectAll,
    selectNone,
    toggleItem,
    isSelected,
    isAllSelected,
    isPartiallySelected,
    setSelectedItems
  };
};

// Bulk Operation Definitions
export const defaultBulkOperations: BulkOperation[] = [
  {
    id: 'delete',
    type: 'delete',
    name: 'Delete Items',
    description: 'Permanently delete selected items',
    icon: Trash2,
    requiresConfirmation: true,
    dangerLevel: 'critical',
    permissions: ['user.delete']
  },
  {
    id: 'suspend',
    type: 'suspend',
    name: 'Suspend Users',
    description: 'Temporarily suspend user accounts',
    icon: UserX,
    requiresConfirmation: true,
    requiresInput: true,
    inputLabel: 'Suspension Reason',
    inputType: 'textarea',
    dangerLevel: 'high',
    permissions: ['user.suspend']
  },
  {
    id: 'verify',
    type: 'verify',
    name: 'Verify Accounts',
    description: 'Mark accounts as verified',
    icon: Shield,
    requiresConfirmation: false,
    dangerLevel: 'low',
    permissions: ['user.verify']
  },
  {
    id: 'email',
    type: 'email',
    name: 'Send Email',
    description: 'Send notification email to selected users',
    icon: Mail,
    requiresConfirmation: true,
    requiresInput: true,
    inputLabel: 'Email Template',
    inputType: 'select',
    inputOptions: [
      { label: 'Welcome Email', value: 'welcome' },
      { label: 'Verification Reminder', value: 'verification' },
      { label: 'Security Alert', value: 'security' },
      { label: 'Custom Message', value: 'custom' }
    ],
    dangerLevel: 'medium',
    permissions: ['user.email']
  },
  {
    id: 'export',
    type: 'export',
    name: 'Export Data',
    description: 'Export selected items to CSV/Excel',
    icon: Download,
    requiresConfirmation: false,
    dangerLevel: 'low',
    permissions: ['data.export']
  }
];
