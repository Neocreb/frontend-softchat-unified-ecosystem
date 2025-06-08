
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { CheckCircle, Upload, AlertCircle, Info } from "lucide-react";

interface CryptoKYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<{success: boolean, error?: any}>;
}

const CryptoKYCModal = ({ isOpen, onClose, onSubmit }: CryptoKYCModalProps) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    country: "",
    address: "",
    city: "",
    postalCode: "",
    idType: "passport",
    idNumber: "",
    idFront: null as File | null,
    idBack: null as File | null,
    selfie: null as File | null,
  });
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, [fieldName]: file }));
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.country) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
    } else if (step === 2) {
      if (!formData.idType || !formData.idNumber) {
        toast({
          title: "Missing Information",
          description: "Please select ID type and enter ID number.",
          variant: "destructive",
        });
        return;
      }
    }

    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!formData.idFront || !formData.selfie) {
      toast({
        title: "Missing Documents",
        description: "Please upload all required documents.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await onSubmit(formData);
      
      if (result.success) {
        setStep(4); // Success step
      } else {
        toast({
          title: "Verification Failed",
          description: "There was an error submitting your verification. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepDots = () => {
    return (
      <div className="flex justify-center gap-2 my-4">
        {[1, 2, 3].map((stepNum) => (
          <div
            key={stepNum}
            className={`h-2 w-2 rounded-full ${
              step >= stepNum ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Wallet Verification (KYC)</DialogTitle>
          <DialogDescription>
            Verify your identity to unlock full wallet functionality
          </DialogDescription>
        </DialogHeader>

        {step !== 4 && renderStepDots()}

        {step === 1 && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={formData.country}
                onValueChange={(value) => handleSelectChange("country", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="gb">United Kingdom</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="fr">France</SelectItem>
                  <SelectItem value="de">Germany</SelectItem>
                  <SelectItem value="jp">Japan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="idType">ID Type</Label>
              <Select
                value={formData.idType}
                onValueChange={(value) => handleSelectChange("idType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="driving_license">Driving License</SelectItem>
                  <SelectItem value="national_id">National ID Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="idNumber">ID Number</Label>
              <Input
                id="idNumber"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">Document Requirements</h4>
                  <ul className="text-xs text-muted-foreground mt-1 list-disc pl-4 space-y-1">
                    <li>Documents must be valid and not expired</li>
                    <li>All details must be clearly visible</li>
                    <li>Photos must be well-lit and in color</li>
                    <li>No blurry or edited images allowed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="idFront">ID Front Side</Label>
              <div className="border rounded-md p-3 bg-muted/50">
                {formData.idFront ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">{formData.idFront.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData((prev) => ({ ...prev, idFront: null }))}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer py-4">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm font-medium">Upload Front Side</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      JPG, PNG or PDF, max 5MB
                    </span>
                    <Input
                      id="idFront"
                      type="file"
                      accept="image/*, application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "idFront")}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="idBack">ID Back Side (optional for passports)</Label>
              <div className="border rounded-md p-3 bg-muted/50">
                {formData.idBack ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">{formData.idBack.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData((prev) => ({ ...prev, idBack: null }))}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer py-4">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm font-medium">Upload Back Side</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      JPG, PNG or PDF, max 5MB
                    </span>
                    <Input
                      id="idBack"
                      type="file"
                      accept="image/*, application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "idBack")}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="selfie">Selfie with ID</Label>
              <div className="border rounded-md p-3 bg-muted/50">
                {formData.selfie ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">{formData.selfie.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData((prev) => ({ ...prev, selfie: null }))}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer py-4">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm font-medium">Upload Selfie with ID</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      Hold your ID next to your face
                    </span>
                    <Input
                      id="selfie"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "selfie")}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800">
                    Privacy Notice
                  </h4>
                  <p className="text-xs text-amber-700 mt-1">
                    Your documents are encrypted and will only be used for verification purposes. 
                    By submitting, you consent to our identity verification process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="py-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium">Verification Submitted</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your documents have been successfully submitted for review. This process typically takes 1-3 business days.
            </p>
            <Button className="mt-4" onClick={onClose}>
              Got it
            </Button>
          </div>
        )}

        {step !== 4 && (
          <DialogFooter>
            {step > 1 && (
              <Button variant="outline" onClick={prevStep} disabled={isSubmitting}>
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={nextStep}>Next</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Verification"}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CryptoKYCModal;
