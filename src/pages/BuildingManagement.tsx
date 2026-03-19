import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2, BarChart3, Home, Users, DollarSign, FileText, Bell, Settings,
  LogOut, Menu, TrendingUp, TrendingDown, LayoutGrid, Plus, MoreHorizontal,
  X, Zap, CreditCard, Shield, Droplets, Flame, Trash2, Eye, Edit
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

// ─── Mock Data ──────────────────────────────────────────
const barData = [
  { month: "Oct", collected: 120000, due: 35000 },
  { month: "Nov", collected: 130000, due: 28000 },
  { month: "Dec", collected: 135000, due: 30000 },
  { month: "Jan", collected: 125000, due: 32000 },
  { month: "Feb", collected: 140000, due: 28000 },
  { month: "Mar", collected: 92000, due: 59000 },
];

const expensePieData = [
  { name: "Cleaning", value: 15000, color: "hsl(175,85%,32%)" },
  { name: "Security", value: 20000, color: "hsl(142,71%,45%)" },
  { name: "Electricity", value: 25000, color: "hsl(43,96%,50%)" },
  { name: "Lift", value: 8000, color: "hsl(217,91%,60%)" },
  { name: "Repairs", value: 18000, color: "hsl(0,84%,60%)" },
  { name: "Gas", value: 10000, color: "hsl(271,91%,65%)" },
];

const dashPayments = [
  { tenant: "Rahim Uddin", flat: "A1", amount: 20000, method: "bKash", status: "paid" },
  { tenant: "Sumaiya Khan", flat: "A2", amount: 18000, method: "Nagad", status: "paid" },
  { tenant: "Kamal Hossain", flat: "B1", amount: 22000, method: "—", status: "due" },
  { tenant: "Nadia Islam", flat: "B2", amount: 25000, method: "Bank", status: "paid" },
  { tenant: "Arif Rahman", flat: "C1", amount: 20000, method: "—", status: "due" },
  { tenant: "Fatema Begum", flat: "C2", amount: 15000, method: "Cash", status: "paid" },
  { tenant: "Shakil Ahmed", flat: "D1", amount: 30000, method: "bKash", status: "paid" },
  { tenant: "Riya Chowdhury", flat: "D2", amount: 28000, method: "—", status: "due" },
];

const buildings = [
  { name: "Sunset Tower", address: "Road 5, Dhanmondi, Dhaka", totalFlats: 24, occupied: 21, vacant: 3 },
  { name: "Green Heights", address: "Block C, Bashundhara, Dhaka", totalFlats: 16, occupied: 14, vacant: 2 },
  { name: "City View Apt", address: "Gulshan 2, Dhaka", totalFlats: 12, occupied: 12, vacant: 0 },
];

const flats = [
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

const serviceCharges = [
  { tenant: "Rahim Uddin", flat: "A1", building: "Sunset Tower", type: "Electricity", amount: 1200, month: "March 2026", status: "paid" },
  { tenant: "Sumaiya Khan", flat: "A2", building: "Sunset Tower", type: "Water", amount: 500, month: "March 2026", status: "paid" },
  { tenant: "Kamal Hossain", flat: "B1", building: "Sunset Tower", type: "Gas", amount: 800, month: "March 2026", status: "due" },
  { tenant: "Nadia Islam", flat: "B2", building: "Sunset Tower", type: "Lift", amount: 600, month: "March 2026", status: "paid" },
  { tenant: "Fatema Begum", flat: "C2", building: "Green Heights", type: "Security", amount: 700, month: "March 2026", status: "due" },
  { tenant: "Shakil Ahmed", flat: "D1", building: "Green Heights", type: "Cleaning", amount: 400, month: "March 2026", status: "paid" },
];

const fundContributions = [
  { flat: "A1", tenant: "Rahim Uddin", amount: 2000, month: "March 2026", date: "Mar 1", status: "Paid" },
  { flat: "A2", tenant: "Sumaiya Khan", amount: 2000, month: "March 2026", date: "Mar 2", status: "Paid" },
  { flat: "B1", tenant: "Kamal Hossain", amount: 2000, month: "March 2026", date: "—", status: "Due" },
  { flat: "B2", tenant: "Nadia Islam", amount: 2000, month: "March 2026", date: "Mar 3", status: "Paid" },
  { flat: "C1", tenant: "Arif Rahman", amount: 2000, month: "March 2026", date: "—", status: "Due" },
  { flat: "C2", tenant: "Fatema Begum", amount: 2000, month: "March 2026", date: "Mar 4", status: "Paid" },
  { flat: "D1", tenant: "Shakil Ahmed", amount: 2000, month: "March 2026", date: "Mar 1", status: "Paid" },
  { flat: "D2", tenant: "Riya Chowdhury", amount: 2000, month: "March 2026", date: "—", status: "Due" },
];

const fundExpenses = [
  { date: "Mar 5", desc: "Generator maintenance", amount: 8500, approvedBy: "Rahman" },
  { date: "Mar 3", desc: "Lift repair", amount: 15000, approvedBy: "Rahman" },
  { date: "Feb 28", desc: "Cleaning staff", amount: 3000, approvedBy: "Esrar" },
  { date: "Feb 25", desc: "Security salary", amount: 12000, approvedBy: "Rahman" },
  { date: "Feb 20", desc: "Water pump", amount: 5500, approvedBy: "Esrar" },
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
  { date: "Mar 3", tenant: "Kamal Hossain", flat: "B1", type: "Service Charge", message: "Gas bill due for March", status: "Delivered" },
  { date: "Mar 1", tenant: "Fatema Begum", flat: "C2", type: "Building Fund", message: "Building fund contribution due", status: "Read" },
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
  { icon: Building2, key: "dash.buildings" },
  { icon: Home, key: "dash.flats" },
  { icon: Users, key: "dash.tenantsTab" },
  { icon: DollarSign, key: "dash.rentPayments" },
  { icon: Zap, key: "bm.serviceCharges" },
  { icon: CreditCard, key: "bm.buildingFund" },
  { icon: FileText, key: "dash.expenses" },
  { icon: Bell, key: "bm.reminders" },
  { icon: Settings, key: "dash.settings" },
];

// ─── Main Component ──────────────────────────────────────
const BuildingManagement = () => {
  const [activeTab, setActiveTab] = useState("dash.dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState<typeof tenantsList[0] | null>(null);
  const { t } = useLanguage();

  const renderContent = () => {
    switch (activeTab) {
      case "dash.dashboard": return <DashboardContent />;
      case "dash.buildings": return <BuildingsContent />;
      case "dash.flats": return <FlatsContent />;
      case "dash.tenantsTab": return <TenantsContent onSelectTenant={setSelectedTenant} />;
      case "dash.rentPayments": return <RentPaymentsContent />;
      case "bm.serviceCharges": return <ServiceChargesContent />;
      case "bm.buildingFund": return <BuildingFundContent />;
      case "dash.expenses": return <ExpensesContent />;
      case "bm.reminders": return <RemindersContent />;
      case "dash.settings": return <SettingsContent />;
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <aside className={`${sidebarOpen ? "w-[200px]" : "w-0 overflow-hidden"} transition-all duration-300 bg-[#0F172A] flex flex-col flex-shrink-0 fixed h-full z-20`}>
        <div className="p-4 pb-6">
          <Link to="/" className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span className="text-base font-heading font-bold text-white">Rento</span>
          </Link>
        </div>
        <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
          {sidebarKeys.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors ${
                activeTab === item.key ? "bg-primary text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {t(item.key)}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <LogOut className="h-4 w-4" />
            {t("dash.logout")}
          </button>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col min-w-0 ${sidebarOpen ? "ml-[200px]" : ""} transition-all duration-300`}>
        <header className="h-14 bg-white border-b border-border flex items-center justify-between px-5 flex-shrink-0 shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
              <Menu className="h-4 w-4 text-muted-foreground" />
            </button>
            <span className="text-sm text-muted-foreground">{t("dash.propertyOwnerDashboard")}</span>
          </div>
          <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full" />
          </button>
        </header>
        <main className="flex-1 p-5 overflow-auto">{renderContent()}</main>
      </div>

      {/* Tenant Detail Slide Panel */}
      {selectedTenant && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedTenant(null)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative w-full max-w-md bg-white h-full shadow-xl overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-[#F1F5F9] flex items-center justify-between">
              <h2 className="font-heading font-bold text-foreground">{selectedTenant.name}</h2>
              <button onClick={() => setSelectedTenant(null)} className="p-1 hover:bg-secondary rounded-lg"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><span className="text-muted-foreground">{t("auth.phoneNumber")}</span><p className="font-medium text-foreground">{selectedTenant.phone}</p></div>
                <div><span className="text-muted-foreground">{t("dash.flat")}</span><p className="font-medium text-foreground">{selectedTenant.flat}</p></div>
                <div><span className="text-muted-foreground">{t("dash.building")}</span><p className="font-medium text-foreground">{selectedTenant.building}</p></div>
                <div><span className="text-muted-foreground">{t("bm.moveIn")}</span><p className="font-medium text-foreground">{selectedTenant.moveIn}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F8FAFC] rounded-xl p-3">
                  <span className="text-[11px] text-muted-foreground">{t("bm.totalPaidYear")}</span>
                  <p className="text-lg font-bold text-foreground">৳{selectedTenant.totalPaid.toLocaleString()}</p>
                </div>
                <div className="bg-[#F8FAFC] rounded-xl p-3">
                  <span className="text-[11px] text-muted-foreground">{t("bm.advanceHeld")}</span>
                  <p className="text-lg font-bold text-foreground">৳{selectedTenant.advance.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{t("bm.paymentHistory")}</h3>
                <div className="space-y-2">
                  {selectedTenant.paymentHistory.map((ph, i) => (
                    <div key={i} className="flex items-center justify-between text-xs bg-[#F8FAFC] rounded-lg px-3 py-2">
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
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-heading font-bold text-foreground">{t("dash.dashboard")}</h1>
        <p className="text-sm text-muted-foreground">{t("dash.overview")}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t("dash.totalMonthlyRent"), value: "৳1,78,000", sub: `8 ${t("dash.tenants")}`, icon: FileText, iconBg: "bg-blue-100 text-blue-600" },
          { label: t("dash.rentCollected"), value: "৳1,19,000", sub: t("dash.thisMonth"), icon: TrendingUp, iconBg: "bg-green-100 text-green-600" },
          { label: t("dash.rentDue"), value: "৳59,000", sub: `3 ${t("dash.pending")}`, icon: TrendingDown, iconBg: "bg-red-100 text-red-600" },
          { label: t("dash.totalExpenses"), value: "৳73,500", sub: `10 ${t("dash.entries")}`, icon: LayoutGrid, iconBg: "bg-primary/10 text-primary" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-[#F1F5F9] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
              <div className={`w-9 h-9 rounded-xl ${s.iconBg} flex items-center justify-center`}><s.icon className="h-4 w-4" /></div>
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-5">
          <h3 className="font-heading font-semibold text-foreground text-sm mb-4">{t("dash.rentTrend")}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip formatter={(v: number) => [`৳${v.toLocaleString()}`, ""]} />
              <Legend iconType="circle" iconSize={8} formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>} />
              <Bar dataKey="collected" name={t("dash.collected")} fill="hsl(175,85%,32%)" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="due" name={t("dash.due")} fill="hsl(0,84%,60%)" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-5">
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
      <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#F1F5F9]">
          <h3 className="font-heading font-semibold text-foreground text-sm">{t("dash.recentPayments")}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#F8FAFC]">
              {[t("dash.tenant"), t("dash.flat"), t("dash.amount"), t("dash.method"), t("dash.status")].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-foreground text-xs">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {dashPayments.slice(0, 6).map((p, i) => (
                <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="p-3 text-foreground text-xs font-medium">{p.tenant}</td>
                  <td className="p-3 text-muted-foreground text-xs">{p.flat}</td>
                  <td className="p-3 text-foreground text-xs font-medium">৳{p.amount.toLocaleString()}</td>
                  <td className="p-3 text-muted-foreground text-xs">{p.method}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${p.status === "paid" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                      {p.status === "paid" ? t("dash.paid") : t("dash.due")}
                    </span>
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

const BuildingsContent = () => {
  const { t } = useLanguage();
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">{t("bm.myBuildings")}</h1>
          <p className="text-sm text-muted-foreground">{t("dash.manageProperties")}</p>
        </div>
        <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="h-3.5 w-3.5" /> {t("dash.addBuilding")}
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#F8FAFC]">
              {[t("dash.buildingName"), t("bm.address"), t("dash.totalFlats"), t("dash.occupied"), t("dash.vacant"), t("dash.actions")].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-foreground text-xs">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {buildings.map((b, i) => (
                <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="p-3 text-foreground text-xs font-medium">{b.name}</td>
                  <td className="p-3 text-muted-foreground text-xs">{b.address}</td>
                  <td className="p-3 text-foreground text-xs">{b.totalFlats}</td>
                  <td className="p-3 text-foreground text-xs">{b.occupied}</td>
                  <td className="p-3 text-foreground text-xs">{b.vacant}</td>
                  <td className="p-3 flex gap-2">
                    <button className="text-xs text-primary hover:underline flex items-center gap-1"><Eye className="h-3 w-3" />{t("bm.view")}</button>
                    <button className="text-xs text-muted-foreground hover:underline flex items-center gap-1"><Edit className="h-3 w-3" />{t("bm.edit")}</button>
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

const FlatsContent = () => {
  const { t } = useLanguage();
  const [buildingFilter, setBuildingFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const filtered = flats.filter(f =>
    (buildingFilter === "All" || f.building === buildingFilter) &&
    (statusFilter === "All" || f.status === statusFilter)
  );
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">{t("bm.allFlats")}</h1>
          <p className="text-sm text-muted-foreground">{t("dash.allUnits")}</p>
        </div>
        <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="h-3.5 w-3.5" /> {t("dash.addFlat")}
        </button>
      </div>
      <div className="flex gap-3">
        <select value={buildingFilter} onChange={e => setBuildingFilter(e.target.value)} className="h-9 rounded-lg border border-input bg-background px-3 text-xs">
          <option value="All">{t("bm.allBuildings")}</option>
          {buildings.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 rounded-lg border border-input bg-background px-3 text-xs">
          <option value="All">{t("bm.allStatus")}</option>
          <option value="Occupied">{t("dash.occupied")}</option>
          <option value="Vacant">{t("dash.vacant")}</option>
        </select>
      </div>
      <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#F8FAFC]">
              {[t("bm.flatNo"), t("dash.building"), t("bm.floor"), t("bm.sizeSqft"), t("bm.rentBDT"), t("dash.status"), t("dash.tenant"), t("dash.actions")].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-foreground text-xs">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((f, i) => (
                <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="p-3 text-foreground text-xs font-medium">{f.flat}</td>
                  <td className="p-3 text-muted-foreground text-xs">{f.building}</td>
                  <td className="p-3 text-muted-foreground text-xs">{f.floor}</td>
                  <td className="p-3 text-muted-foreground text-xs">{f.size}</td>
                  <td className="p-3 text-foreground text-xs font-medium">৳{f.rent.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${f.status === "Occupied" ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-600"}`}>
                      {f.status === "Occupied" ? t("dash.occupied") : t("dash.vacant")}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground text-xs">{f.tenant}</td>
                  <td className="p-3">
                    <button className="text-xs text-primary hover:underline">{f.status === "Occupied" ? t("bm.view") : t("bm.assign")}</button>
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

const TenantsContent = ({ onSelectTenant }: { onSelectTenant: (t: typeof tenantsList[0]) => void }) => {
  const { t } = useLanguage();
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
      <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#F8FAFC]">
              {[t("dash.name"), t("bm.flatNo"), t("dash.building"), t("auth.phoneNumber"), t("bm.moveIn"), t("bm.monthlyRent"), t("dash.status"), t("dash.actions")].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-foreground text-xs">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {tenantsList.map((tt, i) => (
                <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="p-3 text-foreground text-xs font-medium">{tt.name}</td>
                  <td className="p-3 text-muted-foreground text-xs">{tt.flat}</td>
                  <td className="p-3 text-muted-foreground text-xs">{tt.building}</td>
                  <td className="p-3 text-muted-foreground text-xs">{tt.phone}</td>
                  <td className="p-3 text-muted-foreground text-xs">{tt.moveIn}</td>
                  <td className="p-3 text-foreground text-xs font-medium">BDT {tt.rent.toLocaleString()}</td>
                  <td className="p-3"><span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary">{tt.status}</span></td>
                  <td className="p-3">
                    <button onClick={() => onSelectTenant(tt)} className="text-xs text-primary hover:underline">{t("bm.view")}</button>
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

const RentPaymentsContent = () => {
  const { t } = useLanguage();
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">{t("dash.rentPayments")}</h1>
          <p className="text-sm text-muted-foreground">{t("dash.trackTransactions")}</p>
        </div>
        <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="h-3.5 w-3.5" /> {t("dash.recordPayment")}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t("bm.totalCollectable"), value: "৳1,78,000", color: "text-foreground" },
          { label: t("dash.collected"), value: "৳1,19,000", color: "text-primary" },
          { label: t("dash.due"), value: "৳59,000", color: "text-destructive" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-[#F1F5F9] shadow-sm">
            <span className="text-xs text-muted-foreground">{s.label}</span>
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#F8FAFC]">
              {[t("dash.tenant"), t("dash.flat"), t("dash.building"), t("bm.rentAmount"), t("bm.month"), t("bm.paymentDate"), t("dash.method"), t("dash.status"), t("dash.actions")].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-foreground text-xs">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {rentPayments.map((p, i) => (
                <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="p-3 text-foreground text-xs font-medium">{p.tenant}</td>
                  <td className="p-3 text-muted-foreground text-xs">{p.flat}</td>
                  <td className="p-3 text-muted-foreground text-xs">{p.building}</td>
                  <td className="p-3 text-foreground text-xs font-medium">BDT {p.amount.toLocaleString()}</td>
                  <td className="p-3 text-muted-foreground text-xs">{p.month}</td>
                  <td className="p-3 text-muted-foreground text-xs">{p.date}</td>
                  <td className="p-3 text-muted-foreground text-xs">{p.method}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${p.status === "paid" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                      {p.status === "paid" ? t("dash.paid") : t("dash.due")}
                    </span>
                  </td>
                  <td className="p-3">
                    {p.status === "paid" ? (
                      <button className="text-[11px] bg-primary/10 text-primary px-2.5 py-1 rounded-md font-medium hover:bg-primary/20">{t("bm.receipt")}</button>
                    ) : (
                      <button onClick={() => toast.success(`Reminder sent to ${p.tenant}`)} className="text-[11px] bg-amber-100 text-amber-700 px-2.5 py-1 rounded-md font-medium hover:bg-amber-200">{t("bm.remind")}</button>
                    )}
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

const ServiceChargesContent = () => {
  const { t } = useLanguage();
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">{t("bm.serviceCharges")}</h1>
          <p className="text-sm text-muted-foreground">{t("bm.serviceChargesDesc")}</p>
        </div>
        <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="h-3.5 w-3.5" /> {t("bm.addCharge")}
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#F8FAFC]">
              {[t("dash.tenant"), t("dash.flat"), t("dash.building"), t("bm.chargeType"), t("dash.amount"), t("bm.month"), t("dash.status"), t("dash.actions")].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-foreground text-xs">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {serviceCharges.map((sc, i) => (
                <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="p-3 text-foreground text-xs font-medium">{sc.tenant}</td>
                  <td className="p-3 text-muted-foreground text-xs">{sc.flat}</td>
                  <td className="p-3 text-muted-foreground text-xs">{sc.building}</td>
                  <td className="p-3 text-muted-foreground text-xs">{sc.type}</td>
                  <td className="p-3 text-foreground text-xs font-medium">BDT {sc.amount.toLocaleString()}</td>
                  <td className="p-3 text-muted-foreground text-xs">{sc.month}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${sc.status === "paid" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                      {sc.status === "paid" ? t("dash.paid") : t("dash.due")}
                    </span>
                  </td>
                  <td className="p-3">
                    {sc.status === "paid" ? (
                      <button className="text-[11px] bg-primary/10 text-primary px-2.5 py-1 rounded-md font-medium">{t("bm.receipt")}</button>
                    ) : (
                      <button onClick={() => toast.success(`Reminder sent to ${sc.tenant}`)} className="text-[11px] bg-amber-100 text-amber-700 px-2.5 py-1 rounded-md font-medium">{t("bm.remind")}</button>
                    )}
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

const BuildingFundContent = () => {
  const { t } = useLanguage();
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">{t("bm.buildingFund")}</h1>
          <p className="text-sm text-muted-foreground">{t("bm.buildingFundDesc")}</p>
        </div>
        <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="h-3.5 w-3.5" /> {t("bm.addContribution")}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#F1F5F9] shadow-sm">
          <span className="text-xs text-muted-foreground">{t("bm.totalFundBalance")}</span>
          <p className="text-lg font-bold text-foreground">৳1,85,000</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#F1F5F9] shadow-sm">
          <span className="text-xs text-muted-foreground">{t("bm.thisMonthCollected")}</span>
          <p className="text-lg font-bold text-primary">৳10,000</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#F1F5F9] shadow-sm">
          <span className="text-xs text-muted-foreground">{t("bm.monthlyTarget")}</span>
          <p className="text-lg font-bold text-foreground">৳16,000</p>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: "63%" }} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#F1F5F9]">
          <h3 className="font-heading font-semibold text-foreground text-sm">{t("bm.contributionRecords")}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#F8FAFC]">
              {[t("dash.flat"), t("dash.tenant"), t("dash.amount"), t("bm.month"), t("dash.date"), t("dash.status")].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-foreground text-xs">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {fundContributions.map((fc, i) => (
                <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="p-3 text-foreground text-xs font-medium">{fc.flat}</td>
                  <td className="p-3 text-muted-foreground text-xs">{fc.tenant}</td>
                  <td className="p-3 text-foreground text-xs font-medium">BDT {fc.amount.toLocaleString()}</td>
                  <td className="p-3 text-muted-foreground text-xs">{fc.month}</td>
                  <td className="p-3 text-muted-foreground text-xs">{fc.date}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${fc.status === "Paid" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>{fc.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#F1F5F9]">
          <h3 className="font-heading font-semibold text-foreground text-sm">{t("bm.fundExpenseLog")}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#F8FAFC]">
              {[t("dash.date"), t("dash.description"), t("dash.amount"), t("bm.approvedBy")].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-foreground text-xs">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {fundExpenses.map((fe, i) => (
                <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="p-3 text-muted-foreground text-xs">{fe.date}</td>
                  <td className="p-3 text-foreground text-xs font-medium">{fe.desc}</td>
                  <td className="p-3 text-foreground text-xs font-medium">BDT {fe.amount.toLocaleString()}</td>
                  <td className="p-3 text-muted-foreground text-xs">{fe.approvedBy}</td>
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
  const [catFilter, setCatFilter] = useState("All");
  const categories = ["All", "Maintenance", "Repair", "Salary", "Utilities", "Cleaning"];
  const filtered = catFilter === "All" ? expensesList : expensesList.filter(e => e.category === catFilter);
  const total = filtered.reduce((s, e) => s + e.amount, 0);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">{t("dash.expenses")}</h1>
          <p className="text-sm text-muted-foreground">{t("dash.trackExpenses")}</p>
        </div>
        <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="h-3.5 w-3.5" /> {t("dash.addExpense")}
        </button>
      </div>
      <div className="flex gap-2">
        {categories.map(c => (
          <button key={c} onClick={() => setCatFilter(c)} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${catFilter === c ? "bg-primary text-white" : "bg-white border border-input text-muted-foreground hover:bg-secondary"}`}>
            {c === "All" ? t("bm.allCategories") : c}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#F8FAFC]">
              {[t("dash.date"), t("dash.description"), t("dash.amount"), t("dash.category"), t("dash.building"), t("bm.addedBy")].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-foreground text-xs">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="p-3 text-muted-foreground text-xs">{e.date}</td>
                  <td className="p-3 text-foreground text-xs font-medium">{e.desc}</td>
                  <td className="p-3 text-foreground text-xs font-medium">BDT {e.amount.toLocaleString()}</td>
                  <td className="p-3"><span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${catColors[e.category] || "bg-gray-100 text-gray-700"}`}>{e.category}</span></td>
                  <td className="p-3 text-muted-foreground text-xs">{e.building}</td>
                  <td className="p-3 text-muted-foreground text-xs">{e.addedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-[#F1F5F9] flex justify-end">
          <span className="text-sm font-bold text-foreground">{t("bm.totalExpenses")}: BDT {total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

const RemindersContent = () => {
  const { t } = useLanguage();
  const overdueItems = [
    { name: "Kamal Hossain", flat: "B1", type: "Rent", amount: 22000, days: 10 },
    { name: "Arif Rahman", flat: "C1", type: "Rent", amount: 20000, days: 10 },
    { name: "Riya Chowdhury", flat: "D2", type: "Rent", amount: 28000, days: 10 },
    { name: "Fatema Begum", flat: "C2", type: "Security", amount: 700, days: 5 },
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
            <div key={i} className="bg-white rounded-xl border border-[#F1F5F9] shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{item.name} — {item.flat}</span>
                <span className={`text-[11px] font-medium ${item.days > 7 ? "text-destructive" : "text-amber-600"}`}>
                  {item.days} {t("bm.daysOverdue")}
                </span>
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

      <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#F1F5F9]">
          <h3 className="font-heading font-semibold text-foreground text-sm">{t("bm.sentRemindersLog")}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#F8FAFC]">
              {[t("bm.dateSent"), t("dash.tenant"), t("dash.flat"), t("pm.type"), t("bm.message"), t("dash.status")].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-foreground text-xs">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {sentReminders.map((sr, i) => (
                <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
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

      <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-5">
        <h3 className="font-heading font-semibold text-foreground text-sm mb-4">{t("bm.buildingProfile")}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("dash.buildingName")}</label>
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
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("dash.totalFlats")}</label>
            <input defaultValue="24" className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm" />
          </div>
        </div>
        <button className="mt-4 bg-primary text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-primary/90">{t("bm.saveChanges")}</button>
      </div>

      <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-5">
        <h3 className="font-heading font-semibold text-foreground text-sm mb-4">{t("bm.notificationPrefs")}</h3>
        <div className="space-y-3">
          {[
            t("bm.rentReminders3Days"),
            t("bm.overdueAlerts"),
            t("bm.paymentConfirmations"),
            t("bm.emailNotifications"),
            t("bm.smsNotifications"),
          ].map((label, i) => (
            <label key={i} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{label}</span>
              <input type="checkbox" defaultChecked={i < 3} className="w-4 h-4 accent-primary" />
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-5">
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

export default BuildingManagement;
