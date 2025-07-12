import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Shield,
  Lock,
  Star,
  Check,
  AlertCircle,
} from "lucide-react";
import { PaymentMethod } from "@/types/marketplace";
import { useToast } from "@/components/ui/use-toast";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { cn } from "@/lib/utils";

interface SavedPaymentMethodsProps {
  onPaymentMethodSelect?: (paymentMethod: PaymentMethod) => void;
  allowSelection?: boolean;
  className?: string;
}

const SavedPaymentMethods = ({
  onPaymentMethodSelect,
  allowSelection = false,
  className,
}: SavedPaymentMethodsProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(
    null,
  );
  const [selectedPayment, setSelectedPayment] = useState<string>("");

  const {
    paymentMethods,
    addPaymentMethod,
    updatePaymentMethod,
    removePaymentMethod,
  } = useMarketplace();
  const { toast } = useToast();

  // Form state for adding/editing payment methods
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: "",
    isDefault: false,
  });

  const resetForm = () => {
    setFormData({
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      cardholderName: "",
      isDefault: false,
    });
  };

  const getCardType = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, "");
    if (number.startsWith("4")) return "visa";
    if (number.startsWith("5") || number.startsWith("2")) return "mastercard";
    if (number.startsWith("3")) return "amex";
    if (number.startsWith("6")) return "discover";
    return "unknown";
  };

  const formatCardNumber = (value: string) => {
    const number = value.replace(/\s/g, "");
    const formatted = number.replace(/(.{4})/g, "$1 ");
    return formatted.trim();
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "");
    if (value.length <= 16) {
      setFormData({ ...formData, cardNumber: formatCardNumber(value) });
    }
  };

  const handleAddPaymentMethod = async () => {
    try {
      const cardNumber = formData.cardNumber.replace(/\s/g, "");

      // Basic validation
      if (
        !cardNumber ||
        cardNumber.length < 13 ||
        !formData.expiryMonth ||
        !formData.expiryYear ||
        !formData.cvv ||
        !formData.cardholderName
      ) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const newPaymentMethod: PaymentMethod = {
        id: `pm_${Date.now()}`,
        type: "card",
        cardType: getCardType(cardNumber),
        lastFour: cardNumber.slice(-4),
        expiryMonth: parseInt(formData.expiryMonth),
        expiryYear: parseInt(formData.expiryYear),
        cardholderName: formData.cardholderName,
        isDefault: formData.isDefault || paymentMethods.length === 0,
        isVerified: true, // In real app, this would be set after verification
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addPaymentMethod(newPaymentMethod);

      toast({
        title: "Payment Method Added",
        description: "Your payment method has been saved successfully",
      });

      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Failed to add payment method:", error);
      toast({
        title: "Error",
        description: "Failed to add payment method. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditPaymentMethod = async () => {
    if (!editingPayment) return;

    try {
      const updatedPayment: PaymentMethod = {
        ...editingPayment,
        expiryMonth: parseInt(formData.expiryMonth),
        expiryYear: parseInt(formData.expiryYear),
        cardholderName: formData.cardholderName,
        isDefault: formData.isDefault,
        updatedAt: new Date().toISOString(),
      };

      await updatePaymentMethod(updatedPayment);

      toast({
        title: "Payment Method Updated",
        description: "Your payment method has been updated successfully",
      });

      resetForm();
      setIsEditDialogOpen(false);
      setEditingPayment(null);
    } catch (error) {
      console.error("Failed to update payment method:", error);
      toast({
        title: "Error",
        description: "Failed to update payment method. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    try {
      await removePaymentMethod(paymentMethodId);
      toast({
        title: "Payment Method Deleted",
        description: "Your payment method has been removed",
      });
    } catch (error) {
      console.error("Failed to delete payment method:", error);
      toast({
        title: "Error",
        description: "Failed to delete payment method. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (payment: PaymentMethod) => {
    setEditingPayment(payment);
    setFormData({
      cardNumber: `**** **** **** ${payment.lastFour}`,
      expiryMonth: payment.expiryMonth.toString(),
      expiryYear: payment.expiryYear.toString(),
      cvv: "***",
      cardholderName: payment.cardholderName,
      isDefault: payment.isDefault,
    });
    setIsEditDialogOpen(true);
  };

  const handlePaymentSelect = (payment: PaymentMethod) => {
    if (allowSelection) {
      setSelectedPayment(payment.id);
      onPaymentMethodSelect?.(payment);
    }
  };

  const renderPaymentMethodCard = (payment: PaymentMethod) => (
    <Card
      key={payment.id}
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        allowSelection &&
          selectedPayment === payment.id &&
          "ring-2 ring-primary",
        className,
      )}
      onClick={() => handlePaymentSelect(payment)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {payment.cardType.charAt(0).toUpperCase() +
                    payment.cardType.slice(1)}{" "}
                  •••• {payment.lastFour}
                </span>
                {payment.isDefault && (
                  <Badge variant="secondary" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Default
                  </Badge>
                )}
                {payment.isVerified && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-green-100 text-green-800"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {payment.cardholderName} • Expires{" "}
                {payment.expiryMonth.toString().padStart(2, "0")}/
                {payment.expiryYear}
              </p>
            </div>
          </div>

          {!allowSelection && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(payment);
                }}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Payment Method</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this payment method? This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeletePaymentMethod(payment.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}

          {allowSelection && selectedPayment === payment.id && (
            <Check className="w-5 h-5 text-primary" />
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderAddEditDialog = (isEdit: boolean) => (
    <Dialog
      open={isEdit ? isEditDialogOpen : isAddDialogOpen}
      onOpenChange={isEdit ? setIsEditDialogOpen : setIsAddDialogOpen}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            {isEdit ? "Edit Payment Method" : "Add Payment Method"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update your payment method details"
              : "Add a new payment method to your account"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={handleCardNumberChange}
              disabled={isEdit} // Can't edit card number
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryMonth">Month</Label>
              <Select
                value={formData.expiryMonth}
                onValueChange={(value) =>
                  setFormData({ ...formData, expiryMonth: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {(i + 1).toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryYear">Year</Label>
              <Select
                value={formData.expiryYear}
                onValueChange={(value) =>
                  setFormData({ ...formData, expiryYear: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="YYYY" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="text"
                placeholder="123"
                maxLength={4}
                value={formData.cvv}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cvv: e.target.value.replace(/\D/g, ""),
                  })
                }
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              type="text"
              placeholder="John Doe"
              value={formData.cardholderName}
              onChange={(e) =>
                setFormData({ ...formData, cardholderName: e.target.value })
              }
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={formData.isDefault}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isDefault: !!checked })
              }
            />
            <Label htmlFor="isDefault" className="text-sm">
              Set as default payment method
            </Label>
          </div>

          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
            <Lock className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">Secure & Encrypted</p>
              <p className="text-blue-700">
                Your payment information is encrypted and stored securely.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                if (isEdit) {
                  setIsEditDialogOpen(false);
                  setEditingPayment(null);
                } else {
                  setIsAddDialogOpen(false);
                }
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={
                isEdit ? handleEditPaymentMethod : handleAddPaymentMethod
              }
              className="flex-1"
            >
              {isEdit ? "Update" : "Add"} Payment Method
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-4">
      {!allowSelection && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Saved Payment Methods</h3>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      )}

      {paymentMethods.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <CreditCard className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <h4 className="font-medium mb-2">No Payment Methods</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Add a payment method to enable quick purchases and streamline
              checkout.
            </p>
            {!allowSelection && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Payment Method
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {paymentMethods.map(renderPaymentMethodCard)}
        </div>
      )}

      {/* Dialogs */}
      {renderAddEditDialog(false)}
      {renderAddEditDialog(true)}
    </div>
  );
};

export default SavedPaymentMethods;
