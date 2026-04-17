import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Building, BuildingCreateInput, BuildingUpdateInput } from '@/types/api';
import { toast } from 'sonner';

export function useBuildings(orgId: string | null) {
  return useQuery({
    queryKey: ['buildings', orgId],
    queryFn: () => api.get('/buildings'),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useBuilding(orgId: string | null, id: string | null) {
  return useQuery({
    queryKey: ['buildings', orgId, id],
    queryFn: () => api.get(`/buildings/${id}`),
    enabled: !!(orgId && id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateBuilding(orgId: string | null) {
  const queryClient = useQueryClient();

return useMutation({
    mutationFn: (data: BuildingCreateInput) => api.post('/buildings', data),
    onError: (error) => { toast.error(error.message || 'An error occurred'); },
    onSuccess: () => {
      if (orgId) {
        queryClient.invalidateQueries({ queryKey: ['buildings', orgId] });
        queryClient.invalidateQueries({ queryKey: ['dashboard', orgId] });
      }
    },
  });
}

export function useUpdateBuilding(orgId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BuildingUpdateInput }) =>
      api.put(`/buildings/${id}`, data),
    onError: (error) => { toast.error(error.message || 'An error occurred'); },
    onSuccess: () => {
      if (orgId) {
        queryClient.invalidateQueries({ queryKey: ['buildings', orgId] });
      }
    },
  });
}

export function useDeleteBuilding(orgId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/buildings/${id}`),
    onError: (error) => { toast.error(error.message || 'An error occurred'); },
    onSuccess: () => {
      if (orgId) {
        queryClient.invalidateQueries({ queryKey: ['buildings', orgId] });
      }
    },
  });
}