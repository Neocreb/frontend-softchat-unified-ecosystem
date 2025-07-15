import CreatorEconomyCard from "./CreatorEconomyCard";
import ReferralCard from "./ReferralCard";

const WalletCreatorEconomy = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <CreatorEconomyCard />
      <ReferralCard />
    </div>
  );
};

export default WalletCreatorEconomy;
