import { Link } from "react-router-dom";
import { Building2, TrendingUp, Search } from "lucide-react";
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
    <section className="relative min-h-screen mesh-gradient flex items-center pt-16">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6">
              <span className="text-foreground">{t("hero.title1")}</span>
              <br />
              <span className="text-primary">{t("hero.title2")}</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button asChild className="rounded-button px-6 py-3 text-base bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/rentals"><Search className="mr-2 h-4 w-4" />{t("hero.exploreRentals")}</Link>
              </Button>
              <Button variant="outline" asChild className="rounded-button px-6 py-3 text-base">
                <a href="#how-it-works">{t("hero.howItWorks")}</a>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <span className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                    {s.value}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
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
