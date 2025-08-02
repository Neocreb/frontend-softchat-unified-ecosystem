import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Bitcoin,
  Wallet,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Zap,
  ArrowRight,
  DollarSign,
  Lock,
} from 'lucide-react';
import {
  unifiedCryptoPaymentService,
  type PaymentRequest,
  type CryptoPaymentOption,
  type CryptoPayment,
} from '@/services/unifiedCryptoPaymentService';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface UniversalCryptoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentRequest: PaymentRequest;
  onSuccess?: (payment: CryptoPayment) => void;
  onError?: (error: string) => void;
  title?: string;
  description?: string;
}

const UniversalCryptoPaymentModal: React.FC<UniversalCryptoPaymentModalProps> = ({
  isOpen,
  onClose,
  paymentRequest,
  onSuccess,
  onError,
  title,
  description,
}) => {
  const [cryptoOptions, setCryptoOptions] = useState<CryptoPaymentOption[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [step, setStep] = useState<'select' | 'confirm' | 'processing' | 'success' | 'error'>('select');
  const [payment, setPayment] = useState<CryptoPayment | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load crypto options when modal opens
  useEffect(() => {
    if (isOpen) {
      loadCryptoOptions();
    }
  }, [isOpen]);

  const loadCryptoOptions = async () => {
    try {
      setIsLoading(true);
      const options = await unifiedCryptoPaymentService.getAvailablePaymentOptions();
      setCryptoOptions(options);
      
      // Auto-select the first available option with sufficient balance
      const affordable = options.find(option => {
        const cost = unifiedCryptoPaymentService.calculateTotalCost(paymentRequest.amount, option.id);
        return option.balance >= cost.totalCrypto;
      });
      
      if (affordable) {
        setSelectedCrypto(affordable.id);
      } else if (options.length > 0) {
        setSelectedCrypto(options[0].id);
      }
    } catch (err) {
      console.error('Failed to load crypto options:', err);
      setError('Failed to load payment options');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedOption = cryptoOptions.find(option => option.id === selectedCrypto);
  const paymentCost = selectedOption 
    ? unifiedCryptoPaymentService.calculateTotalCost(paymentRequest.amount, selectedCrypto)
    : null;
  
  const canAfford = selectedOption && paymentCost 
    ? selectedOption.balance >= paymentCost.totalCrypto
    : false;

  const handleNext = () => {
    if (step === 'select' && selectedCrypto) {
      setStep('confirm');
    }
  };

  const handleBack = () => {
    if (step === 'confirm') {
      setStep('select');
    }
  };

  const handlePayment = async () => {
    if (!selectedCrypto || !pin.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter your security PIN',
        variant: 'destructive',
      });
      return;
    }

    try {
      setStep('processing');
      setError('');

      const result = await unifiedCryptoPaymentService.processPayment(
        paymentRequest,
        selectedCrypto,
        pin
      );

      setPayment(result);
      setStep('success');
      
      toast({
        title: 'Payment Successful',
        description: `Payment of ${paymentRequest.amount} USD completed via ${selectedOption?.name}`,
      });

      onSuccess?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      setStep('error');
      
      toast({
        title: 'Payment Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      onError?.(errorMessage);
    }
  };

  const handleClose = () => {
    setStep('select');
    setPin('');
    setError('');
    setPayment(null);
    onClose();
  };

  const getPurposeTitle = () => {
    switch (paymentRequest.purpose) {
      case 'marketplace': return 'Marketplace Purchase';
      case 'freelance': return 'Freelance Payment';
      case 'tip': return 'Creator Tip';
      case 'subscription': return 'Subscription Payment';
      case 'reward': return 'Reward Redemption';
      case 'p2p': return 'P2P Transfer';
      default: return 'Crypto Payment';
    }
  };

  const getPurposeIcon = () => {
    switch (paymentRequest.purpose) {
      case 'marketplace': return '🛒';
      case 'freelance': return '💼';
      case 'tip': return '💝';
      case 'subscription': return '⭐';
      case 'reward': return '🎁';
      case 'p2p': return '🔄';
      default: return '💳';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-lg">{getPurposeIcon()}</span>
            {title || getPurposeTitle()}
          </DialogTitle>
          <DialogDescription>
            {description || `Pay ${paymentRequest.amount} USD using cryptocurrency`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Payment Summary */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="font-semibold text-lg">${paymentRequest.amount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Step 1: Select Crypto */}
          {step === 'select' && (
            <div className="space-y-4">
              <Label className="text-sm font-medium">Choose Payment Method</Label>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <RadioGroup value={selectedCrypto} onValueChange={setSelectedCrypto}>
                  {cryptoOptions.map((option) => {
                    const cost = unifiedCryptoPaymentService.calculateTotalCost(paymentRequest.amount, option.id);
                    const affordable = option.balance >= cost.totalCrypto;
                    
                    return (
                      <div key={option.id} className="space-y-2">
                        <RadioGroupItem
                          value={option.id}
                          id={option.id}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={option.id}
                          className={cn(
                            "flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all",
                            "peer-checked:border-primary peer-checked:bg-primary/5",
                            !affordable && "opacity-60 border-destructive/30"
                          )}
                        >
                          <div className="text-2xl">{option.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{option.name}</span>
                              <Badge variant={affordable ? "default" : "destructive"}>
                                {affordable ? "Available" : "Insufficient"}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div className="flex justify-between">
                                <span>Balance:</span>
                                <span>{option.balance.toFixed(6)} {option.symbol}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Required:</span>
                                <span>{cost.totalCrypto.toFixed(6)} {option.symbol}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Network Fee:</span>
                                <span>${option.networkFee.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Est. Time:</span>
                                <span>{option.confirmationTime}</span>
                              </div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              )}
            </div>
          )}

          {/* Step 2: Confirm Payment */}
          {step === 'confirm' && selectedOption && paymentCost && (
            <div className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  You're about to pay with {selectedOption.name}. This transaction cannot be reversed.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Amount</span>
                    <span>{paymentCost.cryptoAmount.toFixed(6)} {selectedOption.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Network Fee</span>
                    <span>{paymentCost.networkFee.toFixed(6)} {selectedOption.symbol}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{paymentCost.totalCrypto.toFixed(6)} {selectedOption.symbol}</span>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    ≈ ${paymentCost.totalUSD.toFixed(2)} USD
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label htmlFor="pin" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Security PIN
                </Label>
                <div className="relative">
                  <Input
                    id="pin"
                    type={showPin ? "text" : "password"}
                    placeholder="Enter your security PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPin(!showPin)}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {!canAfford && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Insufficient balance. You need {paymentCost.totalCrypto.toFixed(6)} {selectedOption.symbol} but only have {selectedOption.balance.toFixed(6)}.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Step 3: Processing */}
          {step === 'processing' && (
            <div className="text-center space-y-4 py-8">
              <div className="flex justify-center">
                <RefreshCw className="w-12 h-12 animate-spin text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Processing Payment</h3>
                <p className="text-sm text-muted-foreground">
                  Please wait while we process your cryptocurrency payment...
                </p>
              </div>
              <Progress value={60} className="w-full" />
            </div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && payment && (
            <div className="text-center space-y-4 py-8">
              <div className="flex justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-green-600">Payment Successful!</h3>
                <p className="text-sm text-muted-foreground">
                  Your payment has been confirmed on the blockchain.
                </p>
              </div>
              
              <Card>
                <CardContent className="pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Transaction ID</span>
                    <span className="font-mono text-xs">{payment.transactionHash}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Amount Paid</span>
                    <span>{payment.cryptoAmount.toFixed(6)} {payment.cryptoCurrency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Status</span>
                    <Badge variant="default">Confirmed</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 5: Error */}
          {step === 'error' && (
            <div className="text-center space-y-4 py-8">
              <div className="flex justify-center">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-red-600">Payment Failed</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setStep('select')}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          {step === 'select' && (
            <div className="flex gap-2 w-full">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleNext} 
                disabled={!selectedCrypto || !canAfford}
                className="flex-1 gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {step === 'confirm' && (
            <div className="flex gap-2 w-full">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handlePayment}
                disabled={!pin.trim() || !canAfford}
                className="flex-1 gap-2"
              >
                <Zap className="w-4 h-4" />
                Pay Now
              </Button>
            </div>
          )}

          {(step === 'success' || step === 'error') && (
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UniversalCryptoPaymentModal;
