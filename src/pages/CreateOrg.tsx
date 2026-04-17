import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";

const CreateOrg = () => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(t("org_name_required") || "Organization name is required");
      return;
    }
    setIsLoading(true);
    try {
      const data = await api.post("/orgs", { name });
      toast.success(t("org_created") || "Organization created successfully");
      await refreshUser();
      navigate("/management");
    } catch (err: any) {
      toast.error(err.message || "Failed to create organization");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: '#F4F6F8' }}>
      <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-lg border border-border p-8">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/management" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-heading font-bold text-foreground">{t("org_create") || "Create Organization"}</h1>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          {t("org_create_desc") || "Create a new organization to manage your properties."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              {t("org_name") || "Organization Name"}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("org_name_placeholder") || "My Property Management"}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-colors text-sm disabled:opacity-50"
          >
            {isLoading ? t("org_creating") || "Creating..." : t("org_create_btn") || "Create Organization"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateOrg;