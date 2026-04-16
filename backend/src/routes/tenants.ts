import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireOrgMember } from '../middleware/orgScope.js';
import { requirePermission } from '../middleware/rbac.js';
import { createTenant, listTenants, findTenantById, updateTenant, deactivateTenant } from '../services/tenant.service.js';

const router = Router();

router.get('/', requireAuth, requireOrgMember, requirePermission('tenants.read'), (req: Request, res: Response) => {
  res.json(listTenants(req.org!.id));
});

router.post('/', requireAuth, requireOrgMember, requirePermission('tenants.write'), async (req: Request, res: Response) => {
  try {
    const tenant = createTenant(req.org!.id, req.body);
    res.status(201).json(tenant);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create tenant' });
  }
});

router.get('/:id', requireAuth, requireOrgMember, requirePermission('tenants.read'), (req: Request, res: Response) => {
  const t = findTenantById(req.params.id, req.org!.id);
  if (!t) return res.status(404).json({ error: 'Not found' });
  res.json(t);
});

router.put('/:id', requireAuth, requireOrgMember, requirePermission('tenants.write'), async (req: Request, res: Response) => {
  try {
    updateTenant(req.params.id, req.org!.id, req.body);
    const updated = findTenantById(req.params.id, req.org!.id);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update tenant' });
  }
});

router.delete('/:id', requireAuth, requireOrgMember, requirePermission('tenants.delete'), async (req: Request, res: Response) => {
  try {
    const deleted = deactivateTenant(req.params.id, req.org!.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete tenant' });
  }
});

export default router;