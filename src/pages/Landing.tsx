// src/pages/LandingPage.tsx
import React from "react";
import HeroSection from "@/home/HeroSection";
import ProblemSolutionSection from "@/home/ProblemSolutionSection";
import FeaturesSection from "@/home/FeaturesSection";
import AdvancedFeaturesSection from "@/home/AdvancedFeaturesSection";
import ScreenshotCarousel from "@/home/ScreenshotCarousel";
import WhyEloitySection from "@/home/WhyEloitySection";
import NewsletterSection from "@/home/NewsletterSection";
import Layout from "@/home/Layout";
import ReactTest from "@/components/debug/ReactTest";

const LandingPage = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <ReactTest />
      </div>
      <HeroSection />
      <ProblemSolutionSection />
      <FeaturesSection />
      <AdvancedFeaturesSection />
      <ScreenshotCarousel />
      <WhyEloitySection />
      <NewsletterSection />
    </Layout>
  );
};

export default LandingPage;
