import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2, BarChart3, Home, Users, CreditCard, FileText, Settings,
  LogOut, Menu, Plus, X, Eye, Edit, Receipt, CheckCircle2,
  ArrowDownCircle, TrendingDown, ArrowUpCircle, Bell, UserCheck,
  BarChart2, Send, Wallet, Landmark, Pencil
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

// ─── Mock Data ──────────────────────────────────────────

const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const monthlyData: Record<string, { service_charge: number; collected: number; receivable: number; expense: number; payable: number; cash_in_hand: number; notCollected: number; income: number }> = {
  Jan: { service_charge: 48000, collected: 41000, receivable: 7000, expense: 24000, payable: 5000, cash_in_hand: 17000, notCollected: 7000, income: 41000 },
  Feb: { service_charge: 48000, collected: 43000, receivable: 5000, expense: 26000, payable: 3000, cash_in_hand: 17000, notCollected: 5000, income: 43000 },
  Mar: { service_charge: 48000, collected: 34500, receivable: 13500, expense: 27800, payable: 8200, cash_in_hand: 6700, notCollected: 13500, income: 34500 },
  Apr: { service_charge: 0, collected: 0, receivable: 0, expense: 0, payable: 0, cash_in_hand: 0, notCollected: 0, income: 0 },
  May: { service_charge: 0, collected: 0, receivable: 0, expense: 0, payable: 0, cash_in_hand: 0, notCollected: 0, income: 0 },
  Jun: { service_charge: 0, collected: 0, receivable: 0, expense: 0, payable: 0, cash_in_hand: 0, notCollected: 0, income: 0 },
  Jul: { service_charge: 0, collected: 0, receivable: 0, expense: 0, payable: 0, cash_in_hand: 0, notCollected: 0, income: 0 },
  Aug: { service_charge: 0, collected: 0, receivable: 0, expense: 0, payable: 0, cash_in_hand: 0, notCollected: 0, income: 0 },
  Sep: { service_charge: 0, collected: 0, receivable: 0, expense: 0, payable: 0, cash_in_hand: 0, notCollected: 0, income: 0 },
  Oct: { service_charge: 0, collected: 0, receivable: 0, expense: 0, payable: 0, cash_in_hand: 0, notCollected: 0, income: 0 },
  Nov: { service_charge: 0, collected: 0, receivable: 0, expense: 0, payable: 0, cash_in_hand: 0, notCollected: 0, income: 0 },
  Dec: { service_charge: 0, collected: 0, receivable: 0, expense: 0, payable: 0, cash_in_hand: 0, notCollected: 0, income: 0 },
};

const expensePieData = [
  { name: "Cleaning", value: 5000, color: "#1098AD" },
  { name: "Security", value: 8000, color: "#3B5BDB" },
  { name: "Electricity", value: 6500, color: "#E67700" },
  { name: "Lift Maintenance", value: 3800, color: "#7048E8" },
  { name: "Repairs", value: 2500, color: "#E03131" },
  { name: "Generator", value: 2000, color: "#495057" },
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

const flats = [
  { flat: "A1", floor: "1st", size: 850, serviceCharge: 4000, status: "Occupied", tenant: "Rahim Uddin" },
  { flat: "A2", floor: "1st", size: 900, serviceCharge: 3500, status: "Occupied", tenant: "Sumaiya Khan" },
  { flat: "B1", floor: "2nd", size: 850, serviceCharge: 4500, status: "Occupied", tenant: "Kamal Hossain" },
  { flat: "B2", floor: "2nd", size: 950, serviceCharge: 5000, status: "Occupied", tenant: "Nadia Islam" },
  { flat: "C1", floor: "3rd", size: 850, serviceCharge: 4000, status: "Vacant", tenant: "—" },
  { flat: "C2", floor: "3rd", size: 750, serviceCharge: 3000, status: "Occupied", tenant: "Fatema Begum" },
  { flat: "D1", floor: "4th", size: 1100, serviceCharge: 6000, status: "Occupied", tenant: "Shakil Ahmed" },
  { flat: "D2", floor: "4th", size: 1200, serviceCharge: 5500, status: "Occupied", tenant: "Riya Chowdhury" },
];

const flatOwners = [
  { name: "Mr. Karim Ahmed", phone: "01711-111001", nid: "1234567890123", flat: "A1", since: "Jan 2018", tenantLiving: "Rahim Uddin", status: "Active" },
  { name: "Mrs. Salma Begum", phone: "01722-111002", nid: "2345678901234", flat: "A2", since: "Mar 2019", tenantLiving: "Sumaiya Khan", status: "Active" },
  { name: "Mr. Rafiq Islam", phone: "01733-111003", nid: "3456789012345", flat: "B1", since: "Jun 2017", tenantLiving: "Kamal Hossain", status: "Active" },
  { name: "Mr. Jahangir Ali", phone: "01744-111004", nid: "4567890123456", flat: "B2", since: "Sep 2020", tenantLiving: "Nadia Islam", status: "Active" },
  { name: "Mrs. Parveen Akter", phone: "01755-111005", nid: "5678901234567", flat: "C1", since: "Dec 2016", tenantLiving: "Vacant", status: "Active" },
  { name: "Mr. Hasanur Rahman", phone: "01766-111006", nid: "6789012345678", flat: "C2", since: "Feb 2019", tenantLiving: "Fatema Begum", status: "Active" },
  { name: "Mr. Tanvir Hossain", phone: "01777-111007", nid: "7890123456789", flat: "D1", since: "Aug 2021", tenantLiving: "Shakil Ahmed", status: "Active" },
  { name: "Mrs. Nasima Khatun", phone: "01788-111008", nid: "8901234567890", flat: "D2", since: "Nov 2018", tenantLiving: "Riya Chowdhury", status: "Active" },
];

const tenantsList = [
  { name: "Rahim Uddin", flat: "A1", phone: "01711-000001", nid: "9012345678901", moveIn: "October 2021", rent: 4000, status: "Active", totalPaid: 24000, advance: 8000, paymentHistory: [
    { month: "Mar 2026", amount: 4000, date: "Mar 1", status: "Paid" },
    { month: "Feb 2026", amount: 4000, date: "Feb 1", status: "Paid" },
    { month: "Jan 2026", amount: 4000, date: "Jan 3", status: "Paid" },
    { month: "Dec 2025", amount: 4000, date: "Dec 1", status: "Paid" },
    { month: "Nov 2025", amount: 4000, date: "Nov 2", status: "Paid" },
    { month: "Oct 2025", amount: 4000, date: "Oct 1", status: "Paid" },
  ]},
  { name: "Sumaiya Khan", flat: "A2", phone: "01722-000002", nid: "0123456789012", moveIn: "January 2022", rent: 3500, status: "Active", totalPaid: 21000, advance: 7000, paymentHistory: [
    { month: "Mar 2026", amount: 3500, date: "Mar 2", status: "Paid" },
    { month: "Feb 2026", amount: 3500, date: "Feb 1", status: "Paid" },
    { month: "Jan 2026", amount: 3500, date: "Jan 2", status: "Paid" },
    { month: "Dec 2025", amount: 3500, date: "Dec 3", status: "Paid" },
    { month: "Nov 2025", amount: 3500, date: "Nov 1", status: "Paid" },
    { month: "Oct 2025", amount: 3500, date: "Oct 2", status: "Paid" },
  ]},
  { name: "Kamal Hossain", flat: "B1", phone: "01733-000003", nid: "1122334455667", moveIn: "March 2022", rent: 4500, status: "Active", totalPaid: 22500, advance: 9000, paymentHistory: [
    { month: "Mar 2026", amount: 4500, date: "—", status: "Due" },
    { month: "Feb 2026", amount: 4500, date: "Feb 3", status: "Paid" },
    { month: "Jan 2026", amount: 4500, date: "Jan 1", status: "Paid" },
    { month: "Dec 2025", amount: 4500, date: "Dec 2", status: "Paid" },
    { month: "Nov 2025", amount: 4500, date: "Nov 3", status: "Paid" },
    { month: "Oct 2025", amount: 4500, date: "Oct 1", status: "Paid" },
  ]},
  { name: "Nadia Islam", flat: "B2", phone: "01744-000004", nid: "2233445566778", moveIn: "June 2022", rent: 5000, status: "Active", totalPaid: 30000, advance: 10000, paymentHistory: [
    { month: "Mar 2026", amount: 5000, date: "Mar 3", status: "Paid" },
    { month: "Feb 2026", amount: 5000, date: "Feb 2", status: "Paid" },
    { month: "Jan 2026", amount: 5000, date: "Jan 1", status: "Paid" },
    { month: "Dec 2025", amount: 5000, date: "Dec 1", status: "Paid" },
    { month: "Nov 2025", amount: 5000, date: "Nov 2", status: "Paid" },
    { month: "Oct 2025", amount: 5000, date: "Oct 3", status: "Paid" },
  ]},
  { name: "Arif Rahman", flat: "C1", phone: "01755-000005", nid: "3344556677889", moveIn: "August 2022", rent: 4000, status: "Active", totalPaid: 20000, advance: 8000, paymentHistory: [
    { month: "Mar 2026", amount: 4000, date: "—", status: "Due" },
    { month: "Feb 2026", amount: 4000, date: "Feb 1", status: "Paid" },
    { month: "Jan 2026", amount: 4000, date: "Jan 2", status: "Paid" },
    { month: "Dec 2025", amount: 4000, date: "Dec 1", status: "Paid" },
    { month: "Nov 2025", amount: 4000, date: "Nov 3", status: "Paid" },
    { month: "Oct 2025", amount: 4000, date: "Oct 1", status: "Paid" },
  ]},
  { name: "Fatema Begum", flat: "C2", phone: "01766-000006", nid: "4455667788990", moveIn: "November 2022", rent: 3000, status: "Active", totalPaid: 18000, advance: 6000, paymentHistory: [
    { month: "Mar 2026", amount: 3000, date: "Mar 4", status: "Paid" },
    { month: "Feb 2026", amount: 3000, date: "Feb 2", status: "Paid" },
    { month: "Jan 2026", amount: 3000, date: "Jan 1", status: "Paid" },
    { month: "Dec 2025", amount: 3000, date: "Dec 3", status: "Paid" },
    { month: "Nov 2025", amount: 3000, date: "Nov 1", status: "Paid" },
    { month: "Oct 2025", amount: 3000, date: "Oct 2", status: "Paid" },
  ]},
  { name: "Shakil Ahmed", flat: "D1", phone: "01777-000007", nid: "5566778899001", moveIn: "February 2023", rent: 6000, status: "Active", totalPaid: 36000, advance: 12000, paymentHistory: [
    { month: "Mar 2026", amount: 6000, date: "Mar 1", status: "Paid" },
    { month: "Feb 2026", amount: 6000, date: "Feb 1", status: "Paid" },
    { month: "Jan 2026", amount: 6000, date: "Jan 3", status: "Paid" },
    { month: "Dec 2025", amount: 6000, date: "Dec 1", status: "Paid" },
    { month: "Nov 2025", amount: 6000, date: "Nov 2", status: "Paid" },
    { month: "Oct 2025", amount: 6000, date: "Oct 1", status: "Paid" },
  ]},
  { name: "Riya Chowdhury", flat: "D2", phone: "01788-000008", nid: "6677889900112", moveIn: "May 2023", rent: 5500, status: "Active", totalPaid: 33000, advance: 11000, paymentHistory: [
    { month: "Mar 2026", amount: 5500, date: "—", status: "Due" },
    { month: "Feb 2026", amount: 5500, date: "Feb 2", status: "Paid" },
    { month: "Jan 2026", amount: 5500, date: "Jan 1", status: "Paid" },
    { month: "Dec 2025", amount: 5500, date: "Dec 2", status: "Paid" },
    { month: "Nov 2025", amount: 5500, date: "Nov 3", status: "Paid" },
    { month: "Oct 2025", amount: 5500, date: "Oct 1", status: "Paid" },
  ]},
];

const paymentStatusData = [
  { tenant: "Rahim Uddin", flat: "A1", amount: 4000, month: "March 2026", date: "Mar 1", method: "bKash", status: "paid" },
  { tenant: "Sumaiya Khan", flat: "A2", amount: 3500, month: "March 2026", date: "Mar 2", method: "Nagad", status: "paid" },
  { tenant: "Kamal Hossain", flat: "B1", amount: 4500, month: "March 2026", date: "—", method: "—", status: "due" },
  { tenant: "Nadia Islam", flat: "B2", amount: 5000, month: "March 2026", date: "Mar 3", method: "Bank Transfer", status: "paid" },
  { tenant: "Arif Rahman", flat: "C1", amount: 4000, month: "March 2026", date: "—", method: "—", status: "due" },
  { tenant: "Fatema Begum", flat: "C2", amount: 3000, month: "March 2026", date: "Mar 4", method: "Cash", status: "paid" },
  { tenant: "Shakil Ahmed", flat: "D1", amount: 6000, month: "March 2026", date: "Mar 1", method: "bKash", status: "paid" },
  { tenant: "Riya Chowdhury", flat: "D2", amount: 5500, month: "March 2026", date: "—", method: "—", status: "due" },
  { tenant: "Imran Hossain", flat: "E1", amount: 4000, month: "March 2026", date: "Mar 5", method: "Cash", status: "paid" },
  { tenant: "Nasrin Akter", flat: "E2", amount: 3500, month: "March 2026", date: "Mar 5", method: "bKash", status: "paid" },
];

const expensesList = [
  { date: "Mar 5", desc: "Generator maintenance", amount: 8500, category: "Maintenance", addedBy: "Rahman" },
  { date: "Mar 3", desc: "Lift repair", amount: 15000, category: "Repair", addedBy: "Rahman" },
  { date: "Feb 28", desc: "Common area cleaning", amount: 3000, category: "Cleaning", addedBy: "Esrar" },
  { date: "Feb 25", desc: "Security guard salary", amount: 12000, category: "Salary", addedBy: "Rahman" },
  { date: "Feb 20", desc: "Water pump repair", amount: 5500, category: "Repair", addedBy: "Esrar" },
  { date: "Feb 15", desc: "Electricity bill", amount: 5500, category: "Utilities", addedBy: "Rahman" },
  { date: "Mar 8", desc: "Painting staircase", amount: 6000, category: "Maintenance", addedBy: "Esrar" },
  { date: "Mar 10", desc: "Plumber visit", amount: 2500, category: "Repair", addedBy: "Rahman" },
  { date: "Mar 12", desc: "Electricity bill", amount: 9800, category: "Utilities", addedBy: "Rahman" },
  { date: "Mar 14", desc: "Guard uniform", amount: 3200, category: "Salary", addedBy: "Esrar" },
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
  { tenant: "Kamal Hossain", flat: "B1", type: "Service Charge", amount: 4500, dueDate: "Mar 1, 2026", daysOverdue: 18, status: "overdue" },
  { tenant: "Arif Rahman", flat: "C1", type: "Service Charge", amount: 4000, dueDate: "Mar 1, 2026", daysOverdue: 18, status: "overdue" },
  { tenant: "Riya Chowdhury", flat: "D2", type: "Service Charge", amount: 5500, dueDate: "Mar 1, 2026", daysOverdue: 18, status: "overdue" },
  { tenant: "Imran Hossain", flat: "E1", type: "Advance Adjustment", amount: 2000, dueDate: "Mar 15, 2026", daysOverdue: 4, status: "overdue" },
  { tenant: "Nasrin Akter", flat: "E2", type: "Maintenance Fee", amount: 1500, dueDate: "Apr 1, 2026", daysOverdue: 0, status: "upcoming" },
];

const catColors: Record<string, string> = {
  Maintenance: "bg-blue-100 text-blue-700",
  Repair: "bg-orange-100 text-orange-700",
  Cleaning: "bg-green-100 text-green-700",
  Salary: "bg-purple-100 text-purple-700",
  Utilities: "bg-amber-100 text-amber-700",
};

const overdueResidents = [
  { name: "Kamal Hossain", flat: "B1", monthsOverdue: 2, totalDue: 9000, lastPaid: "Jan 2026" },
  { name: "Arif Rahman", flat: "C1", monthsOverdue: 1, totalDue: 4000, lastPaid: "Feb 2026" },
  { name: "Riya Chowdhury", flat: "D2", monthsOverdue: 3, totalDue: 16500, lastPaid: "Dec 2025" },
];

const accountPayableCardData = [
  { whom: "City Bank Ltd", type: "Bank Loan", amount: 5000, date: "Mar 3", notes: "Lift repair advance" },
  { whom: "Mr. Karim Ahmed", type: "Person", amount: 2000, date: "Feb 20", notes: "Personal loan for pump" },
  { whom: "Flat B2 Owner", type: "Advance Money", amount: 1200, date: "Mar 10", notes: "Advance from flat owner" },
];

const cashLocations = [
  { location: "BRAC Bank (Savings)", amount: 4200, type: "Bank", lastUpdated: "Mar 15" },
  { location: "Physical Cash (Safe)", amount: 1500, type: "In Hand", lastUpdated: "Mar 20" },
  { location: "Mobile Banking (bKash)", amount: 1000, type: "Mobile", lastUpdated: "Mar 18" },
];

const cashMovementLog = [
  { date: "Mar 20", desc: "Rent collected A1", amount: 4000, dir: "+", running: 6700 },
  { date: "Mar 18", desc: "Generator expense", amount: 2500, dir: "-", running: 2700 },
  { date: "Mar 15", desc: "Collected B2", amount: 5000, dir: "+", running: 5200 },
  { date: "Mar 10", desc: "Plumber paid", amount: 1200, dir: "-", running: 200 },
  { date: "Mar 5", desc: "Collected A2", amount: 3500, dir: "+", running: 1400 },
];

const associationMembers = [
  { name: "Muhammad Mushfiqur Rahman", phone: "01711-000000", nid: "1234512345123", role: "Admin", joined: "Jan 15, 2018", status: "Active" },
  { name: "Esrar Bin Haque", phone: "01722-000000", nid: "2345623456234", role: "Manager", joined: "Feb 1, 2018", status: "Active" },
  { name: "Mr. Karim Ahmed", phone: "01711-111001", nid: "1234567890123", role: "Manager", joined: "Mar 5, 2018", status: "Active" },
  { name: "Mrs. Salma Begum", phone: "01722-111002", nid: "2345678901234", role: "Cashier", joined: "Mar 5, 2018", status: "Active" },
  { name: "Mr. Rafiq Islam", phone: "01733-111003", nid: "3456789012345", role: "Cashier", joined: "Apr 1, 2018", status: "Active" },
  { name: "Mr. Jahangir Ali", phone: "01744-111004", nid: "4567890123456", role: "Member", joined: "Apr 1, 2018", status: "Active" },
  { name: "Mrs. Parveen Akter", phone: "01755-111005", nid: "5678901234567", role: "Member", joined: "May 1, 2018", status: "Active" },
  { name: "Mr. Hasanur Rahman", phone: "01766-111006", nid: "6789012345678", role: "Member", joined: "Jun 1, 2018", status: "Active" },
];

const associationRoles = [
  { name: "Admin", permissions: "Full Access", members: 1 },
  { name: "Manager", permissions: "View all, Edit payments, Add tenants", members: 2 },
  { name: "Cashier", permissions: "View payments, Add expenses, View reports", members: 2 },
  { name: "Member", permissions: "View only", members: 3 },
];

type SidebarKey = "dashboard" | "buildings" | "flatOwner" | "tenants" | "paymentStatus" | "expenses" | "accountPayable" | "accountReceivable" | "reports" | "association" | "settings";

const sidebarItems: { icon: typeof BarChart3; key: SidebarKey; label: string }[] = [
  { icon: BarChart3, key: "dashboard", label: "Dashboard" },
  { icon: Building2, key: "buildings", label: "Buildings" },
  { icon: UserCheck, key: "flatOwner", label: "Flat Owner" },
  { icon: Users, key: "tenants", label: "Tenants" },
  { icon: CreditCard, key: "paymentStatus", label: "Payment Status" },
  { icon: FileText, key: "expenses", label: "Expenses" },
  { icon: ArrowUpCircle, key: "accountPayable", label: "Account Payable" },
  { icon: ArrowDownCircle, key: "accountReceivable", label: "Account Receivable" },
  { icon: BarChart2, key: "reports", label: "Reports" },
  { icon: Landmark, key: "association", label: "Association" },
  { icon: Settings, key: "settings", label: "Settings" },
];

// ─── Slide Panel Component ───────────────────────────────
const SlidePanel = ({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end md:justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      {/* Desktop: slide from right. Mobile: slide from bottom, full width */}
      <div
        className="relative w-full bg-white shadow-xl overflow-y-auto md:max-w-[420px] md:h-full md:rounded-none max-h-[85vh] rounded-t-2xl md:max-h-full self-end md:self-stretch"
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile drag indicator */}
        <div className="md:hidden flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#DEE2E6]" />
        </div>
        <div className="p-5 border-b border-[#F1F3F5] flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="font-heading font-bold text-[#1A1D23] text-sm">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#F1F3F5] rounded-lg"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────
const BuildingManagement = () => {
  const [activeTab, setActiveTab] = useState<SidebarKey>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState<typeof tenantsList[0] | null>(null);
  const [selectedOwner, setSelectedOwner] = useState<typeof flatOwners[0] | null>(null);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardContent />;
      case "buildings": return <BuildingsContent />;
      case "flatOwner": return <FlatOwnerContent onSelectOwner={setSelectedOwner} />;
      case "tenants": return <TenantsContent onSelectTenant={setSelectedTenant} />;
      case "paymentStatus": return <PaymentStatusContent />;
      case "expenses": return <ExpensesContent />;
      case "accountPayable": return <AccountPayableContent />;
      case "accountReceivable": return <AccountReceivableContent />;
      case "reports": return <ReportsContent />;
      case "association": return <AssociationContent />;
      case "settings": return <SettingsContent />;
      default: return null;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-60px)]" style={{ background: '#F8F9FA' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-[9998] lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-[260px] lg:w-[220px] translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0"} transition-all duration-300 flex flex-col flex-shrink-0 fixed left-0 z-[9999] lg:z-20`}
        style={{ background: '#1A1D23', top: '60px', height: 'calc(100vh - 60px)' }}
      >
        {/* Mobile close button */}
        <div className="lg:hidden absolute top-3 right-3">
          <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10">
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
        <div className="px-4 pt-3 pb-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-sm font-heading font-bold text-white">Rento</span>
          </Link>
        </div>
        <div className="mx-3 mb-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
        <nav className="flex-1 px-1 py-1 overflow-y-auto">
          {sidebarItems.map(item => (
            <button
              key={item.key}
              onClick={() => { setActiveTab(item.key); if (window.innerWidth < 1024) setSidebarOpen(false); }}
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
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '12px 16px' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: '#3B5BDB' }}>MR</div>
            <span className="text-white text-xs">M. Rahman</span>
          </div>
          <Link to="/" className="flex items-center gap-2 text-xs transition-colors" style={{ color: 'rgba(255,255,255,0.72)' }}>
            <LogOut style={{ width: '15px', height: '15px' }} />
            Log out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? "lg:ml-[220px]" : ""}`}>
        <header className="h-14 md:h-12 bg-white flex items-center justify-between px-3 md:px-5 flex-shrink-0 sticky top-[60px] z-10" style={{ borderBottom: '1px solid #DEE2E6' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <Menu className="h-5 w-5 md:h-4 md:w-4" style={{ color: '#868E96' }} />
            </button>
            <span className="text-xs md:text-sm truncate" style={{ color: '#868E96' }}>Building Management Dashboard</span>
          </div>
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="h-4 w-4" style={{ color: '#868E96' }} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: '#E03131' }} />
          </button>
        </header>
        <main className="flex-1 p-3 md:p-6 overflow-auto">{renderContent()}</main>
      </div>

      {/* Tenant Detail Slide Panel */}
      <SlidePanel open={!!selectedTenant} onClose={() => setSelectedTenant(null)} title={selectedTenant?.name || ""}>
        {selectedTenant && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-[#868E96]">Phone</span><p className="font-medium text-[#1A1D23]">{selectedTenant.phone}</p></div>
              <div><span className="text-[#868E96]">NID</span><p className="font-medium text-[#1A1D23]">{selectedTenant.nid}</p></div>
              <div><span className="text-[#868E96]">Flat</span><p className="font-medium text-[#1A1D23]">{selectedTenant.flat}</p></div>
              <div><span className="text-[#868E96]">Move-in</span><p className="font-medium text-[#1A1D23]">{selectedTenant.moveIn}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#F8F9FA] rounded-xl p-3">
                <span className="text-[11px] text-[#868E96]">Total Paid This Year</span>
                <p className="text-lg font-bold text-[#1A1D23]">৳{selectedTenant.totalPaid.toLocaleString()}</p>
              </div>
              <div className="bg-[#F8F9FA] rounded-xl p-3">
                <span className="text-[11px] text-[#868E96]">Advance Held</span>
                <p className="text-lg font-bold text-[#1A1D23]">৳{selectedTenant.advance.toLocaleString()}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1A1D23] mb-2">Payment History</h3>
              <div className="space-y-2">
                {selectedTenant.paymentHistory.map((ph, i) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-[#F8F9FA] rounded-lg px-3 py-2">
                    <span className="text-[#1A1D23] font-medium">{ph.month}</span>
                    <span className="text-[#868E96]">৳{ph.amount.toLocaleString()}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${ph.status === "Paid" ? "bg-[#EBFBEE] text-[#2F9E44]" : "bg-[#FFF5F5] text-[#E03131]"}`}>{ph.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </SlidePanel>

      {/* Owner Detail Slide Panel */}
      <SlidePanel open={!!selectedOwner} onClose={() => setSelectedOwner(null)} title={selectedOwner?.name || ""}>
        {selectedOwner && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-[#868E96]">Phone</span><p className="font-medium text-[#1A1D23]">{selectedOwner.phone}</p></div>
              <div><span className="text-[#868E96]">NID</span><p className="font-medium text-[#1A1D23]">{selectedOwner.nid}</p></div>
              <div><span className="text-[#868E96]">Flat</span><p className="font-medium text-[#1A1D23]">{selectedOwner.flat}</p></div>
              <div><span className="text-[#868E96]">Since</span><p className="font-medium text-[#1A1D23]">{selectedOwner.since}</p></div>
              <div><span className="text-[#868E96]">Tenant Living</span><p className="font-medium text-[#1A1D23]">{selectedOwner.tenantLiving}</p></div>
              <div><span className="text-[#868E96]">Status</span><p className="font-medium text-[#2F9E44]">{selectedOwner.status}</p></div>
            </div>
          </div>
        )}
      </SlidePanel>
    </div>
  );
};

// ─── TAB 1: Dashboard ────────────────────────────────────

const DashboardContent = () => {
  const [serviceChargeTotal, setServiceChargeTotal] = useState(48000);
  const [editingCharge, setEditingCharge] = useState(false);
  const [editChargeValue, setEditChargeValue] = useState("48000");
  const [payablePanel, setPayablePanel] = useState(false);
  const [cashPanel, setCashPanel] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("Mar");
  const [showMonthlyInvoice, setShowMonthlyInvoice] = useState(false);
  const [showFullInvoice, setShowFullInvoice] = useState(false);

  const md = monthlyData[selectedMonth];
  const isFutureMonth = md.service_charge === 0 && md.collected === 0;

  const collectionRate = md.service_charge > 0 ? Math.round((md.collected / md.service_charge) * 100) : 0;

  // Chart data: show only selected month as single bar
  const chartData = [{ month: selectedMonth, collected: md.collected, notCollected: md.notCollected }];
  const incomeExpenseChartData = [{ month: selectedMonth, income: md.income, expense: md.expense, payable: md.payable }];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-heading font-bold" style={{ color: '#1A1D23' }}>Dashboard</h1>
        <p className="text-sm" style={{ color: '#868E96' }}>Building management overview</p>
      </div>

      {/* Month Toggle Bar */}
      <div className="bg-white rounded-xl p-3 shadow-sm" style={{ border: '1px solid #DEE2E6' }}>
        <span className="text-xs font-medium block mb-2 md:mb-0 md:inline md:mr-3 flex-shrink-0" style={{ color: '#868E96' }}>Filter by Month:</span>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
            {allMonths.map(m => (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                className="px-4 py-[7px] rounded-full text-[13px] font-medium transition-all duration-150 ease-in-out flex-shrink-0 whitespace-nowrap"
                style={{
                  background: selectedMonth === m ? '#3B5BDB' : '#F1F3F5',
                  color: selectedMonth === m ? '#FFFFFF' : '#495057',
                  border: selectedMonth === m ? '1px solid #3B5BDB' : '1px solid #DEE2E6',
                }}
                onMouseEnter={e => { if (selectedMonth !== m) { e.currentTarget.style.background = '#E9ECEF'; e.currentTarget.style.borderColor = '#CED4DA'; } }}
                onMouseLeave={e => { if (selectedMonth !== m) { e.currentTarget.style.background = '#F1F3F5'; e.currentTarget.style.borderColor = '#DEE2E6'; } }}
              >
                {m}
              </button>
            ))}
        </div>
      </div>

      {/* Future month empty state note */}
      {isFutureMonth && (
        <div className="text-center py-2">
          <span className="text-xs" style={{ color: '#868E96' }}>No data available for this month yet.</span>
        </div>
      )}

      {/* 6 Stat Cards — 3+3 grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {/* Card 1: Total Monthly Service Charge (editable) */}
        <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm relative" style={{ border: '1px solid #DEE2E6', borderTop: '3px solid rgba(59,91,219,0.6)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium" style={{ color: '#868E96' }}>Total Monthly Service Charge</span>
            <div className="flex items-center gap-1">
              <button onClick={() => { setEditingCharge(true); setEditChargeValue(String(serviceChargeTotal)); }} className="p-1 hover:bg-[#F1F3F5] rounded"><Pencil className="h-3 w-3" style={{ color: '#868E96' }} /></button>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#EDF2FF' }}><Receipt className="h-4 w-4" style={{ color: '#3B5BDB' }} /></div>
            </div>
          </div>
          <p className="text-lg md:text-2xl font-bold" style={{ color: '#1A1D23' }}>{isFutureMonth ? "—" : `BDT ${(md.service_charge || serviceChargeTotal).toLocaleString()}`}</p>
          <p className="text-[11px] mt-0.5" style={{ color: '#868E96' }}>{selectedMonth} 2026</p>
          {editingCharge && (
            <div className="absolute inset-0 bg-white rounded-xl p-4 z-10 flex flex-col gap-2" style={{ border: '2px solid #3B5BDB' }}>
              <label className="text-xs font-medium" style={{ color: '#1A1D23' }}>Enter total monthly service charge</label>
              <input type="number" value={editChargeValue} onChange={e => setEditChargeValue(e.target.value)} className="h-9 border rounded-lg px-3 text-sm" style={{ borderColor: '#DEE2E6' }} />
              <div className="flex gap-2">
                <button onClick={() => { setServiceChargeTotal(Number(editChargeValue) || serviceChargeTotal); setEditingCharge(false); toast.success("Service charge updated"); }} className="flex-1 h-8 text-xs font-medium rounded-lg text-white" style={{ background: '#3B5BDB' }}>Save</button>
                <button onClick={() => setEditingCharge(false)} className="text-xs" style={{ color: '#868E96' }}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Total Collected */}
        <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm" style={{ border: '1px solid #DEE2E6', borderTop: '3px solid rgba(47,158,68,0.6)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium" style={{ color: '#868E96' }}>Total Collected</span>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#EBFBEE' }}><CheckCircle2 className="h-4 w-4" style={{ color: '#2F9E44' }} /></div>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#1A1D23' }}>{isFutureMonth ? "—" : `BDT ${md.collected.toLocaleString()}`}</p>
          <p className="text-[11px] mt-0.5" style={{ color: '#2F9E44' }}>{isFutureMonth ? "—" : `${collectionRate}% collection rate`}</p>
        </div>

        {/* Card 3: Account Receivable */}
        <div className="bg-white rounded-xl p-4 shadow-sm" style={{ border: '1px solid #DEE2E6', borderTop: '3px solid rgba(224,49,49,0.6)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium" style={{ color: '#868E96' }}>Account Receivable</span>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#FFF5F5' }}><ArrowDownCircle className="h-4 w-4" style={{ color: '#E03131' }} /></div>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#1A1D23' }}>{isFutureMonth ? "—" : `BDT ${md.receivable.toLocaleString()}`}</p>
          <p className="text-[11px] mt-0.5" style={{ color: '#868E96' }}>{isFutureMonth ? "—" : "3 flats pending"}</p>
          {!isFutureMonth && (
            <div className="mt-1 space-y-0.5">
              <p className="text-[10px]" style={{ color: '#E67700' }}>1 month overdue: 2 flats</p>
              <p className="text-[10px]" style={{ color: '#E03131' }}>2+ months overdue: 1 flat</p>
            </div>
          )}
        </div>

        {/* Card 4: Total Expense */}
        <div className="bg-white rounded-xl p-4 shadow-sm" style={{ border: '1px solid #DEE2E6', borderTop: '3px solid rgba(230,119,0,0.6)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium" style={{ color: '#868E96' }}>Total Expense</span>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#FFF9DB' }}><TrendingDown className="h-4 w-4" style={{ color: '#E67700' }} /></div>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#1A1D23' }}>{isFutureMonth ? "—" : `BDT ${md.expense.toLocaleString()}`}</p>
          <p className="text-[11px] mt-0.5" style={{ color: '#868E96' }}>{isFutureMonth ? "—" : "6 expense entries"}</p>
        </div>

        {/* Card 5: Account Payable */}
        <div className="bg-white rounded-xl p-4 shadow-sm relative" style={{ border: '1px solid #DEE2E6', borderTop: '3px solid rgba(112,72,232,0.6)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium" style={{ color: '#868E96' }}>Account Payable</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPayablePanel(true)} className="p-1 hover:bg-[#F1F3F5] rounded"><Eye className="h-3 w-3" style={{ color: '#868E96' }} /></button>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#F8F0FC' }}><ArrowUpCircle className="h-4 w-4" style={{ color: '#7048E8' }} /></div>
            </div>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#1A1D23' }}>{isFutureMonth ? "—" : `BDT ${md.payable.toLocaleString()}`}</p>
          <p className="text-[11px] mt-0.5" style={{ color: '#868E96' }}>{isFutureMonth ? "—" : "Association owes"}</p>
        </div>

        {/* Card 6: Cash In Hand */}
        <div className="bg-white rounded-xl p-4 shadow-sm" style={{ border: '1px solid #DEE2E6', borderTop: '3px solid rgba(12,166,120,0.6)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium" style={{ color: '#868E96' }}>Cash In Hand</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setCashPanel(true)} className="p-1 hover:bg-[#F1F3F5] rounded"><Eye className="h-3 w-3" style={{ color: '#868E96' }} /></button>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#E6FCF5' }}><Wallet className="h-4 w-4" style={{ color: '#0CA678' }} /></div>
            </div>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#1A1D23' }}>{isFutureMonth ? "—" : `BDT ${md.cash_in_hand.toLocaleString()}`}</p>
          <p className="text-[10px] mt-0.5" style={{ color: '#868E96' }}>{isFutureMonth ? "—" : "= Collected − Expense"}</p>
        </div>
      </div>

      {/* Overdue Payments Section */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid #DEE2E6' }}>
        <div className="p-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: '#E03131' }} />
          <h3 className="font-heading font-semibold text-sm" style={{ color: '#1A1D23' }}>Overdue Payments</h3>
          <span className="text-[11px]" style={{ color: '#868E96' }}>— Residents who haven't paid for 1 or more months</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr style={{ background: '#F8F9FA' }}>
              {["Resident Name", "Flat", "Months Overdue", "Total Due", "Last Paid", "Action"].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-[11px] uppercase tracking-wide" style={{ color: '#495057' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {overdueResidents.map((r, i) => (
                <tr key={i} className="border-t hover:bg-[#F8F9FA]" style={{ borderColor: '#F1F3F5' }}>
                  <td className="p-3 text-xs font-medium" style={{ color: '#1A1D23' }}>{r.name}</td>
                  <td className="p-3 text-xs" style={{ color: '#868E96' }}>{r.flat}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                      r.monthsOverdue === 1 ? "bg-amber-100 text-amber-700" :
                      r.monthsOverdue === 2 ? "bg-orange-100 text-orange-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {r.monthsOverdue} month{r.monthsOverdue > 1 ? "s" : ""}
                    </span>
                  </td>
                  <td className="p-3 text-xs font-medium" style={{ color: '#1A1D23' }}>BDT {r.totalDue.toLocaleString()}</td>
                  <td className="p-3 text-xs" style={{ color: '#868E96' }}>{r.lastPaid}</td>
                  <td className="p-3">
                    <button
                      onClick={() => toast.success(`Reminder sent to ${r.name}`)}
                      className="text-xs px-2.5 py-1 rounded-md font-medium transition-colors"
                      style={{ border: '1.5px solid #E67700', color: '#E67700' }}
                    >
                      Send Reminder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart Row 1: 60/40 */}
      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm p-5" style={{ border: '1px solid #DEE2E6' }}>
          <h3 className="font-heading font-semibold text-sm" style={{ color: '#1A1D23' }}>Service Charge Collection Trend</h3>
          <p className="text-[11px] mb-4" style={{ color: '#868E96' }}>Monthly collected vs uncollected</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#ADB5BD" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#ADB5BD" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip formatter={(v: number) => [`BDT ${v.toLocaleString()}`, ""]} />
              <Legend iconType="circle" iconSize={8} formatter={(value) => <span className="text-xs" style={{ color: '#868E96' }}>{value}</span>} />
              <Bar dataKey="collected" name="Collected" fill="#2F9E44" radius={[4, 4, 0, 0]} barSize={18} />
              <Bar dataKey="notCollected" name="Not Collected" fill="#E03131" radius={[4, 4, 0, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-5" style={{ border: '1px solid #DEE2E6' }}>
          <h3 className="font-heading font-semibold text-sm mb-4" style={{ color: '#1A1D23' }}>Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={expensePieData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} dataKey="value" paddingAngle={2}>
                {expensePieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`BDT ${v.toLocaleString()}`, ""]} />
              <text x="50%" y="48%" textAnchor="middle" fill="#495057" fontSize={11} fontWeight={500}>Total</text>
              <text x="50%" y="56%" textAnchor="middle" fill="#1A1D23" fontSize={14} fontWeight={700}>BDT 27,800</text>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2 justify-center">
            {expensePieData.map(d => (
              <span key={d.name} className="flex items-center gap-1.5 text-[11px]" style={{ color: '#868E96' }}>
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                {d.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Row 2: Full width */}
      <div className="bg-white rounded-2xl shadow-sm p-5" style={{ border: '1px solid #DEE2E6' }}>
        <h3 className="font-heading font-semibold text-sm" style={{ color: '#1A1D23' }}>Income vs Expense vs Account Payable</h3>
        <p className="text-[11px] mb-4" style={{ color: '#868E96' }}>Monthly financial health overview</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={incomeExpenseChartData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#ADB5BD" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#ADB5BD" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
            <Tooltip formatter={(v: number) => [`BDT ${v.toLocaleString()}`, ""]} />
            <Legend iconType="circle" iconSize={8} formatter={(value) => <span className="text-xs" style={{ color: '#868E96' }}>{value}</span>} />
            <Bar dataKey="income" name="Income" fill="#2F9E44" radius={[4, 4, 0, 0]} barSize={16} />
            <Bar dataKey="expense" name="Expense" fill="#E03131" radius={[4, 4, 0, 0]} barSize={16} />
            <Bar dataKey="payable" name="Account Payable" fill="#E67700" radius={[4, 4, 0, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Payments Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid #DEE2E6' }}>
        <div className="p-4 flex items-center justify-between">
          <h3 className="font-heading font-semibold text-sm" style={{ color: '#1A1D23' }}>Recent Payments</h3>
          <button className="text-xs hover:underline" style={{ color: '#3B5BDB' }}>View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr style={{ background: '#F8F9FA' }}>
              {["Resident Name", "Flat Number", "Amount", "Method", "Status"].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-[11px] uppercase tracking-wide" style={{ color: '#495057' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {dashPayments.map((p, i) => (
                <tr key={i} className="border-t hover:bg-[#F8F9FA]" style={{ borderColor: '#F1F3F5' }}>
                  <td className="p-3 text-xs font-medium" style={{ color: '#1A1D23' }}>{p.tenant}</td>
                  <td className="p-3 text-xs" style={{ color: '#868E96' }}>{p.flat}</td>
                  <td className="p-3 text-xs font-medium" style={{ color: '#1A1D23' }}>BDT {p.amount.toLocaleString()}</td>
                  <td className="p-3 text-xs" style={{ color: '#868E96' }}>{p.method}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${p.status === "paid" ? "bg-[#EBFBEE] text-[#2F9E44]" : "bg-[#FFF5F5] text-[#E03131]"}`}>
                      {p.status === "paid" ? "Paid ✅" : "Due 🔴"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Payable Panel */}
      <SlidePanel open={payablePanel} onClose={() => setPayablePanel(false)} title="Account Payable Details">
        <div className="space-y-4">
          <table className="w-full text-xs">
            <thead><tr style={{ background: '#F8F9FA' }}>
              {["Whom", "Type", "Amount", "Date", "Notes", ""].map(h => <th key={h} className="text-left p-2 font-semibold" style={{ color: '#495057' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {accountPayableCardData.map((r, i) => (
                <tr key={i} className="border-t" style={{ borderColor: '#F1F3F5' }}>
                  <td className="p-2 font-medium" style={{ color: '#1A1D23' }}>{r.whom}</td>
                  <td className="p-2" style={{ color: '#868E96' }}>{r.type}</td>
                  <td className="p-2 font-medium" style={{ color: '#1A1D23' }}>BDT {r.amount.toLocaleString()}</td>
                  <td className="p-2" style={{ color: '#868E96' }}>{r.date}</td>
                  <td className="p-2" style={{ color: '#868E96' }}>{r.notes}</td>
                  <td className="p-2"><button onClick={() => toast.success("Marked as paid")} className="text-[11px] px-2 py-0.5 rounded" style={{ border: '1px solid #2F9E44', color: '#2F9E44' }}>Mark Paid</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end pt-2 border-t" style={{ borderColor: '#F1F3F5' }}>
            <span className="text-sm font-bold" style={{ color: '#1A1D23' }}>Total: BDT 8,200</span>
          </div>
        </div>
      </SlidePanel>

      {/* Cash In Hand Panel */}
      <SlidePanel open={cashPanel} onClose={() => setCashPanel(false)} title="Cash In Hand Breakdown">
        <div className="space-y-5">
          <div>
            <h4 className="text-xs font-semibold mb-2" style={{ color: '#1A1D23' }}>Cash Location</h4>
            <table className="w-full text-xs">
              <thead><tr style={{ background: '#F8F9FA' }}>
                {["Location", "Amount", "Type", "Last Updated"].map(h => <th key={h} className="text-left p-2 font-semibold" style={{ color: '#495057' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {cashLocations.map((c, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: '#F1F3F5' }}>
                    <td className="p-2 font-medium" style={{ color: '#1A1D23' }}>{c.location}</td>
                    <td className="p-2 font-medium" style={{ color: '#1A1D23' }}>BDT {c.amount.toLocaleString()}</td>
                    <td className="p-2" style={{ color: '#868E96' }}>{c.type}</td>
                    <td className="p-2" style={{ color: '#868E96' }}>{c.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end pt-2 border-t" style={{ borderColor: '#F1F3F5' }}>
              <span className="text-xs font-bold" style={{ color: '#1A1D23' }}>Total: BDT 6,700</span>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold mb-2" style={{ color: '#1A1D23' }}>Cash Movement Log</h4>
            <div className="space-y-2">
              {cashMovementLog.map((m, i) => (
                <div key={i} className="flex items-center justify-between text-xs bg-[#F8F9FA] rounded-lg px-3 py-2">
                  <span style={{ color: '#868E96' }}>{m.date}</span>
                  <span className="flex-1 mx-2" style={{ color: '#1A1D23' }}>{m.desc}</span>
                  <span className="font-medium" style={{ color: m.dir === "+" ? '#2F9E44' : '#E03131' }}>{m.dir}BDT {m.amount.toLocaleString()}</span>
                  <span className="ml-2" style={{ color: '#868E96' }}>Running: BDT {m.running.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SlidePanel>
    </div>
  );
};

// ─── TAB 2: Buildings (single building + flats) ──────────

const BuildingsContent = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const filtered = flats.filter(f => statusFilter === "All" || f.status === statusFilter);

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-heading font-bold" style={{ color: '#1A1D23' }}>Buildings</h1>

      {/* Single Building Info Card */}
      <div className="bg-white rounded-2xl shadow-sm p-5" style={{ border: '1px solid #DEE2E6' }}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h2 className="text-base font-semibold" style={{ color: '#1A1D23' }}>Sunset Tower</h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span style={{ color: '#868E96' }}>Address</span><p className="font-medium" style={{ color: '#1A1D23' }}>Road 5, Dhanmondi, Dhaka-1209</p></div>
              <div><span style={{ color: '#868E96' }}>Total Floors</span><p className="font-medium" style={{ color: '#1A1D23' }}>8</p></div>
              <div><span style={{ color: '#868E96' }}>Year Built</span><p className="font-medium" style={{ color: '#1A1D23' }}>2010</p></div>
              <div><span style={{ color: '#868E96' }}>Total Flats</span><p className="font-medium" style={{ color: '#1A1D23' }}>24</p></div>
              <div className="col-span-2"><span style={{ color: '#868E96' }}>Common Areas</span><p className="font-medium" style={{ color: '#1A1D23' }}>Rooftop, Parking, Generator Room</p></div>
            </div>
            <button className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ border: '1.5px solid #3B5BDB', color: '#3B5BDB' }}>Edit Building Info</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F8F9FA] rounded-xl p-3"><span className="text-[11px]" style={{ color: '#868E96' }}>Occupied Flats</span><p className="text-xl font-bold" style={{ color: '#1A1D23' }}>21</p></div>
            <div className="bg-[#F8F9FA] rounded-xl p-3"><span className="text-[11px]" style={{ color: '#868E96' }}>Vacant Flats</span><p className="text-xl font-bold" style={{ color: '#1A1D23' }}>3</p></div>
            <div className="bg-[#F8F9FA] rounded-xl p-3"><span className="text-[11px]" style={{ color: '#868E96' }}>Monthly Fund Target</span><p className="text-xl font-bold" style={{ color: '#1A1D23' }}>BDT 48,000</p></div>
            <div className="bg-[#F8F9FA] rounded-xl p-3"><span className="text-[11px]" style={{ color: '#868E96' }}>Building Fund Balance</span><p className="text-xl font-bold" style={{ color: '#1A1D23' }}>BDT 1,85,000</p></div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t" style={{ borderColor: '#DEE2E6' }} /></div>
        <div className="relative flex justify-center"><span className="bg-[#F8F9FA] px-3 text-xs font-medium" style={{ color: '#868E96' }}>Flat Details</span></div>
      </div>

      {/* Flats Table */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold" style={{ color: '#1A1D23' }}>All Flats</h2>
        <button className="flex items-center gap-1.5 text-white text-xs font-medium px-3 py-2 rounded-lg" style={{ background: '#3B5BDB' }}><Plus className="h-3.5 w-3.5" /> Add Flat</button>
      </div>
      <div className="flex gap-3">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 rounded-lg border px-3 text-xs" style={{ borderColor: '#DEE2E6' }}>
          <option value="All">All Status</option>
          <option value="Occupied">Occupied</option>
          <option value="Vacant">Vacant</option>
        </select>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid #DEE2E6' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr style={{ background: '#F8F9FA' }}>
              {["Flat No.", "Floor", "Size (sqft)", "Service Charge", "Status", "Current Tenant", "Actions"].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-[11px] uppercase tracking-wide" style={{ color: '#495057' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((f, i) => (
                <tr key={i} className="border-t hover:bg-[#F8F9FA]" style={{ borderColor: '#F1F3F5' }}>
                  <td className="p-3 text-xs font-medium" style={{ color: '#1A1D23' }}>{f.flat}</td>
                  <td className="p-3 text-xs" style={{ color: '#868E96' }}>{f.floor}</td>
                  <td className="p-3 text-xs" style={{ color: '#868E96' }}>{f.size}</td>
                  <td className="p-3 text-xs font-medium" style={{ color: '#1A1D23' }}>BDT {f.serviceCharge.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${f.status === "Occupied" ? "bg-[#EDF2FF] text-[#3B5BDB]" : "bg-[#F8F9FA] text-[#868E96]"}`} style={{ border: f.status === "Occupied" ? '1px solid #BAC8FF' : '1px solid #DEE2E6' }}>
                      {f.status}
                    </span>
                  </td>
                  <td className="p-3 text-xs" style={{ color: '#868E96' }}>{f.tenant}</td>
                  <td className="p-3">
                    <button className="text-xs hover:underline" style={{ color: '#3B5BDB' }}>{f.status === "Occupied" ? "View" : "Assign"}</button>
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

// ─── TAB 3: Flat Owner ───────────────────────────────────

const FlatOwnerContent = ({ onSelectOwner }: { onSelectOwner: (o: typeof flatOwners[0]) => void }) => (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-heading font-bold" style={{ color: '#1A1D23' }}>Flat Owners</h1>
      <button className="flex items-center gap-1.5 text-white text-xs font-medium px-3 py-2 rounded-lg" style={{ background: '#3B5BDB' }}><Plus className="h-3.5 w-3.5" /> Add Owner</button>
    </div>
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid #DEE2E6' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr style={{ background: '#F8F9FA' }}>
            {["Owner Name", "Phone Number", "NID Number", "Flat No.", "Ownership Since", "Tenant Living", "Status", "Actions"].map(h => (
              <th key={h} className="text-left p-3 font-semibold text-[11px] uppercase tracking-wide" style={{ color: '#495057' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {flatOwners.map((o, i) => (
              <tr key={i} className="border-t hover:bg-[#F8F9FA]" style={{ borderColor: '#F1F3F5' }}>
                <td className="p-3 text-xs font-medium" style={{ color: '#1A1D23' }}>{o.name}</td>
                <td className="p-3 text-xs" style={{ color: '#868E96' }}>{o.phone}</td>
                <td className="p-3 text-xs" style={{ color: '#868E96' }}>{o.nid}</td>
                <td className="p-3 text-xs" style={{ color: '#1A1D23' }}>{o.flat}</td>
                <td className="p-3 text-xs" style={{ color: '#868E96' }}>{o.since}</td>
                <td className="p-3 text-xs" style={{ color: '#868E96' }}>{o.tenantLiving}</td>
                <td className="p-3">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#EBFBEE] text-[#2F9E44]" style={{ border: '1px solid #B2F2BB' }}>{o.status}</span>
                </td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => onSelectOwner(o)} className="text-xs hover:underline flex items-center gap-1" style={{ color: '#3B5BDB' }}><Eye className="h-3 w-3" />View</button>
                  <button className="text-xs hover:underline flex items-center gap-1" style={{ color: '#868E96' }}><Edit className="h-3 w-3" />Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ─── TAB 4: Tenants ──────────────────────────────────────

const TenantsContent = ({ onSelectTenant }: { onSelectTenant: (t: typeof tenantsList[0]) => void }) => (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-heading font-bold" style={{ color: '#1A1D23' }}>Tenants</h1>
      <button className="flex items-center gap-1.5 text-white text-xs font-medium px-3 py-2 rounded-lg" style={{ background: '#3B5BDB' }}><Plus className="h-3.5 w-3.5" /> Add Tenant</button>
    </div>
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid #DEE2E6' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr style={{ background: '#F8F9FA' }}>
            {["Name", "Phone Number", "NID Number", "Flat No.", "Move-in Date", "Service Charge", "Status", "Actions"].map(h => (
              <th key={h} className="text-left p-3 font-semibold text-[11px] uppercase tracking-wide" style={{ color: '#495057' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {tenantsList.map((tt, i) => (
              <tr key={i} className="border-t hover:bg-[#F8F9FA]" style={{ borderColor: '#F1F3F5' }}>
                <td className="p-3 text-xs font-medium" style={{ color: '#1A1D23' }}>{tt.name}</td>
                <td className="p-3 text-xs" style={{ color: '#868E96' }}>{tt.phone}</td>
                <td className="p-3 text-xs" style={{ color: '#868E96' }}>{tt.nid}</td>
                <td className="p-3 text-xs" style={{ color: '#868E96' }}>{tt.flat}</td>
                <td className="p-3 text-xs" style={{ color: '#868E96' }}>{tt.moveIn}</td>
                <td className="p-3 text-xs font-medium" style={{ color: '#1A1D23' }}>BDT {tt.rent.toLocaleString()}</td>
                <td className="p-3"><span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#EBFBEE] text-[#2F9E44]" style={{ border: '1px solid #B2F2BB' }}>{tt.status}</span></td>
                <td className="p-3">
                  <button onClick={() => onSelectTenant(tt)} className="text-xs hover:underline" style={{ color: '#3B5BDB' }}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ─── TAB 5: Payment Status ──────────────────────────────

const PaymentStatusContent = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const filtered = paymentStatusData.filter(p => statusFilter === "All" || (statusFilter === "Paid" ? p.status === "paid" : p.status === "due"));
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-heading font-bold" style={{ color: '#1A1D23' }}>Payment Status</h1>
        <button className="flex items-center gap-1.5 text-white text-xs font-medium px-3 py-2 rounded-lg" style={{ background: '#3B5BDB' }}><Plus className="h-3.5 w-3.5" /> Record Payment</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm" style={{ border: '1px solid #DEE2E6' }}><span className="text-[11px]" style={{ color: '#868E96' }}>Total Collectable</span><p className="text-xl font-bold" style={{ color: '#1A1D23' }}>BDT 48,000</p></div>
        <div className="bg-white rounded-2xl p-4 shadow-sm" style={{ border: '1px solid #DEE2E6' }}><span className="text-[11px]" style={{ color: '#868E96' }}>Collected</span><p className="text-xl font-bold" style={{ color: '#2F9E44' }}>BDT 34,500</p></div>
        <div className="bg-white rounded-2xl p-4 shadow-sm" style={{ border: '1px solid #DEE2E6' }}><span className="text-[11px]" style={{ color: '#868E96' }}>Due</span><p className="text-xl font-bold" style={{ color: '#E03131' }}>BDT 13,500</p></div>
      </div>
      <div className="flex gap-3">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 rounded-lg border px-3 text-xs" style={{ borderColor: '#DEE2E6' }}>
          <option value="All">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Due">Due</option>
        </select>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid #DEE2E6' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr style={{ background: '#F8F9FA' }}>
              {["Tenant", "Flat", "Amount", "Month", "Payment Date", "Method", "Status", "Actions"].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-[11px] uppercase tracking-wide" style={{ color: '#495057' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={i} className="border-t hover:bg-[#F8F9FA]" style={{ borderColor: '#F1F3F5' }}>
                  <td className="p-3 text-xs font-medium" style={{ color: '#1A1D23' }}>{p.tenant}</td>
                  <td className="p-3 text-xs" style={{ color: '#868E96' }}>{p.flat}</td>
                  <td className="p-3 text-xs font-medium" style={{ color: '#1A1D23' }}>BDT {p.amount.toLocaleString()}</td>
                  <td className="p-3 text-xs" style={{ color: '#868E96' }}>{p.month}</td>
                  <td className="p-3 text-xs" style={{ color: '#868E96' }}>{p.date}</td>
                  <td className="p-3 text-xs" style={{ color: '#868E96' }}>{p.method}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${p.status === "paid" ? "bg-[#EBFBEE] text-[#2F9E44]" : "bg-[#FFF5F5] text-[#E03131]"}`} style={{ border: p.status === "paid" ? '1px solid #B2F2BB' : '1px solid #FFC9C9' }}>
                      {p.status === "paid" ? "Paid" : "Due"}
                    </span>
                  </td>
                  <td className="p-3">
                    {p.status === "paid" ? (
                      <button className="text-xs px-2 py-1 rounded-md" style={{ border: '1px solid #3B5BDB', color: '#3B5BDB' }}>Receipt</button>
                    ) : (
                      <button onClick={() => toast.success(`Reminder sent to ${p.tenant}`)} className="text-xs px-2 py-1 rounded-md" style={{ border: '1px solid #E67700', color: '#E67700' }}>Remind</button>
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

// ─── TAB 6: Expenses ─────────────────────────────────────

const ExpensesContent = () => {
  const [catFilter, setCatFilter] = useState("All");
  const filtered = expensesList.filter(e => catFilter === "All" || e.category === catFilter);
  const total = filtered.reduce((sum, e) => sum + e.amount, 0);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-heading font-bold" style={{ color: '#1A1D23' }}>Expenses</h1>
        <button className="flex items-center gap-1.5 text-white text-xs font-medium px-3 py-2 rounded-lg" style={{ background: '#3B5BDB' }}><Plus className="h-3.5 w-3.5" /> Add Expense</button>
      </div>
      <div className="flex gap-3">
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="h-9 rounded-lg border px-3 text-xs" style={{ borderColor: '#DEE2E6' }}>
          <option value="All">All Categories</option>
          {["Maintenance", "Repair", "Salary", "Utilities", "Cleaning"].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid #DEE2E6' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr style={{ background: '#F8F9FA' }}>
              {["Date", "Description", "Amount", "Category", "Added By"].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-[11px] uppercase tracking-wide" style={{ color: '#495057' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr key={i} className="border-t hover:bg-[#F8F9FA]" style={{ borderColor: '#F1F3F5' }}>
                  <td className="p-3 text-xs" style={{ color: '#868E96' }}>{e.date}</td>
                  <td className="p-3 text-xs font-medium" style={{ color: '#1A1D23' }}>{e.desc}</td>
                  <td className="p-3 text-xs font-medium" style={{ color: '#1A1D23' }}>BDT {e.amount.toLocaleString()}</td>
                  <td className="p-3"><span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${catColors[e.category] || "bg-gray-100 text-gray-700"}`}>{e.category}</span></td>
                  <td className="p-3 text-xs" style={{ color: '#868E96' }}>{e.addedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t flex justify-end" style={{ borderColor: '#F1F3F5' }}>
          <span className="text-sm font-bold" style={{ color: '#1A1D23' }}>Total: BDT {total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

// ─── TAB 7: Account Payable ──────────────────────────────

const AccountPayableContent = () => (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-heading font-bold" style={{ color: '#1A1D23' }}>Account Payable</h1>
        <p className="text-sm" style={{ color: '#868E96' }}>Amounts the association owes to vendors & service providers</p>
      </div>
      <button className="flex items-center gap-1.5 text-white text-xs font-medium px-3 py-2 rounded-lg" style={{ background: '#3B5BDB' }}><Plus className="h-3.5 w-3.5" /> Add Payable</button>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm" style={{ border: '1px solid #DEE2E6' }}><span className="text-[11px]" style={{ color: '#868E96' }}>Total Payable</span><p className="text-xl font-bold" style={{ color: '#1A1D23' }}>BDT 39,200</p></div>
      <div className="bg-white rounded-2xl p-4 shadow-sm" style={{ border: '1px solid #DEE2E6' }}><span className="text-[11px]" style={{ color: '#868E96' }}>Paid</span><p className="text-xl font-bold" style={{ color: '#2F9E44' }}>BDT 12,700</p></div>
      <div className="bg-white rounded-2xl p-4 shadow-sm" style={{ border: '1px solid #DEE2E6' }}><span className="text-[11px]" style={{ color: '#868E96' }}>Pending</span><p className="text-xl font-bold" style={{ color: '#E67700' }}>BDT 26,500</p></div>
    </div>
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid #DEE2E6' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr style={{ background: '#F8F9FA' }}>
            {["Date", "Description", "Amount", "Pay To", "Status", "Actions"].map(h => (
              <th key={h} className="text-left p-3 font-semibold text-[11px] uppercase tracking-wide" style={{ color: '#495057' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {accountPayableData.map((a, i) => (
              <tr key={i} className="border-t hover:bg-[#F8F9FA]" style={{ borderColor: '#F1F3F5' }}>
                <td className="p-3 text-xs" style={{ color: '#868E96' }}>{a.date}</td>
                <td className="p-3 text-xs font-medium" style={{ color: '#1A1D23' }}>{a.description}</td>
                <td className="p-3 text-xs font-medium" style={{ color: '#1A1D23' }}>BDT {a.amount.toLocaleString()}</td>
                <td className="p-3 text-xs" style={{ color: '#868E96' }}>{a.payTo}</td>
                <td className="p-3">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${a.status === "paid" ? "bg-[#EBFBEE] text-[#2F9E44]" : "bg-amber-100 text-amber-700"}`}>
                    {a.status === "paid" ? "Paid" : "Pending"}
                  </span>
                </td>
                <td className="p-3">
                  {a.status === "pending" && (
                    <button className="text-xs px-2 py-1 rounded-md" style={{ border: '1px solid #2F9E44', color: '#2F9E44' }}>Mark Paid</button>
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

// ─── TAB 8: Account Receivable ───────────────────────────

const AccountReceivableContent = () => (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-heading font-bold" style={{ color: '#1A1D23' }}>Account Receivable</h1>
        <p className="text-sm" style={{ color: '#868E96' }}>Outstanding amounts to be collected from residents</p>
      </div>
      <button className="flex items-center gap-1.5 text-white text-xs font-medium px-3 py-2 rounded-lg" style={{ background: '#3B5BDB' }}><Plus className="h-3.5 w-3.5" /> Add Entry</button>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm" style={{ border: '1px solid #DEE2E6' }}><span className="text-[11px]" style={{ color: '#868E96' }}>Total Receivable</span><p className="text-xl font-bold" style={{ color: '#1A1D23' }}>BDT 17,500</p></div>
      <div className="bg-white rounded-2xl p-4 shadow-sm" style={{ border: '1px solid #DEE2E6' }}><span className="text-[11px]" style={{ color: '#868E96' }}>Overdue</span><p className="text-xl font-bold" style={{ color: '#E03131' }}>BDT 14,000</p></div>
      <div className="bg-white rounded-2xl p-4 shadow-sm" style={{ border: '1px solid #DEE2E6' }}><span className="text-[11px]" style={{ color: '#868E96' }}>Upcoming</span><p className="text-xl font-bold" style={{ color: '#E67700' }}>BDT 3,500</p></div>
    </div>
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid #DEE2E6' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr style={{ background: '#F8F9FA' }}>
            {["Tenant", "Flat", "Type", "Amount", "Due Date", "Days Overdue", "Status", "Actions"].map(h => (
              <th key={h} className="text-left p-3 font-semibold text-[11px] uppercase tracking-wide" style={{ color: '#495057' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {accountReceivableData.map((a, i) => (
              <tr key={i} className="border-t hover:bg-[#F8F9FA]" style={{ borderColor: '#F1F3F5' }}>
                <td className="p-3 text-xs font-medium" style={{ color: '#1A1D23' }}>{a.tenant}</td>
                <td className="p-3 text-xs" style={{ color: '#868E96' }}>{a.flat}</td>
                <td className="p-3 text-xs" style={{ color: '#868E96' }}>{a.type}</td>
                <td className="p-3 text-xs font-medium" style={{ color: '#1A1D23' }}>BDT {a.amount.toLocaleString()}</td>
                <td className="p-3 text-xs" style={{ color: '#868E96' }}>{a.dueDate}</td>
                <td className="p-3">
                  {a.daysOverdue > 0 ? (
                    <span className="text-xs font-medium" style={{ color: '#E03131' }}>{a.daysOverdue} days</span>
                  ) : (
                    <span className="text-xs" style={{ color: '#868E96' }}>—</span>
                  )}
                </td>
                <td className="p-3">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${a.status === "overdue" ? "bg-[#FFF5F5] text-[#E03131]" : "bg-amber-100 text-amber-700"}`} style={{ border: a.status === "overdue" ? '1px solid #FFC9C9' : '1px solid #FFE066' }}>
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
      </div>
    </div>
  </div>
);

// ─── TAB 9: Reports ─────────────────────────────────────

const ReportsContent = () => {
  const [showMonthlyInvoice, setShowMonthlyInvoice] = useState(false);
  const [showFullInvoice, setShowFullInvoice] = useState(false);
  const [invoiceTenant, setInvoiceTenant] = useState("Rahim Uddin");
  const [invoiceMonth, setInvoiceMonth] = useState("March");
  const [invoiceYear, setInvoiceYear] = useState("2026");
  const [fullInvoiceMonth, setFullInvoiceMonth] = useState("March");
  const [fullInvoiceYear, setFullInvoiceYear] = useState("2026");

  const selectedTenantData = tenantsList.find(t => t.name === invoiceTenant);

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-heading font-bold" style={{ color: '#1A1D23' }}>Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: "Monthly Collection Report", desc: "Service charge collection summary by month", icon: BarChart3 },
          { title: "Expense Report", desc: "Detailed breakdown of all expenses by category", icon: FileText },
          { title: "Outstanding Dues Report", desc: "List of all pending payments and overdue amounts", icon: ArrowDownCircle },
          { title: "Income vs Expense Report", desc: "Profit/loss overview for each building", icon: TrendingDown },
        ].map((r, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer group" style={{ border: '1px solid #DEE2E6' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: '#EDF2FF' }}>
              <r.icon className="h-5 w-5" style={{ color: '#3B5BDB' }} />
            </div>
            <h3 className="text-sm font-semibold group-hover:text-[#3B5BDB] transition-colors" style={{ color: '#1A1D23' }}>{r.title}</h3>
            <p className="text-[11px] mt-1" style={{ color: '#868E96' }}>{r.desc}</p>
            <button className="mt-3 text-xs hover:underline" style={{ color: '#3B5BDB' }}>Generate →</button>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t" style={{ borderColor: '#DEE2E6' }} /></div>
        <div className="relative flex justify-center"><span className="bg-[#F8F9FA] px-3 text-xs font-medium" style={{ color: '#868E96' }}>Generate Invoices</span></div>
      </div>

      {/* Invoice Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Monthly Invoice */}
        <div className="bg-white rounded-2xl shadow-sm p-5" style={{ border: '1px solid #DEE2E6' }}>
          <h3 className="text-sm font-semibold mb-1" style={{ color: '#1A1D23' }}>Monthly Invoice</h3>
          <p className="text-[11px] mb-4" style={{ color: '#868E96' }}>Generate individual service charge invoice for a specific flat/tenant</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#495057' }}>Select Tenant</label>
              <select value={invoiceTenant} onChange={e => setInvoiceTenant(e.target.value)} className="w-full h-9 rounded-lg border px-3 text-xs" style={{ borderColor: '#DEE2E6' }}>
                {tenantsList.map(t => <option key={t.name} value={t.name}>{t.name} ({t.flat})</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#495057' }}>Month</label>
                <select value={invoiceMonth} onChange={e => setInvoiceMonth(e.target.value)} className="w-full h-9 rounded-lg border px-3 text-xs" style={{ borderColor: '#DEE2E6' }}>
                  {["January","February","March","April","May","June","July","August","September","October","November","December"].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#495057' }}>Year</label>
                <input value={invoiceYear} onChange={e => setInvoiceYear(e.target.value)} className="w-full h-9 rounded-lg border px-3 text-xs" style={{ borderColor: '#DEE2E6' }} />
              </div>
            </div>
            <button onClick={() => setShowMonthlyInvoice(true)} className="w-full h-9 text-xs font-medium rounded-lg text-white" style={{ background: '#3B5BDB' }}>Generate Invoice</button>
          </div>
        </div>

        {/* Full Association Invoice */}
        <div className="bg-white rounded-2xl shadow-sm p-5" style={{ border: '1px solid #DEE2E6' }}>
          <h3 className="text-sm font-semibold mb-1" style={{ color: '#1A1D23' }}>Full Monthly Report Invoice</h3>
          <p className="text-[11px] mb-4" style={{ color: '#868E96' }}>Generate complete financial invoice for the entire association</p>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#495057' }}>Month</label>
                <select value={fullInvoiceMonth} onChange={e => setFullInvoiceMonth(e.target.value)} className="w-full h-9 rounded-lg border px-3 text-xs" style={{ borderColor: '#DEE2E6' }}>
                  {["January","February","March","April","May","June","July","August","September","October","November","December"].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#495057' }}>Year</label>
                <input value={fullInvoiceYear} onChange={e => setFullInvoiceYear(e.target.value)} className="w-full h-9 rounded-lg border px-3 text-xs" style={{ borderColor: '#DEE2E6' }} />
              </div>
            </div>
            <button onClick={() => setShowFullInvoice(true)} className="w-full h-9 text-xs font-medium rounded-lg text-white" style={{ background: '#1A1D23' }}>Generate Full Invoice</button>
          </div>
        </div>
      </div>

      {/* Monthly Invoice Modal */}
      {showMonthlyInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowMonthlyInvoice(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 space-y-4 text-sm" style={{ fontFamily: 'monospace' }}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold" style={{ color: '#1A1D23' }}>RENTO</h2>
                  <p className="text-xs" style={{ color: '#868E96' }}>Sunset Tower Owners Association</p>
                  <p className="text-xs" style={{ color: '#868E96' }}>Road 5, Dhanmondi, Dhaka</p>
                </div>
                <button onClick={() => setShowMonthlyInvoice(false)} className="p-1 hover:bg-[#F1F3F5] rounded"><X className="h-4 w-4" /></button>
              </div>
              <div className="border-t pt-3" style={{ borderColor: '#DEE2E6' }}>
                <p className="font-bold text-base" style={{ color: '#1A1D23' }}>INVOICE</p>
                <p className="text-xs" style={{ color: '#868E96' }}>Invoice No: INV-{invoiceYear}-{invoiceMonth.slice(0,3).toUpperCase()}-{selectedTenantData?.flat}</p>
                <p className="text-xs" style={{ color: '#868E96' }}>Date: {invoiceMonth} 25, {invoiceYear}</p>
              </div>
              <div className="border-t pt-3" style={{ borderColor: '#DEE2E6' }}>
                <p className="text-xs font-medium" style={{ color: '#868E96' }}>Billed To:</p>
                <p className="font-medium" style={{ color: '#1A1D23' }}>{invoiceTenant}</p>
                <p className="text-xs" style={{ color: '#868E96' }}>Flat {selectedTenantData?.flat}, Sunset Tower</p>
                <p className="text-xs" style={{ color: '#868E96' }}>Phone: {selectedTenantData?.phone}</p>
              </div>
              <table className="w-full text-xs border-t" style={{ borderColor: '#DEE2E6' }}>
                <thead><tr style={{ background: '#F8F9FA' }}><th className="text-left p-2">Description</th><th className="text-right p-2">Amount</th></tr></thead>
                <tbody>
                  <tr className="border-t" style={{ borderColor: '#F1F3F5' }}>
                    <td className="p-2">Service Charge ({invoiceMonth} {invoiceYear})</td>
                    <td className="p-2 text-right font-medium">BDT {selectedTenantData?.rent.toLocaleString()}</td>
                  </tr>
                  <tr className="border-t font-bold" style={{ borderColor: '#DEE2E6' }}>
                    <td className="p-2">Total Due</td>
                    <td className="p-2 text-right">BDT {selectedTenantData?.rent.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-xs text-center" style={{ color: '#868E96' }}>Thank you for your payment. Contact: contact@rento.com.bd</p>
              <div className="flex gap-2 pt-2">
                <button onClick={() => window.print()} className="flex-1 h-9 text-xs font-medium rounded-lg text-white" style={{ background: '#3B5BDB' }}>Print Invoice</button>
                <button onClick={() => toast.info("PDF download coming soon")} className="flex-1 h-9 text-xs font-medium rounded-lg" style={{ border: '1.5px solid #3B5BDB', color: '#3B5BDB' }}>Download PDF</button>
                <button onClick={() => setShowMonthlyInvoice(false)} className="flex-1 h-9 text-xs font-medium rounded-lg" style={{ border: '1.5px solid #DEE2E6', color: '#495057' }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Invoice Modal */}
      {showFullInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowFullInvoice(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 space-y-4 text-sm" style={{ fontFamily: 'monospace' }}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold" style={{ color: '#1A1D23' }}>RENTO</h2>
                  <p className="text-xs" style={{ color: '#868E96' }}>Sunset Tower Owners Association</p>
                  <p className="text-xs" style={{ color: '#868E96' }}>Road 5, Dhanmondi, Dhaka-1209 | Tel: +880-1700-000000</p>
                </div>
                <button onClick={() => setShowFullInvoice(false)} className="p-1 hover:bg-[#F1F3F5] rounded"><X className="h-4 w-4" /></button>
              </div>
              <div className="border-t pt-3" style={{ borderColor: '#DEE2E6' }}>
                <p className="font-bold text-base" style={{ color: '#1A1D23' }}>FULL MONTHLY FINANCIAL REPORT</p>
                <p className="text-xs" style={{ color: '#868E96' }}>Month: {fullInvoiceMonth} {fullInvoiceYear} | Generated: March 25, 2026 | By: M. Rahman (Admin)</p>
              </div>

              <div className="border-t pt-3" style={{ borderColor: '#DEE2E6' }}>
                <h4 className="text-xs font-bold mb-2" style={{ color: '#1A1D23' }}>═══ SERVICE CHARGE SUMMARY ═══</h4>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <span style={{ color: '#495057' }}>Total Chargeable:</span><span className="font-medium" style={{ color: '#1A1D23' }}>BDT 48,000</span>
                  <span style={{ color: '#495057' }}>Total Collected:</span><span className="font-medium" style={{ color: '#2F9E44' }}>BDT 34,500</span>
                  <span style={{ color: '#495057' }}>Total Due:</span><span className="font-medium" style={{ color: '#E03131' }}>BDT 13,500</span>
                  <span style={{ color: '#495057' }}>Collection Rate:</span><span className="font-medium" style={{ color: '#1A1D23' }}>72%</span>
                </div>
              </div>

              <div className="border-t pt-3" style={{ borderColor: '#DEE2E6' }}>
                <h4 className="text-xs font-bold mb-2" style={{ color: '#1A1D23' }}>═══ FLAT-WISE COLLECTION ═══</h4>
                <table className="w-full text-xs">
                  <thead><tr style={{ background: '#F8F9FA' }}><th className="text-left p-1.5">Flat</th><th className="text-left p-1.5">Tenant</th><th className="text-right p-1.5">Amount</th><th className="text-right p-1.5">Status</th></tr></thead>
                  <tbody>
                    {dashPayments.slice(0, 8).map((p, i) => (
                      <tr key={i} className="border-t" style={{ borderColor: '#F1F3F5' }}>
                        <td className="p-1.5">{p.flat}</td>
                        <td className="p-1.5">{p.tenant}</td>
                        <td className="p-1.5 text-right">{p.amount.toLocaleString()}</td>
                        <td className="p-1.5 text-right"><span style={{ color: p.status === "paid" ? '#2F9E44' : '#E03131' }}>{p.status === "paid" ? "Paid" : "Due"}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t pt-3" style={{ borderColor: '#DEE2E6' }}>
                <h4 className="text-xs font-bold mb-2" style={{ color: '#1A1D23' }}>═══ EXPENSE SUMMARY ═══</h4>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <span style={{ color: '#495057' }}>Total Expenses:</span><span className="font-bold" style={{ color: '#1A1D23' }}>BDT 27,800</span>
                  {expensePieData.map(e => (<>
                    <span key={e.name} style={{ color: '#495057' }}>{e.name}:</span><span style={{ color: '#1A1D23' }}>BDT {e.value.toLocaleString()}</span>
                  </>))}
                </div>
              </div>

              <div className="border-t pt-3" style={{ borderColor: '#DEE2E6' }}>
                <h4 className="text-xs font-bold mb-2" style={{ color: '#1A1D23' }}>═══ FINANCIAL POSITION ═══</h4>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <span style={{ color: '#495057' }}>Cash In Hand:</span><span className="font-medium" style={{ color: '#1A1D23' }}>BDT 6,700</span>
                  <span style={{ color: '#495057' }}>Building Fund Balance:</span><span className="font-medium" style={{ color: '#1A1D23' }}>BDT 1,85,000</span>
                  <span style={{ color: '#495057' }}>Account Receivable:</span><span className="font-medium" style={{ color: '#E03131' }}>BDT 13,500</span>
                  <span style={{ color: '#495057' }}>Account Payable:</span><span className="font-medium" style={{ color: '#E67700' }}>BDT 8,200</span>
                </div>
              </div>

              <div className="border-t pt-3" style={{ borderColor: '#DEE2E6' }}>
                <h4 className="text-xs font-bold mb-2" style={{ color: '#1A1D23' }}>═══ OVERDUE RESIDENTS ═══</h4>
                {overdueResidents.map((r, i) => (
                  <p key={i} className="text-xs" style={{ color: '#E03131' }}>{r.name} ({r.flat}) — {r.monthsOverdue} month{r.monthsOverdue > 1 ? "s" : ""} — BDT {r.totalDue.toLocaleString()}</p>
                ))}
              </div>

              <div className="border-t pt-3 text-center text-xs" style={{ borderColor: '#DEE2E6', color: '#868E96' }}>
                <p>Prepared by: Sunset Tower Association</p>
                <p>Authorized: Muhammad Mushfiqur Rahman</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={() => window.print()} className="flex-1 h-9 text-xs font-medium rounded-lg text-white" style={{ background: '#3B5BDB' }}>Print Invoice</button>
                <button onClick={() => toast.info("PDF download coming soon")} className="flex-1 h-9 text-xs font-medium rounded-lg" style={{ border: '1.5px solid #3B5BDB', color: '#3B5BDB' }}>Download PDF</button>
                <button onClick={() => setShowFullInvoice(false)} className="flex-1 h-9 text-xs font-medium rounded-lg" style={{ border: '1.5px solid #DEE2E6', color: '#495057' }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── TAB 10: Association ─────────────────────────────────

const AssociationContent = () => {
  const [showAddMember, setShowAddMember] = useState(false);

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-heading font-bold" style={{ color: '#1A1D23' }}>Association</h1>

      {/* Association Info */}
      <div className="bg-white rounded-2xl shadow-sm p-5" style={{ border: '1px solid #DEE2E6' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold" style={{ color: '#1A1D23' }}>Sunset Tower Owners Association</h2>
          <button className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ border: '1.5px solid #3B5BDB', color: '#3B5BDB' }}>Edit Association Info</button>
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div><span style={{ color: '#868E96' }}>Established</span><p className="font-medium" style={{ color: '#1A1D23' }}>January 2018</p></div>
          <div><span style={{ color: '#868E96' }}>Total Members</span><p className="font-medium" style={{ color: '#1A1D23' }}>8</p></div>
          <div><span style={{ color: '#868E96' }}>Admin</span><p className="font-medium" style={{ color: '#1A1D23' }}>Muhammad Mushfiqur Rahman</p></div>
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t" style={{ borderColor: '#DEE2E6' }} /></div>
      </div>

      {/* Roles Management */}
      <div className="bg-white rounded-2xl shadow-sm p-5" style={{ border: '1px solid #DEE2E6' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold" style={{ color: '#1A1D23' }}>Roles & Permissions</h3>
          <button className="text-xs px-3 py-1.5 rounded-lg font-medium text-white" style={{ background: '#3B5BDB' }}>+ Add Role</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr style={{ background: '#F8F9FA' }}>
              {["Role Name", "Permissions", "Members", "Actions"].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-[11px] uppercase tracking-wide" style={{ color: '#495057' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {associationRoles.map((r, i) => (
                <tr key={i} className="border-t hover:bg-[#F8F9FA]" style={{ borderColor: '#F1F3F5' }}>
                  <td className="p-3 text-xs font-medium" style={{ color: '#1A1D23' }}>{r.name}</td>
                  <td className="p-3 text-xs" style={{ color: '#868E96' }}>{r.permissions}</td>
                  <td className="p-3 text-xs" style={{ color: '#1A1D23' }}>{r.members}</td>
                  <td className="p-3 flex gap-2">
                    <button className="text-xs hover:underline" style={{ color: '#3B5BDB' }}>Edit</button>
                    {r.name !== "Admin" && <button className="text-xs hover:underline" style={{ color: '#E03131' }}>Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Members */}
      <div className="bg-white rounded-2xl shadow-sm p-5" style={{ border: '1px solid #DEE2E6' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold" style={{ color: '#1A1D23' }}>Association Members</h3>
          <button onClick={() => setShowAddMember(true)} className="text-xs px-3 py-1.5 rounded-lg font-medium text-white" style={{ background: '#3B5BDB' }}>+ Add Member</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr style={{ background: '#F8F9FA' }}>
              {["Name", "Phone", "NID", "Role", "Joining Date", "Status", "Actions"].map(h => (
                <th key={h} className="text-left p-3 font-semibold text-[11px] uppercase tracking-wide" style={{ color: '#495057' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {associationMembers.map((m, i) => (
                <tr key={i} className="border-t hover:bg-[#F8F9FA]" style={{ borderColor: '#F1F3F5' }}>
                  <td className="p-3 text-xs font-medium" style={{ color: '#1A1D23' }}>{m.name}</td>
                  <td className="p-3 text-xs" style={{ color: '#868E96' }}>{m.phone}</td>
                  <td className="p-3 text-xs" style={{ color: '#868E96' }}>{m.nid}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      m.role === "Admin" ? "bg-[#EDF2FF] text-[#3B5BDB]" :
                      m.role === "Manager" ? "bg-purple-100 text-purple-700" :
                      m.role === "Cashier" ? "bg-amber-100 text-amber-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>{m.role}</span>
                  </td>
                  <td className="p-3 text-xs" style={{ color: '#868E96' }}>{m.joined}</td>
                  <td className="p-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#EBFBEE] text-[#2F9E44]" style={{ border: '1px solid #B2F2BB' }}>{m.status}</span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button className="text-xs hover:underline" style={{ color: '#3B5BDB' }}>Edit</button>
                    {m.role !== "Admin" && <button onClick={() => { if (confirm(`Remove ${m.name} from association?`)) toast.success(`${m.name} removed`); }} className="text-xs hover:underline" style={{ color: '#E03131' }}>Remove</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] mt-3 italic" style={{ color: '#868E96' }}>Only the Admin can add or remove members and manage roles.</p>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowAddMember(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold" style={{ color: '#1A1D23' }}>Add Member</h3>
              <button onClick={() => setShowAddMember(false)} className="p-1 hover:bg-[#F1F3F5] rounded"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3">
              <div><label className="text-xs mb-1 block" style={{ color: '#495057' }}>Full Name</label><input className="w-full h-9 rounded-lg border px-3 text-xs" style={{ borderColor: '#DEE2E6' }} /></div>
              <div><label className="text-xs mb-1 block" style={{ color: '#495057' }}>Phone Number</label><input placeholder="+880" className="w-full h-9 rounded-lg border px-3 text-xs" style={{ borderColor: '#DEE2E6' }} /></div>
              <div><label className="text-xs mb-1 block" style={{ color: '#495057' }}>NID Number</label><input className="w-full h-9 rounded-lg border px-3 text-xs" style={{ borderColor: '#DEE2E6' }} /></div>
              <div><label className="text-xs mb-1 block" style={{ color: '#495057' }}>Role</label>
                <select className="w-full h-9 rounded-lg border px-3 text-xs" style={{ borderColor: '#DEE2E6' }}>
                  <option>Admin</option><option>Manager</option><option>Cashier</option><option>Member</option>
                </select>
              </div>
              <div><label className="text-xs mb-1 block" style={{ color: '#495057' }}>Joining Date</label><input type="date" className="w-full h-9 rounded-lg border px-3 text-xs" style={{ borderColor: '#DEE2E6' }} /></div>
              <button onClick={() => { setShowAddMember(false); toast.success("Member added"); }} className="w-full h-9 text-xs font-medium rounded-lg text-white" style={{ background: '#3B5BDB' }}>Add Member</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── TAB 11: Settings ────────────────────────────────────

const SettingsContent = () => (
  <div className="space-y-6 max-w-2xl">
    <h1 className="text-xl font-heading font-bold" style={{ color: '#1A1D23' }}>Settings</h1>

    <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4" style={{ border: '1px solid #DEE2E6' }}>
      <h2 className="text-sm font-semibold" style={{ color: '#1A1D23' }}>Building Profile</h2>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-xs block mb-1" style={{ color: '#868E96' }}>Building Name</label><input defaultValue="Sunset Tower" className="w-full h-9 border rounded-lg px-3 text-xs" style={{ borderColor: '#DEE2E6' }} /></div>
        <div><label className="text-xs block mb-1" style={{ color: '#868E96' }}>Address</label><input defaultValue="Road 5, Dhanmondi, Dhaka" className="w-full h-9 border rounded-lg px-3 text-xs" style={{ borderColor: '#DEE2E6' }} /></div>
        <div><label className="text-xs block mb-1" style={{ color: '#868E96' }}>Total Floors</label><input defaultValue="8" type="number" className="w-full h-9 border rounded-lg px-3 text-xs" style={{ borderColor: '#DEE2E6' }} /></div>
        <div><label className="text-xs block mb-1" style={{ color: '#868E96' }}>Total Flats</label><input defaultValue="24" type="number" className="w-full h-9 border rounded-lg px-3 text-xs" style={{ borderColor: '#DEE2E6' }} /></div>
      </div>
      <button className="text-white text-xs font-medium px-4 py-2 rounded-lg" style={{ background: '#3B5BDB' }}>Save Changes</button>
    </div>

    <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4" style={{ border: '1px solid #DEE2E6' }}>
      <h2 className="text-sm font-semibold" style={{ color: '#1A1D23' }}>Notification Preferences</h2>
      {["Send payment reminders (3 days before due)", "Send overdue alerts", "Send payment confirmations", "Email notifications", "SMS notifications"].map((label, i) => (
        <label key={i} className="flex items-center justify-between">
          <span className="text-xs" style={{ color: '#1A1D23' }}>{label}</span>
          <input type="checkbox" defaultChecked={i < 3} className="w-4 h-4 rounded accent-[#3B5BDB]" />
        </label>
      ))}
    </div>

    <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4" style={{ border: '1px solid #DEE2E6' }}>
      <h2 className="text-sm font-semibold" style={{ color: '#1A1D23' }}>Account</h2>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-xs block mb-1" style={{ color: '#868E96' }}>Owner Name</label><input defaultValue="Muhammad Mushfiqur Rahman" className="w-full h-9 border rounded-lg px-3 text-xs" style={{ borderColor: '#DEE2E6' }} /></div>
        <div><label className="text-xs block mb-1" style={{ color: '#868E96' }}>Phone Number</label><input defaultValue="01711-000000" className="w-full h-9 border rounded-lg px-3 text-xs" style={{ borderColor: '#DEE2E6' }} /></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div><label className="text-xs block mb-1" style={{ color: '#868E96' }}>Current Password</label><input type="password" className="w-full h-9 border rounded-lg px-3 text-xs" style={{ borderColor: '#DEE2E6' }} /></div>
        <div><label className="text-xs block mb-1" style={{ color: '#868E96' }}>New Password</label><input type="password" className="w-full h-9 border rounded-lg px-3 text-xs" style={{ borderColor: '#DEE2E6' }} /></div>
        <div><label className="text-xs block mb-1" style={{ color: '#868E96' }}>Confirm Password</label><input type="password" className="w-full h-9 border rounded-lg px-3 text-xs" style={{ borderColor: '#DEE2E6' }} /></div>
      </div>
      <button className="text-white text-xs font-medium px-4 py-2 rounded-lg" style={{ background: '#3B5BDB' }}>Update Profile</button>
    </div>
  </div>
);

export default BuildingManagement;
