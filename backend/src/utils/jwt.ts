import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config/env.js';
import { prepare, run } from '../db/index.js';

export interface JwtPayload {
  userId: string;
  email?: string;
  phone?: string;
  is_super_admin: boolean;
}

export function generateAccessToken(user: JwtPayload): string {
  return jwt.sign(
    { sub: user.userId, email: user.email, phone: user.phone, is_super_admin: user.is_super_admin },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn || '15m', algorithm: 'HS256' } as any
  );
}

export function generateRefreshToken(userId: string): string {
  return crypto.randomBytes(64).toString('hex');
}

export function saveRefreshToken(userId: string, token: string): void {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const id = crypto.randomUUID();
  run('INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)',
    [id, userId, tokenHash, expiresAt.toISOString()]);
}

export function verifyRefreshToken(token: string): string | null {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const tokens = prepare('SELECT * FROM refresh_tokens WHERE token_hash = ?').all([tokenHash]) as any[];
  if (!tokens.length) return null;

  if (new Date(tokens[0].expires_at) < new Date()) {
    return null;
  }
  return tokens[0].user_id;
}

export function deleteRefreshToken(token: string): void {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  run('DELETE FROM refresh_tokens WHERE token_hash = ?', [tokenHash]);
}

export const ACCESS_TOKEN_COOKIE = 'rento_access_token';
export const REFRESH_TOKEN_COOKIE = 'rento_refresh_token';