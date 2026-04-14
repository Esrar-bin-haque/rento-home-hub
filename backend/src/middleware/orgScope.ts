import { Request, Response, NextFunction } from 'express';
import { prepare } from '../db/index.js';

export function requireOrgMember(req: Request, res: Response, next: NextFunction) {
  const orgId = req.headers['x-org-id'] as string;
  if (!orgId) {
    return res.status(400).json({ error: 'X-Org-Id header required' });
  }
  
  if (req.user?.is_super_admin) {
    req.org = { id: orgId };
    return next();
  }
  
  if (!req.user?.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const membership = prepare(
    'SELECT role_id FROM org_members WHERE user_id = ? AND org_id = ?'
  ).all([req.user.userId, orgId])[0] as { role_id: string } | undefined;
  
  if (!membership) {
    return res.status(403).json({ error: 'Not a member of this organization' });
  }
  
  req.org = { id: orgId };
  req.orgMember = { roleId: membership.role_id };
  next();
}