import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { requireOrgMember } from '../middleware/orgScope.js';
import { requirePermission } from '../middleware/rbac.js';
import { createUnit, listUnits, findUnitById, updateUnit, deleteUnit } from '../services/unit.service.js';

const createUnitSchema = z.object({
  unit_number: z.string().min(1, 'Unit number required'),
  building_id: z.string().min(1, 'Building ID required'),
  floor: z.union([z.number().int().nonnegative().max(200), z.string()]).optional(),
  size_sqft: z.union([z.number().nonnegative(), z.string()]).optional(),
  bedrooms: z.union([z.number().int().nonnegative().max(20), z.string()]).optional(),
  bathrooms: z.union([z.number().int().nonnegative().max(20), z.string()]).optional(),
  rent_amount: z.union([z.number().nonnegative(), z.string()]).optional(),
  status: z.enum(['vacant', 'occupied', 'maintenance']).optional()
}).transform((data) => ({
  ...data,
  floor: data.floor ? (typeof data.floor === 'string' ? data.floor : String(data.floor)) : undefined,
  size_sqft: data.size_sqft ? (typeof data.size_sqft === 'string' ? parseInt(data.size_sqft, 10) : data.size_sqft) : undefined,
  bedrooms: data.bedrooms ? (typeof data.bedrooms === 'string' ? parseInt(data.bedrooms, 10) : data.bedrooms) : undefined,
  bathrooms: data.bathrooms ? (typeof data.bathrooms === 'string' ? parseInt(data.bathrooms, 10) : data.bathrooms) : undefined,
  rent_amount: data.rent_amount ? (typeof data.rent_amount === 'string' ? parseInt(data.rent_amount, 10) : data.rent_amount) : undefined,
}));

const router = Router();

router.get('/', requireAuth, requireOrgMember, requirePermission('units.read'), (req: Request, res: Response) => {
  const orgId = req.org!.id;
  const buildingId = req.query.building_id as string;
  console.log(`GET /units - orgId: ${orgId}, buildingId: ${buildingId || 'none'}`);
  const units = listUnits(orgId, buildingId);
  console.log(`GET /units - found ${units.length} units`);
  res.json({ data: units });
});

router.post('/', requireAuth, requireOrgMember, requirePermission('units.write'), async (req: Request, res: Response) => {
  try {
    const data = createUnitSchema.parse(req.body);
    console.log(`POST /units - creating unit: ${data.unit_number} for org: ${req.org!.id}, building: ${data.building_id}`);
    const unit = createUnit(req.org!.id, data);
    console.log(`POST /units - created unit with id: ${unit?.id}, org_id: ${unit?.org_id}`);
    res.status(201).json(unit);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
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