import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import rentoLogo from "@/assets/rento-logo.png";

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
    { label: t("nav_flat_listing"), to: "/rentals" },
    { label: t("nav_building_management"), to: "/building-management" },
    { label: t("nav_property_management"), to: "/management" },
    { label: t("nav_services"), to: "/services" },
    { label: t("nav_pricing"), to: "/#pricing" },
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

  const isActive = (to: string) => location.pathname === to;

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] h-[60px] bg-white border-b" style={{ borderColor: '#DEE2E6' }}>
      <div className="container mx-auto flex items-center justify-between h-full px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={rentoLogo} alt="Rento" className="h-9 w-9 rounded-lg object-cover" />
          <span className="text-xl font-heading font-bold" style={{ color: '#1A1D23' }}>Rento</span>
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm transition-colors"
              style={{ color: isActive(l.to) ? '#3B5BDB' : '#495057', fontWeight: isActive(l.to) ? 600 : 400 }}
              onMouseEnter={(e) => { if (!isActive(l.to)) (e.target as HTMLElement).style.color = '#3B5BDB'; }}
              onMouseLeave={(e) => { if (!isActive(l.to)) (e.target as HTMLElement).style.color = '#495057'; }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="text-sm font-medium px-4 py-1.5 rounded-full transition-all"
            style={{
              border: '1.5px solid #3B5BDB',
              color: isActive('/contact') ? '#FFFFFF' : '#3B5BDB',
              background: isActive('/contact') ? '#3B5BDB' : 'transparent',
            }}
            onMouseEnter={(e) => { (e.currentTarget).style.background = '#3B5BDB'; (e.currentTarget).style.color = '#FFFFFF'; }}
            onMouseLeave={(e) => { if (!isActive('/contact')) { (e.currentTarget).style.background = 'transparent'; (e.currentTarget).style.color = '#3B5BDB'; }}}
          >
            {t("nav_contact")}
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <LanguageToggle />
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 h-9 px-3 rounded-full text-sm font-medium hover:opacity-90 transition-colors"
                style={{ background: '#3B5BDB', color: '#FFFFFF' }}
              >
                <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">{initials}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border py-1 z-50" style={{ borderColor: '#DEE2E6' }}>
                  <div className="px-3 py-2 border-b" style={{ borderColor: '#DEE2E6' }}>
                    <p className="text-sm font-medium" style={{ color: '#1A1D23' }}>{user.name}</p>
                    <p className="text-xs" style={{ color: '#868E96' }}>{user.phone}</p>
                  </div>
                  <Link to="/building-management" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors" style={{ color: '#1A1D23' }}>
                    <LayoutDashboard className="h-4 w-4" /> {t("auth_dashboard")}
                  </Link>
                  <Link to="/management" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors" style={{ color: '#1A1D23' }}>
                    <User className="h-4 w-4" /> {t("auth_my_profile")}
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors" style={{ color: '#E03131' }}>
                    <LogOut className="h-4 w-4" /> {t("sidebar_logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button variant="outline" className="rounded-lg text-sm" style={{ borderColor: '#DEE2E6', color: '#495057' }} onClick={() => navigate("/login")}>
                {t("nav_login")}
              </Button>
              <Button className="rounded-lg text-sm shadow-sm" style={{ background: '#3B5BDB', color: '#FFFFFF' }} onClick={() => navigate("/register")}>
                {t("nav_get_started")}
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
        <div className="lg:hidden bg-white border-t px-4 pb-4 animate-fade-in-up" style={{ borderColor: '#DEE2E6' }}>
          <div className="flex items-center gap-2 py-3 border-b mb-2" style={{ borderColor: '#DEE2E6' }}>
            <img src={rentoLogo} alt="Rento" className="h-8 w-8 rounded-lg object-cover" />
            <span className="text-lg font-heading font-bold" style={{ color: '#1A1D23' }}>Rento</span>
          </div>
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="block py-3 text-sm font-medium border-b last:border-0"
              style={{ color: isActive(l.to) ? '#3B5BDB' : '#495057', borderColor: '#F1F3F5' }}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 mt-4">
            <LanguageToggle />
          </div>
          <div className="flex flex-col gap-3 mt-3">
            <Link
              to="/contact"
              className="w-full text-center text-sm font-medium py-2 rounded-full transition-colors"
              style={{ border: '1.5px solid #3B5BDB', color: '#3B5BDB' }}
            >
              {t("nav_contact")}
            </Link>
            {user ? (
              <Button variant="outline" className="w-full rounded-lg text-sm" onClick={handleLogout}>{t("sidebar_logout")}</Button>
            ) : (
              <>
                <Button variant="outline" className="w-full rounded-lg text-sm" onClick={() => navigate("/login")}>{t("nav_login")}</Button>
                <Button className="w-full rounded-lg text-sm" style={{ background: '#3B5BDB', color: '#FFFFFF' }} onClick={() => navigate("/register")}>{t("nav_get_started")}</Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
