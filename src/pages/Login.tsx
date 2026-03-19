import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

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
    if (!/^01\d{9}$/.test(phone)) {
      setError(t("auth.invalidPhone"));
      return;
    }
    if (!password) {
      setError(t("auth.passwordRequired"));
      return;
    }
    login(phone, password);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-lg border border-[#F1F5F9] p-8">
        <div className="flex flex-col items-center mb-6">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-heading font-bold text-foreground">Rento</span>
          </Link>
          <h1 className="text-xl font-heading font-bold text-foreground">{t("auth.welcomeBack")}</h1>
          <p className="text-sm text-muted-foreground">{t("auth.loginSubtitle")}</p>
        </div>

        <div className="flex rounded-lg bg-[#F1F5F9] p-1 mb-6">
          {(["owner", "tenant"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTab(r)}
              className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${
                tab === r ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {r === "owner" ? t("auth.ownerManager") : t("auth.tenant")}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">{t("auth.phoneNumber")}</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-input bg-[#F8FAFC] text-sm text-muted-foreground">+880</span>
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setError(""); }}
                className="flex-1 h-10 rounded-r-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">{t("auth.password")}</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="w-full h-10 rounded-lg border border-input bg-background px-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="flex justify-end mt-1.5">
              <button type="button" className="text-xs text-primary hover:underline">{t("auth.forgotPassword")}</button>
            </div>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <button type="submit" className="w-full h-10 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors text-sm">
            {t("nav.login")}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-5">
          {t("auth.noAccount")}{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">{t("auth.register")}</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
