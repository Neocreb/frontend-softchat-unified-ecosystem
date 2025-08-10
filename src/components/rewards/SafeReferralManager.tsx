import React from "react";
import SafeReferralComponent from "@/components/rewards/SafeReferralComponent";

const SafeReferralManager: React.FC = () => {
  // Use the safe fallback component directly to avoid errors
  return <SafeReferralComponent />;
};

export default SafeReferralManager;
