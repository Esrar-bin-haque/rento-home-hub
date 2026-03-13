import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2, BarChart3, Users, DollarSign, Landmark, FileText, Bell, Settings,
  LogOut, Plus, AlertTriangle, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const sidebarItems = [
  { icon: BarChart3, label: "Overview" },
  { icon: Users, label: "Tenants" },
  { icon: DollarSign, label: "Rent Payments" },
  { icon: Landmark, label: "Service Charges" },
  { icon: Building2, label: "Building Fund" },
  { icon: FileText, label: "Expenses" },
  { icon: Bell, label: "Reminders" },
  { icon: Settings, label: "Settings" },
];

const tenants = [
  { flat: "A1", tenant: "Rahim Uddin", rent: 20000, lastPayment: "Mar 1, 2026", status: "Paid" },
  { flat: "A2", tenant: "Sumaiya Khan", rent: 18000, lastPayment: "Feb 28, 2026", status: "Paid" },
  { flat: "B1", tenant: "Kamal Hossain", rent: 22000, lastPayment: "—", status: "Overdue" },
  { flat: "B2", tenant: "Nadia Islam", rent: 25000, lastPayment: "Mar 2, 2026", status: "Paid" },
  { flat: "C1", tenant: "Arif Rahman", rent: 20000, lastPayment: "—", status: "Overdue" },
  { flat: "C2", tenant: "Fatema Begum", rent: 15000, lastPayment: "Mar 3, 2026", status: "Paid" },
  { flat: "D1", tenant: "Shakil Ahmed", rent: 30000, lastPayment: "Mar 1, 2026", status: "Paid" },
  { flat: "D2", tenant: "Riya Chowdhury", rent: 28000, lastPayment: "—", status: "Overdue" },
];

const pieData = [
  { name: "Paid", value: 5, color: "hsl(175,85%,32%)" },
  { name: "Overdue", value: 3, color: "hsl(0,84%,60%)" },
];

const barData = [
  { month: "Oct", amount: 380000 },
  { month: "Nov", amount: 400000 },
  { month: "Dec", amount: 420000 },
  { month: "Jan", amount: 450000 },
  { month: "Feb", amount: 460000 },
  { month: "Mar", amount: 480000 },
];

const expenses = [
  { date: "Mar 5", desc: "Generator maintenance", amount: 8500, cat: "Maintenance", by: "Rahman" },
  { date: "Mar 3", desc: "Lift repair", amount: 15000, cat: "Repair", by: "Esrar" },
  { date: "Feb 28", desc: "Common area cleaning", amount: 3000, cat: "Cleaning", by: "Rahman" },
  { date: "Feb 25", desc: "Security guard salary", amount: 12000, cat: "Salary", by: "Rahman" },
  { date: "Feb 20", desc: "Water pump repair", amount: 5500, cat: "Repair", by: "Esrar" },
];

const catColors: Record<string, string> = {
  Maintenance: "bg-blue-100 text-blue-700",
  Repair: "bg-orange-100 text-orange-700",
  Cleaning: "bg-green-100 text-green-700",
  Salary: "bg-purple-100 text-purple-700",
};

const contributions = [
  { flat: "A1", amount: 2000, date: "Mar 1" },
  { flat: "A2", amount: 2000, date: "Mar 1" },
  { flat: "B2", amount: 2000, date: "Mar 2" },
  { flat: "C2", amount: 2000, date: "Mar 3" },
];

const BuildingManagement = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-[260px]" : "w-0 overflow-hidden"} transition-all duration-300 bg-foreground flex flex-col flex-shrink-0`}>
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
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">MR</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-secondary truncate">Sunset Tower</p>
              <p className="text-[10px] text-secondary/50">Dhanmondi</p>
            </div>
            <LogOut className="h-4 w-4 text-secondary/40 cursor-pointer hover:text-secondary transition-colors" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 flex-shrink-0 card-shadow">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1">
              <BarChart3 className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-heading font-semibold text-foreground">Good Morning, Rahman 👋</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <Button className="rounded-button bg-primary text-primary-foreground text-sm h-9">
              <Plus className="h-4 w-4 mr-1" />Add Tenant
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {activeTab === "Overview" ? (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Units", value: "24", icon: Building2, color: "bg-indigo/10 text-indigo" },
                  { label: "Rent Collected", value: "BDT 4,80,000", icon: DollarSign, color: "bg-primary/10 text-primary", sub: "+12% vs last month", subColor: "text-primary" },
                  { label: "Overdue Units", value: "3", icon: AlertTriangle, color: "bg-destructive/10 text-destructive", sub: "Action needed", subColor: "text-destructive" },
                  { label: "Building Fund", value: "BDT 1,85,000", icon: Landmark, color: "bg-primary/10 text-primary", sub: "75% of target", subColor: "text-muted-foreground" },
                ].map(s => (
                  <div key={s.label} className="bg-card rounded-card card-shadow p-5 border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                      <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center`}>
                        <s.icon className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="text-xl font-heading font-bold text-foreground">{s.value}</p>
                    {s.sub && <p className={`text-[10px] mt-1 ${s.subColor}`}>{s.sub}</p>}
                  </div>
                ))}
              </div>

              {/* Row 2 */}
              <div className="grid lg:grid-cols-5 gap-6">
                {/* Rent Collection Table */}
                <div className="lg:col-span-3 bg-card rounded-card card-shadow border border-border overflow-hidden">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-heading font-semibold text-foreground text-sm">Rent Collection Status</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary">
                        <tr>
                          {["Flat", "Tenant", "Rent", "Last Payment", "Status", "Action"].map(h => (
                            <th key={h} className="text-left p-3 font-medium text-muted-foreground text-xs">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tenants.map(t => (
                          <tr key={t.flat} className="border-t border-border hover:bg-secondary/50 transition-colors">
                            <td className="p-3 font-medium text-foreground text-xs">{t.flat}</td>
                            <td className="p-3 text-foreground text-xs">{t.tenant}</td>
                            <td className="p-3 text-foreground text-xs">BDT {t.rent.toLocaleString()}</td>
                            <td className="p-3 text-muted-foreground text-xs">{t.lastPayment}</td>
                            <td className="p-3">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                t.status === "Paid" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                              }`}>{t.status === "Paid" ? "✅ Paid" : "🔴 Overdue"}</span>
                            </td>
                            <td className="p-3">
                              {t.status === "Paid" ? (
                                <button className="text-xs text-primary hover:underline">View</button>
                              ) : (
                                <Button variant="outline" className="h-6 text-[10px] px-2 border-accent text-accent hover:bg-accent/10 rounded-button">Remind</Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Pie Chart */}
                  <div className="bg-card rounded-card card-shadow border border-border p-4">
                    <h3 className="font-heading font-semibold text-foreground text-sm mb-4">Rent Collection Overview</h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" paddingAngle={3}>
                          {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Legend formatter={(value) => <span className="text-xs text-foreground">{value}</span>} />
                      </PieChart>
                    </ResponsiveContainer>
                    <p className="text-center text-xs text-muted-foreground">8 Total Units</p>
                  </div>

                  {/* Building Fund */}
                  <div className="bg-card rounded-card card-shadow border border-border p-4">
                    <h3 className="font-heading font-semibold text-foreground text-sm mb-3">Building Fund</h3>
                    <p className="text-2xl font-heading font-bold text-foreground">BDT 1,85,000</p>
                    <p className="text-xs text-muted-foreground mb-3">Monthly target: BDT 2,40,000</p>
                    <div className="w-full h-2 bg-secondary rounded-full mb-4">
                      <div className="h-full bg-primary rounded-full" style={{ width: "77%" }} />
                    </div>
                    <div className="space-y-2">
                      {contributions.map(c => (
                        <div key={c.flat + c.date} className="flex items-center justify-between text-xs">
                          <span className="text-foreground">Flat {c.flat}</span>
                          <span className="text-muted-foreground">BDT {c.amount.toLocaleString()} · {c.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-card rounded-card card-shadow border border-border p-5">
                <h3 className="font-heading font-semibold text-foreground text-sm mb-4">Monthly Income Overview</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(215,16%,47%)" }} />
                    <YAxis tick={{ fontSize: 12, fill: "hsl(215,16%,47%)" }} tickFormatter={v => `${v / 1000}k`} />
                    <Tooltip formatter={(v: number) => [`BDT ${v.toLocaleString()}`, "Collected"]} />
                    <Bar dataKey="amount" fill="hsl(175,85%,32%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Expenses Table */}
              <div className="bg-card rounded-card card-shadow border border-border overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-heading font-semibold text-foreground text-sm">Recent Expenses</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary">
                      <tr>
                        {["Date", "Description", "Amount", "Category", "Added By"].map(h => (
                          <th key={h} className="text-left p-3 font-medium text-muted-foreground text-xs">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map((e, i) => (
                        <tr key={i} className="border-t border-border">
                          <td className="p-3 text-muted-foreground text-xs">{e.date}</td>
                          <td className="p-3 text-foreground text-xs">{e.desc}</td>
                          <td className="p-3 text-foreground text-xs font-medium">BDT {e.amount.toLocaleString()}</td>
                          <td className="p-3">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${catColors[e.cat]}`}>{e.cat}</span>
                          </td>
                          <td className="p-3 text-muted-foreground text-xs">{e.by}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* Empty state for other tabs */
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

export default BuildingManagement;
