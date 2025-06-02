
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Upload, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { kycService, KYCDocument } from '@/services/kycService';

interface KYCVerificationModalProps {
  userId: string;
  currentLevel: number;
  onLevelUpdate: (newLevel: number) => void;
}

const KYCVerificationModal: React.FC<KYCVerificationModalProps> = ({ 
  userId, 
  currentLevel, 
  onLevelUpdate 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<KYCDocument[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    if (isOpen) {
      loadDocuments();
    }
  }, [isOpen, userId]);

  const loadDocuments = async () => {
    try {
      const userDocs = await kycService.getUserKYCDocuments(userId);
      setDocuments(userDocs);
    } catch (error) {
      console.error('Error loading KYC documents:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedDocType) {
      toast({
        title: "Error",
        description: "Please select a document type and file.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // In a real app, you would upload to storage first
      const mockUrl = URL.createObjectURL(file);
      
      const newDoc = await kycService.uploadKYCDocument({
        user_id: userId,
        document_type: selectedDocType as any,
        document_url: mockUrl,
        verification_status: 'pending'
      });

      if (newDoc) {
        setDocuments(prev => [newDoc, ...prev]);
        toast({
          title: "Document uploaded",
          description: "Your document has been submitted for verification.",
        });
        setSelectedDocType('');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Upload failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getKYCLevelInfo = (level: number) => {
    const levels = {
      0: { name: 'Unverified', color: 'bg-gray-500', limits: '$1,000/day' },
      1: { name: 'Basic', color: 'bg-blue-500', limits: '$5,000/day' },
      2: { name: 'Intermediate', color: 'bg-green-500', limits: '$25,000/day' },
      3: { name: 'Advanced', color: 'bg-purple-500', limits: '$100,000/day' }
    };
    return levels[level as keyof typeof levels] || levels[0];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const levelInfo = getKYCLevelInfo(currentLevel);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          KYC Level {currentLevel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            KYC Verification
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Level Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Verification Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Badge className={`${levelInfo.color} text-white mb-2`}>
                    Level {currentLevel}: {levelInfo.name}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Trading Limit: {levelInfo.limits}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload New Document */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Verification Document</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="docType">Document Type</Label>
                <Select value={selectedDocType} onValueChange={setSelectedDocType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="driver_license">Driver's License</SelectItem>
                    <SelectItem value="national_id">National ID</SelectItem>
                    <SelectItem value="utility_bill">Utility Bill</SelectItem>
                    <SelectItem value="bank_statement">Bank Statement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="document">Document File</Label>
                <Input
                  id="document"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  disabled={uploading || !selectedDocType}
                />
              </div>

              {uploading && (
                <div className="text-center py-4">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Uploading document...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Uploaded Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No documents uploaded yet
                </p>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(doc.verification_status)}
                        <div>
                          <p className="font-medium capitalize">
                            {doc.document_type.replace('_', ' ')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded {new Date(doc.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {doc.verification_status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* KYC Level Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Verification Levels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded bg-blue-50">
                  <span className="font-medium">Level 1 - Basic</span>
                  <span className="text-sm">Government ID required</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-green-50">
                  <span className="font-medium">Level 2 - Intermediate</span>
                  <span className="text-sm">ID + Proof of address</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-purple-50">
                  <span className="font-medium">Level 3 - Advanced</span>
                  <span className="text-sm">Enhanced verification</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KYCVerificationModal;
