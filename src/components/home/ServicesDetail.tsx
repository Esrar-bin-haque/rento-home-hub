import { CheckCircle2, MapPin, Phone, ShieldCheck, Zap, CreditCard, Users, Clock, DollarSign, BarChart3, FileText, Bookmark } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ServicesDetail = () => {
  const { t } = useLanguage();

  const rows = [
    {
      titleKey: "servicesDetail.row1.title",
      bodyKey: "servicesDetail.row1.body",
      highlights: [
        { icon: ShieldCheck, labelKey: "servicesDetail.verifiedListings" },
        { icon: MapPin, labelKey: "servicesDetail.locationFilter" },
        { icon: Phone, labelKey: "servicesDetail.directContact" },
      ],
      img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=350&fit=crop",
    },
    {
      titleKey: "servicesDetail.row2.title",
      bodyKey: "servicesDetail.row2.body",
      highlights: [
        { icon: BarChart3, labelKey: "servicesDetail.pieCharts" },
        { icon: FileText, labelKey: "servicesDetail.expenseLogs" },
        { icon: Bookmark, labelKey: "servicesDetail.fundTracking" },
      ],
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=350&fit=crop",
    },
    {
      titleKey: "servicesDetail.row3.title",
      bodyKey: "servicesDetail.row3.body",
      highlights: [
        { icon: CreditCard, labelKey: "servicesDetail.bKash" },
        { icon: DollarSign, labelKey: "servicesDetail.nagad" },
        { icon: CheckCircle2, labelKey: "servicesDetail.autoRecords" },
      ],
      img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=350&fit=crop",
    },
    {
      titleKey: "servicesDetail.row4.title",
      bodyKey: "servicesDetail.row4.body",
      highlights: [
        { icon: Users, labelKey: "servicesDetail.verifiedWorkers" },
        { icon: Zap, labelKey: "servicesDetail.fastBooking" },
        { icon: Clock, labelKey: "servicesDetail.transparentPricing" },
      ],
      img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&h=350&fit=crop",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground text-center mb-14">
          {t("servicesDetail.heading")}
        </h2>
        <div className="space-y-16 max-w-5xl mx-auto">
          {rows.map((r, i) => (
            <div
              key={i}
              className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-10 items-center`}
            >
              <div className="flex-1">
                <img
                  src={r.img}
                  alt={t(r.titleKey)}
                  className="rounded-card card-shadow w-full h-[260px] object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-heading font-bold text-foreground mb-3">{t(r.titleKey)}</h3>
                <p className="text-muted-foreground leading-relaxed mb-5">{t(r.bodyKey)}</p>
                <div className="flex flex-wrap gap-3">
                  {r.highlights.map((h) => (
                    <div key={h.labelKey} className="flex items-center gap-2 bg-primary/5 text-primary rounded-full px-3 py-1.5 text-xs font-medium">
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
