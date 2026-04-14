import { v4 as uuid } from 'uuid';
import { prepare, run } from '../db/index.js';

export function createOrg(name: string, slug: string, ownerUserId: string) {
  const id = uuid();
  run('INSERT INTO organizations (id, name, slug, owner_id) VALUES (?, ?, ?, ?)', [id, name, slug, ownerUserId]);
  
  // Look up property_manager role by is_system=1 and org_id IS NULL (more stable than name-only)
  const role = prepare("SELECT id FROM roles WHERE name = ? AND org_id IS NULL AND is_system = 1").all(['property_manager'])[0] as { id: string } | undefined;
  
  if (role) {
    run('INSERT INTO org_members (id, org_id, user_id, role_id) VALUES (?, ?, ?, ?)', [uuid(), id, ownerUserId, role.id]);
  }
  
  return findOrgById(id);
}

export function findOrgById(orgId: string) {
  return prepare('SELECT * FROM organizations WHERE id = ?').all([orgId])[0] || null;
}

export function listUserOrgs(userId: string) {
  const sql = `
    SELECT o.* FROM organizations o
    JOIN org_members om ON o.id = om.org_id
    WHERE om.user_id = ?
  `;
  return prepare(sql).all([userId]);
}