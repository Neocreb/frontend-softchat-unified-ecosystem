import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { africanPaymentService } from "@/services/africanPaymentService";
import {
  MapPin,
  DollarSign,
  Globe,
  Smartphone,
  Building,
  CreditCard,
  Search,
  ChevronRight,
} from "lucide-react";

interface Country {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  phoneCode: string;
  flag: string;
  region: string;
  exchangeRate: number; // Mock exchange rate to USD
  popularPaymentMethods: string[];
  mobileMoneyProviders: string[];
  majorBanks: string[];
}

interface CountryCurrencySelectorProps {
  selectedCountry?: string;
  selectedCurrency?: string;
  onCountryChange?: (country: Country) => void;
  onCurrencyChange?: (currency: string) => void;
  showPaymentMethods?: boolean;
}

const AfricanCountryCurrencySelector = ({
  selectedCountry,
  selectedCurrency,
  onCountryChange,
  onCurrencyChange,
  showPaymentMethods = true,
}: CountryCurrencySelectorProps) => {
  const [countries] = useState<Country[]>([
    // West Africa
    {
      code: "NG",
      name: "Nigeria",
      currency: "NGN",
      currencySymbol: "₦",
      phoneCode: "+234",
      flag: "🇳🇬",
      region: "West Africa",
      exchangeRate: 400,
      popularPaymentMethods: ["Bank Transfer", "Mobile Money", "USSD", "Cards"],
      mobileMoneyProviders: ["MTN MoMo", "Airtel Money", "Opay", "PalmPay"],
      majorBanks: ["GTBank", "Access Bank", "Zenith Bank", "First Bank", "UBA"],
    },
    {
      code: "GH",
      name: "Ghana",
      currency: "GHS",
      currencySymbol: "₵",
      phoneCode: "+233",
      flag: "🇬🇭",
      region: "West Africa",
      exchangeRate: 6.8,
      popularPaymentMethods: ["Mobile Money", "Bank Transfer", "Cards"],
      mobileMoneyProviders: ["MTN Mobile Money", "Vodafone Cash", "AirtelTigo Money"],
      majorBanks: ["GCB Bank", "Ecobank Ghana", "Standard Chartered", "Zenith Bank"],
    },
    {
      code: "SN",
      name: "Senegal",
      currency: "XOF",
      currencySymbol: "CFA",
      phoneCode: "+221",
      flag: "🇸🇳",
      region: "West Africa",
      exchangeRate: 590,
      popularPaymentMethods: ["Orange Money", "Bank Transfer", "Cards"],
      mobileMoneyProviders: ["Orange Money", "Free Money", "Tigo Cash"],
      majorBanks: ["UBA Senegal", "Ecobank", "SGBS", "BICIS"],
    },
    {
      code: "CI",
      name: "Côte d'Ivoire",
      currency: "XOF",
      currencySymbol: "CFA",
      phoneCode: "+225",
      flag: "🇨🇮",
      region: "West Africa",
      exchangeRate: 590,
      popularPaymentMethods: ["Orange Money", "MTN Mobile Money", "Bank Transfer"],
      mobileMoneyProviders: ["Orange Money", "MTN Mobile Money", "Moov Money"],
      majorBanks: ["UBA Côte d'Ivoire", "Ecobank", "SIB", "SGBCI"],
    },

    // East Africa
    {
      code: "KE",
      name: "Kenya",
      currency: "KES",
      currencySymbol: "KSh",
      phoneCode: "+254",
      flag: "🇰🇪",
      region: "East Africa",
      exchangeRate: 150,
      popularPaymentMethods: ["M-Pesa", "Bank Transfer", "Cards"],
      mobileMoneyProviders: ["M-Pesa", "Airtel Money", "T-Kash"],
      majorBanks: ["KCB", "Equity Bank", "Co-operative Bank", "Standard Chartered"],
    },
    {
      code: "UG",
      name: "Uganda",
      currency: "UGX",
      currencySymbol: "USh",
      phoneCode: "+256",
      flag: "🇺🇬",
      region: "East Africa",
      exchangeRate: 3700,
      popularPaymentMethods: ["Mobile Money", "Bank Transfer", "Cards"],
      mobileMoneyProviders: ["MTN Mobile Money", "Airtel Money"],
      majorBanks: ["Stanbic Bank", "Centenary Bank", "DFCU Bank", "Standard Chartered"],
    },
    {
      code: "TZ",
      name: "Tanzania",
      currency: "TZS",
      currencySymbol: "TSh",
      phoneCode: "+255",
      flag: "🇹🇿",
      region: "East Africa",
      exchangeRate: 2300,
      popularPaymentMethods: ["M-Pesa", "Tigo Pesa", "Bank Transfer"],
      mobileMoneyProviders: ["M-Pesa", "Tigo Pesa", "Airtel Money", "Halopesa"],
      majorBanks: ["CRDB Bank", "NMB Bank", "Exim Bank", "Standard Chartered"],
    },
    {
      code: "RW",
      name: "Rwanda",
      currency: "RWF",
      currencySymbol: "RF",
      phoneCode: "+250",
      flag: "🇷🇼",
      region: "East Africa",
      exchangeRate: 1000,
      popularPaymentMethods: ["MTN Mobile Money", "Bank Transfer", "Cards"],
      mobileMoneyProviders: ["MTN Mobile Money", "Airtel Money"],
      majorBanks: ["Bank of Kigali", "Equity Bank", "Access Bank Rwanda"],
    },

    // Southern Africa
    {
      code: "ZA",
      name: "South Africa",
      currency: "ZAR",
      currencySymbol: "R",
      phoneCode: "+27",
      flag: "🇿🇦",
      region: "Southern Africa",
      exchangeRate: 18.5,
      popularPaymentMethods: ["Bank Transfer", "Cards", "SnapScan", "Zapper"],
      mobileMoneyProviders: ["FNB eWallet", "MTN Mobile Money"],
      majorBanks: ["Standard Bank", "ABSA", "FNB", "Nedbank", "Capitec"],
    },
    {
      code: "ZM",
      name: "Zambia",
      currency: "ZMW",
      currencySymbol: "ZK",
      phoneCode: "+260",
      flag: "🇿🇲",
      region: "Southern Africa",
      exchangeRate: 20,
      popularPaymentMethods: ["MTN Mobile Money", "Airtel Money", "Bank Transfer"],
      mobileMoneyProviders: ["MTN Mobile Money", "Airtel Money"],
      majorBanks: ["Standard Chartered", "Zanaco", "FNB Zambia", "Stanbic Bank"],
    },
    {
      code: "BW",
      name: "Botswana",
      currency: "BWP",
      currencySymbol: "P",
      phoneCode: "+267",
      flag: "🇧🇼",
      region: "Southern Africa",
      exchangeRate: 13.5,
      popularPaymentMethods: ["Bank Transfer", "Cards", "Orange Money"],
      mobileMoneyProviders: ["Orange Money", "Mascom My Zaka"],
      majorBanks: ["First National Bank", "Standard Chartered", "Barclays"],
    },

    // Central Africa
    {
      code: "CM",
      name: "Cameroon",
      currency: "XAF",
      currencySymbol: "FCFA",
      phoneCode: "+237",
      flag: "🇨🇲",
      region: "Central Africa",
      exchangeRate: 590,
      popularPaymentMethods: ["Orange Money", "MTN Mobile Money", "Bank Transfer"],
      mobileMoneyProviders: ["Orange Money", "MTN Mobile Money"],
      majorBanks: ["UBA Cameroon", "Ecobank", "SGBC", "Afriland First Bank"],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);

  const regions = ["West Africa", "East Africa", "Southern Africa", "Central Africa"];

  const filteredCountries = countries.filter(country => {
    const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         country.currency.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === "all" || country.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  useEffect(() => {
    if (selectedCountry) {
      const country = countries.find(c => c.code === selectedCountry || c.name === selectedCountry);
      if (country) {
        setCurrentCountry(country);
      }
    }
  }, [selectedCountry, countries]);

  const handleCountrySelect = (country: Country) => {
    setCurrentCountry(country);
    if (onCountryChange) {
      onCountryChange(country);
    }
    if (onCurrencyChange) {
      onCurrencyChange(country.currency);
    }
  };

  const convertToLocalCurrency = (usdAmount: number, country: Country) => {
    const localAmount = usdAmount * country.exchangeRate;
    return `${country.currencySymbol}${localAmount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Country Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Select Country & Currency
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search countries or currencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Country Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {filteredCountries.map((country) => (
              <Button
                key={country.code}
                variant={currentCountry?.code === country.code ? "default" : "outline"}
                className="justify-start h-auto p-3"
                onClick={() => handleCountrySelect(country)}
              >
                <div className="flex items-center gap-3 w-full">
                  <span className="text-2xl">{country.flag}</span>
                  <div className="text-left flex-1">
                    <p className="font-medium">{country.name}</p>
                    <p className="text-xs opacity-75">
                      {country.currency} • {country.phoneCode}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Country Details */}
      {currentCountry && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{currentCountry.flag}</span>
              {currentCountry.name}
              <Badge variant="outline">{currentCountry.region}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Currency Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Currency</p>
                <p className="font-semibold">{currentCountry.currency}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Symbol</p>
                <p className="font-semibold">{currentCountry.currencySymbol}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone Code</p>
                <p className="font-semibold">{currentCountry.phoneCode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Exchange Rate</p>
                <p className="font-semibold">1 USD = {currentCountry.currencySymbol}{currentCountry.exchangeRate}</p>
              </div>
            </div>

            {/* Quick Conversion */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Quick Currency Conversion</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                {[1, 5, 10, 50, 100].map((usd) => (
                  <div key={usd} className="text-center">
                    <p className="text-gray-600">${usd} USD</p>
                    <p className="font-semibold">{convertToLocalCurrency(usd, currentCountry)}</p>
                  </div>
                ))}
              </div>
            </div>

            {showPaymentMethods && (
              <>
                {/* Popular Payment Methods */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Popular Payment Methods
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {currentCountry.popularPaymentMethods.map((method) => (
                      <Badge key={method} variant="secondary">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Mobile Money Providers */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Mobile Money Providers
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {currentCountry.mobileMoneyProviders.map((provider) => (
                      <Badge key={provider} variant="outline" className="text-green-700 border-green-300">
                        {provider}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Major Banks */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Major Banks
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {currentCountry.majorBanks.map((bank) => (
                      <Badge key={bank} variant="outline" className="text-blue-700 border-blue-300">
                        {bank}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Integration Status */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 mb-1">Payment Integration Status</p>
              <div className="text-blue-700 space-y-1">
                <p>✅ All major banks supported for transfers</p>
                <p>🔄 Mobile money integrations in progress</p>
                <p>📱 Digital wallet connections coming soon</p>
                <p>🌍 Cross-border payments available</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AfricanCountryCurrencySelector;
