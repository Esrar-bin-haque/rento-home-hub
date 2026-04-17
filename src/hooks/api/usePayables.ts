import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Payable, PayableCreateInput, PayableUpdateInput } from '@/types/api';

export function usePayables(orgId: string | null) {
  return useQuery({
    queryKey: ['payables', orgId],
    queryFn: () => api.get('/payables'),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function usePayable(id: string, orgId: string | null) {
  return useQuery({
    queryKey: ['payables', orgId, id],
    queryFn: () => api.get(`/payables/${id}`),
    enabled: !!(orgId && id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreatePayable() {
  const queryClient = useQueryClient();
  const orgId = api.getOrgId();

  return useMutation({
    mutationFn: (data: PayableCreateInput) => api.post('/payables', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payables', orgId] });
    },
  });
}

export function useUpdatePayable() {
  const queryClient = useQueryClient();
  const orgId = api.getOrgId();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PayableUpdateInput }) =>
      api.put(`/payables/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payables', orgId] });
    },
  });
}

export function useDeletePayable() {
  const queryClient = useQueryClient();
  const orgId = api.getOrgId();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/payables/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payables', orgId] });
    },
  });
}