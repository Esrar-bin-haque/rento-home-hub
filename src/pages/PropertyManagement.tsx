import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2, BarChart3, Home, Users, DollarSign, Bell, FileText, Settings,
  LogOut, Menu, TrendingUp, TrendingDown, LayoutGrid, Plus, MoreHorizontal
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

const sidebarItems = [
  { icon: BarChart3, label: "Dashboard" },
  { icon: Home, label: "My Properties" },
  { icon: Users, label: "Tenants" },
  { icon: DollarSign, label: "Rent Records" },
  { icon: Bell, label: "Reminders" },
  { icon: FileText, label: "Statements" },
  { icon: Settings, label: "Settings" },
];

const barData = [
  { month: "Oct", collected: 95000, due: 25000 },
  { month: "Nov", collected: 105000, due: 15000 },
  { month: "Dec", collected: 110000, due: 10000 },
  { month: "Jan", collected: 100000, due: 20000 },
  { month: "Feb", collected: 115000, due: 5000 },
  { month: "Mar", collected: 120000, due: 0 },
];

const expensePieData = [
  { name: "Maintenance", value: 12000, color: "hsl(175,85%,32%)" },
  { name: "Utilities", value: 18000, color: "hsl(43,96%,50%)" },
  { name: "Repairs", value: 8000, color: "hsl(0,84%,60%)" },
  { name: "Insurance", value: 5000, color: "hsl(217,91%,60%)" },
  { name: "Tax", value: 7000, color: "hsl(271,91%,65%)" },
];

const payments = [
  { tenant: "Aminul Islam", flat: "3A, Gulshan", amount: 35000, method: "bKash", status: "paid" },
  { tenant: "Sara Haque", flat: "5B, Banani", amount: 28000, method: "Nagad", status: "paid" },
  { tenant: "Rezaul Karim", flat: "House, Dhanmondi", amount: 42000, method: "—", status: "due" },
  { tenant: "Mithila Akter", flat: "2C, Uttara", amount: 15000, method: "Bank Transfer", status: "paid" },
];

const properties = [
  { name: "Flat 3A", location: "Gulshan", rent: 35000, tenant: "Aminul Islam", status: "Occupied" },
  { name: "Flat 5B", location: "Banani", rent: 28000, tenant: "Sara Haque", status: "Occupied" },
  { name: "House", location: "Dhanmondi", rent: 42000, tenant: "Rezaul Karim", status: "Occupied" },
  { name: "Flat 2C", location: "Uttara", rent: 15000, tenant: "Mithila Akter", status: "Occupied" },
];

const tenantsList = [
  { name: "Aminul Islam", property: "Flat 3A, Gulshan", phone: "01711-XXXXXX", rent: 35000, since: "Jan 2025" },
  { name: "Sara Haque", property: "Flat 5B, Banani", phone: "01812-XXXXXX", rent: 28000, since: "Mar 2025" },
  { name: "Rezaul Karim", property: "House, Dhanmondi", phone: "01911-XXXXXX", rent: 42000, since: "Jun 2025" },
  { name: "Mithila Akter", property: "Flat 2C, Uttara", phone: "01611-XXXXXX", rent: 15000, since: "Aug 2025" },
];

const reminders = [
  { tenant: "Rezaul Karim", type: "Rent Due", date: "Mar 10, 2026", status: "Pending" },
  { tenant: "All Tenants", type: "Lease Renewal", date: "Apr 1, 2026", status: "Upcoming" },
  { tenant: "Aminul Islam", type: "Maintenance", date: "Mar 15, 2026", status: "Scheduled" },
];

const PropertyManagement = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardContent />;
      case "My Properties":
        return <PropertiesContent />;
      case "Tenants":
        return <TenantsContent />;
      case "Rent Records":
        return <RentRecordsContent />;
      case "Reminders":
        return <RemindersContent />;
      default:
        return <PlaceholderContent tab={activeTab} />;
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

      <div className={`flex-1 flex flex-col min-w-0 ${sidebarOpen ? "ml-[200px]" : ""} transition-all duration-300`}>
        <header className="h-14 bg-white border-b border-border flex items-center justify-between px-5 flex-shrink-0 shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
              <Menu className="h-4 w-4 text-muted-foreground" />
            </button>
            <span className="text-sm text-muted-foreground">Property Management</span>
          </div>
          <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full" />
          </button>
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
      <p className="text-sm text-muted-foreground">Overview of your properties</p>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "My Properties", value: "4", sub: "Across 4 locations", icon: Home, iconBg: "bg-blue-100 text-blue-600" },
        { label: "Monthly Income", value: "৳1,20,000", sub: "This month", icon: TrendingUp, iconBg: "bg-green-100 text-green-600" },
        { label: "Active Tenants", value: "4", sub: "All active", icon: Users, iconBg: "bg-primary/10 text-primary" },
        { label: "Pending Dues", value: "1", sub: "Action needed", icon: TrendingDown, iconBg: "bg-red-100 text-red-600" },
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

    <div className="grid lg:grid-cols-5 gap-5">
      <div className="lg:col-span-3 bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-5">
        <h3 className="font-heading font-semibold text-foreground text-sm mb-4">Income Collection Trend</h3>
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

    <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
      <div className="p-4 border-b border-[#F1F5F9]">
        <h3 className="font-heading font-semibold text-foreground text-sm">Recent Payments</h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#F8FAFC]">
            {["Tenant", "Property", "Amount", "Method", "Status"].map(h => (
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

const PropertiesContent = () => (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-heading font-bold text-foreground">My Properties</h1>
        <p className="text-sm text-muted-foreground">Manage your rental properties</p>
      </div>
      <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors">
        <Plus className="h-3.5 w-3.5" /> Add Property
      </button>
    </div>
    <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#F8FAFC]">
            {["Property", "Location", "Rent", "Tenant", "Status"].map(h => (
              <th key={h} className="text-left p-3 font-semibold text-foreground text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {properties.map((p, i) => (
            <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
              <td className="p-3 text-foreground text-xs font-medium">{p.name}</td>
              <td className="p-3 text-muted-foreground text-xs">{p.location}</td>
              <td className="p-3 text-foreground text-xs font-medium">৳{p.rent.toLocaleString()}</td>
              <td className="p-3 text-muted-foreground text-xs">{p.tenant}</td>
              <td className="p-3"><span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary">{p.status}</span></td>
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
        <p className="text-sm text-muted-foreground">All your tenants</p>
      </div>
    </div>
    <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#F8FAFC]">
            {["Name", "Property", "Phone", "Rent", "Since"].map(h => (
              <th key={h} className="text-left p-3 font-semibold text-foreground text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tenantsList.map((t, i) => (
            <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
              <td className="p-3 text-foreground text-xs font-medium">{t.name}</td>
              <td className="p-3 text-muted-foreground text-xs">{t.property}</td>
              <td className="p-3 text-muted-foreground text-xs">{t.phone}</td>
              <td className="p-3 text-foreground text-xs font-medium">৳{t.rent.toLocaleString()}</td>
              <td className="p-3 text-muted-foreground text-xs">{t.since}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const RentRecordsContent = () => (
  <div className="space-y-5">
    <div>
      <h1 className="text-xl font-heading font-bold text-foreground">Rent Records</h1>
      <p className="text-sm text-muted-foreground">All rent payment history</p>
    </div>
    <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#F8FAFC]">
            {["Tenant", "Property", "Amount", "Method", "Status"].map(h => (
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

const RemindersContent = () => (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-heading font-bold text-foreground">Reminders</h1>
        <p className="text-sm text-muted-foreground">Upcoming reminders & alerts</p>
      </div>
      <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors">
        <Plus className="h-3.5 w-3.5" /> Add Reminder
      </button>
    </div>
    <div className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#F8FAFC]">
            {["Tenant", "Type", "Date", "Status"].map(h => (
              <th key={h} className="text-left p-3 font-semibold text-foreground text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reminders.map((r, i) => (
            <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
              <td className="p-3 text-foreground text-xs font-medium">{r.tenant}</td>
              <td className="p-3 text-muted-foreground text-xs">{r.type}</td>
              <td className="p-3 text-muted-foreground text-xs">{r.date}</td>
              <td className="p-3">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                  r.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                }`}>{r.status}</span>
              </td>
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

export default PropertyManagement;
