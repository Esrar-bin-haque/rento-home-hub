import { Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const AboutSection = () => {
  const { t } = useLanguage();

  const bullets = [
    t("about_check1"),
    t("about_check2"),
    t("about_check3"),
  ];

  return (
    <section className="py-20" style={{ background: '#FFFFFF' }}>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <span className="inline-block text-sm font-medium tracking-wide uppercase px-3 py-1 rounded-full" style={{ background: '#EDF2FF', color: '#3B5BDB' }}>{t("about_label")}</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mt-3 mb-4" style={{ color: '#1A1D23' }}>
              {t("about_title")}
            </h2>
            <p className="leading-relaxed mb-6" style={{ color: '#495057' }}>
              {t("about_body")}
            </p>
            <ul className="space-y-3 mb-6">
              {bullets.map((txt) => (
                <li key={txt} className="flex items-center gap-3 text-sm" style={{ color: '#1A1D23' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#EBFBEE' }}>
                    <Check className="h-3 w-3" style={{ color: '#2F9E44' }} />
                  </div>
                  {txt}
                </li>
              ))}
            </ul>
            <a href="#" className="text-sm font-medium hover:underline" style={{ color: '#3B5BDB' }}>{t("about_link")}</a>
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
