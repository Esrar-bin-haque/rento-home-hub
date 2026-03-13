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
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground text-center mb-14">
          {t("how.heading")}
        </h2>
        <div className="flex flex-col md:flex-row items-start justify-center gap-8 md:gap-4 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <div key={i} className="flex-1 flex flex-col items-center text-center relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-full border-t-2 border-dashed border-border" />
              )}
              <div className="relative z-10 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <s.icon className="h-7 w-7 text-primary" />
              </div>
              <span className="text-xs font-medium text-primary mb-2">{t("how.step")} {i + 1}</span>
              <h3 className="font-heading font-semibold text-foreground mb-1">{t(s.titleKey)}</h3>
              <p className="text-sm text-muted-foreground max-w-[220px]">{t(s.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
