import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { requireOrgMember } from '../middleware/orgScope.js';
import { requirePermission } from '../middleware/rbac.js';
import { createPayment, listPayments, findPaymentById, updatePayment, deletePayment } from '../services/payment.service.js';

const createPaymentSchema = z.object({
  amount: z.number().nonnegative('Amount must be positive'),
  date: z.string().optional(),
  payment_method: z.enum(['cash', 'bank_transfer', 'mobile_money', 'check']).optional(),
  unit_id: z.string().min(1, 'Unit ID required'),
  tenant_id: z.string().min(1, 'Tenant ID required'),
  payment_type: z.enum(['rent', 'deposit', 'utility', 'other']).optional()
});

const router = Router();

router.get('/', requireAuth, requireOrgMember, requirePermission('payments.read'), (req: Request, res: Response) => {
  res.json({ data: listPayments(req.org!.id) });
});

router.post('/', requireAuth, requireOrgMember, requirePermission('payments.write'), async (req: Request, res: Response) => {
  try {
    const data = createPaymentSchema.parse(req.body);
    const payment = createPayment(req.org!.id, { ...data, recorded_by: req.user!.userId });
    res.status(201).json(payment);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    res.status(500).json({ error: err.message || 'Failed to create payment' });
  }
});

router.get('/:id', requireAuth, requireOrgMember, requirePermission('payments.read'), (req: Request, res: Response) => {
  const p = findPaymentById(req.params.id, req.org!.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

router.put('/:id', requireAuth, requireOrgMember, requirePermission('payments.write'), async (req: Request, res: Response) => {
  try {
    updatePayment(req.params.id, req.org!.id, req.body);
    const updated = findPaymentById(req.params.id, req.org!.id);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update payment' });
  }
});

router.delete('/:id', requireAuth, requireOrgMember, requirePermission('payments.delete'), async (req: Request, res: Response) => {
  try {
    const deleted = deletePayment(req.params.id, req.org!.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete payment' });
  }
});

export default router;