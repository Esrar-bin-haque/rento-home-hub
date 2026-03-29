import { Link } from "react-router-dom";
import { Facebook, Linkedin, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import rentoLogo from "@/assets/rento-logo.png";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer style={{ background: '#1A1D23' }} className="text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={rentoLogo} alt="Rento" className="h-9 w-9 rounded-lg object-cover" />
              <span className="text-xl font-heading font-bold" style={{ color: '#F8F9FA' }}>Rento</span>
            </div>
            <p className="text-sm mb-6" style={{ color: '#ADB5BD' }}>{t("footer_tagline")}</p>
            <div className="flex gap-4">
              {[Facebook, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="transition-colors" style={{ color: '#868E96' }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#FFFFFF'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#868E96'}>
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4" style={{ color: '#F8F9FA' }}>{t("footer_links_title")}</h4>
            <ul className="space-y-2 text-sm" style={{ color: '#ADB5BD' }}>
              {[
                [t("footer_home"), "/"],
                [t("nav_flat_listing"), "/rentals"],
                [t("nav_building_management"), "/building-management"],
                [t("nav_property_management"), "/management"],
                [t("nav_services"), "/services"],
                [t("nav_pricing"), "/#pricing"],
                [t("nav_contact"), "/contact"],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4" style={{ color: '#F8F9FA' }}>{t("footer_contact_title")}</h4>
            <ul className="space-y-2 text-sm" style={{ color: '#ADB5BD' }}>
              <li>contact@rento.com.bd</li>
              <li>Dhaka, Bangladesh</li>
              <li>+880-1700-000000</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 flex flex-col md:flex-row justify-between text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', color: '#868E96' }}>
          <span>© 2026 Rento. {t("footer_rights")}</span>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">{t("footer_privacy")}</a>
            <a href="#" className="hover:text-white transition-colors">{t("footer_terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
