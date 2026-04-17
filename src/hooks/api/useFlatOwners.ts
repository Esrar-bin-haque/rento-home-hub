import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { FlatOwner, FlatOwnerCreateInput, FlatOwnerUpdateInput } from '@/types/api';
import { toast } from 'sonner';

export function useFlatOwners(orgId: string | null) {
  return useQuery({
    queryKey: ['flat-owners', orgId],
    queryFn: () => api.get('/flat-owners'),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useFlatOwner(orgId: string | null, id: string | null) {
  return useQuery({
    queryKey: ['flat-owners', orgId, id],
    queryFn: () => api.get(`/flat-owners/${id}`),
    enabled: !!(orgId && id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateFlatOwner(orgId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FlatOwnerCreateInput) => api.post('/flat-owners', data),
    onError: (error) => { toast.error(error.message || 'An error occurred'); },
    onSuccess: () => {
      if (orgId) {
        queryClient.invalidateQueries({ queryKey: ['flat-owners', orgId] });
      }
    },
  });
}

export function useUpdateFlatOwner(orgId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FlatOwnerUpdateInput }) =>
      api.put(`/flat-owners/${id}`, data),
    onError: (error) => { toast.error(error.message || 'An error occurred'); },
    onSuccess: () => {
      if (orgId) {
        queryClient.invalidateQueries({ queryKey: ['flat-owners', orgId] });
      }
    },
  });
}

export function useDeleteFlatOwner(orgId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/flat-owners/${id}`),
    onError: (error) => { toast.error(error.message || 'An error occurred'); },
    onSuccess: () => {
      if (orgId) {
        queryClient.invalidateQueries({ queryKey: ['flat-owners', orgId] });
      }
    },
  });
}