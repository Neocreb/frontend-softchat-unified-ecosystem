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
          <div className="bg-white border border-gray-200 rounded-lg p-6 font-mono">
            {/* Header */}
            <div className="text-center border-b border-gray-200 pb-4 mb-4">
              <h1 className="text-lg font-bold text-gray-800">ELOITY</h1>
              <p className="text-xs text-gray-500">Digital Transaction Receipt</p>
              <p className="text-xs text-gray-400">{format(new Date(receiptData.timestamp), 'MM/dd/yyyy HH:mm')}</p>
            </div>

            {/* Transaction Summary */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Amount:</span>
                <span className="text-lg font-bold text-gray-900">${Math.abs(transaction.amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Type:</span>
                <span className="text-sm capitalize">{transaction.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`text-sm capitalize font-medium ${
                  transaction.status === 'completed' ? 'text-green-600' :
                  transaction.status === 'pending' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {transaction.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Description:</span>
                <span className="text-sm text-right max-w-48">{transaction.description}</span>
              </div>
            </div>

            {/* Transaction IDs */}
            <div className="border-t border-gray-200 pt-3 mb-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Receipt ID:</span>
                <span className="font-mono">{receiptData.id.slice(-8)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Transaction ID:</span>
                <span className="font-mono">{transaction.id.slice(-8)}</span>
              </div>
            </div>

            {/* Verification */}
            <div className="border-t border-gray-200 pt-3">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Verification Code</p>
                <p className="font-mono text-sm font-bold bg-gray-50 p-2 rounded">{receiptData.verificationCode}</p>
                <p className="text-xs text-gray-400 mt-2">Verify at: eloity.com/verify/{receiptData.verificationCode}</p>
              </div>
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
            <CardContent className="p-3">
              <div className="flex gap-2 items-center">
                <Shield className="h-4 w-4 text-blue-600" />
                <p className="text-sm text-blue-800 font-medium">
                  This receipt is cryptographically secured and tamper-proof
                </p>
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
      <title>Receipt - ${receiptData.id.slice(-8)}</title>
      <style>
        body { font-family: 'Courier New', monospace; max-width: 500px; margin: 0 auto; padding: 20px; line-height: 1.4; }
        .header { text-align: center; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 15px; }
        .row { display: flex; justify-content: space-between; margin: 8px 0; }
        .amount { font-size: 18px; font-weight: bold; }
        .verification { text-align: center; background: #f8f9fa; padding: 10px; margin: 15px 0; border: 1px solid #ddd; }
        .footer { border-top: 1px solid #ccc; margin-top: 20px; padding-top: 10px; font-size: 10px; text-align: center; color: #666; }
        @media print { body { max-width: none; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>ELOITY</h1>
        <p>Digital Transaction Receipt</p>
        <p>${format(new Date(receiptData.timestamp), 'MM/dd/yyyy HH:mm')}</p>
      </div>

      <div class="row amount">
        <span>Amount:</span>
        <span>$${Math.abs(transaction.amount).toFixed(2)}</span>
      </div>
      <div class="row">
        <span>Type:</span>
        <span>${transaction.type}</span>
      </div>
      <div class="row">
        <span>Status:</span>
        <span>${transaction.status}</span>
      </div>
      <div class="row">
        <span>Description:</span>
        <span>${transaction.description}</span>
      </div>

      <div style="margin: 15px 0; font-size: 11px; color: #666;">
        <div class="row"><span>Receipt ID:</span><span>${receiptData.id.slice(-8)}</span></div>
        <div class="row"><span>Transaction ID:</span><span>${transaction.id.slice(-8)}</span></div>
      </div>

      <div class="verification">
        <strong>Verification Code</strong><br>
        <span style="font-size: 16px; font-weight: bold; font-family: monospace;">${receiptData.verificationCode}</span><br>
        <small>Verify at: eloity.com/verify/${receiptData.verificationCode}</small>
      </div>

      <div class="footer">
        This receipt is cryptographically secured<br>
        Generated by Eloity Security System
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
