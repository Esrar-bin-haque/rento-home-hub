import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { requireOrgMember } from '../middleware/orgScope.js';
import { requirePermission } from '../middleware/rbac.js';
import { createPayable, listPayables, findPayableById, updatePayable, deletePayable } from '../services/payable.service.js';

const createPayableSchema = z.object({
  vendor_id: z.string().min(1, 'Vendor ID required'),
  building_id: z.string().optional(),
  description: z.string().optional(),
  amount: z.number().nonnegative('Amount must be positive'),
  due_date: z.string().optional()
});

const router = Router();

router.get('/', requireAuth, requireOrgMember, requirePermission('payables.read'), (req, res) => {
  try {
    res.json({ data: listPayables(req.org!.id) });
  } catch (e) {
    res.status(500).json({ error: 'Internal error' });
  }
});
router.post('/', requireAuth, requireOrgMember, requirePermission('payables.write'), (req: Request, res: Response) => {
  try {
    const data = createPayableSchema.parse(req.body);
    res.status(201).json(createPayable(req.org!.id, data));
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    res.status(400).json({ error: err.message || 'Invalid data' });
  }
});
router.get('/:id', requireAuth, requireOrgMember, requirePermission('payables.read'), (req, res) => {
  try {
    const p = findPayableById(req.params.id, req.org!.id);
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json(p);
  } catch (e) {
    res.status(500).json({ error: 'Internal error' });
  }
});
router.put('/:id', requireAuth, requireOrgMember, requirePermission('payables.write'), (req, res) => {
  try {
    updatePayable(req.params.id, req.org!.id, req.body);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Internal error' });
  }
});
router.delete('/:id', requireAuth, requireOrgMember, requirePermission('payables.delete'), (req, res) => {
  try {
    deletePayable(req.params.id, req.org!.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Internal error' });
  }
});
export default router;