import { v4 as uuid } from 'uuid';
import { prepare, run, transaction } from '../db/index.js';

export function createTenant(orgId: string, data: { unit_id: string; name: string; phone?: string; nid?: string; advance_amount?: number }) {
  // Validate unit belongs to org
  const unit = prepare('SELECT id FROM units WHERE id = ? AND org_id = ?').all([data.unit_id, orgId]);
  if (!unit.length) {
    throw new Error('Unit not found in this organization');
  }
  
  const id = uuid();
  transaction(() => {
    run('INSERT INTO tenants (id, org_id, unit_id, name, phone, nid, advance_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, orgId, data.unit_id, data.name, data.phone || null, data.nid || null, data.advance_amount || null, 'active']);
    run('UPDATE units SET status = ? WHERE id = ?', ['occupied', data.unit_id]);
  });
  return findTenantById(id, orgId);
}

export function listTenants(orgId: string) {
  return prepare('SELECT t.*, u.unit_number FROM tenants t JOIN units u ON t.unit_id = u.id WHERE t.org_id = ? ORDER BY t.created_at DESC').all([orgId]);
}

export function findTenantById(id: string, orgId: string) {
  return prepare('SELECT t.*, u.unit_number FROM tenants t JOIN units u ON t.unit_id = u.id WHERE t.id = ? AND t.org_id = ?').all([id, orgId])[0] || null;
}

export function updateTenant(id: string, orgId: string, data: Partial<{ name: string; phone: string; nid: string; advance_amount: number; status: string }>) {
  const fields: string[] = [];
  const values: any[] = [];
  Object.entries(data).forEach(([k, v]) => { if (v !== undefined) { fields.push(`${k} = ?`); values.push(v); } });
  if (!fields.length) return;
  values.push(id, orgId);
  run(`UPDATE tenants SET ${fields.join(', ')} WHERE id = ? AND org_id = ?`, values);
}

export function deactivateTenant(id: string, orgId: string) {
  const tenant = findTenantById(id, orgId);
  if (!tenant) return null;
  
  // Check if other active tenants exist for this unit
  const otherTenants = prepare(
    'SELECT COUNT(*) as c FROM tenants WHERE unit_id = ? AND status = ? AND id != ?'
  ).all([tenant.unit_id, 'active', id]) as any[];
  
  const othersActive = otherTenants[0]?.c > 0;
  
  run('UPDATE tenants SET status = ? WHERE id = ?', ['inactive', id]);
  
  // Only set unit to vacant if no other active tenants
  if (!othersActive) {
    run('UPDATE units SET status = ? WHERE id = ?', ['vacant', tenant.unit_id]);
  }
  
  return tenant;
}