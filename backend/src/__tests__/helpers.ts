import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';
import { getDb, run, prepare } from '../db/index.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export interface TestUser {
  id: string;
  name: string;
  phone: string;
  password: string;
  is_super_admin: number;
  token: string;
}

export interface TestOrg {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
}

export function createTestUser(data?: Partial<TestUser>): TestUser {
  const db = getDb();
  const id = uuid();
  const name = data?.name || 'Test User';
  const phone = data?.phone || '+8801' + Math.floor(100000000 + Math.random() * 900000000);
  const password = data?.password || 'testpass123';
  const is_super_admin = data?.is_super_admin || 0;

  const password_hash = bcrypt.hashSync(password, 12);
  
  db.run('INSERT INTO users (id, name, phone, password_hash, is_super_admin) VALUES (?, ?, ?, ?, ?)',
    [id, name, phone, password_hash, is_super_admin]);

  const token = jwt.sign({ sub: id, phone, is_super_admin: !!is_super_admin }, config.jwtSecret, { expiresIn: '1h' });

  return { id, name, phone, password, is_super_admin, token };
}

export function createTestOrg(ownerId: string, name?: string): TestOrg {
  const db = getDb();
  const id = uuid();
  const orgName = name || 'Test Org';
  const slug = orgName.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).slice(2);

  db.run('INSERT INTO organizations (id, name, slug, owner_id) VALUES (?, ?, ?, ?)',
    [id, orgName, slug, ownerId]);

  return { id, name: orgName, slug, ownerId };
}

export function addUserToOrg(userId: string, orgId: string, roleName: string = 'property_manager') {
  const db = getDb();
  
  let role = prepare('SELECT id FROM roles WHERE name = ? AND (org_id = ? OR org_id IS NULL)').all([roleName, orgId])[0] as { id: string } | undefined;
  
  if (!role) {
    const roleId = uuid();
    db.run('INSERT INTO roles (id, org_id, name, is_system) VALUES (?, ?, ?, ?)', [roleId, orgId, roleName, 0]);
    role = { id: roleId };
  }

  db.run('INSERT INTO org_members (id, org_id, user_id, role_id) VALUES (?, ?, ?, ?)',
    [uuid(), orgId, userId, role.id]);
}

export function addPermissionToRole(roleId: string, permission: string) {
  const db = getDb();
  db.run('INSERT INTO role_permissions (id, role_id, permission) VALUES (?, ?, ?)',
    [uuid(), roleId, permission]);
}

export function createTestBuilding(orgId: string, name?: string) {
  const db = getDb();
  const id = uuid();
  const buildingName = name || 'Test Building';

  db.run('INSERT INTO buildings (id, org_id, name) VALUES (?, ?, ?)', [id, orgId, buildingName]);

  return { id, org_id: orgId, name: buildingName } as any;
}

export function createTestUnit(orgId: string, buildingId: string, unitNumber?: string) {
  const db = getDb();
  const id = uuid();
  const unitNum = unitNumber || '101';

  db.run('INSERT INTO units (id, building_id, org_id, unit_number, status) VALUES (?, ?, ?, ?, ?)',
    [id, buildingId, orgId, unitNum, 'vacant']);

  return { id, building_id: buildingId, org_id: orgId, unit_number: unitNum, status: 'vacant' } as any;
}

export function createTestTenant(orgId: string, unitId: string, name?: string) {
  const db = getDb();
  const id = uuid();
  const tenantName = name || 'Test Tenant';

  db.run('INSERT INTO tenants (id, org_id, unit_id, name, status) VALUES (?, ?, ?, ?, ?)',
    [id, orgId, unitId, tenantName, 'active']);

  db.run('UPDATE units SET status = ? WHERE id = ?', ['occupied', unitId]);

  return { id, org_id: orgId, unit_id: unitId, name: tenantName, status: 'active' } as any;
}

export function createTestPayment(orgId: string, data: { tenant_id: string; unit_id: string; amount: number; type: string; month: string; method: string; recorded_by: string; notes?: string }) {
  const db = getDb();
  const id = uuid();

  db.run('INSERT INTO payments (id, org_id, tenant_id, unit_id, amount, type, month, method, status, recorded_by, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, orgId, data.tenant_id, data.unit_id, data.amount, data.type, data.month, data.method, 'paid', data.recorded_by, data.notes || null]);

  return { id, org_id: orgId, ...data, status: 'paid' } as any;
}

export function createTestExpense(orgId: string, data: { building_id?: string; description: string; amount: number; category: string; date: string; added_by: string }) {
  const db = getDb();
  const id = uuid();

  db.run('INSERT INTO expenses (id, org_id, building_id, description, amount, category, date, added_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, orgId, data.building_id || null, data.description, data.amount, data.category, data.date, data.added_by]);

  return { id, org_id: orgId, ...data } as any;
}

export function mockRequest(overrides?: { user?: any; org?: any; body?: any; params?: any; cookies?: any }) {
  return {
    user: overrides?.user,
    org: overrides?.org,
    body: overrides?.body || {},
    params: overrides?.params || {},
    cookies: overrides?.cookies || {},
  } as any;
}

export function mockResponse() {
  const res: any = {};
  res.status = function(code: number) { 
    this.statusCode = code;
    return this;
  };
  res.json = function(data: any) { 
    this.body = data;
    return this;
  };
  res.cookie = function() { return this; };
  res.clearCookie = function() { return this; };
  return res;
}