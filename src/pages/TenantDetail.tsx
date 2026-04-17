import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import { ManagementLayout } from "@/components/ManagementLayout";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTenant, useDeleteTenant } from "@/hooks/api/useTenants";
import { usePayments } from "@/hooks/api/usePayments";
import type { Tenant, Payment } from "@/types/api";
import { toast } from "sonner";

export default function TenantDetail() {
  const params: Record<string, any> = useParams();
  const id = params.id as string;
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { currentOrg } = useAuth();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const tenantQuery = useTenant(id, currentOrg?.id || null);
  const paymentsQuery = usePayments(currentOrg?.id || null);

  const deleteTenant = useDeleteTenant();

  const tenant = tenantQuery.data as Tenant | undefined;
  const allPayments = (paymentsQuery.data as Payment[] | undefined) || [];
  const tenantPayments = allPayments.filter((p) => p.tenant_id === id).slice(0, 6);

  const handleDelete = async () => {
    try {
      await deleteTenant.mutateAsync(id);
      toast.success("Tenant deleted successfully");
      navigate("/management?tab=tenants");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete tenant");
    }
  };

  const isLoading = tenantQuery.isLoading || paymentsQuery.isLoading;

  const getStatusBadge = (status: string) => {
    const isActive = status === "active";
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
        }`}
      >
        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
        {status === "active" ? t("pm.active") : t("pm.inactive")}
      </span>
    );
  };

  return (
    <ManagementLayout
      title={tenant?.name || t("dash.tenantDetails")}
      breadcrumbs={[
        { label: t("dash.tenantsTab"), href: "/management?tab=tenants" },
        { label: tenant?.name || "" },
      ]}
      actions={
        tenant && (
          <>
            <Button variant="outline" asChild>
              <Link to={`/management/tenant/${id}/edit`}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      ) : tenant ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-[#F1F3F5]">
              <p className="text-sm text-muted-foreground mb-1">{t("auth.phoneNumber")}</p>
              <p className="text-lg font-semibold">{tenant.phone || "—"}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#F1F3F5]">
              <p className="text-sm text-muted-foreground mb-1">{t("dash.status")}</p>
              <div className="mt-1">{getStatusBadge(tenant.status)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#F1F3F5]">
              <p className="text-sm text-muted-foreground mb-1">{t("dash.moveInDate")}</p>
              <p className="text-lg font-semibold">
                {tenant.move_in_date ? new Date(tenant.move_in_date).toLocaleDateString() : "—"}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#F1F3F5]">
              <p className="text-sm text-muted-foreground mb-1">{t("pm.advanceAmount")}</p>
              <p className="text-lg font-semibold">
                {tenant.advance_amount ? `৳${tenant.advance_amount.toLocaleString()}` : "—"}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#F1F3F5]">
            <div className="px-6 py-4 border-b border-[#F1F3F5] flex justify-between items-center">
              <h2 className="text-lg font-semibold">{t("dash.paymentHistory")}</h2>
              <Link
                to={`/management?tab=payments&tenant=${id}`}
                className="text-sm text-primary hover:underline"
              >
                {t("dash.viewAllPayments")}
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#F1F3F5]">
                    <th className="text-left p-3 text-muted-foreground font-medium">{t("dash.month")}</th>
                    <th className="text-left p-3 text-muted-foreground font-medium">{t("dash.amount")}</th>
                    <th className="text-left p-3 text-muted-foreground font-medium">{t("dash.date")}</th>
                    <th className="text-left p-3 text-muted-foreground font-medium">{t("dash.status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {tenantPayments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-muted-foreground">
                        {t("dash.noPayments")}
                      </td>
                    </tr>
                  ) : (
                    tenantPayments.map((payment) => (
                      <tr key={payment.id} className="border-b border-[#F1F3F5]">
                        <td className="p-3">{payment.month}</td>
                        <td className="p-3 font-medium">
                          {payment.amount ? `৳${payment.amount.toLocaleString()}` : "—"}
                        </td>
                        <td className="p-3">{payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : "—"}</td>
                        <td className="p-3">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                              payment.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : payment.status === "due"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {payment.status === "paid"
                              ? t("dash.paid")
                              : payment.status === "due"
                              ? t("dash.due")
                              : t("dash.overdue")}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 border border-[#F1F3F5] text-center">
          <p className="text-muted-foreground">{t("dash.tenantNotFound")}</p>
        </div>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t("pm.deleteTenant")}
        description={t("pm.deleteTenantConfirm")}
        onConfirm={handleDelete}
        isLoading={deleteTenant.isPending}
      />
    </ManagementLayout>
  );
}
