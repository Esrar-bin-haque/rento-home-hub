import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { requireOrgMember } from '../middleware/orgScope.js';
import { requirePermission } from '../middleware/rbac.js';
import { createFlatOwner, listFlatOwners, findFlatOwnerById, updateFlatOwner, deleteFlatOwner } from '../services/flat-owner.service.js';

const createFlatOwnerSchema = z.object({
  name: z.string().min(1, 'Name required'),
  phone: z.string().optional(),
  nid: z.string().optional(),
  unit_id: z.string().min(1, 'Unit ID required'),
  since: z.string().optional()
});

const router = Router();

router.get('/', requireAuth, requireOrgMember, requirePermission('flat_owners.read'), (req: Request, res: Response) => {
  res.json({ data: listFlatOwners(req.org!.id) });
});

router.post('/', requireAuth, requireOrgMember, requirePermission('flat_owners.write'), async (req: Request, res: Response) => {
  try {
    const data = createFlatOwnerSchema.parse(req.body);
    const owner = createFlatOwner(req.org!.id, data);
    res.status(201).json(owner);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    res.status(500).json({ error: err.message || 'Failed to create flat owner' });
  }
});

router.get('/:id', requireAuth, requireOrgMember, requirePermission('flat_owners.read'), (req: Request, res: Response) => {
  const o = findFlatOwnerById(req.params.id, req.org!.id);
  if (!o) return res.status(404).json({ error: 'Not found' });
  res.json(o);
});

router.put('/:id', requireAuth, requireOrgMember, requirePermission('flat_owners.write'), async (req: Request, res: Response) => {
  try {
    updateFlatOwner(req.params.id, req.org!.id, req.body);
    const updated = findFlatOwnerById(req.params.id, req.org!.id);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update flat owner' });
  }
});

router.delete('/:id', requireAuth, requireOrgMember, requirePermission('flat_owners.delete'), async (req: Request, res: Response) => {
  try {
    const deleted = deleteFlatOwner(req.params.id, req.org!.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete flat owner' });
  }
});

export default router;
