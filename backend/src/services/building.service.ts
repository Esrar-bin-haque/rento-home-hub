import { v4 as uuid } from 'uuid';
import { prepare, run } from '../db/index.js';

export function createBuilding(orgId: string, data: { name: string; address?: string; total_floors?: number }) {
  const id = uuid();
  run('INSERT INTO buildings (id, org_id, name, address, total_floors) VALUES (?, ?, ?, ?, ?)',
    [id, orgId, data.name, data.address || null, data.total_floors || null]);
  return findBuildingById(id, orgId);
}

export function listBuildings(orgId: string) {
  return prepare('SELECT * FROM buildings WHERE org_id = ? ORDER BY created_at DESC').all([orgId]);
}

export function findBuildingById(id: string, orgId: string) {
  return prepare('SELECT * FROM buildings WHERE id = ? AND org_id = ?').all([id, orgId])[0] || null;
}

export function updateBuilding(id: string, orgId: string, data: Partial<{ name: string; address: string; total_floors: number }>) {
  const fields: string[] = [];
  const values: any[] = [];
  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.address !== undefined) { fields.push('address = ?'); values.push(data.address); }
  if (data.total_floors !== undefined) { fields.push('total_floors = ?'); values.push(data.total_floors); }
  if (!fields.length) return;
  values.push(id, orgId);
  run(`UPDATE buildings SET ${fields.join(', ')} WHERE id = ? AND org_id = ?`, values);
}

export function deleteBuilding(id: string, orgId: string) {
  const before = findBuildingById(id, orgId);
  if (!before) return null;
  run('DELETE FROM buildings WHERE id = ? AND org_id = ?', [id, orgId]);
  return before;
}