import React, { useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Globe,
  DollarSign,
  MapPin,
  Check,
  ChevronDown,
  Settings,
  CreditCard,
  Smartphone,
  Building,
  Bitcoin,
  Wallet,
  Info,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Quick Language Selector (for header/nav)
export const QuickLanguageSelector: React.FC = () => {
  const [open, setOpen] = useState(false);

  // Add error boundary for I18n context
  let currentLanguage, supportedLanguages, setLanguage;
  try {
    const i18nContext = useI18n();
    currentLanguage = i18nContext.currentLanguage;
    supportedLanguages = i18nContext.supportedLanguages;
    setLanguage = i18nContext.setLanguage;
  } catch (error) {
    // Fallback if context not available
    console.warn("I18n context not available:", error);
    return null;
  }

  if (!currentLanguage || !supportedLanguages) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="w-auto px-2">
          <span className="mr-2">{currentLanguage.flag}</span>
          <span className="hidden md:inline">{currentLanguage.name}</span>
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0" align="end">
        <Command>
          <CommandInput placeholder="Search language..." />
          <CommandEmpty>No language found.</CommandEmpty>
          <CommandGroup>
            {supportedLanguages.map((language) => (
              <CommandItem
                key={language.code}
                onSelect={() => {
                  setLanguage(language.code);
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                <span className="mr-2">{language.flag}</span>
                <span className="flex-1">{language.name}</span>
                <span className="text-xs text-muted-foreground">
                  {language.nativeName}
                </span>
                {currentLanguage.code === language.code && (
                  <Check className="w-4 h-4 ml-2" />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// Quick Currency Selector
export const QuickCurrencySelector: React.FC = () => {
  const [open, setOpen] = useState(false);

  // Add error boundary for I18n context
  let currentCurrency, supportedCurrencies, setCurrency;
  try {
    const i18nContext = useI18n();
    currentCurrency = i18nContext.currentCurrency;
    supportedCurrencies = i18nContext.supportedCurrencies;
    setCurrency = i18nContext.setCurrency;
  } catch (error) {
    // Fallback if context not available
    console.warn("I18n context not available:", error);
    return null;
  }

  if (!currentCurrency || !supportedCurrencies) {
    return null;
  }

  // Show popular currencies first
  const popularCurrencies = ["USD", "EUR", "GBP", "NGN", "GHS", "ZAR", "KES"];
  const sortedCurrencies = supportedCurrencies.sort((a, b) => {
    const aIndex = popularCurrencies.indexOf(a.code);
    const bIndex = popularCurrencies.indexOf(b.code);
    if (aIndex === -1 && bIndex === -1) return a.name.localeCompare(b.name);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="w-auto px-2">
          <DollarSign className="w-4 h-4 mr-1" />
          <span className="font-medium">{currentCurrency.code}</span>
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        <Command>
          <CommandInput placeholder="Search currency..." />
          <CommandEmpty>No currency found.</CommandEmpty>
          <CommandGroup heading="Popular">
            {sortedCurrencies.slice(0, 6).map((currency) => (
              <CommandItem
                key={currency.code}
                onSelect={() => {
                  setCurrency(currency.code);
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                <span className="font-medium mr-2">{currency.symbol}</span>
                <span className="flex-1">
                  {currency.code} - {currency.name}
                </span>
                {currentCurrency.code === currency.code && (
                  <Check className="w-4 h-4 ml-2" />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="All Currencies">
            {sortedCurrencies.slice(6).map((currency) => (
              <CommandItem
                key={currency.code}
                onSelect={() => {
                  setCurrency(currency.code);
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                <span className="font-medium mr-2">{currency.symbol}</span>
                <span className="flex-1">
                  {currency.code} - {currency.name}
                </span>
                {currentCurrency.code === currency.code && (
                  <Check className="w-4 h-4 ml-2" />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// Comprehensive Settings Modal
export const I18nSettingsModal: React.FC<{
  trigger?: React.ReactNode;
}> = ({ trigger }) => {
  const {
    currentLanguage,
    currentCurrency,
    currentRegion,
    supportedLanguages,
    supportedCurrencies,
    regions,
    availablePaymentMethods,
    culturalNotes,
    setLanguage,
    setCurrency,
    setRegion,
    t,
  } = useI18n();

  const [open, setOpen] = useState(false);

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case "bank":
        return <Building className="w-4 h-4" />;
      case "mobile":
        return <Smartphone className="w-4 h-4" />;
      case "card":
        return <CreditCard className="w-4 h-4" />;
      case "crypto":
        return <Bitcoin className="w-4 h-4" />;
      case "ewallet":
        return <Wallet className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Globe className="w-4 h-4 mr-2" />
            Language & Region
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Language & Regional Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Language Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Language Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {supportedLanguages.map((language) => (
                  <div
                    key={language.code}
                    className={cn(
                      "p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted",
                      currentLanguage.code === language.code &&
                        "border-primary bg-primary/10",
                    )}
                    onClick={() => setLanguage(language.code)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{language.flag}</span>
                        <div>
                          <div className="font-medium">{language.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {language.nativeName}
                          </div>
                        </div>
                      </div>
                      {currentLanguage.code === language.code && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Currency Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Currency Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {supportedCurrencies.map((currency) => (
                  <div
                    key={currency.code}
                    className={cn(
                      "p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted",
                      currentCurrency.code === currency.code &&
                        "border-primary bg-primary/10",
                    )}
                    onClick={() => setCurrency(currency.code)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {currency.symbol}
                        </div>
                        <div>
                          <div className="font-medium">
                            {currency.code} - {currency.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {currency.country}
                          </div>
                        </div>
                      </div>
                      {currentCurrency.code === currency.code && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Region Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Regional Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {regions.map((region) => (
                  <div
                    key={region.code}
                    className={cn(
                      "p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted",
                      currentRegion.code === region.code &&
                        "border-primary bg-primary/10",
                    )}
                    onClick={() => setRegion(region.code)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{region.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {region.countries.length} countries
                        </div>
                        <div className="flex gap-1 mt-1">
                          {region.currencies.slice(0, 3).map((curr) => (
                            <Badge
                              key={curr}
                              variant="outline"
                              className="text-xs"
                            >
                              {curr}
                            </Badge>
                          ))}
                          {region.currencies.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{region.currencies.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {currentRegion.code === region.code && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Available Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Available Payment Methods
                <Badge variant="secondary" className="ml-2">
                  {availablePaymentMethods.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {availablePaymentMethods.length > 0 ? (
                availablePaymentMethods.map((method) => (
                  <div key={method.id} className="p-3 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        {getPaymentMethodIcon(method.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{method.name}</span>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {method.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {method.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Fee: {method.fees.percentage}%</span>
                          <span>Processing: {method.processingTime}</span>
                          <span>
                            Limit: {currentCurrency.symbol}
                            {method.limits.max.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex gap-1 mt-2">
                          {method.currencies.slice(0, 3).map((curr) => (
                            <Badge
                              key={curr}
                              variant="secondary"
                              className="text-xs"
                            >
                              {curr}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                  <p>
                    No payment methods available for your current region and
                    currency
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cultural Notes */}
          {culturalNotes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Cultural Considerations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {culturalNotes.map((note, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <p className="text-sm">{note}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Settings Summary */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">
                Current Settings Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium mb-1">Language</div>
                  <div className="flex items-center gap-2">
                    <span>{currentLanguage.flag}</span>
                    <span>{currentLanguage.name}</span>
                  </div>
                </div>
                <div>
                  <div className="font-medium mb-1">Currency</div>
                  <div className="flex items-center gap-2">
                    <span>{currentCurrency.symbol}</span>
                    <span>{currentCurrency.code}</span>
                  </div>
                </div>
                <div>
                  <div className="font-medium mb-1">Region</div>
                  <div>{currentRegion.name}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Regional Payment Methods Display
export const RegionalPaymentMethods: React.FC = () => {
  const { availablePaymentMethods, currentCurrency } = useI18n();

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case "bank":
        return <Building className="w-4 h-4" />;
      case "mobile":
        return <Smartphone className="w-4 h-4" />;
      case "card":
        return <CreditCard className="w-4 h-4" />;
      case "crypto":
        return <Bitcoin className="w-4 h-4" />;
      case "ewallet":
        return <Wallet className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  if (availablePaymentMethods.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-medium mb-2">No Payment Methods Available</h3>
          <p className="text-sm text-muted-foreground">
            No payment methods are configured for your current region and
            currency.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {availablePaymentMethods.map((method) => (
        <Card key={method.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {getPaymentMethodIcon(method.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{method.name}</span>
                  <Badge variant="outline" className="text-xs capitalize">
                    {method.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {method.description}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Fee:</span>
                    <span className="ml-1 font-medium">
                      {method.fees.percentage}%
                      {method.fees.fixed > 0 &&
                        ` + ${currentCurrency.symbol}${method.fees.fixed}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Processing:</span>
                    <span className="ml-1 font-medium">
                      {method.processingTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Min:</span>
                    <span className="ml-1 font-medium">
                      {currentCurrency.symbol}
                      {method.limits.min}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Max:</span>
                    <span className="ml-1 font-medium">
                      {currentCurrency.symbol}
                      {method.limits.max.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 mt-2">
                  {method.currencies.map((curr) => (
                    <Badge
                      key={curr}
                      variant={
                        curr === currentCurrency.code ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {curr}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default {
  QuickLanguageSelector,
  QuickCurrencySelector,
  I18nSettingsModal,
  RegionalPaymentMethods,
};
