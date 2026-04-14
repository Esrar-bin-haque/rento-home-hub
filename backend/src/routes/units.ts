import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireOrgMember } from '../middleware/orgScope.js';
import { requirePermission } from '../middleware/rbac.js';
import { createUnit, listUnits, findUnitById, updateUnit, deleteUnit } from '../services/unit.service.js';

const router = Router();

router.get('/', requireAuth, requireOrgMember, requirePermission('units.read'), (req: Request, res: Response) => {
  res.json(listUnits(req.org!.id, req.query.building_id as string));
});

router.post('/', requireAuth, requireOrgMember, requirePermission('units.write'), async (req: Request, res: Response) => {
  try {
    const unit = createUnit(req.org!.id, req.body);
    res.status(201).json(unit);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create unit' });
  }
});

router.get('/:id', requireAuth, requireOrgMember, requirePermission('units.read'), (req: Request, res: Response) => {
  const u = findUnitById(req.params.id, req.org!.id);
  if (!u) return res.status(404).json({ error: 'Not found' });
  res.json(u);
});

router.put('/:id', requireAuth, requireOrgMember, requirePermission('units.write'), async (req: Request, res: Response) => {
  try {
    updateUnit(req.params.id, req.org!.id, req.body);
    const updated = findUnitById(req.params.id, req.org!.id);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update unit' });
  }
});

router.delete('/:id', requireAuth, requireOrgMember, requirePermission('units.delete'), async (req: Request, res: Response) => {
  try {
    const deleted = deleteUnit(req.params.id, req.org!.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete unit' });
  }
});

export default router;