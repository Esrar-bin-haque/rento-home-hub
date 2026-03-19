import { Link } from "react-router-dom";
import { Facebook, Linkedin, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import rentoLogo from "@/assets/rento-logo.png";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer style={{ background: '#1C0F0F' }} className="text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={rentoLogo} alt="Rento" className="h-9 w-9 rounded-lg object-cover" />
              <span className="text-xl font-heading font-bold text-white">Rento</span>
            </div>
            <p className="text-sm mb-6" style={{ color: '#94A3B8' }}>{t("footer.tagline")}</p>
            <div className="flex gap-4">
              {[Facebook, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="transition-colors" style={{ color: '#64748B' }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#FFFFFF'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#64748B'}>
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4 text-white">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2 text-sm" style={{ color: '#64748B' }}>
              {[
                [t("footer.home"), "/"],
                [t("nav.rentals"), "/rentals"],
                [t("nav.building"), "/building-management"],
                [t("nav.property"), "/management"],
                [t("nav.services"), "/services"],
                [t("nav.pricing"), "/#pricing"],
                [t("nav.contact"), "/contact"],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4 text-white">{t("footer.contact")}</h4>
            <ul className="space-y-2 text-sm" style={{ color: '#94A3B8' }}>
              <li>contact@rento.com.bd</li>
              <li>Dhaka, Bangladesh</li>
              <li>+880-1700-000000</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 flex flex-col md:flex-row justify-between text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', color: '#64748B' }}>
          <span>{t("footer.rights")}</span>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">{t("footer.privacy")}</a>
            <a href="#" className="hover:text-white transition-colors">{t("footer.terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
