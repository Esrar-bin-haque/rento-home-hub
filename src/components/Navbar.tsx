import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Building2, Menu, X, ChevronDown, User, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, logout } = useAuth();

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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = user ? user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "";

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

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
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 h-9 px-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">{initials}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#F1F5F9] py-1 z-50">
                  <div className="px-3 py-2 border-b border-[#F1F5F9]">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.phone}</p>
                  </div>
                  <Link to="/building-management" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors">
                    <LayoutDashboard className="h-4 w-4" /> {t("auth.dashboard")}
                  </Link>
                  <Link to="/management" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors">
                    <User className="h-4 w-4" /> {t("auth.myProfile")}
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-secondary transition-colors">
                    <LogOut className="h-4 w-4" /> {t("dash.logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button variant="outline" className="rounded-button text-sm" onClick={() => navigate("/login")}>
                {t("nav.login")}
              </Button>
              <Button className="rounded-button text-sm bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => navigate("/register")}>
                {t("nav.getStarted")}
              </Button>
            </>
          )}
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
            {user ? (
              <Button variant="outline" className="flex-1 rounded-button text-sm" onClick={handleLogout}>{t("dash.logout")}</Button>
            ) : (
              <>
                <Button variant="outline" className="flex-1 rounded-button text-sm" onClick={() => navigate("/login")}>{t("nav.login")}</Button>
                <Button className="flex-1 rounded-button text-sm bg-primary text-primary-foreground" onClick={() => navigate("/register")}>{t("nav.getStarted")}</Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
