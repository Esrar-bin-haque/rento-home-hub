import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { listAllOrgs, listAllUsers, getPlatformStats, getUserById } from '../services/admin.service.js';

const router = Router();

function requireSuperAdmin(req: Request, res: Response, next: Function) {
  if (!req.user?.is_super_admin) {
    return res.status(403).json({ error: 'Super admin only' });
  }
  next();
}

router.get('/orgs', requireAuth, requireSuperAdmin, (req, res) => res.json(listAllOrgs()));
router.get('/users', requireAuth, requireSuperAdmin, (req, res) => res.json(listAllUsers()));
router.get('/users/:id', requireAuth, requireSuperAdmin, (req, res) => {
  const user = getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});
router.get('/stats', requireAuth, requireSuperAdmin, (req, res) => res.json(getPlatformStats()));

export default router;