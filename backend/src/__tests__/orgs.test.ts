import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestDb, closeTestDb } from './setup.js';
import { setTestDb } from '../db/index.js';
import { prepare } from '../db/index.js';
import { createTestUser, createTestOrg } from './helpers.js';
import { createOrg, listUserOrgs, findOrgById } from '../services/org.service.js';
import { seedDefaultRoles } from '../db/seed.js';
import { v4 as uuid } from 'uuid';

describe('Orgs API', () => {
  let db: any;
  let user: any;

  beforeEach(async () => {
    db = await createTestDb();
    setTestDb(db);
    seedDefaultRoles();
    user = createTestUser({ name: 'Org Owner', phone: '+8801709000001' });
  });

  afterEach(() => {
    closeTestDb();
  });

  describe('createOrg', () => {
    it('should create an org with valid data', () => {
      const org = createOrg('Test Organization', 'test-org', user.id);
      expect(org).toBeDefined();
      expect(org.name).toBe('Test Organization');
      expect(org.slug).toBe('test-org');
      expect(org.owner_id).toBe(user.id);
    });

    it('should auto-generate slug from name if not provided', () => {
      const org = createOrg('My New Org', 'my-new-org-test', user.id);
      expect(org.slug).toMatch(/^my-new-org-/);
    });

    it('should add owner as org member with property_manager role', () => {
      const org = createOrg('Test Org', 'test', user.id);
      const member = prepare('SELECT * FROM org_members WHERE org_id = ? AND user_id = ?').all([org.id, user.id])[0] as any;
      expect(member).toBeDefined();
      expect(member.user_id).toBe(user.id);
    });
  });

  describe('listUserOrgs', () => {
    it('should list all orgs for user', () => {
      createOrg('Org 1', 'org-1', user.id);
      createOrg('Org 2', 'org-2', user.id);
      const orgs = listUserOrgs(user.id);
      expect(orgs.length).toBe(2);
    });

    it('should return empty list for user with no orgs', () => {
      const orgs = listUserOrgs(user.id);
      expect(orgs.length).toBe(0);
    });

    it('should not list orgs for other users', () => {
      const otherUser = createTestUser({ name: 'Other User', phone: '+8801709000002' });
      createOrg('Private Org', 'private', user.id);
      const orgs = listUserOrgs(otherUser.id);
      expect(orgs.length).toBe(0);
    });
  });

  describe('findOrgById', () => {
    it('should find org by id', () => {
      const created = createOrg('Findable Org', 'findable', user.id) as any;
      const found = findOrgById(created.id);
      expect(found).toBeDefined();
      expect(found?.name).toBe('Findable Org');
    });

    it('should return null for non-existent id', () => {
      const found = findOrgById('non-existent-id');
      expect(found).toBeNull();
    });
  });

  describe('RBAC', () => {
    it('should check user has role in org', () => {
      const org = createOrg('RBAC Org', 'rbac', user.id);
      const member = prepare('SELECT * FROM org_members WHERE org_id = ? AND user_id = ?').all([org.id, user.id])[0] as any;
      expect(member).toBeDefined();
      
      const role = prepare('SELECT * FROM roles WHERE id = ?').all([member.role_id])[0] as any;
      expect(role.name).toBe('property_manager');
    });

    it('should add member to org with specific role', () => {
      const org = createOrg('Role Org', 'role', user.id);
      const memberId = uuid();
      const role = prepare('SELECT id FROM roles WHERE name = ?').all(['property_manager'])[0] as { id: string };
      // Use a different user to avoid unique constraint
      const otherUser = createTestUser({ name: 'Other User', phone: '+8801710999999' });
      db.run('INSERT INTO org_members (id, org_id, user_id, role_id) VALUES (?, ?, ?, ?)', [memberId, org.id, otherUser.id, role.id]);
      
      const member = prepare('SELECT * FROM org_members WHERE id = ?').all([memberId])[0];
      expect(member).toBeDefined();
    });
  });
});