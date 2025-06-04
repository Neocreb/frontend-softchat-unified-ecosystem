import WalletCard from "@/components/wallet/WalletCard";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import BankAccountSettings from "@/components/wallet/BankAccountSettings";
import WalletHeader from "@/components/wallet/WalletHeader";
import WalletRewards from "@/components/wallet/WalletRewards";
import WalletTransactions from "@/components/wallet/WalletTransactions";
import { Skeleton } from "@/components/ui/skeleton";

const Wallet = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="container py-6">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 gap-6">
          {/* Wallet Card Skeleton */}
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

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