import { prepare } from '../db/index.js';

export function getDashboardData(orgId: string) {
  const buildings = prepare('SELECT COUNT(*) as c FROM buildings WHERE org_id = ?').all([orgId])[0] as any;
  const totalUnits = prepare('SELECT COUNT(*) as c FROM units WHERE org_id = ?').all([orgId])[0] as any;
  const occupiedUnits = prepare('SELECT COUNT(*) as c FROM units WHERE org_id = ? AND status = ?').all([orgId, 'occupied'])[0] as any;
  const activeTenants = prepare('SELECT COUNT(*) as c FROM tenants WHERE org_id = ? AND status = ?').all([orgId, 'active'])[0] as any;
  
  const currentMonth = new Date().toISOString().slice(0, 7);
  const totalPayments = prepare(`SELECT COALESCE(SUM(amount), 0) as c FROM payments WHERE org_id = ? AND status = ? AND month = ?`).all([orgId, 'paid', currentMonth])[0] as any;
  const totalExpenses = prepare(`SELECT COALESCE(SUM(amount), 0) as c FROM expenses WHERE org_id = ? AND date LIKE ?`).all([orgId, currentMonth + '%'])[0] as any;
  
  return {
    buildings: buildings.c,
    totalUnits: totalUnits.c,
    occupiedUnits: occupiedUnits.c,
    vacantUnits: totalUnits.c - occupiedUnits.c,
    activeTenants: activeTenants.c,
    totalPaymentsCollected: totalPayments.c,
    totalExpenses: totalExpenses.c,
  };
}