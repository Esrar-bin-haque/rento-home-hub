import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Tenant, TenantCreateInput, TenantUpdateInput } from '@/types/api';
import { toast } from 'sonner';

export function useTenants(orgId: string | null) {
  return useQuery({
    queryKey: ['tenants', orgId],
    queryFn: () => api.get('/tenants'),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useTenant(id: string | null, orgId: string | null) {
  return useQuery({
    queryKey: ['tenants', orgId, id],
    queryFn: () => api.get(`/tenants/${id}`),
    enabled: !!(orgId && id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateTenant() {
  const queryClient = useQueryClient();
  const orgId = api.getOrgId();

  return useMutation({
    mutationFn: (data: TenantCreateInput) => api.post('/tenants', data),
    onError: (error) => { toast.error(error.message || 'An error occurred'); },
    onSuccess: () => {
      if (orgId) {
        queryClient.invalidateQueries({ queryKey: ['tenants', orgId] });
        queryClient.invalidateQueries({ queryKey: ['dashboard', orgId] });
      }
    },
  });
}

export function useUpdateTenant() {
  const queryClient = useQueryClient();
  const orgId = api.getOrgId();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TenantUpdateInput }) =>
      api.put(`/tenants/${id}`, data),
    onError: (error) => { toast.error(error.message || 'An error occurred'); },
    onSuccess: () => {
      if (orgId) {
        queryClient.invalidateQueries({ queryKey: ['tenants', orgId] });
        queryClient.invalidateQueries({ queryKey: ['dashboard', orgId] });
      }
    },
  });
}

export function useDeleteTenant() {
  const queryClient = useQueryClient();
  const orgId = api.getOrgId();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/tenants/${id}`),
    onError: (error) => { toast.error(error.message || 'An error occurred'); },
    onSuccess: () => {
      if (orgId) {
        queryClient.invalidateQueries({ queryKey: ['tenants', orgId] });
        queryClient.invalidateQueries({ queryKey: ['dashboard', orgId] });
      }
    },
  });
}