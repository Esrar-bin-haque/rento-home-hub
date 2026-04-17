import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestDb, closeTestDb } from './setup.js';
import { setTestDb } from '../db/index.js';
import { createTestUser, createTestOrg, addUserToOrg, createTestBuilding, createTestUnit } from './helpers.js';
import { createUnit, listUnits, findUnitById, updateUnit, deleteUnit } from '../services/unit.service.js';

describe('Units API', () => {
  let db: any;
  let user: any;
  let org: any;
  let building: any;

  beforeEach(async () => {
    db = await createTestDb();
    setTestDb(db);
    user = createTestUser({ name: 'Unit Owner', phone: '+8801702000001' });
    org = createTestOrg(user.id, 'Unit Org');
    addUserToOrg(user.id, org.id, 'property_manager');
    building = createTestBuilding(org.id, 'Test Building');
  });

  afterEach(() => {
    closeTestDb();
  });

  describe('createUnit', () => {
    it('should create a unit with valid data', () => {
      const unit = createUnit(org.id, { building_id: building.id, unit_number: '101', floor: '1', size_sqft: 1200, rent_amount: 15000, service_charge: 1000 });
      expect(unit).toBeDefined();
      expect(unit.unit_number).toBe('101');
      expect(unit.floor).toBe('1');
      expect(unit.size_sqft).toBe(1200);
      expect(unit.rent_amount).toBe(15000);
      expect(unit.status).toBe('vacant');
    });

    it('should create unit with minimal data', () => {
      const unit = createUnit(org.id, { building_id: building.id, unit_number: '102' });
      expect(unit).toBeDefined();
      expect(unit.status).toBe('vacant');
    });

    it('should throw error for non-existent building', () => {
      expect(() => createUnit(org.id, { building_id: 'non-existent', unit_number: '103' }))
        .toThrow('Building not found in this organization');
    });

    it('should throw error for building in different org', () => {
      const otherOrg = createTestOrg(user.id, 'Other Org');
      const otherBuilding = createTestBuilding(otherOrg.id, 'Other Building');
      expect(() => createUnit(org.id, { building_id: otherBuilding.id, unit_number: '104' }))
        .toThrow('Building not found in this organization');
    });
  });

  describe('listUnits', () => {
    it('should list all units for org', () => {
      createUnit(org.id, { building_id: building.id, unit_number: '101' });
      createUnit(org.id, { building_id: building.id, unit_number: '102' });
      const units = listUnits(org.id);
      expect(units.length).toBe(2);
    });

    it('should filter units by building_id', () => {
      const building2 = createTestBuilding(org.id, 'Building 2');
      createUnit(org.id, { building_id: building.id, unit_number: '101' });
      createUnit(org.id, { building_id: building2.id, unit_number: '201' });
      
      const filtered = listUnits(org.id, building.id);
      expect(filtered.length).toBe(1);
      expect(filtered[0].unit_number).toBe('101');
    });

    it('should return empty list for new org', () => {
      const units = listUnits(org.id);
      expect(units.length).toBe(0);
    });

    it('should return units in order by unit_number', () => {
      createUnit(org.id, { building_id: building.id, unit_number: '103' });
      createUnit(org.id, { building_id: building.id, unit_number: '101' });
      createUnit(org.id, { building_id: building.id, unit_number: '102' });
      
      const units = listUnits(org.id);
      expect(units[0].unit_number).toBe('101');
      expect(units[1].unit_number).toBe('102');
      expect(units[2].unit_number).toBe('103');
    });
  });

  describe('findUnitById', () => {
    it('should find unit by id', () => {
      const created = createUnit(org.id, { building_id: building.id, unit_number: '101' });
      const found = findUnitById(created.id, org.id);
      expect(found).toBeDefined();
      expect(found?.unit_number).toBe('101');
    });

    it('should return null for non-existent id', () => {
      const found = findUnitById('non-existent-id', org.id);
      expect(found).toBeNull();
    });

    it('should return null for unit in different org', () => {
      const otherOrg = createTestOrg(user.id, 'Other Org');
      const unit = createUnit(org.id, { building_id: building.id, unit_number: '101' });
      const found = findUnitById(unit.id, otherOrg.id);
      expect(found).toBeNull();
    });
  });

  describe('updateUnit', () => {
    it('should update unit number', () => {
      const unit = createUnit(org.id, { building_id: building.id, unit_number: '101' });
      updateUnit(unit.id, org.id, { unit_number: '102' });
      const updated = findUnitById(unit.id, org.id);
      expect(updated?.unit_number).toBe('102');
    });

    it('should update rent amount', () => {
      const unit = createUnit(org.id, { building_id: building.id, unit_number: '101', rent_amount: 10000 });
      updateUnit(unit.id, org.id, { rent_amount: 15000 });
      const updated = findUnitById(unit.id, org.id);
      expect(updated?.rent_amount).toBe(15000);
    });

    it('should update status', () => {
      const unit = createUnit(org.id, { building_id: building.id, unit_number: '101' });
      updateUnit(unit.id, org.id, { status: 'occupied' });
      const updated = findUnitById(unit.id, org.id);
      expect(updated?.status).toBe('occupied');
    });

    it('should update multiple fields', () => {
      const unit = createUnit(org.id, { building_id: building.id, unit_number: '101', floor: '1' });
      updateUnit(unit.id, org.id, { unit_number: '102', floor: '2', rent_amount: 20000 });
      const updated = findUnitById(unit.id, org.id);
      expect(updated?.unit_number).toBe('102');
      expect(updated?.floor).toBe('2');
      expect(updated?.rent_amount).toBe(20000);
    });
  });

  describe('deleteUnit', () => {
    it('should delete unit and return old data', () => {
      const unit = createUnit(org.id, { building_id: building.id, unit_number: '101' });
      const deleted = deleteUnit(unit.id, org.id);
      expect(deleted).toBeDefined();
      expect(deleted?.unit_number).toBe('101');
      
      const found = findUnitById(unit.id, org.id);
      expect(found).toBeNull();
    });

    it('should return null for non-existent unit', () => {
      const deleted = deleteUnit('non-existent-id', org.id);
      expect(deleted).toBeNull();
    });
  });

  describe('building_id filter', () => {
    it('should filter by specific building', () => {
      const building2 = createTestBuilding(org.id, 'Building 2');
      createUnit(org.id, { building_id: building.id, unit_number: '101' });
      createUnit(org.id, { building_id: building2.id, unit_number: '201' });
      createUnit(org.id, { building_id: building2.id, unit_number: '202' });
      
      const b1Units = listUnits(org.id, building.id);
      const b2Units = listUnits(org.id, building2.id);
      
      expect(b1Units.length).toBe(1);
      expect(b2Units.length).toBe(2);
    });
  });
});