
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info, RefreshCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Currency {
  id: string;
  name: string;
  symbol: string;
  icon: string;
}

const SoftPointExchange = () => {
  const [fromCurrency, setFromCurrency] = useState("softpoints");
  const [toCurrency, setToCurrency] = useState("btc");
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("0");
  const [isConverting, setIsConverting] = useState(false);
  const [conversionRate, setConversionRate] = useState(0);
  const [fee, setFee] = useState(0);
  const { toast } = useToast();

  const currencies: Currency[] = [
    { 
      id: "softpoints", 
      name: "SoftPoints", 
      symbol: "SP", 
      icon: "🔮" 
    },
    { 
      id: "btc", 
      name: "Bitcoin", 
      symbol: "BTC", 
      icon: "₿" 
    },
    { 
      id: "eth", 
      name: "Ethereum", 
      symbol: "ETH", 
      icon: "Ξ" 
    },
    { 
      id: "usdt", 
      name: "Tether", 
      symbol: "USDT", 
      icon: "₮" 
    },
    { 
      id: "sol", 
      name: "Solana", 
      symbol: "SOL", 
      icon: "◎" 
    },
  ];

  // Get currency details by ID
  const getCurrency = (id: string) => {
    return currencies.find((c) => c.id === id) || currencies[0];
  };

  // Update conversion rate when currencies change
  useEffect(() => {
    const from = fromCurrency;
    const to = toCurrency;
    
    // Mock conversion rates
    const rates: Record<string, Record<string, number>> = {
      softpoints: {
        btc: 0.00000025, // 4,000,000 SP = 1 BTC
        eth: 0.000004, // 250,000 SP = 1 ETH
        usdt: 0.01, // 100 SP = 1 USDT
        sol: 0.0006, // 1666 SP = 1 SOL
      },
      btc: {
        softpoints: 4000000, // 1 BTC = 4,000,000 SP
        eth: 16, // 1 BTC = 16 ETH
        usdt: 52800, // 1 BTC = $52,800
        sol: 335, // 1 BTC = 335 SOL
      },
      eth: {
        softpoints: 250000, // 1 ETH = 250,000 SP
        btc: 0.0625, // 1 ETH = 0.0625 BTC
        usdt: 3145, // 1 ETH = $3,145
        sol: 20, // 1 ETH = 20 SOL
      },
      usdt: {
        softpoints: 100, // 1 USDT = 100 SP
        btc: 0.000019, // 1 USDT = 0.000019 BTC
        eth: 0.00032, // 1 USDT = 0.00032 ETH
        sol: 0.00633, // 1 USDT = 0.00633 SOL
      },
      sol: {
        softpoints: 1666, // 1 SOL = 1,666 SP
        btc: 0.003, // 1 SOL = 0.003 BTC
        eth: 0.05, // 1 SOL = 0.05 ETH
        usdt: 157.83, // 1 SOL = $157.83
      },
    };

    // Set the conversion rate
    if (from !== to && rates[from] && rates[from][to]) {
      setConversionRate(rates[from][to]);
    } else if (from === to) {
      setConversionRate(1);
    } else {
      setConversionRate(0);
    }

    // Set fee percentage (mock)
    // Higher fee for SoftPoints conversions
    if (from === "softpoints" || to === "softpoints") {
      setFee(0.025); // 2.5% fee
    } else {
      setFee(0.015); // 1.5% standard fee
    }
  }, [fromCurrency, toCurrency]);

  // Calculate conversion when amount changes
  useEffect(() => {
    if (amount && conversionRate) {
      const parsedAmount = parseFloat(amount);
      if (!isNaN(parsedAmount)) {
        const converted = parsedAmount * conversionRate;
        const feeAmount = converted * fee;
        const finalAmount = converted - feeAmount;
        setConvertedAmount(finalAmount.toFixed(8));
      }
    } else {
      setConvertedAmount("0");
    }
  }, [amount, conversionRate, fee]);

  const handleConvert = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to convert.",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    
    // Simulate API call
    setTimeout(() => {
      const fromCurrencyDetails = getCurrency(fromCurrency);
      const toCurrencyDetails = getCurrency(toCurrency);
      const parsedAmount = parseFloat(amount);
      const convertedValue = parseFloat(convertedAmount);
      
      setIsConverting(false);
      toast({
        title: "Conversion Successful",
        description: `Converted ${parsedAmount} ${fromCurrencyDetails.symbol} to ${convertedValue.toFixed(6)} ${toCurrencyDetails.symbol}`,
      });
      
      // Clear form
      setAmount("");
    }, 1500);
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setAmount("");
  };

  const fromCurrencyDetails = getCurrency(fromCurrency);
  const toCurrencyDetails = getCurrency(toCurrency);

  const feeAmount = parseFloat(convertedAmount) * fee;
  const feePercentage = fee * 100;

  const formattedConversionRate = conversionRate < 0.001 
    ? conversionRate.toFixed(8)
    : conversionRate.toFixed(4);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Convert Crypto</CardTitle>
          <CardDescription>
            Exchange SoftPoints for crypto or convert between cryptocurrencies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-8">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
              {/* From Currency Section */}
              <div className="col-span-1 md:col-span-3 space-y-2">
                <label className="text-sm font-medium">From</label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.id} value={currency.id}>
                          <div className="flex items-center">
                            <span className="mr-2">{currency.icon}</span>
                            {currency.name} ({currency.symbol})
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                    {fromCurrencyDetails.symbol}
                  </div>
                </div>
              </div>

              {/* Swap Button */}
              <div className="col-span-1 md:col-span-1 flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={swapCurrencies}
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>

              {/* To Currency Section */}
              <div className="col-span-1 md:col-span-3 space-y-2">
                <label className="text-sm font-medium">To</label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.id} value={currency.id}>
                          <div className="flex items-center">
                            <span className="mr-2">{currency.icon}</span>
                            {currency.name} ({currency.symbol})
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div className="relative bg-muted rounded-md p-3 flex items-center">
                  <span className="text-lg font-semibold">
                    {parseFloat(convertedAmount) < 0.001
                      ? parseFloat(convertedAmount).toFixed(8)
                      : parseFloat(convertedAmount).toFixed(6)}
                  </span>
                  <span className="ml-1 text-muted-foreground">
                    {toCurrencyDetails.symbol}
                  </span>
                </div>
              </div>
            </div>

            {/* Conversion Details */}
            <div className="pt-4 border-t">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <div className="text-muted-foreground">Conversion Rate</div>
                  <div>
                    1 {fromCurrencyDetails.symbol} = {formattedConversionRate}{" "}
                    {toCurrencyDetails.symbol}
                  </div>
                </div>
                
                <div className="flex justify-between text-sm items-center">
                  <div className="flex items-center text-muted-foreground">
                    <span>Fee ({feePercentage}%)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 ml-1 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="w-80">
                          <p>
                            A fee of {feePercentage}% is charged on all conversions. 
                            Higher fees apply for SoftPoints conversions.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div>
                    {feeAmount.toFixed(8)} {toCurrencyDetails.symbol}
                  </div>
                </div>
                
                <div className="flex justify-between font-medium pt-2">
                  <div>You'll receive</div>
                  <div>
                    {parseFloat(convertedAmount) < 0.001
                      ? parseFloat(convertedAmount).toFixed(8)
                      : parseFloat(convertedAmount).toFixed(6)}{" "}
                    {toCurrencyDetails.symbol}
                  </div>
                </div>
              </div>
            </div>

            <Button 
              className="w-full" 
              disabled={!amount || parseFloat(amount) <= 0 || isConverting}
              onClick={handleConvert}
            >
              {isConverting ? (
                <div className="flex items-center">
                  <RefreshCcw className="animate-spin h-4 w-4 mr-2" />
                  Converting...
                </div>
              ) : (
                <div className="flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Convert Now
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Conversion History Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Conversion History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent conversions</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SoftPointExchange;
