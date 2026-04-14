import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireOrgMember } from '../middleware/orgScope.js';
import { getDashboardData } from '../services/dashboard.service.js';

const router = Router();

router.get('/', requireAuth, requireOrgMember, (req, res) => {
  res.json(getDashboardData(req.org!.id));
});

export default router;