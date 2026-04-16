import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireOrgMember } from '../middleware/orgScope.js';
import { requirePermission } from '../middleware/rbac.js';
import { createPayment, listPayments, findPaymentById, updatePayment, deletePayment } from '../services/payment.service.js';

const router = Router();

router.get('/', requireAuth, requireOrgMember, requirePermission('payments.read'), (req: Request, res: Response) => {
  res.json(listPayments(req.org!.id));
});

router.post('/', requireAuth, requireOrgMember, requirePermission('payments.write'), async (req: Request, res: Response) => {
  try {
    const payment = createPayment(req.org!.id, { ...req.body, recorded_by: req.user!.userId });
    res.status(201).json(payment);
  } catch (err: any) {
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