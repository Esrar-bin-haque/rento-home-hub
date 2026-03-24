import { Link } from "react-router-dom";
import { Search, Building2, Key, Wrench } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const cards = [
  {
    icon: Search,
    titleKey: "features.rentals.title",
    descKey: "features.rentals.desc",
    route: "/rentals",
    tagKey: "features.rentals.tag",
    gradient: "linear-gradient(145deg, #3B5BDB 0%, #1E3799 100%)",
  },
  {
    icon: Building2,
    titleKey: "features.building.title",
    descKey: "features.building.desc",
    route: "/building-management",
    tagKey: "features.building.tag",
    gradient: "linear-gradient(145deg, #1098AD 0%, #0B7285 100%)",
  },
  {
    icon: Key,
    titleKey: "features.property.title",
    descKey: "features.property.desc",
    route: "/management",
    tagKey: "features.property.tag",
    gradient: "linear-gradient(145deg, #F76707 0%, #D9480F 100%)",
  },
  {
    icon: Wrench,
    titleKey: "features.services.title",
    descKey: "features.services.desc",
    route: "/services",
    tagKey: "features.services.tag",
    gradient: "linear-gradient(145deg, #7048E8 0%, #4C2CB3 100%)",
  },
];

const FeatureCards = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20" style={{ background: '#F1F3F5' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3" style={{ color: '#1A1D23' }}>
            {t("features.heading")}
          </h2>
          <p style={{ color: '#868E96' }} className="max-w-xl mx-auto">
            {t("features.subheading")}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {cards.map((c) => (
            <Link
              key={c.route}
              to={c.route}
              className="group relative overflow-hidden rounded-[20px] p-6 min-h-[220px] flex flex-col justify-between cursor-pointer"
              style={{
                background: c.gradient,
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.15)";
              }}
            >
              <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                }}
              />
              <div
                className="absolute pointer-events-none rounded-full"
                style={{ width: 150, height: 150, bottom: -30, right: -30, background: "rgba(255,255,255,0.07)" }}
              />
              <div className="relative z-10 flex items-start justify-between">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
                  style={{ background: "rgba(255,255,255,0.18)", boxShadow: "0 0 0 8px rgba(255,255,255,0.08)" }}
                >
                  <c.icon className="h-6 w-6 text-white" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium text-white" style={{ background: "rgba(255,255,255,0.20)" }}>
                  {t(c.tagKey)}
                </span>
              </div>
              <div className="relative z-10 mt-auto">
                <h3 className="text-xl font-heading font-bold text-white mb-1">{t(c.titleKey)}</h3>
                <p className="text-[13px] text-white/85 leading-relaxed line-clamp-2 mb-2">{t(c.descKey)}</p>
                <span className="text-xs text-white/70 font-medium group-hover:text-white/100 transition-opacity">Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
