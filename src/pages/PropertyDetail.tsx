import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Edit, Trash2, Eye } from "lucide-react";
import { ManagementLayout } from "@/components/ManagementLayout";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBuilding, useDeleteBuilding } from "@/hooks/api/useBuildings";
import { useUnits } from "@/hooks/api/useUnits";
import { useTenants } from "@/hooks/api/useTenants";
import type { Building, Unit, Tenant } from "@/types/api";
import { toast } from "sonner";

export default function PropertyDetail() {
  const params: Record<string, any> = useParams();
  const id = params.id as string || "";
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { currentOrg } = useAuth();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const buildingQuery = useBuilding(currentOrg?.id || null, id || null);
  const unitsQuery = useUnits(id || undefined);
  const tenantsQuery = useTenants(currentOrg?.id || null);

  const deleteBuilding = useDeleteBuilding(currentOrg?.id || null);

  const building = (buildingQuery.data as any)?.data as Building | undefined;
  const unitsData = (unitsQuery.data as any)?.data || [];
  const tenantsData = (tenantsQuery.data as Tenant[] | undefined) || [];

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteBuilding.mutateAsync(id);
      toast.success("Property deleted successfully");
      navigate("/management?tab=properties");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete property");
    }
  };

  const isLoading = buildingQuery.isLoading || unitsQuery.isLoading || tenantsQuery.isLoading;

  const occupiedUnits = unitsData.filter((u) => u.status === "occupied").length;
  const vacantUnits = unitsData.filter((u) => u.status === "vacant").length;

  const getTenantForUnit = (unitId: string) => {
    return tenantsData.find((tenant) => tenant.unit_id === unitId);
  };

  return (
    <ManagementLayout
      title={building?.name || t("pm.propertyDetails")}
      breadcrumbs={[
        { label: t("pm.myProperties"), href: "/management?tab=properties" },
        { label: building?.name || "" },
      ]}
      actions={
        building && (
          <>
            <Button variant="outline" asChild>
              <Link to={`/management/property/${id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                {t("bm.edit")}
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t("bm.delete")}
            </Button>
          </>
        )
      }
    >
      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      ) : building ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 border border-[#F1F3F5]">
              <p className="text-sm text-muted-foreground mb-1">{t("pm.totalUnits")}</p>
              <p className="text-2xl font-bold text-foreground">{unitsData.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#F1F3F5]">
              <p className="text-sm text-muted-foreground mb-1">{t("pm.occupiedUnits")}</p>
              <p className="text-2xl font-bold text-green-600">{occupiedUnits}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#F1F3F5]">
              <p className="text-sm text-muted-foreground mb-1">{t("pm.vacantUnits")}</p>
              <p className="text-2xl font-bold text-orange-600">{vacantUnits}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#F1F3F5]">
            <h2 className="text-lg font-semibold mb-4">{t("bm.address")}</h2>
            <p className="text-muted-foreground">{building.address || "—"}</p>
            {building.total_floors && (
              <p className="text-muted-foreground mt-2">
                {t("pm.totalFloors")}: {building.total_floors}
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-[#F1F3F5]">
            <div className="px-6 py-4 border-b border-[#F1F3F5]">
              <h2 className="text-lg font-semibold">{t("pm.units")}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#F1F3F5]">
                    <th className="text-left p-3 text-muted-foreground font-medium">{t("pm.unitNo")}</th>
                    <th className="text-left p-3 text-muted-foreground font-medium">{t("pm.floor")}</th>
                    <th className="text-left p-3 text-muted-foreground font-medium">{t("pm.size")}</th>
                    <th className="text-left p-3 text-muted-foreground font-medium">{t("dash.rent")}</th>
                    <th className="text-left p-3 text-muted-foreground font-medium">{t("dash.status")}</th>
                    <th className="text-left p-3 text-muted-foreground font-medium">{t("dash.tenant")}</th>
                    <th className="text-right p-3 text-muted-foreground font-medium">{t("bm.account")}</th>
                  </tr>
                </thead>
                <tbody>
                  {unitsData.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-muted-foreground">
                        {t("pm.noUnits")}
                      </td>
                    </tr>
                  ) : (
                    unitsData.map((unit) => {
                      const tenant = getTenantForUnit(unit.id);
                      return (
                        <tr key={unit.id} className="border-b border-[#F1F3F5] hover:bg-[#F8F9FA]">
                          <td className="p-3 font-medium">{unit.unit_number}</td>
                          <td className="p-3">{unit.floor || "—"}</td>
                          <td className="p-3">{unit.size_sqft ? `${unit.size_sqft} sq ft` : "—"}</td>
                          <td className="p-3">
                            {unit.rent_amount ? `৳${unit.rent_amount.toLocaleString()}` : "—"}
                          </td>
                          <td className="p-3">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                                unit.status === "occupied"
                                  ? "bg-green-100 text-green-700"
                                  : unit.status === "vacant"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {unit.status === "occupied"
                                ? t("pm.occupied")
                                : unit.status === "vacant"
                                ? t("pm.vacant")
                                : unit.status}
                            </span>
                          </td>
                          <td className="p-3">{tenant?.name || "—"}</td>
                          <td className="p-3 text-right">
                            <Link
                              to={`/management/unit/${unit.id}`}
                              className="text-primary hover:underline text-xs inline-flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              {t("bm.view")}
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 border border-[#F1F3F5] text-center">
          <p className="text-muted-foreground">{t("pm.propertyNotFound")}</p>
        </div>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t("pm.deleteProperty")}
        description={t("pm.deletePropertyConfirm")}
        onConfirm={handleDelete}
        isLoading={deleteBuilding.isPending}
      />
    </ManagementLayout>
  );
}
