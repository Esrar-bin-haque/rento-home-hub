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
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^01\d{9}$/.test(phone)) { setError(t("auth.invalidPhone")); return; }
    if (!password) { setError(t("auth.passwordRequired")); return; }
    login(phone, password);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F8F9FA' }}>
      <div className="w-full max-w-[440px] bg-white rounded-2xl p-8" style={{ border: '1px solid #DEE2E6', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <div className="flex flex-col items-center mb-6">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <img src={rentoLogo} alt="Rento" className="h-10 w-10 rounded-lg object-cover" />
            <span className="text-2xl font-heading font-bold" style={{ color: '#1A1D23' }}>Rento</span>
          </Link>
          <h1 className="text-xl font-heading font-bold" style={{ color: '#1A1D23' }}>{t("auth.welcomeBack")}</h1>
          <p className="text-sm" style={{ color: '#868E96' }}>{t("auth.loginSubtitle")}</p>
        </div>

        <div className="flex rounded-lg p-1 mb-6" style={{ background: '#F1F3F5' }}>
          {(["owner", "tenant"] as const).map((r) => (
            <button key={r} onClick={() => setTab(r)}
              className="flex-1 text-sm font-medium py-2 rounded-md transition-colors"
              style={{
                background: tab === r ? '#3B5BDB' : 'transparent',
                color: tab === r ? '#FFFFFF' : '#495057',
              }}>
              {r === "owner" ? t("auth.ownerManager") : t("auth.tenant")}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: '#1A1D23' }}>{t("auth.phoneNumber")}</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg text-sm" style={{ border: '1px solid #DEE2E6', borderRight: 'none', background: '#F1F3F5', color: '#868E96' }}>+880</span>
              <input type="tel" placeholder="01XXXXXXXXX" value={phone}
                onChange={(e) => { setPhone(e.target.value); setError(""); }}
                className="flex-1 h-10 rounded-r-lg px-3 text-sm outline-none" style={{ border: '1px solid #DEE2E6' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#3B5BDB'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#DEE2E6'} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: '#1A1D23' }}>{t("auth.password")}</label>
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
              <button type="button" className="text-xs hover:underline" style={{ color: '#3B5BDB' }}>{t("auth.forgotPassword")}</button>
            </div>
          </div>
          {error && <p className="text-xs" style={{ color: '#E03131' }}>{error}</p>}
          <button type="submit" className="w-full h-10 font-semibold rounded-lg transition-colors text-sm" style={{ background: '#3B5BDB', color: '#FFFFFF' }}>
            {t("nav.login")}
          </button>
        </form>
        <p className="text-center text-sm mt-5" style={{ color: '#868E96' }}>
          {t("auth.noAccount")}{" "}
          <Link to="/register" className="font-medium hover:underline" style={{ color: '#3B5BDB' }}>{t("auth.register")}</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
