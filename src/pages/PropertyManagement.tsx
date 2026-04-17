import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2, BarChart3, Home, Users, DollarSign, FileText, Bell, Settings,
  LogOut, Menu, TrendingUp, TrendingDown, LayoutGrid, Plus, X, Eye, Edit,
  ArrowUpCircle, ArrowDownCircle, Send, CreditCard, Receipt, FileCheck
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useBuildings, useCreateBuilding, useDeleteBuilding } from "@/hooks/api/useBuildings";
import { useUnits, useCreateUnit, useUpdateUnit, useDeleteUnit } from "@/hooks/api/useUnits";
import { useExpenses, useCreateExpense, useUpdateExpense, useDeleteExpense } from "@/hooks/api/useExpenses";
import { useTenants, useCreateTenant, useUpdateTenant, useDeleteTenant } from "@/hooks/api/useTenants";
import { usePayments, useCreatePayment, useUpdatePayment, useDeletePayment } from "@/hooks/api/usePayments";
import { usePayables, useCreatePayable, useUpdatePayable, useDeletePayable } from "@/hooks/api/usePayables";
import { useInvoices, useCreateInvoice, useMarkInvoicePaid, useDeleteInvoice } from "@/hooks/api/useInvoices";
import { useDashboard } from "@/hooks/api/useDashboard";
import { toast } from "sonner";

// ─── Dashboard Chart Data (static) ──────────────────────
const barData = [
  { month: "Oct", collected: 95000, due: 25000 },
  { month: "Nov", collected: 105000, due: 15000 },
  { month: "Dec", collected: 110000, due: 10000 },
  { month: "Jan", collected: 100000, due: 20000 },
  { month: "Feb", collected: 115000, due: 5000 },
  { month: "Mar", collected: 120000, due: 0 },
];

const expensePieData = [
  { name: "Maintenance", value: 12000, color: "#3B5BDB" },
  { name: "Utilities", value: 18000, color: "#E67700" },
  { name: "Repairs", value: 8000, color: "#E03131" },
  { name: "Insurance", value: 5000, color: "#3B5BDB" },
  { name: "Tax", value: 7000, color: "#7048E8" },
];

// ─── Properties Data (static) ──────────────────────
const properties = [
  { name: "Sunset Tower", address: "Road 5, Dhanmondi, Dhaka", totalUnits: 24, occupied: 21, vacant: 3 },
  { name: "Green Heights", address: "Block C, Bashundhara, Dhaka", totalUnits: 16, occupied: 14, vacant: 2 },
  { name: "City View Apt", address: "Gulshan 2, Dhaka", totalUnits: 12, occupied: 12, vacant: 0 },
];

const units = [
  { flat: "A1", building: "Sunset Tower", floor: "1st", size: 850, rent: 20000, status: "Occupied", tenant: "Rahim Uddin" },
  { flat: "A2", building: "Sunset Tower", floor: "1st", size: 900, rent: 18000, status: "Occupied", tenant: "Sumaiya Khan" },
  { flat: "B1", building: "Sunset Tower", floor: "2nd", size: 850, rent: 22000, status: "Occupied", tenant: "Kamal Hossain" },
  { flat: "B2", building: "Sunset Tower", floor: "2nd", size: 950, rent: 25000, status: "Occupied", tenant: "Nadia Islam" },
  { flat: "C1", building: "Sunset Tower", floor: "3rd", size: 850, rent: 20000, status: "Vacant", tenant: "—" },
  { flat: "C2", building: "Green Heights", floor: "1st", size: 750, rent: 15000, status: "Occupied", tenant: "Fatema Begum" },
  { flat: "D1", building: "Green Heights", floor: "2nd", size: 1100, rent: 30000, status: "Occupied", tenant: "Shakil Ahmed" },
  { flat: "D2", building: "City View Apt", floor: "1st", size: 1200, rent: 28000, status: "Occupied", tenant: "Riya Chowdhury" },
];

const tenantsList = [
  { name: "Rahim Uddin", flat: "A1", building: "Sunset Tower", phone: "01711-000001", moveIn: "October 2021", rent: 20000, status: "Active", totalPaid: 120000, advance: 40000, paymentHistory: [
    { month: "Mar 2026", amount: 20000, date: "Mar 1", status: "Paid" },
    { month: "Feb 2026", amount: 20000, date: "Feb 1", status: "Paid" },
    { month: "Jan 2026", amount: 20000, date: "Jan 3", status: "Paid" },
    { month: "Dec 2025", amount: 20000, date: "Dec 1", status: "Paid" },
    { month: "Nov 2025", amount: 20000, date: "Nov 2", status: "Paid" },
    { month: "Oct 2025", amount: 20000, date: "Oct 1", status: "Paid" },
  ]},
  { name: "Sumaiya Khan", flat: "A2", building: "Sunset Tower", phone: "01722-000002", moveIn: "January 2022", rent: 18000, status: "Active", totalPaid: 108000, advance: 36000, paymentHistory: [
    { month: "Mar 2026", amount: 18000, date: "Mar 2", status: "Paid" },
    { month: "Feb 2026", amount: 18000, date: "Feb 1", status: "Paid" },
    { month: "Jan 2026", amount: 18000, date: "Jan 2", status: "Paid" },
    { month: "Dec 2025", amount: 18000, date: "Dec 3", status: "Paid" },
    { month: "Nov 2025", amount: 18000, date: "Nov 1", status: "Paid" },
    { month: "Oct 2025", amount: 18000, date: "Oct 2", status: "Paid" },
  ]},
  { name: "Kamal Hossain", flat: "B1", building: "Sunset Tower", phone: "01733-000003", moveIn: "March 2022", rent: 22000, status: "Active", totalPaid: 110000, advance: 44000, paymentHistory: [
    { month: "Mar 2026", amount: 22000, date: "—", status: "Due" },
    { month: "Feb 2026", amount: 22000, date: "Feb 3", status: "Paid" },
    { month: "Jan 2026", amount: 22000, date: "Jan 1", status: "Paid" },
    { month: "Dec 2025", amount: 22000, date: "Dec 2", status: "Paid" },
    { month: "Nov 2025", amount: 22000, date: "Nov 3", status: "Paid" },
    { month: "Oct 2025", amount: 22000, date: "Oct 1", status: "Paid" },
  ]},
  { name: "Nadia Islam", flat: "B2", building: "Sunset Tower", phone: "01744-000004", moveIn: "June 2022", rent: 25000, status: "Active", totalPaid: 150000, advance: 50000, paymentHistory: [
    { month: "Mar 2026", amount: 25000, date: "Mar 3", status: "Paid" },
    { month: "Feb 2026", amount: 25000, date: "Feb 2", status: "Paid" },
    { month: "Jan 2026", amount: 25000, date: "Jan 1", status: "Paid" },
    { month: "Dec 2025", amount: 25000, date: "Dec 1", status: "Paid" },
    { month: "Nov 2025", amount: 25000, date: "Nov 2", status: "Paid" },
    { month: "Oct 2025", amount: 25000, date: "Oct 3", status: "Paid" },
  ]},
  { name: "Arif Rahman", flat: "C1", building: "Sunset Tower", phone: "01755-000005", moveIn: "August 2022", rent: 20000, status: "Active", totalPaid: 100000, advance: 40000, paymentHistory: [
    { month: "Mar 2026", amount: 20000, date: "—", status: "Due" },
    { month: "Feb 2026", amount: 20000, date: "Feb 1", status: "Paid" },
    { month: "Jan 2026", amount: 20000, date: "Jan 2", status: "Paid" },
    { month: "Dec 2025", amount: 20000, date: "Dec 1", status: "Paid" },
    { month: "Nov 2025", amount: 20000, date: "Nov 3", status: "Paid" },
    { month: "Oct 2025", amount: 20000, date: "Oct 1", status: "Paid" },
  ]},
  { name: "Fatema Begum", flat: "C2", building: "Green Heights", phone: "01766-000006", moveIn: "November 2022", rent: 15000, status: "Active", totalPaid: 90000, advance: 30000, paymentHistory: [
    { month: "Mar 2026", amount: 15000, date: "Mar 4", status: "Paid" },
    { month: "Feb 2026", amount: 15000, date: "Feb 2", status: "Paid" },
    { month: "Jan 2026", amount: 15000, date: "Jan 1", status: "Paid" },
    { month: "Dec 2025", amount: 15000, date: "Dec 3", status: "Paid" },
    { month: "Nov 2025", amount: 15000, date: "Nov 1", status: "Paid" },
    { month: "Oct 2025", amount: 15000, date: "Oct 2", status: "Paid" },
  ]},
  { name: "Shakil Ahmed", flat: "D1", building: "Green Heights", phone: "01777-000007", moveIn: "February 2023", rent: 30000, status: "Active", totalPaid: 180000, advance: 60000, paymentHistory: [
    { month: "Mar 2026", amount: 30000, date: "Mar 1", status: "Paid" },
    { month: "Feb 2026", amount: 30000, date: "Feb 1", status: "Paid" },
    { month: "Jan 2026", amount: 30000, date: "Jan 3", status: "Paid" },
    { month: "Dec 2025", amount: 30000, date: "Dec 1", status: "Paid" },
    { month: "Nov 2025", amount: 30000, date: "Nov 2", status: "Paid" },
    { month: "Oct 2025", amount: 30000, date: "Oct 1", status: "Paid" },
  ]},
  { name: "Riya Chowdhury", flat: "D2", building: "City View Apt", phone: "01788-000008", moveIn: "May 2023", rent: 28000, status: "Active", totalPaid: 168000, advance: 56000, paymentHistory: [
    { month: "Mar 2026", amount: 28000, date: "—", status: "Due" },
    { month: "Feb 2026", amount: 28000, date: "Feb 2", status: "Paid" },
    { month: "Jan 2026", amount: 28000, date: "Jan 1", status: "Paid" },
    { month: "Dec 2025", amount: 28000, date: "Dec 2", status: "Paid" },
    { month: "Nov 2025", amount: 28000, date: "Nov 3", status: "Paid" },
    { month: "Oct 2025", amount: 28000, date: "Oct 1", status: "Paid" },
  ]},
];

const rentPayments = [
  { tenant: "Rahim Uddin", flat: "A1", building: "Sunset Tower", amount: 20000, month: "March 2026", date: "Mar 1", method: "bKash", status: "paid" },
  { tenant: "Sumaiya Khan", flat: "A2", building: "Sunset Tower", amount: 18000, month: "March 2026", date: "Mar 2", method: "Nagad", status: "paid" },
  { tenant: "Kamal Hossain", flat: "B1", building: "Sunset Tower", amount: 22000, month: "March 2026", date: "—", method: "—", status: "due" },
  { tenant: "Nadia Islam", flat: "B2", building: "Sunset Tower", amount: 25000, month: "March 2026", date: "Mar 3", method: "Bank", status: "paid" },
  { tenant: "Arif Rahman", flat: "C1", building: "Sunset Tower", amount: 20000, month: "March 2026", date: "—", method: "—", status: "due" },
  { tenant: "Fatema Begum", flat: "C2", building: "Green Heights", amount: 15000, month: "March 2026", date: "Mar 4", method: "Cash", status: "paid" },
  { tenant: "Shakil Ahmed", flat: "D1", building: "Green Heights", amount: 30000, month: "March 2026", date: "Mar 1", method: "bKash", status: "paid" },
  { tenant: "Riya Chowdhury", flat: "D2", building: "City View Apt", amount: 28000, month: "March 2026", date: "—", method: "—", status: "due" },
];

const advanceRecords = [
  { tenant: "Rahim Uddin", unit: "A1", amount: 40000, date: "Oct 2021", adjustmentStatus: "Partially Adjusted", notes: "2 months adjusted" },
  { tenant: "Sumaiya Khan", unit: "A2", amount: 36000, date: "Jan 2022", adjustmentStatus: "Not Adjusted", notes: "—" },
  { tenant: "Kamal Hossain", unit: "B1", amount: 44000, date: "Mar 2022", adjustmentStatus: "Fully Adjusted", notes: "Completed" },
  { tenant: "Nadia Islam", unit: "B2", amount: 50000, date: "Jun 2022", adjustmentStatus: "Partially Adjusted", notes: "1 month adjusted" },
  { tenant: "Fatema Begum", unit: "C2", amount: 30000, date: "Nov 2022", adjustmentStatus: "Not Adjusted", notes: "—" },
  { tenant: "Shakil Ahmed", unit: "D1", amount: 60000, date: "Feb 2023", adjustmentStatus: "Partially Adjusted", notes: "3 months adjusted" },
];

const expensesList = [
  { date: "Mar 5", desc: "Generator maintenance", amount: 8500, category: "Maintenance", building: "Sunset Tower", addedBy: "Rahman" },
  { date: "Mar 3", desc: "Lift repair", amount: 15000, category: "Repair", building: "Green Heights", addedBy: "Rahman" },
  { date: "Feb 28", desc: "Common area cleaning", amount: 3000, category: "Cleaning", building: "Sunset Tower", addedBy: "Esrar" },
  { date: "Feb 25", desc: "Security guard salary", amount: 12000, category: "Salary", building: "All", addedBy: "Rahman" },
  { date: "Feb 20", desc: "Water pump repair", amount: 5500, category: "Repair", building: "River View", addedBy: "Esrar" },
  { date: "Feb 15", desc: "Electricity bill", amount: 5500, category: "Utilities", building: "Sunset Tower", addedBy: "Rahman" },
  { date: "Mar 8", desc: "Painting staircase", amount: 6000, category: "Maintenance", building: "Green Heights", addedBy: "Esrar" },
  { date: "Mar 10", desc: "Plumber visit", amount: 2500, category: "Repair", building: "City View Apt", addedBy: "Rahman" },
  { date: "Mar 12", desc: "Electricity bill", amount: 9800, category: "Utilities", building: "Sunset Tower", addedBy: "Rahman" },
  { date: "Mar 14", desc: "Guard uniform", amount: 3200, category: "Salary", building: "Sunset Tower", addedBy: "Esrar" },
];

const sentReminders = [
  { date: "Mar 8", tenant: "Kamal Hossain", flat: "B1", type: "Rent", message: "Your rent for March is due", status: "Delivered" },
  { date: "Mar 7", tenant: "Arif Rahman", flat: "C1", type: "Rent", message: "Rent reminder for March", status: "Delivered" },
  { date: "Mar 5", tenant: "Riya Chowdhury", flat: "D2", type: "Rent", message: "March rent payment pending", status: "Read" },
  { date: "Mar 3", tenant: "Kamal Hossain", flat: "B1", type: "Advance", message: "Advance adjustment update", status: "Delivered" },
  { date: "Mar 1", tenant: "Fatema Begum", flat: "C2", type: "Rent", message: "Rent due reminder", status: "Read" },
];

const catColors: Record<string, string> = {
  Maintenance: "bg-blue-100 text-blue-700",
  Repair: "bg-orange-100 text-orange-700",
  Cleaning: "bg-green-100 text-green-700",
  Salary: "bg-purple-100 text-purple-700",
  Utilities: "bg-amber-100 text-amber-700",
};

const sidebarKeys = [
  { icon: BarChart3, key: "dash.dashboard" },
  { icon: Home, key: "pm.myProperties" },
  { icon: LayoutGrid, key: "pm.units" },
  { icon: Users, key: "dash.tenantsTab" },
  { icon: DollarSign, key: "dash.rentPayments" },
  { icon: FileText, key: "pm.advanceMoney" },
  { icon: FileText, key: "dash.expenses" },
  { icon: FileCheck, key: "pm.invoices" },
  { icon: ArrowUpCircle, key: "pm.accountPayable" },
  { icon: ArrowDownCircle, key: "pm.accountReceivable" },
  { icon: Settings, key: "dash.settings" },
];

const PropertyManagement = () => {
  const [activeTab, setActiveTab] = useState("dash.dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState<typeof tenantsList[0] | null>(null);
  const { t } = useLanguage();

  const renderContent = () => {
    switch (activeTab) {
      case "dash.dashboard": return <DashboardContent />;
      case "pm.myProperties": return <PropertiesContent />;
      case "pm.units": return <UnitsContent />;
      case "dash.tenantsTab": return <TenantsContent onSelectTenant={setSelectedTenant} />;
      case "dash.rentPayments": return <RentPaymentsContent />;
      case "pm.advanceMoney": return <AdvanceMoneyContent />;
      case "dash.expenses": return <ExpensesContent />;
      case "pm.invoices": return <InvoicesContent />;
      case "pm.accountPayable": return <AccountPayableContent />;
      case "pm.accountReceivable": return <AccountReceivableContent />;
      case "dash.settings": return <SettingsContent />;
      default: return null;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-60px)]" style={{ background: '#F8F9FA' }}>
      <aside
        className={`${sidebarOpen ? "w-[220px]" : "w-0 overflow-hidden"} transition-all duration-300 flex flex-col flex-shrink-0 fixed left-0 z-20 lg:block`}
        style={{ background: '#1A1D23', top: '60px', height: 'calc(100vh - 60px)' }}
      >
        <div className="px-4 pt-3 pb-2">
          <Link to="/" className="flex items-center gap-2">
            <img src="/src/assets/rento-logo.png" alt="Rento" className="h-7 rounded-lg" />
            <span className="text-sm font-heading font-bold text-white">Rento</span>
          </Link>
        </div>
        <div className="mx-3 mb-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <nav className="flex-1 px-1 py-1 overflow-y-auto">
          {sidebarKeys.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className="w-full flex items-center gap-[10px] rounded-lg transition-colors"
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                lineHeight: '1.2',
                background: activeTab === item.key ? '#3B5BDB' : 'transparent',
                color: activeTab === item.key ? '#FFFFFF' : 'rgba(255,255,255,0.72)',
                borderLeft: activeTab === item.key ? '3px solid #7B9CFF' : '3px solid transparent',
              }}
              onMouseEnter={(e) => { if (activeTab !== item.key) e.currentTarget.style.background = 'rgba(59,91,219,0.12)'; }}
              onMouseLeave={(e) => { if (activeTab !== item.key) e.currentTarget.style.background = 'transparent'; }}
            >
              <item.icon style={{ width: '15px', height: '15px' }} />
              {t(item.key)}
            </button>
          ))}
        </nav>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: '#3B5BDB' }}>MR</div>
            <span className="text-white text-xs">M. Rahman</span>
          </div>
          <Link to="/" className="flex items-center gap-2 text-xs transition-colors" style={{ color: 'rgba(255,255,255,0.72)' }}>
            <LogOut style={{ width: '15px', height: '15px' }} />
            {t("dash.logout")}
          </Link>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col min-w-0 ${sidebarOpen ? "ml-[220px]" : ""} transition-all duration-300`}>
        <header className="h-12 bg-white flex items-center justify-between px-5 flex-shrink-0 sticky top-0 z-10" style={{ borderBottom: '1px solid #DEE2E6' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors lg:hidden">
              <Menu className="h-4 w-4" style={{ color: '#868E96' }} />
            </button>
            <span className="text-sm" style={{ color: '#868E96' }}>{t("pm.propertyManagement")}</span>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
      </div>

      {/* Tenant Detail Slide Panel */}
      {selectedTenant && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedTenant(null)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative w-full max-w-md bg-white h-full shadow-xl overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-[#F1F3F5] flex items-center justify-between">
              <h2 className="font-heading font-bold text-foreground">{selectedTenant.name}</h2>
              <button onClick={() => setSelectedTenant(null)} className="p-1 hover:bg-secondary rounded-lg" aria-label="Close panel"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><span className="text-muted-foreground">{t("auth.phoneNumber")}</span><p className="font-medium text-foreground">{selectedTenant.phone}</p></div>
                <div><span className="text-muted-foreground">{t("dash.flat")}</span><p className="font-medium text-foreground">{selectedTenant.flat}</p></div>
                <div><span className="text-muted-foreground">{t("dash.building")}</span><p className="font-medium text-foreground">{selectedTenant.building}</p></div>
                <div><span className="text-muted-foreground">{t("bm.moveIn")}</span><p className="font-medium text-foreground">{selectedTenant.moveIn}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F8F9FA] rounded-xl p-3">
                  <span className="text-[11px] text-muted-foreground">{t("bm.totalPaidYear")}</span>
                  <p className="text-lg font-bold text-foreground">৳{selectedTenant.totalPaid.toLocaleString()}</p>
                </div>
                <div className="bg-[#F8F9FA] rounded-xl p-3">
                  <span className="text-[11px] text-muted-foreground">{t("bm.advanceHeld")}</span>
                  <p className="text-lg font-bold text-foreground">৳{selectedTenant.advance.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{t("bm.paymentHistory")}</h3>
                <div className="space-y-2">
                  {selectedTenant.paymentHistory.map((ph, i) => (
                    <div key={i} className="flex items-center justify-between text-xs bg-[#F8F9FA] rounded-lg px-3 py-2">
                      <span className="text-foreground font-medium">{ph.month}</span>
                      <span className="text-muted-foreground">৳{ph.amount.toLocaleString()}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${ph.status === "Paid" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>{ph.status}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 h-9 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90">{t("bm.editTenant")}</button>
                <button className="flex-1 h-9 border border-destructive text-destructive text-xs font-medium rounded-lg hover:bg-destructive/5">{t("bm.removeTenant")}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Tab Contents ────────────────────────────────────────

const DashboardContent = () => {
  const { t } = useLanguage();
  const { currentOrg } = useAuth();
  const { data: dashboard, isLoading, error } = useDashboard(currentOrg);
  const { data: buildings } = useBuildings(currentOrg);
  const { data: tenants } = useTenants(currentOrg);

  // Debug - remove after testing
  console.log('Dashboard debug:', { currentOrg, dashboard, buildings: buildings?.data, tenants: tenants?.data, error });

  const buildingsCount = buildings?.data?.length || 0;
  const tenantsCount = tenants?.data?.length || 0;
  const dashBuildings = dashboard?.buildings || 0;
  const dashPayments = dashboard?.totalPaymentsCollected || 0;
  const dashTenants = dashboard?.activeTenants || 0;
  const dashVacant = dashboard?.vacantUnits || 0;

const stats = [
    { label: t("pm.myPropertiesLabel"), value: String(dashBuildings > 0 ? dashBuildings : buildingsCount), sub: t("pm.across4"), icon: Home, iconBg: "bg-blue-100 text-blue-600" },
    { label: t("pm.monthlyIncome"), value: `৳${dashPayments > 0 ? dashPayments.toLocaleString() : "0"}`, sub: t("dash.thisMonth"), icon: TrendingUp, iconBg: "bg-green-100 text-green-600" },
    { label: t("pm.activeTenants"), value: String(dashTenants > 0 ? dashTenants : tenantsCount), sub: t("pm.allActive"), icon: Users, iconBg: "bg-primary/10 text-primary" },
    { label: t("pm.pendingDues"), value: String(dashVacant), sub: t("pm.actionNeeded"), icon: TrendingDown, iconBg: "bg-red-100 text-red-600" },
  ];

  if (isLoading || !currentOrg) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-heading font-bold text-foreground">{t("dash.dashboard")}</h1>
        <p className="text-sm text-muted-foreground">{t("pm.overviewProperties")}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-[#F1F3F5] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
              <div className={`w-9 h-9 rounded-xl ${s.iconBg} flex items-center justify-center`}><s.icon className="h-4 w-4" /></div>
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#F1F3F5] shadow-sm p-5">
          <h3 className="font-heading font-semibold text-foreground text-sm mb-4">{t("pm.incomeTrend")}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#ADB5BD" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#ADB5BD" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip formatter={(v: number) => [`৳${v.toLocaleString()}`, ""]} />
              <Legend iconType="circle" iconSize={8} formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>} />
              <Bar dataKey="collected" name={t("dash.collected")} fill="#2F9E44" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="due" name={t("dash.due")} fill="#E03131" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F1F3F5] shadow-sm p-5">
          <h3 className="font-heading font-semibold text-foreground text-sm mb-4">{t("dash.expenseBreakdown")}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={expensePieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={2}>
                {expensePieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`৳${v.toLocaleString()}`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2 justify-center">
            {expensePieData.map(d => (
              <span key={d.name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                {d.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PropertiesContent = () => {
  const { t } = useLanguage();
  const { currentOrg } = useAuth();
  const { data: buildings, isLoading, error } = useBuildings(currentOrg);
  const createBuilding = useCreateBuilding(currentOrg);
  const deleteBuilding = useDeleteBuilding(currentOrg);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBuildingName, setNewBuildingName] = useState("");
  const [newBuildingAddress, setNewBuildingAddress] = useState("");

  const handleAddBuilding = async () => {
    if (!newBuildingName.trim()) {
      toast.error("Building name is required");
      return;
    }
    try {
      await createBuilding.mutateAsync({
        name: newBuildingName,
        address: newBuildingAddress,
      });
      toast.success(t("bm.success") || "Building added successfully");
      setShowAddModal(false);
      setNewBuildingName("");
      setNewBuildingAddress("");
    } catch (err: any) {
      toast.error(err.message || "Failed to add building");
    }
  };

  if (isLoading || !currentOrg) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-heading font-bold text-foreground">{t("pm.myProperties")}</h1>
            <p className="text-sm text-muted-foreground">{t("pm.manageRentals")}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-destructive p-8 text-center">
          <p className="text-destructive">Failed to load properties: {error.message}</p>
        </div>
      </div>
    );
  }

  const propertyList = buildings?.data || [];
  const { data: allUnitsData } = useUnits();
  const allUnitsList = allUnitsData?.data || [];

  const getUnitCounts = (buildingId: string) => {
    const buildingUnits = allUnitsList.filter((u: any) => u.building_id === buildingId);
    const total = buildingUnits.length;
    const occupied = buildingUnits.filter((u: any) => u.status === "occupied").length;
    const vacant = total - occupied;
    return { total, occupied, vacant };
  };

  console.log('Properties debug:', { currentOrg, buildings, propertyList, isLoading, error });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">{t("pm.myProperties")}</h1>
          <p className="text-sm text-muted-foreground">{t("pm.manageRentals")}</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> {t("pm.addProperty")}
        </button>
      </div>
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">{t("pm.addProperty") || "Add New Property"}</h3>
            <div>
              <label className="text-sm font-medium">{t("pm.propertyName") || "Property Name"}</label>
              <input
                type="text"
                value={newBuildingName}
                onChange={(e) => setNewBuildingName(e.target.value)}
                className="w-full h-10 rounded-lg border border-input px-3 text-sm mt-1"
                placeholder="Building name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t("bm.address") || "Address"}</label>
              <input
                type="text"
                value={newBuildingAddress}
                onChange={(e) => setNewBuildingAddress(e.target.value)}
                className="w-full h-10 rounded-lg border border-input px-3 text-sm mt-1"
                placeholder="Address"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBuilding}
                disabled={createBuilding.isPending}
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg disabled:opacity-50"
              >
                {createBuilding.isPending ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-2xl border border-[#F1F3F5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#F8F9FA]">
              {[t("pm.propertyName"), t("bm.address"), t("pm.totalUnits"), t("dash.occupied"), t("dash.vacant"), t("dash.actions")].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-foreground text-xs">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {propertyList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No properties yet. Click "Add Property" to create one.
                  </td>
                </tr>
              ) : (
                propertyList.map((p: any) => {
                  const counts = getUnitCounts(p.id);
                  return (
                  <tr key={p.id} className="border-t border-[#F1F3F5] hover:bg-[#F8F9FA] transition-colors">
                    <td className="p-3 text-foreground text-xs font-medium">{p.name}</td>
                    <td className="p-3 text-muted-foreground text-xs">{p.address || "-"}</td>
                    <td className="p-3 text-foreground text-xs">{counts.total}</td>
                    <td className="p-3 text-foreground text-xs">{counts.occupied}</td>
                    <td className="p-3 text-foreground text-xs">{counts.vacant}</td>
                    <td className="p-3 flex gap-2">
                      <Link to={`/management/property/${p.id}`} className="text-xs text-primary hover:underline flex items-center gap-1"><Eye className="h-3 w-3" />{t("bm.view")}</Link>
                      <Link to={`/management/property/${p.id}/edit`} className="text-xs text-muted-foreground hover:underline flex items-center gap-1"><Edit className="h-3 w-3" />{t("bm.edit")}</Link>
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const UnitsContent = () => {
  const { t } = useLanguage();
  const { currentOrg } = useAuth();
  
  // DEBUG: Test translations
  const testKeys = ["pm.addUnit", "dash.tenant", "bm.view", "bm.cancel", "dash.dashboard"];
  console.log("DEBUG: Current lang:", "en", "Testing translations:", testKeys.map(k => `${k}: ${t(k)}`));
  
  const [buildingFilter, setBuildingFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUnit, setNewUnit] = useState({ building_id: "", unit_number: "", floor: 0, size_sqft: 0, rent_amount: 0 });
  const { data: unitsData, isLoading } = useUnits();
  const { data: buildings } = useBuildings(currentOrg);
  const createUnit = useCreateUnit();

  const handleAddUnit = async () => {
    if (!newUnit.building_id || !newUnit.unit_number) {
      toast.error("Building and unit number are required");
      return;
    }
    try {
      await createUnit.mutateAsync({
        unit_number: newUnit.unit_number,
        building_id: newUnit.building_id,
        floor: newUnit.floor || undefined,
        size_sqft: newUnit.size_sqft || undefined,
        rent_amount: newUnit.rent_amount || undefined,
        status: 'vacant'
      });
      toast.success(t("bm.success") || "Unit added successfully");
      setShowAddModal(false);
      setNewUnit({ building_id: "", unit_number: "", floor: 0 as any, size_sqft: 0, rent_amount: 0 });
    } catch (err: any) {
      toast.error(err.message || "Failed to add unit");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  const buildingsList = buildings?.data || [];
  const getBuildingName = (id: string) => buildingsList.find((b: any) => b.id === id)?.name || "—";

  const allUnits = unitsData?.data || [];

  const filtered = allUnits.filter((f: any) => {
    const matchesBuilding = buildingFilter === "All" || f.building_id === buildingFilter;
    const matchesStatus = statusFilter === "All" || f.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesBuilding && matchesStatus;
  });
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">{t("pm.units")}</h1>
          <p className="text-sm text-muted-foreground">{t("dash.allUnits")}</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="h-3.5 w-3.5" /> {t("pm.addUnit")}
        </button>
      </div>
      <div className="flex gap-3">
        <select value={buildingFilter} onChange={e => setBuildingFilter(e.target.value)} className="h-9 rounded-lg border border-input bg-background px-3 text-xs">
          <option value="All">{t("bm.allBuildings")}</option>
          {buildingsList.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 rounded-lg border border-input bg-background px-3 text-xs">
          <option value="All">{t("bm.allStatus")}</option>
          <option value="Occupied">{t("dash.occupied")}</option>
          <option value="Vacant">{t("dash.vacant")}</option>
        </select>
      </div>
      <div className="bg-white rounded-2xl border border-[#F1F3F5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#F8F9FA]">
              {[t("bm.flatNo"), t("pm.property"), t("bm.floor"), t("bm.sizeSqft"), t("bm.rentBDT"), t("dash.status"), t("dash.tenant"), t("dash.actions")].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-foreground text-xs">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((f, i) => (
                <tr key={i} className="border-t border-[#F1F3F5] hover:bg-[#F8F9FA] transition-colors">
                  <td className="p-3 text-foreground text-xs font-medium">{f.unit_number}</td>
                  <td className="p-3 text-muted-foreground text-xs">{getBuildingName(f.building_id)}</td>
                  <td className="p-3 text-muted-foreground text-xs">{f.floor || "—"}</td>
                  <td className="p-3 text-muted-foreground text-xs">{f.size_sqft || "—"}</td>
                  <td className="p-3 text-foreground text-xs font-medium">৳{(f.rent_amount || 0).toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${f.status === "occupied" ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-600"}`}>
                      {f.status === "occupied" ? t("dash.occupied") : t("dash.vacant")}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground text-xs">—</td>
                  <td className="p-3"><Link to={`/management/unit/${f.id}`} className="text-xs text-primary hover:underline">{f.status === "occupied" ? t("bm.view") : t("bm.assign")}</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">{t("pm.addUnit")}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("pm.property")}</label>
                <select
                  value={newUnit.building_id}
                  onChange={(e) => setNewUnit({ ...newUnit, building_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select building</option>
                  {buildings?.data?.map((b: any) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("bm.flatNo")}</label>
                <input
                  type="text"
                  value={newUnit.unit_number}
                  onChange={(e) => setNewUnit({ ...newUnit, unit_number: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., A-101"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("bm.floor")}</label>
                <input
                  type="text"
                  value={newUnit.floor}
                  onChange={(e) => setNewUnit({ ...newUnit, floor: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("bm.sizeSqft")}</label>
                <input
                  type="number"
                  value={newUnit.size_sqft || ""}
                  onChange={(e) => setNewUnit({ ...newUnit, size_sqft: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Square feet"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("bm.rentBDT")}</label>
                <input
                  type="number"
                  value={newUnit.rent_amount || ""}
                  onChange={(e) => setNewUnit({ ...newUnit, rent_amount: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Monthly rent in BDT"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                {t("bm.cancel")}
              </button>
              <button
                onClick={handleAddUnit}
                disabled={createUnit.isPending}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {createUnit.isPending ? "..." : t("bm.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TenantsContent = ({ onSelectTenant }: { onSelectTenant: (t: any) => void }) => {
  const { t } = useLanguage();
  const { currentOrg } = useAuth();
  const { data: tenants, isLoading, error } = useTenants(currentOrg);
  const createTenant = useCreateTenant();
  const deleteTenant = useDeleteTenant();
  const { data: units } = useUnits();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTenant, setNewTenant] = useState({ name: "", phone: "", unit_id: "" });

  const handleAddTenant = async () => {
    if (!newTenant.name.trim() || !newTenant.unit_id) {
      toast.error("Name and unit are required");
      return;
    }
    try {
      await createTenant.mutateAsync({
        name: newTenant.name,
        phone: newTenant.phone,
        unit_id: newTenant.unit_id,
      });
      toast.success(t("bm.success") || "Tenant added successfully");
      setShowAddModal(false);
      setNewTenant({ name: "", phone: "", unit_id: "" });
    } catch (err: any) {
      toast.error(err.message || "Failed to add tenant");
    }
  };

  const handleDeleteTenant = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this tenant?")) return;
    try {
      await deleteTenant.mutateAsync(id);
      toast.success(t("bm.success") || "Tenant deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete tenant");
    }
  };

  if (isLoading || !currentOrg) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-7 w-48 mb-1" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-8 w-36" />
        </div>
        <div className="bg-white rounded-2xl border border-[#F1F3F5] p-4">
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-heading font-bold text-foreground">{t("dash.tenantsTab")}</h1>
            <p className="text-sm text-muted-foreground">{t("dash.allTenants")}</p>
          </div>
          <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            <Plus className="h-3.5 w-3.5" /> {t("dash.addTenant")}
          </button>
        </div>
        <div className="bg-white rounded-2xl border border-[#F1F3F5] shadow-sm p-8 text-center">
          <p className="text-destructive">{t("bm.errorLoading") || "Failed to load tenants"}</p>
        </div>
      </div>
    );
  }

  const tenantList = tenants?.data || [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">{t("dash.tenantsTab")}</h1>
          <p className="text-sm text-muted-foreground">{t("dash.allTenants")}</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          disabled={createTenant.isPending}
          className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {createTenant.isPending ? (
            <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
          {t("dash.addTenant")}
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-[#F1F3F5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#F8F9FA]">
              {[t("dash.name"), t("bm.flatNo"), t("pm.property"), t("auth.phoneNumber"), t("bm.moveIn"), t("bm.monthlyRent"), t("dash.status"), t("dash.actions")].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-foreground text-xs">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {tenantList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    {t("bm.noData") || "No tenants found"}
                  </td>
                </tr>
              ) : (
                tenantList.map((tt: any, i: number) => (
                  <tr key={tt.id || i} className="border-t border-[#F1F3F5] hover:bg-[#F8F9FA] transition-colors">
                    <td className="p-3 text-foreground text-xs font-medium">{tt.name}</td>
                    <td className="p-3 text-muted-foreground text-xs">{tt.unit_number || tt.flat || "—"}</td>
                    <td className="p-3 text-muted-foreground text-xs">—</td>
                    <td className="p-3 text-muted-foreground text-xs">{tt.phone || "—"}</td>
                    <td className="p-3 text-muted-foreground text-xs">{tt.move_in_date ? new Date(tt.move_in_date).toLocaleDateString() : "—"}</td>
                    <td className="p-3 text-foreground text-xs font-medium">BDT {tt.rent_amount?.toLocaleString() || "—"}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${tt.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'}`}>
                        {tt.status || "Active"}
                      </span>
                    </td>
                    <td className="p-3">
                      <Link to={`/management/tenant/${tt.id}`} className="text-xs text-primary hover:underline mr-2">{t("bm.view")}</Link>
                      <button 
                        onClick={() => tt.id && handleDeleteTenant(tt.id)} 
                        className="text-xs text-destructive hover:underline"
                        disabled={deleteTenant.isPending}
                      >
                        {t("bm.delete")}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">{t("dash.addTenant")}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("auth.name")}</label>
                <input
                  type="text"
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter tenant name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("auth.phoneNumber")}</label>
                <input
                  type="tel"
                  value={newTenant.phone}
                  onChange={(e) => setNewTenant({ ...newTenant, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("bm.flatNo")}</label>
                <select
                  value={newTenant.unit_id}
                  onChange={(e) => setNewTenant({ ...newTenant, unit_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select unit</option>
                  {units?.data?.map((u: any) => (
                    <option key={u.id} value={u.id}>{u.unit_number || u.flat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                {t("bm.cancel")}
              </button>
              <button
                onClick={handleAddTenant}
                disabled={createTenant.isPending}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {createTenant.isPending ? "..." : t("bm.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RentPaymentsContent = () => {
  const { t } = useLanguage();
  const { currentOrg } = useAuth();
  const { data: payments, isLoading: paymentsLoading } = usePayments(currentOrg);
  const createPayment = useCreatePayment();
  const { data: tenantsData } = useTenants(currentOrg);
  const { data: unitsData } = useUnits(currentOrg || undefined);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPayment, setNewPayment] = useState({ tenant_id: "", unit_id: "", amount: "", month: "", method: "bank_transfer" });

  const tenants = tenantsData?.data || [];
  const units = unitsData?.data || [];
  const paymentsList = payments?.data || [];

  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  const monthPayments = paymentsList.filter((p: any) => p.month === currentMonth);
  const totalCollectable = monthPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
  const collected = monthPayments.filter((p: any) => p.status === 'paid').reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
  const due = totalCollectable - collected;

  const handleAddPayment = async () => {
    if (!newPayment.tenant_id || !newPayment.unit_id || !newPayment.amount || !newPayment.month) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await createPayment.mutateAsync({
        tenant_id: newPayment.tenant_id,
        unit_id: newPayment.unit_id,
        amount: parseFloat(newPayment.amount),
        type: "rent",
        month: newPayment.month,
        method: newPayment.method,
      });
      toast.success("Payment recorded successfully");
      setShowAddModal(false);
      setNewPayment({ tenant_id: "", unit_id: "", amount: "", month: "", method: "bank_transfer" });
    } catch (err: any) {
      toast.error(err.message || "Failed to record payment");
    }
  };

  if (paymentsLoading || !currentOrg) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">{t("dash.rentPayments")}</h1>
          <p className="text-sm text-muted-foreground">{t("dash.trackTransactions")}</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="h-3.5 w-3.5" /> {t("dash.recordPayment")}
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {[
          { label: t("bm.totalCollectable"), value: `৳${totalCollectable.toLocaleString()}`, color: "text-foreground" },
          { label: t("dash.collected"), value: `৳${collected.toLocaleString()}`, color: "text-primary" },
          { label: t("dash.due"), value: `৳${due.toLocaleString()}`, color: "text-destructive" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-[#F1F3F5] shadow-sm">
            <span className="text-xs text-muted-foreground">{s.label}</span>
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-[#F1F3F5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#F8F9FA]">
              {[t("dash.tenant"), t("dash.flat"), t("pm.property"), t("bm.rentAmount"), t("bm.month"), t("bm.paymentDate"), t("dash.method"), t("dash.status"), t("dash.actions")].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-foreground text-xs">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {paymentsList.length === 0 ? (
                <tr><td colSpan={9} className="p-8 text-center text-muted-foreground">No payments found</td></tr>
              ) : (
                paymentsList.map((p: any) => (
                  <tr key={p.id} className="border-t border-[#F1F3F5] hover:bg-[#F8F9FA] transition-colors">
                    <td className="p-3 text-foreground text-xs font-medium">{p.tenant_name || "—"}</td>
                    <td className="p-3 text-muted-foreground text-xs">{p.unit_number || "—"}</td>
                    <td className="p-3 text-muted-foreground text-xs">—</td>
                    <td className="p-3 text-foreground text-xs font-medium">BDT {p.amount?.toLocaleString() || 0}</td>
                    <td className="p-3 text-muted-foreground text-xs">{p.month}</td>
                    <td className="p-3 text-muted-foreground text-xs">{p.paid_at ? new Date(p.paid_at).toLocaleDateString() : "—"}</td>
                    <td className="p-3 text-muted-foreground text-xs">{p.method}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${p.status === "paid" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                        {p.status === "paid" ? t("dash.paid") : t("dash.due")}
                      </span>
                    </td>
                    <td className="p-3">
                      {p.status === "paid" ? (
                        <button className="text-[11px] bg-primary/10 text-primary px-2.5 py-1 rounded-md font-medium">{t("bm.receipt")}</button>
                      ) : (
                        <button onClick={() => toast.success(`Reminder sent to ${p.tenant_name}`)} className="text-[11px] bg-amber-100 text-amber-700 px-2.5 py-1 rounded-md font-medium">{t("bm.remind")}</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">Record Payment</h3>
            <div>
              <label className="text-sm font-medium">Tenant</label>
              <select
                value={newPayment.tenant_id}
                onChange={(e) => setNewPayment({ ...newPayment, tenant_id: e.target.value })}
                className="w-full h-10 rounded-lg border border-input px-3 text-sm mt-1"
              >
                <option value="">Select tenant</option>
                {tenants.map((t: any) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Unit</label>
              <select
                value={newPayment.unit_id}
                onChange={(e) => setNewPayment({ ...newPayment, unit_id: e.target.value })}
                className="w-full h-10 rounded-lg border border-input px-3 text-sm mt-1"
              >
                <option value="">Select unit</option>
                {units.map((u: any) => (
                  <option key={u.id} value={u.id}>{u.unit_number}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Amount</label>
              <input
                type="number"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                className="w-full h-10 rounded-lg border border-input px-3 text-sm mt-1"
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Month</label>
              <input
                type="month"
                value={newPayment.month}
                onChange={(e) => setNewPayment({ ...newPayment, month: e.target.value })}
                className="w-full h-10 rounded-lg border border-input px-3 text-sm mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Method</label>
              <select
                value={newPayment.method}
                onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
                className="w-full h-10 rounded-lg border border-input px-3 text-sm mt-1"
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
                <option value="cash">Cash</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPayment}
                disabled={createPayment.isPending}
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {createPayment.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdvanceMoneyContent = () => {
  const { t } = useLanguage();
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">{t("pm.advanceMoney")}</h1>
          <p className="text-sm text-muted-foreground">{t("pm.advanceMoneyDesc")}</p>
        </div>
        <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="h-3.5 w-3.5" /> {t("pm.addAdvance")}
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-[#F1F3F5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#F8F9FA]">
              {[t("dash.tenant"), t("pm.unit"), t("pm.advanceAmount"), t("pm.dateReceived"), t("pm.adjustmentStatus"), t("pm.notes")].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-foreground text-xs">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {advanceRecords.map((ar, i) => (
                <tr key={i} className="border-t border-[#F1F3F5] hover:bg-[#F8F9FA] transition-colors">
                  <td className="p-3 text-foreground text-xs font-medium">{ar.tenant}</td>
                  <td className="p-3 text-muted-foreground text-xs">{ar.unit}</td>
                  <td className="p-3 text-foreground text-xs font-medium">BDT {ar.amount.toLocaleString()}</td>
                  <td className="p-3 text-muted-foreground text-xs">{ar.date}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                      ar.adjustmentStatus === "Fully Adjusted" ? "bg-primary/10 text-primary" :
                      ar.adjustmentStatus === "Partially Adjusted" ? "bg-amber-100 text-amber-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>{ar.adjustmentStatus}</span>
                  </td>
                  <td className="p-3 text-muted-foreground text-xs">{ar.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ExpensesContent = () => {
  const { t } = useLanguage();
  const { currentOrg } = useAuth();
  const [catFilter, setCatFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({ description: "", amount: "", category: "Maintenance", building_id: "", date: new Date().toISOString().split("T")[0] });
  const { data: expenses, isLoading, error } = useExpenses(currentOrg);
  const { data: buildings } = useBuildings(currentOrg);
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();
  const categories = ["All", "Maintenance", "Repair", "Salary", "Utilities", "Cleaning"];

  const handleAddExpense = async () => {
    if (!newExpense.description.trim() || !newExpense.amount) {
      toast.error("Description and amount are required");
      return;
    }
    try {
      await createExpense.mutateAsync({
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        building_id: newExpense.building_id || undefined,
        date: newExpense.date,
        added_by: "Admin",
      });
      toast.success(t("dash.expenseAdded") || "Expense added successfully");
      setShowAddModal(false);
      setNewExpense({ description: "", amount: "", category: "Maintenance", building_id: "", date: new Date().toISOString().split("T")[0] });
    } catch (err: any) {
      toast.error(err.message || "Failed to add expense");
    }
  };

  const expensesData = expenses?.data || [];
  const filtered = catFilter === "All" ? expensesData : expensesData.filter((e: any) => e.category === catFilter);
  const total = filtered.reduce((s: number, e: any) => s + (e.amount || 0), 0);

  const handleAdd = () => {
    setShowAddModal(true);
  };

  if (isLoading || !currentOrg) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-7 w-32 mb-1" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-8 w-36" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-7 w-24" />
        </div>
        <div className="bg-white rounded-2xl border border-[#F1F3F5] p-4">
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-heading font-bold text-foreground">{t("dash.expenses")}</h1>
            <p className="text-sm text-muted-foreground">{t("dash.trackExpenses")}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-destructive p-8 text-center">
          <p className="text-destructive">Failed to load expenses: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">{t("dash.expenses")}</h1>
          <p className="text-sm text-muted-foreground">{t("dash.trackExpenses")}</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="h-3.5 w-3.5" /> {t("dash.addExpense")}
        </button>
      </div>
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">{t("dash.addExpense") || "Add New Expense"}</h3>
            <div>
              <label className="text-sm font-medium">{t("dash.description") || "Description"}</label>
              <input
                type="text"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                className="w-full h-10 rounded-lg border border-input px-3 text-sm mt-1"
                placeholder="Enter description"
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t("dash.amount") || "Amount"}</label>
              <input
                type="number"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                className="w-full h-10 rounded-lg border border-input px-3 text-sm mt-1"
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t("dash.category") || "Category"}</label>
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                className="w-full h-10 rounded-lg border border-input px-3 text-sm mt-1"
              >
                {categories.filter(c => c !== "All").map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">{t("pm.property") || "Property"}</label>
              <select
                value={newExpense.building_id}
                onChange={(e) => setNewExpense({ ...newExpense, building_id: e.target.value })}
                className="w-full h-10 rounded-lg border border-input px-3 text-sm mt-1"
              >
                <option value="">All Buildings</option>
                {(buildings?.data || []).map((b: any) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">{t("dash.date") || "Date"}</label>
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                className="w-full h-10 rounded-lg border border-input px-3 text-sm mt-1"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg">
                {t("cm.cancel") || "Cancel"}
              </button>
              <button onClick={handleAddExpense} disabled={createExpense.isPending} className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
                {createExpense.isPending ? t("cm.saving") || "Saving..." : t("cm.save") || "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-2">
        {categories.map(c => (
          <button key={c} onClick={() => setCatFilter(c)} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${catFilter === c ? "bg-primary text-white" : "bg-white border border-input text-muted-foreground hover:bg-secondary"}`}>
            {c === "All" ? t("bm.allCategories") : c}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-[#F1F3F5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#F8F9FA]">
              {[t("dash.date"), t("dash.description"), t("dash.amount"), t("dash.category"), t("pm.property"), t("bm.addedBy")].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-foreground text-xs">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((e: any, i: number) => (
                <tr key={i} className="border-t border-[#F1F3F5] hover:bg-[#F8F9FA] transition-colors">
                  <td className="p-3 text-muted-foreground text-xs">{e.date}</td>
                  <td className="p-3 text-foreground text-xs font-medium">{e.description}</td>
                  <td className="p-3 text-foreground text-xs font-medium">BDT {(e.amount || 0).toLocaleString()}</td>
                  <td className="p-3"><span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${catColors[e.category] || "bg-gray-100 text-gray-700"}`}>{e.category}</span></td>
                  <td className="p-3 text-muted-foreground text-xs">{e.building_name || "—"}</td>
                  <td className="p-3 text-muted-foreground text-xs">{e.added_by || "—"}</td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground text-xs">{t("dash.noData") || "No data found"}</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-[#F1F3F5] flex justify-end">
          <span className="text-sm font-bold text-foreground">{t("bm.totalExpenses")}: BDT {total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

const mockInvoices = [
  { id: "1", invoice_number: "INV-001", tenant: "Rahim Uddin", flat: "A1", building: "Sunset Tower", amount: 20000, status: "paid", issue_date: "Mar 1, 2026", due_date: "Mar 15, 2026" },
  { id: "2", invoice_number: "INV-002", tenant: "Sumaiya Khan", flat: "A2", building: "Sunset Tower", amount: 18000, status: "paid", issue_date: "Mar 1, 2026", due_date: "Mar 15, 2026" },
  { id: "3", invoice_number: "INV-003", tenant: "Kamal Hossain", flat: "B1", building: "Sunset Tower", amount: 22000, status: "due", issue_date: "Mar 1, 2026", due_date: "Mar 15, 2026" },
  { id: "4", invoice_number: "INV-004", tenant: "Nadia Islam", flat: "B2", building: "Sunset Tower", amount: 25000, status: "paid", issue_date: "Mar 1, 2026", due_date: "Mar 15, 2026" },
  { id: "5", invoice_number: "INV-005", tenant: "Arif Rahman", flat: "C1", building: "Sunset Tower", amount: 20000, status: "due", issue_date: "Mar 1, 2026", due_date: "Mar 15, 2026" },
  { id: "6", invoice_number: "INV-006", tenant: "Fatema Begum", flat: "C2", building: "Green Heights", amount: 15000, status: "paid", issue_date: "Mar 1, 2026", due_date: "Mar 15, 2026" },
  { id: "7", invoice_number: "INV-007", tenant: "Shakil Ahmed", flat: "D1", building: "Green Heights", amount: 30000, status: "paid", issue_date: "Mar 1, 2026", due_date: "Mar 15, 2026" },
  { id: "8", invoice_number: "INV-008", tenant: "Riya Chowdhury", flat: "D2", building: "City View Apt", amount: 28000, status: "due", issue_date: "Mar 1, 2026", due_date: "Mar 15, 2026" },
];

const InvoicesContent = () => {
  const { t } = useLanguage();
  const { currentOrg } = useAuth();
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    tenant_id: "",
    unit_id: "",
    month: new Date().toISOString().slice(0, 7),
    due_date: "",
    line_items: [{ description: "Monthly Rent", amount: "" }]
  });

  const { data: invoices, isLoading, error } = useInvoices(currentOrg);
  const { data: tenants } = useTenants(currentOrg);
  const { data: units } = useUnits();
  const createInvoice = useCreateInvoice(currentOrg);
  const markPaid = useMarkInvoicePaid(currentOrg);

  const handleOpenModal = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewInvoice({
      tenant_id: "",
      unit_id: "",
      month: new Date().toISOString().slice(0, 7),
      due_date: "",
      line_items: [{ description: "Monthly Rent", amount: "" }]
    });
  };

  const handleAddLineItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      line_items: [...prev.line_items, { description: "", amount: "" }]
    }));
  };

  const handleUpdateLineItem = (index: number, field: string, value: string) => {
    setNewInvoice(prev => ({
      ...prev,
      line_items: prev.line_items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleRemoveLineItem = (index: number) => {
    if (newInvoice.line_items.length > 1) {
      setNewInvoice(prev => ({
        ...prev,
        line_items: prev.line_items.filter((_, i) => i !== index)
      }));
    }
  };

  const handleCreateInvoice = async () => {
    if (!newInvoice.tenant_id || !newInvoice.unit_id || !newInvoice.due_date) {
      toast.error("Please fill in all required fields");
      return;
    }
    const validLineItems = newInvoice.line_items.filter(li => li.description && li.amount);
    if (validLineItems.length === 0) {
      toast.error("Please add at least one line item");
      return;
    }
    try {
      await createInvoice.mutateAsync({
        tenant_id: newInvoice.tenant_id,
        unit_id: newInvoice.unit_id,
        month: newInvoice.month,
        due_date: newInvoice.due_date,
        line_items: validLineItems.map(li => ({
          description: li.description,
          amount: parseFloat(li.amount)
        }))
      });
      toast.success(t("pm.invoiceCreated") || "Invoice created successfully");
      handleCloseModal();
    } catch (err: any) {
      toast.error(err.message || "Failed to create invoice");
    }
  };

  const handleMarkPaid = (id: string) => {
    markPaid.mutate(id, {
      onSuccess: () => toast.success("Invoice marked as paid"),
      onError: (err: any) => toast.error(err.message || "Failed to mark invoice as paid")
    });
  };

  const invoicesData = invoices?.data || [];
  const filtered = statusFilter === "all" ? invoicesData : invoicesData.filter((i: any) => i.status === statusFilter);
  const total = filtered.reduce((s: number, i: any) => s + (i.total_amount || i.amount || 0), 0);
  const paid = filtered.filter((i: any) => i.status === "paid").reduce((s: number, i: any) => s + (i.total_amount || i.amount || 0), 0);

  const tenantsData = tenants?.data || [];
  const unitsData = units?.data || [];

  if (isLoading || !currentOrg) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-7 w-32 mb-1" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-8 w-36" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-7 w-16" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
        <div className="bg-white rounded-2xl border border-[#DEE2E6] p-4">
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-heading font-bold text-foreground">{t("pm.invoices")}</h1>
            <p className="text-sm text-muted-foreground">{t("pm.invoicesDesc")}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-destructive p-8 text-center">
          <p className="text-destructive">Failed to load invoices: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">{t("pm.invoices")}</h1>
          <p className="text-sm text-muted-foreground">{t("pm.invoicesDesc")}</p>
        </div>
        <button onClick={handleOpenModal} className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90">
          <Plus className="h-3.5 w-3.5" /> {t("pm.createInvoice")}
        </button>
      </div>
      <div className="flex gap-2">
        {["all", "paid", "due"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${statusFilter === s ? "bg-primary text-white" : "bg-white border border-input text-muted-foreground hover:bg-secondary"}`}>
            {s === "all" ? t("bm.allStatus") : s === "paid" ? t("dash.paid") : t("dash.due")}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border" style={{ borderColor: '#DEE2E6' }}><span className="text-[11px]" style={{ color: '#868E96' }}>{t("bm.totalInvoices")}</span><p className="text-xl font-bold" style={{ color: '#1A1D23' }}>BDT {total.toLocaleString()}</p></div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border" style={{ borderColor: '#DEE2E6' }}><span className="text-[11px]" style={{ color: '#868E96' }}>{t("dash.paid")}</span><p className="text-xl font-bold" style={{ color: '#2F9E44' }}>BDT {paid.toLocaleString()}</p></div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border" style={{ borderColor: '#DEE2E6' }}><span className="text-[11px]" style={{ color: '#868E96' }}>{t("dash.due")}</span><p className="text-xl font-bold" style={{ color: '#E67700' }}>BDT {(total - paid).toLocaleString()}</p></div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border" style={{ borderColor: '#DEE2E6' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr style={{ background: '#F8F9FA' }}>
              {[t("bm.invoiceNo"), t("dash.tenant"), t("dash.flat"), t("pm.property"), t("bm.rentAmount"), t("bm.issueDate"), t("bm.dueDate"), t("dash.status"), t("dash.actions")].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-[11px] uppercase tracking-wide" style={{ color: '#495057' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((inv: any) => (
                <tr key={inv.id} className="hover:bg-[#F8F9FA]" style={{ borderTop: '1px solid #F1F3F5' }}>
                  <td className="p-3 text-xs font-medium" style={{ color: '#1A1D23' }}>{inv.invoice_number}</td>
                  <td className="p-3 text-xs font-medium" style={{ color: '#1A1D23' }}>{inv.tenant_name || inv.tenant}</td>
                  <td className="p-3 text-xs" style={{ color: '#868E96' }}>{inv.unit_number || inv.flat}</td>
                  <td className="p-3 text-xs" style={{ color: '#868E96' }}>{inv.building_name || inv.building}</td>
                  <td className="p-3 text-xs font-medium" style={{ color: '#1A1D23' }}>BDT {(inv.total_amount || inv.amount).toLocaleString()}</td>
                  <td className="p-3 text-xs" style={{ color: '#868E96' }}>{inv.issued_at ? new Date(inv.issued_at).toLocaleDateString() : inv.issue_date}</td>
                  <td className="p-3 text-xs" style={{ color: '#868E96' }}>{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : inv.due_date}</td>
                  <td className="p-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium" style={inv.status === "paid" ? { background: '#FEF2F2', color: '#3B5BDB', border: '1px solid #FECACA' } : { background: '#FEFCE8', color: '#E67700', border: '1px solid #FDE68A' }}>
                      {inv.status === "paid" ? t("dash.paid") : t("dash.due")}
                    </span>
                  </td>
                  <td className="p-3">
                    <button className="text-xs hover:underline mr-2" style={{ color: '#3B5BDB' }}>{t("bm.view")}</button>
                    {inv.status === "due" && <button onClick={() => handleMarkPaid(inv.id)} className="text-xs hover:underline" style={{ color: '#2F9E44' }}>{t("bm.markPaid")}</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t("pm.createInvoice")}</h2>
              <button onClick={handleCloseModal} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">{t("dash.tenant")} *</label>
                <select
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  value={newInvoice.tenant_id}
                  onChange={e => setNewInvoice(prev => ({ ...prev, tenant_id: e.target.value }))}
                >
                  <option value="">Select Tenant</option>
                  {tenantsData.map((tenant: any) => (
                    <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">{t("dash.flat")} *</label>
                <select
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  value={newInvoice.unit_id}
                  onChange={e => setNewInvoice(prev => ({ ...prev, unit_id: e.target.value }))}
                >
                  <option value="">Select Unit</option>
                  {unitsData.map((unit: any) => (
                    <option key={unit.id} value={unit.id}>{unit.unit_number}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Month</label>
                <input
                  type="month"
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  value={newInvoice.month}
                  onChange={e => setNewInvoice(prev => ({ ...prev, month: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">{t("bm.dueDate")} *</label>
                <input
                  type="date"
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  value={newInvoice.due_date}
                  onChange={e => setNewInvoice(prev => ({ ...prev, due_date: e.target.value }))}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-muted-foreground">Line Items</label>
                  <button type="button" onClick={handleAddLineItem} className="text-xs text-primary hover:underline">+ Add Item</button>
                </div>
                {newInvoice.line_items.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Description"
                      className="flex-1 px-3 py-2 border rounded-lg text-sm"
                      value={item.description}
                      onChange={e => handleUpdateLineItem(index, "description", e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      className="w-24 px-3 py-2 border rounded-lg text-sm"
                      value={item.amount}
                      onChange={e => handleUpdateLineItem(index, "amount", e.target.value)}
                    />
                    {newInvoice.line_items.length > 1 && (
                      <button type="button" onClick={() => handleRemoveLineItem(index)} className="text-destructive hover:text-destructive/80">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <button onClick={handleCloseModal} className="px-4 py-2 border rounded-lg text-sm hover:bg-secondary">{t("bm.cancel")}</button>
              <button onClick={handleCreateInvoice} className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90">{t("pm.createInvoice")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const accountPayableDataPM = [
  { date: "Mar 15", description: "Maintenance staff salary", amount: 15000, payTo: "Staff Agency", status: "pending" },
  { date: "Mar 10", description: "Property insurance premium", amount: 8000, payTo: "Guardian Insurance", status: "pending" },
  { date: "Mar 5", description: "Cleaning service", amount: 5000, payTo: "CleanPro", status: "paid" },
  { date: "Feb 28", description: "Pest control", amount: 3500, payTo: "SafeHome", status: "paid" },
  { date: "Feb 20", description: "Water supply bill", amount: 4200, payTo: "WASA", status: "paid" },
];

const accountReceivableDataPM = [
  { tenant: "Kamal Hossain", flat: "B1", building: "Sunset Tower", type: "Rent", amount: 22000, dueDate: "Mar 1, 2026", daysOverdue: 18, status: "overdue" },
  { tenant: "Arif Rahman", flat: "C1", building: "Sunset Tower", type: "Rent", amount: 20000, dueDate: "Mar 1, 2026", daysOverdue: 18, status: "overdue" },
  { tenant: "Riya Chowdhury", flat: "D2", building: "City View Apt", type: "Rent", amount: 28000, dueDate: "Mar 1, 2026", daysOverdue: 18, status: "overdue" },
  { tenant: "Nasrin Akter", flat: "E2", building: "Sunset Tower", type: "Advance", amount: 5000, dueDate: "Apr 1, 2026", daysOverdue: 0, status: "upcoming" },
];

const AccountPayableContent = () => {
  const { t } = useLanguage();
  const { data: payables, isLoading, error } = usePayables();
  const createPayable = useCreatePayable();
  const updatePayable = useUpdatePayable();
  const deletePayable = useDeletePayable();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPayable, setNewPayable] = useState({ description: "", amount: "", pay_to: "", due_date: "" });

  const payablesData = payables as Array<{ id: string; description: string; amount: number; pay_to: string; due_date: string; status: string }> | undefined;
  const total = payablesData?.reduce((s, a) => s + a.amount, 0) || 0;
  const paid = payablesData?.filter(a => a.status === "paid").reduce((s, a) => s + a.amount, 0) || 0;

  const handleCreate = () => {
    if (!newPayable.description || !newPayable.amount || !newPayable.pay_to || !newPayable.due_date) return;
    createPayable.mutate({
      description: newPayable.description,
      amount: parseFloat(newPayable.amount),
      pay_to: newPayable.pay_to,
      due_date: newPayable.due_date,
    });
    setShowAddModal(false);
    setNewPayable({ description: "", amount: "", pay_to: "", due_date: "" });
    toast.success("Payable added successfully");
  };

  const handleMarkPaid = (id: string) => {
    updatePayable.mutate({ id, data: { status: "paid" } });
    toast.success("Marked as paid");
  };

  const handleDelete = (id: string) => {
    deletePayable.mutate(id);
    toast.success("Payable deleted");
  };

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-7 w-48 mb-1" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-8 w-36" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
        <div className="bg-white rounded-2xl border border-[#DEE2E6] p-4">
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        </div>
      </div>
    );
  }
  if (error) return <div className="p-8 text-center text-destructive">Failed to load payables</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">Account Payable</h1>
          <p className="text-sm text-muted-foreground">Amounts owed to vendors & service providers</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90"><Plus className="h-3.5 w-3.5" /> Add Payable</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border" style={{ borderColor: '#DEE2E6' }}><span className="text-[11px]" style={{ color: '#868E96' }}>Total Payable</span><p className="text-xl font-bold" style={{ color: '#1A1D23' }}>BDT {total.toLocaleString()}</p></div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border" style={{ borderColor: '#DEE2E6' }}><span className="text-[11px]" style={{ color: '#868E96' }}>Paid</span><p className="text-xl font-bold" style={{ color: '#2F9E44' }}>BDT {paid.toLocaleString()}</p></div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border" style={{ borderColor: '#DEE2E6' }}><span className="text-[11px]" style={{ color: '#868E96' }}>Pending</span><p className="text-xl font-bold" style={{ color: '#E67700' }}>BDT {(total - paid).toLocaleString()}</p></div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border" style={{ borderColor: '#DEE2E6' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr style={{ background: '#F8F9FA' }}>
              {["Date", "Description", "Amount", "Pay To", "Status", "Actions"].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-[11px] uppercase tracking-wide" style={{ color: '#495057' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {payablesData?.map((a) => (
                <tr key={a.id} className="hover:bg-[#F8F9FA]" style={{ borderTop: '1px solid #F1F3F5' }}>
                  <td className="p-3 text-xs" style={{ color: '#868E96' }}>{a.due_date}</td>
                  <td className="p-3 text-xs font-medium" style={{ color: '#1A1D23' }}>{a.description}</td>
                  <td className="p-3 text-xs font-medium" style={{ color: '#1A1D23' }}>BDT {a.amount.toLocaleString()}</td>
                  <td className="p-3 text-xs" style={{ color: '#868E96' }}>{a.pay_to}</td>
                  <td className="p-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium" style={a.status === "paid" ? { background: '#FEF2F2', color: '#3B5BDB', border: '1px solid #FECACA' } : { background: '#FEFCE8', color: '#E67700', border: '1px solid #FDE68A' }}>
                      {a.status === "paid" ? "Paid" : "Pending"}
                    </span>
                  </td>
                  <td className="p-3">
                    {a.status === "pending" && (
                      <button onClick={() => handleMarkPaid(a.id)} className="text-xs hover:underline mr-2" style={{ color: '#3B5BDB' }}>Mark Paid</button>
                    )}
                    <button onClick={() => handleDelete(a.id)} className="text-xs hover:underline" style={{ color: '#E03131' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg">Add Payable</h3>
              <button onClick={() => setShowAddModal(false)} aria-label="Close modal"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="Description" value={newPayable.description} onChange={e => setNewPayable({ ...newPayable, description: e.target.value })} className="w-full h-10 px-3 border rounded-lg text-sm" />
              <input type="number" placeholder="Amount" value={newPayable.amount} onChange={e => setNewPayable({ ...newPayable, amount: e.target.value })} className="w-full h-10 px-3 border rounded-lg text-sm" />
              <input type="text" placeholder="Pay To" value={newPayable.pay_to} onChange={e => setNewPayable({ ...newPayable, pay_to: e.target.value })} className="w-full h-10 px-3 border rounded-lg text-sm" />
              <input type="date" value={newPayable.due_date} onChange={e => setNewPayable({ ...newPayable, due_date: e.target.value })} className="w-full h-10 px-3 border rounded-lg text-sm" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowAddModal(false)} className="flex-1 h-10 border rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={handleCreate} className="flex-1 h-10 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AccountReceivableContent = () => {
  const { t } = useLanguage();
  const { currentOrg } = useAuth();
  const { data: invoices, isLoading: invoicesLoading } = useInvoices(currentOrg);
  const { data: payments, isLoading: paymentsLoading } = usePayments(currentOrg);
  const { data: tenants, isLoading: tenantsLoading } = useTenants(currentOrg);

  const invoicesData = (invoices as any)?.data?.data || [];
  const paymentsData = (payments as any)?.data?.data || [];
  const tenantsData = (tenants as any)?.data?.data || [];

  const getTenantName = (tenantId: string) => tenantsData?.find(t => t.id === tenantId)?.name || "Unknown";
  const getUnitName = (unitId: string) => "Unit " + unitId;

  const receivables = [
    ...(invoicesData?.filter(inv => inv.status !== "paid").map(inv => ({
      id: inv.id,
      tenant: getTenantName(inv.tenant_id),
      unit: getUnitName(inv.unit_id),
      type: "Invoice",
      amount: inv.amount,
      dueDate: inv.due_date,
      status: inv.status === "due" ? "overdue" : "upcoming"
    })) || []),
    ...(paymentsData?.filter(pay => pay.status === "due").map(pay => ({
      id: pay.id,
      tenant: getTenantName(pay.tenant_id),
      unit: getUnitName(pay.unit_id),
      type: "Payment",
      amount: pay.amount,
      dueDate: pay.due_date,
      status: "overdue" as const
    })) || [])
  ];

  const totalReceivable = receivables.reduce((sum, r) => sum + r.amount, 0);
  const overdueAmount = receivables.filter(r => r.status === "overdue").reduce((sum, r) => sum + r.amount, 0);
  const upcomingAmount = receivables.filter(r => r.status === "upcoming").reduce((sum, r) => sum + r.amount, 0);

  const isLoading = invoicesLoading || paymentsLoading || tenantsLoading;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">Account Receivable</h1>
          <p className="text-sm text-muted-foreground">Outstanding amounts to be collected from tenants</p>
        </div>
        <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90"><Plus className="h-3.5 w-3.5" /> Add Entry</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border" style={{ borderColor: '#DEE2E6' }}><span className="text-[11px]" style={{ color: '#868E96' }}>Total Receivable</span><p className="text-xl font-bold" style={{ color: '#1A1D23' }}>BDT {totalReceivable.toLocaleString()}</p></div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border" style={{ borderColor: '#DEE2E6' }}><span className="text-[11px]" style={{ color: '#868E96' }}>Overdue</span><p className="text-xl font-bold" style={{ color: '#E03131' }}>BDT {overdueAmount.toLocaleString()}</p></div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border" style={{ borderColor: '#DEE2E6' }}><span className="text-[11px]" style={{ color: '#868E96' }}>Upcoming</span><p className="text-xl font-bold" style={{ color: '#E67700' }}>BDT {upcomingAmount.toLocaleString()}</p></div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border" style={{ borderColor: '#DEE2E6' }}>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : receivables.length > 0 ? (
            <table className="w-full text-sm">
              <thead><tr style={{ background: '#F8F9FA' }}>
                {["Tenant", "Unit", "Type", "Amount", "Due Date", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left p-3 font-semibold text-[11px] uppercase tracking-wide" style={{ color: '#495057' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {receivables.map((a, i) => (
                  <tr key={i} className="hover:bg-[#F8F9FA]" style={{ borderTop: '1px solid #F1F3F5' }}>
                    <td className="p-3 text-xs font-medium" style={{ color: '#1A1D23' }}>{a.tenant}</td>
                    <td className="p-3 text-xs" style={{ color: '#868E96' }}>{a.unit}</td>
                    <td className="p-3 text-xs" style={{ color: '#868E96' }}>{a.type}</td>
                    <td className="p-3 text-xs font-medium" style={{ color: '#1A1D23' }}>BDT {a.amount.toLocaleString()}</td>
                    <td className="p-3 text-xs" style={{ color: '#868E96' }}>{a.dueDate}</td>
                    <td className="p-3">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium" style={a.status === "overdue" ? { background: '#FEF2F2', color: '#E03131', border: '1px solid #FCA5A5' } : { background: '#FEFCE8', color: '#E67700', border: '1px solid #FDE68A' }}>
                        {a.status === "overdue" ? "Overdue" : "Upcoming"}
                      </span>
                    </td>
                    <td className="p-3">
                      <button onClick={() => toast.success(`Reminder sent to ${a.tenant}`)} className="text-xs flex items-center gap-1 hover:underline" style={{ color: '#3B5BDB' }}><Send className="h-3 w-3" />Remind</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-muted-foreground text-xs">{t("dash.noData") || "No data found"}</div>
          )}
        </div>
      </div>
    </div>
  );
};


const RemindersContentPM = () => {
  const { t } = useLanguage();
  const overdueItems = [
    { name: "Kamal Hossain", flat: "B1", type: "Rent", amount: 22000, days: 10 },
    { name: "Arif Rahman", flat: "C1", type: "Rent", amount: 20000, days: 10 },
    { name: "Riya Chowdhury", flat: "D2", type: "Rent", amount: 28000, days: 10 },
  ];
  const sentReminders = [
    { date: "Mar 8", tenant: "Kamal Hossain", flat: "B1", type: "Rent", message: "Your rent for March is due", status: "Delivered" },
    { date: "Mar 7", tenant: "Arif Rahman", flat: "C1", type: "Rent", message: "Rent reminder for March", status: "Delivered" },
    { date: "Mar 5", tenant: "Riya Chowdhury", flat: "D2", type: "Rent", message: "March rent payment pending", status: "Read" },
    { date: "Mar 3", tenant: "Kamal Hossain", flat: "B1", type: "Advance", message: "Advance adjustment update", status: "Delivered" },
    { date: "Mar 1", tenant: "Fatema Begum", flat: "C2", type: "Rent", message: "Rent due reminder", status: "Read" },
  ];
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-heading font-bold text-foreground">{t("bm.reminders")}</h1>
        <p className="text-sm text-muted-foreground">{t("bm.remindersDesc")}</p>
      </div>
      <div>
        <h3 className="font-heading font-semibold text-foreground text-sm mb-3">{t("bm.pendingReminders")}</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {overdueItems.map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-[#F1F3F5] shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{item.name} — {item.flat}</span>
                <span className="text-[11px] font-medium text-destructive">{item.days} {t("bm.daysOverdue")}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground">{item.type}</span>
                  <p className="text-sm font-bold text-foreground">BDT {item.amount.toLocaleString()}</p>
                </div>
                <button onClick={() => toast.success(`Reminder sent to ${item.name}`)} className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg font-medium hover:bg-primary/90">
                  {t("bm.sendReminder")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-[#F1F3F5] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#F1F3F5]">
          <h3 className="font-heading font-semibold text-foreground text-sm">{t("bm.sentRemindersLog")}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#F8F9FA]">
              {[t("bm.dateSent"), t("dash.tenant"), t("dash.flat"), t("pm.type"), t("bm.message"), t("dash.status")].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-foreground text-xs">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {sentReminders.map((sr, i) => (
                <tr key={i} className="border-t border-[#F1F3F5] hover:bg-[#F8F9FA] transition-colors">
                  <td className="p-3 text-muted-foreground text-xs">{sr.date}</td>
                  <td className="p-3 text-foreground text-xs font-medium">{sr.tenant}</td>
                  <td className="p-3 text-muted-foreground text-xs">{sr.flat}</td>
                  <td className="p-3 text-muted-foreground text-xs">{sr.type}</td>
                  <td className="p-3 text-muted-foreground text-xs">{sr.message}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${sr.status === "Read" ? "bg-primary/10 text-primary" : "bg-blue-100 text-blue-700"}`}>{sr.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SettingsContent = () => {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-heading font-bold text-foreground">{t("dash.settings")}</h1>
        <p className="text-sm text-muted-foreground">{t("bm.settingsDesc")}</p>
      </div>
      <div className="bg-white rounded-2xl border border-[#F1F3F5] shadow-sm p-5">
        <h3 className="font-heading font-semibold text-foreground text-sm mb-4">{t("pm.propertyProfile")}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("pm.propertyName")}</label>
            <input defaultValue="Sunset Tower" className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("bm.address")}</label>
            <input defaultValue="Road 5, Dhanmondi, Dhaka" className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("bm.totalFloors")}</label>
            <input defaultValue="6" className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("pm.totalUnits")}</label>
            <input defaultValue="24" className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm" />
          </div>
        </div>
        <button className="mt-4 bg-primary text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-primary/90">{t("bm.saveChanges")}</button>
      </div>
      <div className="bg-white rounded-2xl border border-[#F1F3F5] shadow-sm p-5">
        <h3 className="font-heading font-semibold text-foreground text-sm mb-4">{t("bm.notificationPrefs")}</h3>
        <div className="space-y-3">
          {[t("bm.rentReminders3Days"), t("bm.overdueAlerts"), t("bm.paymentConfirmations"), t("bm.emailNotifications"), t("bm.smsNotifications")].map((label, i) => (
            <label key={i} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{label}</span>
              <input type="checkbox" defaultChecked={i < 3} className="w-4 h-4 accent-primary" />
            </label>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-[#F1F3F5] shadow-sm p-5">
        <h3 className="font-heading font-semibold text-foreground text-sm mb-4">{t("bm.account")}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("bm.ownerName")}</label>
            <input defaultValue="Muhammad Mushfiqur Rahman" className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("auth.phoneNumber")}</label>
            <input defaultValue="01711-000000" className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("bm.currentPassword")}</label>
            <input type="password" className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("bm.newPassword")}</label>
            <input type="password" className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm" />
          </div>
        </div>
        <button className="mt-4 bg-primary text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-primary/90">{t("bm.updateProfile")}</button>
      </div>
    </div>
  );
};

export default PropertyManagement;
