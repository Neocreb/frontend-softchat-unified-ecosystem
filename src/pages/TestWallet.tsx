import React from "react";
import CryptoWalletBalanceCard from "@/components/crypto/CryptoWalletBalanceCard";

const TestWallet: React.FC = () => {
  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Test Wallet</h1>
      
      <CryptoWalletBalanceCard
        totalBalance={150753.62}
        totalBalance24hChange={4523.18}
        totalBalance24hPercent={3.09}
        primaryAsset={{
          symbol: "BTC",
          balance: 2.9921,
          value: 125670.45
        }}
        onDeposit={() => console.log("Deposit clicked")}
        onWithdraw={() => console.log("Withdraw clicked")}
      />
      
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          This is a test page to verify the CryptoWalletBalanceCard component.
        </p>
        <p className="text-sm text-muted-foreground">
          Access this page at: <code className="bg-gray-100 px-2 py-1 rounded">/test-wallet</code>
        </p>
      </div>
    </div>
  );
};

export default TestWallet;
