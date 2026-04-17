import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Payment, PaymentCreateInput, PaymentUpdateInput } from '@/types/api';
import { toast } from 'sonner';

export function usePayments(orgId: string | null) {
  return useQuery({
    queryKey: ['payments', orgId],
    queryFn: () => api.get('/payments'),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function usePayment(id: string, orgId: string | null) {
  return useQuery({
    queryKey: ['payments', orgId, id],
    queryFn: () => api.get(`/payments/${id}`),
    enabled: !!orgId && !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  const orgId = api.getOrgId();

  return useMutation({
    mutationFn: (data: PaymentCreateInput) => api.post('/payments', data),
    onError: (error) => { toast.error(error.message || 'An error occurred'); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', orgId] });
    },
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();
  const orgId = api.getOrgId();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PaymentUpdateInput }) =>
      api.put(`/payments/${id}`, data),
    onError: (error) => { toast.error(error.message || 'An error occurred'); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', orgId] });
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();
  const orgId = api.getOrgId();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/payments/${id}`),
    onError: (error) => { toast.error(error.message || 'An error occurred'); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', orgId] });
    },
  });
}