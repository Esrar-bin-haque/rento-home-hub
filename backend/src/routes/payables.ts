import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireOrgMember } from '../middleware/orgScope.js';
import { requirePermission } from '../middleware/rbac.js';
import { createPayable, listPayables, findPayableById, updatePayable, deletePayable } from '../services/payable.service.js';

const router = Router();
router.get('/', requireAuth, requireOrgMember, requirePermission('payables.read'), (req, res) => res.json(listPayables(req.org!.id)));
router.post('/', requireAuth, requireOrgMember, requirePermission('payables.write'), (req, res) => res.status(201).json(createPayable(req.org!.id, req.body)));
router.get('/:id', requireAuth, requireOrgMember, requirePermission('payables.read'), (req, res) => {
  const p = findPayableById(req.params.id, req.org!.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});
router.put('/:id', requireAuth, requireOrgMember, requirePermission('payables.write'), (req, res) => { updatePayable(req.params.id, req.org!.id, req.body); res.json({ ok: true }); });
router.delete('/:id', requireAuth, requireOrgMember, requirePermission('payables.delete'), (req, res) => { deletePayable(req.params.id, req.org!.id); res.json({ ok: true }); });
export default router;