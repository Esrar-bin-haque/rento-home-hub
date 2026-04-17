import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestDb, closeTestDb } from './setup.js';
import { setTestDb } from '../db/index.js';
import { createTestUser, createTestOrg, createTestBuilding, createTestUnit, createTestTenant, createTestPayment, createTestExpense } from './helpers.js';
import { getDashboardData } from '../services/dashboard.service.js';

describe('Dashboard API', () => {
  let db: any;
  let user: any;

  beforeEach(async () => {
    db = await createTestDb();
    setTestDb(db);
    user = createTestUser({ name: 'Dashboard Owner', phone: '+8801708000001' });
  });

  afterEach(() => {
    closeTestDb();
  });

  describe('getDashboardData', () => {
    it('should return zero values for new org', () => {
      const freshOrg = createTestOrg(user.id, 'Fresh Org');
      const stats = getDashboardData(freshOrg.id);
      expect(stats.buildings).toBe(0);
      expect(stats.totalUnits).toBe(0);
      expect(stats.occupiedUnits).toBe(0);
      expect(stats.vacantUnits).toBe(0);
      expect(stats.activeTenants).toBe(0);
      expect(stats.totalPaymentsCollected).toBe(0);
      expect(stats.totalExpenses).toBe(0);
    });

    it('should count buildings correctly', () => {
      const org2 = createTestOrg(user.id, 'Org 2');
      createTestBuilding(org2.id, 'Building 1');
      createTestBuilding(org2.id, 'Building 2');
      const stats = getDashboardData(org2.id);
      expect(stats.buildings).toBe(2);
    });

    it('should count units correctly', () => {
      const org2 = createTestOrg(user.id, 'Org 3');
      const b = createTestBuilding(org2.id, 'B1');
      createTestUnit(org2.id, b.id, '101');
      createTestUnit(org2.id, b.id, '102');
      createTestUnit(org2.id, b.id, '103');
      const stats = getDashboardData(org2.id);
      expect(stats.totalUnits).toBe(3);
    });

    it('should count occupied vs vacant units', () => {
      const org2 = createTestOrg(user.id, 'Org 4');
      const b = createTestBuilding(org2.id, 'B1');
      createTestUnit(org2.id, b.id, '101');
      const occupiedUnit = createTestUnit(org2.id, b.id, '102');
      createTestTenant(org2.id, occupiedUnit.id, 'Tenant');
      const stats = getDashboardData(org2.id);
      expect(stats.occupiedUnits).toBe(1);
      expect(stats.vacantUnits).toBe(1);
    });

    it('should count active tenants', () => {
      const org2 = createTestOrg(user.id, 'Org 5');
      const b = createTestBuilding(org2.id, 'B1');
      const u1 = createTestUnit(org2.id, b.id, '101');
      const u2 = createTestUnit(org2.id, b.id, '102');
      createTestTenant(org2.id, u1.id, 'Tenant 1');
      createTestTenant(org2.id, u2.id, 'Tenant 2');
      const stats = getDashboardData(org2.id);
      expect(stats.activeTenants).toBe(2);
    });

    it('should aggregate current month payments', () => {
      const org2 = createTestOrg(user.id, 'Org 6');
      const b = createTestBuilding(org2.id, 'B1');
      const u = createTestUnit(org2.id, b.id, '101');
      const t = createTestTenant(org2.id, u.id, 'Tenant');
      const currentMonth = new Date().toISOString().slice(0, 7);
      createTestPayment(org2.id, { tenant_id: t.id, unit_id: u.id, amount: 15000, type: 'rent', month: currentMonth, method: 'cash', recorded_by: user.id });
      const u2 = createTestUnit(org2.id, b.id, '102');
      const t2 = createTestTenant(org2.id, u2.id, 'Tenant 2');
      createTestPayment(org2.id, { tenant_id: t2.id, unit_id: u2.id, amount: 20000, type: 'rent', month: currentMonth, method: 'bank', recorded_by: user.id });
      const stats = getDashboardData(org2.id);
      expect(stats.totalPaymentsCollected).toBe(35000);
    });

    it('should aggregate current month expenses', () => {
      const org2 = createTestOrg(user.id, 'Org 7');
      const currentMonth = new Date().toISOString().slice(0, 7);
      createTestExpense(org2.id, { description: 'Expense 1', amount: 5000, category: 'utility', date: currentMonth + '-01', added_by: user.id });
      createTestExpense(org2.id, { description: 'Expense 2', amount: 3000, category: 'maintenance', date: currentMonth + '-15', added_by: user.id });
      const stats = getDashboardData(org2.id);
      expect(stats.totalExpenses).toBe(8000);
    });

    it('should return separate stats for different orgs', () => {
      const orgA = createTestOrg(user.id, 'Org A');
      const orgB = createTestOrg(user.id, 'Org B');
      createTestBuilding(orgA.id, 'OrgA Building');
      const b = createTestBuilding(orgB.id, 'OrgB Building');
      const u = createTestUnit(orgB.id, b.id, '201');
      createTestTenant(orgB.id, u.id, 'Other Tenant');
      
      const statsA = getDashboardData(orgA.id);
      const statsB = getDashboardData(orgB.id);
      
      expect(statsA.buildings).toBe(1);
      expect(statsA.activeTenants).toBe(0);
      expect(statsB.buildings).toBe(1);
      expect(statsB.activeTenants).toBe(1);
    });
  });
});