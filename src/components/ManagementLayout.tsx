import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Home,
  LayoutGrid,
  Users,
  DollarSign,
  FileText,
  ArrowUpCircle,
  ArrowDownCircle,
  Settings,
  Building2,
  LogOut,
  ChevronRight,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface BreadcrumbItemType {
  label: string;
  href?: string;
}

interface ManagementLayoutProps {
  title: string;
  breadcrumbs: BreadcrumbItemType[];
  actions?: React.ReactNode;
  children: React.ReactNode;
  showSidebar?: boolean;
}

const sidebarKeys = [
  { icon: BarChart3, key: "dash.dashboard", path: "/management" },
  { icon: Home, key: "pm.myProperties", path: "/management?tab=properties" },
  { icon: LayoutGrid, key: "pm.units", path: "/management?tab=units" },
  { icon: Users, key: "dash.tenantsTab", path: "/management?tab=tenants" },
  { icon: DollarSign, key: "dash.rentPayments", path: "/management?tab=payments" },
  { icon: FileText, key: "dash.expenses", path: "/management?tab=expenses" },
  { icon: FileText, key: "pm.invoices", path: "/management?tab=invoices" },
  { icon: ArrowUpCircle, key: "pm.accountPayable", path: "/management?tab=payable" },
  { icon: ArrowDownCircle, key: "pm.accountReceivable", path: "/management?tab=receivable" },
  { icon: Settings, key: "dash.settings", path: "/management?tab=settings" },
];

export function ManagementLayout({
  title,
  breadcrumbs,
  actions,
  children,
  showSidebar = true,
}: ManagementLayoutProps) {
  const { t } = useLanguage();
  const location = useLocation();

  const getActiveKey = () => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");

    if (location.pathname === "/management" && !tab) return "dash.dashboard";
    if (tab === "properties" || location.pathname.includes("/property")) return "pm.myProperties";
    if (tab === "units" || location.pathname.includes("/unit")) return "pm.units";
    if (tab === "tenants" || location.pathname.includes("/tenant")) return "dash.tenantsTab";
    if (tab === "payments") return "dash.rentPayments";
    if (tab === "expenses") return "dash.expenses";
    if (tab === "invoices") return "pm.invoices";
    if (tab === "payable") return "pm.accountPayable";
    if (tab === "receivable") return "pm.accountReceivable";
    if (tab === "settings") return "dash.settings";

    return "dash.dashboard";
  };

  const activeKey = getActiveKey();

  return (
    <div className="flex min-h-[calc(100vh-60px)]" style={{ background: "#F8F9FA" }}>
      {showSidebar && (
        <aside
          className="w-[220px] flex-shrink-0 flex flex-col fixed left-0 z-20"
          style={{
            background: "#1A1D23",
            top: "60px",
            height: "calc(100vh - 60px)",
          }}
        >
          <div className="px-4 pt-3 pb-2">
            <Link to="/" className="flex items-center gap-2">
              <img src="/src/assets/rento-logo.png" alt="Rento" className="h-7 rounded-lg" />
              <span className="text-sm font-bold text-white">Rento</span>
            </Link>
          </div>
          <div className="mx-3 mb-1 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }} />
          <nav className="flex-1 px-1 py-1 overflow-y-auto">
            {sidebarKeys.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className="w-full flex items-center gap-[10px] rounded-lg transition-colors"
                style={{
                  padding: "8px 16px",
                  fontSize: "13px",
                  lineHeight: "1.2",
                  background: activeKey === item.key ? "#3B5BDB" : "transparent",
                  color: activeKey === item.key ? "#FFFFFF" : "rgba(255,255,255,0.72)",
                  borderLeft: activeKey === item.key ? "3px solid #7B9CFF" : "3px solid transparent",
                }}
              >
                <item.icon style={{ width: "15px", height: "15px" }} />
                {t(item.key)}
              </Link>
            ))}
          </nav>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", padding: "12px 16px" }}>
            <button
              className="w-full flex items-center gap-2 text-sm transition-colors"
              style={{ color: "rgba(255,255,255,0.56)" }}
            >
              <LogOut style={{ width: "15px", height: "15px" }} />
              {t("sidebar_logout")}
            </button>
          </div>
        </aside>
      )}

      <main
        className={`flex-1 ${showSidebar ? "ml-[220px]" : ""}`}
        style={{ minHeight: "calc(100vh - 60px)" }}
      >
        <div className="p-6">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/management">{t("dash.dashboard")}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumbs.map((crumb, index) => (
                <>
                  <BreadcrumbSeparator key={`sep-${index}`}>
                    <ChevronRight />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem key={index}>
                    {crumb.href ? (
                      <BreadcrumbLink asChild>
                        <Link to={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </>
              ))}
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-heading font-bold text-foreground">{title}</h1>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
