import { Router, Request, Response } from 'express';
import createDOMPurify from 'dompurify';
import { requireAuth } from '../middleware/auth.js';
import { requireOrgMember } from '../middleware/orgScope.js';
import { requirePermission } from '../middleware/rbac.js';
import { createInvoice, listInvoices, findInvoiceById, markInvoiceAsPaid, deleteInvoice } from '../services/invoice.service.js';

const DOMPurify = createDOMPurify();

const router = Router();

router.get('/', requireAuth, requireOrgMember, requirePermission('invoices.read'), (req: Request, res: Response) => {
  res.json({ data: listInvoices(req.org!.id) });
});

router.post('/', requireAuth, requireOrgMember, requirePermission('invoices.write'), async (req: Request, res: Response) => {
  try {
    const invoice = createInvoice(req.org!.id, req.body, req.user!.userId);
    res.status(201).json(invoice);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create invoice' });
  }
});

router.get('/:id/print', requireAuth, requireOrgMember, requirePermission('invoices.read'), (req: Request, res: Response) => {
  const inv = findInvoiceById(req.params.id, req.org!.id) as any;
  if (!inv) return res.status(404).json({ error: 'Not found' });
  
  const html = `
<!DOCTYPE html>
<html>
<head><title>Invoice ${inv.invoice_number}</title>
<style>
body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
.header { display: flex; justify-content: space-between; margin-bottom: 30px; }
table { width: 100%; border-collapse: collapse; margin: 20px 0; }
th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
.total { font-size: 1.2em; font-weight: bold; }
.status-paid { background: #d4edda; color: #155724; padding: 5px 10px; }
.status-draft { background: #e2e3e5; color: #383d41; padding: 5px 10px; }
.status-issued { background: #cce5ff; color: #004085; padding: 5px 10px; }
</style>
</head>
<body>
<div class="header">
<div>
<h1>Invoice ${inv.invoice_number}</h1>
<p>Month: ${inv.month}</p>
<p>Due Date: ${inv.due_date || 'N/A'}</p>
</div>
<div>
<span class="status-${inv.status}">${String(inv.status).toUpperCase()}</span>
</div>
</div>
<table>
<tr><th>Tenant</th><td>${DOMPurify.sanitize(inv.tenant_name)}</td></tr>
<tr><th>Unit</th><td>${DOMPurify.sanitize(inv.unit_number)}</td></tr>
</table>
<h3>Line Items</h3>
<table>
<tr><th>Description</th><th>Amount (BDT)</th></tr>
${(JSON.parse(inv.line_items) as any[]).map(item => `<tr><td>${DOMPurify.sanitize(item.label)}</td><td>${item.amount}</td></tr>`).join('')}
<tr><td class="total">Total</td><td class="total">${inv.total_amount}</td></tr>
</table>
</body>
</html>`;
  res.type('html').send(html);
});

router.get('/:id', requireAuth, requireOrgMember, requirePermission('invoices.read'), (req: Request, res: Response) => {
  const inv = findInvoiceById(req.params.id, req.org!.id);
  if (!inv) return res.status(404).json({ error: 'Not found' });
  res.json(inv);
});

router.put('/:id/mark-paid', requireAuth, requireOrgMember, requirePermission('invoices.write'), async (req: Request, res: Response) => {
  try {
    markInvoiceAsPaid(req.params.id, req.org!.id);
    const updated = findInvoiceById(req.params.id, req.org!.id);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to mark invoice as paid' });
  }
});

router.delete('/:id', requireAuth, requireOrgMember, requirePermission('invoices.delete'), async (req: Request, res: Response) => {
  try {
    const deleted = deleteInvoice(req.params.id, req.org!.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete invoice' });
  }
});

export default router;