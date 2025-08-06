import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Camera,
  MapPin,
  User,
  Car,
  FileText,
  CreditCard,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  Phone,
  Mail,
  Home,
  Calendar,
  DollarSign,
  Truck,
  Settings,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DispatchApplicationData, VehicleType, DeliveryType, WorkingHours } from "@/types/dispatch";
import { toast } from "sonner";

// Form validation schema
const applicationSchema = z.object({
  // Personal Information
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phoneNumber: z.string().regex(/^[+]?[\d\s-()]+$/, "Invalid phone number format"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  idNumber: z.string().min(1, "ID number is required"),
  
  // Address Information
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  
  // Vehicle Information
  vehicleType: z.enum(["motorcycle", "bicycle", "car", "van", "truck"]),
  vehicleModel: z.string().min(2, "Vehicle model is required"),
  vehicleYear: z.number().min(1990).max(new Date().getFullYear() + 1),
  licensePlate: z.string().min(3, "License plate is required"),
  
  // Documentation
  driverLicenseNumber: z.string().min(5, "Driver license number is required"),
  insuranceNumber: z.string().min(5, "Insurance number is required"),
  
  // Service Preferences
  serviceAreas: z.array(z.string()).min(1, "Select at least one service area"),
  deliveryTypes: z.array(z.enum(["food", "package", "document", "express", "standard", "fragile", "bulk"])).min(1, "Select at least one delivery type"),
  maxDeliveryDistance: z.number().min(1).max(50),
  
  // Banking Information
  bankAccountName: z.string().min(2, "Account name is required"),
  bankAccountNumber: z.string().min(10, "Account number must be at least 10 digits"),
  bankName: z.string().min(2, "Bank name is required"),
  
  // Emergency Contact
  emergencyContactName: z.string().min(2, "Emergency contact name is required"),
  emergencyContactRelationship: z.string().min(2, "Relationship is required"),
  emergencyContactPhone: z.string().regex(/^[+]?[\d\s-()]+$/, "Invalid phone number format"),
  
  // Terms & Conditions
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to terms and conditions"),
  agreeToBackgroundCheck: z.boolean().refine(val => val === true, "You must agree to background check"),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

const MAJOR_CITIES = [
  "Lagos", "Kano", "Ibadan", "Kaduna", "Port Harcourt", "Benin City", "Maiduguri",
  "Zaria", "Aba", "Jos", "Ilorin", "Oyo", "Enugu", "Abeokuta", "Abuja",
  "Sokoto", "Onitsha", "Warri", "Okene", "Calabar", "Uyo", "Katsina", "Ado-Ekiti",
  "Ogbomoso", "Azare", "Ikeja", "Shagamu"
];

const VEHICLE_TYPES: { value: VehicleType; label: string; description: string }[] = [
  { value: "motorcycle", label: "Motorcycle", description: "Fast delivery for small packages" },
  { value: "bicycle", label: "Bicycle", description: "Eco-friendly short distance delivery" },
  { value: "car", label: "Car", description: "Medium packages and passenger transport" },
  { value: "van", label: "Van", description: "Large packages and bulk deliveries" },
  { value: "truck", label: "Truck", description: "Heavy cargo and long distance" },
];

const DELIVERY_TYPES: { value: DeliveryType; label: string; description: string }[] = [
  { value: "food", label: "Food Delivery", description: "Restaurant and grocery deliveries" },
  { value: "package", label: "Package Delivery", description: "General package and parcel delivery" },
  { value: "document", label: "Document Delivery", description: "Important documents and papers" },
  { value: "express", label: "Express Delivery", description: "Urgent same-day delivery" },
  { value: "standard", label: "Standard Delivery", description: "Regular scheduled delivery" },
  { value: "fragile", label: "Fragile Items", description: "Delicate items requiring special care" },
  { value: "bulk", label: "Bulk Orders", description: "Large volume deliveries" },
];

const BANKS = [
  "Access Bank", "Zenith Bank", "GTBank", "First Bank", "UBA", "Fidelity Bank",
  "Sterling Bank", "Stanbic IBTC", "Union Bank", "Wema Bank", "Polaris Bank",
  "Keystone Bank", "FCMB", "Heritage Bank", "Unity Bank", "Jaiz Bank", "Moniepoint"
];

export const DispatchApplication: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<{
    idDocument?: File;
    driverLicense?: File;
    insurance?: File;
    vehiclePhotos: File[];
  }>({
    vehiclePhotos: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: user?.user_metadata?.full_name || "",
      phoneNumber: user?.user_metadata?.phone || "",
      serviceAreas: [],
      deliveryTypes: [],
      maxDeliveryDistance: 15,
      vehicleYear: new Date().getFullYear(),
      agreeToTerms: false,
      agreeToBackgroundCheck: false,
    },
    mode: "onChange",
  });

  const { control, handleSubmit, formState: { errors, isValid }, trigger, watch } = form;

  const steps = [
    {
      title: "Personal Information",
      icon: User,
      description: "Basic personal details",
      fields: ["fullName", "phoneNumber", "dateOfBirth", "idNumber"],
    },
    {
      title: "Address Details",
      icon: Home,
      description: "Where you live",
      fields: ["address", "city", "state", "postalCode"],
    },
    {
      title: "Vehicle Information",
      icon: Car,
      description: "Your delivery vehicle",
      fields: ["vehicleType", "vehicleModel", "vehicleYear", "licensePlate"],
    },
    {
      title: "Documentation",
      icon: FileText,
      description: "Required documents",
      fields: ["driverLicenseNumber", "insuranceNumber"],
    },
    {
      title: "Service Preferences",
      icon: Settings,
      description: "What services you offer",
      fields: ["serviceAreas", "deliveryTypes", "maxDeliveryDistance"],
    },
    {
      title: "Banking Details",
      icon: CreditCard,
      description: "Payment information",
      fields: ["bankAccountName", "bankAccountNumber", "bankName"],
    },
    {
      title: "Emergency Contact",
      icon: Phone,
      description: "Emergency contact person",
      fields: ["emergencyContactName", "emergencyContactRelationship", "emergencyContactPhone"],
    },
    {
      title: "Terms & Verification",
      icon: Shield,
      description: "Final agreements",
      fields: ["agreeToTerms", "agreeToBackgroundCheck"],
    },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const validateCurrentStep = async () => {
    const fieldsToValidate = steps[currentStep].fields;
    const isStepValid = await trigger(fieldsToValidate as any);
    return isStepValid;
  };

  const nextStep = async () => {
    const isStepValid = await validateCurrentStep();
    if (isStepValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = useCallback((type: string, file: File | File[]) => {
    setUploadedFiles(prev => {
      if (type === "vehiclePhotos") {
        return { ...prev, [type]: Array.isArray(file) ? file : [file] };
      }
      return { ...prev, [type]: file };
    });
  }, []);

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    try {
      // Here you would typically upload files and submit the application
      console.log("Application Data:", data);
      console.log("Uploaded Files:", uploadedFiles);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Application submitted successfully! We'll review it within 24-48 hours.");
      navigate("/dashboard?tab=dispatch");
    } catch (error) {
      console.error("Application submission error:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const FileUploadArea: React.FC<{
    type: string;
    label: string;
    description: string;
    accept: string;
    multiple?: boolean;
  }> = ({ type, label, description, accept, multiple = false }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
      <p className="font-medium text-gray-900 dark:text-white">{label}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{description}</p>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (multiple) {
            handleFileUpload(type, files);
          } else {
            handleFileUpload(type, files[0]);
          }
        }}
        className="hidden"
        id={`upload-${type}`}
      />
      <Label htmlFor={`upload-${type}`} className="cursor-pointer">
        <Button variant="outline" size="sm" className="mt-2">
          <Camera className="w-4 h-4 mr-2" />
          Upload {multiple ? "Files" : "File"}
        </Button>
      </Label>
      {uploadedFiles[type as keyof typeof uploadedFiles] && (
        <div className="mt-2 text-sm text-green-600 dark:text-green-400">
          ✓ {multiple ? 
            `${(uploadedFiles[type as keyof typeof uploadedFiles] as File[])?.length || 0} files uploaded` : 
            "File uploaded"}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Become a Dispatch Partner
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join our delivery network and start earning money by delivering packages, food, and documents in your area.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isCompleted
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : isCurrent
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {React.createElement(steps[currentStep].icon, { className: "w-6 h-6" })}
                {steps[currentStep].title}
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                {steps[currentStep].description}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Controller
                      name="fullName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter your full name"
                          className={errors.fullName ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Controller
                      name="phoneNumber"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="+234 XXX XXX XXXX"
                          className={errors.phoneNumber ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-500 mt-1">{errors.phoneNumber.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Controller
                      name="dateOfBirth"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="date"
                          className={errors.dateOfBirth ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="idNumber">ID Number *</Label>
                    <Controller
                      name="idNumber"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="National ID or International Passport"
                          className={errors.idNumber ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.idNumber && (
                      <p className="text-sm text-red-500 mt-1">{errors.idNumber.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <FileUploadArea
                      type="idDocument"
                      label="Upload ID Document"
                      description="Upload a clear photo of your National ID or International Passport"
                      accept="image/*,.pdf"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Address Details */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Full Address *</Label>
                    <Controller
                      name="address"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          placeholder="Enter your complete address including street name and number"
                          className={errors.address ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={errors.city ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select your city" />
                          </SelectTrigger>
                          <SelectContent>
                            {MAJOR_CITIES.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Controller
                      name="state"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select your state" />
                          </SelectTrigger>
                          <SelectContent>
                            {NIGERIAN_STATES.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.state && (
                      <p className="text-sm text-red-500 mt-1">{errors.state.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Controller
                      name="postalCode"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter postal code"
                          className={errors.postalCode ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.postalCode && (
                      <p className="text-sm text-red-500 mt-1">{errors.postalCode.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Vehicle Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="vehicleType">Vehicle Type *</Label>
                    <Controller
                      name="vehicleType"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                          {VEHICLE_TYPES.map((vehicle) => (
                            <div
                              key={vehicle.value}
                              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                field.value === vehicle.value
                                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => field.onChange(vehicle.value)}
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <Truck className="w-5 h-5" />
                                <span className="font-medium">{vehicle.label}</span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {vehicle.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                    {errors.vehicleType && (
                      <p className="text-sm text-red-500 mt-1">{errors.vehicleType.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="vehicleModel">Vehicle Model *</Label>
                      <Controller
                        name="vehicleModel"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="e.g., Honda CB125F, Toyota Corolla"
                            className={errors.vehicleModel ? "border-red-500" : ""}
                          />
                        )}
                      />
                      {errors.vehicleModel && (
                        <p className="text-sm text-red-500 mt-1">{errors.vehicleModel.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="vehicleYear">Vehicle Year *</Label>
                      <Controller
                        name="vehicleYear"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            min="1990"
                            max={new Date().getFullYear() + 1}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className={errors.vehicleYear ? "border-red-500" : ""}
                          />
                        )}
                      />
                      {errors.vehicleYear && (
                        <p className="text-sm text-red-500 mt-1">{errors.vehicleYear.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="licensePlate">License Plate *</Label>
                      <Controller
                        name="licensePlate"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="ABC-123-XYZ"
                            className={errors.licensePlate ? "border-red-500" : ""}
                          />
                        )}
                      />
                      {errors.licensePlate && (
                        <p className="text-sm text-red-500 mt-1">{errors.licensePlate.message}</p>
                      )}
                    </div>
                  </div>

                  <FileUploadArea
                    type="vehiclePhotos"
                    label="Upload Vehicle Photos"
                    description="Upload 2-4 clear photos of your vehicle (front, back, sides)"
                    accept="image/*"
                    multiple
                  />
                </div>
              )}

              {/* Step 4: Documentation */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="driverLicenseNumber">Driver License Number *</Label>
                      <Controller
                        name="driverLicenseNumber"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Enter your driver license number"
                            className={errors.driverLicenseNumber ? "border-red-500" : ""}
                          />
                        )}
                      />
                      {errors.driverLicenseNumber && (
                        <p className="text-sm text-red-500 mt-1">{errors.driverLicenseNumber.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="insuranceNumber">Vehicle Insurance Number *</Label>
                      <Controller
                        name="insuranceNumber"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Enter insurance policy number"
                            className={errors.insuranceNumber ? "border-red-500" : ""}
                          />
                        )}
                      />
                      {errors.insuranceNumber && (
                        <p className="text-sm text-red-500 mt-1">{errors.insuranceNumber.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FileUploadArea
                      type="driverLicense"
                      label="Upload Driver License"
                      description="Upload a clear photo of your valid driver license"
                      accept="image/*,.pdf"
                    />

                    <FileUploadArea
                      type="insurance"
                      label="Upload Insurance Certificate"
                      description="Upload your vehicle insurance certificate"
                      accept="image/*,.pdf"
                    />
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      All documents will be verified during the approval process. Please ensure they are valid and clearly readable.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Step 5: Service Preferences */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <Label>Service Areas *</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Select the areas where you want to provide delivery services
                    </p>
                    <Controller
                      name="serviceAreas"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {MAJOR_CITIES.slice(0, 12).map((area) => (
                            <label
                              key={area}
                              className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                              <Checkbox
                                checked={field.value.includes(area)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, area]);
                                  } else {
                                    field.onChange(field.value.filter((item: string) => item !== area));
                                  }
                                }}
                              />
                              <span className="text-sm">{area}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    />
                    {errors.serviceAreas && (
                      <p className="text-sm text-red-500 mt-1">{errors.serviceAreas.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>Delivery Types *</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Select the types of deliveries you want to handle
                    </p>
                    <Controller
                      name="deliveryTypes"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {DELIVERY_TYPES.map((deliveryType) => (
                            <div
                              key={deliveryType.value}
                              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                field.value.includes(deliveryType.value)
                                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => {
                                if (field.value.includes(deliveryType.value)) {
                                  field.onChange(field.value.filter((item: string) => item !== deliveryType.value));
                                } else {
                                  field.onChange([...field.value, deliveryType.value]);
                                }
                              }}
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <Checkbox
                                  checked={field.value.includes(deliveryType.value)}
                                  readOnly
                                />
                                <span className="font-medium">{deliveryType.label}</span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {deliveryType.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                    {errors.deliveryTypes && (
                      <p className="text-sm text-red-500 mt-1">{errors.deliveryTypes.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="maxDeliveryDistance">Maximum Delivery Distance (km) *</Label>
                    <Controller
                      name="maxDeliveryDistance"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Input
                            {...field}
                            type="number"
                            min="1"
                            max="50"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className={errors.maxDeliveryDistance ? "border-red-500" : ""}
                          />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Current: {field.value} km from your location
                          </p>
                        </div>
                      )}
                    />
                    {errors.maxDeliveryDistance && (
                      <p className="text-sm text-red-500 mt-1">{errors.maxDeliveryDistance.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 6: Banking Details */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <Alert>
                    <DollarSign className="h-4 w-4" />
                    <AlertDescription>
                      Your earnings will be paid to this bank account weekly. Ensure all details are correct.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="bankAccountName">Account Name *</Label>
                      <Controller
                        name="bankAccountName"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Full name as on bank account"
                            className={errors.bankAccountName ? "border-red-500" : ""}
                          />
                        )}
                      />
                      {errors.bankAccountName && (
                        <p className="text-sm text-red-500 mt-1">{errors.bankAccountName.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="bankAccountNumber">Account Number *</Label>
                      <Controller
                        name="bankAccountNumber"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="10-digit account number"
                            className={errors.bankAccountNumber ? "border-red-500" : ""}
                          />
                        )}
                      />
                      {errors.bankAccountNumber && (
                        <p className="text-sm text-red-500 mt-1">{errors.bankAccountNumber.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="bankName">Bank Name *</Label>
                      <Controller
                        name="bankName"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={errors.bankName ? "border-red-500" : ""}>
                              <SelectValue placeholder="Select your bank" />
                            </SelectTrigger>
                            <SelectContent>
                              {BANKS.map((bank) => (
                                <SelectItem key={bank} value={bank}>
                                  {bank}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.bankName && (
                        <p className="text-sm text-red-500 mt-1">{errors.bankName.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7: Emergency Contact */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <Alert>
                    <Phone className="h-4 w-4" />
                    <AlertDescription>
                      This contact will be notified in case of emergency during deliveries.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="emergencyContactName">Contact Name *</Label>
                      <Controller
                        name="emergencyContactName"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Full name of emergency contact"
                            className={errors.emergencyContactName ? "border-red-500" : ""}
                          />
                        )}
                      />
                      {errors.emergencyContactName && (
                        <p className="text-sm text-red-500 mt-1">{errors.emergencyContactName.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="emergencyContactRelationship">Relationship *</Label>
                      <Controller
                        name="emergencyContactRelationship"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={errors.emergencyContactRelationship ? "border-red-500" : ""}>
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="spouse">Spouse</SelectItem>
                              <SelectItem value="parent">Parent</SelectItem>
                              <SelectItem value="sibling">Sibling</SelectItem>
                              <SelectItem value="child">Child</SelectItem>
                              <SelectItem value="friend">Friend</SelectItem>
                              <SelectItem value="relative">Relative</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.emergencyContactRelationship && (
                        <p className="text-sm text-red-500 mt-1">{errors.emergencyContactRelationship.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="emergencyContactPhone">Contact Phone *</Label>
                      <Controller
                        name="emergencyContactPhone"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="+234 XXX XXX XXXX"
                            className={errors.emergencyContactPhone ? "border-red-500" : ""}
                          />
                        )}
                      />
                      {errors.emergencyContactPhone && (
                        <p className="text-sm text-red-500 mt-1">{errors.emergencyContactPhone.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 8: Terms & Verification */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Controller
                        name="agreeToTerms"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className={errors.agreeToTerms ? "border-red-500" : ""}
                          />
                        )}
                      />
                      <div className="flex-1">
                        <Label className="text-sm">
                          I agree to the{" "}
                          <a href="/terms" className="text-blue-600 hover:underline">
                            Terms and Conditions
                          </a>{" "}
                          and{" "}
                          <a href="/privacy" className="text-blue-600 hover:underline">
                            Privacy Policy
                          </a>
                          *
                        </Label>
                        {errors.agreeToTerms && (
                          <p className="text-sm text-red-500 mt-1">{errors.agreeToTerms.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Controller
                        name="agreeToBackgroundCheck"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className={errors.agreeToBackgroundCheck ? "border-red-500" : ""}
                          />
                        )}
                      />
                      <div className="flex-1">
                        <Label className="text-sm">
                          I consent to background checks and document verification *
                        </Label>
                        {errors.agreeToBackgroundCheck && (
                          <p className="text-sm text-red-500 mt-1">{errors.agreeToBackgroundCheck.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      <strong>What happens next?</strong>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li>• We'll review your application within 24-48 hours</li>
                        <li>• Background check and document verification</li>
                        <li>• You'll receive an email with the approval status</li>
                        <li>• Once approved, you can start accepting delivery requests</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Submit Application
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DispatchApplication;
