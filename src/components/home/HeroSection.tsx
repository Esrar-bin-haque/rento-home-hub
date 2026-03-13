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
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight mb-6">
              <span className="relative inline-block">
                {t("hero.smart")}
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 120 8" fill="none">
                  <path d="M2 6C20 2 40 2 60 4C80 6 100 3 118 5" stroke="hsl(175,85%,32%)" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>{" "}
              {t("hero.title1")}<br />
              {t("hero.title2")}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Button asChild className="rounded-button px-6 py-3 text-base bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/rentals"><Search className="mr-2 h-4 w-4" />{t("hero.exploreRentals")}</Link>
              </Button>
              <Button variant="outline" asChild className="rounded-button px-6 py-3 text-base">
                <a href="#how-it-works">{t("hero.howItWorks")}</a>
              </Button>
            </div>
            <div className="flex flex-wrap gap-8">
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

          {/* Right — dashboard mockup */}
          <div className="hidden lg:block animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="bg-card rounded-card card-shadow p-6 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-5 w-5 text-primary" />
                <span className="font-heading font-semibold text-sm">{t("hero.buildingOverview")}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: t("hero.totalUnits"), value: "24", color: "bg-indigo/10 text-indigo" },
                  { label: t("hero.rentCollected"), value: "৳4,80,000", color: "bg-primary/10 text-primary" },
                  { label: t("hero.overdue"), value: "3", color: "bg-destructive/10 text-destructive" },
                  { label: t("hero.buildingFund"), value: "৳1,85,000", color: "bg-accent/10 text-accent" },
                ].map((s) => (
                  <div key={s.label} className={`rounded-lg p-3 ${s.color}`}>
                    <p className="text-xs opacity-70">{s.label}</p>
                    <p className="text-lg font-bold">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left p-2 font-medium text-muted-foreground">{t("hero.flat")}</th>
                      <th className="text-left p-2 font-medium text-muted-foreground">{t("hero.tenant")}</th>
                      <th className="text-left p-2 font-medium text-muted-foreground">{t("hero.status")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { flat: "A1", tenant: "Rahim U.", status: "paid" },
                      { flat: "B1", tenant: "Kamal H.", status: "overdue" },
                      { flat: "C2", tenant: "Fatema B.", status: "paid" },
                    ].map((r) => (
                      <tr key={r.flat} className="border-t border-border">
                        <td className="p-2 font-medium">{r.flat}</td>
                        <td className="p-2 text-muted-foreground">{r.tenant}</td>
                        <td className="p-2">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              r.status === "paid"
                                ? "bg-primary/10 text-primary"
                                : "bg-destructive/10 text-destructive"
                            }`}
                          >
                            {r.status === "paid" ? t("hero.paid") : t("hero.overdueStat")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-1 mt-3 text-xs text-primary font-medium">
                <TrendingUp className="h-3 w-3" />
                <span>{t("hero.collectionVs")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
