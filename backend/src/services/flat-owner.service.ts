import { v4 as uuid } from 'uuid';
import { prepare, run } from '../db/index.js';

export function listFlatOwners(orgId: string) {
  return prepare('SELECT fo.*, u.unit_number FROM flat_owners fo JOIN units u ON fo.unit_id = u.id WHERE fo.org_id = ? ORDER BY fo.created_at DESC').all([orgId]);
}

export function findFlatOwnerById(id: string, orgId: string) {
  return prepare('SELECT fo.*, u.unit_number FROM flat_owners fo JOIN units u ON fo.unit_id = u.id WHERE fo.id = ? AND fo.org_id = ?').all([id, orgId])[0] || null;
}

export function createFlatOwner(orgId: string, data: { unit_id: string; name: string; phone?: string; nid?: string; since?: string }) {
  const unit = prepare('SELECT id FROM units WHERE id = ? AND org_id = ?').all([data.unit_id, orgId]);
  if (!unit.length) {
    throw new Error('Unit not found in this organization');
  }

  const id = uuid();
  run('INSERT INTO flat_owners (id, org_id, unit_id, name, phone, nid, since, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, orgId, data.unit_id, data.name, data.phone || null, data.nid || null, data.since || null, 'active']);
  return findFlatOwnerById(id, orgId);
}

export function updateFlatOwner(id: string, orgId: string, data: Partial<{ name: string; phone: string; nid: string; since: string; status: string }>) {
  const fields: string[] = [];
  const values: any[] = [];
  Object.entries(data).forEach(([k, v]) => { if (v !== undefined) { fields.push(`${k} = ?`); values.push(v); } });
  if (!fields.length) return;
  values.push(id, orgId);
  run(`UPDATE flat_owners SET ${fields.join(', ')} WHERE id = ? AND org_id = ?`, values);
}

export function deleteFlatOwner(id: string, orgId: string) {
  const before = findFlatOwnerById(id, orgId);
  if (!before) return null;
  run('DELETE FROM flat_owners WHERE id = ? AND org_id = ?', [id, orgId]);
  return before;
}
