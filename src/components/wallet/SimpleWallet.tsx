import React, { useState } from "react";
import CryptoWalletBalanceCard from "@/components/crypto/CryptoWalletBalanceCard";
import WithdrawModal from "./WithdrawModal";
import DepositModal from "./DepositModal";

const SimpleWallet: React.FC = () => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

  // Mock wallet data that matches the service
  const mockWalletBalance = {
    total: 150753.62,
    crypto: 125670.45,
    ecommerce: 8947.32,
    rewards: 3245.18,
    freelance: 12890.67,
  };

  // Calculate metrics
  const totalBalance = mockWalletBalance.total;
  const yesterdayBalance = totalBalance * 0.97;
  const change24h = totalBalance - yesterdayBalance;
  const changePercent = (change24h / yesterdayBalance) * 100;
  const cryptoBalance = mockWalletBalance.crypto;
  const btcAmount = cryptoBalance / 42000; // Approximate BTC price

  const mockRefreshWallet = async () => {
    console.log("Refresh wallet called");
  };

  return (
    <div className="container mx-auto py-8 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl font-bold text-foreground">Wallet</h1>
      </div>

      {/* Enhanced Professional Balance Card */}
      <CryptoWalletBalanceCard
        totalBalance={totalBalance}
        totalBalance24hChange={change24h}
        totalBalance24hPercent={changePercent}
        primaryAsset={{
          symbol: "BTC",
          balance: btcAmount,
          value: cryptoBalance,
        }}
        onDeposit={() => setShowDepositModal(true)}
        onWithdraw={() => setShowWithdrawModal(true)}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {[
          { name: "E-commerce", value: mockWalletBalance.ecommerce },
          { name: "Crypto", value: mockWalletBalance.crypto },
          { name: "Rewards", value: mockWalletBalance.rewards },
          { name: "Freelance", value: mockWalletBalance.freelance },
        ].map((source) => (
          <div key={source.name} className="text-center p-4 bg-card rounded-lg border">
            <div className="text-lg md:text-xl font-semibold">
              ${source.value.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">{source.name}</div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        walletBalance={mockWalletBalance}
        onSuccess={mockRefreshWallet}
      />

      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onSuccess={mockRefreshWallet}
      />
    </div>
  );
};

export default SimpleWallet;
