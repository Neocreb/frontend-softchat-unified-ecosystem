
import RewardsCard from "./RewardsCard";
import ReferralCard from "./ReferralCard";

const WalletRewards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <RewardsCard />
      <ReferralCard />
    </div>
  );
};

export default WalletRewards;
