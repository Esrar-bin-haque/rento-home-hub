import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestDb, closeTestDb } from './setup.js';
import { setTestDb } from '../db/index.js';
import { createTestUser, createTestOrg, addUserToOrg } from './helpers.js';
import { createPayable, listPayables, findPayableById, updatePayable, deletePayable } from '../services/payable.service.js';

describe('Payables API', () => {
  let db: any;
  let user: any;
  let org: any;

  beforeEach(async () => {
    db = await createTestDb();
    setTestDb(db);
    user = createTestUser({ name: 'Payable Owner', phone: '+8801707000001' });
    org = createTestOrg(user.id, 'Payable Org');
    addUserToOrg(user.id, org.id, 'property_manager');
  });

  afterEach(() => {
    closeTestDb();
  });

  describe('createPayable', () => {
    it('should create a payable with valid data', () => {
      const payable = createPayable(org.id, { description: 'Office rent', amount: 25000, pay_to: 'Landlord', due_date: '2026-04-30' });
      expect(payable).toBeDefined();
      expect(payable.description).toBe('Office rent');
      expect(payable.amount).toBe(25000);
      expect(payable.status).toBe('pending');
    });
  });

  describe('listPayables', () => {
    it('should list all payables for org', () => {
      createPayable(org.id, { description: 'Payable 1', amount: 1000, pay_to: 'Vendor A', due_date: '2026-04-15' });
      createPayable(org.id, { description: 'Payable 2', amount: 2000, pay_to: 'Vendor B', due_date: '2026-04-20' });
      const payables = listPayables(org.id);
      expect(payables.length).toBe(2);
    });

    it('should return payables in ascending order by due_date', () => {
      createPayable(org.id, { description: 'Later', amount: 2000, pay_to: 'A', due_date: '2026-04-20' });
      createPayable(org.id, { description: 'Earlier', amount: 1000, pay_to: 'B', due_date: '2026-04-10' });
      const payables = listPayables(org.id);
      expect(payables[0].description).toBe('Earlier');
    });
  });

  describe('findPayableById', () => {
    it('should find payable by id', () => {
      const created = createPayable(org.id, { description: 'Findable Payable', amount: 5000, pay_to: 'Vendor', due_date: '2026-04-30' });
      const found = findPayableById(created.id, org.id);
      expect(found).toBeDefined();
      expect(found?.description).toBe('Findable Payable');
    });

    it('should return null for non-existent id', () => {
      const found = findPayableById('non-existent-id', org.id);
      expect(found).toBeNull();
    });

    it('should return null for payable in different org', () => {
      const otherOrg = createTestOrg(user.id, 'Other Org');
      const payable = createPayable(org.id, { description: 'My Payable', amount: 5000, pay_to: 'Vendor', due_date: '2026-04-30' });
      const found = findPayableById(payable.id, otherOrg.id);
      expect(found).toBeNull();
    });
  });

  describe('updatePayable', () => {
    it('should update payable amount', () => {
      const payable = createPayable(org.id, { description: 'Test', amount: 5000, pay_to: 'Vendor', due_date: '2026-04-30' });
      updatePayable(payable.id, org.id, { amount: 7500 });
      const updated = findPayableById(payable.id, org.id);
      expect(updated?.amount).toBe(7500);
    });

    it('should update payable status', () => {
      const payable = createPayable(org.id, { description: 'Test', amount: 5000, pay_to: 'Vendor', due_date: '2026-04-30' });
      updatePayable(payable.id, org.id, { status: 'paid' });
      const updated = findPayableById(payable.id, org.id);
      expect(updated?.status).toBe('paid');
    });
  });

  describe('deletePayable', () => {
    it('should delete payable', () => {
      const payable = createPayable(org.id, { description: 'To Delete', amount: 5000, pay_to: 'Vendor', due_date: '2026-04-30' });
      deletePayable(payable.id, org.id);
      const found = findPayableById(payable.id, org.id);
      expect(found).toBeNull();
    });
  });
});