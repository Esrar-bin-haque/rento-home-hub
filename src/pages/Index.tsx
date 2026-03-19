import HeroSection from "@/components/home/HeroSection";
import FeatureCards from "@/components/home/FeatureCards";
import HowItWorks from "@/components/home/HowItWorks";
import AboutSection from "@/components/home/AboutSection";
import ServicesDetail from "@/components/home/ServicesDetail";
import PricingSection from "@/components/home/PricingSection";

const Index = () => (
  <div className="min-h-screen">
    <HeroSection />
    <FeatureCards />
    <HowItWorks />
    <AboutSection />
    <ServicesDetail />
    <PricingSection />
  </div>
);

export default Index;
