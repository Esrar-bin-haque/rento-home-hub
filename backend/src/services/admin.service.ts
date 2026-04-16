import { prepare } from '../db/index.js';

export function listAllOrgs() {
  return prepare('SELECT * FROM organizations ORDER BY created_at DESC').all();
}

export function listAllUsers() {
  return prepare('SELECT id, name, phone, email, is_super_admin, created_at FROM users ORDER BY created_at DESC').all();
}

export function getPlatformStats() {
  const orgs = prepare('SELECT COUNT(*) as c FROM organizations').all()[0] as any;
  const users = prepare('SELECT COUNT(*) as c FROM users').all()[0] as any;
  const payments = prepare('SELECT COUNT(*) as c FROM payments').all()[0] as any;
  return { totalOrgs: orgs.c, totalUsers: users.c, totalPayments: payments.c };
}

export function getUserById(userId: string) {
  return prepare('SELECT id, name, phone, email, is_super_admin FROM users WHERE id = ?').all([userId])[0] || null;
}