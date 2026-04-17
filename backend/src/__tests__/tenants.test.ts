import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestDb, closeTestDb } from './setup.js';
import { setTestDb } from '../db/index.js';
import { createTestUser, createTestOrg, addUserToOrg, createTestBuilding, createTestUnit, createTestTenant } from './helpers.js';
import { createTenant, listTenants, findTenantById, updateTenant, deactivateTenant } from '../services/tenant.service.js';
import { findUnitById } from '../services/unit.service.js';

describe('Tenants API', () => {
  let db: any;
  let user: any;
  let org: any;
  let building: any;
  let unit: any;

  beforeEach(async () => {
    db = await createTestDb();
    setTestDb(db);
    user = createTestUser({ name: 'Tenant Owner', phone: '+8801703000001' });
    org = createTestOrg(user.id, 'Tenant Org');
    addUserToOrg(user.id, org.id, 'property_manager');
    building = createTestBuilding(org.id, 'Test Building');
    unit = createTestUnit(org.id, building.id, '101');
  });

  afterEach(() => {
    closeTestDb();
  });

  describe('createTenant', () => {
    it('should create a tenant with valid data', () => {
      const tenant = createTenant(org.id, { unit_id: unit.id, name: 'John Doe', phone: '+8801700000001', nid: '1234567890', advance_amount: 50000 });
      expect(tenant).toBeDefined();
      expect(tenant.name).toBe('John Doe');
      expect(tenant.status).toBe('active');
    });

    it('should create tenant with minimal data', () => {
      const tenant = createTenant(org.id, { unit_id: unit.id, name: 'Minimal Tenant' });
      expect(tenant).toBeDefined();
      expect(tenant.status).toBe('active');
    });

    it('should set unit status to occupied on tenant creation', () => {
      const tenant = createTenant(org.id, { unit_id: unit.id, name: 'Test Tenant' });
      const updatedUnit = findUnitById(unit.id, org.id);
      expect(updatedUnit?.status).toBe('occupied');
    });

    it('should throw error for non-existent unit', () => {
      expect(() => createTenant(org.id, { unit_id: 'non-existent', name: 'Test' }))
        .toThrow('Unit not found in this organization');
    });

    it('should throw error for unit in different org', () => {
      const otherOrg = createTestOrg(user.id, 'Other Org');
      const otherBuilding = createTestBuilding(otherOrg.id, 'Other Building');
      const otherUnit = createTestUnit(otherOrg.id, otherBuilding.id, '101');
      expect(() => createTenant(org.id, { unit_id: otherUnit.id, name: 'Test' }))
        .toThrow('Unit not found in this organization');
    });
  });

  describe('listTenants', () => {
    it('should list all tenants for org', () => {
      createTenant(org.id, { unit_id: unit.id, name: 'Tenant 1' });
      const unit2 = createTestUnit(org.id, building.id, '102');
      createTenant(org.id, { unit_id: unit2.id, name: 'Tenant 2' });
      const tenants = listTenants(org.id);
      expect(tenants.length).toBe(2);
    });

    it('should return empty list for new org', () => {
      const tenants = listTenants(org.id);
      expect(tenants.length).toBe(0);
    });

    it('should include unit_number in results', () => {
      createTenant(org.id, { unit_id: unit.id, name: 'Test Tenant' });
      const tenants = listTenants(org.id);
      expect(tenants[0].unit_number).toBe('101');
    });
  });

  describe('findTenantById', () => {
    it('should find tenant by id', () => {
      const created = createTenant(org.id, { unit_id: unit.id, name: 'Findable Tenant' });
      const found = findTenantById(created.id, org.id);
      expect(found).toBeDefined();
      expect(found?.name).toBe('Findable Tenant');
    });

    it('should return null for non-existent id', () => {
      const found = findTenantById('non-existent-id', org.id);
      expect(found).toBeNull();
    });

    it('should return null for tenant in different org', () => {
      const otherOrg = createTestOrg(user.id, 'Other Org');
      const tenant = createTenant(org.id, { unit_id: unit.id, name: 'My Tenant' });
      const found = findTenantById(tenant.id, otherOrg.id);
      expect(found).toBeNull();
    });
  });

  describe('updateTenant', () => {
    it('should update tenant name', () => {
      const tenant = createTenant(org.id, { unit_id: unit.id, name: 'Original Name' });
      updateTenant(tenant.id, org.id, { name: 'Updated Name' });
      const updated = findTenantById(tenant.id, org.id);
      expect(updated?.name).toBe('Updated Name');
    });

    it('should update tenant phone', () => {
      const tenant = createTenant(org.id, { unit_id: unit.id, name: 'Test', phone: 'old' });
      updateTenant(tenant.id, org.id, { phone: '+8801700000001' });
      const updated = findTenantById(tenant.id, org.id);
      expect(updated?.phone).toBe('+8801700000001');
    });

    it('should update multiple fields', () => {
      const tenant = createTenant(org.id, { unit_id: unit.id, name: 'Test', advance_amount: 10000 });
      updateTenant(tenant.id, org.id, { name: 'New Name', advance_amount: 20000, status: 'inactive' });
      const updated = findTenantById(tenant.id, org.id);
      expect(updated?.name).toBe('New Name');
      expect(updated?.advance_amount).toBe(20000);
      expect(updated?.status).toBe('inactive');
    });
  });

  describe('deactivateTenant', () => {
    it('should deactivate tenant', () => {
      const tenant = createTenant(org.id, { unit_id: unit.id, name: 'Active Tenant' });
      deactivateTenant(tenant.id, org.id);
      const updated = findTenantById(tenant.id, org.id);
      expect(updated?.status).toBe('inactive');
    });

    it('should set unit to vacant when deactivated (no other active tenants)', () => {
      const tenant = createTenant(org.id, { unit_id: unit.id, name: 'Single Tenant' });
      deactivateTenant(tenant.id, org.id);
      const updatedUnit = findUnitById(unit.id, org.id);
      expect(updatedUnit?.status).toBe('vacant');
    });

    it('should keep unit occupied when other tenants still active', () => {
      const tenant1 = createTenant(org.id, { unit_id: unit.id, name: 'Tenant 1' });
      const unit2 = createTestUnit(org.id, building.id, '102');
      const tenant2 = createTenant(org.id, { unit_id: unit2.id, name: 'Tenant 2' });
      
      deactivateTenant(tenant1.id, org.id);
      const updatedUnit = findUnitById(unit.id, org.id);
      expect(updatedUnit?.status).toBe('vacant');
      
      const updatedUnit2 = findUnitById(unit2.id, org.id);
      expect(updatedUnit2?.status).toBe('occupied');
    });
  });

  describe('unit status auto-update', () => {
    it('should auto-set unit to occupied on tenant creation', () => {
      createTenant(org.id, { unit_id: unit.id, name: 'New Tenant' });
      const updatedUnit = findUnitById(unit.id, org.id);
      expect(updatedUnit?.status).toBe('occupied');
    });

    it('should auto-set unit to vacant when all tenants deactivated', () => {
      const tenant = createTenant(org.id, { unit_id: unit.id, name: 'Only Tenant' });
      deactivateTenant(tenant.id, org.id);
      const updatedUnit = findUnitById(unit.id, org.id);
      expect(updatedUnit?.status).toBe('vacant');
    });
  });
});