import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Expense, ExpenseCreateInput, ExpenseUpdateInput } from '@/types/api';
import { toast } from 'sonner';

export function useExpenses(orgId: string | null) {
  return useQuery({
    queryKey: ['expenses', orgId],
    queryFn: () => api.get('/expenses'),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useExpense(id: string, orgId: string | null) {
  return useQuery({
    queryKey: ['expenses', orgId, id],
    queryFn: () => api.get(`/expenses/${id}`),
    enabled: !!(orgId && id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  const orgId = api.getOrgId();

  return useMutation({
    mutationFn: (data: ExpenseCreateInput) => api.post('/expenses', data),
    onError: (error) => { toast.error(error.message || 'An error occurred'); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', orgId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', orgId] });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  const orgId = api.getOrgId();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ExpenseUpdateInput }) =>
      api.put(`/expenses/${id}`, data),
    onError: (error) => { toast.error(error.message || 'An error occurred'); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', orgId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', orgId] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  const orgId = api.getOrgId();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/expenses/${id}`),
    onError: (error) => { toast.error(error.message || 'An error occurred'); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', orgId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', orgId] });
    },
  });
}