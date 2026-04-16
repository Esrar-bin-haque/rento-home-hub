import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireOrgMember } from '../middleware/orgScope.js';
import { requirePermission } from '../middleware/rbac.js';
import { createExpense, listExpenses, findExpenseById, updateExpense, deleteExpense } from '../services/expense.service.js';

const router = Router();

router.get('/', requireAuth, requireOrgMember, requirePermission('expenses.read'), (req: Request, res: Response) => {
  res.json(listExpenses(req.org!.id));
});

router.post('/', requireAuth, requireOrgMember, requirePermission('expenses.write'), async (req: Request, res: Response) => {
  try {
    const expense = createExpense(req.org!.id, { ...req.body, added_by: req.user!.userId });
    res.status(201).json(expense);
  } catch (err: any) {
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