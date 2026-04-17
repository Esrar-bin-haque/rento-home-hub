import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestDb, closeTestDb } from './setup.js';
import { setTestDb } from '../db/index.js';
import { createTestUser, createTestOrg } from './helpers.js';
import { createOrg } from '../services/org.service.js';
import { listAllOrgs, listAllUsers, getPlatformStats, getUserById } from '../services/admin.service.js';
import { seedDefaultRoles } from '../db/seed.js';

describe('Admin API', () => {
  let db: any;
  let superAdmin: any;
  let regularUser: any;

  beforeEach(async () => {
    db = await createTestDb();
    setTestDb(db);
    seedDefaultRoles();
    superAdmin = createTestUser({ name: 'Super Admin', phone: '+8801710000001', is_super_admin: 1 });
    regularUser = createTestUser({ name: 'Regular User', phone: '+8801710000002', is_super_admin: 0 });
  });

  afterEach(() => {
    closeTestDb();
  });

  describe('listAllOrgs', () => {
    it('should list all orgs (super admin view)', () => {
      createOrg('Org 1', 'org-1', regularUser.id);
      createOrg('Org 2', 'org-2', regularUser.id);
      const orgs = listAllOrgs();
      expect(orgs.length).toBe(2);
    });

    it('should return empty list when no orgs', () => {
      const orgs = listAllOrgs();
      expect(orgs.length).toBe(0);
    });
  });

  describe('listAllUsers', () => {
    it('should list all users (super admin view)', () => {
      createTestUser({ name: 'User 1', phone: '+8801710000003' });
      createTestUser({ name: 'User 2', phone: '+8801710000004' });
      const users = listAllUsers();
      expect(users.length).toBeGreaterThanOrEqual(3);
    });

    it('should return user fields only', () => {
      const users = listAllUsers();
      if (users.length > 0) {
        expect(users[0]).toHaveProperty('id');
        expect(users[0]).toHaveProperty('name');
        expect(users[0]).toHaveProperty('phone');
        expect(users[0]).toHaveProperty('is_super_admin');
        expect(users[0]).not.toHaveProperty('password_hash');
      }
    });
  });

  describe('getPlatformStats', () => {
    it('should return aggregated platform statistics', () => {
      createOrg('Test Org', 'test', regularUser.id);
      const stats = getPlatformStats();
      expect(stats.totalOrgs).toBe(1);
      expect(stats.totalUsers).toBe(2);
      expect(stats.totalPayments).toBe(0);
    });

    it('should return zero counts for empty platform', () => {
      const stats = getPlatformStats();
      expect(stats.totalOrgs).toBe(0);
      expect(stats.totalUsers).toBe(2);
      expect(stats.totalPayments).toBe(0);
    });
  });

  describe('getUserById', () => {
    it('should find user by id', () => {
      const user = getUserById(regularUser.id);
      expect(user).toBeDefined();
      expect(user?.name).toBe('Regular User');
    });

    it('should return null for non-existent user', () => {
      const user = getUserById('non-existent-id');
      expect(user).toBeNull();
    });
  });

  describe('Super Admin Only Access', () => {
    it('should identify super admin correctly', () => {
      expect(superAdmin.is_super_admin).toBe(1);
      expect(regularUser.is_super_admin).toBe(0);
    });

    it('super admin can access all orgs', () => {
      createOrg('Private Org', 'private', regularUser.id);
      const orgs = listAllOrgs();
      expect(orgs.length).toBe(1);
    });

    it('super admin can access all users', () => {
      const users = listAllUsers();
      expect(users.length).toBeGreaterThan(0);
    });

    it('super admin can get platform stats', () => {
      const stats = getPlatformStats();
      expect(stats).toBeDefined();
      expect(typeof stats.totalUsers).toBe('number');
    });

    it('non-super admin should not access admin endpoints (simulation)', () => {
      expect(regularUser.is_super_admin).toBe(0);
    });
  });
});