import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeatureCards from "@/components/home/FeatureCards";
import HowItWorks from "@/components/home/HowItWorks";
import AboutSection from "@/components/home/AboutSection";
import ServicesDetail from "@/components/home/ServicesDetail";
import PricingSection from "@/components/home/PricingSection";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <FeatureCards />
    <HowItWorks />
    <AboutSection />
    <ServicesDetail />
    <PricingSection />
    <Footer />
  </div>
);

export default Index;
