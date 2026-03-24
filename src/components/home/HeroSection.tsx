import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const { t, lang } = useLanguage();

  const stats = [
    { value: t("hero.statValue1"), label: t("hero.stat1") },
    { value: t("hero.statValue2"), label: t("hero.stat2") },
    { value: t("hero.statValue3"), label: t("hero.stat3") },
  ];

  return (
    <section className="relative min-h-screen flex items-center" style={{ background: '#FFFFFF' }}>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6">
              <span style={{ color: '#1A1D23' }}>{t("hero.title1")}</span>
              <br />
              <span style={{ color: '#3B5BDB' }}>{t("hero.title2")}</span>
            </h1>
            <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: '#495057' }}>
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button asChild className="rounded-lg px-6 py-3 text-base shadow-sm" style={{ background: '#3B5BDB', color: '#FFFFFF' }}>
                <Link to="/rentals"><Search className="mr-2 h-4 w-4" />{t("hero.exploreRentals")}</Link>
              </Button>
              <Button variant="outline" asChild className="rounded-lg px-6 py-3 text-base" style={{ borderColor: '#DEE2E6', color: '#495057' }}>
                <a href="#how-it-works">{t("hero.howItWorks")}</a>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {stats.map((s) => (
                <div key={s.label} className="text-center px-4 py-2 rounded-full" style={{ background: '#F1F3F5', border: '1px solid #DEE2E6' }}>
                  <span className="text-xl md:text-2xl font-heading font-bold" style={{ color: '#1A1D23' }}>
                    {s.value}
                  </span>
                  <p className="text-xs mt-0.5" style={{ color: '#868E96' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
