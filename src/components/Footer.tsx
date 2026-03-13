import { Link } from "react-router-dom";
import { Building2, Facebook, Linkedin, Instagram } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-secondary py-16">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Col 1 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-7 w-7 text-primary" />
            <span className="text-xl font-heading font-bold text-secondary">Rento</span>
          </div>
          <p className="text-sm text-secondary/60 mb-6">Bangladesh's Digital Property Ecosystem</p>
          <div className="flex gap-4">
            {[Facebook, Linkedin, Instagram].map((Icon, i) => (
              <a key={i} href="#" className="text-secondary/50 hover:text-primary transition-colors">
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
        {/* Col 2 */}
        <div>
          <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-secondary/60">
            {[
              ["Home", "/"],
              ["Rentals", "/rentals"],
              ["Building Management", "/building-management"],
              ["Property Management", "/management"],
              ["Home Services", "/services"],
              ["Pricing", "/#pricing"],
            ].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="hover:text-primary transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Col 3 */}
        <div>
          <h4 className="font-heading font-semibold mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-secondary/60">
            <li>contact@rento.com.bd</li>
            <li>Dhaka, Bangladesh</li>
            <li>+880-1700-000000</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-secondary/10 mt-12 pt-8 flex flex-col md:flex-row justify-between text-xs text-secondary/40">
        <span>© 2026 Rento. All rights reserved.</span>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
