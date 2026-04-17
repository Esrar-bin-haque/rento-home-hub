import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import rentoLogo from "@/assets/rento-logo.png";

const Login = () => {
  const [tab, setTab] = useState<"owner" | "tenant">("owner");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^01[3-9]\d{8}$/.test(phone)) { setError(t("login_invalid_phone")); return; }
    if (!password) { setError(t("login_password_required")); return; }
    setIsLoading(true);
    try {
      await login(phone, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || t("login_failed") || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F8F9FA' }}>
      <div className="w-full max-w-[440px] bg-white rounded-2xl p-8" style={{ border: '1px solid #DEE2E6', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <div className="flex flex-col items-center mb-6">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <img src={rentoLogo} alt="Rento" className="h-10 w-10 rounded-lg object-cover" />
            <span className="text-2xl font-heading font-bold" style={{ color: '#1A1D23' }}>Rento</span>
          </Link>
          <h1 className="text-xl font-heading font-bold" style={{ color: '#1A1D23' }}>{t("login_welcome")}</h1>
          <p className="text-sm" style={{ color: '#868E96' }}>{t("login_sub")}</p>
        </div>

        <div className="flex rounded-lg p-1 mb-6" style={{ background: '#F1F3F5' }}>
          {(["owner", "tenant"] as const).map((r) => (
            <button key={r} onClick={() => setTab(r)}
              className="flex-1 text-sm font-medium py-2 rounded-md transition-colors"
              style={{
                background: tab === r ? '#3B5BDB' : 'transparent',
                color: tab === r ? '#FFFFFF' : '#495057',
              }}>
              {r === "owner" ? t("login_tab_owner") : t("login_tab_tenant")}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: '#1A1D23' }}>{t("login_phone_label")}</label>
            <input type="tel" placeholder="01XXXXXXXXX" value={phone}
              onChange={(e) => { setPhone(e.target.value); setError(""); }}
              className="w-full h-10 rounded-lg px-3 text-sm outline-none" style={{ border: '1px solid #DEE2E6' }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#3B5BDB'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#DEE2E6'} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: '#1A1D23' }}>{t("login_password_label")}</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="w-full h-10 rounded-lg px-3 pr-10 text-sm outline-none" style={{ border: '1px solid #DEE2E6' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#3B5BDB'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#DEE2E6'} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#868E96' }}>
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="flex justify-end mt-1.5">
              <button type="button" className="text-xs hover:underline" style={{ color: '#3B5BDB' }}>{t("login_forgot")}</button>
            </div>
          </div>
          {error && <p className="text-xs" style={{ color: '#E03131' }}>{error}</p>}
          <button type="submit" disabled={isLoading} className="w-full h-10 font-semibold rounded-lg transition-colors text-sm disabled:opacity-50" style={{ background: '#3B5BDB', color: '#FFFFFF' }}>
            {isLoading ? t("login_loading") || 'Signing in...' : t("login_btn")}
          </button>
        </form>
        <div className="mt-4 space-y-2">
          <a href={import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/auth/google` : "/api/auth/google"}
            className="flex items-center justify-center gap-2 w-full h-10 border rounded-lg text-sm font-medium transition-colors"
            style={{ borderColor: '#DEE2E6', color: '#1A1D23' }}>
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {t("login_google_btn") || "Continue with Google"}
          </a>
          <a href={import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/auth/facebook` : "/api/auth/facebook"}
            className="flex items-center justify-center gap-2 w-full h-10 border rounded-lg text-sm font-medium transition-colors"
            style={{ borderColor: '#DEE2E6', color: '#1A1D23' }}>
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8 H7.079v-3.469h3.046V9.356c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.273C20.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            {t("login_facebook_btn") || "Continue with Facebook"}
          </a>
        </div>
        <p className="text-center text-sm mt-5" style={{ color: '#868E96' }}>
          {t("login_no_account")}{" "}
          <Link to="/register" className="font-medium hover:underline" style={{ color: '#3B5BDB' }}>{t("login_register_link")}</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
