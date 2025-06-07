
import { Card } from "@/components/ui/card";
import WalletCard from "@/components/wallet/WalletCard";
import CryptoWidget from "@/components/wallet/CryptoWidget";

const WalletOverview = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <WalletCard />
      </div>
      <div>
        <CryptoWidget />
      </div>
    </div>
  );
};

export default WalletOverview;
