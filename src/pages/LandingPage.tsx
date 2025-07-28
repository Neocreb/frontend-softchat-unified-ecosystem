import React from "react";
import Layout from "@/home/Layout";
import HeroSection from "@/home/HeroSection";
import FeaturesSection from "@/home/FeaturesSection";
import AdvancedFeaturesSection from "@/home/AdvancedFeaturesSection";
import ProblemSolutionSection from "@/home/ProblemSolutionSection";
import WhySoftchatSection from "@/home/WhySoftchatSection";
import ScreenshotCarousel from "@/home/ScreenshotCarousel";
import NewsletterSection from "@/home/NewsletterSection";
import LiveStreamTest from "../components/debug/LiveStreamTest";

const LandingPage = () => {
  return (
    <Layout>
      <HeroSection />

      {/* Temporary Debug Component */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Live Stream Debug (Temporary)</h2>
          <LiveStreamTest />
        </div>
      </section>

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
