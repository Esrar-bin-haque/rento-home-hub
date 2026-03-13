import { Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const AboutSection = () => {
  const { t } = useLanguage();

  const bullets = [
    t("about.bullet1"),
    t("about.bullet2"),
    t("about.bullet3"),
  ];

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <span className="text-sm font-medium text-primary tracking-wide uppercase">{t("about.label")}</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mt-2 mb-4">
              {t("about.heading")}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {t("about.body")}
            </p>
            <ul className="space-y-3 mb-6">
              {bullets.map((txt) => (
                <li key={txt} className="flex items-center gap-3 text-sm text-foreground">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  {txt}
                </li>
              ))}
            </ul>
            <a href="#" className="text-sm font-medium text-primary hover:underline">{t("about.learnMore")}</a>
          </div>
          <div className="rounded-card overflow-hidden card-shadow">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop"
              alt="Dhaka cityscape"
              className="w-full h-[340px] object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
