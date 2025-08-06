import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, ArrowUpDown, TrendingUp, Globe, DollarSign } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCurrencyConverter, usePriceConverter } from "@/hooks/useCurrencyConverter";
import CurrencySelector from "@/components/ui/currency-selector";
import CurrencyDisplay, { Price, Balance, InlinePrice, ConvertedPrice } from "@/components/ui/currency-display";

const CurrencyDemo: React.FC = () => {
  const { userCurrency, setUserCurrency, getSupportedCurrencies, refreshRates, lastUpdated } = useCurrency();
  const [demoPrice] = useState(99.99);
  
  const converter = useCurrencyConverter('USD', userCurrency.code);
  const priceConversion = usePriceConverter(demoPrice, 'USD');

  const handleRefreshRates = async () => {
    try {
      await refreshRates();
    } catch (error) {
      console.error('Failed to refresh rates:', error);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Currency Conversion System Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Unified currency management for the entire platform
        </p>
      </div>

      {/* Current User Currency */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            User Currency Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label>Your Preferred Currency</Label>
              <CurrencySelector
                value={userCurrency.code}
                onValueChange={setUserCurrency}
                variant="full"
                showFlag={true}
                showCategory={true}
              />
            </div>
            <div className="text-center">
              <Label className="text-sm text-gray-600">Last Updated</Label>
              <p className="text-xs text-gray-500">
                {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshRates}
                className="mt-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Rates
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currency Display Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Price Display</CardTitle>
          </CardHeader>
          <CardContent>
            <Price amount={demoPrice} currency="USD" size="lg" />
            <p className="text-xs text-gray-500 mt-2">
              Standard price formatting
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Balance Display</CardTitle>
          </CardHeader>
          <CardContent>
            <Balance 
              amount={1234.56} 
              currency={userCurrency.code}
              showTrend={true}
              trend="up"
              trendValue={5.2}
            />
            <p className="text-xs text-gray-500 mt-2">
              With trend indicators
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Inline Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              Product costs <InlinePrice amount={demoPrice} currency="USD" /> 
              with free shipping.
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Inline text formatting
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Converted Price</CardTitle>
          </CardHeader>
          <CardContent>
            <ConvertedPrice 
              amount={priceConversion.convertedPrice}
              fromCurrency="USD"
              showConversion={true}
            />
            <p className="text-xs text-gray-500 mt-2">
              Auto-converted with tooltip
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Currency Converter Widget */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5" />
            Live Currency Converter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from-amount">From Amount</Label>
              <div className="flex gap-2">
                <Input
                  id="from-amount"
                  type="number"
                  value={converter.fromAmount}
                  onChange={(e) => converter.setFromAmount(parseFloat(e.target.value) || 0)}
                  placeholder="Enter amount"
                />
                <CurrencySelector
                  value={converter.fromCurrency}
                  onValueChange={converter.setFromCurrency}
                  variant="compact"
                  className="min-w-[120px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to-amount">To Amount</Label>
              <div className="flex gap-2">
                <Input
                  id="to-amount"
                  type="number"
                  value={converter.toAmount}
                  onChange={(e) => converter.setToAmount(parseFloat(e.target.value) || 0)}
                  placeholder="Converted amount"
                  readOnly
                />
                <CurrencySelector
                  value={converter.toCurrency}
                  onValueChange={converter.setToCurrency}
                  variant="compact"
                  className="min-w-[120px]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={converter.swapCurrencies}
              className="px-4"
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <Label className="text-xs text-gray-500">Exchange Rate</Label>
                <p className="font-mono">
                  1 {converter.fromCurrency} = {converter.rate.toFixed(6)} {converter.toCurrency}
                </p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Inverse Rate</Label>
                <p className="font-mono">
                  1 {converter.toCurrency} = {converter.conversionInfo.inverse.toFixed(6)} {converter.fromCurrency}
                </p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Last Updated</Label>
                <p className="text-xs">
                  {converter.lastUpdated?.toLocaleTimeString() || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {converter.error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{converter.error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Supported Currencies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Supported Currencies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['fiat', 'crypto', 'stablecoin'].map((category) => (
              <div key={category}>
                <h4 className="font-medium mb-2 capitalize">
                  {category === 'fiat' ? 'Fiat Currencies' : 
                   category === 'crypto' ? 'Cryptocurrencies' : 'Stablecoins'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getSupportedCurrencies()
                    .filter(currency => currency.category === category)
                    .slice(0, 10)
                    .map((currency) => (
                      <Badge 
                        key={currency.code} 
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => setUserCurrency(currency.code)}
                      >
                        {currency.flag} {currency.code}
                      </Badge>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Real-World Usage Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">E-commerce Product</h4>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium">Premium Subscription</h5>
                <Price amount={29.99} currency="USD" size="lg" />
                <p className="text-sm text-gray-500 mt-1">
                  Automatically shows in your preferred currency
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Freelance Payment</h4>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium">Project Payment</h5>
                <ConvertedPrice 
                  amount={1500} 
                  fromCurrency="USD"
                  showConversion={true}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Shows original amount and conversion details
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Crypto Trading</h4>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium">Bitcoin Balance</h5>
                <Balance 
                  amount={0.0234} 
                  currency="BTC"
                  showTrend={true}
                  trend="up"
                  trendValue={3.7}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Crypto balances with trend indicators
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Wallet Balance</h4>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium">Available Balance</h5>
                <Balance 
                  amount={2567.89} 
                  currency={userCurrency.code}
                  animate={true}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Main wallet balance with animations
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrencyDemo;
