import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestDb, closeTestDb } from './setup.js';
import { setTestDb } from '../db/index.js';
import { createTestUser, createTestOrg, addUserToOrg, createTestBuilding, createTestUnit, createTestTenant } from './helpers.js';
import { createPayment, listPayments, findPaymentById, updatePayment, deletePayment } from '../services/payment.service.js';

describe('Payments API', () => {
  let db: any;
  let user: any;
  let org: any;
  let building: any;
  let unit: any;
  let tenant: any;

  beforeEach(async () => {
    db = await createTestDb();
    setTestDb(db);
    user = createTestUser({ name: 'Payment Owner', phone: '+8801704000001' });
    org = createTestOrg(user.id, 'Payment Org');
    addUserToOrg(user.id, org.id, 'property_manager');
    building = createTestBuilding(org.id, 'Test Building');
    unit = createTestUnit(org.id, building.id, '101');
    tenant = createTestTenant(org.id, unit.id, 'Test Tenant');
  });

  afterEach(() => {
    closeTestDb();
  });

  describe('createPayment', () => {
    it('should create a payment with valid data', () => {
      const payment = createPayment(org.id, { tenant_id: tenant.id, unit_id: unit.id, amount: 15000, type: 'rent', month: '2026-04', method: 'cash', recorded_by: user.id });
      expect(payment).toBeDefined();
      expect(payment.amount).toBe(15000);
      expect(payment.type).toBe('rent');
      expect(payment.status).toBe('paid');
    });

    it('should create payment with notes', () => {
      const payment = createPayment(org.id, { tenant_id: tenant.id, unit_id: unit.id, amount: 15000, type: 'rent', month: '2026-04', method: 'cash', recorded_by: user.id, notes: 'April rent' });
      expect(payment.notes).toBe('April rent');
    });
  });

  describe('listPayments', () => {
    it('should list all payments for org', () => {
      createPayment(org.id, { tenant_id: tenant.id, unit_id: unit.id, amount: 15000, type: 'rent', month: '2026-04', method: 'cash', recorded_by: user.id });
      const unit2 = createTestUnit(org.id, building.id, '102');
      const tenant2 = createTestTenant(org.id, unit2.id, 'Tenant 2');
      createPayment(org.id, { tenant_id: tenant2.id, unit_id: unit2.id, amount: 20000, type: 'rent', month: '2026-04', method: 'bank', recorded_by: user.id });
      const payments = listPayments(org.id);
      expect(payments.length).toBe(2);
    });

    it('should include tenant_name and unit_number in results', () => {
      createPayment(org.id, { tenant_id: tenant.id, unit_id: unit.id, amount: 15000, type: 'rent', month: '2026-04', method: 'cash', recorded_by: user.id });
      const payments = listPayments(org.id);
      expect(payments[0].tenant_name).toBe('Test Tenant');
      expect(payments[0].unit_number).toBe('101');
    });

    it('should return payments in order', () => {
      createPayment(org.id, { tenant_id: tenant.id, unit_id: unit.id, amount: 10000, type: 'rent', month: '2026-03', method: 'cash', recorded_by: user.id });
      createPayment(org.id, { tenant_id: tenant.id, unit_id: unit.id, amount: 15000, type: 'rent', month: '2026-04', method: 'cash', recorded_by: user.id });
      const payments = listPayments(org.id);
      expect(payments.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('findPaymentById', () => {
    it('should find payment by id', () => {
      const created = createPayment(org.id, { tenant_id: tenant.id, unit_id: unit.id, amount: 15000, type: 'rent', month: '2026-04', method: 'cash', recorded_by: user.id });
      const found = findPaymentById(created.id, org.id);
      expect(found).toBeDefined();
      expect(found?.amount).toBe(15000);
    });

    it('should return null for non-existent id', () => {
      const found = findPaymentById('non-existent-id', org.id);
      expect(found).toBeNull();
    });

    it('should return null for payment in different org', () => {
      const otherOrg = createTestOrg(user.id, 'Other Org');
      const payment = createPayment(org.id, { tenant_id: tenant.id, unit_id: unit.id, amount: 15000, type: 'rent', month: '2026-04', method: 'cash', recorded_by: user.id });
      const found = findPaymentById(payment.id, otherOrg.id);
      expect(found).toBeNull();
    });
  });

  describe('updatePayment', () => {
    it('should update payment amount', () => {
      const payment = createPayment(org.id, { tenant_id: tenant.id, unit_id: unit.id, amount: 15000, type: 'rent', month: '2026-04', method: 'cash', recorded_by: user.id });
      updatePayment(payment.id, org.id, { amount: 20000 });
      const updated = findPaymentById(payment.id, org.id);
      expect(updated?.amount).toBe(20000);
    });

    it('should update payment status', () => {
      const payment = createPayment(org.id, { tenant_id: tenant.id, unit_id: unit.id, amount: 15000, type: 'rent', month: '2026-04', method: 'cash', recorded_by: user.id });
      updatePayment(payment.id, org.id, { status: 'pending' });
      const updated = findPaymentById(payment.id, org.id);
      expect(updated?.status).toBe('pending');
    });
  });

  describe('deletePayment', () => {
    it('should delete payment and return old data', () => {
      const payment = createPayment(org.id, { tenant_id: tenant.id, unit_id: unit.id, amount: 15000, type: 'rent', month: '2026-04', method: 'cash', recorded_by: user.id });
      const deleted = deletePayment(payment.id, org.id);
      expect(deleted).toBeDefined();
      expect(deleted?.amount).toBe(15000);
      
      const found = findPaymentById(payment.id, org.id);
      expect(found).toBeNull();
    });

    it('should return null for non-existent payment', () => {
      const deleted = deletePayment('non-existent-id', org.id);
      expect(deleted).toBeNull();
    });
  });
});