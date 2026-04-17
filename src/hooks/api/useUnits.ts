import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Unit, UnitCreateInput, UnitUpdateInput } from '@/types/api';

const getOrgId = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('rento_current_org');
  }
  return null;
};

export const useUnits = (buildingId?: string) => {
  const orgId = getOrgId();
  if (!orgId) {
    return {
      data: [],
      isLoading: false,
      error: null,
    };
  }

  return useQuery({
    queryKey: ['units', orgId, buildingId],
    queryFn: async () => {
      const query = buildingId ? `?building_id=${buildingId}` : '';
      return api.get(`/units${query}`) as Promise<Unit[]>;
    },
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useUnit = (id: string) => {
  const orgId = getOrgId();
  if (!orgId || !id) {
    return {
      data: undefined,
      isLoading: false,
      error: null,
    };
  }

  return useQuery({
    queryKey: ['units', orgId, id],
    queryFn: async () => {
      return api.get(`/units/${id}`) as Promise<Unit>;
    },
    enabled: !!orgId && !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UnitCreateInput) => {
      const orgId = getOrgId();
      if (!orgId) throw new Error('No organization selected');
      return api.post('/units', input);
    },
    onSuccess: () => {
      const orgId = getOrgId();
      if (orgId) {
        queryClient.invalidateQueries({ queryKey: ['units', orgId] });
        queryClient.invalidateQueries({ queryKey: ['dashboard', orgId] });
      }
    },
  });
};

export const useUpdateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UnitUpdateInput }) => {
      const orgId = getOrgId();
      if (!orgId) throw new Error('No organization selected');
      return api.put(`/units/${id}`, data);
    },
    onSuccess: () => {
      const orgId = getOrgId();
      if (orgId) {
        queryClient.invalidateQueries({ queryKey: ['units', orgId] });
        queryClient.invalidateQueries({ queryKey: ['dashboard', orgId] });
      }
    },
  });
};

export const useDeleteUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const orgId = getOrgId();
      if (!orgId) throw new Error('No organization selected');
      return api.delete(`/units/${id}`);
    },
    onSuccess: () => {
      const orgId = getOrgId();
      if (orgId) {
        queryClient.invalidateQueries({ queryKey: ['units', orgId] });
        queryClient.invalidateQueries({ queryKey: ['dashboard', orgId] });
      }
    },
  });
};