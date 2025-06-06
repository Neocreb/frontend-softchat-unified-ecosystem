
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import CryptoTabs from "@/components/crypto/CryptoTabs";
import CryptoMarket from "./CryptoMarket";
import CryptoDashboard from "@/components/crypto/CryptoDashboard";
import CryptoPortfolio from "@/components/crypto/CryptoPortfolio";
import CryptoTrading from "@/components/crypto/CryptoTrading";

const EnhancedCrypto = () => {
  const [activeTab, setActiveTab] = useState("portfolio");

  return (
    <div className="container max-w-6xl mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Crypto Hub</h1>
        <p className="text-muted-foreground">Manage your crypto portfolio and explore markets</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <CryptoTabs activeTab={activeTab} onValueChange={setActiveTab} />
        
        <div className="mt-6">
          <TabsContent value="portfolio" className="space-y-4">
            <CryptoPortfolio />
          </TabsContent>
          
          <TabsContent value="markets" className="space-y-4">
            <CryptoDashboard />
          </TabsContent>
          
          <TabsContent value="basic" className="space-y-4">
            <CryptoMarket />
          </TabsContent>
          
          <TabsContent value="trading" className="space-y-4">
            <CryptoTrading />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default EnhancedCrypto;
