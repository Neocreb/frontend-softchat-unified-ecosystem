
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import WalletHeader from "@/components/wallet/WalletHeader";
import WalletOverview from "@/components/wallet/WalletOverview";
import WalletRewards from "@/components/wallet/WalletRewards";
import WalletTransactions from "@/components/wallet/WalletTransactions";

const Wallet = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container py-6">
      <WalletHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="overview" className="mt-0">
          <WalletOverview />
        </TabsContent>

        <TabsContent value="rewards" className="mt-0">
          <WalletRewards />
        </TabsContent>

        <TabsContent value="transactions" className="mt-0">
          <WalletTransactions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Wallet;
