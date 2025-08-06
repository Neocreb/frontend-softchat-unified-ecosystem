import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CreditCard,
  Plus,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Landmark,
  Smartphone,
  Wallet,
  Edit3,
  Trash2,
  Shield,
  Star,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface PaymentMethod {
  id: string;
  type: "bank" | "mobile_money" | "crypto" | "paypal";
  name: string;
  details: string;
  isDefault: boolean;
  isVerified: boolean;
  icon?: string;
  lastUsed?: Date;
  fees?: {
    percentage: number;
    fixed: number;
  };
}

const FreelanceWithdrawalMethods: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "bank",
      name: "GTBank Nigeria",
      details: "****1234",
      isDefault: true,
      isVerified: true,
      lastUsed: new Date("2024-01-15"),
      fees: { percentage: 0, fixed: 2.50 }
    },
    {
      id: "2", 
      type: "mobile_money",
      name: "MTN Mobile Money",
      details: "+234***8765",
      isDefault: false,
      isVerified: true,
      lastUsed: new Date("2024-01-10"),
      fees: { percentage: 1.5, fixed: 0 }
    },
    {
      id: "3",
      type: "paypal",
      name: "PayPal",
      details: "j***@email.com",
      isDefault: false,
      isVerified: false,
      fees: { percentage: 2.9, fixed: 0.30 }
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMethod, setNewMethod] = useState({
    type: "bank" as PaymentMethod["type"],
    name: "",
    details: "",
  });
  
  const { toast } = useToast();

  const getMethodIcon = (type: PaymentMethod["type"]) => {
    switch (type) {
      case "bank": return <Bank className="w-5 h-5" />;
      case "mobile_money": return <Smartphone className="w-5 h-5" />;
      case "crypto": return <Wallet className="w-5 h-5" />;
      case "paypal": return <CreditCard className="w-5 h-5" />;
      default: return <CreditCard className="w-5 h-5" />;
    }
  };

  const getMethodColor = (type: PaymentMethod["type"]) => {
    switch (type) {
      case "bank": return "text-blue-600";
      case "mobile_money": return "text-green-600";
      case "crypto": return "text-orange-600";
      case "paypal": return "text-purple-600";
      default: return "text-gray-600";
    }
  };

  const handleAddMethod = async () => {
    if (!newMethod.name || !newMethod.details) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const method: PaymentMethod = {
      id: Date.now().toString(),
      ...newMethod,
      isDefault: paymentMethods.length === 0,
      isVerified: false,
    };

    setPaymentMethods(prev => [...prev, method]);
    setNewMethod({ type: "bank", name: "", details: "" });
    setShowAddModal(false);
    
    toast({
      title: "Payment method added",
      description: "Your new payment method has been added successfully",
    });
  };

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods(prev => prev.map(method => ({
      ...method,
      isDefault: method.id === methodId,
    })));
    
    toast({
      title: "Default method updated",
      description: "Your default payment method has been updated",
    });
  };

  const handleVerifyMethod = async (methodId: string) => {
    // Simulate verification process
    setTimeout(() => {
      setPaymentMethods(prev => prev.map(method => 
        method.id === methodId ? { ...method, isVerified: true } : method
      ));
      
      toast({
        title: "Verification successful",
        description: "Your payment method has been verified",
      });
    }, 2000);
  };

  const handleRemoveMethod = (methodId: string) => {
    const method = paymentMethods.find(m => m.id === methodId);
    if (method?.isDefault && paymentMethods.length > 1) {
      toast({
        title: "Cannot remove default method",
        description: "Please set another method as default first",
        variant: "destructive",
      });
      return;
    }

    setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
    toast({
      title: "Payment method removed",
      description: "Your payment method has been removed successfully",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Withdrawal Methods</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage how you receive payments from clients</p>
        </div>
        
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Method
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="method-type">Payment Type</Label>
                <Select 
                  value={newMethod.type} 
                  onValueChange={(value) => setNewMethod(prev => ({ ...prev, type: value as PaymentMethod["type"] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank Account</SelectItem>
                    <SelectItem value="mobile_money">Mobile Money</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="crypto">Crypto Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="method-name">Method Name</Label>
                <Input
                  id="method-name"
                  placeholder="e.g. GTBank Nigeria"
                  value={newMethod.name}
                  onChange={(e) => setNewMethod(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="method-details">Account Details</Label>
                <Input
                  id="method-details"
                  placeholder="Account number, phone number, or email"
                  value={newMethod.details}
                  onChange={(e) => setNewMethod(prev => ({ ...prev, details: e.target.value }))}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddMethod} className="flex-1">
                  Add Method
                </Button>
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <Card key={method.id} className={cn(
            "transition-all duration-200 hover:shadow-lg",
            method.isDefault && "ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
          )}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg bg-gray-100 dark:bg-gray-800", getMethodColor(method.type))}>
                    {getMethodIcon(method.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{method.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{method.details}</p>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!method.isDefault && (
                      <DropdownMenuItem onClick={() => handleSetDefault(method.id)}>
                        <Star className="mr-2 h-4 w-4" />
                        Set as Default
                      </DropdownMenuItem>
                    )}
                    {!method.isVerified && (
                      <DropdownMenuItem onClick={() => handleVerifyMethod(method.id)}>
                        <Shield className="mr-2 h-4 w-4" />
                        Verify Method
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <Edit3 className="mr-2 h-4 w-4" />
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleRemoveMethod(method.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {method.isVerified ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {method.isVerified ? "Verified" : "Pending Verification"}
                    </span>
                  </div>
                  
                  {method.isDefault && (
                    <Badge variant="secondary" className="text-xs">
                      Default
                    </Badge>
                  )}
                </div>
                
                {method.fees && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <p>
                      Fees: {method.fees.percentage > 0 && `${method.fees.percentage}%`}
                      {method.fees.percentage > 0 && method.fees.fixed > 0 && " + "}
                      {method.fees.fixed > 0 && `$${method.fees.fixed}`}
                    </p>
                  </div>
                )}
                
                {method.lastUsed && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Last used: {method.lastUsed.toLocaleDateString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {paymentMethods.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
          <CardContent className="p-12 text-center">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No payment methods added
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Add your first payment method to start receiving withdrawals
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FreelanceWithdrawalMethods;
