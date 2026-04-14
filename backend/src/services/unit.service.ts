import { v4 as uuid } from 'uuid';
import { prepare, run } from '../db/index.js';

export function createUnit(orgId: string, data: { building_id: string; unit_number: string; floor?: string; size_sqft?: number; rent_amount?: number; service_charge?: number }) {
  // Validate building belongs to org
  const building = prepare('SELECT id FROM buildings WHERE id = ? AND org_id = ?').all([data.building_id, orgId]);
  if (!building.length) {
    throw new Error('Building not found in this organization');
  }
  
  const id = uuid();
  run('INSERT INTO units (id, building_id, org_id, unit_number, floor, size_sqft, rent_amount, service_charge, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, data.building_id, orgId, data.unit_number, data.floor || null, data.size_sqft || null, data.rent_amount || null, data.service_charge || null, 'vacant']);
  return findUnitById(id, orgId);
}

export function listUnits(orgId: string, buildingId?: string) {
  if (buildingId) {
    return prepare('SELECT * FROM units WHERE org_id = ? AND building_id = ? ORDER BY unit_number').all([orgId, buildingId]);
  }
  return prepare('SELECT * FROM units WHERE org_id = ? ORDER BY unit_number').all([orgId]);
}

export function findUnitById(id: string, orgId: string) {
  return prepare('SELECT * FROM units WHERE id = ? AND org_id = ?').all([id, orgId])[0] || null;
}

export function updateUnit(id: string, orgId: string, data: Partial<{ unit_number: string; floor: string; size_sqft: number; rent_amount: number; service_charge: number; status: string }>) {
  const fields: string[] = [];
  const values: any[] = [];
  Object.entries(data).forEach(([k, v]) => { if (v !== undefined) { fields.push(`${k} = ?`); values.push(v); } });
  if (!fields.length) return;
  values.push(id, orgId);
  run(`UPDATE units SET ${fields.join(', ')} WHERE id = ? AND org_id = ?`, values);
}

export function deleteUnit(id: string, orgId: string) {
  const before = findUnitById(id, orgId);
  if (!before) return null;
  run('DELETE FROM units WHERE id = ? AND org_id = ?', [id, orgId]);
  return before;
}