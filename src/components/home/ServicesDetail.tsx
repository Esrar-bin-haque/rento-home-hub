import { CheckCircle2, MapPin, Phone, ShieldCheck, Zap, CreditCard, Users, Clock, DollarSign, BarChart3, FileText, Bookmark } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ServicesDetail = () => {
  const { t } = useLanguage();

  const rows = [
    {
      titleKey: "service1_title",
      bodyKey: "service1_body",
      highlights: [
        { icon: ShieldCheck, labelKey: "services_verified_listings" },
        { icon: MapPin, labelKey: "services_location_filter" },
        { icon: Phone, labelKey: "services_direct_contact" },
      ],
      img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=350&fit=crop",
    },
    {
      titleKey: "service2_title",
      bodyKey: "service2_body",
      highlights: [
        { icon: BarChart3, labelKey: "services_pie_charts" },
        { icon: FileText, labelKey: "services_expense_logs" },
        { icon: Bookmark, labelKey: "services_fund_tracking" },
      ],
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=350&fit=crop",
    },
    {
      titleKey: "service3_title",
      bodyKey: "service3_body",
      highlights: [
        { icon: CreditCard, labelKey: "services_bkash" },
        { icon: DollarSign, labelKey: "services_nagad" },
        { icon: CheckCircle2, labelKey: "services_auto_records" },
      ],
      img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=350&fit=crop",
    },
    {
      titleKey: "service4_title",
      bodyKey: "service4_body",
      highlights: [
        { icon: Users, labelKey: "services_verified_workers" },
        { icon: Zap, labelKey: "services_fast_booking" },
        { icon: Clock, labelKey: "services_transparent_pricing" },
      ],
      img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&h=350&fit=crop",
    },
  ];

  return (
    <section className="py-20" style={{ background: '#F8F9FA' }}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-14" style={{ color: '#1A1D23' }}>
          {t("services_section_title")}
        </h2>
        <div className="space-y-16 max-w-5xl mx-auto">
          {rows.map((r, i) => (
            <div key={i} className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-10 items-center`}>
              <div className="flex-1">
                <img src={r.img} alt={t(r.titleKey)} className="rounded-card card-shadow w-full h-[260px] object-cover" loading="lazy" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-heading font-bold mb-3" style={{ color: '#1A1D23' }}>{t(r.titleKey)}</h3>
                <p className="leading-relaxed mb-5" style={{ color: '#495057' }}>{t(r.bodyKey)}</p>
                <div className="flex flex-wrap gap-3">
                  {r.highlights.map((h) => (
                    <div key={h.labelKey} className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium" style={{ background: '#EDF2FF', color: '#3B5BDB' }}>
                      <h.icon className="h-3.5 w-3.5" />
                      {t(h.labelKey)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesDetail;
