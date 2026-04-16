import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import rentoLogo from "@/assets/rento-logo.png";

const roles = [
  { value: "owner" as const, labelKey: "register_role_owner" },
  { value: "manager" as const, labelKey: "register_role_manager" },
  { value: "tenant" as const, labelKey: "register_role_tenant" },
];

const Register = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"owner" | "manager" | "tenant">("owner");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError(t("register_name_required")); return; }
    if (!/^01\d{9}$/.test(phone)) { setError(t("login_invalid_phone")); return; }
    if (password.length < 6) { setError(t("register_password_min")); return; }
    if (password !== confirmPw) { setError(t("register_password_mismatch")); return; }
    try {
      await register(name, phone, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: '#F4F6F8' }}>
      <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-lg border border-border p-8">
        <div className="flex flex-col items-center mb-6">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <img src={rentoLogo} alt="Rento" className="h-10 w-10 rounded-lg object-cover" />
            <span className="text-2xl font-heading font-bold text-foreground">Rento</span>
          </Link>
          <h1 className="text-xl font-heading font-bold text-foreground">{t("register_title")}</h1>
          <p className="text-sm text-muted-foreground">{t("register_sub")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">{t("register_name")}</label>
            <input type="text" value={name} onChange={(e) => { setName(e.target.value); setError(""); }}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">{t("login_phone_label")}</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-input bg-muted text-sm text-muted-foreground">+880</span>
              <input type="tel" placeholder={t("login_phone_placeholder")} value={phone}
                onChange={(e) => { setPhone(e.target.value); setError(""); }}
                className="flex-1 h-10 rounded-r-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">{t("register_role")}</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <button key={r.value} type="button" onClick={() => setRole(r.value)}
                  className={`py-2.5 rounded-lg border text-xs font-medium transition-colors ${
                    role === r.value ? "border-primary bg-primary/5 text-primary" : "border-input text-muted-foreground hover:border-primary/50"
                  }`}>
                  {t(r.labelKey)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">{t("register_password")}</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="w-full h-10 rounded-lg border border-input bg-background px-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">{t("register_confirm")}</label>
            <input type="password" value={confirmPw} onChange={(e) => { setConfirmPw(e.target.value); setError(""); }}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <button type="submit" className="w-full h-10 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-colors text-sm">
            {t("register_btn")}
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-5">
          {t("register_have_account")}{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">{t("register_login_link")}</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
