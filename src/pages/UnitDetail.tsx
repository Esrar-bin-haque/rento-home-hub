import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Edit, Trash2, Eye } from "lucide-react";
import { ManagementLayout } from "@/components/ManagementLayout";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUnit, useDeleteUnit } from "@/hooks/api/useUnits";
import { useBuildings } from "@/hooks/api/useBuildings";
import { useTenants } from "@/hooks/api/useTenants";
import type { Unit, Building, Tenant } from "@/types/api";
import { toast } from "sonner";

export default function UnitDetail() {
  const params: Record<string, any> = useParams();
  const id = params.id as string;
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { currentOrg } = useAuth();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const unitQuery = useUnit(id);
  const buildingsQuery = useBuildings(currentOrg?.id || null);
  const tenantsQuery = useTenants(currentOrg?.id || null);

  const deleteUnit = useDeleteUnit();

  const unit = unitQuery.data as Unit | undefined;
  const buildingsData = (buildingsQuery.data as Building[] | undefined) || [];
  const tenantsData = (tenantsQuery.data as Tenant[] | undefined) || [];

  const building = buildingsData.find((b) => b.id === unit?.building_id);
  const currentTenant = tenantsData.find((tenant) => tenant.unit_id === id && tenant.status === "active");

  const handleDelete = async () => {
    try {
      await deleteUnit.mutateAsync(id);
      toast.success("Unit deleted successfully");
      if (building) {
        navigate(`/management/property/${building.id}`);
      } else {
        navigate("/management?tab=units");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete unit");
    }
  };

  const isLoading = unitQuery.isLoading || buildingsQuery.isLoading || tenantsQuery.isLoading;

  const getStatusBadge = (status: string) => {
    const isOccupied = status === "occupied";
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isOccupied ? "bg-green-100 text-green-700" : status === "vacant" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"
        }`}
      >
        {isOccupied && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
        {status === "occupied" ? t("pm.occupied") : status === "vacant" ? t("pm.vacant") : status}
      </span>
    );
  };

  return (
    <ManagementLayout
      title={unit ? `${t("dash.unit")} ${unit.unit_number}` : t("dash.unitDetails")}
      breadcrumbs={[
        { label: t("pm.myProperties"), href: "/management?tab=properties" },
        building ? { label: building.name, href: `/management/property/${building.id}` } : { label: t("pm.myProperties") },
        { label: unit ? `${t("dash.unit")} ${unit.unit_number}` : "" },
      ]}
      actions={
        unit && (
          <>
            <Button variant="outline" asChild>
              <Link to={`/management/unit/${id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                {t("bm.edit")}
              </Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              {t("bm.delete")}
            </Button>
          </>
        )
      }
    >
      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        </div>
      ) : unit ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-[#F1F3F5]">
              <p className="text-sm text-muted-foreground mb-1">{t("pm.floor")}</p>
              <p className="text-lg font-semibold">{unit.floor || "—"}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#F1F3F5]">
              <p className="text-sm text-muted-foreground mb-1">{t("pm.size")}</p>
              <p className="text-lg font-semibold">{unit.size_sqft ? `${unit.size_sqft} sq ft` : "—"}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#F1F3F5]">
              <p className="text-sm text-muted-foreground mb-1">{t("dash.rentAmount")}</p>
              <p className="text-lg font-semibold">
                {unit.rent_amount ? `৳${unit.rent_amount.toLocaleString()}` : "—"}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#F1F3F5]">
              <p className="text-sm text-muted-foreground mb-1">{t("dash.status")}</p>
              <div className="mt-1">{getStatusBadge(unit.status)}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-[#F1F3F5]">
            <p className="text-sm text-muted-foreground mb-1">{t("pm.serviceCharge")}</p>
            <p className="text-lg font-semibold">
              {unit.service_charge ? `৳${unit.service_charge.toLocaleString()}` : "—"}
            </p>
          </div>

          {currentTenant && (
            <div className="bg-white rounded-xl border border-[#F1F3F5]">
              <div className="px-6 py-4 border-b border-[#F1F3F5]">
                <h2 className="text-lg font-semibold">{t("dash.currentTenant")}</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{currentTenant.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {currentTenant.phone || "—"} | {t("dash.moveInDate")}:{" "}
                      {currentTenant.move_in_date ? new Date(currentTenant.move_in_date).toLocaleDateString() : "—"}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/management/tenant/${currentTenant.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      {t("bm.view")}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {!currentTenant && unit.status === "vacant" && (
            <div className="bg-orange-50 rounded-xl border border-orange-200 p-6 text-center">
              <p className="text-orange-700">{t("pm.unitVacant")}</p>
              <p className="text-sm text-orange-600 mt-1">{t("pm.assignTenantPrompt")}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 border border-[#F1F3F5] text-center">
          <p className="text-muted-foreground">{t("dash.unitNotFound")}</p>
        </div>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t("pm.deleteUnit")}
        description={t("pm.deleteUnitConfirm")}
        onConfirm={handleDelete}
        isLoading={deleteUnit.isPending}
      />
    </ManagementLayout>
  );
}
