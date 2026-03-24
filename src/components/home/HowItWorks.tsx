import { UserPlus, Home, Monitor } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    { icon: UserPlus, titleKey: "how.step1.title", descKey: "how.step1.desc" },
    { icon: Home, titleKey: "how.step2.title", descKey: "how.step2.desc" },
    { icon: Monitor, titleKey: "how.step3.title", descKey: "how.step3.desc" },
  ];

  return (
    <section id="how-it-works" className="py-20" style={{ background: '#F8F9FA' }}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-14" style={{ color: '#1A1D23' }}>
          {t("how.heading")}
        </h2>
        <div className="flex flex-col md:flex-row items-start justify-center gap-8 md:gap-4 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <div key={i} className="flex-1 flex flex-col items-center text-center relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-full border-t-2 border-dashed" style={{ borderColor: '#DEE2E6' }} />
              )}
              <div className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-white text-lg font-bold" style={{ background: '#3B5BDB' }}>
                <s.icon className="h-7 w-7 text-white" />
              </div>
              <span className="text-xs font-medium mb-2" style={{ color: '#3B5BDB' }}>{t("how.step")} {i + 1}</span>
              <h3 className="font-heading font-semibold mb-1" style={{ color: '#1A1D23' }}>{t(s.titleKey)}</h3>
              <p className="text-sm max-w-[220px]" style={{ color: '#495057' }}>{t(s.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
