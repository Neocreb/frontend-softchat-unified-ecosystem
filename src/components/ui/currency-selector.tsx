import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronDown,
  Search,
  Check,
  DollarSign,
  Bitcoin,
  Globe,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { type Currency, CURRENCY_CATEGORIES } from "@/config/currencies";
import { cn } from "@/lib/utils";

interface CurrencySelectorProps {
  value?: string;
  onValueChange?: (currencyCode: string) => void;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "compact" | "full";
  showFlag?: boolean;
  showCategory?: boolean;
  showTrend?: boolean;
  categories?: Currency['category'][];
  placeholder?: string;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  value,
  onValueChange,
  disabled = false,
  className,
  variant = "default",
  showFlag = true,
  showCategory = false,
  showTrend = false,
  categories = ['fiat', 'crypto', 'stablecoin'],
  placeholder = "Select currency"
}) => {
  const { userCurrency, getSupportedCurrencies, getCurrenciesByCategory } = useCurrency();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const selectedCurrency = value 
    ? getSupportedCurrencies().find(c => c.code === value)
    : userCurrency;

  const allCurrencies = getSupportedCurrencies();
  const categorizedCurrencies = categories.reduce((acc, category) => {
    acc[category] = getCurrenciesByCategory(category);
    return acc;
  }, {} as Record<Currency['category'], Currency[]>);

  const filteredCurrencies = searchValue
    ? allCurrencies.filter(currency =>
        currency.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        currency.code.toLowerCase().includes(searchValue.toLowerCase()) ||
        currency.country.toLowerCase().includes(searchValue.toLowerCase())
      )
    : allCurrencies;

  const handleSelect = (currencyCode: string) => {
    onValueChange?.(currencyCode);
    setOpen(false);
  };

  const getCategoryIcon = (category: Currency['category']) => {
    switch (category) {
      case 'fiat': return <DollarSign className="w-4 h-4" />;
      case 'crypto': return <Bitcoin className="w-4 h-4" />;
      case 'stablecoin': return <Zap className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const renderCurrency = (currency: Currency, isSelected: boolean = false) => (
    <div className="flex items-center gap-3 flex-1 min-w-0">
      {showFlag && (
        <span className="text-lg" title={currency.country}>
          {currency.flag}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium">{currency.code}</span>
          <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {currency.name}
          </span>
          {showCategory && (
            <Badge variant="secondary" className="text-xs">
              {CURRENCY_CATEGORIES[currency.category]}
            </Badge>
          )}
        </div>
        {variant === "full" && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{currency.country}</span>
            {currency.isCrypto && (
              <Badge variant="outline" className="text-xs">
                Crypto
              </Badge>
            )}
            {showTrend && (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-green-500">+2.3%</span>
              </div>
            )}
          </div>
        )}
      </div>
      {isSelected && <Check className="w-4 h-4 text-primary" />}
    </div>
  );

  if (variant === "compact") {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("justify-between", className)}
            disabled={disabled}
          >
            <div className="flex items-center gap-2">
              {showFlag && selectedCurrency && (
                <span className="text-sm">{selectedCurrency.flag}</span>
              )}
              <span>{selectedCurrency?.code || placeholder}</span>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Command>
            <CommandInput placeholder="Search currencies..." />
            <CommandEmpty>No currency found.</CommandEmpty>
            <ScrollArea className="h-60">
              {Object.entries(categorizedCurrencies).map(([category, currencies]) => (
                <CommandGroup 
                  key={category} 
                  heading={
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(category as Currency['category'])}
                      {CURRENCY_CATEGORIES[category as Currency['category']]}
                    </div>
                  }
                >
                  {currencies.map((currency) => (
                    <CommandItem
                      key={currency.code}
                      value={currency.code}
                      onSelect={() => handleSelect(currency.code)}
                      className="cursor-pointer"
                    >
                      {renderCurrency(currency, selectedCurrency?.code === currency.code)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn("justify-between", className)}
          disabled={disabled}
        >
          <div className="flex items-center gap-3">
            {showFlag && selectedCurrency && (
              <span className="text-lg">{selectedCurrency.flag}</span>
            )}
            <div className="text-left">
              <div className="font-medium">{selectedCurrency?.code || placeholder}</div>
              {variant === "full" && selectedCurrency && (
                <div className="text-xs text-gray-500">{selectedCurrency.name}</div>
              )}
            </div>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Select Currency
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, code, or country..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {searchValue ? (
            <ScrollArea className="h-80">
              <div className="space-y-2">
                {filteredCurrencies.length > 0 ? (
                  filteredCurrencies.map((currency) => (
                    <div
                      key={currency.code}
                      className={cn(
                        "flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                        selectedCurrency?.code === currency.code && "border-primary bg-primary/10"
                      )}
                      onClick={() => handleSelect(currency.code)}
                    >
                      {renderCurrency(currency, selectedCurrency?.code === currency.code)}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No currencies found matching "{searchValue}"
                  </div>
                )}
              </div>
            </ScrollArea>
          ) : (
            <Tabs defaultValue={categories[0]} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    {CURRENCY_CATEGORIES[category]}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map((category) => (
                <TabsContent key={category} value={category}>
                  <ScrollArea className="h-80">
                    <div className="space-y-2">
                      {categorizedCurrencies[category].map((currency) => (
                        <div
                          key={currency.code}
                          className={cn(
                            "flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                            selectedCurrency?.code === currency.code && "border-primary bg-primary/10"
                          )}
                          onClick={() => handleSelect(currency.code)}
                        >
                          {renderCurrency(currency, selectedCurrency?.code === currency.code)}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CurrencySelector;
