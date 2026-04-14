import { v4 as uuid } from 'uuid';
import { prepare, run } from '../db/index.js';

export function generateInvoiceNumber(orgId: string): string {
  const year = new Date().getFullYear().toString();
  const seqRow = prepare('SELECT current_seq FROM invoice_sequences WHERE org_id = ?').all([orgId])[0] as any;
  let seq = seqRow ? seqRow.current_seq + 1 : 1;
  run('INSERT OR REPLACE INTO invoice_sequences (org_id, current_year, current_seq) VALUES (?, ?, ?)', [orgId, year, seq]);
  return `INV-${year}-${seq.toString().padStart(5, '0')}`;
}

export function createInvoice(orgId: string, data: { tenant_id: string; unit_id: string; month: string; line_items: any[]; due_date?: string }, userId: string) {
  const id = uuid();
  const invoiceNumber = generateInvoiceNumber(orgId);
  const totalAmount = data.line_items.reduce((sum: number, item: any) => sum + item.amount, 0);
  
  run(`INSERT INTO invoices (id, org_id, invoice_number, tenant_id, unit_id, month, line_items, total_amount, due_date, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, orgId, invoiceNumber, data.tenant_id, data.unit_id, data.month, JSON.stringify(data.line_items), totalAmount, data.due_date || null, userId]);
  
  return findInvoiceById(id, orgId);
}

export function listInvoices(orgId: string) {
  return prepare(`SELECT i.*, t.name as tenant_name, u.unit_number 
    FROM invoices i 
    JOIN tenants t ON i.tenant_id = t.id 
    JOIN units u ON i.unit_id = u.id 
    WHERE i.org_id = ? 
    ORDER BY i.created_at DESC`).all([orgId]);
}

export function findInvoiceById(id: string, orgId: string) {
  return prepare(`SELECT i.*, t.name as tenant_name, u.unit_number 
    FROM invoices i 
    JOIN tenants t ON i.tenant_id = t.id 
    JOIN units u ON i.unit_id = u.id 
    WHERE i.id = ? AND i.org_id = ?`).all([id, orgId])[0] || null;
}

export function markInvoiceAsPaid(id: string, orgId: string) {
  run('UPDATE invoices SET status = ?, paid_at = ? WHERE id = ? AND org_id = ?', ['paid', new Date().toISOString(), id, orgId]);
}

export function deleteInvoice(id: string, orgId: string) {
  const before = findInvoiceById(id, orgId);
  if (!before) return null;
  run('DELETE FROM invoices WHERE id = ? AND org_id = ?', [id, orgId]);
  return before;
}