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
    },
  ];

  return (
    <section id="pricing" className="py-20" style={{ background: '#F8F9FA' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-sm font-medium mb-2 inline-block" style={{ color: '#3B5BDB' }}>Pricing</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3" style={{ color: '#1A1D23' }}>
            {t("pricing.heading")}
          </h2>
          <p style={{ color: '#868E96' }}>{t("pricing.subheading")}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {plans.map((p) => (
            <div
              key={p.nameKey}
              className="relative rounded-card bg-white p-6"
              style={{
                border: p.popular ? '2px solid #3B5BDB' : '1.5px solid #DEE2E6',
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                transform: p.popular ? 'scale(1.02)' : 'none',
              }}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-medium px-3 py-1 rounded-full" style={{ background: '#3B5BDB', color: '#FFFFFF' }}>
                  {t("pricing.mostPopular")}
                </div>
              )}
              <h3 className="font-heading font-semibold text-lg" style={{ color: '#1A1D23' }}>{t(p.nameKey)}</h3>
              <p className="text-sm mb-4" style={{ color: '#868E96' }}>{t(p.subtitleKey)}</p>
              <div className="mb-6">
                <span className="text-3xl font-heading font-bold" style={{ color: '#1A1D23' }}>BDT {p.price}</span>
                <span className="text-sm" style={{ color: '#868E96' }}> {t("pricing.perMonth")}</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {p.features.map((f) => (
                  <li key={f.key} className="flex items-start gap-2 text-sm" style={{ color: f.ok ? '#1A1D23' : '#ADB5BD', textDecoration: f.ok ? 'none' : 'line-through' }}>
                    {f.ok ? (
                      <Check className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: '#2F9E44' }} />
                    ) : (
                      <X className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: '#ADB5BD' }} />
                    )}
                    {t(f.key)}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full rounded-lg"
                style={p.popular ? { background: '#3B5BDB', color: '#FFFFFF' } : { background: 'transparent', border: '1.5px solid #3B5BDB', color: '#3B5BDB' }}
              >
                {t(p.ctaKey)}
              </Button>
            </div>
          ))}
        </div>
        <p className="text-center text-sm mt-8" style={{ color: '#868E96' }}>
          {t("pricing.trial")}
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
