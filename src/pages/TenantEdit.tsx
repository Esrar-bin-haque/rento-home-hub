import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ManagementLayout } from "@/components/ManagementLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTenant, useUpdateTenant } from "@/hooks/api/useTenants";
import type { Tenant } from "@/types/api";
import { toast } from "sonner";

export default function TenantEdit() {
  const params: Record<string, any> = useParams();
  const id = params.id as string;
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { currentOrg } = useAuth();

  const tenantQuery = useTenant(id, currentOrg?.id || null);
  const updateTenant = useUpdateTenant();

  const tenant = tenantQuery.data as Tenant | undefined;
  const isLoading = tenantQuery.isLoading;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    advance_amount: "",
    status: "active",
  });

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name || "",
        phone: tenant.phone || "",
        advance_amount: tenant.advance_amount?.toString() || "",
        status: tenant.status || "active",
      });
    }
  }, [tenant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Tenant name is required");
      return;
    }

    try {
      await updateTenant.mutateAsync({
        id,
        data: {
          name: formData.name.trim(),
          phone: formData.phone.trim() || undefined,
          advance_amount: formData.advance_amount ? parseFloat(formData.advance_amount) : undefined,
          status: formData.status,
        },
      });
      toast.success("Tenant updated successfully");
      navigate(`/management/tenant/${id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update tenant");
    }
  };

  return (
    <ManagementLayout
      title={t("dash.editTenant")}
      breadcrumbs={[
        { label: t("dash.tenantsTab"), href: "/management?tab=tenants" },
        { label: tenant?.name || t("dash.editTenant") },
      ]}
    >
      <div className="max-w-2xl">
        <Link
          to={`/management/tenant/${id}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t("dash.backToTenant")}
        </Link>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 rounded-lg" />
            <Skeleton className="h-12 rounded-lg" />
            <Skeleton className="h-12 rounded-lg" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#F1F3F5] p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                {t("auth.fullName")} <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t("dash.namePlaceholder")}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                {t("auth.phoneNumber")}
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="01XXXXXXXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                {t("pm.advanceAmount")}
              </label>
              <Input
                type="number"
                min="0"
                value={formData.advance_amount}
                onChange={(e) => setFormData({ ...formData, advance_amount: e.target.value })}
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                {t("dash.status")}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={formData.status === "active"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{t("pm.active")}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={formData.status === "inactive"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{t("pm.inactive")}</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/management/tenant/${id}`)}
              >
                {t("bm.cancel")}
              </Button>
              <Button type="submit" disabled={updateTenant.isPending}>
                {updateTenant.isPending ? t("dash.saving") : t("dash.saveChanges")}
              </Button>
            </div>
          </form>
        )}
      </div>
    </ManagementLayout>
  );
}
