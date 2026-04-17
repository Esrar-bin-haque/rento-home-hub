import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { requireOrgMember } from '../middleware/orgScope.js';
import { requirePermission } from '../middleware/rbac.js';
import { createBuilding, listBuildings, findBuildingById, updateBuilding, deleteBuilding } from '../services/building.service.js';

const createBuildingSchema = z.object({
  name: z.string().min(1, 'Name required'),
  address: z.string().optional(),
  total_floors: z.number().int().positive().max(200).optional()
});

const router = Router();

router.get('/', requireAuth, requireOrgMember, requirePermission('buildings.read'), (req: Request, res: Response) => {
  res.json({ data: listBuildings(req.org!.id) });
});

router.post('/', requireAuth, requireOrgMember, requirePermission('buildings.write'), async (req: Request, res: Response) => {
  try {
    const data = createBuildingSchema.parse(req.body);
    const building = createBuilding(req.org!.id, data);
    res.status(201).json(building);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    res.status(500).json({ error: err.message || 'Failed to create building' });
  }
});

router.get('/:id', requireAuth, requireOrgMember, requirePermission('buildings.read'), (req: Request, res: Response) => {
  const b = findBuildingById(req.params.id, req.org!.id);
  if (!b) return res.status(404).json({ error: 'Not found' });
  res.json(b);
});

router.put('/:id', requireAuth, requireOrgMember, requirePermission('buildings.write'), async (req: Request, res: Response) => {
  try {
    updateBuilding(req.params.id, req.org!.id, req.body);
    const updated = findBuildingById(req.params.id, req.org!.id);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update building' });
  }
});

router.delete('/:id', requireAuth, requireOrgMember, requirePermission('buildings.delete'), async (req: Request, res: Response) => {
  try {
    const deleted = deleteBuilding(req.params.id, req.org!.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete building' });
  }
});

export default router;