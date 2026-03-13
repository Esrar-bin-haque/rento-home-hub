import { Link } from "react-router-dom";
import { Building2, Facebook, Linkedin, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-foreground text-secondary py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-7 w-7 text-primary" />
              <span className="text-xl font-heading font-bold text-secondary">Rento</span>
            </div>
            <p className="text-sm text-secondary/60 mb-6">{t("footer.tagline")}</p>
            <div className="flex gap-4">
              {[Facebook, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="text-secondary/50 hover:text-primary transition-colors">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2 text-sm text-secondary/60">
              {[
                [t("footer.home"), "/"],
                [t("nav.rentals"), "/rentals"],
                [t("nav.building"), "/building-management"],
                [t("nav.property"), "/management"],
                [t("footer.homeServices"), "/services"],
                [t("nav.pricing"), "/#pricing"],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-primary transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">{t("footer.contact")}</h4>
            <ul className="space-y-2 text-sm text-secondary/60">
              <li>contact@rento.com.bd</li>
              <li>Dhaka, Bangladesh</li>
              <li>+880-1700-000000</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-secondary/10 mt-12 pt-8 flex flex-col md:flex-row justify-between text-xs text-secondary/40">
          <span>{t("footer.rights")}</span>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">{t("footer.privacy")}</a>
            <a href="#" className="hover:text-primary transition-colors">{t("footer.terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
