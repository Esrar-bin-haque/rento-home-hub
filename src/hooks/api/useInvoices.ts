import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Invoice, InvoiceCreateInput } from '@/types/api';

export function useInvoices(orgId: string | null) {
  return useQuery({
    queryKey: ['invoices', orgId],
    queryFn: () => api.get('/invoices'),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useInvoice(orgId: string | null, id: string | null) {
  return useQuery({
    queryKey: ['invoices', orgId, id],
    queryFn: () => api.get(`/invoices/${id}`),
    enabled: !!(orgId && id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateInvoice(orgId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InvoiceCreateInput) => api.post('/invoices', {
      ...data,
      line_items: JSON.stringify(data.line_items),
    }),
    onSuccess: () => {
      if (orgId) {
        queryClient.invalidateQueries({ queryKey: ['invoices', orgId] });
      }
    },
  });
}

export function useMarkInvoicePaid(orgId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.put(`/invoices/${id}/mark-paid`, {}),
    onSuccess: () => {
      if (orgId) {
        queryClient.invalidateQueries({ queryKey: ['invoices', orgId] });
      }
    },
  });
}

export function useDeleteInvoice(orgId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/invoices/${id}`),
    onSuccess: () => {
      if (orgId) {
        queryClient.invalidateQueries({ queryKey: ['invoices', orgId] });
      }
    },
  });
}