import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';
import { prepare, run } from '../db/index.js';

export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  name: string;
  password_hash: string | null;
  google_id: string | null;
  is_super_admin: number;
  is_verified: number;
  created_at: string;
  updated_at: string;
}

export async function registerUser(data: { name: string; phone: string; password: string }): Promise<User> {
  const id = uuid();
  const password_hash = await bcrypt.hash(data.password, 12);

  try {
    run(
      'INSERT INTO users (id, name, phone, password_hash) VALUES (?, ?, ?, ?)',
      [id, data.name, data.phone, password_hash]
    );
  } catch (err: any) {
    // Handle unique constraint violation (race condition)
    if (err.message?.includes('UNIQUE constraint failed') || err.code === 'SQLITE_CONSTRAINT') {
      throw new Error('PHONE_EXISTS');
    }
    throw err;
  }

  return findUserById(id)!;
}

export async function loginUser(phone: string, password: string): Promise<User | null> {
  const users = prepare('SELECT * FROM users WHERE phone = ?').all([phone]) as unknown as User[];
  if (!users.length) return null;

  const user = users[0];
  if (!user.password_hash) return null;

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return null;

  return user;
}

export function findUserById(id: string): User | null {
  const users = prepare('SELECT * FROM users WHERE id = ?').all([id]) as unknown as User[];
  return users[0] || null;
}

export function findUserByPhone(phone: string): User | null {
  const users = prepare('SELECT * FROM users WHERE phone = ?').all([phone]) as unknown as User[];
  return users[0] || null;
}

export function findUserByEmail(email: string): User | null {
  const users = prepare('SELECT * FROM users WHERE email = ?').all([email]) as unknown as User[];
  return users[0] || null;
}

export function findUserByGoogleId(googleId: string): User | null {
  const users = prepare('SELECT * FROM users WHERE google_id = ?').all([googleId]) as unknown as User[];
  return users[0] || null;
}

export async function upsertGoogleUser(data: { name: string; email: string; googleId: string }): Promise<User> {
  let user = findUserByGoogleId(data.googleId);
  
  if (user) {
    return user;
  }
  
  const existingEmail = findUserByEmail(data.email);
  if (existingEmail) {
    return existingEmail;
  }
  
  const id = uuid();
  run(
    'INSERT INTO users (id, name, email, google_id, is_verified) VALUES (?, ?, ?, ?, 1)',
    [id, data.name, data.email, data.googleId]
  );
  
  return findUserById(id)!;
}