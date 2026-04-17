import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { ACCESS_TOKEN_COOKIE } from '../utils/jwt.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email?: string;
        phone?: string;
        is_super_admin: boolean;
      };
      org?: {
        id: string;
      };
      orgMember?: {
        roleId: string;
      };
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies[ACCESS_TOKEN_COOKIE];
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const payload = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] }) as any;
    req.user = {
      userId: payload.sub,
      email: payload.email,
      phone: payload.phone,
      is_super_admin: payload.is_super_admin,
    };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies[ACCESS_TOKEN_COOKIE];
  if (!token) {
    req.user = undefined;
    return next();
  }
  
  try {
    const payload = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] }) as any;
    req.user = {
      userId: payload.sub,
      email: payload.email,
      phone: payload.phone,
      is_super_admin: payload.is_super_admin,
    };
  } catch {
    req.user = undefined;
  }
  next();
}