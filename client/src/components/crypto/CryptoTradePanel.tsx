
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import type { Crypto } from "@/pages/CryptoMarket";

interface CryptoTradePanelProps {
  crypto: Crypto | null;
  onTrade: (type: 'buy' | 'sell', amount: number) => void;
}

const CryptoTradePanel = ({ crypto, onTrade }: CryptoTradePanelProps) => {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<string>('');
  const [usdValue, setUsdValue] = useState<string>('');
  
  if (!crypto) return null;
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setAmount(value);
      
      // Calculate USD value
      const numValue = parseFloat(value) || 0;
      setUsdValue((numValue * crypto.current_price).toFixed(2));
    }
  };
  
  const handleUsdValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setUsdValue(value);
      
      // Calculate crypto amount
      const numValue = parseFloat(value) || 0;
      setAmount((numValue / crypto.current_price).toFixed(8));
    }
  };
  
  const handleTrade = () => {
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      onTrade(tradeType, numAmount);
      setAmount('');
      setUsdValue('');
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          Trade {crypto.name} ({crypto.symbol.toUpperCase()})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={tradeType} onValueChange={(v) => setTradeType(v as 'buy' | 'sell')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>
          
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Amount ({crypto.symbol.toUpperCase()})</Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="0.00"
                  value={amount}
                  onChange={handleAmountChange}
                />
                <div className="absolute right-3 top-2.5 text-sm text-muted-foreground">
                  {crypto.symbol.toUpperCase()}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Value (USD)</Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="0.00"
                  value={usdValue}
                  onChange={handleUsdValueChange}
                />
                <div className="absolute right-3 top-2.5 text-sm text-muted-foreground">
                  USD
                </div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              1 {crypto.symbol.toUpperCase()} = ${crypto.current_price.toLocaleString()} USD
            </div>
            
            <Button 
              onClick={handleTrade}
              disabled={!amount || parseFloat(amount) <= 0}
              className="w-full"
              variant={tradeType === 'buy' ? 'default' : 'destructive'}
            >
              {tradeType === 'buy' ? 'Buy' : 'Sell'} {crypto.symbol.toUpperCase()}
            </Button>
            
            <div className="bg-muted p-3 rounded-md text-sm">
              <div className="font-medium mb-1">Mock Trading Account</div>
              <div className="flex justify-between">
                <span>Available USD:</span>
                <span>$10,000.00</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Available {crypto.symbol.toUpperCase()}:</span>
                <span>{tradeType === 'buy' ? '0.00' : '1.25'}</span>
              </div>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CryptoTradePanel;
