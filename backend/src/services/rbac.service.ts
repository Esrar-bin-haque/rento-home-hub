import { prepare } from '../db/index.js';

export function getUserPermissionsInOrg(userId: string, orgId: string): string[] {
  const sql = `
    SELECT rp.permission 
    FROM org_members om
    JOIN roles r ON om.role_id = r.id
    JOIN role_permissions rp ON r.id = rp.role_id
    WHERE om.user_id = ? AND om.org_id = ?
  `;
  const perms = prepare(sql).all([userId, orgId]) as { permission: string }[];
  return perms.map(p => p.permission);
}

export function hasPermission(userId: string, orgId: string, permission: string): boolean {
  const sql = `
    SELECT r.is_system, rp.permission
    FROM org_members om
    JOIN roles r ON om.role_id = r.id
    LEFT JOIN role_permissions rp ON r.id = rp.role_id
    WHERE om.user_id = ? AND om.org_id = ?
  `;
  const results = prepare(sql).all([userId, orgId]) as any[];
  
  for (const row of results) {
    if (row.is_system) return true;
    if (row.permission === '*') return true;
    if (row.permission === permission) return true;
  }
  return false;
}

export function getUserRoleInOrg(userId: string, orgId: string): any {
  const sql = `
    SELECT r.*, om.id as member_id
    FROM org_members om
    JOIN roles r ON om.role_id = r.id
    WHERE om.user_id = ? AND om.org_id = ?
  `;
  return prepare(sql).all([userId, orgId])[0] || null;
}