import { v4 as uuid } from 'uuid';
import { prepare, run } from '../db/index.js';

export function listOrgMembers(orgId: string) {
  return prepare(
    `SELECT om.id, om.org_id, om.user_id, om.role_id, om.joined_at,
            u.name as user_name, u.phone as user_phone, u.email as user_email,
            r.name as role_name
     FROM org_members om
     JOIN users u ON om.user_id = u.id
     JOIN roles r ON om.role_id = r.id
     WHERE om.org_id = ?
     ORDER BY om.joined_at ASC`
  ).all([orgId]);
}

export function addOrgMember(orgId: string, data: { user_id: string; role_id: string; invited_by?: string }) {
  const existing = prepare('SELECT id FROM org_members WHERE org_id = ? AND user_id = ?').all([orgId, data.user_id]);
  if (existing.length) {
    throw new Error('User is already a member of this organization');
  }

  const id = uuid();
  run('INSERT INTO org_members (id, org_id, user_id, role_id, invited_by) VALUES (?, ?, ?, ?, ?)',
    [id, orgId, data.user_id, data.role_id, data.invited_by || null]);
  return prepare(
    `SELECT om.id, om.org_id, om.user_id, om.role_id, om.joined_at,
            u.name as user_name, u.phone as user_phone, u.email as user_email,
            r.name as role_name
     FROM org_members om
     JOIN users u ON om.user_id = u.id
     JOIN roles r ON om.role_id = r.id
     WHERE om.id = ?`
  ).all([id])[0] || null;
}

export function updateMemberRole(orgId: string, userId: string, roleId: string) {
  run('UPDATE org_members SET role_id = ? WHERE org_id = ? AND user_id = ?', [roleId, orgId, userId]);
  return prepare(
    `SELECT om.id, om.org_id, om.user_id, om.role_id, om.joined_at,
            u.name as user_name, u.phone as user_phone, u.email as user_email,
            r.name as role_name
     FROM org_members om
     JOIN users u ON om.user_id = u.id
     JOIN roles r ON om.role_id = r.id
     WHERE om.org_id = ? AND om.user_id = ?`
  ).all([orgId, userId])[0] || null;
}

export function removeMember(orgId: string, userId: string) {
  const member = prepare('SELECT * FROM org_members WHERE org_id = ? AND user_id = ?').all([orgId, userId])[0];
  if (!member) return null;
  run('DELETE FROM org_members WHERE org_id = ? AND user_id = ?', [orgId, userId]);
  return member;
}
