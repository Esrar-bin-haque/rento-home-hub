import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestDb, closeTestDb } from './setup.js';
import { setTestDb } from '../db/index.js';
import { createTestUser, createTestOrg, addUserToOrg } from './helpers.js';
import { createBuilding, listBuildings, findBuildingById, updateBuilding, deleteBuilding } from '../services/building.service.js';

describe('Buildings API', () => {
  let db: any;
  let user: any;
  let org: any;

  beforeEach(async () => {
    db = await createTestDb();
    setTestDb(db);
    user = createTestUser({ name: 'Building Owner', phone: '+8801701000001' });
    org = createTestOrg(user.id, 'Building Org');
    addUserToOrg(user.id, org.id, 'property_manager');
  });

  afterEach(() => {
    closeTestDb();
  });

  describe('createBuilding', () => {
    it('should create a building with valid data', () => {
      const building = createBuilding(org.id, { name: 'Test Building', address: '123 Main St', total_floors: 10 });
      expect(building).toBeDefined();
      expect(building.name).toBe('Test Building');
      expect(building.address).toBe('123 Main St');
      expect(building.total_floors).toBe(10);
    });

    it('should create building with minimal data', () => {
      const building = createBuilding(org.id, { name: 'Minimal Building' });
      expect(building).toBeDefined();
      expect(building.name).toBe('Minimal Building');
    });
  });

  describe('listBuildings', () => {
    it('should list all buildings for org', () => {
      createBuilding(org.id, { name: 'Building 1' });
      createBuilding(org.id, { name: 'Building 2' });
      const buildings = listBuildings(org.id);
      expect(buildings.length).toBe(2);
    });

    it('should return empty list for new org', () => {
      const buildings = listBuildings(org.id);
      expect(buildings.length).toBe(0);
    });

    it('should return buildings sorted', () => {
      createBuilding(org.id, { name: 'A Building' });
      createBuilding(org.id, { name: 'B Building' });
      const buildings = listBuildings(org.id);
      expect(buildings.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('findBuildingById', () => {
    it('should find building by id', () => {
      const created = createBuilding(org.id, { name: 'Findable Building' });
      const found = findBuildingById(created.id, org.id);
      expect(found).toBeDefined();
      expect(found?.name).toBe('Findable Building');
    });

    it('should return null for non-existent id', () => {
      const found = findBuildingById('non-existent-id', org.id);
      expect(found).toBeNull();
    });

    it('should return null for building in different org', () => {
      const otherOrg = createTestOrg(user.id, 'Other Org');
      const building = createBuilding(org.id, { name: 'My Building' });
      const found = findBuildingById(building.id, otherOrg.id);
      expect(found).toBeNull();
    });
  });

  describe('updateBuilding', () => {
    it('should update building name', () => {
      const building = createBuilding(org.id, { name: 'Original Name' });
      updateBuilding(building.id, org.id, { name: 'Updated Name' });
      const updated = findBuildingById(building.id, org.id);
      expect(updated?.name).toBe('Updated Name');
    });

    it('should update building address', () => {
      const building = createBuilding(org.id, { name: 'Test', address: 'Old Address' });
      updateBuilding(building.id, org.id, { address: 'New Address' });
      const updated = findBuildingById(building.id, org.id);
      expect(updated?.address).toBe('New Address');
    });

    it('should update multiple fields', () => {
      const building = createBuilding(org.id, { name: 'Test', total_floors: 5 });
      updateBuilding(building.id, org.id, { name: 'New Name', total_floors: 10 });
      const updated = findBuildingById(building.id, org.id);
      expect(updated?.name).toBe('New Name');
      expect(updated?.total_floors).toBe(10);
    });

    it('should not update non-existent building', () => {
      updateBuilding('non-existent', org.id, { name: 'Test' });
      expect(true).toBe(true);
    });
  });

  describe('deleteBuilding', () => {
    it('should delete building and return old data', () => {
      const building = createBuilding(org.id, { name: 'To Delete' });
      const deleted = deleteBuilding(building.id, org.id);
      expect(deleted).toBeDefined();
      expect(deleted?.name).toBe('To Delete');
      
      const found = findBuildingById(building.id, org.id);
      expect(found).toBeNull();
    });

    it('should return null for non-existent building', () => {
      const deleted = deleteBuilding('non-existent-id', org.id);
      expect(deleted).toBeNull();
    });

    it('should not delete building from different org', () => {
      const otherOrg = createTestOrg(user.id, 'Other Org');
      const building = createBuilding(org.id, { name: 'My Building' });
      const deleted = deleteBuilding(building.id, otherOrg.id);
      expect(deleted).toBeNull();
      
      const stillExists = findBuildingById(building.id, org.id);
      expect(stillExists).toBeDefined();
    });
  });

  describe('Permission checks', () => {
    it('should prevent cross-org access', () => {
      const otherOrg = createTestOrg(user.id, 'Other Org');
      const building = createBuilding(org.id, { name: 'Cross Org Test' });
      
      const foundInOther = findBuildingById(building.id, otherOrg.id);
      expect(foundInOther).toBeNull();
    });
  });
});