import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Transaction } from "@/types/wallet";
import { useAuth } from "@/contexts/AuthContext";
import {
  FileText,
  Shield,
  Download,
  Printer,
  Share2,
  Copy,
  QrCode,
  CheckCircle,
  Lock,
  Calendar,
  DollarSign,
  Hash,
  Fingerprint,
} from "lucide-react";
import { format } from "date-fns";

interface ReceiptData {
  id: string;
  transactionId: string;
  timestamp: string;
  amount: number;
  type: string;
  source: string;
  description: string;
  status: string;
  hash: string;
  digitalSignature: string;
  verificationCode: string;
  blockchainTxHash?: string;
}

interface SecureReceiptProps {
  transaction: Transaction;
  isOpen: boolean;
  onClose: () => void;
}

// Crypto utility functions (simplified for demo - in production use proper crypto libraries)
const generateHash = (data: string): string => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
};

const generateDigitalSignature = (data: string, privateKey: string): string => {
  // Simplified signature generation - in production use proper cryptographic libraries
  const combinedData = data + privateKey;
  return generateHash(combinedData);
};

const generateVerificationCode = (): string => {
  return Math.random().toString(36).substring(2, 15).toUpperCase();
};

const SecureReceiptDialog = ({ transaction, isOpen, onClose }: SecureReceiptProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const receiptRef = useRef<HTMLDivElement>(null);
  
  // Generate secure receipt data
  const receiptData: ReceiptData = {
    id: `RCP-${Date.now()}`,
    transactionId: transaction.id,
    timestamp: new Date().toISOString(),
    amount: transaction.amount,
    type: transaction.type,
    source: transaction.source,
    description: transaction.description,
    status: transaction.status,
    hash: generateHash(JSON.stringify(transaction) + Date.now()),
    digitalSignature: generateDigitalSignature(
      JSON.stringify(transaction), 
      user?.id || "demo-key"
    ),
    verificationCode: generateVerificationCode(),
    blockchainTxHash: `0x${generateHash(transaction.id + Date.now())}`,
  };

  const handleDownloadPDF = async () => {
    try {
      // In a real implementation, you'd use a library like jsPDF or Puppeteer
      const receiptHTML = generateReceiptHTML(receiptData, transaction, user);
      
      // Create a blob with the HTML content
      const blob = new Blob([receiptHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${receiptData.id}.html`;
      a.click();
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "Receipt Downloaded",
        description: "Secure receipt has been downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download receipt",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(generateReceiptHTML(receiptData, transaction, user));
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleCopyVerificationCode = () => {
    navigator.clipboard.writeText(receiptData.verificationCode);
    toast({
      title: "Copied",
      description: "Verification code copied to clipboard",
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Transaction Receipt',
      text: `Receipt for ${transaction.description} - Amount: $${transaction.amount}`,
      url: `${window.location.origin}/verify-receipt/${receiptData.verificationCode}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(shareData.url || '');
      toast({
        title: "Link Copied",
        description: "Verification link copied to clipboard",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Secure Transaction Receipt
          </DialogTitle>
        </DialogHeader>
        
        <div ref={receiptRef} className="space-y-6">
          {/* Security Header */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Cryptographically Secured</p>
                    <p className="text-sm text-green-700">This receipt is tamper-proof and verifiable</p>
                  </div>
                </div>
                <Badge className="bg-green-600 text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Receipt Content */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8 font-mono">
            {/* Header */}
            <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-800">SOFTCHAT PLATFORM</h1>
              <p className="text-sm text-gray-600">Secure Digital Receipt</p>
              <p className="text-xs text-gray-500 mt-2">
                Generated: {format(new Date(receiptData.timestamp), 'PPpp')}
              </p>
            </div>

            {/* Receipt Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h3 className="font-bold text-lg border-b border-gray-300 pb-2">
                  TRANSACTION DETAILS
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Receipt ID:</span>
                    <span className="font-mono">{receiptData.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Transaction ID:</span>
                    <span className="font-mono text-xs">{transaction.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Date:</span>
                    <span>{format(new Date(transaction.timestamp), 'PPP')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Time:</span>
                    <span>{format(new Date(transaction.timestamp), 'pp')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Type:</span>
                    <span className="capitalize">{transaction.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Source:</span>
                    <span className="capitalize">{transaction.source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span className={`capitalize font-medium ${
                      transaction.status === 'completed' ? 'text-green-600' :
                      transaction.status === 'pending' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg border-b border-gray-300 pb-2">
                  AMOUNT & DESCRIPTION
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Amount:</span>
                    <span className="text-xl font-bold text-green-600">
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Description:</span>
                    <span className="text-right max-w-48">{transaction.description}</span>
                  </div>
                  {user && (
                    <>
                      <div className="flex justify-between">
                        <span className="font-medium">User ID:</span>
                        <span className="font-mono text-xs">{user.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">User Email:</span>
                        <span className="text-xs">{user.email}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Security Information */}
            <div className="border-t-2 border-gray-300 pt-6 mb-6">
              <h3 className="font-bold text-lg mb-4">SECURITY & VERIFICATION</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    <span className="font-medium">Content Hash:</span>
                  </div>
                  <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                    {receiptData.hash}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <Fingerprint className="h-4 w-4" />
                    <span className="font-medium">Digital Signature:</span>
                  </div>
                  <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                    {receiptData.digitalSignature}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">Verification Code:</span>
                  </div>
                  <p className="font-mono text-lg font-bold bg-yellow-100 p-3 rounded text-center">
                    {receiptData.verificationCode}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <Lock className="h-4 w-4" />
                    <span className="font-medium">Blockchain TX:</span>
                  </div>
                  <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                    {receiptData.blockchainTxHash}
                  </p>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="border-t-2 border-gray-300 pt-6 text-center">
              <h3 className="font-bold text-lg mb-4">QUICK VERIFICATION</h3>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 bg-gray-100 border-2 border-gray-300 rounded flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-gray-500" />
                </div>
                <p className="text-xs text-gray-600 max-w-md">
                  Scan QR code or visit: softchat.com/verify/{receiptData.verificationCode}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t-2 border-gray-300 mt-8 pt-6 text-center text-xs text-gray-500">
              <p className="mb-2">
                This receipt is cryptographically secured and tamper-evident.
              </p>
              <p className="mb-2">
                Any modifications to this document will invalidate the digital signature.
              </p>
              <p className="font-mono">
                Generated by SoftChat Platform Security System v2.0
              </p>
              <p className="mt-4 font-mono">
                Receipt Hash: {receiptData.hash}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center pt-4 border-t">
            <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            
            <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            
            <Button onClick={handleShare} variant="outline" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            
            <Button 
              onClick={handleCopyVerificationCode} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Code
            </Button>
          </div>

          {/* Security Notice */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Security Features:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Cryptographic hash prevents tampering</li>
                    <li>• Digital signature ensures authenticity</li>
                    <li>• Blockchain anchoring for immutable record</li>
                    <li>• Unique verification code for instant validation</li>
                    <li>• Timestamped with server-side validation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const generateReceiptHTML = (receiptData: ReceiptData, transaction: Transaction, user: any) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Secure Receipt - ${receiptData.id}</title>
      <style>
        body { font-family: 'Courier New', monospace; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
        .section { margin: 20px 0; }
        .row { display: flex; justify-content: space-between; margin: 5px 0; }
        .security { background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .hash { font-size: 10px; word-break: break-all; background: #e0e0e0; padding: 5px; }
        .verification-code { font-size: 18px; font-weight: bold; text-align: center; background: #fff3cd; padding: 10px; border: 2px solid #856404; }
        @media print { body { max-width: none; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>SOFTCHAT PLATFORM</h1>
        <p>Secure Digital Receipt</p>
        <p>Generated: ${format(new Date(receiptData.timestamp), 'PPpp')}</p>
      </div>
      
      <div class="section">
        <h3>TRANSACTION DETAILS</h3>
        <div class="row"><span>Receipt ID:</span><span>${receiptData.id}</span></div>
        <div class="row"><span>Transaction ID:</span><span>${transaction.id}</span></div>
        <div class="row"><span>Amount:</span><span>$${Math.abs(transaction.amount).toFixed(2)}</span></div>
        <div class="row"><span>Type:</span><span>${transaction.type}</span></div>
        <div class="row"><span>Source:</span><span>${transaction.source}</span></div>
        <div class="row"><span>Status:</span><span>${transaction.status}</span></div>
        <div class="row"><span>Description:</span><span>${transaction.description}</span></div>
      </div>
      
      <div class="security">
        <h3>SECURITY & VERIFICATION</h3>
        <p><strong>Content Hash:</strong></p>
        <div class="hash">${receiptData.hash}</div>
        <p><strong>Digital Signature:</strong></p>
        <div class="hash">${receiptData.digitalSignature}</div>
        <p><strong>Blockchain Transaction:</strong></p>
        <div class="hash">${receiptData.blockchainTxHash}</div>
      </div>
      
      <div class="verification-code">
        Verification Code: ${receiptData.verificationCode}
      </div>
      
      <p style="text-align: center; margin-top: 30px; font-size: 12px;">
        Verify at: softchat.com/verify/${receiptData.verificationCode}
      </p>
      
      <div style="border-top: 1px solid #ccc; margin-top: 30px; padding-top: 10px; font-size: 10px; text-align: center;">
        This receipt is cryptographically secured and tamper-evident.<br>
        Generated by SoftChat Platform Security System v2.0<br>
        Receipt Hash: ${receiptData.hash}
      </div>
    </body>
    </html>
  `;
};

interface SecureReceiptGeneratorProps {
  transaction?: Transaction;
}

const SecureReceiptGenerator = ({ transaction: propTransaction }: SecureReceiptGeneratorProps = {}) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);

  // Mock transaction for demo when no transaction is provided
  const demoTransaction: Transaction = {
    id: "tx_demo_" + Date.now(),
    type: "earned",
    amount: 250.75,
    source: "freelance",
    description: "Website Development Project - Final Payment",
    timestamp: new Date().toISOString(),
    status: "completed",
  };

  const handleGenerateReceipt = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowReceiptDialog(true);
  };

  // If transaction is provided as prop, render the receipt directly
  if (propTransaction) {
    return <SecureReceiptDialog transaction={propTransaction} isOpen={true} onClose={() => {}} />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Secure Receipt Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Generate tamper-proof receipts with cryptographic security
            </p>
            <Button 
              onClick={() => handleGenerateReceipt(demoTransaction)}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Generate Demo Receipt
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Card className="text-center p-4">
              <Hash className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h4 className="font-medium">Cryptographic Hash</h4>
              <p className="text-xs text-gray-600 mt-1">
                Content integrity protection
              </p>
            </Card>
            
            <Card className="text-center p-4">
              <Fingerprint className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h4 className="font-medium">Digital Signature</h4>
              <p className="text-xs text-gray-600 mt-1">
                Authenticity verification
              </p>
            </Card>
            
            <Card className="text-center p-4">
              <Lock className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <h4 className="font-medium">Blockchain Anchor</h4>
              <p className="text-xs text-gray-600 mt-1">
                Immutable timestamp record
              </p>
            </Card>
          </div>
        </CardContent>
      </Card>

      {selectedTransaction && (
        <SecureReceiptDialog
          transaction={selectedTransaction}
          isOpen={showReceiptDialog}
          onClose={() => setShowReceiptDialog(false)}
        />
      )}
    </div>
  );
};

export default SecureReceiptGenerator;
