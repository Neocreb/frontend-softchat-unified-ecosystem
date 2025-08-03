import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Smartphone,
  Building,
  Zap,
  CreditCard,
  Wifi,
  MapPin,
  Globe,
  ArrowUpRight,
} from "lucide-react";

interface PaymentProvider {
  id: string;
  name: string;
  icon: React.ReactNode;
  type: "mobile_money" | "digital_bank" | "payment_gateway" | "crypto_exchange";
  countries: string[];
  color: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

const AfricanPaymentQuickLinks = () => {
  const { toast } = useToast();
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const paymentProviders: PaymentProvider[] = [
    // Mobile Money
    {
      id: "mtn_momo",
      name: "MTN Mobile Money",
      icon: <Smartphone className="h-5 w-5" />,
      type: "mobile_money",
      countries: ["Nigeria", "Ghana", "Uganda", "Rwanda", "Cameroon"],
      color: "bg-yellow-500",
      description: "Send, receive, and pay with MTN Mobile Money",
      features: ["Instant transfers", "Bill payments", "Airtime top-up"],
      isPopular: true,
    },
    {
      id: "airtel_money",
      name: "Airtel Money",
      icon: <Smartphone className="h-5 w-5" />,
      type: "mobile_money",
      countries: ["Nigeria", "Kenya", "Tanzania", "Zambia", "Madagascar"],
      color: "bg-red-500",
      description: "Quick mobile payments with Airtel Money",
      features: ["Cross-border transfers", "Merchant payments", "Savings"],
    },
    {
      id: "safaricom_mpesa",
      name: "M-Pesa",
      icon: <Smartphone className="h-5 w-5" />,
      type: "mobile_money",
      countries: ["Kenya", "Tanzania", "Mozambique", "Lesotho"],
      color: "bg-green-500",
      description: "East Africa's leading mobile money platform",
      features: ["Lipa Na M-Pesa", "Paybill", "International transfers"],
      isPopular: true,
    },
    {
      id: "orange_money",
      name: "Orange Money",
      icon: <Smartphone className="h-5 w-5" />,
      type: "mobile_money",
      countries: ["Senegal", "Mali", "Burkina Faso", "Niger", "Guinea"],
      color: "bg-orange-500",
      description: "West Africa's trusted mobile money service",
      features: ["International remittances", "Merchant payments", "Savings"],
    },

    // Digital Banks
    {
      id: "kuda_bank",
      name: "Kuda Bank",
      icon: <Building className="h-5 w-5" />,
      type: "digital_bank",
      countries: ["Nigeria"],
      color: "bg-purple-500",
      description: "Nigeria's full-service digital bank",
      features: ["Free transfers", "Budgeting tools", "Savings goals"],
      isPopular: true,
    },
    {
      id: "opay",
      name: "OPay",
      icon: <Building className="h-5 w-5" />,
      type: "digital_bank",
      countries: ["Nigeria"],
      color: "bg-green-600",
      description: "All-in-one financial services platform",
      features: ["Payments", "Savings", "Loans", "Investments"],
    },
    {
      id: "palmpay",
      name: "PalmPay",
      icon: <Building className="h-5 w-5" />,
      type: "digital_bank",
      countries: ["Nigeria", "Ghana"],
      color: "bg-blue-500",
      description: "Digital financial services for Africa",
      features: ["Bill payments", "Transfers", "Cashback rewards"],
    },
    {
      id: "tymebank",
      name: "TymeBank",
      icon: <Building className="h-5 w-5" />,
      type: "digital_bank",
      countries: ["South Africa"],
      color: "bg-teal-500",
      description: "South Africa's digital banking pioneer",
      features: ["No monthly fees", "Goal Save", "MoreTyme rewards"],
    },

    // Payment Gateways
    {
      id: "paystack",
      name: "Paystack",
      icon: <CreditCard className="h-5 w-5" />,
      type: "payment_gateway",
      countries: ["Nigeria", "Ghana", "South Africa"],
      color: "bg-blue-600",
      description: "Accept payments from customers worldwide",
      features: ["Online payments", "Subscriptions", "Invoicing"],
      isPopular: true,
    },
    {
      id: "flutterwave",
      name: "Flutterwave",
      icon: <CreditCard className="h-5 w-5" />,
      type: "payment_gateway",
      countries: ["Nigeria", "Kenya", "Ghana", "Uganda", "Rwanda"],
      color: "bg-orange-600",
      description: "Pan-African payment infrastructure",
      features: ["Multi-currency", "Global reach", "Developer APIs"],
    },
    {
      id: "chipper_cash",
      name: "Chipper Cash",
      icon: <Globe className="h-5 w-5" />,
      type: "payment_gateway",
      countries: ["Nigeria", "Ghana", "Kenya", "Uganda", "Rwanda", "Tanzania"],
      color: "bg-indigo-500",
      description: "Cross-border payments made simple",
      features: ["P2P transfers", "Multi-country", "Crypto trading"],
    },

    // Crypto Exchanges
    {
      id: "luno",
      name: "Luno",
      icon: <Zap className="h-5 w-5" />,
      type: "crypto_exchange",
      countries: ["South Africa", "Nigeria", "Kenya", "Uganda"],
      color: "bg-yellow-600",
      description: "Buy, store and learn about cryptocurrency",
      features: ["Bitcoin & Ethereum", "Secure wallet", "Educational resources"],
    },
    {
      id: "quidax",
      name: "Quidax",
      icon: <Zap className="h-5 w-5" />,
      type: "crypto_exchange",
      countries: ["Nigeria"],
      color: "bg-purple-600",
      description: "Nigeria's leading cryptocurrency exchange",
      features: ["Naira deposits", "Multiple cryptocurrencies", "Trading tools"],
    },
  ];

  const handleProviderClick = (providerId: string) => {
    setSelectedProvider(providerId);
    const provider = paymentProviders.find(p => p.id === providerId);
    
    toast({
      title: `Connecting to ${provider?.name}`,
      description: "Redirecting to secure payment setup...",
    });

    // Here you would typically redirect to the provider's integration
    setTimeout(() => {
      toast({
        title: "Integration Available",
        description: `${provider?.name} integration will be available in the next update.`,
      });
    }, 2000);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "mobile_money": return "bg-green-100 text-green-800";
      case "digital_bank": return "bg-blue-100 text-blue-800";
      case "payment_gateway": return "bg-purple-100 text-purple-800";
      case "crypto_exchange": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "mobile_money": return "Mobile Money";
      case "digital_bank": return "Digital Bank";
      case "payment_gateway": return "Payment Gateway";
      case "crypto_exchange": return "Crypto Exchange";
      default: return "Payment Service";
    }
  };

  const popularProviders = paymentProviders.filter(p => p.isPopular);
  const groupedProviders = paymentProviders.reduce((acc, provider) => {
    if (!acc[provider.type]) {
      acc[provider.type] = [];
    }
    acc[provider.type].push(provider);
    return acc;
  }, {} as Record<string, PaymentProvider[]>);

  return (
    <div className="space-y-6">
      {/* Popular Quick Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Popular African Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {popularProviders.map((provider) => (
              <Button
                key={provider.id}
                variant="outline"
                className={`${provider.color} text-white border-none hover:scale-105 transition-all flex flex-col items-center gap-2 h-auto py-4 hover:opacity-90`}
                onClick={() => handleProviderClick(provider.id)}
              >
                {provider.icon}
                <span className="text-xs font-medium text-center">
                  {provider.name}
                </span>
                <Badge variant="secondary" className="text-xs bg-white/20 text-white">
                  Popular
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Providers by Category */}
      {Object.entries(groupedProviders).map(([type, providers]) => (
        <Card key={type}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {getTypeLabel(type)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleProviderClick(provider.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${provider.color} rounded-full text-white`}>
                    {provider.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{provider.name}</h4>
                      <Badge className={getTypeColor(provider.type)} variant="secondary">
                        {getTypeLabel(provider.type)}
                      </Badge>
                      {provider.isPopular && (
                        <Badge variant="default" className="bg-yellow-500">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{provider.description}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {provider.countries.map((country) => (
                        <Badge key={country} variant="outline" className="text-xs">
                          {country}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {provider.features.slice(0, 3).map((feature) => (
                        <span key={feature} className="text-xs text-gray-500">
                          • {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProviderClick(provider.id);
                  }}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Integration Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Wifi className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">
                Coming Soon: Full Integration
              </h4>
              <p className="text-sm text-blue-700 mb-3">
                We're working on direct integration with these African payment providers. 
                For now, you can use our existing bank transfer and card payment options.
              </p>
              <div className="text-xs text-blue-600">
                <p>• Mobile Money APIs in development</p>
                <p>• Digital bank partnerships being finalized</p>
                <p>• Crypto exchange integrations planned for Q2 2024</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AfricanPaymentQuickLinks;
