import { Link } from "react-router-dom";
import { Search, Building2, Key, Wrench } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const FeatureCards = () => {
  const { t } = useLanguage();

  const cards = [
    {
      icon: Search,
      titleKey: "features.rentals.title",
      descKey: "features.rentals.desc",
      route: "/rentals",
      tagKey: "features.rentals.tag",
      iconBg: "bg-[#E0F2FE]",
      iconColor: "text-primary",
      tagBg: "bg-primary/10 text-primary",
    },
    {
      icon: Building2,
      titleKey: "features.building.title",
      descKey: "features.building.desc",
      route: "/building-management",
      tagKey: "features.building.tag",
      iconBg: "bg-[#EDE9FE]",
      iconColor: "text-indigo",
      tagBg: "bg-indigo/10 text-indigo",
    },
    {
      icon: Key,
      titleKey: "features.property.title",
      descKey: "features.property.desc",
      route: "/management",
      tagKey: "features.property.tag",
      iconBg: "bg-[#FEF3C7]",
      iconColor: "text-accent",
      tagBg: "bg-accent/10 text-accent",
    },
    {
      icon: Wrench,
      titleKey: "features.services.title",
      descKey: "features.services.desc",
      route: "/services",
      tagKey: "features.services.tag",
      iconBg: "bg-[#FCE7F3]",
      iconColor: "text-pink",
      tagBg: "bg-pink/10 text-pink",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
            {t("features.heading")}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("features.subheading")}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {cards.map((c) => (
            <Link
              key={c.route}
              to={c.route}
              className="group bg-card border border-[#F1F5F9] rounded-card p-7 cursor-pointer transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:scale-[1.02]"
              style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${c.iconBg} mb-5`}>
                <c.icon className={`h-7 w-7 ${c.iconColor}`} />
              </div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">{t(c.titleKey)}</h3>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{t(c.descKey)}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${c.tagBg}`}>
                {t(c.tagKey)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
