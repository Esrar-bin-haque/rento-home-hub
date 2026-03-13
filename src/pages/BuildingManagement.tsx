import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2, BarChart3, Home, Users, DollarSign, FileText, Bell, Settings,
  LogOut, Menu, ChevronRight, TrendingUp, TrendingDown, LayoutGrid, Search,
  Plus, MoreHorizontal
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

const sidebarItems = [
  { icon: BarChart3, label: "Dashboard" },
  { icon: Building2, label: "Buildings" },
  { icon: Home, label: "Flats" },
  { icon: Users, label: "Tenants" },
  { icon: DollarSign, label: "Rent Payments" },
  { icon: FileText, label: "Expenses" },
  { icon: TrendingUp, label: "Reports" },
  { icon: Bell, label: "Notifications" },
  { icon: Settings, label: "Settings" },
];

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

const payments = [
  { tenant: "Aminul Islam", flat: "1A", amount: 15000, method: "bKash", status: "paid" },
  { tenant: "Fatema Begum", flat: "1B", amount: 18000, method: "Nagad", status: "paid" },
  { tenant: "Shakil Rahman", flat: "2A", amount: 16000, method: "Bank Transfer", status: "paid" },
  { tenant: "Razia Sultana", flat: "3A", amount: 17000, method: "Cash", status: "paid" },
  { tenant: "Kamal Hossain", flat: "2B", amount: 20000, method: "—", status: "due" },
  { tenant: "Nadia Islam", flat: "3B", amount: 22000, method: "—", status: "due" },
  { tenant: "Arif Ahmed", flat: "4A", amount: 19000, method: "bKash", status: "paid" },
  { tenant: "Sumaiya Khan", flat: "4B", amount: 24000, method: "Nagad", status: "paid" },
];

const buildings = [
  { name: "Sunset Tower", location: "Dhanmondi", flats: 12, occupancy: "92%" },
  { name: "Green Valley", location: "Gulshan", flats: 8, occupancy: "100%" },
  { name: "River View", location: "Banani", flats: 6, occupancy: "83%" },
];

const flats = [
  { flat: "1A", building: "Sunset Tower", size: "1200 sqft", rent: 15000, status: "Occupied" },
  { flat: "1B", building: "Sunset Tower", size: "1400 sqft", rent: 18000, status: "Occupied" },
  { flat: "2A", building: "Sunset Tower", size: "1100 sqft", rent: 16000, status: "Occupied" },
  { flat: "2B", building: "Green Valley", size: "1500 sqft", rent: 20000, status: "Occupied" },
  { flat: "3A", building: "Green Valley", size: "1300 sqft", rent: 17000, status: "Occupied" },
  { flat: "3B", building: "River View", size: "1600 sqft", rent: 22000, status: "Occupied" },
  { flat: "4A", building: "River View", size: "1200 sqft", rent: 19000, status: "Vacant" },
  { flat: "4B", building: "Sunset Tower", size: "1800 sqft", rent: 24000, status: "Occupied" },
];

const tenantsList = [
  { name: "Aminul Islam", flat: "1A", building: "Sunset Tower", phone: "01711-XXXXXX", since: "Jan 2025" },
  { name: "Fatema Begum", flat: "1B", building: "Sunset Tower", phone: "01812-XXXXXX", since: "Mar 2025" },
  { name: "Shakil Rahman", flat: "2A", building: "Sunset Tower", phone: "01911-XXXXXX", since: "Jun 2025" },
  { name: "Razia Sultana", flat: "3A", building: "Green Valley", phone: "01611-XXXXXX", since: "Feb 2025" },
  { name: "Kamal Hossain", flat: "2B", building: "Green Valley", phone: "01511-XXXXXX", since: "Aug 2025" },
  { name: "Nadia Islam", flat: "3B", building: "River View", phone: "01711-XXXXXX", since: "Nov 2025" },
];

const expensesList = [
  { date: "Mar 5", desc: "Generator maintenance", amount: 8500, category: "Maintenance", building: "Sunset Tower" },
  { date: "Mar 3", desc: "Lift repair", amount: 15000, category: "Repair", building: "Green Valley" },
  { date: "Feb 28", desc: "Common area cleaning", amount: 3000, category: "Cleaning", building: "Sunset Tower" },
  { date: "Feb 25", desc: "Security guard salary", amount: 12000, category: "Salary", building: "All" },
  { date: "Feb 20", desc: "Water pump repair", amount: 5500, category: "Repair", building: "River View" },
  { date: "Feb 15", desc: "Electricity bill", amount: 5500, category: "Utility", building: "Sunset Tower" },
];

const catColors: Record<string, string> = {
  Maintenance: "bg-blue-100 text-blue-700",
  Repair: "bg-orange-100 text-orange-700",
  Cleaning: "bg-green-100 text-green-700",
  Salary: "bg-purple-100 text-purple-700",
  Utility: "bg-amber-100 text-amber-700",
};

const BuildingManagement = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardContent />;
      case "Buildings":
        return <BuildingsContent />;
      case "Flats":
        return <FlatsContent />;
      case "Tenants":
        return <TenantsContent />;
      case "Rent Payments":
        return <RentPaymentsContent />;
      case "Expenses":
        return <ExpensesContent />;
      default:
        return <PlaceholderContent tab={activeTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-[200px]" : "w-0 overflow-hidden"} transition-all duration-300 bg-[#0F172A] flex flex-col flex-shrink-0 fixed h-full z-20`}>
        <div className="p-4 pb-6">
          <Link to="/" className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span className="text-base font-heading font-bold text-white">Rento</span>
          </Link>
        </div>
        <nav className="flex-1 px-2 space-y-0.5">
          {sidebarItems.map(item => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors ${
                activeTab === item.label
                  ? "bg-primary text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={`flex-1 flex flex-col min-w-0 ${sidebarOpen ? "ml-[200px]" : ""} transition-all duration-300`}>
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-border flex items-center justify-between px-5 flex-shrink-0 shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
              <Menu className="h-4 w-4 text-muted-foreground" />
            </button>
            <span className="text-sm text-muted-foreground">Property Owner Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-5 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const DashboardContent = () => (
  <div className="space-y-5">
    <div>
      <h1 className="text-xl font-heading font-bold text-foreground">Dashboard</h1>
      <p className="text-sm text-muted-foreground">Overview of your property portfolio</p>
    </div>

    {/* Stat Cards */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "Total Monthly Rent", value: "৳1,51,000", sub: "8 tenants", icon: FileText, iconBg: "bg-blue-100 text-blue-600" },
        { label: "Rent Collected", value: "৳92,000", sub: "This month", icon: TrendingUp, iconBg: "bg-green-100 text-green-600" },
        { label: "Rent Due", value: "৳59,000", sub: "3 pending", icon: TrendingDown, iconBg: "bg-red-100 text-red-600" },
        { label: "Total Expenses", value: "৳49,500", sub: "6 entries", icon: LayoutGrid, iconBg: "bg-primary/10 text-primary" },
      ].map(s => (
        <div key={s.label} className="bg-white rounded-2xl p-5 border border-[#F1F5F9] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
            <div className={`w-9 h-9 rounded-xl ${s.iconBg} flex items-center justify-center`}>
              <s.icon className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground">{s.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
        </div>
      ))}
    </div>

    {/* Charts Row */}
    <div className="grid lg:grid-cols-5 gap-5">
      {/* Bar Chart */}
      <div className="lg:col-span-3 bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-5">
        <h3 className="font-heading font-semibold text-foreground text-sm mb-4">Rent Collection Trend</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
            <Tooltip formatter={(v: number) => [`৳${v.toLocaleString()}`, ""]} />
            <Legend iconType="circle" iconSize={8} formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>} />
            <Bar dataKey="collected" name="Collected" fill="hsl(175,85%,32%)" radius={[4, 4, 0, 0]} barSize={20} />
            <Bar dataKey="due" name="Due" fill="hsl(0,84%,60%)" radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-5">
        <h3 className="font-heading font-semibold text-foreground text-sm mb-4">Expense Breakdown</h3>
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

    {/* Payments Table */}
    <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
      <div className="p-4 border-b border-[#F1F5F9]">
        <h3 className="font-heading font-semibold text-foreground text-sm">Recent Payments</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F8FAFC]">
              {["Tenant", "Flat", "Amount", "Method", "Status"].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-foreground text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((p, i) => (
              <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                <td className="p-3 text-foreground text-xs font-medium">{p.tenant}</td>
                <td className="p-3 text-muted-foreground text-xs">{p.flat}</td>
                <td className="p-3 text-foreground text-xs font-medium">৳{p.amount.toLocaleString()}</td>
                <td className="p-3 text-muted-foreground text-xs">{p.method}</td>
                <td className="p-3">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                    p.status === "paid" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                  }`}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const BuildingsContent = () => (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-heading font-bold text-foreground">Buildings</h1>
        <p className="text-sm text-muted-foreground">Manage your properties</p>
      </div>
      <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors">
        <Plus className="h-3.5 w-3.5" /> Add Building
      </button>
    </div>
    <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#F8FAFC]">
            {["Building Name", "Location", "Total Flats", "Occupancy", "Actions"].map(h => (
              <th key={h} className="text-left p-3 font-semibold text-foreground text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {buildings.map((b, i) => (
            <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
              <td className="p-3 text-foreground text-xs font-medium">{b.name}</td>
              <td className="p-3 text-muted-foreground text-xs">{b.location}</td>
              <td className="p-3 text-foreground text-xs">{b.flats}</td>
              <td className="p-3"><span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary">{b.occupancy}</span></td>
              <td className="p-3"><MoreHorizontal className="h-4 w-4 text-muted-foreground cursor-pointer" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const FlatsContent = () => (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-heading font-bold text-foreground">Flats</h1>
        <p className="text-sm text-muted-foreground">All units across your buildings</p>
      </div>
      <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors">
        <Plus className="h-3.5 w-3.5" /> Add Flat
      </button>
    </div>
    <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#F8FAFC]">
            {["Flat", "Building", "Size", "Rent", "Status"].map(h => (
              <th key={h} className="text-left p-3 font-semibold text-foreground text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {flats.map((f, i) => (
            <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
              <td className="p-3 text-foreground text-xs font-medium">{f.flat}</td>
              <td className="p-3 text-muted-foreground text-xs">{f.building}</td>
              <td className="p-3 text-muted-foreground text-xs">{f.size}</td>
              <td className="p-3 text-foreground text-xs font-medium">৳{f.rent.toLocaleString()}</td>
              <td className="p-3">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                  f.status === "Occupied" ? "bg-primary/10 text-primary" : "bg-amber-100 text-amber-700"
                }`}>{f.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const TenantsContent = () => (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-heading font-bold text-foreground">Tenants</h1>
        <p className="text-sm text-muted-foreground">All registered tenants</p>
      </div>
      <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors">
        <Plus className="h-3.5 w-3.5" /> Add Tenant
      </button>
    </div>
    <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#F8FAFC]">
            {["Name", "Flat", "Building", "Phone", "Since"].map(h => (
              <th key={h} className="text-left p-3 font-semibold text-foreground text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tenantsList.map((t, i) => (
            <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
              <td className="p-3 text-foreground text-xs font-medium">{t.name}</td>
              <td className="p-3 text-muted-foreground text-xs">{t.flat}</td>
              <td className="p-3 text-muted-foreground text-xs">{t.building}</td>
              <td className="p-3 text-muted-foreground text-xs">{t.phone}</td>
              <td className="p-3 text-muted-foreground text-xs">{t.since}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const RentPaymentsContent = () => (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-heading font-bold text-foreground">Rent Payments</h1>
        <p className="text-sm text-muted-foreground">Track all rent transactions</p>
      </div>
      <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors">
        <Plus className="h-3.5 w-3.5" /> Record Payment
      </button>
    </div>
    <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#F8FAFC]">
            {["Tenant", "Flat", "Amount", "Method", "Status"].map(h => (
              <th key={h} className="text-left p-3 font-semibold text-foreground text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {payments.map((p, i) => (
            <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
              <td className="p-3 text-foreground text-xs font-medium">{p.tenant}</td>
              <td className="p-3 text-muted-foreground text-xs">{p.flat}</td>
              <td className="p-3 text-foreground text-xs font-medium">৳{p.amount.toLocaleString()}</td>
              <td className="p-3 text-muted-foreground text-xs">{p.method}</td>
              <td className="p-3">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                  p.status === "paid" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                }`}>{p.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ExpensesContent = () => (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-heading font-bold text-foreground">Expenses</h1>
        <p className="text-sm text-muted-foreground">Track building expenses</p>
      </div>
      <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors">
        <Plus className="h-3.5 w-3.5" /> Add Expense
      </button>
    </div>
    <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#F8FAFC]">
            {["Date", "Description", "Amount", "Category", "Building"].map(h => (
              <th key={h} className="text-left p-3 font-semibold text-foreground text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {expensesList.map((e, i) => (
            <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
              <td className="p-3 text-muted-foreground text-xs">{e.date}</td>
              <td className="p-3 text-foreground text-xs font-medium">{e.desc}</td>
              <td className="p-3 text-foreground text-xs font-medium">৳{e.amount.toLocaleString()}</td>
              <td className="p-3">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${catColors[e.category] || "bg-gray-100 text-gray-700"}`}>{e.category}</span>
              </td>
              <td className="p-3 text-muted-foreground text-xs">{e.building}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const PlaceholderContent = ({ tab }: { tab: string }) => {
  const Item = sidebarItems.find(s => s.label === tab)?.icon || BarChart3;
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-heading font-bold text-foreground">{tab}</h1>
        <p className="text-sm text-muted-foreground">Manage your {tab.toLowerCase()}</p>
      </div>
      <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Item className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-heading font-semibold text-foreground mb-1">{tab}</h3>
        <p className="text-sm text-muted-foreground">This section is under development. Check back soon!</p>
      </div>
    </div>
  );
};

export default BuildingManagement;
