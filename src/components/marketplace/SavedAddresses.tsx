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
  MapPin,
  Plus,
  Edit,
  Trash2,
  Home,
  Building,
  Star,
  Check,
  Navigation,
} from "lucide-react";
import { Address } from "@/types/marketplace";
import { useToast } from "@/components/ui/use-toast";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { cn } from "@/lib/utils";

interface SavedAddressesProps {
  onAddressSelect?: (address: Address) => void;
  allowSelection?: boolean;
  className?: string;
}

const SavedAddresses = ({
  onAddressSelect,
  allowSelection = false,
  className,
}: SavedAddressesProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const { addresses, addAddress, updateAddress, removeAddress } =
    useMarketplace();
  const { toast } = useToast();

  // Form state for adding/editing addresses
  const [formData, setFormData] = useState({
    name: "",
    street: "",
    street2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    phone: "",
    type: "home" as "home" | "work" | "other",
    isDefault: false,
    instructions: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      street: "",
      street2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
      phone: "",
      type: "home",
      isDefault: false,
      instructions: "",
    });
  };

  const handleAddAddress = async () => {
    try {
      // Basic validation
      if (
        !formData.name ||
        !formData.street ||
        !formData.city ||
        !formData.state ||
        !formData.zipCode
      ) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const newAddress: Address = {
        id: `addr_${Date.now()}`,
        name: formData.name,
        street: formData.street,
        street2: formData.street2,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        phone: formData.phone,
        type: formData.type,
        isDefault: formData.isDefault || addresses.length === 0,
        instructions: formData.instructions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addAddress(newAddress);

      toast({
        title: "Address Added",
        description: "Your address has been saved successfully",
      });

      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Failed to add address:", error);
      toast({
        title: "Error",
        description: "Failed to add address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditAddress = async () => {
    if (!editingAddress) return;

    try {
      const updatedAddress: Address = {
        ...editingAddress,
        name: formData.name,
        street: formData.street,
        street2: formData.street2,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        phone: formData.phone,
        type: formData.type,
        isDefault: formData.isDefault,
        instructions: formData.instructions,
        updatedAt: new Date().toISOString(),
      };

      await updateAddress(updatedAddress);

      toast({
        title: "Address Updated",
        description: "Your address has been updated successfully",
      });

      resetForm();
      setIsEditDialogOpen(false);
      setEditingAddress(null);
    } catch (error) {
      console.error("Failed to update address:", error);
      toast({
        title: "Error",
        description: "Failed to update address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await removeAddress(addressId);
      toast({
        title: "Address Deleted",
        description: "Your address has been removed",
      });
    } catch (error) {
      console.error("Failed to delete address:", error);
      toast({
        title: "Error",
        description: "Failed to delete address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      street: address.street,
      street2: address.street2 || "",
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone || "",
      type: address.type,
      isDefault: address.isDefault,
      instructions: address.instructions || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleAddressSelect = (address: Address) => {
    if (allowSelection) {
      setSelectedAddress(address.id);
      onAddressSelect?.(address);
    }
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case "home":
        return <Home className="w-4 h-4" />;
      case "work":
        return <Building className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const renderAddressCard = (address: Address) => (
    <Card
      key={address.id}
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        allowSelection &&
          selectedAddress === address.id &&
          "ring-2 ring-primary",
        className,
      )}
      onClick={() => handleAddressSelect(address)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getAddressTypeIcon(address.type)}
              <span className="font-medium">{address.name}</span>
              {address.isDefault && (
                <Badge variant="secondary" className="text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  Default
                </Badge>
              )}
              <Badge variant="outline" className="text-xs capitalize">
                {address.type}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{address.street}</p>
              {address.street2 && <p>{address.street2}</p>}
              <p>
                {address.city}, {address.state} {address.zipCode}
              </p>
              <p>{address.country}</p>
              {address.phone && (
                <p className="flex items-center gap-1">📞 {address.phone}</p>
              )}
              {address.instructions && (
                <p className="text-xs italic">Note: {address.instructions}</p>
              )}
            </div>
          </div>

          {!allowSelection && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(address);
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
                    <AlertDialogTitle>Delete Address</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this address? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteAddress(address.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}

          {allowSelection && selectedAddress === address.id && (
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {isEdit ? "Edit Address" : "Add New Address"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update your address details"
              : "Add a new shipping address to your account"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">Street Address *</Label>
            <Input
              id="street"
              type="text"
              placeholder="123 Main Street"
              value={formData.street}
              onChange={(e) =>
                setFormData({ ...formData, street: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="street2">Apartment, Suite, etc. (Optional)</Label>
            <Input
              id="street2"
              type="text"
              placeholder="Apt 4B"
              value={formData.street2}
              onChange={(e) =>
                setFormData({ ...formData, street2: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                type="text"
                placeholder="New York"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                type="text"
                placeholder="NY"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                type="text"
                placeholder="10001"
                value={formData.zipCode}
                onChange={(e) =>
                  setFormData({ ...formData, zipCode: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={formData.country}
                onValueChange={(value) =>
                  setFormData({ ...formData, country: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="MX">Mexico</SelectItem>
                  <SelectItem value="GB">United Kingdom</SelectItem>
                  <SelectItem value="AU">Australia</SelectItem>
                  <SelectItem value="DE">Germany</SelectItem>
                  <SelectItem value="FR">France</SelectItem>
                  <SelectItem value="JP">Japan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Address Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "home" | "work" | "other") =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Home
                  </div>
                </SelectItem>
                <SelectItem value="work">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Work
                  </div>
                </SelectItem>
                <SelectItem value="other">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Other
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">
              Delivery Instructions (Optional)
            </Label>
            <Input
              id="instructions"
              type="text"
              placeholder="Ring doorbell, leave with doorman, etc."
              value={formData.instructions}
              onChange={(e) =>
                setFormData({ ...formData, instructions: e.target.value })
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
              Set as default shipping address
            </Label>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                if (isEdit) {
                  setIsEditDialogOpen(false);
                  setEditingAddress(null);
                } else {
                  setIsAddDialogOpen(false);
                }
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={isEdit ? handleEditAddress : handleAddAddress}
              className="flex-1"
            >
              {isEdit ? "Update" : "Add"} Address
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
          <h3 className="text-lg font-semibold">Saved Addresses</h3>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Address
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      )}

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <h4 className="font-medium mb-2">No Saved Addresses</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Add a shipping address to enable quick purchases and streamline
              checkout.
            </p>
            {!allowSelection && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Address
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">{addresses.map(renderAddressCard)}</div>
      )}

      {/* Dialogs */}
      {renderAddEditDialog(false)}
      {renderAddEditDialog(true)}
    </div>
  );
};

export default SavedAddresses;
