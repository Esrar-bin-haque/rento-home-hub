import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ManagementLayout } from "@/components/ManagementLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUnit, useUpdateUnit } from "@/hooks/api/useUnits";
import type { Unit } from "@/types/api";
import { toast } from "sonner";

export default function UnitEdit() {
  const params: Record<string, any> = useParams();
  const id = params.id as string;
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { currentOrg } = useAuth();

  const unitQuery = useUnit(id);
  const updateUnit = useUpdateUnit();

  const unit = unitQuery.data as Unit | undefined;
  const isLoading = unitQuery.isLoading;

  const [formData, setFormData] = useState({
    unit_number: "",
    floor: "",
    size_sqft: "",
    rent_amount: "",
    service_charge: "",
    status: "vacant",
  });

  useEffect(() => {
    if (unit) {
      setFormData({
        unit_number: unit.unit_number || "",
        floor: unit.floor || "",
        size_sqft: unit.size_sqft?.toString() || "",
        rent_amount: unit.rent_amount?.toString() || "",
        service_charge: unit.service_charge?.toString() || "",
        status: unit.status || "vacant",
      });
    }
  }, [unit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.unit_number.trim()) {
      toast.error("Unit number is required");
      return;
    }

    try {
      await updateUnit.mutateAsync({
        id,
        data: {
          unit_number: formData.unit_number.trim(),
          floor: formData.floor.trim() || undefined,
          size_sqft: formData.size_sqft ? parseFloat(formData.size_sqft) : undefined,
          rent_amount: formData.rent_amount ? parseFloat(formData.rent_amount) : undefined,
          service_charge: formData.service_charge ? parseFloat(formData.service_charge) : undefined,
          status: formData.status,
        },
      });
      toast.success("Unit updated successfully");
      navigate(`/management/unit/${id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update unit");
    }
  };

  return (
    <ManagementLayout
      title={t("dash.editUnit")}
      breadcrumbs={[
        { label: t("pm.myProperties"), href: "/management?tab=properties" },
        { label: unit ? `${t("dash.unit")} ${unit.unit_number}` : t("dash.editUnit") },
      ]}
    >
      <div className="max-w-2xl">
        <Link
          to={`/management/unit/${id}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t("dash.backToUnit")}
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
                {t("pm.unitNo")} <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.unit_number}
                onChange={(e) => setFormData({ ...formData, unit_number: e.target.value })}
                placeholder="A1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                {t("pm.floor")}
              </label>
              <Input
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                placeholder="1st"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                {t("pm.size")}
              </label>
              <Input
                type="number"
                min="0"
                value={formData.size_sqft}
                onChange={(e) => setFormData({ ...formData, size_sqft: e.target.value })}
                placeholder="850"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                {t("dash.rentAmount")}
              </label>
              <Input
                type="number"
                min="0"
                value={formData.rent_amount}
                onChange={(e) => setFormData({ ...formData, rent_amount: e.target.value })}
                placeholder="20000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                {t("pm.serviceCharge")}
              </label>
              <Input
                type="number"
                min="0"
                value={formData.service_charge}
                onChange={(e) => setFormData({ ...formData, service_charge: e.target.value })}
                placeholder="2000"
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
                    value="vacant"
                    checked={formData.status === "vacant"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{t("pm.vacant")}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="occupied"
                    checked={formData.status === "occupied"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{t("pm.occupied")}</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/management/unit/${id}`)}
              >
                {t("bm.cancel")}
              </Button>
              <Button type="submit" disabled={updateUnit.isPending}>
                {updateUnit.isPending ? t("dash.saving") : t("dash.saveChanges")}
              </Button>
            </div>
          </form>
        )}
      </div>
    </ManagementLayout>
  );
}
