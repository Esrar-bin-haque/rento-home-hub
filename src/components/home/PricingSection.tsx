import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const PricingSection = () => {
  const { t } = useLanguage();

  const plans = [
    {
      nameKey: "pricing.plan1.name",
      price: "0",
      subtitleKey: "pricing.plan1.subtitle",
      features: [
        { key: "pricing.f1", ok: true },
        { key: "pricing.f2", ok: true },
        { key: "pricing.f3", ok: true },
        { key: "pricing.f4", ok: true },
        { key: "pricing.f5", ok: false },
        { key: "pricing.f6", ok: false },
        { key: "pricing.f7", ok: false },
      ],
      ctaKey: "pricing.plan1.cta",
      popular: false,
      variant: "outline" as const,
    },
    {
      nameKey: "pricing.plan2.name",
      price: "999",
      subtitleKey: "pricing.plan2.subtitle",
      features: [
        { key: "pricing.f8", ok: true },
        { key: "pricing.f9", ok: true },
        { key: "pricing.f10", ok: true },
        { key: "pricing.f11", ok: true },
        { key: "pricing.f12", ok: true },
        { key: "pricing.f13", ok: true },
        { key: "pricing.f6", ok: false },
        { key: "pricing.f14", ok: false },
      ],
      ctaKey: "pricing.plan2.cta",
      popular: true,
      variant: "default" as const,
    },
    {
      nameKey: "pricing.plan3.name",
      price: "2,499",
      subtitleKey: "pricing.plan3.subtitle",
      features: [
        { key: "pricing.f15", ok: true },
        { key: "pricing.f16", ok: true },
        { key: "pricing.f17", ok: true },
        { key: "pricing.f18", ok: true },
        { key: "pricing.f19", ok: true },
        { key: "pricing.f20", ok: true },
        { key: "pricing.f21", ok: true },
        { key: "pricing.f22", ok: true },
      ],
      ctaKey: "pricing.plan3.cta",
      popular: false,
      variant: "secondary" as const,
    },
  ];

  return (
    <section id="pricing" className="py-20" style={{ background: '#FFFFFF' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
            {t("pricing.heading")}
          </h2>
          <p className="text-muted-foreground">{t("pricing.subheading")}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {plans.map((p) => (
            <div
              key={p.nameKey}
              className={`relative rounded-card bg-card p-6 border ${
                p.popular ? "border-primary card-shadow scale-[1.02]" : "border-border"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                  {t("pricing.mostPopular")}
                </div>
              )}
              <h3 className="font-heading font-semibold text-lg text-foreground">{t(p.nameKey)}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t(p.subtitleKey)}</p>
              <div className="mb-6">
                <span className="text-3xl font-heading font-bold text-foreground">BDT {p.price}</span>
                <span className="text-muted-foreground text-sm"> {t("pricing.perMonth")}</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {p.features.map((f) => (
                  <li key={f.key} className={`flex items-start gap-2 text-sm ${f.ok ? "text-foreground" : "text-muted-foreground/50"}`}>
                    {f.ok ? (
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground/30 flex-shrink-0 mt-0.5" />
                    )}
                    {t(f.key)}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full rounded-button ${
                  p.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
                } ${p.variant === "secondary" ? "bg-foreground text-background hover:bg-foreground/90" : ""}`}
                variant={p.variant === "secondary" ? "default" : p.variant}
              >
                {t(p.ctaKey)}
              </Button>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-8">
          {t("pricing.trial")}
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
