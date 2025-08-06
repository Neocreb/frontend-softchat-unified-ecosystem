import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Truck,
  MapPin,
  Clock,
  DollarSign,
  FileText,
  Camera,
  Shield,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Upload,
  Star,
  TrendingUp,
  Users,
  Globe,
  Zap,
  ArrowRight,
  Phone,
  Mail,
  Calendar,
  Award,
  Target,
  Briefcase,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import Header from "@/home/Header";
import Footer from "@/home/Footer";
import { useNavigate } from "react-router-dom";

const benefits = [
  {
    icon: DollarSign,
    title: "Competitive Earnings",
    description: "Earn $15-25 per hour with tips and bonuses. Weekly payouts directly to your account.",
    highlight: "Top drivers earn $800+ weekly",
  },
  {
    icon: Clock,
    title: "Flexible Schedule",
    description: "Work when you want. Set your own hours and choose your delivery areas.",
    highlight: "24/7 availability",
  },
  {
    icon: Shield,
    title: "Insurance Coverage",
    description: "Complete insurance protection for you and your vehicle during deliveries.",
    highlight: "Full liability coverage",
  },
  {
    icon: Zap,
    title: "Instant Payouts",
    description: "Get paid instantly after each delivery or choose weekly direct deposits.",
    highlight: "Same-day payments",
  },
];

const requirements = [
  "Valid driver's license (2+ years)",
  "Vehicle registration and insurance",
  "Smartphone with GPS capability",
  "Background check clearance",
  "Minimum age 21 years",
  "Clean driving record",
];

const vehicleTypes = [
  { type: "Motorcycle/Bike", icon: "🏍️", earning: "$15-20/hr", description: "Perfect for urban deliveries" },
  { type: "Car", icon: "🚗", earning: "$18-23/hr", description: "Most versatile option" },
  { type: "Van", icon: "🚐", earning: "$20-25/hr", description: "Higher capacity, better rates" },
  { type: "Truck", icon: "🚛", earning: "$22-28/hr", description: "Commercial deliveries" },
];

const cities = [
  "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ",
  "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "San Jose, CA",
  "Austin, TX", "Jacksonville, FL", "Fort Worth, TX", "Columbus, OH", "Charlotte, NC",
];

const networkStats = [
  { label: "Active Drivers", value: "1,250+", icon: Users },
  { label: "Cities Available", value: "85", icon: Globe },
  { label: "Average Rating", value: "4.8★", icon: Star },
  { label: "Monthly Deliveries", value: "50K+", icon: Truck },
];

interface QuickApplicationData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  vehicleType: string;
  hasLicense: boolean;
  hasInsurance: boolean;
  experience: string;
  motivation: string;
  agreeToTerms: boolean;
}

const initialFormData: QuickApplicationData = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  vehicleType: "",
  hasLicense: false,
  hasInsurance: false,
  experience: "",
  motivation: "",
  agreeToTerms: false,
};

export default function DriverApplicationPublic() {
  const [formData, setFormData] = useState<QuickApplicationData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const totalSteps = 3;

  const handleInputChange = (field: keyof QuickApplicationData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowSuccess(true);
      toast({
        title: "Application Submitted!",
        description: "We'll review your application and contact you within 24 hours.",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support for assistance.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.fullName && formData.email && formData.phone && formData.city);
      case 2:
        return !!(formData.vehicleType && formData.hasLicense && formData.hasInsurance);
      case 3:
        return !!(formData.experience && formData.motivation && formData.agreeToTerms);
      default:
        return false;
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <Card className="text-center p-8">
            <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Application Submitted!</h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your interest in becoming a delivery driver. We've received your application
              and our team will review it within the next 24 hours.
            </p>
            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <h3 className="font-medium text-blue-900 mb-3">What happens next?</h3>
              <ul className="text-sm text-blue-800 space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Background and document verification (1-2 days)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Phone interview with our team (15 minutes)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Vehicle inspection (if required)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Platform training and onboarding
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/")}>
                Back to Home
              </Button>
              <Button variant="outline" size="lg">
                <Phone className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
              <p className="text-gray-600">Let's start with your basic details</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="city">City *</Label>
              <Select value={formData.city} onValueChange={(value) => handleInputChange("city", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Vehicle & Requirements</h3>
              <p className="text-gray-600">Tell us about your vehicle and qualifications</p>
            </div>
            <div>
              <Label className="text-base font-medium mb-4 block">Vehicle Type *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicleTypes.map((vehicle) => (
                  <Card 
                    key={vehicle.type}
                    className={cn(
                      "cursor-pointer transition-all border-2",
                      formData.vehicleType === vehicle.type 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => handleInputChange("vehicleType", vehicle.type)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{vehicle.icon}</div>
                      <h4 className="font-medium mb-1">{vehicle.type}</h4>
                      <p className="text-green-600 font-medium text-sm mb-1">{vehicle.earning}</p>
                      <p className="text-xs text-gray-600">{vehicle.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasLicense"
                  checked={formData.hasLicense}
                  onCheckedChange={(checked) => handleInputChange("hasLicense", checked)}
                />
                <Label htmlFor="hasLicense" className="text-sm">
                  I have a valid driver's license (2+ years experience) *
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasInsurance"
                  checked={formData.hasInsurance}
                  onCheckedChange={(checked) => handleInputChange("hasInsurance", checked)}
                />
                <Label htmlFor="hasInsurance" className="text-sm">
                  I have current vehicle insurance *
                </Label>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Experience & Motivation</h3>
              <p className="text-gray-600">Help us understand your background</p>
            </div>
            <div>
              <Label htmlFor="experience">Delivery/Driving Experience *</Label>
              <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No prior experience</SelectItem>
                  <SelectItem value="some">Some experience (1-6 months)</SelectItem>
                  <SelectItem value="experienced">Experienced (6+ months)</SelectItem>
                  <SelectItem value="professional">Professional driver (2+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="motivation">Why do you want to become a delivery driver? *</Label>
              <Textarea
                id="motivation"
                value={formData.motivation}
                onChange={(e) => handleInputChange("motivation", e.target.value)}
                placeholder="Tell us what motivates you to join our delivery network..."
                rows={4}
              />
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
              />
              <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => window.open("/dispatch-partner-terms", "_blank")}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Dispatch Partner Terms of Use
                </button>
                , including the Data Privacy Policy and Earnings Agreement,{" "}
                <button
                  type="button"
                  onClick={() => window.open("/privacy", "_blank")}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Privacy Policy
                </button>
                , and background check authorization. I understand that my application is subject to verification and approval. *
              </Label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <Truck className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Become a Delivery Driver</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join thousands of drivers earning flexible income with our delivery network. 
            Start earning money on your schedule with competitive rates and instant payouts.
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <Badge className="bg-green-100 text-green-800 px-4 py-2">
              <DollarSign className="h-4 w-4 mr-1" />
              $15-25/hour
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
              <Clock className="h-4 w-4 mr-1" />
              Flexible hours
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 px-4 py-2">
              <Zap className="h-4 w-4 mr-1" />
              Instant payouts
            </Badge>
          </div>
        </div>

        {/* Network Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {networkStats.map((stat, index) => (
            <Card key={index} className="text-center p-4">
              <div className="flex justify-center mb-2">
                <stat.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Why Drive With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="bg-blue-50 p-3 rounded-full w-fit mx-auto mb-4">
                  <benefit.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{benefit.description}</p>
                <Badge variant="secondary" className="text-xs">
                  {benefit.highlight}
                </Badge>
              </Card>
            ))}
          </div>
        </div>

        {/* Vehicle Types */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Choose Your Vehicle Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicleTypes.map((vehicle, index) => (
              <Card key={index} className="text-center p-6">
                <div className="text-4xl mb-4">{vehicle.icon}</div>
                <h3 className="font-medium mb-2">{vehicle.type}</h3>
                <p className="text-green-600 font-bold text-lg mb-2">{vehicle.earning}</p>
                <p className="text-sm text-gray-600">{vehicle.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Driver Requirements</h2>
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{requirement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Application Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Quick Application</CardTitle>
              <div className="flex justify-center">
                <div className="flex items-center space-x-2">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                          currentStep >= step
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        )}
                      >
                        {step}
                      </div>
                      {step < 3 && (
                        <div
                          className={cn(
                            "w-12 h-0.5 mx-2",
                            currentStep > step ? "bg-blue-600" : "bg-gray-200"
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {renderStep()}
              
              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>

                <div className="flex gap-2">
                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
                      disabled={!isStepValid(currentStep)}
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!isStepValid(currentStep) || isSubmitting}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">
            Our support team is here to help you get started with your delivery driver journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg">
              <Phone className="h-5 w-5 mr-2" />
              Call Support
            </Button>
            <Button variant="outline" size="lg">
              <Mail className="h-5 w-5 mr-2" />
              Email Us
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
