
import WalletCard from "@/components/wallet/WalletCard";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import BankAccountSettings from "@/components/wallet/BankAccountSettings";
import WalletHeader from "@/components/wallet/WalletHeader";
import WalletRewards from "@/components/wallet/WalletRewards";
import WalletTransactions from "@/components/wallet/WalletTransactions";

const Wallet = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container py-6">
      <WalletHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            <WalletCard />
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="mt-0">
          <WalletRewards />
        </TabsContent>

        <TabsContent value="transactions" className="mt-0">
          <WalletTransactions />
        </TabsContent>
        
        <TabsContent value="bank" className="mt-0">
          <BankAccountSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Wallet;
