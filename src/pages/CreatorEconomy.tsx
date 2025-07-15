import React from "react";
import { Helmet } from "react-helmet-async";
import CreatorEconomyDashboard from "@/components/creator/CreatorEconomyDashboard";

const CreatorEconomy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Creator Economy | Softchat</title>
        <meta
          name="description"
          content="Manage your creator earnings, SoftPoints, and monetization on Softchat"
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CreatorEconomyDashboard />
      </div>
    </div>
  );
};

export default CreatorEconomy;
