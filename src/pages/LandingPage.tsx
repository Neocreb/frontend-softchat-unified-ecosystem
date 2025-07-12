import React from "react";
import Layout from "@/home/Layout";
import HeroSection from "@/home/HeroSection";
import FeaturesSection from "@/home/FeaturesSection";
import AdvancedFeaturesSection from "@/home/AdvancedFeaturesSection";
import ProblemSolutionSection from "@/home/ProblemSolutionSection";
import WhySoftchatSection from "@/home/WhySoftchatSection";
import ScreenshotCarousel from "@/home/ScreenshotCarousel";
import NewsletterSection from "@/home/NewsletterSection";
import MarketplaceAnnouncement from "@/components/marketplace/MarketplaceAnnouncement";

const LandingPage = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <AdvancedFeaturesSection />
      <ProblemSolutionSection />
      <WhySoftchatSection />
      <ScreenshotCarousel />
      <NewsletterSection />
    </Layout>
  );
};

export default LandingPage;
