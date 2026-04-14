import { v4 as uuid } from 'uuid';
import { prepare, run } from '../db/index.js';

export function createExpense(orgId: string, data: { building_id?: string; description: string; amount: number; category: string; date: string; added_by: string }) {
  const id = uuid();
  run('INSERT INTO expenses (id, org_id, building_id, description, amount, category, date, added_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, orgId, data.building_id || null, data.description, data.amount, data.category, data.date, data.added_by]);
  return findExpenseById(id, orgId);
}

export function listExpenses(orgId: string) {
  return prepare('SELECT e.*, b.name as building_name FROM expenses e LEFT JOIN buildings b ON e.building_id = b.id WHERE e.org_id = ? ORDER BY e.date DESC').all([orgId]);
}

export function findExpenseById(id: string, orgId: string) {
  return prepare('SELECT e.*, b.name as building_name FROM expenses e LEFT JOIN buildings b ON e.building_id = b.id WHERE e.id = ? AND e.org_id = ?').all([id, orgId])[0] || null;
}

export function updateExpense(id: string, orgId: string, data: Partial<{ description: string; amount: number; category: string; date: string }>) {
  const fields: string[] = [];
  const values: any[] = [];
  Object.entries(data).forEach(([k, v]) => { if (v !== undefined) { fields.push(`${k} = ?`); values.push(v); } });
  if (!fields.length) return;
  values.push(id, orgId);
  run(`UPDATE expenses SET ${fields.join(', ')} WHERE id = ? AND org_id = ?`, values);
}

export function deleteExpense(id: string, orgId: string) {
  const before = findExpenseById(id, orgId);
  if (!before) return null;
  run('DELETE FROM expenses WHERE id = ? AND org_id = ?', [id, orgId]);
  return before;
}