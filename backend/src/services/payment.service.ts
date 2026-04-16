import { v4 as uuid } from 'uuid';
import { prepare, run } from '../db/index.js';

export function createPayment(orgId: string, data: { tenant_id: string; unit_id: string; amount: number; type: string; month: string; method: string; recorded_by: string; notes?: string }) {
  const id = uuid();
  run('INSERT INTO payments (id, org_id, tenant_id, unit_id, amount, type, month, method, status, recorded_by, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, orgId, data.tenant_id, data.unit_id, data.amount, data.type, data.month, data.method, 'paid', data.recorded_by, data.notes || null]);
  return findPaymentById(id, orgId);
}

export function listPayments(orgId: string) {
  return prepare('SELECT p.*, t.name as tenant_name, u.unit_number FROM payments p JOIN tenants t ON p.tenant_id = t.id JOIN units u ON p.unit_id = u.id WHERE p.org_id = ? ORDER BY p.created_at DESC').all([orgId]);
}

export function findPaymentById(id: string, orgId: string) {
  return prepare('SELECT p.*, t.name as tenant_name, u.unit_number FROM payments p JOIN tenants t ON p.tenant_id = t.id JOIN units u ON p.unit_id = u.id WHERE p.id = ? AND p.org_id = ?').all([id, orgId])[0] || null;
}

export function updatePayment(id: string, orgId: string, data: Partial<{ amount: number; type: string; month: string; method: string; status: string }>) {
  const fields: string[] = [];
  const values: any[] = [];
  Object.entries(data).forEach(([k, v]) => { if (v !== undefined) { fields.push(`${k} = ?`); values.push(v); } });
  if (!fields.length) return;
  values.push(id, orgId);
  run(`UPDATE payments SET ${fields.join(', ')} WHERE id = ? AND org_id = ?`, values);
}

export function deletePayment(id: string, orgId: string) {
  const before = findPaymentById(id, orgId);
  if (!before) return null;
  run('DELETE FROM payments WHERE id = ? AND org_id = ?', [id, orgId]);
  return before;
}