import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { requireOrgMember } from '../middleware/orgScope.js';
import { requirePermission } from '../middleware/rbac.js';
import { createExpense, listExpenses, findExpenseById, updateExpense, deleteExpense } from '../services/expense.service.js';

const createExpenseSchema = z.object({
  description: z.string().min(1, 'Description required'),
  amount: z.number().nonnegative('Amount must be positive'),
  category: z.string().optional(),
  date: z.string().optional(),
  building_id: z.string().optional(),
  vendor_id: z.string().optional()
});

const router = Router();

router.get('/', requireAuth, requireOrgMember, requirePermission('expenses.read'), (req: Request, res: Response) => {
  res.json({ data: listExpenses(req.org!.id) });
});

router.post('/', requireAuth, requireOrgMember, requirePermission('expenses.write'), async (req: Request, res: Response) => {
  try {
    const data = createExpenseSchema.parse(req.body);
    const expense = createExpense(req.org!.id, { ...data, added_by: req.user!.userId });
    res.status(201).json(expense);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    res.status(500).json({ error: err.message || 'Failed to create expense' });
  }
});

router.get('/:id', requireAuth, requireOrgMember, requirePermission('expenses.read'), (req: Request, res: Response) => {
  const e = findExpenseById(req.params.id, req.org!.id);
  if (!e) return res.status(404).json({ error: 'Not found' });
  res.json(e);
});

router.put('/:id', requireAuth, requireOrgMember, requirePermission('expenses.write'), async (req: Request, res: Response) => {
  try {
    updateExpense(req.params.id, req.org!.id, req.body);
    const updated = findExpenseById(req.params.id, req.org!.id);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update expense' });
  }
});

router.delete('/:id', requireAuth, requireOrgMember, requirePermission('expenses.delete'), async (req: Request, res: Response) => {
  try {
    const deleted = deleteExpense(req.params.id, req.org!.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete expense' });
  }
});

export default router;