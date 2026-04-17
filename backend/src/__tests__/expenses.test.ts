import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestDb, closeTestDb } from './setup.js';
import { setTestDb } from '../db/index.js';
import { createTestUser, createTestOrg, addUserToOrg, createTestBuilding } from './helpers.js';
import { createExpense, listExpenses, findExpenseById, updateExpense, deleteExpense } from '../services/expense.service.js';

describe('Expenses API', () => {
  let db: any;
  let user: any;
  let org: any;
  let building: any;

  beforeEach(async () => {
    db = await createTestDb();
    setTestDb(db);
    user = createTestUser({ name: 'Expense Owner', phone: '+8801705000001' });
    org = createTestOrg(user.id, 'Expense Org');
    addUserToOrg(user.id, org.id, 'property_manager');
    building = createTestBuilding(org.id, 'Test Building');
  });

  afterEach(() => {
    closeTestDb();
  });

  describe('createExpense', () => {
    it('should create an expense with valid data', () => {
      const expense = createExpense(org.id, { description: 'Electricity bill', amount: 5000, category: 'utility', date: '2026-04-01', added_by: user.id });
      expect(expense).toBeDefined();
      expect(expense.description).toBe('Electricity bill');
      expect(expense.amount).toBe(5000);
      expect(expense.category).toBe('utility');
    });

    it('should create expense with optional building_id', () => {
      const expense = createExpense(org.id, { building_id: building.id, description: 'Cleaning', amount: 2000, category: 'maintenance', date: '2026-04-02', added_by: user.id });
      expect(expense.building_id).toBe(building.id);
    });
  });

  describe('listExpenses', () => {
    it('should list all expenses for org', () => {
      createExpense(org.id, { description: 'Expense 1', amount: 1000, category: 'utility', date: '2026-04-01', added_by: user.id });
      createExpense(org.id, { description: 'Expense 2', amount: 2000, category: 'maintenance', date: '2026-04-02', added_by: user.id });
      const expenses = listExpenses(org.id);
      expect(expenses.length).toBe(2);
    });

    it('should include building_name in results when building_id is provided', () => {
      createExpense(org.id, { building_id: building.id, description: 'Test Expense', amount: 1000, category: 'utility', date: '2026-04-01', added_by: user.id });
      const expenses = listExpenses(org.id);
      expect(expenses[0].building_name).toBe('Test Building');
    });

    it('should return expenses in descending order by date', () => {
      createExpense(org.id, { description: 'Old', amount: 1000, category: 'utility', date: '2026-03-01', added_by: user.id });
      createExpense(org.id, { description: 'New', amount: 2000, category: 'utility', date: '2026-04-01', added_by: user.id });
      const expenses = listExpenses(org.id);
      expect(expenses[0].description).toBe('New');
    });
  });

  describe('findExpenseById', () => {
    it('should find expense by id', () => {
      const created = createExpense(org.id, { description: 'Findable Expense', amount: 5000, category: 'utility', date: '2026-04-01', added_by: user.id });
      const found = findExpenseById(created.id, org.id);
      expect(found).toBeDefined();
      expect(found?.description).toBe('Findable Expense');
    });

    it('should return null for non-existent id', () => {
      const found = findExpenseById('non-existent-id', org.id);
      expect(found).toBeNull();
    });

    it('should return null for expense in different org', () => {
      const otherOrg = createTestOrg(user.id, 'Other Org');
      const expense = createExpense(org.id, { description: 'My Expense', amount: 5000, category: 'utility', date: '2026-04-01', added_by: user.id });
      const found = findExpenseById(expense.id, otherOrg.id);
      expect(found).toBeNull();
    });
  });

  describe('updateExpense', () => {
    it('should update expense description', () => {
      const expense = createExpense(org.id, { description: 'Original', amount: 5000, category: 'utility', date: '2026-04-01', added_by: user.id });
      updateExpense(expense.id, org.id, { description: 'Updated' });
      const updated = findExpenseById(expense.id, org.id);
      expect(updated?.description).toBe('Updated');
    });

    it('should update expense amount', () => {
      const expense = createExpense(org.id, { description: 'Test', amount: 5000, category: 'utility', date: '2026-04-01', added_by: user.id });
      updateExpense(expense.id, org.id, { amount: 7500 });
      const updated = findExpenseById(expense.id, org.id);
      expect(updated?.amount).toBe(7500);
    });
  });

  describe('deleteExpense', () => {
    it('should delete expense and return old data', () => {
      const expense = createExpense(org.id, { description: 'To Delete', amount: 5000, category: 'utility', date: '2026-04-01', added_by: user.id });
      const deleted = deleteExpense(expense.id, org.id);
      expect(deleted).toBeDefined();
      expect(deleted?.description).toBe('To Delete');
      
      const found = findExpenseById(expense.id, org.id);
      expect(found).toBeNull();
    });

    it('should return null for non-existent expense', () => {
      const deleted = deleteExpense('non-existent-id', org.id);
      expect(deleted).toBeNull();
    });
  });
});