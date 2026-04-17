import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Org } from '@/types/api';

export interface OrgCreateInput {
  name: string;
  slug?: string;
}

export function useMyOrgs() {
  return useQuery({
    queryKey: ['orgs'],
    queryFn: () => api.get('/orgs/mine'),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateOrg() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OrgCreateInput) => api.post('/orgs', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orgs'] });
    },
  });
}