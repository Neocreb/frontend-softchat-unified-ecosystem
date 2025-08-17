import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useWalletContext } from "@/contexts/WalletContext";
import { useAuth } from "@/contexts/AuthContext";
import { africanBankingService, Bank, Country } from "@/services/africanBankingService";
import { accountVerificationService, AccountVerificationResult } from "@/services/accountVerificationService";
import {
  Send,
  Building,
  Smartphone,
  User,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  Search,
  MapPin,
  CreditCard,
  Zap,
  Globe,
  Star,
  Shield,
  Info,
  Calculator,
} from "lucide-react";

interface EnhancedSendMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BankTransferData {
  country: string;
  bankId: string;
  accountNumber: string;
  accountName: string;
  routingNumber?: string;
  swiftCode?: string;
  transferType: 'domestic' | 'international' | 'instant';
}

interface ContactTransferData {
  recipient: string;
  recipientType: 'email' | 'phone' | 'username';
}

const EnhancedSendMoneyModal = ({ isOpen, onClose }: EnhancedSendMoneyModalProps) => {
  const { toast } = useToast();
  const { walletBalance } = useWalletContext();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'contact' | 'bank'>('contact');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [source, setSource] = useState('total');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Contact transfer state
  const [contactData, setContactData] = useState<ContactTransferData>({
    recipient: '',
    recipientType: 'email'
  });

  // Bank transfer state
  const [bankData, setBankData] = useState<BankTransferData>({
    country: 'NG', // Default to Nigeria for African audience
    bankId: '',
    accountNumber: '',
    accountName: '',
    routingNumber: '',
    swiftCode: '',
    transferType: 'domestic'
  });

  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [transferFee, setTransferFee] = useState(0);
  const [countries] = useState<Country[]>(africanBankingService.getAllCountries());
  const [banks, setBanks] = useState<Bank[]>([]);
  const [popularBanks, setPopularBanks] = useState<Bank[]>([]);
  const [verificationResult, setVerificationResult] = useState<AccountVerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [shouldVerify, setShouldVerify] = useState(false);
  const [amountValidation, setAmountValidation] = useState<{isValid: boolean; errors: string[]; warnings: string[]} | null>(null);

  // Recent contacts (mock data - replace with actual service)
  const recentContacts = [
    { id: '1', name: 'John Doe', email: 'john@example.com', avatar: '', type: 'email' },
    { id: '2', name: 'Jane Smith', phone: '+234901234567', avatar: '', type: 'phone' },
    { id: '3', name: 'mike_dev', username: 'mike_dev', avatar: '', type: 'username' },
  ];

  // Update banks when country changes
  useEffect(() => {
    if (bankData.country) {
      const countryBanks = africanBankingService.getBanksByCountry(bankData.country);
      setBanks(countryBanks);
      setPopularBanks(africanBankingService.getPopularBanks(bankData.country));
      setBankData(prev => ({ ...prev, bankId: '', accountNumber: '', accountName: '' }));
      setSelectedBank(null);
    }
  }, [bankData.country]);

  // Update selected bank and transfer fee
  useEffect(() => {
    if (bankData.bankId) {
      const bank = africanBankingService.getBankById(bankData.bankId);
      setSelectedBank(bank || null);
      
      if (bank && amount) {
        const fee = africanBankingService.calculateTransferFee(
          parseFloat(amount),
          bank,
          bankData.transferType
        );
        setTransferFee(fee);
      }
    }
  }, [bankData.bankId, amount, bankData.transferType]);

  const filteredBanks = searchQuery 
    ? africanBankingService.searchBanks(searchQuery, bankData.country)
    : banks;

  const selectedCountry = countries.find(c => c.code === bankData.country);

  const handleContactTransfer = async () => {
    if (!contactData.recipient || !amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Transfer Successful",
        description: `Successfully sent $${amount} to ${contactData.recipient}`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description: error instanceof Error ? error.message : "Failed to send money",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBankTransfer = async () => {
    const validation = africanBankingService.validateTransfer({
      country: bankData.country,
      bankId: bankData.bankId,
      accountNumber: bankData.accountNumber,
      accountName: bankData.accountName,
      amount: parseFloat(amount)
    });

    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors.join(', '),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Bank Transfer Initiated",
        description: `Transfer of $${amount} to ${selectedBank?.name} has been initiated`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description: error instanceof Error ? error.message : "Failed to initiate bank transfer",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectContact = (contact: any) => {
    setContactData({
      recipient: contact.email || contact.phone || contact.username,
      recipientType: contact.type
    });
  };

  const verifyAccount = async () => {
    if (!bankData.bankId || !bankData.accountNumber || !selectedBank) return;

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const result = await accountVerificationService.verifyAccount({
        bankId: bankData.bankId,
        accountNumber: bankData.accountNumber,
        countryCode: bankData.country
      });

      setVerificationResult(result);

      if (result.isValid && result.accountName) {
        setBankData(prev => ({
          ...prev,
          accountName: result.accountName || prev.accountName
        }));

        toast({
          title: "Account Verified",
          description: `Account belongs to ${result.accountName}`,
        });
      } else {
        toast({
          title: "Verification Failed",
          description: result.errors.join(', '),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "Unable to verify account at this time",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Trigger verification when account number is complete
  useEffect(() => {
    if (bankData.accountNumber.length >= 10 && selectedBank && shouldVerify) {
      const timeoutId = setTimeout(() => {
        verifyAccount();
      }, 1000); // Debounce verification

      return () => clearTimeout(timeoutId);
    }
  }, [bankData.accountNumber, selectedBank, shouldVerify]);

  // Validate amount when it changes
  useEffect(() => {
    if (amount && selectedBank) {
      const validation = accountVerificationService.validateTransferAmount(
        parseFloat(amount),
        selectedBank
      );
      setAmountValidation(validation);
    } else {
      setAmountValidation(null);
    }
  }, [amount, selectedBank]);

  const totalAmount = parseFloat(amount || '0') + transferFee;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-blue-600" />
            Send Money
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transfer Method Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'contact' | 'bank')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Contact
              </TabsTrigger>
              <TabsTrigger value="bank" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Bank Transfer
              </TabsTrigger>
            </TabsList>

            {/* Contact Transfer Tab */}
            <TabsContent value="contact" className="space-y-4">
              {/* Recent Contacts */}
              <div>
                <Label className="text-sm font-medium">Recent Contacts</Label>
                <div className="flex gap-2 mt-2 overflow-x-auto">
                  {recentContacts.map((contact) => (
                    <button
                      key={contact.id}
                      type="button"
                      onClick={() => selectContact(contact)}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted min-w-16"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback>
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-center">{contact.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Input */}
              <div className="space-y-2">
                <Label htmlFor="recipient">Send To</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select 
                    value={contactData.recipientType} 
                    onValueChange={(value: 'email' | 'phone' | 'username') =>
                      setContactData(prev => ({ ...prev, recipientType: value }))
                    }
                  >
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="username">Username</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="recipient"
                    placeholder={
                      contactData.recipientType === "email" ? "Enter email address" :
                      contactData.recipientType === "phone" ? "Enter phone number" :
                      "Enter username"
                    }
                    value={contactData.recipient}
                    onChange={(e) => setContactData(prev => ({ ...prev, recipient: e.target.value }))}
                    className="flex-1"
                    required
                  />
                </div>
              </div>
            </TabsContent>

            {/* Bank Transfer Tab */}
            <TabsContent value="bank" className="space-y-4">
              {/* Country Selection */}
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select 
                  value={bankData.country} 
                  onValueChange={(value) => setBankData(prev => ({ ...prev, country: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="text-xs font-medium text-muted-foreground px-2 py-1">African Countries</div>
                    {africanBankingService.getAfricanCountries().map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <div className="flex items-center gap-2">
                          <span>{country.flag}</span>
                          <span>{country.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {country.currency}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                    <div className="text-xs font-medium text-muted-foreground px-2 py-1 mt-2">Other Countries</div>
                    {countries.filter(c => !africanBankingService.getAfricanCountries().find(ac => ac.code === c.code)).map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <div className="flex items-center gap-2">
                          <span>{country.flag}</span>
                          <span>{country.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {country.currency}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Popular Banks */}
              {popularBanks.length > 0 && (
                <div className="space-y-2">
                  <Label>Popular Banks</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {popularBanks.map((bank) => (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => setBankData(prev => ({ ...prev, bankId: bank.id }))}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                          bankData.bankId === bank.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:bg-muted'
                        }`}
                      >
                        <div className={`p-2 rounded-full ${
                          bank.type === 'digital' ? 'bg-green-100 text-green-600' :
                          bank.type === 'mobile_money' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {bank.type === 'mobile_money' ? <Smartphone className="h-4 w-4" /> : <Building className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{bank.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <span className="capitalize">{bank.type.replace('_', ' ')}</span>
                            {bank.type === 'digital' && <Star className="h-3 w-3 text-yellow-500" />}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bank Search */}
              <div className="space-y-2">
                <Label>Search Banks</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for banks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {(searchQuery || !popularBanks.length) && (
                  <div className="max-h-32 overflow-y-auto border rounded-lg">
                    {filteredBanks.map((bank) => (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => {
                          setBankData(prev => ({ ...prev, bankId: bank.id }));
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center gap-3 p-2 hover:bg-muted text-left"
                      >
                        <div className={`p-1 rounded ${
                          bank.type === 'digital' ? 'bg-green-100 text-green-600' :
                          bank.type === 'mobile_money' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {bank.type === 'mobile_money' ? <Smartphone className="h-3 w-3" /> : <Building className="h-3 w-3" />}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{bank.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {bank.code} • {bank.type.replace('_', ' ')}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bank Details Form */}
              {selectedBank && (
                <Card className="border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      {selectedBank.name}
                      <Badge variant="outline" className="text-xs">
                        {selectedBank.type.replace('_', ' ')}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Transfer Type */}
                    <div className="space-y-2">
                      <Label>Transfer Type</Label>
                      <Select 
                        value={bankData.transferType}
                        onValueChange={(value: 'domestic' | 'international' | 'instant') =>
                          setBankData(prev => ({ ...prev, transferType: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedBank.transferTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              <div className="flex items-center gap-2">
                                {type === 'instant' && <Zap className="h-3 w-3 text-yellow-500" />}
                                {type === 'international' && <Globe className="h-3 w-3 text-blue-500" />}
                                <span className="capitalize">{type}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({selectedBank.processingTime[type as keyof typeof selectedBank.processingTime]})
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Account Number */}
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <div className="relative">
                        <Input
                          id="accountNumber"
                          placeholder="Enter account number"
                          value={bankData.accountNumber}
                          onChange={(e) => {
                            setBankData(prev => ({ ...prev, accountNumber: e.target.value }));
                            setShouldVerify(true);
                            setVerificationResult(null);
                          }}
                          className={`pr-10 ${
                            verificationResult?.isValid ? 'border-green-500' :
                            verificationResult?.isValid === false ? 'border-red-500' :
                            ''
                          }`}
                          required
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {isVerifying && (
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          )}
                          {!isVerifying && verificationResult?.isValid && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          {!isVerifying && verificationResult?.isValid === false && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>

                      {/* Verification Status */}
                      {verificationResult && (
                        <div className={`text-xs p-2 rounded ${
                          verificationResult.isValid
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {verificationResult.isValid ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3" />
                              <span>Account verified for {verificationResult.accountName}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-3 w-3" />
                              <span>{verificationResult.errors.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Manual Verify Button */}
                      {bankData.accountNumber && !isVerifying && !verificationResult && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={verifyAccount}
                          className="w-full"
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Verify Account
                        </Button>
                      )}
                    </div>

                    {/* Account Name */}
                    <div className="space-y-2">
                      <Label htmlFor="accountName">Account Holder Name</Label>
                      <div className="relative">
                        <Input
                          id="accountName"
                          placeholder="Enter account holder name"
                          value={bankData.accountName}
                          onChange={(e) => setBankData(prev => ({ ...prev, accountName: e.target.value }))}
                          className={verificationResult?.isValid ? 'bg-green-50 border-green-200' : ''}
                          required
                        />
                        {verificationResult?.isValid && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                              Verified
                            </Badge>
                          </div>
                        )}
                      </div>
                      {verificationResult?.warnings && verificationResult.warnings.length > 0 && (
                        <div className="text-xs p-2 rounded bg-yellow-50 text-yellow-700 border border-yellow-200">
                          <div className="flex items-center gap-2">
                            <Info className="h-3 w-3" />
                            <div>
                              {verificationResult.warnings.map((warning, index) => (
                                <div key={index}>{warning}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Additional fields for international transfers */}
                    {bankData.transferType === 'international' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="swiftCode">SWIFT Code</Label>
                          <Input
                            id="swiftCode"
                            placeholder="Enter SWIFT code"
                            value={bankData.swiftCode}
                            onChange={(e) => setBankData(prev => ({ ...prev, swiftCode: e.target.value }))}
                          />
                        </div>
                        
                        {selectedCountry?.code === 'US' && (
                          <div className="space-y-2">
                            <Label htmlFor="routingNumber">Routing Number</Label>
                            <Input
                              id="routingNumber"
                              placeholder="Enter routing number"
                              value={bankData.routingNumber}
                              onChange={(e) => setBankData(prev => ({ ...prev, routingNumber: e.target.value }))}
                            />
                          </div>
                        )}
                      </>
                    )}

                    {/* Transfer Info */}
                    <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Info className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">Transfer Information</span>
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Processing Time:</span>
                          <span>{selectedBank.processingTime[bankData.transferType]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Transfer Fee:</span>
                          <span>{selectedBank.currency} {selectedBank.fees[bankData.transferType]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Currency:</span>
                          <span>{selectedBank.currency}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Amount and Source */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10"
                    type="number"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">From</Label>
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="total">Total Balance (${walletBalance?.total.toFixed(2) || "0.00"})</SelectItem>
                    <SelectItem value="ecommerce">E-commerce (${walletBalance?.ecommerce.toFixed(2) || "0.00"})</SelectItem>
                    <SelectItem value="crypto">Crypto (${walletBalance?.crypto.toFixed(2) || "0.00"})</SelectItem>
                    <SelectItem value="rewards">Rewards (${walletBalance?.rewards.toFixed(2) || "0.00"})</SelectItem>
                    <SelectItem value="freelance">Freelance (${walletBalance?.freelance.toFixed(2) || "0.00"})</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Transfer Summary for Bank Transfers */}
            {activeTab === 'bank' && selectedBank && amount && (
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calculator className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Transfer Summary</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Transfer Amount:</span>
                      <span>${parseFloat(amount || '0').toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transfer Fee:</span>
                      <span>${transferFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>Total Amount:</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a note for this transfer"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="button"
              disabled={
                isLoading ||
                !amount ||
                (activeTab === 'contact' ? !contactData.recipient :
                 (!selectedBank || !verificationResult?.isValid))
              }
              onClick={activeTab === 'contact' ? handleContactTransfer : handleBankTransfer}
              className="flex-1 h-11"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  {activeTab === 'contact' ? 'Sending...' : 'Processing...'}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  {activeTab === 'contact' ? 'Send Money' : `Send $${totalAmount.toFixed(2)}`}
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedSendMoneyModal;
