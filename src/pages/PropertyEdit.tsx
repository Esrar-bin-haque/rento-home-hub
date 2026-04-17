import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ManagementLayout } from "@/components/ManagementLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBuilding, useUpdateBuilding } from "@/hooks/api/useBuildings";
import type { Building } from "@/types/api";
import { toast } from "sonner";

export default function PropertyEdit() {
  const params: Record<string, any> = useParams();
  const id = params.id as string;
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { currentOrg } = useAuth();

  const buildingQuery = useBuilding(currentOrg?.id || null, id);
  const updateBuilding = useUpdateBuilding(currentOrg?.id || null);

  const building = (buildingQuery.data as any)?.data as Building | undefined;
  const isLoading = buildingQuery.isLoading;

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    total_floors: "",
  });

  useEffect(() => {
    if (building) {
      setFormData({
        name: building.name || "",
        address: building.address || "",
        total_floors: building.total_floors?.toString() || "",
      });
    }
  }, [building]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Property name is required");
      return;
    }

    try {
      await updateBuilding.mutateAsync({
        id,
        data: {
          name: formData.name.trim(),
          address: formData.address.trim() || undefined,
          total_floors: formData.total_floors ? parseInt(formData.total_floors) : undefined,
        },
      });
      toast.success("Property updated successfully");
      navigate(`/management/property/${id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update property");
    }
  };

  return (
    <ManagementLayout
      title={t("pm.editProperty")}
      breadcrumbs={[
        { label: t("pm.myProperties"), href: "/management?tab=properties" },
        { label: building?.name || t("pm.editProperty") },
      ]}
    >
      <div className="max-w-2xl">
        <Link
          to={`/management/property/${id}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t("dash.backToProperty")}
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
                {t("pm.propertyName")} <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t("pm.propertyNamePlaceholder")}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                {t("bm.address")}
              </label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder={t("pm.addressPlaceholder")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                {t("pm.totalFloors")}
              </label>
              <Input
                type="number"
                min="1"
                value={formData.total_floors}
                onChange={(e) => setFormData({ ...formData, total_floors: e.target.value })}
                placeholder={t("pm.totalFloorsPlaceholder")}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/management/property/${id}`)}
              >
                {t("bm.cancel")}
              </Button>
              <Button type="submit" disabled={updateBuilding.isPending}>
                {updateBuilding.isPending ? t("dash.saving") : t("dash.saveChanges")}
              </Button>
            </div>
          </form>
        )}
      </div>
    </ManagementLayout>
  );
}
