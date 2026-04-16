import { v4 as uuid } from 'uuid';
import { prepare, run } from '../db/index.js';

export function createPayable(orgId: string, data: { description: string; amount: number; pay_to: string; due_date: string }) {
  const id = uuid();
  run('INSERT INTO account_payables (id, org_id, description, amount, pay_to, due_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, orgId, data.description, data.amount, data.pay_to, data.due_date, 'pending']);
  return findPayableById(id, orgId);
}

export function listPayables(orgId: string) {
  return prepare('SELECT * FROM account_payables WHERE org_id = ? ORDER BY due_date ASC').all([orgId]);
}

export function findPayableById(id: string, orgId: string) {
  return prepare('SELECT * FROM account_payables WHERE id = ? AND org_id = ?').all([id, orgId])[0] || null;
}

export function updatePayable(id: string, orgId: string, data: Partial<{ description: string; amount: number; pay_to: string; due_date: string; status: string }>) {
  const fields: string[] = [];
  const values: any[] = [];
  Object.entries(data).forEach(([k, v]) => { if (v !== undefined) { fields.push(`${k} = ?`); values.push(v); } });
  if (!fields.length) return;
  values.push(id, orgId);
  run(`UPDATE account_payables SET ${fields.join(', ')} WHERE id = ? AND org_id = ?`, values);
}

export function deletePayable(id: string, orgId: string) {
  run('DELETE FROM account_payables WHERE id = ? AND org_id = ?', [id, orgId]);
}