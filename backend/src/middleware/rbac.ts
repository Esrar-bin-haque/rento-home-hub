import { Request, Response, NextFunction } from 'express';
import { hasPermission } from '../services/rbac.service.js';

export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!req.org) {
      return res.status(400).json({ error: 'Organization not selected' });
    }
    if (req.user.is_super_admin || hasPermission(req.user.userId, req.org.id, permission)) {
      next();
    } else {
      res.status(403).json({ error: 'Insufficient permissions' });
    }
  };
}