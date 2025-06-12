// src/pages/LandingPage.tsx
import HeroSection from "@/home/HeroSection";
import ProblemSolutionSection from "@/home/ProblemSolutionSection";
import FeaturesSection from "@/home/FeaturesSection";
import AdvancedFeaturesSection from "@/home/AdvancedFeaturesSection";
import ScreenshotCarousel from "@/home/ScreenshotCarousel";
import WhySoftchatSection from "@/home/WhySoftchatSection";
import NewsletterSection from "@/home/NewsletterSection";
import Layout from "@/home/Layout";

const LandingPage = () => {
  return (
    <Layout>
      <HeroSection />
      <ProblemSolutionSection />
      <FeaturesSection />
      <AdvancedFeaturesSection />
      <ScreenshotCarousel />
      <WhySoftchatSection />
      <NewsletterSection />
    </Layout>
  );
};

export default LandingPage;
