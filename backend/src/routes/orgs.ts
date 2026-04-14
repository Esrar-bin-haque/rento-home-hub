import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireOrgMember } from '../middleware/orgScope.js';
import { requirePermission } from '../middleware/rbac.js';
import { createOrg, listUserOrgs, findOrgById } from '../services/org.service.js';
import { seedDefaultRoles } from '../db/seed.js';

const router = Router();

router.post('/', requireAuth, async (req: Request, res: Response) => {
  const { name, slug } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  
  const org = createOrg(name, slug || name.toLowerCase().replace(/\s+/g, '-'), req.user!.userId);
  res.status(201).json(org);
});

router.get('/mine', requireAuth, (req: Request, res: Response) => {
  const orgs = listUserOrgs(req.user!.userId);
  res.json(orgs);
});

router.get('/:id', requireAuth, requireOrgMember, requirePermission('orgs.read'), (req: Request, res: Response) => {
  const org = findOrgById(req.params.id);
  if (!org) return res.status(404).json({ error: 'Org not found' });
  res.json(org);
});

export default router;