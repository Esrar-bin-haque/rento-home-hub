import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Building2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const navLinks = [
    { label: t("nav.rentals"), to: "/rentals" },
    { label: t("nav.building"), to: "/building-management" },
    { label: t("nav.property"), to: "/management" },
    { label: t("nav.services"), to: "/services" },
    { label: t("nav.pricing"), to: "/#pricing" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-card/80 backdrop-blur-xl card-shadow" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Building2 className="h-7 w-7 text-primary" />
          <span className="text-xl font-heading font-bold text-foreground">Rento</span>
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <LanguageToggle />
          <Button variant="outline" className="rounded-button text-sm">
            {t("nav.login")}
          </Button>
          <Button className="rounded-button text-sm bg-primary text-primary-foreground hover:bg-primary/90">
            {t("nav.getStarted")}
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-card border-t border-border px-4 pb-4 animate-fade-in-up">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="block py-3 text-sm font-medium text-muted-foreground hover:text-foreground border-b border-border last:border-0"
            >
              {l.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 mt-4">
            <LanguageToggle />
          </div>
          <div className="flex gap-3 mt-3">
            <Button variant="outline" className="flex-1 rounded-button text-sm">{t("nav.login")}</Button>
            <Button className="flex-1 rounded-button text-sm bg-primary text-primary-foreground">{t("nav.getStarted")}</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
