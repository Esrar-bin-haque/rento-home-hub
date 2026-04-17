import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestDb, closeTestDb } from './setup.js';
import { setTestDb } from '../db/index.js';
import { createTestUser, createTestOrg, addUserToOrg, createTestBuilding, createTestUnit, createTestTenant } from './helpers.js';
import { createInvoice, listInvoices, findInvoiceById, markInvoiceAsPaid, deleteInvoice } from '../services/invoice.service.js';

describe('Invoices API', () => {
  let db: any;
  let user: any;
  let org: any;
  let building: any;
  let unit: any;
  let tenant: any;

  beforeEach(async () => {
    db = await createTestDb();
    setTestDb(db);
    user = createTestUser({ name: 'Invoice Owner', phone: '+8801706000001' });
    org = createTestOrg(user.id, 'Invoice Org');
    addUserToOrg(user.id, org.id, 'property_manager');
    building = createTestBuilding(org.id, 'Test Building');
    unit = createTestUnit(org.id, building.id, '101');
    tenant = createTestTenant(org.id, unit.id, 'Test Tenant');
  });

  afterEach(() => {
    closeTestDb();
  });

  describe('createInvoice', () => {
    it('should create an invoice with valid data', () => {
      const invoice = createInvoice(org.id, { tenant_id: tenant.id, unit_id: unit.id, month: '2026-04', line_items: [{ description: 'Rent', amount: 15000 }], due_date: '2026-04-30' }, user.id);
      expect(invoice).toBeDefined();
      expect(invoice.month).toBe('2026-04');
      expect(invoice.total_amount).toBe(15000);
      expect(invoice.status).toBe('draft');
    });

    it('should generate invoice number', () => {
      const invoice = createInvoice(org.id, { tenant_id: tenant.id, unit_id: unit.id, month: '2026-04', line_items: [{ description: 'Rent', amount: 10000 }] }, user.id);
      expect(invoice.invoice_number).toMatch(/^INV-\d{4}-\d{5}$/);
    });

    it('should calculate total from line_items', () => {
      const invoice = createInvoice(org.id, { tenant_id: tenant.id, unit_id: unit.id, month: '2026-04', line_items: [{ description: 'Rent', amount: 10000 }, { description: 'Service', amount: 2000 }] }, user.id);
      expect(invoice.total_amount).toBe(12000);
    });
  });

  describe('listInvoices', () => {
    it('should list all invoices for org', () => {
      createInvoice(org.id, { tenant_id: tenant.id, unit_id: unit.id, month: '2026-04', line_items: [{ description: 'Rent', amount: 15000 }] }, user.id);
      const unit2 = createTestUnit(org.id, building.id, '102');
      const tenant2 = createTestTenant(org.id, unit2.id, 'Tenant 2');
      createInvoice(org.id, { tenant_id: tenant2.id, unit_id: unit2.id, month: '2026-04', line_items: [{ description: 'Rent', amount: 20000 }] }, user.id);
      const invoices = listInvoices(org.id);
      expect(invoices.length).toBe(2);
    });

    it('should include tenant_name and unit_number in results', () => {
      createInvoice(org.id, { tenant_id: tenant.id, unit_id: unit.id, month: '2026-04', line_items: [{ description: 'Rent', amount: 15000 }] }, user.id);
      const invoices = listInvoices(org.id);
      expect(invoices[0].tenant_name).toBe('Test Tenant');
      expect(invoices[0].unit_number).toBe('101');
    });
  });

  describe('findInvoiceById', () => {
    it('should find invoice by id', () => {
      const created = createInvoice(org.id, { tenant_id: tenant.id, unit_id: unit.id, month: '2026-04', line_items: [{ description: 'Rent', amount: 15000 }] }, user.id);
      const found = findInvoiceById(created.id, org.id);
      expect(found).toBeDefined();
      expect(found?.month).toBe('2026-04');
    });

    it('should return null for non-existent id', () => {
      const found = findInvoiceById('non-existent-id', org.id);
      expect(found).toBeNull();
    });
  });

  describe('markInvoiceAsPaid', () => {
    it('should mark invoice as paid and set paid_at', () => {
      const invoice = createInvoice(org.id, { tenant_id: tenant.id, unit_id: unit.id, month: '2026-04', line_items: [{ description: 'Rent', amount: 15000 }] }, user.id);
      markInvoiceAsPaid(invoice.id, org.id);
      const updated = findInvoiceById(invoice.id, org.id);
      expect(updated?.status).toBe('paid');
      expect(updated?.paid_at).toBeDefined();
    });
  });

  describe('deleteInvoice', () => {
    it('should delete invoice and return old data', () => {
      const invoice = createInvoice(org.id, { tenant_id: tenant.id, unit_id: unit.id, month: '2026-04', line_items: [{ description: 'Rent', amount: 15000 }] }, user.id);
      const deleted = deleteInvoice(invoice.id, org.id);
      expect(deleted).toBeDefined();
      expect(deleted?.month).toBe('2026-04');
      
      const found = findInvoiceById(invoice.id, org.id);
      expect(found).toBeNull();
    });

    it('should return null for non-existent invoice', () => {
      const deleted = deleteInvoice('non-existent-id', org.id);
      expect(deleted).toBeNull();
    });
  });
});