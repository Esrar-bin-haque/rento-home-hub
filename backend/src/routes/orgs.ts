import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { requireOrgMember } from '../middleware/orgScope.js';
import { requirePermission } from '../middleware/rbac.js';
import { createOrg, listUserOrgs, findOrgById } from '../services/org.service.js';
import { listOrgMembers, addOrgMember, updateMemberRole, removeMember } from '../services/org-member.service.js';

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

router.get('/:id/members', requireAuth, requireOrgMember, requirePermission('members.read'), (req: Request, res: Response) => {
  const members = listOrgMembers(req.params.id);
  res.json({ data: members });
});

const inviteMemberSchema = z.object({
  user_id: z.string().min(1, 'User ID required'),
  role_id: z.string().min(1, 'Role ID required'),
});

router.post('/:id/invite', requireAuth, requireOrgMember, requirePermission('members.write'), async (req: Request, res: Response) => {
  try {
    const data = inviteMemberSchema.parse(req.body);
    const member = addOrgMember(req.params.id, { ...data, invited_by: req.user!.userId });
    res.status(201).json(member);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    res.status(500).json({ error: err.message || 'Failed to add member' });
  }
});

router.put('/:id/members/:userId', requireAuth, requireOrgMember, requirePermission('members.write'), async (req: Request, res: Response) => {
  try {
    const { role_id } = req.body;
    if (!role_id) return res.status(400).json({ error: 'role_id required' });
    const member = updateMemberRole(req.params.id, req.params.userId, role_id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update member' });
  }
});

router.delete('/:id/members/:userId', requireAuth, requireOrgMember, requirePermission('members.delete'), async (req: Request, res: Response) => {
  try {
    const member = removeMember(req.params.id, req.params.userId);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json({ message: 'Member removed' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to remove member' });
  }
});

export default router;
