import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2, BarChart3, Home, Users, DollarSign, Bell, FileText, Settings,
  LogOut, Lock, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const sidebarItems = [
  { icon: BarChart3, label: "Overview" },
  { icon: Home, label: "My Properties" },
  { icon: Users, label: "Tenants" },
  { icon: DollarSign, label: "Rent Records" },
  { icon: Bell, label: "Reminders" },
  { icon: FileText, label: "Statements" },
  { icon: Settings, label: "Settings" },
];

const tenants = [
  { property: "Flat 3A, Gulshan", tenant: "Aminul Islam", rent: 35000, lastPayment: "Mar 1, 2026", status: "Paid" },
  { property: "Flat 5B, Banani", tenant: "Sara Haque", rent: 28000, lastPayment: "Mar 2, 2026", status: "Paid" },
  { property: "House, Dhanmondi", tenant: "Rezaul Karim", rent: 42000, lastPayment: "—", status: "Overdue" },
  { property: "Flat 2C, Uttara", tenant: "Mithila Akter", rent: 15000, lastPayment: "Mar 1, 2026", status: "Paid" },
];

const pieData = [
  { name: "Collected", value: 78000, color: "hsl(175,85%,32%)" },
  { name: "Due", value: 42000, color: "hsl(0,84%,60%)" },
];

const barData = [
  { month: "Oct", amount: 95000 },
  { month: "Nov", amount: 105000 },
  { month: "Dec", amount: 110000 },
  { month: "Jan", amount: 120000 },
  { month: "Feb", amount: 115000 },
  { month: "Mar", amount: 120000 },
];

const PropertyManagement = () => {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-[260px] bg-foreground flex-col flex-shrink-0">
        <div className="p-5">
          <Link to="/" className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="text-lg font-heading font-bold text-primary-foreground">Rento</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {sidebarItems.map(item => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeTab === item.label
                  ? "bg-primary text-primary-foreground"
                  : "text-secondary/70 hover:text-secondary hover:bg-secondary/10"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-secondary/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">LM</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-secondary truncate">Landlord Mode</p>
            </div>
            <LogOut className="h-4 w-4 text-secondary/40 cursor-pointer hover:text-secondary transition-colors" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Banner */}
        <div className="bg-accent/10 border-b border-accent/20 px-6 py-3 flex items-center justify-between">
          <p className="text-sm text-foreground flex items-center gap-2"><Lock className="h-4 w-4 text-accent" />Sign in to access your full dashboard</p>
          <Button className="rounded-button bg-primary text-primary-foreground text-xs h-8">Login</Button>
        </div>

        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 flex-shrink-0">
          <h1 className="text-lg font-heading font-semibold text-foreground">Property Management</h1>
          <Bell className="h-5 w-5 text-muted-foreground" />
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {activeTab === "Overview" ? (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "My Properties", value: "4", icon: Home, color: "bg-indigo/10 text-indigo" },
                  { label: "Monthly Income", value: "BDT 1,20,000", icon: DollarSign, color: "bg-primary/10 text-primary" },
                  { label: "Active Tenants", value: "4", icon: Users, color: "bg-primary/10 text-primary" },
                  { label: "Pending Dues", value: "1", icon: AlertTriangle, color: "bg-destructive/10 text-destructive" },
                ].map(s => (
                  <div key={s.label} className="bg-card rounded-card card-shadow p-5 border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                      <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center`}>
                        <s.icon className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="text-xl font-heading font-bold text-foreground">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-5 gap-6">
                {/* Tenant Table */}
                <div className="lg:col-span-3 bg-card rounded-card card-shadow border border-border overflow-hidden">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-heading font-semibold text-foreground text-sm">Tenant Overview</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary">
                        <tr>
                          {["Property", "Tenant", "Rent", "Last Payment", "Status"].map(h => (
                            <th key={h} className="text-left p-3 font-medium text-muted-foreground text-xs">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tenants.map(t => (
                          <tr key={t.property} className="border-t border-border">
                            <td className="p-3 font-medium text-foreground text-xs">{t.property}</td>
                            <td className="p-3 text-foreground text-xs">{t.tenant}</td>
                            <td className="p-3 text-foreground text-xs">BDT {t.rent.toLocaleString()}</td>
                            <td className="p-3 text-muted-foreground text-xs">{t.lastPayment}</td>
                            <td className="p-3">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                t.status === "Paid" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                              }`}>{t.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pie Chart */}
                <div className="lg:col-span-2 bg-card rounded-card card-shadow border border-border p-4">
                  <h3 className="font-heading font-semibold text-foreground text-sm mb-4">Income vs Due</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" paddingAngle={3}>
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Legend formatter={(value) => <span className="text-xs text-foreground">{value}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-card rounded-card card-shadow border border-border p-5">
                <h3 className="font-heading font-semibold text-foreground text-sm mb-4">Monthly Income (Last 6 Months)</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(215,16%,47%)" }} />
                    <YAxis tick={{ fontSize: 12, fill: "hsl(215,16%,47%)" }} tickFormatter={v => `${v / 1000}k`} />
                    <Tooltip formatter={(v: number) => [`BDT ${v.toLocaleString()}`, "Income"]} />
                    <Bar dataKey="amount" fill="hsl(175,85%,32%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                {(() => { const Item = sidebarItems.find(s => s.label === activeTab)?.icon || BarChart3; return <Item className="h-7 w-7 text-primary" />; })()}
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{activeTab}</h3>
              <p className="text-sm text-muted-foreground mb-6">This section is coming soon. Stay tuned!</p>
              <Button onClick={() => setActiveTab("Overview")} className="rounded-button bg-primary text-primary-foreground text-sm">Go to Overview</Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PropertyManagement;
