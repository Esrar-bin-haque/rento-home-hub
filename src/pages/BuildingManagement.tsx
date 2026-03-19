import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2, BarChart3, Home, Users, CreditCard, FileText, Settings,
  LogOut, Menu, Plus, X, Eye, Edit, Receipt, CheckCircle2,
  ArrowDownCircle, TrendingDown, ArrowUpCircle, Bell, UserCheck,
  BarChart2, Send
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

// ─── Mock Data ──────────────────────────────────────────

const collectionTrendData = [
  { month: "Oct", collected: 42000, notCollected: 6000 },
  { month: "Nov", collected: 44000, notCollected: 4000 },
  { month: "Dec", collected: 40000, notCollected: 8000 },
  { month: "Jan", collected: 45000, notCollected: 3000 },
  { month: "Feb", collected: 43000, notCollected: 5000 },
  { month: "Mar", collected: 34500, notCollected: 13500 },
];

const incomeExpenseData = [
  { month: "Oct", income: 42000, expense: 25000, payable: 3000 },
  { month: "Nov", income: 44000, expense: 27000, payable: 2000 },
  { month: "Dec", income: 40000, expense: 30000, payable: 5000 },
  { month: "Jan", income: 45000, expense: 24000, payable: 1000 },
  { month: "Feb", income: 43000, expense: 26000, payable: 4000 },
  { month: "Mar", income: 34500, expense: 27800, payable: 8200 },
];

const expensePieData = [
  { name: "Cleaning", value: 5000, color: "#0F766E" },
  { name: "Security", value: 8000, color: "#1A56DB" },
  { name: "Electricity", value: 6500, color: "#CA8A04" },
  { name: "Lift Maintenance", value: 3800, color: "#7C3AED" },
  { name: "Repairs", value: 2500, color: "#DC2626" },
  { name: "Generator", value: 2000, color: "#374151" },
];

const dashPayments = [
  { tenant: "Rahim Uddin", flat: "A1", amount: 4000, method: "bKash", status: "paid" },
  { tenant: "Sumaiya Khan", flat: "A2", amount: 3500, method: "Nagad", status: "paid" },
  { tenant: "Kamal Hossain", flat: "B1", amount: 4500, method: "Cash", status: "due" },
  { tenant: "Nadia Islam", flat: "B2", amount: 5000, method: "Bank Transfer", status: "paid" },
  { tenant: "Arif Rahman", flat: "C1", amount: 4000, method: "—", status: "due" },
  { tenant: "Fatema Begum", flat: "C2", amount: 3000, method: "bKash", status: "paid" },
  { tenant: "Shakil Ahmed", flat: "D1", amount: 6000, method: "Nagad", status: "paid" },
  { tenant: "Riya Chowdhury", flat: "D2", amount: 5500, method: "—", status: "due" },
  { tenant: "Imran Hossain", flat: "E1", amount: 4000, method: "Cash", status: "paid" },
  { tenant: "Nasrin Akter", flat: "E2", amount: 3500, method: "bKash", status: "paid" },
];

const buildings = [
  { name: "Sunset Tower", address: "Road 5, Dhanmondi", totalFlats: 24, occupied: 21, vacant: 3, monthlyFund: 48000 },
  { name: "Green Heights", address: "Block C, Bashundhara", totalFlats: 16, occupied: 14, vacant: 2, monthlyFund: 32000 },
  { name: "City View Apt", address: "Gulshan 2, Dhaka", totalFlats: 12, occupied: 12, vacant: 0, monthlyFund: 24000 },
];

const flats = [
  { flat: "A1", building: "Sunset Tower", floor: "1st", size: 850, serviceCharge: 4000, status: "Occupied", tenant: "Rahim Uddin" },
  { flat: "A2", building: "Sunset Tower", floor: "1st", size: 900, serviceCharge: 3500, status: "Occupied", tenant: "Sumaiya Khan" },
  { flat: "B1", building: "Sunset Tower", floor: "2nd", size: 850, serviceCharge: 4500, status: "Occupied", tenant: "Kamal Hossain" },
  { flat: "B2", building: "Sunset Tower", floor: "2nd", size: 950, serviceCharge: 5000, status: "Occupied", tenant: "Nadia Islam" },
  { flat: "C1", building: "Sunset Tower", floor: "3rd", size: 850, serviceCharge: 4000, status: "Vacant", tenant: "—" },
  { flat: "C2", building: "Green Heights", floor: "1st", size: 750, serviceCharge: 3000, status: "Occupied", tenant: "Fatema Begum" },
  { flat: "D1", building: "Green Heights", floor: "2nd", size: 1100, serviceCharge: 6000, status: "Occupied", tenant: "Shakil Ahmed" },
  { flat: "D2", building: "City View Apt", floor: "1st", size: 1200, serviceCharge: 5500, status: "Occupied", tenant: "Riya Chowdhury" },
];

const flatOwners = [
  { name: "Mr. Karim Ahmed", phone: "01711-111001", flat: "A1", building: "Sunset Tower", since: "Jan 2018", tenantLiving: "Rahim Uddin", status: "Active" },
  { name: "Mrs. Sultana Begum", phone: "01711-111002", flat: "A2", building: "Sunset Tower", since: "Mar 2019", tenantLiving: "Sumaiya Khan", status: "Active" },
  { name: "Mr. Rafiq Islam", phone: "01711-111003", flat: "B1", building: "Sunset Tower", since: "Jun 2017", tenantLiving: "Kamal Hossain", status: "Active" },
  { name: "Dr. Nazmul Haque", phone: "01711-111004", flat: "B2", building: "Sunset Tower", since: "Feb 2020", tenantLiving: "Nadia Islam", status: "Active" },
  { name: "Mr. Shafiq Rahman", phone: "01711-111005", flat: "C1", building: "Sunset Tower", since: "Aug 2016", tenantLiving: "— (Vacant)", status: "Active" },
  { name: "Mrs. Fatema Akhter", phone: "01711-111006", flat: "C2", building: "Green Heights", since: "Nov 2021", tenantLiving: "Fatema Begum", status: "Active" },
  { name: "Mr. Anwar Hossain", phone: "01711-111007", flat: "D1", building: "Green Heights", since: "Apr 2019", tenantLiving: "Shakil Ahmed", status: "Active" },
  { name: "Mrs. Ruma Chowdhury", phone: "01711-111008", flat: "D2", building: "City View Apt", since: "Jan 2022", tenantLiving: "Riya Chowdhury", status: "Active" },
];

const tenantsList = [
  { name: "Rahim Uddin", flat: "A1", building: "Sunset Tower", phone: "01711-000001", moveIn: "October 2021", rent: 4000, status: "Active", totalPaid: 24000, advance: 8000, paymentHistory: [
    { month: "Mar 2026", amount: 4000, date: "Mar 1", status: "Paid" },
    { month: "Feb 2026", amount: 4000, date: "Feb 1", status: "Paid" },
    { month: "Jan 2026", amount: 4000, date: "Jan 3", status: "Paid" },
    { month: "Dec 2025", amount: 4000, date: "Dec 1", status: "Paid" },
    { month: "Nov 2025", amount: 4000, date: "Nov 2", status: "Paid" },
    { month: "Oct 2025", amount: 4000, date: "Oct 1", status: "Paid" },
  ]},
  { name: "Sumaiya Khan", flat: "A2", building: "Sunset Tower", phone: "01722-000002", moveIn: "January 2022", rent: 3500, status: "Active", totalPaid: 21000, advance: 7000, paymentHistory: [
    { month: "Mar 2026", amount: 3500, date: "Mar 2", status: "Paid" },
    { month: "Feb 2026", amount: 3500, date: "Feb 1", status: "Paid" },
    { month: "Jan 2026", amount: 3500, date: "Jan 2", status: "Paid" },
    { month: "Dec 2025", amount: 3500, date: "Dec 3", status: "Paid" },
    { month: "Nov 2025", amount: 3500, date: "Nov 1", status: "Paid" },
    { month: "Oct 2025", amount: 3500, date: "Oct 2", status: "Paid" },
  ]},
  { name: "Kamal Hossain", flat: "B1", building: "Sunset Tower", phone: "01733-000003", moveIn: "March 2022", rent: 4500, status: "Active", totalPaid: 22500, advance: 9000, paymentHistory: [
    { month: "Mar 2026", amount: 4500, date: "—", status: "Due" },
    { month: "Feb 2026", amount: 4500, date: "Feb 3", status: "Paid" },
    { month: "Jan 2026", amount: 4500, date: "Jan 1", status: "Paid" },
    { month: "Dec 2025", amount: 4500, date: "Dec 2", status: "Paid" },
    { month: "Nov 2025", amount: 4500, date: "Nov 3", status: "Paid" },
    { month: "Oct 2025", amount: 4500, date: "Oct 1", status: "Paid" },
  ]},
  { name: "Nadia Islam", flat: "B2", building: "Sunset Tower", phone: "01744-000004", moveIn: "June 2022", rent: 5000, status: "Active", totalPaid: 30000, advance: 10000, paymentHistory: [
    { month: "Mar 2026", amount: 5000, date: "Mar 3", status: "Paid" },
    { month: "Feb 2026", amount: 5000, date: "Feb 2", status: "Paid" },
    { month: "Jan 2026", amount: 5000, date: "Jan 1", status: "Paid" },
    { month: "Dec 2025", amount: 5000, date: "Dec 1", status: "Paid" },
    { month: "Nov 2025", amount: 5000, date: "Nov 2", status: "Paid" },
    { month: "Oct 2025", amount: 5000, date: "Oct 3", status: "Paid" },
  ]},
  { name: "Arif Rahman", flat: "C1", building: "Sunset Tower", phone: "01755-000005", moveIn: "August 2022", rent: 4000, status: "Active", totalPaid: 20000, advance: 8000, paymentHistory: [
    { month: "Mar 2026", amount: 4000, date: "—", status: "Due" },
    { month: "Feb 2026", amount: 4000, date: "Feb 1", status: "Paid" },
    { month: "Jan 2026", amount: 4000, date: "Jan 2", status: "Paid" },
    { month: "Dec 2025", amount: 4000, date: "Dec 1", status: "Paid" },
    { month: "Nov 2025", amount: 4000, date: "Nov 3", status: "Paid" },
    { month: "Oct 2025", amount: 4000, date: "Oct 1", status: "Paid" },
  ]},
  { name: "Fatema Begum", flat: "C2", building: "Green Heights", phone: "01766-000006", moveIn: "November 2022", rent: 3000, status: "Active", totalPaid: 18000, advance: 6000, paymentHistory: [
    { month: "Mar 2026", amount: 3000, date: "Mar 4", status: "Paid" },
    { month: "Feb 2026", amount: 3000, date: "Feb 2", status: "Paid" },
    { month: "Jan 2026", amount: 3000, date: "Jan 1", status: "Paid" },
    { month: "Dec 2025", amount: 3000, date: "Dec 3", status: "Paid" },
    { month: "Nov 2025", amount: 3000, date: "Nov 1", status: "Paid" },
    { month: "Oct 2025", amount: 3000, date: "Oct 2", status: "Paid" },
  ]},
  { name: "Shakil Ahmed", flat: "D1", building: "Green Heights", phone: "01777-000007", moveIn: "February 2023", rent: 6000, status: "Active", totalPaid: 36000, advance: 12000, paymentHistory: [
    { month: "Mar 2026", amount: 6000, date: "Mar 1", status: "Paid" },
    { month: "Feb 2026", amount: 6000, date: "Feb 1", status: "Paid" },
    { month: "Jan 2026", amount: 6000, date: "Jan 3", status: "Paid" },
    { month: "Dec 2025", amount: 6000, date: "Dec 1", status: "Paid" },
    { month: "Nov 2025", amount: 6000, date: "Nov 2", status: "Paid" },
    { month: "Oct 2025", amount: 6000, date: "Oct 1", status: "Paid" },
  ]},
  { name: "Riya Chowdhury", flat: "D2", building: "City View Apt", phone: "01788-000008", moveIn: "May 2023", rent: 5500, status: "Active", totalPaid: 33000, advance: 11000, paymentHistory: [
    { month: "Mar 2026", amount: 5500, date: "—", status: "Due" },
    { month: "Feb 2026", amount: 5500, date: "Feb 2", status: "Paid" },
    { month: "Jan 2026", amount: 5500, date: "Jan 1", status: "Paid" },
    { month: "Dec 2025", amount: 5500, date: "Dec 2", status: "Paid" },
    { month: "Nov 2025", amount: 5500, date: "Nov 3", status: "Paid" },
    { month: "Oct 2025", amount: 5500, date: "Oct 1", status: "Paid" },
  ]},
];

const paymentStatusData = [
  { tenant: "Rahim Uddin", flat: "A1", building: "Sunset Tower", amount: 4000, month: "March 2026", date: "Mar 1", method: "bKash", status: "paid" },
  { tenant: "Sumaiya Khan", flat: "A2", building: "Sunset Tower", amount: 3500, month: "March 2026", date: "Mar 2", method: "Nagad", status: "paid" },
  { tenant: "Kamal Hossain", flat: "B1", building: "Sunset Tower", amount: 4500, month: "March 2026", date: "—", method: "—", status: "due" },
  { tenant: "Nadia Islam", flat: "B2", building: "Sunset Tower", amount: 5000, month: "March 2026", date: "Mar 3", method: "Bank Transfer", status: "paid" },
  { tenant: "Arif Rahman", flat: "C1", building: "Sunset Tower", amount: 4000, month: "March 2026", date: "—", method: "—", status: "due" },
  { tenant: "Fatema Begum", flat: "C2", building: "Green Heights", amount: 3000, month: "March 2026", date: "Mar 4", method: "Cash", status: "paid" },
  { tenant: "Shakil Ahmed", flat: "D1", building: "Green Heights", amount: 6000, month: "March 2026", date: "Mar 1", method: "bKash", status: "paid" },
  { tenant: "Riya Chowdhury", flat: "D2", building: "City View Apt", amount: 5500, month: "March 2026", date: "—", method: "—", status: "due" },
  { tenant: "Imran Hossain", flat: "E1", building: "Sunset Tower", amount: 4000, month: "March 2026", date: "Mar 5", method: "Cash", status: "paid" },
  { tenant: "Nasrin Akter", flat: "E2", building: "Sunset Tower", amount: 3500, month: "March 2026", date: "Mar 5", method: "bKash", status: "paid" },
];

const expensesList = [
  { date: "Mar 5", desc: "Generator maintenance", amount: 8500, category: "Maintenance", building: "Sunset Tower", addedBy: "Rahman" },
  { date: "Mar 3", desc: "Lift repair", amount: 15000, category: "Repair", building: "Green Heights", addedBy: "Rahman" },
  { date: "Feb 28", desc: "Common area cleaning", amount: 3000, category: "Cleaning", building: "Sunset Tower", addedBy: "Esrar" },
  { date: "Feb 25", desc: "Security guard salary", amount: 12000, category: "Salary", building: "All", addedBy: "Rahman" },
  { date: "Feb 20", desc: "Water pump repair", amount: 5500, category: "Repair", building: "Sunset Tower", addedBy: "Esrar" },
  { date: "Feb 15", desc: "Electricity bill", amount: 5500, category: "Utilities", building: "Sunset Tower", addedBy: "Rahman" },
  { date: "Mar 8", desc: "Painting staircase", amount: 6000, category: "Maintenance", building: "Green Heights", addedBy: "Esrar" },
  { date: "Mar 10", desc: "Plumber visit", amount: 2500, category: "Repair", building: "City View Apt", addedBy: "Rahman" },
  { date: "Mar 12", desc: "Electricity bill", amount: 9800, category: "Utilities", building: "Sunset Tower", addedBy: "Rahman" },
  { date: "Mar 14", desc: "Guard uniform", amount: 3200, category: "Salary", building: "Sunset Tower", addedBy: "Esrar" },
];

const accountPayableData = [
  { date: "Mar 15", description: "Security staff salary — March", amount: 12000, payTo: "Guard Agency Ltd", status: "pending" },
  { date: "Mar 10", description: "Elevator maintenance contract", amount: 8000, payTo: "LiftCare BD", status: "pending" },
  { date: "Mar 5", description: "Cleaning staff payment", amount: 5000, payTo: "CleanPro Services", status: "paid" },
  { date: "Feb 28", description: "Generator fuel — February", amount: 3500, payTo: "Fuel Station", status: "paid" },
  { date: "Feb 25", description: "Water supply bill", amount: 4200, payTo: "WASA", status: "paid" },
  { date: "Feb 20", description: "Insurance premium", amount: 6500, payTo: "Guardian Insurance", status: "pending" },
];

const accountReceivableData = [
  { tenant: "Kamal Hossain", flat: "B1", building: "Sunset Tower", type: "Service Charge", amount: 4500, dueDate: "Mar 1, 2026", daysOverdue: 18, status: "overdue" },
  { tenant: "Arif Rahman", flat: "C1", building: "Sunset Tower", type: "Service Charge", amount: 4000, dueDate: "Mar 1, 2026", daysOverdue: 18, status: "overdue" },
  { tenant: "Riya Chowdhury", flat: "D2", building: "City View Apt", type: "Service Charge", amount: 5500, dueDate: "Mar 1, 2026", daysOverdue: 18, status: "overdue" },
  { tenant: "Imran Hossain", flat: "E1", building: "Sunset Tower", type: "Advance Adjustment", amount: 2000, dueDate: "Mar 15, 2026", daysOverdue: 4, status: "overdue" },
  { tenant: "Nasrin Akter", flat: "E2", building: "Sunset Tower", type: "Maintenance Fee", amount: 1500, dueDate: "Apr 1, 2026", daysOverdue: 0, status: "upcoming" },
];

const catColors: Record<string, string> = {
  Maintenance: "bg-blue-100 text-blue-700",
  Repair: "bg-orange-100 text-orange-700",
  Cleaning: "bg-green-100 text-green-700",
  Salary: "bg-purple-100 text-purple-700",
  Utilities: "bg-amber-100 text-amber-700",
};

type SidebarKey = "dashboard" | "buildings" | "flats" | "flatOwner" | "tenants" | "paymentStatus" | "expenses" | "accountPayable" | "accountReceivable" | "reports" | "settings";

const sidebarItems: { icon: typeof BarChart3; key: SidebarKey; label: string }[] = [
  { icon: BarChart3, key: "dashboard", label: "Dashboard" },
  { icon: Building2, key: "buildings", label: "Buildings" },
  { icon: Home, key: "flats", label: "Flats" },
  { icon: UserCheck, key: "flatOwner", label: "Flat Owner" },
  { icon: Users, key: "tenants", label: "Tenants" },
  { icon: CreditCard, key: "paymentStatus", label: "Payment Status" },
  { icon: FileText, key: "expenses", label: "Expenses" },
  { icon: ArrowUpCircle, key: "accountPayable", label: "Account Payable" },
  { icon: ArrowDownCircle, key: "accountReceivable", label: "Account Receivable" },
  { icon: BarChart2, key: "reports", label: "Reports" },
  { icon: Settings, key: "settings", label: "Settings" },
];

// ─── Main Component ──────────────────────────────────────
const BuildingManagement = () => {
  const [activeTab, setActiveTab] = useState<SidebarKey>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState<typeof tenantsList[0] | null>(null);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardContent />;
      case "buildings": return <BuildingsContent />;
      case "flats": return <FlatsContent />;
      case "flatOwner": return <FlatOwnerContent />;
      case "tenants": return <TenantsContent onSelectTenant={setSelectedTenant} />;
      case "paymentStatus": return <PaymentStatusContent />;
      case "expenses": return <ExpensesContent />;
      case "accountPayable": return <AccountPayableContent />;
      case "accountReceivable": return <AccountReceivableContent />;
      case "reports": return <ReportsContent />;
      case "settings": return <SettingsContent />;
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-[260px]" : "w-0 overflow-hidden"} transition-all duration-300 bg-[#1A0000] flex flex-col flex-shrink-0 fixed h-full z-20`}>
        <div className="p-4 pb-3">
          <Link to="/" className="flex items-center gap-2">
            <img src="/src/assets/rento-logo.png" alt="Rento" className="h-8 rounded-lg" />
            <span className="text-base font-heading font-bold text-white">Rento</span>
          </Link>
        </div>
        <div className="mx-4 mb-3 border-t border-white/10" />
        <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
          {sidebarItems.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] transition-colors ${
                activeTab === item.key ? "bg-[#9B0000] text-white border-l-[3px] border-l-[#C41E1E]" : "text-gray-400 hover:text-white hover:bg-[#2A0000]"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#9B0000] flex items-center justify-center text-white text-xs font-bold">MR</div>
            <div><p className="text-white text-xs font-medium">M. Rahman</p></div>
          </div>
          <Link to="/" className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-gray-400 hover:text-white hover:bg-[#2A0000] transition-colors">
            <LogOut className="h-4 w-4" />
            Log out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-w-0 ${sidebarOpen ? "ml-[260px]" : ""} transition-all duration-300`}>
        <header className="h-14 bg-white border-b border-border flex items-center justify-between px-5 flex-shrink-0 shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
              <Menu className="h-4 w-4 text-muted-foreground" />
            </button>
            <span className="text-sm text-muted-foreground">Building Management Dashboard</span>
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
                <div><span className="text-muted-foreground">Phone</span><p className="font-medium text-foreground">{selectedTenant.phone}</p></div>
                <div><span className="text-muted-foreground">Flat</span><p className="font-medium text-foreground">{selectedTenant.flat}</p></div>
                <div><span className="text-muted-foreground">Building</span><p className="font-medium text-foreground">{selectedTenant.building}</p></div>
                <div><span className="text-muted-foreground">Move-in</span><p className="font-medium text-foreground">{selectedTenant.moveIn}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F8FAFC] rounded-xl p-3">
                  <span className="text-[11px] text-muted-foreground">Total Paid This Year</span>
                  <p className="text-lg font-bold text-foreground">৳{selectedTenant.totalPaid.toLocaleString()}</p>
                </div>
                <div className="bg-[#F8FAFC] rounded-xl p-3">
                  <span className="text-[11px] text-muted-foreground">Advance Held</span>
                  <p className="text-lg font-bold text-foreground">৳{selectedTenant.advance.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Payment History</h3>
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
                <button className="flex-1 h-9 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90">Edit Tenant</button>
                <button className="flex-1 h-9 border border-destructive text-destructive text-xs font-medium rounded-lg hover:bg-destructive/5">Remove Tenant</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── TAB 1: Dashboard ────────────────────────────────────

const DashboardContent = () => {
  const statCards = [
    { label: "Total Monthly Service Charge", value: "BDT 48,000", sub: "This month's total", trend: "+3 flats vs last month", trendColor: "text-muted-foreground", icon: Receipt, iconBg: "bg-indigo-100 text-indigo-600", accentColor: "border-l-indigo-500" },
    { label: "Total Collected", value: "BDT 34,500", sub: "Received this month", trend: "72% collection rate", trendColor: "text-green-600", icon: CheckCircle2, iconBg: "bg-green-100 text-green-600", accentColor: "border-l-green-500" },
    { label: "Account Receivable", value: "BDT 13,500", sub: "Yet to be collected", trend: "3 flats pending", trendColor: "text-red-600", icon: ArrowDownCircle, iconBg: "bg-red-100 text-red-600", accentColor: "border-l-red-500" },
    { label: "Total Expense", value: "BDT 27,800", sub: "Spent this month", trend: "6 expense entries", trendColor: "text-muted-foreground", icon: TrendingDown, iconBg: "bg-orange-100 text-orange-600", accentColor: "border-l-orange-500" },
    { label: "Account Payable", value: "BDT 8,200", sub: "Association owes to fund", trend: "Fund borrowed", trendColor: "text-amber-600", icon: ArrowUpCircle, iconBg: "bg-amber-100 text-amber-600", accentColor: "border-l-amber-500" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-heading font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Building management overview</p>
      </div>

      {/* 5 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map(s => (
          <div key={s.label} className={`bg-white rounded-2xl p-4 shadow-sm border-l-4 ${s.accentColor}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-muted-foreground font-medium leading-tight">{s.label}</span>
              <div className={`w-8 h-8 rounded-xl ${s.iconBg} flex items-center justify-center`}><s.icon className="h-4 w-4" /></div>
            </div>
            <p className="text-xl font-heading font-bold text-foreground">{s.value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{s.sub}</p>
            <p className={`text-[10px] mt-1 ${s.trendColor}`}>{s.trend}</p>
          </div>
        ))}
      </div>

      {/* Chart Row 1: 60/40 */}
      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-heading font-semibold text-foreground text-sm">Service Charge Collection Trend</h3>
          <p className="text-[11px] text-muted-foreground mb-4">Monthly collected vs uncollected</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={collectionTrendData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip formatter={(v: number) => [`BDT ${v.toLocaleString()}`, ""]} />
              <Legend iconType="circle" iconSize={8} formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>} />
              <Bar dataKey="collected" name="Collected" fill="#16A34A" radius={[4, 4, 0, 0]} barSize={18} />
              <Bar dataKey="notCollected" name="Not Collected" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-heading font-semibold text-foreground text-sm mb-4">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={expensePieData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} dataKey="value" paddingAngle={2}>
                {expensePieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`BDT ${v.toLocaleString()}`, ""]} />
              <text x="50%" y="48%" textAnchor="middle" fill="#334155" fontSize={11} fontWeight={500}>Total</text>
              <text x="50%" y="56%" textAnchor="middle" fill="#0F172A" fontSize={14} fontWeight={700}>BDT 27,800</text>
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

      {/* Chart Row 2: Full width */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h3 className="font-heading font-semibold text-foreground text-sm">Income vs Expense vs Account Payable</h3>
        <p className="text-[11px] text-muted-foreground mb-4">Monthly financial health overview</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={incomeExpenseData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
            <Tooltip formatter={(v: number) => [`BDT ${v.toLocaleString()}`, ""]} />
            <Legend iconType="circle" iconSize={8} formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>} />
            <Bar dataKey="income" name="Income" fill="#16A34A" radius={[4, 4, 0, 0]} barSize={16} />
            <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={16} />
            <Bar dataKey="payable" name="Account Payable" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Payments Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <h3 className="font-heading font-semibold text-foreground text-sm">Recent Payments</h3>
          <button className="text-xs text-primary hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#F8FAFC]">
              {["Resident Name", "Flat Number", "Amount", "Method", "Status"].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-foreground text-[11px] uppercase tracking-wide">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {dashPayments.map((p, i) => (
                <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="p-3 text-foreground text-xs font-medium">{p.tenant}</td>
                  <td className="p-3 text-muted-foreground text-xs">{p.flat}</td>
                  <td className="p-3 text-foreground text-xs font-medium">BDT {p.amount.toLocaleString()}</td>
                  <td className="p-3 text-muted-foreground text-xs">{p.method}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${p.status === "paid" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                      {p.status === "paid" ? "Paid ✅" : "Due 🔴"}
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

// ─── TAB 2: Buildings ────────────────────────────────────

const BuildingsContent = () => (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-heading font-bold text-foreground">Buildings</h1>
      <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90"><Plus className="h-3.5 w-3.5" /> Add Building</button>
    </div>
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-[#F8FAFC]">
            {["Building Name", "Address", "Total Flats", "Occupied", "Vacant", "Monthly Fund", "Actions"].map(h => (
              <th key={h} className="text-left p-3 font-semibold text-foreground text-[11px] uppercase tracking-wide">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {buildings.map((b, i) => (
              <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]">
                <td className="p-3 text-foreground text-xs font-medium">{b.name}</td>
                <td className="p-3 text-muted-foreground text-xs">{b.address}</td>
                <td className="p-3 text-foreground text-xs">{b.totalFlats}</td>
                <td className="p-3 text-foreground text-xs">{b.occupied}</td>
                <td className="p-3 text-foreground text-xs">{b.vacant}</td>
                <td className="p-3 text-foreground text-xs font-medium">BDT {b.monthlyFund.toLocaleString()}</td>
                <td className="p-3 flex gap-2">
                  <button className="text-xs text-primary hover:underline flex items-center gap-1"><Eye className="h-3 w-3" />View</button>
                  <button className="text-xs text-muted-foreground hover:underline flex items-center gap-1"><Edit className="h-3 w-3" />Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ─── TAB 3: Flats ────────────────────────────────────────

const FlatsContent = () => {
  const [buildingFilter, setBuildingFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const filtered = flats.filter(f =>
    (buildingFilter === "All" || f.building === buildingFilter) &&
    (statusFilter === "All" || f.status === statusFilter)
  );
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-heading font-bold text-foreground">Flats</h1>
        <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90"><Plus className="h-3.5 w-3.5" /> Add Flat</button>
      </div>
      <div className="flex gap-3">
        <select value={buildingFilter} onChange={e => setBuildingFilter(e.target.value)} className="h-9 rounded-lg border border-input bg-background px-3 text-xs">
          <option value="All">All Buildings</option>
          {buildings.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 rounded-lg border border-input bg-background px-3 text-xs">
          <option value="All">All Status</option>
          <option value="Occupied">Occupied</option>
          <option value="Vacant">Vacant</option>
        </select>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#F8FAFC]">
              {["Flat No.", "Building", "Floor", "Size (sqft)", "Service Charge", "Status", "Current Tenant", "Actions"].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-foreground text-[11px] uppercase tracking-wide">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((f, i) => (
                <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]">
                  <td className="p-3 text-foreground text-xs font-medium">{f.flat}</td>
                  <td className="p-3 text-muted-foreground text-xs">{f.building}</td>
                  <td className="p-3 text-muted-foreground text-xs">{f.floor}</td>
                  <td className="p-3 text-muted-foreground text-xs">{f.size}</td>
                  <td className="p-3 text-foreground text-xs font-medium">BDT {f.serviceCharge.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${f.status === "Occupied" ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-600"}`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground text-xs">{f.tenant}</td>
                  <td className="p-3">
                    <button className="text-xs text-primary hover:underline">{f.status === "Occupied" ? "View" : "Assign"}</button>
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

// ─── TAB 4: Flat Owner ───────────────────────────────────

const FlatOwnerContent = () => (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-heading font-bold text-foreground">Flat Owners</h1>
      <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90"><Plus className="h-3.5 w-3.5" /> Add Owner</button>
    </div>
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-[#F8FAFC]">
            {["Owner Name", "Phone Number", "Flat No.", "Building", "Ownership Since", "Tenant Living", "Status", "Actions"].map(h => (
              <th key={h} className="text-left p-3 font-semibold text-foreground text-[11px] uppercase tracking-wide">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {flatOwners.map((o, i) => (
              <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]">
                <td className="p-3 text-foreground text-xs font-medium">{o.name}</td>
                <td className="p-3 text-muted-foreground text-xs">{o.phone}</td>
                <td className="p-3 text-foreground text-xs">{o.flat}</td>
                <td className="p-3 text-muted-foreground text-xs">{o.building}</td>
                <td className="p-3 text-muted-foreground text-xs">{o.since}</td>
                <td className="p-3 text-muted-foreground text-xs">{o.tenantLiving}</td>
                <td className="p-3">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary">{o.status}</span>
                </td>
                <td className="p-3 flex gap-2">
                  <button className="text-xs text-primary hover:underline flex items-center gap-1"><Eye className="h-3 w-3" />View</button>
                  <button className="text-xs text-muted-foreground hover:underline flex items-center gap-1"><Edit className="h-3 w-3" />Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ─── TAB 5: Tenants ──────────────────────────────────────

const TenantsContent = ({ onSelectTenant }: { onSelectTenant: (t: typeof tenantsList[0]) => void }) => (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-heading font-bold text-foreground">Tenants</h1>
      <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90"><Plus className="h-3.5 w-3.5" /> Add Tenant</button>
    </div>
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-[#F8FAFC]">
            {["Name", "Flat No.", "Building", "Phone Number", "Move-in Date", "Service Charge", "Status", "Actions"].map(h => (
              <th key={h} className="text-left p-3 font-semibold text-foreground text-[11px] uppercase tracking-wide">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {tenantsList.map((tt, i) => (
              <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]">
                <td className="p-3 text-foreground text-xs font-medium">{tt.name}</td>
                <td className="p-3 text-muted-foreground text-xs">{tt.flat}</td>
                <td className="p-3 text-muted-foreground text-xs">{tt.building}</td>
                <td className="p-3 text-muted-foreground text-xs">{tt.phone}</td>
                <td className="p-3 text-muted-foreground text-xs">{tt.moveIn}</td>
                <td className="p-3 text-foreground text-xs font-medium">BDT {tt.rent.toLocaleString()}</td>
                <td className="p-3"><span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary">{tt.status}</span></td>
                <td className="p-3">
                  <button onClick={() => onSelectTenant(tt)} className="text-xs text-primary hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ─── TAB 6: Payment Status ──────────────────────────────

const PaymentStatusContent = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const filtered = paymentStatusData.filter(p => statusFilter === "All" || (statusFilter === "Paid" ? p.status === "paid" : p.status === "due"));
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-heading font-bold text-foreground">Payment Status</h1>
        <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90"><Plus className="h-3.5 w-3.5" /> Record Payment</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm"><span className="text-[11px] text-muted-foreground">Total Collectable</span><p className="text-xl font-bold text-foreground">BDT 48,000</p></div>
        <div className="bg-white rounded-2xl p-4 shadow-sm"><span className="text-[11px] text-muted-foreground">Collected</span><p className="text-xl font-bold text-green-600">BDT 34,500</p></div>
        <div className="bg-white rounded-2xl p-4 shadow-sm"><span className="text-[11px] text-muted-foreground">Due</span><p className="text-xl font-bold text-destructive">BDT 13,500</p></div>
      </div>
      <div className="flex gap-3">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 rounded-lg border border-input bg-background px-3 text-xs">
          <option value="All">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Due">Due</option>
        </select>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#F8FAFC]">
              {["Tenant", "Flat", "Building", "Amount", "Month", "Payment Date", "Method", "Status", "Actions"].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-foreground text-[11px] uppercase tracking-wide">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]">
                  <td className="p-3 text-foreground text-xs font-medium">{p.tenant}</td>
                  <td className="p-3 text-muted-foreground text-xs">{p.flat}</td>
                  <td className="p-3 text-muted-foreground text-xs">{p.building}</td>
                  <td className="p-3 text-foreground text-xs font-medium">BDT {p.amount.toLocaleString()}</td>
                  <td className="p-3 text-muted-foreground text-xs">{p.month}</td>
                  <td className="p-3 text-muted-foreground text-xs">{p.date}</td>
                  <td className="p-3 text-muted-foreground text-xs">{p.method}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${p.status === "paid" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                      {p.status === "paid" ? "Paid" : "Due"}
                    </span>
                  </td>
                  <td className="p-3">
                    {p.status === "paid" ? (
                      <button className="text-xs text-primary hover:underline">Receipt</button>
                    ) : (
                      <button onClick={() => toast.success(`Reminder sent to ${p.tenant}`)} className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-700 hover:bg-amber-200">Remind</button>
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

// ─── TAB 7: Expenses ─────────────────────────────────────

const ExpensesContent = () => {
  const [catFilter, setCatFilter] = useState("All");
  const filtered = expensesList.filter(e => catFilter === "All" || e.category === catFilter);
  const total = filtered.reduce((sum, e) => sum + e.amount, 0);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-heading font-bold text-foreground">Expenses</h1>
        <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90"><Plus className="h-3.5 w-3.5" /> Add Expense</button>
      </div>
      <div className="flex gap-3">
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="h-9 rounded-lg border border-input bg-background px-3 text-xs">
          <option value="All">All Categories</option>
          {["Maintenance", "Repair", "Salary", "Utilities", "Cleaning"].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#F8FAFC]">
              {["Date", "Description", "Amount", "Category", "Building", "Added By"].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-foreground text-[11px] uppercase tracking-wide">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]">
                  <td className="p-3 text-muted-foreground text-xs">{e.date}</td>
                  <td className="p-3 text-foreground text-xs font-medium">{e.desc}</td>
                  <td className="p-3 text-foreground text-xs font-medium">BDT {e.amount.toLocaleString()}</td>
                  <td className="p-3"><span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${catColors[e.category] || "bg-gray-100 text-gray-700"}`}>{e.category}</span></td>
                  <td className="p-3 text-muted-foreground text-xs">{e.building}</td>
                  <td className="p-3 text-muted-foreground text-xs">{e.addedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-[#F1F5F9] flex justify-end">
          <span className="text-sm font-bold text-foreground">Total: BDT {total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

// ─── TAB 8: Account Payable ──────────────────────────────

const AccountPayableContent = () => (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-heading font-bold text-foreground">Account Payable</h1>
        <p className="text-sm text-muted-foreground">Amounts the association owes to vendors & service providers</p>
      </div>
      <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90"><Plus className="h-3.5 w-3.5" /> Add Payable</button>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm"><span className="text-[11px] text-muted-foreground">Total Payable</span><p className="text-xl font-bold text-foreground">BDT 39,200</p></div>
      <div className="bg-white rounded-2xl p-4 shadow-sm"><span className="text-[11px] text-muted-foreground">Paid</span><p className="text-xl font-bold text-green-600">BDT 12,700</p></div>
      <div className="bg-white rounded-2xl p-4 shadow-sm"><span className="text-[11px] text-muted-foreground">Pending</span><p className="text-xl font-bold text-amber-600">BDT 26,500</p></div>
    </div>
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-[#F8FAFC]">
            {["Date", "Description", "Amount", "Pay To", "Status", "Actions"].map(h => (
              <th key={h} className="text-left p-3 font-semibold text-foreground text-[11px] uppercase tracking-wide">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {accountPayableData.map((a, i) => (
              <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]">
                <td className="p-3 text-muted-foreground text-xs">{a.date}</td>
                <td className="p-3 text-foreground text-xs font-medium">{a.description}</td>
                <td className="p-3 text-foreground text-xs font-medium">BDT {a.amount.toLocaleString()}</td>
                <td className="p-3 text-muted-foreground text-xs">{a.payTo}</td>
                <td className="p-3">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${a.status === "paid" ? "bg-primary/10 text-primary" : "bg-amber-100 text-amber-700"}`}>
                    {a.status === "paid" ? "Paid" : "Pending"}
                  </span>
                </td>
                <td className="p-3">
                  {a.status === "pending" && (
                    <button className="text-xs text-primary hover:underline">Mark Paid</button>
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

// ─── TAB 9: Account Receivable ───────────────────────────

const AccountReceivableContent = () => (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-heading font-bold text-foreground">Account Receivable</h1>
        <p className="text-sm text-muted-foreground">Outstanding amounts to be collected from residents</p>
      </div>
      <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90"><Plus className="h-3.5 w-3.5" /> Add Entry</button>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm"><span className="text-[11px] text-muted-foreground">Total Receivable</span><p className="text-xl font-bold text-foreground">BDT 17,500</p></div>
      <div className="bg-white rounded-2xl p-4 shadow-sm"><span className="text-[11px] text-muted-foreground">Overdue</span><p className="text-xl font-bold text-destructive">BDT 14,000</p></div>
      <div className="bg-white rounded-2xl p-4 shadow-sm"><span className="text-[11px] text-muted-foreground">Upcoming</span><p className="text-xl font-bold text-amber-600">BDT 3,500</p></div>
    </div>
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-[#F8FAFC]">
            {["Tenant", "Flat", "Building", "Type", "Amount", "Due Date", "Days Overdue", "Status", "Actions"].map(h => (
              <th key={h} className="text-left p-3 font-semibold text-foreground text-[11px] uppercase tracking-wide">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {accountReceivableData.map((a, i) => (
              <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]">
                <td className="p-3 text-foreground text-xs font-medium">{a.tenant}</td>
                <td className="p-3 text-muted-foreground text-xs">{a.flat}</td>
                <td className="p-3 text-muted-foreground text-xs">{a.building}</td>
                <td className="p-3 text-muted-foreground text-xs">{a.type}</td>
                <td className="p-3 text-foreground text-xs font-medium">BDT {a.amount.toLocaleString()}</td>
                <td className="p-3 text-muted-foreground text-xs">{a.dueDate}</td>
                <td className="p-3">
                  {a.daysOverdue > 0 ? (
                    <span className="text-xs text-destructive font-medium">{a.daysOverdue} days</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="p-3">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${a.status === "overdue" ? "bg-destructive/10 text-destructive" : "bg-amber-100 text-amber-700"}`}>
                    {a.status === "overdue" ? "Overdue" : "Upcoming"}
                  </span>
                </td>
                <td className="p-3">
                  <button onClick={() => toast.success(`Reminder sent to ${a.tenant}`)} className="text-xs flex items-center gap-1 text-primary hover:underline"><Send className="h-3 w-3" />Remind</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ─── TAB 10: Reports ─────────────────────────────────────

const ReportsContent = () => (
  <div className="space-y-5">
    <h1 className="text-xl font-heading font-bold text-foreground">Reports</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[
        { title: "Monthly Collection Report", desc: "Service charge collection summary by month", icon: BarChart3 },
        { title: "Expense Report", desc: "Detailed breakdown of all expenses by category", icon: FileText },
        { title: "Tenant Occupancy Report", desc: "Flat occupancy rates across all buildings", icon: Users },
        { title: "Outstanding Dues Report", desc: "List of all pending payments and overdue amounts", icon: ArrowDownCircle },
        { title: "Income vs Expense Report", desc: "Profit/loss overview for each building", icon: TrendingDown },
        { title: "Flat Owner Summary", desc: "Owner-wise property and tenant details", icon: UserCheck },
      ].map((r, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
            <r.icon className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{r.title}</h3>
          <p className="text-[11px] text-muted-foreground mt-1">{r.desc}</p>
          <button className="mt-3 text-xs text-primary hover:underline">Generate →</button>
        </div>
      ))}
    </div>
  </div>
);

// ─── TAB 11: Settings ────────────────────────────────────

const SettingsContent = () => (
  <div className="space-y-6 max-w-2xl">
    <h1 className="text-xl font-heading font-bold text-foreground">Settings</h1>

    {/* Building Profile */}
    <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
      <h2 className="text-sm font-semibold text-foreground">Building Profile</h2>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-xs text-muted-foreground block mb-1">Building Name</label><input defaultValue="Sunset Tower" className="w-full h-9 border border-input rounded-lg px-3 text-xs bg-background" /></div>
        <div><label className="text-xs text-muted-foreground block mb-1">Address</label><input defaultValue="Road 5, Dhanmondi, Dhaka" className="w-full h-9 border border-input rounded-lg px-3 text-xs bg-background" /></div>
        <div><label className="text-xs text-muted-foreground block mb-1">Total Floors</label><input defaultValue="6" type="number" className="w-full h-9 border border-input rounded-lg px-3 text-xs bg-background" /></div>
        <div><label className="text-xs text-muted-foreground block mb-1">Total Flats</label><input defaultValue="24" type="number" className="w-full h-9 border border-input rounded-lg px-3 text-xs bg-background" /></div>
      </div>
      <button className="bg-primary text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-primary/90">Save Changes</button>
    </div>

    {/* Notification Preferences */}
    <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
      <h2 className="text-sm font-semibold text-foreground">Notification Preferences</h2>
      {[
        "Send payment reminders (3 days before due)",
        "Send overdue alerts",
        "Send payment confirmations",
        "Email notifications",
        "SMS notifications",
      ].map((label, i) => (
        <label key={i} className="flex items-center justify-between">
          <span className="text-xs text-foreground">{label}</span>
          <input type="checkbox" defaultChecked={i < 3} className="w-4 h-4 rounded border-input text-primary accent-[#9B0000]" />
        </label>
      ))}
    </div>

    {/* Account */}
    <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
      <h2 className="text-sm font-semibold text-foreground">Account</h2>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-xs text-muted-foreground block mb-1">Owner Name</label><input defaultValue="Muhammad Mushfiqur Rahman" className="w-full h-9 border border-input rounded-lg px-3 text-xs bg-background" /></div>
        <div><label className="text-xs text-muted-foreground block mb-1">Phone Number</label><input defaultValue="01711-000000" className="w-full h-9 border border-input rounded-lg px-3 text-xs bg-background" /></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div><label className="text-xs text-muted-foreground block mb-1">Current Password</label><input type="password" className="w-full h-9 border border-input rounded-lg px-3 text-xs bg-background" /></div>
        <div><label className="text-xs text-muted-foreground block mb-1">New Password</label><input type="password" className="w-full h-9 border border-input rounded-lg px-3 text-xs bg-background" /></div>
        <div><label className="text-xs text-muted-foreground block mb-1">Confirm Password</label><input type="password" className="w-full h-9 border border-input rounded-lg px-3 text-xs bg-background" /></div>
      </div>
      <button className="bg-primary text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-primary/90">Update Profile</button>
    </div>
  </div>
);

export default BuildingManagement;
