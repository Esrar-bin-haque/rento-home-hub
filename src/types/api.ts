export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  name: string;
  google_id: string | null;
  avatar_url: string | null;
  is_super_admin: number;
  is_verified: number;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    phone: string | null;
    email?: string | null;
  };
  orgs: Org[];
}

export interface Org {
  id: string;
  name: string;
  slug: string;
  owner_id: string | null;
  plan: string;
  is_active: number;
  created_at: string;
}

export interface Building {
  id: string;
  org_id: string;
  name: string;
  address: string | null;
  total_floors: number | null;
  created_at: string;
}

export interface BuildingCreateInput {
  name: string;
  address?: string;
  total_floors?: number;
}

export interface BuildingUpdateInput {
  name?: string;
  address?: string;
  total_floors?: number;
}

export interface Unit {
  id: string;
  building_id: string;
  org_id: string;
  unit_number: string;
  floor: string | null;
  size_sqft: number | null;
  rent_amount: number | null;
  service_charge: number | null;
  status: string;
  created_at: string;
}

export interface UnitCreateInput {
  building_id: string;
  unit_number: string;
  floor?: string;
  size_sqft?: number;
  rent_amount?: number;
  service_charge?: number;
}

export interface UnitUpdateInput {
  unit_number?: string;
  floor?: string;
  size_sqft?: number;
  rent_amount?: number;
  service_charge?: number;
  status?: string;
}

export interface Tenant {
  id: string;
  org_id: string;
  unit_id: string;
  user_id: string | null;
  name: string;
  phone: string | null;
  move_in_date: string | null;
  advance_amount: number | null;
  status: string;
  created_at: string;
  unit_number?: string;
}

export interface TenantCreateInput {
  unit_id: string;
  name: string;
  phone?: string;
  nid?: string;
  advance_amount?: number;
}

export interface TenantUpdateInput {
  name?: string;
  phone?: string;
  nid?: string;
  advance_amount?: number;
  status?: string;
}

export interface Payment {
  id: string;
  org_id: string;
  tenant_id: string;
  unit_id: string;
  amount: number;
  type: string;
  month: string;
  method: string;
  status: string;
  paid_at: string | null;
  recorded_by: string;
  notes: string | null;
  created_at: string;
  tenant_name?: string;
  unit_number?: string;
}

export interface PaymentCreateInput {
  tenant_id: string;
  unit_id: string;
  amount: number;
  type: string;
  month: string;
  method: string;
  notes?: string;
}

export interface PaymentUpdateInput {
  amount?: number;
  type?: string;
  month?: string;
  method?: string;
  status?: string;
}

export interface Expense {
  id: string;
  org_id: string;
  building_id: string | null;
  description: string;
  amount: number;
  category: string;
  date: string;
  added_by: string;
  created_at: string;
  building_name?: string;
}

export interface ExpenseCreateInput {
  building_id?: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  added_by: string;
}

export interface ExpenseUpdateInput {
  description?: string;
  amount?: number;
  category?: string;
  date?: string;
}

export interface InvoiceLineItem {
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  org_id: string;
  invoice_number: string;
  tenant_id: string;
  unit_id: string;
  month: string;
  line_items: string;
  total_amount: number;
  status: string;
  issued_at: string | null;
  due_date: string | null;
  paid_at: string | null;
  created_by: string;
  created_at: string;
  tenant_name?: string;
  unit_number?: string;
}

export interface InvoiceCreateInput {
  tenant_id: string;
  unit_id: string;
  month: string;
  line_items: InvoiceLineItem[];
  due_date?: string;
}

export interface Payable {
  id: string;
  org_id: string;
  description: string;
  amount: number;
  pay_to: string;
  due_date: string;
  status: string;
  paid_at: string | null;
  created_at: string;
}

export interface PayableCreateInput {
  description: string;
  amount: number;
  pay_to: string;
  due_date: string;
}

export interface PayableUpdateInput {
  description?: string;
  amount?: number;
  pay_to?: string;
  due_date?: string;
  status?: string;
}

export interface MonthlyData {
  service_charge: number;
  collected: number;
  receivable: number;
  expense: number;
  payable: number;
  cash_in_hand: number;
  notCollected: number;
  income: number;
}

export interface ExpenseItem {
  name: string;
  value: number;
  color: string;
}

export interface PaymentItem {
  tenant: string;
  flat: string;
  amount: number;
  method: string;
  status: string;
}

export interface OverdueResident {
  name: string;
  flat: string;
  monthsOverdue: number;
  totalDue: number;
  lastPaid: string;
}

export interface DashboardStats {
  buildings: number;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  activeTenants: number;
  totalPaymentsCollected: number;
  totalExpenses: number;
  monthlyData?: Record<string, MonthlyData>;
  expensePieData?: ExpenseItem[];
  dashPayments?: PaymentItem[];
  overdueResidents?: OverdueResident[];
}

export interface AdminStats {
  totalOrgs: number;
  totalUsers: number;
  totalPayments: number;
}

export interface AdminOrg {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  plan: string;
  is_active: number;
  created_at: string;
}

export interface AdminUser {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  is_super_admin: number;
  created_at: string;
}

export interface ApiErrorResponse {
  error: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}