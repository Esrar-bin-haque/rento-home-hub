import { Link } from "react-router-dom";
import { Search, Building2, Key, Wrench, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const cards = [
  {
    icon: Search,
    titleKey: "card1_title",
    descKey: "card1_desc",
    route: "/rentals",
    tagKey: "card1_tag",
    tagEmoji: "🏠",
    statKeys: ["card1_stat1", "card1_stat2", "card1_stat3"],
    gradient: "linear-gradient(140deg, #1E3A5F 0%, #2D5986 50%, #1A3050 100%)",
    circleColor: "rgba(45, 89, 134, 0.4)",
    glowColor: "rgba(100,160,255,0.12)",
  },
  {
    icon: Building2,
    titleKey: "card2_title",
    descKey: "card2_desc",
    route: "/building-management",
    tagKey: "card2_tag",
    tagEmoji: "🏢",
    statKeys: ["card2_stat1", "card2_stat2", "card2_stat3"],
    gradient: "linear-gradient(140deg, #0F3D3E 0%, #1A5C5E 50%, #0A2C2D 100%)",
    circleColor: "rgba(26, 92, 94, 0.4)",
    glowColor: "rgba(50,200,180,0.08)",
  },
  {
    icon: Key,
    titleKey: "card3_title",
    descKey: "card3_desc",
    route: "/management",
    tagKey: "card3_tag",
    tagEmoji: "🔑",
    statKeys: ["card3_stat1", "card3_stat2", "card3_stat3"],
    gradient: "linear-gradient(140deg, #2D1B00 0%, #5C3800 50%, #3D2500 100%)",
    circleColor: "rgba(92, 56, 0, 0.4)",
    glowColor: "rgba(255,160,50,0.08)",
  },
  {
    icon: Wrench,
    titleKey: "card4_title",
    descKey: "card4_desc",
    route: "/services",
    tagKey: "card4_tag",
    tagEmoji: "🔧",
    statKeys: ["card4_stat1", "card4_stat2", "card4_stat3"],
    gradient: "linear-gradient(140deg, #1A0A3D 0%, #3D1A7A 50%, #150830 100%)",
    circleColor: "rgba(61, 26, 122, 0.4)",
    glowColor: "rgba(140,80,255,0.08)",
  },
];

const FeatureCards = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20" style={{ background: '#F1F3F5' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-[32px] font-heading font-bold mb-3" style={{ color: '#1A1D23' }}>
            {t("cards_section_title")}
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#868E96' }}>
            {t("cards_section_sub")}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5 max-w-[1100px] mx-auto">
          {cards.map((c) => (
            <Link
              key={c.route}
              to={c.route}
              className="group relative overflow-hidden rounded-[20px] p-6 flex flex-col cursor-pointer min-h-[280px] md:min-h-[280px]"
              style={{
                background: c.gradient,
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.28)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.18)";
              }}
            >
              <div className="absolute pointer-events-none rounded-full" style={{ width: 300, height: 300, bottom: -60, right: -60, background: c.circleColor }} />
              <div className="absolute pointer-events-none rounded-full" style={{ width: 180, height: 180, top: -40, right: -40, background: "rgba(255,255,255,0.04)" }} />
              <div className="absolute pointer-events-none" style={{ width: 250, height: 250, top: -60, left: -60, background: `radial-gradient(circle, ${c.glowColor} 0%, transparent 70%)`, borderRadius: "50%" }} />
              <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")` }} />

              <div className="relative z-10 flex flex-col flex-1">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}>
                    <c.icon className="h-[22px] w-[22px] text-white" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-medium text-white" style={{ background: "rgba(255,255,255,0.18)" }}>
                    {c.tagEmoji} {t(c.tagKey)}
                  </span>
                </div>

                <h3 className="text-[22px] md:text-[22px] font-heading font-bold text-white mt-5 leading-tight">
                  {t(c.titleKey)}
                </h3>
                <p className="text-[13.5px] leading-relaxed mt-2 line-clamp-2" style={{ color: "rgba(255,255,255,0.82)" }}>
                  {t(c.descKey)}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {c.statKeys.map((sk) => (
                    <span key={sk} className="px-2.5 py-1 rounded-full text-[11px] text-white font-medium whitespace-nowrap" style={{ background: "rgba(255,255,255,0.12)" }}>
                      {t(sk)}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-auto pt-5">
                  <span className="text-[13px] font-medium text-white/85 group-hover:text-white transition-colors">
                    {t("card_explore")} →
                  </span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-white/25 transition-colors" style={{ background: "rgba(255,255,255,0.15)" }}>
                    <ArrowRight className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
