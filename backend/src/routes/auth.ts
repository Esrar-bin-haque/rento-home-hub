import { Router, Request, Response } from 'express';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { registerUser, loginUser, findUserById, findUserByPhone } from '../services/auth.service.js';
import { listUserOrgs } from '../services/org.service.js';
import { generateAccessToken, generateRefreshToken, saveRefreshToken, deleteRefreshToken, verifyRefreshToken, ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '../utils/jwt.js';
import { requireAuth } from '../middleware/auth.js';
import { ZodError } from 'zod';

const router = Router();

function setCookies(res: Response, accessToken: string, refreshToken: string) {
  const isProduction = process.env.NODE_ENV === 'production';
  const accessOptions = { httpOnly: true, sameSite: 'lax' as const, maxAge: 15 * 60 * 1000, secure: isProduction };
  const refreshOptions = { httpOnly: true, sameSite: 'lax' as const, maxAge: 30 * 24 * 60 * 60 * 1000, secure: isProduction };
  
  res.cookie(ACCESS_TOKEN_COOKIE, accessToken, accessOptions);
  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, refreshOptions);
}

router.post('/register', async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    
    const existing = findUserByPhone(data.phone);
    if (existing) {
      return res.status(409).json({ error: 'Phone already registered' });
    }
    
    const user = await registerUser(data);
    const phone = user.phone || undefined;
    const accessToken = generateAccessToken({ userId: user.id, phone, is_super_admin: !!user.is_super_admin });
    const refreshToken = generateRefreshToken(user.id);
    saveRefreshToken(user.id, refreshToken);
    
    setCookies(res, accessToken, refreshToken);
    
    res.status(201).json({ user: { id: user.id, name: user.name, phone: user.phone } });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: 'Validation error', details: err.errors });
    }
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);
    
    const user = await loginUser(data.phone, data.password as string);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const phone = user.phone || undefined;
    const accessToken = generateAccessToken({ userId: user.id, phone, is_super_admin: !!user.is_super_admin });
    const refreshToken = generateRefreshToken(user.id);
    saveRefreshToken(user.id, refreshToken);
    
    setCookies(res, accessToken, refreshToken);
    
    res.json({ user: { id: user.id, name: user.name, phone: user.phone } });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: 'Validation error', details: err.errors });
    }
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', (req: Request, res: Response) => {
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];
  if (refreshToken) {
    deleteRefreshToken(refreshToken);
  }
  
  res.clearCookie(ACCESS_TOKEN_COOKIE);
  res.clearCookie(REFRESH_TOKEN_COOKIE);
  
  res.json({ message: 'Logged out' });
});

router.get('/me', requireAuth, (req: Request, res: Response) => {
  const user = findUserById(req.user!.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  console.log('/auth/me - userId:', req.user!.userId);
  const orgs = listUserOrgs(req.user!.userId);
  console.log('/auth/me - orgs:', orgs);
  
  res.json({ 
    user: { id: user.id, name: user.name, phone: user.phone, email: user.email }, 
    orgs
  });
});

router.post('/refresh', (req: Request, res: Response) => {
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];
  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token' });
  }
  
  const userId = verifyRefreshToken(refreshToken);
  if (!userId) {
    res.clearCookie(REFRESH_TOKEN_COOKIE);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  
  const user = findUserById(userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  
  deleteRefreshToken(refreshToken);
  
  const phone = user.phone || undefined;
  const accessToken = generateAccessToken({ userId: user.id, phone, is_super_admin: !!user.is_super_admin });
  const newRefreshToken = generateRefreshToken(user.id);
  saveRefreshToken(user.id, newRefreshToken);
  
  setCookies(res, accessToken, newRefreshToken);
  
  res.json({ accessToken });
});

export default router;